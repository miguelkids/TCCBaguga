<template>
  <header class="topbar">
    <div class="topbar__inner">
      <router-link to="/menu-jogador" class="topbar__logo">
        <img :src="logo" alt="SportCourt" class="topbar__logo-img" />
        <span class="topbar__logo-texto">SportCourt</span>
      </router-link>

      <nav class="topbar__nav">
        <router-link to="/menu-jogador" class="topbar__link" active-class="topbar__link--ativo">Minhas Reservas</router-link>
        <router-link to="/reserva" class="topbar__link" active-class="topbar__link--ativo">Buscar Quadra</router-link>
        <router-link to="/conta-jogador" class="topbar__link" active-class="topbar__link--ativo">Perfil</router-link>
      </nav>

      <!-- Hamburger mobile -->
      <button class="topbar__hamburger" @click="menuAberto = !menuAberto" aria-label="Menu">
        <svg v-if="!menuAberto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Dropdown mobile -->
    <div class="topbar__dropdown" v-show="menuAberto" @click="menuAberto = false">
      <router-link to="/menu-jogador" class="topbar__dropdown-item" active-class="topbar__dropdown-item--ativo">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Minhas Reservas
      </router-link>
      <router-link to="/reserva" class="topbar__dropdown-item" active-class="topbar__dropdown-item--ativo">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Buscar Quadra
      </router-link>
      <router-link to="/conta-jogador" class="topbar__dropdown-item" active-class="topbar__dropdown-item--ativo">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Perfil
      </router-link>
    </div>
  </header>
</template>

<script>
import logo from '@/assets/logosite.png'

export default {
  name: 'TopbarJogador',
  data() {
    return { logo, menuAberto: false }
  }
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.topbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.topbar__logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.topbar__logo-texto {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 800;
  color: var(--foreground);
}

.topbar__nav {
  display: none;
  align-items: center;
  gap: 4px;
}

@media (min-width: 640px) {
  .topbar__nav {
    display: flex;
  }
}

.topbar__link {
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}

.topbar__link:hover {
  color: var(--primary);
  background: rgba(34, 197, 94, 0.06);
}

.topbar__link--ativo {
  color: var(--primary);
  background: rgba(34, 197, 94, 0.08);
}

/* Hamburger */
.topbar__hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--muted);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #475569;
  padding: 0;
  margin-top: 0;
  transition: background 0.2s;
}

.topbar__hamburger:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

@media (min-width: 640px) {
  .topbar__hamburger {
    display: none;
  }
}

/* Dropdown mobile */
.topbar__dropdown {
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 4px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
}

@media (min-width: 640px) {
  .topbar__dropdown {
    display: none !important;
  }
}

.topbar__dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.topbar__dropdown-item:hover {
  background: var(--muted);
}

.topbar__dropdown-item--ativo {
  color: var(--primary);
  background: rgba(34, 197, 94, 0.07);
}
</style>
