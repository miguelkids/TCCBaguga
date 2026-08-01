import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Users,
  Phone,
  Clock,
  Calendar,
  Building2,
  CheckCircle2,
  StopCircle,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getMyCourts,
  getBookings,
  updateBooking,
  computePerPlayer,
  type BookingRequest,
  type BookingStatus,
  type Court,
  type RosterPlayer,
} from "@/lib/courts-store";

export const Route = createFileRoute("/owner/reservas")({
  head: () => ({ meta: [{ title: "Reservas — SportCourt" }, { name: "robots", content: "noindex" }] }),
  component: OwnerReservas,
});

const TABS: { id: BookingStatus; label: string }[] = [
  { id: "pendente", label: "Pendentes" },
  { id: "confirmada", label: "Confirmadas" },
  { id: "encerrada", label: "Encerradas" },
];

function OwnerReservas() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [tab, setTab] = useState<BookingStatus>("pendente");
  const [tick, setTick] = useState(0);
  const [editing, setEditing] = useState<BookingRequest | null>(null);

  useEffect(() => {
    setCourts(getMyCourts());
    setBookings(getBookings());
  }, [tick]);

  const myCourtIds = new Set(courts.map((c) => c.id));
  const mine = bookings.filter((b) => myCourtIds.has(b.courtId));

  // Pareamento entre times para pendentes
  const paired = useMemo(() => {
    const groups = new Map<string, BookingRequest[]>();
    for (const b of mine) {
      if (b.status !== "pendente") continue;
      const key = b.courtId + "|" + b.date + "|" + b.time;
      const list = groups.get(key) ?? [];
      list.push(b);
      groups.set(key, list);
    }
    return groups;
  }, [mine]);

  const refresh = () => setTick((n) => n + 1);

  const shown = mine.filter((b) => b.status === tab);

  const counts: Record<BookingStatus, number> = {
    pendente: mine.filter((b) => b.status === "pendente").length,
    confirmada: mine.filter((b) => b.status === "confirmada").length,
    encerrada: mine.filter((b) => b.status === "encerrada").length,
    cancelada: 0,
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">CRM de reservas</h1>
        <p className="text-sm text-muted-foreground">Confirme, cancele e encerre reservas — cálculo do rateio automático.</p>
      </header>

      <nav className="flex gap-1 rounded-xl border border-border bg-secondary/40 p-1">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                active ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-primary-foreground/20" : "bg-secondary"}`}>
                {counts[t.id]}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-3">
        {shown.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            Nada por aqui ainda.
          </div>
        )}

        {tab === "pendente" ? (
          <PendingList
            groups={paired}
            courts={courts}
            onRefresh={refresh}
          />
        ) : (
          shown.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              court={courts.find((c) => c.id === b.courtId)!}
              onRefresh={refresh}
              onEditRoster={() => setEditing(b)}
            />
          ))
        )}
      </div>

      {editing && (
        <RosterEditor
          booking={editing}
          onClose={() => setEditing(null)}
          onSave={(roster) => {
            updateBooking(editing.id, { roster });
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function PendingList({
  groups,
  courts,
  onRefresh,
}: {
  groups: Map<string, BookingRequest[]>;
  courts: Court[];
  onRefresh: () => void;
}) {
  const keys = Array.from(groups.keys()).sort();
  if (keys.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Sem pedidos pendentes.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {keys.map((k) => {
        const list = groups.get(k) ?? [];
        const first = list[0];
        const court = courts.find((c) => c.id === first.courtId)!;
        const isMatch = list.length >= 2 || list.some((b) => b.vsTeam);
        return (
          <div
            key={k}
            className={`rounded-xl border p-4 ${
              list.length >= 2
                ? "border-primary/40 bg-primary/5"
                : first.vsTeam
                ? "border-amber-400/40 bg-amber-400/5"
                : "border-border bg-card"
            }`}
          >
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Building2 className="h-4 w-4" /> {court?.nome ?? "Quadra"}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(first.date + "T00:00").toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {first.time}
                </span>
              </div>
              <BadgePendingType list={list} />
            </header>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {list.map((b) => (
                <PendingCard key={b.id} booking={b} />
              ))}
            </div>

            <footer className="mt-3 flex flex-wrap justify-end gap-2">
              {list.map((b) => (
                <div key={b.id} className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { updateBooking(b.id, { status: "cancelada" }); onRefresh(); }}
                  >
                    <X className="mr-1 h-3.5 w-3.5" /> Recusar {list.length > 1 ? b.playerName.split(" ")[0] : ""}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { updateBooking(b.id, { status: "confirmada", precoTotal: court?.precoHora ?? 0 }); onRefresh(); }}
                    className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" /> Confirmar {list.length > 1 ? b.playerName.split(" ")[0] : ""}
                  </Button>
                </div>
              ))}
              {isMatch && list.length < 2 && (
                <span className="self-center text-xs text-amber-300">Aguardando adversário</span>
              )}
            </footer>
          </div>
        );
      })}
    </div>
  );
}

function BadgePendingType({ list }: { list: BookingRequest[] }) {
  if (list.length >= 2)
    return <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">Dois times</span>;
  if (list[0].vsTeam)
    return <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">Contra outro time</span>;
  return <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground">Horário fechado</span>;
}

function PendingCard({ booking }: { booking: BookingRequest }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-3 text-sm">
      <div className="flex items-center gap-2">
        <PlayerAvatar photo={booking.playerPhoto} name={booking.playerName} />
        <div className="min-w-0">
          <div className="truncate font-semibold">{booking.playerName}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" /> {booking.playerPhone}
          </div>
        </div>
      </div>
      {booking.teamName && (
        <div className="mt-1 text-xs">Time: <strong>{booking.teamName}</strong></div>
      )}
      {booking.vsTeam && !booking.teamName && (
        <div className="mt-1 text-xs text-amber-300">Quer jogar contra <strong>{booking.vsTeam}</strong></div>
      )}
      {booking.roster && booking.roster.length > 0 && (
        <RosterMini roster={booking.roster} />
      )}
    </div>
  );
}

function PlayerAvatar({ photo, name }: { photo?: string | null; name: string }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-bold text-muted-foreground">
      {initial}
    </div>
  );
}

