<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container sc-main sc-main-padded">
      <div style="margin-bottom: 24px;">
        <h1 class="sc-h2">Minhas Reservas</h1>
        <p class="sc-muted">Acompanhe seus agendamentos e avalie as quadras onde jogou</p>
      </div>

      <!-- Abas -->
      <div class="sc-tabs" style="margin-bottom: 24px;">
        <button class="sc-tab" :class="{ active: aba === 'pendentes' }" @click="aba = 'pendentes'">
          Pendentes ({{ pendentes.length }})
        </button>
        <button class="sc-tab" :class="{ active: aba === 'confirmadas' }" @click="aba = 'confirmadas'">
          Confirmadas ({{ confirmadas.length }})
        </button>
        <button class="sc-tab" :class="{ active: aba === 'historico' }" @click="aba = 'historico'">
          Histórico ({{ historico.length }})
        </button>
      </div>

      <div v-if="carregando" class="sc-empty">Carregando reservas...</div>

      <div v-else-if="listaAtiva.length === 0" class="sc-empty" style="padding: 48px 24px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); margin-bottom: 14px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p class="sc-muted">Nenhuma reserva aqui.</p>
        <button class="sc-btn sc-btn-primary sc-btn-sm" style="margin-top: 16px;" @click="$router.push('/reserva')">
          Buscar Quadras
        </button>
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 18px;">
        <div v-for="r in listaAtiva" :key="r.id" class="reserva-card sc-card">

          <!-- Foto da quadra + info principal -->
          <div class="card-top">
            <div class="quadra-thumb">
              <img v-if="r.fotoPreview" :src="fotoSrc(r.fotoPreview)" :alt="r.quadraNome" />
              <div v-else class="thumb-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            </div>

            <div class="card-info">
              <h3 class="quadra-nome">{{ r.quadraNome || 'Quadra' }}</h3>
              <p class="quadra-endereco">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ r.endereco || 'Endereço não informado' }}
              </p>

              <div class="card-meta">
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ formatarData(r.data) }}
                </span>
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ r.horario }}
                </span>
                <span class="meta-item badge-tipo" :class="r.tipoJogo === 'contra_time' ? 'badge-contra' : 'badge-cheio'">
                  {{ r.tipoJogo === 'contra_time' ? 'Contra Time' : 'Horário Cheio' }}
                </span>
              </div>
            </div>

            <!-- Status badge -->
            <div class="status-col">
              <span class="status-badge" :class="statusClass(r)">
                {{ statusTexto(r) }}
              </span>
            </div>
          </div>

          <!-- Lista de jogadores se existir -->
          <div v-if="r.jogadoresLista && r.jogadoresLista.length > 0" class="jogadores-section">
            <p class="secao-titulo">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Jogadores
            </p>
            <div class="jogadores-chips">
              <span v-for="(j, i) in r.jogadoresLista" :key="i" class="jogador-chip">
                {{ typeof j === 'string' ? j : j.nome }}
                <span v-if="j && j.goleiro" style="color: #f59e0b; font-size: 10px;">(G)</span>
                <span v-if="j && j.pago !== undefined" class="chip-pago" :class="j.pago ? 'chip-pago-sim' : 'chip-pago-nao'">
                  {{ j.pago ? 'Pago' : 'Pendente' }}
                </span>
              </span>
            </div>
          </div>

          <!-- Ações / Avaliar -->
          <div class="card-acoes">
            <!-- Botão avaliar: aparece quando confirmado e ainda não avaliado -->
            <button
              v-if="r.confirmada && !r.avaliado"
              class="sc-btn sc-btn-primary sc-btn-sm"
              @click="abrirAvaliacao(r)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Avaliar Quadra
            </button>

            <!-- Nota já dada -->
            <div v-if="r.avaliado" class="avaliacao-dada">
              <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" :fill="n <= r.nota ? '#fbbf24' : 'none'" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style="font-size: 12px; color: var(--sc-text-muted);">Avaliado</span>
            </div>

            <!-- Cancelar pendente -->
            <button
              v-if="aba === 'pendentes'"
              class="sc-btn sc-btn-danger sc-btn-sm"
              @click="cancelarReserva(r.id)"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Avaliação -->
    <div v-if="modalAvaliacao" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-box">
        <div class="modal-header">
          <h2 style="font-size: 18px; font-weight: 800; margin: 0;">Avaliar Quadra</h2>
          <button class="btn-fechar" @click="fecharModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <p class="sc-muted" style="margin: 4px 0 20px; font-size: 14px;">
          {{ modalAvaliacao.quadraNome }}
        </p>

        <!-- Estrelas -->
        <div class="estrelas-row">
          <button
            v-for="n in 5"
            :key="n"
            class="estrela-btn"
            @click="notaSelecionada = n"
            @mouseover="notaHover = n"
            @mouseleave="notaHover = 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
              :fill="n <= (notaHover || notaSelecionada) ? '#fbbf24' : 'none'"
              :stroke="n <= (notaHover || notaSelecionada) ? '#fbbf24' : '#6b7280'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        </div>
        <p style="text-align: center; font-size: 13px; color: var(--sc-text-muted); margin: 8px 0 20px;">
          {{ notaTexto }}
        </p>

        <!-- Mensagem -->
        <div class="sc-form-group">
          <label class="sc-label">Comentário (opcional)</label>
          <textarea
            class="sc-input"
            v-model="mensagemAvaliacao"
            rows="3"
            placeholder="Conta como foi sua experiência..."
            style="resize: vertical; min-height: 80px;"
          ></textarea>
        </div>

        <button
          class="sc-btn sc-btn-primary sc-btn-lg"
          style="width: 100%;"
          :disabled="!notaSelecionada || enviandoAvaliacao"
          @click="enviarAvaliacao"
        >
          {{ enviandoAvaliacao ? 'Enviando...' : 'Enviar Avaliação' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "MinhasReservasJogador",
  components: { TopbarJogador },
  data() {
    return {
      reservas: [],
      aba: "pendentes",
      carregando: true,
      modalAvaliacao: null,
      notaSelecionada: 0,
      notaHover: 0,
      mensagemAvaliacao: "",
      enviandoAvaliacao: false
    };
  },
  computed: {
    pendentes() {
      return this.reservas.filter(r => !r.confirmada);
    },
    confirmadas() {
      return this.reservas.filter(r => r.confirmada && r.status !== 'encerrada');
    },
    historico() {
      return this.reservas.filter(r => r.status === 'encerrada');
    },
    listaAtiva() {
      if (this.aba === 'pendentes') return this.pendentes;
      if (this.aba === 'confirmadas') return this.confirmadas;
      return this.historico;
    },
    notaTexto() {
      const n = this.notaHover || this.notaSelecionada;
      return ['', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente'][n] || 'Selecione uma nota';
    }
  },
  async created() {
    await this.carregar();
  },
  methods: {
    fotoSrc(url) {
      if (!url) return '';
      return url.startsWith('http') ? url : `http://localhost:3006${url}`;
    },
    formatarData(d) {
      if (!d) return '';
      const date = new Date(d + 'T12:00:00');
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    statusTexto(r) {
      if (r.status === 'encerrada') return 'Encerrado';
      if (r.confirmada) return 'Confirmado';
      return 'Aguardando';
    },
    statusClass(r) {
      if (r.status === 'encerrada') return 'status-encerrada';
      if (r.confirmada) return 'status-confirmada';
      return 'status-pendente';
    },
    async carregar() {
      try {
        this.carregando = true;
        this.reservas = await api.getReservas();
        // Se vier da finalização da reserva, mostrar aba pendentes
        if (this.$route.query.nova) {
          this.aba = 'pendentes';
        }
      } catch (e) {
        console.error('Erro ao carregar reservas:', e);
      } finally {
        this.carregando = false;
      }
    },
    abrirAvaliacao(r) {
      this.modalAvaliacao = r;
      this.notaSelecionada = r.nota || 0;
      this.notaHover = 0;
      this.mensagemAvaliacao = '';
    },
    fecharModal() {
      this.modalAvaliacao = null;
      this.notaSelecionada = 0;
      this.mensagemAvaliacao = '';
    },
    async enviarAvaliacao() {
      if (!this.notaSelecionada) return;
      try {
        this.enviandoAvaliacao = true;
        await api.avaliarQuadra(this.modalAvaliacao.quadraId, this.notaSelecionada, this.mensagemAvaliacao);
        this.fecharModal();
        await this.carregar();
        alert('Avaliação enviada! Obrigado pelo feedback.');
      } catch (e) {
        alert(e.message || 'Erro ao enviar avaliação.');
      } finally {
        this.enviandoAvaliacao = false;
      }
    },
    async cancelarReserva(id) {
      if (!confirm('Deseja cancelar esta reserva?')) return;
      try {
        await api.cancelarReserva(id);
        await this.carregar();
      } catch (e) {
        alert(e.message || 'Erro ao cancelar reserva.');
      }
    }
  }
};
</script>

<style scoped>
/* Card */
.reserva-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-top {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.quadra-thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
}
.quadra-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sc-text-muted);
}

.card-info {
  flex: 1;
  min-width: 0;
}
.quadra-nome {
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 4px;
  color: var(--sc-text);
}
.quadra-endereco {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--sc-text-muted);
  margin: 0 0 8px;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--sc-text-muted);
}
.badge-tipo {
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
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

.status-col {
  flex-shrink: 0;
}
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.status-pendente {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.25);
}
.status-confirmada {
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.25);
}
.status-encerrada {
  background: rgba(107, 114, 128, 0.15);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.25);
}

/* Jogadores */
.jogadores-section {
  border-top: 1px solid var(--sc-border);
  padding-top: 12px;
}
.secao-titulo {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--sc-text-muted);
  margin: 0 0 8px;
}
.jogadores-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.jogador-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  border-radius: 20px;
  font-size: 12px;
  color: var(--sc-text);
}
.chip-pago {
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
}
.chip-pago-sim {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}
.chip-pago-nao {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
}

/* Ações */
.card-acoes {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  border-top: 1px solid var(--sc-border);
  padding-top: 12px;
}
.avaliacao-dada {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.modal-box {
  background: var(--sc-bg-card);
  border: 1px solid var(--sc-border);
  border-radius: 20px;
  padding: 28px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.btn-fechar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--sc-border);
  background: var(--sc-bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--sc-text-muted);
  transition: all 0.15s;
}
.btn-fechar:hover {
  color: var(--sc-text);
  background: var(--sc-bg);
}

.estrelas-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4px;
}
.estrela-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: transform 0.15s;
}
.estrela-btn:hover {
  transform: scale(1.15);
}
</style>
