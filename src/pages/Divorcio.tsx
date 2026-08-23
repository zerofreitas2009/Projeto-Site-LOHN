import { useMemo, useState, useEffect } from "react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import WhatsAppFloatingButton from "../components/site/WhatsAppFloatingButton";
import Button from "../components/site/ui/Button";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const WHATSAPP_TEXT =
  "Olá! Vim pelo site da LOHN Advocacia e quero entender mais sobre divórcio.";

function whatsAppHref(text = WHATSAPP_TEXT) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

type Step1 = "acordo" | "possivel" | "conflito" | null;

type Step2 = "menores" | "maiores" | null;

type Step3 = "patrimonio" | "simples" | null;

type Result = {
  tag: string;
  title: string;
  text: string;
};

function getResult(a1: Step1, a2: Step2): Result {
  if (a1 === "conflito") {
    return {
      tag: "Caminho indicado · Via judicial estratégica",
      title: "Seu caso pede atuação técnica e firme.",
      text:
        "Quando não há acordo, a condução estratégica faz toda a diferença para proteger o que é seu e abrir espaço para soluções. Muitos casos evoluem para acordo com a orientação certa — e, quando o litígio é inevitável, a atuação técnica defende seus interesses.",
    };
  }

  if (a2 === "menores") {
    return {
      tag: "Caminho indicado · Via judicial consensual",
      title: "Com filhos menores, a Justiça participa — mas sem virar guerra.",
      text:
        "Como há filhos menores, o acordo de guarda e alimentos precisa de homologação judicial por lei. Isso não significa litígio nem demora: com acordo entre as partes, o processo pode ser conduzido de forma consensual, com mínima exposição. O segredo é estruturar bem o acordo antes de protocolar.",
    };
  }

  if (a1 === "acordo" && a2 === "maiores") {
    return {
      tag: "Caminho indicado · Divórcio em cartório",
      title: "Seu caso tem cenário ideal para resolver em cartório.",
      text:
        "Com acordo entre as partes e sem filhos menores, o divórcio pode ser feito por escritura pública em cartório — normalmente o caminho mais rápido, mais discreto e menos custoso. Vale confirmar os detalhes do seu caso na análise inicial.",
    };
  }

  return {
    tag: "Caminho indicado · Acordo assistido",
    title: "Seu caso tem grande potencial de solução consensual.",
    text:
      "Você está perto de um acordo — e é aí que a orientação certa acelera tudo. Com mediação técnica dos pontos em aberto, é possível chegar à via consensual (mais rápida e econômica) e evitar o desgaste de um processo litigioso.",
  };
}

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

