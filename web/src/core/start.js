// Loaded before the scene so import/WebGL failures have a usable recovery path.
import './study-status.css';
import './study-music.js';

export async function startStudy(load) {
  const slug = location.pathname.split('/').filter(Boolean).at(-1);
  let ready = false, failed = false;
  const panel = document.createElement('aside');
  panel.className = 'study-status';
  panel.setAttribute('role', 'status');
  panel.innerHTML = '<p class="study-status-text">Preparing the interactive study…</p><div><button type="button" data-retry>Try again</button><a href="/works/">Back to work</a><button type="button" data-continue hidden>Keep waiting</button></div>';
  document.body.append(panel);
  panel.querySelector('[data-retry]').onclick = () => location.reload();
  panel.querySelector('[data-continue]').onclick = () => {panel.classList.remove('is-visible');};
  function fail(error) {
    if (failed) return;
    failed = true;
    clearTimeout(timeout);
    console.error('Study failed to initialise:', error);
    document.documentElement.dataset.study = 'error';
    window.dispatchEvent(new Event('study-failed'));
    const loader = document.querySelector('.loader');
    if (loader) loader.hidden = true;
    panel.querySelector('.study-status-text').textContent = 'This interactive scene could not start. Try again, or return to the project collection.';
    panel.classList.add('is-visible', 'is-error');
    const image = document.createElement('img');
    image.src = `/img/index/${slug}.webp`;
    image.alt = 'Still preview of this study; the interactive scene is unavailable.';
    panel.prepend(image);
  }
  const timeout = setTimeout(() => {
    if (ready || failed) return;
    panel.querySelector('.study-status-text').textContent = 'The 3D assets are taking longer than expected. You can keep waiting, retry, or return to the collection.';
    panel.querySelector('[data-continue]').hidden = false;
    panel.classList.add('is-visible');
  }, 30000);
  window.addEventListener('study-ready', () => {
    ready = true; clearTimeout(timeout);
    if (!failed) {document.documentElement.dataset.study = 'ready'; panel.remove();}
  }, {once: true});
  window.addEventListener('unhandledrejection', event => {if (!ready) fail(event.reason);});
  window.addEventListener('error', event => {if (!ready && event.error) fail(event.error);});
  try {await load();} catch (error) {fail(error);}
}
