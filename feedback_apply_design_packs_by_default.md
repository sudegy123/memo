---
name: feedback-apply-design-packs-by-default
description: "On EVERY website/UI build or edit, silently apply the taste/Emil/Apple/DESIGN.md rules; user wants them used, not summarized. Contains the working checklist + conflict rules"
metadata:
  node_type: memory
  type: feedback
  originSessionId: afbb05ed-3699-4028-b23f-59ad99faa18b
  modified: 2026-10-02T05:06:59.062Z
---

User installed the skill packs ([[reference-taste-skill-pack]], [[reference-emil-skills-pack]], [[reference-design-md-pack]], [[reference-vercel-agent-skills-pack]]) so I APPLY them to every site we make, without being asked and without explaining them. Full read completed 2026-10-02 (main taste-skill, all taste variants, 9 Emil skills, Vercel react rules list; brand DESIGN.md files are read on demand).

**Why:** user said "I don't need details, I need you to learn to apply to our websites." Goal is better-looking output, not reports.

**Checklist (silent, before shipping any page):**
1. One-line Design Read, then build. If user names a brand/vibe, read `memory/skill-packs/design-md/<brand>.md` (YAML tokens: colors/typography/rounded/spacing/components + prose) and build to its tokens. Dials default VARIANCE 8 / MOTION 6 / DENSITY 4, tuned by brief; picked variants: soft (premium), minimalist (Linear/Notion), brutalist (industrial/Swiss), redesign (existing site: audit first, keep IA/slugs/nav labels/logo/form fields).
2. Layout: hero fits one viewport (headline <=2 lines, subtext <=20 words, <=4 text elements, one primary CTA, no trust strip/tagline in hero); no centered-hero-on-dark-mesh; no 3 equal feature cards; section layouts differ (>=4 families per 8 sections); max 2 zigzags; bento has exact cell count (`grid-flow-dense`); one accent, one radius system, one theme (no light/dark section flips); nav one line <=80px; `100dvh`/`svh` not `100vh`; mobile collapse per section.
3. Copy/AI-tells (hard bans): ZERO em/en dashes anywhere; no scroll cues ("Scroll to explore"); no section-number eyebrows ("01 / About"); eyebrows <=1 per 3 sections; no version labels/footers, locale-time strips, decorative status dots, pills over images, fake photo credits, div-fake-screenshots, hand-rolled SVG icons; no "Elevate/Seamless/Unleash"; no John Doe/Acme/99.99%; <=1 marquee per page; one label per CTA intent; self-audit every visible string for broken/AI-sounding copy.
4. Motion: only if motivated (hierarchy/story/feedback/state); never on 100+/day or keyboard actions; ease-out custom curves `cubic-bezier(0.23,1,0.32,1)` (in-out `(0.77,0,0.175,1)`, drawer `(0.32,0.72,0,1)`), UI <300ms; `:active scale(.97)`; never `scale(0)`; popovers origin-aware (modals centered); transform/opacity only; transitions not keyframes for interruptible UI; springs for gestures with velocity handoff; exit faster than enter; stagger 30-80ms; `(hover:hover) and (pointer:fine)` gating; prefers-reduced-motion = gentler not zero; reduced-transparency/contrast fallbacks for glass.
5. Mobile-native baseline (any phone-facing page): `viewport-fit=cover`, `-webkit-tap-highlight-color:transparent`, inputs 16px (never disable zoom), `touch-action:manipulation` on controls, `overscroll-behavior`, `env(safe-area-inset-*)`, `user-select:none` on controls only, `theme-color` per scheme, test on real phone (see [[feedback-mobile-css-cache-busting]]).
6. Quality gates: button/form contrast AA, loading/empty/error states (skeletons not spinners; Dr. Mazin uses gold breathing light), dark+light tested, Core Web Vitals plausible.

**Conflicts: user's established patterns WIN over pack rules.**
- Custom cursors, scroll-lerp from `scrollY` in rAF, marquees, scroll-as-timeline are accepted in our WebGL/cinematic heroes (taste-skill bans them for React marketing pages). Use packs' bans for conventional marketing/shop pages; keep our 3D techniques for cinematic ones.
- Self-host assets ([[feedback-local-assets-preferred]]); never picsum/hotlinks/Higgsfield ([[feedback-no-higgsfield]]); Andoria palette is forest green + gold only, no blue/purple ([[reference-solar-andoria-docs]]).
- Taste-skill's "beige/brass palette ban" and "no serif default" apply to NEW premium-consumer concepts, not to Dr. Mazin (obsidian + gold) or Miniman (white + gold), which have their own systems.
- Real-browser verification before "done" ([[feedback-ultimate-fix-prompt]]), and state what was not tested.
