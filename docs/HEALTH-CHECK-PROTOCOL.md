# Health Check Protocol

**Purpose:** Automated and manual checks to verify system health for the Asper Beauty Shop ecosystem.

---

## Overview

This protocol outlines the health checks to be performed regularly to ensure all components of the Digital Concierge are functioning correctly. These checks cover frontend build, code quality, database connections, and Edge Function availability.

---

## 1. Frontend Build & Lint Checks

### Build Verification
```bash
# Production build
npm run build

# Expected: Build succeeds with no errors
# Output: dist/ folder created with optimized assets
```

### Linting
```bash
# Run ESLint
npm run lint

# Expected: No errors (warnings are acceptable but should be reviewed)
```

### TypeScript Type Checking
```bash
# Verify TypeScript compilation
npx tsc --noEmit

# Expected: No type errors
```

---

## 2. Database Health (Supabase)

### Connection Test
- **URL:** `https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi`
- **Check:**
  - Login to Supabase Dashboard
  - Navigate to Table Editor
  - Verify tables are accessible:
    - `public.concierge_profiles`
    - `public.beauty_assistant_audit`
    - `public.products` (if applicable)

### Query Test
```sql
-- Test basic query
SELECT COUNT(*) FROM beauty_assistant_audit 
WHERE created_at > NOW() - INTERVAL '7 days';

-- Expected: Returns count without errors
```

---

## 3. Edge Functions Health

### Beauty Assistant Function
```bash
# Test with curl (replace YOUR_ANON_KEY with actual key)
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "test health check"}'

# Expected: HTTP 200
# Response should include: {"reply": "...", "persona": "..."}
```

### Bulk Product Upload Function
```bash
# Test function availability
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Expected: HTTP 200 or appropriate response
```

---

## 4. Frontend Health

### Production Site
- **URL:** `https://asperbeautyshop.lovable.app`
- **Checks:**
  - [ ] Site loads without errors
  - [ ] SSL certificate is valid
  - [ ] No console errors in browser DevTools
  - [ ] Navigation works (browse products, cart)
  - [ ] Search functionality works
  - [ ] RTL/Arabic mode works correctly

### Development Server
```bash
# Start dev server
npm run dev

# Expected: Server starts on http://localhost:5173
# No errors in terminal
```

---

## 5. Shopify Integration

### Storefront API
```bash
# Test GraphQL endpoint (replace with your store and token)
curl -X POST \
  "https://lovable-project-milns.myshopify.com/api/2025-01/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query": "{ shop { name } }"}'

# Expected: Returns shop name in JSON response
```

---

## 6. Automated Health Check Script

The `scripts/health-checks.ps1` script automates many of these checks:

```powershell
# Run from project root
.\scripts\health-checks.ps1

# The script will:
# 1. Run npm run lint
# 2. Run npm run build
# 3. Test Edge Function endpoints (if configured)
# 4. Report results
```

---

## Health Check Schedule

| Check | Frequency | Automated |
|-------|-----------|-----------|
| Build & Lint | On commit (CI) | Yes |
| TypeScript | On commit (CI) | Yes |
| Database Connection | Daily | Manual |
| Edge Functions | Daily | Semi-automated |
| Frontend Health | Daily | Manual |
| Full System Audit | Weekly | Manual |

---

## Alerting

### Critical Issues (Immediate Action Required)
- Frontend build fails
- Database connection lost
- Edge Functions return 500 errors
- Production site down

### Warning Issues (Review within 24 hours)
- Lint errors introduced
- TypeScript warnings
- Slow response times (>2s for Edge Functions)
- Database query performance degradation

---

## Troubleshooting

### Build Fails
1. Check Node.js version (should be 18+)
2. Clear cache: `rm -rf node_modules dist && npm install`
3. Check for dependency conflicts in package-lock.json

### Database Connection Issues
1. Verify Supabase project is active
2. Check API keys in environment variables
3. Verify database migrations are up to date

### Edge Function Errors
1. Check function logs in Supabase Dashboard
2. Verify environment variables are set
3. Test function locally with Supabase CLI

---

## Related Documentation
- [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) - Overall monitoring guide
- [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md) - Edge Function deployment
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Deployment checklist
