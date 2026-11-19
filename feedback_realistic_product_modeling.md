---
name: feedback-realistic-product-modeling
description: "User's master instruction for ANY Blender/3D product model: professional product-viz quality, not toy/primitive; reference-first workflow, priority order, bevels, materials, master + web GLB, multi-angle validation"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 74178127-bc52-4140-9424-55245307fffb
  modified: 2026-09-23T15:44:41.098Z
---

For every 3D product modeling task the user wants professional product-visualization quality, never "technically 3D": no toy-like, low-poly, cube+cylinder, or AI-approximation look. Reference images are the source of truth; do not invent details the reference doesn't show, and do not fake realism with random screws/vents/bump maps.

**Why:** the user pasted this as a standing "master instruction" right after my first Mini Man mascot came out as a generic smiley robot and the second was a uniform-depth extrusion. They judge by "would it be obviously different next to a photo of the real product".

**How to apply:**
- Workflow: analyse ALL reference views -> dimensions/proportions -> primary forms -> secondary forms -> manufacturing details (seams, gaps, fasteners, recesses, thickness) -> per-part bevels (small on mechanical details, larger on major edges) -> weighted normals/smooth -> physically believable materials (roughness, metal, rubber, glass, brushed) -> validate front/back/left/right/3/4/top/close-up vs reference -> optimise.
- Priority: silhouette > proportions > primary geometry > secondary > manufacturing detail > edges > materials > micro-detail. Fix proportions before adding detail.
- Deliver a MASTER Blender model plus an optimised WEB GLB (LODs if useful); do not optimise early; re-verify the exported GLB.
- Reproduce logos/text/labels from the reference accurately.
- Use Blender Python scripts, iterate, render intermediate views, compare. See [[reference-blender-fast-3d-pipeline]] for tooling and [[project-miniman-showroom]] for the Mini Man mascot it was applied to.
