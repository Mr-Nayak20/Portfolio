import gsap from 'gsap';
import {jobs, noteBySlug, notes, services, shot, studies, studyBySlug, profile} from './data.js';
import {esc} from './shell.js';

const plate = s => s.poster || shot(s.image);

const spots = [
  [5, 5, 0], [8, 4, 220], [2, 4, 120], [6, 3, 260], [3, 4, 80],
  [7, 4, 180], [2, 5, 40], [8, 3, 200], [4, 4, 140], [1, 4, 90],
  [6, 5, 240], [3, 3, 60], [8, 4, 160], [2, 4, 210], [5, 4, 30],
  [7, 3, 190], [3, 5, 110], [9, 3, 70], [1, 4, 250], [6, 4, 100]
];

export function about() {
  const list = document.getElementById('practice');
  const portrait = document.getElementById('portrait');
  list.innerHTML = services.map((s, i) => `
    <button class="team-item${i === 0 ? ' active' : ''}" type="button" data-img="${plate(s)}">
      <span class="role">${esc(s.line)}</span>
      <span class="name">${esc(s.name)}</span>
    </button>`).join('');
  portrait.src = plate(services[0]);
  list.querySelectorAll('.team-item').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (portrait.dataset.current === btn.dataset.img) return;
      list.querySelectorAll('.team-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      portrait.dataset.current = btn.dataset.img;
      gsap.to(portrait, {opacity: 0, duration: 0.18, overwrite: 'auto', onComplete: () => {
        portrait.src = btn.dataset.img;
        gsap.to(portrait, {opacity: 1, duration: 0.35, overwrite: 'auto'});
      }});
    });
  });

  const awards = document.getElementById('selected');
  const float = document.getElementById('award-float');
  awards.innerHTML = studies.slice(0, 8).map(s => `
    <a class="award-item" href="/works/${s.slug}/" data-img="${s.slug}">
      <span class="year">${s.year}</span>
      <strong>${esc(s.name)}</strong>
      <span>${esc(s.discipline)}</span>
    </a>`).join('');
  const floatX = gsap.quickTo(float, 'left', {duration: 0.35, ease: 'power3.out'});
  const floatY = gsap.quickTo(float, 'top', {duration: 0.35, ease: 'power3.out'});
  awards.querySelectorAll('.award-item').forEach(a => {
    a.addEventListener('mouseenter', () => {
      float.src = shot(a.dataset.img);
      gsap.fromTo(float, {opacity: 0, scale: 0.86, rotation: gsap.utils.random(-6, 6)}, {
        opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto'
      });
    });
    a.addEventListener('mousemove', e => {
      floatX(e.clientX);
      floatY(e.clientY);
    });
    a.addEventListener('mouseleave', () => gsap.to(float, {opacity: 0, duration: 0.2, overwrite: 'auto'}));
  });
}

export function servicesIndex() {
  const nav = document.getElementById('svc-nav');
  const blocks = document.getElementById('svc-blocks');
  const reel = document.getElementById('svc-reel');
  nav.innerHTML = services.map((s, i) => `<a href="#${s.id}" class="${i === 0 ? 'is-active' : ''}">${esc(s.name)}</a>`).join('');
  blocks.innerHTML = services.map(s => `
    <article class="service-block" id="${s.id}">
      <h2><a href="/services/${s.id}/">${esc(s.name)}</a></h2>
      <p>${esc(s.body)}</p>
      <ul>${s.items.map(([name]) => `<li>${esc(name)}</li>`).join('')}</ul>
      <a class="explore" href="/services/${s.id}/">(Explore ${esc(s.name)})</a>
    </article>`).join('');
  reel.innerHTML = services.map((s, i) => `<img src="${plate(s)}" alt="" class="${i === 0 ? 'is-on' : ''}" data-id="${s.id}">`).join('');

  const frame = document.getElementById('hero-frame');
  frame.querySelector('img').src = plate(services[0]);
  const title = frame.parentElement;
  const words = [...title.children].filter(el => el !== frame);
  const grow = () => {
    const hero = frame.closest('.services-hero');
    const total = Math.max(1, hero.offsetHeight - innerHeight);
    const y = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / total));
    const max = Math.min(innerWidth, innerHeight) * 0.72;
    const size = 80 + y * (max - 80);
    frame.style.width = size + 'px';
    frame.style.height = size + 'px';
    if (words[0]) words[0].style.transform = `translateX(${-y * 28}vw)`;
    if (words[1]) words[1].style.transform = `translateX(${y * 28}vw)`;
  };
  grow();
  window.addEventListener('scroll', grow, {passive: true});

  const articles = [...blocks.querySelectorAll('.service-block')];
  const links = [...nav.querySelectorAll('a')];
  const images = [...reel.querySelectorAll('img')];
  const watch = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.id;
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    images.forEach(img => img.classList.toggle('is-on', img.dataset.id === id));
  }, {threshold: 0.4});
  articles.forEach(a => watch.observe(a));
}

