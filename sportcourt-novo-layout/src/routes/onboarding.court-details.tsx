import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Check, X, Upload } from "lucide-react";
import { saveCourt, markCourtOwned, type Court } from "@/lib/courts-store";

const SPORTS = [
  "Futebol",
  "Futsal",
  "Society",
  "Beach Tênis",
  "Vôlei",
  "Basquete",
  "Tênis",
  "Padel",
  "Outro",
] as const;

const DAYS = [
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
] as const;

export const Route = createFileRoute("/onboarding/court-details")({
  head: () => ({
    meta: [
      { title: "Detalhes da quadra — SportCourt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CourtStep2,
});

function CourtStep2() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [sports, setSports] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [description, setDescription] = useState("");
  const [extra, setExtra] = useState("");

  const toggleSport = (s: string) =>
    setSports((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleDay = (d: string) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "sc:court:step2",
        JSON.stringify({ sports, days, openTime, closeTime, description, extra, hasPhoto: !!photo })
      );
      localStorage.setItem("sc:court:done", "1");
      try {
        const step1 = JSON.parse(localStorage.getItem("sc:court:step1") ?? "{}");
        const court: Court = {
          id: (step1.nome || "quadra").toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36),
          nome: step1.nome ?? "",
          endereco: step1.endereco ?? "",
          cidade: step1.cidade ?? "",
          telefone: step1.telefone ?? "",
          quantidade: Number(step1.quantidade ?? 1),
          sports,
          days,
          openTime,
          closeTime,
          description,
          extra,
          photo,
        };
        saveCourt(court);
        markCourtOwned(court.id);
      } catch {}
    }
    navigate({ to: "/owner" });
  };

  return (
    <AuthShell title="Detalhes da quadra" subtitle="Etapa 2 de 2 — Personalize seu espaço" wide>
      <StepProgress current={2} />
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Photo */}
        <div className="space-y-2">
          <Label>Foto da quadra</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary/30 transition-colors hover:border-primary hover:bg-secondary/50"
          >
            {photo ? (
              <>
                <img src={photo} alt="Prévia da quadra" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remover foto"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Camera className="h-8 w-8" />
                <p className="text-sm font-medium">Clique para enviar uma foto</p>
                <p className="text-xs">PNG ou JPG, até 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
          </div>
        </div>

        {/* Sports */}
        <div className="space-y-2">
          <Label>Esportes disponíveis</Label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map((s) => {
              const active = sports.includes(s);
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSport(s)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                    active
                      ? "border-primary bg-primary/15 text-primary shadow-[var(--shadow-glow)]"
                      : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Days */}
        <div className="space-y-2">
          <Label>Dias de funcionamento</Label>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((d) => {
              const active = days.includes(d.key);
              return (
                <button
                  type="button"
                  key={d.key}
                  onClick={() => toggleDay(d.key)}
                  className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hours */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="open">Abertura</Label>
            <Input id="open" type="time" required value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="close">Fechamento</Label>
            <Input id="close" type="time" required value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="desc">Descrição</Label>
          <Textarea
            id="desc"
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fale sobre sua quadra, o público, o que a torna especial..."
            rows={4}
          />
        </div>

        {/* Extra */}
        <div className="space-y-2">
          <Label htmlFor="extra">Informações extras</Label>
          <Textarea
            id="extra"
            maxLength={500}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="Estacionamento, vestiário, iluminação, aluguel de equipamentos..."
            rows={3}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)] font-semibold"
        >
          <Upload className="mr-2 h-4 w-4" />
          Concluir cadastro
        </Button>
      </form>
    </AuthShell>
  );
}

function StepProgress({ current }: { current: 1 | 2 }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {[1, 2].map((n) => {
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex flex-1 items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                done || active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <div className={`h-1 flex-1 rounded-full ${n < 2 ? (done ? "bg-primary" : "bg-secondary") : "hidden"}`} />
          </div>
        );
      })}
    </div>
  );
}