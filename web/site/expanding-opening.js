import {studySlideshow} from './study-slideshow.js';

export function applyOpeningProgress(frame, words, progress, start = innerWidth <= 768 ? 44 : 80) {
  const isMobile = innerWidth <= 768;
  const max = Math.min(innerWidth * (isMobile ? .84 : .72) / 1.6, innerHeight * .72);
  const size = start + progress * (max - start);
  frame.style.width = `${size * 1.6}px`;
  frame.style.height = `${size}px`;
  const travel = isMobile ? 14 : 26;
  words[0].style.transform = `translate3d(${-progress * travel}vw, 0, 0)`;
  words[1].style.transform = `translate3d(${progress * travel}vw, 0, 0)`;
  const fade = Math.max(0, 1 - progress * 1.3);
  words[0].style.opacity = String(fade);
  words[1].style.opacity = String(fade);
}

export function expandingOpening(hero, options = {}) {
  if (!hero) return;
  const frame = hero.querySelector('.services-hero__image');
  const words = [...frame.parentElement.children].filter(element => element !== frame);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const slideshow = studySlideshow(hero, [frame.querySelector('img')], options);
  const isHome = hero.classList.contains('home-opening');

  let targetW = 0, targetH = 0, startW = 0, startH = 0, centerOffset = 0, isMobile = false;
  const measure = () => {
    if (!isHome) return;
    isMobile = innerWidth <= 700;
    targetW = isMobile ? innerWidth * 0.84 : Math.min(innerWidth * 0.72, 1150);
    targetH = targetW / 1.6;
    startH = isMobile ? Math.min(44, Math.max(34, innerWidth * 0.085)) : 80;
    startW = startH * 1.6;

    const t0 = words[0].style.transform;
    const t1 = words[1].style.transform;
    const tf = frame.style.transform;
    words[0].style.transform = '';
    words[1].style.transform = '';
    frame.style.transform = '';
    centerOffset = (words[0].offsetWidth - words[1].offsetWidth) / 2;
    words[0].style.transform = t0;
    words[1].style.transform = t1;
    frame.style.transform = tf;
  };
  measure();

  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (reduce.matches) {
      frame.style.width = ''; frame.style.height = ''; frame.style.transform = '';
      words.forEach(word => { word.style.transform = ''; word.style.opacity = ''; });
      return;
    }
    const bounds = hero.getBoundingClientRect();
    const distance = Math.max(1, hero.offsetHeight - innerHeight);
    if (bounds.bottom < 0 || bounds.top > innerHeight) {
      if (options.onUpdate) {
        const overall = bounds.top > innerHeight ? 0 : 1;
        options.onUpdate(overall, overall ? 1 : 0);
      }
      return;
    }

    const overall = Math.min(1, Math.max(0, -bounds.top / distance));

    // Pause background slideshow decoding & transitions while scrolling
    if (overall > 0.005) {
      slideshow.pause();
    } else {
      slideshow.resume();
    }

    if (options.origin) {
      const progress = overall;
      const isMob = innerWidth <= 768;
      const max = Math.min(innerWidth * (isMob ? .92 : .8) / 1.6, innerHeight * .72);
      frame.style.width = `${options.origin.frameWidth + progress * (max * 1.6 - options.origin.frameWidth)}px`;
      frame.style.height = `${options.origin.frameHeight + progress * (max - options.origin.frameHeight)}px`;
      const travel = isMob ? 12 : 28;
      words[0].style.transform = `translateX(${-progress * travel}vw)`;
      words[1].style.transform = `translateX(${progress * travel}vw)`;
      const fade = Math.max(0, 1 - progress * 1.8);
      words[0].style.opacity = String(fade);
      words[1].style.opacity = String(fade);
      const title = frame.parentElement;
      const currentCenter = options.origin.left + title.offsetWidth / 2;
      const currentY = options.origin.top + options.origin.height / 2;
      title.style.transform = `translate3d(${(innerWidth / 2 - currentCenter) * progress}px, ${(innerHeight / 2 - currentY) * progress}px, 0)`;
    } else if (isHome) {
      // Hermite smoothstep cubic easing: gentle acceleration, fluid flight, soft landing
      const rawP = Math.min(1, overall / 0.16);
      const p = rawP * rawP * (3 - 2 * rawP);
      const w = startW + p * (targetW - startW);
      const h = startH + p * (targetH - startH);
      const shiftX = -p * centerOffset;

      frame.style.width = `${w}px`;
      frame.style.height = `${h}px`;
      frame.style.transform = `translate3d(${shiftX}px, 0, 0)`;

      const travel = isMobile ? 14 : 26;
      words[0].style.transform = `translate3d(${-p * travel}vw, 0, 0)`;
      words[1].style.transform = `translate3d(${p * travel}vw, 0, 0)`;

      const textOpacity = Math.max(0, 1 - p * 1.3);
      words[0].style.opacity = String(textOpacity);
      words[1].style.opacity = String(textOpacity);

      if (options.onUpdate) {
        options.onUpdate(overall, p);
      }
    } else {
      applyOpeningProgress(frame, words, overall);
    }
  };

  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  const onResize = () => { measure(); schedule(); };
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', onResize, {passive: true});
  reduce.addEventListener('change', schedule);
  update();
  return slideshow;
}
