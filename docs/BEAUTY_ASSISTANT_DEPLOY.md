# Beauty Assistant Deployment Guide

**Purpose:** Complete guide for deploying and testing the Beauty Assistant Edge Function - the AI-powered chatbot for personalized skincare recommendations.

---

## Overview

The Beauty Assistant is a Supabase Edge Function that uses OpenAI's GPT model to provide personalized skincare advice. It analyzes user queries, determines the appropriate persona (Dr. Sami for medical advice, Lina for product questions), and recommends products from the catalog based on skin concerns.

**Function Location:** `supabase/functions/beauty-assistant/`

---

## Prerequisites

### 1. Required Accounts & Keys
- ✅ Supabase project (ref: `rgehleqcubtmcwyipyvi`)
- ✅ OpenAI API key (for GPT-4 or GPT-3.5)
- ✅ Shopify Admin & Storefront API tokens
- ✅ Supabase CLI installed

### 2. Database Tables
Ensure these tables exist:
```sql
-- Products table (from Shopify sync)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE,
  title TEXT,
  description TEXT,
  vendor TEXT,
  tags TEXT,
  price NUMERIC,
  image_url TEXT
);

-- Audit log for tracking interactions
CREATE TABLE beauty_assistant_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id TEXT,
  user_message TEXT,
  persona_routed TEXT,
  response_preview TEXT,
  recommended_products JSONB,
  route TEXT,
  user_message_length INTEGER,
  error_message TEXT
);
```

---

## Deployment Steps

### Step 1: Install Supabase CLI

```bash
# Install via npm
npm install -g supabase

# Verify installation
supabase --version
```

### Step 2: Login and Link Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rgehleqcubtmcwyipyvi

# Verify link
supabase projects list
```

### Step 3: Set Environment Variables (Secrets)

```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY="sk-proj-..."

# Set Shopify credentials
supabase secrets set SHOPIFY_ADMIN_TOKEN="shpat_..."
supabase secrets set SHOPIFY_STORE_DOMAIN="lovable-project-milns.myshopify.com"
supabase secrets set SHOPIFY_STOREFRONT_TOKEN="your_storefront_token"

# Set Supabase URL (for database queries from function)
supabase secrets set SUPABASE_URL="https://rgehleqcubtmcwyipyvi.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Verify secrets (won't show values)
supabase secrets list
```

**Important:** Never commit secrets to git. Use Supabase secrets for production.

### Step 4: Deploy the Function

```bash
# Deploy beauty-assistant function
supabase functions deploy beauty-assistant

# Check deployment status
supabase functions list

# Expected output:
# ┌─────────────────────┬─────────────────┬───────────┬────────────────┐
# │ NAME                │ VERSION         │ STATUS    │ CREATED        │
# ├─────────────────────┼─────────────────┼───────────┼────────────────┤
# │ beauty-assistant    │ v1              │ ACTIVE    │ 2 minutes ago  │
# └─────────────────────┴─────────────────┴───────────┴────────────────┘
```

---

## Testing the Function

### Test 1: Basic Health Check

```bash
curl -i -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

**Expected Response:**
```json
{
  "reply": "Hello! I'm your beauty assistant. How can I help you today?",
  "persona": "Lina",
  "recommended_products": []
}
```

### Test 2: Medical Question (Dr. Sami Persona)

```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have severe acne and hyperpigmentation. What ingredients should I use?"
  }'
```

**Expected Response:**
```json
{
  "reply": "As Dr. Sami, I recommend looking for products with salicylic acid for acne...",
  "persona": "Dr. Sami",
  "recommended_products": [
    {
      "id": "...",
      "title": "La Roche-Posay Effaclar Duo+",
      "handle": "la-roche-posay-effaclar-duo",
      "reason": "Contains niacinamide and salicylic acid to treat acne and fade dark spots"
    }
  ]
}
```

### Test 3: Product Recommendation (Lina Persona)

```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What Vichy products are good for dry skin?",
    "context": {
      "skin_concerns": ["dryness"],
      "preferred_brands": ["Vichy"]
    }
  }'
```

**Expected Response:**
```json
{
  "reply": "For dry skin, I recommend these Vichy products...",
  "persona": "Lina",
  "recommended_products": [
    {
      "id": "...",
      "title": "Vichy Aqualia Thermal Rich Cream",
      "handle": "vichy-aqualia-thermal-rich",
      "reason": "Deeply hydrating formula perfect for dry skin"
    }
  ]
}
```

### Test 4: Conversation Context

```bash
# First message
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to start a skincare routine",
    "conversation_id": "user123_session1"
  }'

# Follow-up message
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What cleanser do you recommend?",
    "conversation_id": "user123_session1"
  }'
```

**Expected:** Second response references context from first message.

---

## Monitoring & Logs

### View Logs in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi)
2. Navigate to **Edge Functions**
3. Click on **beauty-assistant**
4. View **Logs** tab

### Check Audit Table

```sql
-- View recent interactions
SELECT 
  created_at,
  user_message,
  persona_routed,
  response_preview,
  error_message
FROM beauty_assistant_audit
ORDER BY created_at DESC
LIMIT 20;

-- Check for errors
SELECT 
  created_at,
  user_message,
  error_message
FROM beauty_assistant_audit
WHERE error_message IS NOT NULL
ORDER BY created_at DESC;

-- Persona distribution
SELECT 
  persona_routed,
  COUNT(*) as count
FROM beauty_assistant_audit
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY persona_routed;
```

