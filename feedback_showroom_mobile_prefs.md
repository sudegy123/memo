---
name: feedback-showroom-mobile-prefs
description: "User's stated mobile/UI preferences for the Miniman showroom: left-aligned text on phones, phone-only changes leave PC alone, consistent button colours, full-shop browse button, Andoria-style tiles"
metadata:
  node_type: memory
  type: feedback
  originSessionId: d9ed1d18-23a1-4dae-a02a-1370db31782e
  modified: 2026-09-24T00:05:14.832Z
---

Preferences the user gave while polishing [[project-miniman-showroom]] for phones (2026-09-24). See [[reference-showroom-mobile-lessons]] for the techniques.

- **Text on phones is LEFT-aligned, never centered.** I had centered all zone copy/buttons on mobile; the user objected. **How to apply:** default to left alignment in mobile CSS for this site; only center small UI (badges, close buttons).
- **"Phones only" means don't touch desktop.** When they said "zoom out the home camera" I changed both, and they replied "phones only, PC is good". **How to apply:** change `SECTIONS_MOBILE` / `@media (max-width:700px)` only; if I touched desktop values, revert them and say so. Ask/confirm the device when a camera request is ambiguous.
- **Grey intro text shouldn't eat phone space:** first 6 words + faded "Show more", on every zone except the Miniman overview.
- **Button colours must match the site's system:** a new CTA used a class the showroom doesn't define and rendered white; primary CTAs are `btn btn--solid` (gold #e7cd84, dark text), secondary `btn--ghost`. Copy an existing button's classes instead of inventing one.
- **Shop needs an escape hatch to the whole catalog:** a gold "Browse the full shop →" button under the category pills opens an in-showroom grid panel. Card style must copy the Andoria site's category tiles (dark tile, small gold index number top-right, label bottom-left, gold edge + arrow on hover); "← All shoes" returns to the same filtered grid.
- **Miniman overview on phones = close-up of the Mini Man logo figure**, model on the RIGHT side, stops spinning, camera raised toward the face (they iterated: "more zoomed in", "model to the right", "move it up", "cam up to focus on the face"). Expect further nudges; change one number at a time and re-screenshot.
- **Resolution matters to them:** they noticed blurry rendering on the phone immediately.
- **They test on a real iPhone over Wi-Fi** and send screenshots; treat those as the source of truth over emulation.
- **Cloudflare folder naming:** they call the upload folder "miniman cloudflare"; the name now points at the showroom deploy (old 2D one renamed).
