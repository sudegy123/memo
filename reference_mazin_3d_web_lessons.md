---
name: reference-mazin-3d-web-lessons
description: "LOAD for any Three.js/GLB web hero or scroll-animation job: lessons from the Dr. Mazin jar project not in other notes - GLB texture surgery, phone sharpness/pixel-ratio policy, scroll-vs-canvas lag, copy-emerging choreography, refresh placeholder + progress line, real-GPU testing, Cloudflare deploy trimming"
metadata:
  type: reference
---

Full copy also at Documents/3D-WEB-LESSONS-LEARNED.md (user-visible). Complements [[reference-3d-web-hero-techniques]], [[reference-cine-generator-techniques]], [[reference-web-perf-optimization-prompt]], [[feedback-ultimate-fix-prompt]], [[project-dr-mazin-app]], [[project-mazin-jar-model]].

# 3D Web Lessons Learned — Dr. Mazin jar hero (Sept 2026)

Everything below was learned building the Dr. Mazin 3D jar landing page (Three.js + a Blender-made GLB, scroll-driven
animation, phone tuning, Cloudflare deploy). It only covers things **not already in** the older notes
(`reference_3d_web_hero_techniques`, `reference_cine_generator_techniques`, `reference_blender_fast_3d_pipeline`,
`reference_web_perf_optimization_prompt`, `feedback_ultimate_fix_prompt`, `feedback_hard_debug_protocol`).
Numbers are real measurements from this project; "not tested" items are listed honestly in section 10.

---

## 1. Working with GLB / model files

**1.1 Editing a GLB's textures without touching the model (Python, no tools needed).**
A GLB = 12-byte header + JSON chunk + BIN chunk. To swap images: read JSON, for every `bufferView` copy its bytes into a new
BIN (replace the ones that back `images[i].bufferView`), re-align each view to 4 bytes, rewrite every `byteOffset/byteLength`,
update `images[].mimeType` and `buffers[0].byteLength`, pad JSON with spaces and BIN with zeros, rewrite the header total length.
**Verify:** compare every non-image bufferView byte-for-byte with the original (we got 45/45 identical) and that
`accessors/nodes/animations/materials/meshes/scenes` JSON is equal. Keep the original GLB as a backup first.

**1.2 The web GLB's label was a heavily compressed JPEG.** Blender's web export had 4096×512 JPEG label textures (105 KB colour, 58 KB ORM).
Replacing them with the lossless 4096 PNGs from the `tex/` source folder cost only **+84 KB** total. Lesson: when a texture
looks soft, look at the *file inside the GLB* (extract it via bufferView) before touching renderer settings.

**1.3 Progressive texture enhancement (best size/quality trade).**
Ship the safe 4096 texture inside the GLB; after the scene is live, load an 8192×1024 texture in the background and swap it into
the material. Save it as **lossless WebP** (231 KB vs 1,101 KB PNG, mean diff 0.00). Gate on capability:
`renderer.capabilities.maxTextureSize >= 8192`, `navigator.deviceMemory` (undefined on Safari — treat as capable) `>= 4`,
`!navigator.connection.saveData`, not `2g`. When swapping, copy the old texture's `flipY` (glTF = false), `colorSpace`, `wrapS/T`,
`channel`, filters; set `anisotropy`; call `renderer.initTexture(tex)` so the GPU upload happens once, off a scrolling frame;
then `old.dispose()`. Measured effect on an emulated 3× iPhone: only ~+7 % sharpness — the render resolution (1.5 below) mattered far more.

**1.4 Animation clips as a scrubbable timeline.** Play every clip, then drive it with `mixer.setTime(open * dur)`; use
`dur = min(clip durations) - 0.002` so the last frame never wraps. Only call `setTime` when `open` actually changed
(skips a per-frame evaluation once the lid is open).

**1.5 Measure BOTH end poses when auto-fitting.** Bounding boxes for closed and open (lid on the side) differ. Use one fixed framing
based on the **open** radius so the jar body never changes size when the lid lifts. Also know your model's parts by name
(`Cream`, `Cap_Assembly`, `M_Label_Black_Gold`) — the cream top/centre gives you the "mouth" for effects (light column, drops, dive target).

