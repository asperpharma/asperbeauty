import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FirecrawlResponse {
  success: boolean;
  data?: {
    metadata?: {
      ogImage?: string;
      title?: string;
    };
    screenshot?: string;
    markdown?: string;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured. Please connect Firecrawl in Settings → Connectors.");
    }

    // Use service role to bypass RLS for updates
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("🕵️‍♀️ Starting Product Enrichment with Firecrawl...");

    // Find products that have a source_url but NO image
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, source_url")
      .not("source_url", "is", null)
      .is("image_url", null);

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    console.log(`🎯 Found ${products?.length || 0} products to enrich.`);

    const results: { id: string; title: string; status: string; image_url?: string }[] = [];

    // Loop through each product
    for (const product of products || []) {
      console.log(`\nProcessing: ${product.title}...`);

      try {
        // Use Firecrawl to scrape the page with screenshot and metadata
        const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${firecrawlApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: product.source_url,
            formats: ["screenshot", "markdown"],
            onlyMainContent: false,
            waitFor: 2000, // Wait for images to load
          }),
        });

        const firecrawlData: FirecrawlResponse = await firecrawlResponse.json();

        if (!firecrawlData.success) {
          console.error(`   ⚠️ Firecrawl error: ${firecrawlData.error}`);
          results.push({ id: product.id, title: product.title, status: "scrape_failed" });
          continue;
        }

        // Try to get OG image from metadata first, then fall back to screenshot
        let imageUrl = firecrawlData.data?.metadata?.ogImage;

        // If no OG image, we could use the screenshot (base64)
        // For now, we'll only use the OG image since storing base64 is complex
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from("products")
            .update({ image_url: imageUrl })
            .eq("id", product.id);

          if (!updateError) {
            console.log(`   ✅ Image found: ${imageUrl.substring(0, 60)}...`);
            results.push({ id: product.id, title: product.title, status: "success", image_url: imageUrl });
          } else {
            console.error(`   ❌ Update Failed:`, updateError.message);
            results.push({ id: product.id, title: product.title, status: "update_failed" });
          }
        } else {
          console.log(`   ⚠️ No OG image found on page.`);
          results.push({ id: product.id, title: product.title, status: "no_image_found" });
        }
      } catch (err) {
        console.error(`   ❌ Failed to process: ${product.source_url}`, err);
        results.push({ id: product.id, title: product.title, status: "error" });
      }

      // Rate limiting - wait between requests
      await new Promise((r) => setTimeout(r, 500));
    }

    const successCount = results.filter(r => r.status === "success").length;
    console.log(`\n✨ Enrichment complete. ${successCount}/${products?.length || 0} products enriched.`);

    return new Response(
      JSON.stringify({
        success: true,
        total: products?.length || 0,
        enriched: successCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Enrichment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
