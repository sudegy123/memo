---
name: project-miniman-cloudinary
description: "Miniman media moved to Cloudinary (cloud dd9m8ypgl) + slim deploy folder 'miniman cloudflare'; how to re-sync after edits"
metadata:
  node_type: memory
  type: project
  originSessionId: d9ed1d18-23a1-4dae-a02a-1370db31782e
  modified: 2026-09-24T00:03:26.540Z
---

Miniman's used images/video (22 files) live on Cloudinary, cloud name `dd9m8ypgl`, public_ids under `miniman/img/...` and `miniman/videos/...`. Pages, CSS, `components.js` and `products.json` in `Documents/miniman website` now point at `https://res.cloudinary.com/dd9m8ypgl/image/upload/f_auto,q_auto[,c_limit,w_N]/miniman/...` (favicon uses `f_png`; video uses `q_auto`). Originals backed up in `_backup/pre-cloudinary/`; the local image files were left in place, not deleted.

`C:\Users\DELL\Documents\miniman cloudflare` is the slim deploy copy (34 files, ~0.4 MB: 15 html, 2 css, 15 js, products.json, hero-sneaker.svg) — the folder to upload to Cloudflare. It is a copy, so edits in `miniman website` must be re-copied.

**Update 2026-09-24:** the name `Documents\miniman cloudflare` now belongs to the SHOWROOM deploy (9.4 MB, 32 files, index.html = showroom.html, built from `miniman showroom` by capturing every request in Playwright, see [[project-miniman-showroom]]). The old 2D-site upload folder above was renamed `miniman cloudflare (old 2D site)`. Re-copy from `miniman showroom` after edits.

**Why:** the full folder (34.6 MB, 91 files) was too big / stalled on Cloudflare upload; user asked to move images to Cloudinary and make a lean upload folder.

**How to apply:** for new product images, upload to Cloudinary and use the same URL pattern; rebuild the deploy folder from the working folder after changes. The API secret was shared in chat and is NOT stored anywhere — advised the user to regenerate it; never write it into files. Admin-panel product edits come from Supabase overrides and were not tested live. Related: [[project-miniman-shop-fan]], [[feedback-local-assets-preferred]] (user explicitly overrode local-assets preference for this site).
