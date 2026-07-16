<template>
  <div class="pagina-cadastro">

    <!-- Header -->
    <header class="header">
      <router-link to="/escolher-perfil" id="btn-voltar-jogador" class="btn-voltar">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </router-link>
      <router-link to="/" class="logo-center">
        <img :src="logo" alt="SportCourt" class="logo-img" />
      </router-link>
    </header>

    <!-- Formulário -->
    <main class="conteudo">
      <div class="form-wrapper">
        <!-- Badge -->
        <div class="badge-container">
          <span class="perfil-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Jogador
          </span>
        </div>

        <div class="card-cadastro">
          <h1 class="card-titulo">Crie sua conta</h1>
          <p class="card-subtitulo">Preencha os dados para começar</p>

          <form @submit.prevent="handleCadastro" class="formulario">
            <!-- Nome -->
            <div class="campo">
              <label class="campo-label">Nome completo</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input id="input-nome-jogador" type="text" v-model="nome" placeholder="Seu nome completo" required class="input-campo" />
              </div>
            </div>

            <!-- Usuário -->
            <div class="campo">
              <label class="campo-label">Nome de usuário</label>
              <div class="input-wrapper">
                <span class="usuario-prefixo">@</span>
                <input id="input-usuario-jogador" type="text" v-model="usuario" placeholder="seuusuario" required class="input-campo input-campo--usuario" />
              </div>
            </div>

            <!-- Telefone -->
            <div class="campo">
              <label class="campo-label">Telefone</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input id="input-telefone-jogador" type="text" v-model="telefone" placeholder="(00) 00000-0000" class="input-campo" />
              </div>
            </div>

            <!-- E-mail -->
            <div class="campo">
              <label class="campo-label">E-mail</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                <input id="input-email-jogador" type="email" v-model="email" placeholder="seu@email.com" required class="input-campo" />
              </div>
            </div>

            <!-- Senha -->
            <div class="campo">
              <label class="campo-label">Senha</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="input-senha-jogador" type="password" v-model="senha" placeholder="••••••••" required class="input-campo" />
              </div>
            </div>

            <button id="btn-cadastrar-jogador" type="submit" :disabled="carregando" class="btn-submit">
              {{ carregando ? 'Criando conta...' : 'Criar conta como Jogador' }}
            </button>
          </form>
        </div>

        <p class="link-login">
          Já tem uma conta?
          <router-link to="/login" class="link-destaque">Entrar agora</router-link>
        </p>
      </div>
    </main>

  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "CadastroJogador",
  data() {
    return {
      nome: "",
      usuario: "",
      telefone: "",
      email: "",
      senha: "",
      carregando: false,
      logo: require("@/assets/logosite1.png"),
    };
  },
  methods: {
    async handleCadastro() {
      this.carregando = true;
      try {
        await api.register({ nome: this.nome, usuario: this.usuario, telefone: this.telefone, email: this.email, senha: this.senha, tipo: "jogador" });
        alert("Conta criada com sucesso!");
        this.$router.push("/login");
      } catch (err) {
        alert("Erro ao criar conta: " + (err.message || "Tente novamente."));
      } finally {
        this.carregando = false;
      }
    },
  },
};
</script>

<style scoped>
.pagina-cadastro {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
}

/* Header */
.header {
  width: 100%;
  background: white;
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: var(--shadow-xs);
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 0.2s;
  margin-right: auto;
}

.btn-voltar:hover {
  color: var(--foreground);
}

.logo-center {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo-img {
  height: 32px;
  width: auto;
}

/* Conteúdo */
.conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.form-wrapper {
  width: 100%;
  max-width: 440px;
}

/* Badge */
.badge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.perfil-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: var(--primary-dark);
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
}

/* Card */
.card-cadastro {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  margin-bottom: 16px;
}

.card-titulo {
  font-size: 24px;
  font-weight: 900;
  color: var(--foreground);
  text-align: center;
  margin-bottom: 4px;
}

.card-subtitulo {
  color: var(--muted-foreground);
  font-size: 14px;
  text-align: center;
  margin-bottom: 24px;
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

.usuario-prefixo {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  font-weight: 600;
  font-size: 14px;
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

.input-campo--usuario {
  padding-left: 36px;
}

/* Submit */
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
  margin-top: 8px;
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

/* Rodapé */
.link-login {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin-top: 16px;
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
