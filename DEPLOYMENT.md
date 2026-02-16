# Vercel Deployment Guide

This guide will help you deploy the Asper Beauty Shop to Vercel with Supabase integration.

## Prerequisites

1. A [Vercel account](https://vercel.com)
2. A [Supabase project](https://app.supabase.com) set up and running
3. The repository connected to your GitHub account

## Quick Start

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your `asperpharma/asperbeauty` repository
4. Vercel will automatically detect it as a Vite project

### 2. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

#### Required Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Shopify Configuration
VITE_SHOPIFY_STORE=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token

# hCaptcha Configuration
VITE_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
```

#### Getting Your Credentials

**Supabase Credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the following:
   - Project URL → `VITE_SUPABASE_URL`
   - Project API keys → anon/public key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Project Reference ID → `VITE_SUPABASE_PROJECT_ID`

**Shopify Credentials:**
1. Go to your Shopify Admin Panel
2. Navigate to Apps → Develop apps
3. Create a Storefront API access token
4. Copy your store domain and access token

**hCaptcha Credentials:**
1. Sign up at [hCaptcha](https://hcaptcha.com)
2. Add your Vercel domain to allowed domains
3. Copy your Site Key

### 3. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your site will be live at `your-project.vercel.app`

## Supabase Edge Functions Setup

The Supabase Edge Functions in this project require additional server-side environment variables that should be configured in your Supabase project (not in Vercel).

### Configure Supabase Secrets

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings → Edge Functions → Manage secrets
4. Add the following secrets:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key
RESEND_API_KEY=your-resend-api-key
LOVABLE_API_KEY=your-lovable-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
```

### Deploy Edge Functions

The Edge Functions are already formatted with Deno and ready to deploy:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy all functions
supabase functions deploy
```

Or deploy individual functions:

```bash
supabase functions deploy beauty-assistant
supabase functions deploy create-cod-order
supabase functions deploy verify-captcha
# ... etc
```

## Custom Domain Setup

### Add Custom Domain in Vercel

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `asperbeautyshop.com`)
4. Follow Vercel's instructions to configure DNS

### Update hCaptcha Domain

Don't forget to add your custom domain to hCaptcha's allowed domains list.

## Build Settings

The project uses the following build configuration (automatically detected by Vercel):

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

These settings are also defined in `vercel.json` for consistency.

## Troubleshooting

### Build Fails

1. Check that all environment variables are correctly set
2. Ensure Node.js version is 18.x or higher
3. Review build logs in Vercel dashboard

### Supabase Connection Issues

1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct
2. Check that your Supabase project is active
3. Ensure CORS is properly configured in Supabase

### hCaptcha Not Working

1. Verify domain is added to hCaptcha dashboard
2. Check that `VITE_HCAPTCHA_SITE_KEY` is correct
3. Ensure both production and preview domains are whitelisted

### Edge Functions Not Working

1. Make sure secrets are configured in Supabase Dashboard
2. Verify functions are deployed: `supabase functions list`
3. Check function logs: `supabase functions logs function-name`

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: For all other branches and pull requests

## Environment-Specific Configurations

You can set different environment variables for:
- Production
- Preview
- Development

Configure these in Vercel project settings → Environment Variables.

## Performance Optimization

The `vercel.json` configuration includes:
- Automatic client-side routing
- Cache headers for static assets (1 year)
- Optimal compression settings

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Project README](/README.md)

## Support

For deployment issues:
1. Check Vercel build logs
2. Review Supabase function logs
3. Create an issue in the repository
4. Contact support at the respective platforms

---

Built with ❤️ using [Lovable](https://lovable.dev)
