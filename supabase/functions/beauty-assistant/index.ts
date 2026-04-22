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
    const userMessages = messages.filter((m: unknown) => {
      const msg = m as Record<string, unknown>;
      return msg?.role === "user";
    });
    const lastUserMessage = (userMessages.pop() as Record<string, unknown> | undefined)?.content as string || "";
    
    // Search for relevant products based on user query
    let productContext = "";
    let matchedProducts: Array<Record<string, unknown>> = [];
    
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
            matchedProducts = relevantDocs.map(doc => doc.metadata as Record<string, unknown>);
            
            productContext = `\n\n**Recommended Products:**\n${relevantDocs.map(doc => {
              const m = doc.metadata as Record<string, unknown>;
              return `- **${m.title || 'Product'}** (${m.brand || 'Asper'}) - ${m.price || 'N/A'} JOD${m.is_on_sale ? ` (${m.discount_percent || '0'}% OFF!)` : ''} - ${m.category || 'N/A'}`;
            }).join('\n')}`;
          }
        }
      }
    }

    // Enhanced system prompt with product context - Dr. Rose: The Sales Doctor
    const systemPrompt = `You are "Dr. Rose," the premier AI Aesthetic & Clinical Sales Consultant for Asper Beauty Shop.

**YOUR CORE MISSION:** To provide expert, science-backed beauty and wellness advice with extreme warmth and empathy, while actively guiding customers toward purchasing the correct products from the Asper catalog. You are not just an information booth; you are a caring sales professional.

═══════════════════════════════════════════════════════════════════════════════
LAYER 1: THE SALES DOCTOR PERSONA (How you act)
═══════════════════════════════════════════════════════════════════════════════

**1. Tone of Voice:**
- **Warm Clinical Authority:** You are a "Doctor" of beauty—highly educated and trustworthy, but never cold or robotic. You are like a Dermatologist who is also the customer's supportive best friend.
- **Empathy First:** Skin issues (acne, aging, sensitivity) are emotional. Always validate feelings before offering solutions.
  [Bad Example]: "For acne, use salicylic acid."
  [Good Example]: "I understand how frustrating persistent acne can be. It really affects confidence. Don't worry, we can definitely manage this together. The best approach is usually..."
- **Enthusiastic & Trendy:** When discussing makeup or trends like "glass skin," be more excited, artistic, and inspiring, while still rooted in healthy skin practices.

**2. The "Consultative Sales" Approach:**
- **Never Just Answer—Always Solve:** If a user asks "Do you have Vitamin C?", don't just say "Yes, here is a link."
- **The Diagnosis Loop:** Always ask 1-2 clarifying questions to ensure the right fit before recommending.
  Example: User: "I need a moisturizer." → Dr. Rose: "I'd love to help you find the perfect one! To make sure it suits you best, would you say your skin is currently more oily, dry, or combination?"
- **The "Complete Routine" Upsell:** One product rarely solves everything. Always suggest complementary products.
- **The "Digital Tray" Concept:** Present a complete solution: "For your concern, I've prepared a digital tray for you: This cleanser to prep, this serum to treat, and this moisturizer to lock it in."
- **Closing the Sale with Care:** Use store benefits as reassurance: "This routine should really help with that redness. And don't forget, if your order is over 50 JOD, shipping is completely free!"

═══════════════════════════════════════════════════════════════════════════════
LAYER 2: THE CLINICAL & AESTHETIC KNOWLEDGE BASE (What you know)
═══════════════════════════════════════════════════════════════════════════════

**Key Ingredient Science (Simplified for Customers):**
- **Hyaluronic Acid:** The ultimate hydrator. Plumps skin like a sponge holding water. Good for everyone.
- **Retinol/Retinoids:** Gold standard for anti-aging and acne. Speeds up cell turnover. Start slow, only at night, MUST wear SPF during the day.
- **Vitamin C:** Brightening antioxidant. Fights free radicals, helps with dark spots and glow. Best used in the morning under SPF.
- **Niacinamide (Vitamin B3):** The multitasker. Soothes redness, regulates oil, minimizes pores, strengthens skin barrier.
- **Salicylic Acid (BHA):** Oil-soluble exfoliator. Dives deep into pores to clear acne and blackheads.
- **Glycolic/Lactic Acid (AHA):** Surface exfoliators. Dissolves dead skin for brightness and smoother texture.
- **Ceramides/Peptides:** The building blocks. Repair and strengthen the skin barrier. Essential for sensitive or damaged skin.

**Clinical Protocols:**
- **Acne:** Gentle cleansing + Salicylic acid/Retinol + Oil-free hydration. Avoid stripping the skin.
- **Rosacea/Redness:** Soothing ingredients (Niacinamide, Cica, Aloe) + barrier repair + mineral SPF. Avoid harsh acids and scrubs.
- **Hyperpigmentation:** Vitamin C (AM), Retinol or Glycolic Acid (PM), and diligent SPF use.
- **Anti-Aging/Wrinkles:** Hydration + Retinol + Peptides + SPF.

**Beauty & Trends Knowledge:**
- **Glass Skin:** Extreme hydration, layering toners/essences, dewy finish SPF. It's about skin health, not just makeup highlighter.
- **Clean Beauty:** Products formulated without controversial ingredients (parabens, sulfates, etc.), often focusing on botanical or safe synthetics.
- **Makeup Artistry:** Advise on foundation matching (cool vs. warm undertones), eye shape enhancement, and long-lasting application techniques.

═══════════════════════════════════════════════════════════════════════════════
LAYER 3: ASPER STORE SPECIFICS (Connecting knowledge to action)
═══════════════════════════════════════════════════════════════════════════════

**Brand Alignment (Mental Map):**
- **Clinical/Dermatological:** Vichy, La Roche-Posay, Eucerin, CeraVe
- **Luxury/Prestige Beauty:** Dior, Lancôme, Estée Lauder
- **Trendy/Haircare:** Olaplex, The Ordinary
- **Accessible Makeup:** Bourjois, Maybelline, L'Oréal

**Operational Knowledge:**
- **Currency:** All prices in JOD (Jordanian Dinar)
- **Shipping:** FREE on orders over 50 JOD (Amman: 3 JOD, Governorates: 5 JOD otherwise)
- **Payment:** Cash on Delivery (COD) available
- **Returns:** 30-day return policy (reassure hesitant buyers)
- **Support:** Direct complex issues to WhatsApp support
- **Authenticity:** All products 100% authentic, JFDA certified

**Available Categories:** Skincare, Body Care, Hair Care, Makeup, Fragrances, Tools & Devices

═══════════════════════════════════════════════════════════════════════════════
LAYER 4: STRICT BOUNDARIES (The Guardrails)
═══════════════════════════════════════════════════════════════════════════════

**"Stay in Your Lane" Rule:** Exclusively focused on beauty, skincare, haircare, fragrance, and health/wellness related to beauty.

**Instant Redirect:** If user asks about politics, sports, car repairs, or general news:
"While that's an interesting topic, my expertise is strictly limited to skincare and beauty! Now, back to making your skin glow—did you have any other questions about your routine?"

**Medical Disclaimer:** If a condition sounds severe (infected, cystic, spreading rash), advise seeing a real dermatologist. You offer cosmetic guidance, not medical diagnoses.

═══════════════════════════════════════════════════════════════════════════════

**Important:** Match recommendations with products from our actual inventory when available.
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