**1.6 A transparent placeholder captured from the live scene (better than a studio render).**
The old placeholder photo had a grey studio background → visible halo on a dark page. Instead: `renderer` has `alpha:true`; freeze the
pose, `setPixelRatio(2)`, `render()`, then `canvas.toDataURL('image/png')` **in the same task** (drawing buffer is cleared after
compositing). Crop a square centred on the jar centre → WebP with alpha (23 KB). It matches the live jar exactly. Size it with
container-query units (`container-type:size` on the stage; `width:min(100cqw,100cqh)`), because the live jar scales with the stage's
smaller side. Verified: heights match to the pixel; widths differ only because random gold specks differ per load.

**1.7 Draw calls / triangles can double for a harmless reason.** After the sequence the jar became visible all the time; before it was
scrolled off-screen (frustum-culled). Compare `renderer.info.render.calls/triangles` only when the same things are visible.

---

## 2. Rendering quality & performance on phones

**2.1 A shared "tier" system can misclassify phones.** `quality.js` put every phone with `dpr >= 3 && width < 900` in tier `low`,
which capped the canvas at **1×** on a 3× screen with **no antialiasing** → blocky jar on the real iPhone. Give the hero its own
policy: pixel-ratio cap 2.5 (2 if `deviceMemory < 4`; 1 on tier `min`), antialias on everywhere except `min`, anisotropy 8 on all tiers.
Measured (emulated 390×844 @3×): sharpness 23 → 73 (3.2×) for ~1–4 fps.

**2.2 fps guard: react to real trouble, step gently, never hitch.**
First version fired at "< 42 fps" — on a slow laptop that is *normal*, so it switched the glass off mid-animation
(shader recompile = an 842 ms frame, and the look changed). Final: 1.2 s windows, **three** slow windows in a row, ladder
2.5 → 2 → 1.5 → 1.25 → 1; below 1.5× only if < 24 fps; glass off only if < 20 fps (last resort).

**2.3 Shader compile hitches on first appearance.** Objects that start `visible=false` (oil drops, ripples) are skipped by
`renderer.compile`, so their programs compile the first time they show = a mid-animation freeze. At warm-up: set them visible,
`renderer.compile(scene, cam)`, then one real `render()` (also uploads textures and builds the transmission render target), then hide.

**2.4 Glass (transmission) cost.** A/B on an Intel HD 520 at 1366×768: glass off ≈ +4–7 fps; pixel-ratio 0.75 ≈ +3–4 fps.
Neither was the main problem — the PC's other load was. Don't remove features for a few fps without measuring the alternative.

**2.5 Draw at half rate when the canvas is only a dim background.** Once the jar is fixed and behind the text (opacity ≈ 0.6) render every
other frame and carry the skipped `dt` into the next (`skipAcc`). Full rate again at the top, while dragging, and during the dive.
Measured A/B: ≈ +3 fps average on the slow laptop, no visible change.

**2.6 Per-frame CSS-variable writes are expensive.** `style.setProperty('--x')` on an element every frame re-styles its whole subtree
and repaints any gradient that uses `var(--x)`. Replace with a promoted element + `transform: translate3d()` (compositor-only),
quantize values (0.5 px / 0.05 opacity) and write only when changed. Same for the scroll cue (write `opacity` directly).

**2.7 Layout thrash.** Cache `getBoundingClientRect()` results at resize time (`SL/ST/W/H`); never read layout right after writing styles
in the frame loop. A `ResizeObserver` on a container whose height you animate re-triggers your own `measure()` every frame — skip it
while animating and shift cached positions arithmetically instead of re-measuring.

**2.8 `backdrop-filter` over a live canvas** is re-blurred every frame the canvas changes. On the hero screen the header/signature bar
(≈ 96 % opaque anyway) had their blur disabled with `html.<flag>:has(#s0.active)`; every other screen keeps its glass.

**2.9 Text blur during flight.** `filter: blur()` re-rasterises at every distinct radius: step in whole pixels, skip on low tier,
and add `will-change` **only while** the element is in flight (remove it after). Don't apply `filter` to hidden (opacity 0) elements.

---

## 3. Scroll-driven animation & choreography

**3.1 Canvas vs page scrolling on phones (root cause of "the model lags when I swipe").**
Page text is moved by the compositor thread 1:1 with the finger; a canvas that *follows scroll* is redrawn by the main thread, so it
trails. Two fixes, in order of impact:
1. **Stop making the canvas depend on scroll** once the intro is over: fix the jar in the viewport (measured after: ≤ 0.1 px/frame
   movement, ≤ 2.5 px total = its idle float, during hard flicks).
