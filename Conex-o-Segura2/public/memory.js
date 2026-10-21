// Terceiro desafio: pares de práticas de segurança digital.
const MEMORY_PAIRS = [
  {id:'password', icon:'🔑', name:'Senha forte', tip:'Use senhas longas e diferentes em cada conta.'},
  {id:'shield', icon:'🛡️', name:'Proteção', tip:'Mantenha o sistema e o antivírus atualizados.'},
  {id:'lock', icon:'🔒', name:'Privacidade', tip:'Não envie seus dados pessoais a desconhecidos.'},
  {id:'help', icon:'🤝', name:'Pedir ajuda', tip:'Converse com um adulto de confiança quando algo parecer estranho.'},
  {id:'link', icon:'🔗', name:'Link confiável', tip:'Confira o endereço oficial antes de abrir um link.'},
  {id:'backup', icon:'💾', name:'Backup', tip:'Guarde cópias de segurança dos arquivos importantes.'}
];
let memory = null;
let memoryTimeout = null;
function memoryIcon(id) {
  const paths = {
    password:'<circle cx="8" cy="15" r="5"/><path d="m12 12 8-8m-2 2 3 3m-6 0 3 3"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 4m0 3v1"/>',
    link:'<path d="m10 13 4-4m-5 1-3 3a4 4 0 0 0 6 6l3-3m0-2 3-3a4 4 0 0 0-6-6l-3 3"/>',
    backup:'<path d="M4 3h13l3 3v15H4z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id] || paths.shield}</svg>`;
}
function stopMemory() { clearTimeout(memoryTimeout); memoryTimeout = null; }
let iniciandoMemoria=false;
async function openMemory() {
  if(!player){abrirCadastro('memoria');return;}
  if(iniciandoMemoria)return;
  iniciandoMemoria=true;
  registrarMemoria(false);
  stopMemory();
  const jogadorId=player.id;
  try{
    const inicio=await Banco.enfileirar(()=>Banco.pedir('/api/partidas',{
      jogador_id:jogadorId,tipo:'memoria'
    }));
    if(player?.id!==jogadorId)return;
    registrarCorrida();
    cancelAnimationFrame(runnerFrame);runner.status='ready';
    clearTimeout(timer);stopCardTimer();stopSpeak();
    game.status='memory';
    memory={cards:shuffle(MEMORY_PAIRS.flatMap(p=>[{...p},{...p}])),
      open:[],matched:[],mistakes:0,moves:0,busy:false,partidaId:inicio.partida_id,enviado:false};
    render();Banco.limparAviso();
  }catch(erro){Banco.aviso('Nao foi possivel iniciar memoria: '+erro.message);}
  finally{iniciandoMemoria=false;}
}
function registrarMemoria(venceu){
  if(!player || !memory?.partidaId || memory.enviado)return;
  const dados={jogador_id:player.id,partida_id:memory.partidaId,
    pares:memory.matched.length/2,jogadas:memory.moves,
    erros:memory.mistakes,venceu:!!venceu};
  memory.enviado=true;
  Banco.enfileirar(()=>Banco.pedir('/api/memoria',dados))
    .catch(erro=>Banco.aviso('Resultado da memoria nao salvo: '+erro.message));
}
function selectMemory(index) {
  if (!memory || memory.busy || memory.mistakes >= MAX_LIVES || memory.open.includes(index) || memory.matched.includes(index)) return;
  memory.open.push(index); playTone(480,600,.08); renderMemory();
  if (memory.open.length !== 2) return;
  memory.moves++; memory.busy = true;
  const [a,b] = memory.open;
  const pair = memory.cards[a];
  if (pair.id === memory.cards[b].id) {
    memory.matched.push(a,b); chirp(true); burst();
    const feedback = document.getElementById('memoryFeedback');
    feedback.textContent = pair.tip; feedback.className = 'feedback-line feedback-good';
    speak(pair.tip);
  } else { memory.mistakes++; chirp(false); }
  memoryTimeout = setTimeout(() => {
    memory.open = []; memory.busy = false; renderMemory();
  }, 1000);
}
function renderMemory() {
  if (!memory) return;
  const won = memory.matched.length === memory.cards.length;
  const lost = memory.mistakes >= MAX_LIVES;
  if(won||lost)registrarMemoria(won);
  app.innerHTML = `<section class="play-screen memory-screen">
    <div class="play-topline"><span class="mission-label"><span class="mission-dot"></span> NOVO DESAFIO · FASE 3</span><span class="remaining-label">${memory.matched.length/2}/${MEMORY_PAIRS.length} PARES</span></div>
    <div class="play-title"><div><h1>Memória Digital</h1><p>Uma conexão segura começa com boas escolhas.</p></div><img class="memory-avatar" src="${playerAvatar()}" alt="Seu avatar"></div>
    <div class="stats-row"><div class="stat-group"><span class="stat-caption">SUAS VIDAS</span><div class="hearts">${Array.from({length:MAX_LIVES},(_,i)=>`<span class="${i<MAX_LIVES-memory.mistakes?'heart-full':'heart-empty'}">♥</span>`).join('')}</div></div><div class="stat-group"><span class="stat-caption">JOGADAS</span><strong>${memory.moves}</strong></div></div>
    ${won || lost ? `<div class="memory-result" role="status"><div class="end-art">${won?'🏆':'💔'}</div><h2>${won?'Conexões completas!':'Vamos tentar de novo?'}</h2><p>${won?'Você encontrou todos os pares de segurança digital.':'Cada tentativa é uma nova descoberta.'}</p><button class="game-btn" id="memoryRetry">JOGAR DE NOVO ↻</button></div>` : `<div class="memory-grid">${memory.cards.map((card,i)=>{
      const matched = memory.matched.includes(i), visible = matched || memory.open.includes(i);
      return `<button class="memory-card ${visible?'is-open':''} ${matched?'is-matched':''}" data-memory="${i}" ${matched?'disabled':''} aria-label="${visible?card.name:'Virar carta '+(i+1)}" aria-pressed="${visible}"><span class="memory-icon">${memoryIcon(visible?card.id:'shield')}</span><span class="memory-name">${visible?card.name:'CONEXÃO SEGURA'}</span>${matched?'<span class="memory-check">✓</span>':''}</button>`;
    }).join('')}</div><p id="memoryFeedback" class="feedback-line" aria-live="polite">${memory.open.length===1?'Encontre o par desta carta.':'Encontre as conexões.'}</p>`}
    <div class="memory-actions"><button class="game-btn end-back" id="memoryHome">← Voltar ao início</button>${won||lost?'':'<button class="game-btn end-back" id="memoryRestart">↻ Recomeçar</button>'}</div>
  </section>`;
  app.querySelectorAll('[data-memory]').forEach(button => button.onclick = () => selectMemory(Number(button.dataset.memory)));
  document.getElementById('memoryHome').onclick = goHome;
  document.getElementById('memoryRetry')?.addEventListener('click', openMemory);
  document.getElementById('memoryRestart')?.addEventListener('click', openMemory);
}