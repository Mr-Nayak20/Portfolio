// Continue the portfolio's soundtrack when a visitor opens a study.
let wasPlaying = false;
try { wasPlaying = sessionStorage.getItem('music-playing') === '1'; } catch {}
if (wasPlaying) {
  const audio = new Audio('/audio/devils-trill.mp3');
  audio.volume = .25;
  let position = 0;
  try { position = Number(sessionStorage.getItem('music-time')) || 0; audio.muted = sessionStorage.getItem('music-muted') === '1'; } catch {}
  audio.addEventListener('loadedmetadata', () => { if (position < audio.duration) audio.currentTime = position; }, {once:true});
  window.addEventListener('portfolio-mute', event => { audio.muted = Boolean(event.detail); });
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const resume = () => audio.play().then(() => events.forEach(type => document.removeEventListener(type, resume))).catch(() => {});
  audio.addEventListener('ended', () => { audio.currentTime = 0; resume(); });
  addEventListener('pagehide', () => { try {sessionStorage.setItem('music-time', audio.currentTime); sessionStorage.setItem('music-playing', audio.paused ? '0' : '1');} catch {} });
  audio.play().catch(() => events.forEach(type => document.addEventListener(type, resume, {passive:true})));
}
