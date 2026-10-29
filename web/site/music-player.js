// Add tracks here as { title, artist, src } when audio is supplied.
export const playlist = [{title: "Devil’s Trill Sonata", artist: 'Giuseppe Tartini', src: '/audio/devils-trill.mp3'}];

export function musicPlayer(widget) {
  const disc = widget.querySelector('.music-disc');
  const [previous, play, next] = widget.querySelectorAll('.music-controls button');
  const label = widget.querySelector('.music-tile small');
  if (!playlist.length) return;
  const audio = new Audio();
  audio.volume = .25;
  const mute = widget.querySelector('.music-mute');
  try { audio.muted = sessionStorage.getItem('music-muted') === '1'; } catch {}
  function syncMute() { mute.setAttribute('aria-pressed', String(audio.muted)); mute.setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music'); mute.classList.toggle('is-muted', audio.muted); }
  mute.addEventListener('click', () => { audio.muted = !audio.muted; try {sessionStorage.setItem('music-muted', audio.muted ? '1' : '0');} catch {} syncMute(); });
  syncMute();
  let index = 0;
  try { index = Math.min(playlist.length - 1, Math.max(0, Number(sessionStorage.getItem('music-track')) || 0)); } catch {}
  function load(restore = false) {
    audio.src = playlist[index].src;
    label.textContent = [playlist[index].title, playlist[index].artist].filter(Boolean).join(' · ');
    if (restore) { try { audio.currentTime = Number(sessionStorage.getItem('music-time')) || 0; } catch {} }
  }
  function sync() { play.textContent = audio.paused ? '▶' : 'Ⅱ'; play.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause'); disc.classList.toggle('is-playing', !audio.paused); widget.querySelector('.widget-trigger').classList.toggle('is-playing', !audio.paused); }
  function toggle() { if (audio.paused) audio.play().catch(sync); else audio.pause(); }
  function step(delta) { index = (index + delta + playlist.length) % playlist.length; load(); audio.play().catch(sync); }
  disc.removeAttribute('aria-disabled'); [previous, play, next].forEach(button => button.disabled = false);
  disc.addEventListener('click', toggle); play.addEventListener('click', toggle); previous.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  audio.addEventListener('play', sync); audio.addEventListener('pause', sync); audio.addEventListener('ended', () => step(1));
  addEventListener('pagehide', () => { try { sessionStorage.setItem('music-track', index); sessionStorage.setItem('music-time', audio.currentTime); sessionStorage.setItem('music-playing', audio.paused ? '0' : '1'); } catch {} });
  load(true); sync();
  // Browsers may block autoplay until a visitor interacts with the page.
  audio.play().catch(() => {
    sync();
    const startOnInteraction = () => { audio.play().catch(sync); };
    document.addEventListener('pointerdown', startOnInteraction, {once:true});
  });
}
