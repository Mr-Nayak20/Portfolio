import gsap from 'gsap';
import {services, shot, studies, notes} from './data.js';
import {esc} from './shell.js';

const plate = s => s.poster || shot(s.image);

export function home() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bgs = document.getElementById('bgs');
  const strip = document.getElementById('strip');
  const link = document.getElementById('hero-link');
  const label = document.getElementById('view-label');
  bgs.innerHTML = studies.map((s, i) =>
    `<img class="bg-img" src="${shot(s.slug)}" alt="" style="opacity:${i === 0 ? 1 : 0}">`
  ).join('');
  strip.innerHTML = studies.map((s, i) =>
    `<button class="gallery-item${i === 0 ? ' active' : ''}" type="button" data-i="${i}" aria-label="${esc(s.name)}"><img src="${shot(s.slug)}" alt=""></button>`
  ).join('');

  let index = 0;
  let timer = null;
  let resume = null;
  const imgs = [...bgs.querySelectorAll('img')];
  const thumbs = [...strip.querySelectorAll('button')];

  function show(i) {
    const next = (i + studies.length) % studies.length;
    if (next === index && imgs[index].style.opacity === '1') return;
    index = next;
    imgs.forEach((img, n) => {
      gsap.to(img, {opacity: n === index ? 1 : 0, duration: reduce ? 0 : 0.55, ease: 'power2.out', overwrite: 'auto'});
    });
    thumbs.forEach((t, n) => t.classList.toggle('active', n === index));
    const s = studies[index];
    link.href = `/works/${s.slug}/`;
    link.setAttribute('aria-label', `View ${s.name}`);
    const thumb = thumbs[index];
    const rail = strip.getBoundingClientRect();
    const box = thumb.getBoundingClientRect();
    if (box.left < rail.left || box.right > rail.right) {
      thumb.scrollIntoView({inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth'});
    }
  }

  function arm(delay = 3500) {
    if (reduce) return;
    clearInterval(timer);
    clearTimeout(resume);
    resume = setTimeout(() => {
      timer = setInterval(() => show(index + 1), 3500);
    }, delay);
  }
  arm(3500);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearInterval(timer); clearTimeout(resume); }
    else arm(3500);
  });
  strip.addEventListener('mouseenter', () => { clearInterval(timer); clearTimeout(resume); });
  strip.addEventListener('mouseleave', () => arm(5000));
  thumbs.forEach(btn => {
    btn.addEventListener('mouseenter', () => show(Number(btn.dataset.i)));
    btn.addEventListener('click', () => { show(Number(btn.dataset.i)); arm(5000); });
  });

  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', e => {
    const onStrip = e.target.closest('.gallery-strip');
    label.style.setProperty('--x', e.clientX + 'px');
    label.style.setProperty('--y', e.clientY + 'px');
    label.classList.toggle('is-visible', !onStrip);
  });
  hero.addEventListener('mouseleave', () => label.classList.remove('is-visible'));

  const chapters = document.getElementById('chapters');
  chapters.innerHTML = services.map(s => `
    <a class="service-chapter" href="/services/${s.id}/">
      <img class="service-bg-img" src="${plate(s)}" alt="">
      <div class="service-card"><img src="${plate(s)}" alt=""><span>(more information)</span></div>
      <div class="service-copy"><h3>${esc(s.name)}</h3><p>${esc(s.line)}</p></div>
    </a>`).join('');

  const cards = [...chapters.querySelectorAll('.service-chapter')];
  const copies = [...chapters.querySelectorAll('.service-copy')];
  const mark = () => {
    let best = 0;
    let bestDelta = Infinity;
    const visible = [];
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const img = card.querySelector('.service-bg-img');
      const span = r.height + innerHeight;
      const progress = span ? (innerHeight - r.top) / span : 0;
      const y = (progress - 0.5) * innerHeight * 0.36;
      img.style.transform = `translate3d(0, ${y}px, 0)`;
      if (r.top < innerHeight * 0.92 && r.bottom > innerHeight * 0.18) visible.push(i);
      const delta = Math.abs(r.top + r.height * 0.35 - innerHeight * 0.45);
      if (delta < bestDelta) { bestDelta = delta; best = i; }
    });
    copies.forEach((c, i) => c.classList.toggle('is-on', visible.includes(i) && i === best));
  };
  mark();
  window.addEventListener('scroll', mark, {passive: true});
  const follow = () => { mark(); requestAnimationFrame(follow); };
  requestAnimationFrame(follow);
  cards.forEach(card => {
    const float = card.querySelector('.service-card');
    const xTo = gsap.quickTo(float, 'x', {duration: reduce ? 0 : 0.6, ease: 'power3.out'});
    const yTo = gsap.quickTo(float, 'y', {duration: reduce ? 0 : 0.6, ease: 'power3.out'});
    card.addEventListener('mouseenter', () => {
      gsap.to(float, {opacity: 1, scale: 1, duration: reduce ? 0 : 0.45, ease: 'power2.out', overwrite: 'auto'});
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(float, {opacity: 0, scale: 0.5, duration: reduce ? 0 : 0.35, overwrite: 'auto'});
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      xTo(e.clientX - r.left - float.offsetWidth / 2);
      yTo(e.clientY - r.top - float.offsetHeight * 0.85);
    });
  });

  const row = document.getElementById('notes');
  row.innerHTML = notes.map(n => `
    <a class="blog-card" href="/blog/${n.slug}/">
      <div class="img-box"><img src="${shot(n.image)}" alt=""></div>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.dek)}</p>
      <div class="more"><i></i><span>${esc(n.author)} · ${n.minutes} min read</span></div>
    </a>`).join('');
  if (!reduce) {
    gsap.from(row.children, {y: 36, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.15});
    document.querySelectorAll('.sentence, .aboutus .html-content').forEach(el => {
      gsap.set(el, {y: 32, opacity: 0});
      const watch = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        watch.disconnect();
        gsap.to(el, {y: 0, opacity: 1, duration: 0.9, ease: 'power3.out'});
      }, {threshold: 0.4});
      watch.observe(el);
    });
  }

  const track = document.getElementById('marquee');
  const names = studies.map(s => `<span class="wordmark">${esc(s.name)}</span>`).join('');
  track.innerHTML = names + names;
}
