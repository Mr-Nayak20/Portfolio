import gsap from 'gsap';
import {services, shot, shotSrcset, studies, notes} from './data.js';
import {esc} from './shell.js';
import {studySlideshow} from './study-slideshow.js';
import {expandingOpening, applyOpeningProgress} from './expanding-opening.js';

const preview = (slug, sizes = '100vw', eager = false) => `<img src="${shot(slug)}" srcset="${shotSrcset(slug)}" sizes="${sizes}" alt="${esc(studies.find(s => s.slug === slug)?.name || slug)} website study" width="1920" height="1200" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

export function home() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const opening = document.querySelector('.home-opening');
  const imageLink = document.getElementById('hero-image-link');
  const slideshow = expandingOpening(opening, {interval: 1800, onChange(study) {
    imageLink.href = `/examples/${study.slug}/`;
    imageLink.setAttribute('aria-label', `View ${study.name}`);
  }});
  [imageLink].forEach(target => {
    target.addEventListener('pointerenter', () => slideshow.pause());
    target.addEventListener('pointerleave', () => {if (!target.matches(':focus')) slideshow.resume();});
    target.addEventListener('focus', () => slideshow.pause());
    target.addEventListener('blur', () => {if (!target.matches(':hover')) slideshow.resume();});
  });

  const stack = document.querySelector('.home-stack');
  const stackCards = stack.querySelector('.home-stack__cards');
  const stackStudies = [...studies];
  for (let i = stackStudies.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [stackStudies[i], stackStudies[j]] = [stackStudies[j], stackStudies[i]]; }
  stackCards.innerHTML = stackStudies.map((study, index) => `<a class="home-stack__card" href="/examples/${study.slug}/" aria-label="Explore ${esc(study.name)}" data-index="${index}"><img src="${shot(study.slug)}" srcset="${shotSrcset(study.slug)}" sizes="(max-width: 700px) 90vw, 72vw" alt="${esc(study.name)} website homepage" width="1920" height="1200" loading="lazy" decoding="async"></a>`).join('');
  const stackItems = [...stackCards.children];
  let stackFrame = 0, stackActive = -1, stackStarted = false;
  function updateStack() {
    stackFrame = 0;
    const rect = opening.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const overall = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
    const reveal = Math.max(0, Math.min(1, (overall - .14) / .04));
    stack.style.opacity = String(reveal);
    stack.style.pointerEvents = reveal > .95 ? 'auto' : 'none';
    opening.querySelector('.services-hero__title').style.opacity = String(1 - reveal);
    if (!stackStarted && overall >= .14) {
      const heroImage = imageLink.querySelector('img');
      const firstImage = stackItems[0].querySelector('img');
      firstImage.srcset = heroImage.srcset; firstImage.src = heroImage.currentSrc || heroImage.src;
      stackItems[0].href = imageLink.href; stackItems[0].setAttribute('aria-label', imageLink.getAttribute('aria-label'));
      stackStarted = true;
    }
    const progress = Math.max(0, Math.min(1, (overall - .18) / .82));
    const position = progress * (stackStudies.length - 1);
    const active = Math.min(stackStudies.length - 1, Math.floor(position));
    const fraction = position - active;
    stackItems.forEach((item, index) => {
      const distance = index - active;
      const visible = distance >= 0 && distance <= 3;
      item.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) return;
      item.style.zIndex = String(10 - distance);
      const leave = distance === 0 ? fraction : 0;
      const depth = Math.max(0, distance - fraction);
      item.style.transform = `translate3d(${leave * -22}%, ${leave * -35 - depth * 12}px, 0) rotate(${leave * -5 + depth * 1.2}deg) scale(${1 - depth * .045})`;
      item.style.opacity = String(distance === 0 ? 1 - leave : 1);
      if (active !== stackActive) item.tabIndex = distance === 0 ? 0 : -1;
    });
    stackActive = active;
  }
  const scheduleStack = () => { if (!stackFrame) stackFrame = requestAnimationFrame(updateStack); };
  addEventListener('scroll', scheduleStack, {passive:true}); addEventListener('resize', scheduleStack);
  if (fine && !reduce) stackCards.addEventListener('pointermove', event => {
    const bounds = stackCards.getBoundingClientRect();
    stackCards.style.setProperty('--pointer-x', `${(event.clientX - bounds.left) / bounds.width - .5}`);
    stackCards.style.setProperty('--pointer-y', `${(event.clientY - bounds.top) / bounds.height - .5}`);
  }, {passive:true});
  stackCards.addEventListener('pointerleave', () => { stackCards.style.setProperty('--pointer-x', '0'); stackCards.style.setProperty('--pointer-y', '0'); });
  updateStack();

  const about = document.querySelector('.what-we-do');
  const sentence = about.querySelector('.sentence');
  if (!reduce) {
    sentence.setAttribute('aria-label', sentence.textContent.trim());
    const walker = document.createTreeWalker(sentence, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const words = [];
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { fragment.append(document.createTextNode(part)); return; }
        const word = document.createElement('span');
        word.className = 'about-word'; word.setAttribute('aria-hidden', 'true');
        [...part].forEach((letter, i) => {
          const char = document.createElement('span'); char.className = 'about-letter';
          char.textContent = letter; char.dataset.tilt = String(((words.length * 17 + i * 29) % 81) - 40);
          word.append(char);
        });
        fragment.append(word); words.push(word);
      });
      node.replaceWith(fragment);
    });
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = words.map(word => [...word.children].map(char => ({element: char, final: char.textContent})));
    let queued = false;
    const states = new Array(letters.length).fill(-1);
    const updateAbout = () => {
      queued = false;
      const rect = about.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const distance = Math.max(1, rect.height - innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      letters.forEach((word, index) => {
        const phase = Math.max(0, Math.min(1, progress * (letters.length + 2) / .8 - index));
        const state = phase >= 1 ? 8 : Math.floor(phase * 7);
        if (states[index] === state) return;
        states[index] = state;
        word.forEach(({element, final}, letterIndex) => {
          if (!/[a-z]/i.test(final) || phase >= 1) {
            element.textContent = final;
            element.style.transform = '';
            element.style.opacity = '';
            return;
          }
          const cycle = Math.floor(phase * 7);
          const substitute = alphabet[(index * 7 + letterIndex * 11 + cycle * 5) % alphabet.length];
          element.textContent = final === final.toLowerCase() ? substitute.toLowerCase() : substitute;
          const flip = phase === 0 ? 0 : (state % 2 ? 28 : -28);
          element.style.transform = `rotateX(${flip}deg)`;
          element.style.opacity = '.65';
        });
      });
    };
    const scheduleAbout = () => { if (!queued) { queued = true; requestAnimationFrame(updateAbout); } };
    window.addEventListener('scroll', scheduleAbout, {passive: true});
    window.addEventListener('resize', scheduleAbout, {passive: true});
    updateAbout();
  }

  if (fine) {
    const preview = document.getElementById('hover-photo');
    document.body.append(preview);
    const items = [...sentence.querySelectorAll('.hover')];
    const mascotImages = ['/img/intelligence/scout.png', '/img/intelligence/orb.svg', '/img/intelligence/star.svg'];
    let timer = 0, index = 0, current = null;
    function showNext() {
      if (!current) return;
      if (current.dataset.img === 'velocity') { const study = studies[index % studies.length]; preview.srcset = shotSrcset(study.slug); preview.sizes = '240px'; preview.src = shot(study.slug); }
      else { preview.removeAttribute('srcset'); preview.src = mascotImages[index % mascotImages.length]; }
      index++;
    }
    function start(item) { current = item; index = 0; preview.classList.toggle('is-mascot', item.dataset.img !== 'velocity'); showNext(); preview.classList.add('is-visible'); clearInterval(timer); if (!reduce) timer = setInterval(showNext, 650); }
    function stop() { current = null; clearInterval(timer); preview.classList.remove('is-visible'); }
    items.forEach(item => {
      item.addEventListener('pointerenter', () => start(item));
      item.addEventListener('pointerleave', stop);
      item.addEventListener('pointermove', event => { preview.style.transform = `translate3d(${Math.min(innerWidth - 200, event.clientX + 24)}px, ${Math.min(innerHeight - 140, event.clientY + 24)}px, 0)`; }, {passive:true});
    });
  }

  const chapters = document.getElementById('chapters');
  const phrases = {
    websites: ['Websites', 'I build'],
    ai: ['Intelligence', 'put to work.']
  };
  chapters.innerHTML = `<div class="services-index">${services.map(service => {
    const phrase = phrases[service.id];
    const poster = service.id === 'websites' ? shot(studies[0].slug) : '/img/intelligence/orb.svg';
    return `<a class="service-line" href="/services/${esc(service.id)}/" aria-label="Explore ${esc(service.name)}"><span>${phrase[0]}</span><span class="service-line__image"><img src="${poster}" alt="" loading="lazy" decoding="async"></span><span>${phrase[1]}</span></a>`;
  }).join('')}</div>`;
  const aiImage = chapters.querySelector('a[href="/services/ai/"] .service-line__image img');
  const aiMascots = ['/img/intelligence/scout.png', '/img/intelligence/orb.svg', '/img/intelligence/star.svg'];
  let aiMascotIndex = 1, aiTransitioning = false;
  setInterval(() => {
    if (document.hidden || reduce || !aiImage || aiTransitioning) return;
    aiMascotIndex = (aiMascotIndex + 1) % aiMascots.length;
    aiImage.src = aiMascots[aiMascotIndex];
  }, 900);
  window.addEventListener('pageshow', () => {
    aiTransitioning = false;
    document.querySelectorAll('.service-opening-transition').forEach(layer => layer.remove());
    chapters.querySelectorAll('.service-line').forEach(line => { line.style.visibility = ''; line.getAnimations().forEach(animation => animation.cancel()); });
  });
  chapters.querySelectorAll('.service-line').forEach(link => {
    link.addEventListener('click', event => {
      if (reduce || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (link.getAttribute('href') === '/services/ai/') {
        aiTransitioning = true;
        const selected = aiMascotIndex;
        try { sessionStorage.setItem('intelligence-direct', String(selected)); } catch {}
        const line = link.cloneNode(true);
        line.removeAttribute('href');
        const box = link.getBoundingClientRect();
        const layer = document.createElement('div'); layer.className = 'service-opening-transition service-opening-transition--ai';
        line.className = 'service-opening-transition__title';
        layer.append(line); document.body.append(layer);
        const startX = box.left + box.width / 2 - innerWidth / 2;
        const startY = box.top + box.height / 2 - innerHeight / 2;
        const image = line.children[1], words = [line.children[0], line.children[2]];
        link.style.visibility = 'hidden';
        const begin = performance.now();
        function animate(now) {
          const raw = Math.min(1, (now - begin) / 1000), progress = 1 - Math.pow(1 - raw, 3);
          line.style.transform = `translate(${startX * (1 - progress)}px, ${startY * (1 - progress)}px)`;
          applyOpeningProgress(image, words, progress, 50);
          if (raw < 1) requestAnimationFrame(animate); else location.href = link.href;
        }
        requestAnimationFrame(animate);
        return;
      }
      const others = [...chapters.querySelectorAll('.service-line')].filter(line => line !== link);
      others.forEach(line => line.animate([{opacity: 1}, {opacity: 0}], {duration: 700, easing: 'ease-in-out', fill: 'forwards'}));
      const first = link.children[0].getBoundingClientRect();
      const frame = link.children[1].getBoundingClientRect();
      const font = getComputedStyle(link).fontSize;
      const source = link.querySelector('img').currentSrc || link.querySelector('img').src;
      try { sessionStorage.setItem('service-opening-origin', JSON.stringify({left:first.left, top:first.top, height:first.height, frameWidth:frame.width, frameHeight:frame.height, font, source, target:link.getAttribute('href')})); } catch {}
      window.setTimeout(() => { location.href = link.href; }, 720);
    });
  });
  function imageSource(image) { return image.currentSrc || image.src; }
}
