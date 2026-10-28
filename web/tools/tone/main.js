const input = document.querySelector('#input');
const output = document.querySelector('#output');
const status = document.querySelector('#status');
const run = document.querySelector('#run');
const modelPass = document.querySelector('#model-pass');
let tone = 'calm';

document.querySelectorAll('[data-tone]').forEach(b => b.onclick = () => {
  tone = b.dataset.tone;
  document.querySelectorAll('[data-tone]').forEach(x => x.classList.toggle('on', x === b));
});

const maps = {
  calm: {
    lead: ['Quietly,', 'Without fuss,', 'In clear terms,'],
    swap: [[/\bhelp(s|ing)?\b/gi, 'support'], [/\bbetter\b/gi, 'clearer'], [/\bfaster\b/gi, 'with less friction'], [/\bamazing\b/gi, 'considered'], [/\brevolutioni[sz]e\b/gi, 'improve']]
  },
  bold: {
    lead: ['Make no mistake —', 'Here is the point:', 'Cut through:'],
    swap: [[/\bhelp(s|ing)?\b/gi, 'drive'], [/\bbetter\b/gi, 'sharper'], [/\bfaster\b/gi, 'now'], [/\btry\b/gi, 'ship'], [/\bmaybe\b/gi, 'will']]
  },
  warm: {
    lead: ['Glad you are here —', 'With care,', 'Together,'],
    swap: [[/\busers?\b/gi, 'people'], [/\bcustomers?\b/gi, 'neighbours'], [/\bbuild\b/gi, 'make'], [/\bproduct\b/gi, 'thing'], [/\boptimize\b/gi, 'ease']]
  },
  precise: {
    lead: ['Specifically:', 'In practice:', 'Defined:'],
    swap: [[/\bthings?\b/gi, 'elements'], [/\bnice\b/gi, 'fit for purpose'], [/\ba lot\b/gi, 'materially'], [/\breally\b/gi, ''], [/\bjust\b/gi, '']]
  }
};

function heuristic(text, key) {
  const cfg = maps[key];
  let out = text.trim();
  for (const [re, to] of cfg.swap) out = out.replace(re, to);
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?;:])/g, '$1').trim();
  if (!/[.!?]$/.test(out)) out += '.';
  const lead = cfg.lead[Math.floor(Math.random() * cfg.lead.length)];
  const alt = out.charAt(0).toLowerCase() + out.slice(1);
  return `${lead} ${alt}\n\n— ${key} pass (local heuristic)`;
}

run.onclick = () => {
  const text = input.value.trim();
  if (!text) { status.textContent = 'Write a short line first.'; return; }
  output.textContent = heuristic(text, tone);
  status.textContent = 'Heuristic rewrite ready.';
};

let generator;
async function getGen() {
  if (generator) return generator;
  status.textContent = 'Loading small text model…';
  const {pipeline} = await import('@xenova/transformers');
  generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small');
  status.textContent = 'Model ready.';
  return generator;
}

modelPass.onclick = async () => {
  const text = input.value.trim();
  if (!text) { status.textContent = 'Write a short line first.'; return; }
  modelPass.disabled = true;
  try {
    const pipe = await getGen();
    status.textContent = 'Rewriting with local model…';
    const prompt = `Rewrite this sentence in a ${tone} tone. Keep the meaning. Sentence: ${text}`;
    const result = await pipe(prompt, {max_new_tokens: 64});
    const gen = Array.isArray(result) ? (result[0].generated_text || '') : String(result);
    output.textContent = `${gen.trim()}\n\n— ${tone} pass (on-device model)`;
    status.textContent = 'Model pass done.';
  } catch (err) {
    console.warn(err);
    output.textContent = heuristic(text, tone);
    status.textContent = 'Model unavailable — heuristic used instead.';
  } finally {
    modelPass.disabled = false;
  }
};

input.value = 'We help teams ship better websites faster.';
