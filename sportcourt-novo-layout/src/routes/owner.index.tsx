import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Star,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  CalendarX2,
  Camera,
  DollarSign,
  Megaphone,
  AlertTriangle,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getMyCourts,
  saveCourt,
  addSubcourt,
  removeSubcourt,
  addBlock,
  removeBlock,
  isBlocked,
  generateSlots,
  type Court,
  type Announcement,
} from "@/lib/courts-store";

export const Route = createFileRoute("/owner/")({
  head: () => ({ meta: [{ title: "Minha quadra — SportCourt" }, { name: "robots", content: "noindex" }] }),
  component: OwnerDashboard,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function OwnerDashboard() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const list = getMyCourts();
    setCourts(list);
    setActiveId((prev) => prev ?? list[0]?.id ?? null);
  }, [reload]);

  const court = useMemo(() => courts.find((c) => c.id === activeId), [courts, activeId]);
  const refresh = () => setReload((n) => n + 1);

  if (!court) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Nenhuma quadra cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <CourtHero court={court} onChange={refresh} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SubcourtsCard court={court} onChange={refresh} />
        <ReviewsCard court={court} />
      </div>

      <AnnouncementsCard court={court} onChange={refresh} />


      <ScheduleCard court={court} onChange={refresh} />
    </div>
  );
}

