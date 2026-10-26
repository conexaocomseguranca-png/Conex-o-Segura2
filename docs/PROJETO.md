# Conexão Segura · O projeto

Este documento reúne **por que** o jogo existe, **para quem** ele foi pensado e os
**pontos que consideramos** ao construí-lo.

## 1. O problema

Crianças começam a usar celular, tablet e jogos online cada vez mais cedo. Nesse
ambiente elas encontram situações para as quais nem sempre estão preparadas:

- desconhecidos pedindo fotos, endereço ou localização;
- links de "prêmio grátis", alertas falsos de vírus e sites que imitam os oficiais;
- senhas fracas, repetidas ou compartilhadas com amigos;
- cyberbullying, notícias falsas e desafios virais perigosos.

Falar sobre esses riscos em forma de lista ou palestra costuma não prender a atenção.
A ideia do **Conexão Segura** é ensinar o mesmo conteúdo **dentro de um jogo**.

## 2. O intuito

Fazer a criança **praticar a decisão** ("isso é seguro ou perigoso?") em situações
parecidas com as que ela vive, e **entender o motivo** de cada resposta.

Objetivos de aprendizagem:

1. Reconhecer dados pessoais e não compartilhá-los com desconhecidos.
2. Identificar golpes comuns: links suspeitos, prêmios fáceis, urgência e perfis falsos.
3. Criar e proteger senhas e contas (senha forte, verificação em duas etapas).
4. Agir com respeito e cidadania na internet.
5. Saber que **pedir ajuda a um adulto de confiança** é sempre uma boa escolha.

## 3. Público-alvo

Crianças do ensino fundamental (aprox. 8 a 12 anos), jogando sozinhas ou com
mediação de pais e professores. O jogo também pode ser usado em sala de aula como
atividade de apoio.

## 4. Pontos que consideramos

### Aprendizagem
- **Feedback explicativo em toda resposta.** Acertar ou errar sempre mostra *por que*
  a situação é segura ou perigosa. O jogador lê no seu tempo e só avança quando
  apertar **Próxima carta**.
- **Errar faz parte.** A carta errada volta para o fim do baralho, então o jogador
  revê a situação até acertar. Ao perder as vidas, recomeça só a fase atual.
- **Dificuldade progressiva.** As 5 fases vão do básico (dados pessoais) aos golpes
  bem disfarçados (sites com letras trocadas, QR Codes, perfis falsos), com tempo
  para responder a partir da fase 3.

### Motivação
- **Moedas, loja e ranking** dão um objetivo além de "acertar perguntas".
- **Combo de acertos seguidos.** A cada acerto consecutivo a mesa ganha brilho,
  partículas e sons novos (Em sequência → Pegando fogo → Imparável → Lendário),
  recompensando a atenção sem punir quem erra.
- **Mini games** (Memória Digital e Corrida da Bolha) variam o ritmo.

### Pensado também para crianças autistas
O visual é chamativo, como um jogo, mas foi organizado para ser **previsível e sem
excesso de estímulos**:

- **Um passo de cada vez.** O personagem que a criança escolheu fica acima da carta e diz sempre o
  que fazer agora ("Toque na carta…", "Essa situação é segura ou perigosa?").
- **Mesma estrutura em toda carta.** Barra de progresso, vidas, carta e os dois botões
  ficam sempre no mesmo lugar; o jogo só avança quando a criança aperta **Continuar**.
- **Ícone + texto + cor.** As respostas nunca dependem só da cor: 🛡️ SEGURO e
  ⚠️ PERIGOSO, ✓ para acerto e ✗ para erro.
- **Erro sem punição.** O painel de erro fala "Quase lá!", explica o motivo e a
  personagem incentiva ("Tudo bem errar. Vamos aprender juntos!").
- **Sem luz piscando.** Nenhum efeito pisca a tela inteira; o combo usa um selo que
  desce do topo e brilhos suaves.
- **Modo calmo** (em ⚙️ Ajustes): tira partículas, tremidas, brilhos pulsando e
  personagem pulando, mantendo o jogo igual. Liga sozinho quando o sistema pede para
  reduzir animações.
- **Carta branca com letra grande** e alto contraste para facilitar a leitura.
- Botões grandes (área de toque confortável) e presos no rodapé do celular.

### Acessibilidade
- Narração das cartas e das explicações pela voz do navegador.
- Sons, música, volume, narração e modo calmo reunidos em **⚙️ Ajustes**, e o
  jogo lembra a escolha.
- Layout testado em celular pequeno (360×640), celular comum (375×812) e computador.

### Visual (referência: Duolingo)
- Botões "3D" com degrau que afunda ao apertar, cores chapadas e cantos arredondados.
- A resposta mostra primeiro um ícone animado sobre a carta. Depois, no **centro da
  tela**, uma barra se estica e abre um painel onde o **avatar do jogador explica** a
  resposta: fazendo joinha 👍 quando acerta e com o dedo levantado ☝️ quando erra. A mão
  usa o mesmo tom de pele do avatar escolhido.
- Telas de fim de fase com quadros coloridos (moedas, vidas, melhor combo).

### Privacidade e segurança dos dados
- O jogo pede só **nickname e avatar**. Nenhum dado pessoal (nome real, e-mail,
  idade) é coletado, coerente com o que o próprio jogo ensina.
- A conexão com o banco fica em uma variável de ambiente da Vercel
  (`DATABASE_URL`) e **nunca** vai para o código ou para o GitHub.
- As regras importantes ficam no servidor e no banco: é o servidor que confere se a
  resposta está certa e quantas moedas ela vale, o saldo nunca fica negativo e cada
  pergunta só premia uma vez por partida.

### Tecnologia simples
- Front-end em HTML, CSS e JavaScript puro: roda em qualquer navegador e é fácil
  de estudar e manter.
- Hospedagem gratuita (Vercel + Neon), sem servidor para administrar.

## 5. Próximos passos

- Painel para o professor acompanhar o desempenho da turma.
- Novas cartas e fases com temas atuais (inteligência artificial, golpes por voz).
- Explicações mais longas e com exemplos para cada carta.
- Bônus de moedas pelo combo de acertos (validado pelo servidor).
