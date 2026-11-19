---
name: reference-camera-views-composition
description: "LOAD when designing/tuning named camera views (pos/look/fov per section) for a Three.js room or showroom: how the rig works, sizing formulas, composition with HTML copy, per-device view sets, occlusion checks, and a fast one-number-at-a-time tuning loop"
metadata:
  node_type: memory
  type: reference
  originSessionId: d9ed1d18-23a1-4dae-a02a-1370db31782e
  modified: 2026-09-24T00:07:22.641Z
---

First time the user and I worked on **named camera views** as a design surface (not scroll-driven): [[project-miniman-showroom]] has 5 views (Miniman overview, Home, Shop, About, Contact) the camera flies between. The user judges each view by eye on their phone and PC and asks for very specific nudges. Techniques from [[reference-showroom-mobile-lessons]] and [[reference-cine-generator-techniques]] (Catmull path) still apply; this note is about *composing* the views.

**How the rig is wired (reusable):** `SECTIONS = { key: {pos:[x,y,z], look:[x,y,z], fov} }`, one set per device class (desktop / mobile). `camera-rig.js` `travel(key)` flies along a Catmull-Rom curve through one raised midpoint, easing the look target and fov together; `jumpTo(key)` for first paint/rotation. Zone HTML overlays fade out during travel and in when settled. Idle mouse sway is an absolute offset re-derived from the rig's look target each frame (never `+=`).

**Sizing maths (use instead of guessing):**
- visible height at distance d = `2·d·tan(fov/2)`; visible width = height × aspect (phone portrait aspect ≈ 0.5, so width is the binding limit).
- Subject fills fraction f of the screen height when `d = subjectHeight / (f · 2·tan(fov/2))`. Mini Man mascot is ~4.5 tall incl. plinth (scaled to 4.2 + 0.28 plinth); to fit it in the top ~55% of a phone screen needed d≈9 at fov 40.
- Distance between camera and subject > ~3.5 units per unit of subject width keeps a phone view from cropping; a 4-unit-away camera on a 2-wide hologram made it huge and cropped.
- Prefer widening fov a little (50–64) over dollying beyond the room wall (radius 15) or into fog (16–30).

**Composition rules the user's feedback enforced:**
1. **Copy and subject never share pixels.** Decide where the HTML text sits first (desktop: bottom-left column ~50% width; phone: bottom ~45% height), then place the subject in the remaining space. Desktop Shop: wall shifted right of centre by aiming the camera 1.8 units left of it; phone: whole scene shifted up 16% with `setViewOffset`.
2. **Centre on the real target.** Shop camera aimed at x=5.5 but the wall was at x=7 → looked off-centre. Always compute the look target from the subject's actual world position.
3. **One hero per view.** "Show the whole room" on a portrait phone always crops the sides (room is ~14 wide); the user preferred replacing that view with a close-up of the mascot's face over any compromise wide shot.
4. **Eye height vs subject:** low cameras (y≈1.6) at a hologram/pedestal make it loom; y≈3.3–3.9 looking slightly down at the hologram height (~1.3) reads best. To "focus on the face" raise camera y AND look y together (pos y 4.0, look y 3.45 at head height) with a narrow fov (~40) — raising only look moves the model down the screen.
5. **Occluders in the path:** check the straight line camera→subject against other props (Home shoe pedestal at z=7 blocked a camera on the Z axis; fixed by a ~30° azimuth offset). The Contact view must approach off-axis because the mascot at the room centre blocks a straight −Z view.
6. **Glare:** a camera on the mirror-reflection line of a light shows glossy-floor glare; nudge the light or camera.
7. **Ceiling/fog:** cameras above the ceiling (y>9) work if the ceiling is single-sided, but fog dims anything >16 away.

**Per-device sets:** keep `SECTIONS` and `SECTIONS_MOBILE` separate and change only the set the user named; "phones only" must not alter desktop (see [[feedback-showroom-mobile-prefs]]). Selection by `(max-width:760px), (max-aspect-ratio:1/1)`.

**Tuning loop that worked (≈2–4 iterations per view):** edit one line in `SECTIONS_MOBILE` → run a 20-line Playwright script that loads `#zone`, waits 2.5 s, screenshots at 390×780 @3x (and 1366×768 for desktop) → look at the image → adjust one number → repeat. Read the user's words as a direction: "zoom out" = raise fov or pull pos back; "move it up" = ambiguous (camera up vs model up on screen) — pick the reading that keeps the subject clear of the nav/tab strip and state which I chose; "zoomed in more" = lower fov / move closer; "sits to the right" = aim left of it. Also verify the *held pose is static* (two screenshots seconds apart) when a spin is meant to stop.

**Views also carry behaviour:** the phone Miniman view triggers mascot "hold" (stop spin, face camera, key light on). Put such per-view side effects in one function called from `goTo`, first paint, and the media-query `change` handler so rotation/resizing can't leave it stale.
