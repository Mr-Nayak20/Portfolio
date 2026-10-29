// Continue the portfolio's soundtrack when a visitor opens a study.
let wasPlaying = false;
try { wasPlaying = sessionStorage.getItem('music-playing') === '1'; } catch {}
if (wasPlaying) {
  const audio = new Audio('/audio/devils-trill.mp3');
  audio.volume = .25;
  let position = 0;
  try { position = Number(sessionStorage.getItem('music-time')) || 0; audio.muted = sessionStorage.getItem('music-muted') === '1'; } catch {}
  audio.addEventListener('loadedmetadata', () => { if (position < audio.duration) audio.currentTime = position; }, {once:true});
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = audio.muted ? 'Unmute music' : 'Mute music';
  button.setAttribute('aria-label', button.textContent);
  Object.assign(button.style, {position:'fixed',right:'16px',bottom:'16px',zIndex:'9999',padding:'10px 14px',border:'1px solid #888',borderRadius:'30px',background:'#111',color:'#fff',font:'12px sans-serif',cursor:'pointer'});
  document.body.append(button);
  button.addEventListener('click', () => { audio.muted = !audio.muted; button.textContent = audio.muted ? 'Unmute music' : 'Mute music'; button.setAttribute('aria-label', button.textContent); try {sessionStorage.setItem('music-muted', audio.muted ? '1' : '0');} catch {} });
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const resume = () => audio.play().then(() => events.forEach(type => document.removeEventListener(type, resume))).catch(() => {});
  audio.addEventListener('ended', () => { audio.currentTime = 0; resume(); });
  addEventListener('pagehide', () => { try {sessionStorage.setItem('music-time', audio.currentTime); sessionStorage.setItem('music-playing', audio.paused ? '0' : '1');} catch {} });
  audio.play().catch(() => events.forEach(type => document.addEventListener(type, resume, {passive:true})));
}
