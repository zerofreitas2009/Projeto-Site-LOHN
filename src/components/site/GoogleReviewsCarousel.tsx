import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
  time?: number;
};

type LoadState = "idle" | "loading" | "ready" | "error";

function loadGoogleMapsPlaces(apiKey: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));

  const existing = document.getElementById("google-maps-js");
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).google?.maps?.places) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")), {
        once: true,
      });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "google-maps-js";
    script.async = true;
    script.defer = true;

    // loading=async removes the "loaded directly" warning
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&language=pt-BR&region=BR&loading=async`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

function renderStars(rating: number) {
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

export default function GoogleReviewsCarousel() {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined;

  const [state, setState] = useState<LoadState>("idle");
  const [placeName, setPlaceName] = useState<string>("");
  const [placeUrl, setPlaceUrl] = useState<string>("");
  const [reviews, setReviews] = useState<GoogleReview[]>([]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!apiKey || !placeId) {
      setState("error");
      return;
    }

    let cancelled = false;
    setState("loading");

    loadGoogleMapsPlaces(apiKey)
      .then(async () => {
        if (cancelled) return;

        const google = (window as any).google;
        if (!google?.maps?.places?.Place) {
          throw new Error("Places API (new) is not available. Check enabled APIs.");
        }

        // New Places API (recommended over legacy PlacesService)
        const place = new google.maps.places.Place({ id: placeId });
        await place.fetchFields({
          fields: ["displayName", "googleMapsUri", "rating", "reviews"],
        });

        if (cancelled) return;

        const displayName =
          typeof place.displayName === "string"
            ? place.displayName
            : place.displayName?.text ?? "";

        setPlaceName(displayName);
        setPlaceUrl(place.googleMapsUri ?? "");

        const fetched: GoogleReview[] = Array.isArray(place.reviews)
          ? place.reviews.map((r: any) => ({
              author_name: r?.authorAttribution?.displayName ?? r?.author_name ?? "",
              rating: Number(r?.rating ?? 0),
              text: String(r?.text ?? r?.text?.text ?? ""),
              relative_time_description: r?.relativePublishTimeDescription ?? "",
              time: r?.publishTime ? Date.parse(r.publishTime) / 1000 : undefined,
            }))
          : [];

        setReviews(fetched);
        setState("ready");
      })
      .catch((err) => {
        console.error("[site-lohn] falha ao carregar avaliações do Google", err);
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, placeId]);

  const sorted = useMemo(() => {
    const copy = [...reviews];
    copy.sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (b.time ?? 0) - (a.time ?? 0);
    });

    const five = copy.filter((r) => r.rating === 5);
    const rest = copy.filter((r) => r.rating !== 5);
    return [...five, ...rest].slice(0, 12);
  }, [reviews]);

  const scrollByCards = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>("[data-review-card='true']");
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = 16;
    el.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
  };

  const missingConfig = !apiKey || !placeId;

  return (
    <section aria-label="Avaliações do Google" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-gold/80">AVALIAÇÕES</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              O que dizem no Google
            </h2>
            {placeName ? (
              <p className="mt-2 text-sm text-neutral-600">{placeName}</p>
            ) : null}
          </div>

          {placeUrl ? (
            <a
              href={placeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gold hover:text-gold-soft underline underline-offset-4"
            >
              Ver no Google
            </a>
          ) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-gold/15 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-neutral-700">
              {missingConfig
                ? "Configuração pendente (API Key / Place ID)."
                : state === "loading"
                  ? "Carregando avaliações..."
                  : state === "error"
                    ? "Não foi possível carregar as avaliações agora."
                    : sorted.length === 0
                      ? "Nenhuma avaliação disponível no momento."
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
            {sorted.map((r, idx) => (
              <article
                key={`${r.author_name}-${idx}`}
                data-review-card="true"
                className="w-[86%] shrink-0 snap-start rounded-xl border border-gold/15 bg-white p-5 shadow-sm sm:w-[420px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{r.author_name}</div>
                    <div className="mt-1 text-xs text-neutral-500">
                      {r.relative_time_description ?? ""}
                    </div>
                  </div>
                  {renderStars(r.rating)}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-neutral-700 line-clamp-5">
                  {r.text || "(Sem comentário escrito)"}
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

        {missingConfig ? (
          <p className="mt-3 text-xs text-neutral-500">
            Defina <span className="font-mono">VITE_GOOGLE_PLACES_API_KEY</span> e{" "}
            <span className="font-mono">VITE_GOOGLE_PLACE_ID</span> no arquivo .env.
          </p>
        ) : null}
      </div>
    </section>
  );
}