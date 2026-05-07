# Health Check Monitoring

This document describes the health check and monitoring setup for Asper Beauty Shop.

## Overview

Asper Beauty Shop implements comprehensive monitoring to ensure site reliability, performance, and user experience. The monitoring system uses Datadog Synthetics for automated testing and health checks.

## Monitoring Architecture

```
┌─────────────────────────────────────────────────────┐
│              Monitoring Ecosystem                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐      ┌──────────────────┐   │
│  │ Datadog         │      │ GitHub Actions   │   │
│  │ Synthetics      │◄────►│ CI/CD            │   │
│  └────────┬────────┘      └──────────────────┘   │
│           │                                        │
│           ▼                                        │
│  ┌─────────────────┐                              │
│  │ Production Site │                              │
│  │ Health Checks   │                              │
│  └────────┬────────┘                              │
│           │                                        │
│           ▼                                        │
│  ┌─────────────────┐                              │
│  │ Alert System    │                              │
│  │ & Notifications │                              │
│  └─────────────────┘                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Datadog Synthetics Monitoring

### What is Datadog Synthetics?

Datadog Synthetics provides automated testing that simulates user interactions with your website from different locations around the world. It continuously monitors:

- **Uptime**: Is the site accessible?
- **Performance**: How fast do pages load?
- **Functionality**: Do key user flows work?
- **API Health**: Are backend services responding?

### Configuration

The monitoring is configured in `.github/workflows/datadog-synthetics.yml`:

```yaml
name: Datadog Synthetics CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    # Run tests every hour
    - cron: '0 * * * *'

jobs:
  synthetics:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Datadog Synthetic tests
        uses: DataDog/synthetics-ci-github-action@v1
        with:
          api_key: ${{ secrets.DATADOG_API_KEY }}
          app_key: ${{ secrets.DATADOG_APP_KEY }}
          fail_on_critical_errors: true
          poll_results: true
          subdomain: app

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: datadog-synthetics-results
          path: .datadog-ci/
```

### Required Secrets

Set these in GitHub repository settings under **Settings > Secrets and variables > Actions**:

- `DATADOG_API_KEY`: Your Datadog API key
- `DATADOG_APP_KEY`: Your Datadog application key

### Test Triggers

Synthetic tests run automatically:

1. **On Push**: When code is pushed to `main` or `develop` branches
2. **On Pull Request**: When a PR is opened against `main` or `develop`
3. **Scheduled**: Every hour via cron job (`0 * * * *`)

## Types of Health Checks

### 1. Uptime Monitoring

**Purpose**: Verify the site is accessible and returning valid responses

**Checks**:
- HTTP status code is 200
- Response time is < 3 seconds
- Site returns valid HTML content

**Test Locations**:
- US East (N. Virginia)
- EU West (Ireland)
- Asia Pacific (Singapore)

### 2. API Health Checks

**Purpose**: Ensure backend services are functioning

**Endpoints to Monitor**:

#### Shopify Storefront API
```
GET https://lovable-project-milns.myshopify.com/api/2024-01/graphql
```
**Expected**: 200 OK with valid GraphQL response

#### Supabase API
```
GET https://rgehleqcubtmcwyipyvi.supabase.co/rest/v1/
```
**Expected**: 200 OK or 401 (authentication required)

### 3. Functional Tests

**Purpose**: Verify critical user journeys work end-to-end

#### Test Scenarios:

**Home Page Load**
- Navigate to homepage
- Verify hero section loads
- Check featured products display
- Confirm navigation menu works

**Product Search**
- Enter search query
- Verify results appear
- Click on product
- Confirm product details load

**Add to Cart**
- Select product
- Choose quantity
- Add to cart
- Verify cart updates

**Wishlist**
- Click wishlist icon
- Verify product added to wishlist
- Navigate to wishlist page
- Confirm product appears

**Language Toggle**
- Switch to Arabic
- Verify RTL layout
- Check Arabic text displays correctly
- Switch back to English

### 4. Performance Monitoring

**Metrics Tracked**:
- **Page Load Time**: Total time to fully load page
- **First Contentful Paint (FCP)**: Time to first visible content
- **Time to Interactive (TTI)**: Time until page is fully interactive
- **Largest Contentful Paint (LCP)**: Time to largest content element

**Performance Targets**:
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Page Load Time | < 3s | > 5s |
| FCP | < 1.5s | > 2.5s |
| TTI | < 3.5s | > 5.5s |
| LCP | < 2.5s | > 4s |

## Setting Up Datadog Synthetics

### Step 1: Create Datadog Account

1. Go to [datadoghq.com](https://www.datadoghq.com/)
2. Sign up for a free trial or paid account
3. Complete account setup

### Step 2: Generate API Keys

1. Navigate to **Organization Settings > API Keys**
2. Create new API Key
   - Name: "Asper Beauty GitHub Actions"
   - Copy the API key
3. Navigate to **Organization Settings > Application Keys**
4. Create new Application Key
   - Name: "Asper Beauty GitHub Actions"
   - Copy the application key

### Step 3: Add Secrets to GitHub

1. Go to GitHub repository settings
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. Add `DATADOG_API_KEY` with your API key
5. Add `DATADOG_APP_KEY` with your application key

### Step 4: Create Synthetic Tests

#### Browser Test (Functional)

1. In Datadog, go to **UX Monitoring > Synthetic Tests**
2. Click **New Test > Browser Test**
3. Configure test:
   - **URL**: `https://asperbeautyshop.lovable.app`
   - **Name**: "Asper Beauty - Homepage Load"
   - **Locations**: Select 3+ locations
   - **Frequency**: Every 1 hour
   - **Alert conditions**: Fail on 2+ locations

