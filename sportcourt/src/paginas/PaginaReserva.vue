<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <TopbarJogador />

    <div class="max-w-md w-full mx-auto px-4 py-6 pb-24">

      <!-- Barra de Busca -->
      <div class="relative mb-6">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="busca" type="text" v-model="busca" @input="buscarQuadras" placeholder="Buscar por cidade..."
          class="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-400" />
        <span v-if="busca && espacos.length > 0"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          {{ espacos.length }}
        </span>
      </div>

      <!-- Estado inicial (busca vazia) -->
      <div v-if="!busca" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <svg class="text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h2 class="text-base font-extrabold text-slate-900 mb-1">Onde você quer jogar?</h2>
        <p class="text-sm text-slate-400">Digite o nome da cidade para encontrar quadras próximas</p>
      </div>

      <!-- Sem resultados -->
      <div v-else-if="busca && espacos.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg class="text-slate-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h2 class="text-base font-extrabold text-slate-900 mb-1">Nenhuma quadra encontrada</h2>
        <p class="text-sm text-slate-400">Não há quadras disponíveis para "{{ busca }}"</p>
      </div>

      <!-- Lista de resultados -->
      <div v-else class="flex flex-col gap-4">
        <div v-for="espaco in espacos" :key="espaco.chave"
          class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">

          <!-- Banner da quadra -->
          <div class="relative w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
            <img v-if="espaco.fotoPerfil" :src="fotoSrc(espaco.fotoPerfil)" :alt="espaco.nomeQuadra" class="w-full h-full object-cover" />
            <svg v-else class="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <div v-if="espaco.avaliacoes" class="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <span>★</span><span>4.9</span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="text-base font-extrabold text-slate-900 mb-2">{{ espaco.nomeQuadra }}</h3>

            <div class="flex flex-col gap-1.5 mb-3">
              <div class="flex items-start gap-2">
                <svg class="text-slate-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p class="text-xs text-slate-500 font-medium leading-tight">{{ espaco.endereco }}, {{ espaco.cidade }}</p>
              </div>
              <div v-if="espaco.telefone" class="flex items-center gap-2">
                <svg class="text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <p class="text-xs text-slate-500 font-medium">{{ espaco.telefone }}</p>
              </div>
            </div>

            <!-- Múltiplas quadras no espaço -->
            <div v-if="espaco.quadras.length > 1" class="flex flex-wrap gap-1.5 mb-3">
              <button v-for="q in espaco.quadras" :key="q.id" @click="espaco.quadraAtiva = q.id"
                class="text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
                :class="espaco.quadraAtiva === q.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300'">
                {{ q.esporte }} — R$ {{ q.preco }}/h
              </button>
            </div>

            <!-- Única quadra -->
            <div v-else class="flex items-center gap-2 mb-3">
              <span class="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">{{ espaco.quadras[0].esporte }}</span>
              <span class="text-sm font-extrabold text-emerald-600">R$ {{ espaco.quadras[0].preco }}/h</span>
            </div>

            <button @click="reservarEspaco(espaco)"
              class="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-sm">
              Reservar Agora
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg">
      <router-link to="/menu-jogador" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-6 transition-colors" :class="$route.path === '/menu-jogador' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/reserva" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-6 transition-colors" :class="$route.path === '/reserva' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Buscar</span>
      </router-link>
      <router-link to="/conta-jogador" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-6 transition-colors" :class="$route.path === '/conta-jogador' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "PaginaReserva",
  components: { TopbarJogador },
  data() {
    return {
      busca: "",
      espacos: [],
    };
  },
  methods: {
    async buscarQuadras() {
      if (!this.busca.trim()) {
        this.espacos = [];
        return;
      }
      try {
        const quadras = await api.getQuadras();
        const termo = this.busca.toLowerCase();
        const filtradas = quadras.filter(q => q.cidade && q.cidade.toLowerCase().startsWith(termo));

        const mapa = {};
        for (const q of filtradas) {
          const chave = `${q.donoId}_${q.nomeQuadra}_${q.endereco}`;
          if (!mapa[chave]) {
            mapa[chave] = {
              chave,
              nomeQuadra: q.nomeQuadra,
              endereco: q.endereco,
              cidade: q.cidade,
              telefone: q.telefone,
              fotoPerfil: q.fotoPerfil,
              avaliacoes: q.avaliacoes,
              quadras: [],
              quadraAtiva: q.id,
            };
          }
          mapa[chave].quadras.push({ id: q.id, esporte: q.esporte, preco: q.preco });
        }
        this.espacos = Object.values(mapa);
      } catch (err) {
        console.error("Erro ao buscar quadras:", err);
      }
    },
    reservarEspaco(espaco) {
      const quadraId = espaco.quadraAtiva || espaco.quadras[0].id;
      localStorage.setItem("quadraSelecionada", quadraId);
      this.$router.push("/finalizar-reserva");
    },
    fotoSrc(url) {
      if (!url) return null;
      return url.startsWith("http") ? url : `http://localhost:3006${url}`;
    },
  },
};
</script>
