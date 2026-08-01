<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">Gerenciar Horários e Bloqueios</h1>
          <p class="sc-muted">Bloqueie horários específicos ou dias inteiros para manutenção ou eventos.</p>
        </div>
        <button class="sc-btn sc-btn-secondary" @click="$router.push('/minhas-quadras')">
          ← Voltar
        </button>
      </div>

      <div class="sc-grid-2" style="margin-bottom: 24px;">
        <!-- Card de formulário: Novo Bloqueio -->
        <div class="sc-card" style="padding: 24px;">
          <h2 class="sc-h3" style="margin-bottom: 16px;">Novo Bloqueio</h2>

          <div class="sc-form-group">
            <label class="sc-label">Data</label>
            <input type="date" v-model="dataSelecionada" class="sc-input" :min="hojeISO" />
          </div>

          <div class="sc-form-group">
            <label class="sc-flex sc-gap-2" style="cursor: pointer; font-size: 13px; font-weight: 600;">
              <input type="checkbox" v-model="diaInteiro" />
              <span>Bloquear Dia Inteiro</span>
            </label>
          </div>

          <div class="sc-form-group" v-if="!diaInteiro">
            <label class="sc-label">Horário Específico</label>
            <select v-model="horarioSelecionado" class="sc-input">
              <option value="">Selecione o horário</option>
              <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Motivo / Descrição (Opcional)</label>
            <input type="text" class="sc-input" v-model="descricaoBloqueio" placeholder="Ex: Feriado, manutenção, evento..." />
          </div>

          <button @click="confirmarBloqueio" class="sc-btn sc-btn-primary sc-btn-lg">
            Confirmar Bloqueio
          </button>
        </div>

        <!-- Grade Visual dos Slots do dia -->
        <div class="sc-card" style="padding: 24px;">
          <div class="sc-flex-between" style="margin-bottom: 16px;">
            <h2 class="sc-h3">Horários em {{ dataSelecionada || 'Selecione uma data' }}</h2>
          </div>

          <div v-if="!dataSelecionada" class="sc-empty">
            <p>Selecione uma data para visualizar os horários.</p>
          </div>
          <div v-else class="sc-grid-3" style="gap: 8px;">
            <div
              v-for="h in horarios"
              :key="h"
              class="sc-card"
              style="padding: 10px; font-size: 13px;"
              :style="getEstiloSlot(h)"
            >
              <div class="sc-flex-between">
                <span style="font-weight: 700;">{{ h }}</span>
                <button
                  v-if="isBloqueado(h)"
                  class="sc-btn sc-btn-ghost sc-btn-sm"
                  style="padding: 2px 6px; font-size: 10px;"
                  @click="desbloquearHorario(h)"
                >
                  ✕
                </button>
              </div>
              <div style="font-size: 10px; margin-top: 4px;" class="sc-muted">
                {{ getStatusTexto(h) }}
              </div>
            </div>
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
  name: "EditarHorarios",
  components: { TopbarDono },
  data() {
    return {
      quadraId: localStorage.getItem("quadraId") || null,
      dataSelecionada: new Date().toISOString().slice(0, 10),
      horarioSelecionado: "",
      diaInteiro: false,
      descricaoBloqueio: "",
      horarios: Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`),
      horariosDia: [],
      hojeISO: new Date().toISOString().slice(0, 10)
    };
  },
  watch: {
    dataSelecionada(val) {
      if (val) this.carregarHorarios();
    },
  },
  async created() {
    if (this.dataSelecionada) await this.carregarHorarios();
  },
  methods: {
    async carregarHorarios() {
      try {
        if (!this.quadraId) {
          const minhas = await api.getMinhasQuadras();
          if (minhas.length > 0) this.quadraId = minhas[0].id;
        }
        if (this.quadraId) {
          this.horariosDia = await api.getHorariosOcupados(this.quadraId, this.dataSelecionada);
        }
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      }
    },
    isBloqueado(h) {
      return this.horariosDia.some(item => item.horario === h);
    },
    getStatusTexto(h) {
      return this.isBloqueado(h) ? "Bloqueado" : "Livre";
    },
    getEstiloSlot(h) {
      if (this.isBloqueado(h)) {
        return "border-color: rgba(248,113,113,0.4); background: var(--sc-red-subtle); color: var(--sc-red);";
      }
      return "border-color: rgba(74,222,128,0.3); background: var(--sc-primary-subtle); color: var(--sc-primary);";
    },
    async confirmarBloqueio() {
      if (!this.dataSelecionada) {
        alert("Selecione uma data.");
        return;
      }
      try {
        if (this.diaInteiro) {
          await api.marcarDataOcupada(this.quadraId, this.dataSelecionada);
          alert("Dia inteiro marcado como bloqueado!");
        } else {
          if (!this.horarioSelecionado) {
            alert("Selecione o horário.");
            return;
          }
          await api.marcarHorarioOcupado(this.quadraId, this.dataSelecionada, this.horarioSelecionado);
          alert("Horário bloqueado!");
        }
        await this.carregarHorarios();
        this.horarioSelecionado = "";
        this.descricaoBloqueio = "";
      } catch (e) {
        alert(e.message || "Erro ao bloquear.");
      }
    },
    async desbloquearHorario(h) {
      const item = this.horariosDia.find(i => i.horario === h);
      if (item) {
        try {
          await api.desmarcarHorarioOcupado(this.quadraId, item.id);
          await this.carregarHorarios();
        } catch (e) {
          alert("Erro ao desbloquear.");
        }
      }
    }
  }
};
</script>