<template>
  <div class="sc-page sc-flex" style="min-height: 100vh; justify-content: center; align-items: center; padding: 24px;">
    <div class="sc-card" style="width: 100%; max-width: 440px; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <router-link to="/" class="sc-topbar-logo" style="justify-content: center; margin-bottom: 16px;">
          <img :src="logo" alt="SportCourt" style="height: 40px;" />
          <span style="font-size: 24px;">SportCourt</span>
        </router-link>
        <h1 class="sc-h2" style="font-size: 22px; margin-bottom: 6px;">Bem-vindo de volta</h1>
        <p class="sc-muted">Entre para acessar sua conta na plataforma</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="sc-form-group">
          <label class="sc-label">E-mail</label>
          <div class="sc-input-icon-wrap">
            <svg class="sc-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
            <input type="email" class="sc-input" v-model="email" placeholder="seu@email.com" required />
          </div>
        </div>

        <div class="sc-form-group">
          <div class="sc-flex-between" style="margin-bottom: 6px;">
            <label class="sc-label" style="margin: 0;">Senha</label>
            <a href="#" class="sc-muted" style="font-size: 12px; text-decoration: none;">Esqueceu a senha?</a>
          </div>
          <div class="sc-input-icon-wrap">
            <svg class="sc-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input :type="mostrarSenha ? 'text' : 'password'" class="sc-input" v-model="senha" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" class="sc-btn sc-btn-primary sc-btn-lg" :disabled="carregando" style="margin-top: 8px;">
          {{ carregando ? 'Entrando...' : 'Entrar na Conta →' }}
        </button>
      </form>

      <div style="text-align: center; margin-top: 24px;" class="sc-muted">
        Ainda não tem uma conta?
        <router-link to="/escolher-perfil" style="color: var(--sc-primary); font-weight: 700; text-decoration: none; margin-left: 4px;">
          Cadastre-se
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logosite.png";
import { api } from "@/api";

export default {
  name: "PaginaLogin",
  data() {
    return {
      email: "",
      senha: "",
      mostrarSenha: false,
      carregando: false,
      logo
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.senha) return;
      try {
        this.carregando = true;
        const res = await api.login(this.email, this.senha);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        if (res.user.tipo === "dono") {
          const quadras = await api.getMinhasQuadras().catch(() => []);
          if (quadras && quadras.length > 0) {
            localStorage.setItem("quadraId", quadras[0].id);
            this.$router.push("/minhas-quadras");
          } else {
            this.$router.push("/cadastro-quadra-parte1");
          }
        } else {
          this.$router.push("/reserva");
        }
      } catch (err) {
        alert(err.message || "Erro ao efetuar login.");
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>
