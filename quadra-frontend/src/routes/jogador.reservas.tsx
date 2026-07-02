import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/jogador/reservas")({
  head: () => ({ meta: [{ title: "Buscar quadras — Quadra" }] }),
  component: ReservasPage,
});

function ReservasPage() {
  const { quadras } = useApp();
  const [query, setQuery] = useState("");

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return quadras;
    return quadras.filter(
      (c) => c.cidade.toLowerCase().includes(q) || c.nome.toLowerCase().includes(q) || c.esporte.toLowerCase().includes(q)
    );
  }, [quadras, query]);

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-2xl md:text-4xl mb-2">Encontre uma quadra</h1>
          <p className="text-muted-foreground">Busque por cidade, esporte ou nome.</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cidade..."
            className="pl-12 h-14 text-base rounded-xl shadow-soft border-border"
          />
        </div>

        {filtradas.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhuma quadra encontrada para "{query}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtradas.map((q) => (
              <Link
                key={q.id}
                to="/jogador/finalizar/$quadraId"
                params={{ quadraId: q.id }}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-soft hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <img src={q.fotoUrl} alt={q.nome} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-primary/95 text-primary-foreground text-xs font-semibold">
                    {q.esporte}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-heading font-bold text-lg leading-tight">{q.nome}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold shrink-0">
                      <StarRating value={q.rating} />
                      <span className="ml-1">{q.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-3.5 w-3.5" />
                    {q.cidade}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-xl text-primary">R$ {q.preco}</span>
                      <span className="text-sm text-muted-foreground"> /hora</span>
                    </div>
                    <span className="text-sm font-semibold text-accent group-hover:underline">Reservar →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
