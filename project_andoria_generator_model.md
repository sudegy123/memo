---
name: project-andoria-generator-model
description: "Andoria ADG-100 diesel generator 3D model (Blender + GLB + viewer) — where the files are and what is/isn't done"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7ad4f5a8-37bb-41e5-9144-71844e2a1e27
  modified: 2026-09-19T22:30:21.435Z
---

Photoreal-ish Blender model of the Andoria ADG diesel generator, built from the user's multi-view reference sheet. Folder: `Documents/andoria-website/assets/models/andoria_generator/` — `andoria_generator.blend` (546 objects, 12 collections), `andoria_generator.glb` (3.1 MB, coloured), `andoria_generator_viewer.html` (self-contained, needs internet for three.js CDN), `renders/` (13 EEVEE views), `build_scripts/`.

**Why:** the user wants a commercial-quality 3D product visual for Andoria ads, the website, and future animation; an earlier procedural Three.js version (`assets/js/product-3d.js`, only the generic category shapes are still crude) was rejected as toy-like.

**State:** user approved the result ("looks good"). Not done: wiring the GLB into `products.html`/`machinery.html`, other product categories at this fidelity, Firefox/other-viewer checks. Exhaust position and small-door layout were inferred (reference views contradicted each other). Logo font is Segoe UI Bold, not the real Andoria typeface; leaf icon approximated.

**How to apply:** offer to integrate the GLB into the site product page next; for new models follow [[reference-blender-fast-3d-pipeline]].
