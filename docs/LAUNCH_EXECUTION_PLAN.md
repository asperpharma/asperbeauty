# Launch Execution Plan

**Purpose:** Comprehensive guide for launching and maintaining the Asper Beauty Shop with bulk imports, secrets management, and live testing.

---

## Pre-Launch Checklist

### System Prerequisites
- [ ] Supabase project created and configured
- [ ] Shopify store set up with products
- [ ] Domain configured and SSL active
- [ ] All API keys and tokens generated
- [ ] Development environment tested

### Data Requirements
- [ ] Product catalog ready (CSV or Shopify export)
- [ ] Product images hosted and accessible
- [ ] Product tags following tagging protocol
- [ ] Brand information complete
- [ ] Pricing and inventory finalized

---

## Phase 1: Secrets Management

### Supabase Secrets Setup

All sensitive keys should be stored as Supabase secrets, not in code or .env files in production.

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rgehleqcubtmcwyipyvi

# Set Edge Function secrets
supabase secrets set OPENAI_API_KEY="your_openai_key"
supabase secrets set SHOPIFY_ADMIN_TOKEN="your_shopify_admin_token"
supabase secrets set SHOPIFY_STORE_DOMAIN="lovable-project-milns.myshopify.com"
supabase secrets set SHOPIFY_STOREFRONT_TOKEN="your_storefront_token"

# Verify secrets are set (won't show values)
supabase secrets list
```

### Frontend Environment Variables

For the React frontend, create `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Shopify Configuration
VITE_SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token_here

# Optional: Analytics
VITE_GA_TRACKING_ID=your_ga_id
```

**Important:** Never commit `.env` file to git. It's already in `.gitignore`.

---

## Phase 2: Bulk Product Import

### Prepare Product Data

1. **Export from Shopify (if migrating):**
   ```bash
   # Use Shopify Admin → Products → Export
   # Choose CSV format with all product fields
   ```

2. **Prepare CSV with required fields:**
   - Handle (URL slug)
   - Title
   - Body (HTML description)
   - Vendor (Brand)
   - Product Type
   - Tags (including Concern_* and Step_* tags)
   - Variant SKU
   - Variant Price
   - Variant Inventory Qty
   - Image Src

3. **Validate tagging:**
   - Ensure all products have appropriate `Concern_*` tags (e.g., Concern_Acne, Concern_Aging)
   - Add `Step_*` tags for routine building (e.g., Step_Cleanser, Step_Moisturizer)
   - See [SHOPIFY_TAGGING_PROTOCOL.md](./SHOPIFY_TAGGING_PROTOCOL.md) for full details

### Run Bulk Upload

```bash
# Deploy bulk-product-upload Edge Function
supabase functions deploy bulk-product-upload

# Trigger the upload (example with curl)
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "shopify",
    "sync_mode": "full",
    "dry_run": false
  }'

# Monitor progress in Supabase Dashboard → Edge Functions → Logs
```

### Verify Upload

```sql
-- Check product count
SELECT COUNT(*) FROM products;

-- Verify product details
SELECT handle, title, vendor, tags 
FROM products 
LIMIT 10;

-- Check for products with concern tags
SELECT title, tags 
FROM products 
WHERE tags LIKE '%Concern_%';
```

---

## Phase 3: Database Initialization

### Create Required Tables

Tables should already exist from migrations, but verify:

```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'products',
    'concierge_profiles',
    'beauty_assistant_audit',
    'consultations'
  );
```

### Seed Initial Data (if needed)

```sql
-- Example: Add test consultation data
INSERT INTO concierge_profiles (
  user_id,
  skin_concern,
  recommended_routine,
  created_at
) VALUES (
  'test-user-1',
  'Acne',
  '{"products": ["vichy-normaderm", "la-roche-posay-effaclar"]}'::jsonb,
  NOW()
);
```

---

## Phase 4: Edge Functions Deployment

### Deploy All Functions

```bash
# Deploy beauty-assistant (primary AI function)
supabase functions deploy beauty-assistant

# Deploy supporting functions
supabase functions deploy bulk-product-upload
supabase functions deploy create-cod-order
supabase functions deploy get-order-status
supabase functions deploy enrich-products
supabase functions deploy generate-embeddings

# Verify deployments
supabase functions list
```

### Test Each Function

See [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md) for detailed testing instructions.

---

## Phase 5: Frontend Deployment

### Build and Deploy

```bash
# Install dependencies
npm ci

# Run checks
npm run lint
npm run build

# Preview production build locally
npm run preview

