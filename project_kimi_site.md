---
name: project-kimi-site
description: "Kimi Antonelli / GRIDO1 Racing Systems F1 driver site at C:\Users\DELL\kimi-index-final.html — third technique-catalog source (Set 3)"
metadata:
  type: project
---

`C:\Users\DELL\kimi-index-final.html` is a full one-page F1 driver site built from an extremely long (5,060-line, ~290K character) verbatim spec the user supplied as a `.docx` (the prompt was too long to paste into chat without truncation — see [[reference_kimi_site_techniques]] item 30 for how it was extracted). Built in 4 staged sessions per the user's request to keep stages manageable: (1) hero + WebGL scene, (2) season/circuit block, (3) timeline + paddock, (4) footer + consolidation.

**Why:** third "learn from" reference build after [[project_soda_landing_page]] and the Laocoön page, specifically chosen by the user for its very different technique family — almost no shader work, instead a hand-rolled 2D motion engine (spring physics, scroll-triggers, text reveals, canvas contour/halftone effects).

**How to apply:** See [[reference_kimi_site_techniques]] (Set 3) for the extracted, reusable techniques — the spring solver, shared ticker, `scrollProgress()` helper, sticky-stack recede pattern, chequered-dissolve seam, halftone dot engine, corner-braking path animation, marching-squares contours, and `cqw`-based fixed-frame responsive scaling are all generically reusable outside this specific site. Two known incompleteness caveats in the delivered build: the source doc's own `approach()` easing helper was missing its body (reconstructed, noted inline in the code) and the extremely granular tablet/phone breakpoint CSS variables were not chased to 100% pixel fidelity. Also the origin of [[feedback-filename-collision]] — publishing this to `index.html` briefly overwrote the soda project's file.
