---
name: feedback-hard-debug-protocol
description: "User's standing instruction for ANY persistent/recurring problem, not just web bugs — verify with real evidence, never hand back a claimed-fixed thing that wasn't actually checked"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-19T00:23:44.720Z
---

When a problem survives more than one fix attempt — in any domain, not just a website — switch modes entirely — stop hypothesizing from reading/reasoning alone and start verifying with real evidence before claiming anything is fixed. This is a general standing rule, not scoped to browsers, canvases, or this one incident.

**Why:** On the Lumière site's contour-background bug, I made three consecutive "fixes" (ResizeObserver, opacity, contour density) based purely on reasoning about the code, and none of them addressed the actual problem — the canvases were rendering at the browser's default 300×150px size because `<canvas>` is a replaced element and ignores `inset:0` for sizing. The user explicitly generalized this afterward: the instruction applies to **all persistent problems**, not just that one. The real fix was found in minutes once I actually inspected live state instead of guessing from source — the pattern (guess → patch → still broken → guess again) is the failure mode to watch for in any domain.

**How to apply — the protocol, reusable as a prompt verbatim:**

> Check everything for the actual root cause — don't guess from a partial read or a plausible-sounding theory. Every time you try a solution, actually verify it against reality before telling me it's done. Don't hand me back something unfixed again.

Concretely, once a problem resists a first fix attempt, for **any** kind of task:

1. **Get real verification tooling before the second guess**, whatever that means for the domain at hand:
   - Browser/frontend bug → a headless browser (Playwright: `npm install playwright --no-save` then `npx playwright install chromium` — a clean local scratch install, no persistent project changes) to inspect real DOM/CSS/canvas state.
   - Backend/API bug → actually make the request and read the real response, don't infer it from the handler code.
   - Build/config/CLI issue → actually run the command and read its real output/exit code, don't assume from the config file.
   - Data/logic bug → actually run the code against real or representative input and inspect real output, don't trace it by eye.
   Don't keep reasoning about behavior in the abstract once a way to check reality is available.
2. **Inspect actual state, not assumed state.** Pull real values — DOM rects/computed styles/element dimensions for web, actual stdout/stderr/exit codes for CLI, actual response bodies/status codes for APIs, actual variable values for logic bugs. Compare what you *find* against what you *expected* — the gap is usually the actual bug.
3. **Capture concrete evidence of the fix**, appropriate to the domain — a screenshot for anything visual, a command's real output for anything CLI/build-related, an actual response for anything API-related. Evidence is ground truth that code-reading can't give you, especially wherever "the code looks right" and "the real behavior" are known to diverge (rendering/layout, timing/async, environment-dependent behavior).
4. **Re-verify after every fix attempt, not just the first.** Re-run the same inspection/check after each change. Only report something fixed once the evidence — not the reasoning — confirms it.
5. **Never say "fixed" from reasoning alone** once a problem has already survived one such claim. Trust drops fast after a false "fixed" — earn it back with shown evidence, not more explanation.

**When to invoke this mode:** not for every routine change — routine edits with an obvious, verifiable-by-inspection cause are fine to ship normally. This applies specifically once: (a) a problem has already survived a prior fix attempt, regardless of domain, or (b) the failure mode is one where "looks right" and "is right" are known to diverge easily (rendering/layout/canvas/WebGL, async/timing, environment- or state-dependent behavior, anything scroll- or animation-driven).
