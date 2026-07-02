<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <TopbarJogador />

    <div class="max-w-md w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col items-center">
      <h1 class="text-2xl font-extrabold text-slate-900 mb-6 text-center">Meu Perfil</h1>

      <div class="flex flex-col items-center mb-6">
        <label class="relative cursor-pointer group block">
          <input type="file" accept="image/*" @change="carregarImagem" hidden />
          <div class="relative w-28 h-28 rounded-full overflow-hidden border-3 border-emerald-500 shadow-md">
            <img :src="previewFoto || jogador.fotoPerfilUrl || defaultImage" alt="Foto de perfil" class="w-full h-full object-cover block" />
            <div class="absolute inset-0 flex items-center justify-center bg-black/35 color-white opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
        </label>
        <p class="text-xs text-slate-400 mt-2 font-medium">Toque para trocar</p>
      </div>

      <div class="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-card mb-6">
        <div class="space-y-4">
          <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nome completo</label><input v-model="jogador.nomeCompleto" type="text" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" /></div>
          <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nome de usuário</label><input v-model="jogador.nomeUsuario" type="text" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" /></div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Gênero</label>
            <select v-model="jogador.genero" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer">
              <option value="">Selecione</option>
              <option>Masculino</option><option>Feminino</option><option>Outro</option>
            </select>
          </div>
          <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email</label><input v-model="jogador.email" type="email" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed" disabled /></div>
          <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Telefone</label><input v-model="jogador.telefone" type="text" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" /></div>
          <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">CPF</label><input v-model="jogador.cpf" type="text" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" /></div>
          <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Data de Nascimento</label><input v-model="jogador.dataNascimento" type="date" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" /></div>
        </div>
      </div>

      <button class="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-65 disabled:pointer-events-none mb-3" @click="salvarPerfil" :disabled="salvando">
        {{ salvando ? "Salvando..." : "Salvar alterações" }}
      </button>
      <button class="w-full py-4 bg-red-50 text-red-600 font-bold border border-red-100 rounded-xl hover:bg-red-100/50 transition-all text-sm" @click="sairDaConta">Sair da Conta</button>
    </div>

    <transition name="slide-up">
      <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg" v-show="mostrarBarra">
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
    </transition>

  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "ContaJogador",
  components: { TopbarJogador },
  data() {
    return {
      jogador: { id:"", nomeCompleto:"", nomeUsuario:"", email:"", telefone:"", cpf:"", genero:"", dataNascimento:"", fotoPerfilUrl:"" },
      previewFoto: null, fileFoto: null,
      defaultImage: require("@/assets/perfil.png"),
      mostrarBarra: true, ultimaPosicaoScroll: 0, salvando: false,
    };
  },
  methods: {
    async carregarDados() {
      try {
        const user = await api.getMe();
        this.jogador.id = user.id;
        this.jogador.nomeCompleto = user.nome || "";
        this.jogador.nomeUsuario = user.nome_usuario || "";
        this.jogador.telefone = user.telefone || "";
        this.jogador.email = user.email || "";
        this.jogador.cpf = user.cpf || "";
        this.jogador.genero = user.genero || "";
        this.jogador.dataNascimento = user.data_nascimento ? user.data_nascimento.substring(0, 10) : "";
        if (user.foto_perfil_url) {
          this.jogador.fotoPerfilUrl = `http://localhost:3006${user.foto_perfil_url}`;
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    },
    async salvarPerfil() {
      try {
        this.salvando = true;
        
        if (this.fileFoto) {
          this.jogador.fotoPerfilUrl = URL.createObjectURL(this.fileFoto);
        }

        await api.atualizarPerfil({
          nome: this.jogador.nomeCompleto,
          nomeUsuario: this.jogador.nomeUsuario,
          telefone: this.jogador.telefone,
          cpf: this.jogador.cpf,
          genero: this.jogador.genero,
          dataNascimento: this.jogador.dataNascimento,
        }, this.fileFoto);

        alert("Perfil atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        alert("Erro ao salvar perfil: " + error.message);
      } finally {
        this.salvando = false;
      }
    },
    carregarImagem(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileFoto = file;
        this.previewFoto = URL.createObjectURL(file);
      }
    },
    sairDaConta() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("quadraId");
      localStorage.removeItem("quadraInfo");
      this.$router.push("/login");
    },
    verificarScroll() {
      const posicaoAtual = window.scrollY;
      this.mostrarBarra = (posicaoAtual <= this.ultimaPosicaoScroll);
      this.ultimaPosicaoScroll = posicaoAtual;
    },
  },
  mounted() { this.carregarDados(); window.addEventListener("scroll", this.verificarScroll); },
  beforeUnmount() { window.removeEventListener("scroll", this.verificarScroll); },
};
</script>

<style>
.slide-up-enter-active, .slide-up-leave-active { transition:transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform:translateY(100%); }
</style>
