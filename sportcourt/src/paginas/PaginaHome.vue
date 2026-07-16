<template>
  <div class="pagina">
    
    <!-- Efeitos de Brilho de Fundo (Glows Globais) -->
    <div class="glow-fundo glow-fundo--topo" aria-hidden="true"></div>
    <div class="glow-fundo glow-fundo--meio" aria-hidden="true"></div>

    <header class="navbar-home">
      <router-link to="/" class="logo-link">
        <img :src="logo" alt="SportCourt" class="logo-img" />
      </router-link>
      
      <div class="navbar-acoes">
        <router-link to="/login" class="btn-entrar">
          Entrar
        </router-link>
        <router-link to="/escolher-perfil" class="btn-cadastrar-topo">
          Cadastrar Quadra
        </router-link>
      </div>
    </header>

    <!-- Seção 1: Hero Section (Sua quadra esportiva no próximo nível) -->
    <section class="hero-secao">
      <!-- Glows do Hero -->
      <div class="hero-glow hero-glow--topo-dir"></div>
      <div class="hero-glow hero-glow--baixo-esq"></div>

      <div class="hero-conteudo">
        <div class="hero-badge">
          <span class="badge-ping"></span>
          A Revolução Digital para Quadras Esportivas
        </div>
        
        <h1 class="hero-titulo">
          Sua quadra esportiva no <br class="hidden-sm" />
          <span class="texto-gradiente">próximo nível</span>.
        </h1>
        
        <p class="hero-descricao">
          O sistema de gestão e agendamento online mais moderno do Brasil. Automatize horários, receba pagamentos antecipados e fidelize seus atletas de forma simples e segura.
        </p>

        <div class="hero-botoes">
          <router-link to="/escolher-perfil" class="btn-hero btn-hero--principal">
            Começar Teste de 15 Dias Grátis
          </router-link>
          <router-link to="/login" class="btn-hero btn-hero--secundario">
            Buscar Quadras para Jogar
          </router-link>
        </div>
        
        <!-- Selos de Credibilidade -->
        <div class="hero-selos">
          <div class="selo-item">
            <svg class="selo-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Sem cartão de crédito
          </div>
          <div class="selo-item">
            <svg class="selo-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Configuração rápida
          </div>
          <div class="selo-item">
            <svg class="selo-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Suporte humanizado
          </div>
        </div>

        <!-- Mockup Visual do Hero -->
        <div class="hero-mockup-wrapper animate-scale-in">
          <div class="mockup-card">
            <!-- Indicador do Card -->
            <div class="mockup-header">
              <div class="mockup-botoes">
                <span class="mockup-btn mockup-btn--vermelho"></span>
                <span class="mockup-btn mockup-btn--amarelo"></span>
                <span class="mockup-btn mockup-btn--verde"></span>
              </div>
              <span class="mockup-titulo">SportCourt</span>
            </div>
            <!-- Conteúdo simulado da Dashboard do Dono -->
            <div class="mockup-conteudo">
              <div class="mockup-faturamento-box">
                <div class="mockup-label">Faturamento Hoje</div>
                <div class="mockup-valor">R$ 1.840,00</div>
                <div class="mockup-variacao">
                  <svg class="variacao-icone" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  +12.4% em relação a ontem
                </div>
              </div>

              <!-- Simulação de Próximo Agendamento -->
              <div class="mockup-agenda">
                <div class="mockup-agenda-titulo">Próximos Jogos</div>
                
                <div class="agenda-item">
                  <div class="agenda-dados">
                    <div class="agenda-icone bg-futebol">⚽</div>
                    <div class="agenda-textos">
                      <div class="agenda-local">Quadra 1 - Futebol Society</div>
                      <div class="agenda-info-reserva">Thiago Silva • 19:00 às 20:00</div>
                    </div>
                  </div>
                  <span class="badge-status badge-status--confirmada">Confirmada</span>
                </div>

                <div class="agenda-item">
                  <div class="agenda-dados">
                    <div class="agenda-icone bg-tennis">🎾</div>
                    <div class="agenda-textos">
                      <div class="agenda-local">Quadra 2 - Beach Tennis</div>
                      <div class="agenda-info-reserva">Mariana Costa • 20:00 às 21:30</div>
                    </div>
                  </div>
                  <span class="badge-status badge-status--pendente">Pendente PIX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de Scroll -->
        <div class="hero-scroll-indicador">
          <svg class="scroll-seta" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Seção 2: Uma plataforma completa para ambos os lados -->
    <section class="funcionalidades-secao" id="funcionalidades">
      <div class="secao-cabecalho">
        <h2 class="secao-titulo">
          Uma plataforma completa para ambos os lados
        </h2>
        <p class="secao-descricao">
          Escolha abaixo o seu perfil e veja como simplificamos a sua vida esportiva.
        </p>
      </div>

      <!-- Seletor de Abas -->
      <div class="seletor-abas-container">
        <div class="seletor-abas-fundo">
          <button @click="abaAtiva = 'dono'" 
                  :class="abaAtiva === 'dono' ? 'btn-aba--ativo' : ''" 
                  class="btn-aba">
            <svg class="aba-icone" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"/></svg>
            Para Quadras & Gestores
          </button>
          <button @click="abaAtiva = 'jogador'" 
                  :class="abaAtiva === 'jogador' ? 'btn-aba--ativo' : ''" 
                  class="btn-aba">
            <svg class="aba-icone" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Para Atletas & Jogadores
          </button>
        </div>
      </div>

      <!-- Conteúdo da Aba (Centralizado e bem distribuído) -->
      <div class="grade-funcionalidades-wrapper">
        <!-- Conteúdo da Aba 1 (Dono) -->
        <div v-if="abaAtiva === 'dono'" class="grid-funcionalidades animate-fade-in">
          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">📅</div>
              <h3 class="funcionalidade-titulo">Gestão de Horários</h3>
              <p class="funcionalidade-descricao">Crie, agende ou remova horários de mensalistas (fixos) ou avulsos em poucos cliques com uma agenda visual.</p>
            </div>
            <span class="funcionalidade-link">Controle Total →</span>
          </div>

          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">💰</div>
              <h3 class="funcionalidade-titulo">Pagamento Antecipado</h3>
              <p class="funcionalidade-descricao">Reduza o calote para zero! Exija pagamento de sinal ou o valor total no PIX ou cartão de crédito na hora da reserva.</p>
            </div>
            <span class="funcionalidade-link">Fluxo Seguro →</span>
          </div>

          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">📊</div>
              <h3 class="funcionalidade-titulo">Painel Financeiro</h3>
              <p class="funcionalidade-descricao">Monitore suas receitas diárias, custos e faturamento mensal de cada quadra por meio de gráficos inteligentes.</p>
            </div>
            <span class="funcionalidade-link">Decisões Rápidas →</span>
          </div>

          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">👥</div>
              <h3 class="funcionalidade-titulo">Controle de Equipes</h3>
              <p class="funcionalidade-descricao">Crie acessos diferenciados para funcionários e sócios para que eles operem a recepção sem ver dados confidenciais.</p>
            </div>
            <span class="funcionalidade-link">Gestão Segura →</span>
          </div>
        </div>

        <!-- Conteúdo da Aba 2 (Jogador) -->
        <div v-else class="grid-funcionalidades animate-fade-in">
          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">⚡</div>
              <h3 class="funcionalidade-titulo">Agendamento em 30s</h3>
              <p class="funcionalidade-descricao">Encontre a quadra mais próxima de você, escolha o horário desejado e reserve instantaneamente pelo celular.</p>
            </div>
            <span class="funcionalidade-link">Reservar agora →</span>
          </div>

          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">🤝</div>
              <h3 class="funcionalidade-titulo">Racha de PIX (Breve)</h3>
              <p class="funcionalidade-descricao">Divida a quadra com seus amigos de forma automatizada. Cada um paga sua parte via PIX e o app atualiza em tempo real.</p>
            </div>
            <span class="funcionalidade-link">Zero Estresse →</span>
          </div>

          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">💬</div>
              <h3 class="funcionalidade-titulo">Lembretes WhatsApp</h3>
              <p class="funcionalidade-descricao">Receba notificações automáticas no seu WhatsApp com a confirmação e lembrete da partida para ninguém esquecer o jogo.</p>
            </div>
            <span class="funcionalidade-link">Organização Fácil →</span>
          </div>

          <div class="card-funcionalidade">
            <div class="funcionalidade-corpo">
              <div class="funcionalidade-emoji">🏆</div>
              <h3 class="funcionalidade-titulo">Histórico & Ranking</h3>
              <p class="funcionalidade-descricao">Acompanhe todos os seus agendamentos antigos, avalie os locais que jogou e favorite as melhores quadras.</p>
            </div>
            <span class="funcionalidade-link">Acompanhamento →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 3: Chega de dor de cabeça com a gestão manual -->
    <section class="comparacao-secao">
      <!-- Glow do fundo -->
      <div class="comparacao-glow" aria-hidden="true"></div>

      <div class="comparacao-conteudo">
        <div class="secao-cabecalho text-center">
          <h2 class="secao-titulo text-white">
            Chega de dor de cabeça com a gestão manual
          </h2>
          <p class="secao-descricao text-slate-400">
            Compare como é a sua rotina atual sem tecnologia contra a simplicidade do SportCourt.
          </p>
        </div>

        <div class="grade-comparacoes">
          
          <!-- Lado Manual (Antes) -->
          <div class="card-comparacao card-comparacao--vermelho">
            <div class="comparacao-badge-tipo comparacao-badge-tipo--vermelho">Sem Tecnologia</div>
            <h3 class="comparacao-titulo-coluna text-red-400">
              <span class="emoji-alerta">⚠️</span> No Passado
            </h3>
            <ul class="lista-comparacoes text-slate-300">
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--rejeita">✕</span>
                <span>Clientes mandando mensagem no WhatsApp às 23:00 para reservar quadra.</span>
              </li>
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--rejeita">✕</span>
                <span>Caderninho rasgado, planilhas confusas e erros de horários duplicados.</span>
              </li>
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--rejeita">✕</span>
                <span>Cancelamentos de última hora com a quadra vazia e prejuízo financeiro.</span>
              </li>
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--rejeita">✕</span>
                <span>Cobrança manual e desgastante dos mensalistas fixos no fim do mês.</span>
              </li>
            </ul>
          </div>

          <!-- Lado SportCourt (Depois) -->
          <div class="card-comparacao card-comparacao--verde">
            <div class="comparacao-badge-tipo comparacao-badge-tipo--verde">Com SportCourt</div>
            <h3 class="comparacao-titulo-coluna text-emerald-400">
              <span class="emoji-alerta">⚡</span> Com o SportCourt
            </h3>
            <ul class="lista-comparacoes text-slate-200">
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--aprova">✓</span>
                <span>Seu site de reservas funciona 24 horas por dia no piloto automático.</span>
              </li>
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--aprova">✓</span>
                <span>Banco de dados na nuvem, calendário sincronizado e sem erros humanos.</span>
              </li>
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--aprova">✓</span>
                <span>Sinal financeiro no PIX antecipado garante a presença ou quitação da vaga.</span>
              </li>
              <li class="item-comparacao">
                <span class="icone-marca icone-marca--aprova">✓</span>
                <span>Mensalistas pagam de forma automatizada com lembretes recorrentes.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>

    <!-- Seção de Números (Prova Social) -->
    <section class="numeros-secao">
      <div class="numeros-conteudo">
        <div class="grade-numeros">
          <div class="numero-item">
            <div class="numero-valor">+300</div>
            <div class="numero-label">Cidades Alcançadas</div>
          </div>
          
          <div class="numero-item">
            <div class="numero-valor">+1.5M</div>
            <div class="numero-label">Agendamentos</div>
          </div>

          <div class="numero-item">
            <div class="numero-valor">+160k</div>
            <div class="numero-label">Jogadores Cadastrados</div>
          </div>

          <div class="numero-item">
            <div class="numero-valor">R$ 136M</div>
            <div class="numero-label">Faturados pelas Quadras</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 4: FAQ Section (Perguntas Frequentes) -->
    <section class="faq-secao">
      <div class="faq-conteudo">
        <div class="secao-cabecalho text-center">
          <h2 class="secao-titulo">
            Perguntas Frequentes
          </h2>
          <p class="secao-descricao">
            Tire suas principais dúvidas sobre o funcionamento do SportCourt.
          </p>
        </div>

        <div class="faq-lista">
          <div class="collapse collapse-arrow faq-item">
            <input type="radio" name="faq-accordion" checked="checked" /> 
            <div class="collapse-title faq-pergunta">
              Como funciona o teste gratuito de 15 dias?
            </div>
            <div class="collapse-content faq-resposta">
              O teste é totalmente grátis e não requer cartão de crédito. Você se cadastra, cadastra suas quadras e pode utilizar todas as ferramentas de agendamento, controle de mensalistas e caixa. Após os 15 dias, você escolhe o plano que melhor atende à sua quadra.
            </div>
          </div>

          <div class="collapse collapse-arrow faq-item">
            <input type="radio" name="faq-accordion" /> 
            <div class="collapse-title faq-pergunta">
              Como os jogadores pagam pelas reservas online?
            </div>
            <div class="collapse-content faq-resposta">
              Você pode ativar a nossa integração de pagamento. Assim, quando o jogador agendar pelo site ou app dele, ele será direcionado para pagar via PIX ou Cartão de Crédito. O valor cai direto na sua conta digital cadastrada de forma transparente.
            </div>
          </div>

          <div class="collapse collapse-arrow faq-item">
            <input type="radio" name="faq-accordion" /> 
            <div class="collapse-title faq-pergunta">
              Posso cadastrar múltiplas quadras em um único perfil?
            </div>
            <div class="collapse-content faq-resposta">
              Sim! Nossa plataforma permite o cadastro de múltiplos espaços físicos e quadras (como Quadra 1 de Futebol, Quadra 2 de Areia, etc.) dentro da mesma conta do gestor, cada uma com seus preços e regras de horário específicos.
            </div>
          </div>

          <div class="collapse collapse-arrow faq-item">
            <input type="radio" name="faq-accordion" /> 
            <div class="collapse-title faq-pergunta">
              O jogador recebe algum aviso ou lembrete da partida?
            </div>
            <div class="collapse-content faq-resposta">
              Sim. Nosso sistema dispara avisos automáticos de confirmação de agendamento por e-mail e permite a integração com mensagens do WhatsApp, diminuindo o número de faltas dos times e mantendo as quadras cheias.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-secao">
      <div class="cta-glow" aria-hidden="true"></div>
      <div class="cta-conteudo">
        <h2 class="cta-titulo">Pronto para digitalizar sua Quadra?</h2>
        <p class="cta-descricao">
          Crie sua conta agora e veja a diferença na sua receita e no seu tempo livre logo na primeira semana.
        </p>
        <div class="cta-botao-wrapper">
          <router-link to="/escolher-perfil" class="btn-cta">
            Cadastrar Quadra Grátis
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="rodape">
      <div class="rodape-conteudo">
        <div class="rodape-logo-secao">
          <img :src="logo" alt="SportCourt" class="rodape-logo-img" />
        </div>
        
        <div class="rodape-links">
          <router-link to="/login" class="link-item">Entrar</router-link>
          <router-link to="/escolher-perfil" class="link-item">Criar Quadra</router-link>
          <a href="#" class="link-item">Termos de Uso</a>
          <a href="#" class="link-item">Contato</a>
        </div>

        <div class="rodape-copyright">
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

