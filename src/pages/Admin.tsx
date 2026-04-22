import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { useSession } from "../components/auth/SessionProvider";
import Button from "../components/site/ui/Button";
import { Star } from "lucide-react";

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
};

const ADMIN_EMAIL = "advocacialohn@gmail.com";

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? "fill-gold text-gold" : "text-neutral-300"}`}
        />
      ))}
    </div>
  );
}

export default function Admin() {
  const { session, loading } = useSession();
  const navigate = useNavigate();

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
      .select("id,name,rating,comment,approved,created_at")
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
    <div className="min-h-dvh bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Moderação de avaliações
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Aprovar (publicar) ou remover avaliações enviadas pelo formulário.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => load()} disabled={!isAdmin}>
              Atualizar
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
            Sua conta não possui permissão para moderar avaliações.
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-gold/15 bg-white p-4 shadow-sm">
          <div className="text-sm text-neutral-700">
            {status === "loading" ? "Carregando..." : `${rows.length} registros`}
          </div>

          <div className="mt-4 space-y-3">
            {rows.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-gold/15 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-neutral-900">{r.name}</div>
                      <Stars rating={r.rating} />
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          r.approved
                            ? "bg-emerald-600/10 text-emerald-800"
                            : "bg-amber-500/10 text-amber-800"
                        }`}
                      >
                        {r.approved ? "Publicado" : "Pendente"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      {new Date(r.created_at).toLocaleString("pt-BR")}
                    </div>
                    <div className="mt-3 text-sm leading-relaxed text-neutral-700">
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
                    <Button
                      variant="outline"
                      onClick={() => remove(r.id)}
                      disabled={!isAdmin}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {rows.length === 0 && status !== "loading" ? (
              <div className="rounded-xl border border-gold/15 bg-white p-6 text-sm text-neutral-600">
                Nenhuma avaliação encontrada.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
