<template>
  <div class="home-pagina">

    <!-- Header fixo -->
    <header class="home-header" :class="{ 'home-header--scrolled': scrolled }">
      <div class="home-header-inner">
        <router-link to="/" class="home-logo-link">
          <img :src="logo" alt="SportCourt" class="home-logo-img" />
        </router-link>
        <div class="home-header-acoes">
          <router-link to="/login" class="home-btn-ghost">Entrar</router-link>
          <router-link to="/escolher-perfil" class="home-btn-primary">Cadastrar-se</router-link>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="home-hero">
      <div class="home-hero-inner">
        <div class="home-badge">
          <span class="home-badge-dot"></span>
          Reservas simplificadas para todos
        </div>

        <h1 class="home-hero-titulo">
          Sua partida começa no
          <span class="home-gradiente">SportCourt</span>
        </h1>

        <p class="home-hero-descricao">
          Encontre, agende e jogue sem complicações. A plataforma que conecta
          jogadores e donos de quadra em um só lugar.
        </p>

        <div class="home-hero-botoes">
          <router-link to="/cadastro-jogador" class="home-btn-hero home-btn-hero--principal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Sou Jogador
          </router-link>
          <router-link to="/cadastro-dono" class="home-btn-hero home-btn-hero--secundario">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Sou Dono de Quadra
          </router-link>
        </div>
      </div>
    </section>

    <!-- Seção de Benefícios -->
    <section class="home-beneficios">
      <div class="home-secao-inner">
        <div class="home-secao-cabecalho">
          <h2 class="home-secao-titulo">
            Feito para os
            <span class="home-gradiente">dois lados da quadra</span>
          </h2>
          <p class="home-secao-subtitulo">
            Recursos pensados para quem joga e para quem gerencia.
          </p>
        </div>

        <div class="home-cards-grid">
          <!-- Card Jogador -->
          <div class="home-card-audiencia" id="jogador">
            <div class="home-card-badge">Para o jogador</div>
            <h3 class="home-card-titulo">Encontre, agende e jogue</h3>
            <p class="home-card-subtitulo">Tudo o que você precisa para organizar a próxima partida.</p>

            <ul class="home-features-lista">
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Busca inteligente</div>
                  <div class="home-feature-desc">Pesquise por cidade e veja todas as quadras disponíveis perto de você.</div>
                </div>
              </li>
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Flexibilidade de horários</div>
                  <div class="home-feature-desc">Reserve horários disponíveis de forma simples e rápida.</div>
                </div>
              </li>
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Gestão de partida</div>
                  <div class="home-feature-desc">Liste os jogadores e defina as regras da sua pelada.</div>
                </div>
              </li>
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Histórico e avaliação</div>
                  <div class="home-feature-desc">Acompanhe agendamentos passados e avalie a infraestrutura de cada quadra.</div>
                </div>
              </li>
            </ul>

            <div class="home-breve-box">
              <div class="home-breve-titulo">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                Próximas atualizações
              </div>
              <ul class="home-breve-lista">
                <li class="home-breve-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Pagamento online direto na plataforma
                  <span class="home-breve-tag">Em breve</span>
                </li>
                <li class="home-breve-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Chat integrado para comunicação entre jogadores
                  <span class="home-breve-tag">Em breve</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Card Dono -->
          <div class="home-card-audiencia" id="dono">
            <div class="home-card-badge">Para o dono de quadra</div>
            <h3 class="home-card-titulo">Controle total do seu negócio</h3>
            <p class="home-card-subtitulo">Centralize agendamentos, clientes e finanças em uma única tela.</p>

            <ul class="home-features-lista">
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Gestão centralizada</div>
                  <div class="home-feature-desc">Cadastre múltiplas quadras e gerencie horários, clientes e informações em um só lugar.</div>
                </div>
              </li>
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Dashboard financeiro</div>
                  <div class="home-feature-desc">Painel completo para controle de faturamento e entradas em tempo real.</div>
                </div>
              </li>
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="23 21 23 19 21 15"/><line x1="20" y1="15" x2="20" y2="21"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">CRM de clientes</div>
                  <div class="home-feature-desc">Veja o histórico de cada cliente e identifique pendências rapidamente.</div>
                </div>
              </li>
              <li class="home-feature-item">
                <div class="home-feature-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div class="home-feature-nome">Segurança e confiabilidade</div>
                  <div class="home-feature-desc">Seus dados e os de seus clientes protegidos do início ao fim.</div>
                </div>
              </li>
            </ul>

            <div class="home-breve-box">
              <div class="home-breve-titulo">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                Próximas atualizações
              </div>
              <ul class="home-breve-lista">
                <li class="home-breve-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Gestão compartilhada com níveis de acesso para funcionários
                  <span class="home-breve-tag">Em breve</span>
                </li>
                <li class="home-breve-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Pagamento online com cobrança automática
                  <span class="home-breve-tag">Em breve</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="home-faq" id="faq">
      <div class="home-secao-inner home-secao-inner--narrow">
        <div class="home-secao-cabecalho">
          <h2 class="home-secao-titulo">
            Perguntas
            <span class="home-gradiente">frequentes</span>
          </h2>
          <p class="home-secao-subtitulo">Tudo o que você precisa saber para começar.</p>
        </div>

        <div class="home-faq-lista">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="home-faq-item"
            :class="{ 'home-faq-item--aberto': faqAberto === i }"
          >
            <button class="home-faq-pergunta" @click="faqAberto = faqAberto === i ? null : i">
              <span>{{ item.q }}</span>
              <svg class="home-faq-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="home-faq-resposta" v-show="faqAberto === i">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="home-footer-inner">
        <div class="home-footer-logo">
          <img :src="logo" alt="SportCourt" class="home-footer-logo-img" />
        </div>
        <nav class="home-footer-nav">
          <a href="#jogador" class="home-footer-link">Jogador</a>
          <a href="#dono" class="home-footer-link">Dono</a>
          <a href="#faq" class="home-footer-link">FAQ</a>
          <router-link to="/login" class="home-footer-link">Entrar</router-link>
        </nav>
      </div>
      <p class="home-footer-copy">© {{ anoAtual }} SportCourt. Reservas simplificadas.</p>
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
      scrolled: false,
      faqAberto: null,
      anoAtual: new Date().getFullYear(),
      faqs: [
        {
          q: 'Como faço para cancelar um agendamento?',
          a: "Acesse 'Meus agendamentos', escolha a reserva e clique em Cancelar. Cancelamentos seguem a política definida pelo dono da quadra — você verá os detalhes antes de confirmar."
        },
        {
          q: 'Como funciona o sistema de cobrança para os donos de quadra?',
          a: 'O SportCourt oferece um dashboard financeiro com todas as reservas e entradas. Em breve, o pagamento online será processado direto na plataforma, com repasse automático ao dono.'
        },
        {
          q: 'Posso agendar uma partida mensal recorrente?',
          a: 'Sim. Ao criar uma reserva você pode marcá-la como recorrente e o sistema reserva automaticamente o mesmo horário nas próximas semanas.'
        },
        {
          q: 'O aplicativo cobra alguma taxa extra do jogador?',
          a: 'Não. Para o jogador, usar o SportCourt é gratuito — você paga apenas o valor da quadra definido pelo dono. Sem mensalidade e sem taxa de reserva.'
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 8
    }
  }
}
</script>

