import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";

const WHATSAPP_NUMBER = "5511913331559";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

type NavItem =
  | { label: string; kind: "route"; to: string }
  | { label: string; kind: "hash"; hash: string };

const navItems: NavItem[] = [
  { label: "Início", kind: "route", to: "/" },
  { label: "Sobre", kind: "hash", hash: "#sobre" },
  { label: "Serviços", kind: "hash", hash: "#servicos" },
  { label: "Contato", kind: "route", to: "/contato" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Olá! Vim pelo site da LOHN Advocacia e gostaria de atendimento."
  )}`;

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
        {/* Marca */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/logo.jpeg"
            alt="Logo LOHN Advocacia"
            className="h-10 w-10 rounded-md object-cover"
            loading="eager"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-gold">
              LOHN ADVOCACIA
            </div>
            <div className="text-xs text-neutral-300">Prestação de serviços jurídicos</div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            if (item.kind === "route") {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-neutral-200/90 hover:text-gold transition"
                >
                  {item.label}
                </Link>
              );
            }

            const href = onHome ? item.hash : `/${item.hash}`;
            return (
              <a
                key={item.hash}
                href={href}
                className="text-sm text-neutral-200/90 hover:text-gold transition"
              >
                {item.label}
              </a>
            );
          })}
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            <Button variant="outline">WhatsApp</Button>
          </a>
        </nav>

        {/* Mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-gold/20 bg-neutral-950/60 p-2 text-gold md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Overlay mobile */}
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-gold/15 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold tracking-wide text-gold">Menu</div>
              <button
                type="button"
                className="rounded-md border border-gold/25 bg-neutral-900 p-2 text-gold"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {navItems.map((item) => {
                if (item.kind === "route") {
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-gold/15 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 hover:border-gold/30 hover:bg-neutral-900/80"
                    >
                      {item.label}
                    </Link>
                  );
                }

                const href = onHome ? item.hash : `/${item.hash}`;
                return (
                  <a
                    key={item.hash}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-gold/15 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 hover:border-gold/30 hover:bg-neutral-900/80"
                  >
                    {item.label}
                  </a>
                );
              })}
              <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                <Button className="w-full">WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}