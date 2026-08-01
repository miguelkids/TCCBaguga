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
      <div v-else-if="quadras.length === 0" class="sc-empty">
        <div class="sc-empty-icon">🏟️</div>
        <h2 class="sc-h3">Nenhuma quadra cadastrada</h2>
        <p>Cadastre o seu espaço para começar a receber agendamentos online.</p>
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
            <div v-else class="sc-flex" style="width: 100%; height: 100%; justify-content: center; font-size: 48px; opacity: 0.3;">
              🏟️
            </div>
            <span v-if="q.id === quadraAtiva" class="sc-badge sc-badge-green" style="position: absolute; top: 12px; right: 12px;">
              Ativa no Painel
            </span>
          </div>

          <!-- Informações e Ações -->
          <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">{{ q.nomeQuadra }}</h2>
              <p class="sc-muted" style="font-size: 13px; margin-bottom: 12px;">📍 {{ q.cidade || q.endereco }}</p>

              <div class="sc-flex-between" style="margin-bottom: 16px;">
                <span class="sc-badge sc-badge-neutral">{{ q.esporte || 'Futebol' }}</span>
                <span style="font-weight: 800; color: var(--sc-primary); font-size: 18px;">R$ {{ q.preco }}/h</span>
              </div>
            </div>

            <div class="sc-grid-2" style="gap: 8px;">
              <button class="sc-btn sc-btn-primary" @click="selecionarQuadra(q)">
                Gerenciar Arena
              </button>
              <button class="sc-btn sc-btn-secondary" @click="$router.push('/editar-horarios')">
                🔒 Novo Bloqueio
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
    }
  }
};
</script>
