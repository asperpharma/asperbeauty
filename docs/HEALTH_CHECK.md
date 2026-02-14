# Health Check Documentation

## Overview

This document describes the health check procedures, monitoring strategies, and diagnostic tools for Asper Beauty Shop. Health checks ensure the application is running correctly and help identify issues before they impact users.

## Table of Contents

1. [Application Health Checks](#application-health-checks)
2. [System Health Indicators](#system-health-indicators)
3. [Automated Monitoring](#automated-monitoring)
4. [Manual Health Checks](#manual-health-checks)
5. [Performance Metrics](#performance-metrics)
6. [Troubleshooting Guide](#troubleshooting-guide)

## Application Health Checks

### Frontend Health Check

#### 1. Basic Availability Check
```bash
# Check if application is accessible
curl -I https://asperbeautyshop.lovable.app

# Expected response:
HTTP/2 200
```

#### 2. Critical Page Checks
Test that critical pages load successfully:

| Page | URL | Expected Status |
|------|-----|----------------|
| Home | `/` | 200 OK |
| Products | `/products/:handle` | 200 OK |
| Collections | `/collections/:handle` | 200 OK |
| Brands | `/brands` | 200 OK |
| Cart | `/cart` (via client routing) | 200 OK |

#### 3. Asset Loading
Verify critical assets load:
- ✅ CSS stylesheets
- ✅ JavaScript bundles
- ✅ Images and fonts
- ✅ External dependencies (CDN)

### API Health Checks

#### Shopify Storefront API
```javascript
// Test Shopify connection
const testShopifyConnection = async () => {
  const query = `{
    shop {
      name
    }
  }`;
  
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query }),
    }
  );
  
  return response.ok;
};
```

**Expected Result**: 200 OK with shop data

#### Supabase Connection
```javascript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const testSupabaseConnection = async () => {
  const { data, error } = await supabase
    .from('test_table')
    .select('*')
    .limit(1);
  
  return !error;
};
```

**Expected Result**: Connection successful without errors

## System Health Indicators

### Key Performance Indicators (KPIs)

#### 1. Availability
- **Target**: 99.9% uptime
- **Measurement**: Uptime monitoring via Datadog Synthetics
- **Alert Threshold**: < 99.5%

#### 2. Response Time
- **Target**: < 2 seconds for page load
- **Measurement**: Time to First Byte (TTFB)
- **Alert Threshold**: > 3 seconds

#### 3. Error Rate
- **Target**: < 0.1% error rate
- **Measurement**: Failed requests / Total requests
- **Alert Threshold**: > 1%

#### 4. Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4s | > 4s |
| FID (First Input Delay) | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

**Target**: All metrics in "Good" range

### Health Status Categories

#### 🟢 Healthy
- All systems operational
- Response times within target
- No critical errors
- All dependencies available

#### 🟡 Degraded
- Minor performance issues
- Some non-critical errors
- Backup systems active
- User experience slightly impacted

#### 🔴 Unhealthy
- Critical functionality broken
- High error rates
- Severe performance degradation
- Immediate action required

## Automated Monitoring

### Datadog Synthetics

The application uses Datadog Synthetics for automated health monitoring.

#### Configured Tests
1. **Homepage Availability**
   - Frequency: Every 5 minutes
   - Locations: Multiple regions
   - Alert on failure

2. **Product Page Load**
   - Tests product page rendering
   - Validates data fetching
   - Checks for JavaScript errors

3. **API Endpoint Tests**
   - Shopify API connectivity
   - Response time checks
   - Data validation

#### Alert Configuration
```yaml
# .github/workflows/datadog-synthetics.yml
# Synthetic monitoring configuration
monitors:
  - name: Homepage Check
    type: browser
    locations: [aws:us-east-1, aws:eu-west-1]
    frequency: 300 # 5 minutes
    assertions:
      - type: statusCode
        operator: is
        target: 200
      - type: responseTime
        operator: lessThan
        target: 2000
```

### GitHub Actions Monitoring

#### CI/CD Pipeline Health
Monitor workflow runs:
```bash
# Check recent workflow runs
gh run list --limit 10

# View specific run details
gh run view <run-id>

# Check workflow status
gh run watch
```

**Healthy Indicators**:
- ✅ All workflows passing
- ✅ Build time < 5 minutes
- ✅ No security vulnerabilities

### Browser Console Monitoring

#### Console Error Detection
Check for JavaScript errors in production:

**Healthy State**: No console errors
**Warning State**: Non-critical warnings only
**Critical State**: JavaScript errors present

## Manual Health Checks

### Daily Health Check Routine

#### 1. Visual Inspection
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Product images display
- [ ] Search functionality works
- [ ] Cart operations work
- [ ] Mobile view is responsive
- [ ] RTL (Arabic) layout correct

#### 2. Functional Testing

**User Flow: Browse and Add to Cart**
1. Navigate to homepage
2. Click on a product category
3. View product details
4. Add product to cart
5. View cart
6. Verify cart count updates

**Expected Result**: All steps complete without errors

**User Flow: Search**
1. Use search bar
2. Enter product name
3. View search results
4. Click on a result

**Expected Result**: Relevant results displayed

**User Flow: Language Switch**
1. Toggle language (EN ↔ AR)
2. Verify layout direction changes
3. Check text translation
4. Verify all UI elements

**Expected Result**: Smooth language transition

#### 3. Performance Check
```bash
# Using browser DevTools
# 1. Open DevTools (F12)
# 2. Go to Network tab
# 3. Reload page with cache disabled (Ctrl+Shift+R)
# 4. Check metrics:

Metrics to Record:
- Page Load Time: _____ ms
- DOMContentLoaded: _____ ms
- Number of Requests: _____
- Total Size: _____ KB
- Finish Time: _____ ms
```

**Targets**:
- Page Load Time: < 2000ms
- Total Size: < 2MB
- Requests: < 100

#### 4. Accessibility Check
```bash
# Using browser DevTools Lighthouse
# 1. Open DevTools
# 2. Go to Lighthouse tab
# 3. Select "Accessibility"
# 4. Run audit

Target Score: > 90/100
```

### Weekly Health Check Routine

- [ ] Review error logs for patterns
- [ ] Check Datadog dashboards
- [ ] Verify SSL certificate validity
- [ ] Review performance trends
- [ ] Check dependency updates
- [ ] Review GitHub Actions usage
- [ ] Audit environment variables

### Monthly Health Check Routine

- [ ] Full security audit
- [ ] Performance benchmark comparison
- [ ] Dependency vulnerability scan
- [ ] Database health check (Supabase)
- [ ] Review and update monitoring
- [ ] Load testing
- [ ] Disaster recovery drill

## Performance Metrics

### Frontend Metrics

#### Bundle Size Analysis
```bash
# Build and analyze bundle
npm run build

# Check build output
# Expected: dist/ folder with optimized assets

# Analyze bundle size
npx vite-bundle-analyzer
```

**Targets**:
- Main JS bundle: < 500KB (gzipped)
- CSS bundle: < 100KB (gzipped)
- Total initial load: < 1MB

#### Lighthouse Scores

Run Lighthouse audit:
```bash
# Using Chrome DevTools or CLI
npm install -g lighthouse
lighthouse https://asperbeautyshop.lovable.app --view
```

**Target Scores** (out of 100):
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Backend/API Metrics

#### API Response Times
Monitor key API endpoints:

| Endpoint | Target Response Time |
|----------|---------------------|
| Shopify Product Query | < 500ms |
| Shopify Collection Query | < 600ms |
| Supabase Query | < 300ms |

#### Error Tracking
Track and categorize errors:
- **Network Errors**: Connection failures
- **API Errors**: 4xx, 5xx responses
- **Client Errors**: JavaScript exceptions
- **Render Errors**: React component failures

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Slow Page Load

**Symptoms**:
- Pages take > 3 seconds to load
- Time to Interactive (TTI) is high
- Users report sluggish experience

**Diagnosis**:
1. Check browser Network tab for slow requests
2. Review Lighthouse performance audit
3. Check CDN cache hit rates
4. Monitor API response times

**Solutions**:
- Optimize images (use WebP format)
- Implement code splitting
- Enable browser caching
- Optimize third-party scripts
- Review bundle size

#### Issue 2: API Connection Failures

**Symptoms**:
- Products not loading
- Cart operations fail
- Console shows network errors

**Diagnosis**:
```javascript
// Check Shopify API
console.log('Shopify Domain:', import.meta.env.VITE_SHOPIFY_STORE_DOMAIN);
console.log('Shopify Token:', import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ? 'Set' : 'Missing');

// Test API call
fetch(`https://${domain}/api/2024-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query: '{ shop { name } }' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Solutions**:
- Verify environment variables are set
- Check API token validity
- Verify network connectivity
- Check for API rate limiting
- Review Shopify API status page

#### Issue 3: Console Errors

**Symptoms**:
- JavaScript errors in browser console
- UI components not rendering
- Broken functionality

**Diagnosis**:
1. Open browser DevTools console
2. Note error messages and stack traces
3. Identify failing component/module

**Solutions**:
- Check for missing dependencies
- Verify component props
- Review recent code changes
- Check for TypeScript errors
- Validate data structures

#### Issue 4: Mobile Responsiveness Issues

**Symptoms**:
- Layout breaks on mobile
- Elements overflow viewport
- Touch interactions not working

**Diagnosis**:
1. Open DevTools device emulation
2. Test various screen sizes
3. Check Tailwind responsive classes

**Solutions**:
- Use mobile-first responsive design
- Test on actual devices
- Verify Tailwind breakpoints
- Check touch event handlers
- Review viewport meta tag

#### Issue 5: RTL (Arabic) Layout Issues

**Symptoms**:
- Arabic text displays incorrectly
- Layout doesn't flip for RTL
- Icons point wrong direction

**Diagnosis**:
1. Toggle to Arabic language
2. Inspect layout direction
3. Check CSS logical properties

**Solutions**:
- Use logical properties (start/end vs left/right)
- Test with `dir="rtl"` attribute
- Verify Tajawal font loading
- Check icon direction logic

## Health Check Automation

### Create a Health Check Script

```javascript
// scripts/health-check.js
const healthChecks = {
  async checkHomepage() {
    const response = await fetch('https://asperbeautyshop.lovable.app');
    return response.ok;
  },
  
  async checkShopify() {
    // Test Shopify API connection
    // Implementation here
  },
  
  async checkSupabase() {
    // Test Supabase connection
    // Implementation here
  },
};

async function runHealthChecks() {
  console.log('Running health checks...');
  
  for (const [name, check] of Object.entries(healthChecks)) {
    try {
      const result = await check();
      console.log(`✅ ${name}: ${result ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      console.log(`❌ ${name}: ERROR - ${error.message}`);
    }
  }
}

runHealthChecks();
```

### Schedule Regular Checks

```bash
# Add to cron (Linux/Mac) or Task Scheduler (Windows)
# Run health checks every hour
0 * * * * node /path/to/health-check.js
```

## Incident Response

### Severity Levels

#### P0 - Critical
- **Definition**: Complete service outage
- **Response Time**: Immediate (< 15 minutes)
- **Examples**: Site down, data loss, security breach

#### P1 - High
- **Definition**: Major functionality broken
- **Response Time**: < 1 hour
- **Examples**: Checkout broken, major UI issues

#### P2 - Medium
- **Definition**: Partial functionality impacted
- **Response Time**: < 4 hours
- **Examples**: Search not working, minor bugs

#### P3 - Low
- **Definition**: Minor issues, cosmetic problems
- **Response Time**: < 24 hours
- **Examples**: Typos, minor UI glitches

### Incident Response Workflow

1. **Detection**: Automated alert or manual report
2. **Assessment**: Determine severity and impact
3. **Communication**: Notify team and stakeholders
4. **Investigation**: Identify root cause
5. **Resolution**: Implement fix
6. **Verification**: Confirm issue resolved
7. **Post-Mortem**: Document and learn

## Support & Escalation

### Support Contacts

- **Development Team**: [Your team contact]
- **Lovable Support**: support@lovable.dev
- **Shopify Support**: partners.shopify.com/support
- **Emergency Hotline**: [Your emergency contact]

### Escalation Path

1. **Level 1**: Developer on-call
2. **Level 2**: Team Lead
3. **Level 3**: Engineering Manager
4. **Level 4**: External vendor support

---

**Last Updated**: 2026-02-14
**Maintained By**: Asper Pharma Team
**Review Cycle**: Monthly