### Performance Metrics

```sql
-- Average response time (if tracked)
SELECT 
  AVG(response_time_ms) as avg_response_time,
  MAX(response_time_ms) as max_response_time,
  MIN(response_time_ms) as min_response_time
FROM beauty_assistant_audit
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Product recommendation rate
SELECT 
  COUNT(*) FILTER (WHERE recommended_products IS NOT NULL) as with_products,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE recommended_products IS NOT NULL) / COUNT(*), 2) as percentage
FROM beauty_assistant_audit
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## Function Configuration

### Timeout & Memory Settings

Default Edge Function settings:
- **Timeout:** 30 seconds
- **Memory:** 512 MB

To adjust (in function code):
```typescript
// In index.ts
Deno.serve({
  timeout: 30000, // 30 seconds
}, async (req) => {
  // Function logic
});
```

### CORS Configuration

Ensure CORS headers are set for frontend access:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In response
return new Response(
  JSON.stringify(data),
  { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200 
  }
);
```

---

## Persona Routing Logic

The Beauty Assistant uses keywords to determine which persona to activate:

### Dr. Sami Triggers (Medical/Professional)
- Medical terms: "acne", "rosacea", "eczema", "dermatitis"
- Questions about: "is it safe", "can I use", "prescription"
- Symptoms: "burning", "itching", "allergic reaction"

### Lina Triggers (Product Shopping)
- Product inquiries: "recommend", "buy", "shop", "price"
- Brand questions: "Vichy", "La Roche-Posay", "CeraVe"
- Routine building: "morning routine", "night routine", "steps"

### Default: General Assistant
- Greetings: "hello", "hi"
- Navigation: "how to", "where can I"
- General questions

---

## Troubleshooting

### Issue: Function Returns 500 Error

**Check:**
1. Secrets are set correctly: `supabase secrets list`
2. OpenAI API key is valid and has credits
3. Database tables exist
4. Review function logs for specific error

**Solution:**
```bash
# Redeploy function
supabase functions deploy beauty-assistant --no-verify-jwt

# Check logs immediately after
supabase functions logs beauty-assistant --tail
```

### Issue: No Product Recommendations

**Check:**
1. Products table has data: `SELECT COUNT(*) FROM products;`
2. Products have proper tags (see SHOPIFY_TAGGING_PROTOCOL.md)
3. Query logic is finding matches

**Solution:**
```sql
-- Verify products have concern tags
SELECT title, tags 
FROM products 
WHERE tags LIKE '%Concern_%'
LIMIT 10;

-- If empty, run bulk-product-upload
```

### Issue: Slow Response Times

**Check:**
1. OpenAI API latency
2. Database query performance
3. Large conversation context

**Solution:**
- Use GPT-3.5-turbo instead of GPT-4 for faster responses
- Add database indexes on frequently queried fields
- Limit conversation context to last 5 messages

---

## Integration with Frontend

### React Hook Example

```typescript
// src/hooks/useBeautyAssistant.ts
import { useState } from 'react';

export function useBeautyAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/beauty-assistant`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
```

### Usage in Component

```typescript
// src/components/ChatWidget.tsx
import { useBeautyAssistant } from '@/hooks/useBeautyAssistant';

export function ChatWidget() {
  const { sendMessage, loading } = useBeautyAssistant();
  const [messages, setMessages] = useState([]);

  const handleSend = async (text: string) => {
    const response = await sendMessage(text);
    if (response) {
      setMessages(prev => [...prev, 
        { role: 'user', content: text },
        { role: 'assistant', content: response.reply, products: response.recommended_products }
      ]);
    }
  };

  // Render chat UI...
}
```

---

## Updating the Function

### Making Changes

1. Edit code in `supabase/functions/beauty-assistant/index.ts`
2. Test locally if possible
3. Redeploy:
   ```bash
   supabase functions deploy beauty-assistant
   ```
4. Test with curl commands above
5. Monitor logs for issues

### Version Control

```bash
# Before changes
git checkout -b feature/update-beauty-assistant

# After changes and testing
git add supabase/functions/beauty-assistant/
git commit -m "feat: improve product recommendations"
git push origin feature/update-beauty-assistant

# Deploy from main branch after merge
git checkout main
git pull
supabase functions deploy beauty-assistant
```

---

## Performance Best Practices

1. **Cache frequent queries** - Store popular products in memory
2. **Limit conversation history** - Only send last 3-5 messages to OpenAI
3. **Use streaming** - Stream responses for better UX
4. **Implement rate limiting** - Prevent abuse
5. **Monitor costs** - OpenAI API calls can add up

---

## Security Considerations

- ✅ Never expose service role key in frontend
- ✅ Use anon key for client requests
- ✅ Validate and sanitize user input
- ✅ Implement rate limiting
- ✅ Log all interactions for audit trail
- ✅ Keep OpenAI API key in Supabase secrets only

---

## Related Documentation
- [SYSTEM_MONITOR.md](./SYSTEM_MONITOR.md) - Monitoring the assistant
- [SHOPIFY_TAGGING_PROTOCOL.md](./SHOPIFY_TAGGING_PROTOCOL.md) - Product tags used by AI
- [LAUNCH_EXECUTION_PLAN.md](./LAUNCH_EXECUTION_PLAN.md) - Initial deployment
