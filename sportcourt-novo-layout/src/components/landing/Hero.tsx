import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-bg-wireframe.png.asset.json";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36"
    >
      {/* Background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroAsset.url}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-70"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Reservas simplificadas para todos
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Sua partida começa no{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SportCourt
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Encontre, agende e jogue sem complicações. A plataforma que conecta
            jogadores e donos de quadra em um só lugar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)] font-semibold transition-all hover:scale-[1.02]"
              asChild
            >
              <Link to="/register" search={{ tipo: "jogador" }}>
                <MapPin className="mr-2 h-5 w-5" />
                Sou Jogador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary/40 bg-secondary/40 text-foreground hover:bg-secondary hover:border-primary font-semibold transition-all hover:scale-[1.02]"
              asChild
            >
              <Link to="/register" search={{ tipo: "dono" }}>
                <Building2 className="mr-2 h-5 w-5" />
                Sou Dono de Quadra
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}