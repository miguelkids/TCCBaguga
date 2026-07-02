<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <TopbarDono />

    <div class="max-w-md w-full mx-auto px-4 py-6 pb-24">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <button @click="$router.push('/reservas')"
          class="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 class="text-xl font-extrabold text-slate-900">Detalhes da Reserva</h1>
      </div>

      <div v-if="!reserva" class="text-center py-12">
        <p class="text-sm text-slate-400">Nenhuma reserva selecionada.</p>
      </div>

      <div v-else class="flex flex-col gap-4">

        <!-- Card Time A (cliente principal) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg text-white flex-shrink-0"
              :style="{ background: avatarColor(reserva.nomeJogador) }">
              {{ iniciais(reserva.nomeJogador) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-extrabold text-slate-900 text-base truncate">{{ reserva.nomeJogador || 'Jogador' }}</p>
              <p class="text-sm text-slate-400 font-medium">{{ reserva.nomeTime || 'Time A' }}</p>
            </div>
          </div>
          <!-- Badges de status -->
          <div class="flex flex-wrap gap-2">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full"
              :class="reserva.confirmada ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'">
              {{ reserva.confirmada ? 'Confirmada' : 'Pendente' }}
            </span>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full"
              :class="reserva.status_pagamento === 'pago' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-orange-700 border border-orange-200'">
              {{ reserva.status_pagamento === 'pago' ? 'Pago' : 'Pagamento Pendente' }}
            </span>
            <span v-if="reserva.contra_time" class="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">Contra Time</span>
            <span v-else class="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Horário Cheio</span>
          </div>
        </div>

        <!-- Card Time B (adversário) -->
        <div v-if="reserva.contra_time && reserva.nomeJogador2" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Desafiante (Time B)</p>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base text-white flex-shrink-0"
              :style="{ background: avatarColor(reserva.nomeJogador2) }">
              {{ iniciais(reserva.nomeJogador2) }}
            </div>
            <div>
              <p class="font-extrabold text-slate-900">{{ reserva.nomeJogador2 }}</p>
              <p class="text-sm text-slate-400">{{ reserva.nomeTime2 || 'Time B' }}</p>
            </div>
          </div>
        </div>

        <!-- Informações da reserva -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <svg class="text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <p class="text-sm text-slate-700 font-medium">{{ reserva.telefoneJogador }}</p>
            </div>
            <div v-if="reserva.contra_time && reserva.telefoneJogador2" class="flex items-center gap-3">
              <svg class="text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <p class="text-sm text-slate-700 font-medium">{{ reserva.telefoneJogador2 }}</p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="text-blue-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p class="text-sm text-slate-700 font-medium">{{ reserva.data }}</p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="text-amber-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p class="text-sm text-slate-700 font-medium">{{ reserva.horario }}</p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p class="text-sm text-slate-700 font-medium">{{ reserva.nomeQuadra }} — {{ reserva.endereco }}</p>
            </div>
          </div>
        </div>

        <!-- Ações operacionais -->
        <div class="flex flex-col gap-2">
          <button v-if="!reserva.confirmada" @click="confirmarReserva"
            class="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all">
            Confirmar Reserva
          </button>
          <button v-if="reserva.confirmada && reserva.status_pagamento !== 'pago'" @click="concluirHorario"
            class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all">
            Encerrar Horário
          </button>
          <button v-if="reserva.confirmada" @click="toggleStatusPagamento"
            class="w-full py-3.5 font-bold rounded-xl text-sm transition-all"
            :class="reserva.status_pagamento === 'pago' ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'">
            {{ reserva.status_pagamento === 'pago' ? 'Marcar como Pagamento Pendente' : 'Marcar como Pago' }}
          </button>
          <button @click="cancelarReserva"
            class="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm border border-red-200 transition-all">
            Cancelar Reserva
          </button>
          <button @click="enviarWhatsApp"
            class="w-full py-3.5 bg-[#25d366] hover:opacity-90 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 lg:hidden shadow-lg">
      <router-link to="/confirmar-quadra" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/confirmar-quadra' ? 'text-emerald-500' : 'text-slate-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Menu</span>
      </router-link>
      <router-link to="/reservas" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/reservas' ? 'text-emerald-500' : 'text-slate-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/faturamento-dono' ? 'text-emerald-500' : 'text-slate-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center gap-0.5 text-xs font-bold py-2 px-4 transition-colors" :class="$route.path === '/perfil' ? 'text-emerald-500' : 'text-slate-400'">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "ReservaDetalhesDono",
  components: { TopbarDono },
  data() {
    return {
      reserva: null,
      quadraId: localStorage.getItem("quadraId") || null,
    };
  },
  mounted() {
    try {
      const raw = this.$route.query.reserva;
      if (raw) this.reserva = JSON.parse(decodeURIComponent(raw));
    } catch { this.reserva = null; }
  },
  methods: {
    async confirmarReserva() {
      await api.confirmarReserva(this.reserva.id);
      this.reserva.confirmada = true;
      alert("Reserva confirmada!");
    },
    async cancelarReserva() {
      if (!confirm("Cancelar esta reserva?")) return;
      await api.cancelarReserva(this.reserva.id);
      this.$router.push("/reservas");
    },
    async concluirHorario() {
      await api.concluirReserva(this.reserva.id);
      this.reserva.confirmada = true;
      this.reserva.status_pagamento = "pago";
    },
    async toggleStatusPagamento() {
      const novo = this.reserva.status_pagamento === "pago" ? "pendente" : "pago";
      await api.atualizarStatusPagamento(this.reserva.id, novo);
      this.reserva.status_pagamento = novo;
    },
    enviarWhatsApp() {
      const tel = (this.reserva.telefoneJogador || "").replace(/\D/g, "");
      const msg = `Olá! Confirmo seu horário em ${this.reserva.nomeQuadra} no dia ${this.reserva.data} às ${this.reserva.horario}. Qualquer dúvida estamos à disposição!`;
      window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, "_blank");
    },
    iniciais(nome) {
      if (!nome) return "?";
      return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
    },
    avatarColor(nome) {
      let hash = 0;
      for (let i = 0; i < (nome || "").length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
      return `oklch(0.55 0.18 ${Math.abs(hash) % 360})`;
    },
  },
};
</script>
