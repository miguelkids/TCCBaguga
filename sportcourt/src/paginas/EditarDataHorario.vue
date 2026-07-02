<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <TopbarDono />
    <div class="max-w-2xl w-full mx-auto px-4 py-8 pb-24 md:pb-10">

      <div class="flex items-center gap-3 mb-6">
        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer" @click="$router.push('/confirmar-quadra')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="text-lg font-extrabold text-slate-900">Gerenciar Horários</h1>
      </div>

      <!-- Calendário -->
      <div class="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-card mb-6">
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Selecione um dia</h3>
        
        <div class="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button @click="mudarMes(-1)" class="bg-transparent border-none text-base cursor-pointer text-slate-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">&lt;</button>
            <div class="font-heading font-extrabold text-sm text-slate-800 capitalize">{{ mesAtualNome }} {{ anoAtual }}</div>
            <button @click="mudarMes(1)" class="bg-transparent border-none text-base cursor-pointer text-slate-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">&gt;</button>
          </div>
          <div class="grid grid-cols-7 text-center py-2.5 bg-white text-xs font-bold text-slate-400 border-b border-slate-200">
            <div v-for="d in diasSemanaLabel" :key="d">{{ d }}</div>
          </div>
          <div class="grid grid-cols-7 bg-white p-2 gap-1.5">
            <div
              v-for="dia in diasMes"
              :key="dia.id"
              class="aspect-square flex items-center justify-center text-sm font-semibold rounded-xl cursor-pointer transition-all hover:bg-slate-100"
              :class="{
                'pointer-events-none opacity-0': !dia.data,
                'color-slate-300 opacity-40 cursor-not-allowed hover:bg-transparent': dia.data && !dia.valido,
                'bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md': dia.data && dia.data === dataSelecionada
              }"
              @click="selecionarDia(dia)"
            >
              <span v-if="dia.data">{{ dia.numero }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Popup Horários -->
    <div v-if="mostrarPopup" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="mostrarPopup = false">
      <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl relative animate-scale-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-base font-extrabold text-slate-900">Horários: {{ formatarDataBR(dataSelecionada) }}</h3>
          <button class="bg-transparent border-none display-flex items-center justify-center cursor-pointer text-slate-400 hover:text-blue-600 transition-colors w-7 h-7 p-0 rounded-lg flex-shrink-0" @click="mostrarPopup = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <p class="text-xs text-slate-400 font-medium mb-4">Clique no horário para bloquear ou liberar</p>
        
        <div class="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
          <button
            v-for="hora in horariosDoDia"
            :key="hora.horario"
            class="w-full py-3 border rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer"
            :class="hora.ocupado ? 'bg-red-50 border-red-100 hover:border-red-200 text-red-500' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600'"
            @click="toggleHorario(hora)"
          >
            {{ hora.horario }}
            <div class="text-[10px] font-bold" :class="hora.ocupado ? 'text-red-500' : 'text-blue-500'">
              {{ hora.ocupado ? 'Bloqueado' : 'Livre' }}
            </div>
          </button>
        </div>
        
        <p v-if="horariosDoDia.length === 0" class="text-xs text-red-500 text-center py-2 mb-4">Nenhum horário configurado para este dia.</p>
        
        <button 
          class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm mt-4 cursor-pointer"
          @click="mostrarPopup = false"
        >
          Concluir
        </button>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 md:hidden shadow-lg">
      <router-link to="/confirmar-quadra" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/confirmar-quadra' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Menu</span>
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

export default {
  name: "EditarDataHorario",
  components: { TopbarDono },
  data() {
    return {
      quadraId: localStorage.getItem("quadraId") || "",
      quadra: null,
      
      // Calendario
      mesAtual: new Date().getMonth(),
      anoAtual: new Date().getFullYear(),
      diasSemanaLabel: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dataSelecionada: "",
      
      // Funcionamento
      diasFuncionamento: [0,1,2,3,4,5,6],
      horaAbertura: 0,
      horaFechamento: 23,
      horariosOcupadosApi: [],
      
      // Popup
      mostrarPopup: false,
      horariosDoDia: [],
    };
  },
  computed: {
    mesAtualNome() {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      return meses[this.mesAtual];
    },
    diasMes() {
      const dias = [];
      const dataInicio = new Date(this.anoAtual, this.mesAtual, 1);
      const dataFim = new Date(this.anoAtual, this.mesAtual + 1, 0);
      
      for (let i = 0; i < dataInicio.getDay(); i++) {
        dias.push({ id: `vazio-${i}`, data: null });
      }
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      for (let i = 1; i <= dataFim.getDate(); i++) {
        const d = new Date(this.anoAtual, this.mesAtual, i);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const dataStr = (new Date(d - tzOffset)).toISOString().slice(0, 10);
        
        let valido = d >= hoje;
        if (valido && this.diasFuncionamento.length > 0) {
          valido = this.diasFuncionamento.includes(d.getDay());
        }
        
        dias.push({
          id: dataStr,
          data: dataStr,
          numero: i,
          valido: valido
        });
      }
      return dias;
    }
  },
  async mounted() {
    if (!this.quadraId) return;
    try {
      this.quadra = await api.getQuadra(this.quadraId);
      this.parseHorarioFuncionamento(this.quadra.horario);
    } catch (e) {
      console.error("Erro ao carregar quadra:", e);
    }
  },
  methods: {
    parseHorarioFuncionamento(horarioStr) {
      if (!horarioStr) return;
      const diasMap = { "Domingo": 0, "Segunda": 1, "Terça": 2, "Quarta": 3, "Quinta": 4, "Sexta": 5, "Sábado": 6 };
      try {
        const parts = horarioStr.split(',');
        if (parts.length === 2) {
          const diasPart = parts[0].trim();
          const horasPart = parts[1].trim();
          
          if (diasPart.includes(' até ')) {
            const [inicio, fim] = diasPart.split(' até ');
            const dInicio = diasMap[inicio.trim()];
            const dFim = diasMap[fim.trim()];
            if (dInicio !== undefined && dFim !== undefined) {
              let dias = [];
              if (dInicio <= dFim) {
                for (let i = dInicio; i <= dFim; i++) dias.push(i);
              } else {
                for (let i = dInicio; i <= 6; i++) dias.push(i);
                for (let i = 0; i <= dFim; i++) dias.push(i);
              }
              this.diasFuncionamento = dias;
            }
          }
          
          const horasMatch = horasPart.match(/(\d{2}):\d{2}\s+(?:às|as)\s+(\d{2}):\d{2}/i);
          if (horasMatch) {
            this.horaAbertura = parseInt(horasMatch[1]);
            this.horaFechamento = parseInt(horasMatch[2]);
          }
        }
      } catch (err) { console.error("Falha ao parse", err); }
    },
    
    mudarMes(delta) {
      this.mesAtual += delta;
      if (this.mesAtual > 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      } else if (this.mesAtual < 0) {
        this.mesAtual = 11;
        this.anoAtual--;
      }
    },
    
    async selecionarDia(dia) {
      if (!dia.data || !dia.valido) return;
      this.dataSelecionada = dia.data;
      await this.carregarHorariosDoDia();
      this.mostrarPopup = true;
    },
    
    async carregarHorariosDoDia() {
      try {
        const lista = await api.getHorariosOcupados(this.quadraId, this.dataSelecionada);
        this.horariosOcupadosApi = lista;
        
        const ocupadosMap = {};
        lista.forEach(h => { ocupadosMap[h.horario] = h.id; });
        
        const horarios = [];
        for (let i = this.horaAbertura; i <= this.horaFechamento; i++) {
          const horaStr = `${String(i).padStart(2, "0")}:00`;
          horarios.push({
            id: ocupadosMap[horaStr] || null,
            horario: horaStr,
            ocupado: !!ocupadosMap[horaStr]
          });
        }
        this.horariosDoDia = horarios;
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      }
    },
    
    async toggleHorario(hora) {
      if (hora.ocupado) {
        if (!confirm(`Liberar o horário das ${hora.horario}?`)) return;
        try {
          await api.desmarcarHorarioOcupado(this.quadraId, hora.id);
          hora.ocupado = false;
          hora.id = null;
        } catch (e) { alert("Erro ao liberar: " + e.message); }
      } else {
        try {
          const res = await api.marcarHorarioOcupado(this.quadraId, this.dataSelecionada, hora.horario);
          hora.ocupado = true;
          hora.id = res.id;
        } catch (e) { alert("Erro ao bloquear: " + e.message); }
      }
    },
    
    formatarDataBR(dataIso) {
      if (!dataIso) return "";
      const partes = dataIso.split("-");
      if (partes.length !== 3) return dataIso;
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },
  },
};
</script>

<style>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
</style>

