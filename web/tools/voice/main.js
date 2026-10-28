const mic = document.querySelector('#mic');
const toggle = document.querySelector('#toggle');
const clearBtn = document.querySelector('#clear');
const saveBtn = document.querySelector('#save');
const status = document.querySelector('#status');
const output = document.querySelector('#output');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;
let transcript = '';

try {
  const saved = localStorage.getItem('voice-note-v1');
  if (saved) {
    transcript = saved;
    render();
    status.textContent = 'Restored a note saved on this browser.';
  }
} catch {}

function outlineFrom(text) {
  const parts = text.split(/[.?!]\s+|\n+/).map(s => s.trim()).filter(Boolean);
  if (!parts.length) return '';
  const bullets = parts.slice(0, 8).map((p, i) => `${i + 1}. ${p}`).join('\n');
  return `\n\nOUTLINE\n${bullets}`;
}

function render() {
  output.textContent = transcript ? `TRANSCRIPT\n${transcript}${outlineFrom(transcript)}` : '';
}

function setListening(on) {
  listening = on;
  mic.classList.toggle('live', on);
  mic.setAttribute('aria-pressed', String(on));
  mic.textContent = on ? 'Listening…' : 'Hold to talk';
  toggle.textContent = on ? 'Stop ↗' : 'Start listening ↗';
}

if (!SpeechRecognition) {
  status.textContent = 'Speech recognition is not available in this browser. Try Chrome or Edge, or paste notes manually below.';
  toggle.disabled = true;
  const ta = document.createElement('textarea');
  ta.placeholder = 'Type a note instead…';
  ta.style.minHeight = '120px';
  document.querySelectorAll('.panel')[0].append(ta);
  ta.oninput = () => { transcript = ta.value; render(); };
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';

  recognition.onresult = event => {
    let interim = '';
    let finalChunk = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalChunk += piece + ' ';
      else interim += piece;
    }
    if (finalChunk) transcript = (transcript + ' ' + finalChunk).replace(/\s+/g, ' ').trim();
    output.textContent = `TRANSCRIPT\n${(transcript + (interim ? ' ' + interim : '')).trim()}${outlineFrom(transcript)}`;
  };
  recognition.onerror = e => {
    status.textContent = 'Speech error: ' + (e.error || 'unknown');
    setListening(false);
  };
  recognition.onend = () => {
    if (listening) {
      try { recognition.start(); } catch { setListening(false); }
    }
  };
}

toggle.onclick = () => {
  if (!recognition) return;
  if (listening) {
    listening = false;
    recognition.stop();
    setListening(false);
    status.textContent = 'Stopped.';
    render();
  } else {
    try {
      recognition.start();
      setListening(true);
      status.textContent = 'Listening — speak clearly toward the mic.';
    } catch (err) {
      status.textContent = 'Could not start recognition.';
    }
  }
};

clearBtn.onclick = () => {
  transcript = '';
  render();
  status.textContent = 'Cleared.';
  try { localStorage.removeItem('voice-note-v1'); } catch {}
};

saveBtn.onclick = () => {
  try {
    localStorage.setItem('voice-note-v1', transcript);
    status.textContent = 'Saved in this browser only.';
  } catch {
    status.textContent = 'Could not save to local storage.';
  }
};
