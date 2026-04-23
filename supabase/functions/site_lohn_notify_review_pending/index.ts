import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  name: string;
  rating: number;
  service?: string | null;
  comment: string;
  adminUrl?: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function clamp(v: string, max: number) {
  return v.trim().slice(0, max);
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stars(rating: number) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(full) + "☆".repeat(5 - full);
}

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

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("[site_lohn_notify_review_pending] missing RESEND_API_KEY secret");
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const toEmail = Deno.env.get("CONTACT_TO_EMAIL") ?? "advocacialohn@gmail.com";
  const fromEmail = Deno.env.get("RESEND_FROM") ?? "LOHN Advocacia <onboarding@resend.dev>";

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch (err) {
    console.error("[site_lohn_notify_review_pending] invalid json body", { err });
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!isNonEmptyString(payload?.name) || !isNonEmptyString(payload?.comment)) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const name = clamp(payload.name, 120);
  const comment = clamp(payload.comment, 2000);
  const service = isNonEmptyString(payload.service) ? clamp(payload.service, 120) : "";
  const rating = Number(payload.rating ?? 0);

  const adminUrl = isNonEmptyString(payload.adminUrl)
    ? clamp(payload.adminUrl, 300)
    : "https://advocacialohn.adv.br/admin";

  const subject = `📝 Nova avaliação pendente para aprovação`;

  const text = [
    "Nova avaliação recebida e aguardando aprovação.",
    "",
    `Nome: ${name}`,
    `Nota: ${rating} (${stars(rating)})`,
    service ? `Serviço: ${service}` : "Serviço: -",
    "",
    "Comentário:",
    comment,
    "",
    `Aprovar em: ${adminUrl}`,
  ].join("\n");

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #0b0b0c;">
    <div style="max-width: 560px; margin: 0 auto; padding: 18px; border: 1px solid rgba(212,175,55,0.30); border-radius: 14px;">
      <div style="font-size: 12px; letter-spacing: 0.22em; font-weight: 700; color: rgba(212,175,55,0.9);">LOHN ADVOCACIA</div>
      <h2 style="margin: 10px 0 0; font-size: 18px;">📝 Nova avaliação pendente</h2>
      <p style="margin: 8px 0 0; font-size: 14px; color: rgba(0,0,0,0.70);">
        Você recebeu uma nova avaliação enviada pelo site. Ela está <strong>pendente</strong> e precisa de aprovação para aparecer no carrossel.
      </p>

      <div style="margin-top: 14px; padding: 14px; background: rgba(212,175,55,0.07); border: 1px solid rgba(212,175,55,0.20); border-radius: 12px;">
        <div style="font-size: 14px;"><strong>Nome:</strong> ${escapeHtml(name)}</div>
        <div style="margin-top: 6px; font-size: 14px;"><strong>Nota:</strong> ${escapeHtml(String(rating))} <span style="color: rgba(212,175,55,0.95);">${escapeHtml(stars(rating))}</span></div>
        <div style="margin-top: 6px; font-size: 14px;"><strong>Serviço:</strong> ${escapeHtml(service || "-")}</div>

        <div style="margin-top: 10px; font-size: 14px;"><strong>Comentário:</strong></div>
        <div style="margin-top: 6px; white-space: pre-wrap; font-size: 14px; color: rgba(0,0,0,0.78);">${escapeHtml(comment)}</div>
      </div>

      <div style="margin-top: 14px;">
        <a href="${escapeHtml(adminUrl)}" target="_blank" rel="noreferrer"
           style="display:inline-block; text-decoration:none; background:#d4af37; color:#0b0b0c; padding:10px 14px; border-radius:10px; font-weight:700; font-size:14px;">
          Abrir painel de aprovação
        </a>
      </div>

      <div style="margin-top: 12px; font-size: 12px; color: rgba(0,0,0,0.55);">
        Dica: após aprovar, a avaliação passa a aparecer publicamente no site.
      </div>
    </div>
  </div>
  `.trim();

  try {
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        text,
        html,
      }),
    });

    if (!resendResp.ok) {
      const errorBody = await resendResp.text().catch(() => "");
      console.error("[site_lohn_notify_review_pending] resend error", {
        status: resendResp.status,
        errorBody,
      });

      return new Response(JSON.stringify({ error: "Failed to send" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resendResp.json().catch(() => ({}));
    console.log("[site_lohn_notify_review_pending] sent", { id: data?.id });

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[site_lohn_notify_review_pending] unexpected error", { err });
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
