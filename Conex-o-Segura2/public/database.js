// Comunicacao entre o jogo e o banco PostgreSQL (Neon) pela API da Vercel (api/jogo.js).
// As operacoes que alteram dados sao executadas na ordem correta.
const Banco = {
  fila: Promise.resolve(),
  recorde: 0,
  url(rota) {
    // "/api/respostas" -> "/api/jogo?rota=respostas"
    return '/api/jogo?rota=' + encodeURIComponent(rota.replace(/^\/api\//, ''));
  },
  async pedir(rota, dados) {
    const opcoes = dados === undefined ? {} : {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    };
    let resposta;
    try { resposta = await fetch(this.url(rota), opcoes); }
    catch { throw new Error('Sem conexao com o servidor. Verifique sua internet.'); }
    let resultado;
    try { resultado = await resposta.json(); }
    catch { throw new Error('O servidor do banco nao respondeu corretamente.'); }
    if (!resposta.ok) {
      const erro = new Error(resultado.erro || 'Nao foi possivel salvar no banco.');
      erro.status = resposta.status;
      throw erro;
    }
    return resultado;
  },
  enfileirar(operacao) {
    const proxima = this.fila.then(operacao);
    this.fila = proxima.catch(() => {}); // Uma falha nao bloqueia as proximas operacoes.
    return proxima;
  },
  aviso(mensagem) {
    let elemento = document.getElementById('databaseError');
    if (!elemento) {
      elemento = document.createElement('div');
      elemento.id = 'databaseError';
      elemento.className = 'database-error';
      elemento.setAttribute('role', 'alert');
      document.body.appendChild(elemento);
    }
    elemento.textContent = mensagem;
    elemento.hidden = false;
  },
  limparAviso() {
    const elemento = document.getElementById('databaseError');
    if (elemento) elemento.hidden = true;
  },
  async carregar() {
    try {
      await this.pedir('/api/status');
      this.limparAviso();
      const id = Number(localStorage.getItem('cs-jogador-id'));
      if (!Number.isInteger(id) || id <= 0) return;
      try {
        aplicarEstado(await this.pedir('/api/jogadores/' + id));
        render();
      } catch (erro) {
        if (erro.status === 404) localStorage.removeItem('cs-jogador-id'); // Perfil nao existe mais.
        else throw erro;
      }
    } catch (erro) {
      // O jogo nao deve fingir que gravou dados quando o banco esta fora do ar.
      this.aviso('Banco de dados indisponivel: ' + erro.message);
    }
  }
};

function aplicarEstado(estado) {
  player = estado.jogador;
  shopWallet = estado.carteira;
  Banco.recorde = estado.recorde || 0;
  selectedAvatar = player.avatar;
  localStorage.setItem('cs-jogador-id', String(player.id));
  updateWallet();
  applyShopEquipment();
}
