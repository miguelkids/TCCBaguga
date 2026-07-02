import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, Search, CalendarDays, User, LogOut, BarChart3, MapPin, Settings } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isJogador = user?.role === "jogador";

  const navJogador = [
    { to: "/jogador/reservas", label: "Buscar", icon: Search },
    { to: "/jogador/menu", label: "Reservas", icon: CalendarDays },
    { to: "/jogador/perfil", label: "Perfil", icon: User },
  ] as const;

  const navDono = [
    { to: "/dono/menu", label: "Minha Quadra", icon: Home },
    { to: "/dono/horarios", label: "Horários", icon: CalendarDays },
    { to: "/dono/dashboard", label: "Dashboard & CRM", icon: BarChart3 },
    { to: "/dono/perfil", label: "Perfil", icon: User },
  ] as const;

  const items = isJogador ? navJogador : navDono;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-30 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-8 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">Quadra</span>
        </Link>

        <nav className="flex items-center gap-1">
          {items.map((it) => {
            const active = pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.nome}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg">Quadra</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((it) => {
            const active = pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <it.icon className={cn("h-5 w-5", active && "text-primary")} />
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="absolute top-0 inset-x-0 z-30 px-6 py-5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-white/95 backdrop-blur flex items-center justify-center shadow-soft">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <span className="font-heading font-bold text-xl text-white drop-shadow">Quadra</span>
      </Link>
    </header>
  );
}
