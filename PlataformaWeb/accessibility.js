// Menú de Accesibilidad para MentorIA
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const live = $('#sr-live');
  const root = document.documentElement;
  const body = document.body;
  const storeKey = 'mentorIA:accessibility:v1';

  const defaultPrefs = {
    fontSize: 16,
    fontFamily: 'system',
    letterSpacing: 0,
    lineHeight: 1.6,
    highContrast: false,
    highlightLinks: false,
    bigButtons: false,
    disableAnimations: false,
    accentColor: '#6366f1',
    muteAutoplay: false,
    keyboardMode: false,
    noSmoothScroll: false,
    voiceReadSelection: false,
  };

  let prefs = loadPrefs();

  function loadPrefs(){
    try{
      const raw = localStorage.getItem(storeKey);
      if(!raw) return {...defaultPrefs};
      const data = JSON.parse(raw);
      return { ...defaultPrefs, ...data };
    }catch(e){
      return { ...defaultPrefs };
    }
  }

  function savePrefs(){
    localStorage.setItem(storeKey, JSON.stringify(prefs));
  }

  function announce(msg){
    if(!live) return;
    live.textContent = '';
    setTimeout(()=>{ live.textContent = msg; }, 10);
  }

  function ensureFontLoaded(font){
    if(font !== 'dyslexic') return;
    const existing = document.getElementById('font-lexend');
    if(!existing){
      const link = document.createElement('link');
      link.id = 'font-lexend';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }

  function applyPrefs(){
    // Tamaño de fuente, espaciado, altura línea
    root.style.setProperty('--base-font-size', prefs.fontSize + 'px');
    root.style.setProperty('--letter-space', prefs.letterSpacing + 'px');
    root.style.setProperty('--line-height', prefs.lineHeight);

    // Fuente
    ensureFontLoaded(prefs.fontFamily);
    switch(prefs.fontFamily){
      case 'serif':
        body.style.fontFamily = "Georgia, 'Times New Roman', serif";
        break;
      case 'dyslexic':
        body.style.fontFamily = "'Lexend', Arial, sans-serif";
        break;
      default:
        body.style.fontFamily = '';
    }

    // Estados por clases
    body.classList.toggle('high-contrast', !!prefs.highContrast);
    body.classList.toggle('highlight-links', !!prefs.highlightLinks);
    body.classList.toggle('focus-visible', !!prefs.keyboardMode || !!prefs.highlightLinks);
    body.classList.toggle('big-targets', !!prefs.bigButtons);
    body.classList.toggle('no-animations', !!prefs.disableAnimations);

    // Scroll suave del html
    root.classList.toggle('no-smooth', !!prefs.noSmoothScroll);

    // Color de acento
    root.style.setProperty('--primary-color', prefs.accentColor);

    // Autoplay
    if(prefs.muteAutoplay){
      disableAutoplay();
    }

    // Voice read selection
    setupSelectionReader(!!prefs.voiceReadSelection);

    // Actualizar UI
    syncUI();
  }

  function syncUI(){
  var el;
  if ((el = $('#font-size-range'))) { el.value = String(prefs.fontSize); el.setAttribute('aria-valuenow', String(prefs.fontSize)); }
  if ((el = $('#font-family-select'))) { el.value = prefs.fontFamily; }
  if ((el = $('#letter-spacing-range'))) { el.value = String(prefs.letterSpacing); }
  if ((el = $('#line-height-range'))) { el.value = String(prefs.lineHeight); }
  if ((el = $('#high-contrast'))) { el.checked = !!prefs.highContrast; }
  if ((el = $('#highlight-links'))) { el.checked = !!prefs.highlightLinks; }
  if ((el = $('#big-buttons'))) { el.checked = !!prefs.bigButtons; }
  if ((el = $('#disable-animations'))) { el.checked = !!prefs.disableAnimations; }
  if ((el = $('#accent-color'))) { el.value = prefs.accentColor; }
  if ((el = $('#mute-autoplay'))) { el.checked = !!prefs.muteAutoplay; }
  if ((el = $('#keyboard-mode'))) { el.checked = !!prefs.keyboardMode; }
  if ((el = $('#no-smooth-scroll'))) { el.checked = !!prefs.noSmoothScroll; }
  if ((el = $('#voice-read-selection'))) { el.checked = !!prefs.voiceReadSelection; }
  }

  function disableAutoplay(){
    $$('video, audio').forEach(m => {
      try{
        m.autoplay = false;
        m.removeAttribute('autoplay');
        m.muted = true;
        m.pause();
      }catch{}
    });
  }

  function pauseAllMedia(){
    $$('video, audio').forEach(m => { try{ m.pause(); }catch{} });
  }

  function resumeAllMedia(){
    $$('video, audio').forEach(m => { try{ m.play(); }catch{} });
  }

  // Mutations: evitar nuevos autoplay
  let mo;
  function observeAutoplay(){
    if(mo) mo.disconnect();
    if(!prefs.muteAutoplay) return;
    mo = new MutationObserver(records => {
      records.forEach(r => {
        r.addedNodes && r.addedNodes.forEach(node => {
          if(!(node instanceof HTMLElement)) return;
          $$("video, audio", node).forEach(m => {
            m.autoplay = false; m.removeAttribute('autoplay'); m.muted = true;
          });
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Text-to-speech de selección
  let selectionHandlerAdded = false;
  function setupSelectionReader(enable){
    if(!('speechSynthesis' in window)) return;
    if(enable && !selectionHandlerAdded){
      document.addEventListener('mouseup', speakSelection);
      document.addEventListener('keyup', speakSelection);
      selectionHandlerAdded = true;
    } else if(!enable && selectionHandlerAdded){
      document.removeEventListener('mouseup', speakSelection);
      document.removeEventListener('keyup', speakSelection);
      selectionHandlerAdded = false;
    }
  }
  function speakSelection(){
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if(text.length < 3) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 1; u.pitch = 1; u.volume = 1;
    window.speechSynthesis.speak(u);
  }

  // Tabs
  function setupTabs(){
    const tabs = $$('.acc-tab');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      $$('.acc-section').forEach(p => { p.classList.remove('is-active'); p.hidden = true; });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if(panel){ panel.hidden = false; panel.classList.add('is-active'); }
    }));
  }

  // Panel abrir/cerrar + foco
  function setupPanel(){
    const btn = $('#acc-toggle');
    const panel = $('#acc-panel');
    const close = $('#acc-close');
    let lastFocus;

    function open(){
      lastFocus = document.activeElement;
      if(panel) panel.classList.add('is-open');
      if(btn) btn.setAttribute('aria-expanded','true');
      // Mover el foco al primer elemento interactivo
      const scope = panel || document;
      const focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', scope)
        .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
      setTimeout(()=> { if (focusables[0]) focusables[0].focus(); }, 50);
    }
    function closePanel(){
      if(panel) panel.classList.remove('is-open');
      if(btn) btn.setAttribute('aria-expanded','false');
      if(lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if(btn){
      btn.addEventListener('click', () => (panel && panel.classList.contains('is-open')) ? closePanel() : open());
    }
    if(close){
      close.addEventListener('click', closePanel);
    }
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
      // Atajos
      if(e.altKey && (e.key === '=' || e.key === '+')){ e.preventDefault(); setFontSize(prefs.fontSize + 1); }
      if(e.altKey && (e.key === '-' )){ e.preventDefault(); setFontSize(prefs.fontSize - 1); }
      if(e.altKey && (e.key.toLowerCase() === 'h')){ e.preventDefault(); toggleCheckbox('#high-contrast'); }
      if(e.altKey && (e.key.toLowerCase() === 'l')){ e.preventDefault(); toggleCheckbox('#highlight-links'); }
    });
  }

  function toggleCheckbox(sel){
    const el = $(sel); if(!el) return; el.checked = !el.checked; el.dispatchEvent(new Event('change', {bubbles:true}));
  }

  // Handlers UI
  function setFontSize(size){ prefs.fontSize = Math.max(14, Math.min(22, size)); applyPrefs(); savePrefs(); announce('Tamaño de texto: ' + prefs.fontSize + 'px'); }

  function setupHandlers(){
    $('#font-size-range')?.addEventListener('input', (e)=>{ setFontSize(parseInt(e.target.value,10)); });
    $('#font-family-select')?.addEventListener('change', (e)=>{ prefs.fontFamily = e.target.value; applyPrefs(); savePrefs(); });
    $('#letter-spacing-range')?.addEventListener('input', (e)=>{ prefs.letterSpacing = parseFloat(e.target.value); applyPrefs(); savePrefs(); });
    $('#line-height-range')?.addEventListener('input', (e)=>{ prefs.lineHeight = parseFloat(e.target.value); applyPrefs(); savePrefs(); });

    $('#high-contrast')?.addEventListener('change', (e)=>{ prefs.highContrast = e.target.checked; applyPrefs(); savePrefs(); });
    $('#highlight-links')?.addEventListener('change', (e)=>{ prefs.highlightLinks = e.target.checked; applyPrefs(); savePrefs(); });
    $('#big-buttons')?.addEventListener('change', (e)=>{ prefs.bigButtons = e.target.checked; applyPrefs(); savePrefs(); });
    $('#disable-animations')?.addEventListener('change', (e)=>{ prefs.disableAnimations = e.target.checked; applyPrefs(); savePrefs(); });
    $('#accent-color')?.addEventListener('input', (e)=>{ prefs.accentColor = e.target.value; applyPrefs(); savePrefs(); });

    $('#pause-media')?.addEventListener('click', ()=>{ pauseAllMedia(); announce('Multimedia en pausa'); });
    $('#resume-media')?.addEventListener('click', ()=>{ resumeAllMedia(); announce('Multimedia reanudada'); });
    $('#mute-autoplay')?.addEventListener('change', (e)=>{ prefs.muteAutoplay = e.target.checked; applyPrefs(); savePrefs(); observeAutoplay(); announce('Auto-reproducción ' + (prefs.muteAutoplay?'bloqueada':'permitida')); });

    $('#keyboard-mode')?.addEventListener('change', (e)=>{ prefs.keyboardMode = e.target.checked; applyPrefs(); savePrefs(); });
    $('#no-smooth-scroll')?.addEventListener('change', (e)=>{ prefs.noSmoothScroll = e.target.checked; applyPrefs(); savePrefs(); });

    $('#voice-read-selection')?.addEventListener('change', (e)=>{ prefs.voiceReadSelection = e.target.checked; applyPrefs(); savePrefs(); announce('Lectura por selección ' + (prefs.voiceReadSelection?'activada':'desactivada')); });

    $('#save-accessibility')?.addEventListener('click', ()=>{ savePrefs(); announce('Preferencias de accesibilidad guardadas'); });
    $('#reset-accessibility')?.addEventListener('click', ()=>{ prefs = { ...defaultPrefs }; applyPrefs(); savePrefs(); announce('Preferencias restablecidas'); });
  }

  // Inicialización
  function init(){
    try {
      setupTabs();
      setupPanel();
      setupHandlers();
      applyPrefs();
      observeAutoplay();
    } catch (e) {
      // Evita romper la página si algo falla
      console.error('Accesibilidad: error de inicialización', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
