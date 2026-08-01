<template>
  <div class="sc-page sc-flex" style="min-height: 100vh; flex-direction: column;">
    <header class="sc-topbar" style="position: sticky; top: 0; z-index: 100; background: rgba(15, 17, 23, 0.95); backdrop-filter: blur(12px);">
      <div class="sc-flex sc-gap-2">
        <button @click="voltarPasso" class="sc-btn sc-btn-ghost sc-btn-sm" aria-label="Voltar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          <span>Voltar</span>
        </button>
        <router-link to="/" class="sc-topbar-logo" style="margin-left: 8px;">
          <img :src="logo" alt="SportCourt" style="height: 34px; width: auto;" />
        </router-link>
      </div>
      <span class="sc-badge sc-badge-green">Etapa 2 de 2</span>
    </header>

    <main class="sc-container-sm sc-flex" style="flex: 1; align-items: center; justify-content: center; padding: 48px 16px 32px;">
      <div class="sc-card" style="width: 100%; padding: 32px;">
        <h1 class="sc-h2" style="margin-bottom: 6px;">Personalize a Quadra</h1>
        <p class="sc-muted" style="margin-bottom: 24px;">Preço, esporte, foto e horários de funcionamento</p>

        <!-- Preview da Foto -->
        <div style="margin-bottom: 24px; text-align: center;">
          <label style="cursor: pointer; display: inline-block;">
            <input type="file" accept="image/*" @change="carregarImagem" hidden />
            <div class="sc-avatar" style="width: 120px; height: 120px; border-radius: var(--sc-radius-xl); border: 2px dashed var(--sc-primary); display: flex; align-items: center; justify-content: center;">
              <img v-if="quadraAtualObj.fotoPreview" :src="quadraAtualObj.fotoPreview" alt="Foto da quadra" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--sc-radius-xl);" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-primary);"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div class="sc-muted" style="font-size: 12px; margin-top: 8px; color: var(--sc-primary); font-weight: 600;">
              {{ quadraAtualObj.fotoPreview ? 'Trocar Foto' : 'Adicionar Foto da Quadra' }}
            </div>
          </label>
        </div>

        <form @submit.prevent="salvarQuadra">
          <div class="sc-form-group">
            <label class="sc-label">Esporte Principal *</label>
            <select class="sc-input" v-model="quadraAtualObj.esporte" required>
              <option value="">Selecione o esporte</option>
              <option v-for="e in esportes" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Preço por Hora (R$) *</label>
            <input type="number" class="sc-input" v-model="quadraAtualObj.preco" placeholder="0.00" step="0.01" required />
          </div>

          <div class="sc-form-row">
            <div class="sc-form-group">
              <label class="sc-label">Horário de Abertura</label>
              <select class="sc-input" v-model="quadraAtualObj.horaAbre">
                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Horário de Fechamento</label>
              <select class="sc-input" v-model="quadraAtualObj.horaFecha">
                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Descrição do Espaço</label>
            <textarea class="sc-textarea" v-model="quadraAtualObj.descricao" placeholder="Destaque as qualidades da sua quadra..."></textarea>
          </div>

          <button type="submit" class="sc-btn sc-btn-primary sc-btn-lg" :disabled="salvando">
            {{ salvando ? 'Finalizando...' : 'Concluir e Ir para Painel' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import logo from "@/assets/logosite1.png";
import { api } from "@/api";

export default {
  name: "CadastroQuadraParte2",
  data() {
    return {
      logo,
      quadraAtualObj: {
        esporte: "Futebol",
        preco: "",
        horaAbre: "08:00",
        horaFecha: "22:00",
        descricao: "",
        fotoPreview: null,
        arquivoFoto: null
      },
      esportes: ["Futebol", "Futsal", "Society", "Beach Tennis", "Vôlei", "Basquete", "Tênis", "Padel"],
      horarios: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
      salvando: false,
      dadosParte1: {}
    };
  },
  created() {
    const p1 = localStorage.getItem("cadastroQuadraTemp");
    if (p1) {
      try { this.dadosParte1 = JSON.parse(p1); } catch (_e) { /* ignorado */ }
    }
  },
  methods: {
    voltarPasso() {
      this.$router.push("/cadastro-quadra-parte1");
    },
    carregarImagem(e) {
      const file = e.target.files[0];
      if (file) {
        this.quadraAtualObj.arquivoFoto = file;
        this.quadraAtualObj.fotoPreview = URL.createObjectURL(file);
      }
    },
    async salvarQuadra() {
      try {
        this.salvando = true;
        const payload = {
          nomeQuadra: this.dadosParte1.nomeQuadra || "Minha Quadra",
          endereco: this.dadosParte1.endereco || "",
          cidade: this.dadosParte1.cidade || "",
          telefone: this.dadosParte1.telefone || "",
          preco: this.quadraAtualObj.preco,
          descricao: this.quadraAtualObj.descricao,
          horario: `${this.quadraAtualObj.horaAbre} - ${this.quadraAtualObj.horaFecha}`,
          esporte: this.quadraAtualObj.esporte
        };

        const res = await api.createQuadra(payload, this.quadraAtualObj.arquivoFoto);
        localStorage.setItem("quadraId", res.id);
        localStorage.removeItem("cadastroQuadraTemp");
        alert("Quadra cadastrada com sucesso!");
        this.$router.push("/minhas-quadras");
      } catch (err) {
        alert(err.message || "Erro ao salvar quadra.");
      } finally {
        this.salvando = false;
      }
    }
  }
};
</script>