<style scoped>
/* ===== BASE ===== */
.home-pagina {
  min-height: 100vh;
  background: var(--sc-bg);
  color: var(--sc-text);
  font-family: var(--sc-font);
  display: flex;
  flex-direction: column;
}

/* ===== HEADER ===== */
.home-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  transition: all 0.3s;
  background: transparent;
}

.home-header--scrolled {
  backdrop-filter: blur(20px);
  background: rgba(15, 17, 23, 0.75);
  border-bottom: 1px solid var(--sc-border);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

.home-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-logo-link {
  display: flex;
  align-items: center;
}

.home-logo-img {
  height: 48px;
  width: auto;
  transition: transform 0.2s;
}

.home-logo-img:hover {
  transform: scale(1.04);
}

.home-header-acoes {
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-btn-ghost {
  color: var(--sc-text);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  padding: 9px 16px;
  border-radius: var(--sc-radius);
  transition: background var(--sc-transition);
}

.home-btn-ghost:hover {
  background: rgba(255,255,255,0.07);
}

.home-btn-primary {
  background: var(--sc-primary);
  color: #0f1117;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  padding: 9px 20px;
  border-radius: var(--sc-radius);
  box-shadow: var(--sc-shadow-glow-sm);
  transition: all var(--sc-transition);
}

.home-btn-primary:hover {
  background: var(--sc-primary-dark);
  transform: translateY(-1px);
}

/* ===== HERO ===== */
.home-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 120px 24px 80px;
  overflow: hidden;
}

.home-hero::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.home-hero-inner {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.home-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--sc-primary-subtle);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: var(--sc-primary);
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  margin-bottom: 28px;
}

.home-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sc-primary);
  animation: badgePulse 1.5s infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.home-hero-titulo {
  font-size: clamp(36px, 7vw, 72px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--sc-text);
  margin-bottom: 24px;
}

