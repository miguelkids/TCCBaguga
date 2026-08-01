<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">Minhas Arenas e Quadras</h1>
          <p class="sc-muted">Gerencie suas quadras, bloqueios de horários e dados cadastrais</p>
        </div>
        <button class="sc-btn sc-btn-primary" @click="$router.push('/cadastro-quadra-parte1')">
          + Cadastrar Nova Quadra
        </button>
      </div>

      <div v-if="loading" class="sc-empty">Carregando quadras...</div>
      <div v-else-if="quadras.length === 0" class="sc-empty" style="padding: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); margin-bottom: 12px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <h2 class="sc-h3">Nenhuma quadra cadastrada</h2>
        <p class="sc-muted">Cadastre o seu espaço para começar a receber agendamentos online.</p>
        <button class="sc-btn sc-btn-primary" style="margin-top: 16px;" @click="$router.push('/cadastro-quadra-parte1')">
          Cadastrar Primeira Quadra
        </button>
      </div>

      <div v-else class="sc-grid-2">
        <div
          v-for="q in quadras"
          :key="q.id"
          class="sc-card"
          style="overflow: hidden; display: flex; flex-direction: column;"
          :style="q.id === quadraAtiva ? 'border-color: var(--sc-primary); box-shadow: var(--sc-shadow-glow);' : ''"
        >
          <!-- Foto da Quadra -->
          <div style="height: 180px; position: relative; background: var(--sc-bg-elevated);">
            <img v-if="q.fotoUrl" :src="fotoUrl(q)" :alt="q.nomeQuadra" style="width: 100%; height: 100%; object-fit: cover;" />
            <div v-else class="sc-flex" style="width: 100%; height: 100%; justify-content: center; color: var(--sc-text-muted);">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span v-if="q.id === quadraAtiva" class="sc-badge sc-badge-green" style="position: absolute; top: 12px; right: 12px;">
              Ativa no Painel
            </span>
          </div>

          <!-- Informações e Ações -->
          <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">{{ q.nomeQuadra }}</h2>
              <p class="sc-muted" style="font-size: 13px; margin-bottom: 12px; display: flex; align-items: center; gap: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ q.cidade || q.endereco }}
              </p>

              <div class="sc-flex-between" style="margin-bottom: 16px;">
                <span class="sc-badge sc-badge-neutral">{{ q.esporte || 'Futebol' }}</span>
                <span style="font-weight: 800; color: var(--sc-primary); font-size: 18px;">R$ {{ q.preco }}/h</span>
              </div>
            </div>

            <div class="sc-grid-2" style="gap: 8px;">
              <button class="sc-btn sc-btn-primary" @click="gerenciarArena(q)">
                Gerenciar Arena
              </button>
              <button class="sc-btn sc-btn-secondary" @click="irParaBloqueios(q)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Novo Bloqueio
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "MinhasQuadras",
  components: { TopbarDono },
  data() {
    return {
      quadras: [],
      quadraAtiva: localStorage.getItem("quadraId") || null,
      loading: true
    };
  },
  async created() {
    await this.carregarQuadras();
  },
  methods: {
    async carregarQuadras() {
      try {
        this.loading = true;
        this.quadras = await api.getMinhasQuadras();
        if (this.quadras.length > 0 && !this.quadraAtiva) {
          this.selecionarQuadra(this.quadras[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    fotoUrl(q) {
      if (!q.fotoUrl) return "";
      return q.fotoUrl.startsWith("http") ? q.fotoUrl : `http://localhost:3006${q.fotoUrl}`;
    },
    selecionarQuadra(q) {
      this.quadraAtiva = q.id;
      localStorage.setItem("quadraId", q.id);
      localStorage.setItem("quadraInfo", JSON.stringify(q));
    },
    gerenciarArena(q) {
      this.selecionarQuadra(q);
      this.$router.push("/confirmar-quadra");
    },
    irParaBloqueios(q) {
      this.selecionarQuadra(q);
      this.$router.push("/editar-data-horario");
    }
  }
};
</script>
