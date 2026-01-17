import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber || !phone) {
      return new Response(
        JSON.stringify({ error: "Order number and phone are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Clean phone number for comparison (remove spaces, dashes)
    const cleanPhone = phone.replace(/[\s-]/g, "");

    const { data: order, error } = await supabase
      .from("cod_orders")
      .select("order_number, status, items, subtotal, shipping_cost, total, city, delivery_address, created_at, updated_at")
      .eq("order_number", orderNumber.toUpperCase())
      .single();

    if (error || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify phone number matches (basic security)
    const { data: fullOrder } = await supabase
      .from("cod_orders")
      .select("customer_phone")
      .eq("order_number", orderNumber.toUpperCase())
      .single();

    if (fullOrder) {
      const orderPhone = fullOrder.customer_phone.replace(/[\s-]/g, "");
      if (!orderPhone.includes(cleanPhone.slice(-9)) && !cleanPhone.includes(orderPhone.slice(-9))) {
        return new Response(
          JSON.stringify({ error: "Phone number does not match order" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ order }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch order status" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
