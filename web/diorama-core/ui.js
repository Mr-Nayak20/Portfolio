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
  return {
    async finish() {
      const wait = Math.max(0, minTime - (performance.now() - t0));
      await new Promise(r => setTimeout(r, wait));
      state.done = true;
      onValue?.(1);
      if (exit) await exit();
      else if (el) await gsap.to(el, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' });
      el?.remove?.();
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
export function worldNav(slug) { const nav=document.createElement('nav'); nav.className='portfolio-world-nav'; nav.setAttribute('aria-label','Portfolio navigation');nav.innerHTML='<a href="/">← Portfolio</a><a href="/'+(slug==='nocturne'?'velocity':'nocturne')+'/">'+(slug==='nocturne'?'Velocity Lab':'Nocturne')+' ↗</a>';document.body.append(nav);return nav; }
