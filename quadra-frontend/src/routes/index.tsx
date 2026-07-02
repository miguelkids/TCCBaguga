import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { User, Building2, MapPin, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-sports.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quadra — Reserve quadras esportivas" },
      { name: "description", content: "Encontre e reserve quadras de futebol, basquete, tênis, vôlei e mais — perto de você." },
      { property: "og:title", content: "Quadra — Reserve quadras esportivas" },
      { property: "og:description", content: "O jeito mais fácil de jogar." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "jogador") navigate({ to: "/jogador/reservas" });
    if (user?.role === "dono") navigate({ to: "/dono/menu" });
  }, [user, navigate]);

  return (
    <div className="min-h-dvh relative bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Jogador chutando em campo de futebol ao pôr do sol" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      <header className="relative z-10 px-6 py-5 flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-soft">
          <MapPin className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-heading font-bold text-xl">Quadra</span>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-24 pb-20">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            Reserve em segundos
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-6xl tracking-tight mb-4 text-balance">
            Seu próximo jogo<br />começa aqui.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Encontre quadras esportivas perto de você ou cadastre a sua e comece a receber reservas hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          <RoleCard
            to="/auth/login?role=jogador"
            icon={<User className="h-7 w-7" />}
            title="Sou Jogador"
            desc="Quero encontrar e reservar quadras."
            color="primary"
          />
          <RoleCard
            to="/auth/login?role=dono"
            icon={<Building2 className="h-7 w-7" />}
            title="Sou Dono de Quadra"
            desc="Quero gerenciar minha quadra e horários."
            color="clay"
          />
        </div>
      </main>
    </div>
  );
}

function RoleCard({
  to, icon, title, desc, color,
}: { to: string; icon: React.ReactNode; title: string; desc: string; color: "primary" | "clay" }) {
  return (
    <Link
      to={to}
      className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all"
    >
      <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-5 ${color === "primary" ? "bg-primary/10 text-primary" : "bg-clay/10 text-clay"}`}>
        {icon}
      </div>
      <h2 className="font-heading font-bold text-xl mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-5">{desc}</p>
      <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: color === "primary" ? "var(--primary)" : "var(--clay)" }}>
        Continuar <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
