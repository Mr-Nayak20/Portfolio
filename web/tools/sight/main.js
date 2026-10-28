const file = document.querySelector('#file');
const preview = document.querySelector('#preview');
const dropLabel = document.querySelector('#drop-label');
const run = document.querySelector('#run');
const clearBtn = document.querySelector('#clear');
const status = document.querySelector('#status');
const output = document.querySelector('#output');

let objectUrl = '';
let captioner;

function setImage(f) {
  if (!f || !f.type.startsWith('image/')) {
    status.textContent = 'Choose an image file.';
    return;
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(f);
  preview.src = objectUrl;
  preview.hidden = false;
  dropLabel.hidden = true;
  run.disabled = false;
  status.textContent = `${f.name} · ready`;
}

file.addEventListener('change', () => setImage(file.files[0]));
const drop = document.querySelector('#drop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = '#161616'; });
drop.addEventListener('dragleave', () => { drop.style.borderColor = ''; });
drop.addEventListener('drop', e => {
  e.preventDefault();
  drop.style.borderColor = '';
  setImage(e.dataTransfer.files[0]);
});

clearBtn.onclick = () => {
  file.value = '';
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = '';
  preview.hidden = true;
  preview.removeAttribute('src');
  dropLabel.hidden = false;
  run.disabled = true;
  output.textContent = '';
  status.textContent = 'Waiting for an image.';
};

function localHints(img) {
  const canvas = document.createElement('canvas');
  const w = 48, h = 48;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0, g = 0, b = 0, n = w * h;
  for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
  r /= n; g /= n; b /= n;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const tone = lum > 180 ? 'bright' : lum < 70 ? 'dark' : 'mid-tone';
  const dominant = r > g && r > b ? 'warm / reddish' : b > r && b > g ? 'cool / bluish' : 'green-leaning or neutral';
  return `LOCAL READ\nA ${tone} frame with a ${dominant} cast.\nApprox average RGB (${r|0}, ${g|0}, ${b|0}).`;
}

async function getCaptioner() {
  if (captioner) return captioner;
  status.textContent = 'Loading vision model…';
  const {pipeline} = await import('@xenova/transformers');
  captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
  status.textContent = 'Model ready.';
  return captioner;
}

run.onclick = async () => {
  if (!preview.src) return;
  run.disabled = true;
  output.textContent = '';
  try {
    const hints = localHints(preview);
    try {
      const pipe = await getCaptioner();
      status.textContent = 'Looking…';
      const result = await pipe(preview.src);
      const caption = Array.isArray(result) ? (result[0].generated_text || '') : String(result);
      output.textContent = `CAPTION\n${caption.trim()}\n\n${hints}`;
      status.textContent = 'Done — image never left this device.';
    } catch (err) {
      console.warn(err);
      output.textContent = `${hints}\n\n(Vision model unavailable — colour read only.)`;
      status.textContent = 'Model unavailable — used local colour analysis.';
    }
  } finally {
    run.disabled = false;
  }
};
