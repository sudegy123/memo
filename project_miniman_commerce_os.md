---
name: project-miniman-commerce-os
description: "Miniman Commerce OS (Supabase backend + on-site checkout + admin console) built in Documents/miniman-main; fully tested locally, NOT yet applied to the real Supabase project"
metadata:
  node_type: memory
  type: project
  originSessionId: 9f19a740-3f88-41bb-abf6-ebdd783a5ef2
  modified: 2026-09-29T00:12:06.043Z
---

Working folder: `C:\Users\DELL\Documents\miniman-main` (copy of `miniman-white-gold`; user said "name it main"; original untouched). Static multi-page site + new backend. User's prompt was a 46-section "Commerce OS" spec (variants, inventory ledger, atomic orders, returns, dashboard, reconciliation, RLS, tests).

**Decisions (user):** brand-NEW Supabase project (NOT the Dr. Mazin / Andoria ones): ref `rksvaloejfsymebwelyj`, URL `https://rksvaloejfsymebwelyj.supabase.co`, publishable key already in `assets/js/config.js` (public). Checkout fully on the site (no WhatsApp ordering), cash on delivery only. User said "upload everything to Supabase later, for now get everything ready".

**Built + verified (2026-09-29):** `backend/migrations/001-006` (schema, `_inv_move` ledger engine, place_order/status machine/payments/returns, admin API, reporting + `admin_reconcile`, RLS/grants), `backend/tools/cli.mjs` (`migrate | seed [--stock N] | admin <email> | status`), `backend/tests` = 43 passing tests on real Postgres (25 buyers/1 pair -> exactly 1 wins, 100-order lifecycle reconciles, security, returns). Storefront: `assets/js/api.js, catalog.js, buyui.js, cart.js` (+ shop.js/pdp.js/main.js patched; colour chips, sold-out sizes, server-side checkout with idempotency, order tracking in cart drawer). Admin: `admin.html` + `assets/js/admin*.js` + `assets/css/admin.css` (dashboard, orders, products/variants, inventory + stock sheet + ledger + reconcile, returns, customers, reports, audit, settings). Browser E2E (Chromium) against real PostgREST: 15 storefront checks, 18 admin checks, stock sheet, offline fallback, phone layout all PASS. Docs: `backend/README.md` (go-live steps, rules, security).

**Test stack trick (reusable):** `backend/dev/stack.mjs` = embedded-postgres + real PostgREST v12 (`backend/dev/bin/postgrest.exe`, from GitHub releases) + fake `/auth/v1/token` gateway on :54321; site opened with `?api=http://localhost:54321` (localhost-only override). Dev admin `admin@miniman.test / test1234`. Site served by scratchpad `serve.py 8920`. GOTCHAS: `node --test tests/` needs a quoted glob on Node 24; Bash heredocs with quotes break (write files with the Write tool); never kill processes with a command-line pattern that appears in your own command (it killed the shell).

**Still pending (blocked on user):** put DB password in `backend/.env` (file exists with `PASTE_PASSWORD_HERE`; host `aws-1-eu-west-1.pooler.supabase.com`), create the admin user in Supabase Auth and give the email, then run `node tools/cli.mjs migrate`, `seed`, `admin <email>`; disable public sign-ups; enter real stock via admin Stock sheet (seed default stock is 0 = everything sold out). User pasted an `sb_secret_...` key in chat: told them to regenerate it; never stored/used. Not tested: real Supabase, Firefox/Safari, real phone, Arabic RTL of the new checkout/admin. Product colour chips are alphabetical (original merch order not preserved).

Related: [[project-miniman-showroom]], [[feedback-ultimate-fix-prompt]] (verification standard), [[feedback-no-higgsfield]].
