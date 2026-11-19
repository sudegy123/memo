---
name: feedback-filename-collision
description: "Check whether a generic filename (index.html, etc.) is already used by a different project in this working directory before writing to it"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-18T21:20:31.282Z
---

Before writing a new deliverable to a generic filename — `index.html` especially — check whether that exact path is already occupied by a different, unrelated project in this working directory (`C:\Users\DELL` is used as a flat scratch space for multiple independent site builds this session: soda, Laocoön, generator-flagship, Kimi/GRIDO1, etc.).

**Why:** publishing the finished Kimi/GRIDO1 F1 site to `C:\Users\DELL\index.html` silently overwrote the unrelated soda/generator landing page that already lived at that path from earlier in the same session. It was only recoverable because the soda page's last full-file state happened to still be visible earlier in the conversation transcript — a lucky save, not a safety net to rely on.

**How to apply:** in this working directory, always give each project build its own distinctive filename (`kimi-index-final.html`, `laocoon.html`, `generator-flagship.html`, etc.) rather than the generic `index.html`, unless the user explicitly asks for that project to be *the* index.html and confirms overwriting whatever is currently there. If asked to name something `index.html`, glob/check the directory first for an existing file with real content before writing.