function RosterMini({ roster }: { roster: RosterPlayer[] }) {
  return (
    <ul className="mt-2 space-y-0.5 text-xs">
      {roster.map((p, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span>{p.nome}</span>
          {p.goleiro && <span className="rounded-full bg-secondary px-1.5 text-[10px]">GK</span>}
          {!p.paga && <span className="text-muted-foreground">(não paga)</span>}
        </li>
      ))}
    </ul>
  );
}

function BookingCard({
  booking,
  court,
  onRefresh,
  onEditRoster,
}: {
  booking: BookingRequest;
  court: Court;
  onRefresh: () => void;
  onEditRoster: () => void;
}) {
  const perPlayer = computePerPlayer(booking);
  const isFinished = booking.status === "encerrada";

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 font-semibold">
            <Building2 className="h-4 w-4" /> {court?.nome}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(booking.date + "T00:00").toLocaleDateString("pt-BR")}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" /> {booking.time}
          </span>
        </div>
        <div className="text-right text-sm">
          <div className="font-bold text-primary">R$ {(booking.precoTotal ?? 0).toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">total do horário</div>
        </div>
      </header>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
          <div className="flex items-center gap-2">
            <PlayerAvatar photo={booking.playerPhoto} name={booking.playerName} />
            <div className="min-w-0">
              <div className="truncate font-semibold">{booking.playerName}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" /> {booking.playerPhone}
              </div>
            </div>
          </div>
          {booking.vsTeam && (
            <div className="mt-1 text-xs text-amber-300">Contra {booking.vsTeam}</div>
          )}
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
            <span>Rateio</span>
            <span className="font-bold text-primary normal-case tracking-normal">
              R$ {perPlayer.toFixed(2)} / jogador pagante
            </span>
          </div>
          {booking.roster && booking.roster.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {booking.roster.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    {p.nome}
                    {p.goleiro && <span className="rounded-full bg-secondary px-1.5 text-[10px]">GK</span>}
                  </span>
                  <span className="text-muted-foreground">
                    {p.paga
                      ? p.pagou
                        ? <span className="text-primary">pago</span>
                        : <span className="text-amber-300">pendente</span>
                      : "não paga"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Sem lista de jogadores.</p>
          )}
        </div>
      </div>

      <footer className="mt-3 flex flex-wrap justify-end gap-2">
        {isFinished && (
          <Button size="sm" variant="secondary" onClick={onEditRoster}>
            <Pencil className="mr-1 h-3.5 w-3.5" /> Editar lista
          </Button>
        )}
        {booking.status === "confirmada" && (
          <>
            <Button size="sm" variant="ghost" onClick={() => { updateBooking(booking.id, { status: "cancelada" }); onRefresh(); }}>
              <X className="mr-1 h-3.5 w-3.5" /> Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => { updateBooking(booking.id, { status: "encerrada" }); onRefresh(); }}
              className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              <StopCircle className="mr-1 h-3.5 w-3.5" /> Encerrar horário
            </Button>
          </>
        )}
        {isFinished && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const roster = (booking.roster ?? []).map((p) => ({ ...p, pagou: true }));
              updateBooking(booking.id, { roster });
              onRefresh();
            }}
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Marcar todos pagos
          </Button>
        )}
      </footer>
    </article>
  );
}

function RosterEditor({
  booking,
  onClose,
  onSave,
}: {
  booking: BookingRequest;
  onClose: () => void;
  onSave: (roster: RosterPlayer[]) => void;
}) {
  const [roster, setRoster] = useState<RosterPlayer[]>(
    booking.roster && booking.roster.length > 0
      ? booking.roster
      : [{ nome: booking.playerName, goleiro: false, paga: true, pagou: false }],
  );

  const update = (i: number, patch: Partial<RosterPlayer>) =>
    setRoster((r) => r.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar lista de jogadores</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {roster.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
              <Input
                value={p.nome}
                onChange={(e) => update(i, { nome: e.target.value })}
                placeholder={`Jogador ${i + 1}`}
                className="h-9"
              />
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={p.goleiro} onChange={(e) => update(i, { goleiro: e.target.checked })} className="accent-primary" />
                GK
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={p.paga} onChange={(e) => update(i, { paga: e.target.checked })} className="accent-primary" />
                Paga
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={!!p.pagou} onChange={(e) => update(i, { pagou: e.target.checked })} className="accent-primary" />
                Pagou
              </label>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setRoster((r) => r.filter((_, idx) => idx !== i))}
                disabled={roster.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRoster((r) => [...r, { nome: "", goleiro: false, paga: true, pagou: false }])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar jogador
          </Button>
          <div className="rounded-md bg-secondary/40 p-2 text-xs text-muted-foreground">
            Valor por jogador pagante:{" "}
            <strong className="text-primary">
              R$ {computePerPlayer({ ...booking, roster }).toFixed(2)}
            </strong>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => onSave(roster.filter((p) => p.nome.trim()))}
            className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
