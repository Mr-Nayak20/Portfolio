# Performance and media evidence

## Evidence boundary

This review is based on source inspection, filesystem byte sizes and native `sips` image dimensions. It does not contain browser frame-rate measurements, Core Web Vitals, interaction traces or mobile GPU results. Browser access was unavailable for this revision. No screen recording or replacement screenshot was fabricated.

## Measured assets

Run `node scripts/media-manifest.mjs` from the repository root to regenerate `docs/media-manifest.json`.

- 20 real existing upstream website previews, each 1280×800.
- Native preview total: 1,791,330 bytes.
- All native,320px and640px preview variants: 2,564,712 bytes.
- GLBs in the20project model directories: 302,336,596 bytes. This is an on-disk inventory, not the initial homepage download; individual scenes load their own assets and some directories include alternate files.
- No new videos or fresh HD captures have been produced. Every manifest entry explicitly records that status.

## Verified source strategies

- Homepage uses two full-screen hero layers, waits for decoding and fades only the incoming layer. It does not render20liveWebGLscenes.
- Hero autoplay stops when offscreen or documenthidden. Smaller320px thumbnail files are separate from native previews.
- Service parallax is scheduled by scroll/resize rather than a permanent idle layout loop; rectangle reads precede transformwrites.
- Scene JavaScript is reached through per-study dynamic entrypoints. Model loading uses a per-Assets cache and bounded60secondrequests.
- Shared scene rendering has DPR caps1.25forcoarsepointers and1.5otherwise. Hidden documents skip scene updates/rendering, although the RAF callback remains scheduled.
- Cinema uses threegroups for loopcontinuity, lazy image decoding and a35px/sec animation. It cancels itsframe onhidden/offscreen/hover/focus/manualpause; reducedmotion showsstaticcontent. It uses scrolling rather than a transform-onlycompositor track, so browser traces are needed before calling it lag-free.
- No livevideo decoding is currently active on thecinemapage.

## Remaining actionable bottlenecks

1. Several scenes allocate4096²shadowmaps: Atlas,Gambit,Artemis,Kōen. Koi uses3072². Device-aware shadow limits should be evaluated while preserving image quality.
2. The shared post stack defaults to ambient occlusion16samples/denoise8, bloom8levels and SMAA. DPR caps alone do not remove this cost; tune and measure effects on representative devices rather than globally blurring the output.
3. `Engine.start()` runs every tick callback before testing`engine.paused`. Some scene callbacks include costly reflection or geometry work, so the pauseflag is not complete offscreen suspension. Preserve scroll-driven unpause detection when changing this; simply skipping all callbacks can permanently freeze a scene.
4. Cinema creates60imageelements for20uniqueURLs. Network caching avoids threecopies ofeachfile, but browserdecode/GPUresidency and thelazyloadwindow still need measuring. Keep responsivevariants forsmallcards; avoid rendering additional canvases.
5. High-resolution freshcaptures will increasebytes. Generate responsive sizes, use an active-video-only policy and measure quality/transfer size before replacing existingassets.

## Required runtime acceptance

For desktop and a representative mobiledevice: record browser/device, viewport,DPR,cold/warmnavigation, firstusableframe, frame-time distribution during scroll/reelinteraction, longtasks and memory. Test all20primaryinteractions and recovery after tabvisibility changes. Capture before/after measurements under identical conditions. Update thetestmatrix individually; buildsuccess/HTTP200 doesnot proveWebGLrendering.
