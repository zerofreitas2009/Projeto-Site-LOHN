import { Card, CardDescription, CardTitle } from "../ui/Card";

export default function AboutSection() {
  return (
    <section id="sobre" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        {/* Sobre */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-gold/80">SOBRE</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gold sm:text-3xl">
              Atendimento humanizado, com foco em resultado
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-200/90">
              Atuamos com seriedade e discrição, oferecendo orientação jurídica com clareza
              e responsabilidade. O objetivo é construir a melhor estratégia para cada caso,
              com acompanhamento próximo e comunicação objetiva.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-300">
              (Observação: os textos finais desta seção serão ajustados conforme o conteúdo
              do documento anexado.)
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardTitle>Ética e sigilo</CardTitle>
              <CardDescription>
                Atuação pautada em confidencialidade e rigor técnico.
              </CardDescription>
            </Card>
            <Card>
              <CardTitle>Estratégia</CardTitle>
              <CardDescription>
                Análise cuidadosa do cenário e definição de próximos passos.
              </CardDescription>
            </Card>
            <Card className="sm:col-span-2">
              <CardTitle>Atendimento</CardTitle>
              <CardDescription>
                Comunicação clara e suporte durante toda a condução do caso.
              </CardDescription>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