export function serviceDetail() {
  const id = document.body.dataset.service;
  const service = services.find(s => s.id === id) || services[0];
  document.getElementById('ss-title').textContent = service.name;
  document.getElementById('ss-line').textContent = service.body;
  document.getElementById('ss-img').src = plate(service);
  document.getElementById('ss-rows').innerHTML = service.items.map(([name, text]) => `
    <article class="ss-row">
      <h2>${esc(name)}</h2>
      <p>${esc(text)}</p>
      <button class="text-btn" type="button" data-open="project">(more information)</button>
    </article>`).join('');
  const others = services.filter(s => s.id !== service.id);
  document.getElementById('ss-more').innerHTML = others.map(s => `
    <div class="more-item">
      <button type="button">${esc(s.name)}</button>
      <div class="more-body"><p>${esc(s.line)}</p><a class="explore" href="/services/${s.id}/">(Explore)</a></div>
    </div>`).join('');
  document.getElementById('ss-more').addEventListener('click', e => {
    const btn = e.target.closest('.more-item > button');
    if (!btn) return;
    btn.parentElement.classList.toggle('is-open');
  });
}

export function works() {
  const root = document.getElementById('works');
  const grid = document.getElementById('work-grid');
  const shotEl = document.getElementById('list-shot');
  let filter = 'All';
  let mode = 'grid';

  function draw() {
    root.classList.toggle('grid', mode === 'grid');
    root.classList.toggle('list', mode === 'list');
    const items = studies.filter(s => filter === 'All' || s.discipline === filter);
    grid.innerHTML = items.map((s, i) => `
      <a class="card-link" href="/works/${s.slug}/" data-img="${s.slug}">
        <span class="idx">${String(i + 1).padStart(2, '0')}</span>
        <div class="img-box"><img src="${shot(s.slug)}" alt=""><span class="work-tag">${esc(s.tag)}</span></div>
        <h3>${esc(s.name)}</h3>
        <span class="tagline">${esc(s.discipline)}</span>
        <span class="year">${s.year}</span>
      </a>`).join('');
    if (mode === 'grid' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(grid.children, {y: 28, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', overwrite: 'auto'});
    }
  }
  document.getElementById('filters').addEventListener('click', e => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    filter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('is-active', b === btn));
    draw();
  });
  document.getElementById('views').addEventListener('click', e => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    mode = btn.dataset.view;
    document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('is-active', b === btn));
    draw();
  });
  grid.addEventListener('mouseover', e => {
    const card = e.target.closest('.card-link');
    if (!card || mode !== 'list') return;
    const r = card.getBoundingClientRect();
    shotEl.src = shot(card.dataset.img);
    shotEl.classList.add('is-on');
    gsap.fromTo(shotEl, {
      left: r.left + r.width * 0.42, top: r.top + 48, xPercent: -50, yPercent: 0, opacity: 0, rotation: gsap.utils.random(-10, 10), scale: 0.85
    }, {
      top: r.top - 36, yPercent: -100, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', overwrite: 'auto'
    });
  });
  grid.addEventListener('mouseleave', () => {
    gsap.to(shotEl, {opacity: 0, duration: 0.25, overwrite: 'auto', onComplete: () => shotEl.classList.remove('is-on')});
  });
  draw();
}

