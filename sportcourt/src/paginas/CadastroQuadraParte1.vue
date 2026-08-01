<template>
  <div class="sc-page sc-flex" style="min-height: 100vh; flex-direction: column;">
    <header class="sc-topbar" style="position: relative; width: 100%; z-index: 10; background: var(--sc-bg); border-bottom: 1px solid var(--sc-border);">
      <router-link to="/" class="sc-topbar-logo">
        <img :src="logo" alt="SportCourt" style="height: 38px; width: auto;" />
      </router-link>
      <span class="sc-badge sc-badge-green">Etapa 1 de 2</span>
    </header>

    <main class="sc-container-sm sc-flex" style="flex: 1; align-items: center; justify-content: center; padding: 48px 16px 32px;">
      <div class="sc-card" style="width: 100%; padding: 32px;">
        <h1 class="sc-h2" style="margin-bottom: 6px;">Informações da Arena</h1>
        <p class="sc-muted" style="margin-bottom: 24px;">Passo 1: Nome, localização e número de quadras</p>

        <form @submit.prevent="proximaParte">
          <div class="sc-form-group">
            <label class="sc-label">Nome da Arena / Quadra *</label>
            <input type="text" class="sc-input" v-model="nomeQuadra" placeholder="Ex: Arena SportCourt Central" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Endereço Completo *</label>
            <input type="text" class="sc-input" v-model="endereco" placeholder="Rua, número, bairro" required />
          </div>

          <div class="sc-form-row">
            <div class="sc-form-group">
              <label class="sc-label">Cidade *</label>
              <input type="text" class="sc-input" v-model="cidade" placeholder="Ex: São Paulo" required />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Telefone de Contato *</label>
              <input type="text" class="sc-input" v-model="telefone" placeholder="(00) 00000-0000" required />
            </div>
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Quantidade de Quadras no Espaço</label>
            <select class="sc-input" v-model="quantidadeQuadras">
              <option v-for="n in 10" :key="n" :value="n">{{ n }} {{ n === 1 ? 'quadra' : 'quadras' }}</option>
            </select>
          </div>

          <button type="submit" class="sc-btn sc-btn-primary sc-btn-lg">
            Continuar para Detalhes
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import logo from "@/assets/logosite1.png";

export default {
  name: "CadastroQuadraParte1",
  data() {
    return {
      logo,
      nomeQuadra: "",
      endereco: "",
      cidade: "",
      telefone: "",
      quantidadeQuadras: 1
    };
  },
  created() {
    const dadosSalvos = localStorage.getItem("cadastroQuadraTemp");
    if (dadosSalvos) {
      try {
        const parsed = JSON.parse(dadosSalvos);
        this.nomeQuadra = parsed.nomeQuadra || "";
        this.endereco = parsed.endereco || "";
        this.cidade = parsed.cidade || "";
        this.telefone = parsed.telefone || "";
        this.quantidadeQuadras = parsed.quantidadeQuadras || 1;
      } catch (_e) { /* ignorado */ }
    }
  },
  methods: {
    proximaParte() {
      const temp = {
        nomeQuadra: this.nomeQuadra,
        endereco: this.endereco,
        cidade: this.cidade,
        telefone: this.telefone,
        quantidadeQuadras: this.quantidadeQuadras
      };
      localStorage.setItem("cadastroQuadraTemp", JSON.stringify(temp));
      this.$router.push("/cadastro-quadra-parte2");
    }
  }
};
</script>
