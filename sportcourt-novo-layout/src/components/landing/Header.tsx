import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={logoAsset.url}
              alt="SportCourt"
              className="h-10 w-auto sm:h-12 shrink-0"
            />
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-secondary text-sm sm:text-base"
              asChild
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)] font-semibold text-sm sm:text-base"
              asChild
            >
              <Link to="/register">Cadastrar-se</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}