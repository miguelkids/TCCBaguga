import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Building2,
  Clock,
  Users,
  Plus,
  Trash2,
  Check,
  Star,
  MessageCircle,
  CalendarCheck,
  AlertTriangle,
  Megaphone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCourt,
  generateSlots,
  createBooking,
  addReview,
  hasReviewed,
  type Court,
  type Slot,
} from "@/lib/courts-store";
import { getUser } from "@/lib/user-store";
import {
  getThreadMessages,
  sendMessage,
  markRead,
  unreadForPlayer,
  type ChatMessage,
} from "@/lib/chat-store";
import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

export const Route = createFileRoute("/courts/$id")({
  head: () => ({
    meta: [
      { title: "Quadra — SportCourt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CourtDetail,
});

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function CourtDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState<Court | undefined>();
  const [date, setDate] = useState(todayISO());
  const [selected, setSelected] = useState<Slot | null>(null);
  const [success, setSuccess] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    setCourt(getCourt(id));
  }, [id]);

  const slots = useMemo(() => (court ? generateSlots(court, date) : []), [court, date]);

  if (!court) {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl p-8 text-center">
          <p className="text-muted-foreground">Quadra não encontrada.</p>
          <Button asChild className="mt-4">
            <Link to="/search">Voltar para busca</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="SportCourt" className="h-10 w-auto" />
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/search">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <CourtAnnouncements court={court} onOpenChat={() => setChatOpen(true)} />

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-56 bg-secondary sm:h-72">
            {court.photo ? (
              <img src={court.photo} alt={court.nome} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Building2 className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h1 className="text-2xl font-black sm:text-3xl">{court.nome}</h1>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{court.cidade} · {court.endereco}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{court.telefone}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{court.openTime} — {court.closeTime}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {court.description && (
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Sobre</h2>
                  <p className="mt-2 text-foreground/90">{court.description}</p>
                </section>
              )}
              {court.extra && (
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Informações extras</h2>
                  <p className="mt-2 text-foreground/90">{court.extra}</p>
                </section>
              )}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Esportes</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {court.sports.map((s) => (
                    <span key={s} className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-sm text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Detalhes</h2>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Quadras</dt>
                    <dd className="font-semibold">{court.quantidade}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dias</dt>
                    <dd className="font-semibold uppercase">{court.days.join(", ")}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">Horários disponíveis</h2>
              <p className="text-sm text-muted-foreground">Selecione um horário livre para solicitar sua reserva.</p>
            </div>
            <div className="w-full sm:w-auto">
              <Label htmlFor="date" className="text-xs">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {slots.map((slot) => {
              const disabled = slot.status === "past" || slot.status === "busy";
              const isOpenMatch = slot.status === "open-match";
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected(slot)}
                  title={
                    slot.status === "past"
                      ? "Horário já passou"
                      : slot.status === "busy"
                      ? "Ocupado"
                      : isOpenMatch
                      ? `Time procurando adversário: ${slot.teamName}`
                      : "Disponível"
                  }
                  className={`relative rounded-lg border px-2 py-3 text-sm font-semibold transition-all ${
                    disabled
                      ? "cursor-not-allowed border-border bg-secondary/40 text-muted-foreground/60 line-through"
                      : isOpenMatch
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                      : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[var(--shadow-glow)]"
                  }`}
                >
                  {slot.time}
                  {isOpenMatch && (
                    <span className="mt-0.5 block text-[10px] font-medium normal-case">
                      <Users className="mr-0.5 inline h-3 w-3" />
                      vs time
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <LegendDot className="bg-primary" label="Disponível" />
            <LegendDot className="bg-amber-400" label="Time esperando adversário" />
            <LegendDot className="bg-secondary" label="Passado / Ocupado" />
          </div>
        </section>

        <ReviewsSection court={court} onChange={() => setCourt(getCourt(court.id))} />
      </main>

      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 transition"
      >
        <MessageCircle className="h-4 w-4" /> Falar com o dono
      </button>

      {chatOpen && (
        <ChatDialog court={court} onClose={() => setChatOpen(false)} />
      )}

      {selected && (
        <BookingDialog
          court={court}
          date={date}
          slot={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            setSuccess(true);
          }}
        />
      )}

      <Dialog open={success} onOpenChange={(o) => !o && (setSuccess(false), navigate({ to: "/search" }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Check className="h-5 w-5" />
              Pedido enviado!
            </DialogTitle>
            <DialogDescription>
              Sua solicitação foi encaminhada para o dono da quadra. Você receberá uma confirmação em breve.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setSuccess(false); navigate({ to: "/search" }); }}>Ok, voltar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}

interface RosterPlayer { nome: string; goleiro: boolean; paga: boolean }

function BookingDialog({
  court,
  date,
  slot,
  onClose,
  onSuccess,
}: {
  court: Court;
  date: string;
  slot: Slot;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isVs = slot.status === "open-match";
  const [nome, setNome] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("sc:nome") ?? "" : "",
  );
  const [telefone, setTelefone] = useState("");
  const [obs, setObs] = useState("");
  const [roster, setRoster] = useState<RosterPlayer[]>([{ nome: "", goleiro: false, paga: true }]);

  const addPlayer = () => setRoster((r) => [...r, { nome: "", goleiro: false, paga: true }]);
  const removePlayer = (i: number) => setRoster((r) => r.filter((_, idx) => idx !== i));
  const updatePlayer = (i: number, patch: Partial<RosterPlayer>) =>
    setRoster((r) => r.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const user = getUser();
    createBooking({
      courtId: court.id,
      date,
      time: slot.time,
      playerName: nome,
      playerPhone: telefone,
      playerPhoto: user.photo ?? null,
      playerId: user.id,
      vsTeam: isVs ? slot.teamName : undefined,
      roster: isVs ? roster.filter((p) => p.nome.trim()) : undefined,
    });
    if (obs) {
      /* noop – would be persisted with booking */
    }
    onSuccess();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isVs ? "Marcar jogo contra " + slot.teamName : "Solicitar reserva"}
          </DialogTitle>
          <DialogDescription>
            {court.nome} · {new Date(date + "T00:00").toLocaleDateString("pt-BR")} às {slot.time}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-nome">Seu nome</Label>
              <Input id="p-nome" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-tel">Telefone</Label>
              <Input id="p-tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
            </div>
          </div>

          {isVs && (
            <div className="space-y-2 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-amber-300">Lista de jogadores</Label>
                <Button type="button" size="sm" variant="ghost" onClick={addPlayer} className="text-amber-300 hover:text-amber-200">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {roster.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
                    <Input
                      value={p.nome}
                      onChange={(e) => updatePlayer(i, { nome: e.target.value })}
                      placeholder={`Jogador ${i + 1}`}
                      className="h-9"
                    />
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={p.goleiro}
                        onChange={(e) => updatePlayer(i, { goleiro: e.target.checked })}
                        className="accent-primary"
                      />
                      Goleiro
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={p.paga}
                        onChange={(e) => updatePlayer(i, { paga: e.target.checked })}
                        className="accent-primary"
                      />
                      Paga
                    </label>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removePlayer(i)}
                      disabled={roster.length === 1}
                      aria-label="Remover jogador"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="obs">Observações (opcional)</Label>
            <Textarea id="obs" value={obs} onChange={(e) => setObs(e.target.value)} rows={2} maxLength={300} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]">
              Enviar pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReviewsSection({ court, onChange }: { court: Court; onChange: () => void }) {
  const reviews = court.reviews ?? [];
  const [user] = useState(() => (typeof window !== "undefined" ? getUser() : null));
  const already = user ? hasReviewed(court.id, user.nome) : true;
  const [nota, setNota] = useState(5);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!user?.nome.trim()) {
      setErro("Preencha seu nome no perfil para avaliar.");
      return;
    }
    const res = addReview(court.id, { autor: user.nome, nota, texto: texto.trim() });
    if (!res.ok) {
      setErro(res.reason ?? "Erro ao enviar avaliação.");
      return;
    }
    setOk(true);
    setTexto("");
    onChange();
  };

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.nota, 0) / reviews.length : 0;

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Avaliações</h2>
          <p className="text-sm text-muted-foreground">
            {reviews.length > 0
              ? `${avg.toFixed(1)} de 5 · ${reviews.length} avaliação(ões)`
              : "Seja o primeiro a avaliar esta quadra."}
          </p>
        </div>
        {reviews.length > 0 && (
          <span className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(avg) ? "fill-amber-400" : "opacity-30"}`} />
            ))}
          </span>
        )}
      </div>

      {!already && !ok && (
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4">
          <div>
            <Label className="text-xs">Sua nota</Label>
            <div className="mt-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNota(i + 1)}
                  className="rounded p-1 hover:bg-secondary/60"
                  aria-label={`${i + 1} estrelas`}
                >
                  <Star className={`h-6 w-6 ${i < nota ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="rev-text" className="text-xs">Comentário (opcional)</Label>
            <Textarea
              id="rev-text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Conte como foi sua experiência..."
            />
          </div>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
          <div className="flex justify-end">
            <Button type="submit" className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              Enviar avaliação
            </Button>
          </div>
        </form>
      )}
      {(already || ok) && (
        <p className="mt-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {ok ? "Avaliação enviada. Obrigado!" : "Você já avaliou esta quadra."}
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda sem avaliações.</p>
        )}
        {reviews.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-4">
            <header className="flex items-center justify-between text-sm">
              <span className="font-semibold">{r.autor}</span>
              <span className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.nota ? "fill-amber-400" : "opacity-30"}`} />
                ))}
              </span>
            </header>
            {r.texto && <p className="mt-2 text-sm text-foreground/90">{r.texto}</p>}
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(r.data + "T00:00").toLocaleDateString("pt-BR")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
function CourtAnnouncements({ court, onOpenChat }: { court: Court; onOpenChat: () => void }) {
  const anns = court.announcements ?? [];
  const hasAny = !!court.mensalistaMsg || !!court.cancelPolicy || anns.length > 0;
  if (!hasAny) return null;
  return (
    <section className="mb-6 space-y-3">
      {court.mensalistaMsg && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4">
          <div className="flex gap-3">
            <CalendarCheck className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <div className="font-bold text-primary">Vagas para mensalistas</div>
              <p className="text-sm text-foreground/90">{court.mensalistaMsg}</p>
            </div>
          </div>
          <Button size="sm" onClick={onOpenChat} className="shrink-0 bg-primary text-primary-foreground">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Falar
          </Button>
        </div>
      )}
      {court.cancelPolicy && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
          <div>
            <div className="font-bold text-amber-300">Política de cancelamento</div>
            <p className="text-sm text-foreground/90">{court.cancelPolicy}</p>
          </div>
        </div>
      )}
      {anns.map((a) => (
        <div
          key={a.id}
          className={`flex items-start gap-3 rounded-2xl border p-4 ${
            a.tone === "warning"
              ? "border-amber-400/40 bg-amber-400/10"
              : a.tone === "success"
              ? "border-primary/40 bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          <Megaphone className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            {a.title && <div className="font-bold">{a.title}</div>}
            {a.body && <p className="text-sm text-foreground/90">{a.body}</p>}
          </div>
        </div>
      ))}
    </section>
  );
}

function ChatDialog({ court, onClose }: { court: Court; onClose: () => void }) {
  const user = getUser();
  const threadId = user.id || "guest";
  const [messages, setMessages] = useState<ChatMessage[]>(() => getThreadMessages(court.id, threadId));
  const [text, setText] = useState("");

  useEffect(() => {
    markRead(court.id, threadId, "player");
    const t = setInterval(() => {
      setMessages(getThreadMessages(court.id, threadId));
      markRead(court.id, threadId, "player");
    }, 1500);
    return () => clearInterval(t);
  }, [court.id, threadId]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    sendMessage({
      courtId: court.id,
      threadId,
      from: "player",
      authorName: user.nome || "Jogador",
      authorPhoto: user.photo ?? null,
      text: value,
    });
    setText("");
    setMessages(getThreadMessages(court.id, threadId));
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex h-[600px] max-h-[90vh] flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Chat com {court.nome}
          </DialogTitle>
          <DialogDescription>Tire dúvidas com o dono da quadra.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-2 overflow-y-auto rounded-lg border border-border bg-secondary/20 p-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Envie a primeira mensagem para o dono.
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "player" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === "player"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <div className="text-[10px] opacity-70">{m.authorName}</div>
                <div>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma mensagem..." />
          <Button type="submit" className="bg-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// keep referenced to avoid unused-import warnings in some build modes
void unreadForPlayer;
