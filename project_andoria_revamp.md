---
name: project-andoria-revamp
description: "Andoria website revamp copy (Documents/andoria-revamp): cinematic generator homepage + revamp layer on inner pages; what exists, how to serve/test, what is unverified"
metadata: 
  node_type: memory
  type: project
  originSessionId: eb73863b-e242-426e-be50-2f2cf44cbd3e
  modified: 2026-09-19T23:15:30.162Z
---

On 2026-09-20 the user (away) asked for a complete revamp of [[project-andoria-website]] as a COPY, using all learned techniques plus the new generator model ([[project-andoria-generator-model]]) and "surprise me". Result: `C:\Users\DELL\Documents\andoria-revamp` (original untouched).

**What was built:**
- `index.html` rewritten: 820vh scroll-scrubbed three.js cinematic (5 chapters: hero, heritage, cross-section "Open it up", control-panel close-up, finale), Start-engine live demo, marquee, sticky-recede "three worlds" stack, 9-category tilt grid, count-up numbers, why/branches/CTA. Bilingual EN/AR kept (`data-en/data-ar`, split-text re-runs on `andoria:langchange`).
- Shared layer on ALL pages: `assets/revamp.css`, `assets/js/rv-core.js` (ticker, spring, cursor, magnetic, counters, split text, marching-squares contour banners). Original `styles.css`, `script.js`, `cart.js`, supabase files untouched.
- `machinery.html`: new drag-orbit generator viewer section (`assets/js/gen-viewer.js`, view buttons).
- Local assets: `assets/vendor/three/` (r160 self-hosted), `assets/img/*.jpg` (ffmpeg-shrunk category images + poster).
- Techniques used are in [[reference-cine-generator-techniques]] and the older sets.

**Serve/test:** `python -m http.server <port>` in the folder (8765 was taken by something else; used 8791/8792). `index.html?lite` for software-GL tests.

**Not verified (state honestly to user):** real GPU frame rate, Firefox, Safari, real touch device, all inner pages beyond a smoke look, RTL/Arabic visual pass of the cinematic, Supabase-driven catalog on products.html after restyle.

**How to apply:** if the user reports glitches, follow [[feedback-ultimate-fix-prompt]] (measure first). Keep the no-Higgsfield and local-assets rules.

**Update 2026-09-20 (later):** homepage cinematic + machinery viewer now use the NEW Andoria S321 single-cylinder diesel engine (built from the user's reference sheet), not the ADG generator. Model: `assets/models/andoria_s321/` (`build_scripts/s1..s5 + export_glb.py`, `andoria_s321.blend/.glb` 1.1 MB, `renders/`). No clip-plane reveal any more (open engine): chapters are hero / heritage / "Every part in plain sight" (labels: fuel tank, air cleaner, flywheel, injection pump) / tank-label close-up / finale; flywheel+shaft spin and exhaust smoke on Start engine. Exhaust stack placed on the back side (reference sheet unclear). Slim upload folder `Documents/andoria-revamp cloudflare` is kept in sync manually (copy changed files). Shop page has the orbit-fan carousel + restyled sticky search; homepage grid restored. Perf pass done: [[reference-web-perf-optimization-prompt]]. Model build followed [[reference-blender-fast-3d-pipeline]] (modular scripts, EEVEE, ~2 min shader compile, launch via PowerShell Start-Process).
