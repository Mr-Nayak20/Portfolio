import gsap from 'gsap';
import {nav, notes, profile, services, shot, tools} from './data.js';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function clock() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: profile.zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).format(new Date());
}

function shellParts() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const links = nav.map(([label, href]) => {
    const current = path === href.replace(/\/$/, '') || (href !== '/' && path.startsWith(href.replace(/\/$/, '')));
    return `<a href="${href}" ${current ? 'aria-current="page"' : ''}>${label}</a>`;
  }).join('');
  return `
    <div class="custom-cursor" id="cursor"></div>
    <div class="page-transition-overlay" id="wipe"></div>
    <header class="site-header">
      <div class="wrap">
        <a class="logo" href="/" aria-label="${esc(profile.name)} – home">${profile.mark}</a>
        <div class="wrap-right">
          <div class="wrap-time"><span data-clock>${clock()}</span> (${profile.zoneLabel})</div>
          <div class="wrap-lang"><span class="lang-ctab active">English</span></div>
          <button class="start-ctab" type="button" data-open="project">Start a project</button>
        </div>
      </div>
    </header>
    <nav class="bottom-nav" aria-label="Primary">
      <div class="bottom-nav__container">
        <div class="bottom-nav__progress" id="scroll-progress"></div>
        <button class="bottom-nav__toggle" type="button" aria-expanded="false" aria-controls="main-menu" aria-label="Open menu"><span aria-hidden="true">☰</span></button><div class="bottom-nav__context"><span id="nav-context-title">Work</span><a id="nav-context-link" href="/works/">View all</a></div>
        <div class="bottom-nav__links" id="main-menu" inert>${links}</div>
      </div>
    </nav>
    <div class="form-overlay" id="form-overlay"></div>
    <aside class="side-panel" id="panel-contact" aria-hidden="true">
      <div class="panel-header"><h2 class="panel-title">Get in touch</h2><button class="close-btn" type="button" data-close aria-label="Close"></button></div>
      <form class="fields" data-kind="note">
        <input name="name" placeholder="Full Name" required autocomplete="name">
        <input name="email" type="email" placeholder="Your Email" required autocomplete="email">
        <input name="phone" placeholder="Your Telephone" autocomplete="tel">
        <textarea name="message" rows="5" placeholder="Write your message here" required></textarea>
        <label class="check"><input type="checkbox" name="privacy" required> I agree with the <a href="/privacy-policy/">Privacy Policy</a></label>
        <p class="form-error" data-error></p>
        <button class="send-btn" type="submit">Send</button>
        <p class="fine">This opens your email app. Nothing is stored on a server.</p>
      </form>
    </aside>
    <aside class="side-panel" id="panel-project" aria-hidden="true">
      <div class="panel-header"><h2 class="panel-title">Want to start a project?</h2><button class="close-btn" type="button" data-close aria-label="Close"></button></div>
      <form class="fields" data-kind="project">
        <input name="name" placeholder="Your Name" required autocomplete="name">
        <input name="email" type="email" placeholder="Your Email" required autocomplete="email">
        <input name="phone" placeholder="Your Telephone" required autocomplete="tel">
        <div class="choice-row">
          ${services.map(s => `<label><input type="checkbox" name="need" value="${esc(s.name)}"> ${esc(s.name)}</label>`).join('')}
        </div>
        <div class="budget-row">
          ${['₹40–80k','₹80k–1.5L','₹1.5–3L','₹3L+'].map((b,i) => `<label><input type="radio" name="budget" value="${b}" ${i===0?'required':''}> ${b}</label>`).join('')}
        </div>
        <textarea name="message" rows="4" placeholder="Write your message here" required></textarea>
        <label class="check"><input type="checkbox" name="privacy" required> I agree with the <a href="/privacy-policy/">Privacy Policy</a></label>
        <p class="form-error" data-error></p>
        <button class="send-btn" type="submit">Send</button>
        <p class="fine">This opens your email app. Nothing is stored on a server.</p>
      </form>
    </aside>
    <div class="widget-wrapper" id="widget">
      <div class="widget-panel">
        <strong>Tools</strong>
        ${tools.map(([name, href, line]) => `<a href="${href}">${esc(name)}<span>${esc(line)}</span></a>`).join('')}
        <a href="/blog/${notes[1].slug}/">How they run<span>A note on in-browser models</span></a>
      </div>
      <button class="widget-trigger" type="button" aria-expanded="false">Tools</button>
    </div>
    </div><footer class="site-footer">
      <div class="footer-logo"><a href="/">${profile.mark}</a></div>
      <p class="footer-status" id="status"></p>
      <div class="footer-bottom">
        <div class="footer-col">
          <a href="mailto:${profile.email}">${profile.email}</a>
          <div class="social-links">${profile.socials.map(([n,h]) => `<a href="${h}">${n}</a>`).join('<span>, </span>')}</div>
        </div>
        <div class="footer-col center">
          <a href="/terms-of-use/">Terms of Use</a>
          <a href="/cookie-policy/">Cookie Policy</a>
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/credits/">Credits</a>
        </div>
        <div class="footer-col end">© <span id="year"></span> All Rights Reserved.</div>
      </div>
    </footer>`;
}

