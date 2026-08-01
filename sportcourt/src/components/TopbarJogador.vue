<template>
  <header class="sc-topbar">
    <router-link to="/reserva" class="sc-topbar-logo">
      <img :src="logo" alt="SportCourt" />
      <span>SportCourt</span>
    </router-link>

    <nav class="sc-topbar-nav hidden-mobile">
      <router-link to="/reserva" class="sc-topbar-link" active-class="active">Buscar Quadra</router-link>
      <router-link to="/menu-jogador" class="sc-topbar-link" active-class="active">Minhas Reservas</router-link>
      <router-link to="/conta-jogador" class="sc-topbar-link" active-class="active">Perfil</router-link>
    </nav>

    <div class="sc-flex sc-gap-2">
      <router-link to="/conta-jogador" class="sc-btn sc-btn-ghost sc-btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span class="hidden-mobile">Perfil</span>
      </router-link>
      <button class="sc-btn sc-btn-ghost sc-btn-sm" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <span class="hidden-mobile">Sair</span>
      </button>

      <!-- Hamburger mobile -->
      <button class="sc-btn sc-btn-ghost sc-btn-sm mobile-only" @click="menuAberto = !menuAberto" aria-label="Menu">
        <svg v-if="!menuAberto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Dropdown mobile -->
    <div class="mobile-menu" v-show="menuAberto" @click="menuAberto = false">
      <router-link to="/reserva" class="sc-topbar-link" active-class="active">Buscar Quadra</router-link>
      <router-link to="/menu-jogador" class="sc-topbar-link" active-class="active">Minhas Reservas</router-link>
      <router-link to="/conta-jogador" class="sc-topbar-link" active-class="active">Perfil</router-link>
    </div>
  </header>
</template>

<script>
import logo from '@/assets/logosite1.png'

export default {
  name: 'TopbarJogador',
  data() {
    return { logo, menuAberto: false }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .hidden-mobile { display: none !important; }
}
@media (min-width: 769px) {
  .mobile-only { display: none !important; }
}

.mobile-menu {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: var(--sc-bg-card);
  border-bottom: 1px solid var(--sc-border);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 99;
}
</style>
