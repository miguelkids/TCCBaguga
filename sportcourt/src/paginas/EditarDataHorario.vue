<template>
  <div class="pagina">
    <TopbarDono />
    <div class="container">

      <div class="cabecalho-secao">
        <button class="btn-voltar" @click="$router.push('/confirmar-quadra')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="titulo-secao">Gerenciar Horários</h1>
      </div>

      <!-- Calendário -->
      <div class="calendario-card">
        <h3 class="calendario-dica">Selecione um dia</h3>
        
        <div class="calendario-moldura">
          <div class="calendario-mes-header">
            <button @click="mudarMes(-1)" class="btn-mes-nav">&lt;</button>
            <div class="calendario-mes-titulo">{{ mesAtualNome }} {{ anoAtual }}</div>
            <button @click="mudarMes(1)" class="btn-mes-nav">&gt;</button>
          </div>
          <div class="calendario-semana-labels">
            <div v-for="d in diasSemanaLabel" :key="d" class="semana-label">{{ d }}</div>
          </div>
          <div class="calendario-dias-grid">
            <div
              v-for="dia in diasMes"
              :key="dia.id"
              class="dia-item"
              :class="{
                'dia-item--vazio': !dia.data,
                'dia-item--invalido': dia.data && !dia.valido,
                'dia-item--selecionado': dia.data && dia.data === dataSelecionada
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
    <div v-if="mostrarPopup" class="modal-overlay" @click.self="mostrarPopup = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-titulo">Horários: {{ formatarDataBR(dataSelecionada) }}</h3>
          <button class="btn-fechar" @click="mostrarPopup = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <p class="modal-subtitulo">Clique no horário para bloquear ou liberar</p>
        
        <div class="modal-grid-horarios">
          <button
            v-for="hora in horariosDoDia"
            :key="hora.horario"
            class="hora-bloco"
            :class="hora.ocupado ? 'hora-bloco--ocupado' : 'hora-bloco--livre'"
            @click="toggleHorario(hora)"
          >
            <span class="hora-texto">{{ hora.horario }}</span>
            <div class="hora-status">
              {{ hora.ocupado ? 'Bloqueado' : 'Livre' }}
            </div>
          </button>
        </div>
        
        <p v-if="horariosDoDia.length === 0" class="hora-aviso-erro">Nenhum horário configurado para este dia.</p>
        
        <button class="btn-concluir" @click="mostrarPopup = false">
          Concluir
        </button>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="bottom-nav">
      <router-link to="/confirmar-quadra" class="nav-item" :class="$route.path === '/confirmar-quadra' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Menu</span>
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
      return String(dataIso).slice(0, 10).replace(/-/g, "/");
    },
  },
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
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
}

.cabecalho-secao {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1.5px solid var(--border);
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #f8fafc;
  transform: none;
  box-shadow: none;
}

.titulo-secao {
  font-size: 18px;
  font-weight: 800;
  color: var(--foreground);
}

/* Calendário */
.calendario-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.calendario-dica {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.calendario-moldura {
  border: 1.5px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.calendario-mes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border);
}

.btn-mes-nav {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #475569;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0;
  margin: 0;
  transition: background 0.2s;
}

.btn-mes-nav:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

.calendario-mes-titulo {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 14px;
  color: var(--foreground);
  text-transform: capitalize;
}

.calendario-semana-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 10px 0;
  background: white;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-foreground);
  border-bottom: 1px solid var(--border);
}

.calendario-dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
  padding: 8px;
  gap: 6px;
}

.dia-item {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.dia-item:hover {
  background: #f1f5f9;
}

.dia-item--vazio {
  pointer-events: none;
  opacity: 0;
}

.dia-item--invalido {
  color: #cbd5e1;
  opacity: 0.4;
  cursor: not-allowed;
}

.dia-item--invalido:hover {
  background: transparent;
}

.dia-item--selecionado {
  background: var(--accent) !important;
  color: white !important;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

/* Modal Popup */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 380px;
  padding: 24px;
  box-shadow: var(--shadow-glow);
  position: relative;
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-titulo {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
}

.btn-fechar {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted-foreground);
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 0;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.btn-fechar:hover {
  color: var(--accent);
  background: #f1f5f9;
  transform: none;
  box-shadow: none;
}

.modal-subtitulo {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-bottom: 16px;
}

.modal-grid-horarios {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.hora-bloco {
  width: 100%;
  padding: 10px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  background: white;
  transition: all 0.2s;
}

.hora-bloco:hover {
  transform: none;
  box-shadow: none;
}

.hora-bloco--ocupado {
  background: #fef2f2;
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--destructive);
}

.hora-bloco--ocupado:hover {
  border-color: rgba(239, 68, 68, 0.4);
}

.hora-bloco--livre {
  border-color: var(--border);
  color: #475569;
}

.hora-bloco--livre:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hora-status {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hora-bloco--ocupado .hora-status {
  color: var(--destructive);
}

.hora-bloco--livre .hora-status {
  color: var(--accent);
}

.hora-aviso-erro {
  font-size: 12px;
  color: var(--destructive);
  text-align: center;
  padding: 8px 0;
  margin-bottom: 16px;
}

.btn-concluir {
  width: 100%;
  padding: 14px;
  background: var(--gradient-accent);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-concluir:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
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

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
