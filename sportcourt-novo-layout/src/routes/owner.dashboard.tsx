import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  CalendarCheck,
  Users,
  AlertTriangle,
  TrendingUp,
  Star,
  Clock,
} from "lucide-react";
import {
  getMyCourts,
  getBookings,
  buildClientsCRM,
  computePerPlayer,
  type BookingRequest,
  type Court,
} from "@/lib/courts-store";

export const Route = createFileRoute("/owner/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SportCourt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OwnerDashboardPage,
});

function monthKey(iso: string) {
  return iso.slice(0, 7); // yyyy-mm
}

function OwnerDashboardPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [activeMonth, setActiveMonth] = useState<string>(() =>
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    setCourts(getMyCourts());
    setBookings(getBookings());
  }, []);

  const myCourtIds = useMemo(() => new Set(courts.map((c) => c.id)), [courts]);
  const mine = useMemo(
    () => bookings.filter((b) => myCourtIds.has(b.courtId)),
    [bookings, myCourtIds],
  );

  const monthList = useMemo(() => {
    const set = new Set<string>();
    for (const b of mine) set.add(monthKey(b.date));
    set.add(new Date().toISOString().slice(0, 7));
    return Array.from(set).sort().reverse();
  }, [mine]);

  const monthBookings = useMemo(
    () => mine.filter((b) => monthKey(b.date) === activeMonth),
    [mine, activeMonth],
  );

  const kpis = useMemo(() => {
    let faturado = 0;
    let aReceber = 0;
    let horasMarcadas = 0;
    let horasNaoPagas = 0;
    let confirmadas = 0;
    let canceladas = 0;
    for (const b of monthBookings) {
      if (b.status === "cancelada") {
        canceladas += 1;
        continue;
      }
      if (b.status === "confirmada") confirmadas += 1;
      if (b.status === "confirmada" || b.status === "encerrada") {
        horasMarcadas += 1;
        const total = b.precoTotal ?? 0;
        if (b.roster && b.roster.length > 0) {
          const perPlayer = computePerPlayer(b);
          const pagantes = b.roster.filter((p) => p.paga);
          const pagos = pagantes.filter((p) => p.pagou).length;
          const pendentes = pagantes.length - pagos;
          faturado += pagos * perPlayer;
          aReceber += pendentes * perPlayer;
          if (pendentes > 0) horasNaoPagas += 1;
        } else if (b.status === "encerrada") {
          faturado += total;
        } else {
          aReceber += total;
          if (total > 0) horasNaoPagas += 1;
        }
      }
    }
    return { faturado, aReceber, horasMarcadas, horasNaoPagas, confirmadas, canceladas };
  }, [monthBookings]);

  const clientes = useMemo(() => {
    const set = new Map<string, number>();
    for (const c of courts) {
      for (const r of buildClientsCRM(c.id)) {
        set.set(r.nome + "|" + r.telefone, (set.get(r.nome + "|" + r.telefone) ?? 0) + r.jogos);
      }
    }
    return set.size;
  }, [courts]);

  const avgRating = useMemo(() => {
    const all = courts.flatMap((c) => c.reviews ?? []);
    if (all.length === 0) return null;
    return all.reduce((a, r) => a + r.nota, 0) / all.length;
  }, [courts]);

  const busiestHours = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of monthBookings) {
      if (b.status === "cancelada") continue;
      map.set(b.time, (map.get(b.time) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [monthBookings]);

  const perCourt = useMemo(() => {
    return courts.map((c) => {
      const list = monthBookings.filter((b) => b.courtId === c.id);
      const horas = list.filter((b) => b.status !== "cancelada").length;
      const fat = list
        .filter((b) => b.status === "encerrada")
        .reduce((a, b) => a + (b.precoTotal ?? 0), 0);
      return { nome: c.nome, horas, fat };
    });
  }, [courts, monthBookings]);

  const monthLabel = new Date(activeMonth + "-01T00:00").toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const dailySeries = useMemo(() => {
    const [y, m] = activeMonth.split("-").map(Number);
    const days = new Date(y, m, 0).getDate();
    const arr = Array.from({ length: days }, (_, i) => ({ dia: i + 1, valor: 0, reservas: 0 }));
    for (const b of monthBookings) {
      if (b.status === "cancelada") continue;
      const d = Number(b.date.slice(8, 10));
      if (!arr[d - 1]) continue;
      arr[d - 1].reservas += 1;
      if (b.status === "encerrada") arr[d - 1].valor += b.precoTotal ?? 0;
    }
    return arr;
  }, [monthBookings, activeMonth]);

  const maxValor = Math.max(1, ...dailySeries.map((d) => d.valor));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do seu faturamento e movimento — {monthLabel}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {monthList.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                m === activeMonth
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground"
              }`}
            >
              {new Date(m + "-01T00:00").toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
            </button>
          ))}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={DollarSign}
          label="Faturamento (mês)"
          value={`R$ ${kpis.faturado.toFixed(2)}`}
          hint="Somente pagamentos confirmados"
          tone="primary"
        />
        <Kpi
          icon={AlertTriangle}
          label="A receber"
          value={`R$ ${kpis.aReceber.toFixed(2)}`}
          hint="Horários não pagos completamente"
          tone="warning"
        />
        <Kpi
          icon={CalendarCheck}
          label="Horários marcados"
          value={String(kpis.horasMarcadas)}
          hint={`${kpis.confirmadas} confirmados · ${kpis.canceladas} cancelados`}
        />
        <Kpi
          icon={Users}
          label="Total de clientes"
          value={String(clientes)}
          hint="Únicos, em todas as quadras"
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Kpi
          icon={TrendingUp}
          label="Ticket médio / horário"
          value={`R$ ${kpis.horasMarcadas ? (kpis.faturado / kpis.horasMarcadas).toFixed(2) : "0.00"}`}
        />
        <Kpi
          icon={Clock}
          label="Horários com pendência"
          value={String(kpis.horasNaoPagas)}
          tone={kpis.horasNaoPagas > 0 ? "warning" : undefined}
        />
        <Kpi
          icon={Star}
          label="Avaliação média"
          value={avgRating ? avgRating.toFixed(1) : "—"}
          hint={avgRating ? "de 5 estrelas" : "Sem avaliações"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Faturamento por dia</h2>
          <p className="text-sm text-muted-foreground">
            Valores recebidos em {monthLabel} (máx. R$ {maxValor.toFixed(2)}).
          </p>
          <div className="mt-5 flex h-48 items-end gap-[3px]">
            {dailySeries.map((d) => (
              <div key={d.dia} className="group relative flex flex-1 flex-col items-center justify-end">
                <div
                  className={`w-full rounded-t transition-all ${
                    d.valor > 0 ? "bg-primary" : "bg-secondary/60"
                  }`}
                  style={{ height: `${Math.max(2, (d.valor / maxValor) * 100)}%` }}
                />
                <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] font-semibold shadow-lg group-hover:block">
                  Dia {d.dia}: R$ {d.valor.toFixed(2)} · {d.reservas} res.
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>1</span>
            <span>{Math.round(dailySeries.length / 2)}</span>
            <span>{dailySeries.length}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Horários mais movimentados</h2>
          <p className="text-sm text-muted-foreground">Top 5 do mês selecionado.</p>
          {busiestHours.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Sem dados neste mês.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {busiestHours.map(([time, count]) => {
                const max = busiestHours[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <li key={time} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{time}</span>
                      <span className="text-muted-foreground">{count} reserva(s)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary/60">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Desempenho por quadra</h2>
          <p className="text-sm text-muted-foreground">Faturamento e horas neste mês.</p>
          {perCourt.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nenhuma quadra cadastrada.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {perCourt.map((c) => (
                <li key={c.nome} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-semibold">{c.nome}</span>
                  <span className="text-right">
                    <span className="block font-bold text-primary">R$ {c.fat.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">{c.horas} horário(s)</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "warning";
}) {
  const valueColor =
    tone === "warning" ? "text-amber-300" : tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={`mt-1 text-2xl font-black ${valueColor}`}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}