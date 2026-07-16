<template>
  <div class="pagina">

    <!-- Header -->
    <header class="header">
      <router-link to="/" class="logo-link">
        <img :src="logo" alt="SportCourt" class="logo-img" />
        <span class="logo-texto">SportCourt</span>
      </router-link>
      <router-link to="/login" class="btn-ja-tenho-conta">Já tenho conta</router-link>
    </header>

    <!-- Conteúdo -->
    <main class="conteudo">
      <div class="wrapper">
        <h1 class="titulo">Como você quer usar?</h1>
        <p class="subtitulo">Escolha o seu perfil para começar</p>

        <!-- Card Jogador -->
        <router-link to="/cadastro-jogador" class="card-perfil card-perfil--jogador">
          <div class="card-perfil__icone card-perfil__icone--verde">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="card-perfil__texto">
            <p class="card-perfil__titulo">Sou Jogador</p>
            <p class="card-perfil__descricao">Encontre quadras e faça reservas</p>
          </div>
          <svg class="card-perfil__seta" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </router-link>

        <!-- Card Dono de Quadra -->
        <router-link to="/cadastro-dono" class="card-perfil card-perfil--dono">
          <div class="card-perfil__icone card-perfil__icone--azul">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="card-perfil__texto">
            <p class="card-perfil__titulo">Sou Dono de Quadra</p>
            <p class="card-perfil__descricao">Cadastre e gerencie sua arena</p>
          </div>
          <svg class="card-perfil__seta" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </router-link>

        <p class="link-login">
          Já tem uma conta?
          <router-link to="/login" class="link-destaque">Entrar na conta</router-link>
        </p>
      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: "EscolherPerfil",
  data() {
    return {
      logo: require("@/assets/logosite1.png"),
    };
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

/* Header */
.header {
  width: 100%;
  background: white;
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-xs);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-img {
  height: 32px;
  width: auto;
}

.logo-texto {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.btn-ja-tenho-conta {
  font-size: 14px;
  font-weight: 700;
  color: #475569;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 8px 16px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}

.btn-ja-tenho-conta:hover {
  background: var(--muted);
  border-color: #cbd5e1;
}

/* Conteúdo */
.conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.wrapper {
  width: 100%;
  max-width: 440px;
}

.titulo {
  font-size: 26px;
  font-weight: 900;
  color: var(--foreground);
  text-align: center;
  margin-bottom: 8px;
}

.subtitulo {
  color: var(--muted-foreground);
  font-size: 14px;
  text-align: center;
  margin-bottom: 32px;
}

/* Cards de perfil */
.card-perfil {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  background: white;
  border: 2px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-xs);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.card-perfil:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-perfil--jogador:hover {
  border-color: rgba(34, 197, 94, 0.5);
}

.card-perfil--dono:hover {
  border-color: rgba(59, 130, 246, 0.5);
}

.card-perfil__icone {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.card-perfil__icone--verde {
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary);
}

.card-perfil--jogador:hover .card-perfil__icone--verde {
  background: rgba(34, 197, 94, 0.18);
}

.card-perfil__icone--azul {
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent);
}

.card-perfil--dono:hover .card-perfil__icone--azul {
  background: rgba(59, 130, 246, 0.18);
}

.card-perfil__texto {
  flex: 1;
}

.card-perfil__titulo {
  font-weight: 800;
  color: var(--foreground);
  font-size: 15px;
  margin-bottom: 4px;
}

.card-perfil__descricao {
  font-size: 13px;
  color: var(--muted-foreground);
}

.card-perfil__seta {
  color: #cbd5e1;
  flex-shrink: 0;
  transition: color 0.2s;
}

.card-perfil--jogador:hover .card-perfil__seta {
  color: var(--primary);
}

.card-perfil--dono:hover .card-perfil__seta {
  color: var(--accent);
}

.card-perfil--dono {
  margin-bottom: 32px;
}

/* Link de login */
.link-login {
  text-align: center;
  font-size: 14px;
  color: #64748b;
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
