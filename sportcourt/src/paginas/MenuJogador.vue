<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container sc-main sc-main-padded">
      <div style="margin-bottom: 28px;">
        <h1 class="sc-h2">Olá, {{ nomeUsuario || 'Jogador' }}</h1>
        <p class="sc-muted">O que você quer fazer hoje?</p>
      </div>

      <!-- Cards de ação rápida -->
      <div class="menu-grid">
        <button class="menu-card" @click="$router.push('/reserva')">
          <div class="menu-card-icon" style="background: rgba(74,222,128,0.12); color: #4ade80;">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="menu-card-text">
            <span class="menu-card-titulo">Reservar Quadra</span>
            <span class="menu-card-sub">Encontre e agende uma quadra</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); flex-shrink: 0;"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <button class="menu-card" @click="$router.push('/minhas-reservas')">
          <div class="menu-card-icon" style="background: rgba(96,165,250,0.12); color: #60a5fa;">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div class="menu-card-text">
            <span class="menu-card-titulo">Minhas Reservas</span>
            <span class="menu-card-sub">Acompanhe seus agendamentos</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); flex-shrink: 0;"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <button class="menu-card" @click="$router.push('/conta-jogador')">
          <div class="menu-card-icon" style="background: rgba(167,139,250,0.12); color: #a78bfa;">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="menu-card-text">
            <span class="menu-card-titulo">Meu Perfil</span>
            <span class="menu-card-sub">Edite seus dados pessoais</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); flex-shrink: 0;"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <!-- Reservas Recentes (preview das pendentes) -->
      <div style="margin-top: 32px;">
        <div class="sc-flex-between" style="margin-bottom: 16px;">
          <h2 class="sc-h3" style="font-size: 15px;">Reservas Pendentes</h2>
          <button class="sc-btn sc-btn-sm" style="font-size: 12px; padding: 6px 12px;" @click="$router.push('/minhas-reservas')">
            Ver todas
          </button>
        </div>

        <div v-if="carregando" class="sc-empty" style="padding: 24px;">Carregando...</div>
        <div v-else-if="reservasPendentes.length === 0" class="sc-empty" style="padding: 24px;">
          <p class="sc-muted" style="font-size: 13px;">Nenhuma reserva pendente. Que tal reservar uma quadra?</p>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 10px;">
          <div v-for="r in reservasPendentes.slice(0, 3)" :key="r.id" class="reserva-preview sc-card">
            <div class="reserva-preview-inner">
              <div class="quadra-thumb-sm">
                <img v-if="r.fotoPreview" :src="fotoSrc(r.fotoPreview)" :alt="r.quadraNome" />
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted);"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <div style="flex: 1; min-width: 0;">
                <p style="font-size: 14px; font-weight: 700; margin: 0 0 3px; color: var(--sc-text);">{{ r.quadraNome }}</p>
                <p style="font-size: 12px; color: var(--sc-text-muted); margin: 0;">{{ formatarData(r.data) }} às {{ r.horario }}</p>
              </div>
              <span class="sc-badge" style="background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); font-size: 10px; white-space: nowrap;">
                Aguardando
              </span>
            </div>
          </div>
          <button v-if="reservasPendentes.length > 3" class="sc-btn sc-btn-sm" style="width: 100%;" @click="$router.push('/minhas-reservas')">
            Ver mais {{ reservasPendentes.length - 3 }} reservas
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "MenuJogador",
  components: { TopbarJogador },
  data() {
    return {
      reservas: [],
      carregando: true,
      nomeUsuario: ""
    };
  },
  computed: {
    reservasPendentes() {
      return this.reservas.filter(r => !r.confirmada);
    }
  },
  async created() {
    await this.carregar();
  },
  methods: {
    fotoSrc(url) {
      if (!url) return "";
      return url.startsWith("http") ? url : `http://localhost:3006${url}`;
    },
    formatarData(d) {
      if (!d) return "";
      const date = new Date(d + 'T12:00:00');
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    },
    async carregar() {
      try {
        this.carregando = true;
        const [me, reservas] = await Promise.all([
          api.getMe(),
          api.getReservas()
        ]);
        this.nomeUsuario = me.nome || me.nome_usuario || "";
        this.reservas = reservas;
      } catch (e) {
        console.error("Erro ao carregar menu jogador:", e);
        try { this.reservas = await api.getReservas(); } catch (err) { console.error(err); }
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>

<style scoped>
.menu-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: var(--sc-bg-card);
  border: 1px solid var(--sc-border);
  border-radius: var(--sc-radius);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}
.menu-card:hover {
  border-color: var(--sc-primary);
  background: var(--sc-bg-elevated);
  transform: translateY(-1px);
}

.menu-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.menu-card-titulo {
  font-size: 15px;
  font-weight: 700;
  color: var(--sc-text);
}
.menu-card-sub {
  font-size: 12px;
  color: var(--sc-text-muted);
}

.reserva-preview {
  padding: 14px 16px;
}
.reserva-preview-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}
.quadra-thumb-sm {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quadra-thumb-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
