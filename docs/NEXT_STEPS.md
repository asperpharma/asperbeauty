# Next Steps - Deployment Checklist

**Purpose:** Standardized deployment checklist and procedures for Asper Beauty Shop.

---

## Pre-Deployment Checklist

### 1. Code Quality

- [ ] All code changes reviewed and approved
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] All console.log statements removed or converted to proper logging

### 2. Testing

- [ ] Manual testing completed on local environment
- [ ] Cart functionality verified
- [ ] Checkout flow tested
- [ ] RTL (Arabic) layout tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### 3. Environment & Configuration

- [ ] Environment variables set correctly in `.env`
- [ ] Supabase project ID matches: `rgehleqcubtmcwyipyvi`
- [ ] Shopify store connected: `lovable-project-milns.myshopify.com`
- [ ] API tokens valid and not expired
- [ ] Secrets configured in Supabase Dashboard (if using Edge Functions)

### 4. Database

- [ ] Migrations applied to Supabase database
- [ ] Required tables exist (`concierge_profiles`, `beauty_assistant_audit`)
- [ ] Database indexes optimized
- [ ] Backup created before major changes

### 5. Content & Products

- [ ] Product catalog synced with Shopify
- [ ] Product images optimized and loading correctly
- [ ] Product tags follow protocol (see SHOPIFY_TAGGING_PROTOCOL.md)
- [ ] All required product fields populated

---

## Deployment Steps

### Step 1: Prepare Branch

```bash
# Ensure you're on the correct branch
git checkout main
git pull origin main

# Create a new feature branch if needed
git checkout -b feature/your-feature-name
```

### Step 2: Run Health Checks

```bash
# Windows
.\scripts\health-checks.ps1

# Linux/Mac
./scripts/health-checks.sh
```

Verify all checks pass before proceeding.

### Step 3: Build Production Bundle

```bash
npm run build
```

Check `dist/` directory to ensure assets are generated correctly.

### Step 4: Deploy to Lovable

Lovable automatically deploys when you push to the connected branch (usually `main`).

```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

### Step 5: Verify Deployment

1. Visit production URL: https://asperbeautyshop.lovable.app
2. Check browser console for errors
3. Test critical user flows:
   - Browse products
   - Search functionality
   - Add to cart
   - View cart
   - Language switching
4. Verify SSL certificate is valid

### Step 6: Deploy Edge Functions (if changed)

If you modified Supabase Edge Functions:

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref rgehleqcubtmcwyipyvi

# Deploy all functions
supabase functions deploy

# Or deploy a specific function
supabase functions deploy beauty-assistant
```

Verify Edge Functions in Supabase Dashboard → Edge Functions → Logs.

### Step 7: Post-Deployment Verification

- [ ] Frontend loads without errors
- [ ] Product data displays correctly
- [ ] Shopping cart works
- [ ] Language switching works (EN/AR)
- [ ] Mobile layout is responsive
- [ ] Edge Functions respond correctly (if changed)
- [ ] No errors in browser console
- [ ] Performance is acceptable (< 3s page load)

### Step 8: Monitor

- Check Supabase logs for Edge Function errors
- Monitor `beauty_assistant_audit` table for unusual activity
- Review Shopify orders for any issues
- Check Gorgias for customer support tickets

---

## Rollback Procedure

If issues are discovered after deployment:

### Option 1: Quick Fix

```bash
# Make the fix
git checkout main
git checkout -b hotfix/issue-description

# Make changes, test locally
npm run build

# Commit and push
git add .
git commit -m "fix: description of fix"
git push origin hotfix/issue-description

# Create PR, get approved, merge to main
```

### Option 2: Revert

```bash
# Find the commit to revert to
git log --oneline

# Revert to previous working commit
git revert <commit-hash>
git push origin main
```

### Option 3: Rollback Edge Functions

```bash
# If an Edge Function is causing issues, redeploy previous version
git checkout <previous-commit>
supabase functions deploy <function-name>
git checkout main
```

---

## Pull Request Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style guidelines
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Tested locally
- [ ] RTL layout tested (if UI changes)
- [ ] Mobile responsive (if UI changes)
- [ ] Documentation updated (if needed)
- [ ] Environment variables documented (if added)

## Testing
Describe testing done:
- [ ] Manual testing
- [ ] Tested on mobile
- [ ] Tested in Arabic (RTL) mode

## Screenshots
Include screenshots for UI changes

## Related Issues
Closes #issue_number
```

---

## Deployment Schedule

### Regular Deployments
- **Frequency:** As needed for bug fixes and features
- **Best Time:** Low-traffic hours (e.g., 2-4 AM local time)
- **Required Approvals:** 1 code review minimum

### Hotfix Deployments
- **Urgency:** Deploy immediately for critical issues
- **Process:** Expedited review, test in production-like environment
- **Notification:** Alert team via Slack/email

### Major Releases
- **Frequency:** Monthly or as needed
- **Preparation:** 
  - Full regression testing
  - Staging environment validation
  - Performance testing
  - Security audit
- **Required Approvals:** 2+ code reviews
- **Communication:** Notify stakeholders 24 hours in advance

---

## Post-Deployment Tasks

### Immediate (Within 1 hour)
- [ ] Verify deployment successful
- [ ] Check error logs
- [ ] Test critical user flows
- [ ] Monitor Edge Function performance

### Short-term (Within 24 hours)
- [ ] Review metrics (page views, errors, performance)
- [ ] Check for user-reported issues
- [ ] Verify database performance
- [ ] Review Shopify order processing

### Long-term (Within 1 week)
- [ ] Analyze user behavior changes
- [ ] Review Edge Function usage patterns
- [ ] Check for performance regressions
- [ ] Update documentation if needed

---

## Related Documentation

- [System Monitor](./SYSTEM_MONITOR.md) - System monitoring procedures
- [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md) - Health check procedures
- [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md) - Launch procedures
- [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md) - Edge Function deployment