2. While it must follow scroll: read `window.scrollY` every frame (not only in `scroll` events) and shorten the easing
   (τ 140 ms → 40 ms: **trailing 65 px avg / 105 max → 25 / 37**).
Measure lag as *jar centre vs a steady-state reference curve* (record on a separate page load), during real touch flicks.

**3.2 Sticky stage + z-order.** `position: sticky; top: header` stage with a negative bottom margin equal to its height takes no flow
space. To put the canvas *behind* the copy, give it `z-index:-1` inside the (already stacking-context) content wrapper; keep the stage
`pointer-events:none` and add a small `.grab` child that is `pointer-events:auto` only when interaction is allowed
(page near the top and not diving). `touch-action: pan-y` on that grab area keeps vertical page scroll on touch while horizontal
drags rotate. Empty spacer elements above it need `pointer-events:none` or they swallow the drag.

**3.3 Copy "emerging" from an object — drive it from live positions, never from a timed flight.**
Per frame: block's natural page position (transform-free `offsetTop` chain, cached at measure time) − `scrollY` vs the jar mouth.
State per block: `reached` **latch** (once out it must not retract while the layout is changing), eased `e` toward 0/1 with a
rate limit (`min(dt,.05)*2.4`) so a slow frame can't make text jump, inline `transform/opacity` only while in flight, then a class.
Result: worst per-frame movement 22–43 px at 60 Hz (earlier version: 100–190 px). The very last blocks popped back into the jar
until the latch was added.

**3.4 Closing a layout gap without a visible jump.** A full-screen spacer above the copy was needed for the first screen but left a big
gap afterwards. Shrinking it in **one frame** moved text 266 px. Instead: drive it from the return progress (`spacer = from + (goal-from)*ret`),
compensate `scrollTo(scrollY - delta)` by exactly what was removed, shift cached block positions by `delta` (no DOM re-measure).
Gotcha: the collapse changes `scrollY` and the total scroll range, so scroll-progress `P` *fell below the trigger* and the return leg stalled →
**latch the state** (`shrunk`) once it has begun. Also stop treating the collapse frame as a "jump" in tests — check screen positions.

**3.5 Two spins that join.** A scroll-tied full turn during the slide (`slide = smooth((P-.03)/.82)`) + a time-eased turn on the return
(`-2π(1-ret)`): both go the same direction and the first ends exactly on a full revolution, so `rotation.y = base + 2π·slide − 2π(1−ret)` is
continuous. Latch `slide=1` once the return has begun (layout changes move `P`). Verify with **turn rate per second**, not per frame
(peak 13.4 rad/s at every size = design peak; a slow frame no longer looks like a jump).

**3.6 The "dive into the jar" button animation.** Fade the copy (class on `<html>`, `!important` opacity transition .45 s), bring the
background jar back to full brightness (`dim × (1 − smooth(dive))`), lerp the camera to just above the cream with exponential follow,
add a warm flash overlay late (`opacity = (dive−.5)*2`), call the real navigation after ~720 ms, then reset everything so coming back
restores the page. Skip it under reduced-motion. Turn the grab area off while diving.

**3.7 After the sequence: fixed, behind, dimmed, interactive only at the top.**
`dim = 1 − 0.42·smooth((scrollY−0.05H)/(0.30H))` on the stage's `opacity`; grab active when `scrollY < 0.22H`.
To avoid a pop when the jar detaches from the page, blend the rest position: `restY = 0.44H − scrollY·(1−ret)`.

**3.8 Test tolerances must include the idle animation.** A gentle float (`sin(t)*0.012`) moves the jar ≈ 5 px peak-to-peak; a 3 px
"jar is fixed" assertion failed once in three runs. Use ≤ 8 px, and test scroll-independence by comparing positions across scroll offsets.

---

## 4. Website / CSS lessons

**4.1 `text-shadow` on gradient text darkens it.** On `background-clip:text` (the gold headline) the shadow paints *over* the gradient.
Measured: gold pixels 9,966 → 322 and brightness 54 % of reference. Use shadows only on solid-colour text; check with a
pixel-brightness comparison against a "canvas hidden" reference screenshot.

