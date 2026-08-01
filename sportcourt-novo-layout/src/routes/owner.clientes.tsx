import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Phone, MessageCircle, User, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getMyCourts, buildClientsCRM, type ClientRecord, type Court } from "@/lib/courts-store";

export const Route = createFileRoute("/owner/clientes")({
  head: () => ({ meta: [{ title: "Clientes — SportCourt" }, { name: "robots", content: "noindex" }] }),
  component: OwnerClientes,
});

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function OwnerClientes() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const my = getMyCourts();
    setCourts(my);
    setActiveId((prev) => prev ?? my[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setClients(buildClientsCRM(activeId));
  }, [activeId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(
      (c) => c.nome.toLowerCase().includes(s) || c.telefone.includes(s),
    );
  }, [clients, q]);

  const totals = useMemo(
    () => ({
      total: clients.length,
      pendentes: clients.reduce((a, c) => a + c.pendentes, 0),
      valorPendente: clients.reduce((a, c) => a + c.valorPendente, 0),
    }),
    [clients],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">CRM de clientes</h1>
        <p className="text-sm text-muted-foreground">
          Clientes atualizados automaticamente após cada horário encerrado.
        </p>
      </header>

      {courts.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {courts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                c.id === activeId
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground"
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi icon={User} label="Clientes" value={String(totals.total)} />
        <Kpi icon={Trophy} label="Jogadores em aberto" value={String(totals.pendentes)} />
        <Kpi icon={Phone} label="Valor pendente" value={`R$ ${totals.valorPendente.toFixed(2)}`} tone="warning" />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum cliente encontrado. Encerre um horário para começar a preencher.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((c, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{c.nome}</span>
                    {c.pendentes > 0 && (
                      <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {c.pendentes} pendente(s)
                      </span>
                    )}
                    {c.pendentes === 0 && c.jogos > 0 && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                        em dia
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {c.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.telefone}</span>}
                    <span>Jogos: <strong className="text-foreground">{c.jogos}</strong></span>
                    <span>Pagos: <strong className="text-foreground">{c.pagos}</strong></span>
                    <span>Último: {new Date(c.ultimoJogo + "T00:00").toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs uppercase text-muted-foreground">A receber</div>
                    <div className={`text-base font-bold ${c.valorPendente > 0 ? "text-amber-300" : "text-primary"}`}>
                      R$ {c.valorPendente.toFixed(2)}
                    </div>
                  </div>
                  {c.telefone && (
                    <a
                      href={`https://wa.me/55${onlyDigits(c.telefone)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "warning";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={`mt-1 text-xl font-bold ${tone === "warning" ? "text-amber-300" : "text-foreground"}`}>{value}</div>
    </div>
  );
}