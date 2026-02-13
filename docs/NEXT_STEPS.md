# Next Steps: Deployment Checklist

**Purpose:** Step-by-step deployment guide and PR template for Asper Beauty Shop updates.

---

## Pre-Deployment Checklist

Before deploying any changes to production, ensure all of the following are completed:

### Code Quality
- [ ] All TypeScript errors resolved (`npx tsc --noEmit`)
- [ ] ESLint passes with no errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Code has been reviewed (self-review at minimum)

### Testing
- [ ] Manual testing completed in development environment
- [ ] All affected pages/components tested
- [ ] Mobile responsiveness verified (375px, 768px, 1024px+)
- [ ] RTL/Arabic mode tested (if applicable)
- [ ] Browser console shows no errors

### Documentation
- [ ] Code changes are documented (if needed)
- [ ] README updated (if user-facing changes)
- [ ] API changes documented (if backend changes)

---

## Deployment Order

Follow this order when deploying changes:

### 1. Database Changes (if any)
```bash
# Run migrations first
cd supabase
supabase db push

# Verify migrations applied successfully
# Check Supabase Dashboard → Database → Migrations
```

### 2. Edge Functions (if any)
```bash
# Deploy specific function
supabase functions deploy beauty-assistant

# Or deploy all functions
supabase functions deploy

# Verify deployment in Supabase Dashboard → Edge Functions
```

### 3. Frontend Changes
```bash
# Create production build
npm run build

# Preview build locally (optional)
npm run preview

# Deploy via Lovable platform or push to main branch
# Changes will auto-deploy if CI/CD is configured
```

---

## Pull Request Template

Use this template when creating PRs:

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring
- [ ] Dependency update

## Changes Made
- [List specific changes]
- [Include file paths when relevant]

## Testing Completed
- [ ] Local development testing
- [ ] Production build tested
- [ ] Mobile/responsive testing
- [ ] RTL/Arabic mode testing (if UI changes)
- [ ] Browser compatibility checked

## Screenshots (if UI changes)
[Add screenshots here]

## Database Changes
- [ ] No database changes
- [ ] Migrations included and tested
- [ ] Backwards compatible

## Edge Function Changes
- [ ] No Edge Function changes
- [ ] Functions deployed and tested
- [ ] Environment variables documented

## Related Issues
Closes #[issue-number]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings in console
- [ ] Tested on multiple browsers
- [ ] Ready for production deployment
```

---

## Post-Deployment Verification

After deployment, verify the following:

### Immediate Checks (within 5 minutes)
- [ ] Production site loads: `https://asperbeautyshop.lovable.app`
- [ ] No JavaScript errors in browser console
- [ ] Navigation works correctly
- [ ] Changed features work as expected

### Health Checks (within 1 hour)
- [ ] Run health check script: `.\scripts\health-checks.ps1`
- [ ] Check Edge Function logs in Supabase Dashboard
- [ ] Monitor for any error spikes in logs
- [ ] Verify Shopify integration still works

### Monitoring (within 24 hours)
- [ ] Check `beauty_assistant_audit` table for issues
- [ ] Review Gorgias tickets for user reports
- [ ] Monitor Shopify orders for disruptions
- [ ] Check analytics for traffic/conversion anomalies

---

## Rollback Procedure

If critical issues are detected after deployment:

### Frontend Rollback
```bash
# If using git-based deployment
git revert [commit-hash]
git push origin main

# If using Lovable platform
# Use Lovable dashboard to restore previous version
```

### Database Rollback
```bash
# Use Supabase migrations to roll back
supabase db reset

# Or manually run down migrations
supabase migration down
```

### Edge Function Rollback
```bash
# Redeploy previous version from git
git checkout [previous-commit]
supabase functions deploy [function-name]
git checkout main
```

---

## Environment Configuration

### Required Environment Variables

#### Frontend (.env)
```env
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token
VITE_SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
```

#### Edge Functions (Supabase Secrets)
```bash
# Set secrets via Supabase CLI
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set SHOPIFY_ADMIN_TOKEN=your_token
supabase secrets set SHOPIFY_STORE_DOMAIN=your_domain
```

---

## CI/CD Pipeline (if configured)

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
      - name: Deploy
        run: |
          # Deploy command here
```

---

## Release Notes Template

When creating a release, use this format:

```markdown
# Release v[version] - [Date]

## 🎉 New Features
- [Feature 1]
- [Feature 2]

## 🐛 Bug Fixes
- [Bug fix 1]
- [Bug fix 2]

## 🔧 Improvements
- [Improvement 1]
- [Improvement 2]

## 📚 Documentation
- [Doc update 1]

## ⚠️ Breaking Changes
- [Breaking change if any]

## 🔄 Migration Steps
[If any migrations are needed]
```

---

## Contact & Support

- **Technical Issues:** Check logs in Supabase Dashboard
- **Deployment Issues:** Review this guide or contact DevOps team
- **Emergency:** Follow rollback procedure immediately

---

## Related Documentation
- [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) - Monitoring guide
- [HEALTH-CHECK-PROTOCOL.md](./HEALTH-CHECK-PROTOCOL.md) - Health checks
- [LAUNCH_EXECUTION_PLAN.md](./LAUNCH_EXECUTION_PLAN.md) - Launch planning
