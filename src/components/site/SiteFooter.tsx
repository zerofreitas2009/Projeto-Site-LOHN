import Button from "./ui/Button";

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
                <span className="text-neutral-400">Telefone:</span> (00) 00000-0000
              </li>
              <li>
                <span className="text-neutral-400">E-mail:</span> contato@exemplo.com
              </li>
              <li>
                <span className="text-neutral-400">Atendimento:</span> Seg–Sex, 9h–18h
              </li>
            </ul>
            <p className="mt-3 text-xs text-neutral-400">
              (Os dados acima serão substituídos pelos dados exatos do documento anexado.)
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gold">Ação rápida</div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Envie uma mensagem e retornaremos o mais breve possível.
            </p>
            <div className="mt-4">
              <a href="#top">
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
