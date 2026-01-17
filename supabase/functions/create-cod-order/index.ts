import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
  captchaToken: z.string().min(1, "CAPTCHA verification required"),
});

interface OrderItem {
  productTitle: string;
  variantTitle?: string;
  price: string;
  quantity: number;
}

// Verify hCaptcha token
async function verifyHCaptcha(token: string): Promise<boolean> {
  const secretKey = Deno.env.get('HCAPTCHA_SECRET_KEY');
  
  if (!secretKey) {
    console.error('HCAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${encodeURIComponent(token)}&secret=${encodeURIComponent(secretKey)}`,
    });

    const result = await response.json();
    console.log('hCaptcha verification result:', result.success);
    return result.success === true;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
}

// Generate order confirmation email HTML
function generateOrderEmailHtml(
  customerName: string,
  orderNumber: string,
  confirmationToken: string,
  items: OrderItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  deliveryAddress: string,
  city: string,
  customerPhone: string,
  trackingUrl: string
): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
        <strong>${item.productTitle}</strong>
        ${item.variantTitle ? `<br><span style="color: #666; font-size: 13px;">${item.variantTitle}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${parseFloat(item.price).toFixed(2)} JOD</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${(parseFloat(item.price) * item.quantity).toFixed(2)} JOD</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Asper Beauty</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f5f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A0E19 0%, #6b1525 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ASPER BEAUTY</h1>
              <p style="margin: 8px 0 0; color: #F3E5DC; font-size: 14px;">Your Luxury Beauty Destination in Jordan</p>
            </td>
          </tr>
          
          <!-- Order Confirmation -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 70px; height: 70px; background-color: #d4edda; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="color: #28a745; font-size: 36px;">✓</span>
                </div>
                <h2 style="margin: 0; color: #4A0E19; font-size: 24px;">Order Confirmed!</h2>
                <p style="margin: 10px 0 0; color: #666;">Thank you for your order, ${customerName}!</p>
              </div>
              
              <div style="background-color: #f8f5f2; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                <p style="margin: 0 0 5px; color: #666; font-size: 14px;">Order Number</p>
                <p style="margin: 0; color: #4A0E19; font-size: 22px; font-weight: 700;">${orderNumber}</p>
              </div>
              
              <!-- Order Items -->
              <h3 style="color: #4A0E19; font-size: 18px; margin: 0 0 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Order Details</h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f8f5f2;">
                    <th style="padding: 12px; text-align: left; color: #4A0E19; font-size: 13px;">Product</th>
                    <th style="padding: 12px; text-align: center; color: #4A0E19; font-size: 13px;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #4A0E19; font-size: 13px;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #4A0E19; font-size: 13px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <!-- Order Summary -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #333;">${subtotal.toFixed(2)} JOD</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; color: ${shippingCost === 0 ? '#28a745' : '#333'};">${shippingCost === 0 ? 'FREE' : shippingCost.toFixed(2) + ' JOD'}</td>
                </tr>
                <tr style="border-top: 2px solid #D4AF37;">
                  <td style="padding: 15px 0 0; color: #4A0E19; font-size: 18px; font-weight: 700;">Total</td>
                  <td style="padding: 15px 0 0; text-align: right; color: #4A0E19; font-size: 18px; font-weight: 700;">${total.toFixed(2)} JOD</td>
                </tr>
              </table>
              
              <!-- Delivery Info -->
              <h3 style="color: #4A0E19; font-size: 18px; margin: 0 0 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Delivery Information</h3>
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${customerPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">City:</td>
                  <td style="padding: 8px 0; color: #333;">${city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top;">Address:</td>
                  <td style="padding: 8px 0; color: #333;">${deliveryAddress}</td>
                </tr>
              </table>
              
              <!-- Payment Method -->
              <div style="background-color: #fff8e1; border: 1px solid #D4AF37; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0; color: #4A0E19; font-size: 16px; font-weight: 600;">💵 Cash on Delivery</p>
                <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Please have ${total.toFixed(2)} JOD ready upon delivery</p>
              </div>
              
              <!-- Track Order Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${trackingUrl}" style="display: inline-block; background: linear-gradient(135deg, #4A0E19 0%, #6b1525 100%); color: #D4AF37; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  📦 Track Your Order
                </a>
              </div>

              <!-- Confirmation Token -->
              <div style="background-color: #f0f8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 5px; color: #666; font-size: 13px;">Your Confirmation Token (for tracking)</p>
                <p style="margin: 0; color: #2c5282; font-size: 12px; font-family: monospace; word-break: break-all;">${confirmationToken}</p>
              </div>
              
              <!-- What's Next -->
              <div style="background-color: #f8f5f2; border-radius: 8px; padding: 20px;">
                <h4 style="margin: 0 0 15px; color: #4A0E19; font-size: 16px;">What's Next?</h4>
                <ol style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                  <li>We'll call you to confirm your order</li>
                  <li>Your order will be prepared and shipped</li>
                  <li>Pay cash when your order arrives</li>
                </ol>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #4A0E19; padding: 25px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 10px; color: #D4AF37; font-size: 14px;">Need help? Contact us:</p>
              <p style="margin: 0; color: #F3E5DC; font-size: 13px;">📞 +962 XXX XXXX | 📧 support@asperbeauty.com</p>
              <p style="margin: 15px 0 0; color: #999; font-size: 12px;">© 2024 Asper Beauty. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send order confirmation email
async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  confirmationToken: string,
  items: OrderItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  deliveryAddress: string,
  city: string,
  customerPhone: string,
  siteUrl: string
): Promise<boolean> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured - skipping email');
    return false;
  }

  if (!customerEmail) {
    console.log('No customer email provided - skipping confirmation email');
    return false;
  }

  try {
    const resend = new Resend(resendApiKey);
    
    // Generate tracking URL
    const trackingUrl = `${siteUrl}/track-order?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(confirmationToken)}`;
    
    const emailHtml = generateOrderEmailHtml(
      customerName,
      orderNumber,
      confirmationToken,
      items,
      subtotal,
      shippingCost,
      total,
      deliveryAddress,
      city,
      customerPhone,
      trackingUrl
    );

    const { data, error } = await resend.emails.send({
      from: 'Asper Beauty <onboarding@resend.dev>', // Use your verified domain in production
      to: [customerEmail],
      subject: `Order Confirmed - ${orderNumber} | Asper Beauty`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send confirmation email:', error);
      return false;
    }

    console.log('Confirmation email sent successfully:', data?.id);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

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

    // Verify CAPTCHA first
    const captchaValid = await verifyHCaptcha(data.captchaToken);
    if (!captchaValid) {
      console.warn('CAPTCHA verification failed');
      return new Response(
        JSON.stringify({ error: 'CAPTCHA verification failed. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    console.log('Order created successfully:', order.order_number);

    // Send confirmation email (don't fail the order if email fails)
    // Determine site URL from Supabase URL (convert API URL to site URL)
    const siteUrl = 'https://asperbeautyshop.lovable.app'; // Production URL
    
    if (data.customerEmail) {
      await sendOrderConfirmationEmail(
        data.customerEmail,
        data.customerName,
        order.order_number,
        order.confirmation_token,
        sanitizedItems,
        data.subtotal,
        data.shippingCost,
        data.total,
        data.deliveryAddress,
        data.city,
        data.customerPhone,
        siteUrl
      );
    }

    // Return only the order number
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
