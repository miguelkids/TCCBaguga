<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">{{ nomeQuadra || 'Minha Quadra' }}</h1>
          <p class="sc-muted">Painel de gerenciamento e informações da quadra</p>
        </div>
        <button class="sc-btn sc-btn-secondary" @click="$router.push('/minhas-quadras')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Voltar para Quadras
        </button>
      </div>

      <div class="sc-grid-2" style="gap: 24px;">
        <!-- Coluna da Esquerda: Card Detalhes da Quadra -->
        <div class="sc-card" style="overflow: hidden; display: flex; flex-direction: column;">
          <div style="height: 240px; position: relative; background: var(--sc-bg-elevated);">
            <img v-if="fotoPerfilUrl" :src="fotoPerfilUrl" alt="Foto da quadra" style="width: 100%; height: 100%; object-fit: cover;" />
            <div v-else class="sc-flex" style="width: 100%; height: 100%; justify-content: center; color: var(--sc-text-muted);">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span class="sc-badge sc-badge-green" style="position: absolute; top: 12px; right: 12px;">
              {{ esporte || 'Futebol' }}
            </span>
          </div>

          <div style="padding: 24px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div class="sc-flex sc-gap-2" style="align-items: center; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-primary); flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ cidade }} — {{ endereco }}</span>
              </div>

              <div class="sc-flex sc-gap-2" style="align-items: center; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-primary); flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{{ telefone || 'Sem telefone cadastrado' }}</span>
              </div>

              <div class="sc-flex sc-gap-2" style="align-items: center; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-primary); flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ horario || 'Horário flexível' }}</span>
              </div>

              <div style="margin-top: 8px; padding-top: 16px; border-top: 1px solid var(--sc-border);" class="sc-flex-between">
                <span class="sc-muted">Valor por hora</span>
                <span style="font-size: 22px; font-weight: 900; color: var(--sc-primary);">R$ {{ preco }}</span>
              </div>

              <p v-if="descricao" class="sc-muted" style="font-size: 13px; margin-top: 8px; line-height: 1.5;">
                {{ descricao }}
              </p>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Ações Rápidas & Avaliações -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Ações -->
          <div class="sc-card" style="padding: 24px;">
            <h2 class="sc-h3" style="margin-bottom: 16px;">Ações da Arena</h2>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button class="sc-btn sc-btn-primary" style="width: 100%; justify-content: center; padding: 14px;" @click="$router.push('/editar-quadra')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar Informações da Quadra
              </button>

              <button class="sc-btn sc-btn-secondary" style="width: 100%; justify-content: center; padding: 14px;" @click="$router.push('/editar-data-horario')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Gerenciar Horários e Bloqueios
              </button>
            </div>
          </div>

          <!-- Avaliações dos Clientes -->
          <div class="sc-card" style="padding: 24px;">
            <h2 class="sc-h3" style="margin-bottom: 12px;">Avaliações dos Clientes</h2>
            <p class="sc-muted" style="font-size: 13px; margin-bottom: 16px;">Média das notas deixadas por atletas pós-partida</p>

            <div class="sc-flex sc-gap-3" style="align-items: center; background: var(--sc-bg-elevated); padding: 16px; border-radius: var(--sc-radius); border: 1px solid var(--sc-border);">
              <div class="sc-flex" style="gap: 4px;">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  :fill="i <= Math.round(mediaEstrelas) ? 'var(--sc-amber)' : 'none'"
                  :stroke="i <= Math.round(mediaEstrelas) ? 'var(--sc-amber)' : 'var(--sc-text-faint)'"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div>
                <div style="font-weight: 900; font-size: 18px; color: var(--sc-amber);">{{ mediaEstrelas.toFixed(1) }}</div>
                <div class="sc-muted" style="font-size: 12px;">({{ totalAvaliacoes }} avaliações)</div>
              </div>
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
  name: "ConfirmarQuadra",
  components: { TopbarDono },
  data() {
    return {
      quadraId: localStorage.getItem("quadraId") || "",
      nomeQuadra: "",
      cidade: "",
      endereco: "",
      telefone: "",
      preco: "0.00",
      horario: "",
      esporte: "",
      descricao: "",
      fotoPerfilUrl: null,
      mediaEstrelas: 5.0,
      totalAvaliacoes: 12
    };
  },
  async created() {
    await this.carregarQuadra();
  },
  methods: {
    async carregarQuadra() {
      if (!this.quadraId) return;
      try {
        const q = await api.getQuadra(this.quadraId);
        this.nomeQuadra = q.nome_quadra || q.nomeQuadra || "";
        this.cidade = q.cidade || "";
        this.endereco = q.endereco || "";
        this.telefone = q.telefone || "";
        this.preco = q.preco ? Number(q.preco).toFixed(2) : "0.00";
        this.horario = q.horario || "";
        this.esporte = q.esporte || "";
        this.descricao = q.descricao || "";
        if (q.foto_url || q.fotoUrl) {
          const url = q.foto_url || q.fotoUrl;
          this.fotoPerfilUrl = url.startsWith("http") ? url : `http://localhost:3006${url}`;
        }
      } catch (err) {
        console.error("Erro ao carregar quadra:", err);
      }
    }
  }
};
</script>
