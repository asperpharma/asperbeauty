# Beauty Assistant Deployment Guide

**Purpose:** Deploy and configure the Beauty Assistant Edge Function for AI-powered product recommendations.

---

## Overview

The Beauty Assistant is a Supabase Edge Function that provides:
- AI-powered skincare consultation
- Personalized product recommendations
- Routine building based on skin concerns
- Multi-persona responses (Dr. Sami for medical, friendly assistant for general)

**Edge Function:** `beauty-assistant`
**Location:** `supabase/functions/beauty-assistant/`
**Endpoint:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`

---

## Prerequisites

### 1. Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Verify installation
supabase --version
```

### 2. Required API Keys

You'll need:
- **OpenAI API Key** - For AI responses ([Get it here](https://platform.openai.com/api-keys))
- **Supabase Anon Key** - From your project settings
- **Supabase Service Role Key** - From your project settings (for admin operations)

### 3. Environment Setup

**Local development (.env.local):**
```bash
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Production (Supabase Secrets):**
Configure in Supabase Dashboard → Settings → Edge Functions → Secrets

---

## Deployment Steps

### Step 1: Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication.

### Step 2: Link to Project

```bash
supabase link --project-ref rgehleqcubtmcwyipyvi
```

### Step 3: Set Secrets

```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key

# Verify secrets are set
supabase secrets list
```

### Step 4: Deploy Function

```bash
# Deploy beauty-assistant function
supabase functions deploy beauty-assistant

# Or deploy all functions
supabase functions deploy
```

**Expected output:**
```
Deploying function beauty-assistant...
✓ Function deployed successfully
URL: https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant
```

---

## Testing

### 1. Test Deployment

```bash
# Basic health check
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'
```

**Expected response:**
```json
{
  "reply": "Hello! I'm your beauty assistant...",
  "persona": "friendly-assistant"
}
```

### 2. Test Skin Concern Routing

```bash
# Test acne concern
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have oily skin and acne. What products should I use?"
  }'
```

**Expected response:**
```json
{
  "reply": "For oily, acne-prone skin, I recommend...",
  "persona": "dr-sami",
  "recommended_products": [
    {
      "id": "123",
      "title": "Vichy Normaderm Cleanser",
      "handle": "vichy-normaderm-cleanser",
      "tags": ["Concern_Acne", "Step_Cleanse"]
    }
  ]
}
```

### 3. Test Product Recommendations

```bash
# Test with specific skin type
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have dry skin. Build me a morning routine.",
    "skin_type": "dry"
  }'
```

### 4. Test Audit Logging

After running tests, verify audit logs are created:

```sql
-- In Supabase Dashboard → SQL Editor
SELECT * FROM beauty_assistant_audit 
ORDER BY created_at DESC 
LIMIT 10;
```

**Expected columns:**
- `user_message` - User's input
- `bot_response` - AI's reply
- `persona_routed` - Which persona handled the request
- `recommended_products` - Products recommended (if any)
- `created_at` - Timestamp

---

## Function Configuration

### 1. Personas

The function uses multiple personas:

**Dr. Sami (Medical Expert):**
- Triggers: Medical concerns, skin conditions, treatment advice
- Keywords: acne, rosacea, eczema, dermatology, medical, treatment
- Tone: Professional, authoritative, evidence-based

**Friendly Assistant:**
- Triggers: General questions, product inquiries, shopping help
- Keywords: buy, price, recommend, which product, how to use
- Tone: Warm, helpful, conversational

### 2. Product Matching

The function matches products based on:
- Skin concerns (`Concern_*` tags)
- Skin type (`SkinType_*` tags)
- Routine step (`Step_*` tags)
- Ingredients (`Ingredient_*` tags)

**Matching algorithm:**
1. Extract concerns from user message
2. Query Shopify for products with matching tags
3. Filter by skin type if provided
4. Sort by relevance and popularity
5. Build routine in correct order (Cleanse → Tone → Treat → Moisturize → Protect)

### 3. Response Format

```typescript
interface BeautyAssistantResponse {
  reply: string;                    // AI-generated response
  persona?: string;                 // "dr-sami" | "friendly-assistant"
  recommended_products?: Product[]; // Recommended products
  skin_concern?: string;            // Detected concern
  routine?: {                       // Suggested routine
    am: Product[];
    pm: Product[];
  };
}
```

---

## Monitoring

### 1. Function Logs

View logs in Supabase Dashboard:
1. Go to **Edge Functions**
2. Select **beauty-assistant**
3. Click **Logs**

Filter logs by:
- Status code (200, 400, 500)
- Time range
- Log level (info, error)

### 2. Audit Table

Monitor conversations in `beauty_assistant_audit` table:

```sql
-- Daily conversation count
SELECT 
  DATE(created_at) as date,
  COUNT(*) as conversations,
  COUNT(DISTINCT user_id) as unique_users
