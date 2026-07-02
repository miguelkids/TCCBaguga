import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const HORARIOS = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

export const Route = createFileRoute("/dono/horarios")({
  head: () => ({ meta: [{ title: "Editar horários — Quadra" }] }),
  component: EditarHorarios,
});

function EditarHorarios() {
  const { user, quadras, toggleHorarioOcupado } = useApp();
  const quadra = quadras.find((q) => q.donoId === user?.id);
  const [date, setDate] = useState<Date>(new Date());

  if (!quadra) return <AppLayout><div className="p-10 text-center">Cadastre uma quadra primeiro.</div></AppLayout>;

  const dateStr = format(date, "yyyy-MM-dd");
  const ocupados = new Set(
    quadra.horariosOcupados.filter((s) => s.startsWith(dateStr)).map((s) => s.split("-").pop())
  );

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Editar horários</h1>
        <p className="text-muted-foreground mb-6">Marque horários como ocupados para bloqueá-los.</p>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
          <label className="text-sm font-semibold mb-2 block">Data</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold">Horários do dia</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary inline-block" /> Livre</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-destructive inline-block" /> Ocupado</span>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {HORARIOS.map((h) => {
              const hh = h.split(":")[0];
              const isOcupado = ocupados.has(hh);
              return (
                <button
                  key={h}
                  onClick={() => {
                    toggleHorarioOcupado(quadra.id, `${dateStr}-${hh}`);
                    toast.success(isOcupado ? `${h} liberado` : `${h} bloqueado`);
                  }}
                  className={cn(
                    "py-3 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-1.5",
                    isOcupado
                      ? "bg-destructive/10 text-destructive border-destructive/40"
                      : "bg-primary/5 text-primary border-primary/30 hover:bg-primary/10"
                  )}
                >
                  {isOcupado ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  {h}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
