// ── CORS Headers ──────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Flash Express API Configuration ───────────────────────────
const FLASH_EXPRESS_API_URL = "https://www.flashexpress.ph/webApi/tools/tracking";

// ── Helper to build a JSON response ────────────────────────────
function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  // ── Handle CORS Preflight ──────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // ── Parse the request body ────────────────────────────────────
    let tracking_number: string;
    try {
      const body = await req.json();
      tracking_number = body.tracking_number;
    } catch {
      return jsonResponse({ error: "Invalid JSON in request body" }, 400);
    }

    if (!tracking_number || typeof tracking_number !== "string") {
      return jsonResponse({ error: "tracking_number is required and must be a string" }, 400);
    }

    console.log(`[FlashExpress] Fetching tracking for: ${tracking_number}`);

    // ── Call Flash Express Tracking API ───────────────────────────
    // Documentation: POST to /webApi/tools/tracking with { search: "<tracking_number>" }
    const flashExpressResponse = await fetch(FLASH_EXPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (compatible; PrimeShotPremium/1.0)",
        "Origin": "https://www.flashexpress.ph",
        "Referer": "https://www.flashexpress.ph/tracking",
      },
      body: JSON.stringify({ search: tracking_number }),
    });

    // ── Handle non-OK responses from Flash Express ────────────────
    if (!flashExpressResponse.ok) {
      const errorText = await flashExpressResponse.text();
      console.error(
        `[FlashExpress] API returned ${flashExpressResponse.status}: ${errorText}`,
      );

      // Return the actual API error to the frontend for better debugging
      return jsonResponse(
        {
          error: "Flash Express API returned an error",
          details: {
            status: flashExpressResponse.status,
            message: errorText.substring(0, 500), // Limit length
          },
        },
        502,
      );
    }

    // ── Parse the response ────────────────────────────────────────
    let data: unknown;
    try {
      data = await flashExpressResponse.json();
    } catch {
      const rawText = await flashExpressResponse.text();
      console.error(`[FlashExpress] Invalid JSON response: ${rawText.substring(0, 500)}`);
      return jsonResponse(
        { error: "Invalid response from Flash Express API" },
        502,
      );
    }

    console.log(`[FlashExpress] Successfully fetched tracking data for: ${tracking_number}`);

    return jsonResponse({ success: true, data }, 200);
  } catch (err) {
    console.error("[FlashExpress] Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return jsonResponse({ error: message }, 500);
  }
});
