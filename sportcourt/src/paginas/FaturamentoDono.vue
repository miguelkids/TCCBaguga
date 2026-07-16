<template>
  <div class="pagina">
    <TopbarDono />
    <div class="container">

      <!-- Cabeçalho -->
      <div class="cabecalho-secao">
        <div class="titulos">
          <h1 class="titulo-pagina">Dashboard</h1>
          <p class="subtitulo-pagina">Resumo financeiro da sua operação.</p>
        </div>

        <!-- Filtros -->
        <div class="filtros-wrapper">
          <div class="select-wrapper">
            <select v-model="periodo" @change="atualizar" class="select-campo">
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
            </select>
            <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <div v-if="periodo === 'mes'" class="select-wrapper">
            <select v-model="mesSelecionado" @change="atualizar" class="select-campo">
              <option v-for="(nome, idx) in nomesMeses" :key="idx" :value="idx">{{ nome }}</option>
            </select>
            <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <div class="select-wrapper">
            <select v-model="moeda" @change="converter" class="select-campo">
              <option value="BRL">R$ Real</option>
              <option value="USD">US$ Dólar</option>
              <option value="EUR">€ Euro</option>
            </select>
            <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-icone stat-icone--verde">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-label">Faturamento</div>
          <div class="stat-valor">{{ simbolo }}{{ Number(valorConvertido).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-icone stat-icone--azul">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          </div>
          <div class="stat-label">Horários Agendados</div>
          <div class="stat-valor">{{ totalHorarios }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-icone stat-icone--laranja">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div class="stat-label">Variação anterior</div>
          <div class="stat-valor" :class="variacao >= 0 ? 'text-subida' : 'text-descida'">
            {{ variacao >= 0 ? '+' : '' }}{{ Number(variacao).toFixed(1) }}%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icone stat-icone--verde">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div class="stat-label">Ticket Médio</div>
          <div class="stat-valor">{{ simbolo }}{{ ticketMedio.toFixed(0) }}</div>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="grafico-card">
        <div class="grafico-header">
          <h2 class="grafico-titulo">Faturamento por {{ periodo === 'mes' ? 'dia' : 'mês' }}</h2>
          <span class="grafico-badge">{{ periodoLabel }}</span>
        </div>
        <div class="canvas-wrapper">
          <canvas ref="canvas"></canvas>
        </div>
      </div>

    </div>

    <!-- Barra inferior -->
    <nav class="bottom-nav">
      <router-link to="/minhas-quadras" class="nav-item" :class="$route.path === '/minhas-quadras' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Quadras</span>
      </router-link>
      <router-link to="/reservas" class="nav-item" :class="$route.path === '/reservas' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="nav-item" :class="$route.path === '/faturamento-dono' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/perfil" class="nav-item" :class="$route.path === '/perfil' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";
import Chart from "chart.js/auto";

export default {
  components: { TopbarDono },
  data() {
    return {
      periodo: "mes",
      mesSelecionado: new Date().getMonth(),
      moeda: "BRL",
      simbolo: "R$ ",
      taxas: { BRL: 1, USD: 0.18, EUR: 0.16 },
      nomesMeses: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],

      reservas: [],

      totalPeriodo: 0,
      totalHorarios: 0,
      variacao: 0,
      valorConvertido: 0,
      ticketMedio: 0,

      chart: null,
    };
  },

  computed: {
    periodoLabel() {
      if (this.periodo === "mes") return this.nomesMeses[this.mesSelecionado] + " " + new Date().getFullYear();
      return String(new Date().getFullYear());
    }
  },

  async mounted() {
    await this.carregarReservas();
    this.atualizar();
  },

  beforeUnmount() {
    if (this.chart) this.chart.destroy();
  },

  methods: {
    async carregarReservas() {
      try {
        const donoId = JSON.parse(localStorage.getItem("user"))?.id;
        if (!donoId) return;

        const todasReservas = await api.getReservas();
        // Somente reservas marcadas como pagas entram no faturamento
        const pagas = todasReservas.filter(r => r.statusPagamento === 'pago');

        const lista = [];

        for (const r of pagas) {
          const preco = Number(r.preco || 0);

          if (!r.data || !r.horario) continue;

          const [ano, mes, dia] = r.data.split("-");
          const [h, min] = r.horario.split(":");

          const dataReal = new Date(ano, mes - 1, dia, h, min);
          if (isNaN(dataReal.getTime())) continue;

          lista.push({
            preco,
            dataReal
          });
        }

        this.reservas = lista;
      } catch (err) {
        console.error("Erro ao carregar faturamento:", err);
      }
    },

    atualizar() {
      const hoje = new Date();
      const agrupado = {};
      const labelsBase = this.gerarLabels(hoje);

      labelsBase.forEach(l => agrupado[l] = 0);

      const vendas = this.reservas.filter(r => {
        const d = r.dataReal;

        if (this.periodo === "mes")
          return d.getMonth() === this.mesSelecionado && d.getFullYear() === hoje.getFullYear();

        if (this.periodo === "ano")
          return d.getFullYear() === hoje.getFullYear();
      });

      for (const r of vendas) {
        const d = r.dataReal;
        let chave = "";

        if (this.periodo === "mes")
          chave = `${d.getDate()}`;

        else if (this.periodo === "ano")
          chave = d.getMonth();

        if (agrupado[chave] !== undefined)
          agrupado[chave] += r.preco;
      }

      const labels = Object.keys(agrupado);
      const valores = Object.values(agrupado);

      this.totalPeriodo = valores.reduce((s, v) => s + v, 0);
      this.totalHorarios = vendas.length;
      this.valorConvertido = this.totalPeriodo * this.taxas[this.moeda];
      this.ticketMedio = this.totalHorarios ? this.totalPeriodo / this.totalHorarios : 0;

      // Cálculo de variação
      let atual = 0;
      let anterior = 0;

      if (this.periodo === "mes") {
        const mesAnterior = this.mesSelecionado - 1;
        const anoRef = hoje.getFullYear();

        atual = this.reservas
          .filter(r => r.dataReal.getMonth() === this.mesSelecionado && r.dataReal.getFullYear() === anoRef)
          .reduce((t, r) => t + r.preco, 0);

        anterior = mesAnterior >= 0
          ? this.reservas.filter(r => r.dataReal.getMonth() === mesAnterior && r.dataReal.getFullYear() === anoRef).reduce((t, r) => t + r.preco, 0)
          : 0;
      }

      if (this.periodo === "ano") {
        const anoAtual = hoje.getFullYear();
        const anoAnterior = anoAtual - 1;

        atual = this.reservas
          .filter(r => r.dataReal.getFullYear() === anoAtual)
          .reduce((t, r) => t + r.preco, 0);

        anterior = this.reservas
          .filter(r => r.dataReal.getFullYear() === anoAnterior)
          .reduce((t, r) => t + r.preco, 0);
      }

      this.variacao = anterior > 0
        ? ((atual - anterior) / anterior) * 100
        : 0;

      this.desenharGrafico(labels, valores);
    },

    gerarLabels(data) {
      if (this.periodo === "mes") {
        const dias = new Date(data.getFullYear(), this.mesSelecionado + 1, 0).getDate();
        return Array.from({ length: dias }, (_, i) => `${i + 1}`);
      }

      if (this.periodo === "ano") {
        return Array.from({ length: 12 }, (_, i) => i);
      }
    },

    desenharGrafico(labels, valores) {
      if (this.chart) this.chart.destroy();

      const ctx = this.$refs.canvas.getContext("2d");

      let labelsFinais = labels;

      if (this.periodo === "ano") {
        const nomes = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
        labelsFinais = labels.map(n => nomes[n]);
      }

      // Cria gradiente verde
      const grad = ctx.createLinearGradient(0, 0, 0, 260);
      grad.addColorStop(0, "rgba(34, 197, 94, 0.25)");
      grad.addColorStop(1, "rgba(34, 197, 94, 0.01)");

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labelsFinais,
          datasets: [
            {
              data: valores,
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: grad,
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: "rgb(34, 197, 94)",
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'Inter', sans-serif", size: 11 } } },
            y: { beginAtZero: true, ticks: { font: { family: "'Inter', sans-serif", size: 11 } } }
          }
        }
      });
    },

    converter() {
      this.simbolo =
        this.moeda === "BRL" ? "R$ " :
        this.moeda === "USD" ? "US$ " : "€ ";

      this.valorConvertido = this.totalPeriodo * this.taxas[this.moeda];
    }
  }
};
</script>

