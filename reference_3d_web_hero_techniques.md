---
name: reference-3d-web-hero-techniques
description: "Reusable catalog of 3D-model + animation techniques from multiple demo landing pages (model-viewer + Three.js), for reuse on other sites (e.g. Andoria)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-18T19:31:08.011Z
---

A catalog of the specific techniques used across demo landing pages built in this project, extracted so they can be reapplied to other sites — first candidate: [[project_andoria_website]] (industrial/solar equipment, would suit 3D machinery/generator/solar-panel heroes).

Sources so far:
- **Sections 1–8**: [[project_soda_landing_page]] (`C:\Users\DELL\index.html`) — `<model-viewer>` based, GSAP-driven, single static hero.
- **Sections 9+**: `C:\Users\DELL\laocoon.html` ("Bronze and Time") — raw Three.js (r0.160, ES module importmap, no GSAP), a 900vh scroll-driven cinematic experience with a custom shader background, particle sparks, and per-letter text reveals. This is a fundamentally different (heavier, more custom) approach than the model-viewer sections above — pick whichever fits the ambition/complexity of the target site.

**Why:** user asked for a scan of "assets used, 3D models in specific places, animations" specifically so this can be reused later, not just admired in place.

**How to apply:** when building a new hero section that wants a 3D centerpiece + ambient motion, pull the relevant snippet below rather than re-deriving it.

