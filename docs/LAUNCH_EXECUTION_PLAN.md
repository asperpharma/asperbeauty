# Launch Execution Plan

**Purpose:** Comprehensive guide for launching and maintaining the Asper Beauty Shop system.

---

## Phase 1: Pre-Launch Setup

### 1.1 Environment Configuration

**Supabase Setup:**
```bash
# Verify Supabase project
Project ID: rgehleqcubtmcwyipyvi
URL: https://rgehleqcubtmcwyipyvi.supabase.co
```

**Required Secrets (Supabase Dashboard → Settings → Secrets):**
- `OPENAI_API_KEY` - For beauty assistant AI
- `RESEND_API_KEY` - For email notifications (if using Resend)
- `SHOPIFY_ADMIN_TOKEN` - For admin API access (if needed)
- `HCAPTCHA_SECRET` - For CAPTCHA verification

**Frontend Environment (.env):**
```bash
VITE_SUPABASE_PROJECT_ID="rgehleqcubtmcwyipyvi"
VITE_SUPABASE_URL="https://rgehleqcubtmcwyipyvi.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SHOPIFY_STORE="lovable-project-milns.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="your-storefront-token"
VITE_HCAPTCHA_SITE_KEY="your-site-key"
```

### 1.2 Database Migration

**Run all migrations:**
```bash
# Using Supabase CLI
supabase db push

# Or apply migrations manually in Supabase Dashboard → SQL Editor
```

**Verify tables exist:**
- `concierge_profiles`
- `beauty_assistant_audit`
- `consultations` (if applicable)
- `admin_reports` (optional)

### 1.3 Shopify Configuration

