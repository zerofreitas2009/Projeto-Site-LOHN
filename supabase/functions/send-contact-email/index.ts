import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ContactPayload = {
  name: string;
  phone: string;
  subject: string;
  message?: string | null;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function clampText(v: string, max: number) {
  return v.trim().slice(0, max);
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
    console.error("[send-contact-email] missing RESEND_API_KEY secret");
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const toEmail = Deno.env.get("CONTACT_TO_EMAIL") ?? "advocacialohn@gmail.com";
  const fromEmail = Deno.env.get("RESEND_FROM") ?? "LOHN Advocacia <onboarding@resend.dev>";

  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch (err) {
    console.error("[send-contact-email] invalid json body", { err });
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!isNonEmptyString(payload.name) || !isNonEmptyString(payload.phone) || !isNonEmptyString(payload.subject)) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const name = clampText(payload.name, 120);
  const phone = clampText(payload.phone, 40);
  const subject = clampText(payload.subject, 140);
  const message = (payload.message ?? "").toString().trim().slice(0, 4000);

  const emailSubject = `Contato do site - ${subject}`;

  const text = [
    `Nome: ${name}`,
    `Telefone: ${phone}`,
    `Assunto: ${subject}`,
    "",
    "Mensagem:",
    message || "-",
  ].join("\n");

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
    <h2 style="margin: 0 0 12px;">Novo contato do site</h2>
    <p style="margin: 0 0 6px;"><strong>Nome:</strong> ${escapeHtml(name)}</p>
    <p style="margin: 0 0 6px;"><strong>Telefone:</strong> ${escapeHtml(phone)}</p>
    <p style="margin: 0 0 12px;"><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
    <div style="padding: 12px; border: 1px solid #eee; border-radius: 8px;">
      <div style="white-space: pre-wrap;">${escapeHtml(message || "-")}</div>
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
        subject: emailSubject,
        text,
        html,
      }),
    });

    if (!resendResp.ok) {
      const errorBody = await resendResp.text().catch(() => "");
      console.error("[send-contact-email] resend error", {
        status: resendResp.status,
        errorBody,
      });

      return new Response(JSON.stringify({ error: "Failed to send" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resendResp.json().catch(() => ({}));
    console.log("[send-contact-email] sent", { id: data?.id });

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-contact-email] unexpected error", { err });
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
