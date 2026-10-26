// CONEXÃO SEGURA — versão HTML + CSS + JavaScript puro

const AVATARS = [
  "assets/avatar-negro.png",
  "assets/avatar-parda.png",
  "assets/avatar-japones.png",
  "assets/avatar-loiro.png"
];
const COIN_IMG = "assets/moeda.png";
// Logo da Universidade Cruzeiro do Sul usado na tela de créditos
const CREDITS_LOGO = "assets/cruzeiro-do-sul-logo-branco.png";   // versão branca para fundo escuro
const CREDITS_STAR = "assets/cruzeiro-do-sul-estrela.png";        // estrela do logo, usada como marca d'água no fundo

const CREDITS = [
  {name:"Guilherme Farias",role:"Front-End"},
  {name:"Emanuel Davi",role:"Front-End"},
  {name:"Cesar Santiago",role:"Back-End"},
  {name:"Gustavo Reis",role:"Product Owner"},
  {name:"Izabella Miranda",role:"Scrum Master"},
  {name:"Lucas Cabral",role:"Q.A."},
  {name:"Kauã Soares",role:"Back-End"}
];
const ADVISOR = {name:"Joao Roberto Ursino Da Cruz",role:"Orientador"};
// Ordem dos cargos na tela de créditos; dentro de cada cargo, ordem alfabética
const ROLE_ORDER = ["Product Owner","Scrum Master","Back-End","Front-End","Q.A."];
function sortedCredits(){
  const rank=role=>{const i=ROLE_ORDER.indexOf(role);return i<0?ROLE_ORDER.length:i;};
  return [...CREDITS].sort((a,b)=>rank(a.role)-rank(b.role)||a.name.localeCompare(b.name,"pt-BR",{sensitivity:"base"}));
}

// ---------------- FASES DO JOGO DE CARTAS ----------------
// Vidas: 3 originais + 4 extras. Vale para as cartas e para a Corrida da Bolha.
const MAX_LIVES = 7;
// Cada fase tem 10 cartas. A dificuldade sobe a cada fase:
// perguntas mais sutis, tempo para responder (a partir da fase 3) e mais moedas por acerto.
const PHASES = [
  {id:1,title:"Primeiros Passos",subtitle:"Comece pelo básico: o que é seguro?",reward:10,time:0},
  {id:2,title:"Cidadania Digital",subtitle:"Cada escolha conta. Qual é a sua?",reward:15,time:0},
  {id:3,title:"Detetive Digital",subtitle:"Olho aberto: nem tudo é o que parece.",reward:20,time:25},
  {id:4,title:"Guardião dos Dados",subtitle:"Proteja suas senhas e sua privacidade.",reward:25,time:20},
  {id:5,title:"Mestre da Segurança",subtitle:"Golpes bem disfarçados. Pense rápido!",reward:30,time:15}
];
const CARDS_PER_PHASE = 10;

