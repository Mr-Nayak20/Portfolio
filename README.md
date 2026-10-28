# Shivansh Nayak — portfolio

DontMatter-inspired personal portfolio: full-screen project gallery, thumbnail strip, four services, working in-browser AI tools, reading room, and oversized wordmark footer. Implementation is original; adapted project foundations are credited.

## Run

`npm ci`, then `npm run dev`. Production build: `npm run build` → `dist`.

## Content

- **Websites:** Nayak, Nocturne, Sleepy, Velocity Lab, Virality OS, Fizzi Soda, The Substance, Pulse, Lumen — each opens as its own route.
- **Services:** Website development, Software, AI development, Writing & design.
- **AI tools (in-browser):** Brief (summarise), Tone (rewrite), Sight (image caption), Voice (speech notes). Models via Transformers.js / Web Speech; no API keys.
- **Reading library:** 100 titles in `web/books.json` (statuses unconfirmed). Notes save in `localStorage` only.

## Ezra

Set `VITE_EZRA_API_URL` for Hermes chat. Without it, navigation shortcuts remain available.

## Credits

See `web/public/credits/`. Pulse & Lumen are original concepts informed by common Three.js + GSAP product patterns. Virality, commerce, and AI demos are front-end only.
