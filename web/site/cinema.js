import {studies as allStudies, shot, shotSrcset} from './data.js';
import {expandingOpening} from './expanding-opening.js';

export function cinema() {
  const opening = document.querySelector('.website-opening');
  let origin = null;
  try { origin = JSON.parse(sessionStorage.getItem('service-opening-origin') || 'null'); sessionStorage.removeItem('service-opening-origin'); } catch {}
  if (origin) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const title = opening.querySelector('.services-hero__title');
    Object.assign(title.style, {position:'absolute', left:`${origin.left}px`, top:`${origin.top}px`, fontSize:origin.font, lineHeight:'1.08'});
  }
  expandingOpening(opening, origin ? {initialSrc: origin.source, origin} : {});
  const studies = [...allStudies];
  for (let i = studies.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [studies[i], studies[j]] = [studies[j], studies[i]]; }
  const list = document.querySelector('#study-list');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  list.className = 'deck-section';
  list.innerHTML = `<div class="deck-stage"><div class="deck-cards">${studies.map((study, index) => `<a class="deck-card" href="/examples/${study.slug}/" aria-label="Explore ${escape(study.name)}"><img data-src="${shot(study.slug)}" data-srcset="${shotSrcset(study.slug)}" sizes="(max-width:700px) 78vw, 52vw" alt="${escape(study.name)} website homepage" width="1920" height="1200" loading="lazy"></a>`).join('')}</div><div class="deck-meta"><div><h3 class="deck-title"></h3><p class="deck-description"></p></div></div></div>`;
  const cards = [...list.querySelectorAll('.deck-card')];
  const title = list.querySelector('.deck-title');
  const description = list.querySelector('.deck-description');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0, position = 0, targetPosition = 0, spread = 0, targetSpread = 0, startX = null, lastActive = -1, animationFrame = 0, snapTimer;
  const visibleCards = new Set();
  function loadCard(index) {
    const img = cards[(index + cards.length) % cards.length].querySelector('img');
    if (img.dataset.src) { img.srcset = img.dataset.srcset; img.src = img.dataset.src; delete img.dataset.src; delete img.dataset.srcset; }
  }
  for (let i = 0; i < 5; i++) loadCard(i);
  function render(progress = 1) {
    cards.forEach((card, index) => {
      let offset = index - position;
      if (offset > studies.length / 2) offset -= studies.length;
      if (offset < -studies.length / 2) offset += studies.length;
      const spread = Math.min(1, Math.max(0, progress));
      const distance = Math.abs(offset);
      if (distance > 4) { if (visibleCards.delete(index)) card.style.visibility = 'hidden'; return; }
      if (!visibleCards.has(index)) { loadCard(index); visibleCards.add(index); card.style.visibility = 'visible'; }
      const isActive = index === active;
      const x = offset * (innerWidth < 700 ? 70 : 72) * spread;
      const y = distance * 11 * spread;
      const angle = offset * 3 * spread;
      const scale = Math.max(.78, 1 - distance * .06 * spread);
      card.style.transform = `translate3d(${x}%, ${y}px, 0) rotate(${angle}deg) rotateY(${offset * -2 * spread}deg) scale(${scale})`;
      card.style.zIndex = String(isActive ? 100 : 30 - Math.round(distance));
      if (active !== lastActive) { card.tabIndex = index === active ? 0 : -1; card.setAttribute('aria-hidden', index === active ? 'false' : 'true'); }
    });
    if (active === lastActive) return;
    cards.forEach((card, index) => { card.tabIndex = index === active ? 0 : -1; card.setAttribute('aria-hidden', index === active ? 'false' : 'true'); });
    lastActive = active;
    for (let i = -5; i <= 5; i++) loadCard(active + i);
    title.textContent = studies[active].name;
    description.textContent = studies[active].line;
  }
  function goTo(index) {
    const target = Math.max(0, Math.min(studies.length - 1, index));
    const available = Math.max(1, list.offsetHeight - innerHeight);
    const progress = .12 + (target / (studies.length - 1)) * .88;
    window.scrollTo({top: window.scrollY + list.getBoundingClientRect().top + available * progress, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  cards.forEach((card, index) => card.addEventListener('click', event => { if (index !== active) { event.preventDefault(); goTo(index); } }));
  list.addEventListener('pointerdown', event => { startX = event.clientX; });
  list.addEventListener('pointerup', event => { if (startX !== null && Math.abs(event.clientX - startX) > 45) goTo(active + (event.clientX < startX ? 1 : -1)); startX = null; });
  function animate() {
    animationFrame = 0;
    const factor = reduced.matches ? 1 : .16;
    position += (targetPosition - position) * factor;
    spread += (targetSpread - spread) * factor;
    if (Math.abs(targetPosition - position) < .001) position = targetPosition;
    if (Math.abs(targetSpread - spread) < .001) spread = targetSpread;
    active = Math.round(position);
    render(spread);
    if (position !== targetPosition || spread !== targetSpread) animationFrame = requestAnimationFrame(animate);
  }
  function update() {
    const rect = list.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const available = Math.max(1, rect.height - innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / available));
    targetPosition = Math.max(0, Math.min(studies.length - 1, (progress - .12) / .88 * (studies.length - 1)));
    targetSpread = reduced.matches ? 1 : Math.min(1, progress * 7);
    if (!animationFrame) animationFrame = requestAnimationFrame(animate);
  }
  addEventListener('scroll', () => {
    update();
    clearTimeout(snapTimer);
    const rect = list.getBoundingClientRect();
    if (!reduced.matches && rect.top < 0 && rect.bottom > innerHeight && targetSpread > .95 && Math.abs(targetPosition - Math.round(targetPosition)) > .015) {
      snapTimer = setTimeout(() => goTo(Math.round(targetPosition)), 180);
    }
  }, {passive:true});
  addEventListener('resize', update);
  update();
}