const QUESTIONS = [
  // Fase 1 — Primeiros Passos
  {mission:1,category:"DADOS PESSOAIS",question:"Um estranho no jogo online pediu seu nome completo e o endereço da sua casa. Você deve contar?",safe:false,tip:"Nunca compartilhe dados pessoais com desconhecidos!"},
  {mission:1,category:"PESQUISA",question:"Sua professora pediu para pesquisar os biomas brasileiros no site da biblioteca da escola. É seguro?",safe:true,tip:"Sites educativos recomendados são uma boa escolha."},
  {mission:1,category:"SENHA",question:"Um colega pede a senha da sua conta para entrar no jogo por você. É seguro contar?",safe:false,tip:"Sua senha é só sua: não a compartilhe nem com amigos."},
  {mission:1,category:"PEDIR AJUDA",question:"Você viu algo na internet que te deixou com medo e contou para seus pais. É seguro?",safe:true,tip:"Conversar com um adulto de confiança é sempre o melhor caminho."},
  {mission:1,category:"FOTO",question:"Uma pessoa desconhecida pede uma foto sua com o uniforme da escola. É seguro enviar?",safe:false,tip:"O uniforme mostra onde você estuda. Não envie fotos para desconhecidos."},
  {mission:1,category:"TEMPO DE TELA",question:"Você combina com seus pais um horário para usar o tablet e faz pausas para brincar. É seguro?",safe:true,tip:"Pausas e combinados ajudam a usar a tecnologia de forma saudável."},
  {mission:1,category:"COMPUTADOR COMPARTILHADO",question:"Depois de usar o computador da biblioteca, você sai da sua conta. É seguro?",safe:true,tip:"Sempre saia da conta em computadores que outras pessoas usam."},
  {mission:1,category:"ENCONTRO",question:"Um amigo que você conheceu só no jogo online quer te encontrar sem seus pais saberem. É seguro?",safe:false,tip:"Nunca encontre pessoas da internet sem um adulto responsável saber."},
  {mission:1,category:"LINK SUSPEITO",question:"Uma janela disse que você ganhou um videogame grátis e pediu para clicar em um link. É seguro?",safe:false,tip:"Prêmios fáceis e links desconhecidos podem ser golpes!"},
  {mission:1,category:"SITE DA ESCOLA",question:"Você acessa o endereço oficial da escola para consultar uma atividade. É seguro?",safe:true,tip:"Confira sempre o endereço do site antes de navegar."},

  // Fase 2 — Cidadania Digital
  {mission:2,category:"COMENTÁRIO",question:"Você pensa em escrever um apelido maldoso na foto de um colega. Essa atitude é segura?",safe:false,tip:"Do outro lado da tela existem pessoas reais. Respeite sempre."},
  {mission:2,category:"CYBERBULLYING",question:"Você recebe ofensas, bloqueia a pessoa, guarda o print e conta para um adulto. É seguro?",safe:true,tip:"Bloquear, guardar provas e pedir ajuda é a atitude certa."},
  {mission:2,category:"COMPARTILHAR",question:"Você recebeu um vídeo zoando um colega e pensa em mandar para o grupo da turma. É seguro?",safe:false,tip:"Espalhar humilhações também machuca. Não compartilhe."},
  {mission:2,category:"LOCALIZAÇÃO",question:"Você posta fotos mostrando exatamente onde está agora, em tempo real. É seguro?",safe:false,tip:"Mostrar onde você está pode ajudar pessoas mal-intencionadas."},
  {mission:2,category:"PERFIL PRIVADO",question:"Você deixa seu perfil no modo privado, só para amigos que conhece de verdade. É seguro?",safe:true,tip:"Perfil privado protege suas fotos e informações."},
  {mission:2,category:"CONVERSA ONLINE",question:"Uma pessoa que você só conhece pela internet pede sua localização e endereço. É seguro compartilhar?",safe:false,tip:"Não envie sua localização ou endereço a desconhecidos."},
  {mission:2,category:"ATIVIDADE",question:"Sua professora indica um material no portal oficial da escola. É seguro acessar?",safe:true,tip:"Materiais indicados no portal oficial da escola são uma escolha confiável."},
  {mission:2,category:"FOTO DE AMIGO",question:"Antes de postar uma foto em que seu amigo aparece, você pede permissão a ele. É seguro?",safe:true,tip:"Sempre peça permissão antes de postar fotos de outras pessoas."},
  {mission:2,category:"NOTÍCIA",question:"Você vê uma notícia chocante e compartilha na hora, sem conferir se é verdade. É seguro?",safe:false,tip:"Antes de compartilhar, confira em fontes confiáveis. Pode ser notícia falsa."},
  {mission:2,category:"DESAFIO VIRAL",question:"Um vídeo chama crianças para um desafio que pode machucar. Participar é seguro?",safe:false,tip:"Desafios que colocam você em risco não valem a pena. Conte a um adulto."},

  // Fase 3 — Detetive Digital
  {mission:3,category:"PROMOÇÃO",question:"Um anúncio promete um presente se você clicar agora em um link desconhecido. É seguro?",safe:false,tip:"Desconfie de prêmios inesperados e links desconhecidos."},
  {mission:3,category:"MENSAGEM DO BANCO",question:"Uma mensagem urgente diz ser do banco e pede para entrar pelo link recebido. É seguro?",safe:false,tip:"Acesse o banco pelo aplicativo ou endereço oficial, nunca por um link suspeito."},
  {mission:3,category:"DOWNLOAD",question:"Para baixar um jogo, você usa a loja oficial do celular com a ajuda de um adulto. É seguro?",safe:true,tip:"Lojas oficiais e a supervisão de um adulto reduzem os riscos."},
  {mission:3,category:"JOGO PIRATA",question:"Um site oferece de graça um jogo que é pago. É só baixar um arquivo. É seguro?",safe:false,tip:"Arquivos 'grátis' de jogos pagos costumam esconder vírus."},
  {mission:3,category:"MOEDAS GRÁTIS",question:"Um vídeo promete moedas infinitas no jogo se você digitar sua senha num site. É seguro?",safe:false,tip:"Ninguém dá moedas grátis em troca da sua senha. É golpe!"},
  {mission:3,category:"ENDEREÇO DO SITE",question:"Antes de digitar seus dados, você confere se o endereço do site é o oficial. É seguro?",safe:true,tip:"Conferir o endereço ajuda a evitar sites falsos."},
  {mission:3,category:"ANEXO ESTRANHO",question:"Chega um e-mail de um desconhecido com o anexo \"fotos_engracadas.exe\". Abrir é seguro?",safe:false,tip:"Arquivos .exe de desconhecidos podem instalar vírus."},
  {mission:3,category:"ANTIVÍRUS",question:"O computador de casa tem antivírus e as atualizações são instaladas. É seguro?",safe:true,tip:"Antivírus e atualizações em dia protegem o computador."},
  {mission:3,category:"DÚVIDA",question:"Chegou um link estranho no grupo da turma e você pergunta a um adulto antes de abrir. É seguro?",safe:true,tip:"Na dúvida, pergunte antes de clicar."},
  {mission:3,category:"ALERTA FALSO",question:"Um anúncio piscando diz: \"Seu celular está com vírus! Clique aqui para limpar\". É seguro?",safe:false,tip:"Alertas assustadores em anúncios são truques para você clicar."},

  // Fase 4 — Guardião dos Dados
  {mission:4,category:"VERIFICAÇÃO EM DUAS ETAPAS",question:"Você ativa uma segunda etapa de verificação para proteger sua conta. É seguro?",safe:true,tip:"A verificação em duas etapas ajuda a proteger sua conta."},
  {mission:4,category:"SENHA FRACA",question:"Sua senha é \"123456\" porque é fácil de lembrar. É seguro?",safe:false,tip:"Senhas óbvias são as primeiras que os invasores testam."},
  {mission:4,category:"SENHA FORTE",question:"Você cria uma senha longa, misturando palavras, números e símbolos. É seguro?",safe:true,tip:"Senhas longas e variadas são muito mais difíceis de descobrir."},
  {mission:4,category:"MESMA SENHA",question:"Você usa a mesma senha em todos os jogos e aplicativos. É seguro?",safe:false,tip:"Se uma senha vazar, todas as suas contas ficam em risco."},
  {mission:4,category:"ATUALIZAÇÃO",question:"O celular avisa que há uma atualização oficial do sistema e você instala. É seguro?",safe:true,tip:"Atualizações oficiais corrigem falhas de segurança."},
  {mission:4,category:"PERMISSÕES",question:"Um app de lanterna pede acesso aos seus contatos, câmera e localização. Aceitar tudo é seguro?",safe:false,tip:"Desconfie de apps que pedem permissões de que não precisam."},
  {mission:4,category:"CÓDIGO POR SMS",question:"Alguém diz ser do suporte do jogo e pede o código que chegou por SMS no seu celular. É seguro?",safe:false,tip:"Códigos de verificação são secretos. Nenhum suporte pede isso."},
  {mission:4,category:"WI-FI PÚBLICO",question:"No shopping, você usa o Wi-Fi aberto para entrar na conta do banco dos seus pais. É seguro?",safe:false,tip:"Redes abertas podem ser espionadas. Evite acessar contas importantes nelas."},
  {mission:4,category:"BLOQUEIO DE TELA",question:"Seu celular tem senha de bloqueio de tela. É seguro?",safe:true,tip:"O bloqueio de tela protege seus dados se o celular for perdido."},
  {mission:4,category:"TESTE DIVERTIDO",question:"Um teste pede o nome do seu pet, da sua rua e da sua escola para criar seu \"nome de herói\". É seguro?",safe:false,tip:"Essas respostas são usadas para recuperar senhas. Não responda."},

  // Fase 5 — Mestre da Segurança
  {mission:5,category:"SITE PARECIDO",question:"O site da escola aparece como \"escola-oficia1.com\", com o número 1 no lugar do L. É seguro digitar sua senha?",safe:false,tip:"Golpistas trocam letras por números para imitar sites oficiais."},
  {mission:5,category:"AMIGO INVADIDO",question:"Seu amigo pede para você clicar num link e \"votar nele\", mas escreve de um jeito estranho. É seguro?",safe:false,tip:"Contas de amigos podem ser invadidas. Confirme com ele por outro meio."},
  {mission:5,category:"QR CODE",question:"Um papel colado no poste tem um QR Code que promete figurinhas grátis. Escanear é seguro?",safe:false,tip:"QR Codes desconhecidos podem levar a sites falsos."},
  {mission:5,category:"CÓDIGO INESPERADO",question:"Chega um código de verificação que você não pediu. Você troca a senha e avisa um adulto. É seguro?",safe:true,tip:"Código inesperado pode ser alguém tentando entrar na sua conta. Você agiu certo."},
  {mission:5,category:"PERFIL FALSO",question:"Um perfil com foto de famoso e poucos seguidores promete um presente em troca dos seus dados. É seguro?",safe:false,tip:"Perfis falsos imitam famosos para aplicar golpes."},
  {mission:5,category:"APP OFICIAL",question:"O app é da empresa oficial, tem muitas avaliações e está na loja do celular. Instalar com um adulto é seguro?",safe:true,tip:"Conferir a empresa, as avaliações e a loja oficial é o jeito certo."},
  {mission:5,category:"URGÊNCIA",question:"Uma mensagem diz: \"Sua conta será apagada em 10 minutos! Confirme sua senha agora\". É seguro?",safe:false,tip:"Pressa é um truque comum de golpistas."},
  {mission:5,category:"CÓPIA DE SEGURANÇA",question:"Você e sua família fazem cópias de segurança das fotos importantes. É seguro?",safe:true,tip:"Backups evitam perder arquivos se algo der errado."},
  {mission:5,category:"CHAMADA DE VÍDEO",question:"Numa chamada, um desconhecido pede para você mostrar sua casa e a vista da janela. É seguro?",safe:false,tip:"Mostrar sua casa ajuda a descobrir onde você mora."},
  {mission:5,category:"DENÚNCIA",question:"Você encontra um perfil enganando crianças e usa o botão de denunciar da plataforma. É seguro?",safe:true,tip:"Denunciar ajuda a proteger você e outras crianças."}
];

const app = document.getElementById("app");
const modal = document.getElementById("playerModal");
const avatarGrid = document.getElementById("avatarGrid");
const nicknameInput = document.getElementById("nickname");
const nameError = document.getElementById("nameError");
const soundBtn = document.getElementById("soundBtn");
const narrateBtn = document.getElementById("narrateBtn");

const calmBtn = document.getElementById("calmBtn");

let soundOn = localStorage.getItem("cs-sound")!=="off";
let narrateOn = localStorage.getItem("cs-narrate")!=="off";
// Modo calmo: menos movimento, sem partículas e sem brilho piscando.
// Começa ligado se o sistema pede para reduzir animações.
let calmOn = localStorage.getItem("cs-calm") ? localStorage.getItem("cs-calm")==="on" : matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Narração das cartas (voz do navegador) ----------
const speech = window.speechSynthesis || null;
function speak(text){
  if(!narrateOn || !speech || !text)return;
  speech.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="pt-BR"; u.rate=0.95; u.pitch=1.05;
  const v=speech.getVoices().find(v=>/pt[-_]?BR/i.test(v.lang))||speech.getVoices().find(v=>/^pt/i.test(v.lang));
  if(v)u.voice=v;
  speech.speak(u);
}
function stopSpeak(){ if(speech)speech.cancel(); }
function updateNarrateBtn(){ narrateBtn.setAttribute("aria-checked",String(narrateOn)); }
function toggleNarrate(){
  narrateOn=!narrateOn;
  localStorage.setItem("cs-narrate",narrateOn?"on":"off");
  updateNarrateBtn();
  if(!narrateOn)stopSpeak();
}
function updateCalm(){ document.body.classList.toggle("calm",calmOn); calmBtn.setAttribute("aria-checked",String(calmOn)); }
function toggleCalm(){ calmOn=!calmOn; localStorage.setItem("cs-calm",calmOn?"on":"off"); updateCalm(); }
let player = null;
let selectedAvatar = 0;
let pendingAction = null;
let game = initialGame();
let shopCategory="Todos";
let shopInventory=false;
let shopMessage="";
let revealed = false;
let locked = false;
let timer = null;
let cardTimer = null, cardDeadline = 0;
let awaitingNext = false;   // feedback aberto, esperando o jogador apertar "Próxima carta"
let audioCtx = null;

