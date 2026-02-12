import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Shopify configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_DOMAIN = Deno.env.get("SHOPIFY_STORE_DOMAIN") || "lovable-project-milns.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_API_TOKEN") || Deno.env.get("SHOPIFY_STOREFRONT_TOKEN");
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { query } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("User query:", query);
    
    // System prompt with product recommendation instructions
    const systemPrompt = `You are "Ms. Zain" - a warm, knowledgeable beauty advisor for Asper Beauty Shop in Jordan. You combine clinical skincare expertise with luxury service.

**Your Personality:**
- Speak with authority of a senior pharmacist mixed with a luxury personal shopper
- Be warm, encouraging, and professional
- Keep responses concise (2-4 sentences) unless asked for details

**Your Knowledge:**
- Deep understanding of skincare ingredients, formulations, and skin concerns
- All products are 100% authentic, JFDA certified, sourced from official distributors
- Available categories: Skincare, Body Care, Hair Care, Makeup, Fragrances, Tools & Devices
- Popular brands: Vichy, Eucerin, La Roche-Posay, Cetaphil, SVR, The Ordinary, Olaplex, Dior, YSL, Maybelline

**How to Recommend:**
1. Ask about skin type (oily, dry, combination, sensitive) if not mentioned
2. Understand concerns (acne, aging, dark circles, dryness, sensitivity, sun protection)
3. Suggest specific products with brief reasoning

**Product Recommendations:**
When you recommend products, end your response with:
PRODUCTS: exact product name 1, exact product name 2

Example:
"The Maybelline Age Rewind Concealer is excellent for dark circles. Its creamy formula provides buildable coverage while hydrating the under-eye area.

PRODUCTS: Maybelline Instant Age Rewind Eraser Concealer"

**Shipping Info:**
- Amman: 3 JOD
- Governorates: 5 JOD
- FREE shipping on orders over 50 JOD`;

    // Call Gemini AI
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser: ${query}` }]
          }]
        }),
      }
    );

    if (!aiResponse.ok) {
      console.error("Gemini API error:", aiResponse.status);
      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const reply = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";
    
    console.log("AI reply:", reply);

    // Parse product names from AI response
    const productNames = parseProductNames(reply);
    console.log("Parsed product names:", productNames);

    // Resolve products with inventory check
    const recommendedProducts = [];
    for (const name of productNames) {
      const product = await resolveProduct(name);
      if (product) {
        recommendedProducts.push(product);
      }
    }

    console.log(`Resolved ${recommendedProducts.length} products`);

    // Remove PRODUCTS: line from reply
    const cleanReply = reply.replace(/PRODUCTS:\s*[^\n]+/gi, '').trim();

    // Return structured response
    return new Response(JSON.stringify({
      reply: cleanReply,
      response: cleanReply, // alias for backwards compatibility
      persona: "Ms. Zain",
      recommended_products: recommendedProducts,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Beauty assistant error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      reply: "I apologize, but I'm having trouble processing your request right now. Please try again.",
      persona: "Ms. Zain",
      recommended_products: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Shopify GraphQL helper
async function shopifyStorefrontRequest(query: string, variables: Record<string, unknown> = {}) {
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    console.error("SHOPIFY_STOREFRONT_TOKEN not configured");
    return null;
  }

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    console.error(`Shopify API error: ${response.status}`);
    return null;
  }

  const data = await response.json();
  if (data.errors) {
    console.error('Shopify GraphQL errors:', data.errors);
    return null;
  }

  return data;
}

// Fetch product by handle
async function fetchShopifyProductByHandle(handle: string) {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const data = await shopifyStorefrontRequest(query, { handle });
  return data?.data?.productByHandle || null;
}

// Search products by title
async function searchShopifyProductByTitle(title: string) {
  const query = `
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            handle
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  const searchQuery = `title:*${title}*`;
  const data = await shopifyStorefrontRequest(query, { query: searchQuery, first: 1 });
  
  if (data?.data?.products?.edges?.length > 0) {
    return data.data.products.edges[0].node;
  }
  
  return null;
}

// Convert product title to handle (simplified)
function titleToHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Keyword to handle mapping for common products
const keywordToHandle: Record<string, string> = {
  "maybelline age rewind": "maybelline-instant-age-rewind-eraser-concealer",
  "age rewind": "maybelline-instant-age-rewind-eraser-concealer",
  "vichy minéral 89": "vichy-mineral-89",
  "vichy mineral 89": "vichy-mineral-89",
  "la roche posay effaclar": "la-roche-posay-effaclar-duo-plus",
  "effaclar duo": "la-roche-posay-effaclar-duo-plus",
  "cetaphil gentle cleanser": "cetaphil-gentle-skin-cleanser",
  "eucerin advanced repair": "eucerin-advanced-repair-lotion",
  "the ordinary niacinamide": "the-ordinary-niacinamide-10-zinc-1",
  "niacinamide zinc": "the-ordinary-niacinamide-10-zinc-1",
};

