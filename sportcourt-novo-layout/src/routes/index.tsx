import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SportCourt — Reservas de quadras simplificadas" },
      { name: "description", content: "Encontre, agende e jogue sem complicações. SportCourt conecta jogadores e donos de quadra em uma única plataforma." },
      { property: "og:title", content: "SportCourt — Reservas de quadras simplificadas" },
      { property: "og:description", content: "Encontre, agende e jogue sem complicações." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased scroll-smooth">
      <Header />
      <main>
        <Hero />
        <BenefitsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
