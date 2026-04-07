import { useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import Button from "./ui/Button";

type FormState = {
  name: string;
  phone: string;
  subject: string;
  message: string;
};

function formatPhoneBR(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length < 3) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  // 11 dígitos (celular): (11) 91333-1559
  if (digits.length > 10) {
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  }

  // 10 dígitos (fixo): (11) 3333-1559
  if (digits.length > 6) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  return `(${ddd}) ${rest}`;
}

export default function ContactEmailForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus("idle");

        try {
          // Log no banco (não bloqueia o envio se falhar)
          try {
            await supabase.from("site_lohn_contacts").insert({
              name: form.name,
              phone: form.phone,
              subject: form.subject,
              message: form.message || null,
              source: "Site-LOHN",
            });
          } catch (err) {
            console.error("[site-lohn] falha ao salvar contato no Supabase", err);
          }

          const { data, error } = await supabase.functions.invoke("send-contact-email", {
            body: {
              name: form.name,
              phone: form.phone,
              subject: form.subject,
              message: form.message || null,
            },
          });

          if (error) throw error;
          if (!data?.ok) throw new Error("Falha ao enviar");

          setStatus("success");
          setForm({ name: "", phone: "", subject: "", message: "" });
        } catch (err) {
          console.error("[site-lohn] falha ao enviar via Resend", err);
          setStatus("error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="space-y-1">
        <label className="text-xs text-neutral-300" htmlFor="contact-name">
          Nome*
        </label>
        <input
          id="contact-name"
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-md border border-gold/15 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-gold/40"
          placeholder="Seu nome"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-neutral-300" htmlFor="contact-phone">
          Telefone*
        </label>
        <input
          id="contact-phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: formatPhoneBR(e.target.value) }))}
          className="w-full rounded-md border border-gold/15 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-gold/40"
          placeholder="(11) 91333-1559"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-neutral-300" htmlFor="contact-subject">
          Assunto*
        </label>
        <input
          id="contact-subject"
          required
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          className="w-full rounded-md border border-gold/15 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-gold/40"
          placeholder="Ex.: agendar atendimento"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-neutral-300" htmlFor="contact-message">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className="min-h-40 w-full resize-none rounded-md border border-gold/15 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-gold/40"
          placeholder="Descreva aqui o seu caso"
        />
      </div>

      {status === "success" ? (
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          Mensagem enviada com sucesso. Em breve entraremos em contato.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          Não foi possível enviar sua mensagem agora. Tente novamente em instantes.
        </div>
      ) : null}

      <div className="pt-1">
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
}