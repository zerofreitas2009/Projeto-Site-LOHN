import { useMemo, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import Button from "../site/ui/Button";

type TagEventRow = {
  id: string;
  created_at: string;
  event_type: "page_view" | "button_click" | "page_duration";
  page_path: string | null;
  button_id: string | null;
  button_label: string | null;
  session_id: string | null;
  duration_ms: number | null;
  device_type: string | null;
  platform: string | null;
};

function isoDateInput(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDuration(ms: number) {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${String(sec).padStart(2, "0")}s` : `${sec}s`;
}

function PlatformBarChart({ items }: { items: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="mt-2 grid gap-2">
      {items.map((i) => (
        <div key={i.label} className="grid gap-1">
          <div className="flex items-center justify-between text-xs text-lohn-ink/70">
            <span>{i.label}</span>
            <span className="font-medium text-lohn-ink">{i.value}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-lohn-dark/10">
            <div
              className="h-2 rounded-full bg-lohn-accent"
              style={{ width: `${Math.round((i.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TaggingDashboard({ isAdmin }: { isAdmin: boolean }) {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return isoDateInput(d);
  });
  const [toDate, setToDate] = useState(() => isoDateInput(new Date()));
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [rows, setRows] = useState<TagEventRow[]>([]);

  const load = async () => {
    if (!isAdmin) return;
    setStatus("loading");

    const from = new Date(`${fromDate}T00:00:00.000Z`).toISOString();
    const to = new Date(`${toDate}T23:59:59.999Z`).toISOString();

    const { data, error } = await supabase
      .from("site_lohn_tag_events")
      .select(
        "id,created_at,event_type,page_path,button_id,button_label,session_id,duration_ms,device_type,platform"
      )
      .gte("created_at", from)
      .lte("created_at", to)
      .not("page_path", "ilike", "/admin%")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("[site-lohn] admin load tag events", error);
      setStatus("error");
      return;
    }

    setRows((data ?? []) as TagEventRow[]);
    setStatus("idle");
  };

  const summary = useMemo(() => {
    const total = rows.length;
    const pageViews = rows.filter((r) => r.event_type === "page_view").length;
    const clicks = rows.filter((r) => r.event_type === "button_click").length;

    const durations = rows
      .filter((r) => r.event_type === "page_duration" && typeof r.duration_ms === "number")
      .map((r) => r.duration_ms as number);

    const avgDurationMs = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;

    const byButton = new Map<string, number>();
    for (const r of rows) {
      if (r.event_type !== "button_click") continue;
      const key = r.button_label || r.button_id || "(sem id)";
      byButton.set(key, (byButton.get(key) ?? 0) + 1);
    }

    const topButtons = Array.from(byButton.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const byDevice = new Map<string, number>();
    for (const r of rows) {
      if (r.event_type !== "page_view") continue;
      const key = r.device_type || "desconhecido";
      byDevice.set(key, (byDevice.get(key) ?? 0) + 1);
    }

    const deviceBreakdown = Array.from(byDevice.entries()).sort((a, b) => b[1] - a[1]);

    const byPlatform = new Map<string, number>([
      ["iOS", 0],
      ["Android", 0],
      ["Site", 0],
    ]);

    for (const r of rows) {
      if (r.event_type !== "page_view") continue;
      if (r.platform === "ios") byPlatform.set("iOS", (byPlatform.get("iOS") ?? 0) + 1);
      else if (r.platform === "android")
        byPlatform.set("Android", (byPlatform.get("Android") ?? 0) + 1);
      else byPlatform.set("Site", (byPlatform.get("Site") ?? 0) + 1);
    }

    const platformChart = Array.from(byPlatform.entries()).map(([label, value]) => ({
      label,
      value,
    }));

    return {
      total,
      pageViews,
      clicks,
      avgDurationMs,
      topButtons,
      deviceBreakdown,
      platformChart,
    };
  }, [rows]);

  return (
    <div className="mt-8 rounded-2xl border border-lohn-dark/15 bg-lohn-light/40 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold text-lohn-ink">Tagueamento (acessos e cliques)</div>
          <div className="mt-1 text-xs text-lohn-ink/60">
            Mostrando até 1000 eventos no período selecionado (exclui /admin).
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="grid gap-1 text-xs text-lohn-ink/70">
            De
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 rounded-md border border-lohn-dark/20 bg-lohn-light/50 px-3 text-sm text-lohn-ink"
            />
          </label>
          <label className="grid gap-1 text-xs text-lohn-ink/70">
            Até
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 rounded-md border border-lohn-dark/20 bg-lohn-light/50 px-3 text-sm text-lohn-ink"
            />
          </label>
          <Button variant="outline" onClick={() => load()} disabled={!isAdmin || status === "loading"}>
            {status === "loading" ? "Carregando..." : "Filtrar"}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
          <div className="text-xs text-lohn-ink/60">Total</div>
          <div className="mt-1 text-2xl font-semibold text-lohn-ink">{summary.total}</div>
        </div>
        <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
          <div className="text-xs text-lohn-ink/60">Acessos (page_view)</div>
          <div className="mt-1 text-2xl font-semibold text-lohn-ink">{summary.pageViews}</div>
        </div>
        <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
          <div className="text-xs text-lohn-ink/60">Cliques (button_click)</div>
          <div className="mt-1 text-2xl font-semibold text-lohn-ink">{summary.clicks}</div>
        </div>
        <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
          <div className="text-xs text-lohn-ink/60">Tempo médio na página</div>
          <div className="mt-1 text-2xl font-semibold text-lohn-ink">
            {summary.avgDurationMs ? formatDuration(summary.avgDurationMs) : "-"}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
          <div className="text-sm font-semibold text-lohn-ink">Plataforma (iOS / Android / Site)</div>
          <PlatformBarChart items={summary.platformChart} />
        </div>

        {summary.deviceBreakdown.length > 0 ? (
          <div className="rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
            <div className="text-sm font-semibold text-lohn-ink">Dispositivo (por acessos)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {summary.deviceBreakdown.map(([device, count]) => (
                <span
                  key={device}
                  className="rounded-full border border-lohn-dark/15 bg-lohn-light/30 px-3 py-1 text-xs text-lohn-ink/80"
                >
                  {device}: {count}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {summary.topButtons.length > 0 ? (
        <div className="mt-4 rounded-xl border border-lohn-dark/15 bg-lohn-light/30 p-4">
          <div className="text-sm font-semibold text-lohn-ink">Botões mais clicados</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {summary.topButtons.map(([label, count]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-lohn-dark/10 bg-lohn-light/30 px-3 py-2"
              >
                <div className="text-sm text-lohn-ink/80">{label}</div>
                <div className="text-sm font-semibold text-lohn-ink">{count}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-lohn-dark/15">
        <div className="max-h-[520px] overflow-auto bg-lohn-light/30">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-lohn-light">
              <tr className="border-b border-lohn-dark/15">
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-lohn-ink/70">
                  Data/hora
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-lohn-ink/70">
                  Tipo
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-lohn-ink/70">
                  Página
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-lohn-ink/70">
                  Ação
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-lohn-ink/70">
                  Duração
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-lohn-ink/70">
                  Plataforma
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-lohn-dark/10">
                  <td className="px-4 py-3 text-lohn-ink/80">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-lohn-dark/15 bg-lohn-light/30 px-2 py-0.5 text-xs text-lohn-ink/80">
                      {r.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-lohn-ink/80">{r.page_path ?? "-"}</td>
                  <td className="px-4 py-3 text-lohn-ink/80">
                    {r.event_type === "button_click"
                      ? r.button_label || r.button_id || "-"
                      : r.event_type === "page_duration"
                        ? "Tempo na página"
                        : "-"}
                  </td>
                  <td className="px-4 py-3 text-lohn-ink/70">
                    {r.event_type === "page_duration" && typeof r.duration_ms === "number"
                      ? formatDuration(r.duration_ms)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-lohn-ink/70">
                    {r.platform === "ios" ? "iOS" : r.platform === "android" ? "Android" : "Site"}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && status !== "loading" ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-lohn-ink/70">
                    Nenhum evento encontrado para o período.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {status === "error" ? (
        <div className="mt-4 rounded-xl border border-red-600/20 bg-red-600/10 p-4 text-sm text-red-800">
          Não foi possível carregar os eventos. Verifique se você está logado como admin.
        </div>
      ) : null}
    </div>
  );
}