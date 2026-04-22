import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  placeId: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const GOOGLE_PLACES_API_KEY = Deno.env.get("SITE_LOHN_GOOGLE_PLACES_API_KEY");
  if (!GOOGLE_PLACES_API_KEY) {
    console.error("[site_lohn_google_reviews] missing SITE_LOHN_GOOGLE_PLACES_API_KEY secret");
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch (err) {
    console.error("[site_lohn_google_reviews] invalid json body", { err });
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!payload?.placeId || typeof payload.placeId !== "string") {
    return new Response(JSON.stringify({ error: "Missing placeId" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const placeId = payload.placeId.trim();
  if (!placeId) {
    return new Response(JSON.stringify({ error: "Missing placeId" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,url,rating,reviews");
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

  try {
    const resp = await fetch(url.toString());
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      console.error("[site_lohn_google_reviews] google http error", {
        status: resp.status,
        data,
      });
      return new Response(JSON.stringify({ error: "Upstream error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data || data.status !== "OK") {
      console.error("[site_lohn_google_reviews] google api error", {
        status: data?.status,
        error_message: data?.error_message,
      });

      return new Response(
        JSON.stringify({
          error: "Google API error",
          status: data?.status,
          message: data?.error_message,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = data.result ?? {};
    const reviews = Array.isArray(result.reviews)
      ? result.reviews.map((r: any) => ({
          author_name: String(r.author_name ?? ""),
          rating: Number(r.rating ?? 0),
          text: String(r.text ?? ""),
          relative_time_description: String(r.relative_time_description ?? ""),
          time: typeof r.time === "number" ? r.time : undefined,
        }))
      : [];

    console.log("[site_lohn_google_reviews] ok", {
      placeId,
      reviews: reviews.length,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        place: {
          name: result.name ?? "",
          url: result.url ?? "",
          rating: result.rating ?? null,
        },
        reviews,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[site_lohn_google_reviews] unexpected error", { err });
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
