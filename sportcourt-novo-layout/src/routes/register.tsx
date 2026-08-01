import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, MapPin, Building2 } from "lucide-react";
import { saveUser } from "@/lib/user-store";

type Tipo = "jogador" | "dono";

const searchSchema = z.object({
  tipo: z.enum(["jogador", "dono"]).optional(),
});

export const Route = createFileRoute("/register")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Criar conta — SportCourt" },
      { name: "description", content: "Cadastre-se no SportCourt em segundos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { tipo: tipoParam } = Route.useSearch();
  const [tipo, setTipo] = useState<Tipo>(tipoParam ?? "jogador");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState<string | null>(null);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (form.senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");
    if (form.senha !== form.confirmar) return setErro("As senhas não coincidem.");

    if (typeof window !== "undefined") {
      localStorage.setItem("sc:tipo", tipo);
      localStorage.setItem("sc:nome", form.nome);
      localStorage.setItem("sc:email", form.email);
      saveUser({ tipo, nome: form.nome, email: form.email });
    }

    if (tipo === "dono") {
      navigate({ to: "/onboarding/court" });
    } else {
      navigate({ to: "/search" });
    }
  };

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Escolha o tipo de conta e comece agora"
      footer={
        <>
          Já tem uma conta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-border bg-secondary/40 p-1">
        {(["jogador", "dono"] as const).map((t) => {
          const active = tipo === t;
          const Icon = t === "jogador" ? MapPin : Building2;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t === "jogador" ? "Sou Jogador" : "Sou Dono de Quadra"}
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="nome" required maxLength={100} value={form.nome} onChange={update("nome")} placeholder="Seu nome" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required autoComplete="email" value={form.email} onChange={update("email")} placeholder="voce@email.com" className="pl-9" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="senha" type="password" required minLength={6} value={form.senha} onChange={update("senha")} placeholder="Mínimo 6 caracteres" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmar">Confirmar senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="confirmar" type="password" required minLength={6} value={form.confirmar} onChange={update("confirmar")} placeholder="Repita a senha" className="pl-9" />
            </div>
          </div>
        </div>

        {erro && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {erro}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)] font-semibold"
        >
          Criar conta
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {tipo === "dono" && (
          <p className="text-center text-xs text-muted-foreground">
            Após o cadastro, você configurará os dados da sua quadra.
          </p>
        )}
      </form>
    </AuthShell>
  );
}