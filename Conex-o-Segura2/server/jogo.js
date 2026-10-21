// Regras do jogo Conexao Segura (antigo servidor.py), agora em Node.js + PostgreSQL.
// Usado pela funcao serverless api/jogo.js.

const RECOMPENSAS = {1: 10, 2: 15, 3: 20, 4: 25, 5: 30};

class ErroDados extends Error {
  constructor(mensagem, status = 400) { super(mensagem); this.status = status; }
}

function inteiro(valor, campo, minimo = 1, maximo = 1000000000) {
  if (!Number.isInteger(valor) || valor < minimo || valor > maximo) {
    throw new ErroDados(`${campo} deve ser um numero inteiro valido.`);
  }
  return valor;
}

async function one(db, sql, params = []) {
  const r = await db.query(sql, params);
  return r.rows[0] || null;
}

async function encontrarJogador(db, jogadorId) {
  jogadorId = inteiro(jogadorId, 'jogador_id');
  const linha = await one(db, 'SELECT * FROM jogadores WHERE id = $1', [jogadorId]);
  if (!linha) throw new ErroDados('Jogador nao encontrado.', 404);
  return linha;
}

async function encontrarPartida(db, jogadorId, partidaId, tipo) {
  inteiro(partidaId, 'partida_id');
  const partida = await one(db,
    'SELECT id, resultado FROM partidas WHERE id = $1 AND jogador_id = $2 AND tipo = $3',
    [partidaId, jogadorId, tipo]);
  if (!partida) throw new ErroDados('Partida nao encontrada para este jogador.');
  return partida;
}

async function carteira(db, jogadorId) {
  const saldo = await one(db, 'SELECT saldo FROM carteiras WHERE jogador_id = $1', [jogadorId]);
  const itens = (await db.query(`
    SELECT i.item_id, i.equipado, l.categoria
    FROM inventario i JOIN itens_loja l ON l.id = i.item_id
    WHERE i.jogador_id = $1 ORDER BY i.comprado_em, i.item_id`, [jogadorId])).rows;
  const resultado = {balance: saldo ? saldo.saldo : 0, owned: itens.map(i => i.item_id),
                     avatar: null, frame: null, emblem: null};
  const chaves = {Avatares: 'avatar', Molduras: 'frame', Emblemas: 'emblem'};
  for (const item of itens) if (item.equipado) resultado[chaves[item.categoria]] = item.item_id;
  return resultado;
}

async function estado(db, jogadorId) {
  const j = await encontrarJogador(db, jogadorId);
  const avatar = ['0', '1', '2', '3'].includes(j.avatar) ? Number(j.avatar) : j.avatar;
  const {melhor} = await one(db, `
    SELECT COALESCE(MAX(r.distancia), 0) AS melhor
    FROM resultados_corrida r JOIN partidas p ON p.id = r.partida_id
    WHERE p.jogador_id = $1`, [j.id]);
  return {jogador: {id: j.id, nickname: j.nickname, avatar},
          carteira: await carteira(db, j.id), recorde: melhor};
}

async function equipar(db, jogadorId, itemId) {
  if (typeof itemId !== 'string') throw new ErroDados('Voce precisa comprar este item primeiro.');
  const item = await one(db, `
    SELECT l.categoria FROM inventario i JOIN itens_loja l ON l.id = i.item_id
    WHERE i.jogador_id = $1 AND i.item_id = $2`, [jogadorId, itemId]);
  if (!item) throw new ErroDados('Voce precisa comprar este item primeiro.');
  await db.query(`
    UPDATE inventario SET equipado = (item_id = $3)
    WHERE jogador_id = $1 AND item_id IN (SELECT id FROM itens_loja WHERE categoria = $2)`,
    [jogadorId, item.categoria, itemId]);
  if (item.categoria === 'Avatares') {
    await db.query('UPDATE jogadores SET avatar = $1, atualizado_em = NOW() WHERE id = $2', [itemId, jogadorId]);
  }
}

async function alterarSaldo(db, jogadorId, valor, tipo, partidaId = null, itemId = null) {
  const r = await db.query(
    'UPDATE carteiras SET saldo = saldo + $1 WHERE jogador_id = $2 AND saldo + $1 >= 0',
    [valor, jogadorId]);
  if (r.rowCount !== 1) throw new ErroDados('Moedas insuficientes.');
  await db.query(`
    INSERT INTO movimentacoes (jogador_id, partida_id, item_id, tipo, valor)
    VALUES ($1, $2, $3, $4, $5)`, [jogadorId, partidaId, itemId, tipo, valor]);
}

