import { Link } from "react-router-dom";
import Button from "./ui/Button";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function SiteFooter() {
  return (
    <footer className="border-t border-lohn-dark/15">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3 md:items-start">
          <div>
            <div className="text-sm font-semibold tracking-wide text-lohn-ink">LOHN ADVOCACIA</div>
            <div className="mt-1 text-xs text-lohn-ink/70">Prestação de serviços jurídicos</div>
            <div className="mt-4 text-sm text-lohn-ink/80">
              <span className="text-lohn-ink/60">Atendimento:</span> 24h
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-lohn-ink">Contato</div>
            <div className="mt-3 space-y-2 text-sm text-lohn-ink/80">
              <div>
                <span className="text-lohn-ink/60">WhatsApp:</span>{" "}
                <a
                  className="text-lohn-accent hover:text-lohn-dark underline underline-offset-4"
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                    "Olá! Vim pelo site da LOHN Advocacia e gostaria de atendimento."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  (11) 91333-1559
                </a>
              </div>
              <div>
                <span className="text-lohn-ink/60">E-mail:</span>{" "}
                <a
                  className="text-lohn-accent hover:text-lohn-dark underline underline-offset-4"
                  href="mailto:advocacialohn@gmail.com"
                >
                  advocacialohn@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="md:justify-self-end">
            <Link to="/contato" className="inline-flex w-full md:w-auto">
              <Button className="w-full md:w-auto">Ir para contato</Button>
            </Link>
            <p className="mt-3 text-xs text-lohn-ink/60">
              Formulário de e-mail disponível na página de contato.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-lohn-dark/15 pt-6 text-xs text-lohn-ink/60">
          © {new Date().getFullYear()} LOHN Advocacia. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}