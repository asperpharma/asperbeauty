# Asper Beauty Shop: System Monitor & Checklist

**Status:** Active  
**Last Updated:** February 2026  
**Purpose:** Central reference for monitoring the "Digital Concierge" ecosystem, from sales to system health.

---

## 1. Shopify Orders (The Vault)

- **Admin Dashboard:** [Shopify Admin → Orders](https://admin.shopify.com/store/lovable-project-milns/orders) (or your store's admin URL).
- **API connection:**
  - **Endpoint:** `https://lovable-project-milns.myshopify.com/api/2025-01/graphql.json` (Storefront API).
  - **Token type:** Storefront API token (read-only for product/cart; checkout may need appropriate scopes).
  - **Critical scope:** Ensure cart can convert to order (e.g. checkout scope if using custom checkout).
- **Verification:**
  - Check for **Unfulfilled** orders and **Payment Pending** (e.g. COD).

---

## 2. Gorgias (The Concierge Interface)

- **Dashboard:** [Gorgias](https://asperbeauty.gorgias.com) (or your Gorgias URL; access via Shopify Apps if linked).
- **Ticket views:**
  - **Medical / product:** Questions tied to `Concern_*` tags (Dr. Sami persona).
  - **Support / logistics:** Shipping, COD, returns.
- **Automation:**
  - Confirm the **Authenticity Guarantee** macro is active for keywords: `fake`, `original`, `real`.

---

## 3. Chat Logs (The Memory)

- **Location:** Supabase database.
- **Tables:** `public.concierge_profiles`, and `consultations` if migrated.
- **Inspect:**
  - `skin_concern`: Input tag (e.g. Acne, Dryness).
  - `recommended_routine`: JSON with recommended SKUs (e.g. Vichy Normaderm).
- **Access:** Supabase Dashboard → Table Editor.  
  - **Project ref (this repo):** `rgehleqcubtmcwyipyvi` → [Supabase Dashboard](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi/editor).  
  - If you use a different project (e.g. `qqceibvalkoytafynwoc`), open that project's Table Editor.

---

## 4. Beauty Assistant Audit (The Intelligence)

- **Table:** `public.beauty_assistant_audit` (Edge Function audit log).  
  - For a "Daily Digest" style report, use `public.admin_reports` if that table exists in your project.
- **Where to inspect:** Supabase Dashboard → SQL Editor or Table Editor.
- **Example query (audit log):**
  ```sql
  SELECT * FROM beauty_assistant_audit ORDER BY created_at DESC LIMIT 50;
  ```
- **Example query (if you have admin_reports):**
  ```sql
  SELECT * FROM admin_reports ORDER BY created_at DESC;
  ```
- **Useful fields:** `persona_routed`, `response_preview`, `route`, `user_message_length`.

---

## 5. Health URL (The Pulse)

- **Frontend:** `https://www.asperbeautyshop.com` (confirm SSL and that the site loads).
- **Backend (Brain):**
  - **Endpoint:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`  
    (If your project ref is different, e.g. `qqceibvalkoytafynwoc`, replace it in the URL.)
  - **Verification (terminal):**  
    The beauty-assistant expects `message` or `query` in the body. Send a simple POST to get **HTTP 200**:

    **PowerShell:**
    ```powershell
    Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" `
      -Method POST `
      -Headers @{ "Authorization" = "Bearer YOUR_ANON_KEY"; "Content-Type" = "application/json" } `
      -Body '{"message": "Hi"}'
    ```

    **curl (Bash / WSL):**
    ```bash
    curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
      -H "Authorization: Bearer YOUR_ANON_KEY" \
      -H "Content-Type: application/json" \
      -d '{"message": "Hi"}'
    ```
  - **Expected:** HTTP 200 and a JSON body with `reply` (and optionally `persona`, `recommended_products`).

---

## Routine checklists

### Daily "Morning Rounds" (e.g. 9:00 AM)

- [ ] **Orders:** Open Shopify Admin. New COD orders? Mark as Fulfilled once shipped.
- [ ] **Gorgias:** Check Unassigned tickets. Any medical issues escalated by the AI?
- [ ] **Digest:** In Supabase, check `admin_reports` (if present) or `beauty_assistant_audit` for recent volume and top concerns.

### Weekly "Clinical Audit" (e.g. Mondays)

- [ ] **Inventory sync:** Trigger `bulk-product-upload` if new products were added in Shopify (see **docs/NEXT_STEPS.md** and **docs/LAUNCH_EXECUTION_PLAN.md**).
- [ ] **System pulse:** From project root run `.\scripts\health-checks.ps1` (Windows) or `./scripts/health-checks.sh` (Linux/Mac) to verify lint, test, build, and (when reachable) Edge Function URLs.
- [ ] **Tagging:** If using Matrixify/CSV, ensure new products have `Concern_*` and `Step_*` tags (see **docs/SHOPIFY_TAGGING_PROTOCOL.md**).

---

## Related docs

| Doc | Purpose |
|-----|---------|
| **HEALTH_CHECK_PROTOCOL.md** | Build, lint, DB, and Edge Function checks. |
| **NEXT_STEPS.md** | Deployment checklist order and PR template. |
| **LAUNCH_EXECUTION_PLAN.md** | Bulk import, secrets, live-fire tests. |
| **SHOPIFY_TAGGING_PROTOCOL.md** | Concern and step tags for catalog. |
| **BEAUTY_ASSISTANT_DEPLOY.md** | Deploy and test the beauty-assistant. |
