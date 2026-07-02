<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-8">
    <TopbarDono />
    <div class="max-w-[860px] mx-auto px-4 pb-24 pt-6 w-full">

      <!-- Cabeçalho -->
      <div class="flex items-start justify-between flex-wrap gap-4 mb-7">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-800 m-0 text-left">Dashboard</h1>
          <p class="text-slate-500 text-sm mt-1">Resumo financeiro da sua operação.</p>
        </div>

        <!-- Filtros -->
        <div class="flex gap-2.5 flex-wrap items-center">
          <select v-model="periodo" @change="atualizar" class="px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm font-semibold cursor-pointer outline-none transition-colors focus:border-blue-500">
            <option value="mes">Mês</option>
            <option value="ano">Ano</option>
          </select>

          <select v-if="periodo === 'mes'" v-model="mesSelecionado" @change="atualizar" class="px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm font-semibold cursor-pointer outline-none transition-colors focus:border-blue-500">
            <option v-for="(nome, idx) in nomesMeses" :key="idx" :value="idx">{{ nome }}</option>
          </select>

          <select v-model="moeda" @change="converter" class="px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm font-semibold cursor-pointer outline-none transition-colors focus:border-blue-500">
            <option value="BRL">R$ Real</option>
            <option value="USD">US$ Dólar</option>
            <option value="EUR">€ Euro</option>
          </select>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="text-xs font-semibold text-slate-400 mb-1.5">Faturamento</div>
          <div class="text-xl font-extrabold text-slate-800">{{ simbolo }}{{ Number(valorConvertido).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          </div>
          <div class="text-xs font-semibold text-slate-400 mb-1.5">Horários Agendados</div>
          <div class="text-xl font-extrabold text-slate-800">{{ totalHorarios }}</div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-amber-50 text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div class="text-xs font-semibold text-slate-400 mb-1.5">Variação vs. período anterior</div>
          <div class="text-xl font-extrabold" :class="variacao >= 0 ? 'text-emerald-600' : 'text-red-600'">
            {{ variacao >= 0 ? '+' : '' }}{{ Number(variacao).toFixed(1) }}%
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div class="text-xs font-semibold text-slate-400 mb-1.5">Ticket Médio</div>
          <div class="text-xl font-extrabold text-slate-800">{{ simbolo }}{{ ticketMedio.toFixed(0) }}</div>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-800 m-0">Faturamento por {{ periodo === 'mes' ? 'dia' : 'mês' }}</h2>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{{ periodoLabel }}</span>
        </div>
        <div class="h-[280px] p-4 relative">
          <canvas ref="canvas"></canvas>
        </div>
      </div>

    </div>

    <!-- Barra inferior -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 md:hidden shadow-lg">
      <router-link to="/minhas-quadras" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/minhas-quadras' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Quadras</span>
      </router-link>
      <router-link to="/reservas" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/reservas' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/faturamento-dono' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/perfil' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
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
      grad.addColorStop(0, "oklch(0.62 0.17 145 / 0.25)");
      grad.addColorStop(1, "oklch(0.62 0.17 145 / 0.01)");

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labelsFinais,
          datasets: [
            {
              data: valores,
              borderColor: "oklch(0.62 0.17 145)",
              backgroundColor: grad,
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: "oklch(0.62 0.17 145)",
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
