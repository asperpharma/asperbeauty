import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT validation failed:", claimsError?.message || "No claims");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Extract the latest user message to find relevant products
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    
    // Search for relevant products based on user query
    let productContext = "";
    let matchedProducts: any[] = [];
    
    if (lastUserMessage) {
      // Extract keywords from user message
      const keywords = extractKeywords(lastUserMessage);
      console.log("Extracted keywords:", keywords);
      
      // Search products by keywords using text matching
      const { data: relevantProducts, error: searchError } = await supabaseClient
        .from("products")
        .select("*")
        .or(
          keywords.map(k => `title.ilike.%${k}%,brand.ilike.%${k}%,category.ilike.%${k}%,description.ilike.%${k}%`).join(",")
        )
        .limit(5);

      if (!searchError && relevantProducts && relevantProducts.length > 0) {
        console.log(`Found ${relevantProducts.length} relevant products`);
        matchedProducts = relevantProducts;
        
        productContext = `\n\n**Relevant Products from Our Store:**\n${relevantProducts.map(p => 
          `- **${p.title}** (${p.brand || 'Asper'}) - ${p.price} JOD${p.is_on_sale ? ` (${p.discount_percent}% OFF!)` : ''} - ${p.category}${p.skin_concerns?.length ? ` | Good for: ${p.skin_concerns.join(', ')}` : ''}`
        ).join('\n')}`;
      } else {
        // Fallback: search in documents table
        const { data: documents } = await supabaseClient
          .from("documents")
          .select("content, metadata")
          .limit(5);
        
        if (documents && documents.length > 0) {
          // Filter documents by keyword relevance
          const relevantDocs = documents.filter(doc => {
            const content = doc.content.toLowerCase();
            return keywords.some(k => content.includes(k.toLowerCase()));
          }).slice(0, 5);

          if (relevantDocs.length > 0) {
            // Convert document metadata to product format for cards
            matchedProducts = relevantDocs.map(doc => doc.metadata);
            
            productContext = `\n\n**Recommended Products:**\n${relevantDocs.map(doc => {
              const m = doc.metadata as any;
              return `- **${m.title}** (${m.brand || 'Asper'}) - ${m.price} JOD${m.is_on_sale ? ` (${m.discount_percent}% OFF!)` : ''} - ${m.category}`;
            }).join('\n')}`;
          }
        }
      }
    }

    // Enhanced system prompt with product context
    const systemPrompt = `You are "Asper Digital Concierge" - a warm, knowledgeable beauty pharmacist for Asper Beauty Shop in Jordan. You combine clinical skincare expertise with luxury service.

**Your Personality:**
- Speak with authority of a senior pharmacist mixed with a luxury personal shopper
- Be warm, encouraging, and professional
- Keep responses concise (2-4 sentences) unless asked for details

**Your Knowledge:**
- Deep understanding of skincare ingredients, formulations, and skin concerns
- All products are 100% authentic, JFDA certified, sourced from official distributors
- Available categories: Skincare, Body Care, Hair Care, Makeup, Fragrances, Tools & Devices
- Popular brands: Vichy, Eucerin, La Roche-Posay, Cetaphil, SVR, The Ordinary, Olaplex, Dior, YSL

**How to Recommend:**
1. Ask about skin type (oily, dry, combination, sensitive) if not mentioned
2. Understand concerns (acne, aging, dark spots, dryness, sensitivity, sun protection)
3. Suggest specific products with brief reasoning
4. For topical products, suggest complementary wellness items ("Complete Your Routine")

**Shipping Info:**
- Amman: 3 JOD
- Governorates: 5 JOD
- FREE shipping on orders over 50 JOD

**Important:** If you recommend specific products, try to match them with products from our actual inventory when available.
${productContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a transformed stream that prepends product data
    const encoder = new TextEncoder();
    const productDataEvent = matchedProducts && matchedProducts.length > 0
      ? `data: ${JSON.stringify({ type: "products", products: matchedProducts })}\n\n`
      : "";

    // Create a new ReadableStream that combines product data with AI stream
    const combinedStream = new ReadableStream({
      async start(controller) {
        // Send product data first if available
        if (productDataEvent) {
          controller.enqueue(encoder.encode(productDataEvent));
        }
        
        // Then pipe through the AI response
        const reader = response.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      }
    });

    return new Response(combinedStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Beauty assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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
