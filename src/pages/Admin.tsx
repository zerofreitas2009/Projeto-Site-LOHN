import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { useSession } from "../components/auth/SessionProvider";
import Button from "../components/site/ui/Button";
import { Star } from "lucide-react";
import TaggingDashboard from "../components/admin/TaggingDashboard";

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  service?: string | null;
  comment: string;
  approved: boolean;
  created_at: string;
};

const ADMIN_EMAIL = "advocacialohn@gmail.com";

type AdminView = "reviews" | "tagging";

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? "fill-lohn-accent text-lohn-accent" : "text-lohn-ink/20"}`}
        />
      ))}
    </div>
  );
}

export default function Admin() {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  const [view, setView] = useState<AdminView>("reviews");

  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const isAdmin = useMemo(() => {
    const email = session?.user?.email ?? "";
    return email.toLowerCase() === ADMIN_EMAIL;
  }, [session?.user?.email]);

  useEffect(() => {
    if (loading) return;
    if (!session) navigate("/login", { replace: true });
  }, [loading, navigate, session]);

  const load = async () => {
    setStatus("loading");
    const { data, error } = await supabase
      .from("site_lohn_reviews")
      .select("id,name,rating,service,comment,approved,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[site-lohn] admin load reviews", error);
      setStatus("error");
      return;
    }

    setRows((data ?? []) as ReviewRow[]);
    setStatus("idle");
  };

  useEffect(() => {
    if (!session || !isAdmin) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isAdmin]);

  const approve = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("site_lohn_reviews").update({ approved }).eq("id", id);
    if (error) {
      console.error("[site-lohn] admin approve", error);
      return;
    }
    await load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("site_lohn_reviews").delete().eq("id", id);
    if (error) {
      console.error("[site-lohn] admin delete", error);
      return;
    }
    await load();
  };

  return (
    <div className="min-h-dvh bg-lohn-light text-lohn-ink">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-lohn-ink">Admin</h1>
            <p className="mt-2 text-sm text-lohn-ink/70">
              Moderação de avaliações e relatório de tagueamento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={view === "reviews" ? "primary" : "outline"}
              onClick={() => setView("reviews")}
              disabled={!isAdmin}
            >
              Avaliações
            </Button>
            <Button
              variant={view === "tagging" ? "primary" : "outline"}
              onClick={() => setView("tagging")}
              disabled={!isAdmin}
            >
              Tagueamento
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/", { replace: true });
              }}
            >
              Sair
            </Button>
          </div>
        </div>

        {!loading && session && !isAdmin ? (
          <div className="mt-8 rounded-2xl border border-red-600/20 bg-red-600/10 p-4 text-sm text-red-800">
            Sua conta não possui permissão para acessar a área admin.
          </div>
        ) : null}

        {view === "tagging" ? (
          <TaggingDashboard isAdmin={isAdmin} />
        ) : (
          <div className="mt-8 rounded-2xl border border-lohn-dark/15 bg-lohn-light/40 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-lohn-ink/80">
                {status === "loading" ? "Carregando..." : `${rows.length} registros`}
              </div>
              <Button variant="outline" onClick={() => load()} disabled={!isAdmin}>
                Atualizar
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-lohn-ink">{r.name}</div>
                        <Stars rating={r.rating} />
                        {r.service ? (
                          <span className="rounded-full border border-lohn-dark/15 bg-lohn-light/30 px-2 py-0.5 text-xs text-lohn-ink/80">
                            {r.service}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            r.approved
                              ? "bg-emerald-600/10 text-emerald-800"
                              : "bg-amber-500/10 text-amber-900"
                          }`}
                        >
                          {r.approved ? "Publicado" : "Pendente"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-lohn-ink/60">
                        {new Date(r.created_at).toLocaleString("pt-BR")}
                      </div>
                      <div className="mt-3 text-sm leading-relaxed text-lohn-ink/80">
                        {r.comment}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {r.approved ? (
                        <Button
                          variant="outline"
                          onClick={() => approve(r.id, false)}
                          disabled={!isAdmin}
                        >
                          Despublicar
                        </Button>
                      ) : (
                        <Button onClick={() => approve(r.id, true)} disabled={!isAdmin}>
                          Aprovar
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => remove(r.id)} disabled={!isAdmin}>
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {rows.length === 0 && status !== "loading" ? (
                <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-6 text-sm text-lohn-ink/70">
                  Nenhuma avaliação encontrada.
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}