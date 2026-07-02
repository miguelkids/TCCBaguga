<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <TopbarDono />
    <div class="max-w-lg w-full mx-auto px-4 py-8 pb-24">
      <h1 class="text-xl font-extrabold text-slate-900 mb-6">Gerenciar Horários Ocupados</h1>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4 flex flex-col gap-4">
        <!-- Seletor de data -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Selecione a data</label>
          <input type="date" v-model="dataSelecionada"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
        </div>

        <!-- Seletor de horário -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Selecione o horário</label>
          <select v-model="horarioSelecionado"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
            <option value="">Escolha um horário</option>
            <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
          </select>
        </div>

        <!-- Botão alternador -->
        <button @click="alternarHorario"
          class="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl text-sm transition-all">
          Ocupar / Desocupar Horário
        </button>
      </div>

      <!-- Lista de horários bloqueados -->
      <div v-if="dataSelecionada" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4">
        <h2 class="text-sm font-extrabold text-slate-800 mb-3">Horários bloqueados em {{ dataSelecionada }}</h2>
        <div v-if="horariosDia.length === 0" class="text-center py-4">
          <p class="text-sm text-slate-400">Nenhum horário bloqueado nesta data.</p>
        </div>
        <div v-for="item in horariosDia" :key="item.id"
          class="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
          <div class="flex items-center gap-2">
            <svg class="text-red-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="text-sm font-semibold text-slate-700">{{ item.horario }}</span>
          </div>
          <button @click="removerHorario(item.id)"
            class="text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-all bg-red-50 hover:bg-red-100">
            Cancelar
          </button>
        </div>
      </div>

      <!-- Voltar -->
      <button @click="$router.push('/menu-quadra')"
        class="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
        Voltar ao Menu
      </button>
    </div>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "EditarDatas",
  components: { TopbarDono },
  data() {
    return {
      quadraId: localStorage.getItem("quadraId") || null,
      dataSelecionada: "",
      horarioSelecionado: "",
      horarios: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
      horariosDia: [],
    };
  },
  watch: {
    dataSelecionada(val) {
      if (val) this.carregarHorarios();
    },
  },
  methods: {
    async carregarHorarios() {
      try {
        this.horariosDia = await api.getHorariosOcupados(this.quadraId, this.dataSelecionada);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      }
    },
    async alternarHorario() {
      if (!this.dataSelecionada || !this.horarioSelecionado) {
        alert("Selecione uma data e um horário.");
        return;
      }
      const existente = this.horariosDia.find(h => h.horario === this.horarioSelecionado);
      if (existente) {
        await this.removerHorario(existente.id);
        alert("Horário liberado!");
      } else {
        await api.marcarHorarioOcupado(this.quadraId, this.dataSelecionada, this.horarioSelecionado);
        alert("Horário marcado como ocupado!");
      }
      await this.carregarHorarios();
      this.horarioSelecionado = "";
    },
    async removerHorario(id) {
      await api.desmarcarHorarioOcupado(this.quadraId, id);
      await this.carregarHorarios();
    },
  },
};
</script>