function CourtHero({ court, onChange }: { court: Court; onChange: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Court>(court);

  useEffect(() => setForm(court), [court]);

  const set = <K extends keyof Court>(k: K, v: Court[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("photo", typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const save = () => {
    saveCourt(form);
    setEditing(false);
    onChange();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative h-44 bg-secondary sm:h-56">
        {form.photo ? (
          <img src={form.photo} alt={form.nome} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Building2 className="h-16 w-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {editing && (
          <label className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <Camera className="h-3.5 w-3.5" /> Trocar foto
            <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">{form.nome}</h1>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{form.cidade} · {form.endereco}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{form.telefone}</span>
            </div>
          </div>
          {!editing && (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
            </Button>
          )}
        </div>
      </div>

      {editing && (
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Nome"><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></Field>
          <Field label="Cidade"><Input value={form.cidade} onChange={(e) => set("cidade", e.target.value)} /></Field>
          <Field label="Endereço"><Input value={form.endereco} onChange={(e) => set("endereco", e.target.value)} /></Field>
          <Field label="Telefone"><Input value={form.telefone} onChange={(e) => set("telefone", e.target.value)} /></Field>
          <Field label="Abertura"><Input type="time" value={form.openTime} onChange={(e) => set("openTime", e.target.value)} /></Field>
          <Field label="Fechamento"><Input type="time" value={form.closeTime} onChange={(e) => set("closeTime", e.target.value)} /></Field>
          <Field label="Preço por hora (R$)">
            <Input
              type="number"
              min={0}
              value={form.precoHora ?? 0}
              onChange={(e) => set("precoHora", Number(e.target.value))}
            />
          </Field>
          <Field label="Quantidade de quadras">
            <Input
              type="number"
              min={1}
              value={form.quantidade}
              onChange={(e) => set("quantidade", Number(e.target.value))}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Descrição">
              <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Informações extras">
              <Textarea rows={2} value={form.extra} onChange={(e) => set("extra", e.target.value)} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button variant="ghost" onClick={() => { setForm(court); setEditing(false); }}>
              <X className="mr-1.5 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={save} className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Check className="mr-1.5 h-4 w-4" /> Salvar
            </Button>
          </div>
        </div>
      )}

      {!editing && (
        <div className="grid gap-4 p-5 sm:grid-cols-4">
          <Metric icon={Clock} label="Funcionamento" value={`${court.openTime}–${court.closeTime}`} />
          <Metric icon={Building2} label="Quadras" value={String(court.quantidade)} />
          <Metric icon={DollarSign} label="Preço/hora" value={`R$ ${court.precoHora ?? 0}`} />
          <Metric icon={Star} label="Avaliação" value={avgRating(court)} />
        </div>
      )}
    </section>
  );
}

function avgRating(court: Court) {
  const rs = court.reviews ?? [];
  if (rs.length === 0) return "—";
  const avg = rs.reduce((a, r) => a + r.nota, 0) / rs.length;
  return `${avg.toFixed(1)} (${rs.length})`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function SubcourtsCard({ court, onChange }: { court: Court; onChange: () => void }) {
  const [nome, setNome] = useState("");

  const add = () => {
    if (!nome.trim()) return;
    addSubcourt(court.id, nome.trim());
    setNome("");
    onChange();
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Subquadras</h2>
        <span className="text-xs text-muted-foreground">
          {(court.subcourts ?? []).length} cadastrada(s)
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Cadastre cada quadra do local (ex: Quadra 1, Quadra 2, Society).
      </p>

      <div className="mt-4 space-y-2">
        {(court.subcourts ?? []).map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
            <span className="font-medium">{s.nome}</span>
            <Button size="icon" variant="ghost" onClick={() => { removeSubcourt(court.id, s.id); onChange(); }} aria-label="Remover">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(court.subcourts ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda sem subquadras.</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Quadra 3" />
        <Button onClick={add}><Plus className="mr-1.5 h-4 w-4" /> Adicionar</Button>
      </div>
    </section>
  );
}

function ReviewsCard({ court }: { court: Court }) {
  const reviews = court.reviews ?? [];
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Avaliações</h2>
        <span className="text-xs text-muted-foreground">{reviews.length} no total</span>
      </div>
      <div className="mt-4 space-y-3">
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda sem avaliações.</p>
        )}
        {reviews.map((r) => (
          <article key={r.id} className="rounded-lg border border-border bg-secondary/40 p-3">
            <header className="flex items-center justify-between text-sm">
              <span className="font-semibold">{r.autor}</span>
              <span className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.nota ? "fill-amber-400" : "opacity-30"}`} />
                ))}
              </span>
            </header>
            <p className="mt-1 text-sm text-foreground/90">{r.texto}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(r.data + "T00:00").toLocaleDateString("pt-BR")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScheduleCard({ court, onChange }: { court: Court; onChange: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [openBlock, setOpenBlock] = useState(false);
  const slots = useMemo(() => generateSlots(court, date), [court, date]);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold">Gerenciar horários</h2>
          <p className="text-sm text-muted-foreground">
            Bloqueie horários ou dias inteiros (feriados, manutenção, etc).
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <Label className="text-xs">Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={todayISO()} />
          </div>
          <Button onClick={() => setOpenBlock(true)} variant="secondary">
            <CalendarX2 className="mr-1.5 h-4 w-4" /> Novo bloqueio
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {slots.map((s) => {
          const block = isBlocked(court, date, s.time);
          const blocked = !!block;
          const past = s.status === "past";
          const busy = s.status === "busy" || s.status === "open-match";
          return (
            <div
              key={s.time}
              className={`rounded-lg border px-2 py-2 text-sm ${
                blocked
                  ? "border-destructive/50 bg-destructive/10 text-destructive"
                  : past
                  ? "border-border bg-secondary/40 text-muted-foreground/60 line-through"
                  : busy
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                  : "border-primary/40 bg-primary/10 text-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{s.time}</span>
                {blocked && (
                  <button
                    onClick={() => { removeBlock(court.id, block!.id); onChange(); }}
                    aria-label="Remover bloqueio"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wide">
                {blocked ? block!.description || "Bloqueado" : past ? "Passou" : busy ? "Reservado" : "Livre"}
              </div>
            </div>
          );
        })}
      </div>

      {(court.blocks ?? []).length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Bloqueios ativos</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(court.blocks ?? []).map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-1.5">
                <span>
                  <span className="font-semibold">{new Date(b.date + "T00:00").toLocaleDateString("pt-BR")}</span>
                  {b.time ? ` · ${b.time}` : " · dia inteiro"}
                  {b.description && <span className="text-muted-foreground"> — {b.description}</span>}
                </span>
                <Button size="icon" variant="ghost" onClick={() => { removeBlock(court.id, b.id); onChange(); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <BlockDialog
        open={openBlock}
        onOpenChange={setOpenBlock}
        defaultDate={date}
        onSave={(b) => { addBlock(court.id, b); onChange(); }}
      />
    </section>
  );
}

function BlockDialog({
  open,
  onOpenChange,
  defaultDate,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate: string;
  onSave: (b: { date: string; time?: string; description: string }) => void;
}) {
  const [date, setDate] = useState(defaultDate);
  const [allDay, setAllDay] = useState(true);
  const [time, setTime] = useState("20:00");
  const [description, setDescription] = useState("");

  useEffect(() => { setDate(defaultDate); }, [defaultDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloquear horário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Data">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="accent-primary"
            />
            Dia inteiro
          </label>
          {!allDay && (
            <Field label="Horário">
              <Input type="time" step={3600} value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          )}
          <Field label="Descrição">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Feriado, manutenção..." />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              const t = allDay ? undefined : `${time.slice(0, 2)}:00`;
              onSave({ date, time: t, description });
              setDescription("");
              onOpenChange(false);
            }}
            className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            Bloquear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function AnnouncementsCard({ court, onChange }: { court: Court; onChange: () => void }) {
  const [mensalistaMsg, setMensalistaMsg] = useState(court.mensalistaMsg ?? "");
  const [cancelPolicy, setCancelPolicy] = useState(court.cancelPolicy ?? "");
  const [items, setItems] = useState<Announcement[]>(court.announcements ?? []);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tone, setTone] = useState<"info" | "warning" | "success">("info");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMensalistaMsg(court.mensalistaMsg ?? "");
    setCancelPolicy(court.cancelPolicy ?? "");
    setItems(court.announcements ?? []);
  }, [court.id]);

  const persist = (patch: Partial<Court>) => {
    saveCourt({ ...court, ...patch });
    onChange();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const addItem = () => {
    if (!title.trim() && !body.trim()) return;
    const next = [
      ...items,
      { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), tone },
    ];
    setItems(next);
    persist({ announcements: next });
    setTitle("");
    setBody("");
    setTone("info");
  };

  const removeItem = (id: string) => {
    const next = items.filter((a) => a.id !== id);
    setItems(next);
    persist({ announcements: next });
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" /> Avisos e políticas
          </h2>
          <p className="text-sm text-muted-foreground">
            Informações que aparecem no perfil da quadra para os jogadores antes de reservar.
          </p>
        </div>
        {saved && <span className="text-xs text-primary">Salvo</span>}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1.5">
            <CalendarCheck className="h-3.5 w-3.5 text-primary" /> Mensalistas
          </Label>
          <Textarea
            rows={3}
            value={mensalistaMsg}
            onChange={(e) => setMensalistaMsg(e.target.value)}
            onBlur={() => persist({ mensalistaMsg })}
            placeholder="Ex: Oferecemos horários fixos para mensalistas. Fale conosco pelo chat."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Multa de cancelamento
          </Label>
          <Textarea
            rows={3}
            value={cancelPolicy}
            onChange={(e) => setCancelPolicy(e.target.value)}
            onBlur={() => persist({ cancelPolicy })}
            placeholder="Ex: Cancelamentos com menos de 24h cobram 50% do valor da reserva."
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Anúncios adicionais
        </h3>
        <div className="mt-3 space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum anúncio adicional.</p>
          )}
          {items.map((a) => (
            <div
              key={a.id}
              className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                a.tone === "warning"
                  ? "border-amber-400/40 bg-amber-400/10"
                  : a.tone === "success"
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-secondary/40"
              }`}
            >
              <div>
                {a.title && <div className="font-semibold">{a.title}</div>}
                {a.body && <div className="text-muted-foreground">{a.body}</div>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeItem(a.id)} aria-label="Remover">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (ex: Torneio no sábado)" />
          <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Descrição do anúncio" />
          <div className="flex gap-2">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as "info" | "warning" | "success")}
              className="rounded-md border border-border bg-secondary/40 px-2 text-sm"
            >
              <option value="info">Info</option>
              <option value="warning">Aviso</option>
              <option value="success">Destaque</option>
            </select>
            <Button onClick={addItem}><Plus className="mr-1 h-4 w-4" />Adicionar</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
