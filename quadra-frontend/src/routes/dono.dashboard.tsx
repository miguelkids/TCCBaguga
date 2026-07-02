import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { AppLayout } from "@/components/AppLayout";
import {
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  Search,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  CreditCard,
  ChevronRight,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/dono/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard & CRM — Quadra" }] }),
  component: Dashboard,
});

interface ClienteCRM {
  id: string;
  nome: string;
  telefone: string;
  totalReservas: number;
  faturamentoGerado: number;
  valorPendente: number;
  reservasPagas: number;
  reservas: any[];
  statusGeral: "em_dia" | "com_pendencias";
}

function Dashboard() {
  const { user, quadras, reservas, concluirReserva, updateReservaPagamento, cancelReserva } = useApp();
  const minhasQuadras = quadras.filter((q) => q.donoId === user?.id);
  const ids = new Set(minhasQuadras.map((q) => q.id));

  // Estado das Abas
  const [activeTab, setActiveTab] = useState("indicadores");

  // Estado de Filtros (Reservas)
  const [buscaReserva, setBuscaReserva] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPgto, setFiltroPgto] = useState("todos");

  // Estado de Filtros (CRM)
  const [buscaCRM, setBuscaCRM] = useState("");
  const [filtroFinanceiro, setFiltroFinanceiro] = useState<"todos" | "pendentes" | "em_dia">("todos");
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);

  if (minhasQuadras.length === 0) {
    return (
      <AppLayout>
        <div className="px-4 md:px-8 py-16 max-w-xl mx-auto text-center">
          <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-heading font-bold text-2xl mb-3">Nenhuma quadra cadastrada</h1>
          <p className="text-muted-foreground mb-6">Você precisa cadastrar uma quadra para ver o painel de controle e CRM.</p>
        </div>
      </AppLayout>
    );
  }

  // Filtrar reservas que pertencem às quadras do dono atual
  const reservasDoDono = reservas.filter((r) => ids.has(r.quadraId));

  // 1. Cálculos de Indicadores
  const faturamento = reservasDoDono
    .filter((r) => r.status !== "cancelada" && (r.statusPagamento === "pago" || r.status === "concluida"))
    .reduce((acc, r) => acc + r.preco, 0);

  const valorPendenteTotal = reservasDoDono
    .filter((r) => r.status !== "cancelada" && r.statusPagamento !== "pago" && r.status !== "concluida")
    .reduce((acc, r) => acc + r.preco, 0);

  const totalReservas = reservasDoDono.filter((r) => r.status !== "cancelada").length;
  
  // Lista de clientes únicos baseados no nome ou ID do jogador
  const clientesUnicosSet = new Set(reservasDoDono.map((r) => r.jogadorId || r.jogadorNome));
  const clientesUnicosCount = clientesUnicosSet.size;
  
  const ticketMedio = totalReservas ? faturamento / totalReservas : 0;

  // 2. Agrupamento para CRM de Clientes
  const clientesMap: Record<string, ClienteCRM> = {};

  reservasDoDono.forEach((r) => {
    const key = r.jogadorId || r.jogadorNome;
    if (!clientesMap[key]) {
      clientesMap[key] = {
        id: r.jogadorId || key,
        nome: r.jogadorNome,
        telefone: r.telefoneJogador || "",
        totalReservas: 0,
        faturamentoGerado: 0,
        valorPendente: 0,
        reservasPagas: 0,
        reservas: [],
        statusGeral: "em_dia",
      };
    }

    const c = clientesMap[key];
    c.reservas.push(r);

    if (r.status !== "cancelada") {
      c.totalReservas += 1;
      if (r.statusPagamento === "pago" || r.status === "concluida") {
        c.faturamentoGerado += r.preco;
        c.reservasPagas += 1;
      } else {
        c.valorPendente += r.preco;
      }
    }
  });

  const clientesList = Object.values(clientesMap).map((c) => {
    // Ordenar histórico de reservas por data descrescente
    c.reservas.sort((a, b) => new Date(b.data + "T" + b.horario).getTime() - new Date(a.data + "T" + a.horario).getTime());
    c.statusGeral = c.valorPendente > 0 ? "com_pendencias" : "em_dia";
    return c;
  });

  // Filtros de Clientes (CRM)
  const clientesFiltrados = clientesList.filter((c) => {
    const bateBusca = c.nome.toLowerCase().includes(buscaCRM.toLowerCase()) || c.telefone.includes(buscaCRM);
    const bateFiltro =
      filtroFinanceiro === "todos" ||
      (filtroFinanceiro === "pendentes" && c.statusGeral === "com_pendencias") ||
      (filtroFinanceiro === "em_dia" && c.statusGeral === "em_dia");
    return bateBusca && bateFiltro;
  });

  // Cliente Ativo no CRM
  const activeCliente = clientesFiltrados.find((c) => c.id === selectedClienteId) || clientesFiltrados[0] || null;

  // Filtragem de Reservas (Aba Reservas)
  const reservasFiltradas = reservasDoDono.filter((r) => {
    const bateBusca = r.jogadorNome.toLowerCase().includes(buscaReserva.toLowerCase()) || (r.nomeTime && r.nomeTime.toLowerCase().includes(buscaReserva.toLowerCase()));
    const bateStatus = filtroStatus === "todos" || r.status === filtroStatus;
    
    const pagoBoolean = r.statusPagamento === "pago" || r.status === "concluida";
    const batePgto =
      filtroPgto === "todos" ||
      (filtroPgto === "pago" && pagoBoolean) ||
      (filtroPgto === "pendente" && !pagoBoolean);

    return bateBusca && bateStatus && batePgto;
  }).sort((a, b) => new Date(b.data + "T" + b.horario).getTime() - new Date(a.data + "T" + a.horario).getTime());

  // Ações
  const handleEncerrar = (id: string) => {
    concluirReserva(id);
    toast.success("Horário encerrado! O status foi alterado para concluído e o pagamento marcado como pago.");
  };

  const handleTogglePagamento = (id: string, pgtoAtual: string | undefined) => {
    const novoStatus = pgtoAtual === "pago" ? "pendente" : "pago";
    updateReservaPagamento(id, novoStatus);
    toast.success(`Pagamento atualizado para ${novoStatus === "pago" ? "Pago" : "Pendente"}.`);
  };

  const handleCancelar = (id: string) => {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
      cancelReserva(id);
      toast.success("Reserva cancelada com sucesso.");
    }
  };

  // WhatsApp Helper
  const getWhatsLink = (tel: string, nomeCliente: string, valorPendente: number) => {
    const clean = tel.replace(/\D/g, "");
    const num = clean.startsWith("55") ? clean : `55${clean}`;
    let msg = `Olá ${nomeCliente}, tudo bem? Aqui é o dono da quadra ${minhasQuadras[0]?.nome || ""}.`;
    if (valorPendente > 0) {
      msg += ` Notei que temos um saldo em aberto de R$ ${valorPendente}. Poderia nos ajudar a verificar para darmos baixa no sistema? Muito obrigado!`;
    } else {
      msg += ` Gostaríamos de agradecer a parceria nos seus jogos recentes. Ficamos à disposição para novos agendamentos!`;
    }
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-4xl mb-2">Painel de Controle</h1>
            <p className="text-muted-foreground">Monitore o faturamento, gerencie horários e controle seus clientes em estilo CRM.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/80 p-1 border border-border/40 grid grid-cols-3 max-w-md">
            <TabsTrigger value="indicadores" className="font-medium text-xs sm:text-sm">Indicadores</TabsTrigger>
            <TabsTrigger value="reservas" className="font-medium text-xs sm:text-sm">Reservas</TabsTrigger>
            <TabsTrigger value="crm" className="font-medium text-xs sm:text-sm">Clientes (CRM)</TabsTrigger>
          </TabsList>

          {/* ABA 1: INDICADORES */}
          <TabsContent value="indicadores" className="space-y-8 outline-none">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Stat icon={<DollarSign className="h-5 w-5" />} label="Faturamento Recebido" value={`R$ ${faturamento.toLocaleString("pt-BR")}`} color="emerald" />
              <Stat icon={<AlertCircle className="h-5 w-5" />} label="Saldo Pendente" value={`R$ ${valorPendenteTotal.toLocaleString("pt-BR")}`} color="amber" />
              <Stat icon={<CalendarCheck className="h-5 w-5" />} label="Reservas Ativas" value={String(totalReservas)} color="primary" />
              <Stat icon={<Users className="h-5 w-5" />} label="Clientes Ativos" value={String(clientesUnicosCount)} color="clay" />
              <Stat icon={<TrendingUp className="h-5 w-5" />} label="Ticket Médio" value={`R$ ${ticketMedio.toFixed(0)}`} color="indigo" />
            </div>

            {/* RESERVAS RECENTES */}
            <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg">Últimas Reservas Agendadas</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("reservas")}>Ver todas</Button>
              </div>
              {reservasDoDono.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">Nenhuma reserva agendada.</div>
              ) : (
                <div className="divide-y divide-border">
                  {reservasDoDono.slice(0, 5).map((r) => {
                    const estaPago = r.statusPagamento === "pago" || r.status === "concluida";
                    return (
                      <div key={r.id} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold">
                            {r.jogadorNome[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{r.jogadorNome}</div>
                            <div className="text-xs text-muted-foreground">
                              {r.quadraNome} • {format(new Date(r.data + "T00:00:00"), "dd 'de' MMMM", { locale: ptBR })} às {r.horario}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                          <div className="flex gap-2">
                            <Badge variant={r.status === "concluida" ? "secondary" : r.status === "cancelada" ? "destructive" : "default"}>
                              {r.status === "confirmada" ? "Confirmada" : r.status === "concluida" ? "Concluída" : r.status === "cancelada" ? "Cancelada" : "Pendente"}
                            </Badge>
                            <Badge variant={estaPago ? "default" : "outline"} className={estaPago ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent" : "text-amber-600 border-amber-300"}>
                              {estaPago ? "Pago" : "Pendente"}
                            </Badge>
                          </div>
                          <div className="font-heading font-bold text-primary text-right">R$ {r.preco}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ABA 2: GERENCIAMENTO DE RESERVAS */}
          <TabsContent value="reservas" className="space-y-6 outline-none">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por jogador ou time..." className="pl-9 h-10" value={buscaReserva} onChange={(e) => setBuscaReserva(e.target.value)} />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filtros:</span>
                  </div>
                  
                  {/* Status Reserva */}
                  <select className="h-10 text-sm border border-border rounded-lg px-3 bg-background focus:outline-none" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                    <option value="todos">Status: Todos</option>
                    <option value="confirmada">Confirmadas</option>
                    <option value="concluida">Concluídas</option>
                    <option value="pendente">Pendentes</option>
                    <option value="cancelada">Canceladas</option>
                  </select>

                  {/* Status Pagamento */}
                  <select className="h-10 text-sm border border-border rounded-lg px-3 bg-background focus:outline-none" value={filtroPgto} onChange={(e) => setFiltroPgto(e.target.value)}>
                    <option value="todos">Pagamento: Todos</option>
                    <option value="pago">Pagos</option>
                    <option value="pendente">Pendentes</option>
                  </select>
                </div>
              </div>

              {reservasFiltradas.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl">Nenhuma reserva encontrada com os filtros selecionados.</div>
              ) : (
                <div className="space-y-3">
                  {reservasFiltradas.map((r) => {
                    const estaPago = r.statusPagamento === "pago" || r.status === "concluida";
                    const isConfirmada = r.status === "confirmada";

                    return (
                      <div key={r.id} className="border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-lg">
                            {r.jogadorNome[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-base">{r.jogadorNome}</span>
                              {r.nomeTime && (
                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Time: {r.nomeTime}</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                              <span>Quadra: <strong className="text-foreground">{r.quadraNome}</strong></span>
                              <span>Data: <strong className="text-foreground">{format(new Date(r.data + "T00:00:00"), "dd/MM/yyyy")}</strong></span>
                              <span>Horário: <strong className="text-foreground">{r.horario}</strong></span>
                              {r.telefoneJogador && (
                                <span className="flex items-center gap-0.5"><Phone className="h-3 w-3 inline" /> {r.telefoneJogador}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 border-t pt-3 md:border-transparent md:pt-0">
                          <div className="flex flex-col items-start md:items-end">
                            <span className="font-heading font-bold text-lg text-primary">R$ {r.preco}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`h-2.5 w-2.5 rounded-full ${estaPago ? "bg-emerald-500" : "bg-amber-500"}`} />
                              <span className="text-xs text-muted-foreground font-medium">{estaPago ? "Pago" : "Aguardando Pagamento"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isConfirmada && (
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium" onClick={() => handleEncerrar(r.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Encerrar Horário
                              </Button>
                            )}

                            <Button size="sm" variant="outline" className={estaPago ? "text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50" : "text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-50"} onClick={() => handleTogglePagamento(r.id, r.statusPagamento)}>
                              <CreditCard className="h-4 w-4 mr-1.5" /> {estaPago ? "Definir Pendente" : "Marcar Pago"}
                            </Button>

                            {r.status !== "cancelada" && r.status !== "concluida" && (
                              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleCancelar(r.id)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ABA 3: CRM DE CLIENTES */}
          <TabsContent value="crm" className="outline-none">
            {clientesFiltrados.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground shadow-card">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                <p>Nenhum cliente cadastrado ou encontrado com os filtros atuais.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* BARRA LATERAL ESQUERDA: LISTA DE CLIENTES */}
                <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col h-[650px]">
                  <div className="p-4 border-b border-border space-y-3 bg-muted/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar cliente..." className="pl-9 h-10" value={buscaCRM} onChange={(e) => setBuscaCRM(e.target.value)} />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setFiltroFinanceiro("todos")} className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${filtroFinanceiro === "todos" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        Todos ({clientesList.length})
                      </button>
                      <button onClick={() => setFiltroFinanceiro("pendentes")} className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${filtroFinanceiro === "pendentes" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        Com Pendência ({clientesList.filter(c => c.statusGeral === "com_pendencias").length})
                      </button>
                      <button onClick={() => setFiltroFinanceiro("em_dia")} className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${filtroFinanceiro === "em_dia" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        Em Dia ({clientesList.filter(c => c.statusGeral === "em_dia").length})
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-border scrollbar-thin">
                    {clientesFiltrados.map((c) => {
                      const isSelected = activeCliente?.id === c.id;
                      const hasPendency = c.statusGeral === "com_pendencias";

                      return (
                        <button key={c.id} onClick={() => setSelectedClienteId(c.id)} className={`w-full text-left p-4 flex items-center justify-between gap-3 transition-colors ${isSelected ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-muted/30 border-l-4 border-transparent"}`}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${hasPendency ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-primary/10 text-primary"}`}>
                              {c.nome[0]}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold truncate text-sm text-foreground">{c.nome}</div>
                              <div className="text-xs text-muted-foreground truncate">{c.telefone || "Sem telefone"}</div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">{c.totalReservas} jogos</span>
                            {hasPendency ? (
                              <span className="text-[10px] font-bold text-destructive flex items-center gap-0.5">
                                <AlertCircle className="h-3 w-3" /> Devendo R$ {c.valorPendente}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                <CheckCircle2 className="h-3 w-3" /> Em dia
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PAINEL DIREITO: DETALHES DO CLIENTE SELECIONADO */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-card p-6 flex flex-col h-[650px] overflow-hidden">
                  {activeCliente ? (
                    <div className="flex flex-col h-full overflow-hidden">
                      {/* Cabeçalho */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                        <div className="flex items-center gap-4">
                          <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-2xl ${activeCliente.statusGeral === "com_pendencias" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-primary/10 text-primary"}`}>
                            {activeCliente.nome[0]}
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-xl">{activeCliente.nome}</h3>
                            <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Phone className="h-3.5 w-3.5" /> {activeCliente.telefone || "Telefone não informado"}
                            </div>
                          </div>
                        </div>

                        {activeCliente.telefone && (
                          <a href={getWhatsLink(activeCliente.telefone, activeCliente.nome, activeCliente.valorPendente)} target="_blank" rel="noopener noreferrer" className="shrink-0">
                            <Button className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold shadow-soft w-full sm:w-auto">
                              <MessageSquare className="h-4.5 w-4.5 mr-2" /> Chamar no WhatsApp
                            </Button>
                          </a>
                        )}
                      </div>

                      {/* Métricas Individuais */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border bg-muted/5 p-4 rounded-xl my-4">
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Total Marcado</span>
                          <strong className="text-lg font-heading text-foreground">{activeCliente.totalReservas} partidas</strong>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Total Pago</span>
                          <strong className="text-lg font-heading text-emerald-600">R$ {activeCliente.faturamentoGerado}</strong>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Valor Pendente</span>
                          <strong className={`text-lg font-heading ${activeCliente.valorPendente > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            R$ {activeCliente.valorPendente}
                          </strong>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Taxa Adimplência</span>
                          <strong className="text-lg font-heading text-indigo-600">
                            {activeCliente.totalReservas ? Math.round((activeCliente.reservasPagas / activeCliente.totalReservas) * 100) : 100}%
                          </strong>
                        </div>
                      </div>

                      {/* Tabela de Histórico de Jogos */}
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <h4 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Histórico de Horários</h4>
                        
                        <div className="flex-1 overflow-y-auto border border-border rounded-xl scrollbar-thin">
                          <table className="w-full text-sm border-collapse text-left">
                            <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                              <tr>
                                <th className="p-3 font-semibold text-xs text-muted-foreground">Data/Hora</th>
                                <th className="p-3 font-semibold text-xs text-muted-foreground">Quadra</th>
                                <th className="p-3 font-semibold text-xs text-muted-foreground">Valor</th>
                                <th className="p-3 font-semibold text-xs text-muted-foreground">Reserva</th>
                                <th className="p-3 font-semibold text-xs text-muted-foreground text-center">Pagamento</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {activeCliente.reservas.map((r) => {
                                const estaPago = r.statusPagamento === "pago" || r.status === "concluida";
                                return (
                                  <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-3">
                                      <div className="font-medium">{format(new Date(r.data + "T00:00:00"), "dd/MM/yyyy")}</div>
                                      <div className="text-xs text-muted-foreground">{r.horario}</div>
                                    </td>
                                    <td className="p-3 font-medium text-xs max-w-[120px] truncate">{r.quadraNome}</td>
                                    <td className="p-3 font-bold text-primary">R$ {r.preco}</td>
                                    <td className="p-3">
                                      <Badge variant={r.status === "concluida" ? "secondary" : r.status === "cancelada" ? "destructive" : "default"} className="text-[10px] px-1.5 py-0">
                                        {r.status === "confirmada" ? "Confirmada" : r.status === "concluida" ? "Concluída" : r.status === "cancelada" ? "Cancelada" : "Pendente"}
                                      </Badge>
                                    </td>
                                    <td className="p-3 text-center">
                                      <button onClick={() => handleTogglePagamento(r.id, r.statusPagamento)} className={`text-xs px-2 py-1 rounded font-bold cursor-pointer transition-all ${estaPago ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"}`}>
                                        {estaPago ? "Pago" : "Pendente"}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-16 w-16 mb-4 text-muted-foreground/40" />
                      <p>Selecione um jogador na barra lateral para ver o perfil completo do CRM.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: "primary" | "emerald" | "amber" | "clay" | "indigo" }) {
  const cls =
    color === "emerald"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : color === "amber"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : color === "indigo"
          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          : color === "primary"
            ? "bg-primary/10 text-primary"
            : "bg-clay/10 text-clay";

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-soft transition-all">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${cls}`}>{icon}</div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="font-heading font-bold text-lg sm:text-xl truncate text-foreground">{value}</div>
    </div>
  );
}
