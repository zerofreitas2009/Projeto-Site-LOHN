import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import WhatsAppFloatingButton from "../components/site/WhatsAppFloatingButton";
import Button from "../components/site/ui/Button";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const WHATSAPP_TEXT =
  "Olá! Vim pelo site da LOHN Advocacia e preciso de ajuda de um Advogado Criminal.";

function whatsAppHref(text = WHATSAPP_TEXT) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

type UrgencyTag = "alta" | "media" | "analise";

type UrgencyResult = {
  tag: UrgencyTag;
  label: string;
  title: string;
  text: string;
  whatsappText: string;
};

function getUrgency(score: number): UrgencyResult {
  if (score >= 5) {
    return {
      tag: "alta",
      label: "● Urgência ALTA",
      title: "Seu caso pede ação imediata.",
      text: "Há fatores que exigem providências rápidas. Não espere.",
      whatsappText: "Olá! Meu caso é urgente e preciso falar com um advogado criminal agora.",
    };
  }

  if (score >= 3) {
    return {
      tag: "media",
      label: "● Urgência MÉDIA",
      title: "Importante agir o quanto antes.",
      text: "Sua situação merece orientação profissional para reduzir riscos e decisões erradas.",
      whatsappText: "Olá! Preciso de orientação em um caso criminal e gostaria de falar com um advogado.",
    };
  }

  return {
    tag: "analise",
    label: "● Vale uma análise",
    title: "Uma orientação pode evitar problemas futuros.",
    text: "Entender seus direitos e riscos faz diferença — especialmente no início.",
    whatsappText: "Olá! Gostaria de uma análise inicial sobre meu caso criminal.",
  };
}

type Option = { label: string; points: 0 | 1 | 2 };

type Question = { title: string; options: Option[] };

const questions: Question[] = [
  {
    title: "1. Qual é a situação no momento?",
    options: [
      { label: "Alguém foi preso em flagrante agora", points: 2 },
      { label: "Há uma audiência de custódia marcada", points: 2 },
      { label: "Estou sendo investigado em inquérito", points: 1 },
      { label: "Recebi uma intimação para depor", points: 1 },
      { label: "Já respondo a um processo criminal", points: 1 },
      { label: "Defesa em PAD", points: 1 },
    ],
  },
  {
    title: "2. Há quanto tempo aconteceu?",
    options: [
      { label: "Está acontecendo agora / hoje", points: 2 },
      { label: "Nas últimas 48 horas", points: 2 },
      { label: "Esta semana", points: 1 },
      { label: "Há mais tempo", points: 0 },
    ],
  },
  {
    title: "3. Há alguém preso neste momento?",
    options: [
      { label: "Sim, há uma pessoa presa agora", points: 2 },
      { label: "Pode haver risco de prisão", points: 1 },
      { label: "Não, ninguém está preso", points: 0 },
    ],
  },
  {
    title: "4. Já tem um advogado acompanhando?",
    options: [
      { label: "Não, ainda não tenho", points: 1 },
      { label: "Tenho, mas quero segunda opinião", points: 1 },
      { label: "Sim, está tudo encaminhado", points: 0 },
    ],
  },
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-lohn-dark/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <div className="text-base font-semibold text-lohn-ink">{q}</div>
        <div className="text-lohn-accent">{open ? "−" : "+"}</div>
      </button>
      {open ? (
        <p className="pb-5 text-sm leading-relaxed text-lohn-ink/75">{a}</p>
      ) : null}
    </div>
  );
}