<style scoped>
.pagina {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: var(--font-body);
  scroll-behavior: smooth;
}

/* Glows Globais */
.glow-fundo {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.glow-fundo--topo {
  top: 0;
  left: 25%;
  width: 600px;
  height: 600px;
  background: rgba(34, 197, 94, 0.08);
  filter: blur(80px);
}

.glow-fundo--meio {
  top: 33%;
  right: 40px;
  width: 500px;
  height: 500px;
  background: rgba(59, 130, 246, 0.04);
  filter: blur(80px);
}

/* Navbar */
.navbar-home {
  width: 100%;
  padding: 12px 24px;
  background: #090d16;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-img {
  height: 60px;
  width: auto;
  object-contain: contain;
  transition: transform 0.3s;
}

.logo-link:hover .logo-img {
  transform: scale(1.04);
}

.navbar-acoes {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-entrar {
  color: #34d399;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.btn-entrar:hover {
  background-color: rgba(52, 211, 153, 0.08);
}

.btn-cadastrar-topo {
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: opacity 0.2s, transform 0.2s;
}

.btn-cadastrar-topo:hover {
  opacity: 0.95;
  transform: translateY(-0.5px);
}

/* Hero Section */
.hero-secao {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #090d16;
  color: white;
  padding: 120px 24px 64px;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.hero-glow--topo-dir {
  top: 25%;
  right: 0;
  width: 500px;
  height: 500px;
  background: rgba(34, 197, 94, 0.08);
  filter: blur(80px);
}

.hero-glow--baixo-esq {
  bottom: 25%;
  left: 40px;
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.08);
  filter: blur(80px);
}

.hero-conteudo {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}

.badge-ping {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  position: relative;
}

.badge-ping::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: #34d399;
  opacity: 0.6;
  animation: ping 1.2s infinite;
}

@keyframes ping {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}

.hero-titulo {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .hero-titulo {
    font-size: 48px;
  }
}

@media (min-width: 768px) {
  .hero-titulo {
    font-size: 64px;
  }
}

.texto-gradiente {
  background: linear-gradient(135deg, #34d399, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-descricao {
  font-size: 15px;
  color: #94a3b8;
  max-width: 600px;
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 32px;
}

@media (min-width: 640px) {
  .hero-descricao {
    font-size: 18px;
  }
}

.hero-botoes {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 480px;
  margin-bottom: 32px;
}

@media (min-width: 640px) {
  .hero-botoes {
    flex-direction: row;
    max-width: none;
    justify-content: center;
  }
}

.btn-hero {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;
}

.btn-hero--principal {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
}

.btn-hero--principal:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(16, 185, 129, 0.3);
}

.btn-hero--secundario {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
}

.btn-hero--secundario:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.hero-selos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 48px;
}

