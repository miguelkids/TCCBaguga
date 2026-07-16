<template>
  <div class="pagina">

    <TopbarDono />

    <div class="container">
      <h1 class="titulo-pagina">Gerenciar Quadra</h1>

      <!-- Card de Configurações -->
      <button @click="$router.push('/editar-data-horario')" class="card-menu">
        <div class="card-menu__icone">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="card-menu__texto">
          <p class="card-menu__titulo">Gerenciar Datas e Horários</p>
          <p class="card-menu__subtitulo">Marque ou libere datas e horários ocupados</p>
        </div>
        <svg class="card-menu__seta" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <!-- Voltar -->
      <button @click="$router.push('/minhas-quadras')" class="btn-voltar">
        Voltar para Quadras
      </button>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="bottom-nav">
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
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";

export default {
  name: "MenuQuadra",
  components: { TopbarDono },
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
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
}

.titulo-pagina {
  font-size: 22px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 28px;
}

/* Card menu */
.card-menu {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  text-align: left;
  margin-bottom: 16px;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
}

.card-menu:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(34, 197, 94, 0.3);
  transform: translateY(-1px);
}

.card-menu__icone {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(34, 197, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--primary);
}

.card-menu__texto {
  flex: 1;
}

.card-menu__titulo {
  font-weight: 800;
  color: var(--foreground);
  font-size: 15px;
  margin-bottom: 2px;
}

.card-menu__subtitulo {
  font-size: 13px;
  color: var(--muted-foreground);
}

.card-menu__seta {
  color: #cbd5e1;
  flex-shrink: 0;
}

/* Botão voltar */
.btn-voltar {
  width: 100%;
  padding: 14px;
  background: var(--muted);
  color: #475569;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-voltar:hover {
  background: #e2e8f0;
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
</style>