// ---------- Combo de acertos seguidos ----------
// Cada nível de combo muda o visual da mesa, as partículas e os sons.
const COMBO_TIERS = [
  {min:0,name:"",emoji:"😄"},
  {min:2,name:"EM SEQUÊNCIA",emoji:"😎"},
  {min:4,name:"PEGANDO FOGO",emoji:"🔥"},
  {min:6,name:"IMPARÁVEL",emoji:"⚡"},
  {min:9,name:"LENDÁRIO",emoji:"👑"}
];
const COMBO_MAX = COMBO_TIERS[COMBO_TIERS.length-1].min;

function initialGame(){ return {status:"start",mission:1,queue:[],lives:MAX_LIVES,coins:0,completed:0,phaseDone:0,phaseStartCoins:0,streak:0,bestStreak:0,total:QUESTIONS.length,partidaId:null,finalizada:false}; }
function currentPhase(){ return PHASES[game.mission-1]; }
function phaseQueue(n){ return shuffle(QUESTIONS.filter(q=>q.mission===n)); }
function shuffle(items){ return [...items].sort(() => Math.random() - .5); }
async function startGame(){
  if(!player){abrirCadastro('cartas');return;}
  const jogadorId=player.id;
  try{
    // Toda nova tentativa cria uma partida separada no banco.
    finalizarCartas('desistencia');
    const resposta=await Banco.enfileirar(()=>Banco.pedir('/api/partidas',{
      jogador_id:jogadorId,tipo:'cartas'
    }));
    if(player?.id!==jogadorId)return;
    game={...initialGame(),status:"playing",queue:phaseQueue(1),partidaId:resposta.partida_id};
    revealed=false;locked=false;awaitingNext=false;Banco.limparAviso();render();
  }catch(erro){Banco.aviso('Nao foi possivel iniciar a partida: '+erro.message);}
}
function startPhase(n){
  game.mission=n; game.queue=phaseQueue(n); game.phaseDone=0; game.phaseStartCoins=game.coins;
  game.status="playing"; revealed=false; locked=false; awaitingNext=false; render();
}
// Depois de perder todas as vidas, recomeça a fase atual (não o jogo inteiro)
function retryPhase(){
  game.lives=MAX_LIVES; game.coins=game.phaseStartCoins; game.completed-=game.phaseDone; game.streak=0;
  startPhase(game.mission);
}
async function savePlayer(){
  const clean=nicknameInput.value.trim();
  if(clean.length<2 || clean.length>20){nameError.textContent="Escolha um nome de 2 a 20 caracteres.";return;}
  const botao=document.querySelector('#playerForm button[type="submit"]');
  if(botao)botao.disabled=true;
  try{
    const anterior=player?.id;
    const estado=await Banco.enfileirar(()=>Banco.pedir('/api/jogadores',{
      nickname:clean,avatar:selectedAvatar
    }));
    if(anterior && anterior!==estado.jogador.id){
      finalizarCartas('desistencia');registrarMemoria(false);registrarCorrida();
    }
    aplicarEstado(estado);saveWallet();closeModal();Banco.limparAviso();
    if(anterior && anterior!==player.id){
      // Uma troca de perfil nao pode reutilizar a partida de outra pessoa.
      stopMemory();memory=null;cancelAnimationFrame(runnerFrame);runner=createRunner();
      game=initialGame();
    }
    const acao=pendingAction;pendingAction=null;
    if(acao==='cartas')startGame();
    else if(acao==='corrida')openRunner();
    else if(acao==='memoria')openMemory();
    else if(acao==='shop')openShop();
    else if(game.status==='start')startGame();
    else render();
  }catch(erro){nameError.textContent=erro.message;Banco.aviso('Cadastro nao salvo: '+erro.message);}
  finally{if(botao)botao.disabled=false;}
}
function abrirCadastro(acao){pendingAction=acao;openModal();}
function openModal(){
  nicknameInput.value=player?.nickname || "";
  selectedAvatar=ownedAnimalAvatar(shopWallet.avatar)?.id ?? player?.avatar ?? 0;
  renderAvatarChoices();
  nameError.textContent="";
  modal.classList.remove("hidden");
  setTimeout(()=>nicknameInput.focus(),50);
}
function closeModal(){ modal.classList.add("hidden"); }
function renderAvatarChoices(){
  avatarGrid.innerHTML=AVATARS.map((src,i)=>`
    <button type="button" class="avatar-option ${selectedAvatar===i?"selected":""}" data-avatar="${i}">
      <img src="${src}" alt="Avatar ${i+1}">
      ${selectedAvatar===i?'<span class="avatar-check">✓</span>':''}
    </button>`).join("");
  avatarGrid.innerHTML+=SHOP_ITEMS.filter(item=>item.category==="Avatares"&&shopWallet.owned.includes(item.id)).map(item=>`<button type="button" class="avatar-option ${selectedAvatar===item.id?"selected":""}" data-avatar="${item.id}" title="${item.name}"><img src="${item.image}" alt="${item.name}">${selectedAvatar===item.id?'<span class="avatar-check">✓</span>':''}</button>`).join("");
  avatarGrid.querySelectorAll("[data-avatar]").forEach(b=>b.onclick=()=>{selectedAvatar=b.dataset.avatar.startsWith("avatar-")?b.dataset.avatar:Number(b.dataset.avatar);renderAvatarChoices();});
}

function playTone(freq,end,duration,type="sine"){
  if(!soundOn)return;
  try{
    audioCtx=audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    audioCtx.resume();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(end,audioCtx.currentTime+duration);
    g.gain.setValueAtTime(.045,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration+.05);
    o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration+.05);
  }catch(e){}
}
// Quanto maior o combo, mais agudo e mais "cheio" fica o som do acerto
function chirp(correct,tier=0){
  if(!correct){playTone(260,190,.16);return;}
  const f=520*(1+tier*.12);
  playTone(f,f*1.5,.16);
  if(tier>=2)setTimeout(()=>playTone(f*1.25,f*1.9,.14,"triangle"),110);
  if(tier>=4)setTimeout(()=>playTone(f*1.5,f*2.2,.18,"triangle"),220);
}

// Bolhas subindo pela tela; o combo aumenta a quantidade e muda a cor
function burst(tier=0){
  const el=document.createElement("div");el.className="bubble-burst";el.dataset.tier=tier;
  const n=9+tier*5;
  for(let i=0;i<n;i++){
    const size=18+Math.random()*(12+tier*5);
    el.innerHTML+=`<i style="left:${(4+Math.random()*92).toFixed(1)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;animation-delay:${(Math.random()*.25).toFixed(2)}s"></i>`;
  }
  document.body.appendChild(el);setTimeout(()=>el.remove(),1300);
}

