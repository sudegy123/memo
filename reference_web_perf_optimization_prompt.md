---
name: reference-web-perf-optimization-prompt
description: "LOAD when the user says a page lags / drops frames / needs optimizing: paste-ready optimization prompt + ranked checklist of what actually cost frames on the Andoria WebGL homepage, with measured results and test tricks"
metadata: 
  node_type: memory
  type: reference
  originSessionId: eb73863b-e242-426e-be50-2f2cf44cbd3e
  modified: 2026-09-20T05:18:12.340Z
---

Distilled from the Andoria revamp homepage optimization ([[project-andoria-revamp]], [[reference-cine-generator-techniques]]). Complements [[feedback-ultimate-fix-prompt]] (measure before guessing, honest handoff). A copy for the user lives at `Documents/PERF-OPTIMIZATION-PROMPT.md`.

**Measured result that mattered:** merging ~450 static GLB meshes into one mesh per material cut draw calls 541 -> 46 (same triangles, same look). Frame-time numbers from the software-GL sandbox are NOT trustworthy (a 3 ms vs 639 ms A/B is a proxy only), so report draw calls / cost sources, and say real-GPU fps was not measured.

## Paste-ready prompt

> The page lags / drops frames on my laptop. Find what actually costs frames and fix it without changing how it looks.
>
> 1. **Measure, don't guess.** Load the page in Playwright (Chromium + Firefox). For WebGL read `renderer.info.render.calls/triangles`; expose a debug hook and an A/B flag (e.g. `?nomerge`) so each optimization can be switched off and compared. Software GL (`--use-angle=swiftshader`) is ~1.5 fps, so use it for draw-call counts and visual diffs, not for fps claims. Block external hosts with `page.route` (offline CDN scripts hang `goto`).
> 2. **Audit in this order (biggest wins first):**
>    - **Draw calls:** hundreds of meshes -> merge static meshes per material (`mergeGeometries`, bake `matrixWorld`, flip winding if determinant < 0, keep only position/normal/uv, `toNonIndexed` all, skip vertexColors/animated parts). Also instancing for repeats. Shadow pass multiplies this cost.
>    - **Full-screen fragment shaders:** many noise octaves x hashes per pixel at DPR 2 is brutal. Sample a 256x256 random `DataTexture` (bilinear) instead of hash math, cut octaves, use one warp not two. Consider lower-res render targets for smooth backgrounds.
>    - **Pixel count:** cap DPR at 1.5 (not 2); MSAA only when DPR < 1.5; shadow map 1024.
>    - **CSS compositing over live canvas:** `backdrop-filter` on header/buttons/toolbars, `mix-blend-mode` grain overlays, big blurred shadows, `filter` — remove or replace with solid rgba.
>    - **Layer explosion:** `will-change` on hundreds of split-text letters; only on a few real animated elements.
>    - **Per-frame document work:** `documentElement.style.setProperty('--var')` every frame (whole-document style recalc), layout reads (`getBoundingClientRect`) outside visibility guards, multiple rAF loops (use one shared ticker), loops running while off-screen (IntersectionObserver pause).
>    - **Physical materials** (clearcoat) cost more than Standard; convert only if the look survives.
> 3. **Add a runtime safety net:** after a 2.5 s warm-up (shader compile), measure fps over 1.2 s windows on real elapsed time; if < 45, step a quality ladder `[min(dpr,1.5), 1, .75, .6]`, then shadows off. Never crawl (dt-based lerp, don't clamp dt tightly).
> 4. **Verify nothing changed visually:** screenshot every key state (rest, mid-transition, close-up, mobile, RTL) before/after and LOOK at them; assert no page errors; check draw calls dropped.
> 5. **Handoff (honest):** cost sources found + what changed + measured numbers (draw calls, not fake fps) + what was NOT tested (real GPU, Safari, real phone) + what to send if still slow (which section, GPU model or Firefox `about:support` graphics).

## Gotchas hit
- `GLTFLoader` imports `../utils/BufferGeometryUtils.js` (utils must sit beside `addons/`), and importing `three/addons/utils/...` needs a copy under `addons/utils/` too, or the module 404s and the whole page silently dies.
- Anything referenced by name (anchors, logo bbox, LCD/fan nodes) must be captured BEFORE merging removes the nodes.
- Merge only after all materials got `clippingPlanes`/flags; merged meshes keep the shared material so clip planes still work. `frustumCulled = false` on merged meshes is fine for a single hero object.
- Playwright timeouts with offline CDNs: block non-localhost requests.