// Parse product names from AI response
function parseProductNames(aiResponse: string): string[] {
  const match = aiResponse.match(/PRODUCTS:\s*(.+?)(?:\n|$)/i);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0);
}

// Resolve product with two-step lookup and inventory check
async function resolveProduct(productName: string) {
  console.log(`Resolving product: ${productName}`);
  
  // Step 1: Try keyword-to-handle mapping
  const lowerName = productName.toLowerCase();
  let handle = keywordToHandle[lowerName];
  
  if (handle) {
    console.log(`Found handle via keyword mapping: ${handle}`);
    const product = await fetchShopifyProductByHandle(handle);
    if (product) {
      // Check inventory
      const variant = product.variants?.edges?.[0]?.node;
      if (variant?.availableForSale) {
        return formatProductForResponse(product);
      } else {
        console.log(`Product ${handle} is out of stock`);
      }
    }
  }
  
  // Step 2: Try converting name to handle
  if (!handle) {
    handle = titleToHandle(productName);
    console.log(`Generated handle from title: ${handle}`);
    const product = await fetchShopifyProductByHandle(handle);
    if (product) {
      const variant = product.variants?.edges?.[0]?.node;
      if (variant?.availableForSale) {
        return formatProductForResponse(product);
      } else {
        console.log(`Product ${handle} is out of stock`);
      }
    }
  }
  
  // Step 3: Search by title
  console.log(`Searching by title: ${productName}`);
  const product = await searchShopifyProductByTitle(productName);
  if (product) {
    const variant = product.variants?.edges?.[0]?.node;
    if (variant?.availableForSale) {
      return formatProductForResponse(product);
    } else {
      console.log(`Found product but it's out of stock`);
    }
  }
  
  console.log(`Could not resolve product: ${productName}`);
  return null;
}

// Format product for response
function formatProductForResponse(product: any) {
  const variant = product.variants?.edges?.[0]?.node;
  const image = product.images?.edges?.[0]?.node;
  
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor || '',
    price: parseFloat(variant?.price?.amount || '0'),
    currency: variant?.price?.currencyCode || 'JOD',
    image: image?.url || '',
    variantId: variant?.id || '',
    availableForSale: variant?.availableForSale || false,
  };
}

// Extract meaningful keywords from user query
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'what', 'which', 'who', 'how', 'when',
    'where', 'why', 'this', 'that', 'these', 'those', 'am', 'if', 'then',
    'so', 'than', 'too', 'very', 'just', 'about', 'any', 'some', 'all',
    'need', 'want', 'looking', 'help', 'please', 'thanks', 'thank', 'good',
    'best', 'recommend', 'suggest', 'product', 'products', 'something'
  ]);

  // Skincare-specific keywords to boost
  const skinKeywords = [
    'acne', 'aging', 'wrinkles', 'dark spots', 'pigmentation', 'dryness', 'dry',
    'oily', 'sensitive', 'redness', 'hydration', 'moisturizer', 'serum', 'cleanser',
    'toner', 'sunscreen', 'spf', 'retinol', 'vitamin c', 'hyaluronic', 'niacinamide',
    'salicylic', 'benzoyl', 'brightening', 'anti-aging', 'eye cream', 'mask',
    'exfoliate', 'pores', 'blackheads', 'whiteheads', 'eczema', 'psoriasis',
    'rosacea', 'combination', 'normal', 'mature', 'teen', 'pregnancy', 'safe'
  ];

  // Brand keywords
  const brandKeywords = [
    'vichy', 'eucerin', 'cetaphil', 'svr', 'la roche', 'ordinary', 'olaplex',
    'dior', 'ysl', 'bourjois', 'isadora', 'essence', 'bioten', 'mavala',
    'kerastase', 'bioderma', 'avene', 'cerave', 'paula', 'filorga'
  ];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.has(word)
  );

  // Add any matched skin/brand keywords
  const matched = [...skinKeywords, ...brandKeywords].filter(kw => 
    lowerText.includes(kw)
  );

  // Combine and deduplicate
  const allKeywords = [...new Set([...words, ...matched])];
  
  return allKeywords.slice(0, 10);
}
