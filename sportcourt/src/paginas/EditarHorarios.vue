<template>
  <div class="pagina">
    <TopbarDono />
    <div class="container">
      <h1 class="titulo-pagina">Gerenciar Horários Ocupados</h1>

      <div class="card-formulario">
        <!-- Seletor de data -->
        <div class="campo">
          <label class="campo-label">Selecione a data</label>
          <input type="date" v-model="dataSelecionada" class="input-campo" />
        </div>

        <!-- Seletor de horário -->
        <div class="campo">
          <label class="campo-label">Selecione o horário</label>
          <div class="select-wrapper">
            <select v-model="horarioSelecionado" class="select-campo">
              <option value="">Escolha um horário</option>
              <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
            </select>
            <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <!-- Botão alternador -->
        <button @click="alternarHorario" class="btn-submit">
          Ocupar / Desocupar Horário
        </button>
      </div>

      <!-- Lista de horários bloqueados -->
      <div v-if="dataSelecionada" class="card-lista">
        <h2 class="lista-titulo">Horários bloqueados em {{ dataSelecionada }}</h2>
        <div v-if="horariosDia.length === 0" class="lista-vazia">
          <p>Nenhum horário bloqueado nesta data.</p>
        </div>
        <div v-for="item in horariosDia" :key="item.id" class="lista-item">
          <div class="item-info">
            <svg class="item-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="item-horario">{{ item.horario }}</span>
          </div>
          <button @click="removerHorario(item.id)" class="btn-cancelar">
            Cancelar
          </button>
        </div>
      </div>

      <!-- Voltar -->
      <button @click="$router.push('/menu-quadra')" class="btn-voltar">
        Voltar ao Menu
      </button>
    </div>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "EditarHorarios",
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

<style scoped>
.pagina {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
}

.container {
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
}

.titulo-pagina {
  font-size: 20px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 24px;
}

/* Card Formulario */
.card-formulario {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-campo {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-campo:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

/* Select */
.select-wrapper {
  position: relative;
}

.select-campo {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-campo:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

.select-seta {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

/* Submit button */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

/* Card lista */
.card-lista {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
  margin-bottom: 16px;
}

.lista-titulo {
  font-size: 14px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 12px;
}

.lista-vazia {
  text-align: center;
  padding: 16px 0;
  color: var(--muted-foreground);
  font-size: 13px;
}

.lista-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.lista-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-icone {
  color: var(--destructive);
}

.item-horario {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.btn-cancelar {
  font-size: 12px;
  font-weight: 700;
  color: var(--destructive);
  background: #fef2f2;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancelar:hover {
  background: #fee2e2;
  transform: none;
  box-shadow: none;
}

/* Voltar button */
.btn-voltar {
  width: 100%;
  padding: 14px;
  background: var(--muted);
  color: #475569;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}
</style>