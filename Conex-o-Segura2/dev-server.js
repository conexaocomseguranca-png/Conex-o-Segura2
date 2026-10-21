// Servidor para testar no computador sem a Vercel CLI.
// Uso: DATABASE_URL="postgresql://..." npm run dev   ->   http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = require('./api/jogo');

const PUBLIC = path.join(__dirname, 'public');
const TIPOS = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.svg': 'image/svg+xml'};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/jogo') {
    let corpo = '';
    req.on('data', parte => { corpo += parte; });
    req.on('end', () => {
      req.query = Object.fromEntries(url.searchParams);
      try { req.body = corpo ? JSON.parse(corpo) : undefined; } catch { req.body = corpo; }
      res.status = codigo => { res.statusCode = codigo; return res; };
      res.json = dados => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(dados)); };
      handler(req, res);
    });
    return;
  }
  const arquivo = path.normalize(path.join(PUBLIC, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)));
  if (!arquivo.startsWith(PUBLIC)) { res.statusCode = 403; return res.end(); }
  fs.readFile(arquivo, (erro, dados) => {
    if (erro) { res.statusCode = 404; return res.end('Nao encontrado'); }
    res.setHeader('Content-Type', TIPOS[path.extname(arquivo)] || 'application/octet-stream');
    res.end(dados);
  });
}).listen(process.env.PORT || 3000, () => console.log(`Conexao Segura: http://localhost:${process.env.PORT || 3000}`));
