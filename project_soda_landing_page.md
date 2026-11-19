---
name: project-soda-landing-page
description: "Single-file soda/generator hero landing page at C:\\Users\\DELL\\index.html, built from a detailed recreation spec"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-18T19:11:54.672Z
---

`C:\Users\DELL\index.html` is a single self-contained HTML file recreating a "Diet Soda" hero landing page (3D can via `<model-viewer>`, floating cherry/leaf models, rising bubbles, flavor-switch choreography via GSAP). Originally built exactly to a detailed spec with hosted assets from `api.getlayers.ai`.

**Why:** started as a pixel-for-pixel clone request, then evolved into a working sandbox for iterating on 3D-web-page techniques (model swapping, GSAP-driven transitions).

**How to apply:** The center product model was swapped from the soda can to a downloaded generator `.glb` (`C:\Users\DELL\models\generator1.glb` and `generator2.glb`, sourced from Poly Pizza, swapped between on flavor-card click same as the original texture swap). The berry/fruit models and their parallax+repulsion+implode/explode logic were later removed entirely at user's request — only the leaf models and bubble generator remain as ambient motion. Local dev server: `python -m http.server 8080` from `C:\Users\DELL`, then open `http://localhost:8080/index.html`. See [[feedback-no-higgsfield]] and [[feedback-local-assets-preferred]] for constraints that shaped how new 3D assets get sourced.
