import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logoAsset.url} alt="SportCourt" className="h-10 w-auto shrink-0" />
          </div>
          <nav className="flex shrink-0 items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <a href="#jogador" className="hover:text-primary transition-colors">Jogador</a>
            <a href="#dono" className="hover:text-primary transition-colors">Dono</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} SportCourt. Reservas simplificadas.
        </p>
      </div>
    </footer>
  );
}