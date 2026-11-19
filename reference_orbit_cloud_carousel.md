---
name: reference-orbit-cloud-carousel
description: "Drag-to-orbit sphere of product nodes in 3D space, hand-rotated with manual matrix math for correct z-sorting; from Set 8"
metadata:
  node_type: memory
  type: reference
  originSessionId: 4dc53b9d-cfd4-4466-b53f-f34522465da0
  modified: 2026-09-28T21:30:26.856Z
---

Part of [[reference_product_browsing_paradigms]] (Set 8). Template file: `Documents/product-browsers/2-orbit-cloud.html` (+ shared `shared.js`).

## Concept
Products sit as nodes distributed on a sphere around a center point; dragging anywhere on the stage orbits the entire cloud, and clicking a node selects it (shown in a bottom info panel). Distinct from [[reference_orbit_fan_techniques]] (Set 5's HAZE carousel), which spins cards on a flat *circle*, not a sphere.

## Core mechanics
- **Fibonacci sphere distribution** for even node spacing (`phi = acos(1 - 2k/n)`, `theta = π(1+√5)k`) — avoids clumping that a naive lat/long grid would produce with only 8 items.
- **Rotation is computed in JS, not CSS `transform-style:preserve-3d` alone.** Each node's `(x,y,z)` is rotated by hand around Y then X per frame (`rx`, `ry` in degrees, converted to radians) using standard rotation-matrix formulas, rather than wrapping nodes in a `.group{transform-style:preserve-3d}` and just rotating the group with CSS `rotateX/rotateY`. This was a deliberate choice: computing z per node in JS lets `z-index` be set explicitly (`Math.round(z + R)`) for correct paint order, and lets opacity/scale be driven directly off z-depth (`scale = max(.55, (z+R)/(2R)*.8+.4)`) — CSS 3D alone would still require reading back z per node for that anyway, so doing the rotation math in JS keeps everything in one place.
- Drag: `pointerdown/move/up` accumulates `ry += dx*0.35`, `rx` clamped to `[-70,70]` (avoids the sphere flipping upside-down disorientingly). Small velocity (`vX`) carries into a gentle idle auto-rotate when not dragging, decaying each frame (`vX *= 0.9`).
- Click-to-select: each node's own `onclick` calls `select(i)`, toggling a `.sel` class (accent-colored outline) and updating the name/category/price panel — independent of the drag rotation logic, so a click that doesn't move the pointer (`pointerdown`→`pointerup` at the same spot) still fires the node's click handler normally.

## Gotcha
- Clamping `rx` to ±70° (not ±90°) keeps the sphere from ever showing a degenerate top/bottom view where nodes visually overlap in a confusing flat ring — worth keeping for any "orbit a sphere" carousel, not just this one.
