<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/menu-jogador" class="flex items-center gap-2.5 no-underline shrink-0">
        <img :src="logo" alt="SportCourt" class="h-8 w-auto object-contain" />
        <span class="font-heading text-lg font-extrabold text-slate-900">SportCourt</span>
      </router-link>
      <nav class="hidden sm:flex items-center gap-1">
        <router-link to="/menu-jogador" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all" active-class="text-emerald-600 bg-emerald-50">Minhas Reservas</router-link>
        <router-link to="/reserva" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all" active-class="text-emerald-600 bg-emerald-50">Buscar Quadra</router-link>
        <router-link to="/conta-jogador" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all" active-class="text-emerald-600 bg-emerald-50">Perfil</router-link>
      </nav>
      <!-- Hamburguer mobile -->
      <button class="flex items-center justify-center w-9 h-9 border-none bg-slate-100 rounded-xl cursor-pointer text-slate-700 hover:bg-slate-200 transition-colors sm:hidden" @click="menuAberto = !menuAberto" aria-label="Menu">
        <svg v-if="!menuAberto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <!-- Dropdown mobile -->
    <div class="border-t border-slate-100 flex flex-col p-2.5 gap-1 sm:hidden bg-white/95 backdrop-blur-md" v-show="menuAberto" @click="menuAberto = false">
      <router-link to="/menu-jogador" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-emerald-600 bg-emerald-50/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Minhas Reservas
      </router-link>
      <router-link to="/reserva" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-emerald-600 bg-emerald-50/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Buscar Quadra
      </router-link>
      <router-link to="/conta-jogador" class="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50" active-class="text-emerald-600 bg-emerald-50/70">
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

