<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded" style="max-width: 800px;">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">Editar Quadra</h1>
          <p class="sc-muted">Atualize fotos, preços, localização e horários de funcionamento</p>
        </div>
        <button class="sc-btn sc-btn-secondary" @click="$router.push('/confirmar-quadra')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Voltar
        </button>
      </div>

      <div class="sc-card" style="padding: 24px;">
        <form @submit.prevent="salvar">
          <!-- Foto da Quadra -->
          <div style="text-align: center; margin-bottom: 24px;">
            <label style="cursor: pointer; display: inline-block;">
              <input type="file" @change="carregarImagem" accept="image/*" hidden />
              <div class="sc-avatar" style="width: 140px; height: 140px; border-radius: var(--sc-radius-xl); border: 2px dashed var(--sc-primary); display: flex; align-items: center; justify-content: center;">
                <img v-if="fotoPreview || fotoUrlAtual" :src="fotoPreview || fotoUrlAtual" alt="Foto da quadra" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--sc-radius-xl);" />
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-primary);"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div class="sc-muted" style="font-size: 13px; margin-top: 8px; color: var(--sc-primary); font-weight: 600;">
                Clique para trocar a foto
              </div>
            </label>
          </div>

          <div class="sc-grid-2" style="gap: 16px;">
            <div class="sc-form-group">
              <label class="sc-label">Nome da Arena / Quadra *</label>
              <input type="text" class="sc-input" v-model="nomeQuadra" placeholder="Ex: Quadra 1 Society" required />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Esporte Principal *</label>
              <select class="sc-input" v-model="esporte" required>
                <option value="">Selecione</option>
                <option v-for="e in esportes" :key="e" :value="e">{{ e }}</option>
              </select>
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Endereço Completo *</label>
              <input type="text" class="sc-input" v-model="endereco" placeholder="Rua, número" required />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Cidade *</label>
              <input type="text" class="sc-input" v-model="cidade" placeholder="Cidade" required />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Telefone de Contato *</label>
              <input type="text" class="sc-input" v-model="telefone" placeholder="(00) 00000-0000" required />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Preço por Hora (R$) *</label>
              <input type="number" class="sc-input" v-model="preco" step="0.01" placeholder="0.00" required />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Horário de Abertura</label>
              <select class="sc-input" v-model="horaAbertura">
                <option v-for="h in horarios" :key="'ab-'+h" :value="h">{{ h }}</option>
              </select>
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Horário de Fechamento</label>
              <select class="sc-input" v-model="horaFechamento">
                <option v-for="h in horarios" :key="'fe-'+h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>

          <div class="sc-form-group" style="margin-top: 16px;">
            <label class="sc-label">Descrição do Espaço</label>
            <textarea class="sc-textarea" v-model="descricao" placeholder="Escreva informações sobre iluminação, vestiários, gramado, etc."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 24px; border-top: 1px solid var(--sc-border); padding-top: 20px;">
            <button type="submit" class="sc-btn sc-btn-primary" :disabled="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "EditarQuadra",
  components: { TopbarDono },
  data() {
    return {
      quadraId: localStorage.getItem("quadraId") || "",
      nomeQuadra: "",
      endereco: "",
      cidade: "",
      telefone: "",
      preco: "",
      esporte: "",
      descricao: "",
      horaAbertura: "08:00",
      horaFechamento: "22:00",
      fotoPreview: null,
      arquivoFoto: null,
      fotoUrlAtual: null,
      salvando: false,
      esportes: ["Futebol", "Futsal", "Society", "Beach Tennis", "Vôlei", "Basquete", "Tênis", "Padel"],
      horarios: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`)
    };
  },
  async created() {
    await this.carregarQuadra();
  },
  methods: {
    async carregarQuadra() {
      if (!this.quadraId) return;
      try {
        const q = await api.getQuadra(this.quadraId);
        this.nomeQuadra = q.nome_quadra || q.nomeQuadra || "";
        this.endereco = q.endereco || "";
        this.cidade = q.cidade || "";
        this.telefone = q.telefone || "";
        this.preco = q.preco || "";
        this.esporte = q.esporte || "";
        this.descricao = q.descricao || "";
        if (q.horario && q.horario.includes("-")) {
          const parts = q.horario.split("-");
          this.horaAbertura = parts[0].trim();
          this.horaFechamento = parts[1].trim();
        }
        if (q.foto_url || q.fotoUrl) {
          const url = q.foto_url || q.fotoUrl;
          this.fotoUrlAtual = url.startsWith("http") ? url : `http://localhost:3006${url}`;
        }
      } catch (err) {
        console.error("Erro ao carregar quadra:", err);
      }
    },
    carregarImagem(e) {
      const file = e.target.files[0];
      if (file) {
        this.arquivoFoto = file;
        this.fotoPreview = URL.createObjectURL(file);
      }
    },
    async salvar() {
      try {
        this.salvando = true;
        const payload = {
          nomeQuadra: this.nomeQuadra,
          endereco: this.endereco,
          cidade: this.cidade,
          telefone: this.telefone,
          preco: this.preco,
          esporte: this.esporte,
          descricao: this.descricao,
          horario: `${this.horaAbertura} - ${this.horaFechamento}`
        };

        await api.atualizarQuadra(this.quadraId, payload, this.arquivoFoto);
        alert("Quadra atualizada com sucesso!");
        this.$router.push("/confirmar-quadra");
      } catch (err) {
        alert(err.message || "Erro ao atualizar quadra.");
      } finally {
        this.salvando = false;
      }
    }
  }
};
</script>
