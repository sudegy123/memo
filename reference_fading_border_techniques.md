---
name: reference-fading-border-techniques
description: "Set 3 technique #31 — the Fading Border Techniques: gradient cross-fades between page sections, for both plain stacked sections and scroll-pinned/WebGL sections, instead of hard color-block cuts. Expected to be reused often."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-19T05:58:16.030Z
---

**Set 3, item #31 — the Fading Border Techniques.** (See [[reference_3d_web_hero_techniques]] for #1–19 and [[reference_kimi_site_techniques]] for #20–30.) Built for the Lumière site after the user rejected a chequered/torn-paper dissolve as looking "broken" and asked for smooth, clean transitions between sections using the techniques already in the catalog. Flagged by the user as something that will come up a lot going forward — reach for this by name.

**Why:** adjacent sections with different solid background colors (a dark WebGL scene into a light section, a light section into a dark one) read as an abrupt "cut" — a hard horizontal line — unless something bridges the two colors at the seam. There are two Fading Border Techniques, chosen by what kind of section is on the receiving end.

### Fading Border Technique 1 — Static (for plain, normal-flow sections)

For any ordinary section that sits in normal document flow next to a differently-colored one, add a small absolutely-positioned div at the very bottom of the *first* section, gradient-filled toward the *next* section's background color. No JS, no scroll math — it's always positioned at that section's true bottom edge regardless of scroll position, so it just works:

```css
.section-a { position: relative; /* required so the overlay's inset:0-style positioning anchors here */ }
.section-a-fade-out {
  position: absolute; inset-inline: 0; bottom: 0; height: 20vh; pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--section-b-bg-color));
}
```
```html
<section class="section-a">
  ...
  <div class="section-a-fade-out"></div>
</section>
```

**Gotcha:** if the section already has a rule like `.section-a > *:not(#some-canvas) { position: relative; z-index: 1; }` (commonly added so content sits above a background contour canvas — see technique #28), that rule's `position: relative` will silently override this overlay's `position: absolute` because of higher selector specificity, breaking it invisibly. Add the new overlay's class to the `:not()` exclusion list: `.section-a > *:not(#some-canvas):not(.section-a-fade-out)`.

### Fading Border Technique 2 — Scroll-Gated (for scroll-pinned / WebGL sections)

A section that uses its own tall scroll-scoped wrapper with an internal `position: sticky` pin (see technique #29/Kimi's tall-wrapper pattern) fills the *entire* viewport for the whole length of its scroll range — a static overlay at its "bottom" would be visible for the section's entire duration, not just at the handoff. Instead, gate the overlay's opacity to only ramp in during the *tail* of that section's own local scroll progress, reusing the `scrollProgress()` primitive (#22) that's already scoped to the section:

```js
// inside the section's own per-frame render/update loop, where `currentScroll`
// is already the section's own 0..1 progress (not the whole page's)
const fadeOutEl = document.getElementById('section-fade-out');
fadeOutEl.style.opacity = Math.max(0, Math.min(1, (currentScroll - 0.82) / 0.18));
```
```css
.section-fade-out {
  position: absolute; inset-inline: 0; bottom: 0; height: 32vh; pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--next-section-bg-color));
  opacity: 0; /* driven entirely by JS above */
}
```
The `0.82` / `0.18` split means the overlay stays fully transparent for the first 82% of that section's scroll (so it never dims the actual content — the orbiting model, the shader, the slides) and only ramps to full opacity in the last 18%, right as the section is about to release its sticky pin and hand off to whatever comes next.

**Where used:** the Lumière fine-jewelry site's gem-cinematic-section → hero handoff uses Technique 2 (Scroll-Gated); hero → provenance, provenance → atelier, and atelier → footer all use Technique 1 (Static), since those are plain stacked sections.

**Which to reach for:** if the section being exited is a normal in-flow block, use Technique 1. If it's pinned via `position: sticky` and occupies the full viewport for an extended scroll range, use Technique 2.

### Debugging note that applies to both

If a fade overlay's opacity is confirmed correct via `getComputedStyle` but still doesn't visually appear, don't assume a paint/stacking bug from that alone — `document.elementFromPoint()` correctly *skips* elements with `pointer-events: none` for hit-testing, so a "wrong element returned" result from that specific API does **not** prove a paint-order problem. To actually verify visibility, force the element to an unmissable color (`background: red !important; opacity: 1 !important`) and screenshot — if it still doesn't show up, suspect the **browser/testing environment** before the CSS (see [[feedback_hard_debug_protocol]]): a WebGL-heavy page's screenshot compositing can behave differently across browsers in headless automation, so cross-check in more than one browser engine before concluding the site itself is broken.

### Gotcha: don't leave the old recede/scale system wrapped around a section that now uses Technique 1

On the Lumière hero → provenance seam, the user reported the fade "not just not spanning it even shrinks" — the whole hero block (text, CTA, metal picker) visually inset with dark diagonal corners exactly at the transition. Root cause, confirmed via Playwright: the hero was still wrapped in an *older*, unrelated transition mechanism — the sticky-stack recede pattern (`.stack > .stack-layer > .stack-inner[data-inner]` + `.stack-shade[data-shade]`, driven by a JS `applyRecede()` that applies `inner.style.transform = scale(...)` as the next section approaches). Since the new `.hero-fade-out` overlay (Technique 1) lived *inside* that same `.stack-inner`, it — and the entire hero — got shrunk by the recede's scale transform, which reads as broken "shrinking with dark corners" rather than a clean fade.

**Fix:** once a section adopts a Fading Border Technique for a given seam, remove that section from any older recede/scale/parallax wrapper handling the *same* seam — the two are redundant at best and visually compound at worst. Concretely: unwrap the section from `.stack-layer`/`.stack-inner`/`.stack-shade` (or whatever the old mechanism is) back to a plain top-level element, and delete the now-dead JS driving it (`stackLayers`/`stackPairs`/`applyRecede()` and its `scroll`/`resize` listeners) rather than leaving it inert — inert-but-still-running scroll listeners are easy to forget and can silently re-break things if the markup ever changes back.

**Verify:** with Playwright, scroll to the seam and read the overlay's `getBoundingClientRect()` — it must match the section's own full width/x exactly (e.g. `x:0, width:<viewport width>`), not an inset rect (`x:19, width:1327`, the signature of an ancestor `transform: scale()` shrinking it). Also confirm `getComputedStyle(sectionContent).transform === 'none'` at the seam.