export function study() {
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const s = studyBySlug(slug === 'study.html' ? studies[0].slug : slug);
  const i = studies.findIndex(x => x.slug === s.slug);
  const next = studies[(i + 1) % studies.length];
  document.title = `${s.name} — Shivansh Nayak`;
  document.getElementById('study-hero').src = shot(s.slug);
  document.getElementById('study-title').textContent = s.name;
  document.getElementById('study-story').innerHTML = `<p>${esc(s.line)}</p><p>${esc(s.note)} It is a portfolio study, not a commercial brand.</p>`;
  document.getElementById('study-year').textContent = s.year;
  document.getElementById('study-disc').textContent = `${s.discipline} · ${s.tag}`;
  const visit = document.getElementById('study-visit');
  visit.href = `/examples/${s.slug}/`;
  document.getElementById('shot-a').src = shot(s.slug);
  document.getElementById('shot-b').src = shot(studies[(i + 2) % studies.length].slug);
  const nextLink = document.getElementById('next');
  nextLink.href = `/works/${next.slug}/`;
  nextLink.innerHTML = `<span class="label"><span>Next</span><span>${esc(next.name)}</span></span><div class="burst"></div>`;
  const burst = nextLink.querySelector('.burst');
  const pics = [next, studies[(i + 2) % studies.length], studies[(i + 3) % studies.length], s];
  burst.innerHTML = pics.map(p => `<img src="${shot(p.slug)}" alt="">`).join('');
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    io.disconnect();
    const [left, right] = nextLink.querySelectorAll('.label span');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(left, {x: -48, duration: 0.8, ease: 'power3.out'});
      gsap.to(right, {x: 48, duration: 0.8, ease: 'power3.out'});
      burst.querySelectorAll('img').forEach((img, n) => {
        gsap.to(img, {
          opacity: 1,
          x: gsap.utils.random(-18, 18) + (n - 1.5) * 16,
          y: gsap.utils.random(-10, 8) + (n % 2 ? -8 : 6),
          rotation: gsap.utils.random(-12, 12),
          scale: gsap.utils.random(0.85, 1.15),
          duration: 0.45,
          delay: n * 0.06,
          ease: 'power3.out'
        });
      });
    } else {
      burst.querySelectorAll('img').forEach(img => { img.style.opacity = '1'; });
    }
  }, {threshold: 0.45});
  io.observe(nextLink);
}

