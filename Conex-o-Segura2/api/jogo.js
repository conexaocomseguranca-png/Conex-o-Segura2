// Funcao serverless da Vercel: /api/jogo?rota=<nome da rota>
// Conecta no PostgreSQL (Neon) pela variavel de ambiente DATABASE_URL.
const {Pool} = require('pg');
const {processar, consultar, ErroDados} = require('../server/jogo');

const ROTAS_POST = new Set(['/api/jogadores', '/api/partidas', '/api/respostas', '/api/moedas',
  '/api/compras', '/api/equipar', '/api/memoria', '/api/corrida', '/api/finalizar']);

let pool;
function conexao() {
  if (!pool) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error('A variavel DATABASE_URL nao foi configurada na Vercel.');
    pool = new Pool({connectionString: url, max: 3, idleTimeoutMillis: 10000});
  }
  return pool;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const rota = '/api/' + String(req.query.rota || '').replace(/^\/+/, '');
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await consultar(conexao(), rota));
    }
    if (req.method !== 'POST') return res.status(405).json({erro: 'Metodo nao permitido.'});
    if (!ROTAS_POST.has(rota)) return res.status(404).json({erro: 'Rota nao encontrada.'});

    let dados = req.body;
    if (typeof dados === 'string') dados = JSON.parse(dados);
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) throw new ErroDados('Envie um objeto JSON.');
    if (JSON.stringify(dados).length > 20000) throw new ErroDados('Tamanho da requisicao invalido.');

    const cliente = await conexao().connect();
    try {
      await cliente.query('BEGIN');
      const resultado = await processar(cliente, rota, dados);
      await cliente.query('COMMIT');
      return res.status(200).json(resultado);
    } catch (erro) {
      await cliente.query('ROLLBACK').catch(() => {});
      throw erro;
    } finally {
      cliente.release();
    }
  } catch (erro) {
    if (erro instanceof ErroDados) return res.status(erro.status).json({erro: erro.message});
    if (erro instanceof SyntaxError) return res.status(400).json({erro: 'JSON invalido.'});
    if (erro.code && erro.code.startsWith('23')) {
      // Violacao de regra do banco (UNIQUE, CHECK, FOREIGN KEY...)
      return res.status(400).json({erro: erro.code === '23505' ? 'Registro duplicado.' : 'Dados invalidos para o banco.'});
    }
    console.error(erro);
    return res.status(500).json({erro: 'Erro no banco: ' + erro.message});
  }
};