<style scoped>
.pagina {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
}

.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px 100px;
  width: 100%;
}

/* Cabeçalho */
.cabecalho-secao {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.titulo-pagina {
  font-size: 24px;
  font-weight: 800;
  color: var(--foreground);
}

.subtitulo-pagina {
  color: var(--muted-foreground);
  font-size: 14px;
  margin-top: 4px;
}

/* Filtros */
.filtros-wrapper {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.select-wrapper {
  position: relative;
}

.select-campo {
  padding: 8px 32px 8px 14px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  outline: none;
  transition: border-color 0.2s;
}

.select-campo:focus {
  border-color: var(--accent);
}

.select-seta {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

/* Stats */
.grid-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .grid-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
}

.stat-icone {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.stat-icone--verde {
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary);
}

.stat-icone--azul {
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent);
}

.stat-icone--laranja {
  background: rgba(249, 115, 22, 0.1);
  color: var(--clay);
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  margin-bottom: 6px;
}

.stat-valor {
  font-size: 20px;
  font-weight: 800;
  color: var(--foreground);
}

.text-subida {
  color: var(--primary-dark);
}

.text-descida {
  color: var(--destructive);
}

/* Grafico Card */
.grafico-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.grafico-header {
  padding: 20px;
  border-b: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grafico-titulo {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
}

.grafico-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-dark);
  background: rgba(34, 197, 94, 0.08);
  padding: 4px 10px;
  border-radius: 999px;
}

.canvas-wrapper {
  height: 280px;
  padding: 16px;
  position: relative;
}

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 40;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-foreground);
  padding: 8px 16px;
  transition: color 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  color: #475569;
}

.nav-item--ativo {
  color: var(--accent);
}
</style>
