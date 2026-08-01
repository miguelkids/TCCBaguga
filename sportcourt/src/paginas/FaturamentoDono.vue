<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">Dashboard & Analytics</h1>
          <p class="sc-muted">Visão geral do faturamento e ocupação da sua arena</p>
        </div>
        <div class="sc-flex sc-gap-2">
          <input type="month" class="sc-input" v-model="mesSelecionado" @change="carregarDashboard" style="width: auto;" />
        </div>
      </div>

      <!-- KPIs -->
      <div class="sc-grid-4" style="margin-bottom: 24px;">
        <div class="sc-kpi">
          <div class="sc-kpi-label">Faturamento Recebido</div>
          <div class="sc-kpi-value green">R$ {{ (kpis.faturamento || 0).toFixed(2) }}</div>
          <div class="sc-kpi-hint">Partidas encerradas</div>
        </div>

        <div class="sc-kpi">
          <div class="sc-kpi-label">A Receber / Pendente</div>
          <div class="sc-kpi-value amber">R$ {{ (kpis.aReceber || 0).toFixed(2) }}</div>
          <div class="sc-kpi-hint">Horários a realizar</div>
        </div>

        <div class="sc-kpi">
          <div class="sc-kpi-label">Horários Agendados</div>
          <div class="sc-kpi-value">{{ kpis.horasMarcadas || 0 }}</div>
          <div class="sc-kpi-hint">{{ kpis.confirmadas || 0 }} confirmados</div>
        </div>

        <div class="sc-kpi">
          <div class="sc-kpi-label">Total de Clientes</div>
          <div class="sc-kpi-value">{{ kpis.totalClientes || 0 }}</div>
          <div class="sc-kpi-hint">Atletas únicos</div>
        </div>
      </div>

      <!-- Gráfico em Barras Simples (CSS) -->
      <div class="sc-card" style="padding: 24px; margin-bottom: 24px;">
        <div class="sc-flex-between" style="margin-bottom: 16px;">
          <h2 class="sc-h3">Faturamento Diário no Mês</h2>
          <span class="sc-badge sc-badge-green">Mês {{ mesSelecionado }}</span>
        </div>

        <div v-if="serieDiaria.length === 0" class="sc-empty" style="padding: 32px;">
          Nenhum faturamento registrado neste mês.
        </div>
        <div v-else style="display: flex; align-items: flex-end; height: 180px; gap: 4px; padding-top: 20px;">
          <div
            v-for="d in serieDiaria"
            :key="d.dia"
            style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;"
            :title="`Dia ${d.dia}: R$ ${d.valor.toFixed(2)}`"
          >
            <div
              style="width: 100%; border-radius: 4px 4px 0 0; transition: height 0.3s;"
              :style="{
                height: maxValor ? `${Math.max(4, (d.valor / maxValor) * 100)}%` : '4px',
                background: d.valor > 0 ? 'var(--sc-primary)' : 'var(--sc-border)'
              }"
            ></div>
            <span style="font-size: 9px; color: var(--sc-text-muted); margin-top: 4px;">{{ d.dia }}</span>
          </div>
        </div>
      </div>

      <!-- Horários Mais Movimentados -->
      <div class="sc-card" style="padding: 24px;">
        <h2 class="sc-h3" style="margin-bottom: 16px;">Horários Mais Populares</h2>
        <div v-if="horariosPopulares.length === 0" class="sc-muted">Sem dados suficientes neste mês.</div>
        <div v-else style="display: flex; flex-direction: column; gap: 12px;">
          <div v-for="h in horariosPopulares" :key="h.horario" class="sc-flex-between">
            <span style="font-weight: 700;">⏰ {{ h.horario }}</span>
            <span class="sc-badge sc-badge-neutral">{{ h.count }} reserva(s)</span>
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
  name: "FaturamentoDono",
  components: { TopbarDono },
  data() {
    return {
      mesSelecionado: new Date().toISOString().slice(0, 7),
      kpis: {},
      serieDiaria: [],
      horariosPopulares: []
    };
  },
  computed: {
    maxValor() {
      if (this.serieDiaria.length === 0) return 1;
      return Math.max(...this.serieDiaria.map(d => d.valor), 1);
    }
  },
  async created() {
    await this.carregarDashboard();
  },
  methods: {
    async carregarDashboard() {
      try {
        this.kpis = await api.getDashboardKpis(this.mesSelecionado);
        this.serieDiaria = await api.getDashboardSerieDiaria(this.mesSelecionado);
        this.horariosPopulares = await api.getDashboardHorariosPopulares(this.mesSelecionado);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