export default function Divorcio() {
  useEffect(() => {
    document.title = "Divórcio | LOHN Advocacia";
  }, []);

  const [step, setStep] = useState<1 | 2 | 3 | "result">(1);
  const [a1, setA1] = useState<Step1>(null);
  const [a2, setA2] = useState<Step2>(null);
  const [a3, setA3] = useState<Step3>(null);

  const result = useMemo(() => getResult(a1, a2), [a1, a2]);

  const restart = () => {
    setStep(1);
    setA1(null);
    setA2(null);
    setA3(null);
  };

  return (
    <div className="min-h-dvh bg-lohn-light text-lohn-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-lohn-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(244,231,221,0.14),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.22em] text-lohn-light/80">
              ESPECIALISTAS EM DIVÓRCIO
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-lohn-light sm:text-5xl">
              Divórcio não precisa ser uma batalha.
              <span className="block text-lohn-light/90">Pode ser uma solução.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-lohn-light/85">
              Com a estratégia jurídica certa, o processo é conduzido com agilidade, discrição e sem
              desgaste — do início ao fim, 100% online.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={whatsAppHref()} target="_blank" rel="noreferrer">
                <Button
                  variant="light"
                  trackingId="divorcio_cta_whatsapp_hero"
                  trackingLabel="Divórcio - Falar com especialista (Hero)"
                >
                  Falar com especialista agora
                </Button>
              </a>
              <a href="#diagnostico">
                <Button
                  variant="outline"
                  trackingId="divorcio_cta_diagnostico"
                  trackingLabel="Divórcio - Ir para diagnóstico"
                  className="border-lohn-light/50 text-lohn-light hover:bg-lohn-light/10 hover:border-lohn-light/70"
                >
                  Fazer diagnóstico
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-lohn-dark/15 bg-lohn-light/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-5">
              <div className="text-2xl font-semibold text-lohn-ink">30–60</div>
              <div className="mt-1 text-sm text-lohn-ink/70">dias em média para divórcio consensual</div>
            </div>
            <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-5">
              <div className="text-2xl font-semibold text-lohn-ink">100%</div>
              <div className="mt-1 text-sm text-lohn-ink/70">online, sem filas, sem cartório</div>
            </div>
            <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-5">
              <div className="text-2xl font-semibold text-lohn-ink">0</div>
              <div className="mt-1 text-sm text-lohn-ink/70">encontros presenciais desnecessários</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dor */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">A REALIDADE DE QUEM ADIA</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
            Você já pensou dessa forma alguma vez?
          </h2>
          <p className="mt-3 text-sm text-lohn-ink/70">
            Se algum desses pensamentos já passou pela sua cabeça, existe uma saída mais inteligente do
            que parece.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              ic: "🕐",
              t: '"Isso vai demorar anos..."',
              d: "A ideia de arrastar um processo por meses é um dos principais motivos para adiar uma decisão já tomada.",
            },
            {
              ic: "⚔️",
              t: '"Vai virar uma guerra por tudo."',
              d: "Patrimônio, guarda, dívidas. Cada tema parece um novo campo de batalha.",
            },
            {
              ic: "😔",
              t: '"Enquanto isso, a vida para."',
              d: "Manter a convivência com quem você já decidiu separar é um desgaste que vai muito além do jurídico.",
            },
            {
              ic: "😰",
              t: '"Nem sei por onde começar."',
              d: "A sensação de não saber o primeiro passo correto paralisa quem poderia resolver isso muito mais rápido.",
            },
            {
              ic: "💸",
              t: '"Vai me custar mais do que vale."',
              d: "O medo de custos incertos faz muita gente adiar o inevitável — sem saber que pode ser diferente.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm"
            >
              <div className="text-2xl">{c.ic}</div>
              <div className="mt-3 text-lg font-semibold text-lohn-ink">{c.t}</div>
              <div className="mt-2 text-sm leading-relaxed text-lohn-ink/75">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-lohn-dark/15 bg-lohn-light/30 p-6 text-center">
          <p className="text-lg font-semibold text-lohn-ink">
            E se o seu divórcio pudesse ser conduzido com mais agilidade, sem conflito desnecessário e
            total discrição?
          </p>
          <div className="mt-5">
            <a href={whatsAppHref()} target="_blank" rel="noreferrer">
              <Button
                trackingId="divorcio_cta_whatsapp_dor"
                trackingLabel="Divórcio - WhatsApp (Seção Dor)"
              >
                Conhecer a abordagem certa
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Solução */}
      <section className="border-y border-lohn-dark/15 bg-lohn-light/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">A DIFERENÇA ESTÁ NA ABORDAGEM</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
            Divórcio não é briga. É estratégia com técnica.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-lohn-ink/75">
            Com acompanhamento jurídico especializado, divórcio se torna um processo gerenciado — e
            não vivido no improviso. Você toma decisões informadas, protege o que é seu e segue em
            frente.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { ic: "⚡", t: "Processo ágil", d: "Mapeamos seu caso e identificamos o caminho mais rápido." },
              { ic: "💻", t: "100% online", d: "Sem idas desnecessárias; tudo com discrição e comodidade." },
              { ic: "🎯", t: "Especialização", d: "Atuação focada em Direito de Família e Sucessões." },
              { ic: "🤝", t: "Foco no acordo", d: "Sempre que possível, via consensual: mais rápida e menos custosa." },
              { ic: "🔒", t: "Discrição", d: "Seu caso tratado com privacidade e comunicação objetiva." },
            ].map((f) => (
              <div
                key={f.t}
                className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm"
              >
                <div className="text-2xl">{f.ic}</div>
                <div className="mt-3 text-lg font-semibold text-lohn-ink">{f.t}</div>
                <div className="mt-2 text-sm leading-relaxed text-lohn-ink/75">{f.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href={whatsAppHref()} target="_blank" rel="noreferrer">
              <Button trackingId="divorcio_cta_whatsapp_solucao" trackingLabel="Divórcio - WhatsApp (Solução)">
                Quero entender meu caso
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Diagnóstico */}
      <section id="diagnostico" className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20 scroll-mt-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">FERRAMENTA DE DIAGNÓSTICO</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-lohn-ink">
            Qual é o melhor caminho para o seu caso?
          </h2>
          <p className="mt-2 text-sm text-lohn-ink/70">
            3 perguntas. Resultado personalizado. (Não substitui consulta jurídica.)
          </p>

          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-lohn-dark/10">
                <div
                  className={`h-1 bg-lohn-accent transition-all ${
                    (step !== "result" ? step >= i : 3 >= i) ? "w-full" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="mt-6">
              <div className="text-xs font-medium tracking-[0.18em] text-lohn-accent">PERGUNTA 1 DE 3</div>
              <div className="mt-2 text-lg font-semibold text-lohn-ink">
                Você e seu cônjuge estão de acordo com os pontos principais do divórcio?
              </div>
              <div className="mt-1 text-sm text-lohn-ink/70">
                Divisão de bens, guarda dos filhos (se houver) e pensão alimentícia.
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA1("acordo");
                    setStep(2);
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    A
                  </span>
                  Sim — temos acordo sobre os pontos principais
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA1("possivel");
                    setStep(2);
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    B
                  </span>
                  Ainda não, mas acredito ser possível chegar a um acordo
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA1("conflito");
                    setStep(2);
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    C
                  </span>
                  Não há acordo — a situação está conflituosa
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-6">
              <div className="text-xs font-medium tracking-[0.18em] text-lohn-accent">PERGUNTA 2 DE 3</div>
              <div className="mt-2 text-lg font-semibold text-lohn-ink">Vocês têm filhos menores de 18 anos?</div>
              <div className="mt-1 text-sm text-lohn-ink/70">Isso impacta a via jurídica.</div>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA2("menores");
                    setStep(3);
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    A
                  </span>
                  Sim, temos filhos menores
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA2("maiores");
                    setStep(3);
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    B
                  </span>
                  Não — ou filhos já são maiores de 18 anos
                </button>
              </div>

              <button
                type="button"
                className="mt-4 text-sm text-lohn-ink/70 hover:text-lohn-dark underline underline-offset-4"
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-6">
              <div className="text-xs font-medium tracking-[0.18em] text-lohn-accent">PERGUNTA 3 DE 3</div>
              <div className="mt-2 text-lg font-semibold text-lohn-ink">
                Há patrimônio relevante a ser dividido entre vocês?
              </div>
              <div className="mt-1 text-sm text-lohn-ink/70">
                Imóveis, participações societárias, investimentos, bens de alto valor.
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA3("patrimonio");
                    setStep("result");
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    A
                  </span>
                  Sim — temos patrimônio significativo a dividir
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/40 px-4 py-3 text-left text-sm text-lohn-ink hover:bg-lohn-dark/5"
                  onClick={() => {
                    setA3("simples");
                    setStep("result");
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-lohn-dark/20 text-xs font-semibold text-lohn-accent">
                    B
                  </span>
                  Não — o patrimônio é simples ou já está definido
                </button>
              </div>

              <button
                type="button"
                className="mt-4 text-sm text-lohn-ink/70 hover:text-lohn-dark underline underline-offset-4"
                onClick={() => setStep(2)}
              >
                Voltar
              </button>
            </div>
          ) : null}

          {step === "result" ? (
            <div className="mt-6">
              <span className="inline-flex rounded-full border border-lohn-dark/15 bg-lohn-light/40 px-3 py-1 text-xs font-medium text-lohn-ink/80">
                {result.tag}
              </span>
              <div className="mt-3 text-xl font-semibold text-lohn-ink">{result.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-lohn-ink/75">{result.text}</p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a href={whatsAppHref("Olá! Fiz o diagnóstico no site e quero confirmar o melhor caminho para meu divórcio.")} target="_blank" rel="noreferrer">
                  <Button
                    trackingId="divorcio_cta_whatsapp_result"
                    trackingLabel="Divórcio - WhatsApp (Resultado Diagnóstico)"
                  >
                    Confirmar caminho com um especialista
                  </Button>
                </a>
                <Button variant="outline" onClick={restart} trackingId="divorcio_diagnostico_refazer" trackingLabel="Divórcio - Refazer diagnóstico">
                  Refazer análise
                </Button>
              </div>

              <div className="mt-4 text-xs text-lohn-ink/60">
                Suas respostas: {a1 ?? "-"} / {a2 ?? "-"} / {a3 ?? "-"}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="border-y border-lohn-dark/15 bg-lohn-light/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">O QUE DIZEM OS CLIENTES</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
            Decisões tomadas com clareza. Processos conduzidos com técnica.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Ricardo M.", "Fernanda C.", "Marcos A."].map((name, idx) => (
              <div
                key={name}
                className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 shadow-sm"
              >
                <div className="text-sm text-lohn-accent">★★★★★</div>
                <p className="mt-3 text-sm italic leading-relaxed text-lohn-ink/80">
                  {idx === 0
                    ? "Eu imaginava que divórcio ia paralisar minha vida por meses. Foram menos de 60 dias do primeiro contato até a conclusão. Tudo online, sem complicação."
                    : idx === 1
                      ? "A maior preocupação era a divisão dos bens. Fui orientada desde o início. O processo foi conduzido com muito profissionalismo e com a discrição que eu precisava."
                      : "Estava adiando há mais de um ano por medo da burocracia. Em dois meses, estava tudo resolvido. O atendimento online foi uma facilidade que eu não esperava."}
                </p>
                <div className="mt-4 text-sm font-semibold text-lohn-ink">{name}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "+200", l: "famílias atendidas" },
              { n: "100%", l: "dos casos conduzidos online" },
              { n: "30–60", l: "dias em casos consensuais" },
              { n: "0", l: "burocracia desnecessária" },
            ].map((m) => (
              <div key={m.l} className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-5">
                <div className="text-2xl font-semibold text-lohn-ink">{m.n}</div>
                <div className="mt-1 text-sm text-lohn-ink/70">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <p className="text-xs font-medium tracking-[0.22em] text-lohn-accent">DÚVIDAS FREQUENTES</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-ink">
          Respostas diretas para quem já tomou a decisão.
        </h2>

        <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-lohn-dark/15 bg-lohn-light/30 p-5">
          {[
            {
              q: "Preciso ir presencialmente ao cartório ou ao fórum?",
              a: "Nem sempre. Em casos consensuais, muita coisa pode ser feita de forma remota/online, com assinatura eletrônica. A presença física só se torna necessária em situações específicas.",
            },
            {
              q: "Quanto tempo leva um divórcio na prática?",
              a: "Depende do nível de acordo. Um divórcio consensual pode ser concluído entre 30 e 60 dias; já o litigioso pode levar meses ou anos.",
            },
            {
              q: "Meu caso precisa obrigatoriamente ir ao tribunal?",
              a: "Nem sempre. Com acordo e sem filhos menores, muitas situações podem ser resolvidas em cartório. Com filhos menores, a Justiça participa por lei — mas isso não significa litígio.",
            },
            {
              q: "Como funcionam os honorários? Há um valor fixo?",
              a: "Cada caso tem sua complexidade. Trabalhamos com orçamento apresentado de forma transparente após a análise inicial.",
            },
            {
              q: "E se não houver acordo sobre os bens?",
              a: "Pode ser necessária via judicial. Mesmo assim, com estratégia, é possível buscar acordos e proteger seus interesses.",
            },
          ].map((it, idx) => (
            <FaqController key={it.q} idx={idx} q={it.q} a={it.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-lohn-dark">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
          <p className="text-xs font-medium tracking-[0.22em] text-lohn-light/80">O PRÓXIMO PASSO É SIMPLES</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lohn-light sm:text-4xl">
            A decisão já foi tomada. Agora é hora de agir com inteligência.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-lohn-light/80">
            Agende uma análise e descubra qual é o caminho mais rápido e estratégico para o seu caso.
          </p>

          <div className="mt-7">
            <a href={whatsAppHref()} target="_blank" rel="noreferrer">
              <Button
                variant="light"
                trackingId="divorcio_cta_whatsapp_final"
                trackingLabel="Divórcio - WhatsApp (Final)"
              >
                Falar com especialista agora
              </Button>
            </a>
          </div>

          <div className="mt-4 text-sm text-lohn-light/70">🔒 Total discrição</div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}

function FaqController({ idx, q, a }: { idx: number; q: string; a: string }) {
  const [open, setOpen] = useState(idx === 0);
  return <FaqItem q={q} a={a} open={open} onToggle={() => setOpen((v) => !v)} />;
}
