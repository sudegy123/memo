---
name: reference-radial-dial-carousel
description: Drag/scroll-spun product dial where the frontmost card auto-selects; from Set 8 — includes a fixed selection-desync bug worth avoiding elsewhere
metadata:
  node_type: memory
  type: reference
  originSessionId: 4dc53b9d-cfd4-4466-b53f-f34522465da0
  modified: 2026-09-28T21:30:42.253Z
---

Part of [[reference_product_browsing_paradigms]] (Set 8). Template file: `Documents/product-browsers/4-radial-dial.html` (+ shared `shared.js`).

## Concept
Products sit evenly spaced around a squashed-ellipse "dial." Dragging horizontally or scrolling rotates the whole dial; whichever card is currently frontmost (largest, brightest, highest z-index) is the selected one, shown in a bottom info panel.

## Core mechanics
- Each item's position: `a = (i*stepDeg + angle + 90) * π/180`, `x = R*cos(a)`, `y = R*sin(a)*0.42` (the `0.42` squash is what makes it read as a tilted dial rather than a flat circle).
- `depth = sin(a)` drives everything: `scale = 0.6 + (depth+1)/2*0.55`, `opacity = 0.4 + (depth+1)/2*0.6`, `zIndex = round(depth*100)` — so the frontmost item is simultaneously the biggest, most opaque, and topmost, which is what makes "frontmost = selected" read as obviously true without needing a separate visual indicator.
- `angle` eases toward `targetAngle` each frame (exponential smoothing, `angle += (targetAngle-angle)*0.15`), same easing pattern as the other Set 8/coverflow carousels.
- Drag rotates `targetAngle` directly; on release it snaps to the nearest step (`Math.round(targetAngle/stepDeg)*stepDeg`) so a card always lands cleanly centered rather than resting at an odd angle. Mouse wheel steps by exactly one `stepDeg` per notch.

## Bug fixed here — **selection must come from the same computation as layout, not a parallel one**
The first version computed the "selected" index two different ways:
1. A `nearestIndex()` function that inverted `angle` and rounded to the nearest step, used only to decide the panel text and which card got a `.sel` highlight.
2. The actual visual layout loop, which independently computed each card's `depth = sin(a)` to decide scale/opacity/z-index — i.e. which card *looked* frontmost.

These two pieces of math used different angle offsets (`angle - 90` for layout vs. `-angle` for `nearestIndex`), so they drifted out of sync: the panel would say "Ridgeline" while a completely different card (headphones) sat biggest and glowing in the center. It also had a stray `y - 300` pixel offset in the transform that pushed the "top" position off past the heading entirely.

**Fix:** delete the separate `nearestIndex()` function. Inside the *same* loop that positions every card, track whichever card has the highest `depth` value as `sel`, and use that single value both for the `.sel` class and the panel text. One source of truth for "what's currently selected" — never compute it two different ways from the same underlying angle state, even if the two formulas look equivalent on paper (an off-by-one sign or a different reference axis will desync them silently, and it won't show up as an error, just as a UI that quietly points at the wrong thing).

This is a general lesson for any "pick whichever item is visually X" carousel/dial/wheel component, not specific to this file.
