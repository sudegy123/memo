---
name: project-dr-mazin-auto-intro
description: "Dr. Mazin hero auto-play 3D intro (jar drops, lid opens, text flies out of cream) built in Documents/dr-mazin-auto; files, test harness, findings"
metadata: 
  node_type: memory
  type: project
  originSessionId: 25310a64-68a7-4d2c-bf61-6828ac199422
  modified: 2026-09-21T05:30:57.718Z
---

**v2 (2026-09-21, after user feedback):** user wanted the jar to SLIDE DOWN THE PAGE by itself (like the scroll version in dr-mazin-main :8083) with each block emerging as it arrives, then return to top, open. v1 (jar stuck in a small stage) was the wrong motion. v2 = one full-#s0 canvas layer, page-px→world mapping, planBlocks(). Push-in CTA = CSS scale of the layer about the mouth (a 3D camera lookAt-blend approach failed). 45/45 harness assertions + fallbacks pass.

Built 2026-09-21 in `C:\Users\DELL\Documents\dr-mazin-auto` (fresh extract of Downloads\dr-mazin-main.zip; never touch `dr-mazin-main`, another session's). Changed only index.html, assets/js/main.js + new: components/hero3d/hero3d.js, features/landing/hero3d.css, assets/models/mazin-jar.glb, assets/vendor/three (r160), assets/images/hero/jar-poster.jpg, HERO3D-AUTOPLAY.md (full spec). Served on :8091 via scratchpad serve.py (8084 was taken). Extends [[project-dr-mazin-app]] / [[project-mazin-jar-model]]; this is "idea 2 (auto-play)" done again from the zip.

**Design gotchas worth reusing:** (1) first drop frame hitched ~0.4 s because culled/hidden meshes aren't compiled — do a warm-up render in rest pose, then `renderer.clear()` in the same task. (2) `riseIn` (fills forwards) beats inline transforms → disable it in 3D mode; also disable on fallback or it blinks. (3) Per-frame block positions via `offsetLeft/Top` chain (ignores transforms) so language swap/resize mid-intro is safe. (4) Clamp intro dt (25 ms) so a stalled frame can't become a visual leap; pre-warm block layers at opacity .004 before their turn. (5) Mouth point, not bbox, for "jar moves" checks; project real vertices to prove no canvas-edge clipping. (6) Test baselines must wait for `document.fonts.status==='loaded'` or layout diffs are false alarms. (7) Playwright `p.screenshot` mid-animation stalls the page ~200 ms — sample and screenshot in separate runs.

**Pre-existing bug in the ORIGINAL zip (reported, not fixed):** hero → gender → «رجوع» leaves #s0 at opacity 0 (scale .97) after ~1 s.

Real-GPU (Intel HD 520, headed Chromium) results: 5 viewports pass (jumps ≤44 px/60Hz-frame, all 7 blocks Δ0 px, no overflow); Firefox smoke passes. Not tested: real phone, Safari.
