import { useEffect, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { logSiteLohnEvent } from "../../lib/siteLohnTagging";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function WhatsAppFloatingButton() {
  const [open, setOpen] = useState(false);

  const href = useMemo(() => {
    return `${WHATSAPP_URL}?text=${encodeURIComponent(
      "Olá! Vim pelo site da LOHN Advocacia e gostaria de atendimento."
    )}`;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="mb-3 w-[280px] rounded-2xl border border-lohn-light/20 bg-lohn-dark/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-lohn-light">WhatsApp</div>
              <div className="mt-1 text-xs text-lohn-light/70">
                Atendimento 24h para urgências.
              </div>
            </div>
            <button
              type="button"
              className="rounded-md border border-lohn-light/20 bg-lohn-dark/60 p-2 text-lohn-light hover:bg-lohn-light/10"
              aria-label="Fechar"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              logSiteLohnEvent({
                event_type: "button_click",
                page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
                button_id: "whatsapp_floating_start",
                button_label: "WhatsApp - Iniciar conversa",
              });
            }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lohn-light px-4 py-2 text-sm font-medium text-lohn-dark transition hover:bg-lohn-light/90"
          >
            <MessageCircle className="h-4 w-4" />
            Iniciar conversa
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          logSiteLohnEvent({
            event_type: "button_click",
            page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
            button_id: "whatsapp_floating_toggle",
            button_label: next ? "WhatsApp - Abrir" : "WhatsApp - Fechar",
          });
        }}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-lohn-light/25 bg-lohn-dark/90 text-lohn-light shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-lohn-dark"
        aria-label={open ? "Fechar WhatsApp" : "Abrir WhatsApp"}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}