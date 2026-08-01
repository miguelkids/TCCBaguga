<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">Minhas Reservas</h1>
          <p class="sc-muted">Acompanhe suas partidas e avalie as quadras que você jogou</p>
        </div>
        <button class="sc-btn sc-btn-primary" @click="$router.push('/reserva')">
          + Reservar Nova Quadra
        </button>
      </div>

      <div v-if="carregando" class="sc-empty">Carregando suas reservas...</div>
      <div v-else-if="reservas.length === 0" class="sc-empty">
        <div class="sc-empty-icon">📅</div>
        <h2 class="sc-h3">Nenhuma reserva agendada</h2>
        <p>Você ainda não realizou nenhum agendamento. Encontre uma quadra disponível!</p>
        <button class="sc-btn sc-btn-primary" style="margin-top: 16px;" @click="$router.push('/reserva')">
          Buscar Quadra
        </button>
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 16px;">
        <div
          v-for="r in reservas"
          :key="r.id"
          class="sc-card"
          style="padding: 20px;"
        >
          <div class="sc-flex-between sc-gap-4" style="flex-wrap: wrap; margin-bottom: 12px;">
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 48px; height: 48px; border-radius: var(--sc-radius);">
                <img v-if="r.fotoUrl" :src="fotoSrc(r.fotoUrl)" :alt="r.quadraNome" />
                <span v-else>⚽</span>
              </div>
              <div>
                <h3 style="font-weight: 800; font-size: 16px; margin: 0;">
                  {{ r.tipoJogo === 'contra_time' && r.nomeTimeB ? `${r.nomeTime} ⚔️ ${r.nomeTimeB}` : (r.quadraNome || 'Reserva de Quadra') }}
                </h3>
                <p class="sc-muted" style="font-size: 13px; margin-top: 2px;">
                  📅 {{ formatarData(r.data_reserva) }} às {{ r.horario_reserva }}
                </p>
              </div>
            </div>

            <div class="sc-flex sc-gap-2">
              <span class="sc-badge" :class="r.confirmada ? 'sc-badge-green' : 'sc-badge-amber'">
                {{ r.confirmada ? 'Confirmada' : 'Pendente' }}
              </span>
            </div>
          </div>

          <!-- Avaliação rápida -->
          <div v-if="r.confirmada" class="sc-card-elevated sc-flex-between" style="padding: 12px 16px; margin-top: 12px;">
            <span style="font-size: 13px; font-weight: 600;">Avalie esta quadra:</span>
            <div class="sc-stars">
              <span
                v-for="star in 5"
                :key="star"
                class="sc-star"
                :class="{ filled: star <= (r.minhaNota || 0) }"
                @click="avaliar(r, star)"
              >★</span>
            </div>
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
  name: "MenuJogador",
  components: { TopbarJogador },
  data() {
    return {
      reservas: [],
      carregando: true
    };
  },
  async created() {
    await this.carregarReservas();
  },
  methods: {
    fotoSrc(url) {
      if (!url) return "";
      return url.startsWith("http") ? url : `http://localhost:3006${url}`;
    },
    formatarData(d) {
      if (!d) return "";
      const date = new Date(d);
      return date.toLocaleDateString("pt-BR");
    },
    async carregarReservas() {
      try {
        this.carregando = true;
        this.reservas = await api.getReservas();
      } catch (e) {
        console.error(e);
      } finally {
        this.carregando = false;
      }
    },
    async avaliar(reserva, estrelas) {
      try {
        await api.avaliarQuadra(reserva.quadra_id, estrelas);
        reserva.minhaNota = estrelas;
        alert("Avaliação registrada com sucesso!");
      } catch (e) {
        alert(e.message || "Erro ao avaliar.");
      }
    }
  }
};
</script>
