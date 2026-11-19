---
name: reference-five-concepts-method
description: "Reusable method — when asked to redo a page and the user isn't sure what they want, build 5 genuinely different homepage/landing concepts in a side folder with a picker page, instead of iterating on one guess"
metadata:
  node_type: memory
  type: reference
  originSessionId: 01dc91bf-b4a4-4924-851d-cbb332ae3c67
  modified: 2026-09-27T20:40:31.162Z
---

**When to use:** the user says something like "I don't like the current homepage, make N new ones in a separate folder until I'm satisfied" — or more generally, whenever a page's direction is undecided and one more guess-and-revise round would waste time. First used for [[project-miniman-website]]'s homepage redo, but the method itself is generic and applies to any site.

**Why it works:** revising one homepage repeatedly converges slowly because each round only tests one idea against vague taste. Five genuinely different concepts, seen side by side, let the person point at "that one" (or "the carousel from 3 but the hero from 1") in one round instead of ten.

**How to apply:**

1. **New folder, not the live site.** e.g. `homepages/` inside the project. Never touch the current live page until one concept is chosen.
2. **Shared chrome, unique bodies.** Factor the site's real header/footer/nav/cart/i18n into one `shared.js`/`shared.css` the concepts import, so every concept still links into the real Shop/About/Contact pages and behaves like part of the site — only the hero/landing content differs. Don't rebuild nav or product data per concept.
3. **Make the 5 structurally different, not palette variants of one layout.** Vary the actual composition and technique, e.g.:
   - An editorial/magazine layout (giant type, pinned horizontal photo-gallery scroll, product grid)
   - A single full-bleed interactive stage (e.g. 3D object switching on scroll, one hero doing all the work)
   - A cinematic video-led layout (ticker, category "doors", stacking scroll sections, product rail)
   - A modern tile/bento grid (mixed tile sizes, a live 3D or animated tile, counters, tilt-on-hover)
   - A loud poster/maximalist layout (huge display type, countdown or urgency element, marquees, a draggable card carousel)
   Reuse the project's own existing techniques/components across concepts (a carousel built for concept 5 can be dropped into concept 3 later if the user asks to mix).
4. **One picker page** (`index.html` in that folder) listing all N with a thumbnail, one-line pitch per concept, and a link to open each. Add a small persistent "back to concepts" control on every concept page.
5. **Generate any photos needed per concept** (hero shots, close-ups, lifestyle/street shots, flat lays) rather than leaving placeholders — cheap to do up front, makes the concepts feel real enough to judge fairly. Keep them free of logos/brand names/text per the no-fabricated-real-brand-content rule.
6. **Test each concept for real** (headless browser: page loads, no console errors, no horizontal overflow) before showing the picker — a broken concept wastes the person's evaluation round.
7. **When the person points at one** (by number, or "mix X's hero with Y's carousel"), port *that* concept's markup/CSS/JS into the site's real homepage file/build step, wire it into the real build pipeline (not the standalone concept file), and say plainly what carried over vs what's still concept-only (e.g. "English text only, no Arabic yet" or "loads N MB of assets up front").
8. **Fold reusable pieces back into technique notes.** A concept-specific effect worth reusing again (e.g. a new carousel variant) should get written up the normal way once it's proven, not left buried in a one-off concept file.

**Anti-pattern this replaces:** repeatedly patching one homepage based on "no, something else" feedback with no shared vocabulary for what "something else" means — the 5-concepts round gives the person concrete things to point at instead.

## Detail: what actually went into each concept last time (Miniman sneaker store)

This is one worked example of step 3 — concrete enough to reuse the *shapes*, even though the copy/imagery was store-specific.

