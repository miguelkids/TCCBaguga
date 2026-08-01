import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Phone, Building2, ArrowRight, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCourts, type Court } from "@/lib/courts-store";
import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Buscar quadras — SportCourt" },
      { name: "description", content: "Encontre quadras esportivas próximas por cidade." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    setCourts(getCourts());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courts;
    return courts.filter(
      (c) =>
        c.cidade.toLowerCase().includes(q) ||
        c.nome.toLowerCase().includes(q) ||
        c.endereco.toLowerCase().includes(q),
    );
  }, [query, courts]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="SportCourt" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link to="/profile">
                <UserCircle2 className="mr-1.5 h-4 w-4" /> Perfil
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Sair</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Encontre uma quadra</h1>
          <p className="mt-2 text-muted-foreground">Pesquise pela sua cidade e reserve seu horário.</p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite a cidade (ex: São Paulo)"
              className="h-12 pl-10 text-base"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
            <p className="text-muted-foreground">Nenhuma quadra encontrada para "{query}".</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourtCard key={c.id} court={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CourtCard({ court }: { court: Court }) {
  return (
    <Link
      to="/courts/$id"
      params={{ id: court.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-[var(--shadow-glow)]"
    >
      <div className="relative h-40 overflow-hidden bg-secondary">
        {court.photo ? (
          <img src={court.photo} alt={court.nome} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Building2 className="h-12 w-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold">{court.nome}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {court.cidade} · {court.endereco}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          {court.telefone}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {court.sports.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{court.openTime} — {court.closeTime}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Ver horários <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}