FROM beauty_assistant_audit
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top concerns
SELECT 
  skin_concern,
  COUNT(*) as count
FROM beauty_assistant_audit
WHERE skin_concern IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY skin_concern
ORDER BY count DESC
LIMIT 10;

-- Average response time
SELECT 
  AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_response_time_seconds
FROM beauty_assistant_audit
WHERE completed_at IS NOT NULL
  AND created_at > NOW() - INTERVAL '24 hours';
```

### 3. Error Monitoring

Check for errors:

```sql
-- Recent errors
SELECT 
  created_at,
  user_message,
  error_message
FROM beauty_assistant_audit
WHERE error_message IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;
```

---

## Troubleshooting

### Issue: "OpenAI API key not found"

**Solution:**
```bash
# Set the secret
supabase secrets set OPENAI_API_KEY=sk-your-key

# Redeploy function
supabase functions deploy beauty-assistant
```

### Issue: "No products found"

**Possible causes:**
1. Products not synced to Shopify
2. Products missing required tags
3. Shopify API token invalid

**Solution:**
1. Verify products exist in Shopify Admin
2. Check products have `Concern_*` and `Step_*` tags
3. Test Shopify API connection:
```bash
curl -X POST "https://lovable-project-milns.myshopify.com/api/2025-01/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query": "{products(first: 5) {edges {node {title}}}}"}'
```

### Issue: "Timeout error"

**Possible causes:**
1. OpenAI API slow to respond
2. Large product catalog causing slow queries
3. Database connection issues

**Solution:**
1. Increase function timeout in `supabase/functions/beauty-assistant/index.ts`:
```typescript
Deno.serve({
  handler: handler,
  timeout: 30000 // 30 seconds
});
```

2. Optimize product queries:
   - Add database indexes
   - Cache frequently accessed products
   - Limit products returned to top 20

### Issue: "CORS error in browser"

**Solution:**
Add CORS headers in function response:
```typescript
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
});
```

---

## Local Development

### 1. Start Supabase Locally

```bash
# Start local Supabase
supabase start

# This will start:
# - PostgreSQL database
# - Edge Functions runtime
# - Studio (local dashboard)
```

### 2. Serve Function Locally

```bash
# Serve beauty-assistant function
supabase functions serve beauty-assistant --env-file .env.local

# Or serve all functions
supabase functions serve --env-file .env.local
```

### 3. Test Locally

```bash
# Test local function
curl -i -X POST "http://localhost:54321/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_LOCAL_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'
```

### 4. Debug

Add logging in function code:
```typescript
console.log('Received message:', message);
console.log('Detected concern:', concern);
console.log('Found products:', products.length);
```

View logs in terminal where function is running.

---

## Performance Optimization

### 1. Caching

Implement caching for frequent queries:

```typescript
// Cache product catalog in memory
let productCache = null;
let cacheExpiry = null;

async function getProducts() {
  if (productCache && cacheExpiry > Date.now()) {
    return productCache;
  }
  
  // Fetch from Shopify
  const products = await fetchFromShopify();
  productCache = products;
  cacheExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes
  
  return products;
}
```

### 2. Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Check rate limit
const rateLimitKey = `ratelimit:${userId}:${Date.now()}`;
const requestCount = await redis.incr(rateLimitKey);
await redis.expire(rateLimitKey, 60); // 1 minute window

if (requestCount > 10) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

### 3. Response Streaming

For long responses, use streaming:

```typescript
// Stream OpenAI response
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: messages,
  stream: true
});

return new Response(stream, {
  headers: { 'Content-Type': 'text/event-stream' }
});
```

---

## Security

### 1. Input Validation

Always validate user input:

```typescript
// Validate message
if (!message || typeof message !== 'string') {
  return new Response('Invalid message', { status: 400 });
}

if (message.length > 1000) {
  return new Response('Message too long', { status: 400 });
}

// Sanitize input
const sanitizedMessage = message.trim().substring(0, 1000);
```

### 2. Authentication

Require authentication for sensitive operations:

```typescript
// Get user from JWT
const authHeader = req.headers.get('Authorization');
const token = authHeader?.replace('Bearer ', '');
const { data: { user } } = await supabase.auth.getUser(token);

if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

### 3. API Key Protection

Never expose API keys:
- ✅ Store in Supabase Secrets
- ✅ Access via environment variables
- ❌ Don't commit to git
- ❌ Don't log in responses

---

## Related Documentation

- [System Monitor](./SYSTEM_MONITOR.md) - System monitoring
- [Health Check Protocol](./HEALTH_CHECK_PROTOCOL.md) - Health checks
- [Launch Execution Plan](./LAUNCH_EXECUTION_PLAN.md) - Deployment procedures
- [Shopify Tagging Protocol](./SHOPIFY_TAGGING_PROTOCOL.md) - Product tagging
