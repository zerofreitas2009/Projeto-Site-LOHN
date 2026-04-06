import { useMemo, useState } from "react";
import Button from "./ui/Button";

const TO_EMAIL = "advocacialohn@gmail.com";

type FormState = {
  name: string;
  phone: string;
  subject: string;
};

export default function ContactEmailForm() {
  const [form, setForm] = useState<FormState>({ name: "", phone: "", subject: "" });

  const mailtoHref = useMemo(() => {
    const subject = `assunto: ${form.subject}`.toLowerCase();

    const body = (
      `nome: ${form.name}\n` +
      `telefone: ${form.phone}\n` +
      `assunto: ${form.subject}\n\n` +
      `mensagem: (descreva aqui o seu caso)`
    ).toLowerCase();

    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form.name, form.phone, form.subject]);

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
          Nome
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
          Telefone
        </label>
        <input
          id="contact-phone"
          required
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="w-full rounded-md border border-gold/15 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-gold/40"
          placeholder="(11) 91333-1559"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-neutral-300" htmlFor="contact-subject">
          Assunto
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

      <div className="pt-1">
        <Button type="submit" className="w-full">
          Enviar e-mail
        </Button>
      </div>

      <p className="text-xs text-neutral-500">
        O texto do e-mail será gerado em caixa baixa.
      </p>
    </form>
  );
}
