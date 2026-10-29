import {applyOpeningProgress} from './expanding-opening.js';
export function intelligence() {
  const hero = document.querySelector('.intelligence-opening');
  let direct = null;
  try { const stored = sessionStorage.getItem('intelligence-direct'); if (stored !== null) direct = Number(stored); sessionStorage.removeItem('intelligence-direct'); } catch {}
  let origin = null;
  try { const value = JSON.parse(sessionStorage.getItem('service-opening-origin') || 'null'); if (value?.target === '/services/ai/') origin = value; sessionStorage.removeItem('service-opening-origin'); } catch {}
  const frame = hero.querySelector('.services-hero__image');
  if (origin) { const title = hero.querySelector('.services-hero__title'); Object.assign(title.style, {position:'absolute',left:`${origin.left}px`,top:`${origin.top}px`,fontSize:origin.font,lineHeight:'1.08'}); window.scrollTo(0,0); }
  const words = [frame.previousElementSibling, frame.nextElementSibling];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const journey = document.querySelector('.intelligence-journey');
  const stage = journey.querySelector('.intelligence-stage');
  let scenes = [...journey.querySelectorAll('.intelligence-scene')];
  const dots = [...journey.querySelectorAll('.intelligence-progress span')];
  const openingImage = frame.querySelector('img');
  const mascots = ['/img/intelligence/scout.png', '/img/intelligence/orb.svg', '/img/intelligence/star.svg'];
  let mascotIndex = 0, locked = false;
  const timer = setInterval(() => {
    const bounds = hero.getBoundingClientRect();
    if (document.hidden || reduce.matches || locked || bounds.bottom <= innerHeight * .5) return;
    mascotIndex = (mascotIndex + 1) % mascots.length;
    openingImage.src = mascots[mascotIndex];
  }, 900);
  addEventListener('pagehide', () => clearInterval(timer));
  const techNames = {nextdotjs:'Next.js', react:'React', typescript:'TypeScript', gsap:'GSAP', framer:'Framer', vite:'Vite', nodedotjs:'Node.js', express:'Express', webgl:'WebGL', prisma:'Prisma', postgresql:'PostgreSQL'};
  document.querySelectorAll('.tech-logos').forEach(group => {
    group.innerHTML = group.dataset.tech.split(',').map(id => `<span class="tech-logo" title="${techNames[id]}"><img src="https://cdn.simpleicons.org/${id}" alt="${techNames[id]}"><span>${techNames[id]}</span></span>`).join('');
  });
  let letters = scenes.map(scene => {
    const copy = scene.querySelector('.intelligence-scene__copy');
    const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    copy.querySelectorAll('h2,p,small,span:not(.tech-logo span)').forEach(element => { if (!element.closest('.tech-logos')) element.setAttribute('aria-label', element.textContent.trim()); });
    const result = [];
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { fragment.append(document.createTextNode(part)); return; }
        const word = document.createElement('span'); word.className = 'scene-word'; word.setAttribute('aria-hidden', 'true');
        word.textContent = part; word.dataset.original = part; fragment.append(word); result.push(word);
      });
      node.replaceWith(fragment);
    });
    return result;
  });
  if (direct !== null && direct >= 0 && direct < scenes.length) {
    const pairs = scenes.map((scene, index) => ({scene, letters: letters[index]}));
    const rotated = pairs.slice(direct).concat(pairs.slice(0, direct));
    scenes = rotated.map(item => item.scene); letters = rotated.map(item => item.letters);
  }
  if (direct !== null) {
    history.scrollRestoration = 'manual'; hero.hidden = true; window.scrollTo(0, 0);
    scenes.forEach((scene, index) => { scene.style.opacity = index === 0 ? '1' : '0'; scene.classList.toggle('is-current', index === 0); });
    const target = scenes[0].querySelector('.mascot');
    const copy = document.createElement('img');
    copy.src = mascots[direct]; copy.alt = '';
    const startHeight = Math.min(innerWidth * .8 / 1.6, innerHeight * .72);
    Object.assign(copy.style, {position:'fixed', zIndex:'4000', width:`${startHeight}px`, height:`${startHeight}px`, left:`${(innerWidth-startHeight)/2}px`, top:`${(innerHeight-startHeight)/2}px`, objectFit:'contain', pointerEvents:'none'});
    document.body.append(copy);
    target.style.visibility = 'hidden';
    requestAnimationFrame(() => {
      const end = target.getBoundingClientRect();
      const animation = copy.animate([{left:`${(innerWidth-startHeight)/2}px`,top:`${(innerHeight-startHeight)/2}px`,width:`${startHeight}px`,height:`${startHeight}px`},{left:`${end.left}px`,top:`${end.top}px`,width:`${end.width}px`,height:`${end.height}px`}], {duration:650,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
      animation.finished.then(() => { target.style.visibility = ''; copy.remove(); });
    });
  }
  let queued = false;
  let lastScrambleFrame = '';
  function update() {
    queued = false;
    const heroRect = hero.getBoundingClientRect();
    if (!reduce.matches && heroRect.bottom > 0 && heroRect.top < innerHeight) {
      const progress = Math.max(0, Math.min(1, -heroRect.top / Math.max(1, heroRect.height - innerHeight)));
      if (progress > .08 && !locked) {
        locked = true;
        const pairs = scenes.map((scene, index) => ({scene, letters: letters[index]}));
        const rotated = pairs.slice(mascotIndex).concat(pairs.slice(0, mascotIndex));
        scenes = rotated.map(item => item.scene);
        letters = rotated.map(item => item.letters);
      } else if (progress < .02) locked = false;
      if (origin) {
        const max = Math.min(innerWidth * .8 / 1.6, innerHeight * .72);
        frame.style.width = `${origin.frameWidth + progress * (max * 1.6 - origin.frameWidth)}px`;
        frame.style.height = `${origin.frameHeight + progress * (max - origin.frameHeight)}px`;
        words[0].style.transform = `translateX(${-progress * 28}vw)`;
        words[1].style.transform = `translateX(${progress * 28}vw)`;
        const title = frame.parentElement;
        title.style.transform = `translate3d(${(innerWidth / 2 - origin.left - title.offsetWidth / 2) * progress}px, ${(innerHeight / 2 - origin.top - origin.height / 2) * progress}px, 0)`;
      } else applyOpeningProgress(frame, words, progress);
    }
    if (reduce.matches) return;
    const rect = journey.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
    const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
    const first = smooth((progress - .18) / .20);
    const second = smooth((progress - .61) / .20);
    const weights = [1 - first, first * (1 - second), second];
    const active = weights.indexOf(Math.max(...weights));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const frameKey = Math.floor((first + second) * 8);
    const stateKey = frameKey + ':' + weights.map(weight => weight <= .02 ? 'hidden' : weight >= .98 ? 'settled' : 'moving').join(',');
    const lettersNeedUpdate = stateKey !== lastScrambleFrame;
    lastScrambleFrame = stateKey;
    scenes.forEach((scene, index) => {
      const weight = weights[index];
      scene.style.opacity = String(weight);
      scene.querySelector('.intelligence-scene__copy').style.visibility = index === active ? 'visible' : 'hidden';
      if (lettersNeedUpdate && weight > .001) letters[index].forEach((letter, i) => {
        const original = letter.dataset.original;
        const scrambling = weight > .02 && weight < .98;
        const cycle = frameKey;
        const next = scrambling ? [...original].map((char, j) => {
          if (!/[a-z]/i.test(char)) return char;
          const symbol = alphabet[(i * 13 + j * 11 + cycle * 7 + index * 3) % alphabet.length];
          return char === char.toLowerCase() ? symbol.toLowerCase() : symbol;
        }).join('') : original;
        if (letter.textContent !== next) letter.textContent = next;
      });
      scene.classList.toggle('is-current', index === active);
    });
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
  }
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce.matches) {
    let pointerFrame = 0, x = 0, y = 0;
    stage.addEventListener('pointermove', event => {
      x = (event.clientX / innerWidth - .5) * 2; y = (event.clientY / innerHeight - .5) * 2;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const current = stage.querySelector('.intelligence-scene.is-current .mascot');
        if (current) { current.style.setProperty('--look-x', `${x * 9}px`); current.style.setProperty('--look-y', `${y * 7}px`); current.style.setProperty('--look-rotate', `${x * 5}deg`); }
      });
    }, {passive:true});
    stage.addEventListener('pointerleave', () => stage.querySelectorAll('.mascot').forEach(mascot => { mascot.style.setProperty('--look-x','0px'); mascot.style.setProperty('--look-y','0px'); mascot.style.setProperty('--look-rotate','0deg'); }));
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  // A wheel gesture advances exactly one settled scene while the stage is pinned.
  // Native scrolling remains available before and after the journey.
  if (!reduce.matches && matchMedia('(pointer:fine)').matches) {
    let animating = false, lastGesture = 0;
    addEventListener('wheel', event => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const top = journey.getBoundingClientRect().top + scrollY;
      const distance = Math.max(1, journey.offsetHeight - innerHeight);
      const position = (scrollY - top) / distance;
      if (position < -.01 || position > 1.01) return;
      const direction = Math.sign(event.deltaY);
      if (!direction || (direction < 0 && position <= .001) || (direction > 0 && position >= .999)) return;
      event.preventDefault();
      if (animating || performance.now() - lastGesture < 1000) return;
      lastGesture = performance.now();
      const current = Math.max(0, Math.min(2, Math.round(position * 2)));
      const next = Math.max(0, Math.min(2, current + direction));
      const start = scrollY, end = top + distance * next / 2, started = performance.now();
      animating = true;
      const move = now => {
        const t = Math.min(1, (now - started) / 850);
        const eased = t * t * (3 - 2 * t);
        window.scrollTo(0, start + (end - start) * eased);
        if (t < 1) requestAnimationFrame(move); else animating = false;
      };
      requestAnimationFrame(move);
    }, {passive:false});
  }
  update();
}
