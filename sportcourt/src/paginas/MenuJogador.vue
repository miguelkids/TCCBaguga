<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden pb-20 md:pb-8" ref="scrollContainer">
    
    <TopbarJogador />

    <!-- Efeito de Glow de Fundo -->
    <div class="absolute top-12 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <main class="flex-grow max-w-4xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
      
      <!-- Cabeçalho da página -->
      <div class="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Minhas Reservas</h1>
          <p class="text-slate-500 text-sm">Acompanhe e avalie seus agendamentos esportivos.</p>
        </div>
        <button class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5" @click="$router.push('/reserva')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Reservar Quadra
        </button>
      </div>

      <!-- Estado Vazio (Sem Reservas) -->
      <div v-if="reservas.length === 0" class="flex flex-col items-center justify-center text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-card animate-scale-in">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3 class="text-base font-bold text-slate-800">Nenhuma reserva encontrada</h3>
        <p class="text-slate-400 text-sm max-w-xs mt-1 mb-6">Você ainda não agendou nenhuma partida. Que tal começar agora?</p>
        <button class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-2.5 rounded-xl border border-slate-200 transition-all" @click="$router.push('/reserva')">Buscar uma quadra</button>
      </div>

      <!-- Lista de Reservas -->
      <div v-else class="space-y-4 animate-fade-in">
        <div v-for="(reserva, index) in reservasOrdenadas" :key="index" class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300">

          <!-- Card Top (Imagem + Informações básicas + Badge de Status) -->
          <div class="flex items-start gap-4 p-5">
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
              <img v-if="reserva.fotoPreview" :src="reserva.fotoPreview" :alt="reserva.quadraNome" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
            </div>
            
            <div class="flex-1 min-w-0 space-y-1">
              <h3 class="text-base font-bold text-slate-900 leading-snug">
                <span v-if="reserva.tipoJogo === 'contra_time' && reserva.nomeTimeB" class="flex items-center gap-1.5 flex-wrap">
                  <span>⚔️ {{ reserva.nomeTime }}</span>
                  <span class="text-xs text-slate-400 font-semibold px-1 py-0.5 bg-slate-100 rounded">VS</span>
                  <span>{{ reserva.nomeTimeB }}</span>
                </span>
                <span v-else>{{ reserva.quadraNome }}</span>
              </h3>
              
              <div v-if="reserva.tipoJogo === 'contra_time'" class="text-xs font-semibold text-slate-500">
                {{ reserva.quadraNome }}
              </div>
              
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                <span class="flex items-center gap-1">
                  📅 {{ formatarDataBR(reserva.data) }}
                </span>
                <span class="text-slate-300">•</span>
                <span class="flex items-center gap-1">
                  ⏰ {{ reserva.horario }}
                </span>
              </div>
              
              <div class="flex items-center gap-1 text-xs text-slate-400 font-medium leading-relaxed truncate" v-if="reserva.endereco">
                <svg class="w-3.5 h-3.5 flex-shrink-0 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ reserva.endereco }}
              </div>
            </div>

            <!-- Status Badge -->
            <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0" :class="reserva.confirmada ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'">
              {{ reserva.confirmada ? 'Confirmada' : 'Pendente' }}
            </span>
          </div>

          <!-- Contatos (Times) -->
          <div class="px-5 pb-4 flex flex-wrap gap-2" v-if="reserva.telefone || (reserva.tipoJogo === 'contra_time' && reserva.telefoneJogadorB)">
            <div class="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/70 border border-slate-200/50 px-3 py-1 rounded-lg font-semibold" v-if="reserva.telefone">
              <span class="text-emerald-500">📞</span>
              {{ reserva.nomeTime || 'Time A' }}: <span class="text-slate-500 font-normal ml-0.5">{{ reserva.telefone }}</span>
            </div>
            <div class="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/70 border border-slate-200/50 px-3 py-1 rounded-lg font-semibold" v-if="reserva.tipoJogo === 'contra_time' && reserva.telefoneJogadorB">
              <span class="text-blue-500">📞</span>
              {{ reserva.nomeTimeB || 'Time B' }}: <span class="text-slate-500 font-normal ml-0.5">{{ reserva.telefoneJogadorB }}</span>
            </div>
          </div>

          <!-- Avaliação (Apenas para confirmadas) -->
          <div v-if="reserva.confirmada" class="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-4 items-center justify-between bg-slate-50/40">
            
            <!-- Média da Quadra -->
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-slate-700">Média Geral:</span>
              <div class="flex items-center gap-0.5">
                <svg v-for="n in 5" :key="'avg-'+n+'-'+index" class="w-4 h-4" :class="n <= Math.round(reserva.media || 0) ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <span class="text-xs text-slate-400 font-bold">{{ Number(reserva.media || 0).toFixed(1) }} ({{ reserva.totalAvaliacoes || 0 }})</span>
            </div>

            <!-- Estrelas do Usuário -->
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-slate-700">Sua nota:</span>
              <div class="flex items-center gap-1">
                <button
                  v-for="n in 5"
                  :key="'star-'+n+'-'+index"
                  @click="avaliarQuadra(reserva.quadraId, n, reserva)"
                  :disabled="reserva.avaliado"
                  class="p-0.5 hover:scale-110 transition-transform disabled:scale-100"
                >
                  <svg class="w-5 h-5 transition-colors duration-150" :class="[n <= (reserva.nota || 0) ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current', !reserva.avaliado ? 'cursor-pointer hover:text-amber-300' : '']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </button>
              </div>
              <small v-if="reserva.avaliado" class="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Nota: {{ reserva.nota }}★</small>
            </div>
          </div>

          <!-- Ações do Card (Apenas para pendentes) -->
          <div v-if="!reserva.confirmada" class="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
            <button class="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all" @click="abrirEdicao(reserva)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/></svg>
              Editar Info
            </button>
            <button class="flex items-center gap-1.5 border border-red-200 hover:bg-red-500 hover:text-white text-red-500 font-bold text-xs px-3.5 py-2 rounded-xl transition-all" @click="confirmarCancelar(reserva)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {{ (reserva.tipoJogo === 'contra_time' && reserva.jogadorIdB === jogadorId) ? 'Sair da Partida' : 'Cancelar Reserva' }}
            </button>
          </div>

        </div>
      </div>
    </main>

    <!-- Bottom Nav Mobile -->
    <transition name="slide-up">
      <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg" v-show="mostrarBarra">
        <router-link to="/menu-jogador" class="flex flex-col items-center gap-0.5 text-xs font-bold transition-colors py-2 px-6" :class="$route.path === '/menu-jogador' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Reservas</span>
        </router-link>
        <router-link to="/reserva" class="flex flex-col items-center gap-0.5 text-xs font-bold transition-colors py-2 px-6" :class="$route.path === '/reserva' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Buscar</span>
        </router-link>
        <router-link to="/conta-jogador" class="flex flex-col items-center gap-0.5 text-xs font-bold transition-colors py-2 px-6" :class="$route.path === '/conta-jogador' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Perfil</span>
        </router-link>
      </nav>
    </transition>

    <!-- Modal de Edição -->
    <div v-if="modalEdicao.aberto" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" @click.self="fecharEdicao">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative animate-scale-in">
        
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">Editar Informações</h2>
          <button class="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors" @click="fecharEdicao">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form @submit.prevent="salvarEdicao" class="space-y-4">
          
          <div class="space-y-1">
            <label for="edit-nome-time" class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nome do Time</label>
            <input id="edit-nome-time" v-model="modalEdicao.nomeTime" type="text" placeholder="Ex: Os Parças FC" 
                   class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all font-medium text-slate-800" />
          </div>

          <div class="space-y-1">
            <label for="edit-nome-jogador" class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Seu Nome / Contato</label>
            <input id="edit-nome-jogador" v-model="modalEdicao.nome" type="text" required placeholder="Ex: João Silva" 
                   class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all font-medium text-slate-800" />
          </div>

          <div class="space-y-1">
            <label for="edit-telefone" class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Telefone</label>
            <input id="edit-telefone" v-model="modalEdicao.telefone" type="tel" required placeholder="Ex: (11) 99999-9999" 
                   class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all font-medium text-slate-800" />
          </div>

          <!-- Slots de Jogadores -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Lista de Jogadores</label>
            
            <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
              <div v-for="(item, i) in modalEdicao.jogadoresLista" :key="i" class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
                <input v-model="item.nome" :placeholder="`Jogador ${i + 1}`" 
                       class="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 text-xs transition-all font-medium text-slate-800" />
                <button type="button" class="text-red-500 hover:text-red-700 text-base font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors" @click="modalEdicao.jogadoresLista.splice(i, 1)">&times;</button>
              </div>
            </div>
            
            <button type="button" class="w-full border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-colors text-center" @click="modalEdicao.jogadoresLista.push({ nome: '', goleiro: false, goleiroPaga: true })">
              + Adicionar Jogador
            </button>
          </div>

          <!-- Ações do Modal -->
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" class="border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-xl transition-all" @click="fecharEdicao">Cancelar</button>
            <button type="submit" class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all" :disabled="modalEdicao.salvando">
              {{ modalEdicao.salvando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "MenuJogador",
  components: { TopbarJogador },
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return {
      reservas: [],
      jogadorId: user.id || null,
      mostrarBarra: true,
      ultimoScroll: 0,
      logo: require("@/assets/logosite1.png"),
      modalEdicao: {
        aberto: false,
        salvando: false,
        reservaId: null,
        nomeTime: "",
        nome: "",
        telefone: "",
        jogadoresLista: [],
        reservaRef: null
      }
    };
  },
  computed: {
    reservasOrdenadas() {
      return [...this.reservas].sort((a, b) => new Date(b.data) - new Date(a.data));
    },
  },
  mounted() {
    if (this.jogadorId) this.ouvirReservas();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    formatarDataBR(dataStr) {
      if (!dataStr || typeof dataStr !== 'string') return dataStr;
      const dataLimpa = dataStr.split('T')[0];
      const partes = dataLimpa.split('-');
      if (partes.length !== 3) return dataLimpa;
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },
    handleScroll() {
      const s = window.scrollY;
      this.mostrarBarra = s < this.ultimoScroll || s < 10;
      this.ultimoScroll = s;
    },
    async ouvirReservas() {
      try {
        const reservas = await api.getReservas();
        // Filtra reservas do jogador logado
        this.reservas = reservas
          .filter(r => r.jogadorId === this.jogadorId || r.jogadorIdB === this.jogadorId)
          .map(r => ({
            ...r,
            fotoPreview: r.fotoPreview ? (r.fotoPreview.startsWith('http') ? r.fotoPreview : `http://localhost:3006${r.fotoPreview}`) : ""
          }));
      } catch (err) {
        console.error("Erro ouvindo reservas:", err);
      }
    },
    async avaliarQuadra(quadraId, estrelas, reserva) {
      try {
        if (!this.jogadorId) { alert("Você precisa estar logado para avaliar."); return; }
        const data = await api.avaliarQuadra(quadraId, estrelas);
        reserva.avaliado = true;
        reserva.nota = estrelas;
        reserva.media = data.novaMedia;
        reserva.totalAvaliacoes = data.totalAvaliacoes;
        alert(`Você avaliou a quadra com ${estrelas} estrelas!`);
      } catch (err) {
        alert("Erro ao avaliar: " + err.message);
      }
    },
    abrirEdicao(reserva) {
      const isJogadorB = reserva.jogadorIdB === this.jogadorId;
      const listaOriginal = isJogadorB ? (reserva.jogadoresListaB || []) : (reserva.jogadoresLista || []);
      this.modalEdicao = {
        aberto: true,
        salvando: false,
        reservaId: reserva.id,
        nomeTime: isJogadorB ? (reserva.nomeTimeB || "") : (reserva.nomeTime || ""),
        nome: isJogadorB ? (reserva.nomeJogadorB || "") : (reserva.nome || ""),
        telefone: isJogadorB ? (reserva.telefoneJogadorB || "") : (reserva.telefone || ""),
        jogadoresLista: listaOriginal.map(j => ({
          nome: j.nome || "",
          goleiro: !!j.goleiro,
          goleiroPaga: j.goleiroPaga !== undefined ? !!j.goleiroPaga : true
        })),
        reservaRef: reserva
      };
    },
    fecharEdicao() {
      this.modalEdicao.aberto = false;
    },
    async salvarEdicao() {
      try {
        this.modalEdicao.salvando = true;
        const listaFiltrada = this.modalEdicao.jogadoresLista.filter(j => j.nome && typeof j.nome === 'string' && j.nome.trim());
        await api.editarJogador(this.modalEdicao.reservaId, {
          nome: this.modalEdicao.nome,
          telefone: this.modalEdicao.telefone,
          nomeTime: this.modalEdicao.nomeTime,
          jogadoresLista: listaFiltrada.map(j => ({ nome: j.nome.trim(), goleiro: !!j.goleiro, goleiroPaga: !!j.goleiroPaga }))
        });
        
        const isJogadorB = this.modalEdicao.reservaRef.jogadorIdB === this.jogadorId;
        if (isJogadorB) {
          this.modalEdicao.reservaRef.nomeJogadorB = this.modalEdicao.nome;
          this.modalEdicao.reservaRef.telefoneJogadorB = this.modalEdicao.telefone;
          this.modalEdicao.reservaRef.nomeTimeB = this.modalEdicao.nomeTime;
          this.modalEdicao.reservaRef.jogadoresListaB = listaFiltrada;
        } else {
          this.modalEdicao.reservaRef.nome = this.modalEdicao.nome;
          this.modalEdicao.reservaRef.telefone = this.modalEdicao.telefone;
          this.modalEdicao.reservaRef.nomeTime = this.modalEdicao.nomeTime;
          this.modalEdicao.reservaRef.jogadoresLista = listaFiltrada;
        }
        
        this.fecharEdicao();
        alert("Informações atualizadas com sucesso!");
        this.ouvirReservas();
      } catch (err) {
        alert("Erro ao salvar alterações: " + err.message);
      } finally {
        this.modalEdicao.salvando = false;
      }
    },
    async confirmarCancelar(reserva) {
      const isJogadorB = reserva.jogadorIdB === this.jogadorId;
      const msg = isJogadorB 
        ? "Deseja realmente sair deste contra-time?" 
        : "Deseja realmente cancelar esta reserva?";
      
      if (confirm(msg)) {
        try {
          await api.cancelarReserva(reserva.id);
          alert(isJogadorB ? "Você saiu da partida com sucesso!" : "Reserva cancelada com sucesso!");
          this.ouvirReservas();
        } catch (err) {
          alert("Erro ao cancelar: " + err.message);
        }
      }
    },
  },
};
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.4s ease both;
}

.animate-scale-in {
  animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
