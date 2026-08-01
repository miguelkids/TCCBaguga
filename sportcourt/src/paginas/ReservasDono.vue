<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">CRM de Reservas</h1>
          <p class="sc-muted">Gerencie, confirme e encerre os agendamentos das suas quadras</p>
        </div>
      </div>

      <!-- Abas de Navegação -->
      <div class="sc-tabs" style="margin-bottom: 24px;">
        <button
          class="sc-tab"
          :class="{ active: abaAtiva === 'pendentes' }"
          @click="abaAtiva = 'pendentes'"
        >
          Pendentes ({{ reservasPendentes.length }})
        </button>
        <button
          class="sc-tab"
          :class="{ active: abaAtiva === 'confirmadas' }"
          @click="abaAtiva = 'confirmadas'"
        >
          Confirmadas ({{ reservasConfirmadas.length }})
        </button>
        <button
          class="sc-tab"
          :class="{ active: abaAtiva === 'encerradas' }"
          @click="abaAtiva = 'encerradas'"
        >
          Encerradas ({{ reservasEncerradas.length }})
        </button>
      </div>

      <div v-if="carregando" class="sc-empty">Carregando reservas...</div>
      <div v-else-if="listaExibicao.length === 0" class="sc-empty" style="padding: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); margin-bottom: 12px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p class="sc-muted">Nenhuma reserva nesta aba.</p>
      </div>
      <div v-else style="display: flex; flex-direction: column; gap: 16px;">
        <div
          v-for="r in listaExibicao"
          :key="r.id"
          class="sc-card"
          style="padding: 20px;"
        >
          <div class="sc-flex-between sc-gap-4" style="flex-wrap: wrap; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 800; margin: 0;">
                {{ r.nome_jogador || r.nomeJogador || 'Jogador' }}
              </h3>
              <p class="sc-muted" style="font-size: 13px; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {{ r.telefone_jogador || r.telefoneJogador || 'Sem telefone' }} • {{ r.quadraNome || 'Quadra' }}
              </p>
            </div>

            <div class="sc-flex sc-gap-2">
              <span class="sc-badge sc-badge-green" style="display: flex; align-items: center; gap: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ formatarData(r.data_reserva || r.dataReserva) }} às {{ r.horario_reserva || r.horarioReserva }}
              </span>
              <span class="sc-badge sc-badge-neutral">R$ {{ r.preco_total || r.preco || '0.00' }}</span>
            </div>
          </div>

          <!-- Ações do Dono -->
          <div class="sc-flex sc-gap-2" style="justify-content: flex-end; border-top: 1px solid var(--sc-border); padding-top: 12px; margin-top: 12px;">
            <template v-if="abaAtiva === 'pendentes'">
              <button class="sc-btn sc-btn-danger sc-btn-sm" @click="cancelar(r.id)">Recusar</button>
              <button class="sc-btn sc-btn-primary sc-btn-sm" @click="confirmar(r.id)">Confirmar Agendamento</button>
            </template>

            <template v-if="abaAtiva === 'confirmadas'">
              <button class="sc-btn sc-btn-danger sc-btn-sm" @click="cancelar(r.id)">Cancelar</button>
              <button class="sc-btn sc-btn-primary sc-btn-sm" @click="concluir(r.id)">Encerrar e Marcar Pago</button>
            </template>

            <template v-if="abaAtiva === 'encerradas'">
              <span class="sc-badge sc-badge-green" style="display: flex; align-items: center; gap: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Concluído
              </span>
            </template>
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
  name: "ReservasDono",
  components: { TopbarDono },
  data() {
    return {
      reservas: [],
      abaAtiva: "pendentes",
      carregando: true
    };
  },
  computed: {
    reservasPendentes() {
      return this.reservas.filter(r => !r.confirmada && r.status !== 'encerrada' && r.status !== 'cancelada');
    },
    reservasConfirmadas() {
      return this.reservas.filter(r => r.confirmada && r.status !== 'encerrada');
    },
    reservasEncerradas() {
      return this.reservas.filter(r => r.status === 'encerrada');
    },
    listaExibicao() {
      if (this.abaAtiva === 'pendentes') return this.reservasPendentes;
      if (this.abaAtiva === 'confirmadas') return this.reservasConfirmadas;
      if (this.abaAtiva === 'encerradas') return this.reservasEncerradas;
      return [];
    }
  },
  async created() {
    await this.carregarReservas();
  },
  methods: {
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
    async confirmar(id) {
      try {
        await api.confirmarReserva(id);
        await this.carregarReservas();
      } catch (e) {
        alert(e.message || "Erro ao confirmar.");
      }
    },
    async concluir(id) {
      try {
        await api.concluirReserva(id);
        await this.carregarReservas();
      } catch (e) {
        alert(e.message || "Erro ao encerrar.");
      }
    },
    async cancelar(id) {
      if (confirm("Deseja cancelar esta reserva?")) {
        try {
          await api.cancelarReserva(id);
          await this.carregarReservas();
        } catch (e) {
          alert(e.message || "Erro ao cancelar.");
        }
      }
    }
  }
};
</script>
