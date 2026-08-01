<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">CRM de Reservas</h1>
          <p class="sc-muted">Gerencie, confirme e encerre os agendamentos das suas quadras</p>
        </div>
      </div>

      <!-- Abas de Navegação -->
      <div class="sc-tabs" style="margin-bottom: 24px;">
        <button class="sc-tab" :class="{ active: abaAtiva === 'pendentes' }" @click="abaAtiva = 'pendentes'">
          Pendentes ({{ reservasPendentes.length }})
        </button>
        <button class="sc-tab" :class="{ active: abaAtiva === 'confirmadas' }" @click="abaAtiva = 'confirmadas'">
          Confirmadas ({{ reservasConfirmadas.length }})
        </button>
        <button class="sc-tab" :class="{ active: abaAtiva === 'encerradas' }" @click="abaAtiva = 'encerradas'">
          Encerradas ({{ reservasEncerradas.length }})
        </button>
      </div>

      <div v-if="carregando" class="sc-empty">Carregando reservas...</div>
      <div v-else-if="listaExibicao.length === 0" class="sc-empty" style="padding: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); margin-bottom: 12px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p class="sc-muted">Nenhuma reserva nesta aba.</p>
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 20px;">
        <div v-for="r in listaExibicao" :key="r.id" class="sc-card reserva-card">

          <!-- ===== CABEÇALHO DO CARD ===== -->
          <div class="reserva-header">
            <!-- Avatar do jogador -->
            <div class="jogador-avatar">
              <img v-if="fotoSrc(r.fotoJogador)" :src="fotoSrc(r.fotoJogador)" :alt="r.nome" />
              <span v-else class="avatar-inicial">{{ inicialNome(r.nome) }}</span>
            </div>

            <!-- Dados do jogador -->
            <div class="jogador-info">
              <h3 class="jogador-nome">{{ r.nome || 'Jogador' }}</h3>
              <div class="jogador-contatos">
                <span class="contato-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {{ r.telefone || 'Sem telefone' }}
                </span>
                <span class="contato-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  {{ r.quadraNome || 'Quadra' }}
                </span>
              </div>
            </div>

            <!-- Badges de status -->
            <div class="reserva-badges">
              <span class="badge-tipo" :class="r.tipoJogo === 'contra_time' ? 'badge-contra' : 'badge-cheio'">
                <svg v-if="r.tipoJogo === 'contra_time'" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {{ r.tipoJogo === 'contra_time' ? 'Contra Time' : 'Horário Cheio' }}
              </span>
              <span v-if="r.nomeTime" class="badge-time">{{ r.nomeTime }}</span>
            </div>
          </div>

          <!-- ===== DATA / HORÁRIO / QUADRA ===== -->
          <div class="reserva-datetime">
            <div class="datetime-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{{ formatarData(r.data) }}</span>
            </div>
            <div class="datetime-sep">•</div>
            <div class="datetime-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ r.horario }}</span>
            </div>
            <div class="datetime-sep">•</div>
            <div class="datetime-item preco">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>R$ {{ Number(r.preco || 0).toFixed(2) }}</span>
            </div>
          </div>

          <!-- ===== LISTA DE JOGADORES (contra_time ou horario_cheio com lista) ===== -->
          <div v-if="r.jogadoresLista && r.jogadoresLista.length > 0" class="jogadores-lista-section">
            <p class="jogadores-lista-titulo">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {{ r.nomeTime ? r.nomeTime : 'Jogadores' }} ({{ r.jogadoresLista.length }})
            </p>
            <div class="jogadores-chips">
              <span v-for="(j, idx) in r.jogadoresLista" :key="idx" class="jogador-chip">
                <svg v-if="j.goleiro" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                {{ typeof j === 'string' ? j : j.nome }}
                <span v-if="j.goleiro" style="color: #f59e0b; font-size: 10px;">(G)</span>
              </span>
            </div>
          </div>

          <!-- ===== PAINEL ENCERRADAS: PAGAMENTO POR JOGADOR ===== -->
          <div v-if="abaAtiva === 'encerradas'" class="painel-encerradas">
            <div class="painel-encerradas-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Controle de Pagamento</span>
            </div>

            <!-- Sem lista de jogadores: pagamento do time/reserva inteiro -->
            <div v-if="!r.jogadoresLista || r.jogadoresLista.length === 0" class="pagamento-time-inteiro">
              <div class="pagamento-row">
                <span class="pagamento-nome">{{ r.nome }} ({{ r.nomeTime || 'Reservante' }})</span>
                <span class="pagamento-valor">R$ {{ Number(r.preco || 0).toFixed(2) }}</span>
                <button
                  class="pagamento-toggle"
                  :class="r.statusPagamento === 'pago' ? 'toggle-pago' : 'toggle-pendente'"
                  @click="alternarPagamentoGlobal(r)"
                >
                  <svg v-if="r.statusPagamento === 'pago'" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ r.statusPagamento === 'pago' ? 'Pago' : 'Pendente' }}
                </button>
              </div>
            </div>

            <!-- Com lista de jogadores: controle individual -->
            <div v-else class="pagamento-lista-jogadores">
              <div class="pagamento-sumario">
                <span class="sc-muted" style="font-size: 12px;">
                  Valor por jogador: <strong style="color: var(--sc-primary);">R$ {{ valorPorJogador(r) }}</strong>
                </span>
                <span class="sc-muted" style="font-size: 12px;">
                  Total: R$ {{ Number(r.preco || 0).toFixed(2) }}
                </span>
              </div>

              <div v-for="(j, idx) in editando[r.id] || r.jogadoresLista" :key="idx" class="pagamento-row">
                <span class="pagamento-nome">
                  {{ typeof j === 'string' ? j : j.nome }}
                  <span v-if="j.goleiro" style="color: #f59e0b; font-size: 10px; margin-left: 4px;">Goleiro</span>
                </span>
                <span class="pagamento-valor" style="font-size: 12px; color: var(--sc-text-muted);">
                  {{ j.goleiro && !j.goleiroPaga ? 'Isento' : `R$ ${valorPorJogador(r)}` }}
                </span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <button
                    class="pagamento-toggle"
                    :class="j.pago ? 'toggle-pago' : 'toggle-pendente'"
                    @click="togglePagamentoJogador(r, idx)"
                  >
                    <svg v-if="j.pago" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ j.pago ? 'Pago' : 'Pendente' }}
                  </button>
                  <button class="btn-mini" @click="toggleGoleiro(r, idx)" :title="j.goleiro ? 'Remover goleiro' : 'Marcar como goleiro'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" :stroke="j.goleiro ? '#f59e0b' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </button>
                  <button class="btn-mini btn-remover" @click="removerJogador(r, idx)" title="Remover jogador">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <!-- Adicionar jogador -->
              <div class="adicionar-jogador-row">
                <input
                  type="text"
                  class="sc-input"
                  v-model="novoJogadorNome[r.id]"
                  placeholder="Nome do jogador"
                  style="height: 34px; font-size: 13px; flex: 1;"
                  @keyup.enter="adicionarJogador(r)"
                />
                <button class="sc-btn sc-btn-primary sc-btn-sm" @click="adicionarJogador(r)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Adicionar
                </button>
              </div>

              <button class="sc-btn sc-btn-primary sc-btn-sm" style="width: 100%; margin-top: 8px;" @click="salvarListaJogadores(r)">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Salvar Alterações
              </button>
            </div>
          </div>

          <!-- ===== AÇÕES DO DONO ===== -->
          <div class="reserva-acoes">
            <template v-if="abaAtiva === 'pendentes'">
              <button class="sc-btn sc-btn-danger sc-btn-sm" @click="cancelar(r.id)">Recusar</button>
              <button class="sc-btn sc-btn-primary sc-btn-sm" @click="confirmar(r.id)">Confirmar Agendamento</button>
            </template>

            <template v-if="abaAtiva === 'confirmadas'">
              <button class="sc-btn sc-btn-danger sc-btn-sm" @click="cancelar(r.id)">Cancelar</button>
              <button class="sc-btn sc-btn-primary sc-btn-sm" @click="concluir(r.id)">Encerrar Horário</button>
            </template>

            <template v-if="abaAtiva === 'encerradas'">
              <span class="sc-badge sc-badge-green" style="display: flex; align-items: center; gap: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Concluído
              </span>
            </template>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "ReservasDono",
  components: { TopbarDono },
  data() {
    return {
      reservas: [],
      abaAtiva: "pendentes",
      carregando: true,
      editando: {},        // { [reservaId]: [...jogadoresLista editável] }
      novoJogadorNome: {} // { [reservaId]: string }
    };
  },
  computed: {
    reservasPendentes() {
      return this.reservas.filter(r => !r.confirmada && r.status !== 'encerrada' && r.status !== 'cancelada');
    },
    reservasConfirmadas() {
      return this.reservas.filter(r => r.confirmada && r.status !== 'encerrada');
    },
    reservasEncerradas() {
      return this.reservas.filter(r => r.status === 'encerrada');
    },
    listaExibicao() {
      if (this.abaAtiva === 'pendentes') return this.reservasPendentes;
      if (this.abaAtiva === 'confirmadas') return this.reservasConfirmadas;
      if (this.abaAtiva === 'encerradas') return this.reservasEncerradas;
      return [];
    }
  },
  async created() {
    await this.carregarReservas();
  },
  methods: {
    fotoSrc(url) {
      if (!url) return '';
      return url.startsWith('http') ? url : `http://localhost:3006${url}`;
    },
    inicialNome(nome) {
      if (!nome) return '?';
      return nome.trim().charAt(0).toUpperCase();
    },
    formatarData(d) {
      if (!d) return '';
      const date = new Date(d + 'T12:00:00');
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    valorPorJogador(r) {
      const lista = this.editando[r.id] || r.jogadoresLista || [];
      if (lista.length === 0) return Number(r.preco || 0).toFixed(2);
      const pagantes = lista.filter(j => !(j.goleiro && j.goleiroPaga === false)).length;
      if (pagantes === 0) return '0.00';
      return (Number(r.preco || 0) / pagantes).toFixed(2);
    },

    async carregarReservas() {
      try {
        this.carregando = true;
        const data = await api.getReservas();
        this.reservas = data;
        // Inicializa editando com cópia da lista para encerradas
        data.forEach(r => {
          if (r.jogadoresLista && r.jogadoresLista.length > 0) {
            this.editando[r.id] = JSON.parse(JSON.stringify(r.jogadoresLista));
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.carregando = false;
      }
    },

    // Alterna pago/pendente da reserva inteira (sem lista de jogadores)
    async alternarPagamentoGlobal(r) {
      const novoStatus = r.statusPagamento === 'pago' ? 'pendente' : 'pago';
      try {
        await api.atualizarStatusPagamento(r.id, novoStatus);
        r.statusPagamento = novoStatus;
      } catch (e) {
        alert(e.message || 'Erro ao alterar pagamento.');
      }
    },

    // Toggle pago/pendente de um jogador individual na lista editável
    togglePagamentoJogador(r, idx) {
      if (!this.editando[r.id]) {
        this.editando[r.id] = JSON.parse(JSON.stringify(r.jogadoresLista));
      }
      const j = this.editando[r.id][idx];
      this.editando[r.id][idx] = { ...j, pago: !j.pago };
    },

    toggleGoleiro(r, idx) {
      if (!this.editando[r.id]) {
        this.editando[r.id] = JSON.parse(JSON.stringify(r.jogadoresLista));
      }
      const j = this.editando[r.id][idx];
      this.editando[r.id][idx] = { ...j, goleiro: !j.goleiro, goleiroPaga: j.goleiro ? true : false };
    },

    removerJogador(r, idx) {
      if (!this.editando[r.id]) {
        this.editando[r.id] = JSON.parse(JSON.stringify(r.jogadoresLista));
      }
      this.editando[r.id].splice(idx, 1);
    },

    adicionarJogador(r) {
      const nome = (this.novoJogadorNome[r.id] || '').trim();
      if (!nome) return;
      if (!this.editando[r.id]) {
        this.editando[r.id] = JSON.parse(JSON.stringify(r.jogadoresLista || []));
      }
      this.editando[r.id].push({ nome, pago: false, goleiro: false, goleiroPaga: true });
      this.novoJogadorNome[r.id] = '';
    },

    async salvarListaJogadores(r) {
      try {
        await api.atualizarListaJogadores(r.id, this.editando[r.id] || r.jogadoresLista, r.jogadoresListaB || []);
        await this.carregarReservas();
        alert('Lista atualizada com sucesso!');
      } catch (e) {
        alert(e.message || 'Erro ao salvar lista.');
      }
    },

    async confirmar(id) {
      try {
        await api.confirmarReserva(id);
        await this.carregarReservas();
      } catch (e) {
        alert(e.message || 'Erro ao confirmar.');
      }
    },
    async concluir(id) {
      try {
        await api.concluirReserva(id);
        await this.carregarReservas();
      } catch (e) {
        alert(e.message || 'Erro ao encerrar.');
      }
    },
    async cancelar(id) {
      if (confirm('Deseja cancelar esta reserva?')) {
        try {
          await api.cancelarReserva(id);
          await this.carregarReservas();
        } catch (e) {
          alert(e.message || 'Erro ao cancelar.');
        }
      }
    }
  }
};
</script>

<style scoped>
.reserva-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Header do card */
.reserva-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.jogador-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--sc-bg-elevated);
  border: 2px solid var(--sc-border);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.jogador-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-inicial {
  font-size: 20px;
  font-weight: 800;
  color: var(--sc-primary);
}

.jogador-info {
  flex: 1;
}
.jogador-nome {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 6px;
  color: var(--sc-text);
}
.jogador-contatos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.contato-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--sc-text-muted);
}

