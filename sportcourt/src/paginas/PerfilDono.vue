<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <TopbarDono />

    <div class="max-w-md w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col items-center">
      <h1 class="text-2xl font-extrabold text-slate-900 mb-6 text-center">Meu Perfil</h1>

      <!-- Foto de Perfil -->
      <div class="flex flex-col items-center mb-6">
        <label class="relative cursor-pointer group block">
          <input type="file" accept="image/*" @change="carregarImagem" hidden />
          <div class="relative w-28 h-28 rounded-full overflow-hidden border-3 border-blue-500 shadow-md">
            <img :src="previewFoto || form.fotoPerfilUrl || defaultImage" alt="Foto de perfil" class="w-full h-full object-cover block" />
            <div class="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
        </label>
        <p class="text-xs text-slate-400 mt-2 font-medium">Toque para trocar</p>
      </div>

      <!-- Formulário -->
      <div class="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-card mb-6 flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Nome e Sobrenome</label>
          <input v-model="form.nomeCompleto" type="text" placeholder="Nome completo"
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Nome de usuário</label>
          <input v-model="form.nomeUsuario" type="text" placeholder="Nome de usuário"
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Gênero</label>
          <select v-model="form.genero"
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer">
            <option value="">Selecione</option>
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Outro</option>
          </select>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">E-mail</label>
          <input v-model="form.email" type="email" placeholder="E-mail" disabled
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Telefone</label>
          <input v-model="form.telefone" type="text" placeholder="Telefone"
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">CPF</label>
          <input v-model="form.cpf" type="text" placeholder="CPF"
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Data de Nascimento</label>
          <input v-model="form.dataNascimento" type="date"
            class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" />
        </div>
      </div>

      <!-- Botões de Ação -->
      <button @click="salvarPerfil" :disabled="salvando"
        class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-65 disabled:pointer-events-none mb-3">
        {{ salvando ? "Salvando..." : "Salvar alterações" }}
      </button>

      <button @click="sairDaConta"
        class="w-full py-4 bg-red-50 text-red-600 font-bold border border-red-100 rounded-xl hover:bg-red-100/50 transition-all text-sm">
        Sair da Conta
      </button>
    </div>

    <!-- Bottom Nav Mobile -->
    <transition name="slide-up">
      <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg" v-show="mostrarBarra">
        <router-link to="/confirmar-quadra" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/confirmar-quadra' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Menu</span>
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
    </transition>

  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "PerfilDono",
  components: { TopbarDono },
  data() {
    return {
      form: { id: "", nomeCompleto: "", nomeUsuario: "", email: "", telefone: "", genero: "", cpf: "", dataNascimento: "", fotoPerfilUrl: "" },
      previewFoto: null,
      fileFoto: null,
      defaultImage: require("@/assets/perfil.png"),
      mostrarBarra: true,
      ultimaPosicaoScroll: 0,
      salvando: false,
    };
  },
  mounted() {
    this.carregarDados();
    window.addEventListener("scroll", this.verificarScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.verificarScroll);
  },
  methods: {
    async carregarDados() {
      try {
        const user = await api.getMe();
        this.form.id = user.id;
        this.form.nomeCompleto = user.nome || "";
        this.form.nomeUsuario = user.nome_usuario || "";
        this.form.telefone = user.telefone || "";
        this.form.email = user.email || "";
        this.form.cpf = user.cpf || "";
        this.form.genero = user.genero || "";
        this.form.dataNascimento = user.data_nascimento ? user.data_nascimento.substring(0, 10) : "";
        if (user.foto_perfil_url) {
          this.form.fotoPerfilUrl = `http://localhost:3006${user.foto_perfil_url}`;
        }
      } catch (err) {
        console.error("Erro ao carregar dados do proprietário:", err);
      }
    },
    async salvarPerfil() {
      try {
        this.salvando = true;

        if (this.fileFoto) {
          this.form.fotoPerfilUrl = URL.createObjectURL(this.fileFoto);
        }

        await api.atualizarPerfil({
          nome: this.form.nomeCompleto,
          nomeUsuario: this.form.nomeUsuario,
          telefone: this.form.telefone,
          cpf: this.form.cpf,
          genero: this.form.genero,
          dataNascimento: this.form.dataNascimento,
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
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
