<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <TopbarDono />

    <div class="max-w-md w-full mx-auto px-4 py-6 pb-24 md:pb-8">

      <!-- Card da Quadra -->
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        <!-- Foto -->
        <div class="w-full aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
          <img v-if="fotoPerfilUrl" :src="fotoPerfilUrl" alt="Foto da quadra" class="w-full h-full object-cover" />
          <svg v-else class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </div>

        <!-- Informações -->
        <div class="p-5">
          <h1 class="text-xl font-extrabold text-slate-900 mb-4">{{ nomeQuadra || 'Minha Quadra' }}</h1>

          <div class="flex flex-col gap-3">
            <div class="flex items-start gap-3">
              <svg class="text-slate-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p class="text-sm text-slate-600 font-medium">{{ cidade }} — {{ endereco }}</p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <p class="text-sm text-slate-600 font-medium">{{ telefone || 'Sem telefone' }}</p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="text-emerald-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <p class="text-base font-extrabold text-emerald-600">R$ {{ preco }}<span class="text-sm text-slate-400 font-medium">/hora</span></p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p class="text-sm text-slate-600 font-medium">{{ horario }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">{{ esporte }}</span>
            </div>
            <p v-if="descricao" class="text-sm text-slate-500 leading-relaxed pt-1 border-t border-slate-100">{{ descricao }}</p>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex gap-3 mb-4">
        <button @click="editarQuadra"
          class="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar Quadra
        </button>
        <button @click="$router.push('/menu-quadra')"
          class="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-sm transition-all border border-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Gerenciar Horários
        </button>
      </div>

      <!-- Avaliações -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 class="text-base font-extrabold text-slate-800 mb-3">Avaliações</h2>
        <div class="flex items-center gap-3">
          <div class="flex gap-0.5">
            <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              :fill="i <= Math.round(mediaEstrelas) ? '#f59e0b' : 'none'"
              :stroke="i <= Math.round(mediaEstrelas) ? '#f59e0b' : '#d1d5db'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span class="text-base font-extrabold text-slate-800">{{ mediaEstrelas.toFixed(1) }}</span>
          <span class="text-sm text-slate-400">({{ totalAvaliacoes }} avaliações)</span>
        </div>
      </div>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg">
      <router-link to="/minhas-quadras" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/minhas-quadras' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Quadras</span>
      </router-link>
      <router-link to="/reservas" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/reservas' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/faturamento-dono' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/perfil' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
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
  name: "ConfirmarQuadra",
  components: { TopbarDono },
  data() {
    return {
      nomeQuadra: "",
      endereco: "",
      cidade: "",
      telefone: "",
      preco: "",
      horario: "",
      descricao: "",
      esporte: "",
      fotoPerfilUrl: null,
      defaultImage: require("@/assets/perfil.png"),
      mediaEstrelas: 0,
      totalAvaliacoes: 0,
      quadraId: null,
    };
  },
  async mounted() {
    await this.carregarQuadraDono();
  },
  methods: {
    async carregarQuadraDono() {
      try {
        this.quadraId = localStorage.getItem("quadraId") || JSON.parse(localStorage.getItem("quadraInfo") || "{}").id;
        if (!this.quadraId) return;
        const data = await api.getQuadra(this.quadraId);
        this.nomeQuadra = data.nomeQuadra || "";
        this.endereco = data.endereco || "";
        this.cidade = data.cidade || "";
        this.telefone = data.telefone || "";
        this.preco = data.preco || "";
        this.horario = data.horario || "";
        this.descricao = data.descricao || "";
        this.esporte = data.esporte || "";
        this.mediaEstrelas = data.mediaEstrelas || 0;
        this.totalAvaliacoes = data.totalAvaliacoes || 0;
        if (data.fotoPerfil) {
          this.fotoPerfilUrl = data.fotoPerfil.startsWith("http") ? data.fotoPerfil : `http://localhost:3006${data.fotoPerfil}`;
        }
      } catch (err) {
        console.error("Erro ao carregar quadra:", err);
      }
    },
    editarQuadra() {
      this.$router.push("/editar-quadra");
    },
  },
};
</script>
