// Lenis smooth scrolling bound to GSAP ScrollTrigger, plus helpers for scroll-driven 3D.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger, SplitText };

export function smoothScroll(options = {}) {
  if (window.__lenis) return window.__lenis;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    const api = {
      native: true,
      get scroll() { return scrollY; },
      get animatedScroll() { return scrollY; },
      get velocity() { return 0; },
      get limit() { return Math.max(0, document.documentElement.scrollHeight - innerHeight); },
      on(event, fn) { window.addEventListener(event, fn); return () => window.removeEventListener(event, fn); },
      scrollTo(target, opts = {}) {
        const y = typeof target === 'number' ? target : (typeof target === 'string' ? document.querySelector(target) : target)?.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: Math.max(0, y + (opts.offset || 0)), behavior: 'instant' });
      },
      stop() {}, start() {}, raf() {}, resize() { ScrollTrigger.refresh(); }, destroy() {}
    };
    return api;
  }

  const HEAVY_LERP = 0.045;
  const HEAVY_WHEEL = 0.75;
  const lenis = new Lenis({
    lerp: HEAVY_LERP,
    wheelMultiplier: HEAVY_WHEEL,
    touchMultiplier: 0.85,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.04,
    touchInertiaExponent: 1.25,
    autoRaf: true,
    autoResize: true,
    respectReducedMotion: true,
    ...options,
    lerp: options.lerp ? Math.min(options.lerp, HEAVY_LERP) : HEAVY_LERP,
    wheelMultiplier: options.wheelMultiplier ? Math.min(options.wheelMultiplier, HEAVY_WHEEL) : HEAVY_WHEEL
  });
  const origScrollTo = lenis.scrollTo.bind(lenis);
  lenis.scrollTo = (target, opts = {}) => {
    if (opts && !opts.programmatic && opts.lerp === 1 && lenis.isTouching) {
      opts.lerp = 0.075;
    }
    return origScrollTo(target, opts);
  };

  lenis.on('scroll', ScrollTrigger.update);
  window.__lenis = lenis;

  window.addEventListener('pagehide', () => {
    lenis.destroy();
    delete window.__lenis;
  }, { once: true });

  return lenis;
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
