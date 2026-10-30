// Page chrome shared by every world: preloader, cursor, magnetic buttons, collection navigator.
import { gsap } from 'gsap';
import { WORLDS } from './worlds.js';
import './ui.css';

/**
 * Preloader bound to an Assets instance. Returns a promise that resolves after the exit animation.
 * `el` is the page's own loader element (each world styles its own); `onValue(v)` updates it.
 */
export function preloader({ assets, el, onValue, minTime = 900, exit = null }) {
  const t0 = performance.now();
  let shown = 0;
  const state = { v: 0 };
  const tick = () => {
    shown += (assets.progress - shown) * 0.12;
    onValue?.(shown);
    if (!state.done) requestAnimationFrame(tick);
  };
  tick();
  window.addEventListener('study-failed', () => {state.done = true;}, {once: true});
  return {
    async finish() {
      const wait = Math.max(0, minTime - (performance.now() - t0));
      await new Promise(r => setTimeout(r, wait));
      state.done = true;
      onValue?.(1);
      if (exit) await exit();
      else if (el) await gsap.to(el, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' });
      el?.remove?.();
      window.dispatchEvent(new Event('study-ready'));
    },
  };
}

/** Custom cursor: a dot plus a lagging ring that swells over interactive elements. */
export function cursor() {
  // Detached compatibility node: legacy scene code may inspect state/style without
  // creating a visible pointer proxy or installing a pointer animation loop.
  const root = document.createElement('span');
  return {root, set(state = '') {root.dataset.state = state;}};
}

/** Buttons that lean toward the pointer. */
export function magnetic(selector = '[data-magnetic]', strength = 0.35) {
  document.querySelectorAll(selector).forEach(el => {
    const inner = el.querySelector('[data-magnetic-inner]') ?? el;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.5, ease: 'power3.out' });
      if (inner !== el) gsap.to(inner, { x: dx * strength * 0.4, y: dy * strength * 0.4, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/** Small collection navigator pinned to a corner of every world. */
export function worldNav(slug, { theme = 'dark', corner = 'bl' } = {}) {
  const i = WORLDS.findIndex(w => w.slug === slug);
  const prev = WORLDS[(i - 1 + WORLDS.length) % WORLDS.length];
  const next = WORLDS[(i + 1) % WORLDS.length];
  const base = import.meta.env.BASE_URL;
  const nav = document.createElement('nav');
  nav.className = `tw-nav tw-nav-${theme} tw-nav-${corner}`;
  nav.setAttribute('aria-label', 'Portfolio studies');
  nav.innerHTML = `
    <a class="tw-nav-home" href="${base}" title="Return to portfolio">
      <svg viewBox="0 0 20 20" aria-hidden="true"><g fill="currentColor">${[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => `<rect x="${1 + c * 3.8}" y="${2 + r * 4.4}" width="2.2" height="2.2" rx=".6" opacity="${(r * 5 + c) === i ? 1 : 0.38}"/>`).join('')).join('')}</g></svg>
    </a>
    <a href="${base}examples/${prev.slug}/" class="tw-nav-step" title="${prev.name}" aria-label="Previous world: ${prev.name}">‹</a>
    <button type="button" class="tw-nav-play" aria-label="Auto-scroll page" aria-pressed="false">▶</button>
    <a href="${base}examples/${next.slug}/" class="tw-nav-step" title="${next.name}" aria-label="Next world: ${next.name}">›</a>
    <span class="tw-nav-count">${String(i + 1).padStart(2, '0')}<em>/20</em></span>`;
  document.body.appendChild(nav);
  const play = nav.querySelector('.tw-nav-play');
  let playing = false, raf = 0, started = 0, startY = 0, endY = 0, duration = 28000;
  const stop = () => { playing = false; cancelAnimationFrame(raf); play.textContent = '▶'; play.setAttribute('aria-label', 'Auto-scroll page'); play.setAttribute('aria-pressed', 'false'); };
  const tick = time => {
    if (!playing) return;
    if (!started) started = time;
    const progress = Math.min(1, (time - started) / duration);
    let p = progress;
    if (p < 0.04) {
      const t = p / 0.04;
      p = 0.04 * (t * t * (3 - 2 * t));
    } else if (p > 0.96) {
      const t = (p - 0.96) / 0.04;
      p = 0.96 + 0.04 * (t * t * (3 - 2 * t));
    }
    const targetY = startY + (endY - startY) * p;
    if (window.__lenis) {
      window.__lenis.scrollTo(targetY, { immediate: true });
    } else {
      window.scrollTo({ top: targetY, behavior: 'instant' });
    }
    if (progress >= 1) { stop(); return; }
    raf = requestAnimationFrame(tick);
  };
  play.addEventListener('click', () => {
    if (playing) { stop(); return; }
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    startY = scrollY;
    if (startY >= maxScroll - 10) startY = 0;
    endY = maxScroll;
    const distance = Math.max(1, endY - startY);
    if (distance <= 10) return;
    // Calm, readable pace (~280px/s) instead of the previous aggressive 9-second rush
    duration = Math.max(12000, Math.min(34000, distance / 0.28));
    playing = true; started = 0; play.textContent = '❚❚'; play.setAttribute('aria-label', 'Pause auto-scroll'); play.setAttribute('aria-pressed', 'true'); raf = requestAnimationFrame(tick);
  });
  ['wheel', 'touchstart', 'keydown'].forEach(type => addEventListener(type, stop, {passive:true}));
  return nav;
}
