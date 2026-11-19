---
name: project-mazin-jar-model
description: "Dr. Mazin Abdelwahab cosmetic cream jar 3D model (Blender hero + web GLB + viewer) in Documents/mazin-jar; how it is built, what is unverified"
metadata: 
  node_type: memory
  type: project
  originSessionId: 196424b6-5b5f-45ab-ac83-ddf7cde35280
  modified: 2026-09-20T18:20:12.186Z
---

Built 2026-09-20 from the user's multi-view modelling sheet (only the sheet was attached, no separate "original photo"). Folder `C:\Users\DELL\Documents\mazin-jar`: `Mazin_Jar_HERO_RENDER.blend/.glb/.obj` (~45k faces), `Mazin_Jar_WEB_OPTIMIZED.blend/.glb` (~12k faces, 2048 JPEG textures), `mazin_jar_viewer.html` (self-hosted three r160 in `vendor/`, Closed/Exploded/Open buttons, `?model=hero`), `renders/`, `build_scripts/` (m1_core..m5_states, m7_render, export_glb, patch_glb, label_tex.js, build.py).

**Method (reusable for any lathe-type product):** profile polylines with quadratic fillets -> `bmesh.ops.spin` (clean topology, real wall thickness); helix thread via `sweep()`; label = 4 thin curved panels + texture pair from a Playwright canvas (`label_tex.js`, proper Arabic shaping, colour map + ORM map so gold print is metallic); modelled in cm, exporter scales to metres and patches `KHR_materials_volume` into the GLB JSON. Intersections verified with BVH `overlaps()`; the open-cap pose is found by pushing the cap toward the jar until contact. Animation clip "Open" (closed -> exploded f30 -> open f60).

**Gotchas hit:** Cycles glass blocks shadow rays -> interior dark; fix in render only via Light Path 'Is Shadow Ray' mix with Transparent (not saved into exported .blend). Smooth-shading thin shells needs `split_edges` on sharp edges. Low-poly (56 seg) glass needs a bigger label offset (0.012 vs 0.002) or the label clips. Brighter world shows as a horizon: use 'Is Camera Ray' black background mix. BMLoop uv needs `l[uv_layer].uv`. PowerShell scripts blocked: run Blender via `Start-Process` with args, never .ps1 files.

**Logo (added later):** user supplied a gold-on-black PNG lockup (no SVG). `logo_extract.py` masks it by luminance (lockup alpha PNG for the front label texture) and traces the MA mark with OpenCV (installed to a scratch --target dir, not system) into `logo/mark_contours.json`; `m3_cap.py` tessellates + extrudes it as cap relief. Fixes: close bevel-highlight slivers before tracing; flat polished relief on polished cap vanishes (mirrors the same sky) -> satin cap top + polished logo, plus big overhead softboxes in the studio. Hero label texture is 8192px.

**Placeholders / honest gaps:** logo is traced from a raster render (edges slightly soft, no true curves), not the original vector; cap-top molecule pattern is procedural; cream mound kept below the seal so it stays intersection-free when closed; open pose is staged, not physically resting. Not tested: real GPU fps, Safari, GLB in other viewers. Follows [[reference-blender-fast-3d-pipeline]] and [[feedback-ultimate-fix-prompt]]; no Higgsfield.