export default function Criminal() {
  useEffect(() => {
    document.title = "Direito Criminal | LOHN Advocacia";
  }, []);

  const total = questions.length;
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const progressPct = useMemo(() => {
    if (done) return 100;
    return Math.round((step / total) * 100);
  }, [done, step, total]);

  const result = useMemo(() => getUrgency(score), [score]);

  const choose = (points: 0 | 1 | 2) => {
    setScore((s) => s + points);

    const next = step + 1;
    if (next >= total) {
      setDone(true);
      return;
    }
    setStep(next);
  };

  const restart = () => {
    setStep(0);
    setScore(0);
    setDone(false);
  };

  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-dvh bg-lohn-light text-lohn-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-lohn-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(244,231,221,0.14),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.22em] text-lohn-light/80">
              ESPECIALISTAS EM DIREITO CRIMINAL
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-lohn-light sm:text-5xl">
              Sua defesa criminal séria quando cada hora conta.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-lohn-light/85">
              Atuação imediata em flagrante, audiência de custódia, inquérito e processo — com
              estratégia desde a primeira diligência.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={whatsAppHref()} target="_blank" rel="noreferrer">
                <Button
                  variant="light"
                  trackingId="criminal_cta_whatsapp_hero"
                  trackingLabel="Criminal - Falar com advogado (Hero)"
                >
                  Falar com um advogado agora
                </Button>
              </a>
              <a href="#diagnostico">
                <Button
                  variant="outline"
                  trackingId="criminal_cta_diagnostico"
                  trackingLabel="Criminal - Ir para diagnóstico"
                  className="border-lohn-light/50 text-lohn-light hover:bg-lohn-light/10 hover:border-lohn-light/70"
                >
                  Fazer diagnóstico
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Perfil */}
      <section className="border-y border-lohn-dark/15 bg-lohn-light/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="max-w-xl">
              <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">/ PERFIL</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
                Um escritório completo em defesa penal.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-lohn-ink/75">
                Atuamos em todas as fases do processo criminal, da primeira diligência na delegacia ao
                habeas corpus nos tribunais superiores. Cada caso é conduzido com estratégia, discrição
                e total dedicação.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-lohn-ink/75">
                Aqui você não fala com uma secretária eletrônica. Você fala com quem vai assumir a sua
                defesa e agir sem perder tempo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-lohn-dark/15 bg-lohn-light/30 shadow-sm">
                <div
                  className="aspect-[4/5] w-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=900&q=70)",
                  }}
                />
              </div>
              <div className="text-center">
                <a href={whatsAppHref()} target="_blank" rel="noreferrer">
                  <Button
                    trackingId="criminal_cta_whatsapp_perfil"
                    trackingLabel="Criminal - WhatsApp (Perfil)"
                  >
                    Falar agora no WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que você está sentindo */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">/ O QUE VOCÊ ESTÁ SENTINDO</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
          Se você está vivendo isso agora.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              ic: "◷",
              t: "Recebi a notícia e não sei o que fazer nas próximas horas — sinto que cada minuto pode piorar tudo.",
            },
            {
              ic: "⚠",
              t: "Tenho medo de falar a coisa errada na delegacia e me prejudicar ainda mais.",
            },
            {
              ic: "✉",
              t: "Chegou uma intimação e não faço ideia se isso pode virar uma prisão.",
            },
            {
              ic: "⊕",
              t: "É um familiar meu que foi preso e eu estou perdido, sem saber por onde começar.",
            },
            {
              ic: "◈",
              t: "Tenho medo de contratar errado, perder tempo e dinheiro, e o problema continuar.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm"
            >
              <div className="text-lohn-accent">{c.ic}</div>
              <p className="mt-3 text-sm leading-relaxed text-lohn-ink/75">“{c.t}”</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={whatsAppHref()} target="_blank" rel="noreferrer">
            <Button
              trackingId="criminal_cta_whatsapp_sentindo"
              trackingLabel="Criminal - WhatsApp (Sentindo)"
            >
              Falar agora no WhatsApp
            </Button>
          </a>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xl font-semibold leading-snug text-lohn-ink">
          Em Direito Criminal, o erro mais caro é{" "}
          <span className="text-lohn-accent">esperar</span>. A diferença está em agir certo, desde o
          primeiro momento.
        </p>
      </section>

      {/* Por que nós */}
      <section className="border-y border-lohn-dark/15 bg-lohn-light/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">/ POR QUE NÓS</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
            Defesa do primeiro contato à última instância.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Atendimento rápido",
                d: "Você fala com um advogado sem ficar esperando. Resposta imediata nos momentos críticos.",
              },
              {
                n: "02",
                t: "Experiência real",
                d: "Casos criminais enfrentados de ponta a ponta. A estratégia já foi testada na prática.",
              },
              {
                n: "03",
                t: "Todas as fases",
                d: "Flagrante, custódia, inquérito, PAD, processo, recursos e habeas corpus.",
              },
              {
                n: "04",
                t: "Presença onde precisa",
                d: "Diligências em delegacia e penitenciária quando o caso exige presença imediata.",
              },
            ].map((c) => (
              <div
                key={c.n}
                className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm"
              >
                <div className="text-lohn-accent/80">{c.n}</div>
                <div className="mt-2 text-lg font-semibold text-lohn-ink">{c.t}</div>
                <p className="mt-2 text-sm leading-relaxed text-lohn-ink/75">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href={whatsAppHref()} target="_blank" rel="noreferrer">
              <Button
                trackingId="criminal_cta_whatsapp_porque"
                trackingLabel="Criminal - WhatsApp (Por que nós)"
              >
                Falar agora no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Diagnóstico */}
      <section
        id="diagnostico"
        className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20 scroll-mt-24"
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">DIAGNÓSTICO DE URGÊNCIA</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-lohn-ink">
            Descubra o nível de urgência do seu caso em 30 segundos.
          </h2>
          <p className="mt-2 text-sm text-lohn-ink/70">Responda 4 perguntas rápidas e receba uma orientação.</p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-lohn-dark/10">
            <div className="h-full bg-lohn-accent transition-all" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="mt-8">
            {!done ? (
              <div>
                <div className="text-xs font-medium tracking-[0.18em] text-lohn-accent">
                  PERGUNTA {step + 1} DE {total}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-lohn-ink">{questions[step].title}</h3>
                <div className="mt-5 grid gap-2">
                  {questions[step].options.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => choose(o.points)}
                      className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div
                  className={`text-xs font-semibold tracking-[0.22em] uppercase ${
                    result.tag === "alta" ? "text-red-700" : "text-lohn-accent"
                  }`}
                >
                  {result.label}
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-lohn-ink">{result.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-lohn-ink/75">{result.text}</p>

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <a
                    href={whatsAppHref(result.whatsappText)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      trackingId="criminal_cta_whatsapp_resultado"
                      trackingLabel={`Criminal - WhatsApp (Resultado ${result.tag})`}
                    >
                      Falar com um advogado agora
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    trackingId="criminal_cta_reiniciar_diagnostico"
                    trackingLabel="Criminal - Reiniciar diagnóstico"
                    onClick={restart}
                  >
                    Refazer diagnóstico
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a href={whatsAppHref()} target="_blank" rel="noreferrer">
            <Button
              trackingId="criminal_cta_whatsapp_pos_diagnostico"
              trackingLabel="Criminal - WhatsApp (Após diagnóstico)"
            >
              Falar agora no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Como atuamos */}
      <section className="border-y border-lohn-dark/15 bg-lohn-light/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">/ COMO ATUAMOS</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
            Experiência que se traduz em defesa de verdade.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { ic: "⚖", t: "Atuação completa", d: "Investigação, instrução, recursos e habeas corpus." },
              { ic: "◷", t: "Urgência 24h", d: "Resposta imediata em flagrante e custódia." },
              { ic: "⊘", t: "Sigilo absoluto", d: "Total confidencialidade e discrição." },
              { ic: "⊙", t: "Presença onde precisa", d: "Diligências em delegacia e penitenciária." },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 text-center shadow-sm"
              >
                <div className="text-2xl">{c.ic}</div>
                <div className="mt-3 text-lg font-semibold text-lohn-ink">{c.t}</div>
                <p className="mt-2 text-sm text-lohn-ink/75">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href={whatsAppHref()} target="_blank" rel="noreferrer">
              <Button
                trackingId="criminal_cta_whatsapp_atuamos"
                trackingLabel="Criminal - WhatsApp (Como atuamos)"
              >
                Falar agora no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">/ DÚVIDAS FREQUENTES</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
          Perguntas frequentes.
        </h2>

        <div className="mt-8 rounded-2xl border border-lohn-dark/15 bg-lohn-light/30 px-6 shadow-sm">
          {[
            {
              q: "Fui preso em flagrante. O que faço nas primeiras horas?",
              a: "As primeiras horas são decisivas. O ideal é não prestar depoimento sem orientação e acionar um advogado imediatamente, que pode acompanhar a audiência de custódia e analisar os pedidos cabíveis.",
            },
            {
              q: "Recebi uma intimação para depor. Preciso mesmo de advogado?",
              a: "Sim. Mesmo um depoimento aparentemente simples pode ter consequências sérias. Ter orientação antes de falar protege você de erros difíceis de reverter.",
            },
            {
              q: "O atendimento é sigiloso?",
              a: "Totalmente. Tudo o que você compartilhar é protegido pelo sigilo profissional.",
            },
            {
              q: "Como funcionam os honorários?",
              a: "Definidos conforme a complexidade e a fase do caso, com transparência e combinados antes de qualquer compromisso.",
            },
            {
              q: "Vocês atendem fora do horário comercial e nos fins de semana?",
              a: "Sim. Casos criminais não escolhem hora. O atendimento de urgência existe para que você não fique sem orientação em momentos críticos.",
            },
            {
              q: "O advogado vai até a delegacia ou penitenciária?",
              a: "Quando o caso exige presença imediata, sim. Realizamos diligências presenciais conforme a necessidade.",
            },
            {
              q: "Vocês atendem online ou só presencial?",
              a: "As duas formas. O primeiro contato pode ser online para agilidade, e o acompanhamento presencial acontece sempre que o caso pedir.",
            },
          ].map((item, idx) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={faqOpen === idx}
              onToggle={() => setFaqOpen((v) => (v === idx ? null : idx))}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={whatsAppHref()} target="_blank" rel="noreferrer">
            <Button trackingId="criminal_cta_whatsapp_faq" trackingLabel="Criminal - WhatsApp (FAQ)">
              Falar agora no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Próximo passo */}
      <section className="bg-lohn-dark">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-light/80">/ PRÓXIMO PASSO</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-light sm:text-4xl">
            Não enfrente isso sozinho.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-lohn-light/80">
            Quanto antes você agir, mais opções de defesa você tem.
          </p>

          <div className="mt-7">
            <a href={whatsAppHref()} target="_blank" rel="noreferrer">
              <Button
                variant="light"
                trackingId="criminal_cta_whatsapp_final"
                trackingLabel="Criminal - WhatsApp (Final)"
              >
                Falar agora no WhatsApp
              </Button>
            </a>
          </div>

          <p className="mt-4 text-sm text-lohn-light/70">🔒 Atendimento sigiloso e sem compromisso.</p>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