function openForm(which) {
  document.getElementById('form-overlay').classList.add('active');
  document.querySelectorAll('.side-panel').forEach(p => {
    const on = p.id === `panel-${which}`;
    p.classList.toggle('active', on);
    p.setAttribute('aria-hidden', String(!on));
  });
  document.documentElement.classList.add('is-form-open');
}
function closeForm() {
  document.getElementById('form-overlay').classList.remove('active');
  document.querySelectorAll('.side-panel').forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-hidden', 'true');
  });
  document.documentElement.classList.remove('is-form-open');
}

export function boot(start) {
  const html = shellParts();
  const cut = html.indexOf('</div><footer');
  document.body.insertAdjacentHTML('afterbegin', html.slice(0, cut + 6));
  document.body.insertAdjacentHTML('beforeend', html.slice(cut + 6));
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const progress = document.getElementById('scroll-progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});


  setInterval(() => {
    document.querySelectorAll('[data-clock]').forEach(el => { el.textContent = clock(); });
  }, 1000);

  const status = document.getElementById('status');
  let si = 0;
  const writeStatus = (first) => {
    const next = `Right now, it’s ${clock()} in ${profile.place}. ${profile.status[si % profile.status.length]}`;
    si += 1;
    if (first || reduce) { status.textContent = next; return; }
    gsap.to(status, {opacity: 0, duration: 0.25, onComplete: () => {
      status.textContent = next;
      gsap.to(status, {opacity: 1, duration: 0.35});
    }});
  };
  writeStatus(true);
  if (!reduce) setInterval(() => writeStatus(false), 8000);

  const bottomNav = document.querySelector('.bottom-nav');
  const navToggle = bottomNav.querySelector('.bottom-nav__toggle');
  const menu = document.getElementById('main-menu');
  function setMenu(open) {
    bottomNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
  }
  navToggle.onclick = () => setMenu(!bottomNav.classList.contains('is-open'));
  window.addEventListener('keydown', e => {if (e.key === 'Escape') setMenu(false);});
  const contextTitle = document.getElementById('nav-context-title');
  const contextLink = document.getElementById('nav-context-link');
  const pageNames = {home:'Work', about:'About',services:'Services',service:'Services',works:'Work',study:'Work',clients:'Studies',blog:'Journal',article:'Journal',jobs:'Collaborate',archive:'Archive',contact:'Contact'};
  contextTitle.textContent = pageNames[document.body.dataset.page] || 'Explore';
  contextLink.href = document.body.dataset.page === 'service' ? '/services/' : '/works/';
  contextLink.hidden = !['home','service','study','article'].includes(document.body.dataset.page);
  if (document.body.dataset.page === 'article') contextLink.href = '/blog/';
  const sections = [...document.querySelectorAll('[data-nav-title]')];
  if (sections.length) {
    const visible = new Map();
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio); else visible.delete(entry.target);});
      const best = [...visible].sort((a,b) => b[1] - a[1])[0]?.[0];
      if (best) {contextTitle.textContent = best.dataset.navTitle; contextLink.href = best.dataset.navLink; contextLink.hidden = false;}
    }, {rootMargin:'-20% 0px -30% 0px', threshold:[0,.1,.5]});
    sections.forEach(section => sectionObserver.observe(section));
  }

  const widget = document.getElementById('widget');
  widget.querySelector('.widget-trigger').onclick = e => {
    const open = widget.classList.toggle('is-open');
    e.target.setAttribute('aria-expanded', String(open));
  };

  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { openForm(open.dataset.open); return; }
    if (e.target.closest('[data-close]') || e.target.id === 'form-overlay') closeForm();
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeForm(); });

  document.querySelectorAll('.side-panel form').forEach(form => {
    form.onsubmit = ev => {
      ev.preventDefault();
      const data = new FormData(form);
      if (!data.get('privacy')) {
        form.querySelector('[data-error]').textContent = 'Please agree to the privacy policy.';
        return;
      }
      const needs = data.getAll('need').join(', ');
      const lines = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Telephone: ${data.get('phone') || '—'}`,
        needs && `Services: ${needs}`,
        data.get('budget') && `Budget: ${data.get('budget')}`,
        '',
        data.get('message')
      ].filter(Boolean);
      const subject = form.dataset.kind === 'project' ? 'Project' : 'Note';
      location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      closeForm();
    };
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    if (reduce || a.hasAttribute('download') || e.button !== 0) return;
    e.preventDefault();
    try {sessionStorage.setItem('pt', '1');} catch {}
    document.documentElement.classList.add('is-page-transitioning');
    setTimeout(() => { location.href = url.href; }, 280);
  });

  // A paintable arrival state; restore after bfcache navigation too.
  let arriving = false;
  try {arriving = sessionStorage.getItem('pt') === '1'; sessionStorage.removeItem('pt');} catch {}
  if (arriving && !reduce) {
    document.documentElement.classList.add('is-arriving');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.add('is-ready');
      document.documentElement.classList.remove('is-arriving');
    }));
  }
  window.addEventListener('pageshow', () => document.documentElement.classList.remove('is-page-transitioning'));

  const photo = document.getElementById('hover-photo');
  if (photo) {
    const xTo = gsap.quickTo(photo, 'x', {duration: reduce ? 0 : 0.35, ease: 'power3.out'});
    const yTo = gsap.quickTo(photo, 'y', {duration: reduce ? 0 : 0.35, ease: 'power3.out'});
    document.querySelectorAll('.hover').forEach(word => {
      word.addEventListener('mouseenter', () => {
        photo.src = shot(word.dataset.img);
        photo.classList.add('is-on');
        gsap.fromTo(photo, {opacity: 0, scale: 0.55, xPercent: -50, yPercent: -80, rotation: gsap.utils.random(-8, 8)}, {
          opacity: 1, scale: 1, yPercent: -120, duration: reduce ? 0 : 0.4, ease: 'power3.out', overwrite: 'auto'
        });
      });
      word.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
      word.addEventListener('mouseleave', () => {
        gsap.to(photo, {opacity: 0, scale: 0.8, duration: 0.25, overwrite: 'auto', onComplete: () => photo.classList.remove('is-on')});
      });
    });
  }
  const card = document.getElementById('contact-card');
  const heroCard = document.querySelector('.contact-hero');
  if (card && heroCard && fine) {
    gsap.set(card, {xPercent: -50, yPercent: -120});
    const xTo = gsap.quickTo(card, 'left', {duration: reduce ? 0 : 0.35, ease: 'power3.out'});
    const yTo = gsap.quickTo(card, 'top', {duration: reduce ? 0 : 0.35, ease: 'power3.out'});
    heroCard.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
  }

  if (!reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        gsap.to(entry.target, {clipPath: 'inset(0% 0% 0% 0%)', duration: .55, ease: 'power2.out'});
        io.unobserve(entry.target);
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
    document.querySelectorAll('.reel__wrap').forEach(el => {
      gsap.set(el, {clipPath: 'inset(0% 100% 0% 0%)'});
      io.observe(el);
    });

  }

  start?.();
}

export {esc, shot, services, profile};
