---
name: reference-emil-skills-pack
description: "Emil Kowalski skills (animation/design-engineering rules, review table format, mobile-native fixes); full files in memory/skill-packs/emil-skills/"
metadata:
  node_type: memory
  type: reference
  originSessionId: afbb05ed-3699-4028-b23f-59ad99faa18b
  modified: 2026-10-02T04:59:56.119Z
---

From skills-main.zip (emilkowalski/skills). Full files: `memory/skill-packs/emil-skills/*.md`: emil-design-eng (main), animate, animate-expo, review-animations, improve-animations, find-animation-opportunities, animation-vocabulary, apple-design, mobile-native, pick-ui-library, prototype, ask-sonner, write-swift.

**Key rules (emil-design-eng):**
- Decide first whether to animate: 100+/day or keyboard-initiated = none; tens/day = minimal; occasional = standard.
- Easing: entering/exiting = ease-out with custom curves (`cubic-bezier(0.23,1,0.32,1)`, in-out `(0.77,0,0.175,1)`, drawer `(0.32,0.72,0,1)`); never ease-in on UI. UI under 300ms.
- Buttons `:active scale(0.97)`; never animate from `scale(0)` (use 0.95 + opacity); popovers origin-aware, modals centered; no `transition: all`.
- Transitions beat keyframes for interruptible UI; animate only transform/opacity; CSS/WAAPI beat JS under load; Framer `x/y` shorthand is not GPU accelerated.
- Hover effects gated by `@media (hover:hover) and (pointer:fine)`; honor prefers-reduced-motion (gentler, not zero); stagger 30-80ms; exit faster than enter; blur(<=2px) can mask crossfades.
- Reviews MUST be a markdown table with Before | After | Why columns.
- If the skill is invoked bare, reply only with its one-line ready message.

Pairs with the perf/glitch notes in [[feedback-ultimate-fix-prompt]] and [[reference-taste-skill-pack]].
