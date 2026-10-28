const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const panel = document.querySelector('#tour-panel');
const greeting = document.querySelector('#onyx-greeting');
const tourCopy = document.querySelector('#tour-copy');
const tourCount = document.querySelector('#tour-count');
const nextButton = document.querySelector('.tour-next');
const previousButton = document.querySelector('.tour-prev');
let currentStop = -1;

const tour = [
  { label: '01 / THE WORKSHOP', anchor: '#code', copy: 'Here is the coding workshop: seven websites, each with its own visual language and interaction. Open one and take your time.' },
  { label: '02 / THE INTELLIGENCE ROOM', anchor: '#ai', copy: 'This is where the AI work belongs: human-centred tools, assistants and product ideas. I will mark what is real and what is still being built.' },
  { label: '03 / AUTOMATIONS', anchor: '#automation', copy: 'Small automations can give people back their attention. These workflow experiments are in progress; new ones will appear here as they become tangible.' },
  { label: '04 / SAAS', anchor: '#saas', copy: 'The product lab is for software ideas with a clear purpose: prototype the experience, test the need, then decide what deserves to grow.' },
  { label: '05 / THE ATELIER', anchor: '#studio', copy: 'A change of medium. Paintings and visual experiments are being gathered for this room.' },
  { label: '06 / THE WRITING DESK', anchor: '#writing', copy: 'For essays, notes and questions still taking shape, the writing desk opens out to Shivansh’s Substack.' },
  { label: '07 / THE LONG QUESTIONS', anchor: '#questions', copy: 'And here are the questions too large for a quick answer: energy, mathematics, science and the future of civilization.' },
  { label: '08 / THE CONVERSATION', anchor: '#contact', copy: 'That is the tour. If a project, painting or question caught your attention, the door is open.' }
];

function showTour() {
  panel.hidden = false;
  greeting.hidden = true;
  document.querySelector('.onyx-orb').setAttribute('aria-expanded', 'true');
  nextButton.focus();
}
function closeTour() {
  panel.hidden = true;
  greeting.hidden = false;
  document.querySelector('.onyx-orb').setAttribute('aria-expanded', 'false');
}
function moveToStop(index) {
  currentStop = Math.max(-1, Math.min(index, tour.length - 1));
  if (currentStop < 0) {
    tourCount.textContent = 'WELCOME';
    tourCopy.textContent = 'The doors are open. Let’s start where ideas become things: the coding workshop.';
    previousButton.hidden = true;
    nextButton.innerHTML = 'Begin the tour <span>↗</span>';
    return;
  }
  const stop = tour[currentStop];
  tourCount.textContent = stop.label;
  tourCopy.textContent = stop.copy;
  previousButton.hidden = currentStop === 0;
  nextButton.innerHTML = currentStop === tour.length - 1 ? 'Finish the tour <span>✓</span>' : 'Next room <span>→</span>';
  document.querySelector(stop.anchor)?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
}

document.querySelectorAll('.tour-open').forEach(button => button.addEventListener('click', showTour));
document.querySelector('.tour-close').addEventListener('click', closeTour);
nextButton.addEventListener('click', () => {
  if (currentStop >= tour.length - 1) { closeTour(); return; }
  moveToStop(currentStop + 1);
});
previousButton.addEventListener('click', () => moveToStop(currentStop - 1));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) closeTour(); });

// Reveal each chapter once; no animation or layout work runs continuously while scrolling.
const revealTargets = document.querySelectorAll('.chapter-heading,.chapter-title-row,.work-card,.lab-card,.room-card,.lab-note,.newsletter-chapter>div,.contact-chapter>*');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  revealTargets.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}

// Update the slim reading-progress line only in response to a real scroll event.
const progress = document.querySelector('.scroll-progress');
let progressQueued = false;
function updateProgress() {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(() => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
    progressQueued = false;
  });
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();