# Deploy (method depends on hosting)
# If using Lovable: Push to main branch
# If using Vercel/Netlify: Follow their deployment flow
```

### Verify Frontend

- [ ] Site loads at production URL
- [ ] Products display correctly
- [ ] Search works
- [ ] Cart functionality works
- [ ] Checkout redirects to Shopify
- [ ] Mobile responsive
- [ ] RTL/Arabic mode works

---

## Phase 6: Live-Fire Testing

### Test Scenarios

#### 1. Product Discovery
- [ ] Browse products by category
- [ ] Search for specific products
- [ ] Filter by brand
- [ ] View product details

#### 2. Beauty Assistant (AI Chatbot)
```bash
# Test with various queries
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have acne-prone skin, what do you recommend?"}'

# Expected: Recommendations with Concern_Acne tagged products
```

#### 3. Shopping Flow
- [ ] Add product to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Proceed to checkout (Shopify)
- [ ] Complete test order (use test payment)

#### 4. Order Creation (COD)
```bash
# Test COD order creation
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/create-cod-order" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "email": "test@example.com",
      "phone": "+1234567890"
    },
    "items": [
      {"variant_id": "12345", "quantity": 1}
    ],
    "shipping_address": {
      "address1": "123 Test St",
      "city": "Test City",
      "country": "US",
      "zip": "12345"
    }
  }'
```

#### 5. Integration Testing
- [ ] Verify products sync from Shopify
- [ ] Check Beauty Assistant logs in `beauty_assistant_audit`
- [ ] Confirm orders appear in Shopify Admin
- [ ] Test Gorgias ticket creation (if integrated)

---

## Phase 7: Monitoring Setup

### Enable Logging

Ensure all Edge Functions have proper logging:

```typescript
// In each Edge Function
console.log('Function started:', { params });
console.error('Error occurred:', error);

// Use structured logging
console.log(JSON.stringify({
  event: 'product_recommendation',
  user_id: userId,
  products: recommendedProducts.map(p => p.id)
}));
```

### Set Up Alerts (Optional)

Create alerts for critical events:

```sql
-- Create view for monitoring
CREATE VIEW critical_errors AS
SELECT 
  created_at,
  function_name,
  error_message
FROM beauty_assistant_audit
WHERE error_message IS NOT NULL
  AND created_at > NOW() - INTERVAL '1 hour';
```

---

## Phase 8: Go Live

### Pre-Launch Final Checks
- [ ] All secrets configured
- [ ] Products imported and verified
- [ ] Edge Functions deployed and tested
- [ ] Frontend deployed and tested
- [ ] DNS and SSL configured
- [ ] Analytics tracking enabled
- [ ] Backup strategy in place

### Launch Communication
- [ ] Notify team of launch
- [ ] Prepare rollback plan
- [ ] Monitor systems closely for first 24 hours
- [ ] Document any issues encountered

### First 24 Hours Monitoring
- [ ] Check error logs hourly
- [ ] Monitor response times
- [ ] Track conversion funnel
- [ ] Review Beauty Assistant interactions
- [ ] Check Shopify order flow

---

## Post-Launch Maintenance

### Daily Tasks
- Run morning rounds (see [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md))
- Check Gorgias tickets
- Review new orders

### Weekly Tasks
- Run health checks: `.\scripts\health-checks.ps1`
- Review analytics and metrics
- Check for product updates in Shopify
- Update product embeddings if needed

### Monthly Tasks
- Security updates for dependencies
- Review and optimize slow queries
- Analyze Beauty Assistant performance
- Update documentation

---

## Rollback Plan

If critical issues arise:

1. **Immediate:** Take frontend offline or show maintenance page
2. **Database:** Restore from latest backup if data corruption
3. **Edge Functions:** Redeploy previous working version
4. **Frontend:** Revert to previous commit and redeploy

```bash
# Quick rollback commands
git revert HEAD
git push origin main

# Redeploy previous Edge Function version
git checkout HEAD~1
supabase functions deploy beauty-assistant
git checkout main
```

---

## Success Metrics

Track these KPIs post-launch:

- **Technical:**
  - Uptime: >99.9%
  - API response time: <500ms (p95)
  - Build success rate: 100%
  - Error rate: <1%

- **Business:**
  - Conversion rate
  - Average order value
  - Beauty Assistant engagement rate
  - Customer support ticket volume

---

## Related Documentation
- [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) - Ongoing monitoring
- [HEALTH-CHECK-PROTOCOL.md](./HEALTH-CHECK-PROTOCOL.md) - Health checks
- [BEAUTY_ASSISTANT_DEPLOY.md](./BEAUTY_ASSISTANT_DEPLOY.md) - AI deployment
- [SHOPIFY_TAGGING_PROTOCOL.md](./SHOPIFY_TAGGING_PROTOCOL.md) - Product tagging