.selo-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.selo-check {
  width: 14px;
  height: 14px;
  color: #10b981;
}

/* Mockup */
.hero-mockup-wrapper {
  width: 100%;
  max-width: 520px;
  padding: 0 16px;
  margin-bottom: 24px;
}

.mockup-card {
  background: rgba(15, 23, 42, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}

.mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.mockup-botoes {
  display: flex;
  gap: 6px;
}

.mockup-btn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.mockup-btn--vermelho { background: rgba(239, 68, 68, 0.8); }
.mockup-btn--amarelo { background: rgba(245, 158, 11, 0.8); }
.mockup-btn--verde { background: rgba(34, 197, 94, 0.8); }

.mockup-titulo {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mockup-conteudo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.mockup-faturamento-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1.5px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mockup-label {
  font-size: 10px;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mockup-valor {
  font-size: 24px;
  font-weight: 800;
  color: #34d399;
}

.mockup-variacao {
  font-size: 11px;
  color: rgba(52, 211, 153, 0.85);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.variacao-icone {
  width: 14px;
  height: 14px;
}

.mockup-agenda {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mockup-agenda-titulo {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  padding: 0 4px;
}

.agenda-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.agenda-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.agenda-dados {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agenda-icone {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.bg-futebol {
  background: rgba(16, 185, 129, 0.1);
}

.bg-tennis {
  background: rgba(249, 115, 22, 0.1);
}

.agenda-textos {
  display: flex;
  flex-direction: column;
}

.agenda-local {
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.agenda-info-reserva {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.badge-status {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
}

.badge-status--confirmada {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.badge-status--pendente {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.hero-scroll-indicador {
  margin-top: 32px;
  animation: bounce 2s infinite;
  display: none;
}

@media (min-width: 768px) {
  .hero-scroll-indicador {
    display: block;
  }
}

.scroll-seta {
  width: 24px;
  height: 24px;
  color: #475569;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* Seção Funcionalidades */
.funcionalidades-secao {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 96px 24px;
  background: white;
  position: relative;
  z-index: 10;
}

.secao-cabecalho {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 48px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.secao-titulo {
  font-size: 28px;
  font-weight: 800;
  color: var(--foreground);
  line-height: 1.25;
}

@media (min-width: 768px) {
  .secao-titulo {
    font-size: 40px;
  }
}

.secao-descricao {
  font-size: 15px;
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .secao-descricao {
    font-size: 17px;
  }
}

.seletor-abas-container {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
  width: 100%;
}

.seletor-abas-fundo {
  background: #f1f5f9;
  padding: 6px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.05);
}

.btn-aba {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
  width: auto;
  margin-top: 0;
  box-shadow: none;
}

.btn-aba:hover {
  color: #334155;
  transform: none;
  box-shadow: none;
}

.btn-aba--ativo {
  background: white !important;
  color: var(--foreground) !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.aba-icone {
  width: 14px;
  height: 14px;
}

.grade-funcionalidades-wrapper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.grid-funcionalidades {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
}

@media (min-width: 640px) {
  .grid-funcionalidades {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-funcionalidades {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card-funcionalidade {
  background: #fafafa;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s;
}

.card-funcionalidade:hover {
  box-shadow: var(--shadow-soft);
  transform: translateY(-3px);
  background: white;
}

.funcionalidade-corpo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.funcionalidade-emoji {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.08);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.funcionalidade-titulo {
  font-size: 18px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 12px;
}

.funcionalidade-descricao {
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.funcionalidade-link {
  font-size: 12px;
  font-weight: 700;
  color: #047857;
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Seção Comparação */
.comparacao-secao {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 96px 24px;
  background: #0f172a;
  color: white;
  position: relative;
  overflow: hidden;
}

.comparacao-glow {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 500px;
  height: 500px;
  background: rgba(16, 185, 129, 0.04);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.comparacao-conteudo {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.grade-comparacoes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-top: 32px;
}

@media (min-width: 768px) {
  .grade-comparacoes {
    grid-template-columns: 1fr 1fr;
  }
}

.card-comparacao {
  background: rgba(2, 6, 23, 0.5);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card-comparacao--vermelho {
  border: 1.5px solid rgba(239, 68, 68, 0.15);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.02);
}

.card-comparacao--verde {
  border: 1.5px solid rgba(16, 185, 129, 0.25);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.06);
}

.comparacao-badge-tipo {
  align-self: flex-start;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.comparacao-badge-tipo--vermelho {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.comparacao-badge-tipo--verde {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.comparacao-titulo-coluna {
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.lista-comparacoes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
}

.item-comparacao {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.icone-marca {
  font-weight: 850;
  font-size: 15px;
  margin-top: 1px;
}

.icone-marca--rejeita {
  color: #ef4444;
}

.icone-marca--aprova {
  color: #34d399;
}

/* Numeros Section */
.numeros-secao {
  padding: 64px 24px;
  background: var(--gradient-primary);
  color: white;
  position: relative;
  z-index: 10;
  width: 100%;
}

.numeros-conteudo {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.grade-numeros {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  text-align: center;
}

@media (min-width: 1024px) {
  .grade-numeros {
    grid-template-columns: repeat(4, 1fr);
  }
}

.numero-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.numero-valor {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .numero-valor {
    font-size: 52px;
  }
}

.numero-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(209, 250, 229, 0.9);
  letter-spacing: 0.05em;
}

@media (min-width: 768px) {
  .numero-label {
    font-size: 13px;
  }
}

/* FAQ Section */
.faq-secao {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 96px 24px;
  background: white;
  border-top: 1px solid var(--border);
  position: relative;
  z-index: 10;
}

.faq-conteudo {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.faq-lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

.faq-item {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s;
}

.faq-item:hover {
  background: #fafafa;
}

.faq-pergunta {
  font-size: 15px;
  font-weight: 800;
  color: #334155;
  padding: 20px 24px !important;
}

@media (min-width: 768px) {
  .faq-pergunta {
    font-size: 17px;
  }
}

.faq-resposta {
  padding: 0 24px 20px !important;
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
}

/* CTA Secao */
.cta-secao {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 96px 24px;
  background: #090d16;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.cta-conteudo {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cta-titulo {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .cta-titulo {
    font-size: 48px;
  }
}

.cta-descricao {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.6;
  font-weight: 300;
  max-width: 500px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .cta-descricao {
    font-size: 18px;
  }
}

.cta-botao-wrapper {
  margin-top: 16px;
}

.btn-cta {
  display: inline-block;
  padding: 16px 40px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-cta:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(16, 185, 129, 0.35);
}

/* Rodapé */
.rodape {
  width: 100%;
  background: #090d16;
  border-top: 1px solid #1e293b;
  color: #94a3b8;
  padding: 48px 24px;
  position: relative;
  z-index: 10;
  font-size: 14px;
}

.rodape-conteudo {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

@media (min-width: 768px) {
  .rodape-conteudo {
    flex-direction: row;
    justify-content: space-between;
  }
}

.rodape-logo-secao {
  display: flex;
  align-items: center;
}

.rodape-logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.45;
}

.rodape-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.link-item {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
  background: none;
  padding: 0;
  margin-top: 0;
  font-weight: 500;
}

.link-item:hover {
  color: white;
}

.rodape-copyright {
  font-size: 12px;
  color: #475569;
}

/* Transições & Helpers */
.hidden-sm {
  display: none;
}

@media (min-width: 640px) {
  .hidden-sm {
    display: inline;
  }
}

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

/* DaisyUI Accordion Integrations compatibility inside scoped style */
.collapse:not(td):not(tr):not(thead) {
  position: relative;
  display: grid;
  overflow: hidden;
  grid-template-rows: auto 0fr;
  transition: grid-template-rows 0.2s;
}

.collapse-title,
.collapse-content {
  grid-column-start: 1;
  grid-row-start: 1;
}

.collapse-content {
  grid-row-start: 2;
  min-height: 0;
  transition: visibility 0.2s;
  visibility: hidden;
}

.collapse-arrow > .collapse-title:after {
  position: absolute;
  display: block;
  height: 0.5rem;
  width: 0.5rem;
  content: "";
  transform: rotate(45deg);
  transition: transform 0.2s;
  right: 1.8rem;
  top: 1.8rem;
  border-bottom: 2px solid currentColor;
  border-right: 2px solid currentColor;
  pointer-events: none;
}

.collapse input[type="radio"],
.collapse input[type="checkbox"] {
  grid-column-start: 1;
  grid-row-start: 1;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  margin: 0;
}

.collapse input[type="radio"]:checked ~ .collapse-content,
.collapse input[type="checkbox"]:checked ~ .collapse-content {
  visibility: visible;
}

.collapse:has(input[type="radio"]:checked),
.collapse:has(input[type="checkbox"]:checked) {
  grid-template-rows: auto 1fr;
}

.collapse:has(input[type="radio"]:checked) .collapse-arrow > .collapse-title:after,
.collapse:has(input[type="checkbox"]:checked) .collapse-arrow > .collapse-title:after {
  transform: rotate(225deg);
  top: 2.1rem;
}
</style>
