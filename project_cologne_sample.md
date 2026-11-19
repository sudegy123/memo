---
name: project-cologne-sample
description: "Documents/cologne-sample: VETIVER 09 cologne scroll site built from the new skill packs; what it demonstrates, how to serve/test"
metadata:
  type: project
---
Sample built 2026-10-02 using [[reference-scroll-craft-pack]], [[reference-awwwards-3d-pack]], [[reference-immersive-3d-web-pack]] plus [[feedback-apply-design-packs-by-default]]. Single index.html, self-hosted three r170 + lenis + fonts in vendor/ and fonts/. Procedural flask (extruded rounded rect, transmission glass, canvas label), concept: sprayed mist. Devices: hero, pinned note scrub, horizontal pan, spray peak (largest span), list shop. Palette pine-black + lime accent. Serve with `python -m http.server`. Verified in swiftshader Playwright desktop + 390px (no errors); not tested on real GPU/phone. Separate from older cologne-store.

**Update 2026-10-02:** bottle is now a Blender-built GLB (`models/bottle.glb`, 187 KB, source `model_src/build_bottle.py`, run with Blender 4.2 from PowerShell). Page swaps materials by node name (Glass, Liquid, Metal, Collar, Label, Nozzle, Cap, Pump); procedural flask stays as fallback. Label UV needed `repeat.y=-1` flip. EEVEE first-shader compile took ~17 min here; write render dirs as absolute paths (relative went to C:\renders). Uses [[reference-blender-web-3d-pack]] and [[reference-3dmodel-skill-pack]].