**Shared scaffold (`shared.css` + `shared.js`), built first:**
- CSS custom properties for the whole palette/type/spacing so every concept reads as one brand (don't redefine colors per concept file).
- `shared.js` exported: the real product data import, a `chrome()` function that injects the real header (logo, nav links to the *actual* Shop/About/Contact pages, language toggle placeholder) and real footer (address, hours, socials) into whatever concept page called it, plus a floating "◂ Concepts" pill button fixed to a corner on every concept page so the person can bounce between them with one click.
- A `money()`/formatting helper shared so prices render identically everywhere.
- Each concept's own `<style>` block only touches that concept's unique classes — never overrides shared header/footer rules.

**Concept 1 — "The Lookbook" (editorial magazine):**
- Full-bleed photo hero, giant serif display type overlapping a product photo, small caption/price line.
- A pinned section (`position: sticky` on a tall wrapper) where a horizontal row of photo cards translates sideways as the user scrolls vertically — scroll progress of the tall wrapper mapped to `translateX` on the row, exact technique from the older 3D-hero-techniques notes.
- Ends in a plain responsive product grid (existing card component reused as-is).

**Concept 2 — "The Stage" (single interactive hero, does everything):**
- One full-viewport 3D canvas (three.js) as effectively the entire homepage content — a rotating hero object with scroll-position mapped to which product/variant is shown.
- Reused the project's existing "switch blur" transition: scroll crosses a threshold → object spins up while a CSS `filter: blur()` ramps → the underlying 3D model/material is swapped while fully blurred → blur eases back out on the new object. (See the project's own 3D/GLB technique notes for the swap-at-blur-peak trick this was based on.)
- Minimal overlaid UI: a small live counter/label of which item is showing, one CTA.

**Concept 3 — "The Cinema" (video-led, most component-dense):**
- Existing brand video as the hero background (muted/looped), large outline/display type over it, gold marquee/ticker strip beneath.
- Three large clickable "doors" (one per top-level category) — big tappable photo tiles side by side.
- A stacking-cards scroll section: 2–3 full-viewport panels that pin and layer over each other as you scroll past (`position: sticky` panels with increasing z-index, each new one sliding/fading over the previous — same family as the older Andoria-style "fold" pin-and-recede pattern).
- Ends in a horizontal product rail.
- This concept's draggable 3D-card product carousel (built for concept 5 originally) was later copied wholesale into concept 3 when the user asked to mix — confirms step 7's "port pieces between concepts" is a real, expected workflow, not just theoretical.

**Concept 4 — "The Bento" (modern tile grid):**
- CSS grid with deliberately mismatched tile spans (one large 2x2 hero tile, several 1x1s) — the "bento box" look.
- One tile is a *live* mini 3D viewer (draggable rotate) rather than a static image — mixing real interactive product content into an otherwise static-looking grid is what sells the "modern" feel.
- Small tiles used for count-up stat animations (e.g. "N styles", "N brands") using IntersectionObserver-triggered number tweening.
- Tilt-on-hover microinteraction on tiles (`transform: perspective(...) rotateX/rotateY` tied to pointer position within the tile) — cheap, no library.

**Concept 5 — "The Drop" (maximalist/streetwear poster):**
- Huge condensed/display type filling the viewport width, treated like a gig-poster/streetwear-drop poster rather than a conventional hero.
- A live countdown timer (to a real or placeholder "drop" date) for urgency.
- Two marquee/ticker strips (top and bottom) scrolling brand/category names continuously.
- The draggable 3D-card carousel (rotate-on-drag stack of product cards in fake perspective, snap-to-nearest on release) — this was the piece later reused in concept 3.

**Picker page (`homepages/index.html`):** grid of 5 thumbnail cards, each with concept name + one-line pitch (e.g. "Editorial magazine energy" / "One interactive 3D hero" / "Video-led with stacking scroll sections" / "Modern bento grid with a live 3D tile" / "Maximalist streetwear-drop poster"), linking to each concept file.

