<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div style="margin-bottom: 24px;">
        <h1 class="sc-h2">Gerenciamento de Perfis (Subcontas)</h1>
        <p class="sc-muted">Crie acessos adicionais para funcionários, gerentes ou atendentes da arena.</p>
      </div>

      <div class="sc-grid-2">
        <!-- Formulário de cadastro de subconta -->
        <div class="sc-card" style="padding: 24px;">
          <h2 class="sc-h3" style="margin-bottom: 16px;">Criar Nova Subconta</h2>

          <div class="sc-form-group">
            <label class="sc-label">Nome do Funcionário</label>
            <input type="text" class="sc-input" v-model="form.nome" placeholder="Ex: Carlos Oliveira" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">E-mail de Acesso</label>
            <input type="email" class="sc-input" v-model="form.email" placeholder="carlos@suaarena.com" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Senha Inicial</label>
            <input type="password" class="sc-input" v-model="form.senha" placeholder="••••••••" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Cargo / Função (opcional)</label>
            <input type="text" class="sc-input" v-model="form.cargo" placeholder="Ex: Recepcionista, Gerente Noturno" />
          </div>

          <button class="sc-btn sc-btn-primary sc-btn-lg" @click="adicionarSubconta">
            + Adicionar Subconta
          </button>
        </div>

        <!-- Lista de subcontas -->
        <div class="sc-card" style="padding: 24px;">
          <h2 class="sc-h3" style="margin-bottom: 16px;">Contas Cadastradas</h2>

          <div v-if="subcontas.length === 0" class="sc-empty">
            <div class="sc-empty-icon">🔑</div>
            <p>Nenhuma subconta criada ainda.</p>
          </div>
          <div v-else style="display: flex; flex-direction: column; gap: 12px;">
            <div
              v-for="(s, idx) in subcontas"
              :key="idx"
              class="sc-flex-between"
              style="padding: 14px; border-radius: var(--sc-radius); border: 1px solid var(--sc-border); background: var(--sc-bg-elevated);"
            >
              <div>
                <div style="font-weight: 700; font-size: 15px;">{{ s.nome }}</div>
                <div class="sc-muted" style="font-size: 12px;">{{ s.email }} {{ s.cargo ? `• ${s.cargo}` : '' }}</div>
              </div>
              <button class="sc-btn sc-btn-danger sc-btn-sm" @click="removerSubconta(idx)">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarDono from '@/components/TopbarDono.vue';

export default {
  name: 'SubcontasPage',
  components: { TopbarDono },
  data() {
    return {
      subcontas: [],
      form: {
        nome: '',
        email: '',
        senha: '',
        cargo: ''
      }
    };
  },
  methods: {
    adicionarSubconta() {
      if (!this.form.nome.trim() || !this.form.email.trim() || !this.form.senha.trim()) {
        alert('Preencha nome, e-mail e senha.');
        return;
      }
      this.subcontas.push({ ...this.form });
      this.form = { nome: '', email: '', senha: '', cargo: '' };
      alert('Subconta criada!');
    },
    removerSubconta(idx) {
      if (confirm('Deseja remover o acesso deste funcionário?')) {
        this.subcontas.splice(idx, 1);
      }
    }
  }
};
</script>
