import {studies, shot} from './data.js';

export function cinema() {
  const track = document.querySelector('#reel-track');
  const viewport = document.querySelector('#reel-window');
  const toggle = document.querySelector('#reel-toggle');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const markup = studies.map((study, index) => `<a class="film-frame" href="/examples/${study.slug}/" data-study="${index}"><div class="film-image"><img src="${shot(study.slug)}" alt="${escape(study.name)} website preview" loading="lazy" decoding="async" width="1280" height="800"></div><div class="film-caption"><span>${String(index + 1).padStart(2,'0')} / ${escape(study.name)}</span><span aria-hidden="true">OPEN ↗</span></div></a>`).join('');
  const group = document.createElement('div');
  group.className = 'film-group';
  group.innerHTML = markup;
  track.replaceChildren(group);
  const before = group.cloneNode(true), after = group.cloneNode(true);
  for (const clone of [before, after]) {
    clone.classList.add('film-clone');
    clone.inert = true;
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach(link => link.tabIndex = -1);
  }
  track.prepend(before); track.append(after);
  let paused = motion.matches, visible = false, hover = false, focused = false;
  let width = 0, step = 0, frame = 0, last = 0, gesture = null, suppressClick = false;
  function updateButton() {
    toggle.textContent = paused ? 'Play reel' : 'Pause reel';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.disabled = motion.matches;
    toggle.title = motion.matches ? 'Automatic motion is disabled by your reduced-motion preference' : '';
  }
  function normalise() {
    if (motion.matches || !width || gesture) return;
    if (viewport.scrollLeft < width) viewport.scrollLeft += width;
    else if (viewport.scrollLeft >= width * 2) viewport.scrollLeft -= width;
  }
  function tick(time) {
    frame = 0;
    if (paused || motion.matches || !visible || hover || focused || document.hidden || gesture) {last = 0; return;}
    if (last) {viewport.scrollLeft -= Math.min(time - last, 50) * .035; normalise();}
    last = time;
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (!paused && !motion.matches && visible && !hover && !focused && !document.hidden && !gesture) frame = requestAnimationFrame(tick);
  }
  function pause() {paused = true; updateButton(); sync();}
  function measure() {
    const oldWidth = width;
    const progress = oldWidth ? ((viewport.scrollLeft % oldWidth) + oldWidth) % oldWidth / oldWidth : 0;
    width = group.getBoundingClientRect().width;
    step = group.children[1]?.offsetLeft - group.children[0]?.offsetLeft || width;
    viewport.scrollLeft = motion.matches ? progress * width : width + progress * width;
  }
  function move(direction) {
    pause();
    viewport.scrollLeft += direction * step;
    normalise();
  }
  document.querySelector('#reel-prev').onclick = () => move(-1);
  document.querySelector('#reel-next').onclick = () => move(1);
  toggle.onclick = () => {paused = !paused; updateButton(); sync();};
  viewport.addEventListener('pointerenter', () => {if (fine.matches) {hover = true; sync();}});
  viewport.addEventListener('pointerleave', () => {hover = false; if (gesture && !gesture.dragging) gesture = null; sync();});
  viewport.addEventListener('focusin', () => {focused = true; sync();});
  viewport.addEventListener('focusout', event => {focused = viewport.contains(event.relatedTarget); sync();});
  viewport.addEventListener('wheel', pause, {passive:true});
  viewport.addEventListener('scroll', normalise, {passive:true});
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);}
    if (event.key === ' ' && event.target === viewport) {event.preventDefault(); toggle.click();}
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pause();
    gesture = {id:event.pointerId,x:event.clientX,y:event.clientY,start:viewport.scrollLeft,dragging:false};
    suppressClick = false;
  });
  viewport.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {gesture = null; return;}
    if (!gesture.dragging && Math.abs(dx) > 8) {gesture.dragging = true; viewport.setPointerCapture(event.pointerId); viewport.classList.add('is-dragging');}
    if (gesture.dragging) {viewport.scrollLeft = gesture.start - dx; suppressClick = true;}
  });
  function endGesture() {gesture = null; viewport.classList.remove('is-dragging'); normalise(); sync();}
  viewport.addEventListener('pointerup', endGesture);
  viewport.addEventListener('pointercancel', endGesture);
  viewport.addEventListener('lostpointercapture', endGesture);
  viewport.addEventListener('click', event => {
    if (suppressClick) {event.preventDefault(); suppressClick = false; return;}
    // Cloned frames are inert to assistive technology and keyboard navigation.
    // Resolve pointer clicks on their pixels to the corresponding original link.
    if (!event.target.closest('a') && width && !motion.matches) {
      const x = viewport.scrollLeft + event.clientX - viewport.getBoundingClientRect().left;
      const index = Math.min(studies.length - 1, Math.floor(((x % width) + width) % width / step));
      const local = ((x % width) + width) % width - index * step;
      if (local < group.children[index].offsetWidth) group.children[index].click();
    }
  });
  document.addEventListener('visibilitychange', sync);
  const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; sync();}, {threshold:.05});
  observer.observe(viewport);
  const resize = new ResizeObserver(measure); resize.observe(viewport);
  motion.addEventListener('change', () => {paused = motion.matches; measure(); updateButton(); sync();});
  measure(); updateButton(); sync();
}
