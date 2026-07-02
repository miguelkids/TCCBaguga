import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/dono/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — Quadra" }] }),
  component: PerfilDono,
});

function PerfilDono() {
  const { user, signup } = useApp();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cidade: "" });

  useEffect(() => {
    if (user) setForm({ nome: user.nome, email: user.email, telefone: user.telefone ?? "", cidade: user.cidade ?? "" });
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    signup({ ...form, role: user.role });
    toast.success("Perfil atualizado");
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto">
        <h1 className="font-heading font-bold text-2xl md:text-4xl mb-8">Meu perfil</h1>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="h-16 w-16 rounded-full bg-clay/10 text-clay flex items-center justify-center">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <div className="font-heading font-bold text-xl">{user?.nome}</div>
              <div className="text-sm text-muted-foreground">Dono de Quadra</div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
              </div>
            </div>
            <Button type="submit" className="w-full">Salvar alterações</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