**Store Setup:**
1. Log in to [Shopify Admin](https://admin.shopify.com/store/lovable-project-milns)
2. Verify Storefront API is enabled
3. Check API token permissions (read products, create carts, create checkouts)
4. Configure payment methods (COD, credit card)
5. Set up shipping zones and rates

**Webhooks (Optional):**
Configure webhooks for order updates:
- Order creation → Supabase Edge Function
- Order fulfillment → Notification system
- Product updates → Sync to database

---

## Phase 2: Bulk Product Upload

### 2.1 Prepare Product Data

**CSV Format:**
Ensure your product CSV follows Shopify's format. See `scripts/convert-csv-to-shopify.js` for conversion utility.

**Required fields:**
- Handle (URL-safe unique identifier)
- Title
- Body (HTML) - Product description
- Vendor - Brand name
- Type - Product category
- Tags - Including `Concern_*` and `Step_*` tags (see SHOPIFY_TAGGING_PROTOCOL.md)
- Price
- Inventory

**Tag Protocol:**
Follow the tagging protocol for skin concerns and skincare steps:
- `Concern_Acne` - For acne treatment products
- `Concern_Dryness` - For hydration products
- `Concern_Aging` - For anti-aging products
- `Step_Cleanse` - Cleansers
- `Step_Treat` - Serums, treatments
- `Step_Moisturize` - Moisturizers

See [SHOPIFY_TAGGING_PROTOCOL.md](./SHOPIFY_TAGGING_PROTOCOL.md) for complete list.

### 2.2 Upload to Shopify

**Method 1: Shopify Admin UI**
1. Go to Products → Import
2. Upload CSV file
3. Map columns if needed
4. Review and confirm import
5. Wait for processing (may take time for large catalogs)

**Method 2: Bulk Product Upload Edge Function**
```bash
# Using Supabase Edge Function
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"products": [...]}'
```

**Verify upload:**
1. Check Products page in Shopify Admin
2. Verify product count matches expected
3. Spot-check products for correct data
4. Test product pages on frontend

### 2.3 Product Enrichment

**Run enrichment Edge Function (if needed):**
```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/enrich-products" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

This function can:
- Generate product embeddings for AI search
- Optimize product descriptions
- Add missing tags
- Enhance product metadata

---

## Phase 3: Edge Functions Deployment

### 3.1 Beauty Assistant

**Deploy:**
```bash
supabase functions deploy beauty-assistant
```

**Test:**
```bash
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have oily skin and acne. What products do you recommend?"}'
```

**Expected response:**
```json
{
  "reply": "For oily, acne-prone skin, I recommend...",
  "persona": "dr-sami",
  "recommended_products": [...]
}
```

See [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md) for detailed deployment guide.

### 3.2 Other Edge Functions

**Deploy all functions:**
```bash
supabase functions deploy bulk-product-upload
supabase functions deploy create-cod-order
supabase functions deploy get-order-status
supabase functions deploy enrich-products
supabase functions deploy generate-embeddings
```

**Test each function:**
Check Supabase Dashboard → Edge Functions → Select function → Logs

---

## Phase 4: Frontend Deployment

### 4.1 Pre-Deployment Checks

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### 4.2 Deploy to Lovable

```bash
# Commit and push to main branch
git add .
git commit -m "chore: production ready"
git push origin main
```

Lovable will automatically deploy when changes are pushed to the connected branch.

**Verify deployment:**
- Visit https://asperbeautyshop.lovable.app
- Check SSL certificate
- Test critical flows

### 4.3 DNS Configuration (if using custom domain)

If using `asperbeautyshop.com`:

1. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: <lovable-domain>.lovable.app
   
   Type: CNAME
   Name: www
   Value: <lovable-domain>.lovable.app
   ```

2. Configure SSL in Lovable dashboard
3. Wait for DNS propagation (up to 48 hours)
4. Verify HTTPS works on custom domain

---

## Phase 5: Live Fire Testing

### 5.1 Create Test Orders

**Test Case 1: Cash on Delivery (COD)**
1. Browse products as a customer
2. Add products to cart
3. Proceed to checkout
4. Select "Cash on Delivery" payment
5. Complete order
6. Verify order appears in Shopify Admin
7. Verify order status can be retrieved via `get-order-status` function

**Test Case 2: Credit Card Payment**
1. Use Shopify test card numbers
2. Complete checkout with test card
3. Verify order created
4. Check payment status in Shopify

**Test Case 3: Beauty Assistant Chat**
1. Open chat widget on frontend
2. Ask: "I have dry skin, what do you recommend?"
3. Verify AI responds with product recommendations
4. Check recommendations are relevant
5. Verify conversation saved to `beauty_assistant_audit` table

**Test Case 4: Language Switching**
1. Switch to Arabic language
2. Verify RTL layout
3. Verify translations are correct
4. Test checkout flow in Arabic
5. Switch back to English

### 5.2 Performance Testing

**Metrics to check:**
- Page load time < 3 seconds
- Time to Interactive (TTI) < 5 seconds
- First Contentful Paint (FCP) < 1.5 seconds
- Largest Contentful Paint (LCP) < 2.5 seconds

**Tools:**
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- WebPageTest.org

### 5.3 Load Testing

**Simulate traffic:**
```bash
# Using Apache Bench (ab)
ab -n 1000 -c 10 https://asperbeautyshop.lovable.app/

# Or use k6, Artillery, or other load testing tools
```

**Monitor:**
- Supabase database connections
- Edge Function execution times
- Frontend response times
- Error rates

---

## Phase 6: Monitoring & Maintenance

### 6.1 Daily Checks

**Morning Rounds (9:00 AM):**
- [ ] Check new orders in Shopify Admin
- [ ] Review Gorgias support tickets
- [ ] Check `beauty_assistant_audit` for unusual activity
- [ ] Verify frontend loads without errors

### 6.2 Weekly Checks

**Clinical Audit (Mondays):**
- [ ] Run health checks: `.\scripts\health-checks.ps1`
- [ ] Review Edge Function logs
- [ ] Check database performance
- [ ] Verify product inventory levels
- [ ] Update product tags if needed

### 6.3 Monthly Checks

**System Review:**
- [ ] Review analytics (Google Analytics, Shopify Reports)
- [ ] Audit security (dependencies, API keys)
- [ ] Performance optimization review
- [ ] Content updates (new products, blog posts)
- [ ] Backup database

---

## Phase 7: Gorgias Integration

### 7.1 Setup

1. Install Gorgias app from Shopify App Store
2. Connect to Asper Beauty Store
3. Configure ticket views:
   - Medical/Product questions (tag: `Concern_*`)
   - Support/Logistics (shipping, COD, returns)

### 7.2 Automation Rules

**Authenticity Guarantee Macro:**
- **Triggers:** Keywords: `fake`, `original`, `real`, `authentic`
- **Response:** "All products sold on Asper Beauty Shop are 100% authentic..."
- **Assign to:** Dr. Sami persona for medical questions

**Order Status Automation:**
- **Trigger:** Keywords: `order status`, `where is my order`, `tracking`
- **Action:** Fetch order status via Edge Function
- **Response:** Template with order details

### 7.3 Training

Train support team on:
- Gorgias interface
- Ticket assignment rules
- Response templates
- Escalation procedures (when to involve Dr. Sami persona)

---

## Phase 8: Post-Launch Optimization

### 8.1 Week 1

- Monitor all systems closely
- Address any critical bugs immediately
- Collect user feedback
- Optimize performance based on real usage data

### 8.2 Month 1

- Analyze conversion rates
- Review most popular products
- Optimize product descriptions based on search queries
- A/B test checkout flow improvements

### 8.3 Ongoing

- Regular security updates
- Dependency updates
- Feature enhancements based on user feedback
- Seasonal promotions and campaigns

---

## Troubleshooting

### Common Issues

**Issue: Products not showing on frontend**
- Check Shopify API connection
- Verify products are published
- Check API token permissions
- Review browser console for errors

**Issue: Beauty Assistant not responding**
- Check Edge Function logs
- Verify OpenAI API key is set
- Check database connectivity
- Review audit table for errors

**Issue: Checkout fails**
- Verify Shopify Storefront API token
- Check payment gateway configuration
- Review Shopify order logs
- Test with different browsers

**Issue: RTL layout broken**
- Check CSS for hardcoded `left`/`right` values
- Use `start`/`end` instead of `left`/`right`
- Test with `dir="rtl"` attribute
- Review Tailwind RTL utilities

---

## Related Documentation

- [System Monitor](./SYSTEM_MONITOR.md) - System monitoring procedures
- [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md) - Health check procedures
- [Next Steps](./NEXT_STEPS.md) - Deployment checklist
- [Shopify Tagging Protocol](./SHOPIFY_TAGGING_PROTOCOL.md) - Product tagging guidelines
- [Beauty Assistant Deploy](./BEAUTY_ASSISTANT_DEPLOY.md) - Edge Function deployment
