const worlds = [
  ['reliquary','Reliquary','A room you only see by the light you carry.'],
  ['abyssal','Abyssal','The page is a dive. You steer the lamps.'],
  ['ember','Hammer & Ember','Steel takes colour from heat. Then you strike.'],
  ['terrarium','Bell & Moss','A climate under glass. Wipe the window.'],
  ['koi','Still Water','A pond that answers a fingertip.'],
  ['florae','Florae','A field that moves when you do.'],
  ['velocity','Velocity Lab','Look through the shoe: bone, heat, drawing.'],
  ['hangar','Hangar Nine','Hold, and a large machine wakes.'],
  ['sucre','Maison Sucre','Sugar, weight, and a table. Nothing is for sale.'],
  ['monolith','Monolith','Drag the sun. The house changes its mind.'],
  ['lowfreq','Low Frequency','Put a hand on the record. It plays here.'],
  ['gambit','Gambit','A game replayed, then left in your hands.'],
  ['atlas','Atlas','Islands with air between them.'],
  ['lithos','Lithos','Hold the stone until it opens.'],
  ['artemis','Artemis','Scroll, and a figure walks where there is no weather.'],
  ['keeper','The Keeper','Aim a beam through bad weather.'],
  ['koen','Kōen','One tree. A year, in four breaths.'],
  ['nocturne','Nocturne','Glass, liquid, and notes — a study, not a house.'],
  ['racer','Nightshift','Rain, a bike, a throttle you have to hold.'],
  ['horologie','Horologie','A movement, taken apart in the browser.']
];

const services = [
  {id:'web', n:'01', name:'Website development', line:'Interactive sites with a point of view.', body:'Scroll, 3D and editorial pages built as experiences. The twenty studies on this site are the proof.'},
  {id:'soft', n:'02', name:'Software', line:'Interfaces for a real job.', body:'Product screens, states, and tools that help someone finish a task instead of admire a mock.'},
  {id:'ai', n:'03', name:'AI development', line:'Tools a visitor can try.', body:'Summaries, rewrites, vision and voice that run in the browser. No key, no account.'},
  {id:'write', n:'04', name:'Writing & design', line:'Words and a visual system that agree.', body:'Headlines, identity and layout. If the sentence is vague, the design cannot rescue it.'}
];

const tools = [
  ['Brief','/tools/brief/','Paste a long page. Get a short brief.'],
  ['Tone','/tools/tone/','The same line, in another voice.'],
  ['Sight','/tools/sight/','An image, described on your machine.'],
  ['Voice','/tools/voice/','Speak. Keep the note in this browser.']
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shot = slug => `/img/index/${slug}.webp`;

let selected = 0;
const rail = document.querySelector('#rail');
const view = document.querySelector('#view');

function select(i) {
  selected = i;
  const [slug, name] = worlds[i];
  view.href = `/examples/${slug}/`;
  view.textContent = `VIEW ${name.toUpperCase()} ↗`;
  [...rail.children].forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
}

rail.innerHTML = worlds.map(([slug, name], i) =>
  `<button aria-label="${esc(name)}" aria-pressed="${i===0}"><img src="${shot(slug)}" alt=""></button>`
).join('');
[...rail.children].forEach((b, i) => {
  b.onclick = () => select(i);
  b.ondblclick = () => location.assign(`/examples/${worlds[i][0]}/`);
});
select(0);

document.querySelector('#work-grid').innerHTML = worlds.map(([slug, name, line]) =>
  `<a class="card" href="/examples/${slug}/"><img src="${shot(slug)}" alt="${esc(name)}"><h3>${esc(name)}</h3><p>${esc(line)}</p></a>`
).join('');

document.querySelector('#service-list').innerHTML = services.map(s =>
  `<button class="service" data-service="${s.id}"><small>${s.n}</small><h3>${esc(s.name)}</h3><span>More information ↗</span></button>`
).join('');

document.querySelector('#tool-row').innerHTML = tools.map(([name, href, line]) =>
  `<a class="tool" href="${href}"><h3>${esc(name)}</h3><p>${esc(line)}</p></a>`
).join('');

function openService(id) {
  const s = services.find(x => x.id === id);
  const links = id === 'web'
    ? worlds.slice(0, 4).map(([slug, name]) => `<a href="/examples/${slug}/">${esc(name)} ↗</a>`).join('<br>')
    : id === 'ai'
      ? tools.map(([name, href]) => `<a href="${href}">${esc(name)} ↗</a>`).join('<br>')
      : `<a href="mailto:shivansh15nayak@gmail.com">Start with an email ↗</a>`;
  document.querySelector('#service-detail').innerHTML = `<p>${s.n}</p><h2>${esc(s.name)}</h2><p>${esc(s.line)}</p><p>${esc(s.body)}</p><p>${links}</p><p><a href="mailto:shivansh15nayak@gmail.com?subject=${encodeURIComponent(s.name)}">Start a project ↗</a></p>`;
  document.querySelector('#service-dialog').showModal();
}

document.addEventListener('click', e => {
  const opener = e.target.closest('[data-open]');
  if (opener) document.querySelector('#project-dialog').showModal();
  const service = e.target.closest('[data-service]');
  if (service) openService(service.dataset.service);
  const close = e.target.closest('[data-close]');
  if (close) close.closest('dialog').close();
});

document.querySelector('#start-form').onsubmit = e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const needs = data.getAll('need').join(', ') || 'Not specified';
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nNeeds: ${needs}\n\n${data.get('message')}`;
  location.href = `mailto:shivansh15nayak@gmail.com?subject=${encodeURIComponent('Project')}&body=${encodeURIComponent(body)}`;
};

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('#menu');
menuBtn.onclick = () => {
  menu.hidden = !menu.hidden;
  menuBtn.setAttribute('aria-expanded', String(!menu.hidden));
};
menu.querySelectorAll('a').forEach(a => a.onclick = () => { menu.hidden = true; });

function tick() {
  document.querySelector('#clock').textContent = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit'}).format(new Date());
}
tick();
setInterval(tick, 30000);
document.querySelector('#year').textContent = new Date().getFullYear();
