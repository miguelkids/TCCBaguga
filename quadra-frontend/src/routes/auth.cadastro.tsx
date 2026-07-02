import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useApp, type Role } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "./auth.login";
import { toast } from "sonner";

const search = z.object({
  role: fallback(z.enum(["jogador", "dono"]), "jogador").default("jogador"),
});

export const Route = createFileRoute("/auth/cadastro")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Cadastro — Quadra" }] }),
  component: CadastroPage,
});

function CadastroPage() {
  const { role } = Route.useSearch();
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cidade: "", senha: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) return toast.error("Preencha os campos obrigatórios");
    signup({ nome: form.nome, email: form.email, telefone: form.telefone, cidade: form.cidade, role: role as Role });
    toast.success("Conta criada!");
    if (role === "dono") navigate({ to: "/dono/cadastro-quadra-1" });
    else navigate({ to: "/jogador/reservas" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthShell>
      <h1 className="font-heading font-bold text-3xl mb-2">Criar conta</h1>
      <p className="text-muted-foreground mb-6">
        Cadastre-se como <span className="font-semibold text-foreground">{role === "dono" ? "Dono de Quadra" : "Jogador"}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="nome">Nome completo</Label>
          <Input id="nome" value={form.nome} onChange={set("nome")} />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={form.email} onChange={set("email")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" value={form.telefone} onChange={set("telefone")} />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" value={form.cidade} onChange={set("cidade")} />
          </div>
        </div>
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" value={form.senha} onChange={set("senha")} />
        </div>
        <Button type="submit" className="w-full" size="lg">Criar conta</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Já tem conta?{" "}
        <Link to="/auth/login" search={{ role: role as Role }} className="text-primary font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