.home-gradiente {
  background: linear-gradient(135deg, var(--sc-primary), #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-hero-descricao {
  font-size: 18px;
  color: var(--sc-text-muted);
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: 40px;
  font-weight: 400;
}

.home-hero-botoes {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

.home-btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: var(--sc-radius-lg);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all var(--sc-transition);
}

.home-btn-hero--principal {
  background: var(--sc-primary);
  color: #0f1117;
  box-shadow: var(--sc-shadow-glow);
}

.home-btn-hero--principal:hover {
  background: var(--sc-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(74, 222, 128, 0.4);
}

.home-btn-hero--secundario {
  background: var(--sc-bg-elevated);
  color: var(--sc-text);
  border: 1px solid var(--sc-border-hover);
}

.home-btn-hero--secundario:hover {
  background: var(--sc-bg-card);
  border-color: rgba(74,222,128,0.4);
  transform: translateY(-2px);
}

/* ===== SEÇÃO COMUM ===== */
.home-beneficios,
.home-faq {
  padding: 80px 24px;
}

.home-secao-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.home-secao-inner--narrow {
  max-width: 740px;
}

.home-secao-cabecalho {
  text-align: center;
  margin-bottom: 56px;
}

.home-secao-titulo {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--sc-text);
  margin-bottom: 12px;
}

.home-secao-subtitulo {
  font-size: 16px;
  color: var(--sc-text-muted);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== CARDS AUDIÊNCIA ===== */
.home-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 900px) {
  .home-cards-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.home-card-audiencia {
  background: var(--sc-bg-card);
  border: 1px solid var(--sc-border);
  border-radius: var(--sc-radius-2xl);
  padding: 32px;
  transition: all var(--sc-transition);
  scroll-margin-top: 80px;
}

.home-card-audiencia:hover {
  border-color: rgba(74,222,128,0.35);
  box-shadow: var(--sc-shadow-glow);
}

.home-card-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--sc-primary-subtle);
  color: var(--sc-primary);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.home-card-titulo {
  font-size: 24px;
  font-weight: 900;
  color: var(--sc-text);
  margin-bottom: 8px;
}

.home-card-subtitulo {
  font-size: 14px;
  color: var(--sc-text-muted);
  margin-bottom: 28px;
  line-height: 1.5;
}

.home-features-lista {
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home-feature-item {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  align-items: start;
}

.home-feature-icone {
  width: 44px;
  height: 44px;
  border-radius: var(--sc-radius-lg);
  background: var(--sc-primary-subtle);
  color: var(--sc-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-feature-nome {
  font-weight: 700;
  font-size: 14px;
  color: var(--sc-text);
  margin-bottom: 3px;
}

.home-feature-desc {
  font-size: 13px;
  color: var(--sc-text-muted);
  line-height: 1.5;
}

/* ===== EM BREVE BOX ===== */
.home-breve-box {
  border: 1px dashed rgba(74,222,128,0.3);
  background: var(--sc-primary-subtle);
  border-radius: var(--sc-radius-lg);
  padding: 18px;
}

.home-breve-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sc-primary);
  margin-bottom: 14px;
}

.home-breve-lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.home-breve-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--sc-text-muted);
}

.home-breve-item svg {
  flex-shrink: 0;
  color: var(--sc-text-faint);
}

.home-breve-tag {
  margin-left: auto;
  background: var(--sc-primary-subtle);
  color: var(--sc-primary);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid rgba(74,222,128,0.3);
  white-space: nowrap;
}

/* ===== FAQ ===== */
.home-faq {
  border-top: 1px solid var(--sc-border);
}

.home-faq-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.home-faq-item {
  background: var(--sc-bg-card);
  border: 1px solid var(--sc-border);
  border-radius: var(--sc-radius-lg);
  overflow: hidden;
  transition: border-color var(--sc-transition);
}

.home-faq-item--aberto,
.home-faq-item:hover {
  border-color: rgba(74,222,128,0.35);
}

.home-faq-pergunta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: var(--sc-text);
  text-align: left;
  font-family: var(--sc-font);
}

.home-faq-seta {
  flex-shrink: 0;
  color: var(--sc-text-muted);
  transition: transform 0.25s;
}

.home-faq-item--aberto .home-faq-seta {
  transform: rotate(180deg);
}

.home-faq-resposta {
  padding: 0 20px 18px;
  font-size: 14px;
  color: var(--sc-text-muted);
  line-height: 1.65;
}

/* ===== FOOTER ===== */
.home-footer {
  border-top: 1px solid var(--sc-border);
  background: var(--sc-bg-card);
  padding: 36px 24px 28px;
}

.home-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.home-footer-logo-img {
  height: 40px;
  width: auto;
}

.home-footer-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.home-footer-link {
  font-size: 13px;
  color: var(--sc-text-muted);
  text-decoration: none;
  transition: color var(--sc-transition);
}

.home-footer-link:hover {
  color: var(--sc-primary);
}

.home-footer-copy {
  max-width: 1200px;
  margin: 0 auto;
  font-size: 12px;
  color: var(--sc-text-faint);
  text-align: center;
}
</style>
