# Integration Guide for Asper Beauty Shop

This document describes all external service integrations and how to configure them properly.

## Overview

Asper Beauty Shop integrates with several external services to provide a complete e-commerce experience:

1. **Shopify Storefront API** - Product catalog and checkout
2. **Supabase** - Backend services, authentication, and database
3. **hCaptcha** - Form protection and bot prevention
4. **Lovable Platform** - Deployment and hosting

## Required Integrations

### 1. Shopify Storefront API

**Purpose**: Product management, inventory, and checkout processing

**Configuration**:
- `VITE_SHOPIFY_STORE` - Your Shopify store domain (e.g., `your-store.myshopify.com`)
- `VITE_SHOPIFY_STOREFRONT_TOKEN` - Storefront API access token

**Setup Steps**:
1. Log in to your Shopify Admin
2. Go to Apps → Manage private apps (or use a custom app)
3. Create a new private app with Storefront API access
4. Copy the Storefront Access Token
5. Add your store domain and token to `.env`

**Features Enabled**:
- ✅ Product catalog browsing
- ✅ Product search and filtering
- ✅ Shopping cart management
- ✅ Checkout URL generation
- ✅ Real-time inventory sync

### 2. Supabase

**Purpose**: Backend services, user authentication, database, and Edge Functions

**Configuration**:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project identifier

**Setup Steps**:
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy the URL and anon/public key
4. Add credentials to `.env`
5. Deploy Edge Functions (see below)

**Edge Functions**:
The following Supabase Edge Functions must be deployed:

| Function | Purpose |
|----------|---------|
| `beauty-assistant` | AI-powered beauty recommendations |
| `verify-captcha` | hCaptcha verification |
| `create-cod-order` | Cash on delivery order creation |
| `get-order-status` | Order tracking |
| `bulk-product-upload` | Admin bulk product import |
| `enrich-products` | Product data enrichment |
| `scrape-product` | Product information scraping |
| `generate-product-images` | AI product image generation |
| `remove-background` | Image background removal |
| `delete-account` | User account deletion |
| `generate-embeddings` | Search embeddings generation |

**Deploy Edge Functions**:
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy all functions
supabase functions deploy beauty-assistant
supabase functions deploy verify-captcha
supabase functions deploy create-cod-order
supabase functions deploy get-order-status
supabase functions deploy bulk-product-upload
supabase functions deploy enrich-products
supabase functions deploy scrape-product
supabase functions deploy generate-product-images
supabase functions deploy remove-background
supabase functions deploy delete-account
supabase functions deploy generate-embeddings
```

**Required Supabase Secrets**:
Set these in your Supabase project dashboard (Settings → Edge Functions → Secrets):
- `HCAPTCHA_SECRET_KEY` - hCaptcha secret key for server-side verification
- `RESEND_API_KEY` - (Optional) For sending emails via Resend
- Any other API keys needed by specific functions

### 3. hCaptcha (Optional but Recommended)

**Purpose**: Protect authentication forms from bots and abuse

**Configuration**:
- `VITE_HCAPTCHA_SITE_KEY` - hCaptcha site key (client-side)
- `HCAPTCHA_SECRET_KEY` - hCaptcha secret key (server-side, in Supabase Secrets)

**Setup Steps**:
1. Sign up at [hcaptcha.com](https://hcaptcha.com)
2. Add your domain: `asperbeautyshop.lovable.app` and `localhost` (for dev)
3. Get your Site Key and Secret Key
4. Add Site Key to `.env` file
5. Add Secret Key to Supabase Secrets (Settings → Edge Functions → Secrets)

**Status**: Currently using placeholder value - forms work but without CAPTCHA protection

**To Enable**:
1. Replace `your-hcaptcha-site-key-here` in `.env` with actual site key
2. Add secret key to Supabase Secrets
3. Restart development server

## Optional Integrations

### Email Service (Resend)

**Purpose**: Transactional emails (order confirmations, password resets, etc.)

**Configuration**:
- `RESEND_API_KEY` - Add to Supabase Secrets (not `.env`)

**Setup**:
1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Add to Supabase Secrets
4. Configure in Edge Functions that send emails

## Environment Variables Reference

Create a `.env` file in the root directory with these variables:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"

# Shopify Configuration (Required)
VITE_SHOPIFY_STORE="your-store.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="your-storefront-access-token"

# hCaptcha Configuration (Optional)
VITE_HCAPTCHA_SITE_KEY="your-hcaptcha-site-key"
```

## Health Checks

The application includes automatic integration health checks that run in development mode.

When you start the dev server, you'll see a console output showing the status of all integrations:

```
🔗 Integration Health Check
Timestamp: 2/22/2026, 12:30:00 PM
Status: ⚠️ Some issues detected

✅ Shopify Storefront API: Connected to your-store.myshopify.com
✅ Supabase: Supabase connection configured
⚠️ hCaptcha: hCaptcha site key appears to be a placeholder. Update with actual key
```

## Troubleshooting

### Shopify Integration Issues

**Problem**: Products not loading
- Check that `VITE_SHOPIFY_STORE` includes `.myshopify.com`
- Verify Storefront API token has read permissions
- Check browser console for API errors

**Problem**: Checkout not working
- Ensure cart is properly synced with Shopify
- Check browser console for cart creation errors

### Supabase Issues

**Problem**: Edge Functions failing
- Verify functions are deployed: `supabase functions list`
- Check function logs: `supabase functions logs function-name`
- Ensure all required secrets are set

**Problem**: Authentication not working
- Check Supabase URL and keys are correct
- Verify authentication is enabled in Supabase dashboard
- Check browser console for auth errors

### hCaptcha Issues

**Problem**: CAPTCHA not appearing
- Verify `VITE_HCAPTCHA_SITE_KEY` is not a placeholder
- Check that domain is added to hCaptcha dashboard
- Ensure site key matches the one in hCaptcha dashboard

**Problem**: CAPTCHA verification failing
- Check that `HCAPTCHA_SECRET_KEY` is set in Supabase Secrets
- Verify `verify-captcha` Edge Function is deployed
- Check Edge Function logs for errors

## Testing Integrations

### Test Shopify Connection
```bash
# From browser console on the site
fetch('https://your-store.myshopify.com/api/2025-07/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': 'your-token'
  },
  body: JSON.stringify({
    query: '{ shop { name } }'
  })
}).then(r => r.json()).then(console.log)
```

### Test Supabase Connection
```bash
# From browser console on the site
import { supabase } from '@/integrations/supabase/client'
const { data, error } = await supabase.from('your_table').select('*').limit(1)
console.log({ data, error })
```

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables properly configured
- [ ] Shopify integration tested (products load, checkout works)
- [ ] Supabase Edge Functions deployed
- [ ] hCaptcha configured (or disabled intentionally)
- [ ] Test authentication flows
- [ ] Test product browsing and cart
- [ ] Test checkout process
- [ ] Verify all forms work correctly
- [ ] Check console for integration warnings

## Support

For integration issues:
- Check this documentation first
- Review integration health check output
- Check service-specific documentation:
  - [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
  - [Supabase Docs](https://supabase.com/docs)
  - [hCaptcha Docs](https://docs.hcaptcha.com)
