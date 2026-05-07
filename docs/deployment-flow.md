# Deployment Flow

This document describes the deployment architecture and workflow for Asper Beauty Shop.

## Overview

Asper Beauty Shop uses a modern deployment setup with multiple pathways for continuous deployment and integration with external services.

## Deployment Architecture

```
┌─────────────────┐
│  GitHub Repo    │
│  (main branch)  │
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Lovable Platform│ │ Shopify Oxygen  │ │ GitHub Actions  │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Production Site │ │ Oxygen Hosting  │ │  CI/CD Checks   │
│ lovable.app     │ │  (Alternative)  │ │  (CodeQL, etc)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Deployment Platforms

### 1. Lovable Platform (Primary)

**Live URL**: [https://asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app)

Lovable is the primary deployment platform for this project. It provides:

- **Automatic Deployments**: Pushes to the main branch trigger automatic deployments
- **Preview Deployments**: Pull requests get preview URLs for testing
- **Bi-directional Sync**: Changes made in Lovable IDE sync to GitHub and vice versa
- **Instant Rollback**: Easy rollback to previous deployments
- **Built-in CDN**: Global content delivery for optimal performance

#### Deployment Trigger
- **Automatic**: Every push to `main` branch
- **Manual**: Via Lovable dashboard

#### Build Process
1. Lovable detects changes in GitHub repository
2. Runs `npm install` to install dependencies
3. Executes `npm run build` to create production bundle
4. Deploys static assets to Lovable CDN
5. Updates live site automatically

### 2. Shopify Oxygen (Alternative)

Shopify Oxygen is configured as an alternative deployment option for potential Hydrogen integration.

**Workflow Files**:
- `.github/workflows/oxygen-deployment-1000092382.yml`
- `.github/workflows/oxygen-deployment-1000093253.yml`
- `.github/workflows/oxygen-deployment-1000093759.yml`

#### Configuration

```yaml
name: Deploy to Oxygen
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js (LTS)
      - Cache node modules
      - Install dependencies (npm ci)
      - Build and deploy (npx shopify hydrogen deploy)
```

#### Required Secrets
- `OXYGEN_DEPLOYMENT_TOKEN_1000092382`
- `OXYGEN_DEPLOYMENT_TOKEN_1000093253`
- `OXYGEN_DEPLOYMENT_TOKEN_1000093759`

> **Note**: These Oxygen deployments are currently configured but may not be actively used if Lovable is the primary platform.

## Environment Configuration

### Environment Variables

The application requires the following environment variables (stored in `.env`):

#### Supabase Configuration
```env
VITE_SUPABASE_PROJECT_ID="rgehleqcubtmcwyipyvi"
VITE_SUPABASE_PUBLISHABLE_KEY="[your-key]"
VITE_SUPABASE_URL="https://rgehleqcubtmcwyipyvi.supabase.co"
```

#### Shopify Configuration
```env
VITE_SHOPIFY_STORE="lovable-project-milns.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="[your-token]"
```

#### hCaptcha (Optional)
```env
VITE_HCAPTCHA_SITE_KEY="[your-key]"
```

### Setting Environment Variables

#### In Lovable
1. Navigate to Project Settings
2. Go to Environment Variables section
3. Add each variable with its value
4. Save and redeploy

#### In Shopify Oxygen
Environment variables are automatically injected via GitHub Secrets during the deployment workflow.

## Build Process

### Development Build
```bash
npm run dev
```
Starts Vite development server on `http://localhost:8080`

### Production Build
```bash
npm run build
```

Build output:
- **Location**: `dist/` directory
- **Contents**: Optimized static assets (HTML, CSS, JS, images)
- **Size**: Typically 1-3 MB (minified and tree-shaken)

Build steps:
1. **TypeScript Compilation**: TSC compiles `.ts` and `.tsx` files
2. **Vite Bundling**: Creates optimized production bundles
3. **Asset Optimization**: Minifies CSS, JS, and optimizes images
4. **Tree Shaking**: Removes unused code
5. **Code Splitting**: Creates separate chunks for better caching

### Build Verification
```bash
npm run preview
```
Serves the production build locally for testing before deployment.

## Deployment Workflow

### Standard Deployment (Lovable)

1. **Make Changes**
   - Edit code locally or in Lovable IDE
   - Commit changes to Git

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

3. **Automatic Deployment**
   - Lovable detects the push
   - Runs build process
   - Deploys to production
   - Typically completes in 2-5 minutes

