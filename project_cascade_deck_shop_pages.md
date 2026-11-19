---
name: project-cascade-deck-shop-pages
description: "Two Cascade Deck demo pages in Documents (print shop + STRIDE shoe store) — test builds of Set 4, not products; where they live and how they were verified"
metadata: 
  node_type: memory
  type: project
  originSessionId: b399fce0-c957-4260-88d7-ceb021680ade
  modified: 2026-09-19T03:50:52.322Z
---

Two single-file demo pages built to prove the Cascade Deck technique ([[reference-cascade-deck-techniques]]). Both are tests, not real products — the user does not want them expanded.

- `C:\Users\DELL\Documents\cards-cascade-shop.html` — art-print shop, remake of the getlayers.ai "Cards Cascade" demo. 11 CSS-gradient cards, cart drawer.
- `C:\Users\DELL\Documents\stride-shoe-store.html` — STRIDE sneaker store, brand-new build using the finished technique. 8 inline-SVG shoes, size chips (EU 40-44), cart with per-size lines, mobile layout.

Both are served by `python -m http.server 8765` from Documents (port 8080 is taken by something else). Test scripts: `harness_playwright_cascade_template.js` in the memory folder (the shoe store used an extended version covering 4 viewports x 2 engines + CPU throttle).

**Why:** the shoe store was the user's exam for [[feedback-ultimate-fix-prompt]] — it passed the full matrix on the first build with one small layout fix (shoe overlapping label on phone).

**How to apply:** if the user returns to either page, treat it as a finished test; reuse the code as a starting point for other projects rather than polishing these. Not tested: user's exact browser/GPU, real phones, Safari.
