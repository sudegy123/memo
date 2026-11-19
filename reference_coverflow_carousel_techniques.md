---
name: reference-coverflow-carousel-techniques
description: "Flat 3D coverflow product carousel (cards fan left/right from a sharp center card, darkening/scaling with distance) — generic, reusable for any product site, not eyewear-specific"
metadata:
  node_type: memory
  type: reference
  originSessionId: 4dc53b9d-cfd4-4466-b53f-f34522465da0
  modified: 2026-09-28T21:12:11.062Z
---

Technique Set 7 — "Coverflow": a flat (non-curved) 3D card stack where the center card is upright and full brightness, and cards to either side translate outward, rotateY up to ~±58deg, scale down, and darken with distance (Apple-Coverflow style). Built from a real screenshot, generalized for reuse — not tied to eyewear.

Template file: `Documents/eyewear-carousel/index.html` (despite the name, the carousel logic/CSS is fully generic — only the placeholder SVG art and the "Eyewear That Stands Out" copy are eyewear-specific).

## Reuse for a new product site
1. Copy the file, rename the folder/title to the new product/brand.
2. Replace the `SEQ` array and `art()` function's SVG cases with real product photos (`<img>` tags) — see [[feedback_local_assets_preferred]], download and self-host images rather than hotlink/generate.
3. Swap the `<h1>` copy and CTA button label/link.
4. Swap the top logo SVG for the brand's own mark.

## Core mechanics (all in one file, no dependencies)
- `wheel` div = perspective container (`perspective:1400px`), `.card` elements absolutely positioned inside.
- `place()` computes each card's signed distance `d` from the current `pos` (wrapped circularly via `wrap()`), then sets `translate3d(x,y,z) rotateY(deg) scale()` plus a dark overlay (`.shade`) whose opacity grows with `|d|`.
- Navigation: pointer drag (with inertia + snap-to-nearest on release), mouse wheel/trackpad (accumulator + cooldown so one notch = one step), arrow keys, and click-a-card-to-select.
- `pos` eases toward `target` each frame via exponential smoothing (`1-Math.exp(-dt*7)`), not a CSS transition — keeps drag and inertia feel consistent.
- Fully responsive: `layout()` recomputes card size/step/center on resize and on mobile (`W<=760`) shrinks card size and step ratio.

## Gotchas
- `stepPx` (horizontal spacing) and the rotateY clamp (`±58deg`) are the two knobs that control how "flat" vs "fanned" the stack looks — tune together, changing one without the other looks wrong.
- Visibility cutoff (`ad<=3.4`) exists purely for perf — don't remove it, hidden cards outside that range would otherwise still get transformed every frame.
- Uses `perspective-origin:50% 40%` (not 50%) — matches the reference photo's camera height where the vanishing point sits above center.

Cross-reference: adjacent to [[reference_spotlight_curved_carousel]] (Set 5b, the curved/concave variant) and [[reference_orbit_fan_techniques]] (Set 5, circular drag carousel) — pick coverflow when the reference/brand wants a flat Apple-style fan, spotlight when it wants a concave bend-back look.
