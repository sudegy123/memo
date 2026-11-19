---
name: reference-kimi-site-techniques
description: "Set 3 of the reusable technique catalog — from the Kimi/GRIDO1 F1 driver site: JS spring engine, scroll-driven text/parallax primitives, chequered-flag dissolve, halftone dot field, marching-squares contours, cqw-based fixed-frame responsive scaling"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-18T21:19:57.847Z
---

**Set 3** in the technique catalog (see [[reference_3d_web_hero_techniques]] for Sets 1–2: model-viewer/GSAP, and raw Three.js scroll-cinematic). Extracted from `C:\Users\DELL\kimi-index-final.html` ("Kimi Antonelli / GRIDO1 Racing Systems"), built from an extremely long, extremely precise verbatim spec (5,060-line source doc). This is the most editorial/data-driven of the three sets — almost no shader work, all hand-rolled 2D motion primitives and exact vector/data reproduction.

**Why:** user asked to learn from this build the same way as Sets 1 and 2, to reuse the underlying motion-engine patterns (not the Kimi-specific content) on future sites.

### 20. A hand-rolled react-spring-style damped spring, in ~15 lines
```js
class Spring {
  constructor(value, tension, friction, mass = 1) { this.value=value; this.velocity=0; this.target=value; this.tension=tension; this.friction=friction; this.mass=mass; }
  set(target) { this.target = target; }
  step(dtMs) {
    let dt = Math.min(dtMs, 64);            // frame-cap so a tab-switch stall doesn't blow up the sim
    while (dt > 0) {
      const sub = Math.min(dt, 1);          // 1ms substeps for stability regardless of frame rate
      const accel = (-this.tension*(this.value-this.target) - this.friction*this.velocity) / this.mass;
      this.velocity += accel * (sub/1000);
      this.value += this.velocity * (sub/1000);
      dt -= sub;
    }
  }
  atRest(eps=0.01) { return Math.abs(this.velocity)<eps && Math.abs(this.target-this.value)<eps; }
}
```
Beats a plain `lerp` because it's physically continuous (has real velocity/momentum) and configs are portable named presets — `{tension, friction}` pairs like `{90,26}` (a "reveal" feel) or `{170,26}` (crisper) can be reused everywhere motion is needed instead of hand-tuning easing curves per element.

### 21. A reference-counted shared ticker (one rAF loop for the whole page)
```js
const subscribers = new Set();
let running = false;
function tick(time) {
  if (subscribers.size === 0) { running = false; return; }
  for (const sub of Array.from(subscribers)) {
    if (time - (sub.last ?? -Infinity) > sub.getFramerate()) { sub.last = time; sub.callback(time); }
  }
  requestAnimationFrame(tick);
}
function subscribe(callback, getFramerate) {
  const sub = { callback, getFramerate };
  subscribers.add(sub);
  if (!running) { running = true; requestAnimationFrame(tick); }
  return () => subscribers.delete(sub);
}
```
Every animated system (WebGL scene, halftone canvas, ping loops, pulse loops, connector crawls) subscribes once instead of running its own `requestAnimationFrame` — cuts N loops down to 1, and `getFramerate()` returning e.g. `1000/30` lets a cheap background effect (a slow ping) throttle itself independently of a 60fps hero without a second timer. Starts on first subscriber, stops itself on last — free when nothing is animating off-screen.

### 22. Scroll-trigger progress from element rect, no library
```js
function scrollProgress(el, start, end) {
  const bb = el.getBoundingClientRect(); const vh = window.innerHeight;
  const poses = {
    top_top: bb.top, center_top: bb.top+bb.height/2, bottom_top: bb.bottom,
    top_bottom: bb.top-vh, center_bottom: bb.top+bb.height/2-vh, bottom_bottom: bb.bottom-vh,
    top_center: bb.top-vh/2, center_center: bb.top+bb.height/2-vh/2, bottom_center: bb.bottom-vh/2,
  };
  const a = poses[start], b = poses[end];
  const length = Math.abs(a - b);
  return length === 0 ? 0 : Math.min(Math.max(0, 1 - (a+length)/length), 1);
}
```
This one function replaces most of what a scroll-trigger library (GSAP ScrollTrigger, etc.) is used for: pass any two named edges of the element vs the viewport (`"top bottom"` → `"bottom top"` = classic "while it's crossing the screen") and get a clean 0→1. Drives per-row parallax, rail progress, chequered-dissolve reveal, portrait drift — one primitive, reused ~10 times across the page instead of ten different scroll-math one-offs.

