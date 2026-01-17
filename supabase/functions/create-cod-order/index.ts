import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema for order data
const orderItemSchema = z.object({
  productId: z.string(),
  productTitle: z.string(),
  variantId: z.string(),
  variantTitle: z.string().optional(),
  price: z.string(),
  currency: z.string(),
  quantity: z.number().int().positive().max(99),
  selectedOptions: z.record(z.string()).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  customerPhone: z.string().trim().regex(/^07[789]\d{7}$/, "Invalid Jordanian phone number format"),
  customerEmail: z.string().email("Invalid email").max(255).optional().or(z.literal('')),
  deliveryAddress: z.string().trim().min(10, "Address must be at least 10 characters").max(500, "Address too long"),
  city: z.enum([
    "Amman", "Zarqa", "Irbid", "Aqaba", "Salt", "Mafraq", 
    "Jerash", "Madaba", "Karak", "Ajloun", "Ma'an", "Tafilah"
  ], { errorMap: () => ({ message: "Invalid city" }) }),
  notes: z.string().trim().max(500, "Notes too long").optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty").max(50, "Too many items"),
  subtotal: z.number().positive().max(10000),
  shippingCost: z.number().min(0).max(100),
  total: z.number().positive().max(10100),
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(i => i.message).join(', ');
      return new Response(
        JSON.stringify({ error: `Validation failed: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = validationResult.data;

    // Create Supabase client with service role for bypassing RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sanitize order items for storage
    const sanitizedItems = data.items.map(item => ({
      productId: item.productId.slice(0, 100),
      productTitle: item.productTitle.slice(0, 200),
      variantId: item.variantId.slice(0, 100),
      variantTitle: item.variantTitle?.slice(0, 100),
      price: item.price,
      currency: item.currency,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      imageUrl: item.imageUrl,
    }));

    // Generate temp order number (trigger will replace with proper one)
    const tempOrderNumber = 'ASP-' + Date.now().toString().slice(-8);

    // Insert order using service role (bypasses RLS)
    const { data: order, error } = await supabase
      .from('cod_orders')
      .insert({
        order_number: tempOrderNumber,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || null,
        delivery_address: data.deliveryAddress,
        city: data.city,
        notes: data.notes || null,
        items: sanitizedItems,
        subtotal: data.subtotal,
        shipping_cost: data.shippingCost,
        total: data.total,
      })
      .select('order_number, confirmation_token')
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return only the order number (not the confirmation token - that's for future use if needed)
    return new Response(
      JSON.stringify({ 
        success: true, 
        orderNumber: order.order_number 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
