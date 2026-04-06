import Button from "./ui/Button";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function SiteFooter() {
  return (
    <footer id="contato" className="scroll-mt-24 border-t border-gold/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        {/* Rodapé / Contato */}
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold tracking-wide text-gold">LOHN ADVOCACIA</div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Prestação de serviços jurídicos com atendimento moderno e foco em estratégia.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gold">Contato</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              <li>
                <span className="text-neutral-400">WhatsApp:</span>{" "}
                <a
                  className="text-gold hover:text-gold-soft underline underline-offset-4"
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                    "Olá! Vim pelo site da LOHN Advocacia e gostaria de atendimento."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  (11) 91333-1559
                </a>
              </li>
              <li>
                <span className="text-neutral-400">E-mail:</span>{" "}
                <a
                  className="text-gold hover:text-gold-soft underline underline-offset-4"
                  href="mailto:Advocacialohn@gmail.com"
                >
                  Advocacialohn@gmail.com
                </a>
              </li>
              <li>
                <span className="text-neutral-400">Atendimento:</span> 24h
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gold">Ação rápida</div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Clique para falar agora pelo WhatsApp.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                  "Olá! Vim pelo site da LOHN Advocacia e gostaria de falar com um advogado."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <Button>Enviar mensagem</Button>
              </a>
              <a href="#top" className="inline-flex">
                <Button variant="outline">Voltar ao topo</Button>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gold/10 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} LOHN Advocacia. Todos os direitos reservados.</div>
          <div className="text-neutral-600">Site estático — versão inicial para refinamento.</div>
        </div>
      </div>
    </footer>
  );
}