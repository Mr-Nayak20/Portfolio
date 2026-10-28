const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const panel = document.querySelector('#ezra-panel');
const dock = document.querySelector('.ezra-dock');
const status = document.querySelector('#ezra-status');
const connection = document.querySelector('#ezra-connection');
const input = document.querySelector('#ezra-input');
const sendButton = document.querySelector('.ezra-form button');
const messages = document.querySelector('#ezra-messages');
const tourLabel = document.querySelector('#tour-progress');
const nextTourButton = document.querySelector('.tour-next');
const previousTourButton = document.querySelector('.tour-back');
const EZRA_ENDPOINT = (import.meta.env.VITE_EZRA_API_URL || '').trim();

const tourStops = [
  { id: 'ai-studio', label: '01 / THE ENGINE ROOM', text: 'We begin with what I’m building now: my personal assistant in Hermes, and the portfolio side of that relationship—Ezra.' },
  { id: 'workshop', label: '02 / THE WEB ATELIER', text: 'This is the web atelier: a brand website, a creator product and five cinematic concept sites. The cards open the actual experiences.' },
  { id: 'life', label: '03 / THE LIBRARY & LIFE', text: 'Here the work moves away from the screen: writing, books and history, and the painting gallery I’m gathering.' },
  { id: 'questions', label: '04 / THE OBSERVATORY', text: 'These are open questions I’m learning my way into—from dependable AI to science and the long life of civilizations.' },
  { id: 'current-work', label: '05 / THE CURRENT DESK', text: 'A short account of what is in progress: Hermes and Ezra, agent experiments, and product ideas.' },
  { id: 'contact', label: '06 / THE SALON', text: 'That is the visit. If a project or question caught your attention, Shivansh would be glad to hear from you.' }
];

let tourIndex = -1;
let conversationId = '';

function addMessage(text, kind = 'reply') {
  const message = document.createElement('p');
  message.className = `ezra-message ezra-${kind}`;
  message.textContent = text;
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

function setPanel(open) {
  panel.hidden = !open;
  dock.setAttribute('aria-expanded', String(open));
  if (open && EZRA_ENDPOINT) input.focus();
}

function openEzra() {
  setPanel(true);
}

function goToRoom(id) {
  const room = document.getElementById(id);
  room?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
}

function setTourStop(index, shouldScroll = true) {
  tourIndex = Math.max(-1, Math.min(index, tourStops.length - 1));
  previousTourButton.hidden = tourIndex < 0;
  if (tourIndex < 0) {
    tourLabel.textContent = 'A PERSONAL TOUR / 6 ROOMS';
    nextTourButton.innerHTML = 'Begin the tour <span>↗</span>';
    return;
  }
  const stop = tourStops[tourIndex];
  tourLabel.textContent = stop.label;
  nextTourButton.innerHTML = tourIndex === tourStops.length - 1 ? 'Finish the tour <span>✓</span>' : 'Next room <span>→</span>';
  if (shouldScroll) goToRoom(stop.id);
  addMessage(stop.text);
}

function startTour() {
  openEzra();
  setTourStop(0);
}

document.querySelectorAll('.ask-ezra').forEach(button => button.addEventListener('click', openEzra));
document.querySelector('.start-tour').addEventListener('click', startTour);
dock.addEventListener('click', () => setPanel(panel.hidden));
document.querySelector('.ezra-close').addEventListener('click', () => setPanel(false));
nextTourButton.addEventListener('click', () => {
  if (tourIndex >= tourStops.length - 1) {
    tourIndex = -1;
    tourLabel.textContent = 'A PERSONAL TOUR / 6 ROOMS';
    nextTourButton.innerHTML = 'Begin the tour <span>↗</span>';
    previousTourButton.hidden = true;
    addMessage('Thank you for visiting. You can choose a room or begin the route again at any time.');
    return;
  }
  setTourStop(tourIndex + 1);
});
previousTourButton.addEventListener('click', () => setTourStop(tourIndex - 1));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => goToRoom(button.dataset.go)));
document.querySelectorAll('.salon-bottom a[href="#home"],.door-link').forEach(link => link.addEventListener('click', () => setPanel(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) setPanel(false); });

if (EZRA_ENDPOINT) {
  status.textContent = 'HERMES CONNECTION CONFIGURED';
  connection.innerHTML = '<span class="status-dot"></span> CONCIERGE ENDPOINT CONFIGURED';
  input.disabled = false;
  sendButton.disabled = false;
  input.placeholder = 'Ask about a room, project, or idea…';
  try {
    conversationId = sessionStorage.getItem('ezra-conversation-id') || crypto.randomUUID();
    sessionStorage.setItem('ezra-conversation-id', conversationId);
  } catch {
    conversationId = crypto.randomUUID();
  }
} else {
  status.textContent = 'GUIDED TOUR / HERMES PENDING';
}

document.querySelector('#ezra-form').addEventListener('submit', async event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || !EZRA_ENDPOINT) return;
  addMessage(text, 'user');
  input.value = '';
  input.disabled = true;
  sendButton.disabled = true;
  const pending = addMessage('Let me find that…', 'reply');
  try {
    const response = await fetch(EZRA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        conversation_id: conversationId,
        context: { path: window.location.pathname, room: window.location.hash || '#home' }
      })
    });
    if (!response.ok) throw new Error(`Ezra returned ${response.status}`);
    const payload = await response.json();
    const reply = payload.reply || payload.message || payload.content;
    if (typeof reply !== 'string' || !reply.trim()) throw new Error('Ezra returned no reply.');
    pending.textContent = reply;
    if (payload.conversation_id) {
      conversationId = payload.conversation_id;
      try { sessionStorage.setItem('ezra-conversation-id', conversationId); } catch { /* session storage is optional */ }
    }
  } catch (error) {
    pending.textContent = 'I couldn’t reach Hermes just now. The room links and guided route are still available.';
    console.error('Ezra request failed:', error);
  } finally {
    input.disabled = false;
    sendButton.disabled = false;
    input.focus();
  }
});

// Reveal sections once as they enter view; nothing runs continuously during scroll.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('entered');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -3% 0px' });
  document.querySelectorAll('.section-heading,.ai-feature,.systems-grid,.project,.life-card,.observatory-inner,.current-heading,.current-items,.salon-main').forEach(element => {
    element.classList.add('room-enter');
    revealObserver.observe(element);
  });
}
