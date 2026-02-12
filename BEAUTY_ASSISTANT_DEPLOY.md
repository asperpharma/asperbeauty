# Beauty Assistant Edge Function - Deployment Guide

## Overview

The `beauty-assistant` Edge Function provides an AI-powered beauty advisor service with Shopify product integration. It uses Google Gemini AI to provide personalized skincare and beauty recommendations, with automatic product resolution and inventory checking via Shopify Storefront API.

## Features

- **AI-Powered Recommendations**: Powered by Google Gemini AI with "Ms. Zain" persona
- **Product Search Fallback**: Two-step product lookup with inventory guardrails
  1. Direct handle lookup via keyword mapping
  2. Search by product title via Shopify Storefront API
- **Inventory Guardrail**: Only returns in-stock products (`availableForSale: true`)
- **Structured Response**: Returns product recommendations with variant IDs for Quick Add functionality

## Required Secrets

Before deploying, configure the following Supabase secrets:

### 1. GEMINI_API_KEY
Your Google Gemini API key for AI responses.

**How to get it:**
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the key

### 2. SHOPIFY_STOREFRONT_API_TOKEN
Your Shopify Storefront Access Token for reading public product data.

**How to get it:**
- Log in to your Shopify Admin
- Navigate to **Settings → Apps and sales channels → Develop apps**
- Create a new app or select an existing one
- Go to **API credentials**
- Under **Storefront API**, configure the following scopes:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
- Click **Save**
- Copy the **Storefront API access token**

⚠️ **Security Note**: Storefront API tokens are designed for client-side use with read-only access to public data. However, **do not commit this token** to version control. If exposed, rotate it in Shopify Admin.

### 3. SHOPIFY_STORE_DOMAIN
Your Shopify store's permanent domain (e.g., `your-store.myshopify.com`).

**Example**: `lovable-project-milns.myshopify.com`

## Deployment Commands

### 1. Set Secrets

Replace the placeholder values with your actual credentials:

```bash
npx supabase secrets set \
  GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE" \
  SHOPIFY_STOREFRONT_API_TOKEN="YOUR_SHOPIFY_STOREFRONT_TOKEN_HERE" \
  SHOPIFY_STORE_DOMAIN="your-store.myshopify.com" \
  --project-ref YOUR_PROJECT_REF
```

**Example:**
```bash
npx supabase secrets set \
  GEMINI_API_KEY="AIzaSyAbc123..." \
  SHOPIFY_STOREFRONT_API_TOKEN="shpat_1234567890abcdef..." \
  SHOPIFY_STORE_DOMAIN="lovable-project-milns.myshopify.com" \
  --project-ref qqceibvalkoytafynwoc
```

### 2. Deploy Function

```bash
npx supabase functions deploy beauty-assistant --project-ref YOUR_PROJECT_REF
```

**Example:**
```bash
npx supabase functions deploy beauty-assistant --project-ref qqceibvalkoytafynwoc
```

## Validation

After deployment, test the function with a curl command:

```bash
curl -i -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/beauty-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"Does the Maybelline Age Rewind work for dark circles?"}'
```

**Example:**
```bash
curl -i -X POST https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"Does the Maybelline Age Rewind work for dark circles?"}'
```

### Expected Response

The function should return a JSON response with the following structure:

```json
{
  "reply": "The Maybelline Age Rewind Concealer is excellent for dark circles...",
  "response": "The Maybelline Age Rewind Concealer is excellent for dark circles...",
  "persona": "Ms. Zain",
  "recommended_products": [
    {
      "id": "gid://shopify/Product/123456789",
      "handle": "maybelline-instant-age-rewind-eraser-concealer",
      "title": "Maybelline Instant Age Rewind Eraser Concealer",
      "vendor": "Maybelline",
      "price": 12.99,
      "currency": "JOD",
      "image": "https://cdn.shopify.com/...",
      "variantId": "gid://shopify/ProductVariant/987654321",
      "availableForSale": true
    }
  ]
}
```

### Response Fields

