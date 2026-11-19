---
name: reference-showroom-mobile-lessons
description: "LOAD for any phone/tablet/cross-browser work on a Three.js camera-driven site: Firefox importmap bug, real-GPU Playwright flags, portrait framing via setViewOffset, swipe nav, mobile nav pattern, DPR ladder, LAN phone testing, slim deploy-folder method"
metadata:
  node_type: memory
  type: reference
  originSessionId: d9ed1d18-23a1-4dae-a02a-1370db31782e
  modified: 2026-09-24T00:05:03.612Z
---

Lessons from making [[project-miniman-showroom]] work on phones/tablets (2026-09-24). Complements [[reference-mazin-3d-web-lessons]] and [[feedback-ultimate-fix-prompt]].

**Firefox refuses the site if a `<link rel="modulepreload">` comes BEFORE `<script type="importmap">`** ("Import maps are not allowed after a module load or preload has started" → bare specifier `three` fails → nothing runs). Chrome tolerates it. Always put the importmap first in `<head>`. Found by running Playwright's Firefox and reading page errors.

**Testing heavy WebGL in Playwright:** default SwiftShader gave ~1 fps at 1080p and screenshots timed out. Launch chromium with `args:['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu']` to use the real GPU (~6x faster on this Intel HD 520). Use `screenshot({timeout:90000})`, and pipe long runs to a file, not through `cut` (buffering hides progress). `isMobile` isn't supported by Playwright Firefox contexts (drop it). Touch swipes: `context.newCDPSession` + `Input.dispatchTouchEvent` (touchStart/Move/End).

**Portrait/mobile framing recipe (camera-rig sites):**
- Choose the framing set with `matchMedia("(max-width:760px), (max-aspect-ratio:1/1)")` (portrait tablets need it too); keep `sections` as ONE mutable object and `Object.assign` the right set into it on the MQ `change` event, then `rig.jumpTo(current)` — rig and router keep their reference, rotation swaps framing live.
- Copy sits at the bottom on phones; slide the whole scene up with `camera.setViewOffset(w,h,0,h*0.16,w,h)` when `h>w` (else `clearViewOffset()`), so the subject lives in the top half. Raycasting still works (projection matrix includes the offset).
- Aim the camera at the subject's centre, not at a nearby number: the shop wall was at x=7 while the camera looked at x=5.5, so it sat off-centre. To push a subject to one side, aim at a point offset along the camera's right vector (`look = subject − k·right`).
- Camera inside the room ring: object between camera and subject blocks the view (Home shoe pedestal at z=7 was in line with the mascot) → approach off-axis, ~30° azimuth, and turn the subject's `rotation.y` to `atan2(camX,camZ)` to face the camera.
- `canvas{touch-action:none}` or the browser cancels pointermove for drags (`pointercancel`).
- Height: `100dvh` (keep `100%` fallback), `viewport-fit=cover`, `env(safe-area-inset-*)`, listen to `visualViewport` resize.
- Drag-vs-tap: count |dx|+|dy| for the tap threshold (a vertical drag counted as a tap opened products).

**Swipe between camera views:** document `touchstart/touchend` (passive); need |dx|≥50, |dx|≥1.5|dy|, <700 ms; clamp at ends; ignore while traveling or when a panel is open (`body.sr-locked`). Conflict rule: on a zone where canvas drag has another meaning (Shop wall spin) the swipe only counts when it starts off the canvas (on the copy panel). Verified with CDP touch events, incl. that a vertical swipe and a canvas swipe in Shop do nothing.

**Quality ladder, not a cliff:** old guard dropped to DPR 1 permanently after one slow 2 s window → phones looked blurry. Now start at DPR 2 (phones are 3x), step 2→1.5→1.25 only after TWO consecutive <32 fps windows, ignore windows during camera travel, shadows off at ≤1.5. The dev PC's weak GPU always steps down; that's the guard working, not a bug.

**Mobile nav pattern that looked good:** brand + cart on row 1, a full-width "story-progress" tab strip on row 2 (mono uppercase .66rem labels, active = gold text + 2px underline that scales in, hairline track, 44px min tap height, no pill/blur), top gradient scrim for legibility; `--nav-h` raised to ~108px in the phone media query so zone padding follows. Fits ≥360 px wide; below that the strip scrolls and `scrollIntoView({inline:"center"})` keeps the active tab visible.

**Legibility over a 3D scene:** bottom-aligned copy + a `::before` gradient scrim (bottom 70%, .82→0) on each zone fixed the "text on top of busy geometry" problem far better than shrinking text.

**Cards facing camera:** ring cards rotated by their ring angle show MIRRORED text on the far side (DoubleSide). Set each card's `rotation.y = atan2(camLocal.x-px, camLocal.z-pz)` (camera in the group's local space via `group.worldToLocal`) so every card faces the viewer.

**Mascot "hold" mode:** phone Miniman view stops the spin and eases the model's yaw to face the camera (`target = face + round((angle-face)/TAU)*TAU`, damped), plus a warm PointLight (intensity eased 0→55) so a near-black model reads against a dark room. Verified static by two screenshots 4 s apart.

**Phone-only intro copy:** collapse `.lead` to first 6 words + "…" + faded gold underlined "Show more" (toggles "Show less"). Markup is always split (head/ell/rest/button); CSS collapses only at ≤700 px so desktop is untouched. Skip the overview zone.

**Testing on a real phone over LAN:** `ipconfig` for the IPv4, serve with a no-store server bound to all interfaces, phone on same Wi-Fi. Windows Firewall blocked port 8901 until the user added an inbound rule; the auto-mode classifier BLOCKED me from adding it, so give the user the admin-PowerShell one-liner (`New-NetFirewallRule -DisplayName "..." -Direction Inbound -Protocol TCP -LocalPort 8901 -Action Allow -Profile Private`) and the GUI steps instead of retrying. Real-phone screenshots from the user were the most valuable feedback (found the tab-strip clipping and text-over-scene issues emulation missed).

**Slim deploy folder by request capture:** run Playwright over every zone/panel at desktop + phone sizes, record every same-origin request (`page.on('request')`), copy exactly those files, add `index.html` = the entry page, serve it on another port and re-run asserting no 4xx and no page errors. 36 MB → 9.4 MB / 32 files. Remote assets (Cloudinary, Supabase) don't need copying. Don't delete from the working folder; build a copy. Windows can't rename a folder a running server has as cwd — kill it first. Check for a folder-name collision before naming (see [[feedback-filename-collision]]).

**Shell gotcha:** a long Python/JS heredoc containing `'` sequences inside a Bash tool call can die with "unexpected EOF" and write nothing — write the script to a file with the Write tool and run it, then verify with grep that the patch actually landed.