### 23. Text reveal engine: split into words/letters, spring each unit in
```js
function revealLetters(el, delayIn, stagger) {
  const raw = el.dataset.figure ?? el.textContent.trim();
  el.innerHTML = '';
  [...raw].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter'; span.textContent = ch;
    el.appendChild(span);
    setTimeout(() => span.classList.add('in'), delayIn + i * stagger);
  });
}
```
```css
.letter { display:inline-block; opacity:0; transform:translateY(0.3em); transition: opacity .5s ease, transform .5s ease; }
.letter.in { opacity:1; transform:translateY(0); }
```
Same pattern for words (split on whitespace instead of characters). Two rules made this survive real content: (1) keep a visually-hidden plain-text copy for screen readers and mark the animated spans `aria-hidden` — the split destroys the readable text node; (2) **never clip with `overflow:hidden`** on a tight line-height, since a display face's cap-height leading will shave descenders off letters mid-transition. A `<br>`-safe variant (splitting on a `<br>`-capturing regex first) is needed for any multi-line heading — see Set 2's version of the same trick.

### 24. The sticky-stack recede pattern (pin-and-shrink instead of scroll-past)
```js
const RECEDE_SCALE = 0.9, RECEDE_SHADE = 0.55;
function applyRecede() {
  const view = window.innerHeight;
  for (const { inner, shade, next } of pinnedPairs) {
    const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / view));
    inner.style.transform = p > 0 ? `scale(${1 - (1-RECEDE_SCALE)*p})` : '';
    shade.style.opacity = `${RECEDE_SHADE * p}`;
    inner.style.visibility = p >= 1 ? 'hidden' : 'visible';   // stop painting once fully covered
  }
}
```
Markup: each section is `position:sticky; top:0` inside a shared `position:relative` container; a scale/shade transform lives on an **inner wrapper**, never on the sticky element itself (a transformed ancestor breaks `position:sticky`'s containing-block math). The last section in the stack is plain `position:relative` (never sticky) so the page returns to normal flow under it. This is the "cards stacking as you scroll" effect without a library — each section appears to recede/darken as the next one arrives on top of it.

### 25. Deterministic chequered-flag dissolve (a seam between two sections)
```js
function noiseHash(x, y) {                      // stable per-cell hash, no Math.random drift on resize
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
// per cell: solid rows near the seam, breaking into only-one-colour-of-the-checkerboard
// dots weighted by noiseHash, fading out entirely past a cutoff — driven by scrollProgress()
```
A canvas-drawn transition between two page sections of different background color that reads as "a chequered flag coming apart" rather than a flat crossfade — solid color block dissolves into scattered same-parity squares and vanishes. Reusable as a generic "dissolve seam" between any two blocks; swap the noise-driven pattern for a different one (diagonal wipe, radial) and the scroll-progress wiring stays identical.

### 26. Halftone dot field: bake once, light per-frame via a spatial lattice index
- **Packing thousands of points cheaply**: store dots as `rowDelta:firstColumnDelta,columnDelta,...` semicolon-separated string (not raw coordinates) — reconstructs the full lattice from a few KB of text. Good for any large, mostly-regular point field (a dot-matrix map, a halftone image, a particle grid) that would otherwise be an enormous coordinate array.
- **Bake the resting state once** to an offscreen canvas (every dot drawn as a static disc), then blit it every frame and only redraw the handful of "lit" dots on top — turns an 8,000-dot-per-frame draw into a blit plus ~dozens of touched cells.
- **Spatial index for "which dots are near this point"**: bucket every dot into a `col,row → index` grid once; a light source then walks only the bounding box of cells it could possibly reach (`Math.floor/ceil` on `(pos - reach - origin) / pitch`) instead of testing every dot — the same idea as a spatial hash / uniform grid broad-phase in a physics engine.
- **A "reticle" cursor effect** (crosshair arms that grow/shrink with pointer speed) is just two 1D walks of that same grid (one row, one column) plus a small round light at the crossing — cheap because it's two arithmetic walks, not a 2D scan.

### 27. Corner-braking pacing for a "drawing a path" animation
When animating a line/route being traced (a lap, a route reveal, a signature), don't step through arc-length at constant speed — bias progress by **local curvature** so the animation slows through turns and accelerates on straights, which reads as physically real (a car braking for corners) instead of a metronome:
```js
// per-sample turn angle (via consecutive-segment dot product), smoothed with a small moving-average window
// speed_i = 1 / (1 + BRAKE * smoothedTurn_i); accumulate span/speed to get a re-timed "time at each distance" table
// then invert that table (binary search) to convert a linear 0..1 animation clock into the correct arc-distance
```
Reusable for anything tracing a path over time where sharp turns should visually cost more "screen time" than straight runs.

### 28. Marching squares for animated contour lines on a plain 2D canvas
A cheap way to draw the *same* animated contour-line background used in Set 2's WebGL shader (Laocoön's liquid-metal field, or the Kimi hero's backdrop) on a page section that has **no WebGL context** — a `<canvas>` 2D context, a coarse grid (~96 cells), sample an analytic noise/sine field at each grid corner, then run standard marching-squares case-table logic (16 cases, the four ambiguous "saddle" cases draw two segments) to trace the iso-line through each cell. Same visual family across a whole site (hero WebGL shader + plain-2D-canvas sections) without needing WebGL everywhere — swap the underlying `field(x,y,t)` function for a different pattern and everything else (grid walk, case table, stroke) is unchanged.

### 29. `cqw`-based "one file is the 1440 frame at every width" responsive scaling
```css
.section { container-type: inline-size; }
```
```js
const px = (value) => `${(value / 1440 * 100).toFixed(4)}cqw`;   // a design pixel, as a share of the section's own width
const type = (value) => `max(${px(value)}, var(--type-min, 0px))`;  // same, with a floor so small type doesn't vanish
```
Instead of `rem` (tied to a global root font-size that itself has to be band-scaled per breakpoint — messy) or raw `px` (doesn't scale at all), express every length in a section as a **percentage of that section's own container width** via `cqw` (container query units) — the whole 1440-design-pixel composition scales as one unit at every viewport width, with only the smallest text getting a `max()` floor below a chosen breakpoint so it doesn't shrink into unreadability. This is the cleanest fix yet in the catalog for "faithfully reproduce a pixel-precise design at every screen size" — better than the rem-band-scaling approach Set 3's own hero section still uses out of necessity (global type shared across the whole page).

### 30. Extracting a huge verbatim spec from a Word doc without hitting chat truncation
When a prompt this size (5,000+ lines, 290K+ characters) needs to come in as a pasted chat message, it gets silently truncated at ~50K characters. The fix: have the user save it as a `.docx` and read the file directly —
```bash
unzip -q file.docx -d extracted/          # a .docx is just a zip of XML parts
python -c "import re,html; xml=open('extracted/word/document.xml').read(); \
  xml=xml.replace('</w:p>','</w:p>\n'); text=html.unescape(re.sub(r'<[^>]+>','',xml)); \
  open('out.txt','w').write(text)"
```
strips OOXML markup down to plain text with paragraph breaks preserved, with no length limit — then `Read`/`Grep` the resulting `.txt` in chunks. Also: **verify apparent gaps against the raw XML before assuming a conversion bug** — one function body was genuinely missing from the source document itself (confirmed by grepping the raw `document.xml` and finding the paragraph really did end mid-expression), not an artifact of the extraction.

### Caveat learned the hard way this session
**Never write a generic deliverable filename (`index.html`) into a working directory that already has an unrelated project using that exact name.** Publishing the Kimi build to `C:\Users\DELL\index.html` silently overwrote the unrelated soda/generator project's file from earlier in the same session. Recovered by reconstructing the soda page from its last-known full-file state earlier in the conversation transcript and renaming the Kimi build to its own filename — but the fix would not have been possible without that transcript still being in context. **Going forward: check whether a target filename is already in use by a different project before writing to it — especially generic names like `index.html` — and prefer project-specific filenames for multi-project working directories.**
