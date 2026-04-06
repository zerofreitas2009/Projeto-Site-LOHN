import { Briefcase, FileText, Landmark, Scale, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Card, CardDescription, CardTitle } from "../ui/Card";

type ServiceItem = {
  title: string;
  description: string;
};

type ServiceGroup = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: ServiceItem[];
};

const groups: ServiceGroup[] = [
  {
    title: "Direito Criminal",
    icon: Scale,
    items: [
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
    ],
  },
  {
    title: "Direito de Família",
    icon: Users,
    items: [
      {
        title: "Divórcio (consensual e litigioso)",
        description: "Orientação e condução do procedimento, com foco em solução segura.",
      },
      {
        title: "Pensão alimentícia",
        description: "Fixação, revisão e execução de alimentos, conforme o caso.",
      },
      {
        title: "Guarda de menores",
        description: "Guarda, convivência e medidas necessárias para proteção do menor.",
      },
    ],
  },
  {
    title: "Direito Civil",
    icon: FileText,
    items: [
      {
        title: "Inventário",
        description: "Inventário judicial ou extrajudicial, com organização documental.",
      },
      {
        title: "Partilha de bens",
        description: "Definição e formalização de partilha em casos familiares e sucessórios.",
      },
      {
        title: "Heranças e sucessões",
        description: "Orientação em direitos sucessórios e regularização patrimonial.",
      },
    ],
  },
  {
    title: "Direito Previdenciário",
    icon: Landmark,
    items: [
      {
        title: "Aposentadorias",
        description: "Análise, planejamento e requerimento do benefício (INSS).",
      },
      {
        title: "Auxílio-doença / incapacidade",
        description: "Acompanhamento de pedidos, recursos e perícias.",
      },
      {
        title: "BPC/LOAS",
        description: "Pedido e acompanhamento do benefício assistencial.",
      },
      {
        title: "Pensão por morte",
        description: "Requerimento e regularização de dependência.",
      },
      {
        title: "Revisão de benefício",
        description: "Revisões administrativas/judiciais por erro de cálculo ou tempo.",
      },
    ],
  },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-gold/80">SERVIÇOS</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gold sm:text-3xl">
            Áreas de atuação
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-200/90">
            Serviços organizados por área para facilitar a visualização.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-gold/15 bg-neutral-950/40 p-2">
                  <group.icon className="h-4 w-4 text-gold" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-gold">{group.title}</h3>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((s) => (
                  <Card key={`${group.title}-${s.title}`} className="p-5">
                    <CardTitle className="text-[15px]">{s.title}</CardTitle>
                    <CardDescription className="mt-1">{s.description}</CardDescription>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-gold/10 bg-neutral-950/40 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg border border-gold/15 bg-black p-2">
              <Briefcase className="h-4 w-4 text-gold" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gold">Atendimento 24h</div>
              <div className="mt-1 text-sm text-neutral-300">
                Para urgências, fale diretamente pelo WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}