4. **Verification**
   - Check deployment status in Lovable dashboard
   - Visit live site to verify changes
   - Check browser console for errors

### Hotfix Deployment

For urgent production fixes:

1. **Create hotfix branch**
   ```bash
   git checkout -b hotfix/critical-bug
   ```

2. **Make fix and test locally**
   ```bash
   npm run dev
   # Test the fix
   npm run build
   npm run preview
   ```

3. **Merge to main**
   ```bash
   git checkout main
   git merge hotfix/critical-bug
   git push origin main
   ```

4. **Monitor deployment**
   - Watch Lovable dashboard
   - Verify fix in production

### Rollback Process

If a deployment introduces issues:

#### Via Lovable Dashboard
1. Navigate to Deployments page
2. Find the last working deployment
3. Click "Rollback to this version"
4. Confirm rollback

#### Via Git
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CodeQL Analysis (`.github/workflows/codeql.yml`)
- **Trigger**: Push and PR to main/develop
- **Purpose**: Security vulnerability scanning
- **Languages**: JavaScript, TypeScript

#### 2. Datadog Synthetics (`.github/workflows/datadog-synthetics.yml`)
- **Trigger**: Push, PR, and hourly cron
- **Purpose**: End-to-end testing and monitoring
- **See**: [health-check-monitoring.md](./health-check-monitoring.md)

#### 3. Deno Deployment (`.github/workflows/deno.yml`)
- **Trigger**: Push to main
- **Purpose**: Alternative deployment option

## Monitoring Deployments

### Deployment Notifications

Monitor deployments via:
- **Lovable Dashboard**: Real-time deployment status
- **GitHub Actions**: Workflow run results
- **Email**: Configured via GitHub notifications

### Key Metrics to Monitor

After deployment, check:
- ✅ **Build Success**: No compilation errors
- ✅ **Load Time**: Page loads in < 3 seconds
- ✅ **API Connectivity**: Shopify and Supabase connections work
- ✅ **Console Errors**: No JavaScript errors in browser console
- ✅ **Responsive Design**: Site works on mobile, tablet, desktop
- ✅ **RTL Support**: Arabic language displays correctly

## Troubleshooting

### Build Fails

**Symptom**: Build process fails with errors

**Solutions**:
1. Check for TypeScript errors: `npm run lint`
2. Verify all dependencies installed: `npm install`
3. Check Node.js version: `node --version` (should be 18+)
4. Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Environment Variables Not Loading

**Symptom**: App can't connect to Supabase or Shopify

**Solutions**:
1. Verify `.env` file exists and has correct values
2. In Lovable: Check Environment Variables in settings
3. Variable names must start with `VITE_` to be exposed to client
4. Restart dev server after changing `.env`

### Deployment Succeeds but Site Broken

**Symptom**: Deployment shows success but site doesn't work

**Solutions**:
1. Check browser console for errors
2. Verify all API keys are valid
3. Check network tab for failed requests
4. Test locally with production build: `npm run build && npm run preview`
5. Rollback to previous working version

### Slow Deployment

**Symptom**: Deployment takes longer than usual

**Causes**:
- Large assets not optimized
- Too many dependencies
- Network issues

**Solutions**:
1. Optimize images (use WebP, compress)
2. Audit dependencies: `npm ls --depth=0`
3. Remove unused dependencies
4. Check Lovable status page for platform issues

## Best Practices

### Before Deploying

- ✅ Run linter: `npm run lint`
- ✅ Build locally: `npm run build`
- ✅ Test preview: `npm run preview`
- ✅ Check responsive design
- ✅ Test RTL mode (Arabic)
- ✅ Verify all features work
- ✅ Check browser console for errors

### During Development

- 💡 Use feature branches for new features
- 💡 Keep commits atomic and well-described
- 💡 Test locally before pushing
- 💡 Update documentation with changes
- 💡 Add meaningful commit messages

### After Deployment

- 🔍 Monitor error logs
- 🔍 Check health monitoring dashboard
- 🔍 Verify critical user flows work
- 🔍 Test on different devices
- 🔍 Monitor performance metrics

## Related Documentation

- [Health Check Monitoring](./health-check-monitoring.md)
- [README.md](../README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Support

For deployment issues:
- Check Lovable documentation
- Review GitHub Actions logs
- Contact Lovable support
- Check repository issues

---

**Last Updated**: February 2026
