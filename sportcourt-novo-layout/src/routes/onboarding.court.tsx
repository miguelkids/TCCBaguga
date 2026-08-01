import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Phone, Hash, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding/court")({
  head: () => ({
    meta: [
      { title: "Cadastro da quadra — SportCourt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CourtStep1,
});

function CourtStep1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    telefone: "",
    quantidade: "1",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("sc:court:step1", JSON.stringify(form));
    }
    navigate({ to: "/onboarding/court-details" });
  };

  return (
    <AuthShell
      title="Dados da quadra"
      subtitle="Etapa 1 de 2 — Informações principais"
      wide
    >
      <StepProgress current={1} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da quadra</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="nome" required maxLength={120} value={form.nome} onChange={update("nome")} placeholder="Arena SportCourt" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="endereco" required maxLength={200} value={form.endereco} onChange={update("endereco")} placeholder="Rua, número, bairro" className="pl-9" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" required maxLength={80} value={form.cidade} onChange={update("cidade")} placeholder="Sua cidade" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="telefone" required maxLength={20} value={form.telefone} onChange={update("telefone")} placeholder="(00) 00000-0000" className="pl-9" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade de quadras</Label>
          <div className="relative">
            <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="quantidade" required type="number" min={1} max={99} value={form.quantidade} onChange={update("quantidade")} className="pl-9" />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)] font-semibold"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
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
              {n}
            </div>
            <div className={`h-1 flex-1 rounded-full ${n < 2 ? (done ? "bg-primary" : "bg-secondary") : "hidden"}`} />
          </div>
        );
      })}
    </div>
  );
}