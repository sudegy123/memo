---
name: reference-spotlight-curved-carousel
description: "Technique Set 5b — 'Spotlight' concave 3D carousel (cards bend back into the screen) + ghost background numeral, bottom title/meta/dots, counter, arrows. Full working file at Documents/spotlight-fan/index.html"
metadata:
  node_type: memory
  type: reference
  originSessionId: 062e9a8c-193c-409f-96bf-5ae74804d9fc
  modified: 2026-09-24T19:51:39.322Z
---

**Working file (reusable template):** `C:\Users\DELL\Documents\spotlight-fan\index.html` — single file, no external assets, served with `python -m http.server 8090`. Variant of [[reference-orbit-fan-techniques]] (same drag/inertia/snap/wheel/keys/dots engine) but with a CONCAVE 3D wall instead of a flat 2D fan. Remade from a user screenshot of a "Spotlight" gallery page.

**What's in it (copy any piece):**
- Concave carousel: `.wheel{perspective:900px;perspective-origin:50% 52%}`; per card, θ = d*stepDeg, transform = `translate3d(cx+R*sinθ, cy, R*(1-cosθ)-R*.7) rotateY(-θdeg) scale(1+.03*near) translate3d(-cw/2,-ch/2,0)`. Centre card sits FARTHEST back/smallest, side cards come forward and angle inward (this is the "bends to the back" look). `R = W*.42` desktop (`.75` phone); smaller R = tighter bend.
- Sizing: `ch=H*.29` (max 300), `cw=ch*.78`, `step=max(cw*1.3, W*.15)` so the ring wrap (N=7) stays off-screen; `maxAng=(N/2-.4)*stepDeg`, fade at ends.
- Ghost background numeral: huge serif `.ghost` (opacity .045, z-index 1, behind cards) = active index padded "03"; updates in `updatePanel()`.
- Bottom info block: hint line ("Drag · Swipe · Arrow keys"), serif title (active name), meta row (year | kind | ★ score), pill dots (active dot widens to 26px, dots clickable → go to card).
- Bottom-left counter `03 / 07`, bottom-right round ← → buttons, vertical "Curated index" side label, floor shadow ellipse, eyebrow + serif headline with italic word, pill nav.
- Card art is procedural SVG (visor portraits + motorcycle) as placeholders — swap the `art()` output for `<img>` for real photos. Card label: index top-left, name bottom-left.
- Fonts: system serif stack (Iowan/Palatino/Georgia), no hotlinks.

**Tested:** one Chromium screenshot at 1100x700, no console errors. NOT tested: drag/keys/wheel in the 3D version, phone, Firefox/Safari, delivery gate from [[feedback-ultimate-fix-prompt]].
