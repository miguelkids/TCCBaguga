<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/confirmar-quadra" class="flex items-center gap-2.5 no-underline shrink-0">
        <img :src="logo" alt="SportCourt" class="h-8 w-auto object-contain" />
        <span class="font-heading text-lg font-extrabold text-slate-900">SportCourt</span>
      </router-link>
      <nav class="hidden sm:flex items-center gap-1">
        <router-link to="/minhas-quadras" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all" active-class="text-blue-600 bg-blue-50">Quadras</router-link>
        <router-link to="/reservas" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all" active-class="text-blue-600 bg-blue-50">Reservas</router-link>
        <router-link to="/faturamento-dono" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all" active-class="text-blue-600 bg-blue-50">Dashboard</router-link>
        <router-link to="/perfil" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all" active-class="text-blue-600 bg-blue-50">Perfil</router-link>
      </nav>
      <!-- Hamburger mobile -->
      <button class="flex items-center justify-center w-9 h-9 border-none bg-slate-100 rounded-xl cursor-pointer text-slate-700 hover:bg-slate-200 transition-colors sm:hidden" @click="menuAberto = !menuAberto" aria-label="Menu">
        <svg v-if="!menuAberto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <!-- Dropdown mobile -->
    <div class="border-t border-slate-100 flex flex-col p-2.5 gap-1 sm:hidden bg-white/95 backdrop-blur-md" v-show="menuAberto" @click="menuAberto = false">
      <router-link to="/minhas-quadras" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-blue-600 bg-blue-50/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Quadras
      </router-link>
      <router-link to="/reservas" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-blue-600 bg-blue-50/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Reservas
      </router-link>
      <router-link to="/faturamento-dono" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-blue-600 bg-blue-50/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        Dashboard
      </router-link>
      <router-link to="/perfil" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-blue-600 bg-blue-50/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Perfil
      </router-link>
    </div>
  </header>
</template>

<script>
import logo from '@/assets/logosite.png'

export default {
  name: 'TopbarDono',
  data() {
    return { logo, menuAberto: false }
  }
}
</script>

