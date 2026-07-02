import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { Pencil, Calendar, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/dono/menu")({
  head: () => ({ meta: [{ title: "Minha quadra — Quadra" }] }),
  component: MenuDono,
});

function MenuDono() {
  const { user, quadras } = useApp();
  const navigate = useNavigate();
  const minhasQuadras = quadras.filter((q) => q.donoId === user?.id);
  const quadra = minhasQuadras[0];

  if (!quadra) {
    return (
      <AppLayout>
        <div className="px-4 md:px-8 py-16 max-w-xl mx-auto text-center">
          <h1 className="font-heading font-bold text-2xl mb-3">Você ainda não cadastrou uma quadra</h1>
          <p className="text-muted-foreground mb-6">Cadastre sua quadra para começar a receber reservas.</p>
          <Button size="lg" onClick={() => navigate({ to: "/dono/cadastro-quadra-1" })}>
            <Plus className="h-4 w-4 mr-2" /> Cadastrar quadra
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-4xl mx-auto">
        <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-card mb-6 bg-muted">
          <img src={quadra.fotoUrl} alt={quadra.nome} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">{quadra.esporte}</span>
            <h1 className="font-heading font-bold text-2xl md:text-4xl mt-2 mb-1">{quadra.nome}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {quadra.endereco}, {quadra.cidade}
            </div>
          </div>
          <div className="text-right">
            <div className="font-heading font-bold text-2xl text-primary">R$ {quadra.preco}</div>
            <div className="text-xs text-muted-foreground">/hora</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <StarRating value={quadra.rating} size="md" />
          <span className="font-bold">{quadra.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({quadra.avaliacoes.length} avaliações)</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link to="/dono/editar-quadra">
            <Button variant="outline" className="w-full h-12"><Pencil className="h-4 w-4 mr-2" /> Editar quadra</Button>
          </Link>
          <Link to="/dono/horarios">
            <Button variant="outline" className="w-full h-12"><Calendar className="h-4 w-4 mr-2" /> Editar horários</Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mb-8">{quadra.descricao}</p>

        <section>
          <h2 className="font-heading font-bold text-xl mb-4">Avaliações</h2>
          {quadra.avaliacoes.length === 0 ? (
            <div className="bg-muted/50 rounded-xl p-6 text-sm text-muted-foreground text-center">
              Sua quadra ainda não tem avaliações.
            </div>
          ) : (
            <div className="space-y-3">
              {quadra.avaliacoes.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{a.autor}</span>
                    <StarRating value={a.nota} />
                  </div>
                  <p className="text-sm text-muted-foreground">{a.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
