// Trilha original instrumental: sintetizada localmente, sem downloads ou serviços.
(() => {
  const button = document.getElementById('musicBtn');
  let context, master, interval;
  let enabled = localStorage.getItem('cs-music') !== 'off';
  // O volume fica dentro do painel de Ajustes, aberto pelo botão ⚙️
  const volBtn = document.getElementById('settingsBtn');
  const volPop = document.getElementById('settingsPanel');
  const volSlider = document.getElementById('volumeSlider');
  const volValue = document.getElementById('volumeValue');
  const saved = parseInt(localStorage.getItem('cs-music-volume'), 10);
  let volume = Number.isFinite(saved) ? Math.min(100, Math.max(0, saved)) : 50;
  const gainFor = v => (v / 100) * .56; // 50% = volume original (.28)
  let unlocked = false, step = 0, next = 0;
  const beat = 60 / 96 / 2;
  const melody = [76,0,79,83,79,0,76,74,72,0,76,79,76,0,72,74,74,0,77,81,77,0,74,72,71,0,74,79,74,0,71,74];
  const bass = [48,45,53,43];
  function update() {
    button.setAttribute('aria-checked', String(enabled));
    button.title = enabled ? 'Silenciar música de fundo' : 'Ativar música de fundo';
  }
  function note(midi, at, duration, volume, type) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(at); oscillator.stop(at + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function schedule() {
    if (!context || context.state !== 'running') return;
    while (next < context.currentTime + .18) {
      const i = step % melody.length;
      if (melody[i]) note(melody[i], next, beat * 1.7, .09, 'triangle');
      if (i % 2 === 0) note(bass[Math.floor(i / 8)], next, beat * 1.8, .08, 'sine');
      if (i % 8 === 0) {
        const root = bass[Math.floor(i / 8)] + 12;
        [root, root + (i === 8 ? 3 : 4), root + 7].forEach(n => note(n, next, beat * 7, .025, 'sine'));
      }
      next += beat; step++;
    }
  }
  async function sync() {
    if (!unlocked) return;
    try {
      if (!enabled || document.hidden) {
        clearInterval(interval); interval = null;
        if (context?.state === 'running') await context.suspend();
        return;
      }
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) { button.disabled = true; button.title = 'Áudio indisponível neste navegador'; return; }
        context = new Audio(); master = context.createGain(); master.gain.value = gainFor(volume);
        master.connect(context.destination);
      }
      await context.resume();
      if (!interval && enabled && !document.hidden) {
        next = context.currentTime + .04; schedule(); interval = setInterval(schedule, 80);
      }
      button.dataset.playing = String(context.state === 'running' && enabled);
    } catch { button.title = 'Toque novamente para ativar a música'; }
  }
  function setVolume(v) {
    volume = Math.min(100, Math.max(0, Number(v) || 0));
    volSlider.value = volume;
    volSlider.style.setProperty('--fill', volume + '%');
    volValue.textContent = volume + '%';
    localStorage.setItem('cs-music-volume', String(volume));
    if (master) master.gain.setTargetAtTime(gainFor(volume), context.currentTime, .02);
  }
  volSlider.addEventListener('input', () => setVolume(volSlider.value));
  function togglePop(open) {
    const show = open ?? volPop.hidden;
    volPop.hidden = !show;
    volBtn.setAttribute('aria-expanded', String(show));
  }
  volBtn.addEventListener('click', e => { e.stopPropagation(); togglePop(); });
  volPop.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => togglePop(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePop(false); });
  setVolume(volume);
  button.onclick = () => { unlocked = true; enabled = !enabled; localStorage.setItem('cs-music', enabled ? 'on' : 'off'); update(); sync(); };
  function unlock() { unlocked = true; sync(); }
  document.addEventListener('pointerdown', unlock, {once:true});
  document.addEventListener('keydown', unlock, {once:true});
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { clearInterval(interval); context?.close(); });
  update();
})();