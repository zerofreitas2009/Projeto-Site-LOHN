import { useEffect, useMemo, useState } from "react";
import { X, Star } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import Button from "./ui/Button";
import { SITE_LOHN_REVIEW_MODAL_EVENT } from "./reviewModalBus";

type SubmitState = "idle" | "sending" | "sent" | "error";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1" aria-label="Selecione a nota">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="rounded p-1 hover:bg-gold/5"
            aria-label={`${v} estrela${v > 1 ? "s" : ""}`}
          >
            <Star className={`h-5 w-5 ${active ? "fill-gold text-gold" : "text-neutral-300"}`} />
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewModal({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(() => {
    return (
      submitState !== "sending" &&
      name.trim().length > 0 &&
      comment.trim().length >= 5 &&
      rating >= 1 &&
      rating <= 5
    );
  }, [comment, name, rating, submitState]);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setSubmitState("idle");
    };

    window.addEventListener(SITE_LOHN_REVIEW_MODAL_EVENT, onOpen);
    return () => window.removeEventListener(SITE_LOHN_REVIEW_MODAL_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gold/15 bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-neutral-900">Deixe sua avaliação</div>
            <div className="mt-1 text-sm text-neutral-600">
              Sua avaliação será analisada e publicada após aprovação.
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gold/20 bg-white p-2 text-gold hover:bg-gold/5"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;

            setSubmitState("sending");

            const { error } = await supabase.from("site_lohn_reviews").insert({
              name: name.trim(),
              rating,
              comment: comment.trim(),
              approved: false,
            });

            if (error) {
              console.error("[site-lohn] falha ao enviar avaliação", error);
              setSubmitState("error");
              return;
            }

            setSubmitState("sent");
            setName("");
            setRating(5);
            setComment("");
            onSubmitted?.();
          }}
        >
          <div className="space-y-1">
            <label className="text-xs text-neutral-700" htmlFor="review-modal-name">
              Nome*
            </label>
            <input
              id="review-modal-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gold/20 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-gold/50"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs text-neutral-700">Nota*</div>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-700" htmlFor="review-modal-comment">
              Comentário*
            </label>
            <textarea
              id="review-modal-comment"
              required
              minLength={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32 w-full resize-none rounded-md border border-gold/20 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-gold/50"
              placeholder="Conte como foi sua experiência"
            />
          </div>

          {submitState === "sent" ? (
            <div className="rounded-md border border-emerald-600/20 bg-emerald-600/10 px-3 py-2 text-xs text-emerald-800">
              Obrigado! Sua avaliação foi enviada e ficará pendente de aprovação.
            </div>
          ) : null}

          {submitState === "error" ? (
            <div className="rounded-md border border-red-600/20 bg-red-600/10 px-3 py-2 text-xs text-red-800">
              Não foi possível enviar sua avaliação agora. Tente novamente.
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitState === "sending"}
            >
              Fechar
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitState === "sending" ? "Enviando..." : "Enviar avaliação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
