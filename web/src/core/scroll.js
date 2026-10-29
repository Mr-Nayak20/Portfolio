// Lenis smooth scrolling bound to GSAP ScrollTrigger, plus helpers for scroll-driven 3D.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger, SplitText };

/** Compatibility API backed by native scrolling: no wheel interception or idle ticker. */
export function smoothScroll() {
  if (window.__lenis?.native) return window.__lenis;
  const listeners = new Set();
  let previous = scrollY, last = performance.now(), velocity = 0, decay, completion, savedOverflow;
  const update = () => {
    const now = performance.now();
    velocity = (scrollY - previous) * 16.67 / Math.max(1, now - last);
    previous = scrollY; last = now;
    ScrollTrigger.update();
    listeners.forEach(fn => fn(api));
    clearTimeout(decay); decay = setTimeout(() => {velocity = 0;}, 100);
  };
  const api = {
    native: true,
    get scroll() {return scrollY;},
    get animatedScroll() {return scrollY;},
    get velocity() {return velocity;},
    get limit() {return Math.max(0, document.documentElement.scrollHeight - innerHeight);},
    on(event, fn) {if (event === 'scroll') listeners.add(fn); return () => listeners.delete(fn);},
    scrollTo(target, options = {}) {
      if (typeof target === 'string') target = document.querySelector(target);
      if (target == null) return;
      const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY;
      clearTimeout(completion);
      // Immediate moves keep scene controls precise and do not queue long camera journeys.
      window.scrollTo({top: Math.max(0, Math.min(api.limit, y + (options.offset || 0))), behavior:'instant'});
      update();
      completion = setTimeout(() => options.onComplete?.(api), 0);
    },
    stop() {if (savedOverflow === undefined) {savedOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';}},
    start() {if (savedOverflow !== undefined) {document.documentElement.style.overflow = savedOverflow; savedOverflow = undefined;}},
    raf() {}, resize() {ScrollTrigger.refresh();},
    destroy() {api.start(); window.removeEventListener('scroll', update); clearTimeout(decay); clearTimeout(completion); listeners.clear(); if(window.__lenis === api) delete window.__lenis;}
  };
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('pagehide', () => api.destroy(), {once:true});
  window.__lenis = api;
  return api;
}

/** Normalised page progress (0..1) and progress through an element's scroll span. */
export function pageProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? scrollY / max : 0;
}

export function elementProgress(el, { start = 'top top', end = 'bottom bottom' } = {}) {
  const r = el.getBoundingClientRect();
  const vh = innerHeight;
  const s = start === 'top bottom' ? r.top - vh : start === 'top center' ? r.top - vh / 2 : r.top;
  const e = end === 'bottom top' ? r.bottom : end === 'bottom center' ? r.bottom - vh / 2 : r.bottom - vh;
  const span = e - s || 1;
  return Math.min(1, Math.max(0, -s / span));
}

/** Reveal text by lines/words/chars when it scrolls into view. */
export function reveal(selector, { type = 'lines', stagger = 0.08, y = '110%', duration = 1.1, ease = 'expo.out', start = 'top 85%', scrub = false, mask = true } = {}) {
  const els = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector].flat();
  const out = [];
  els.forEach(el => {
    const split = SplitText.create(el, { type, mask: mask ? type.split(',').pop().trim() : undefined, autoSplit: true,
      onSplit(self) {
        const targets = self[type.split(',').pop().trim()];
        return gsap.from(targets, { yPercent: parseFloat(y), opacity: 0, duration, ease, stagger,
          scrollTrigger: scrub ? { trigger: el, start, end: 'bottom 40%', scrub: true } : { trigger: el, start, once: true } });
      } });
    out.push(split);
  });
  return out;
}
