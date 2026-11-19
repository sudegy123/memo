---
name: project-faint-fragrance
description: "Documents/faint-fragrance: FAINT, second fragrance sample, no 3D, typographic poster grammar built from scroll-craft/web-animation/taste/emil packs; serve on :8792"
metadata:
  type: project
---
Built 2026-10-02 as a deliberate contrast to [[project-cologne-sample]] (3D, dark, lime). Grammar: scroll-craft Typographic poster (type is the imagery, no cards, no parallax text). Paper #e8e8e3 + ink + single cobalt accent #2f4bff (night close uses #8fa1ff). Archivo variable (wdth 62%) display + Geist text, self-hosted; GSAP 3.12.5 + ScrollTrigger + Lenis local.
Devices: hero letters condense from blur; scale/blur line act (sticky + ScrollTrigger onUpdate); scent rows as giant type with wipe-fill on hover and accordion; peak = evaporation (letters scatter+blur, only "trace" stays); authored silence + ASCII mist; SVG trail drawn with scroll; inverted dark close with tiny type; frosted bag drawer (focus, Esc, inert). Serve: `python -m http.server 8792`.
Verified in Playwright (desktop 1440, phone 390, no errors, no horizontal overflow); real GPU/phone untested. Uses [[reference-scroll-craft-pack]], [[reference-web-animation-skills-pack]], [[feedback-apply-design-packs-by-default]].
