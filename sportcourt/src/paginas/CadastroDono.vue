<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <!-- Header -->
    <header class="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm">
      <router-link to="/escolher-perfil" id="btn-voltar-dono"
        class="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mr-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </router-link>
      <router-link to="/" class="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <img :src="logo" alt="SportCourt" class="h-8 w-auto" />
      </router-link>
    </header>

    <!-- Formulário -->
    <main class="flex-1 flex flex-col items-center px-6 py-10">
      <div class="w-full max-w-sm">
        <!-- Badge -->
        <div class="flex justify-center mb-5">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Dono de Arena
          </span>
        </div>

        <h1 class="text-2xl font-black text-slate-900 text-center mb-1">Crie sua conta</h1>
        <p class="text-slate-400 text-sm text-center mb-8">Preencha os dados para começar</p>

        <form @submit.prevent="handleCadastro" class="flex flex-col gap-4">
          <!-- Nome -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Nome completo</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input id="input-nome-dono" type="text" v-model="nome" placeholder="Seu nome completo" required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <!-- Usuário -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Nome de usuário</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">@</span>
              <input id="input-usuario-dono" type="text" v-model="usuario" placeholder="seuusuario" required
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <!-- Telefone -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Telefone</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <input id="input-telefone-dono" type="text" v-model="telefone" placeholder="(00) 00000-0000"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <!-- E-mail -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">E-mail</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
              <input id="input-email-dono" type="email" v-model="email" placeholder="seu@email.com" required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <!-- Senha -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Senha</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="input-senha-dono" type="password" v-model="senha" placeholder="••••••••" required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <button id="btn-cadastrar-dono" type="submit" :disabled="carregando"
            class="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-65 disabled:pointer-events-none mt-2">
            {{ carregando ? 'Criando conta...' : 'Criar conta como Proprietário' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-6">
          Já tem uma conta?
          <router-link to="/login" class="text-blue-600 font-bold hover:text-blue-700 transition-colors ml-1">Entrar agora</router-link>
        </p>
      </div>
    </main>

  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "CadastroDono",
  data() {
    return {
      nome: "",
      usuario: "",
      telefone: "",
      email: "",
      senha: "",
      carregando: false,
      logo: require("@/assets/logosite1.png"),
    };
  },
  methods: {
    async handleCadastro() {
      this.carregando = true;
      try {
        await api.register({ nome: this.nome, usuario: this.usuario, telefone: this.telefone, email: this.email, senha: this.senha, tipo: "dono" });
        alert("Conta criada com sucesso!");
        this.$router.push("/login");
      } catch (err) {
        alert("Erro ao criar conta: " + (err.message || "Tente novamente."));
      } finally {
        this.carregando = false;
      }
    },
  },
};
</script>