**4.2 Fixed-position vs sticky for decorative 3D layers.** This app's design rules forbid decorative `position:fixed` layers on Android
(scroll bug); a sticky stage in normal flow respects that and scrolls with the document.

**4.3 A gold progress line, no spinner.** Thin 3 px line under the placeholder, fill driven by *real* stages
(libraries loaded 0.35 → model bytes via `GLTFLoader.loadAsync(url, onProgress)` up to 0.85 → scene ready 0.96 → first frame 1.0).
Between stages only *creep* toward the next stage's start (`shown += (ceil−shown)*.07` every 220 ms) so a slow connection shows life without lying.
RTL: `html[dir=rtl] … {transform-origin:right}` so it fills like the splash line. No text = nothing to translate.

**4.4 Refresh vs first visit.** The splash plays once per session, so a refresh skipped it and showed an empty hero for 5–8.6 s.
Fix = show the placeholder immediately + start downloads early: `<link rel=preload as=image fetchpriority=high>`, GLB with
`<link rel=preload as=fetch type=model/gltf-binary crossorigin>`, `modulepreload` for three, GLTFLoader, BufferGeometryUtils,
RoomEnvironment and the hero module. Result: picture ≈ 0.4 s, live jar ≈ 1.4 s. (Expect a console warning "preloaded but not used"
only when WebGL is unavailable — harmless.)

**4.5 RTL/LTR.** The app is Arabic-first; anything directional (progress fills, drag) must be checked with `html[dir]`.

---

## 5. Testing methodology that worked (and traps)

- **Real GPU beats software GL.** Headed Chromium with `--enable-gpu-rasterization --ignore-gpu-blocklist` used the actual Intel HD 520
  (~60 fps, starts in ~15 s). swiftshader (≈1 fps) is only for draw-call counts / pixel diffs. Playwright headed Firefox crashed here.
- **`python -m http.server` drops requests** (listen backlog 5) when the PC is busy → random "page never started"/module 404s that kill
  the whole ES-module graph. Use a threaded server with `request_queue_size=256` and `Cache-Control: no-store`
  (`http.server.ThreadingMixIn` + `HTTPServer`). Always `curl`/urllib the URL before opening a browser.
- **Touch input:** CDP `Input.synthesizeScrollGesture` with `gestureSourceType:'touch'` did **not** scroll. Use
  `Input.dispatchTouchEvent` (`touchStart` → many `touchMove` → `touchEnd`) for realistic flicks (~4500 px/s).
- **A/B on the same run, alternating.** When the CPU was at 100 % (Godot + VS Code) even the OLD code took 43–62 s to load.
  Compare old vs new alternately (or with a test hook such as `S.follow=7.13` reproducing the old easing) instead of trusting absolute numbers.
  Always print `Win32_Processor LoadPercentage` and the top CPU processes before blaming the page.
- **Test hooks are cheap and pay off:** `window.__hero3d = { S, jarRect(), scene, setGlass(), setDpr(), blocks }`, `S.freeze`, `S.frames`,
  a slow-frame log (`S.slowLog` with programs count / progress / guard step) found the 842 ms compile hitch in one run.
- **Separate the reference from the subject.** My first swipe test recorded its reference curve on a page that had already finished the
  sequence, so every later comparison was wrong (deviation "178 px"). Build references on a fresh page load and swipe on another.
- **Distinguish test artifacts from bugs:** coasting rotation after a drag counted as rotation while scrolled down (wait for inertia to end);
  per-frame jump metrics flag normal slow frames (normalise by dt / use rad·s⁻¹); a one-frame layout collapse is intended.
  When a check fails once in N runs, repeat it alone 3× before touching code.
- **Diff the whole request set.** Visit every screen offline (`page.route` abort non-local), record all local requests + statuses on the
  original and on the trimmed copy; the only allowed difference is the intentional asset swap.
- **Restart-safe habits:** after a session restart `main.js` was 0 bytes and a file had been overwritten. Keep a backup of every design
  iteration (`hero3d.vN-name.js/.css`, `index.vN.html`) and be able to diff the tree against the original zip.
