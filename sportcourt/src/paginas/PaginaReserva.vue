<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container sc-main sc-main-padded">
      <div style="margin-bottom: 24px;">
        <h1 class="sc-h2">Encontre uma Quadra</h1>
        <p class="sc-muted">Pesquise por cidade ou nome da arena e agende seu horário</p>

        <div class="sc-card" style="padding: 16px; margin-top: 16px;">
          <div class="sc-input-icon-wrap">
            <svg class="sc-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              class="sc-input"
              v-model="busca"
              @input="buscarQuadras"
              placeholder="Digite a cidade (ex: São Paulo)..."
            />
          </div>
        </div>
      </div>

      <!-- Estado inicial/Sem busca -->
      <div v-if="!busca" class="sc-empty">
        <div class="sc-empty-icon">📍</div>
        <h2 class="sc-h3">Onde você quer jogar hoje?</h2>
        <p>Digite a sua cidade no campo acima para listar as quadras disponíveis.</p>
      </div>

      <!-- Sem resultados -->
      <div v-else-if="espacos.length === 0" class="sc-empty">
        <div class="sc-empty-icon">🔍</div>
        <h2 class="sc-h3">Nenhuma quadra encontrada</h2>
        <p>Não encontramos resultados para "{{ busca }}". Tente buscar por outra cidade.</p>
      </div>

      <!-- Grade de Quadras -->
      <div v-else class="sc-grid-3">
        <div v-for="espaco in espacos" :key="espaco.chave" class="sc-card" style="overflow: hidden; display: flex; flex-direction: column;">
          <!-- Banner -->
          <div style="height: 160px; position: relative; background: var(--sc-bg-elevated);">
            <img v-if="espaco.fotoPerfil" :src="fotoSrc(espaco.fotoPerfil)" :alt="espaco.nomeQuadra" style="width: 100%; height: 100%; object-fit: cover;" />
            <div v-else class="sc-flex" style="width: 100%; height: 100%; justify-content: center; font-size: 40px; opacity: 0.3;">
              🏟️
            </div>
            <div v-if="espaco.mediaAvaliacao" class="sc-badge sc-badge-amber" style="position: absolute; top: 12px; right: 12px;">
              ★ {{ espaco.mediaAvaliacao }}
            </div>
          </div>

          <!-- Conteúdo -->
          <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 4px;">{{ espaco.nomeQuadra }}</h3>
              <p class="sc-muted" style="font-size: 13px; margin-bottom: 12px;">
                📍 {{ espaco.endereco }}, {{ espaco.cidade }}
              </p>

              <div class="sc-flex-between" style="margin-bottom: 16px;">
                <span class="sc-badge sc-badge-green">{{ espaco.quadras[0]?.esporte || 'Futebol' }}</span>
                <span style="font-weight: 800; color: var(--sc-primary); font-size: 16px;">
                  R$ {{ espaco.quadras[0]?.preco }}/h
                </span>
              </div>
            </div>

            <button class="sc-btn sc-btn-primary sc-btn-lg" @click="reservarEspaco(espaco)">
              Ver Horários e Reservar →
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "PaginaReserva",
  components: { TopbarJogador },
  data() {
    return {
      busca: "",
      todasQuadras: [],
      espacos: []
    };
  },
  async created() {
    try {
      this.todasQuadras = await api.getQuadras();
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    buscarQuadras() {
      if (!this.busca.trim()) {
        this.espacos = [];
        return;
      }
      const b = this.busca.toLowerCase();
      const filtradas = this.todasQuadras.filter(q =>
        q.cidade.toLowerCase().includes(b) || q.nomeQuadra.toLowerCase().includes(b)
      );

      // Agrupa quadras por endereço/cidade
      const mapa = {};
      filtradas.forEach(q => {
        const chave = `${q.nomeQuadra}_${q.cidade}`;
        if (!mapa[chave]) {
          mapa[chave] = {
            chave,
            nomeQuadra: q.nomeQuadra,
            endereco: q.endereco,
            cidade: q.cidade,
            telefone: q.telefone,
            fotoPerfil: q.fotoUrl,
            mediaAvaliacao: q.mediaAvaliacao,
            quadras: []
          };
        }
        mapa[chave].quadras.push(q);
      });

      this.espacos = Object.values(mapa);
    },
    fotoSrc(url) {
      if (!url) return '';
      return url.startsWith('http') ? url : `http://localhost:3006${url}`;
    },
    reservarEspaco(espaco) {
      const quadra = espaco.quadras[0];
      localStorage.setItem("quadraSelecionada", JSON.stringify(quadra));
      this.$router.push("/finalizar-reserva");
    }
  }
};
</script>
