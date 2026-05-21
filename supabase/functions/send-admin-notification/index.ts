// Setup type definitions for built-in Supabase Runtime APIs
// Uses Deno.serve and fetch API (built-in Deno runtime)

// ── CORS Headers ──────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {


  product_name: string;
  quantity: number;
  price: number;
  grains?: string;
  diameter?: string;
  caliber?: string;
}

interface AdminNotificationPayload {
  order_id: number;
  customer_name: string;
  customer_email: string;
  total: number;
  shipping_address: string;
  payment_receipt_url: string;
  items: OrderItem[];
  created_at: string;
}

interface BrevoRequestBody {
  sender: { name: string; email: string };
  to: Array<{ email: string; name: string }>;
  subject: string;
  htmlContent: string;
}

Deno.serve(async (req) => {
  // ── Handle CORS Preflight ──────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Parse the request body
    const payload: AdminNotificationPayload = await req.json();

    if (!payload.order_id) {
      return new Response(
        JSON.stringify({ error: "order_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: "BREVO_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (!adminEmail) {
      return new Response(
        JSON.stringify({ error: "ADMIN_EMAIL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Get the Supabase project URL for building links
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: "SUPABASE_URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Format the total
    const formattedTotal = `₱${Number(payload.total).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    // Format the date
    const orderDate = new Date(payload.created_at).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build items table HTML
    const itemsHtml = payload.items
      .map((item) => {
        const specs = [item.caliber, item.grains ? `${item.grains} gr` : "", item.diameter ? `Dia: ${item.diameter}` : ""]
          .filter(Boolean)
          .join(" | ");
        const itemTotal = Number(item.price) * item.quantity;
        const formattedItemTotal = `₱${itemTotal.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        const formattedPrice = `₱${Number(item.price).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 8px; color: #333;">
            ${item.product_name}
            ${specs ? `<br><span style="font-size: 12px; color: #888;">${specs}</span>` : ""}
          </td>
          <td style="padding: 12px 8px; text-align: center; color: #555;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right; color: #555;">${formattedPrice}</td>
          <td style="padding: 12px 8px; text-align: right; color: #333; font-weight: 600;">${formattedItemTotal}</td>
        </tr>`;
      })
      .join("");

    // Build the email HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 40px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: #e94560;
      font-size: 28px;
      margin: 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header p {
      color: #ffffff;
      font-size: 14px;
      margin: 10px 0 0 0;
      opacity: 0.8;
    }
    .badge {
      display: inline-block;
      background: #e94560;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 15px;
    }
    .body {
      background-color: #ffffff;
      padding: 40px 30px;
      border-radius: 0 0 8px 8px;
    }
    .body h2 {
      color: #1a1a2e;
      font-size: 22px;
      margin: 0 0 20px 0;
    }
    .body p {
      color: #555555;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .info-box {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border-left: 4px solid #e94560;
    }
    .info-box h3 {
      color: #1a1a2e;
      font-size: 16px;
      margin: 0 0 10px 0;
    }
    .info-box p {
      color: #555;
      font-size: 14px;
      margin: 4px 0;
    }
    .info-box .label {
      color: #888;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    thead th {
      background: #1a1a2e;
      color: #fff;
      padding: 10px 8px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: left;
    }
    thead th:last-child {
      text-align: right;
    }
    tbody tr:last-child {
      border-bottom: none;
    }
    .total-row {
      background: #f8f9fa;
    }
    .total-row td {
      padding: 12px 8px;
      font-weight: 700;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #e94560 0%, #c23152 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0 0 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999999;
      font-size: 12px;
    }
    .footer a {
      color: #e94560;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PrimeShot Premium</h1>
      <p>New Order Notification</p>
      <div class="badge">Order #${payload.order_id}</div>
    </div>
    <div class="body">
      <h2>📦 New Order Received!</h2>
      <p>A new order has been placed on PrimeShot Premium. Here are the details:</p>

      <!-- Customer Info -->
      <div class="info-box">
        <h3>👤 Customer Information</h3>
        <p><span class="label">Name:</span><br>${payload.customer_name || "N/A"}</p>
        <p><span class="label">Email:</span><br>${payload.customer_email || "N/A"}</p>
        <p><span class="label">Order Date:</span><br>${orderDate}</p>
        <p><span class="label">Shipping Address:</span><br>${payload.shipping_address || "N/A"}</p>
      </div>

      <!-- Order Items -->
      <h3 style="color: #1a1a2e; font-size: 16px; margin-bottom: 8px;">🛒 Order Items</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr class="total-row">
            <td colspan="3" style="padding: 12px 8px; text-align: right; color: #1a1a2e;">TOTAL</td>
            <td style="padding: 12px 8px; text-align: right; color: #e94560; font-size: 18px;">${formattedTotal}</td>
          </tr>
        </tbody>
      </table>

      <!-- Payment Receipt -->
      ${payload.payment_receipt_url ? `
      <h3 style="color: #1a1a2e; font-size: 16px; margin-bottom: 8px;">📎 Payment Receipt</h3>
      <p style="font-size: 13px; word-break: break-all;">
        <a href="${payload.payment_receipt_url}" style="color: #e94560;">View Payment Receipt</a>
      </p>` : ""}

      <!-- Action Button -->
      <p style="text-align: center;">
        <a href="${supabaseUrl.replace(/\/$/, "")}/project/default" class="button">
          View Order in Dashboard
        </a>
      </p>
      <p style="font-size: 13px; color: #888; text-align: center;">
        Log in to the admin dashboard to verify the payment and update the order status.
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2025 PrimeShot Premium. All rights reserved.</p>
      <p>
        <a href="#">Visit our store</a> &bull; <a href="#">Contact us</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send email via Brevo API
    const brevoBody: BrevoRequestBody = {
      sender: {
        name: "PrimeShot Premium",
        email: "desilva.sam01.sgds@gmail.com",
      },
      to: [
        {
          email: adminEmail,
          name: "Admin",
        },
      ],
      subject: `🛒 New Order #${payload.order_id} — ₱${Number(payload.total).toLocaleString("en-PH")} from ${payload.customer_name || payload.customer_email || "Customer"}`,
      htmlContent,
    };

    const brevoResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
          "Accept": "application/json",
        },
        body: JSON.stringify(brevoBody),
      },
    );

    if (!brevoResponse.ok) {
      const brevoError = await brevoResponse.text();
      console.error("Brevo API error:", brevoError);
      return new Response(
        JSON.stringify({ error: "Failed to send admin notification email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin notification email sent",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
