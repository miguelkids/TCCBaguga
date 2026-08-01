import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Como faço para cancelar um agendamento?",
    a: "Acesse 'Meus agendamentos' no app, escolha a reserva desejada e toque em Cancelar. Cancelamentos com antecedência seguem a política definida pelo dono da quadra — você verá os detalhes antes de confirmar.",
  },
  {
    q: "Como funciona o sistema de cobrança para os donos de quadra?",
    a: "O SportCourt oferece um dashboard financeiro com todas as reservas e entradas. Em breve, o pagamento online será processado direto na plataforma, com repasse automático ao dono e cobrança simplificada para o jogador.",
  },
  {
    q: "Posso agendar uma partida mensal recorrente?",
    a: "Sim. Ao criar uma reserva você pode marcá-la como recorrente (semanal ou mensal) e o sistema reserva automaticamente o mesmo horário nas próximas semanas, alertando quando houver conflitos.",
  },
  {
    q: "O aplicativo cobra alguma taxa extra do jogador?",
    a: "Não. Para o jogador, usar o SportCourt é gratuito — você paga apenas o valor da quadra definido pelo dono. Sem mensalidade e sem taxa de reserva.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="relative py-20 sm:py-28 lg:py-32 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Perguntas{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              frequentes
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Tudo o que você precisa saber para começar.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5 transition-colors hover:border-primary/40"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}