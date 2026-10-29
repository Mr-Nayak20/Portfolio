import {studies as allStudies, shot, shotSrcset} from './data.js';

// Keep all images in a presentation in step, and stop when it is off screen.
export function studySlideshow(container, images, {interval = 3500, onChange = () => {}, showcase = false, initialSrc = null} = {}) {
  if (!container || !images.length) return;
  const studies = [...allStudies];
  for (let i = studies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [studies[i], studies[j]] = [studies[j], studies[i]];
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = Math.max(0, studies.findIndex(study => initialSrc && new URL(shot(study.slug), location.href).pathname === new URL(initialSrc, location.href).pathname)), visible = false, paused = false, timer, generation = 0;
  const path = slug => showcase ? `/img/product-showcase/${slug}-1920.webp` : shot(slug);
  const srcset = slug => showcase ? [640, 1280, 1920].map(width => `/img/product-showcase/${slug}-${width}.webp ${width}w`).join(', ') : shotSrcset(slug);
  const show = study => images.forEach(image => {
    if (!motion.matches && image.complete && image.naturalWidth && image.src !== new URL(path(study.slug), location.href).href) {
      const outgoing = image.cloneNode();
      outgoing.removeAttribute('id'); outgoing.removeAttribute('alt');
      outgoing.setAttribute('aria-hidden', 'true');
      Object.assign(outgoing.style, {position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '1'});
      image.parentElement.style.position ||= 'relative';
      image.parentElement.append(outgoing);
      outgoing.animate([{opacity: 1}, {opacity: 0}], {duration: 650, easing: 'ease-in-out'}).finished.then(() => outgoing.remove()).catch(() => outgoing.remove());
    }
    image.srcset = srcset(study.slug);
    image.sizes = image.closest('.service-card') ? '338px' : '100vw';
    image.src = path(study.slug);
    if (image.alt) image.alt = `${study.name} website study`;
    if (!motion.matches) image.animate([{opacity: .55}, {opacity: 1}], {duration: 650, easing: 'ease-in-out'});
  });
  const setStudy = study => {show(study); onChange(study, index);};
  const stop = () => {clearTimeout(timer); generation++;};
  const schedule = () => {
    clearTimeout(timer);
    if (!visible || paused || document.hidden || motion.matches) return;
    timer = setTimeout(async () => {
      const token = ++generation;
      const next = (index + 1) % studies.length;
      const candidate = new Image();
      candidate.src = path(studies[next].slug);
      try {await candidate.decode();} catch {if (token === generation) {index = next; schedule();} return;}
      if (token !== generation || !visible || paused || document.hidden || motion.matches) return;
      index = next;
      setStudy(studies[index]);
      schedule();
    }, interval);
  };
  setStudy(studies[index]);
  new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; if (visible) schedule(); else stop();}, {threshold: .05}).observe(container);
  document.addEventListener('visibilitychange', () => {if (document.hidden) stop(); else schedule();});
  motion.addEventListener('change', () => {stop(); schedule();});
  return {
    async select(next) {
      if (next < 0 || next >= studies.length) return;
      stop();
      const token = generation, candidate = new Image();
      candidate.src = path(studies[next].slug);
      try {await candidate.decode();} catch {return;}
      if (token !== generation) return;
      index = next; setStudy(studies[index]); schedule();
    },
    pause() {paused = true; stop();},
    resume() {paused = false; schedule();}
  };
}
