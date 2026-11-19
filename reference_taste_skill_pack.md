---
name: reference-taste-skill-pack
description: "Taste-skill (Leonxlnx) anti-slop frontend skills: 3 dials, brief inference, banned AI defaults; full SKILL files saved in memory/skill-packs/taste-skill/"
metadata:
  node_type: memory
  type: reference
  originSessionId: afbb05ed-3699-4028-b23f-59ad99faa18b
  modified: 2026-10-02T04:59:54.966Z
---

Installed from Downloads (taste-skill-main.zip, 2026-09-30). Full files: `memory/skill-packs/taste-skill/*.md` (taste-skill.md is v2, 87KB; read it before landing-page/portfolio work).

**Variants:** taste-skill (v2 default), taste-skill-v1, gpt-tasteskill (stricter), redesign-skill (audit existing UI first), soft-skill (calm premium), minimalist-skill (Linear/Notion), brutalist-skill, output-skill (stop truncated output), stitch-skill (+DESIGN.md format), image-to-code-skill, imagegen-frontend-web/mobile, brandkit (image-gen only).

**Core method (v2):** state a one-line "Design Read" (page kind / audience / vibe / system) before code; set dials DESIGN_VARIANCE 8, MOTION_INTENSITY 6, VISUAL_DENSITY 4 by default, tuned by brief; one clarifying question max.

**Rules worth remembering:**
- Avoid AI defaults: purple gradients, centered hero on dark mesh, 3 equal cards, Inter+slate, beige/brass "premium" palette, Fraunces/Instrument Serif.
- One accent color locked page-wide; one radius scale; max 1 eyebrow label per 3 sections; no split-header; no 3rd consecutive zigzag image/text section; hero fits viewport (2-line headline, <=20-word subtext, <=4 text elements); `min-h-[100dvh]` not `h-screen`; nav one line, <=80px.
- No duplicate CTA intent; button/form contrast AA; full states (loading/empty/error); Motion `useMotionValue` not `useState` for continuous input.
- Icons: Phosphor/Tabler/Radix, no hand-rolled SVG; real images, not fake-screenshot divs.

**Conflicts with user prefs:** [[feedback-local-assets-preferred]] wins over its "use picsum/gen tool" advice; [[feedback-no-higgsfield]] still bans Higgsfield as the image tool. Related packs: [[reference-emil-skills-pack]], [[reference-design-md-pack]].
