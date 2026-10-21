-- =====================================================================
-- CONEXAO SEGURA - BANCO DE DADOS (PostgreSQL)
-- Compativel com Neon, Supabase ou qualquer PostgreSQL 13+.
-- Como usar: cole este arquivo inteiro no SQL Editor do Neon e clique em Run.
-- Pode ser executado mais de uma vez sem duplicar nada.
-- =====================================================================

-- ---------- 1. Jogadores ----------
CREATE TABLE IF NOT EXISTS jogadores (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname      VARCHAR(20) NOT NULL CHECK (char_length(trim(nickname)) BETWEEN 2 AND 20),
    avatar        VARCHAR(40) NOT NULL DEFAULT '0',
    criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Nickname unico sem diferenciar maiusculas/minusculas ("Ana" = "ana").
CREATE UNIQUE INDEX IF NOT EXISTS uq_jogadores_nickname ON jogadores (LOWER(nickname));

-- ---------- 2. Carteiras (saldo de moedas) ----------
CREATE TABLE IF NOT EXISTS carteiras (
    jogador_id INTEGER PRIMARY KEY REFERENCES jogadores(id) ON DELETE CASCADE,
    saldo      INTEGER NOT NULL DEFAULT 0 CHECK (saldo >= 0)
);

-- ---------- 3. Itens da loja ----------
CREATE TABLE IF NOT EXISTS itens_loja (
    id        VARCHAR(40) PRIMARY KEY,
    nome      VARCHAR(60) NOT NULL,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('Avatares', 'Molduras', 'Emblemas')),
    preco     INTEGER NOT NULL CHECK (preco >= 0),
    descricao TEXT,
    imagem    VARCHAR(120)
);

-- ---------- 4. Inventario (itens comprados) ----------
CREATE TABLE IF NOT EXISTS inventario (
    jogador_id  INTEGER NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE,
    item_id     VARCHAR(40) NOT NULL REFERENCES itens_loja(id),
    equipado    BOOLEAN NOT NULL DEFAULT FALSE,
    comprado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (jogador_id, item_id)
);

-- ---------- 5. Perguntas do jogo de cartas ----------
CREATE TABLE IF NOT EXISTS perguntas (
    id        INTEGER PRIMARY KEY,
    fase      SMALLINT NOT NULL CHECK (fase BETWEEN 1 AND 5),
    categoria VARCHAR(40) NOT NULL,
    enunciado TEXT NOT NULL,
    segura    BOOLEAN NOT NULL,
    dica      TEXT NOT NULL
);

-- ---------- 6. Partidas ----------
CREATE TABLE IF NOT EXISTS partidas (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jogador_id    INTEGER NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE,
    tipo          VARCHAR(10) NOT NULL CHECK (tipo IN ('cartas', 'memoria', 'corrida')),
    resultado     VARCHAR(15) NOT NULL DEFAULT 'em_andamento'
                  CHECK (resultado IN ('em_andamento', 'vitoria', 'derrota', 'desistencia', 'encerrada')),
    iniciada_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finalizada_em TIMESTAMPTZ
);

