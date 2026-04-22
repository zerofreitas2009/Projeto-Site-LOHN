import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import Button from "./ui/Button";
import ReviewModal from "./ReviewModal";
import { openSiteLohnReviewModal } from "./reviewModalBus";

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  service?: string | null;
  comment: string;
  created_at: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? "fill-gold text-gold" : "text-neutral-300"}`}
        />
      ))}
    </div>
  );
}

export default function SiteReviewsSection() {
  const [state, setState] = useState<LoadState>("idle");
  const [rows, setRows] = useState<ReviewRow[]>([]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    setState("loading");
    const { data, error } = await supabase
      .from("site_lohn_reviews")
      .select("id,name,rating,service,comment,created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(24);

    if (error) {
      console.error("[site-lohn] falha ao carregar avaliações", error);
      setState("error");
      return;
    }

    setRows((data ?? []) as ReviewRow[]);
    setState("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const five = copy.filter((r) => r.rating === 5);
    const rest = copy.filter((r) => r.rating !== 5);
    return [...five, ...rest].slice(0, 12);
  }, [rows]);

  const scrollByCards = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>("[data-review-card='true']");
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = 16;
    el.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
  };

  return (
    <section id="avaliacoes" aria-label="Avaliações" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-gold/80">AVALIAÇÕES</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              O que dizem sobre a LOHN
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Comentários enviados pelo público (publicados após aprovação).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => openSiteLohnReviewModal()}>Avaliar agora</Button>
            <Button variant="outline" onClick={() => load()}>
              Atualizar
            </Button>
          </div>
        </div>

        {/* Frame de visualização (carrossel) */}
        <div className="mt-8 rounded-2xl border border-gold/15 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-neutral-700">
              {state === "loading"
                ? "Carregando avaliações..."
                : state === "error"
                  ? "Não foi possível carregar as avaliações agora."
                  : sorted.length === 0
                    ? "Nenhuma avaliação publicada ainda."
                    : `${sorted.length} avaliações exibidas (priorizando 5 estrelas).`}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                className="inline-flex items-center justify-center rounded-md border border-gold/20 bg-white p-2 text-gold hover:bg-gold/5"
                aria-label="Anterior"
                disabled={state !== "ready" || sorted.length === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                className="inline-flex items-center justify-center rounded-md border border-gold/20 bg-white p-2 text-gold hover:bg-gold/5"
                aria-label="Próximo"
                disabled={state !== "ready" || sorted.length === 0}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
          >
            {sorted.map((r) => (
              <article
                key={r.id}
                data-review-card="true"
                className="w-[86%] shrink-0 snap-start rounded-xl border border-gold/15 bg-white p-5 shadow-sm sm:w-[420px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-neutral-900">{r.name}</div>
                      {r.service ? (
                        <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-xs text-neutral-700">
                          {r.service}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-neutral-700 line-clamp-5">
                  {r.comment}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="inline-flex items-center justify-center rounded-md border border-gold/20 bg-white px-3 py-2 text-sm font-medium text-gold hover:bg-gold/5"
              disabled={state !== "ready" || sorted.length === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="inline-flex items-center justify-center rounded-md border border-gold/20 bg-white px-3 py-2 text-sm font-medium text-gold hover:bg-gold/5"
              disabled={state !== "ready" || sorted.length === 0}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ReviewModal onSubmitted={() => load()} />
    </section>
  );
}