import Lenis from 'lenis';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && !window.__lenis) {
  const lenis = new Lenis({
    lerp: 0.045,
    wheelMultiplier: 0.75,
    touchMultiplier: 0.85,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.04,
    touchInertiaExponent: 1.25,
    autoRaf: true,
    autoResize: true,
    respectReducedMotion: true
  });
  const origScrollTo = lenis.scrollTo.bind(lenis);
  lenis.scrollTo = (target, options = {}) => {
    if (options && !options.programmatic && options.lerp === 1 && lenis.isTouching) {
      options.lerp = 0.075;
    }
    return origScrollTo(target, options);
  };
  window.__lenis = lenis;
  window.addEventListener('pagehide', () => {
    lenis?.destroy();
    delete window.__lenis;
  }, { once: true });
}

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());document.querySelectorAll('dialog').forEach(d=>d.onclick=e=>{if(e.target===d){let r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});