function comboTier(streak=game.streak){
  let tier=0;
  COMBO_TIERS.forEach((t,i)=>{if(streak>=t.min)tier=i;});
  return tier;
}
function comboBar(){
  const tier=comboTier(),t=COMBO_TIERS[tier];
  const next=COMBO_TIERS.find(c=>c.min>game.streak);
  const meter=Array.from({length:COMBO_MAX},(_,i)=>`<i class="${i<game.streak?"on":""} ${next&&i===next.min-1?"goal":""}"></i>`).join("");
  const status=tier?`${t.emoji} x${game.streak} <small>${t.name}</small>`:game.streak?`x${game.streak}`:"<small>ACERTE EM SEQUÊNCIA</small>";
  return `<span class="combo-label">COMBO</span><div class="combo-meter">${meter}</div><span class="combo-status">${status}</span>`;
}
function comboEmbers(tier){
  const n=tier>=2?tier*5:0;
  return Array.from({length:n},()=>`<i style="left:${(Math.random()*100).toFixed(1)}%;animation-delay:${(Math.random()*3).toFixed(2)}s;animation-duration:${(2.4+Math.random()*2).toFixed(2)}s"></i>`).join("");
}
// Atualiza o visual do combo sem redesenhar a carta (usado logo após a resposta)
function updateComboUI(effect){
  const screen=document.querySelector(".play-screen");
  if(!screen)return;
  const tier=comboTier();
  screen.dataset.tier=tier;
  const bar=document.getElementById("comboBar");
  if(bar){
    bar.innerHTML=comboBar();
    bar.classList.remove("bump","broken");void bar.offsetWidth;
    if(effect)bar.classList.add(effect);
  }
  const embers=document.getElementById("comboEmbers");
  if(embers&&embers.dataset.tier!==String(tier)){embers.dataset.tier=tier;embers.innerHTML=comboEmbers(tier);}
}
// Subiu de nível no combo: um selo com o nome do nível desce do topo.
// (Sem piscar a tela inteira, para não incomodar quem é sensível a luz.)
function comboLevelUp(tier){
  document.querySelector(".combo-toast")?.remove();
  const t=COMBO_TIERS[tier],el=document.createElement("div");
  el.className="combo-toast";el.dataset.tier=tier;el.setAttribute("aria-hidden","true");
  el.innerHTML=`<span class="combo-toast-emoji">${t.emoji}</span><span><small>NOVO COMBO</small>${t.name}!</span>`;
  document.body.appendChild(el);setTimeout(()=>el.remove(),2300);
}
// Reinicia uma animação CSS em um elemento (ex.: o coração tremendo ao perder vida)
function replay(el,cls){ if(!el)return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
// Número que sobe e some, como "+10" nas moedas ou "-1" nas vidas
function floatText(el,text,kind){
  if(!el)return;
  const f=document.createElement("span");f.className="float-text "+kind;f.textContent=text;
  el.appendChild(f);setTimeout(()=>f.remove(),1100);
}
// Fala da mascote acima da carta: diz sempre qual é o próximo passo
function guideText(){
  const phase=currentPhase();
  if(!revealed)return "Toque na carta para descobrir a situação!";
  return phase.time?`Você tem ${phase.time} segundos. Essa situação é <b>segura</b> ou <b>perigosa</b>?`:"Leia com calma. Essa situação é <b>segura</b> ou <b>perigosa</b>?";
}
function setGuide(mood,html){
  const g=document.getElementById("lessonGuide");
  if(!g)return;
  g.querySelector(".guide-mascot").innerHTML=mascot(mood,mood==="triste"?"wobble":"jump");
  g.querySelector(".speech").innerHTML=html;
}

// ---------- Tempo para responder (fases 3 a 5) ----------
function stopCardTimer(){ clearInterval(cardTimer); cardTimer=null; }
function startCardTimer(){
  stopCardTimer();
  const t=currentPhase().time;
  if(!t)return;
  cardDeadline=performance.now()+t*1000;
  cardTimer=setInterval(updateCardTimer,100);
  updateCardTimer();
}
function updateCardTimer(){
  const t=currentPhase().time, left=Math.max(0,(cardDeadline-performance.now())/1000);
  const el=document.getElementById("cardTimer");
  if(el){
    el.querySelector(".timer-fill").style.width=(left/t*100)+"%";
    el.querySelector(".timer-text").textContent=Math.ceil(left)+"s";
    el.classList.toggle("low",left<=5);
  }
  if(left<=0){ stopCardTimer(); answerCard(null); }
}

// answer: true (seguro), false (perigoso) ou null (tempo esgotado)
async function answerCard(answer){
  if(!revealed || locked || !game.queue.length || !game.partidaId)return;
  locked=true;stopCardTimer();
  const card=game.queue[0],partidaId=game.partidaId,phase=currentPhase();
  try{
    const resultado=await Banco.enfileirar(()=>Banco.pedir('/api/respostas',{
      jogador_id:player.id,partida_id:partidaId,
      pergunta_id:QUESTIONS.indexOf(card)+1,escolha:answer
    }));
    if(game.partidaId!==partidaId || game.status!=='playing')return;
    const correct=resultado.acertou,prevStreak=game.streak;
    shopWallet=resultado.carteira;saveWallet();Banco.limparAviso();
    if(correct){
      game.coins+=resultado.moedas;game.completed++;game.phaseDone++;
      game.streak++;game.bestStreak=Math.max(game.bestStreak,game.streak);
      game.queue.shift();
    }else{
      game.lives=Math.max(0,game.lives-1);game.streak=0;
      game.queue.push(game.queue.shift());
    }
    const tier=comboTier(),tierUp=correct&&tier>comboTier(prevStreak);
    showFeedback(card,correct,answer===null,prevStreak,tierUp,resultado.moedas);
    updateComboUI(correct?"bump":prevStreak>=2?"broken":null);
    chirp(correct,tier);
    if(correct)burst(tier);
    if(tierUp){comboLevelUp(tier);setTimeout(()=>playTone(660,1320,.22,"triangle"),260);}
    // O jogo não avança sozinho: o jogador lê a explicação e aperta "Próxima carta"
    awaitingNext=true;
  }catch(erro){
    locked=false;
    const fb=document.getElementById('feedback');
    if(fb)fb.textContent='Nao foi possivel registrar a resposta. Tente novamente.';
    Banco.aviso('Resposta nao salva: '+erro.message);
  }
}
const FX_ICONS = {
  good:'<circle class="fx-ring" cx="26" cy="26" r="23"/><path class="fx-mark" d="M15 27.5l7.5 7.5L38 19"/>',
  bad:'<circle class="fx-ring" cx="26" cy="26" r="23"/><path class="fx-mark" d="M18 18l16 16"/><path class="fx-mark fx-mark-2" d="M34 18L18 34"/>',
  time:'<circle class="fx-ring" cx="26" cy="26" r="23"/><path class="fx-mark" d="M26 14v13l8 5"/>'
};
// Feedback em duas etapas (no estilo Duolingo):
// 1) o ícone animado aparece em cima da carta (✓, ✗ ou relógio);
// 2) uma barra se estica no rodapé e sobe como um painel com a explicação.
function showFeedback(card,correct,timedOut,prevStreak,tierUp,earned){
  const kind=timedOut?"time":correct?"good":"bad";
  const tier=comboTier(),t=COMBO_TIERS[tier];
  const head=timedOut?"O tempo acabou!":correct?(tier>=2?"Incrível!":"Você acertou!"):"Quase lá!";
  const situation=card.safe?"segura":"perigosa";
  const why=(correct?`Você acertou porque essa situação é <b>${situation}</b>. `
    :timedOut?`Essa situação é <b>${situation}</b>. `
    :`Essa situação é <b>${situation}</b>. `)+escapeHtml(card.tip);
  const chips=[];
  if(correct&&earned)chips.push(`<span class="sheet-chip chip-coin"><img src="${COIN_IMG}" alt=""> +${earned} moedas</span>`);
  if(correct&&game.streak>=2)chips.push(`<span class="sheet-chip chip-streak">${t.emoji} ${game.streak} seguidas${tierUp?` · <b>${t.name}</b>`:""}</span>`);
  if(!correct)chips.push(`<span class="sheet-chip chip-life">♥ -1 vida</span>`);
  if(!correct&&prevStreak>=2)chips.push(`<span class="sheet-chip chip-lost">💔 sequência de ${prevStreak} acabou</span>`);
  const nextLabel=game.lives===0?"VER RESULTADO":game.queue.length===0?"CONCLUIR FASE":"CONTINUAR";
  const mood=correct?(tier>=2?"animada":"feliz"):timedOut?"pensando":"triste";
  const emoji=correct?t.emoji:timedOut?"⏰":"😵";
  const nSparks=correct?8+tier*4:0;
  const sparks=Array.from({length:nSparks},(_,i)=>`<i style="--a:${(360/nSparks*i).toFixed(0)}deg;--d:${(.25+Math.random()*.15).toFixed(2)}s;--r:${70+tier*12+Math.random()*30|0}px"></i>`).join("");

  // 1) Ícone em cima da carta
  const table=document.querySelector(".play-screen .game-table");
  if(table){
    replay(table,correct?"fx-glow":"fx-shake");
    table.insertAdjacentHTML("beforeend",`
      <div class="answer-fx fx-${kind}${tierUp?" fx-tier-up":""}" aria-hidden="true">
        <div class="fx-badge">
          ${correct?'<span class="fx-rays"></span>':""}
          <span class="fx-sparks">${sparks}</span>
          <svg viewBox="0 0 52 52">${FX_ICONS[kind]}</svg>
          <span class="fx-emoji">${emoji}</span>
        </div>
      </div>`);
  }
  // 2) Painel com a explicação
  document.getElementById("answerSheet")?.remove();
  document.body.insertAdjacentHTML("beforeend",`
    <div class="answer-sheet sheet-${kind}" id="answerSheet" data-tier="${correct?tier:0}" role="status" aria-live="polite">
      <div class="sheet-inner">
        <div class="sheet-mascot">${mascot(mood,correct?"jump":"wobble")}</div>
        <div class="sheet-body">
          <span class="sheet-verdict">${card.safe?"🛡️ SITUAÇÃO SEGURA":"⚠ SITUAÇÃO PERIGOSA"}</span>
          <strong class="sheet-title">${head}</strong>
          <p class="sheet-why">${why}</p>
          ${chips.length?`<div class="sheet-chips">${chips.join("")}</div>`:""}
        </div>
        <button class="game-btn sheet-next" id="nextCardBtn">${nextLabel}</button>
      </div>
    </div>`);
  document.getElementById("nextCardBtn").onclick=nextCard;
  // Espaço extra no fim da tela para o painel não cobrir a carta
  const sheet=document.getElementById("answerSheet"),screen=document.querySelector(".play-screen");
  if(screen)screen.style.paddingBottom=(sheet.querySelector(".sheet-inner").offsetHeight+40)+"px";
  // Foco no botão só depois que o painel abriu, para não "pular" a animação
  clearTimeout(timer);
  timer=setTimeout(()=>document.getElementById("nextCardBtn")?.focus({preventScroll:true}),1000);

  // Mascote, vidas, moedas e progresso reagem na hora
  setGuide(mood,correct?"Mandou bem! 🎉":timedOut?"Sem pressa: da próxima vez você consegue.":"Tudo bem errar. Vamos aprender juntos!");
  const lives=document.getElementById("livesCount");
  if(lives)lives.textContent=game.lives;
  if(!correct){replay(document.getElementById("livesChip"),"hit");floatText(document.getElementById("livesChip"),"-1","minus");}
  const coins=document.getElementById("coinCount");
  if(coins)coins.textContent=game.coins;
  if(correct&&earned){replay(document.getElementById("coinChip"),"gain");floatText(document.getElementById("coinChip"),"+"+earned,"plus");}
  const bar=document.getElementById("lessonFill");
  if(bar)bar.style.width=(game.phaseDone/CARDS_PER_PHASE*100)+"%";
  speak(`${head} Essa situação é ${situation}. ${card.tip}`);
  ["safeBtn","dangerBtn"].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=true;});
}
function nextCard(){
  if(!awaitingNext||game.status!=="playing"){awaitingNext=false;return;}
  awaitingNext=false;clearTimeout(timer);stopSpeak();
  if(game.lives===0)game.status='gameover';
  else if(game.queue.length===0)game.status=game.mission<PHASES.length?'phase-complete':'victory';
  revealed=false;locked=false;render();
}

