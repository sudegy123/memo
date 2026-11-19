---
name: project-andoria-website
description: "Andoria Sudan multi-page site (industrial engines, solar, milling equipment) — location, structure, and backend"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3f4a22cf-2ee3-404b-9efc-5a2212eae6a0
  modified: 2026-09-18T18:39:51.529Z
---

Andoria Sudan is a multi-page marketing/e-commerce-ish website for an industrial equipment supplier (engines, solar power, milling/machinery), built together with the user. Located at `C:\Users\DELL\Documents\andoria-website`.

**Why:** company sells industrial engines, solar power systems, and milling equipment in Sudan; site covers product catalog, machinery, a solar sizing calculator, and company/contact info. There's a Baladna branding tie-in (logo files present).

**Structure:**
- Pages: `index.html`, `products.html`, `machinery.html`, `solar.html`, `about.html`, `contact.html` — plain HTML/CSS/JS (`styles.css`, `script.js`), no framework.
- `calculator/` — a separate "Solar Smart Advisor" app (`app.html`, `index.html`, `welcome-v2.css`) with its own UX audit report and "Phase 9 Enterprise Architecture" doc (docx) — suggests this calculator has gone through several iterations/phases.
- `supabase/` — backend: SQL migrations (`catalog_migration.sql`, `catalog_phase4_addendum.sql`, `contact_schema.sql`, `orders_schema.sql`, `supabase_migration.sql`) and Node/Python scripts to build and generate the product catalog (`build_catalog.py`, `generate_catalog_sql.py`, `extract_content.js`, `generate_sql.js`, `run_sql.js`).
- `assets/` — logos (Andoria, Baladna), category images, hero image.
- Root docs: `Andoria_Master_Product_Catalog_No_Prices.xlsx` (product catalog source data) and `Andoria_Website_Implementation_Brief.pdf` (original project brief/spec).

**How to apply:** When picking up Andoria work, check `Andoria_Website_Implementation_Brief.pdf` for original scope, and the `supabase/` SQL files for current schema/catalog phase before making backend changes. The calculator has separate phase-numbered docs — check the latest phase doc before assuming its current state. Product data source of truth is likely the master catalog xlsx unless supabase has since diverged.
