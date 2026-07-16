<template>
  <div class="pagina">

    <TopbarJogador />

    <div class="container">
      <h1 class="titulo-pagina">Meu Perfil</h1>

      <div class="secao-avatar">
        <label class="avatar-uploader">
          <input type="file" accept="image/*" @change="carregarImagem" hidden />
          <div class="avatar-moldura">
            <img :src="previewFoto || jogador.fotoPerfilUrl || defaultImage" alt="Foto de perfil" class="avatar-img" />
            <div class="avatar-hover-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
        </label>
        <p class="avatar-dica">Toque para trocar</p>
      </div>

      <div class="card-perfil">
        <div class="formulario-grid">
          <div class="campo">
            <label class="campo-label">Nome completo</label>
            <input v-model="jogador.nomeCompleto" type="text" class="input-campo" />
          </div>
          <div class="campo">
            <label class="campo-label">Nome de usuário</label>
            <input v-model="jogador.nomeUsuario" type="text" class="input-campo" />
          </div>
          <div class="campo">
            <label class="campo-label">Gênero</label>
            <div class="select-wrapper">
              <select v-model="jogador.genero" class="select-campo">
                <option value="">Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>
              <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="campo">
            <label class="campo-label">Email</label>
            <input v-model="jogador.email" type="email" class="input-campo" disabled />
          </div>
          <div class="campo">
            <label class="campo-label">Telefone</label>
            <input v-model="jogador.telefone" type="text" class="input-campo" />
          </div>
          <div class="campo">
            <label class="campo-label">CPF</label>
            <input v-model="jogador.cpf" type="text" class="input-campo" />
          </div>
          <div class="campo">
            <label class="campo-label">Data de Nascimento</label>
            <input v-model="jogador.dataNascimento" type="date" class="input-campo" />
          </div>
        </div>
      </div>

      <button class="btn-submit" @click="salvarPerfil" :disabled="salvando">
        {{ salvando ? "Salvando..." : "Salvar alterações" }}
      </button>
      <button class="btn-sair" @click="sairDaConta">Sair da Conta</button>
    </div>

    <transition name="slide-up">
      <nav class="bottom-nav" v-show="mostrarBarra">
        <router-link to="/menu-jogador" class="nav-item" :class="$route.path === '/menu-jogador' ? 'nav-item--ativo' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Reservas</span>
        </router-link>
        <router-link to="/reserva" class="nav-item" :class="$route.path === '/reserva' ? 'nav-item--ativo' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Buscar</span>
        </router-link>
        <router-link to="/conta-jogador" class="nav-item" :class="$route.path === '/conta-jogador' ? 'nav-item--ativo' : ''">
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

        alert("Perfil updated successfully!");
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

<style scoped>
.pagina {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
}

.container {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo-pagina {
  font-size: 22px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 24px;
  text-align: center;
}

/* Avatar Section */
.secao-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.avatar-uploader {
  position: relative;
  cursor: pointer;
  display: block;
}

.avatar-moldura {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-uploader:hover .avatar-hover-overlay {
  opacity: 1;
}

.avatar-dica {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-top: 8px;
}

/* Card Perfil */
.card-perfil {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  width: 100%;
  margin-bottom: 24px;
}

.formulario-grid {
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
  display: block;
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
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

.input-campo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f1f5f9;
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
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

.select-seta {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

/* Submit & Sair */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-submit:disabled {
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
  transition: background 0.2s, transform 0.15s;
}

.btn-sair:hover {
  background: #fee2e2;
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
  color: var(--primary);
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>
