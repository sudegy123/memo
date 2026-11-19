---
name: reference-vercel-agent-skills-pack
description: "Vercel agent-skills: React/Next perf rules, web-design-guidelines audit, composition patterns, view transitions, deploy/optimize; saved in memory/skill-packs/vercel-agent-skills/"
metadata:
  node_type: memory
  type: reference
  originSessionId: afbb05ed-3699-4028-b23f-59ad99faa18b
  modified: 2026-10-02T04:59:58.552Z
---

From agent-skills-main.zip (vercel-labs/agent-skills). Files: `memory/skill-packs/vercel-agent-skills/*.md` plus `react-best-practices-rules/` (40+ rule files).

- react-best-practices: 40+ rules by impact: eliminate waterfalls, bundle size (critical), server perf, client fetching, re-renders, rendering, JS micro-opts.
- web-design-guidelines: audit UI code for a11y/focus/forms/animation/typography/perf rules; fetches live rules from `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, outputs terse `file:line` findings.
- composition-patterns (compound components, avoid boolean props), react-view-transitions, react-native-skills, writing-guidelines (docs voice, no em dashes), deploy-to-vercel, vercel-cli-with-tokens, vercel-optimize (cost/perf audit from Vercel metrics).

Use for React/Next builds or UI audits. Related: [[reference-emil-skills-pack]], [[reference-web-perf-optimization-prompt]].
