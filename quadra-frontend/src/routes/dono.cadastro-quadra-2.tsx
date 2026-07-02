import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { Step, getFullDraft, clearDraft } from "./dono.cadastro-quadra-1";
import { toast } from "sonner";
import courtSoccer from "@/assets/court-soccer.jpg";
import courtBasketball from "@/assets/court-basketball.jpg";
import courtVolleyball from "@/assets/court-volleyball.jpg";
import courtTennis from "@/assets/court-tennis.jpg";

const FOTOS = [courtSoccer, courtBasketball, courtVolleyball, courtTennis];

export const Route = createFileRoute("/dono/cadastro-quadra-2")({
  head: () => ({ meta: [{ title: "Cadastrar quadra (2/2) — Quadra" }] }),
  component: CadastroQuadra2,
});

function CadastroQuadra2() {
  const navigate = useNavigate();
  const { addQuadra } = useApp();
  const [preco, setPreco] = useState<string>("");
  const [foto, setFoto] = useState<string>(FOTOS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const draft = getFullDraft();
    if (!draft.nome || !draft.esporte || !draft.cidade) {
      toast.error("Volte e preencha as informações básicas");
      return;
    }
    if (!preco) return toast.error("Informe o preço por hora");

    addQuadra({
      nome: draft.nome!, esporte: draft.esporte!, cidade: draft.cidade!,
      endereco: draft.endereco ?? "", descricao: draft.descricao ?? "",
      preco: Number(preco), fotoUrl: foto,
    });
    clearDraft();
    toast.success("Quadra cadastrada!");
    navigate({ to: "/dono/menu" });
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto">
        <Step current={2} />
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Preço e foto</h1>
        <p className="text-muted-foreground mb-6">Defina o valor por hora e escolha uma foto.</p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-6 shadow-card">
          <div>
            <Label htmlFor="preco">Preço por hora (R$)</Label>
            <Input id="preco" required type="number" min="0" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="120" />
          </div>

          <div>
            <Label>Foto da quadra</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {FOTOS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFoto(f)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${foto === f ? "border-primary shadow-soft" : "border-border opacity-70 hover:opacity-100"}`}
                >
                  <img src={f} alt="Opção de foto" className="w-full h-full object-cover" />
                  {foto === f && (
                    <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/dono/cadastro-quadra-1" })}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <Button type="submit" className="flex-1" size="lg">
              <Check className="h-4 w-4 mr-2" /> Finalizar cadastro
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
