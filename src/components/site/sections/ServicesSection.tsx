import { Scale } from "lucide-react";
import { Card, CardDescription, CardTitle } from "../ui/Card";

const services = [
  {
    title: "Atuação em Inquérito Policial",
    description: "Acompanhamento e estratégia desde as primeiras diligências.",
  },
  {
    title: "Flagrantes",
    description: "Atuação imediata e orientação de medidas urgentes.",
  },
  {
    title: "Audiência de Custódia",
    description: "Defesa técnica e pedidos adequados ao caso concreto.",
  },
  {
    title: "Defesa em PAD",
    description: "Atuação em processos administrativos disciplinares.",
  },
  {
    title: "Execução Penal",
    description: "Acompanhamento de benefícios, progressões e incidentes.",
  },
  {
    title: "Processo Criminal",
    description: "Defesa em todas as fases: investigação, instrução e recursos.",
  },
  {
    title: "Habeas Corpus",
    description: "Medidas para garantir liberdade e direitos fundamentais.",
  },
  {
    title: "Diligência em penitenciária ou delegacia",
    description: "Atendimento e providências presenciais quando necessário.",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        {/* Serviços */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-gold/80">SERVIÇOS</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gold sm:text-3xl">
              Áreas de atuação
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-200/90">
              Abaixo estão os principais serviços (conforme imagem anexada). Caso existam
              outros itens no documento, eu adiciono na próxima rodada.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg border border-gold/15 bg-black p-2">
                  <Scale className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-[15px]">{s.title}</CardTitle>
                  <CardDescription className="mt-1">{s.description}</CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
