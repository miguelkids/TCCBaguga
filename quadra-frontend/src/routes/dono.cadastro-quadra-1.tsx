import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

export interface CadastroQuadraDraft {
  nome: string;
  esporte: string;
  cidade: string;
  endereco: string;
  descricao: string;
}

const DRAFT_KEY = "quadra-cadastro-draft";

function getDraft(): Partial<CadastroQuadraDraft> {
  try {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem(DRAFT_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
export function setDraft(data: Partial<CadastroQuadraDraft & { preco: number; fotoUrl: string }>) {
  try {
    const cur = getDraft();
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...cur, ...data }));
  } catch {}
}
export function getFullDraft() { return getDraft() as Partial<CadastroQuadraDraft & { preco: number; fotoUrl: string }>; }
export function clearDraft() { try { sessionStorage.removeItem(DRAFT_KEY); } catch {} }

export const Route = createFileRoute("/dono/cadastro-quadra-1")({
  head: () => ({ meta: [{ title: "Cadastrar quadra (1/2) — Quadra" }] }),
  component: CadastroQuadra1,
});

function CadastroQuadra1() {
  const navigate = useNavigate();
  const initial = getDraft();
  const [form, setForm] = useState({
    nome: initial.nome ?? "",
    esporte: initial.esporte ?? "",
    cidade: initial.cidade ?? "",
    endereco: initial.endereco ?? "",
    descricao: initial.descricao ?? "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setDraft(form);
    navigate({ to: "/dono/cadastro-quadra-2" });
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto">
        <Step current={1} />
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Informações básicas</h1>
        <p className="text-muted-foreground mb-6">Conte-nos sobre sua quadra.</p>

        <form onSubmit={handleNext} className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-card">
          <div>
            <Label htmlFor="nome">Nome da quadra</Label>
            <Input id="nome" required value={form.nome} onChange={set("nome")} placeholder="Ex: Arena Verde Society" />
          </div>
          <div>
            <Label htmlFor="esporte">Esporte</Label>
            <Input id="esporte" required value={form.esporte} onChange={set("esporte")} placeholder="Ex: Futebol Society" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" required value={form.cidade} onChange={set("cidade")} />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" required value={form.endereco} onChange={set("endereco")} />
            </div>
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={4} value={form.descricao} onChange={set("descricao")} placeholder="Estrutura, vestiários, estacionamento..." />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Próximo <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}

export function Step({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2].map((n) => (
        <div key={n} className={`flex-1 h-1.5 rounded-full ${n <= current ? "bg-primary" : "bg-muted"}`} />
      ))}
      <span className="ml-3 text-xs text-muted-foreground font-semibold">Passo {current}/2</span>
    </div>
  );
}
