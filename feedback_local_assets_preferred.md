---
name: feedback-local-assets-preferred
description: "User prefers downloading and self-hosting assets (3D models, images) locally rather than hotlinking third-party/generated URLs"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-18T19:11:39.421Z
---

When a page needs a new asset (3D model, image, etc.) and no existing project URL covers it, download the file to the project and reference it locally rather than hotlinking a remote URL or generating one via an AI tool.

**Why:** When swapping a soda-can 3D model for a generator model, user said "download one and use it from the laptop" instead of accepting a generated (Higgsfield) or arbitrary hotlinked asset. See [[feedback-no-higgsfield]].

**How to apply:** For new asset needs, search for free/CC0-licensed downloadable files (e.g. Poly Pizza for `.glb` models), `curl` them into a local `models/`/`assets/` folder next to the project's HTML, and reference them with relative paths. Only hotlink external URLs when the user's own spec explicitly provides them (e.g. an existing asset bucket).
