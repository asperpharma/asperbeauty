# Deployment & Integrations Guide

This document explains all the integrations, connections, and deployment tools for the Asper Beauty Shop website.

## 🔗 Connected Services & Integrations

Your Asper Beauty Shop is connected to the following services:

### 1. **Lovable** (Primary Deployment Platform)
- **What it is**: A visual development platform for React applications
- **Connection**: Your project is hosted and deployed via Lovable
- **Live URL**: [https://asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app)
- **What you can control**:
  - Visual editing and prompting to modify the site
  - Automatic deployments when changes are made
  - Environment variables configuration
  - Preview deployments

### 2. **GitHub** (Source Control)
- **Repository**: [asperpharma/asperbeauty](https://github.com/asperpharma/asperbeauty)
- **Connection**: Two-way sync with Lovable
- **What you can control**:
  - Code versioning and history
  - Pull requests and code reviews
  - GitHub Actions for CI/CD
  - Collaboration with team members

### 3. **Shopify** (E-commerce Backend)
- **Store**: `lovable-project-milns.myshopify.com`
- **Integration**: Shopify Storefront API
- **What you can control**:
  - Product catalog and inventory
  - Product images and descriptions
  - Pricing and variants
  - Collections and categories
  - Checkout process
- **Configuration**: See `.env` file for API tokens

### 4. **Supabase** (Backend Database & Authentication)
- **Project ID**: `rgehleqcubtmcwyipyvi`
- **URL**: `https://rgehleqcubtmcwyipyvi.supabase.co`
- **What you can control**:
  - Database tables and data
  - Authentication and user management
  - Edge Functions for serverless backend logic
  - Storage for files and images
- **Configuration**: See `.env` file for API keys

### 5. **hCaptcha** (Security & Bot Protection)
- **Purpose**: Protects forms from spam and bots
- **What you can control**:
  - Captcha appearance and difficulty
  - Allowed domains
  - Security settings
- **Setup Required**: Get keys from [hcaptcha.com](https://hcaptcha.com)

## 🚀 Deployment Workflow

### Method 1: Deploy via Lovable (Recommended)
This is the **easiest way** to publish your website:

1. **Access Lovable Dashboard**
   - Go to [lovable.dev](https://lovable.dev)
   - Log in to your account
   - Open your "Asper Beauty Shop" project

2. **Make Changes**
   - Use the visual editor to modify components
   - Use AI prompting to request changes
   - Changes are automatically saved

3. **Publish**
   - Lovable automatically deploys your changes
   - Your site updates at: https://asperbeautyshop.lovable.app
   - Changes are automatically synced to GitHub

**Advantages:**
- No technical knowledge required
- Visual editing interface
- Instant preview of changes
- Automatic deployment
- No build process needed

### Method 2: Deploy via GitHub (Advanced)
For developers who prefer code-based workflows:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/asperpharma/asperbeauty.git
   cd asperbeauty
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Make Changes Locally**
   ```bash
   # Edit files in your code editor
   npm run dev  # Preview changes locally at http://localhost:8080
   ```

4. **Test Changes**
   ```bash
   npm run lint  # Check for code issues
   npm run build # Build for production
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin main
   ```

6. **Automatic Deployment**
   - Changes pushed to GitHub are automatically synced to Lovable
   - Lovable automatically deploys the changes
   - Your site updates within minutes

**Advantages:**
- Full control over code
- Version control with Git
- Team collaboration via pull requests
- Code review process

### Method 3: Deploy via Shopify Oxygen (Alternative)
The project includes GitHub Actions for Shopify Oxygen deployment:

- Workflows are located in `.github/workflows/`
- Oxygen deployment files: `oxygen-deployment-*.yml`
- Requires Shopify Oxygen setup and configuration

## 🔧 Configuration & Environment Variables

### Required Environment Variables

Your website requires these environment variables to function. They are configured in the `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="rgehleqcubtmcwyipyvi"
VITE_SUPABASE_URL="https://rgehleqcubtmcwyipyvi.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="[your-key]"

# Shopify Configuration
VITE_SHOPIFY_STORE="lovable-project-milns.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="[your-token]"

# hCaptcha Configuration (Optional)
VITE_HCAPTCHA_SITE_KEY="[your-site-key]"
```

### How to Update Environment Variables

#### In Lovable:
1. Open your project in Lovable
2. Go to Settings → Environment Variables
3. Add or update variables
4. Changes take effect on next deployment

#### In Local Development:
1. Edit the `.env` file in the project root
2. Restart the development server (`npm run dev`)

#### In GitHub:
- Environment variables are stored in the `.env` file
- **Security Note**: Never commit sensitive keys to Git
- For production, use Lovable's environment variable settings

## 🏗️ Build & Deployment Commands

### Development
```bash
npm run dev        # Start development server (localhost:8080)
```

### Production Build
```bash
npm run build      # Build optimized production bundle
npm run preview    # Preview production build locally
```

### Code Quality
```bash
npm run lint       # Check code for errors and style issues
```

## 📊 Deployment Pipeline (GitHub Actions)

Your repository includes several CI/CD workflows:

### 1. **CodeQL Analysis** (`codeql.yml`)
- **Purpose**: Security scanning for vulnerabilities
- **When**: Runs on push and pull requests
- **What it does**: Analyzes code for security issues

### 2. **Shopify Oxygen Deployment** (Multiple workflows)
- **Purpose**: Deploy to Shopify's hosting platform
- **Files**: `oxygen-deployment-*.yml`
- **When**: Triggered manually or on specific events

### 3. **Datadog Synthetics** (`datadog-synthetics.yml`)
- **Purpose**: Automated testing and monitoring
- **When**: Scheduled or on demand

### 4. **Deno Deployment** (`deno.yml`)
- **Purpose**: Deploy serverless functions
- **When**: On code changes

## 🌐 Custom Domain Setup

To use your own domain (e.g., asperbeautyshop.com):

### Via Lovable:
1. Go to Lovable Dashboard → Settings → Custom Domain
2. Add your domain name
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### DNS Configuration:
Add these DNS records at your domain registrar:

```
Type: CNAME
Name: www
Value: [provided by Lovable]

Type: A
Name: @
Value: [provided by Lovable]
```

## 🔐 Security Best Practices

1. **Environment Variables**: Store sensitive keys in Lovable dashboard, not in code
2. **API Tokens**: Rotate Shopify and Supabase tokens regularly
3. **Access Control**: Limit who has access to Lovable, Shopify, and Supabase dashboards
4. **hCaptcha**: Enable for all public forms to prevent spam
5. **HTTPS**: Always use HTTPS (automatic with Lovable)

## 📱 Monitoring & Analytics

### Lovable Dashboard
- View deployment logs
- Monitor build status
- Track website performance

### Shopify Admin
- Monitor product sales
- Track inventory
- Manage orders

### Supabase Dashboard
- Monitor database usage
- View API logs
- Track authentication

## 🆘 Troubleshooting

### Website not updating after changes?
1. Check Lovable deployment status
2. Clear browser cache
3. Wait a few minutes for CDN propagation
4. Check GitHub sync status in Lovable

### Products not showing?
1. Verify Shopify connection in `.env`
2. Check Shopify admin for published products
3. Verify storefront API token is valid

### Build errors?
1. Run `npm run lint` locally to check for errors
2. Review build logs in Lovable or GitHub Actions
3. Ensure all dependencies are installed

## 📞 Support & Resources

- **Lovable Documentation**: [docs.lovable.dev](https://docs.lovable.dev)
- **Shopify Storefront API**: [shopify.dev/api/storefront](https://shopify.dev/api/storefront)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Project Repository**: [github.com/asperpharma/asperbeauty](https://github.com/asperpharma/asperbeauty)

## 🎯 Quick Reference: Publishing Checklist

To publish your website as it looks in Lovable:

- [x] **Connected to Lovable** - Your project is live at asperbeautyshop.lovable.app
- [x] **Connected to GitHub** - Code is synced automatically
- [x] **Connected to Shopify** - Products are fetched from your store
- [x] **Connected to Supabase** - Backend database is configured

**To update the live site:**
1. ✅ Edit in Lovable dashboard (automatic deployment)
2. ✅ Push changes to GitHub (syncs to Lovable, then deploys)
3. ✅ Changes appear live within 2-5 minutes

**You control:**
- 🎨 Website design and layout (via Lovable or code)
- 🛍️ Product catalog (via Shopify admin)
- 💾 Database and backend (via Supabase dashboard)
- 🌐 Domain and DNS (via your domain registrar)
- 🚀 Deployment (automatic via Lovable)

---

**Summary**: Your website is already published and live! Use the Lovable dashboard to make changes, and they'll automatically deploy. You have full control over design, products, and content through the three main platforms: Lovable (website), Shopify (products), and Supabase (data).
