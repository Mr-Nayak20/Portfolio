import gsap from 'gsap';
import {services, shot, studies, notes} from './data.js';
import {esc} from './shell.js';

const preview = (slug, sizes = '100vw', eager = false) => `<img src="${shot(slug)}" srcset="/img/index/${slug}-320.webp 320w, /img/index/${slug}-640.webp 640w, ${shot(slug)} 1280w" sizes="${sizes}" alt="${esc(studies.find(s => s.slug === slug)?.name || slug)} website study" width="1280" height="800" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

export function home() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const bgs = document.getElementById('bgs');
  const strip = document.getElementById('strip');
  const link = document.getElementById('hero-link');
  const label = document.getElementById('view-label');
  const title = document.querySelector('.hero-title');
  // Two composited layers, never twenty full-viewport textures.
  bgs.innerHTML = preview(studies[0].slug, '100vw', true) + '<img alt="" decoding="async" width="1280" height="800">';
  const imgs = [...bgs.children];
  imgs.forEach((img, i) => {img.className = 'bg-img'; img.style.opacity = i === 0 ? '1' : '0';});
  strip.innerHTML = studies.map((s, i) => `<button class="gallery-item${i === 0 ? ' active' : ''}" type="button" data-i="${i}" aria-label="Preview ${esc(s.name)}" aria-pressed="${i === 0}"><img src="/img/index/${s.slug}-320.webp" alt="" width="66" height="66" decoding="async"></button>`).join('');
  const thumbs = [...strip.children];
  let index = 0, layer = 0, request = 0, timer, heroVisible = true;
  async function show(i, manual = false) {
    const next = (i + studies.length) % studies.length;
    if (manual) title.classList.add('is-hidden');
    if (next === index) return;
    const token = ++request;
    const candidate = new Image();
    candidate.src = shot(studies[next].slug);
    try {await candidate.decode();} catch {return;}
    if (token !== request) return;
    const outgoing = imgs[layer], incoming = imgs[1 - layer];
    incoming.removeAttribute('srcset'); incoming.removeAttribute('sizes');
    incoming.src = candidate.src;
    incoming.alt = `${studies[next].name} website study`;
    gsap.killTweensOf(imgs);
    gsap.set(incoming, {zIndex: 1, opacity: 0});
    gsap.set(outgoing, {zIndex: 0, opacity: 1});
    gsap.to(incoming, {opacity: 1, duration: reduce ? 0 : .45, ease: 'power2.out', onComplete: () => gsap.set(outgoing, {opacity: 0})});
    layer = 1 - layer; index = next;
    thumbs.forEach((t, n) => {t.classList.toggle('active', n === index); t.setAttribute('aria-pressed', String(n === index));});
    link.href = `/works/${studies[index].slug}/`;
    link.setAttribute('aria-label', `View ${studies[index].name}`);
    if (manual) title.classList.add('is-hidden');
    // Scroll the rail only; scrollIntoView also moves the whole document.
    const thumb = thumbs[index];
    if (thumb.offsetLeft < strip.scrollLeft || thumb.offsetLeft + thumb.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2, behavior: reduce ? 'instant' : 'smooth'});
    }
  }
  function arm(delay = 5000) {
    clearTimeout(timer);
    if (reduce || document.hidden || !heroVisible) return;
    timer = setTimeout(async () => {await show(index + 1); arm(3500);}, delay);
  }
  const hero = document.querySelector('.hero');
  new IntersectionObserver(([entry]) => {heroVisible = entry.isIntersecting; arm();}, {threshold: .05}).observe(hero);
  document.addEventListener('visibilitychange', () => arm());
  strip.addEventListener('pointerenter', () => clearTimeout(timer));
  strip.addEventListener('pointerleave', () => arm());
  thumbs.forEach(btn => {
    btn.addEventListener('pointerenter', () => {if (fine) show(Number(btn.dataset.i), true);});
    btn.addEventListener('focus', () => {clearTimeout(timer); show(Number(btn.dataset.i), true);});
    btn.addEventListener('click', () => {show(Number(btn.dataset.i), true); arm();});
  });
  if (fine && !reduce) {
    hero.addEventListener('pointermove', e => {
      label.style.setProperty('--x', e.clientX + 'px'); label.style.setProperty('--y', e.clientY + 'px');
      label.classList.toggle('is-visible', !e.target.closest('.gallery-strip'));
    }, {passive: true});
    hero.addEventListener('pointerleave', () => label.classList.remove('is-visible'));
  }

  const chapters = document.getElementById('chapters');
  chapters.innerHTML = services.map(s => `<a class="service-chapter" href="/services/${s.id}/" aria-label="Explore ${esc(s.name)}">
    <div class="service-background">${preview(s.image)}</div>
    <div class="service-card">${preview(s.image, '338px')}<span>(more information)</span></div>
    <div class="service-copy"><h3>${esc(s.name)}</h3></div></a>`).join('');
  const cards = [...chapters.children];
  const images = cards.map(c => c.querySelector('.service-background'));
  let frame = 0;
  const mark = () => {
    frame = 0;
    // Read all rectangles before changing any transforms; no work while idle.
    const rects = cards.map(card => card.getBoundingClientRect());
    rects.forEach((r, i) => {
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      const progress = (innerHeight - r.top) / (r.height + innerHeight);
      images[i].style.transform = reduce || !fine ? '' : `translate3d(0, ${(progress - .5) * innerHeight * .36}px, 0)`;
    });
  };
  const schedule = () => {if (!frame) frame = requestAnimationFrame(mark);};
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  mark();
  if (fine && !reduce) cards.forEach(card => {
    const float = card.querySelector('.service-card');
    const xTo = gsap.quickTo(float, 'x', {duration: .45, ease: 'power3.out'});
    const yTo = gsap.quickTo(float, 'y', {duration: .45, ease: 'power3.out'});
    let bounds, width, height, documentTop;
    card.addEventListener('pointerenter', () => {
      bounds = card.getBoundingClientRect(); documentTop = bounds.top + scrollY; width = float.offsetWidth; height = float.offsetHeight;
      gsap.to(float, {opacity: 1, scale: 1, duration: .3, overwrite: 'auto'});
    });
    card.addEventListener('pointerleave', () => gsap.to(float, {opacity: 0, scale: .85, duration: .2, overwrite: 'auto'}));
    card.addEventListener('pointermove', e => {
      if (!bounds) return;
      // Offset the cached top by scroll movement without forcing another layout.
      xTo(e.clientX - bounds.left - width / 2); yTo(e.clientY + scrollY - documentTop - height * .85);
    }, {passive: true});
  });

  const row = document.getElementById('notes');
  row.innerHTML = notes.map(n => `<a class="blog-card" href="/blog/${n.slug}/"><div class="img-box">${preview(n.image, '(max-width: 576px) 71vw, (max-width: 992px) 50vw, 25vw')}</div><h3>${esc(n.title)}</h3><p>${esc(n.dek)}</p><div class="more"><i></i><span>${esc(n.author)} · ${n.minutes} min read</span></div></a>`).join('');
  if (!reduce) {
    const watch = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.fromTo(entry.target, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: .6, ease: 'power2.out'});
      watch.unobserve(entry.target);
    }), {threshold: .15});
    document.querySelectorAll('.sentence, .blog-card').forEach(el => watch.observe(el));
  }
  const track = document.getElementById('marquee');
  const names = studies.slice(0, 10).map(s => `<a class="wordmark" href="/works/${s.slug}/">${esc(s.name)}</a>`).join('');
  track.innerHTML = names + names;
  new IntersectionObserver(([entry]) => {track.style.animationPlayState = entry.isIntersecting && !document.hidden ? 'running' : 'paused';}).observe(track);
}
