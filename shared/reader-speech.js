/* MeHeartMe Shared Read-to-Me v1.0 | 2026-10-28
   Non-invasive: speaks currently visible, already age-adapted page text.
   Include with defer after game scripts where possible.
   Configure with window.MeHeartMeReaderConfig BEFORE loading this file.
*/
(function () {
  'use strict';
  if (window.MeHeartMeReader && window.MeHeartMeReader.version) return;

  const config = Object.assign({
    root: '#adventurePanel',
    toolbarBefore: null,
    storageKey: 'meheartme-reading-level',
    showLevel: true,
    exclude: '.me-reader-toolbar,script,style,noscript,[hidden],[aria-hidden="true"],.warning,.legal',
    locale: 'en-US'
  }, window.MeHeartMeReaderConfig || {});
  const levels = ['4-6','7-9','10+'];
  const nativeSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const speech = nativeSpeech ? window.speechSynthesis : null;
  let speaking = false;
  let runId = 0;
  let activeRoot = null;
  let controlBar = null;
  let playBtn, stopBtn, statusEl, levelEl;

  function selectedLevel() {
    const query = new URLSearchParams(location.search).get('reading');
    if (levels.includes(query)) return query;
    try { const stored = localStorage.getItem(config.storageKey); if (levels.includes(stored)) return stored; } catch (_) {}
    return '10+';
  }
  function visible(el) {
    if (!el || !el.isConnected || el.closest(config.exclude)) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    return !!el.getClientRects().length;
  }
  function findRoot() {
    const roots = [...document.querySelectorAll(config.root)];
    return roots.find(el => el.id === 'pp-game' && visible(el)) || roots.find(el => visible(el)) || null;
  }
  function stop() {
    runId++;
    speaking = false;
    if (speech) speech.cancel();
    if (playBtn) playBtn.disabled = !nativeSpeech;
    if (stopBtn) stopBtn.disabled = true;
    if (statusEl) statusEl.textContent = '';
  }
  function roleOf(el) {
    const speechBox = el.closest('.speech,.overseer,.pp-overseer,.pp-game-message');
    const label = speechBox ? speechBox.textContent.slice(0,100) : '';
    if (/OVERSEER|CELESTIAL/i.test(label)) return 'overseer';
    if (/SUSPECT|GHOST|SIR |LADY |WHISPER/i.test(label)) return 'character';
    return 'narrator';
  }
  function blocks(root) {
    // Select leaf-level text containers to avoid reading nested text twice.
    const selector = 'h1,h2,h3,h4,p,li,blockquote,button,label,.status,.reader-copy,.question-label,.overseer-label,.pp-speaker';
    const picked = [...root.querySelectorAll(selector)].filter(visible).filter(el => {
      if (el.closest('a,.me-reader-toolbar')) return false;
      if (el.matches('button') && (el.disabled || el.getAttribute('aria-label')?.toLowerCase().includes('catch '))) return false;
      return ![...el.querySelectorAll(selector)].some(child => visible(child));
    });
    return picked.map(el => ({text: el.innerText.replace(/\s+/g,' ').trim(), role: roleOf(el)}))
      .filter(item => item.text.length > 0);
  }
  function chooseVoice(role) {
    if (!speech) return null;
    const all = speech.getVoices().filter(v => /^en([_-]|$)/i.test(v.lang));
    if (!all.length) return null;
    const pattern = role === 'overseer' ? /samantha|zira|victoria|karen/i :
      role === 'character' ? /daniel|alex|david|fred/i : /samantha|alex/i;
    return all.find(v => pattern.test(v.name)) || all[role === 'character' && all.length > 1 ? 1 : 0];
  }
  function read() {
    if (!nativeSpeech) { statusEl.textContent = 'Read-to-Me is unavailable in this browser.'; return; }
    stop();
    const root = findRoot();
    if (!root) { statusEl.textContent = 'No active reading section found.'; return; }
    const items = blocks(root);
    if (!items.length) { statusEl.textContent = 'No readable text on this screen.'; return; }
    const id = ++runId;
    activeRoot = root;
    speaking = true;
    playBtn.disabled = true;
    stopBtn.disabled = false;
    statusEl.textContent = 'Reading aloud';
    let pos = 0;
    function next() {
      if (!speaking || runId !== id) return;
      if (findRoot() !== activeRoot) { stop(); return; }
      if (pos >= items.length) { stop(); return; }
      const item = items[pos++];
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = config.locale;
      const level = selectedLevel();
      utterance.rate = level === '4-6' ? 0.85 : level === '7-9' ? 0.93 : 1;
      utterance.pitch = item.role === 'character' ? 0.88 : item.role === 'overseer' ? 1.12 : 1;
      const voice = chooseVoice(item.role);
      if (voice) utterance.voice = voice;
      utterance.onend = next;
      utterance.onerror = () => { if (runId === id) { stop(); statusEl.textContent = 'Speech interrupted.'; } };
      speech.speak(utterance);
    }
    next();
  }
  function initialize() {
    if (document.querySelector('.me-reader-toolbar')) return;
    const root = document.querySelector(config.root);
    if (!root) return;
    controlBar = document.createElement('div');
    controlBar.className = 'me-reader-toolbar';
    controlBar.setAttribute('role','group');
    controlBar.setAttribute('aria-label','Read-to-Me controls');
    controlBar.innerHTML = '<button type="button" class="me-reader-play" aria-label="Read current game section aloud">🔊 Read to Me</button> <button type="button" class="me-reader-stop" disabled>■ Stop</button> <span class="me-reader-level"></span> <span class="me-reader-status" role="status" aria-live="polite"></span>';
    const style = document.createElement('style');
    style.textContent = '.me-reader-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:14px auto;padding:12px;border:1px solid #72e6be;border-radius:12px;background:#071512;color:#effff9;font:600 14px Arial,sans-serif;max-width:1040px}.me-reader-toolbar button{min-height:44px;padding:10px 14px;border:1px solid #72e6be;border-radius:9px;background:#12392e;color:#effff9;font:inherit;cursor:pointer}.me-reader-toolbar button:disabled{opacity:.5;cursor:not-allowed}.me-reader-toolbar button:focus-visible{outline:3px solid #ffd83d;outline-offset:3px}.me-reader-status{font-weight:400}.me-reader-level{color:#b9ffe7}';
    document.head.appendChild(style);
    const anchor = config.toolbarBefore ? document.querySelector(config.toolbarBefore) : root;
    (anchor || root).before(controlBar);
    playBtn = controlBar.querySelector('.me-reader-play');
    stopBtn = controlBar.querySelector('.me-reader-stop');
    statusEl = controlBar.querySelector('.me-reader-status');
    levelEl = controlBar.querySelector('.me-reader-level');
    if (config.showLevel) levelEl.textContent = 'Reading: Ages ' + selectedLevel();
    playBtn.disabled = !nativeSpeech;
    if (!nativeSpeech) statusEl.textContent = 'Speech unavailable on this device.';
    playBtn.addEventListener('click', read);
    stopBtn.addEventListener('click', stop);
    const observer = new MutationObserver(() => {
      if (speaking && (findRoot() !== activeRoot || !visible(activeRoot))) stop();
      if (config.showLevel) levelEl.textContent = 'Reading: Ages ' + selectedLevel();
    });
    observer.observe(document.body, {subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
    document.addEventListener('visibilitychange', () => {if(document.hidden) stop();});
    window.addEventListener('pagehide', stop);
  }
  window.MeHeartMeReader = {version:'1.0', stop, read, getLevel:selectedLevel};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
