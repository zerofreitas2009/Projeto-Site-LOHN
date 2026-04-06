import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Fundo / detalhes visuais */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.16),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(212,175,55,0.10),transparent_50%),linear-gradient(to_bottom,rgba(0,0,0,0.65),rgba(0,0,0,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(212,175,55,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 md:pb-24 md:pt-20">
        {/* Hero */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-gold/80">
              LOHN ADVOCACIA
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gold sm:text-4xl md:text-5xl">
              Prestação de serviços jurídicos com atuação estratégica
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-200/90">
              Atendimento com foco em técnica, agilidade e comunicação clara — do primeiro
              contato à condução do caso.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/contato">
                <Button>Agendar atendimento</Button>
              </Link>
              <a href="#servicos">
                <Button variant="outline">Ver serviços</Button>
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-xl border border-gold/10 bg-neutral-950/40 p-4">
                <div className="text-sm font-semibold text-gold">Atuação dedicada</div>
                <div className="mt-1 text-xs text-neutral-300">
                  Estratégia e atenção aos detalhes
                </div>
              </div>
              <div className="rounded-xl border border-gold/10 bg-neutral-950/40 p-4">
                <div className="text-sm font-semibold text-gold">Comunicação direta</div>
                <div className="mt-1 text-xs text-neutral-300">Transparência em cada etapa</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.20),transparent_60%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-gold/15 bg-neutral-950/40">
              <img
                src="/assets/atendimento-moderno.jpeg"
                alt="Atendimento LOHN Advocacia"
                className="h-[280px] w-full object-cover opacity-90 md:h-[420px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-sm font-semibold text-gold">Atendimento moderno</div>
                <div className="mt-1 text-xs text-neutral-200/80">
                  Presencial e/ou remoto, conforme disponibilidade
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}