- **`reply`**: AI-generated response text (cleaned, without PRODUCTS: line)
- **`response`**: Alias for `reply` (backwards compatibility)
- **`persona`**: Always set to `"Ms. Zain"`
- **`recommended_products`**: Array of resolved products with:
  - `id`: Shopify product ID
  - `handle`: Product URL handle
  - `title`: Product title
  - `vendor`: Brand/vendor name
  - `price`: Price as number
  - `currency`: Currency code (e.g., "JOD")
  - `image`: Product image URL
  - `variantId`: Shopify variant ID for Quick Add
  - `availableForSale`: Inventory status (always `true` due to guardrail)

## How It Works

### 1. AI Product Recommendation

The AI (Ms. Zain) is instructed to end product recommendations with:
```
PRODUCTS: exact product name 1, exact product name 2
```

Example:
```
The Maybelline Age Rewind Concealer is excellent for dark circles...

PRODUCTS: Maybelline Instant Age Rewind Eraser Concealer
```

### 2. Product Resolution (Two-Step Lookup)

For each product name in the `PRODUCTS:` line:

**Step 1: Keyword-to-Handle Mapping**
- Check predefined `keywordToHandle` mapping for common product names
- If found, fetch product by handle via `fetchShopifyProductByHandle()`

**Step 2: Generate Handle from Title**
- Convert product name to Shopify handle format (lowercase, hyphenated)
- Fetch product by generated handle

**Step 3: Search by Title**
- If handle lookup fails, search Shopify products by title using `searchShopifyProductByTitle()`
- Uses Shopify's search query: `title:*{product name}*`

### 3. Inventory Guardrail

- Only products with `availableForSale: true` are included in `recommended_products`
- Out-of-stock products are logged but excluded from the response

### 4. Response Construction

- Remove `PRODUCTS:` line from AI reply
- Return structured JSON with `reply`, `persona`, and `recommended_products`

## Troubleshooting

### Error: "GEMINI_API_KEY is not configured"
- Ensure the secret is set correctly: `npx supabase secrets list --project-ref YOUR_PROJECT_REF`
- Redeploy the function after setting secrets

### Error: "SHOPIFY_STOREFRONT_TOKEN not configured"
- The function checks both `SHOPIFY_STOREFRONT_API_TOKEN` and `SHOPIFY_STOREFRONT_TOKEN`
- Ensure one of these is set as a Supabase secret
- Verify the token is valid in Shopify Admin

### Empty `recommended_products`
- Check function logs: `npx supabase functions logs beauty-assistant --project-ref YOUR_PROJECT_REF`
- Verify products exist in Shopify
- Check if products are in stock
- Review AI response to ensure `PRODUCTS:` line is present

### Products Not Found
- Expand `keywordToHandle` mapping in `index.ts` for commonly recommended products
- Ensure product titles in Shopify match AI recommendations
- Check Shopify product handles match the expected format

## Maintenance

### Adding Product Mappings

To improve product resolution, add entries to the `keywordToHandle` object in `index.ts`:

```typescript
const keywordToHandle: Record<string, string> = {
  "product common name": "shopify-product-handle",
  "maybelline age rewind": "maybelline-instant-age-rewind-eraser-concealer",
  // Add more mappings...
};
```

### Updating AI Persona

Modify the `systemPrompt` in the main function to adjust Ms. Zain's:
- Personality and tone
- Product knowledge
- Recommendation approach
- Response format

## Security Considerations

1. **Token Rotation**: If `SHOPIFY_STOREFRONT_API_TOKEN` is exposed, rotate it immediately:
   - Shopify Admin → Apps → Your App → API credentials
   - Click "Regenerate token"
   - Update Supabase secrets
   - Redeploy function

2. **Authentication**: The function requires a valid Supabase `Authorization` header
   - Uses `Bearer` token authentication
   - Returns `401 Unauthorized` for missing/invalid tokens

3. **Rate Limiting**: Gemini AI may have rate limits
   - Monitor function logs for API errors
   - Implement caching if needed for frequently asked questions

## Support

For issues or questions:
- Check function logs: `npx supabase functions logs beauty-assistant`
- Review Shopify API documentation: https://shopify.dev/docs/api/storefront
- Review Gemini API documentation: https://ai.google.dev/docs
