import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export function AuthShell({ title, subtitle, children, footer, wide }: AuthShellProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased">
      <div className="relative isolate flex min-h-screen flex-col">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/80 to-background" aria-hidden />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="SportCourt" className="h-10 w-auto sm:h-12" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className={`w-full ${wide ? "max-w-3xl" : "max-w-md"}`}>
            <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {children}
              {footer && (
                <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}