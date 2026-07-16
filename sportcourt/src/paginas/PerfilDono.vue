<template>
  <div class="pagina">

    <TopbarDono />

    <div class="container">
      <h1 class="titulo-pagina">Meu Perfil</h1>

      <!-- Foto de Perfil -->
      <div class="foto-secao">
        <label class="foto-label">
          <input type="file" accept="image/*" @change="carregarImagem" hidden />
          <div class="foto-moldura">
            <img :src="previewFoto || form.fotoPerfilUrl || defaultImage" alt="Foto de perfil" class="foto-img" />
            <div class="foto-hover-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
        </label>
        <p class="foto-subtitulo">Toque para trocar</p>
      </div>

      <!-- Formulário -->
      <div class="card-formulario">
        <div class="campo">
          <label class="campo-label">Nome e Sobrenome</label>
          <input v-model="form.nomeCompleto" type="text" placeholder="Nome completo" class="input-campo" />
        </div>

        <div class="campo">
          <label class="campo-label">Nome de usuário</label>
          <input v-model="form.nomeUsuario" type="text" placeholder="Nome de usuário" class="input-campo" />
        </div>

        <div class="campo">
          <label class="campo-label">Gênero</label>
          <div class="select-wrapper">
            <select v-model="form.genero" class="select-campo">
              <option value="">Selecione</option>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
            <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <div class="campo">
          <label class="campo-label">E-mail</label>
          <input v-model="form.email" type="email" placeholder="E-mail" disabled class="input-campo" />
        </div>

        <div class="campo">
          <label class="campo-label">Telefone</label>
          <input v-model="form.telefone" type="text" placeholder="Telefone" class="input-campo" />
        </div>

        <div class="campo">
          <label class="campo-label">CPF</label>
          <input v-model="form.cpf" type="text" placeholder="CPF" class="input-campo" />
        </div>

        <div class="campo">
          <label class="campo-label">Data de Nascimento</label>
          <input v-model="form.dataNascimento" type="date" class="input-campo" />
        </div>
      </div>

      <!-- Botões de Ação -->
      <button @click="salvarPerfil" :disabled="salvando" class="btn-salvar">
        {{ salvando ? "Salvando..." : "Salvar alterações" }}
      </button>

      <button @click="sairDaConta" class="btn-sair">
        Sair da Conta
      </button>
    </div>

    <!-- Bottom Nav Mobile -->
    <transition name="slide-up">
      <nav class="bottom-nav" v-show="mostrarBarra">
        <router-link to="/confirmar-quadra" class="nav-item" :class="$route.path === '/confirmar-quadra' ? 'nav-item--ativo' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Menu</span>
        </router-link>
        <router-link to="/reservas" class="nav-item" :class="$route.path === '/reservas' ? 'nav-item--ativo' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Reservas</span>
        </router-link>
        <router-link to="/faturamento-dono" class="nav-item" :class="$route.path === '/faturamento-dono' ? 'nav-item--ativo' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/perfil" class="nav-item" :class="$route.path === '/perfil' ? 'nav-item--ativo' : ''">
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
.pagina {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
}

.container {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo-pagina {
  font-size: 24px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 24px;
  text-align: center;
}

/* Foto Perfil */
.foto-secao {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.foto-label {
  position: relative;
  cursor: pointer;
  display: block;
}

.foto-moldura {
  position: relative;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  overflow: hidden;
  border: 3.5px solid var(--accent);
  box-shadow: var(--shadow-sm);
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.foto-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.2s;
}

.foto-label:hover .foto-hover-overlay {
  opacity: 1;
}

.foto-subtitulo {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 8px;
  font-weight: 600;
}

/* Card Formulario */
.card-formulario {
  width: 100%;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-card);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-campo {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-campo:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.input-campo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Select */
.select-wrapper {
  position: relative;
}

.select-campo {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-campo:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.select-seta {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

/* Botões */
.btn-salvar {
  width: 100%;
  padding: 14px;
  background: var(--gradient-accent);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  margin-bottom: 12px;
}

.btn-salvar:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-salvar:disabled {
  opacity: 0.65;
  pointer-events: none;
}

.btn-sair {
  width: 100%;
  padding: 14px;
  background: #fef2f2;
  color: var(--destructive);
  font-weight: 700;
  font-size: 14px;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-sair:hover {
  background: var(--destructive);
  color: white;
  border-color: var(--destructive);
  transform: none;
  box-shadow: none;
}

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 40;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
}

@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-foreground);
  padding: 8px 16px;
  transition: color 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  color: #475569;
}

.nav-item--ativo {
  color: var(--accent);
}

/* Slide Up */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
