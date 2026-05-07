# Deployment Flow Documentation

## Overview

This document describes the deployment workflow for Asper Beauty Shop, including the integration between GitHub, Lovable, and various deployment platforms.

## Deployment Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   GitHub    │ ────▶│   Lovable   │ ────▶│  Production │
│ Repository  │      │   Platform  │      │   Hosting   │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Deployment Workflow

### 1. Local Development → GitHub

#### Step 1: Make Changes Locally
```bash
# Navigate to project directory
cd /path/to/asperbeauty

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Stage and commit changes
git add .
git commit -m "feat: your descriptive commit message"
```

#### Step 2: Push to GitHub
```bash
# Push your feature branch to GitHub
git push origin feature/your-feature-name
```

**If authentication is required:**
```bash
# Git will prompt for credentials
# You can use:
# - GitHub Personal Access Token
# - GitHub CLI (gh auth login)
# - SSH Key authentication
```

### 2. GitHub → Lovable Sync

Lovable automatically syncs with GitHub in the following scenarios:

#### Automatic Sync Triggers
1. **Merge to Main Branch**
   - When a PR is merged into `main`
   - Lovable detects the change and pulls updates
   - Changes are deployed to production

2. **Branch Sync** (if configured)
   - Lovable can be configured to sync from specific branches
   - Check Lovable dashboard settings for branch configuration

#### Manual Sync
If automatic sync doesn't trigger:
1. Open Lovable dashboard
2. Navigate to your project
3. Click "Sync from GitHub"
4. Select the branch to sync from

### 3. Creating Pull Requests

#### From Feature Branch to Main

**Via GitHub Web Interface:**
1. Go to https://github.com/asperpharma/asperbeauty
2. Click "Pull requests" → "New pull request"
3. Set base: `main` ← compare: `your-feature-branch`
4. Fill in PR details:
   - Title: Clear description of changes
   - Description: What, why, and how
   - Link related issues
5. Create pull request
6. Wait for reviews and CI checks
7. Merge when approved

**Via GitHub CLI:**
```bash
# Create PR from current branch
gh pr create --base main --title "Your PR title" --body "Description"

# View PR status
gh pr status

# Merge PR
gh pr merge --squash
```

### 4. Deployment Environments

#### Development Environment
- **URL**: Local development server
- **Command**: `npm run dev`
- **Port**: 5173 (default Vite port)
- **Hot Reload**: Enabled

#### Staging/Preview (Lovable)
- **URL**: Custom Lovable preview URL
- **Trigger**: Push to configured branch
- **Purpose**: Testing before production

#### Production
- **URL**: https://asperbeautyshop.lovable.app
- **Trigger**: Merge to `main` branch
- **CDN**: Lovable's edge network

## Continuous Integration/Deployment

### GitHub Actions Workflows

The project uses several GitHub Actions workflows:

1. **CodeQL Security Analysis** (`codeql.yml`)
   - Scans for security vulnerabilities
   - Runs on push and PR to main

2. **Oxygen Deployment Workflows**
   - Multiple deployment configurations
   - See `.github/workflows/oxygen-deployment-*.yml`

3. **Datadog Synthetics** (`datadog-synthetics.yml`)
   - Monitors application health
   - Runs synthetic tests

### CI/CD Best Practices

#### Before Pushing Changes
```bash
# Run linter
npm run lint

# Build the project
npm run build

# Preview production build
npm run preview
```

#### Automated Checks
- ✅ TypeScript compilation
- ✅ ESLint validation
- ✅ Build success
- ✅ Security scans (CodeQL)

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass locally
- [ ] Code builds without errors
- [ ] Linter passes
- [ ] TypeScript compiles
- [ ] Changes reviewed and approved
- [ ] Documentation updated

### Deployment Steps
- [ ] Merge PR to main
- [ ] Verify Lovable sync completed
- [ ] Check production URL
- [ ] Verify functionality works
- [ ] Monitor error logs

### Post-Deployment
- [ ] Test critical user flows
- [ ] Check analytics/monitoring
- [ ] Verify mobile responsiveness
- [ ] Test RTL (Arabic) layout
- [ ] Monitor performance metrics

## Rollback Procedures

### Quick Rollback
If issues are detected in production:

1. **Revert via Git**
   ```bash
   # Find the commit to revert
   git log --oneline

   # Revert the problematic commit
   git revert <commit-hash>

   # Push to main
   git push origin main
   ```

2. **Lovable will auto-sync** the revert

### Emergency Rollback
For critical issues:
1. Contact Lovable support
2. Request immediate rollback to previous version
3. Fix issues in development
4. Redeploy when ready

## Environment Variables

### Required Variables
- `VITE_SHOPIFY_STOREFRONT_TOKEN` - Shopify API token
- `VITE_SHOPIFY_STORE_DOMAIN` - Store domain
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Configuration
Set environment variables in:
- **Local**: `.env` file (not committed)
- **Lovable**: Dashboard → Settings → Environment Variables
- **CI/CD**: GitHub Secrets

## Monitoring & Observability

### Health Check Endpoints
See [HEALTH_CHECK.md](./HEALTH_CHECK.md) for detailed health check documentation.

### Monitoring Tools
- **Datadog**: Application performance monitoring
- **Lovable Dashboard**: Deployment status and logs
- **GitHub Actions**: CI/CD pipeline status

## Troubleshooting

### Issue: Push Requires Authentication

**Solution:**
```bash
# Configure Git credentials
git config --global credential.helper store

# Or use GitHub CLI
gh auth login

# Or use SSH
git remote set-url origin git@github.com:asperpharma/asperbeauty.git
```

### Issue: Lovable Not Syncing

**Possible causes:**
1. Branch not configured for sync
2. Merge conflict
3. Lovable service issue

**Solutions:**
1. Check Lovable dashboard settings
2. Verify branch name matches configuration
3. Try manual sync from Lovable dashboard
4. Contact Lovable support

### Issue: Build Fails on Lovable

**Debugging steps:**
1. Check Lovable deployment logs
2. Verify environment variables are set
3. Test build locally: `npm run build`
4. Check for missing dependencies
5. Review recent commits for breaking changes

## Best Practices

### Git Workflow
1. Keep commits atomic and focused
2. Write descriptive commit messages
3. Use conventional commit format
4. Keep main branch stable
5. Delete branches after merge

### Code Review
1. Review code before requesting review
2. Respond to feedback promptly
3. Test changes thoroughly
4. Update documentation
5. Keep PRs reasonably sized

### Deployment
1. Deploy during low-traffic periods
2. Monitor after deployment
3. Have rollback plan ready
4. Communicate with team
5. Document any issues

## Support & Resources

- **GitHub Repository**: https://github.com/asperpharma/asperbeauty
- **Lovable Documentation**: https://docs.lovable.dev
- **Team Communication**: [Your team channel]
- **Issue Tracking**: GitHub Issues

---

**Last Updated**: 2026-02-14
**Maintained By**: Asper Pharma Team
