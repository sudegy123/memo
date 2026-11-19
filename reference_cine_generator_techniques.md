---
name: reference-cine-generator-techniques
description: "Set 6 technique catalog from the Andoria revamp homepage: cross-section clip-plane reveal, Catmull camera path + per-chapter view offset, projected 3D labels, live engine demo, self-hosted three, software-GL test tricks"
metadata: 
  node_type: memory
  type: reference
  originSessionId: eb73863b-e242-426e-be50-2f2cf44cbd3e
  modified: 2026-09-19T23:15:06.353Z
---

Built for [[project-andoria-revamp]] (`Documents/andoria-revamp/assets/js/home-cine.js`). Extends [[reference-3d-web-hero-techniques]] (#9-19), [[reference-kimi-site-techniques]] (#20-30), [[reference-fading-border-techniques]] (#31).

**32. Cross-section reveal with a clip plane.** `renderer.localClippingEnabled = true`; give every model material `clippingPlanes=[plane]`, `clipShadows=true`. Plane normal `(0,0,-F)` keeps `F*z <= constant`; animate `constant` from `depth/2+0.05` (nothing cut) down to ~`0.38*depth/2` (front skin gone, engine bay exposed). Add an additive amber `PlaneGeometry` "scan sheet" + `EdgesGeometry` outline at the cut, and a warm `PointLight` inside the bay whose intensity follows the clip amount. Works because the GLB liner panels are thin; a solid shell would hide the engine.

**33. Camera path = CatmullRomCurve3 (centripetal) through per-chapter keyframes**, evenly spaced in `t`. Scalars (clip, glow, accent colour, view offset) are piecewise smoothstep between the same keyframes. Scroll progress `p` (dt-based lerp toward the real value, `k = 1 - 0.0006^dt`) indexes everything. Keyframes are written in model units after auto-fit (#12), using the measured bbox (`LEN`, `DEPTH`, `H`) and which world-Z sign the logo faces.

**34. `camera.setViewOffset` to make room for text.** Per-keyframe `ox/oy` (fractions of the viewport) slide the rendered model left/right/up so chapter text never sits on it. Portrait screens: `ox=0`, `oy=.2` and push the camera out by `camK = clamp(1.45/aspect,1,2.4)`.

**35. Projected 3D annotations.** Anchor = `Box3.getCenter` of named GLB nodes (Engine_Block, Alternator_Body, Radiator_Core, CP_Controller); each frame `v.copy(anchor).project(camera)` -> `translate(px,py)` on an absolutely positioned label. Fade in only during the "inside" chapter, flip the label to the left when x > 62% of the width so it never clips.

**36. Live engine demo.** Fan hub+blades are `attach()`ed to a pivot Group at the hub centre and spun (axis = smallest hub bbox dimension); vibration = tiny sin-noise on the model pivot; exhaust smoke = recycled `Points` with a per-particle alpha/size ShaderMaterial; LCD material `emissive` ramps up; background shader `uGlow` rises. HUD numbers are labelled "illustrative".

**37. Self-hosted three r160 with an importmap.** `assets/vendor/three/three.module.js` + `addons/GLTFLoader.js` + `addons/RoomEnvironment.js`, importmap `"three/addons/": "./assets/vendor/three/addons/"`. GOTCHA: GLTFLoader imports `../utils/BufferGeometryUtils.js`, so `utils/` must sit NEXT to `addons/` (vendor/three/utils/), not inside it (cost a 404 and a silent dead page).

**38. Robustness bits reused everywhere:** poster JPG under the canvas until the GLB is ready; `no-webgl` fallback class; IntersectionObserver pauses the render loop off-screen; fps guard (drop DPR to 1, then shadows off if <26 fps for 2 s); `prefers-reduced-motion` = instant lerp + no particles; hide fixed widgets (WhatsApp/back-to-top) while inside the cinematic (`body.in-cine`).

**Testing a heavy WebGL page in this sandbox:** Playwright chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` runs ~1.5 fps at 960x540 (`?lite` param = DPR 0.5, no shadows) and a screenshot takes ~20 s, so use `timeout: 90000`, run in background, and expose a debug hook (`window.__cine.S`) to snap `S.cur = S.target` instead of waiting for the smoothing to converge. Never run two swiftshader browsers at once.
