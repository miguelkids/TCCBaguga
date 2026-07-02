<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <!-- Header -->
    <header class="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm">
      <router-link to="/perfil"
        class="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mr-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </router-link>
      <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Passo 1 de 2</span>
        <span class="text-sm font-extrabold text-slate-800">Nova Quadra</span>
      </div>
    </header>

    <!-- Formulário -->
    <main class="flex-1 flex flex-col items-center px-6 py-10">
      <div class="w-full max-w-md">
        
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
          <h1 class="text-2xl font-black text-slate-900 mb-1">Dados da Arena</h1>
          <p class="text-slate-400 text-sm mb-6">Informe as informações básicas do seu espaço.</p>

          <form @submit.prevent="proximaParte" class="flex flex-col gap-4">
            <!-- Nome da Quadra -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Nome da Quadra *</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input type="text" v-model="nomeQuadra" placeholder="Ex: Arena Central" required
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <!-- Endereço -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Endereço *</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <input type="text" v-model="endereco" placeholder="Rua, número, bairro" required
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <!-- Cidade -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Cidade *</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <input type="text" v-model="cidade" placeholder="Ex: São Paulo" required
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <!-- Telefone -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Telefone</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input type="text" v-model="telefone" placeholder="(00) 00000-0000"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <!-- Quantidade de Quadras -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantidade de quadras</label>
              <select v-model="quantidadeQuadras"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                <option v-for="n in 10" :key="n" :value="n">{{ n }} {{ n === 1 ? 'quadra' : 'quadras' }}</option>
              </select>
            </div>

            <button type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 mt-2">
              Continuar
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </form>
        </div>
      </div>
    </main>

    <!-- Bottom Nav Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg">
      <router-link to="/confirmar-quadra" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-6 transition-colors" :class="$route.path === '/confirmar-quadra' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Menu</span>
      </router-link>
      <router-link to="/reservas" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-6 transition-colors" :class="$route.path === '/reservas' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-6 transition-colors" :class="$route.path === '/perfil' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "CadastroQuadraParte1",
  data() {
    return {
      nomeQuadra: "",
      endereco: "",
      telefone: "",
      cidade: "",
      quantidadeQuadras: 1,
    };
  },
  methods: {
    proximaParte() {
      if (!this.nomeQuadra || !this.endereco || !this.cidade) {
        alert("Preencha os campos obrigatórios: Nome, Endereço e Cidade.");
        return;
      }
      localStorage.setItem("cadastroQuadraParte1", JSON.stringify({
        nomeQuadra: this.nomeQuadra,
        endereco: this.endereco,
        telefone: this.telefone,
        cidade: this.cidade,
        quantidadeQuadras: this.quantidadeQuadras,
      }));
      this.$router.push("/cadastro-quadra-parte2");
    },
  },
};
</script>