-- ---------- 7. Respostas das cartas ----------
CREATE TABLE IF NOT EXISTS respostas (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    partida_id    INTEGER NOT NULL REFERENCES partidas(id) ON DELETE CASCADE,
    pergunta_id   INTEGER NOT NULL REFERENCES perguntas(id),
    escolha       BOOLEAN,              -- NULL = tempo esgotado
    acertou       BOOLEAN NOT NULL,
    moedas        INTEGER NOT NULL DEFAULT 0 CHECK (moedas >= 0),
    respondida_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Cada pergunta pode premiar somente uma vez por partida.
CREATE UNIQUE INDEX IF NOT EXISTS uq_uma_recompensa_por_pergunta
    ON respostas (partida_id, pergunta_id) WHERE acertou;

-- ---------- 8. Resultados da Memoria Digital ----------
CREATE TABLE IF NOT EXISTS resultados_memoria (
    partida_id INTEGER PRIMARY KEY REFERENCES partidas(id) ON DELETE CASCADE,
    pares      SMALLINT NOT NULL DEFAULT 0 CHECK (pares BETWEEN 0 AND 6),
    jogadas    INTEGER  NOT NULL DEFAULT 0 CHECK (jogadas >= 0),
    erros      INTEGER  NOT NULL DEFAULT 0 CHECK (erros >= 0),
    venceu     BOOLEAN  NOT NULL DEFAULT FALSE
);

-- ---------- 9. Resultados da Corrida da Bolha ----------
CREATE TABLE IF NOT EXISTS resultados_corrida (
    partida_id INTEGER PRIMARY KEY REFERENCES partidas(id) ON DELETE CASCADE,
    distancia  INTEGER  NOT NULL DEFAULT 0 CHECK (distancia >= 0),
    nivel      SMALLINT NOT NULL DEFAULT 1 CHECK (nivel >= 1),
    moedas     INTEGER  NOT NULL DEFAULT 0 CHECK (moedas >= 0),
    venceu     BOOLEAN  NOT NULL DEFAULT FALSE
);

-- ---------- 10. Movimentacoes de moedas (extrato) ----------
CREATE TABLE IF NOT EXISTS movimentacoes (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jogador_id INTEGER NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE,
    partida_id INTEGER REFERENCES partidas(id) ON DELETE SET NULL,
    item_id    VARCHAR(40) REFERENCES itens_loja(id),
    tipo       VARCHAR(10) NOT NULL CHECK (tipo IN ('acerto', 'corrida', 'compra')),
    valor      INTEGER NOT NULL,
    criada_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Indices ----------
CREATE INDEX IF NOT EXISTS idx_partidas_jogador      ON partidas(jogador_id);
CREATE INDEX IF NOT EXISTS idx_respostas_partida     ON respostas(partida_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_jogador ON movimentacoes(jogador_id);
CREATE INDEX IF NOT EXISTS idx_inventario_item       ON inventario(item_id);

-- =====================================================================
-- DADOS INICIAIS
-- =====================================================================

-- 10 itens da loja
INSERT INTO itens_loja (id, nome, categoria, preco, descricao, imagem) VALUES
    ('avatar-fox', 'Raposa Gamer', 'Avatares', 100, 'Esperta, curiosa e pronta para a missão.', 'assets/avatar-raposa.jpg'),
    ('avatar-panda', 'Panda Conectado', 'Avatares', 100, 'Fofura de sobra e muita conexão.', 'assets/avatar-panda.jpg'),
    ('avatar-cat', 'Gato Aventureiro', 'Avatares', 100, 'Um parceiro curioso para cada aventura.', 'assets/avatar-gato.jpg'),
    ('avatar-capybara', 'Capivara de Boa', 'Avatares', 100, 'Tranquila no estilo, ligada na segurança.', 'assets/avatar-capivara.jpg'),
    ('frame-teal', 'Conexão Neon', 'Molduras', 50, 'Um brilho extra para o seu avatar.', NULL),
    ('frame-coral', 'Chama Digital', 'Molduras', 100, 'Uma moldura cheia de energia.', NULL),
    ('frame-gold', 'Agente Dourado', 'Molduras', 150, 'Seu avatar com um toque de ouro.', NULL),
    ('badge-shield', 'Guardião da Rede', 'Emblemas', 80, 'O emblema de quem protege a rede.', NULL),
    ('badge-star', 'Estrela Digital', 'Emblemas', 120, 'Uma estrela para acompanhar seu nome.', NULL),
    ('badge-crown', 'Mestre da Segurança', 'Emblemas', 200, 'Uma conquista digna de um mestre.', NULL)
ON CONFLICT (id) DO NOTHING;

-- 50 perguntas (10 por fase)
INSERT INTO perguntas (id, fase, categoria, enunciado, segura, dica) VALUES
    (1, 1, 'DADOS PESSOAIS', 'Um estranho no jogo online pediu seu nome completo e o endereço da sua casa. Você deve contar?', FALSE, 'Nunca compartilhe dados pessoais com desconhecidos!'),
    (2, 1, 'PESQUISA', 'Sua professora pediu para pesquisar os biomas brasileiros no site da biblioteca da escola. É seguro?', TRUE, 'Sites educativos recomendados são uma boa escolha.'),
    (3, 1, 'SENHA', 'Um colega pede a senha da sua conta para entrar no jogo por você. É seguro contar?', FALSE, 'Sua senha é só sua: não a compartilhe nem com amigos.'),
    (4, 1, 'PEDIR AJUDA', 'Você viu algo na internet que te deixou com medo e contou para seus pais. É seguro?', TRUE, 'Conversar com um adulto de confiança é sempre o melhor caminho.'),
    (5, 1, 'FOTO', 'Uma pessoa desconhecida pede uma foto sua com o uniforme da escola. É seguro enviar?', FALSE, 'O uniforme mostra onde você estuda. Não envie fotos para desconhecidos.'),
    (6, 1, 'TEMPO DE TELA', 'Você combina com seus pais um horário para usar o tablet e faz pausas para brincar. É seguro?', TRUE, 'Pausas e combinados ajudam a usar a tecnologia de forma saudável.'),
    (7, 1, 'COMPUTADOR COMPARTILHADO', 'Depois de usar o computador da biblioteca, você sai da sua conta. É seguro?', TRUE, 'Sempre saia da conta em computadores que outras pessoas usam.'),
    (8, 1, 'ENCONTRO', 'Um amigo que você conheceu só no jogo online quer te encontrar sem seus pais saberem. É seguro?', FALSE, 'Nunca encontre pessoas da internet sem um adulto responsável saber.'),
    (9, 1, 'LINK SUSPEITO', 'Uma janela disse que você ganhou um videogame grátis e pediu para clicar em um link. É seguro?', FALSE, 'Prêmios fáceis e links desconhecidos podem ser golpes!'),
    (10, 1, 'SITE DA ESCOLA', 'Você acessa o endereço oficial da escola para consultar uma atividade. É seguro?', TRUE, 'Confira sempre o endereço do site antes de navegar.'),
    (11, 2, 'COMENTÁRIO', 'Você pensa em escrever um apelido maldoso na foto de um colega. Essa atitude é segura?', FALSE, 'Do outro lado da tela existem pessoas reais. Respeite sempre.'),
    (12, 2, 'CYBERBULLYING', 'Você recebe ofensas, bloqueia a pessoa, guarda o print e conta para um adulto. É seguro?', TRUE, 'Bloquear, guardar provas e pedir ajuda é a atitude certa.'),
    (13, 2, 'COMPARTILHAR', 'Você recebeu um vídeo zoando um colega e pensa em mandar para o grupo da turma. É seguro?', FALSE, 'Espalhar humilhações também machuca. Não compartilhe.'),
    (14, 2, 'LOCALIZAÇÃO', 'Você posta fotos mostrando exatamente onde está agora, em tempo real. É seguro?', FALSE, 'Mostrar onde você está pode ajudar pessoas mal-intencionadas.'),
    (15, 2, 'PERFIL PRIVADO', 'Você deixa seu perfil no modo privado, só para amigos que conhece de verdade. É seguro?', TRUE, 'Perfil privado protege suas fotos e informações.'),
    (16, 2, 'CONVERSA ONLINE', 'Uma pessoa que você só conhece pela internet pede sua localização e endereço. É seguro compartilhar?', FALSE, 'Não envie sua localização ou endereço a desconhecidos.'),
    (17, 2, 'ATIVIDADE', 'Sua professora indica um material no portal oficial da escola. É seguro acessar?', TRUE, 'Materiais indicados no portal oficial da escola são uma escolha confiável.'),
    (18, 2, 'FOTO DE AMIGO', 'Antes de postar uma foto em que seu amigo aparece, você pede permissão a ele. É seguro?', TRUE, 'Sempre peça permissão antes de postar fotos de outras pessoas.'),
    (19, 2, 'NOTÍCIA', 'Você vê uma notícia chocante e compartilha na hora, sem conferir se é verdade. É seguro?', FALSE, 'Antes de compartilhar, confira em fontes confiáveis. Pode ser notícia falsa.'),
    (20, 2, 'DESAFIO VIRAL', 'Um vídeo chama crianças para um desafio que pode machucar. Participar é seguro?', FALSE, 'Desafios que colocam você em risco não valem a pena. Conte a um adulto.'),
    (21, 3, 'PROMOÇÃO', 'Um anúncio promete um presente se você clicar agora em um link desconhecido. É seguro?', FALSE, 'Desconfie de prêmios inesperados e links desconhecidos.'),
    (22, 3, 'MENSAGEM DO BANCO', 'Uma mensagem urgente diz ser do banco e pede para entrar pelo link recebido. É seguro?', FALSE, 'Acesse o banco pelo aplicativo ou endereço oficial, nunca por um link suspeito.'),
    (23, 3, 'DOWNLOAD', 'Para baixar um jogo, você usa a loja oficial do celular com a ajuda de um adulto. É seguro?', TRUE, 'Lojas oficiais e a supervisão de um adulto reduzem os riscos.'),
    (24, 3, 'JOGO PIRATA', 'Um site oferece de graça um jogo que é pago. É só baixar um arquivo. É seguro?', FALSE, 'Arquivos ''grátis'' de jogos pagos costumam esconder vírus.'),
    (25, 3, 'MOEDAS GRÁTIS', 'Um vídeo promete moedas infinitas no jogo se você digitar sua senha num site. É seguro?', FALSE, 'Ninguém dá moedas grátis em troca da sua senha. É golpe!'),
    (26, 3, 'ENDEREÇO DO SITE', 'Antes de digitar seus dados, você confere se o endereço do site é o oficial. É seguro?', TRUE, 'Conferir o endereço ajuda a evitar sites falsos.'),
    (27, 3, 'ANEXO ESTRANHO', 'Chega um e-mail de um desconhecido com o anexo "fotos_engracadas.exe". Abrir é seguro?', FALSE, 'Arquivos .exe de desconhecidos podem instalar vírus.'),
    (28, 3, 'ANTIVÍRUS', 'O computador de casa tem antivírus e as atualizações são instaladas. É seguro?', TRUE, 'Antivírus e atualizações em dia protegem o computador.'),
    (29, 3, 'DÚVIDA', 'Chegou um link estranho no grupo da turma e você pergunta a um adulto antes de abrir. É seguro?', TRUE, 'Na dúvida, pergunte antes de clicar.'),
    (30, 3, 'ALERTA FALSO', 'Um anúncio piscando diz: "Seu celular está com vírus! Clique aqui para limpar". É seguro?', FALSE, 'Alertas assustadores em anúncios são truques para você clicar.'),
    (31, 4, 'VERIFICAÇÃO EM DUAS ETAPAS', 'Você ativa uma segunda etapa de verificação para proteger sua conta. É seguro?', TRUE, 'A verificação em duas etapas ajuda a proteger sua conta.'),
    (32, 4, 'SENHA FRACA', 'Sua senha é "123456" porque é fácil de lembrar. É seguro?', FALSE, 'Senhas óbvias são as primeiras que os invasores testam.'),
    (33, 4, 'SENHA FORTE', 'Você cria uma senha longa, misturando palavras, números e símbolos. É seguro?', TRUE, 'Senhas longas e variadas são muito mais difíceis de descobrir.'),
    (34, 4, 'MESMA SENHA', 'Você usa a mesma senha em todos os jogos e aplicativos. É seguro?', FALSE, 'Se uma senha vazar, todas as suas contas ficam em risco.'),
    (35, 4, 'ATUALIZAÇÃO', 'O celular avisa que há uma atualização oficial do sistema e você instala. É seguro?', TRUE, 'Atualizações oficiais corrigem falhas de segurança.'),
    (36, 4, 'PERMISSÕES', 'Um app de lanterna pede acesso aos seus contatos, câmera e localização. Aceitar tudo é seguro?', FALSE, 'Desconfie de apps que pedem permissões de que não precisam.'),
    (37, 4, 'CÓDIGO POR SMS', 'Alguém diz ser do suporte do jogo e pede o código que chegou por SMS no seu celular. É seguro?', FALSE, 'Códigos de verificação são secretos. Nenhum suporte pede isso.'),
    (38, 4, 'WI-FI PÚBLICO', 'No shopping, você usa o Wi-Fi aberto para entrar na conta do banco dos seus pais. É seguro?', FALSE, 'Redes abertas podem ser espionadas. Evite acessar contas importantes nelas.'),
    (39, 4, 'BLOQUEIO DE TELA', 'Seu celular tem senha de bloqueio de tela. É seguro?', TRUE, 'O bloqueio de tela protege seus dados se o celular for perdido.'),
    (40, 4, 'TESTE DIVERTIDO', 'Um teste pede o nome do seu pet, da sua rua e da sua escola para criar seu "nome de herói". É seguro?', FALSE, 'Essas respostas são usadas para recuperar senhas. Não responda.'),
    (41, 5, 'SITE PARECIDO', 'O site da escola aparece como "escola-oficia1.com", com o número 1 no lugar do L. É seguro digitar sua senha?', FALSE, 'Golpistas trocam letras por números para imitar sites oficiais.'),
    (42, 5, 'AMIGO INVADIDO', 'Seu amigo pede para você clicar num link e "votar nele", mas escreve de um jeito estranho. É seguro?', FALSE, 'Contas de amigos podem ser invadidas. Confirme com ele por outro meio.'),
    (43, 5, 'QR CODE', 'Um papel colado no poste tem um QR Code que promete figurinhas grátis. Escanear é seguro?', FALSE, 'QR Codes desconhecidos podem levar a sites falsos.'),
    (44, 5, 'CÓDIGO INESPERADO', 'Chega um código de verificação que você não pediu. Você troca a senha e avisa um adulto. É seguro?', TRUE, 'Código inesperado pode ser alguém tentando entrar na sua conta. Você agiu certo.'),
    (45, 5, 'PERFIL FALSO', 'Um perfil com foto de famoso e poucos seguidores promete um presente em troca dos seus dados. É seguro?', FALSE, 'Perfis falsos imitam famosos para aplicar golpes.'),
    (46, 5, 'APP OFICIAL', 'O app é da empresa oficial, tem muitas avaliações e está na loja do celular. Instalar com um adulto é seguro?', TRUE, 'Conferir a empresa, as avaliações e a loja oficial é o jeito certo.'),
    (47, 5, 'URGÊNCIA', 'Uma mensagem diz: "Sua conta será apagada em 10 minutos! Confirme sua senha agora". É seguro?', FALSE, 'Pressa é um truque comum de golpistas.'),
    (48, 5, 'CÓPIA DE SEGURANÇA', 'Você e sua família fazem cópias de segurança das fotos importantes. É seguro?', TRUE, 'Backups evitam perder arquivos se algo der errado.'),
    (49, 5, 'CHAMADA DE VÍDEO', 'Numa chamada, um desconhecido pede para você mostrar sua casa e a vista da janela. É seguro?', FALSE, 'Mostrar sua casa ajuda a descobrir onde você mora.'),
    (50, 5, 'DENÚNCIA', 'Você encontra um perfil enganando crianças e usa o botão de denunciar da plataforma. É seguro?', TRUE, 'Denunciar ajuda a proteger você e outras crianças.')
ON CONFLICT (id) DO NOTHING;
