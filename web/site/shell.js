import gsap from 'gsap';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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
        <button class="bottom-nav__toggle" type="button" aria-expanded="false">Menu</button>
        <div class="bottom-nav__links">${links}</div>
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
  if (fine) {
    document.documentElement.classList.add('has-custom-cursor');
    const cursor = document.getElementById('cursor');
    window.addEventListener('mousemove', e => {
      cursor.style.setProperty('--x', e.clientX + 'px');
      cursor.style.setProperty('--y', e.clientY + 'px');
      cursor.style.setProperty('--s', e.target.closest('a, button') ? '1.7' : '1');
      cursor.style.opacity = '1';
    });
  }

  const progress = document.getElementById('scroll-progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});

  if (!reduce) {
    const lenis = new Lenis({lerp: 0.085, smoothWheel: true});
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', onScroll);
  }

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

  document.querySelector('.bottom-nav__toggle').onclick = e => {
    const navEl = e.target.closest('.bottom-nav');
    const open = navEl.classList.toggle('is-open');
    e.target.setAttribute('aria-expanded', String(open));
  };

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
    if (reduce) return;
    e.preventDefault();
    sessionStorage.setItem('pt', '1');
    document.documentElement.classList.add('is-page-transitioning');
    setTimeout(() => { location.href = url.href; }, 1150);
  });

  if (sessionStorage.getItem('pt') === '1') {
    sessionStorage.removeItem('pt');
    document.documentElement.classList.add('is-arriving');
    requestAnimationFrame(() => {
      document.documentElement.classList.add('is-ready');
      document.documentElement.classList.remove('is-arriving');
    });
  }

  const photo = document.getElementById('hover-photo');
  if (photo) {
    const xTo = gsap.quickTo(photo, 'left', {duration: reduce ? 0 : 0.35, ease: 'power3.out'});
    const yTo = gsap.quickTo(photo, 'top', {duration: reduce ? 0 : 0.35, ease: 'power3.out'});
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
        gsap.to(entry.target, {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut'});
        io.unobserve(entry.target);
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
    document.querySelectorAll('.reel__wrap').forEach(el => {
      gsap.set(el, {clipPath: 'inset(0% 100% 0% 0%)'});
      io.observe(el);
    });
    document.querySelector('main')?.classList.add('rise-in');
  }

  start?.();
}

export {esc, shot, services, profile};
