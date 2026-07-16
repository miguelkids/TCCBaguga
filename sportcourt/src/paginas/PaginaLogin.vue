<template>
  <div class="pagina-login">

    <!-- Lado Visual (Esquerdo) - Desktop -->
    <div class="lado-visual">
      <div class="brilho brilho--topo"></div>
      <div class="brilho brilho--base"></div>

      <router-link to="/" class="logo-link">
        <img :src="logo" alt="SportCourt" class="logo-img" />
        <span class="logo-texto">SportCourt</span>
      </router-link>

      <div class="visual-conteudo">
        <h1 class="visual-titulo">
          Gerencie sua quadra<br />
          <span class="visual-titulo--destaque">de forma inteligente</span>
        </h1>
        <p class="visual-descricao">
          A plataforma completa para proprietários de arenas esportivas e jogadores que amam o esporte.
        </p>

        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-numero">+500</p>
            <p class="stat-label">Jogadores</p>
          </div>
          <div class="stat-card">
            <p class="stat-numero">47</p>
            <p class="stat-label">Quadras</p>
          </div>
          <div class="stat-card">
            <p class="stat-numero">★ 4.9</p>
            <p class="stat-label">Avaliação</p>
          </div>
        </div>
      </div>

      <p class="visual-rodape">© 2026 SportCourt. Todos os direitos reservados.</p>
    </div>

    <!-- Lado do Formulário (Direito) -->
    <div class="lado-formulario">
      <!-- Logo mobile -->
      <router-link to="/" class="logo-mobile">
        <img :src="logo" alt="SportCourt" class="logo-img-sm" />
        <span class="logo-texto-escuro">SportCourt</span>
      </router-link>

      <div class="form-wrapper">
        <h2 class="form-titulo">Vamos fazer seu login</h2>
        <p class="form-subtitulo">Bem-vindo de volta, sentimos sua falta.</p>

        <form @submit.prevent="handleLogin" class="formulario">
          <!-- E-mail -->
          <div class="campo">
            <label class="campo-label">E-mail</label>
            <div class="input-wrapper">
              <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
              <input id="input-email-login" type="email" v-model="email" placeholder="seu@email.com" required class="input-campo" />
            </div>
          </div>

          <!-- Senha -->
          <div class="campo">
            <div class="campo-header">
              <label class="campo-label">Senha</label>
              <a href="#" class="esqueceu-link">Esqueceu a senha?</a>
            </div>
            <div class="input-wrapper">
              <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="input-senha-login" :type="mostrarSenha ? 'text' : 'password'" v-model="senha" placeholder="••••••••" required class="input-campo input-campo--senha" />
              <button type="button" @click="mostrarSenha = !mostrarSenha" class="btn-olho">
                <img :src="olho" alt="Mostrar senha" class="olho-img" />
              </button>
            </div>
          </div>

          <button id="btn-login" type="submit" :disabled="carregando" class="btn-entrar">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Divisor -->
        <div class="divisor">
          <div class="divisor-linha"></div>
          <span class="divisor-texto">ou continue com</span>
          <div class="divisor-linha"></div>
        </div>

        <!-- Botões Sociais -->
        <div class="btns-sociais">
          <button type="button" class="btn-social">
            <img :src="google" alt="Google" class="social-img" />
            Google
          </button>
          <button type="button" class="btn-social">
            <img :src="apple" alt="Apple" class="social-img" />
            Apple
          </button>
        </div>

        <p class="cadastro-link">
          Não tem uma conta?
          <router-link to="/escolher-perfil" class="link-destaque">Cadastre-se grátis</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "PaginaLogin",
  data() {
    return {
      email: "",
      senha: "",
      mostrarSenha: false,
      carregando: false,
      logo: require("@/assets/logosite1.png"),
      olho: require("@/assets/olho.png"),
      google: require("@/assets/logogoogle.png"),
      apple: require("@/assets/logoapple.png"),
    };
  },
  methods: {
    async handleLogin() {
      this.carregando = true;
      try {
        const { token, user } = await api.login(this.email, this.senha);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.tipo === "dono") {
          const quadras = await api.getQuadras();
          const minhasQuadras = quadras.filter(q => q.donoId === user.id);
          if (minhasQuadras.length > 0) {
            localStorage.setItem("quadraId", minhasQuadras[0].id);
            localStorage.setItem("quadraInfo", JSON.stringify(minhasQuadras[0]));
            this.$router.push("/confirmar-quadra");
          } else {
            this.$router.push("/cadastro-quadra-parte1");
          }
        } else if (user.tipo === "jogador") {
          this.$router.push("/reserva");
        } else {
          alert("Tipo de perfil inválido. Entre em contato com o suporte.");
        }
      } catch (err) {
        alert("Erro ao entrar: " + (err.message || "Verifique seus dados."));
      } finally {
        this.carregando = false;
      }
    },
  },
};
</script>

