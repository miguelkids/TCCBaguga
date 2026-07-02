<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <TopbarDono />

    <div class="max-w-5xl w-full mx-auto px-4 py-6 pb-24">

      <!-- Cabeçalho -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900">CRM de Reservas</h1>
          <p class="text-xs text-slate-400 font-medium mt-0.5">{{ reservas.length }} agendamento{{ reservas.length !== 1 ? 's' : '' }} no total</p>
        </div>
        <span class="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold rounded-full">{{ reservas.length }}</span>
      </div>

      <!-- Abas de Status -->
      <div class="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 overflow-x-auto">
        <button v-for="aba in abas" :key="aba.id" @click="abaAtiva = aba.id"
          class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
          :class="abaAtiva === aba.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
          {{ aba.label }}
          <span class="px-1.5 py-0.5 rounded-full text-xs font-extrabold"
            :class="abaAtiva === aba.id ? aba.activeBadge : 'bg-slate-200 text-slate-500'">
            {{ aba.id !== 'crm' ? listaFiltrada(aba.id).length : clientesList.length }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Aba CRM Clientes -->
      <div v-else-if="abaAtiva === 'crm'" class="flex flex-col gap-3">
        <!-- Busca e filtros -->
        <div class="flex gap-2 mb-1">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="buscaCRM" placeholder="Buscar cliente..."
              class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500 transition-all" />
          </div>
          <div class="flex gap-1">
            <button v-for="f in filtrosFinanceiros" :key="f.id" @click="filtroFinanceiro = f.id"
              class="px-3 py-2 rounded-xl text-xs font-bold transition-all border"
              :class="filtroFinanceiro === f.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200'">
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Lista de clientes -->
        <div v-for="c in clientesFiltrados" :key="c.id"
          class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <button @click="selectedClienteId = selectedClienteId === c.id ? null : c.id"
            class="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0"
              :style="{ background: avatarColor(c.nome) }">
              {{ iniciais(c.nome) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-extrabold text-slate-900 text-sm truncate">{{ c.nome }}</p>
              <p class="text-xs text-slate-400 font-medium">{{ c.totalJogos }} jogos · Pago: R$ {{ c.totalPago.toFixed(2) }}</p>
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                :class="c.divida > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'">
                {{ c.divida > 0 ? 'Pendente' : 'Em dia' }}
              </span>
              <p v-if="c.divida > 0" class="text-xs font-extrabold text-red-500">R$ {{ c.divida.toFixed(2) }}</p>
            </div>
          </button>
          <!-- Histórico expandido -->
          <div v-if="selectedClienteId === c.id" class="border-t border-slate-100 px-4 pb-4">
            <div class="mt-3 flex flex-col gap-2">
              <div v-for="r in c.reservas" :key="r.id"
                class="flex items-center justify-between text-xs py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p class="font-bold text-slate-700">{{ r.data }} · {{ r.horario }}</p>
                  <p class="text-slate-400">{{ r.nomeQuadra }} · R$ {{ r.preco }}</p>
                </div>
                <span class="font-bold px-2 py-0.5 rounded-full"
                  :class="r.status_pagamento === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                  {{ r.status_pagamento === 'pago' ? 'Pago' : 'Pendente' }}
                </span>
              </div>
            </div>
            <a :href="whatsappCRM(c)" target="_blank"
              class="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-[#25d366] text-white font-bold rounded-xl text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.927 0C5.364 0 .068 5.296.068 11.86c0 2.091.549 4.056 1.508 5.757L0 24l6.567-1.718A11.85 11.85 0 0 0 11.927 23.72c6.563 0 11.86-5.296 11.86-11.86S18.49 0 11.927 0zm0 21.653a9.79 9.79 0 0 1-4.987-1.366l-.358-.213-3.699.969.984-3.596-.233-.371a9.772 9.772 0 0 1-1.499-5.216c0-5.405 4.396-9.8 9.792-9.8 5.397 0 9.792 4.395 9.792 9.8s-4.395 9.793-9.792 9.793z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- Abas de reservas (Pendentes, Confirmadas, Encerradas) -->
      <div v-else class="flex flex-col gap-4">
        <div v-if="listaAtiva.length === 0" class="text-center py-12">
          <p class="text-sm text-slate-400">Nenhuma reserva {{ abaAtiva }}.</p>
        </div>

        <div v-for="r in listaAtiva" :key="r.id"
          class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <!-- Cabeçalho do card -->
          <div class="p-4 pb-3">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0"
                :style="{ background: avatarColor(r.nomeJogador) }">
                {{ iniciais(r.nomeJogador) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-extrabold text-slate-900 text-sm truncate">{{ r.nomeJogador || 'Jogador' }}</p>
                <p class="text-xs text-slate-400 font-medium">{{ r.telefoneJogador }}</p>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-full"
                :class="r.confirmada ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'">
                {{ r.confirmada ? 'Confirmada' : 'Pendente' }}
              </span>
            </div>

            <!-- Detalhes -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                <svg class="text-blue-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span class="font-semibold text-slate-700">{{ r.data }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                <svg class="text-amber-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="font-semibold text-slate-700">{{ r.horario }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                <svg class="text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span class="font-semibold text-slate-700">R$ {{ r.preco }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                <svg class="text-blue-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="font-semibold text-slate-700 truncate">{{ r.nomeQuadra }}</span>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="border-t border-slate-100 p-3 flex flex-wrap gap-2">
            <button v-if="!r.confirmada" @click="confirmarReserva(r)"
              class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all">
              Confirmar
            </button>
            <button v-if="r.confirmada && r.status_pagamento !== 'pago'" @click="concluirHorario(r)"
              class="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all">
              Encerrar Horário
            </button>
            <button @click="cancelarReserva(r)"
              class="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs border border-red-200 transition-all">
              Cancelar
            </button>
            <a :href="`https://wa.me/55${(r.telefoneJogador||'').replace(/\D/g,'')}`" target="_blank"
              class="flex items-center gap-1 py-2 px-3 bg-[#25d366] text-white font-bold rounded-xl text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WA
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg">
      <router-link to="/minhas-quadras" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/minhas-quadras' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Quadras</span>
      </router-link>
      <router-link to="/reservas" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/reservas' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/faturamento-dono' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/perfil' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
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
      loading: true,
      pollInterval: null,
      abaAtiva: "pendentes",
      buscaCRM: "",
      selectedClienteId: null,
      filtroFinanceiro: "todos",
      abas: [
        { id: "pendentes", label: "Pendentes", activeBadge: "bg-amber-100 text-amber-700" },
        { id: "confirmadas", label: "Confirmadas", activeBadge: "bg-emerald-100 text-emerald-700" },
        { id: "encerradas", label: "Encerradas", activeBadge: "bg-slate-200 text-slate-600" },
        { id: "crm", label: "CRM Clientes", activeBadge: "bg-blue-100 text-blue-700" },
      ],
      filtrosFinanceiros: [
        { id: "todos", label: "Todos" },
        { id: "pendentes", label: "Pend." },
        { id: "em_dia", label: "Em dia" },
      ],
    };
  },
  computed: {
    pendentes() { return this.reservas.filter(r => !r.confirmada && r.status !== "cancelada"); },
    confirmadas() { return this.reservas.filter(r => r.confirmada && r.status_pagamento !== "pago"); },
    encerradas() { return this.reservas.filter(r => r.status_pagamento === "pago"); },
    listaAtiva() { return this.listaFiltrada(this.abaAtiva); },
    clientesList() {
      const mapa = {};
      for (const r of this.reservas) {
        const id = r.jogadorId;
        if (!mapa[id]) {
          mapa[id] = { id, nome: r.nomeJogador || "Jogador", totalJogos: 0, totalPago: 0, divida: 0, reservas: [] };
        }
        mapa[id].totalJogos++;
        mapa[id].reservas.push(r);
        if (r.status_pagamento === "pago") mapa[id].totalPago += parseFloat(r.preco || 0);
        else mapa[id].divida += parseFloat(r.preco || 0);
      }
      return Object.values(mapa);
    },
    clientesFiltrados() {
      return this.clientesList.filter(c => {
        const matchBusca = c.nome.toLowerCase().includes(this.buscaCRM.toLowerCase());
        const matchFiltro = this.filtroFinanceiro === "todos"
          || (this.filtroFinanceiro === "pendentes" && c.divida > 0)
          || (this.filtroFinanceiro === "em_dia" && c.divida === 0);
        return matchBusca && matchFiltro;
      });
    },
  },
  async mounted() {
    await this.carregarReservas();
    this.pollInterval = setInterval(this.carregarReservas, 10000);
  },
  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
  methods: {
    listaFiltrada(id) {
      if (id === "pendentes") return this.pendentes;
      if (id === "confirmadas") return this.confirmadas;
      if (id === "encerradas") return this.encerradas;
      return [];
    },
    async carregarReservas() {
      try {
        const data = await api.getReservas();
        this.reservas = (data || []).sort((a, b) => new Date(b.data) - new Date(a.data));
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
      } finally {
        this.loading = false;
      }
    },
    async confirmarReserva(r) {
      await api.confirmarReserva(r.id);
      r.confirmada = true;
      await this.carregarReservas();
    },
    async cancelarReserva(r) {
      if (!confirm("Cancelar esta reserva?")) return;
      await api.cancelarReserva(r.id);
      await this.carregarReservas();
    },
    async concluirHorario(r) {
      await api.concluirReserva(r.id);
      r.status_pagamento = "pago";
      await this.carregarReservas();
    },
    iniciais(nome) {
      if (!nome) return "?";
      return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
    },
    avatarColor(nome) {
      let hash = 0;
      for (let i = 0; i < (nome || "").length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
      return `oklch(0.55 0.18 ${Math.abs(hash) % 360})`;
    },
    whatsappCRM(c) {
      const tel = ((c.reservas[0] || {}).telefoneJogador || "").replace(/\D/g, "");
      const msg = c.divida > 0
        ? `Olá ${c.nome}, você tem R$ ${c.divida.toFixed(2)} pendentes. Podemos acertar?`
        : `Olá ${c.nome}, obrigado por jogar conosco! 🎉`;
      return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
    },
  },
};
</script>