**Follow-up requests that came after picking one, for calibration on how much iteration to expect post-selection:** the user picked concept 3, then asked for several small targeted swaps and fixes on it alone — e.g. "use [concept 5's] carousel instead of the plain rail here", "make the header transparent at the top and solid on scroll", "there's a stray line under the header, remove it", "the location text is unreadable over the hero video, fix contrast/position". This is normal: picking a concept is the start of a normal polish pass on *that one file*, not the end of the task — budget for it rather than treating concept-selection as done-done.

## How to actually make 5 designs *look* different (not just re-skins)

The trap is producing 5 pages that are the same layout with different colors. What makes them read as genuinely different designs is varying several axes at once, deliberately, per concept — pick a distinct combination for each of the 5 rather than letting them converge:

1. **Layout paradigm** — this is the primary axis, pick a different one per concept:
   - Vertical editorial scroll (hero → sections → footer, classic)
   - One dominant interactive centerpiece (a single 3D/canvas hero *is* most of the page)
   - Horizontal/pinned scroll-jacking (vertical scroll drives horizontal motion)
   - Grid/bento (asymmetric CSS grid tiles)
   - Poster/maximalist (huge type as the primary graphic element, minimal conventional "sections")
2. **Typography personality** — don't reuse the same type scale/family choice everywhere:
   - Serif display (editorial, upscale) vs. condensed/grotesk display (poster, streetwear) vs. a mix (mono/tech labels + serif headlines) vs. restrained sans (minimal/bento)
   - Type *scale* itself is a design signal — one concept should have genuinely oversized type (viewport-width headlines) as its main visual, another should keep type modest and let imagery/space lead.
3. **Color temperature/contrast per concept**, even within one brand palette — e.g. one concept mostly dark/moody, one mostly light/airy, one high-contrast poster (near-black + one saturated accent), one warm-neutral editorial, one that leans hardest into the accent color as a background rather than a highlight. Reuse the same token set (see shared.css) but let each concept *weight* those tokens differently — dark-dominant vs light-dominant vs accent-dominant is itself a design decision worth varying.
4. **Motion signature** — give each concept one primary motion idea, not a grab-bag of every effect on every concept:
   - Concept A: parallax/pinned horizontal scroll
   - Concept B: object/material swap-on-blur transition
   - Concept C: panels stacking and receding (sticky + z-index layering)
   - Concept D: hover/pointer-driven micro-tilt + count-up numbers
   - Concept E: continuous marquee/ticker motion + countdown + drag-to-rotate carousel
   Pick one signature move per concept and execute it well, rather than reusing the same scroll-fade on every concept.
5. **Imagery treatment** — vary how photos are used, not just which photos: full-bleed cinematic backgrounds vs. cropped/tiled grid photos vs. a single hero product shot vs. photos treated as texture behind huge type vs. no photography at all (typographic/graphic only, like a poster concept can go almost photo-free and still feel complete).
6. **Density/whitespace** — at least one concept should be deliberately sparse (lots of negative space, one idea per screen) and at least one deliberately dense/maximal (packed grid, marquees, overlapping type) — that contrast alone makes the set feel like real alternatives rather than variations on one instinct.
7. **Generate fresh imagery per concept's treatment, not one shared photo set** — a concept built around full-bleed cinematic backgrounds needs wide/dark/moody shots; a bento grid needs square-ish crops that read at small tile sizes; a poster concept may need almost no photography at all. Don't force the same 5–6 stock images into every layout — generate or select imagery *for* each concept's specific treatment (see step 5 in the main method above re: generating art per concept).
8. **Keep the brand constant while everything else moves** — the thing that must NOT vary across all 5 is the actual brand identity: logo, the real product data, the real nav destinations, the core color tokens (even if weighted differently per #3), and voice/tone of copy. Concepts should feel like 5 different photographers/art-directors were given the same brand brief, not 5 different unrelated brands.

**Quick self-check before showing the picker:** look at the 5 thumbnails side by side — if you can't tell them apart at a glance without reading the labels, at least 2 of them are too similar; go back and push layout paradigm (#1) and motion signature (#4) further apart, since those two axes do the most work in making concepts *feel* distinct.

