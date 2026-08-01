<template>
  <div class="pagina">
    <TopbarDono />

    <div class="container">
      <div class="cabecalho-secao">
        <button class="btn-voltar" @click="$router.push('/confirmar-quadra')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="titulo-secao">Gerenciar Horários e Bloqueios</h1>
      </div>

      <!-- Calendário de seleção -->
      <div class="calendario-card">
        <h3 class="calendario-dica">Selecione uma data no calendário</h3>
        
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

      <!-- Seção de Horários Inline (sem modal popup) -->
      <div v-if="dataSelecionada" class="horarios-inline-card">
        <div class="horarios-header">
          <div>
            <h3 class="horarios-titulo">Horários para {{ formatarDataBR(dataSelecionada) }}</h3>
            <p class="horarios-subtitulo">Clique diretamente no horário para alterar o bloqueio. Selecione quantos desejar.</p>
          </div>
          
          <button class="sc-btn sc-btn-secondary sc-btn-sm" @click="toggleDiaInteiro">
            {{ todosBloqueados ? 'Liberar Dia Inteiro' : 'Bloquear Dia Inteiro' }}
          </button>
        </div>

        <div class="horarios-grid">
          <button
            v-for="hora in horariosDoDia"
            :key="hora.horario"
            class="hora-card"
            :class="hora.ocupado ? 'hora-card--bloqueado' : 'hora-card--livre'"
            @click="toggleHorario(hora)"
          >
            <span class="hora-tempo">{{ hora.horario }}</span>
            <span class="hora-status-badge">{{ hora.ocupado ? 'Bloqueado' : 'Livre' }}</span>
          </button>
        </div>

        <p v-if="horariosDoDia.length === 0" class="sc-muted" style="text-align: center; margin-top: 16px;">
          Nenhum horário configurado para esta data.
        </p>

        <div style="margin-top: 24px; text-align: right;">
          <button class="sc-btn sc-btn-primary" @click="salvarBloqueios" :disabled="salvando">
            {{ salvando ? "Salvando..." : "Salvar Alterações" }}
          </button>
        </div>
      </div>

    </div>
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
      mesAtual: new Date().getMonth(),
      anoAtual: new Date().getFullYear(),
      diasSemanaLabel: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dataSelecionada: "",
      horariosDoDia: [],
      salvando: false
    };
  },
  computed: {
    mesAtualNome() {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      return meses[this.mesAtual];
    },
    diasMes() {
      const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1).getDay();
      const totalDias = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const lista = [];
      for (let i = 0; i < primeiroDia; i++) {
        lista.push({ id: `vazio-${i}`, data: null });
      }
      for (let d = 1; d <= totalDias; d++) {
        const dataObj = new Date(this.anoAtual, this.mesAtual, d);
        const dataStr = `${this.anoAtual}-${String(this.mesAtual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        lista.push({
          id: dataStr,
          numero: d,
          data: dataStr,
          valido: dataObj >= hoje
        });
      }
      return lista;
    },
    todosBloqueados() {
      if (this.horariosDoDia.length === 0) return false;
      return this.horariosDoDia.every(h => h.ocupado);
    }
  },
  mounted() {
    const hojeStr = new Date().toISOString().substring(0, 10);
    this.dataSelecionada = hojeStr;
    this.carregarHorariosDoDia(hojeStr);
  },
  methods: {
    mudarMes(delta) {
      this.mesAtual += delta;
      if (this.mesAtual < 0) {
        this.mesAtual = 11;
        this.anoAtual--;
      } else if (this.mesAtual > 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      }
    },
    selecionarDia(dia) {
      if (!dia.data || !dia.valido) return;
      this.dataSelecionada = dia.data;
      this.carregarHorariosDoDia(dia.data);
    },
    async carregarHorariosDoDia(dataStr) {
      try {
        const ocupados = await api.getHorariosOcupados(this.quadraId, dataStr);
        // Gera lista padrão das 07:00 às 23:00
        const lista = [];
        for (let h = 7; h <= 23; h++) {
          const horaFmt = `${String(h).padStart(2, '0')}:00`;
          const isOcupado = ocupados.some(o => o.horario === horaFmt || o === horaFmt);
          lista.push({ horario: horaFmt, ocupado: isOcupado });
        }
        this.horariosDoDia = lista;
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      }
    },
    toggleHorario(hora) {
      hora.ocupado = !hora.ocupado;
    },
    toggleDiaInteiro() {
      const novoEstado = !this.todosBloqueados;
      this.horariosDoDia.forEach(h => {
        h.ocupado = novoEstado;
      });
    },
    async salvarBloqueios() {
      try {
        this.salvando = true;
        const bloqueados = this.horariosDoDia.filter(h => h.ocupado).map(h => h.horario);
        await api.atualizarBloqueiosHorario(this.quadraId, this.dataSelecionada, bloqueados);
        alert("Horários atualizados com sucesso!");
      } catch (err) {
        console.error("Erro ao salvar bloqueios:", err);
        alert("Erro ao salvar horários: " + err.message);
      } finally {
        this.salvando = false;
      }
    },
    formatarDataBR(dataIso) {
      if (!dataIso) return "";
      const [ano, mes, dia] = dataIso.split("-");
      return `${dia}/${mes}/${ano}`;
    }
  }
};
</script>

<style scoped>
.pagina {
  min-height: 100vh;
  background: var(--sc-bg);
  color: var(--sc-text);
  font-family: var(--sc-font);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px 80px;
}

.cabecalho-secao {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--sc-bg-elevated);
  color: var(--sc-text);
  border: 1px solid var(--sc-border);
  padding: 8px 14px;
  border-radius: var(--sc-radius);
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.titulo-secao {
  font-size: 24px;
  font-weight: 800;
}

.calendario-card, .horarios-inline-card {
  background: var(--sc-bg-card);
  border: 1px solid var(--sc-border);
  border-radius: var(--sc-radius-xl);
  padding: 24px;
  margin-bottom: 24px;
}

.calendario-dica {
  font-size: 14px;
  color: var(--sc-text-muted);
  margin-bottom: 16px;
}

.calendario-mes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-mes-nav {
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  color: var(--sc-text);
  width: 32px;
  height: 32px;
  border-radius: var(--sc-radius-sm);
  cursor: pointer;
  font-weight: bold;
}

.calendario-mes-titulo {
  font-weight: 700;
  font-size: 16px;
}

.calendario-semana-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 12px;
  color: var(--sc-text-muted);
  font-weight: 600;
  margin-bottom: 8px;
}

.calendario-dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.dia-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sc-radius);
  background: var(--sc-bg-elevated);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--sc-transition);
}

.dia-item--vazio {
  background: transparent;
  cursor: default;
}

.dia-item--invalido {
  opacity: 0.3;
  cursor: not-allowed;
}

.dia-item--selecionado {
  background: var(--sc-primary);
  color: #0f1117;
  border-color: var(--sc-primary-glow);
  box-shadow: var(--sc-shadow-glow-sm);
}

/* Horarios Inline */
.horarios-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.horarios-titulo {
  font-size: 18px;
  font-weight: 700;
}

.horarios-subtitulo {
  font-size: 13px;
  color: var(--sc-text-muted);
  margin-top: 4px;
}

.horarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
}

.hora-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: var(--sc-radius);
  border: 1px solid var(--sc-border);
  cursor: pointer;
  background: var(--sc-bg-elevated);
  transition: all var(--sc-transition);
}

.hora-card--livre {
  border-color: rgba(74, 222, 128, 0.3);
}

.hora-card--bloqueado {
  background: var(--sc-red-subtle);
  border-color: var(--sc-red);
  color: var(--sc-red);
}

.hora-tempo {
  font-weight: 700;
  font-size: 15px;
}

.hora-status-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 4px;
}
</style>