4. Record test steps:
   - Navigate to homepage
   - Wait for hero section to load
   - Verify "Shop Now" button exists
   - Click on a product
   - Verify product details load

5. Set assertions:
   - Page loads within 3 seconds
   - No JavaScript errors
   - Specific elements are present

#### API Test (Health Check)

1. Click **New Test > API Test**
2. Configure test:
   - **Method**: GET
   - **URL**: `https://asperbeautyshop.lovable.app`
   - **Name**: "Asper Beauty - API Health Check"
   - **Frequency**: Every 5 minutes

3. Add assertions:
   - Response code is 200
   - Response time < 1000ms
   - Body contains "Asper Beauty"

### Step 5: Configure Alerts

1. In test configuration, go to **Alert Conditions**
2. Set up notifications:
   - **Email**: your-email@example.com
   - **Slack**: Connect to your Slack workspace (optional)
   - **PagerDuty**: For critical alerts (optional)

3. Configure alert thresholds:
   - Alert when test fails from 2+ locations
   - Re-notify after 30 minutes if still failing
   - Auto-resolve when test passes

## Monitoring Dashboard

### Accessing Datadog Dashboard

1. Log in to [app.datadoghq.com](https://app.datadoghq.com)
2. Navigate to **UX Monitoring > Synthetic Tests**
3. View test results and metrics

### Key Metrics to Watch

**Uptime**
- Current status (up/down)
- Uptime percentage (target: 99.9%)
- Recent incidents

**Performance**
- Average response time
- P95 response time (95th percentile)
- Performance trends over time

**Error Rate**
- JavaScript errors
- API errors
- Failed requests percentage

**Availability by Region**
- US: 99.9%
- EU: 99.9%
- APAC: 99.5%

## Monitoring in CI/CD

### GitHub Actions Integration

The Datadog Synthetics workflow runs automatically in your CI/CD pipeline:

1. **On PR Creation**: Tests run to verify changes don't break functionality
2. **Before Deployment**: Tests must pass before deployment to production
3. **After Deployment**: Tests verify deployment was successful
4. **Continuous**: Hourly scheduled tests catch issues proactively

### Viewing Results

**In GitHub Actions**:
1. Go to **Actions** tab in GitHub
2. Select **Datadog Synthetics CI** workflow
3. View latest run results
4. Download artifacts for detailed logs

**In Datadog**:
1. Navigate to **CI Visibility > Test Runs**
2. Filter by repository name
3. View test results tied to commits

## Alert Response Procedures

### When You Receive an Alert

#### 1. Assess Severity

**Critical (P1)**:
- Site completely down
- All regions failing
- Major functionality broken

**High (P2)**:
- Site slow (>5s load time)
- One region failing
- Non-critical feature broken

**Medium (P3)**:
- Minor performance degradation
- Intermittent issues

#### 2. Initial Response

1. **Acknowledge Alert**: In Datadog, acknowledge you're investigating
2. **Check Status**: Visit site to confirm issue
3. **Review Recent Changes**: Check recent deployments
4. **Check Dependencies**: Verify Shopify and Supabase status

#### 3. Investigation

**Site Down**:
```bash
# Check if DNS is resolving
nslookup asperbeautyshop.lovable.app

# Check HTTP status
curl -I https://asperbeautyshop.lovable.app

# Check from different locations
# Use: https://tools.pingdom.com/
```

**Performance Issues**:
```bash
# Run local performance audit
npm run build
npm run preview

# Check bundle size
du -sh dist/*

# Analyze with Lighthouse
npx lighthouse https://asperbeautyshop.lovable.app
```

**API Issues**:
- Check Shopify status: [status.shopify.com](https://status.shopify.com)
- Check Supabase status: [status.supabase.com](https://status.supabase.com)

#### 4. Resolution

**Quick Fix Options**:
1. **Rollback**: Use Lovable dashboard to rollback to previous version
2. **Restart Services**: May resolve transient issues
3. **Clear CDN Cache**: Force cache refresh

**Permanent Fix**:
1. Create hotfix branch
2. Fix the issue
3. Test locally
4. Deploy fix
5. Verify in monitoring

#### 5. Post-Incident

1. Document incident in GitHub issue
2. Create post-mortem (if critical)
3. Update monitoring to catch similar issues
4. Improve alerting rules if needed

## Custom Health Check Endpoints

### Creating Health Check Endpoint (Optional)

You can add a dedicated health check endpoint to your application:

```typescript
// src/pages/Health.tsx
export function Health() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      shopify: checkShopify(),
      supabase: checkSupabase(),
    },
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  };

  return <div>{JSON.stringify(checks, null, 2)}</div>;
}

async function checkShopify() {
  try {
    const response = await fetch(`https://${import.meta.env.VITE_SHOPIFY_STORE}/api/2024-01/graphql`);
    return response.ok ? 'healthy' : 'unhealthy';
  } catch {
    return 'unhealthy';
  }
}

async function checkSupabase() {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`);
    return response.ok || response.status === 401 ? 'healthy' : 'unhealthy';
  } catch {
    return 'unhealthy';
  }
}
```

Add route:
```typescript
// src/App.tsx
<Route path="/health" element={<Health />} />
```

Monitor endpoint:
```
GET https://asperbeautyshop.lovable.app/health
```

## Monitoring Best Practices

### 1. Set Up Alerts Wisely

- ✅ Alert on real issues, not noise
- ✅ Use appropriate severity levels
- ✅ Set up escalation policies
- ✅ Test alert channels regularly

### 2. Monitor What Matters

Focus on:
- User-facing metrics (page load, errors)
- Business metrics (checkout, search)
- Infrastructure health (APIs, CDN)

Avoid:
- Too many low-priority alerts
- Metrics that don't drive action
- Over-monitoring internal systems

### 3. Regular Review

- Review monitoring dashboard weekly
- Adjust alert thresholds based on trends
- Update tests when features change
- Archive outdated monitors

### 4. Documentation

- Document what each monitor checks
- Keep runbooks for common issues
- Update alert response procedures
- Track incidents and resolutions

## Troubleshooting Monitoring

### Test Fails But Site Works

**Possible Causes**:
- Network issues between Datadog and site
- Transient CDN issue
- Test assertion too strict

**Solution**:
- Check from multiple locations manually
- Review test configuration
- Adjust test assertions

### False Positives

**Possible Causes**:
- Test is too sensitive
- External dependency issue
- Rate limiting

**Solution**:
- Add retry logic to tests
- Increase timeout thresholds
- Whitelist Datadog IPs

### Tests Not Running

**Possible Causes**:
- GitHub Actions disabled
- Secrets not configured
- Datadog account issue

**Solution**:
- Check GitHub Actions status
- Verify secrets are set correctly
- Confirm Datadog API keys are valid

## Related Documentation

- [Deployment Flow](./deployment-flow.md)
- [README.md](../README.md)
- [Datadog Documentation](https://docs.datadoghq.com/synthetics/)

## Support

For monitoring issues:
- Check Datadog status page
- Review Datadog documentation
- Contact Datadog support
- Create issue in GitHub repository

---

**Last Updated**: February 2026
