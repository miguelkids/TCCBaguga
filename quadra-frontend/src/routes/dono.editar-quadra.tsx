import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/dono/editar-quadra")({
  head: () => ({ meta: [{ title: "Editar quadra — Quadra" }] }),
  component: EditarQuadra,
});

function EditarQuadra() {
  const { user, quadras, updateQuadra } = useApp();
  const navigate = useNavigate();
  const quadra = quadras.find((q) => q.donoId === user?.id);
  const [form, setForm] = useState({ nome: "", esporte: "", cidade: "", endereco: "", descricao: "", preco: 0 });

  useEffect(() => {
    if (quadra) setForm({
      nome: quadra.nome, esporte: quadra.esporte, cidade: quadra.cidade,
      endereco: quadra.endereco, descricao: quadra.descricao, preco: quadra.preco,
    });
  }, [quadra]);

  if (!quadra) return <AppLayout><div className="p-10 text-center">Cadastre uma quadra primeiro.</div></AppLayout>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuadra(quadra.id, form);
    toast.success("Quadra atualizada");
    navigate({ to: "/dono/menu" });
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-6">Editar quadra</h1>
        <form onSubmit={handleSave} className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-card">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="esporte">Esporte</Label>
              <Input id="esporte" value={form.esporte} onChange={(e) => setForm({ ...form, esporte: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="preco">Preço/hora (R$)</Label>
              <Input id="preco" type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={4} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/dono/menu" })}>Cancelar</Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