export function clients() {
  const names = document.getElementById('client-names');
  const logo = document.getElementById('client-logo');
  const label = document.getElementById('view-label');
  names.innerHTML = studies.map((s, i) => `
    <button class="client-item" type="button" data-slug="${s.slug}" data-href="/works/${s.slug}/">
      <span class="client-num">${String(i + 1).padStart(2, '0')}</span>${esc(s.name)}
    </button>`).join('');
  let shown = '';
  names.addEventListener('mouseover', e => {
    const item = e.target.closest('.client-item');
    if (!item) return;
    names.classList.add('is-hot');
    names.querySelectorAll('.client-item').forEach(b => b.classList.toggle('active', b === item));
    if (shown === item.dataset.slug) return;
    shown = item.dataset.slug;
    logo.querySelector('img').src = shot(item.dataset.slug);
    gsap.fromTo(logo, {opacity: 0, scale: 0.94}, {opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto'});
  });
  names.addEventListener('mousemove', e => {
    label.style.setProperty('--x', e.clientX + 'px');
    label.style.setProperty('--y', e.clientY + 'px');
    label.classList.add('is-visible');
    label.textContent = 'View';
  });
  names.addEventListener('mouseleave', () => {
    names.classList.remove('is-hot');
    shown = '';
    gsap.to(logo, {opacity: 0, duration: 0.2, overwrite: 'auto'});
    label.classList.remove('is-visible');
  });
  names.addEventListener('click', e => {
    const item = e.target.closest('.client-item');
    if (item) location.href = item.dataset.href;
  });
}

export function blog() {
  document.getElementById('blog-list').innerHTML = notes.map(n => `
    <a class="blog-card" href="/blog/${n.slug}/">
      <div class="img-box"><img src="${shot(n.image)}" alt=""></div>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.dek)}</p>
      <div class="more"><i></i><span>${esc(n.author)} · ${n.minutes} min read</span></div>
    </a>`).join('');
}

export function article() {
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const n = noteBySlug(slug === 'article.html' ? notes[0].slug : slug);
  document.title = `${n.title} — Shivansh Nayak`;
  document.getElementById('kicker').textContent = `${n.minutes} min read`;
  document.getElementById('article-title').textContent = n.title;
  document.getElementById('by').textContent = n.author;
  document.getElementById('article-img').src = shot(n.image);
  document.getElementById('article-body').innerHTML = n.body.map(p => `<p>${esc(p)}</p>`).join('')
    + `<p>The scenes are adapted from Dioramas. Credit is on the <a href="/credits/">credits</a> page.</p>`;
  document.getElementById('related').innerHTML = notes.filter(x => x.slug !== n.slug).map(x => `
    <a class="blog-card" href="/blog/${x.slug}/">
      <div class="img-box"><img src="${shot(x.image)}" alt=""></div>
      <h3>${esc(x.title)}</h3>
      <p>${esc(x.dek)}</p>
    </a>`).join('');
}

export function jobsPage() {
  const drift = document.getElementById('drift');
  const pics = studies.map(s => `<img src="${shot(s.slug)}" alt="">`).join('');
  drift.innerHTML = pics + pics;
  const hero = drift.closest('.jobs-hero');
  const lift = () => {
    const r = hero.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.85)));
    drift.querySelectorAll('img').forEach((img, i) => {
      img.style.translate = `0 ${(p - 0.35) * (i % 3 === 0 ? -48 : 36)}px`;
      img.style.scale = String(0.92 + p * 0.16);
    });
  };
  lift();
  window.addEventListener('scroll', lift, {passive: true});
  document.getElementById('roles').innerHTML = jobs.map(([title, place, line]) => `
    <a class="job-row" href="mailto:${profile.email}?subject=${encodeURIComponent(title)}">
      <span><h3>${esc(title)}</h3><p>${esc(line)}</p></span>
      <span>${esc(place)}</span>
    </a>`).join('');
}

export function archive() {
  const gallery = document.getElementById('archive-gallery');
  gallery.innerHTML = studies.map((s, i) => {
    const [c, span, g] = spots[i % spots.length];
    return `<button class="archive-item" type="button" style="--c:${c};--s:${span};--g:${g}px" data-slug="${s.slug}">
      <img src="${shot(s.slug)}" alt="">
      <span class="meta-line"><span>${esc(s.name)}</span><span>${s.year}</span></span>
    </button>`;
  }).join('');
  const box = document.getElementById('lightbox');
  gallery.addEventListener('click', e => {
    const item = e.target.closest('.archive-item');
    if (!item) return;
    const s = studyBySlug(item.dataset.slug);
    document.getElementById('lb-img').src = shot(s.slug);
    document.getElementById('lb-title').textContent = s.name;
    document.getElementById('lb-year').textContent = s.year;
    document.getElementById('lb-copy').textContent = `${s.line} ${s.note}`;
    document.getElementById('lb-link').href = `/works/${s.slug}/`;
    box.classList.add('is-on');
    document.documentElement.classList.add('is-form-open');
  });
  const close = () => {
    box.classList.remove('is-on');
    document.documentElement.classList.remove('is-form-open');
  };
  document.getElementById('lb-close').onclick = close;
  box.addEventListener('click', e => { if (e.target === box) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

export function contact() {}
