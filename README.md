# Shivansh Nayak — The House of Ideas

A cinematic, room-by-room portfolio for AI work, web products, art, writing, reading, and open questions. Built as a lightweight Vite site with separate live front-end showcases.

## Run

`npm ci` then `npm run dev`. Build with `npm run build`.

## Rooms and projects

- `/` — the villa entrance, Ezra concierge, AI studio, web atelier, library, gallery, observatory, and current work
- `/virality/` — creator website and local sample-outline studio
- `/fizzi/` — 3D soda storefront, flavour selection, demo shopping bag
- `/substance/` — creative studio, real-time material controls, editorial studies
- `/sleepy/` — product narrative, image sequence, demo shopping flow
- `/nocturne/` — cinematic fragrance website with ingredient chapters and demo bag
- `/velocity/` — footwear experience with X-ray, thermal and CAD lens controls
- `/credits/` — original sources, adaptation scope and license notices

## Ezra and Hermes connection

Ezra has a deterministic guided tour in the front end. Conversational replies are disabled until a backend endpoint is configured; the interface does not invent AI responses.

Set `VITE_EZRA_API_URL` in the deployment environment to the HTTPS endpoint that will proxy requests to Hermes. The browser sends a JSON `POST` body:

```json
{
  "message": "What is Shivansh building with Hermes?",
  "conversation_id": "session-id",
  "context": {
    "path": "/",
    "room": "#ai-studio"
  }
}
```

The endpoint should respond with JSON containing a string `reply` (or `message` or `content`) and may return a replacement `conversation_id`:

```json
{
  "reply": "Shivansh is building a personal assistant with Hermes.",
  "conversation_id": "session-id"
}
```

The endpoint must allow browser CORS requests from the portfolio origin. Keep Hermes credentials and provider keys on the server; do not put them in `VITE_*` variables or browser code. Add server-side authentication, rate limits and any privacy controls in the Hermes proxy.

## Project notes

Virality's outline generator is a local front-end demonstration, not a live AI model. Store checkouts and drop registrations are demonstrations; no payments, orders or remote registrations occur. Substance's enquiry form composes a mailto draft.

Original foundations: Sammy212/fizzi-soda, drcmda/the-substance (Paul Henschel), lawxr/sleepy (David Hernández), and blendi-remade/dioramas (Blendi). License notices are retained in `web/public/credits/`. Dioramas images and generated assets are CC BY 4.0; the villa imagery is attributed in the page footer.
