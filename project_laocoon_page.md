---
name: project-laocoon-page
description: "Cinematic scroll-driven Three.js demo at C:\Users\DELL\laocoon.html (\"Bronze and Time\")"
metadata:
  type: project
---

`C:\Users\DELL\laocoon.html` is a second demo/reference build (after [[project_soda_landing_page]]) — a cinematic 900vh scroll-driven page with a bronze horse GLB, custom liquid-metal shader background, 450-particle forge sparks, and a custom cursor. Built from a full verbatim spec (raw Three.js r0.160 via ES-module importmap, not `<model-viewer>`/GSAP).

**Why:** built as a second "learn from" reference site at user's request, specifically to extend the reusable-techniques catalog with a heavier/more custom approach than the soda page's `<model-viewer>` approach.

**How to apply:** Model and image assets are hotlinked from `https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6/` (not downloaded locally, since the user's own spec provided exact URLs — see [[feedback-local-assets-preferred]] for when local-download applies vs. not). See [[reference_3d_web_hero_techniques]] sections 9–19 for the extracted techniques (scroll-as-timeline, camera orbit, shader background, particle physics, custom cursor, per-letter reveal).