### 1. Libraries (CDN, no build step)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
```
`<model-viewer>` is a web component for `.glb`/`.gltf` — no Three.js scene setup needed. GSAP drives every animated value (color morph, spin, easing).

### 2. Center 3D product with cursor-tilt
- Wrap in a full-viewport absolutely-positioned container that just handles fade-in + gentle vertical float via CSS `@keyframes`.
- The `<model-viewer>` itself is `position: fixed`, centered with `transform: translate(-50%,-50%)`, sized in `vw`/`vh`, `--progress-bar-color`/`--poster-color` set to `transparent` to hide default loading UI, `disable-zoom`, `camera-controls` (needed to let JS drive `cameraOrbit` smoothly), `shadow-intensity="0"` (flat, no baked shadow blob).
- Cursor tilt, every frame:
```js
currentMouse.x += (mouse.x - currentMouse.x) * 0.05; // lerp smoothing
modelViewer.cameraOrbit = `${currentMouse.x * 40}deg ${90 + currentMouse.y * 20}deg 380%`;
```
`mouse.x/y` are normalized to `-0.5..0.5` from `clientX/innerWidth - 0.5`. The `380%` radius and `30deg` field-of-view keep the object framed regardless of orbit.

### 3. Ambient background 3D models (leaves/decorative)
- Several `<model-viewer>` instances reused with the *same* `.glb` but different `camera-orbit` values per instance, so each looks like a distinct pose from one asset (cheap variety, one download).
- Absolutely positioned by `top`/`left` percentages, individually sized, some with reduced `opacity` for depth.
- Parallax: a wrapping container's `transform: translate()` is set each frame proportional to `currentMouse`, at a small/negative multiplier (`-15`) so it drifts opposite the foreground for depth.
- Independent floating motion per element (not just parallax) using per-index phase offset so they don't move in lockstep:
```js
const dur = 10 + i * 2;
const phase = (time + i * 1.2) * (Math.PI * 2 / dur);
leaf.style.transform = `translate(${Math.cos(phase*0.5)*15}px, ${Math.sin(phase)*20}px) rotate(${Math.sin(phase*0.3)*15}deg)`;
```

### 4. Click-triggered "flavor switch" choreography (color morph + spin + model swap)
Three things fire together on a card click, all via GSAP:
1. **Background color morph** — CSS custom properties (`--bg-inner/mid/outer`) animated directly with `gsap.to(body, {'--bg-inner': '#...', duration: 1.5, ease: 'power2.inOut'})`. Works because the gradient CSS reads those vars.
2. **Spin + motion blur, two-phase timeline**, using a plain JS object as the GSAP tween target (not the DOM element) so one value can drive two side effects (`cameraOrbit` offset + CSS `filter: blur()`):
```js
const spinObj = { val: 0, blur: 0 };
gsap.to(spinObj, { val: 360, blur: 15, duration: 0.6, ease: "power2.in",
  onUpdate: () => { switchSpin = spinObj.val; modelViewer.style.filter = `blur(${spinObj.blur}px)`; },
  onComplete: () => {
    // swap the model/texture here, at the peak of the spin, hidden by blur
    modelViewer.src = NEW_MODEL_URL;
    gsap.to(spinObj, { val: 720, blur: 0, duration: 1.5, ease: "back.out(0.7)", onUpdate: /* same */ });
  }
});
```
`switchSpin` is added into the per-frame `cameraOrbit` expression so the spin and the cursor-tilt combine additively without fighting each other.
3. **Swap at the blur peak, not the click** — the model/texture change happens inside `onComplete` of phase 1 (fully blurred), so the swap is invisible; phase 2 then settles out of the blur with a `back.out` overshoot for a satisfying "pop".

### 5. Swapping the 3D asset itself vs. swapping a texture
Two different techniques for "changing" a model, pick based on what you have:
- **Swap the whole model** (used for the generator swap): just reassign `modelViewer.src = 'other.glb'`. Simple, works with any two `.glb` files, but there's a load hitch unless preloaded (see below).
- **Swap a material texture** (used in the original soda-can version, kept as an option): `await modelViewer.createTexture(url)` ahead of time for each variant, then on swap: `modelViewer.model.materials.forEach(m => m.pbrMetallicRoughness.baseColorTexture.setTexture(tex))`. Needs the model loaded once (`modelViewer.addEventListener('load', ...)`) before textures can be created, and works only if the model already has a compatible base-color texture slot.
- **Preload to avoid pop-in / lag**: stash hidden `<model-viewer src="...">` tags (`display:none` wrapper) for every model that might get swapped to later — this warms the browser's model cache so the visible swap doesn't stall.

### 6. Ambient particle system (rising bubbles) — pure CSS + JS, no canvas
```js
setInterval(() => {
  const el = document.createElement('img');
  el.src = 'bubble.png';
  el.className = 'bubble-img';
  el.style.left = Math.random()*100 + '%';
  el.style.width = (Math.random()*20+10) + 'px';
  el.style.opacity = Math.random()*0.4 + 0.2;
  const dur = Math.random()*6 + 4;
  el.style.animation = `floatUpImg ${dur}s linear forwards`;
  container.appendChild(el);
  setTimeout(() => el.remove(), dur*1000);
}, 400);
```
```css
@keyframes floatUpImg {
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  10%, 90% { opacity: 0.4; }
  100% { transform: translateY(-110vh) translateX(30px) rotate(360deg); opacity: 0; }
}
```
Cheap and GPU-friendly since it's just transform/opacity; each element self-removes via `setTimeout` matched to its animation duration — no manual cleanup loop needed.

### 7. Layering discipline (z-index plan)
Foreground interactive elements (text, nav, cards) sit at `z-index: 100`; the 3D centerpiece sits low (`1`) so foreground text can visually overlap it; any element meant to visually pop *in front of* the product during an animation (e.g. berries mid-explosion) briefly gets bumped to `z-index: 110` and reset after. Decorative background 3D (leaves) sits at `z-index: -1`, `pointer-events: none` throughout so it never blocks clicks.

### 8. Glassmorphism nav/cards
```css
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.2);
backdrop-filter: blur(20px);
box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.1);
```
Reusable as-is for any frosted-glass header/card on a photographic or 3D background.

### Caveats learned while adapting this for a generator model
- Swapped-in `.glb` assets from a different source (Poly Pizza) had different native scale/orientation than the original soda can — the hardcoded `rotate(25deg)` base transform and `380%` camera radius may need re-tuning per asset; there's no auto-fit.
- See [[feedback-local-assets-preferred]] — download real asset files into a local `models/`/`assets/` folder and reference relatively, rather than hotlinking.

---

## Heavier approach: raw Three.js scroll-driven cinematic scene (Laocoön page)

Use this family of techniques instead of `<model-viewer>`+GSAP when the target site wants: real
custom shader backgrounds, per-vertex particle physics, a page-scroll-as-timeline structure, or a
custom cursor — i.e. an immersive "digital experience" rather than a simple hero section.

### 9. Zero-build Three.js via import map
```html
<script type="importmap">
{ "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/examples/jsm/loaders/GLTFLoader.js": "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js"
} }
</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
</script>
```
Import maps let a single static HTML file use real ES-module Three.js (and its `examples/jsm` addons like loaders) straight from a CDN, with clean `import` syntax, no bundler. Pin the exact version in both the importmap and any addon URL — they must match or the addon breaks.

### 10. Scroll as the master timeline (no scroll library)
- Make the page very tall (`body { min-height: 900vh; }`), keep the canvas and every overlay `position: fixed` so nothing actually scrolls visually — only `window.scrollY` changes.
- Every frame, derive a normalized `targetScroll` (`0..1`) from `scrollY / (scrollHeight - innerHeight)`, then **lerp** a `currentScroll` value toward it (`currentScroll += (targetScroll - currentScroll) * 0.025`). This alone gives free, GPU-cheap scroll-inertia/smoothing without a plugin (no Lenis/ScrollSmoother needed).
- Drive literally everything else — camera position, shader uniforms, text-slide visibility, particle turbulence, progress-bar fill — off this one `currentScroll` number. One source of truth, easy to reason about and retune (just change the milestone ranges).
- Hide native scrollbars everywhere (`-ms-overflow-style: none; scrollbar-width: none;` + `::-webkit-scrollbar{display:none}`) since scroll is a hidden interaction channel, not a visible list.

### 11. Camera orbit driven by scroll (360° reveal)
```js
const phi = currentScroll * Math.PI * 2.0;
const y = baseY + Math.sin(currentScroll * Math.PI) * riseAmount;
const radius = baseRadius - Math.sin(currentScroll * Math.PI) * dip;
const x = radius * Math.sin(phi);
const z = radius * Math.cos(phi);
camera.position.lerp(new THREE.Vector3(x, y, z), 0.025); // extra smoothing on top of scroll lerp
camera.lookAt(targetLookAt);
```
`sin(scroll*Math.PI)` (not `scroll` itself) makes the camera rise then fall back over one full scroll pass — useful for a dramatic mid-page peak. A secondary `lookAt` offset that eases out over just the *first* portion of scroll (via a `cos`-based ease factor) can shift framing to make room for text early on, then recenter.

### 12. Auto-fit a loaded GLB regardless of its native scale/pivot
```js
const box = new THREE.Box3().setFromObject(model);
const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray());
model.scale.setScalar(TARGET_SIZE / maxDim);
model.updateMatrixWorld(true);                       // required before re-measuring at new scale
const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
model.position.sub(center);                          // recenter into a wrapping pivot group
pivotGroup.position.y = GROUND_OFFSET;                // then ground it
```
This directly solves the caveat noted above (swapped assets having different native scale) — always wrap any loaded model in a pivot `Group`, auto-scale to a fixed max-dimension target, then recenter via a *second* bounding-box pass (the first pass is pre-scale and gives the wrong center). Do this once per model load, not per frame.

### 13. Chiaroscuro 3-point lighting recipe for metal/stone models
- **Key**: a bright `SpotLight`, high intensity (e.g. `18.0`), steep angle, high `penumbra` (~0.9) for a soft-edged dramatic highlight, `castShadow: true` with a decent shadow map (2048²) and small negative `bias` to avoid peter-panning/acne.
- **Rim**: a cool-tinted `DirectionalLight` from behind/opposite the key, no shadow — purely to separate the silhouette from the dark background.
- **Fill**: a very dim, warm `DirectionalLight` from below-front, just enough to keep shadow-side detail from crushing to pure black.
- Pair with `renderer.toneMapping = THREE.ACESFilmicToneMapping` and a boosted `toneMappingExposure` (e.g. `2.2`) — necessary because the light intensities above are far above `1.0` and need filmic rolloff to not blow out.
- Material for "polished but not mirror" metal: `roughness ~0.4`, `metalness ~0.9`.

### 14. Custom shader background plane attached to the camera
```js
const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), shaderMaterial);
bgMesh.position.set(0, 0, -8);      // camera-local space
bgMesh.renderOrder = -10;
camera.add(bgMesh);                 // moves WITH the camera — always fills the frame, no parallax drift
```
`depthWrite:false, depthTest:false` on the material so it never z-fights with or occludes real scene geometry. Feed it `uTime`, `uResolution`, `uMouse`, `uScroll` uniforms updated every frame — this turns a flat background into a slow, generative "breathing" surface (layered `sin`/`cos` wave fields at fixed angles/frequencies so scrolling *deforms* the pattern via phase-shift rather than visibly speeding/compressing it — `warpedUv += sin(...+ scroll*K)` instead of `freq *= scroll`). Cross-fade two color palettes with `mix(paletteA, paletteB, smoothstep(0,1,scroll))` to tie the whole background's mood to scroll position (e.g. warm→cool).

### 15. GPU particle field with per-particle CPU physics (no shader physics needed)
- One `THREE.Points` object, one `BufferGeometry` with a flat `position` Float32Array (`count*3`) and matching `color` array (`vertexColors: true` lets you mix e.g. 60%/40% two-color splits per particle at spawn).
- A **procedural point-sprite texture** (radial gradient on a tiny `<canvas>`, converted via `new THREE.CanvasTexture(canvas)`) avoids shipping an image asset for glow dots.
- `THREE.AdditiveBlending` + `depthWrite:false` for a glowing/overlapping look instead of flat opaque dots.
- Physics lives in a plain JS array parallel to the buffer (`sparkData[i] = {speedX, speedY, swaySpeed, swayRadius, phase}`), mutated every frame directly into the position buffer, then one `geometry.attributes.position.needsUpdate = true` per frame. Cheaper than a real physics/shader system for a few hundred particles.
- **Recycle instead of respawn**: when a particle exits its bounding box, teleport it back to a spawn zone rather than destroying/creating objects — zero GC pressure, particle count stays constant forever.
- Tie particle energy to *scroll velocity* (`abs(targetScroll - currentScroll)`), not just scroll position — fast scrolling reads as "the world reacting to you," not just "more stuff on screen further down."

### 16. Custom two-ring cursor (inner snap + outer lag)
```js
window.addEventListener('mousemove', e => {
  innerEl.style.left = e.clientX + 'px'; innerEl.style.top = e.clientY + 'px'; // instant
});
// per frame:
outerX += (cursorX - outerX) * 0.2;  // lerped, trails behind
outerEl.style.left = outerX + 'px'; outerEl.style.top = outerY + 'px';
```
Hide the native cursor globally (`cursor: none` on `html/body` and `* { cursor: none !important; }`), give both rings `pointer-events: none` and a high `z-index`, and let the two different update rates (instant vs lerped) create a "magnetic" feel for free — no easing library needed.

### 17. Per-letter text reveal that survives `<br>` tags
Split a heading's `innerHTML` on a `<br>`-capturing regex first (`split(/(<br\s*\/?>)/i)`), then only wrap non-tag, non-space characters individually in `<span class="char" style="transition-delay:${i*0.035}s">`, re-emitting `<br>` and literal spaces untouched. This is the key trick: naive `for-each character` splitting on raw `innerHTML` breaks multi-line headings and eats markup. Combine with a CSS transition on the span (`opacity`, `translateY`, `filter: blur()`, each 0→resting) toggled by adding an `.active` class to the parent when its scroll milestone is reached — the staggered `transition-delay` (not a JS timeline) is what produces the cascading letter-by-letter reveal, and it's essentially free (CSS handles all the interpolation).

### 18. Scroll-milestone content system (generalization of the flavor-switch idea)
Rather than one click event, define named ranges over the `0..1` scroll domain (e.g. `slide1: [-0.10,0.12]`, `slide2:[0.28,0.40]`...) and toggle an `.active` class on whichever container falls in range each frame — this is a direct generalization of the click-based state toggling in the model-viewer sections, just keyed off continuous scroll position instead of a click. The same pattern also drives: an image reveal via animated `clip-path: inset()` (top-to-bottom wipe) synced to the same range, and a segmented "stories" progress bar where each segment's fill `height`/`width` is `clamp01((scroll - segmentStart) / (segmentEnd - segmentStart)) * 100%`.

### 19. Ambient decorative UI drift tied to scroll (not just time)
Small dots/marks on static grid lines can drift up/down using `y = (baseOffset + scroll * speed) % 100`, with alternating `speed` sign per element (even index goes up, odd goes down) — a cheap way to make a mostly-static UI grid feel alive and reactive to scroll without any extra libraries, reusing the same `currentScroll` value everything else already depends on.

### When to reach for which family
- **`<model-viewer>` + GSAP** (sections 1–8): fast to build, good for a single hero product shot with a couple of click-triggered transitions. No shader/particle work possible without dropping to Three.js underneath model-viewer's abstraction.
- **Raw Three.js** (sections 9–19): needed for scroll-as-narrative pages, custom shaders/backgrounds, particle fields, or when the brief calls for full camera control (orbit paths, chiaroscuro lighting) beyond what `camera-orbit` strings can express.
