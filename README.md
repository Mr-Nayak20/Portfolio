# Shivansh Nayak — portfolio

Personal portfolio recreating Dontmatter’s broad composition: full-screen project gallery, thumbnail strip, centered editorial sections, full-bleed image sections, floating bottom navigation, and oversized wordmark footer. Implementation is original; project assets and personal content replace the reference’s work. Typography uses the system Helvetica Neue/Helvetica stack; proprietary font binaries have not been copied.

## Run

`npm ci`, then `npm run dev`. Production build: `npm run build` → `dist`.

## Content

- Seven website destinations: Nayak, Nocturne, Sleepy, Velocity Lab, Virality OS, Fizzi Soda, The Substance.
- AI workbench: Langflow, CrewAI and LangGraph are credited third-party source candidates, not deployed products or claimed original work. Review current upstream licenses and maintenance guidance before adapting.
- Reading library: 100 real titles across 10 categories in `web/books.json`. Every entry defaults to **Unconfirmed**. No title is represented as having been read by Shivansh. Personal-blog fields are blank draft spaces with reflection prompts. Reading status and journal notes save in browser local storage only, not to a server.
- Hobbies: sample imagery is labelled; personal paintings and photographs are still to be supplied.

## Ezra connection

Set `VITE_EZRA_API_URL` to your own Hermes proxy endpoint. The frontend sends JSON `POST` requests containing `message`, `conversation_id`, and `context: {path, room}`. Expected JSON response: `{reply: string, conversation_id?: string}`. `message` or `content` strings are also supported as response aliases. Keep all model/API credentials on the backend. With no endpoint configured, conversational input is disabled and navigation shortcuts remain available.

## Credits and demo scope

Original adapted project foundations: Sammy212/fizzi-soda, drcmda/the-substance, lawxr/sleepy, blendi-remade/dioramas. Notices are in `web/public/credits/`; Dioramas imagery and generated assets are CC BY 4.0. Villa and sample studio imagery: Dioramas. Substance project images retain their original asset provenance; they are sample imagery on the personal portfolio.

Virality generation is a local sample-outline demonstration. Commerce and drop-registration flows are demos; no real purchases, payments or registrations occur.
