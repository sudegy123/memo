---
name: feedback-ultimate-fix-prompt
description: "Reusable master prompt for fixing + optimizing persistent bugs (esp. scroll/3D/animation web work) — distilled from the Cards Cascade shop debugging, extends the hard-debug protocol"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b399fce0-c957-4260-88d7-ceb021680ade
  modified: 2026-09-28T07:54:21.669Z
---

**STANDING RULE, not just for hard bugs:** the user has said multiple times across sessions that ANY visual/interactive web change — not only persistent/recurring bugs — must be verified with real browser testing (Playwright) before being reported as done. Don't reserve Gate B for when things have already gone wrong; run it as a normal part of finishing the work. A quick single-engine headless pass with only computed-style assertions is not enough on its own — actually launch the browser(s), interact with real clicks/drags/keyboard, and look at the screenshots yourself. Cross-engine (Chromium + Firefox, WebKit too when installable) is the default expectation for anything with layout, animation, or drag/touch interaction, not an optional extra for hard cases.

Extends [[feedback-hard-debug-protocol]] with the concrete lessons from the Cards Cascade shop page (`Documents/cards-cascade-shop.html`, see [[reference-3d-web-hero-techniques]] and [[reference-kimi-site-techniques]] for the technique catalogs). The user reported "stretching/glitching", got a "fix", saw it again, and demanded a full fix that is tested before hand-off. Three attempts were needed; the real causes were not the first ones guessed.

**Why:** Attempt 1 was pure code-reading (wrong: blamed perspective maths). Attempt 2 (dead-zone easing + idle scroll-snap) passed in Chromium but failed in the user's Firefox-based browser. Attempt 3 found two real root causes only after measuring: (a) design flaw — card pose derived from scroll offset, so scrolling can rest between states; (b) performance — `backdrop-filter` + big shadows on 11 cards gave ~6-8 fps, and a `dt` clamp made the animation crawl at low fps. Testing in one browser, and only at rest, hid both.

**How to apply — paste-ready master prompt:**

