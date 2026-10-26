# 🫧 Conexão Segura

> Jogo educativo de **segurança digital para crianças**: vire as cartas, decida se cada
> situação é **segura** ou **perigosa** e aprenda, jogando, a se proteger na internet.

Projeto acadêmico desenvolvido na **Universidade Cruzeiro do Sul**.

---

## Sobre o projeto

Crianças estão cada vez mais cedo na internet: jogos online, redes sociais, vídeos e
mensagens. O **Conexão Segura** transforma situações do dia a dia digital (um link
suspeito, um estranho pedindo foto, uma senha fraca) em cartas de um jogo. A cada
resposta, o jogador recebe uma **explicação curta do porquê** a atitude é segura ou
perigosa, para que a lição fique além da partida.

O intuito, o público e as decisões que tomamos estão detalhados em
[docs/PROJETO.md](docs/PROJETO.md).

## Como jogar

1. Escolha um avatar e um nickname.
2. Toque no monte para revelar a carta e responda **🛡️ SEGURO** ou **⚠ PERIGOSO**.
3. Acertou? Ganha moedas e vê a explicação. Errou? Perde uma vida, entende o motivo e a
   carta volta para o fim do baralho.
4. Acertos seguidos montam um **combo**: a tela muda de visual a cada nível
   (Em sequência → Pegando fogo 🔥 → Imparável ⚡ → Lendário 👑).
5. Complete as 5 fases e libere a fase bônus.

| Fase | Tema | Tempo por carta | Moedas por acerto |
|------|------|-----------------|-------------------|
| 1 · Primeiros Passos | Dados pessoais, senha, pedir ajuda | livre | 10 |
| 2 · Cidadania Digital | Cyberbullying, privacidade, notícias falsas | livre | 15 |
| 3 · Detetive Digital | Golpes, links, downloads, vírus | 25 s | 20 |
| 4 · Guardião dos Dados | Senhas fortes, 2 etapas, permissões | 20 s | 25 |
| 5 · Mestre da Segurança | Sites falsos, QR Code, perfis falsos | 15 s | 30 |

## Funcionalidades

- **50 cartas** em 5 fases de dificuldade crescente e **7 vidas**
- **Visual inspirado no Duolingo**: botões 3D, cores vivas e a mascote **Bolhinha**,
  que guia a criança e reage a cada resposta
- **Feedback animado**: ícone de acerto/erro sobre a carta e um painel que sobe do
  rodapé explicando o porquê
- **Combo de acertos seguidos** com cores, partículas e sons que evoluem
- **Pensado para crianças autistas**: passos previsíveis, ícone + texto + cor,
  nada piscando e um **Modo calmo** em ⚙️ Ajustes
- **Memória Digital**: jogo da memória com conceitos de segurança
- **Corrida da Bolha**: mini game bônus com 5 níveis de velocidade
- **Loja**: avatares, molduras e emblemas comprados com as moedas do jogo
- **Ranking geral** compartilhado entre todos os jogadores
- **Acessibilidade**: narração das cartas por voz e sons, música, volume e modo
  calmo reunidos em um painel de Ajustes
- **Feito para celular**: os botões de resposta ficam presos no rodapé e a carta
  cabe na tela mesmo em celulares pequenos

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Front-end | HTML, CSS e JavaScript puro (sem frameworks) |
| API | Node.js em função serverless da **Vercel** |
| Banco de dados | **PostgreSQL** hospedado no **Neon** |

Arquitetura, rotas da API e tabelas do banco: [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Estrutura do repositório

```
.
├── README.md                 Este arquivo (apresentação do projeto)
├── docs/
│   ├── PROJETO.md            Intuito, público-alvo e decisões do projeto
│   └── ARQUITETURA.md        Como o sistema funciona por dentro
└── Conex-o-Segura2/          Aplicação publicada pela Vercel
    ├── public/               Jogo (HTML, CSS, JS e imagens)
    ├── api/                  Função serverless (/api/jogo)
    ├── server/               Regras do jogo e consultas SQL
    ├── sql/                  Criação do banco e consultas de demonstração
    ├── scripts/              Setup do banco pelo terminal
    └── LEIA-ME.md            Passo a passo de publicação e testes locais
```

## Executar e publicar

O passo a passo completo (Vercel, Neon e teste no computador) está em
[Conex-o-Segura2/LEIA-ME.md](Conex-o-Segura2/LEIA-ME.md).

> **Vercel:** o projeto usa `Conex-o-Segura2` como *Root Directory*. Tudo o que fica
> fora dessa pasta (como este README e a pasta `docs/`) é só documentação e não
> interfere no deploy.

## Equipe

| Nome | Função |
|------|--------|
| Gustavo Reis | Product Owner |
| Izabella Miranda | Scrum Master |
| Cesar Santiago | Back-End |
| Kauã Soares | Back-End |
| Emanuel Davi | Front-End |
| Guilherme Farias | Front-End |
| Lucas Cabral | Q.A. |

**Orientador:** Prof. João Roberto Ursino da Cruz

---

<sub>CONEXÃO SEGURA © 2026 · Jogue, aprenda, proteja-se ✦</sub>
