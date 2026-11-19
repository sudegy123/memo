---
name: project-af1-shoe-model
description: "Nike Air Force 1 Low Blender/GLB/viewer built from user's 6-view reference sheet in Documents/af1-model; method, state, known defects"
metadata:
  node_type: memory
  type: project
  originSessionId: 4b6f233a-9ce5-4869-9a08-3c6d9078c3cb
  modified: 2026-09-26T05:17:28.182Z
---

Built 2026-09-26 from six user-supplied views (front/back/left/right/top/bottom, ~240px, saved in `refs/`). Folder `C:\Users\DELL\Documents\af1-model`: `Nike_AF1_Low_MASTER.blend` (cm), `Nike_AF1_Low_WEB.glb` (1.7 MB, 27k polys, 30 objects, metres, toe = -Z), `af1_viewer.html` (self-hosted three r160 in `vendor/`, serve with `build_scripts/serve.py`), `renders/` (6 ortho + 2 persp), `build_scripts/` (a1_core..a7_export, `build.py` execs them; env AF1_PARTS/AF1_VIEWS/AF1_RES/AF1_SAMPLES/AF1_EXPORT).

**Method (reusable for shoes/organic products):** analytic parametric upper (superellipse cross-section lofted along a plan-outline + height table) so any (y,z) side-view polygon maps onto the surface exactly; panels = offset skin shell intersected with side-view prisms (boolean EXACT); stitching dashes, eyelets, vents placed via the same inverse mapping; opening cut by vertical prism; collar = bevelled curve; tongue = solidified strip; outsole = per-vertex-z ridge rings (follow toe spring).

**Why:** user wanted Blender-ready AF1 from references; asked me to "just interpret them right".

**Known gaps:** tongue reads chunky/beak-like from the side, swoosh/panel shapes are estimated, skin/shell coplanar shading noise in GLB, stray heel-top stitch dashes, tongue label text is plain font, logos not exact; no Firefox/phone test. EEVEE first render compiles ~2 min. See [[reference-blender-fast-3d-pipeline]], [[feedback-realistic-product-modeling]].
