import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role to bypass RLS for updates
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("🕵️‍♀️ Starting Product Data Enrichment...");

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
        // Fetch the HTML from source URL
        const response = await fetch(product.source_url!, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });

        if (!response.ok) {
          results.push({ id: product.id, title: product.title, status: "fetch_failed" });
          continue;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract image using OpenGraph meta tag (most reliable)
        let imageUrl = $('meta[property="og:image"]').attr("content");

        // Fallback: Try common e-commerce selectors
        if (!imageUrl) {
          imageUrl = $("#image-main").attr("src") || 
                     $(".product-image img").attr("src") ||
                     $(".product-gallery img").first().attr("src") ||
                     $('img[itemprop="image"]').attr("src");
        }

        // Update Supabase if image found
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from("products")
            .update({ image_url: imageUrl })
            .eq("id", product.id);

          if (!updateError) {
            console.log(`   ✅ Image Saved: ${imageUrl.substring(0, 50)}...`);
            results.push({ id: product.id, title: product.title, status: "success", image_url: imageUrl });
          } else {
            console.error(`   ❌ Update Failed:`, updateError.message);
            results.push({ id: product.id, title: product.title, status: "update_failed" });
          }
        } else {
          console.log(`   ⚠️ Could not find image on page.`);
          results.push({ id: product.id, title: product.title, status: "no_image_found" });
        }
      } catch (err) {
        console.error(`   ❌ Failed to process: ${product.source_url}`);
        results.push({ id: product.id, title: product.title, status: "error" });
      }

      // Be polite - wait between requests to avoid rate limiting
      await new Promise((r) => setTimeout(r, 1000));
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: products?.length || 0,
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
