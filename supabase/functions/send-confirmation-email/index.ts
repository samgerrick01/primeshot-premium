// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ── CORS Headers ──────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationPayload {
  email: string;
  firstname: string;
  lastname: string;
  redirect_to?: string;
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
    const { email, firstname, lastname, redirect_to }: ConfirmationPayload =
      await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: "BREVO_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Get the Supabase project URL from env
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: "SUPABASE_URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Use the service role key to create a confirmation link
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error: "SUPABASE_SERVICE_ROLE_KEY not configured",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create admin client to generate confirmation link
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Generate a magic link / confirmation link
    const redirectUrl = redirect_to || `${supabaseUrl}/auth/v1/verify`;

    // Generate a sign-up confirmation OTP
    const { data: otpData, error: otpError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        newUserOptions: {
          email_confirm: false,
        },
      });

    if (otpError) {
      console.error("Error generating confirmation link:", otpError);
      return new Response(
        JSON.stringify({ error: otpError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // The confirmation link from generateLink
    const confirmationLink = otpData?.properties?.action_link;

    if (!confirmationLink) {
      return new Response(
        JSON.stringify({ error: "Failed to generate confirmation link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const displayName = firstname
      ? `${firstname} ${lastname || ""}`.trim()
      : email;

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
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #e94560 0%, #c23152 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0;
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
      <p>Premium Airgun Products</p>
    </div>
    <div class="body">
      <h2>Welcome to PrimeShot Premium!</h2>
      <p>Hi ${displayName},</p>
      <p>Thank you for creating an account. Please confirm your email address by clicking the button below to get started.</p>
      <p style="text-align: center;">
        <a href="${confirmationLink}" class="button">Confirm Email Address</a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p style="font-size: 13px; word-break: break-all; color: #888888;">
        ${confirmationLink}
      </p>
      <p>If you did not create an account, you can safely ignore this email.</p>
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
          email,
          name: displayName,
        },
      ],
      subject: "Confirm your email - PrimeShot Premium",
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
        JSON.stringify({ error: "Failed to send confirmation email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Confirmation email sent" }),
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
