import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Pencil, X, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/jogador/menu")({
  head: () => ({ meta: [{ title: "Minhas reservas — Quadra" }] }),
  component: MenuJogador,
});

function MenuJogador() {
  const { reservas, user, cancelReserva, updateReserva } = useApp();
  const minhas = reservas.filter(
    (r) => r.jogadorId === user?.id || r.jogadorIdB === user?.id
  );
  const pendentes = minhas.filter((r) => r.status === "pendente");
  const confirmadas = minhas.filter((r) => r.status === "confirmada");
  const historico = minhas.filter(
    (r) => r.status === "concluida" || r.status === "cancelada"
  );

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-4xl mx-auto">
        <h1 className="font-heading font-bold text-2xl md:text-4xl mb-1">Minhas reservas</h1>
        <p className="text-muted-foreground mb-8">Acompanhe seus jogos agendados.</p>

        <Section title="Pendentes">
          {pendentes.length === 0 ? (
            <EmptyState message="Nenhum horário aguardando confirmação." />
          ) : (
            pendentes.map((r) => (
              <ReservaCard
                key={r.id}
                r={r}
                userId={user?.id ?? ""}
                onCancel={() => {
                  cancelReserva(r.id);
                  toast.success("Reserva cancelada com sucesso.");
                }}
                onSave={(dados) => {
                  updateReserva(r.id, dados);
                  toast.success("Informações atualizadas!");
                }}
              />
            ))
          )}
        </Section>

        <Section title="Confirmadas">
          {confirmadas.length === 0 ? (
            <EmptyState message="Você ainda não tem reservas confirmadas." />
          ) : (
            confirmadas.map((r) => (
              <ReservaCard
                key={r.id}
                r={r}
                userId={user?.id ?? ""}
                onSave={(dados) => {
                  updateReserva(r.id, dados);
                  toast.success("Informações atualizadas!");
                }}
              />
            ))
          )}
        </Section>

        {historico.length > 0 && (
          <Section title="Histórico">
            {historico.map((r) => (
              <ReservaCard key={r.id} r={r} userId={user?.id ?? ""} />
            ))}
          </Section>
        )}
      </div>
    </AppLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading font-bold text-lg mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-card rounded-2xl border border-dashed border-border p-8 text-center">
      <p className="text-muted-foreground mb-4">{message}</p>
      <Link to="/jogador/reservas">
        <Button variant="outline"><Search className="h-4 w-4 mr-2" /> Buscar quadras</Button>
      </Link>
    </div>
  );
}

type ReservaType = ReturnType<typeof useApp>["reservas"][number];

function ReservaCard({
  r,
  userId,
  onCancel,
  onSave,
}: {
  r: ReservaType;
  userId: string;
  onCancel?: () => void;
  onSave?: (dados: { jogadorNome: string; telefone: string; nomeTime: string }) => void;
}) {
  const [editando, setEditando] = useState(false);
  const isTimeB = r.jogadorIdB === userId;

  const nomeAtual = isTimeB ? (r.nomeJogadorB ?? "") : (r.jogadorNome ?? "");
  const telefoneAtual = isTimeB ? (r.telefoneJogadorB ?? "") : (r.telefoneJogador ?? "");
  const timeAtual = isTimeB ? (r.nomeTimeB ?? "") : (r.nomeTime ?? "");

  const [nome, setNome] = useState(nomeAtual);
  const [telefone, setTelefone] = useState(telefoneAtual);
  const [nomeTime, setNomeTime] = useState(timeAtual);

  const podeEditar = r.status === "pendente" || r.status === "confirmada";
  const podeCancelar = r.status === "pendente" && !!onCancel;

  const handleSave = () => {
    onSave?.({ jogadorNome: nome, telefone, nomeTime });
    setEditando(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex">
        <div className="w-24 sm:w-32 shrink-0 bg-muted">
          <img src={r.quadraFoto} alt={r.quadraNome} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold leading-tight truncate">{r.quadraNome}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(r.data + "T00:00:00"), "dd MMM yyyy", { locale: ptBR })} • {r.horario}
            </div>
            {(r.nomeTime || r.nomeTimeB) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {r.nomeTime && (
                  <span className="inline-flex items-center gap-1 border border-primary/30 text-primary text-xs font-semibold rounded-full px-2.5 py-0.5">
                    <MapPin className="h-3 w-3" /> {r.nomeTime}
                  </span>
                )}
                {r.nomeTimeB && (
                  <span className="inline-flex items-center gap-1 border border-accent/30 text-accent text-xs font-semibold rounded-full px-2.5 py-0.5">
                    <MapPin className="h-3 w-3" /> {r.nomeTimeB}
                  </span>
                )}
              </div>
            )}
            <div className="mt-2">
              <StatusBadge status={r.status} />
            </div>
          </div>
          <div className="flex sm:flex-col items-end gap-2 shrink-0">
            <span className="font-heading font-bold text-primary">R$ {r.preco}</span>
            <div className="flex gap-2">
              {podeEditar && onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditando((v) => !v)}
                  className="text-xs gap-1"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {editando ? "Fechar" : "Editar"}
                </Button>
              )}
              {podeCancelar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-destructive hover:text-destructive text-xs gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {editando && (
        <div className="border-t border-border px-4 py-4 bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Editar informações</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Nome</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Telefone</label>
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Nome do time</label>
              <Input value={nomeTime} onChange={(e) => setNomeTime(e.target.value)} placeholder="Nome do time" className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button size="sm" onClick={handleSave} className="gap-1">
              <Check className="h-3.5 w-3.5" /> Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pendente:   { label: "Pendente",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    confirmada: { label: "Confirmada", cls: "bg-primary/10 text-primary" },
    concluida:  { label: "Concluída",  cls: "bg-muted text-muted-foreground" },
    cancelada:  { label: "Cancelada",  cls: "bg-destructive/10 text-destructive" },
  };
  const it = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold", it.cls)}>{it.label}</span>;
}
