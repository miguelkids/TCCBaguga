import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, Users, LogOut, BarChart3, UserCircle2, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Painel do dono — SportCourt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OwnerLayout,
});

function OwnerLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const tabs = [
    { to: "/owner", label: "Minha quadra", icon: LayoutDashboard, exact: true },
    { to: "/owner/dashboard", label: "Dashboard", icon: BarChart3, exact: false },
    { to: "/owner/reservas", label: "Reservas", icon: ClipboardList, exact: false },
    { to: "/owner/clientes", label: "Clientes", icon: Users, exact: false },
    { to: "/owner/chat", label: "Chat", icon: MessageCircle, exact: false },
  ] as const;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="SportCourt" className="h-9 w-auto" />
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <UserCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Link>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 sm:hidden">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}