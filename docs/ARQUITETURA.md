# Conexão Segura · Arquitetura

## Visão geral

```
 Navegador (public/)                Vercel (api/jogo.js)              Neon
┌────────────────────┐   fetch    ┌───────────────────────┐   SQL   ┌────────────┐
│ index.html         │ ─────────▶ │ função serverless     │ ──────▶ │ PostgreSQL │
│ script.js, *.css   │ ◀───────── │ server/jogo.js        │ ◀────── │ 10 tabelas │
│ (HTML/CSS/JS puro) │    JSON    │ (regras do jogo)      │         └────────────┘
└────────────────────┘            └───────────────────────┘
```

- **Front-end** (`public/`): arquivos estáticos servidos pela Vercel. Desenha as telas,
  anima as cartas e conversa com a API pelo objeto `Banco` (`public/database.js`).
- **API** (`api/jogo.js`): uma única função serverless em `/api/jogo?rota=<nome>`.
  Cada operação de escrita roda dentro de uma transação (`BEGIN`/`COMMIT`).
- **Regras** (`server/jogo.js`): valida os dados, confere respostas, calcula moedas e
  executa as consultas SQL.
- **Banco** (`sql/banco_postgres.sql`): PostgreSQL no Neon, criado por um único script
  que pode ser executado mais de uma vez.

## Front-end

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.html` | Estrutura da página, cabeçalho, modal de cadastro |
| `script.js` | Jogo de cartas (fases, vidas, feedback animado, combo), Corrida da Bolha, créditos e ranking |
| `memory.js` | Memória Digital |
| `shop.js` | Loja, inventário e itens equipados |
| `music.js` | Música de fundo e volume (dentro do painel ⚙️ Ajustes) |
| `database.js` | Comunicação com a API (fila de requisições e avisos de erro) |
| `style.css` | Cores, botões 3D, personagem do jogador e telas (início, lição, resultados) |
| `assets/logo.svg` | Logo do jogo (árvore de circuito), usado no cabeçalho, na tela inicial e no ícone da aba |
| `feedback.css` | Animação de acerto/erro, painel de explicação, combo e Modo calmo |
| `additions.css`, `shop.css`, `fonts.css` | Memória, painel de Ajustes, loja e fontes |

### Fluxo de uma resposta

1. O jogador toca no monte e a carta vira; nas fases 3 a 5 o cronômetro começa.
2. Ao escolher **Seguro** ou **Perigoso**, o front envia `POST /api/respostas`.
3. O servidor compara com a resposta do banco, registra em `respostas` e, se acertou,
   credita as moedas em `carteiras` e no extrato `movimentacoes`.
4. O front mostra o ícone de acerto ou erro sobre a carta, sobe o painel com a
   explicação no centro da tela (com o avatar do jogador fazendo joinha ou com o dedo
   levantado) e atualiza vidas, moedas e combo. O jogo só
   segue quando o jogador aperta **Continuar**.

## Rotas da API

Todas passam por `/api/jogo?rota=<nome>`.

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `jogadores` | Cria ou recupera o jogador pelo nickname |
| POST | `partidas` | Inicia uma partida (`cartas`, `memoria` ou `corrida`) |
| POST | `respostas` | Registra a resposta de uma carta e devolve se acertou |
| POST | `moedas` | Credita uma moeda coletada na Corrida da Bolha |
| POST | `compras` | Compra um item da loja |
| POST | `equipar` | Equipa um item comprado |
| POST | `memoria` | Salva o resultado da Memória Digital |
| POST | `corrida` | Salva o resultado da Corrida da Bolha |
| POST | `finalizar` | Encerra a partida (vitória, derrota ou desistência) |
| GET | `status` | Verifica a conexão com o banco |
| GET | `jogadores/<id>` | Estado do jogador (carteira, inventário, recorde) |
| GET | `ranking` | Ranking geral |

## Banco de dados

| Tabela | Guarda |
|--------|--------|
| `jogadores` | Nickname (único, sem diferenciar maiúsculas) e avatar |
| `carteiras` | Saldo de moedas (nunca negativo) |
| `itens_loja` | Avatares, molduras e emblemas |
| `inventario` | Itens comprados e equipados por jogador |
| `perguntas` | As 50 cartas: fase, categoria, enunciado, resposta e dica |
| `partidas` | Cada partida e o seu resultado |
| `respostas` | Cada resposta das cartas (premia só uma vez por pergunta) |
| `resultados_memoria` | Pares, jogadas e erros da Memória Digital |
| `resultados_corrida` | Distância, nível e moedas da Corrida da Bolha |
| `movimentacoes` | Extrato de moedas: acertos, corrida e compras |

Consultas prontas para demonstrar o banco: `sql/CONSULTAS_SQL.sql`.

## Deploy

- A Vercel usa `Conex-o-Segura2` como *Root Directory*.
- `vercel.json` publica a pasta `public/` e a função `api/jogo.js`.
- A variável `DATABASE_URL` (connection string do Neon) é configurada no painel da
  Vercel.

Passo a passo: [Conex-o-Segura2/LEIA-ME.md](../Conex-o-Segura2/LEIA-ME.md).