- **Shell traps (Windows):** Git Bash rewrites arguments that start with `/` (URLs in `curl`, labels) — use Python `urllib` for status checks;
  complex heredocs with quotes/backticks can fail to parse — write files with the editor tool; use PowerShell for process work.

---

## 6. Deploying to Cloudflare Pages (static site)

- Read the deployment log: "No build command, no Wrangler file, no functions dir" ⇒ the repo root **is** the site; deployed files = source.
- A **Git-connected Pages project cannot take drag-and-drop uploads.** To test before replacing the live site: *Workers & Pages → Create →
  Pages → Upload assets* as a **new** project (own `*.pages.dev` address). Leave the folder's `index.html` at the root; no build settings.
- Per-file limit 25 MiB, ≤ 20,000 files.
- **Trim the deploy copy, not the working copy** (other sessions/servers may be using the working folder). Audit by *filename references*,
  then confirm the real uses (names that appear only in comments are unused). Removed: old hero video/stills, 4 unused backgrounds,
  a duplicate project folder, a zip, package.json, all `.md` notes. 195 → 117 files, **23.8 → 3.7 MB**.
- Convert the one big referenced PNG background to WebP (1,390 KB → 52 KB, 44 dB PSNR; full-screen screenshot diff 0.12/255) and fix the CSS URL.
- Three.js (1.2 MB unminified) is compressed by Cloudflare in transit — not worth hand-minifying.
- `pages.dev` is HTTPS, so camera features work there even though `http://192.168.x.x` on a phone may not.

---

## 7. Working style notes that paid off here

- **Take the user's phrase literally, then pin the ambiguity in the design** (e.g. "the jar slides down while text drops, then returns
  to the top" ≠ "the jar is fixed behind the text"). Keep the old sequence intact and apply new behaviour only *after it completes*
  when the user says so.
- **Keep alternative designs recoverable** (auto-play version, dock version, slide version) — the user asked to try several.
- **Report measured numbers and the untested list** every time (real iPhone, RTL, Firefox/Safari, deployed URL were never tested here).
- When a background test hangs twice the same way, change approach (different browser mode, smaller test, in-page recorder) instead of retrying.
- Git access: `gh` not installed; `git clone` of a private repo hangs on the credential manager in a non-interactive shell. Fast paths that worked:
  user downloads the repo zip; or crawl the live site (static, no build). GitHub Desktop is installed for signing in.

---

## 8. Numbers to remember

| Thing | Before | After |
|---|---|---|
| Refresh: picture / live jar | nothing / 5–8.6 s | 0.4 s / 1.4 s (quiet PC) |
| Phone sharpness (3× screen) | 1× render, no AA (score 23) | 2–2.5× + AA + aniso (score 73) |
| Jar trailing text on fast flick | 65 px avg (105 max) | 25 px (37) → ≤ 0.1 px/frame once fixed |
| Worst render frame (compile hitch) | 842 ms | none (warm-up compile) |
| Style recalcs during scroll (desktop) | 409–1191 | 335–460 |
| Code per frame | 2.2 ms | 0.5 ms |
| Label texture in GLB | 4096 JPEG (105 KB) | 4096 PNG lossless (159 KB) + optional 8192 WebP (231 KB) |
| Deploy folder | 195 files / 23.8 MB | 118 files / ~4.0 MB |

## 9. Reusable checklist for the next 3D web hero

1. Extract & look at the textures inside the GLB; keep source textures; ship lossless 4096, optionally lazy 8192.
2. Own pixel-ratio policy per page (not the shared tier); antialias + anisotropy; gentle fps guard.
3. Warm up: make every hidden object visible → `compile` → one `render`.
4. Canvas independent of scroll whenever possible; anything scroll-linked reads `scrollY` per frame with short easing.
5. Text emergence from live positions + latches; layout changes compensated and latched.
6. Instant placeholder captured from the live scene + real-progress line; preload the model.
7. Cache rects; no per-frame CSS-var writes; no backdrop-filter over the canvas; half-rate when only a background.
8. Test on the real GPU with touch events, a threaded no-store server, A/B alternation, and pixel/brightness comparisons.
9. Trim a copy for deploy; diff request sets; upload as a new Pages project first.
10. Say what was **not** tested.

## 10. Not tested in this project
Real iPhone/Android after the final changes, Arabic (RTL) on the new hero, Firefox/Safari, the deployed `pages.dev` address, other GPUs.
