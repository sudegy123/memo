---
name: reference-product-browsing-paradigms
description: "Set 8 — five non-carousel ways to browse products (aisle-walk corridor, orbit sphere, fan-deck of cards, radial spin-dial, camera dolly-zoom/rack-focus), generic and reusable for any product site"
metadata:
  node_type: memory
  type: reference
  originSessionId: 4dc53b9d-cfd4-4466-b53f-f34522465da0
  modified: 2026-09-28T21:24:22.899Z
---

Built via [[reference_five_concepts_method]] but scoped to a single UI mechanic (product browsing) rather than a whole homepage. Picker + 5 self-contained concept files at `Documents/product-browsers/` (shared product data + procedural SVG art in `shared.js`, no external dependencies, no Three.js — all CSS 3D transforms).

## The 5 concepts
1. **Aisle Walk** (`1-aisle-walk.html`) — scroll/drag moves a virtual camera down a corridor; products line both walls in `perspective`, sliding past in Z as depth increases. Scroll-driven depth navigation.
2. **Orbit Cloud** (`2-orbit-cloud.html`) — products placed on a fibonacci sphere in 3D space; drag rotates the whole group (manual rotateX/rotateY matrix math per node, not CSS `transform-style` alone since JS computes each node's rotated x/y/z by hand for correct z-sorting). Click a node to select.
3. **Fan Deck** (`3-fan-deck.html`) — a stacked hand of cards (`transform-origin:50% 100%`, `rotate()`) that spreads into a fan on `pointerenter`, collapses on leave; click pulls one card forward (`translateY` + scale).
4. **Radial Dial** (`4-radial-dial.html`) — products on a squashed-ellipse dial; drag/scroll rotates it. **Selection must be derived from whichever item currently has max depth (`Math.sin(angle)`) each frame — not from a separately-computed "nearest angle" index.** Computing selection two different ways (once for layout depth, once for a snap-index) drifted out of sync and the highlighted/panel-labeled item didn't match the visually frontmost card. Fixed by picking `sel` as the max-depth item inside the same loop that positions everything.
5. **The Lens** (`5-lens-dolly.html`) — real camera dolly-zoom/vertigo trick: tightening the CSS `perspective` value on the *single* 3D-context element while translating the focused item's Z to compensate keeps its apparent size roughly stable while the background around it visibly warps. Unfocused items blur + dim (rack focus).

## Load-bearing gotcha: don't nest two `perspective` contexts
Concept 5 originally set `perspective` on **both** `#stage` and its child `#room` (both were toggled by the same JS). CSS `perspective` set on two ancestors in the same chain compounds multiplicatively — a translateZ that should read as a modest ~1.4x zoom instead blew up to a 2640×3378px bounding box, invisible off-canvas. Fix: pick exactly **one** element to own `perspective` (put it on the outermost `.stage`, animate it there with `transition: perspective .9s`), and leave every descendant with only `transform-style: preserve-3d`, never its own `perspective`. Verified via Playwright `getBoundingClientRect()` on the transformed element, not just eyeballing a screenshot — the rect size directly reveals a runaway perspective-compounding bug that a screenshot alone made ambiguous (it looked merely "too small/blurry," not "actually enormous and off-screen").

## Reuse for a new product site
Same pattern as [[reference_coverflow_carousel_techniques]] — copy the whole `product-browsers/` folder, swap `shared.js`'s `PRODUCTS` array + `productArt()` SVG cases for real photos (`<img>`, see [[feedback_local_assets_preferred]]), replace per-concept copy/CTA, pick whichever concept(s) fit the brand rather than shipping all 5.
