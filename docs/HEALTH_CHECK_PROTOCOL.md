# Health Check Protocol

**Purpose:** Automated checks for build, lint, database, and Edge Function health.

---

## Overview

This document describes the health check procedures for the Asper Beauty Shop system. Run these checks regularly to ensure all components are functioning correctly.

---

## Automated Health Checks

### Running Health Checks

**Windows (PowerShell):**
```powershell
.\scripts\health-checks.ps1
```

**Linux/Mac (Bash):**
```bash
./scripts/health-checks.sh
```

The health check script performs the following checks:

---

## 1. Build Check

**Purpose:** Verify the frontend application builds without errors.

**Command:**
```bash
npm run build
```

**Success criteria:**
- ✅ Exit code 0
- ✅ No TypeScript errors
- ✅ Build artifacts created in `dist/` directory

**Common issues:**
- TypeScript compilation errors
- Missing dependencies
- Invalid imports

---

## 2. Lint Check

**Purpose:** Ensure code follows style guidelines and catches potential bugs.

**Command:**
```bash
npm run lint
```

**Success criteria:**
- ✅ Exit code 0
- ✅ No linting errors
- ⚠️ Warnings are acceptable but should be reviewed

**Common issues:**
- Unused variables
- Missing type annotations
- Style violations

---

## 3. Database Health (Supabase)

**Purpose:** Verify database connectivity and check for recent activity.

**Manual checks:**
1. Visit [Supabase Dashboard](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi)
2. Check **Database** → **Tables**
3. Verify key tables exist:
   - `concierge_profiles`
   - `beauty_assistant_audit`
   - `consultations` (if migrated)
4. Check **SQL Editor** and run:
   ```sql
   SELECT COUNT(*) as total_chats FROM beauty_assistant_audit WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

**Success criteria:**
- ✅ Database is accessible
- ✅ Tables exist and contain data
- ✅ Recent activity in audit logs

---

## 4. Edge Functions Health

### Beauty Assistant Function

**Endpoint:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`

**Test command (curl):**
```bash
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'
```

**Success criteria:**
- ✅ HTTP 200 status
- ✅ JSON response with `reply` field
- ✅ Response time < 5 seconds

### Other Edge Functions

- **bulk-product-upload:** Used for syncing products from Shopify
- **create-cod-order:** Creates cash-on-delivery orders
- **get-order-status:** Retrieves order status from Shopify

Check function logs in Supabase Dashboard → **Edge Functions** → Select function → **Logs**.

---

## 5. Frontend Health

**URL:** https://asperbeautyshop.lovable.app

**Manual checks:**
1. Open the site in a browser
2. Verify SSL certificate (HTTPS)
3. Check homepage loads correctly
4. Test navigation (header, footer links)
5. Test product search and filtering
6. Test cart functionality
7. Test language switching (EN/AR)
8. Verify RTL layout works in Arabic mode

**Success criteria:**
- ✅ Site loads without errors
- ✅ All images load correctly
- ✅ No console errors in browser DevTools
- ✅ Cart persists across page reloads
- ✅ RTL layout displays correctly

---

## 6. Shopify Integration

**Admin URL:** https://admin.shopify.com/store/lovable-project-milns

**Manual checks:**
1. Verify products are synced
2. Check inventory levels
3. Test checkout flow (create test order)
4. Verify webhooks are active

**API health check:**
```bash
curl -X POST "https://lovable-project-milns.myshopify.com/api/2025-01/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query": "{shop{name}}"}'
```

**Success criteria:**
- ✅ API responds with shop name
- ✅ Products are accessible via Storefront API
- ✅ Checkout creates orders successfully

---

## Health Check Schedule

### Daily
- Run automated health checks (build, lint)
- Check frontend loads correctly
- Review Edge Function logs for errors

### Weekly
- Full system health check (all components)
- Review Shopify product sync
- Check database for anomalies
- Test critical user flows (search, cart, checkout)

### Monthly
- Review and update health check scripts
- Audit security and dependencies
- Performance testing
- Review and archive old logs

---

## Troubleshooting

### Build Failures
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check for TypeScript errors: `npx tsc --noEmit`

### Lint Failures
1. Run auto-fix: `npm run lint -- --fix`
2. Review and manually fix remaining issues
3. Update ESLint config if rules are outdated

### Database Issues
1. Check Supabase project status
2. Review recent migrations
3. Check API keys are valid
4. Review connection pool settings

### Edge Function Failures
1. Check function logs in Supabase Dashboard
2. Verify environment variables are set
3. Test locally with Supabase CLI: `supabase functions serve`
4. Review function code for errors

### Frontend Issues
1. Check browser console for errors
2. Clear browser cache and cookies
3. Test in incognito mode
4. Check network tab for failed requests
5. Verify environment variables in `.env`

---

## Related Documentation

- [System Monitor](./SYSTEM_MONITOR.md) - Overall system monitoring
- [Next Steps](./NEXT_STEPS.md) - Deployment procedures
- [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md) - Edge Function deployment