<style scoped>
.pagina-login {
  min-height: 100vh;
  background: #020617;
  display: flex;
  font-family: var(--font-body);
}

/* Lado visual */
.lado-visual {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  padding: 48px;
  position: relative;
  overflow: hidden;
  background: #0f172a;
}

@media (min-width: 1024px) {
  .lado-visual {
    display: flex;
  }
}

.brilho {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.brilho--topo {
  top: -128px;
  left: -128px;
  width: 500px;
  height: 500px;
  background: rgba(34, 197, 94, 0.08);
}

.brilho--base {
  bottom: -128px;
  right: -128px;
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.06);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
  text-decoration: none;
}

.logo-img {
  height: 36px;
  width: auto;
}

.logo-texto {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: white;
}

.visual-conteudo {
  z-index: 1;
}

.visual-titulo {
  font-size: 38px;
  font-weight: 900;
  color: white;
  line-height: 1.15;
  margin-bottom: 16px;
}

.visual-titulo--destaque {
  color: #4ade80;
}

.visual-descricao {
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.stat-numero {
  font-size: 22px;
  font-weight: 900;
  color: #4ade80;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.visual-rodape {
  font-size: 13px;
  color: #334155;
  z-index: 1;
}

/* Lado do formulário */
.lado-formulario {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: white;
}

@media (min-width: 1024px) {
  .lado-formulario {
    padding: 64px;
  }
}

/* Logo mobile */
.logo-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  text-decoration: none;
}

@media (min-width: 1024px) {
  .logo-mobile {
    display: none;
  }
}

.logo-img-sm {
  height: 32px;
  width: auto;
}

.logo-texto-escuro {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

/* Formulário */
.form-wrapper {
  width: 100%;
  max-width: 360px;
}

.form-titulo {
  font-size: 26px;
  font-weight: 900;
  color: var(--foreground);
  margin-bottom: 4px;
}

.form-subtitulo {
  color: var(--muted-foreground);
  font-size: 14px;
  margin-bottom: 32px;
}

.formulario {
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

.campo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.esqueceu-link {
  font-size: 12px;
  color: var(--primary-dark);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.esqueceu-link:hover {
  color: var(--primary);
}

.input-wrapper {
  position: relative;
}

.input-icone {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

.input-campo {
  width: 100%;
  padding: 12px 16px 12px 42px;
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

.input-campo--senha {
  padding-right: 48px;
}

.btn-olho {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 0;
  box-shadow: none;
  width: auto;
}

.btn-olho:hover {
  transform: translateY(-50%);
  box-shadow: none;
}

.olho-img {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.btn-entrar {
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-entrar:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-entrar:disabled {
  opacity: 0.65;
  pointer-events: none;
}

/* Divisor */
.divisor {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
}

.divisor-linha {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.divisor-texto {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  white-space: nowrap;
}

/* Botões sociais */
.btns-sociais {
  display: flex;
  gap: 12px;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  margin-top: 0;
  width: auto;
}

.btn-social:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: none;
  box-shadow: none;
}

.social-img {
  width: 20px;
  height: 20px;
}

.cadastro-link {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin-top: 24px;
}

.link-destaque {
  color: var(--primary-dark);
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.2s;
}

.link-destaque:hover {
  color: var(--primary);
}
</style>
