---
name: project-miniman-shop-fan
description: "Miniman sneaker store (Documents/miniman website): shop.html redesigned with the Orbit Fan carousel (Set 5); files, decisions, known quirks"
metadata: 
  node_type: memory
  type: project
  originSessionId: a6f99edd-a9c2-43f1-80a9-e6da569db654
  modified: 2026-09-19T16:42:06.858Z
---

Miniman is an Egyptian sneaker store, plain HTML/CSS/JS + Supabase, at `C:\Users\DELL\Documents\miniman website` (the Desktop copy is an older duplicate, ignore it). User confirmed Documents is the working copy and that this folder is where the new technique sets get applied.

**Shop page (done 2026-09-19):** `shop.html` was fully redesigned around [[reference-orbit-fan-techniques]] (Set 5). New files: `assets/css/shop-fan.css`, `assets/js/shop-fan.js`; new i18n keys (EN/AR) added to `assets/js/i18n.js`. Old versions backed up in `_backup/` (`shop.pre-fan.html`, `i18n.pre-fan.js`). `shop.js` is no longer loaded by shop.html but category.html/brand.html still use it. The old promo banner carousel (jordan/converse/classic PNGs + countdown) was removed from shop.html.

**Adaptations vs the Set 5 starter (worth reusing):**
- Page must scroll to a footer, so only *horizontal* wheel rotates the wheel (gesture lock: ignore events until 160ms of silence); vertical wheel scrolls the page. Wheel uses `touch-action: pan-y`.
- Geometry measured from the stage rect, not the window. Wheel x-position is pushed right of the measured buy-panel edge and y is clamped below the toolbar so the front card is never ghosted by keep-out fades.
- Small filtered sets (N<7) switch from endless wrap to clamped (non-ring) mode.
- Toggle `is-active` BEFORE the hidden-`continue` in the pose loop, otherwise a big jump leaves a stale active class.
- `C.load()` blocks ~8s on the Supabase override request when offline; shop renders as soon as the seed JSON is there and re-syncs if overrides change anything.
- Removed `filter: drop-shadow` on card images (Firefox software render cost); gradient ellipse shadow instead.

**Verified (Playwright, harness in scratchpad `fan_test.js`):** Chromium + Firefox at 1366x768, 975x549@1.4 (140% zoom), Chromium 1920x1080, 820x1180 touch, 390x844 touch (both engines), CPU 4x, Arabic RTL. All PASS. NOT tested: real phones/GPUs, Safari, live Supabase (tests ran offline).

**Known pre-existing quirks (not fixed):** `product.js` `notFound()` wipes its container then reads `[data-title]` -> TypeError if catalog load is aborted. Some products' sizes are US-style (7-12) but labelled "EU" (site-wide).

**Gotcha I caused:** a `re.sub(..., flags=re.S)` used to delete one CSS rule swallowed the rest of a media block. Delete CSS rules by exact string, then check brace counts and screenshot mobile.