function finalizarCartas(resultado){
  if(!player || !game.partidaId || game.finalizada)return;
  const partidaId=game.partidaId,jogadorId=player.id;
  game.finalizada=true;
  Banco.enfileirar(()=>Banco.pedir('/api/finalizar',{
    jogador_id:jogadorId,partida_id:partidaId,resultado
  })).catch(erro=>Banco.aviso('Erro ao encerrar partida: '+erro.message));
}
function goHome(){
  finalizarCartas(game.status==='victory'?'vitoria':'desistencia');
  registrarMemoria(false);registrarCorrida();
  stopMemory();memory=null;
  cancelAnimationFrame(runnerFrame);runner=createRunner();
  clearTimeout(timer);stopCardTimer();stopSpeak();
  game=initialGame();revealed=false;locked=false;awaitingNext=false;render();
}
function restart(){startGame();}
function updateSoundBtn(){soundBtn.setAttribute("aria-checked",String(soundOn));}
function toggleSound(){soundOn=!soundOn;localStorage.setItem("cs-sound",soundOn?"on":"off");updateSoundBtn();}

function playerAvatar(){
  const animal=ownedAnimalAvatar(shopWallet.avatar);
  if(animal)return animal.image;
  return AVATARS[player?.avatar ?? 0] || AVATARS[0];
}

function render(){
  // Painel de explicação e selo de combo pertencem só à carta atual
  document.getElementById("answerSheet")?.remove();
  document.querySelector(".combo-toast")?.remove();
  document.body.dataset.screen=game.status;
  if(game.status==="start")renderStart();
  else if(game.status==="credits")renderCredits();
  else if(game.status==="shop")renderShop();
  else if(game.status==="memory")renderMemory();
  else if(game.status==="ranking")renderRanking();
  else if(game.status==="playing")renderCards();
  else if(game.status==="phase-complete")renderPhaseComplete();
  else renderEnd();
  updateWallet();applyShopEquipment();
}
function renderStart(){
  const hello=player?`Oi, <b>${escapeHtml(player.nickname)}</b>! Pronto para mais uma missão?`:"Oi! Eu sou a <b>Bolhinha</b>. Vamos aprender a se proteger na internet?";
  app.innerHTML=`
    <section class="start-screen">
      <div class="hero">
        <div class="hero-mascot">${mascot("feliz","idle")}</div>
        <div class="speech speech-hero">${hello}</div>
      </div>
      <div class="start-copy">
        <span class="eyebrow">UMA AVENTURA DE SEGURANÇA DIGITAL</span>
        <h1>Conexão <em>Segura</em></h1>
        <p>Vire as cartas, decida se cada situação é segura ou perigosa e descubra como navegar com segurança.</p>
      </div>
      <button class="game-btn start-cta" id="startBtn">▶ COMEÇAR A JOGAR</button>
      <div class="start-footnote"><span>📚 ${PHASES.length} fases</span><span>🃏 ${CARDS_PER_PHASE} cartas por fase</span><span>♥ ${MAX_LIVES} vidas</span></div>
      <div class="mode-grid">
        <button class="mode-tile tile-blue" id="runnerLink"><span class="tile-icon">🏃</span><span class="tile-name">Corrida da Bolha</span><small>Mini game</small></button>
        <button class="mode-tile tile-purple" id="memoryLink"><span class="tile-icon">🧠</span><span class="tile-name">Memória Digital</span><small>Jogo da memória</small></button>
        <button class="mode-tile tile-gold" id="shopBtn"><span class="tile-icon">🛍️</span><span class="tile-name">Loja</span><small>Troque suas moedas</small></button>
        <button class="mode-tile tile-coral" id="rankingBtn"><span class="tile-icon">🏆</span><span class="tile-name">Ranking</span><small>Melhores jogadores</small></button>
        ${player?`<button class="mode-tile tile-teal" id="switchPlayer"><span class="tile-icon">👤</span><span class="tile-name">Trocar jogador</span><small>${escapeHtml(player.nickname)}</small></button>`:""}
        <button class="mode-tile tile-gray" id="creditsBtn"><span class="tile-icon">⭐</span><span class="tile-name">Créditos</span><small>Quem fez o jogo</small></button>
      </div>
    </section>`;
  document.getElementById("startBtn").onclick=()=>player?startGame():abrirCadastro('cartas');
  document.getElementById("runnerLink").onclick=()=>player?openRunner():abrirCadastro('corrida');
  document.getElementById("memoryLink").onclick=()=>player?openMemory():abrirCadastro('memoria');
  document.getElementById("shopBtn").onclick=()=>player?openShop():abrirCadastro('shop');
  document.getElementById("rankingBtn").onclick=abrirRanking;
  document.getElementById("switchPlayer")?.addEventListener("click",()=>{pendingAction='inicio';openModal();});
  document.getElementById("creditsBtn").onclick=()=>{game.status="credits";render();};
}

async function abrirRanking(){
  game.status='ranking';
  renderRanking();
  try{
    const retorno=await Banco.pedir('/api/ranking');
    if(game.status==='ranking')renderRanking(retorno.ranking);
  }catch(erro){Banco.aviso('Erro ao abrir ranking: '+erro.message);}
}
function renderRanking(lista){
  const linhas=lista?lista.map((r,i)=>`<tr><td>${i+1}º</td><td>${escapeHtml(r.nickname)}</td><td>${r.acertos}</td><td>${r.recorde} m</td></tr>`).join(''):'<tr><td colspan="4">Carregando resultados...</td></tr>';
  app.innerHTML=`<section class="ranking-screen">
    <span class="eyebrow">RESULTADOS GRAVADOS NO BANCO</span>
    <h1>🏆 Ranking de jogadores</h1>
    <p>Respostas corretas acumuladas e recorde da Corrida da Bolha.</p>
    <div class="ranking-table-wrap"><table class="ranking-table">
      <thead><tr><th>#</th><th>Jogador</th><th>Acertos</th><th>Corrida</th></tr></thead>
      <tbody>${lista?.length?linhas:lista?'<tr><td colspan="4">Nenhuma partida registrada ainda.</td></tr>':linhas}</tbody>
    </table></div>
    <button class="game-btn" id="rankingBack">← Voltar ao início</button>
  </section>`;
  document.getElementById('rankingBack').onclick=goHome;
}
function initials(name){const p=name.trim().split(/\s+/);return (p[0][0]+(p.length>1?p[p.length-1][0]:"")).toUpperCase();}
function creditCard(c,i){
  return `<li class="credit-card" style="animation-delay:${i*60}ms">
    <span class="credit-initials">${escapeHtml(initials(c.name))}</span>
    <span class="credit-info"><strong>${escapeHtml(c.name)}</strong><span class="credit-role">${escapeHtml(c.role)}</span></span>
  </li>`;
}
function renderCredits(){
  app.innerHTML=`
    <div class="credits-bg" aria-hidden="true">
      <img class="credits-star credits-star-big" src="${CREDITS_STAR}" alt="">
      <img class="credits-star credits-star-small" src="${CREDITS_STAR}" alt="">
    </div>
    <section class="credits-screen">
      <img class="credits-logo" src="${CREDITS_LOGO}" alt="Universidade Cruzeiro do Sul">
      <h1>Créditos</h1>
      <p class="credits-lead">A equipe que criou o jogo.</p>
      <div class="credits-advisor">
        <span class="credit-initials">${escapeHtml(initials(ADVISOR.name))}</span>
        <span class="credit-info"><span class="credit-role">${escapeHtml(ADVISOR.role)}</span><strong>${escapeHtml(ADVISOR.name)}</strong></span>
      </div>
      <ul class="credits-grid">${sortedCredits().map(creditCard).join("")}</ul>
      <button class="game-btn credits-back" id="creditsBack">← Voltar ao início</button>
    </section>`;
  document.getElementById("creditsBack").onclick=goHome;
}

