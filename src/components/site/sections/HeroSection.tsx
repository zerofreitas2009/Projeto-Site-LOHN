import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-lohn-dark">
      {/* Fundo / detalhes visuais */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,231,221,0.12),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(244,231,221,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(244,231,221,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,231,221,0.25)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 md:pb-24 md:pt-20">
        {/* Hero */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-lohn-light/80">
              LOHN ADVOCACIA
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-light sm:text-4xl md:text-5xl">
              Prestação de serviços jurídicos com atuação estratégica
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-lohn-light/85">
              Atendimento com foco em técnica, agilidade e comunicação clara — do primeiro
              contato à condução do caso.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/contato">
                <Button variant="light">Agendar atendimento</Button>
              </Link>
              <a href="#servicos">
                <Button
                  variant="outline"
                  className="border-lohn-light/50 text-lohn-light hover:bg-lohn-light/10 hover:border-lohn-light/70"
                >
                  Ver serviços
                </Button>
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-xl border border-lohn-light/15 bg-lohn-dark/40 p-4 backdrop-blur">
                <div className="text-sm font-semibold text-lohn-light">Atuação dedicada</div>
                <div className="mt-1 text-xs text-lohn-light/75">
                  Estratégia e atenção aos detalhes
                </div>
              </div>
              <div className="rounded-xl border border-lohn-light/15 bg-lohn-dark/40 p-4 backdrop-blur">
                <div className="text-sm font-semibold text-lohn-light">Comunicação direta</div>
                <div className="mt-1 text-xs text-lohn-light/75">Transparência em cada etapa</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(244,231,221,0.18),transparent_60%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-lohn-light/15 bg-lohn-dark/30">
              <img
                src="/assets/atendimento-moderno.jpeg"
                alt="Atendimento LOHN Advocacia"
                className="h-[280px] w-full object-cover object-top opacity-90 md:h-[420px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lohn-dark/75 via-lohn-dark/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-sm font-semibold text-lohn-light">Atendimento moderno</div>
                <div className="mt-1 text-xs text-lohn-light/75">
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