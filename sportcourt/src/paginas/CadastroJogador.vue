<template>
  <div class="sc-page sc-flex" style="min-height: 100vh; flex-direction: column;">
    <header class="sc-topbar">
      <router-link to="/" class="sc-topbar-logo">
        <img :src="logo" alt="SportCourt" />
        <span>SportCourt</span>
      </router-link>
      <router-link to="/login" class="sc-btn sc-btn-ghost sc-btn-sm">
        Já tenho conta
      </router-link>
    </header>

    <main class="sc-container-sm sc-flex" style="flex: 1; align-items: center; justify-content: center; padding: 32px 16px;">
      <div class="sc-card" style="width: 100%; padding: 32px;">
        <div class="sc-flex-between" style="margin-bottom: 16px;">
          <span class="sc-badge sc-badge-green">Perfil Jogador</span>
          <router-link to="/escolher-perfil" class="sc-muted" style="font-size: 12px; text-decoration: none;">Alterar perfil</router-link>
        </div>

        <h1 class="sc-h2" style="margin-bottom: 6px;">Crie sua conta no SportCourt</h1>
        <p class="sc-muted" style="margin-bottom: 24px;">Preencha os dados abaixo para agendar suas partidas</p>

        <form @submit.prevent="handleCadastro">
          <div class="sc-form-group">
            <label class="sc-label">Nome Completo</label>
            <input type="text" class="sc-input" v-model="nome" placeholder="Seu nome" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Nome de Usuário</label>
            <input type="text" class="sc-input" v-model="usuario" placeholder="seuusuario" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Telefone (WhatsApp)</label>
            <input type="text" class="sc-input" v-model="telefone" placeholder="(00) 00000-0000" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">E-mail</label>
            <input type="email" class="sc-input" v-model="email" placeholder="seu@email.com" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Senha</label>
            <input type="password" class="sc-input" v-model="senha" placeholder="••••••••" required />
          </div>

          <button type="submit" class="sc-btn sc-btn-primary sc-btn-lg" :disabled="carregando">
            {{ carregando ? 'Cadastrando...' : 'Criar Conta de Jogador' }}
          </button>
        </form>

        <div style="text-align: center; margin-top: 24px;" class="sc-muted">
          Já tem uma conta?
          <router-link to="/login" style="color: var(--sc-primary); font-weight: 700; text-decoration: none; margin-left: 4px;">
            Entrar
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import logo from "@/assets/logosite.png";
import { api } from "@/api";

export default {
  name: "CadastroJogador",
  data() {
    return {
      logo,
      nome: "",
      usuario: "",
      telefone: "",
      email: "",
      senha: "",
      carregando: false
    };
  },
  methods: {
    async handleCadastro() {
      try {
        this.carregando = true;
        await api.register({
          nome: this.nome,
          usuario: this.usuario,
          telefone: this.telefone,
          email: this.email,
          senha: this.senha,
          tipo: "jogador"
        });
        alert("Conta criada com sucesso!");
        this.$router.push("/login");
      } catch (err) {
        alert(err.message || "Erro ao efetuar cadastro.");
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>