> Find the actual root cause of this problem and fix it completely. Don't guess from a partial read or a plausible theory.
>
> 1. **Reproduce first.** Use a real browser (Playwright: `npm install playwright --no-save`, `npx playwright install chromium firefox`) in the scratchpad folder. Match the user's real conditions from their screenshot: viewport size, browser zoom (140% = smaller CSS viewport, use deviceScaleFactor), browser engine. Reproduce the exact broken state before changing anything.
> 2. **Read real state, not assumed state.** Dump bounding rects, computed transforms, opacities, scroll position, and frame rate. Compare against expected values; the gap is the bug.
> 3. **Ask "what state can the user leave this in?"** Test the in-between and hostile states, not just the rest state: arbitrary scroll offsets, fast/spammed input, trackpad inertia bursts, mid-transition freezes, window resize, low frame rate.
> 4. **Prefer a design that makes the bad state impossible** over patching symptoms. Example: scroll-linked animation can rest half-way → replace with discrete steps (wheel/swipe/keys pick an index, time-based animation always lands on it).
> 5. **Measure performance as a possible cause.** Check fps during the animation. Suspects: `backdrop-filter`, large blurred `box-shadow`, `filter`, many `will-change` layers, per-frame layout reads. Fix cost before tuning easing. Make animation time-based (`dt`), don't clamp `dt` so hard it slows on weak machines; skip writes when nothing changed.
> 6. **Test in at least two engines (Chromium + Firefox)** — especially Firefox for scroll behavior, smooth-scroll interplay with `scrollTo`, and 3D transform rendering.
> 7. **Write assertions, not just screenshots.** Loop every state (each step down, each step up, clamps at both ends, keyboard, click targets, spam) and assert exact expected numbers (element size, position, visibility, counts). Sample per-frame values during a transition to catch worst-case stretch. Also assert no page errors.
> 8. **Look at the screenshots yourself** (rest + mid-transition + interactive UI like drawers) before reporting.
> 9. **Also check hit targets and edge UX** found along the way (e.g. 1px-tall clickable ticks miss in Firefox → add an `::after` hit area).
> 10. **Only then report**, stating: root cause(s), what changed, what was tested in which browsers with real results, and what was NOT tested (e.g. the user's exact browser). Do not say "fixed" or "perfect" without that evidence. If the user re-reports, re-run the same harness against the new evidence.

**Quick checklist of gotchas found in this session:**
- `getBoundingClientRect()` on 3D-tilted cards includes perspective growth — a tilted card behind the front one is legitimately a few px wider; set test tolerances from measured rest values, not guesses.
- `translateZ` approaching the `perspective` value explodes sizes (singularity) — cap z travel.
- Port already in use (e.g. 8080) → check with `netstat`, pick another; verify with `curl` status before opening the browser.
- Headless software rendering is slower than a real GPU; if fps is low there, treat it as a genuine cost signal and reduce paint work, don't just clamp timing.
- User-facing "scroll-driven" feel can be kept while removing scroll-offset dependence (wheel = one step with a ~400ms cooldown, touch swipe threshold, keyboard, rail clicks).

---

## v2 — Delivery gate (MANDATORY before saying "done", "fixed" or "perfect")

Perfect can't be promised, so the goal is: **no known-class bug reaches the user, and every gap is stated.** Treat this as a gate; if any line fails, keep working.

**Trigger:** load and follow this file whenever the user (a) reports a glitch/bug a second time, (b) says "perfect", "full fix", "test it", or (c) asks for any scroll/3D/animation/interactive web work. Don't skip it because the task "looks simple".

### Gate A — Reproduce & root-cause
- [ ] Reproduced the exact symptom from the user's screenshot/description (same viewport, zoom, engine) BEFORE editing.
- [ ] Named the root cause with measured evidence (rects, fps, computed styles), not a theory. If two fixes failed, the theory is wrong — re-measure.
- [ ] Asked "what states can the user leave this in?" and listed them.

### Gate B — Device & stress matrix (run all that apply; mark each PASS / FAIL / NOT TESTED)
| Axis | Cases |
|---|---|
| Engine | Chromium **and** Firefox (WebKit too if installable) |
| Viewport | 1366x768, 975x549 @1.4 dpr (140% zoom), 1920x1080, tablet 820x1180, phone 390x844 |
| Input | mouse wheel, trackpad-style tiny-delta bursts, keyboard, click, touch swipe (`hasTouch:true`), rapid spam |
| Performance | normal + CPU throttle 4x (`CDPSession Emulation.setCPUThrottlingRate`, Chromium) — fps must stay usable, animation must still land exactly |
| State | first item, last item, clamps at both ends, resize mid-animation, tab hidden/visible, cart/drawer/modal open |
| Rendering | dark/light OS theme if relevant, reduced-motion (`prefers-reduced-motion`: offer no-fly-through fallback) |
| Robustness | no console/page errors; no layout overflow (`scrollWidth<=innerWidth`); no element stuck between states after 2s idle |

### Gate C — Assertions, not vibes
- [ ] Wrote assertions with exact expected numbers (sizes, positions, counts) and looped every state. Template: `harness_playwright_cascade_template.js` in this memory folder (copy to scratchpad, adjust selectors/URL).
- [ ] Sampled per-frame values during a transition to catch worst-case distortion.
- [ ] Looked at screenshots myself: rest, mid-transition, interactive UI, mobile.

### Gate D — Honest handoff (use this template)
> **Root cause:** … (evidence: …)
> **Changed:** …
> **Tested (PASS):** engines/viewports/inputs actually run + key numbers
> **NOT tested:** (e.g. real touch device, user's exact browser/GPU, very slow PCs, Safari)
> **If it still misbehaves, send:** screenshot + what you did just before + browser/zoom.

Never write "perfect" or "guaranteed". Write what was verified and what wasn't.

### Gate E — Learn (close the loop)
- [ ] If the user reported a failure my tests missed: add that case to Gate B and the harness FIRST, watch it fail, then fix.
- [ ] Append any new gotcha to this file's checklist and update the relevant technique file (e.g. [[reference-cascade-deck-techniques]]). Notes only improve if updated after every miss.

### Known-class bug watchlist (check proactively on any similar build)
1. Animation pose derived from scroll offset → can rest mid-state. Use discrete steps + time-based settle.
2. Perf killers: `backdrop-filter`, big blurred shadows, many `will-change` layers, `filter`, layout reads in rAF.
3. `dt` clamped too tight → animation crawls on slow machines.
4. `translateZ` near `perspective` → size explosion.
5. Tiny click targets (1px ticks) → add `::after` hit area.
6. Firefox smooth-scroll vs `scrollTo` snap fights.
7. Port collisions (check `netstat`, verify with `curl` before opening).
8. Test tolerances set from guesses instead of measured rest values.
9. Testing only the rest state, only one browser, only one viewport.
10. Canvas/replaced elements ignoring `inset:0` sizing (see [[feedback-hard-debug-protocol]]).

**Gate E addition (Dr. Mazin scroll-journey hero, 2026-09-21):** user reported "not working as intended" with a screenshot of a SHORT window (~485x590): the pinned jar ended tiny and on top of the headline. My first test only used 390x844, where the leftover space above the copy happened to be big enough. Root cause: a jar "pinned zone" sized as `viewport - copyStackHeight - header` goes ≤0 on short viewports (page is bottom-aligned at max scroll, so you cannot reserve top space that way). Fix = make the jar's final home an in-flow spacer and have the jar track that spacer's live page position (`zoneMid - scrollY`), so overlap is impossible at any height. ALWAYS add a short-window case (485x590, 360x640, 1366x768) to Gate B for pinned/sticky 3D layouts, and assert jar-bbox vs visible-text-rect overlap = 0 at every scroll step (harness: scratchpad harness.js; expose a `jarRect()` hook; use instant scrollTo + wait for scrollY to settle, else smooth-scroll makes the jar frame stale vs the text rects). Also: swiftshader runs starve when the machine is at 100% CPU (VS Code/other sessions) — check `Win32_Processor LoadPercentage` before blaming the page, and never run two harness processes at once.

## Gate F — When the SAME verified-correct fix keeps getting reported as unfixed (Solar Smart Advisor step-footer, 2026-09-28)

A category of bug this protocol originally had no answer for: the user reports a visual bug on their **real phone over LAN**, each fix is verified correct via Playwright (including cross-engine — Chromium AND WebKit with a real device profile, real pixel measurements, screenshots looked at directly), yet the user reports the SAME bug again, worded differently each time ("moves with the frame" → "not stuck to the bottom" → "not sticking to the footer" → "still moves with the frame"). Four fix rounds all individually correct; none of them visibly changed anything for the user.

**Root cause:** the project's local `<link>`/`<script>` tags had no cache-busting query string (`assets/css/layout.css`, not `assets/css/layout.css?v=123`). Mobile Safari (and to a lesser extent mobile Chrome) caches linked CSS/JS independently of the HTML document — reloading the page, or even fully closing and reopening the tab, does not reliably re-fetch them. There is no mobile-Safari equivalent of desktop Chrome's Ctrl+Shift+R / DevTools "disable cache" a normal user would know to reach for. So every fix was real, but the phone kept re-rendering the very first cached CSS from session start. See [[feedback-mobile-css-cache-busting]] for the full writeup.

**The tell, learned the hard way:** code review + multi-round, multi-engine automated verification all pass cleanly every time, but the user's live report is unchanged across rounds, AND a plain "did you hard-refresh?" check doesn't resolve it either (they truly did refresh — the HTML re-fetches fine, it's the linked assets that don't). If a fix has been re-verified correct 2+ times and the user's report is still worded the same way (even if the specific phrasing shifts), STOP re-diagnosing the application code and check this first.

**New standing step — add to Gate A, run BEFORE any other diagnosis whenever the user is testing live on their own device (not the sandbox/localhost you're driving with Playwright):**
- [ ] Do the project's local CSS/JS `<link>`/`<script src>` tags have a cache-busting query string? If not, that is the FIRST suspect for "verified-correct fix, still reported broken" — add one project-wide (`?v=<version>`) immediately, independent of whatever specific bug is being chased, and bump it on every subsequent edit round in that session.
- This applies whenever the user's own device — not a machine you can drive with Playwright — is the one being tested on: LAN phone testing, a deployed URL they're checking, anyone testing from a different machine than yours. It does not apply when you and the user are both looking at the exact same localhost tab you're editing live (same browser process, no separate fetch/cache lifecycle to diverge).
- This is NOT a substitute for real fix verification — still do the full Gate A-E work on the actual code change. This check answers a different question: "is the browser even looking at what I just verified?"
