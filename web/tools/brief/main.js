const input = document.querySelector('#input');
const output = document.querySelector('#output');
const status = document.querySelector('#status');
const run = document.querySelector('#run');
const sample = document.querySelector('#sample');

const SAMPLE = `Portfolios often promise intelligence and deliver links. Brief exists to reverse that habit. You paste a long page — a research note, a transcript, a draft that grew too proud of itself — and the browser compresses it without shipping your words to someone else's GPU.

The first run feels patient. A small summarisation model downloads into cache, then stays close. After that, the tool is less magic and more instrument: cut the noise, keep the claim, leave the rest on the cutting-room floor.

This is not a substitute for reading. It is a way to decide whether a text deserves a second pass.`;

sample.onclick = () => { input.value = SAMPLE; };

let summarizer;
async function getPipe() {
  if (summarizer) return summarizer;
  status.textContent = 'Loading summarisation model…';
  const {pipeline} = await import('@xenova/transformers');
  summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
  status.textContent = 'Model ready.';
  return summarizer;
}

function fallbackSummary(text) {
  const sentences = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const picked = sentences.slice(0, 3).map(s => s.trim()).filter(Boolean);
  const bullets = sentences.slice(0, 5).map(s => '• ' + s.trim()).join('\n');
  return `BRIEF\n${picked.join(' ')}\n\nBULLETS\n${bullets}`;
}

run.onclick = async () => {
  const text = input.value.trim();
  if (text.length < 40) {
    status.textContent = 'Paste at least a short paragraph.';
    return;
  }
  run.disabled = true;
  output.textContent = '';
  try {
    const pipe = await getPipe();
    status.textContent = 'Summarising…';
    const chunk = text.slice(0, 2800);
    const result = await pipe(chunk, {max_new_tokens: 120, min_length: 30});
    const summary = Array.isArray(result) ? (result[0].summary_text || result[0].generated_text) : String(result);
    const bullets = summary.split(/(?<=[.!?])\s+/).filter(Boolean).map(s => '• ' + s).join('\n');
    output.textContent = `BRIEF\n${summary.trim()}\n\nBULLETS\n${bullets}`;
    status.textContent = 'Done — still on your device.';
  } catch (err) {
    console.warn(err);
    output.textContent = fallbackSummary(text);
    status.textContent = 'Model unavailable — used a local extractive fallback.';
  } finally {
    run.disabled = false;
  }
};
