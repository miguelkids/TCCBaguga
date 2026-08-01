<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container sc-main sc-main-padded">
      <!-- Topbar Header -->
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px;">
        <div class="sc-flex sc-gap-3">
          <button class="sc-btn sc-btn-ghost sc-btn-sm" @click="$router.push('/reserva')">
            ← Voltar para Busca
          </button>
          <h1 class="sc-h2" style="margin: 0;">Reserva de Horário</h1>
        </div>
        <button v-if="quadra" class="sc-btn sc-btn-secondary sc-btn-sm" @click="chatAberto = !chatAberto">
          💬 Falar com a Arena
        </button>
      </div>

      <div class="sc-grid-2">
        <!-- Coluna Esquerda: Dados da Quadra + Calendário + Slots -->
        <div>
          <!-- Card da Quadra -->
          <div v-if="quadra" class="sc-card" style="padding: 20px; margin-bottom: 20px;">
            <div class="sc-flex sc-gap-4">
              <div class="sc-avatar" style="width: 72px; height: 72px; border-radius: var(--sc-radius-lg);">
                <img v-if="quadra.fotoUrl" :src="fotoSrc(quadra.fotoUrl)" :alt="quadra.nomeQuadra" />
                <span v-else>🏟️</span>
              </div>
              <div>
                <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">{{ quadra.nomeQuadra }}</h2>
                <p class="sc-muted" style="font-size: 13px; margin-bottom: 6px;">📍 {{ quadra.endereco }}, {{ quadra.cidade }}</p>
                <div class="sc-flex sc-gap-2">
                  <span class="sc-badge sc-badge-green">R$ {{ quadra.preco }}/h</span>
                  <span class="sc-badge sc-badge-neutral">{{ quadra.esporte || 'Futebol' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Seleção de Data -->
          <div class="sc-card" style="padding: 20px; margin-bottom: 20px;">
            <h3 class="sc-h3" style="margin-bottom: 12px;">1. Selecione a Data</h3>
            <input type="date" class="sc-input" v-model="dataSelecionada" :min="hojeISO" @change="carregarHorariosOcupados" />
          </div>

          <!-- Horários Disponíveis -->
          <div v-if="dataSelecionada" class="sc-card" style="padding: 20px;">
            <h3 class="sc-h3" style="margin-bottom: 12px;">2. Escolha o Horário</h3>
            <div class="sc-grid-3" style="gap: 8px;">
              <button
                v-for="h in horarios"
                :key="h"
                class="sc-chip"
                :class="{ active: horarioSelecionado === h, disabled: isOcupado(h) }"
                :disabled="isOcupado(h)"
                @click="horarioSelecionado = h"
                style="justify-content: center;"
              >
                {{ h }} {{ isOcupado(h) ? '(Ocupado)' : '' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Coluna Direita: Dados do Agendador + Confirmação -->
        <div>
          <div class="sc-card" style="padding: 24px; position: sticky; top: 80px;">
            <h2 class="sc-h3" style="margin-bottom: 16px;">Resumo & Agendamento</h2>

            <div v-if="!dataSelecionada || !horarioSelecionado" class="sc-empty">
              <p>Selecione uma data e um horário para continuar.</p>
            </div>
            <div v-else>
              <div class="sc-card-elevated" style="padding: 16px; margin-bottom: 20px;">
                <div class="sc-flex-between" style="margin-bottom: 8px;">
                  <span class="sc-muted">Data:</span>
                  <span style="font-weight: 700;">{{ formatarData(dataSelecionada) }}</span>
                </div>
                <div class="sc-flex-between" style="margin-bottom: 8px;">
                  <span class="sc-muted">Horário:</span>
                  <span style="font-weight: 700; color: var(--sc-primary);">{{ horarioSelecionado }}</span>
                </div>
                <div class="sc-flex-between">
                  <span class="sc-muted">Valor Hora:</span>
                  <span style="font-weight: 800;">R$ {{ quadra.preco }}</span>
                </div>
              </div>

              <div class="sc-form-group">
                <label class="sc-label">Seu Nome *</label>
                <input type="text" class="sc-input" v-model="jogador.nome" placeholder="Seu nome" required />
              </div>

              <div class="sc-form-group">
                <label class="sc-label">Seu Telefone (WhatsApp) *</label>
                <input type="text" class="sc-input" v-model="jogador.telefone" placeholder="(00) 00000-0000" required />
              </div>

              <div class="sc-form-group">
                <label class="sc-label">Tipo de Partida</label>
                <select class="sc-input" v-model="tipoJogo">
                  <option value="fechado">Horário Fechado (Seu time/amigos)</option>
                  <option value="contra_time">Desafio Contra Outro Time (Aberto a oponente)</option>
                </select>
              </div>

              <div class="sc-form-group" v-if="tipoJogo === 'contra_time'">
                <label class="sc-label">Nome do Seu Time</label>
                <input type="text" class="sc-input" v-model="nomeTime" placeholder="Ex: Galácticos FC" />
              </div>

              <button class="sc-btn sc-btn-primary sc-btn-lg" @click="confirmarReserva" :disabled="salvando">
                {{ salvando ? 'Confirmando...' : 'Confirmar Reserva e Agendar →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal / Drawer do Chat com a Arena -->
    <div v-if="chatAberto" class="sc-overlay" @click.self="chatAberto = false">
      <div class="sc-modal" style="max-width: 480px; height: 500px; display: flex; flex-direction: column;">
        <div class="sc-modal-header">
          <span>💬 Conversar com {{ quadra.nomeQuadra }}</span>
          <button class="sc-btn sc-btn-ghost sc-btn-sm" @click="chatAberto = false">✕</button>
        </div>
        <div class="sc-modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          <div v-for="m in mensagensChat" :key="m.id" class="msg-bubble-wrap" :class="{ 'mine': m.tipo_remetente === 'jogador' }">
            <div class="msg-bubble" :class="m.tipo_remetente === 'jogador' ? 'msg-dono' : 'msg-jogador'">
              <div style="font-size: 10px; opacity: 0.7;">{{ m.autor_nome }}</div>
              <div>{{ m.texto }}</div>
            </div>
          </div>
        </div>
        <div class="sc-modal-footer" style="padding: 12px;">
          <input type="text" class="sc-input" v-model="textoChat" placeholder="Escreva sua dúvida..." @keyup.enter="enviarMensagemChat" />
          <button class="sc-btn sc-btn-primary" @click="enviarMensagemChat">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "FinalizarReserva",
  components: { TopbarJogador },
  data() {
    return {
      quadra: null,
      dataSelecionada: new Date().toISOString().slice(0, 10),
      horarioSelecionado: "",
      hojeISO: new Date().toISOString().slice(0, 10),
      horarios: Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`),
      horariosOcupados: [],
      jogador: { nome: "", telefone: "" },
      tipoJogo: "fechado",
      nomeTime: "",
      salvando: false,

      // Chat
      chatAberto: false,
      mensagensChat: [],
      textoChat: ""
    };
  },
  async created() {
    const qStr = localStorage.getItem("quadraSelecionada");
    if (qStr) {
      try { this.quadra = JSON.parse(qStr); } catch (_e) { /* ignorado */ }
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        this.jogador.nome = u.nome || "";
        this.jogador.telefone = u.telefone || "";
      } catch (_e) { /* ignorado */ }
    }
    if (this.quadra && this.dataSelecionada) {
      await this.carregarHorariosOcupados();
    }
  },
  watch: {
    chatAberto(val) {
      if (val) this.carregarChat();
    }
  },
  methods: {
    fotoSrc(url) {
      if (!url) return "";
      return url.startsWith("http") ? url : `http://localhost:3006${url}`;
    },
    formatarData(d) {
      if (!d) return "";
      const [ano, mes, dia] = d.split("-");
      return `${dia}/${mes}/${ano}`;
    },
    async carregarHorariosOcupados() {
      if (!this.quadra) return;
      try {
        const res = await api.getHorariosOcupados(this.quadra.id, this.dataSelecionada);
        this.horariosOcupados = res.map(i => i.horario);
      } catch (e) {
        console.error(e);
      }
    },
    isOcupado(h) {
      return this.horariosOcupados.includes(h);
    },
    async confirmarReserva() {
      if (!this.jogador.nome || !this.jogador.telefone) {
        alert("Preencha seu nome e telefone.");
        return;
      }
      try {
        this.salvando = true;
        await api.createReserva({
          quadraId: this.quadra.id,
          nomeJogador: this.jogador.nome,
          telefoneJogador: this.jogador.telefone,
          dataReserva: this.dataSelecionada,
          horarioReserva: this.horarioSelecionado,
          tipoJogo: this.tipoJogo,
          nomeTime: this.nomeTime
        });
        alert("Reserva efetuada com sucesso!");
        this.$router.push("/menu-jogador");
      } catch (e) {
        alert(e.message || "Erro ao efetuar reserva.");
      } finally {
        this.salvando = false;
      }
    },
    async carregarChat() {
      if (!this.quadra) return;
      try {
        this.mensagensChat = await api.getChatMensagens(this.quadra.id);
      } catch (e) {
        console.error(e);
      }
    },
    async enviarMensagemChat() {
      if (!this.textoChat.trim() || !this.quadra) return;
      try {
        await api.enviarMensagem(this.quadra.id, this.textoChat.trim(), this.jogador.nome);
        this.textoChat = "";
        await this.carregarChat();
      } catch (e) {
        alert(e.message || "Erro ao enviar.");
      }
    }
  }
};
</script>

<style scoped>
.msg-bubble-wrap { display: flex; justify-content: flex-start; }
.msg-bubble-wrap.mine { justify-content: flex-end; }
.msg-bubble { max-width: 80%; padding: 8px 12px; border-radius: var(--sc-radius); font-size: 13px; }
.msg-jogador { background: var(--sc-primary); color: #0f1117; font-weight: 500; }
.msg-dono { background: var(--sc-bg-elevated); border: 1px solid var(--sc-border); color: var(--sc-text); }
.sc-chip.disabled { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }
</style>
