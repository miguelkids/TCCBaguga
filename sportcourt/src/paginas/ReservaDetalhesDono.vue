<template>
  <div class="pagina">

    <TopbarDono />

    <div class="container">

      <!-- Header -->
      <div class="cabecalho-secao">
        <button @click="$router.push('/reservas')" class="btn-voltar-icone">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 class="titulo-pagina">Detalhes da Reserva</h1>
      </div>

      <div v-if="!reserva" class="estado-vazio">
        <p class="estado-vazio-texto">Nenhuma reserva selecionada.</p>
      </div>

      <div v-else class="detalhes-flex">

        <!-- Card Time A (cliente principal) -->
        <div class="card-painel">
          <div class="cliente-linha">
            <div class="avatar" :style="{ background: avatarColor(reserva.nome) }">
              {{ iniciais(reserva.nome) }}
            </div>
            <div class="cliente-info">
              <p class="cliente-nome">{{ reserva.nome || 'Jogador' }}</p>
              <p class="cliente-time">{{ reserva.nomeTime || 'Time A' }}</p>
            </div>
          </div>
          <!-- Badges de status -->
          <div class="badges-grade">
            <span class="badge-status" :class="reserva.confirmada ? 'badge-status--confirmada' : 'badge-status--pendente'">
              {{ reserva.confirmada ? 'Confirmada' : 'Pendente' }}
            </span>
            <span class="badge-status" :class="reserva.statusPagamento === 'pago' ? 'badge-status--pago' : 'badge-status--nao-pago'">
              {{ reserva.statusPagamento === 'pago' ? 'Pago' : 'Pagamento Pendente' }}
            </span>
            <span v-if="reserva.tipoJogo === 'contra_time'" class="badge-tipo badge-tipo--contra">Contra Time</span>
            <span v-else class="badge-tipo badge-tipo--cheio">Horário Cheio</span>
          </div>
        </div>

        <!-- Card Time B (adversário) -->
        <div v-if="reserva.tipoJogo === 'contra_time' && reserva.nomeJogadorB" class="card-painel">
          <p class="card-label-secao">Desafiante (Time B)</p>
          <div class="cliente-linha">
            <div class="avatar" :style="{ background: avatarColor(reserva.nomeJogadorB) }">
              {{ iniciais(reserva.nomeJogadorB) }}
            </div>
            <div class="cliente-info">
              <p class="cliente-nome">{{ reserva.nomeJogadorB }}</p>
              <p class="cliente-time">{{ reserva.nomeTimeB || 'Time B' }}</p>
            </div>
          </div>
        </div>

        <!-- Informações da reserva -->
        <div class="card-painel">
          <div class="dados-reserva-lista">
            <div class="dado-item">
              <svg class="dado-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <p class="dado-texto">{{ reserva.telefone }}</p>
            </div>
            <div v-if="reserva.tipoJogo === 'contra_time' && reserva.telefoneJogadorB" class="dado-item">
              <svg class="dado-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <p class="dado-texto">{{ reserva.telefoneJogadorB }}</p>
            </div>
            <div class="dado-item">
              <svg class="dado-icone icone-azul" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p class="dado-texto">{{ formatarData(reserva.data) }}</p>
            </div>
            <div class="dado-item">
              <svg class="dado-icone icone-amarelo" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p class="dado-texto">{{ reserva.horario }}</p>
            </div>
            <div class="dado-item">
              <svg class="dado-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p class="dado-texto">{{ reserva.quadraNome }} — {{ reserva.endereco }}</p>
            </div>
          </div>
        </div>

        <!-- Ações operacionais -->
        <div class="botoes-acoes">
          <button v-if="!reserva.confirmada" @click="confirmarReserva" class="btn-operacao btn-operacao--azul">
            Confirmar Reserva
          </button>
          <button v-if="reserva.confirmada && reserva.statusPagamento !== 'pago'" @click="concluirHorario" class="btn-operacao btn-operacao--verde">
            Encerrar Horário
          </button>
          <button v-if="reserva.confirmada" @click="toggleStatusPagamento"
            class="btn-operacao btn-operacao--alterna"
            :class="reserva.statusPagamento === 'pago' ? 'btn-operacao--alterna-pendente' : 'btn-operacao--alterna-pago'">
            {{ reserva.statusPagamento === 'pago' ? 'Marcar como Pagamento Pendente' : 'Marcar como Pago' }}
          </button>
          <button @click="cancelarReserva" class="btn-operacao btn-operacao--cancelar">
            Cancelar Reserva
          </button>
          <button @click="enviarWhatsApp" class="btn-operacao btn-operacao--whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            WhatsApp
          </button>
        </div>
      </div>
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
    formatarData(dataStr) {
      if (!dataStr) return "";
      return String(dataStr).slice(0, 10).replace(/-/g, "/");
    },
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
      this.reserva.statusPagamento = "pago";
    },
    async toggleStatusPagamento() {
      const novo = this.reserva.statusPagamento === "pago" ? "pendente" : "pago";
      await api.atualizarStatusPagamento(this.reserva.id, novo);
      this.reserva.statusPagamento = novo;
    },
    enviarWhatsApp() {
      const tel = (this.reserva.telefone || "").replace(/\D/g, "");
      const msg = `Olá! Confirmo seu horário em ${this.reserva.quadraNome} no dia ${this.formatarData(this.reserva.data)} às ${this.reserva.horario}. Qualquer dúvida estamos à disposição!`;
      window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, "_blank");
    },
    iniciais(nome) {
      if (!nome) return "?";
      return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
    },
    avatarColor(nome) {
      let hash = 0;
      for (let i = 0; i < (nome || "").length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
      const angle = Math.abs(hash) % 360;
      return `hsl(${angle}, 70%, 45%)`;
    },
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

.container {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 100px;
}

/* Header */
.cabecalho-secao {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-voltar-icone {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  color: #475569;
  transition: background-color 0.2s;
}

.btn-voltar-icone:hover {
  background: #f8fafc;
  transform: none;
  box-shadow: none;
}

.titulo-pagina {
  font-size: 20px;
  font-weight: 800;
  color: var(--foreground);
}

.estado-vazio {
  text-align: center;
  padding: 48px 0;
}

.estado-vazio-texto {
  font-size: 14px;
  color: var(--muted-foreground);
}

.detalhes-flex {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Card Painel */
.card-painel {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
}

.cliente-linha {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.cliente-info {
  flex: 1;
  min-width: 0;
}

.cliente-nome {
  font-weight: 800;
  color: var(--foreground);
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cliente-time {
  font-size: 14px;
  color: var(--muted-foreground);
  font-weight: 550;
  margin-top: 2px;
}

.card-label-secao {
  font-size: 11px;
  font-weight: 800;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

/* Badges */
.badges-grade {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge-status,
.badge-tipo {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
}

.badge-status--confirmada {
  background: rgba(34, 197, 94, 0.08);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.badge-status--pendente {
  background: rgba(249, 115, 22, 0.08);
  color: var(--clay);
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.badge-status--pago {
  background: rgba(34, 197, 94, 0.08);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.badge-status--nao-pago {
  background: rgba(249, 115, 22, 0.08);
  color: var(--clay);
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.badge-tipo--contra {
  background: rgba(249, 115, 22, 0.08);
  color: var(--clay);
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.badge-tipo--cheio {
  background: rgba(59, 130, 246, 0.08);
  color: var(--accent);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Dados */
.dados-reserva-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dado-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dado-icone {
  color: var(--muted-foreground);
  flex-shrink: 0;
}

.icone-azul {
  color: var(--accent);
}

.icone-amarelo {
  color: #f59e0b;
}

.dado-texto {
  font-size: 14px;
  color: #334155;
  font-weight: 550;
  line-height: 1.4;
}

/* Botões de Ações */
.botoes-acoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-operacao {
  width: 100%;
  padding: 14px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-operacao:hover {
  opacity: 0.9;
  transform: none;
  box-shadow: none;
}

.btn-operacao--azul {
  background: var(--accent);
  color: white;
}

.btn-operacao--verde {
  background: var(--primary);
  color: white;
}

.btn-operacao--alterna {
  font-weight: 700;
}

.btn-operacao--alterna-pendente {
  background: #fffbeb;
  color: #b45309;
  border: 1.5px solid rgba(245, 158, 11, 0.2);
}

.btn-operacao--alterna-pendente:hover {
  background: #fef3c7;
}

.btn-operacao--alterna-pago {
  background: rgba(34, 197, 94, 0.08);
  color: var(--primary-dark);
  border: 1.5px solid rgba(34, 197, 94, 0.2);
}

.btn-operacao--alterna-pago:hover {
  background: rgba(34, 197, 94, 0.15);
}

.btn-operacao--cancelar {
  background: #fef2f2;
  color: var(--destructive);
  border: 1.5px solid rgba(239, 68, 68, 0.2);
}

.btn-operacao--cancelar:hover {
  background: var(--destructive);
  color: white;
  border-color: var(--destructive);
}

.btn-operacao--whatsapp {
  background: #25d366;
  color: white;
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
  color: var(--accent);
}
</style>
