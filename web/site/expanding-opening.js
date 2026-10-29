import {studySlideshow} from './study-slideshow.js';

export function applyOpeningProgress(frame, words, progress, start = innerWidth <= 768 ? 54 : 80) {
  const max = Math.min(innerWidth * .8 / 1.6, innerHeight * .72);
  const size = start + progress * (max - start);
  frame.style.width = `${size * 1.6}px`;
  frame.style.height = `${size}px`;
  words[0].style.transform = `translateX(${-progress * 28}vw)`;
  words[1].style.transform = `translateX(${progress * 28}vw)`;
}

export function expandingOpening(hero, options = {}) {
  if (!hero) return;
  const frame = hero.querySelector('.services-hero__image');
  const words = [...frame.parentElement.children].filter(element => element !== frame);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const slideshow = studySlideshow(hero, [frame.querySelector('img')], options);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (reduce.matches) {
      frame.style.width = ''; frame.style.height = '';
      words.forEach(word => {word.style.transform = '';});
      return;
    }
    const bounds = hero.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) return;
    const distance = Math.max(1, hero.offsetHeight - innerHeight);
    const overall = Math.min(1, Math.max(0, -bounds.top / distance));
    const progress = hero.classList.contains('home-opening') ? Math.min(1, overall / .16) : overall;
    if (options.origin) {
      const max = Math.min(innerWidth * .8 / 1.6, innerHeight * .72);
      frame.style.width = `${options.origin.frameWidth + progress * (max * 1.6 - options.origin.frameWidth)}px`;
      frame.style.height = `${options.origin.frameHeight + progress * (max - options.origin.frameHeight)}px`;
      words[0].style.transform = `translateX(${-progress * 28}vw)`;
      words[1].style.transform = `translateX(${progress * 28}vw)`;
      const title = frame.parentElement;
      const currentCenter = options.origin.left + title.offsetWidth / 2;
      const currentY = options.origin.top + options.origin.height / 2;
      title.style.transform = `translate3d(${(innerWidth / 2 - currentCenter) * progress}px, ${(innerHeight / 2 - currentY) * progress}px, 0)`;
    } else applyOpeningProgress(frame, words, progress);
  };
  const schedule = () => {if (!scheduled) {scheduled = true; requestAnimationFrame(update);}};
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  reduce.addEventListener('change', schedule);
  update();
  return slideshow;
}
