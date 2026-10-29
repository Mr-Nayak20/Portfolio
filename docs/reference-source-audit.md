# DontMatter homepage source audit

Inspected live HTML and linked first-party CSS/JS from https://dontmatter.eu/ on 29 October 2026. This is source-level evidence, not a browser screenshot or measured frame-rate audit. No Browser extension tool is available in this session, so visual parity is unverified.

Reference sources cached at `/tmp/dontmatter-reference.html`, `/tmp/dm-home.css.pretty`, `/tmp/dm-app.css.pretty`, `/tmp/dm-home.js`, `/tmp/dm-app.js`.

## Exact homepage sequence

1. **Hero**: full-screen project image, centred default heading `We Build What Matters`, thumbnail strip near bottom. Two full-screen media layers only, with async swapping/crossfade. The active project hides the heading; restoring no project shows it again.
2. **What we do**: small centred `About Us` label, centred large statement with three underlined hover words, hover images.
3. **About us / reel**: container, aboutus wrap, then video reel. Current reference has no visible explanatory body paragraph; there is room for a 24/28px intro in CSS but no such block in live HTML. Reel itself has 1400/800 ratio and 50px bottom space.
4. **Clients**: small `Trusted By` label; repeating grayscale client logos, not small text names. Desktop each logo slot 200×200px, image width180px, gap100px. Mobile slot80px, image72px, gap16px.
5. **Services**: four stacked full-bleed panels: Logo Design & Visual Identity; Web Design & Development; Digital Marketing; Social Media Content. Each has a large background, 40% black overlay, mouse-following square video card, and fixed lower-left title inside clipped panel. Mobile square image with title absolutely centred in its own panel; card hidden and descriptive body hidden.
6. **Blog**: small uppercase `What’s New` heading, horizontal overflowing cards. Six actual stories. Unequal image ratios cycle4:5,1:1,16:9,4:5,16:9; title, dek, author/readtime.
7. **Footer**: oversized800px-wide logo; large vertical space; rotating current-time sentence; three-column lower contact/legal/copyright.

## Measurements / typography

- Colours black#161616, background#FAF9F6, gray#B0B0B0.
- Typeface is self-hosted licensed Helvetica Neue (`helvetica-neue`) at weight400. Use the existing system Helvetica Neue fallback unless the user supplies a licensed web font; do not copy proprietary binaries.
- Container max-width1600px, centered,100px side padding;50px at≤1200;20px at≤992.
- Fixed header25px vertical padding. Logo width clamp160–233px. Right-side gap clamp50–200px; current implementation uses28–72px so its header is much tighter.
- Hero min-height100vh; mobile74vh. Hero wrap flex-centred100vh/74vh. Heading clamp(38px,21.019px +4.9363vw,100px), line-height clamp(58px,41.019px +4.9363vw,120px).
- Thumb strip bottom100px desktop,30px mobile,66px squares,5px gap,10px padding; hover/active1.2× scale. Mobile scroll-snap.
- Statement desktop height100vh, width80%, font400 3.6vw/1 Helvetica Neue. Mobile auto-height with100px block padding; width92%,27px/33px. Current branch puts a min-height100vh on mobile too and caps/loosens typography with clamp and1.15line-height.
- Clients padding clamp(50px,22.611px +7.96178vw,150px); reference label14px/17px. Current names at22px do not resemble this logo band.
- Services desktop height calc(100vh +200px). Background bleed18vh above AND below (height100%+36vh), transform parallax. Uniform black40% overlay, not heavy lower gradient. Desktop title50px normal, fixed bottom100px with50px side inset. Mobile title26px/36px, square full-width panels, title absolute within panel. Current mobile titles incorrectly remain fixed to viewport.
- Blog padding clamp100–120px block. Header14px/17px (current56px heading too large). Blog side padding100px,50px at≤992,20px at≤768. Card widths25%desktop,50%≤992,60%≤768,71%≤576,80%≤370,90%≤345. Titles18px/22px, dek16px/20px, meta16px/40px. Current22px titles and78%mobile cards differ.
- Footer padding60px60px120px, then50px50px120px≤1200,50px20px90px≤992. Logo max800px, bottom margin clamp50–150px. Current wordmark/paragraph spacing is much smaller and bottom padding48px leaves floating nav crowded.
- Bottom nav reference switches at768px, not900px. Desktop centred bottom40px,49px min-height, padding10px15px, text16px, menu gap30px. Context-sensitive menu changes to active section label/link, not persistent all-page uppercase tabs. Mobile left/right70px collapsed,15px expanded;29px hamburger and24px/32px expanded links.

## Motion evidence / performance differences

- Reference hero uses only2 background layers and decodes/awaits incoming image before0.5second GSAP crossfade. Current creates20 full-screen images and tweens every one on every selection (unnecessary layers/decode/network).
- Reference auto-advance3500ms; delay5000ms before starting. Stops for inactive/hidden hero, touch and hover states; current only pauses on hidden document/thumbnail hover.
- Reference hover card follows pointer via GSAP quickTo0.6s power3.out. CSS card appearance0.45s.
- Reference page wipe cover1.15s, reveal1.35s (power2.inOut), transform-only force3D. The user's request to reduce perceived lag may justify shortening duration while retaining same direction and shape. Current CSS transition setup plus delayed navigation is not equivalent to reference JS; arrival is staged into one frame so CSS may not paint starting state.
- Current `home.js` runs `mark()` every animation frame AND on every scroll, reading each panel's rectangle then writing transforms before reading next panel. This causes repeated forced layout while idle. Use one scheduled scroll/resize update, batch reads before writes; stop when chapters out of view.
- Current `shell.js` starts its own permanent Lenis RAF alongside chapter permanent RAF and GSAP ticker. Native scrolling + event-driven parallax can preserve visuals with less background work.
- Current service titles use fixed positions without clipping and mobile override retains fixed: leads visible over other sections, conflicts with intended design.

## Prioritised adaptations

Keep user-specific services/content, but reproduce the above section sequence, scale, whitespace and responsive behaviour. Add centred personal hero heading, use2image layers, size-aware HD images/thumbnail variants, replace text list with project wordmark logos in correctly sized slots (label honestly as Selected Studies rather than Trusted By), align service clipping/mobile position, lower blog heading to14px, and match footer whitespace. Do not claim screenshot-level parity without an available browser for visual QA.
