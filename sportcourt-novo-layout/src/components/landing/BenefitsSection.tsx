import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  Users,
  Star,
  Building2,
  LineChart,
  UserCheck,
  Rocket,
  MessageCircle,
  Wallet,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Feature = { icon: LucideIcon; title: string; description: string };
type Upcoming = { icon: LucideIcon; text: string };

type AudienceProps = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  features: Feature[];
  upcoming: Upcoming[];
};

function AudienceCard({ id, badge, title, subtitle, features, upcoming }: AudienceProps) {
  return (
    <div
      id={id}
      className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] scroll-mt-24"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
        {badge}
      </div>
      <h3 className="mt-4 text-2xl sm:text-3xl font-black text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground">{subtitle}</p>

      <ul className="mt-8 space-y-5">
        {features.map((f) => (
          <li key={f.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-foreground">{f.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          <h5 className="text-sm font-bold uppercase tracking-wider text-primary">
            Próximas atualizações
          </h5>
        </div>
        <ul className="mt-4 space-y-3">
          {upcoming.map((u) => (
            <li key={u.text} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <u.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 text-sm text-foreground/90">{u.text}</span>
              <Badge
                variant="outline"
                className="shrink-0 border-primary/40 bg-primary/10 text-primary text-[10px]"
              >
                Em breve
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Feito para os{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              dois lados da quadra
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Recursos pensados para quem joga e para quem gerencia.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:gap-8 lg:grid-cols-2">
          <AudienceCard
            id="jogador"
            badge="⚡ Para o jogador"
            title="Encontre, agende e jogue"
            subtitle="Tudo o que você precisa para organizar a próxima partida."
            features={[
              {
                icon: Search,
                title: "Busca inteligente",
                description: "Pesquise por cidade e veja todas as quadras disponíveis perto de você.",
              },
              {
                icon: Clock,
                title: "Flexibilidade de horários",
                description: "Reserve horários cheios ou crie desafios contra outros times.",
              },
              {
                icon: Users,
                title: "Gestão de partida",
                description: "Liste os jogadores e defina as regras — incluindo se o goleiro paga ou joga de graça.",
              },
              {
                icon: Star,
                title: "Histórico e avaliação",
                description: "Acompanhe agendamentos passados e avalie a infraestrutura de cada quadra.",
              },
            ]}
            upcoming={[
              { icon: Wallet, text: "Pagamento online direto na plataforma" },
              { icon: MessageCircle, text: "Chat integrado para comunicação entre jogadores" },
              { icon: ShieldCheck, text: "Racha no PIX: divisão automatizada com lembretes no WhatsApp" },
            ]}
          />

          <AudienceCard
            id="dono"
            badge="🏢 Para o dono de quadra"
            title="Controle total do seu negócio"
            subtitle="Centralize agendamentos, clientes e finanças em uma única tela."
            features={[
              {
                icon: Building2,
                title: "Gestão centralizada",
                description: "Cadastre múltiplas quadras e gerencie horários, clientes e informações em um só lugar.",
              },
              {
                icon: LineChart,
                title: "Dashboard financeiro",
                description: "Painel completo para controle de faturamento e entradas em tempo real.",
              },
              {
                icon: UserCheck,
                title: "CRM de clientes",
                description: "Veja o histórico de cada cliente e identifique pendências de pagamento rapidamente.",
              },
              {
                icon: ShieldCheck,
                title: "Segurança e confiabilidade",
                description: "Seus dados e os de seus clientes protegidos do início ao fim.",
              },
            ]}
            upcoming={[
              { icon: Users, text: "Gestão compartilhada com níveis de acesso para funcionários" },
              { icon: MessageCircle, text: "Chat interno com clientes" },
              { icon: Wallet, text: "Pagamento online com cobrança automática e multa por cancelamento" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}