.reserva-badges {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}
.badge-tipo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-cheio {
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.25);
}
.badge-contra {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.25);
}
.badge-time {
  font-size: 11px;
  color: var(--sc-text-muted);
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  padding: 2px 8px;
  border-radius: 12px;
}

/* Data/Horário */
.reserva-datetime {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--sc-bg-elevated);
  border-radius: var(--sc-radius);
  border: 1px solid var(--sc-border);
  flex-wrap: wrap;
}
.datetime-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--sc-text);
}
.datetime-item.preco {
  color: var(--sc-primary);
}
.datetime-sep {
  color: var(--sc-border);
  font-size: 16px;
}

/* Lista de jogadores */
.jogadores-lista-section {
  border-top: 1px solid var(--sc-border);
  padding-top: 14px;
}
.jogadores-lista-titulo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--sc-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px;
}
.jogadores-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.jogador-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  border-radius: 20px;
  font-size: 12px;
  color: var(--sc-text);
}

/* Painel encerradas */
.painel-encerradas {
  border-top: 1px solid var(--sc-border);
  padding-top: 16px;
}
.painel-encerradas-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--sc-primary);
  margin-bottom: 12px;
}
.pagamento-sumario {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 12px;
  background: var(--sc-bg-elevated);
  border-radius: 8px;
}
.pagamento-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.pagamento-row:last-child {
  border-bottom: none;
}
.pagamento-nome {
  flex: 1;
  font-size: 13px;
  color: var(--sc-text);
  font-weight: 500;
}
.pagamento-valor {
  font-size: 13px;
  font-weight: 700;
  color: var(--sc-primary);
  min-width: 70px;
  text-align: right;
}
.pagamento-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.toggle-pago {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}
.toggle-pendente {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}
.btn-mini {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid var(--sc-border);
  background: var(--sc-bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--sc-text-muted);
}
.btn-mini:hover {
  background: var(--sc-bg);
  color: var(--sc-text);
}
.btn-remover:hover {
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}
.adicionar-jogador-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

/* Ações */
.reserva-acoes {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid var(--sc-border);
  padding-top: 14px;
}
</style>
