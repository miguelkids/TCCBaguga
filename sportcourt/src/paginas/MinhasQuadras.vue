<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-8 relative overflow-hidden">
    <TopbarDono />

    <!-- Glow de Fundo -->
    <div class="absolute top-24 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <main class="flex-grow max-w-5xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">

      <!-- Cabeçalho -->
      <div class="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div class="space-y-0.5">
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Minhas Quadras</h1>
          <p class="text-slate-500 text-sm">Selecione uma quadra para gerenciá-la.</p>
        </div>
        <button class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-blue-500/20 transition-all flex-shrink-0" @click="adicionarNovaQuadra">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova Quadra
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center py-24 text-slate-400 gap-4">
        <div class="w-9 h-9 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="text-sm font-medium">Carregando suas quadras...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="quadras.length === 0" class="flex flex-col items-center py-24 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h3 class="text-sm font-bold text-slate-700 mb-1">Nenhuma quadra cadastrada</h3>
        <p class="text-xs text-slate-400 mb-5">Cadastre seu espaço para começar a receber reservas.</p>
        <button class="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-md hover:-translate-y-0.5 transition-all" @click="$router.push('/cadastro-quadra-parte1')">
          Cadastrar minha primeira quadra
        </button>
      </div>

      <!-- Lista de Quadras -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="q in quadras"
          :key="q.id"
          class="bg-white border rounded-2xl overflow-hidden shadow-card transition-all duration-200 hover:shadow-soft"
          :class="q.id === quadraAtiva ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-slate-200'"
        >
          <!-- Foto -->
          <div class="relative w-full h-44 bg-slate-100">
            <img v-if="q.fotoUrl" :src="fotoUrl(q)" :alt="q.nomeQuadra" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <!-- Badge Ativa -->
            <span v-if="q.id === quadraAtiva" class="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">Ativa</span>
          </div>

          <!-- Info + Ações -->
          <div class="p-5">
            <div class="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div class="min-w-0">
                <h2 class="text-base font-extrabold text-slate-900 leading-snug">{{ q.nomeQuadra }}</h2>
                <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <svg class="w-3 h-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ q.cidade || q.endereco || '—' }}
                </div>
              </div>
              <div class="flex flex-wrap gap-2 items-center">
                <span v-if="q.esporte" class="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">{{ q.esporte }}</span>
                <span class="text-sm font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">R$ {{ q.preco }}/h</span>
              </div>
            </div>
            <div v-if="q.horario" class="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <svg class="w-3 h-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ q.horario }}
            </div>

            <button class="w-full flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-blue-500/20 transition-all" @click="selecionarQuadra(q)">
              <span>Gerenciar esta Quadra</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- Bottom Nav Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 md:hidden shadow-lg">
      <router-link to="/minhas-quadras" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/minhas-quadras' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Quadras</span>
      </router-link>
      <router-link to="/reservas" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/reservas' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/faturamento-dono' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/perfil' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "MinhasQuadras",
  components: { TopbarDono },
  data() {
    return {
      quadras: [],
      loading: true,
      quadraAtiva: localStorage.getItem("quadraId") || null,
    };
  },
  async mounted() {
    await this.carregarQuadras();
  },
  methods: {
    async carregarQuadras() {
      try {
        this.quadras = await api.getMinhasQuadras();
        if (!this.quadraAtiva && this.quadras.length > 0) {
          localStorage.setItem("quadraId", this.quadras[0].id);
          this.quadraAtiva = this.quadras[0].id;
        }
      } catch (err) {
        console.error("Erro ao carregar quadras:", err);
      } finally {
        this.loading = false;
      }
    },

    selecionarQuadra(q) {
      localStorage.setItem("quadraId", q.id);
      this.quadraAtiva = q.id;
      this.$router.push("/confirmar-quadra");
    },

    adicionarNovaQuadra() {
      if (this.quadras.length > 0) {
        const ref = this.quadras[0];
        localStorage.setItem("cadastroQuadraParte1", JSON.stringify({
          nomeQuadra: ref.nomeQuadra || "",
          endereco: ref.endereco || "",
          cidade: ref.cidade || "",
          telefone: ref.telefone || "",
          quantidadeQuadras: 1,
          modoAdicionar: true
        }));
        this.$router.push("/cadastro-quadra-parte2");
      } else {
        this.$router.push("/cadastro-quadra-parte1");
      }
    },

    fotoUrl(q) {
      if (!q.fotoUrl) return require("@/assets/perfil.png");
      return q.fotoUrl.startsWith("http") ? q.fotoUrl : `http://localhost:3006${q.fotoUrl}`;
    },
  },
};
</script>
