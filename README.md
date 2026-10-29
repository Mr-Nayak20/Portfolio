# Shivansh Nayak — portfolio

A Vite multi-page portfolio focused on four services: website development, software, AI development, and writing & design. The homepage follows the reference’s sequence: project hero, personal statement, reel, selected-study wordmarks, four service panels, journal, footer. The reference’s proprietary font files and brand assets are not bundled.

## Run

`npm ci`, then `npm run dev` → http://127.0.0.1:5173/.

The twenty interactive studies, shared rendering code and required models/images are now in this repository. No separate server on port 5190 or neighbouring checkout is needed. Each study is built to `/examples/<slug>/`. Case studies use `/works/<slug>/`.

`npm run build` outputs `dist`. Serve with `npx vite preview --port 5174`. After building, `npm run check:studies` validates all twenty study entrypoints, referenced entry assets, preview images and GLB integrity. Add a serving origin to check their HTTP responses: `node scripts/check-studies.mjs http://127.0.0.1:5174`.

## Code map

- `web/site/data.js`: profile, four services, twenty studies and four journal articles.
- `web/site/home.js`: two-layer decoded hero crossfades, thumbnail rail, service panels and journal.
- `web/site/shell.js`: shared header/footer, contextual navigation, contact forms and page transitions.
- `web/site/pages.js`: internal page renderers.
- `web/site/site.css`: reference composition and responsive layouts.
- `web/examples/`: twenty study entrypoints, each dynamically loading its scene.
- `web/src/core/`: shared Three.js engine, asset loading, progress, and explicit load-error recovery.
- `vite.config.js`: build entrypoints and generated static case-study/article routes.

## Behaviour and scope

The portfolio uses native scrolling, event-scheduled parallax and two hero image layers; it no longer runs an idle homepage layout loop or delays navigation by 1.15 seconds. Page wipes use 280 ms cover / 380 ms reveal. Hero autoplay pauses offscreen and when the tab is hidden. Reduced-motion preferences are honoured. Scene rendering is capped at DPR 1.25 on touch devices and 1.5 on desktop.

A failed scene import, missing asset or unsupported WebGL now presents a still preview with retry/return controls. Long loads offer recovery after 30 seconds; asset requests reject after 60 seconds rather than leaving a permanent 0% loader. A failure view is explicitly a still preview, not a claim of successful interaction.

The real website previews supplied upstream are 1280×800. Those originals are preserved; separate 320px and 640px files serve smaller uses. They have not been upscaled or described as fresh HD captures. Higher-resolution native screenshots and visual/device/frame-rate QA require browser access, which was unavailable during this revision.

Brief and Sight download Transformers.js models and process input locally. Tone starts with explicit heuristic transforms and offers an optional model. Voice uses browser speech recognition, whose processing location depends on the browser; saved notes stay in localStorage. No backend or model/API key is included. Contact forms open an email draft rather than claiming server delivery.

Reading and art sections are on hold. The old reading data and earlier demo routes remain in the repository but are not added to this homepage. The current shared shell does not connect Ezra; an older unused frontend contains that integration. No unsupported career history, awards or client claims were added.

## Credits

The twenty 3D study foundations are adapted from [Dioramas by Blendi](https://github.com/blendi-remade/dioramas). Code and generated assets retain their upstream notices (MIT and CC BY 4.0 respectively). See `web/public/credits/`. The sites are labelled studies, not commissioned client work. Earlier Fizzi, Sleepy and Substance routes retain their own credits.
