---
name: feedback-mobile-css-cache-busting
description: "Always add ?v=<version> cache-busting query strings to local CSS/JS <link>/<script> tags on any project the user tests live on their phone over LAN — mobile Safari caches these far more stubbornly than the HTML page itself"
metadata:
  node_type: memory
  type: feedback
  originSessionId: b399fce0-c957-4260-88d7-ceb021680ade
  modified: 2026-09-28T05:44:43.784Z
---

On the Solar Smart Advisor CSS-fix debugging session, the user reported the same layout bug four times in a row, with each report worded differently ("moves with the frame" → "not stuck to the bottom" → "not sticking to the footer" → "still moves with the frame") even though each underlying code fix was verified correct via Playwright (Chromium AND WebKit with a real iPhone device profile, cross-checked with actual pixel measurements, not just computed-style assertions).

**Root cause:** `app.html`'s local `<link>`/`<script>` tags had no cache-busting query string (`assets/css/layout.css` instead of `assets/css/layout.css?v=123`). The user was testing over LAN on a real phone (`http://192.168.100.62:8090/app.html`). Mobile Safari (and mobile Chrome to a lesser extent) caches linked CSS/JS files far more aggressively and independently from the HTML document — a page reload, or even fully closing and reopening the tab, does NOT reliably re-fetch those files. Desktop Chrome's Ctrl+Shift+R / DevTools "disable cache" has no real mobile-Safari equivalent a normal user would find. So every one of my CSS fixes was real and correct, but the phone kept serving the very first cached copy of `layout.css` from session start.

**Fix applied:** appended a shared `?v=YYYYMMDDx` query string to every local (same-origin) `.css`/`.js` asset reference in the HTML (not third-party CDN scripts). Bump that version string on every future edit session that touches CSS/JS the user will test live on a phone, so the browser is forced to treat it as a new resource.

**How to apply going forward:**
- Any time a project is being tested live on a phone (not just desktop localhost), check the entry HTML's asset `<link>`/`<script>` tags for a version query string BEFORE spending time debugging "the fix isn't showing up on the phone" reports — check this FIRST, before re-reading application logic, if the user reports the same visual bug persisting across multiple verified-correct fixes.
- If there's no version string, add one project-wide immediately as a standing fix, not just for the current bug.
- After adding it, bump the version on every subsequent edit round (or better: ask if a simple auto-incrementing dev server / no-cache header setup is worth setting up if this keeps recurring).
- This is a categorically different problem from a real rendering bug — no amount of cross-engine Playwright testing will catch it, since Playwright always fetches fresh. The tell is: code review + multi-engine automated testing all pass cleanly, but the user's live report doesn't change round after round, and simple "did you hard-refresh" checks don't resolve it either.