async function finalizarPartida(db, resultado, partidaId) {
  await db.query(`
    UPDATE partidas SET resultado = $1, finalizada_em = COALESCE(finalizada_em, NOW())
    WHERE id = $2 AND resultado = 'em_andamento'`, [resultado, partidaId]);
}

// Operacoes que gravam dados. "db" deve estar dentro de uma transacao (BEGIN ... COMMIT).
async function processar(db, rota, dados) {
  if (rota === '/api/jogadores') {
    let nome = dados.nickname ?? '';
    if (typeof nome !== 'string') throw new ErroDados('Nickname invalido.');
    nome = nome.trim();
    if (nome.length < 2 || nome.length > 20) throw new ErroDados('Escolha um nickname de 2 a 20 caracteres.');
    let avatar = 'avatar' in dados ? String(dados.avatar) : '0';
    if (!['0', '1', '2', '3'].includes(avatar) && !/^avatar-[a-z]{1,30}$/.test(avatar)) {
      throw new ErroDados('Avatar invalido.');
    }
    const j = await one(db, 'SELECT id FROM jogadores WHERE LOWER(nickname) = LOWER($1) FOR UPDATE', [nome]);
    let ident;
    if (j) {
      ident = j.id;
      if (avatar.startsWith('avatar-')) {
        await equipar(db, ident, avatar);
      } else {
        await db.query(`
          UPDATE inventario SET equipado = FALSE WHERE jogador_id = $1
          AND item_id IN (SELECT id FROM itens_loja WHERE categoria = 'Avatares')`, [ident]);
        await db.query('UPDATE jogadores SET avatar = $1, atualizado_em = NOW() WHERE id = $2', [avatar, ident]);
      }
    } else {
      // Um avatar comprado pelo perfil anterior nao passa para o novo.
      if (avatar.startsWith('avatar-')) avatar = '0';
      ident = (await one(db, 'INSERT INTO jogadores (nickname, avatar) VALUES ($1, $2) RETURNING id',
                         [nome, avatar])).id;
      await db.query('INSERT INTO carteiras (jogador_id) VALUES ($1)', [ident]);
    }
    return estado(db, ident);
  }

  const jogadorId = inteiro(dados.jogador_id, 'jogador_id');
  await encontrarJogador(db, jogadorId);
  // Trava a carteira do jogador ate o fim da transacao: evita moedas/compras duplicadas
  // quando chegam varias requisicoes ao mesmo tempo.
  await db.query('SELECT 1 FROM carteiras WHERE jogador_id = $1 FOR UPDATE', [jogadorId]);

  if (rota === '/api/partidas') {
    const tipo = dados.tipo;
    if (!['cartas', 'memoria', 'corrida'].includes(tipo)) throw new ErroDados('Tipo de partida invalido.');
    const {id} = await one(db, 'INSERT INTO partidas (jogador_id, tipo) VALUES ($1, $2) RETURNING id',
                           [jogadorId, tipo]);
    return {partida_id: id};
  }

  if (rota === '/api/respostas') {
    const partidaId = inteiro(dados.partida_id, 'partida_id');
    await encontrarPartida(db, jogadorId, partidaId, 'cartas');
    const perguntaId = inteiro(dados.pergunta_id, 'pergunta_id', 1, 50);
    const pergunta = await one(db, 'SELECT * FROM perguntas WHERE id = $1', [perguntaId]);
    if (!pergunta) throw new ErroDados('Pergunta nao encontrada.');
    const escolha = dados.escolha ?? null;
    if (escolha !== null && typeof escolha !== 'boolean') throw new ErroDados('Resposta invalida.');
    const acertou = escolha !== null && escolha === pergunta.segura;
    const anterior = await one(db,
      'SELECT 1 FROM respostas WHERE partida_id = $1 AND pergunta_id = $2 AND acertou',
      [partidaId, perguntaId]);
    const recompensa = acertou && !anterior ? RECOMPENSAS[pergunta.fase] : 0;
    if (!anterior) {
      await db.query(`
        INSERT INTO respostas (partida_id, pergunta_id, escolha, acertou, moedas)
        VALUES ($1, $2, $3, $4, $5)`, [partidaId, perguntaId, escolha, acertou, recompensa]);
      if (recompensa) await alterarSaldo(db, jogadorId, recompensa, 'acerto', partidaId);
    }
    return {acertou, moedas: recompensa, carteira: await carteira(db, jogadorId)};
  }

  if (rota === '/api/moedas') {
    const partidaId = inteiro(dados.partida_id, 'partida_id');
    const p = await encontrarPartida(db, jogadorId, partidaId, 'corrida');
    if (p.resultado !== 'em_andamento') throw new ErroDados('Esta corrida ja terminou.');
    if (dados.quantidade !== 1) throw new ErroDados('Somente uma moeda por coleta e permitida.');
    await alterarSaldo(db, jogadorId, 1, 'corrida', partidaId);
    return {carteira: await carteira(db, jogadorId)};
  }

  if (rota === '/api/compras') {
    const itemId = typeof dados.item_id === 'string' ? dados.item_id : null;
    const item = await one(db, 'SELECT * FROM itens_loja WHERE id = $1', [itemId]);
    if (!item) throw new ErroDados('Item nao encontrado na loja.');
    if (await one(db, 'SELECT 1 FROM inventario WHERE jogador_id = $1 AND item_id = $2', [jogadorId, itemId])) {
      throw new ErroDados('Voce ja tem este item.');
    }
    await alterarSaldo(db, jogadorId, -item.preco, 'compra', null, itemId);
    await db.query('INSERT INTO inventario (jogador_id, item_id) VALUES ($1, $2)', [jogadorId, itemId]);
    await equipar(db, jogadorId, itemId);
    return {carteira: await carteira(db, jogadorId)};
  }

  if (rota === '/api/equipar') {
    await equipar(db, jogadorId, dados.item_id);
    return {carteira: await carteira(db, jogadorId)};
  }

  if (rota === '/api/memoria') {
    const partidaId = inteiro(dados.partida_id, 'partida_id');
    await encontrarPartida(db, jogadorId, partidaId, 'memoria');
    const pares = inteiro(dados.pares, 'pares', 0, 6);
    const jogadas = inteiro(dados.jogadas, 'jogadas', 0);
    const erros = inteiro(dados.erros, 'erros', 0);
    const venceu = dados.venceu === true;
    await db.query(`
      INSERT INTO resultados_memoria (partida_id, pares, jogadas, erros, venceu)
      VALUES ($1, $2, $3, $4, $5) ON CONFLICT (partida_id) DO NOTHING`,
      [partidaId, pares, jogadas, erros, venceu]);
    await finalizarPartida(db, venceu ? 'vitoria' : 'encerrada', partidaId);
    return {salvo: true};
  }

  if (rota === '/api/corrida') {
    const partidaId = inteiro(dados.partida_id, 'partida_id');
    await encontrarPartida(db, jogadorId, partidaId, 'corrida');
    const distancia = inteiro(dados.distancia, 'distancia', 0, 100000);
    const nivel = inteiro(dados.nivel, 'nivel', 1, 100);
    const moedas = inteiro(dados.moedas, 'moedas', 0, 100000);
    const venceu = dados.venceu === true;
    await db.query(`
      INSERT INTO resultados_corrida (partida_id, distancia, nivel, moedas, venceu)
      VALUES ($1, $2, $3, $4, $5) ON CONFLICT (partida_id) DO NOTHING`,
      [partidaId, distancia, nivel, moedas, venceu]);
    await finalizarPartida(db, venceu ? 'vitoria' : 'encerrada', partidaId);
    return {salvo: true, recorde: (await estado(db, jogadorId)).recorde};
  }

  if (rota === '/api/finalizar') {
    const partidaId = inteiro(dados.partida_id, 'partida_id');
    await encontrarPartida(db, jogadorId, partidaId, 'cartas');
    const resultado = dados.resultado;
    if (!['vitoria', 'desistencia', 'derrota'].includes(resultado)) throw new ErroDados('Resultado invalido.');
    await finalizarPartida(db, resultado, partidaId);
    return {salvo: true};
  }

  throw new ErroDados('Rota nao encontrada.', 404);
}

// Operacoes somente de leitura (GET).
async function consultar(db, rota) {
  if (rota === '/api/status') {
    await db.query('SELECT 1');
    return {online: true, banco: 'PostgreSQL'};
  }
  const m = rota.match(/^\/api\/jogadores\/(\d{1,9})$/);
  if (m) return estado(db, Number(m[1]));
  if (rota === '/api/ranking') {
    const {rows} = await db.query(`
      SELECT j.nickname,
        (SELECT COUNT(*) FROM respostas r JOIN partidas p ON p.id = r.partida_id
         WHERE p.jogador_id = j.id AND r.acertou)::int AS acertos,
        (SELECT COALESCE(MAX(c.distancia), 0) FROM resultados_corrida c
         JOIN partidas p ON p.id = c.partida_id WHERE p.jogador_id = j.id) AS recorde
      FROM jogadores j
      ORDER BY acertos DESC, recorde DESC, j.nickname ASC
      LIMIT 10`);
    return {ranking: rows};
  }
  throw new ErroDados('Rota nao encontrada.', 404);
}

module.exports = {processar, consultar, ErroDados};
