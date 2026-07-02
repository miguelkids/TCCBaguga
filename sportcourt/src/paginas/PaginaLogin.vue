<template>
  <div class="min-h-screen bg-slate-950 flex font-sans">

    <!-- Lado Visual (Esquerdo) -->
    <div class="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-slate-900">
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>

      <router-link to="/" class="flex items-center gap-3 z-10">
        <img :src="logo" alt="SportCourt" class="h-9 w-auto" />
        <span class="font-extrabold text-xl tracking-tight text-white">SportCourt</span>
      </router-link>

      <div class="z-10">
        <h1 class="text-4xl font-black text-white leading-tight mb-4">
          Gerencie sua quadra<br />
          <span class="text-emerald-400">de forma inteligente</span>
        </h1>
        <p class="text-slate-400 text-base leading-relaxed mb-10">
          A plataforma completa para proprietários de arenas esportivas e jogadores que amam o esporte.
        </p>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-center">
            <p class="text-2xl font-black text-emerald-400 mb-1">+500</p>
            <p class="text-xs text-slate-400 font-medium">Jogadores</p>
          </div>
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-center">
            <p class="text-2xl font-black text-emerald-400 mb-1">47</p>
            <p class="text-xs text-slate-400 font-medium">Quadras</p>
          </div>
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-center">
            <p class="text-2xl font-black text-emerald-400 mb-1">★ 4.9</p>
            <p class="text-xs text-slate-400 font-medium">Avaliação</p>
          </div>
        </div>
      </div>

      <p class="text-slate-600 text-sm z-10">© 2026 SportCourt. Todos os direitos reservados.</p>
    </div>

    <!-- Lado do Formulário (Direito) -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 bg-white">
      <!-- Logo mobile -->
      <router-link to="/" class="flex lg:hidden items-center gap-2 mb-8">
        <img :src="logo" alt="SportCourt" class="h-8 w-auto" />
        <span class="font-extrabold text-lg tracking-tight text-slate-900">SportCourt</span>
      </router-link>

      <div class="w-full max-w-sm">
        <h2 class="text-2xl font-black text-slate-900 mb-1">Vamos fazer seu login</h2>
        <p class="text-slate-400 text-sm mb-8">Bem-vindo de volta, sentimos sua falta.</p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <!-- E-mail -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">E-mail</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
              <input id="input-email-login" type="email" v-model="email" placeholder="seu@email.com" required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <!-- Senha -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Senha</label>
              <a href="#" class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Esqueceu a senha?</a>
            </div>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="input-senha-login" :type="mostrarSenha ? 'text' : 'password'" v-model="senha" placeholder="••••••••" required
                class="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              <button type="button" @click="mostrarSenha = !mostrarSenha"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-0 bg-transparent border-none cursor-pointer">
                <img :src="olho" alt="Mostrar senha" class="w-5 h-5 opacity-60" />
              </button>
            </div>
          </div>

          <button id="btn-login" type="submit" :disabled="carregando"
            class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-65 disabled:pointer-events-none mt-2">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Divisor -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-slate-200"></div>
          <span class="text-xs text-slate-400 font-medium">ou continue com</span>
          <div class="flex-1 h-px bg-slate-200"></div>
        </div>

        <!-- Botões Sociais -->
        <div class="flex gap-3">
          <button type="button"
            class="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700">
            <img :src="google" alt="Google" class="w-5 h-5" />
            Google
          </button>
          <button type="button"
            class="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700">
            <img :src="apple" alt="Apple" class="w-5 h-5" />
            Apple
          </button>
        </div>

        <p class="text-center text-sm text-slate-500 mt-6">
          Não tem uma conta?
          <router-link to="/escolher-perfil" class="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1">Cadastre-se grátis</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "PaginaLogin",
  data() {
    return {
      email: "",
      senha: "",
      mostrarSenha: false,
      carregando: false,
      logo: require("@/assets/logosite1.png"),
      olho: require("@/assets/olho.png"),
      google: require("@/assets/logogoogle.png"),
      apple: require("@/assets/logoapple.png"),
    };
  },
  methods: {
    async handleLogin() {
      this.carregando = true;
      try {
        const { token, user } = await api.login(this.email, this.senha);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.tipo === "dono") {
          const quadras = await api.getQuadras();
          const minhasQuadras = quadras.filter(q => q.donoId === user.id);
          if (minhasQuadras.length > 0) {
            localStorage.setItem("quadraId", minhasQuadras[0].id);
            localStorage.setItem("quadraInfo", JSON.stringify(minhasQuadras[0]));
            this.$router.push("/confirmar-quadra");
          } else {
            this.$router.push("/cadastro-quadra-parte1");
          }
        } else if (user.tipo === "jogador") {
          this.$router.push("/reserva");
        } else {
          alert("Tipo de perfil inválido. Entre em contato com o suporte.");
        }
      } catch (err) {
        alert("Erro ao entrar: " + (err.message || "Verifique seus dados."));
      } finally {
        this.carregando = false;
      }
    },
  },
};
</script>
