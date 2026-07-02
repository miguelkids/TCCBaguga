import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useApp, type Role } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

const search = z.object({
  role: fallback(z.enum(["jogador", "dono"]), "jogador").default("jogador"),
});

export const Route = createFileRoute("/auth/login")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Entrar — Quadra" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { role } = Route.useSearch();
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) return toast.error("Preencha todos os campos");
    login(email, role as Role);
    toast.success("Bem-vindo de volta!");
    navigate({ to: role === "dono" ? "/dono/menu" : "/jogador/reservas" });
  };

  return (
    <AuthShell>
      <h1 className="font-heading font-bold text-3xl mb-2">Entrar</h1>
      <p className="text-muted-foreground mb-6">
        Acesse sua conta como <span className="font-semibold text-foreground">{role === "dono" ? "Dono de Quadra" : "Jogador"}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
        </div>
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" size="lg">Entrar</Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Não tem conta?{" "}
        <Link
          to="/auth/cadastro"
          search={{ role: role as Role }}
          className="text-primary font-semibold hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
      <Link to="/" className="block text-xs text-center text-muted-foreground mt-4 hover:underline">
        ← Voltar
      </Link>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/30 flex flex-col">
      <header className="px-6 py-5">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl">Quadra</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-card border border-border p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
