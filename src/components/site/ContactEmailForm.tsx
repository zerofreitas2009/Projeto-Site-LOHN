import { useMemo, useState } from "react";
import Button from "./ui/Button";

const TO_EMAIL = "advocacialohn@gmail.com";

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
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const mailtoHref = useMemo(() => {
    const subjectText = (form.subject || "contato").toLowerCase();

    const subject = `assunto: ${subjectText}`;

    const body = (
      `nome: ${form.name}\n` +
      `telefone: ${form.phone}\n` +
      `assunto: ${form.subject || "-"}\n\n` +
      `mensagem: ${form.message || "-"}`
    ).toLowerCase();

    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form.name, form.phone, form.subject, form.message]);

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailtoHref;
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

      <div className="pt-1">
        <Button type="submit" className="w-full">
          Enviar e-mail
        </Button>
      </div>
    </form>
  );
}