function difficultyDots(n){
  return Array.from({length:PHASES.length},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("");
}
function renderCards(){
  const card=game.queue[0];
  if(!card)return;
  const phase=currentPhase();
  const sizeClass=card.question.length>125?"xlong":card.question.length>100?"long":"";
  const tier=comboTier();
  const left=CARDS_PER_PHASE-game.phaseDone;
  app.innerHTML=`
    <section class="play-screen" data-tier="${tier}">
      <div class="combo-vignette" aria-hidden="true"></div>
      <div class="lesson-top">
        <button class="icon-btn lesson-close" id="quitLesson" title="Sair da fase" aria-label="Sair da fase">✕</button>
        <div class="lesson-progress" role="progressbar" aria-label="Cartas concluídas" aria-valuemin="0" aria-valuemax="${CARDS_PER_PHASE}" aria-valuenow="${game.phaseDone}">
          <div class="lesson-fill" id="lessonFill" style="width:${game.phaseDone/CARDS_PER_PHASE*100}%"></div>
        </div>
        <span class="stat-chip lives-chip" id="livesChip" title="Vidas"><span class="chip-icon">♥</span><strong id="livesCount">${game.lives}</strong></span>
      </div>
      <div class="lesson-head">
        <div class="lesson-title">
          <span class="lesson-phase">FASE ${phase.id} DE ${PHASES.length} · ${left} ${left===1?"CARTA":"CARTAS"}</span>
          <h1>${phase.title}</h1>
        </div>
        <span class="stat-chip coin-chip" id="coinChip" title="Moedas"><img src="${COIN_IMG}" alt=""><strong id="coinCount">${game.coins}</strong></span>
        <div class="avatar-picker">
          <span class="player-tag">${escapeHtml(player?.nickname||"Jogador")}</span>
          <img src="${playerAvatar()}" alt="">
          <button class="icon-btn" id="editPlayer" title="Trocar jogador" aria-label="Trocar jogador">↻</button>
        </div>
      </div>
      <div class="combo-bar" id="comboBar">${comboBar()}</div>

      <div class="lesson-guide" id="lessonGuide">
        <div class="guide-mascot">${mascot(revealed?"pensando":"feliz")}</div>
        <div class="speech">${guideText()}</div>
      </div>

      <div class="game-table">
        <div class="combo-embers" id="comboEmbers" data-tier="${tier}" aria-hidden="true">${comboEmbers(tier)}</div>
        <div class="deck-stage">
          <div class="deck-under deck-under-two"></div><div class="deck-under deck-under-one"></div>
          <button class="question-card ${revealed?"flipped":""}" id="questionCard" ${revealed?"disabled":""} aria-label="${revealed?"Carta revelada":"Virar a carta"}">
            <span class="card-flipper">
              <span class="card-face card-back">
                <span class="card-corner">CS <span>✦</span></span>
                <span class="card-emblem">🛡️</span>
                <span class="card-back-title">CONEXÃO<br>SEGURA</span>
                <span class="card-back-bottom">👆 TOQUE PARA VIRAR</span>
              </span>
              <span class="card-face card-front">
                <span class="card-front-top"><span>${card.category}</span><span>FASE ${phase.id}</span></span>
                <span class="card-question-icon">?</span>
                <span class="card-question ${sizeClass}">${card.question}</span>
                <span class="card-front-bottom">SEGURO OU PERIGOSO?</span>
              </span>
            </span>
          </button>
        </div>
      </div>

      <div class="answer-area">
        ${phase.time?`<div class="card-timer ${revealed?"":"idle"}" id="cardTimer"><span class="timer-icon" aria-hidden="true">⏱</span><div class="timer-track"><div class="timer-fill"></div></div><span class="timer-text">${phase.time}s</span></div>`:""}
        <div id="feedback" class="feedback-line" role="status"></div>
        <div class="answer-actions">
          <button class="answer-btn safe" id="safeBtn" ${revealed?"":"disabled"}><span class="answer-icon">🛡️</span><span>SEGURO</span></button>
          <button class="answer-btn danger" id="dangerBtn" ${revealed?"":"disabled"}><span class="answer-icon">⚠️</span><span>PERIGOSO</span></button>
        </div>
      </div>
    </section>`;
  document.getElementById("questionCard").onclick=()=>{
    revealed=true;
    document.getElementById("questionCard").classList.add("flipped");
    document.getElementById("questionCard").disabled=true;
    document.getElementById("questionCard").setAttribute("aria-label","Carta revelada");
    ["safeBtn","dangerBtn"].forEach(id=>document.getElementById(id).disabled=false);
    document.getElementById("cardTimer")?.classList.remove("idle");
    setGuide("pensando",guideText());
    startCardTimer();speak(card.category+". "+card.question);
  };
  document.getElementById("safeBtn").onclick=()=>answerCard(true);
  document.getElementById("dangerBtn").onclick=()=>answerCard(false);
  document.getElementById("editPlayer").onclick=openModal;
  document.getElementById("quitLesson").onclick=goHome;
}

// Quadros coloridos de resultado (moedas, vidas, combo), como no fim de lição do Duolingo
function resultCards(items){
  return `<div class="result-cards">${items.map(([cls,label,value])=>`<div class="result-card ${cls}"><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>`;
}
function renderPhaseComplete(){
  const done=currentPhase(), next=PHASES[game.mission];
  const harder=[];
  if(next.time)harder.push(`⏱ ${next.time} segundos por carta`);
  harder.push(`<img class="inline-coin" src="${COIN_IMG}" alt=""> ${next.reward} moedas por acerto`);
  app.innerHTML=`
    <section class="end-screen">
      <div class="result-mascot">${mascot("animada","jump")}</div>
      <span class="eyebrow">FASE ${done.id} CONCLUÍDA</span>
      <h1>${done.title} <em>completa!</em></h1>
      ${resultCards([
        ["card-gold","MOEDAS",`<img src="${COIN_IMG}" alt=""> ${game.coins}`],
        ["card-coral","VIDAS",`♥ ${game.lives}`],
        ["card-purple","MELHOR COMBO",`🔥 ${game.bestStreak}`]
      ])}
      <div class="next-phase">
        <span class="next-phase-label">PRÓXIMA FASE</span>
        <strong>${next.title}</strong>
        <span class="difficulty" aria-label="Dificuldade ${next.id} de ${PHASES.length}">${difficultyDots(next.id)}</span>
        <span class="next-phase-info">${harder.join(" · ")}</span>
      </div>
      <button class="game-btn" id="nextPhaseBtn">COMEÇAR FASE ${next.id}</button>
      <button class="game-btn end-back" id="homeEnd">Voltar ao início</button>
    </section>`;
  document.getElementById("nextPhaseBtn").onclick=()=>startPhase(next.id);
  document.getElementById("homeEnd").onclick=goHome;
  burst(2);
}

function renderEnd(){
  const victory=game.status==="victory";
  if(victory)finalizarCartas('vitoria');
  app.innerHTML=`
    <section class="end-screen">
      <div class="result-mascot">${mascot(victory?"animada":"pensando",victory?"jump":"idle")}</div>
      <span class="eyebrow">${victory?"TODAS AS FASES CONCLUÍDAS":"FIM DE JOGO · FASE "+game.mission}</span>
      <h1>${victory?"Você mandou <em>bem!</em>":"Não desista, <em>"+escapeHtml(player?.nickname||"agente")+"!</em>"}</h1>
      <p>${victory?`Você completou as ${PHASES.length} fases e agora sabe se proteger na internet. Que tal a fase bônus?`:"Suas vidas acabaram, mas cada erro ensinou algo novo. Tente esta fase de novo com as vidas cheias!"}</p>
      ${resultCards([
        ["card-gold","MOEDAS",`<img src="${COIN_IMG}" alt=""> ${game.coins}`],
        ["card-teal","CARTAS",`✓ ${game.completed}/${game.total}`],
        ["card-purple","MELHOR COMBO",`🔥 ${game.bestStreak}`]
      ])}
      ${victory?'<button class="game-btn" id="runnerFromEnd">FASE BÔNUS: CORRIDA DA BOLHA</button>':'<button class="game-btn" id="retryBtn">TENTAR A FASE DE NOVO</button>'}
      ${victory?'<button class="game-btn end-back" id="retryBtn">Jogar as cartas de novo</button>':''}
      <button class="game-btn end-back" id="homeEnd">Voltar ao início</button>
    </section>`;
  if(victory){document.getElementById("runnerFromEnd").onclick=openRunner;burst(4);}
  document.getElementById("retryBtn").onclick=victory?restart:retryPhase;
  document.getElementById("homeEnd").onclick=goHome;
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

// ---------------- CORRIDA DA BOLHA ----------------
const WORLD={width:900,height:420,ground:70,playerX:150,playerW:48,playerH:74};
const GOAL=5000,TOTAL_LIVES=MAX_LIVES;
// Dificuldade progressiva: a corrida é dividida em 5 níveis de 1000 m.
// Velocidade, frequência de obstáculos e obstáculos em dupla crescem com a distância.
const LEVEL_SIZE=1000,MAX_LEVEL=Math.ceil(GOAL/LEVEL_SIZE);
const SPEED_START=360,SPEED_END=900;               // px/s no começo e no fim da corrida
const GAP_START=[1.10,0.50],GAP_END=[0.90,0.25];   // intervalo entre obstáculos em segundos: [mínimo, variação]
function runnerProgress(){return Math.min(1,runner.distance/GOAL)}
function runnerLevel(){return Math.min(MAX_LEVEL,Math.floor(runner.distance/LEVEL_SIZE)+1)}
function lerp(a,b,t){return a+(b-a)*t}
let runner=createRunner();
let runnerFrame=null,runnerLast=0,runnerScale=1,runnerSound=true;

function createRunner(){return {status:"ready",distance:0,coins:0,lives:TOTAL_LIVES,speed:SPEED_START,level:1,playerY:0,playerV:0,invincible:0,obstacles:[],coinsItems:[],nextObstacleIn:520,nextCoinIn:220,nextId:1};}
let iniciandoCorrida=false;
async function runnerStart(){
  if(!player){abrirCadastro('corrida');return;}
  if(iniciandoCorrida)return;
  iniciandoCorrida=true;
  registrarCorrida();
  const jogadorId=player.id;
  try{
    const inicio=await Banco.enfileirar(()=>Banco.pedir('/api/partidas',{
      jogador_id:jogadorId,tipo:'corrida'
    }));
    if(player?.id!==jogadorId)return;
    runner=createRunner();runner.partidaId=inicio.partida_id;
    runner.status='running';runnerLast=performance.now();
    cancelAnimationFrame(runnerFrame);renderRunner();
    runnerFrame=requestAnimationFrame(runnerLoop);
    Banco.limparAviso();
  }catch(erro){Banco.aviso('Nao foi possivel iniciar corrida: '+erro.message);}
  finally{iniciandoCorrida=false;}
}
function runnerJump(){
  if(runner.status==="running" && runner.playerY===0){runner.playerV=950;playTone(560,820,.09,"square");}
}
function runnerStep(dt){
  if(runner.status!=="running")return;
  const prog=runnerProgress();
  const speed=lerp(SPEED_START,SPEED_END,prog),dx=speed*dt;
  runner.distance+=dx/10;runner.speed=speed;
  if(runner.distance>=GOAL){runner.distance=GOAL;runner.status="victory";saveBest();return;}
  const lvl=runnerLevel();
  if(lvl>runner.level){runner.level=lvl;showLevelUp(lvl);}
  runner.playerV-=2600*dt;runner.playerY+=runner.playerV*dt;
  if(runner.playerY<=0){runner.playerY=0;runner.playerV=0}
  runner.obstacles=runner.obstacles.map(o=>({...o,x:o.x-dx})).filter(o=>o.x+o.w>-60);
  runner.coinsItems=runner.coinsItems.map(c=>({...c,x:c.x-dx})).filter(c=>c.x>-60);
  runner.nextObstacleIn-=dx;
  if(runner.nextObstacleIn<=0){
    const make=x=>{const type=Math.random()<.5?"soap":"duck";const size=type==="soap"?{w:64,h:46}:{w:52,h:58};return {id:runner.nextId++,type,x,...size};};
    const first=make(WORLD.width+40);
    runner.obstacles.push(first);
    let extra=0;
    // A partir do nível 3 surgem obstáculos em dupla (passam com um único pulo)
    const pairChance=runner.level>=3?.15+.12*(runner.level-3):0;
    if(Math.random()<pairChance){const second=make(first.x+first.w+28);runner.obstacles.push(second);extra=first.w+28;}
    const gapMin=lerp(GAP_START[0],GAP_END[0],prog),gapVar=lerp(GAP_START[1],GAP_END[1],prog);
    runner.nextObstacleIn=extra+speed*(gapMin+Math.random()*gapVar);
  }
  runner.nextCoinIn-=dx;
  if(runner.nextCoinIn<=0){
    const lanes=[50,118,186],y=lanes[Math.floor(Math.random()*3)];
    runner.coinsItems.push({id:runner.nextId++,x:WORLD.width+40,y});
    runner.nextCoinIn=240+Math.random()*300;
  }
  runner.invincible=Math.max(0,runner.invincible-dt);
  if(runner.invincible<=0){
    for(const o of runner.obstacles){
      const hit=o.x<WORLD.playerX+WORLD.playerW/2 && o.x+o.w>WORLD.playerX-WORLD.playerW/2 && runner.playerY<o.h;
      if(hit){runner.lives--;runner.invincible=1.2;playTone(220,140,.24,"sawtooth");break}
    }
  }
  runner.coinsItems=runner.coinsItems.filter(c=>{
    const near=Math.abs(c.x-WORLD.playerX)<48;
    const reachable=c.y>runner.playerY-22&&c.y<runner.playerY+WORLD.playerH+22;
    if(near&&reachable){runner.coins++;addWalletCoins(1);playTone(880,1180,.1,"triangle");return false} return true;
  });
  if(runner.lives<=0){runner.lives=0;runner.status="gameover";saveBest();}
}
function updateRunnerStage(){
  const stage=document.getElementById("runnerStage");
  if(!stage)return;
  const set=(id,v)=>{const el=document.getElementById(id);if(el&&el.innerHTML!==String(v))el.innerHTML=v;};
  set("runnerDist",Math.floor(runner.distance));
  set("runnerCoins",runner.coins);
  set("runnerHearts",heartsRunner());
  set("runnerLevel",runner.level);
  const bar=document.getElementById("runnerBar");
  if(bar)bar.style.width=(runnerProgress()*100).toFixed(2)+"%";
  const wrap=document.getElementById("runnerWrap");
  if(wrap&&wrap.dataset.level!==String(runner.level))wrap.dataset.level=runner.level;
  const ground=stage.querySelector(".runner-ground");
  if(ground)ground.style.animationDuration=(SPEED_START/runner.speed*.6).toFixed(3)+"s";
  const playerEl=document.getElementById("runnerPlayer");
  if(playerEl){
    playerEl.style.left=WORLD.playerX+"px";
    playerEl.style.bottom=(WORLD.ground+runner.playerY)+"px";
    playerEl.classList.toggle("running",runner.status==="running" && runner.playerY===0);
    playerEl.classList.toggle("hurt",runner.invincible>0);
  }
  // Obstacles
  stage.querySelectorAll(".runner-obstacle").forEach(el=>el.remove());
  runner.obstacles.forEach(o=>{
    stage.insertAdjacentHTML("beforeend",obstacleHtml(o));
  });
  // Coins
  stage.querySelectorAll(".runner-coin").forEach(el=>el.remove());
  runner.coinsItems.forEach(c=>{
    stage.insertAdjacentHTML("beforeend",`<img class="runner-coin" src="${COIN_IMG}" style="left:${c.x-22}px;bottom:${WORLD.ground+c.y-22}px" alt="Moeda">`);
  });
}

function runnerLoop(){
  const now=performance.now(),dt=Math.min((now-runnerLast)/1000,.033);runnerLast=now;runnerStep(dt);
  if(runner.status==='running'){updateRunnerStage();runnerFrame=requestAnimationFrame(runnerLoop);}
  else{registrarCorrida();renderRunner();}
}
function registrarCorrida(){
  if(!player || !runner?.partidaId || runner.enviado)return;
  const dados={jogador_id:player.id,partida_id:runner.partidaId,
    distancia:Math.floor(runner.distance),nivel:runner.level,moedas:runner.coins,
    venceu:runner.status==='victory'};
  runner.enviado=true;
  Banco.enfileirar(()=>Banco.pedir('/api/corrida',dados)).then(r=>{
    Banco.recorde=Math.max(Banco.recorde,r.recorde||0);
  }).catch(erro=>Banco.aviso('Resultado da corrida nao salvo: '+erro.message));
}
function bestScore(){return Banco.recorde;}
function saveBest(){Banco.recorde=Math.max(Banco.recorde,Math.floor(runner.distance));}

function openRunner(){renderRunner();}

function renderRunner(){
  const best=bestScore();
  document.body.dataset.screen="runner";
  app.innerHTML=`
    <section class="runner-screen">
      <div class="play-topline"><span class="mission-label"><span class="mission-dot"></span> FASE BÔNUS · MINI GAME</span><span class="remaining-label">RECORDE: ${best} M</span></div>
      <div class="play-title">
        <div><h1>Corrida da <em>Bolha</em></h1><p>Pule os obstáculos, junte moedas e chegue aos ${GOAL} m.</p></div>
        ${player?`<div class="avatar-picker"><span class="player-tag">${escapeHtml(player.nickname)}</span><img src="${playerAvatar()}"><button class="icon-btn" id="runnerEdit">↻</button></div>`:""}
      </div>
      <div class="stats-row">
        <div class="stat-group"><span class="stat-caption">SUAS VIDAS</span><div class="hearts" id="runnerHearts">${heartsRunner()}</div></div>
        <div class="stat-group coins"><img src="${COIN_IMG}" alt=""><span id="runnerCoins">${runner.coins}</span><small>MOEDAS</small></div>
        <div class="stat-group coins"><small>NÍVEL</small><span id="runnerLevel">${runner.level}</span><small>/ ${MAX_LEVEL}</small></div>
        <div class="stat-group coins"><span id="runnerDist">${Math.floor(runner.distance)}</span><small>M / ${GOAL} M</small></div>
      </div>
      <div class="runner-progress" aria-hidden="true"><div id="runnerBar" style="width:${(runnerProgress()*100).toFixed(2)}%"></div>${Array.from({length:MAX_LEVEL-1},(_,i)=>`<i style="left:${(i+1)/MAX_LEVEL*100}%"></i>`).join("")}</div>
      <div id="runnerWrap" class="runner-stage-wrap" data-level="${runner.level}" style="height:${Math.round(WORLD.height*runnerScale)}px">
        <div id="runnerStage" class="runner-stage" style="width:${WORLD.width}px;height:${WORLD.height}px;transform:scale(${runnerScale})">
          <div class="stage-orb stage-orb-a"></div><div class="stage-orb stage-orb-b"></div>
          <div class="runner-cloud cloud-one"></div><div class="runner-cloud cloud-two"></div><div class="runner-cloud cloud-three"></div>
          <div class="runner-ground"></div>
          <div id="runnerPlayer" class="runner-player ${runner.status==="running"&&runner.playerY===0?"running":""} ${runner.invincible>0?"hurt":""}" style="left:${WORLD.playerX}px;bottom:${WORLD.ground+runner.playerY}px"><img src="${playerAvatar()}"></div>
          ${runner.obstacles.map(o=>obstacleHtml(o)).join("")}
          ${runner.coinsItems.map(c=>`<img class="runner-coin" src="${COIN_IMG}" style="left:${c.x-22}px;bottom:${WORLD.ground+c.y-22}px">`).join("")}
        </div>
        <div id="levelBanner" class="level-banner" aria-live="polite"></div>
        ${runnerOverlay()}
      </div>
      <p class="runner-hint"><span>✦</span> ESPAÇO OU TOQUE PARA PULAR <span>✦</span></p>
    </section>`;
  const wrap=document.getElementById("runnerWrap");
  const updateScale=()=>{runnerScale=wrap.clientWidth/WORLD.width;wrap.style.height=Math.round(WORLD.height*runnerScale)+"px";const stage=document.getElementById("runnerStage");if(stage)stage.style.transform=`scale(${runnerScale})`};
  updateScale();new ResizeObserver(updateScale).observe(wrap);
  wrap.onpointerdown=()=>{if(runner.status==="running")runnerJump()};
  document.getElementById("runnerEdit")?.addEventListener("click",e=>{e.stopPropagation();openModal()});
  document.getElementById("runnerStart")?.addEventListener("click",()=>player?runnerStart():abrirCadastro('corrida'));
  document.getElementById("runnerRetry")?.addEventListener("click",runnerStart);
  document.getElementById("runnerBack")?.addEventListener("click",goHome);
}
function showLevelUp(lvl){
  const b=document.getElementById("levelBanner");
  if(b){b.textContent=`Nível ${lvl} · mais rápido!`;b.classList.remove("show");void b.offsetWidth;b.classList.add("show");}
  playTone(520,1040,.18,"triangle");
}
function heartsRunner(){return Array.from({length:TOTAL_LIVES},(_,i)=>`<span class="${i<runner.lives?"heart-full":"heart-empty"}">♥</span>`).join("")}
function obstacleHtml(o){
  return o.type==="soap"
    ? `<div class="runner-obstacle runner-obstacle-soap" style="left:${o.x}px;bottom:${WORLD.ground}px;width:${o.w}px;height:${o.h}px"><span class="soap-suds">✦</span></div>`
    : `<div class="runner-obstacle runner-obstacle-duck" style="left:${o.x}px;bottom:${WORLD.ground}px;width:${o.w}px;height:${o.h}px"><span class="duck-head"></span><span class="duck-eye"></span><span class="duck-beak"></span><span class="duck-wing"></span></div>`;
}
function runnerOverlay(){
  if(runner.status==="running")return "";
  if(runner.status==="ready")return `<div class="runner-overlay"><span class="eyebrow">FASE BÔNUS · MINI GAME</span><h2>Corrida da <em>Bolha</em></h2><p>Toque na tela ou aperte ESPAÇO para pular. Desvie dos sabonetes e patinhos, colete moedas e chegue aos ${GOAL} m. A cada ${LEVEL_SIZE} m o jogo fica mais rápido!</p><button class="game-btn" id="runnerStart">COMEÇAR ↻</button></div>`;
  if(runner.status==="gameover")return `<div class="runner-overlay"><span class="eyebrow">FIM DE JOGO</span><h2>Espaço <em>apertado!</em></h2><p>Você chegou ao nível ${runner.level}, percorreu ${Math.floor(runner.distance)} m e juntou ${runner.coins} moedas. Recorde: ${bestScore()} m.</p><div class="runner-overlay-actions"><button class="game-btn" id="runnerRetry">TENTAR NOVAMENTE ↻</button><button class="game-btn end-back" id="runnerBack">Voltar às cartas</button></div></div>`;
  return `<div class="runner-overlay"><div class="end-art" style="width:88px;height:88px;font-size:44px">🏆</div><span class="eyebrow">FASE COMPLETA</span><h2>Você <em>chegou!</em></h2><p>${GOAL} m completos com ${runner.coins} moedas na sacola.</p><div class="runner-overlay-actions"><button class="game-btn" id="runnerRetry">JOGAR DE NOVO ↻</button><button class="game-btn end-back" id="runnerBack">Voltar às cartas</button></div></div>`;
}

document.getElementById("playerForm").addEventListener("submit",e=>{e.preventDefault();savePlayer()});
document.getElementById("closeModal").onclick=closeModal;
modal.addEventListener("mousedown",e=>{if(e.target===modal)closeModal()});
document.getElementById("brandHome").onclick=goHome;
document.getElementById("backBtn").onclick=goHome;
// Esconde o botao de voltar na tela inicial (ele so aparece nas outras telas).
(function(){
  const back=document.getElementById("backBtn");
  const sync=()=>{back.hidden=!!app.querySelector(".start-screen");};
  new MutationObserver(sync).observe(app,{childList:true});
  sync();
})();
soundBtn.onclick=toggleSound;
narrateBtn.onclick=toggleNarrate;
calmBtn.onclick=toggleCalm;
// Logo do cabeçalho: a Bolhinha (o emoji 🫧 não existe no Windows 10)
document.querySelector(".brand-mark").innerHTML=mascot("feliz");
updateSoundBtn();updateNarrateBtn();updateCalm();
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeModal();
  // Enter ou espaço também avançam depois do feedback da carta
  if(awaitingNext&&(e.key==="Enter"||e.code==="Space")&&modal.classList.contains("hidden")){
    e.preventDefault();nextCard();return;
  }
  if(e.code==="Space"||e.code==="ArrowUp"){
    e.preventDefault();
    if(!modal.classList.contains("hidden"))return;
    if(app.querySelector(".runner-stage-wrap")){if(runner.status==="running")runnerJump();else if(runner.status==="ready")player?runnerStart():abrirCadastro('corrida');}
  }
});

render();
Banco.carregar();
