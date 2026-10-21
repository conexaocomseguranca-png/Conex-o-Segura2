// Cria as tabelas e insere os dados iniciais no banco (alternativa ao SQL Editor do Neon).
// Uso: DATABASE_URL="postgresql://..." npm run db:setup
const fs = require('fs');
const path = require('path');
const {Client} = require('pg');

(async () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) { console.error('Defina a variavel DATABASE_URL antes de rodar.'); process.exit(1); }
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'banco_postgres.sql'), 'utf8');
  const cliente = new Client({connectionString: url});
  await cliente.connect();
  await cliente.query(sql);
  const {rows} = await cliente.query(
    'SELECT (SELECT COUNT(*) FROM perguntas)::int AS perguntas, (SELECT COUNT(*) FROM itens_loja)::int AS itens');
  console.log(`Banco pronto: ${rows[0].perguntas} perguntas e ${rows[0].itens} itens na loja.`);
  await cliente.end();
})().catch(erro => { console.error('Erro:', erro.message); process.exit(1); });
