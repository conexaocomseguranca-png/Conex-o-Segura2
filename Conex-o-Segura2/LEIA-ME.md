# Conexão Segura: jogo com banco de dados (Vercel + Neon)

Front-end em HTML/CSS/JS puro, API em Node.js (função serverless da Vercel) e
banco **PostgreSQL hospedado no Neon** (plano gratuito). Não precisa de Python.
Todos os jogadores usam o mesmo banco, então o ranking é compartilhado.

```
public/              Jogo (index.html, css, js, assets): o que o navegador recebe
api/jogo.js          API serverless da Vercel (/api/jogo?rota=...)
server/jogo.js       Regras do jogo (antigo servidor.py) com as consultas SQL
sql/banco_postgres.sql  Criação das 10 tabelas + 50 perguntas + 10 itens da loja
sql/CONSULTAS_SQL.sql   SELECTs para demonstrar o banco
scripts/setup-db.js  Executa o banco_postgres.sql pelo terminal (opcional)
dev-server.js        Servidor para testar no computador (opcional)
```

## 1. Publicar na Vercel
1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório e clique em **Deploy**.
   O `vercel.json` já configura tudo (pasta `public` + função `api/jogo.js`).

## 2. Criar o banco gratuito (Neon)
1. No projeto da Vercel: aba **Storage → Create Database → Neon** (plano *Free*).
2. Conecte o banco ao projeto. A Vercel cria sozinha a variável `DATABASE_URL`.
3. Abra o banco no painel do Neon (**Open in Neon**), vá em **SQL Editor**,
   cole o conteúdo de `sql/banco_postgres.sql` e clique em **Run**.
   (Pode rodar de novo sem duplicar nada.)
4. Na Vercel, aba **Deployments → ⋯ → Redeploy**, para a função receber a variável.

Pronto: abra o link do projeto e jogue.

> Também funciona com **Supabase** (é PostgreSQL): rode o mesmo SQL no SQL Editor
> do Supabase e coloque a *connection string* (modo *Transaction pooler*) na
> variável `DATABASE_URL` em **Settings → Environment Variables** da Vercel.

## Ver os dados
No Neon: **Tables** (visualização das tabelas) ou **SQL Editor** com as consultas
de `sql/CONSULTAS_SQL.sql`.

## Testar no computador (opcional)
Precisa do Node.js 18+.
```
npm install
set DATABASE_URL=postgresql://...      (Windows CMD)
export DATABASE_URL="postgresql://..."   (macOS/Linux)
npm run db:setup     # cria as tabelas (se ainda não rodou no SQL Editor)
npm run dev          # abre em http://localhost:3000
```
A connection string fica no painel do Neon, botão **Connect**.
Nunca coloque essa string no código nem no GitHub.
