import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const DEFAULT_TEXT =
  "Olá! Vim pelo site da LOHN Advocacia e gostaria de falar com um advogado.";

export default function WhatsAppFloatingButton() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const href = `${WHATSAPP_URL}?text=${encodeURIComponent(DEFAULT_TEXT)}`;

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open ? (
        <div
          ref={panelRef}
          className="mb-3 w-[280px] rounded-2xl border border-gold/15 bg-black/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gold">WhatsApp</div>
              <div className="mt-1 text-xs text-neutral-300">(11) 91333-1559 · Atendimento 24h</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-gold/15 bg-neutral-950/40 p-2 text-gold hover:bg-gold/10"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-neutral-300">
            Clique abaixo para iniciar a conversa.
          </p>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-black transition hover:bg-gold-soft"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar mensagem
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-neutral-950/70 text-gold shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur transition hover:bg-gold/10"
        aria-label={open ? "Fechar WhatsApp" : "Abrir WhatsApp"}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
