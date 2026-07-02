<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <!-- Header -->
    <header class="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <router-link to="/" class="flex items-center gap-2">
        <img :src="logo" alt="SportCourt" class="h-8 w-auto" />
        <span class="font-extrabold text-lg tracking-tight text-slate-900">SportCourt</span>
      </router-link>
      <router-link to="/login"
        class="text-sm font-bold text-slate-600 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 hover:border-slate-300 transition-all">
        Já tenho conta
      </router-link>
    </header>

    <!-- Conteúdo -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div class="w-full max-w-md">
        <h1 class="text-2xl font-black text-slate-900 text-center mb-2">Como você quer usar?</h1>
        <p class="text-slate-400 text-sm text-center mb-8">Escolha o seu perfil para começar</p>

        <!-- Card Jogador -->
        <router-link to="/cadastro-jogador"
          class="flex items-center gap-5 w-full bg-white border-2 border-slate-200 rounded-2xl p-6 mb-4 shadow-sm hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="flex-1">
            <p class="font-extrabold text-slate-900 text-base mb-0.5">Sou Jogador</p>
            <p class="text-sm text-slate-500">Encontre quadras e faça reservas</p>
          </div>
          <svg class="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </router-link>

        <!-- Card Dono de Quadra -->
        <router-link to="/cadastro-dono"
          class="flex items-center gap-5 w-full bg-white border-2 border-slate-200 rounded-2xl p-6 mb-8 shadow-sm hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="flex-1">
            <p class="font-extrabold text-slate-900 text-base mb-0.5">Sou Dono de Quadra</p>
            <p class="text-sm text-slate-500">Cadastre e gerencie sua arena</p>
          </div>
          <svg class="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </router-link>

        <p class="text-center text-sm text-slate-500">
          Já tem uma conta?
          <router-link to="/login" class="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1">Entrar na conta</router-link>
        </p>
      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: "EscolherPerfil",
  data() {
    return {
      logo: require("@/assets/logosite1.png"),
    };
  },
};
</script>
