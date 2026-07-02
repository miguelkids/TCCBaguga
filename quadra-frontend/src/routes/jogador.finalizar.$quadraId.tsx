import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StarRating } from "@/components/StarRating";
import { CalendarIcon, MapPin, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const HORARIOS = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

export const Route = createFileRoute("/jogador/finalizar/$quadraId")({
  head: () => ({ meta: [{ title: "Finalizar reserva — Quadra" }] }),
  loader: ({ params }) => ({ quadraId: params.quadraId }),
  component: FinalizarPage,
  notFoundComponent: () => <div className="p-10 text-center">Quadra não encontrada.</div>,
});

function FinalizarPage() {
  const { quadraId } = Route.useParams();
  const { quadras, user, addReserva } = useApp();
  const navigate = useNavigate();
  const quadra = quadras.find((q) => q.id === quadraId);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [horario, setHorario] = useState<string>("");

  if (!quadra) throw notFound();

  const dateStr = date ? format(date, "yyyy-MM-dd") : "";
  const slotsOcupados = new Set(
    quadra.horariosOcupados.filter((s) => s.startsWith(dateStr)).map((s) => s.split("-").pop() + ":00")
  );

  const handleConfirmar = () => {
    if (!date || !horario) return toast.error("Escolha data e horário");
    addReserva({
      quadraId: quadra.id, quadraNome: quadra.nome, quadraFoto: quadra.fotoUrl,
      jogadorId: user?.id ?? "anon", jogadorNome: user?.nome ?? "Convidado",
      data: dateStr, horario, preco: quadra.preco,
    });
    toast.success("Reserva confirmada!");
    navigate({ to: "/jogador/menu" });
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <Link to="/jogador/reservas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-4 shadow-card">
              <img src={quadra.fotoUrl} alt={quadra.nome} className="w-full h-full object-cover" />
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">{quadra.nome}</h1>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">{quadra.esporte}</span>
              <div className="flex items-center gap-1 text-sm">
                <StarRating value={quadra.rating} />
                <span className="font-bold">{quadra.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({quadra.avaliacoes.length})</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {quadra.endereco}
            </div>
            <p className="text-sm text-muted-foreground">{quadra.descricao}</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-card h-fit md:sticky md:top-24">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground text-sm">Preço</span>
              <span className="font-heading font-bold text-2xl text-primary">R$ {quadra.preco}<span className="text-sm font-medium text-muted-foreground">/hora</span></span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : "Escolher data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Horário</label>
                <div className="grid grid-cols-4 gap-2">
                  {HORARIOS.map((h) => {
                    const ocupado = slotsOcupados.has(h);
                    const ativo = horario === h;
                    return (
                      <button
                        key={h}
                        disabled={ocupado}
                        onClick={() => setHorario(h)}
                        className={cn(
                          "py-2 rounded-lg text-sm font-medium border transition-all",
                          ocupado && "bg-muted text-muted-foreground line-through cursor-not-allowed border-border",
                          !ocupado && !ativo && "border-border hover:border-primary hover:text-primary",
                          ativo && "bg-primary text-primary-foreground border-primary shadow-soft"
                        )}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-heading font-bold text-2xl">R$ {quadra.preco}</span>
              </div>

              <Button size="lg" className="w-full" onClick={handleConfirmar}>
                <Check className="h-4 w-4 mr-2" /> Confirmar reserva
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
