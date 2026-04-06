import SiteHeader from "../components/site/SiteHeader";
import ContactEmailForm from "../components/site/ContactEmailForm";
import SiteFooter from "../components/site/SiteFooter";
import WhatsAppFloatingButton from "../components/site/WhatsAppFloatingButton";
import Button from "../components/site/ui/Button";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function Contact() {
  return (
    <div className="min-h-dvh bg-black text-neutral-200">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.22em] text-gold/80">CONTATO</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gold sm:text-4xl">
            Fale com a LOHN Advocacia
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-200/90">
            Atendimento 24h. Escolha a melhor forma para falar conosco.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gold/10 bg-neutral-950/40 p-6">
            <h2 className="text-lg font-semibold text-gold">WhatsApp</h2>
            <p className="mt-2 text-sm text-neutral-300">Clique para iniciar a conversa.</p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                  "Olá! Vim pelo site da LOHN Advocacia e gostaria de atendimento."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <Button>Conversar no WhatsApp</Button>
              </a>
              <a href="/" className="inline-flex">
                <Button variant="outline">Voltar para a página inicial</Button>
              </a>
            </div>

            <div className="mt-4 text-sm text-neutral-300">
              <span className="text-neutral-400">Telefone:</span> (11) 91333-1559
            </div>
          </section>

          <section className="rounded-2xl border border-gold/10 bg-neutral-950/40 p-6">
            <h2 className="text-lg font-semibold text-gold">Enviar e-mail</h2>

            <div className="mt-4 rounded-xl border border-gold/10 bg-black/40 p-4">
              <div className="text-sm text-neutral-300">
                <span className="text-neutral-400">E-mail:</span>{" "}
                <a
                  className="text-gold hover:text-gold-soft underline underline-offset-4"
                  href="mailto:advocacialohn@gmail.com"
                >
                  advocacialohn@gmail.com
                </a>
              </div>
              <ContactEmailForm />
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}