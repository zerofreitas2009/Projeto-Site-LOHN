import { useEffect, useMemo, useState } from "react";
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from "../../lib/siteLohnConsent";

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [openPrefs, setOpenPrefs] = useState(false);

  useEffect(() => {
    setConsent(getCookieConsent());

    const onChange = () => setConsent(getCookieConsent());
    window.addEventListener("site_lohn_cookie_consent_changed", onChange);
    return () => window.removeEventListener("site_lohn_cookie_consent_changed", onChange);
  }, []);

  const draft = useMemo<CookieConsent>(() => {
    return consent ?? { necessary: true, analytics: false, marketing: false };
  }, [consent]);

  if (consent) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[80] p-4">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-lohn-dark/15 bg-lohn-light/95 p-4 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-lohn-ink">Respeitamos sua privacidade</div>
              <p className="mt-1 text-xs leading-relaxed text-lohn-ink/70">
                Usamos cookies/armazenamento local para garantir o funcionamento do site e, com sua
                permissão, para medir acessos e cliques (analytics). Você pode aceitar, rejeitar ou
                personalizar.
              </p>
              <a
                href="/politica-de-privacidade"
                className="mt-2 inline-block text-xs text-lohn-accent hover:text-lohn-dark underline underline-offset-4"
              >
                Política de Privacidade
              </a>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-lohn-dark/30 bg-lohn-light px-4 py-2 text-sm font-medium text-lohn-dark hover:bg-lohn-dark/5"
                onClick={() => setOpenPrefs(true)}
              >
                Personalizar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-lohn-dark/30 bg-lohn-light px-4 py-2 text-sm font-medium text-lohn-dark hover:bg-lohn-dark/5"
                onClick={() => {
                  const next = { necessary: true, analytics: false, marketing: false } as const;
                  setCookieConsent(next);
                  setConsent(next);
                }}
              >
                Rejeitar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-lohn-dark px-4 py-2 text-sm font-medium text-lohn-light hover:bg-lohn-dark/90"
                onClick={() => {
                  const next = { necessary: true, analytics: true, marketing: true } as const;
                  setCookieConsent(next);
                  setConsent(next);
                }}
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      </div>

      {openPrefs ? (
        <div className="fixed inset-0 z-[90]">
          <div
            className="absolute inset-0 bg-lohn-dark/40"
            onClick={() => setOpenPrefs(false)}
            aria-hidden
          />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-lohn-dark/15 bg-lohn-light p-5 shadow-2xl">
            <div className="text-lg font-semibold text-lohn-ink">Preferências de cookies</div>
            <p className="mt-1 text-sm text-lohn-ink/70">
              Cookies necessários são sempre ativos. Você pode habilitar ou desabilitar os demais.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-lohn-dark/15 bg-lohn-light/40 p-4">
                <div>
                  <div className="text-sm font-semibold text-lohn-ink">Necessários</div>
                  <div className="mt-1 text-xs text-lohn-ink/70">Essenciais para o funcionamento do site.</div>
                </div>
                <div className="text-xs font-semibold text-lohn-ink/70">Sempre ativo</div>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-lohn-dark/15 bg-lohn-light/40 p-4">
                <div>
                  <div className="text-sm font-semibold text-lohn-ink">Analíticos</div>
                  <div className="mt-1 text-xs text-lohn-ink/70">
                    Permite medir acessos, tempo na página e cliques (tagueamento).
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={draft.analytics}
                  onChange={(e) =>
                    setConsent({ necessary: true, analytics: e.target.checked, marketing: draft.marketing })
                  }
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-lohn-dark/15 bg-lohn-light/40 p-4">
                <div>
                  <div className="text-sm font-semibold text-lohn-ink">Marketing</div>
                  <div className="mt-1 text-xs text-lohn-ink/70">
                    Cookies de publicidade/remarketing (se aplicável).
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={draft.marketing}
                  onChange={(e) =>
                    setConsent({ necessary: true, analytics: draft.analytics, marketing: e.target.checked })
                  }
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-lohn-dark/30 bg-lohn-light px-4 py-2 text-sm font-medium text-lohn-dark hover:bg-lohn-dark/5"
                onClick={() => setOpenPrefs(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-lohn-dark px-4 py-2 text-sm font-medium text-lohn-light hover:bg-lohn-dark/90"
                onClick={() => {
                  const next = consent ?? draft;
                  setCookieConsent(next);
                  setConsent(next);
                  setOpenPrefs(false);
                }}
              >
                Salvar preferências
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}