import { Link } from "react-router-dom";
import Button from "./ui/Button";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gold/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide text-gold">LOHN ADVOCACIA</div>
            <div className="mt-1 text-xs text-neutral-400">Prestação de serviços jurídicos</div>
          </div>

          <Link to="/contato" className="inline-flex">
            <Button>Ir para contato</Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-gold/10 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} LOHN Advocacia. Todos os direitos reservados.</div>
          <div className="text-neutral-600">Site estático — versão inicial para refinamento.</div>
        </div>
      </div>
    </footer>
  );
}
