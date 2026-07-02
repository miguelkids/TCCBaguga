<template>
  <div class="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans scroll-smooth">
    
    <!-- Efeitos de Brilho de Fundo (Glows Globais) -->
    <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
    <div class="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

<header class="w-full py-3 bg-slate-950 border-b border-white/5 fixed top-0 left-0 z-50 shadow-lg backdrop-blur-md bg-opacity-95 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center group flex-shrink-0" style="margin-left: 24px !important;">
        <img :src="logo" alt="SportCourt" class="h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105 duration-300" />
      </router-link>
      
      <div class="flex items-center gap-2 sm:gap-4 justify-end" style="margin-right: 40px !important; float: right;">
        
        <router-link to="/login" class="text-sm font-bold transition-colors px-4 py-2.5 rounded-lg hover:bg-emerald-500/10 whitespace-nowrap block" style="color: #34d399 !important;">
          Entrar
        </router-link>
        
        <router-link to="/escolher-perfil" class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap block">
          Cadastrar Quadra
        </router-link>
        
      </div>

    </header>

    <!-- Seção 1: Hero Section (Sua quadra esportiva no próximo nível) -->
    <section class="min-h-screen flex flex-col justify-center items-center relative bg-slate-950 text-white py-20 px-6 overflow-hidden">
      <!-- Glows do Hero -->
      <div class="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto text-center space-y-8 relative z-10 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          A Revolução Digital para QUadras Esportivas
        </div>
        
        <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Sua quadra esportiva no <br class="hidden sm:inline" />
          <span class="bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">próximo nível</span>.
        </h1>
        
        <p class="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          O sistema de gestão e agendamento online mais moderno do Brasil. Automatize horários, receba pagamentos antecipados e fidelize seus atletas de forma simples e segura.
        </p>
        <br>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full sm:w-auto">
          <router-link to="/escolher-perfil" style="width:auto;margin-top:0;" class="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-base px-12 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-center">
            Começar Teste de 15 Dias Grátis
          </router-link>
          <router-link to="/login" style="width:auto;margin-top:0;background:none;box-shadow:none;" class="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-semibold text-base px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all text-center">
            Buscar Quadras para Jogar
          </router-link>
        </div>
        
        <!-- Selos de Credibilidade -->
        <div class="flex flex-wrap justify-center items-center gap-6 pt-4 text-slate-500 text-xs font-medium">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Sem cartão de crédito
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Configuração rápida
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Suporte humanizado
          </div>
        </div>
        <br>
        <!-- Mockup Visual do Hero (Centralizado abaixo com espaçamento) -->
        <div class="w-full max-w-xl mx-auto mt-16 px-4 animate-scale-in relative z-10">
          <div class="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            <!-- Indicador do Card -->
            <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span class="text-xs text-slate-500 font-semibold tracking-wider">SportCourt</span>
            </div>
            <!-- Conteúdo simulado da Dashboard do Dono -->
            <div class="space-y-4 text-left">
              <div class="bg-slate-950/80 rounded-xl p-4 border border-white/5 space-y-1">
                <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Faturamento Hoje</div>
                <div class="text-2xl font-bold text-emerald-400">R$ 1.840,00</div>
                <div class="text-[11px] text-emerald-500/80 flex items-center gap-1 font-semibold">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  +12.4% em relação a ontem
                </div>
              </div>

              <!-- Simulação de Próximo Agendamento -->
              <div class="space-y-2.5">
                <div class="text-xs font-bold text-slate-400 px-1">Próximos Jogos</div>
                
                <div class="bg-slate-950/40 rounded-xl p-3.5 border border-white/5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-450 font-bold text-sm">⚽</div>
                    <div>
                      <div class="text-xs font-bold text-white">Quadra 1 - Futebol Society</div>
                      <div class="text-[11px] text-slate-400">Thiago Silva • 19:00 às 20:00</div>
                    </div>
                  </div>
                  <span class="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">Confirmada</span>
                </div>

                <div class="bg-slate-950/40 rounded-xl p-3.5 border border-white/5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-450 font-bold text-sm">🎾</div>
                    <div>
                      <div class="text-xs font-bold text-white">Quadra 2 - Beach Tennis</div>
                      <div class="text-[11px] text-slate-400">Mariana Costa • 20:00 às 21:30</div>
                    </div>
                  </div>
                  <span class="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">Pendente PIX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de Scroll -->
        <div class="pt-8 animate-bounce hidden md:block">
          <svg class="w-6 h-6 text-slate-500 mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Seção 2: Uma plataforma completa para ambos os lados -->
    <section class="min-h-screen flex flex-col justify-center items-center py-24 px-6 md:px-12 bg-white relative z-10" id="funcionalidades">
      <div class="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          Uma plataforma completa para ambos os lados
        </h2>
        <p class="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
          Escolha abaixo o seu perfil e veja como simplificamos a sua vida esportiva.
        </p>
      </div>
      <br>
      <!-- Seletor de Abas -->
      <div class="flex justify-center mb-16">
        <div class="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-slate-200/50">
          <button @click="abaAtiva = 'dono'" 
                  :class="abaAtiva === 'dono' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'" 
                  class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 !w-auto !mt-0 border-none cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"/></svg>
            Para Quadras & Gestores
          </button>
          <button @click="abaAtiva = 'jogador'" 
                  :class="abaAtiva === 'jogador' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-550 hover:text-slate-800 font-medium'" 
                  class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 !w-auto !mt-0 border-none cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Para Atletas & Jogadores
          </button>
        </div>
      </div>
      <br>
      <!-- Conteúdo da Aba (Centralizado e bem distribuído) -->
      <div class="w-full max-w-6xl mx-auto px-4">
        <!-- Conteúdo da Aba 1 (Dono) -->
        <div v-if="abaAtiva === 'dono'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in justify-center items-stretch">
          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">📅</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Gestão de Horários</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Crie, agende ou remova horários de mensalistas (fixos) ou avulsos em poucos cliques com uma agenda visual.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Controle Total →</span>
          </div>

          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">💰</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Pagamento Antecipado</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Reduza o calote para zero! Exija pagamento de sinal ou o valor total no PIX ou cartão de crédito na hora da reserva.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Fluxo Seguro →</span>
          </div>

          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">📊</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Painel Financeiro</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Monitore suas receitas diárias, custos e faturamento mensal de cada quadra por meio de gráficos inteligentes.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Decisões Rápidas →</span>
          </div>

          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">👥</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Controle de Equipes</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Crie acessos diferenciados para funcionários e sócios para que eles operem a recepção sem ver dados confidenciais.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Gestão Segura →</span>
          </div>
        </div>

        <!-- Conteúdo da Aba 2 (Jogador) -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in justify-center items-stretch">
          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">⚡</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Agendamento em 30s</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Encontre a quadra mais próxima de você, escolha o horário desejado e reserve instantaneamente pelo celular.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Reservar agora →</span>
          </div>

          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">🤝</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Racha de PIX (Breve)</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Divida a quadra com seus amigos de forma automatizada. Cada um paga sua parte via PIX e o app atualiza em tempo real.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Zero Estresse →</span>
          </div>

          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">💬</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Lembretes WhatsApp</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Receba notificações automáticas no seu WhatsApp com a confirmação e lembrete da partida para ninguém esquecer o jogo.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Organização Fácil →</span>
          </div>

          <div class="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-6">🏆</div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Histórico & Ranking</h3>
              <p class="text-sm text-slate-500 leading-relaxed">Acompanhe todos os seus agendamentos antigos, avalie os locais que jogou e favorite as melhores quadras.</p>
            </div>
            <span class="text-xs font-bold text-emerald-650 mt-8 flex items-center gap-1">Acompanhamento →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 3: Chega de dor de cabeça com a gestão manual -->
    <section class="min-h-screen flex flex-col justify-center items-center py-24 bg-slate-900 text-white px-6 md:px-12 relative overflow-hidden">
      <!-- Glow do fundo -->
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto w-full relative z-10 space-y-16 flex flex-col items-center">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <h2 class="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Chega de dor de cabeça com a gestão manual
          </h2>
          <p class="text-slate-400 text-base md:text-lg">
            Compare como é a sua rotina atual sem tecnologia contra a simplicidade do SportCourt.
          </p>
        </div>
        <br>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto w-full items-stretch justify-center">
          
          <!-- Lado Manual (Antes) -->
          <div class="bg-slate-950/60 border border-red-500/20 rounded-2xl p-8 md:p-10 space-y-6 relative overflow-hidden text-left shadow-[0_0_30px_rgba(239,68,68,0.02)] flex flex-col">
            <div class="self-start bg-red-500/10 text-red-400 text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg border border-red-500/20 mb-2">Sem Tecnologia</div>
            
            <h3 class="text-xl font-extrabold text-red-400 flex items-center gap-2.5">
              <span class="text-xl">⚠️</span> No Passado
            </h3>
            
            <ul class="space-y-5 text-slate-350 text-sm leading-relaxed flex-1">
              <li class="flex items-start gap-3">
                <span class="text-red-500 mt-0.5 font-bold text-base">✕</span>
                <span>Clientes mandando mensagem no WhatsApp às 23:00 para reservar quadra.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 mt-0.5 font-bold text-base">✕</span>
                <span>Caderninho rasgado, planilhas confusas e erros de horários duplicados.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 mt-0.5 font-bold text-base">✕</span>
                <span>Cancelamentos de última hora com a quadra vazia e prejuízo financeiro.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-500 mt-0.5 font-bold text-base">✕</span>
                <span>Cobrança manual e desgastante dos mensalistas fixos no fim do mês.</span>
              </li>
            </ul>
          </div>

          <!-- Lado SportCourt (Depois) -->
          <div class="bg-slate-950/85 border border-emerald-500/30 rounded-2xl p-8 md:p-10 space-y-6 relative overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.08)] text-left flex flex-col">
            <div class="self-start bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg border border-emerald-500/30 mb-2">Com SportCourt</div>
            
            <h3 class="text-xl font-extrabold text-emerald-400 flex items-center gap-2.5">
              <span class="text-xl">⚡</span> Com o SportCourt
            </h3>
            
            <ul class="space-y-5 text-slate-200 text-sm leading-relaxed flex-1">
              <li class="flex items-start gap-3">
                <span class="text-emerald-400 mt-0.5 font-bold text-base">✓</span>
                <span>Seu site de reservas funciona 24 horas por dia no piloto automático.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-400 mt-0.5 font-bold text-base">✓</span>
                <span>Banco de dados na nuvem, calendário sincronizado e sem erros humanos.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-400 mt-0.5 font-bold text-base">✓</span>
                <span>Sinal financeiro no PIX antecipado garante a presença ou quitação da vaga.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-emerald-400 mt-0.5 font-bold text-base">✓</span>
                <span>Mensalistas pagam de forma automatizada com lembretes recorrentes.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>

    <!-- Seção de Números (Prova Social) - Integrado e Centrado -->
    <section class="flex flex-col justify-center items-center py-16 px-6 md:px-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white relative z-10 w-full">
      <div class="max-w-6xl mx-auto w-full text-center space-y-12">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 justify-center items-center">
          <div class="space-y-2">
            <div class="text-4xl md:text-6xl font-extrabold tracking-tight">+300</div>
            <div class="text-xs md:text-sm font-bold uppercase text-emerald-100/90 tracking-wider">Cidades Alcançadas</div>
          </div>
          
          <div class="space-y-2">
            <div class="text-4xl md:text-6xl font-extrabold tracking-tight">+1.5M</div>
            <div class="text-xs md:text-sm font-bold uppercase text-emerald-100/90 tracking-wider">Agendamentos</div>
          </div>

          <div class="space-y-2">
            <div class="text-4xl md:text-6xl font-extrabold tracking-tight">+160k</div>
            <div class="text-xs md:text-sm font-bold uppercase text-emerald-100/90 tracking-wider">Jogadores Cadastrados</div>
          </div>

          <div class="space-y-2">
            <div class="text-4xl md:text-6xl font-extrabold tracking-tight">R$ 136M</div>
            <div class="text-xs md:text-sm font-bold uppercase text-emerald-100/90 tracking-wider">Faturados pelas Quadras</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 4: FAQ Section (Perguntas Frequentes) -->
    <section class="min-h-screen flex flex-col justify-center items-center py-24 bg-white border-t border-slate-200/80 px-6 md:px-12 relative z-10">
      <div class="max-w-4xl mx-auto w-full flex flex-col items-center">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Perguntas Frequentes
          </h2>
          <p class="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
            Tire suas principais dúvidas sobre o funcionamento do SportCourt.
          </p>
        </div>
        <br>
        <!-- Acordeões DaisyUI (Centrados e Largos) -->
        <div class="space-y-5 max-w-3xl mx-auto w-full">
          <div class="collapse collapse-arrow bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm text-left">
            <input type="radio" name="faq-accordion" checked="checked" /> 
            <div class="collapse-title text-base md:text-lg font-bold text-slate-800 py-5 px-7">
              Como funciona o teste gratuito de 15 dias?
            </div>
            <div class="collapse-content px-7 pb-6 text-sm md:text-base text-slate-500 leading-relaxed">
              O teste é totalmente grátis e não requer cartão de crédito. Você se cadastra, cadastra suas quadras e pode utilizar todas as ferramentas de agendamento, controle de mensalistas e caixa. Após os 15 dias, você escolhe o plano que melhor atende à sua quadra.
            </div>
          </div>

          <div class="collapse collapse-arrow bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm text-left">
            <input type="radio" name="faq-accordion" /> 
            <div class="collapse-title text-base md:text-lg font-bold text-slate-800 py-5 px-7">
              Como os jogadores pagam pelas reservas online?
            </div>
            <div class="collapse-content px-7 pb-6 text-sm md:text-base text-slate-500 leading-relaxed">
              Você pode ativar a nossa integração de pagamento. Assim, quando o jogador agendar pelo site ou app dele, ele será direcionado para pagar via PIX ou Cartão de Crédito. O valor cai direto na sua conta digital cadastrada de forma transparente.
            </div>
          </div>

          <div class="collapse collapse-arrow bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm text-left">
            <input type="radio" name="faq-accordion" /> 
            <div class="collapse-title text-base md:text-lg font-bold text-slate-800 py-5 px-7">
              Posso cadastrar múltiplas quadras em um único perfil?
            </div>
            <div class="collapse-content px-7 pb-6 text-sm md:text-base text-slate-500 leading-relaxed">
              Sim! Nossa plataforma permite o cadastro de múltiplos espaços físicos e quadras (como Quadra 1 de Futebol, Quadra 2 de Areia, etc.) dentro da mesma conta do gestor, cada uma com seus preços e regras de horário específicos.
            </div>
          </div>

          <div class="collapse collapse-arrow bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm text-left">
            <input type="radio" name="faq-accordion" /> 
            <div class="collapse-title text-base md:text-lg font-bold text-slate-800 py-5 px-7">
              O jogador recebe algum aviso ou lembrete da partida?
            </div>
            <div class="collapse-content px-7 pb-6 text-sm md:text-base text-slate-500 leading-relaxed">
              Sim. Nosso sistema dispara avisos automáticos de confirmação de agendamento por e-mail e permite a integração com mensagens do WhatsApp, diminuindo o número de faltas dos times e mantendo as quadras cheias.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="min-h-[70vh] flex flex-col justify-center items-center py-24 bg-slate-950 text-white text-center px-6 md:px-12 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div class="max-w-3xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
        <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Pronto para digitalizar sua Quadra?</h2>
        <p class="text-slate-400 text-base md:text-xl max-w-xl mx-auto leading-relaxed font-light">
          Crie sua conta agora e veja a diferença na sua receita e no seu tempo livre logo na primeira semana.
        </p>
        <br>
        <div class="pt-4">
          <router-link to="/escolher-perfil" style="width:auto;margin-top:0;display:inline-block;" class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-base px-10 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
            Cadastrar Quadra Grátis
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="w-full bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-6 md:px-16 relative z-10 text-sm">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex items-center gap-3">
          <img :src="logo" alt="SportCourt" class="h-12 w-auto object-contain brightness-0 invert opacity-50" />
        </div>
        
        <div class="flex flex-wrap gap-8 justify-center">
          <router-link to="/login" style="width:auto;margin-top:0;background:none;box-shadow:none;padding:0;" class="hover:text-white transition-colors">Entrar</router-link>
          <router-link to="/escolher-perfil" style="width:auto;margin-top:0;background:none;box-shadow:none;padding:0;" class="hover:text-white transition-colors">Criar Quadra</router-link>
          <a href="#" style="background:none;padding:0;margin-top:0;" class="hover:text-white transition-colors">Termos de Uso</a>
          <a href="#" style="background:none;padding:0;margin-top:0;" class="hover:text-white transition-colors">Contato</a>
        </div>

        <div class="text-slate-600 text-xs">
          &copy; 2026 SportCourt. Reservas Simplificadas. Todos os direitos reservados.
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
import logo from '@/assets/logosite1.png'

export default {
  name: 'PaginaHome',
  data() {
    return {
      logo,
      abaAtiva: 'dono'
    }
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
