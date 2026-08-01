<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container sc-main sc-main-padded">
      <!-- Topbar Header -->
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px;">
        <div class="sc-flex sc-gap-3">
          <button class="sc-btn sc-btn-ghost sc-btn-sm" @click="$router.push('/reserva')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Voltar para Busca
          </button>
          <h1 class="sc-h2" style="margin: 0;">Reserva de Horário</h1>
        </div>
        <button v-if="quadra" class="sc-btn sc-btn-secondary sc-btn-sm" @click="chatAberto = !chatAberto">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Falar com a Arena
        </button>
      </div>

      <div class="sc-grid-2">
        <!-- Coluna Esquerda: Dados da Quadra + Calendário + Slots -->
        <div>
          <!-- Card da Quadra -->
          <div v-if="quadra" class="sc-card" style="padding: 20px; margin-bottom: 20px;">
            <div class="sc-flex sc-gap-4">
              <div class="sc-avatar" style="width: 72px; height: 72px; border-radius: var(--sc-radius-lg); background: var(--sc-bg-elevated); display: flex; align-items: center; justify-content: center;">
                <img v-if="quadra.fotoUrl" :src="fotoSrc(quadra.fotoUrl)" :alt="quadra.nomeQuadra" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--sc-radius-lg);" />
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">{{ quadra.nomeQuadra }}</h2>
                <p class="sc-muted" style="font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ quadra.endereco }}, {{ quadra.cidade }}
                </p>
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

            <div v-if="!dataSelecionada || !horarioSelecionado" class="sc-empty" style="padding: 20px;">
              <p class="sc-muted">Selecione uma data e um horário para continuar.</p>
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
                  <span style="font-weight: 800;">R$ {{ quadra ? quadra.preco : '0.00' }}</span>
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

              <button class="sc-btn sc-btn-primary sc-btn-lg" @click="confirmarReserva" :disabled="salvando" style="width: 100%;">
                {{ salvando ? 'Confirmando...' : 'Confirmar Reserva e Agendar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal / Drawer do Chat com a Arena -->
    <div v-if="chatAberto" class="sc-overlay" @click.self="chatAberto = false">
      <div class="sc-modal" style="max-width: 480px; height: 500px; display: flex; flex-direction: column;">
        <div class="sc-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--sc-border);">
          <span style="font-weight: 700;">Conversar com {{ quadra ? quadra.nomeQuadra : 'Arena' }}</span>
          <button class="sc-btn sc-btn-ghost sc-btn-sm" @click="chatAberto = false">✕</button>
        </div>
        <div class="sc-modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 16px;">
          <div v-for="m in mensagensChat" :key="m.id" class="msg-bubble-wrap" :class="{ 'mine': m.tipo_remetente === 'jogador' }">
            <div class="msg-bubble" :class="m.tipo_remetente === 'jogador' ? 'msg-dono' : 'msg-jogador'">
              <div style="font-size: 10px; opacity: 0.7;">{{ m.autor_nome }}</div>
              <div>{{ m.texto }}</div>
            </div>
          </div>
        </div>
        <div class="sc-modal-footer" style="padding: 12px; border-top: 1px solid var(--sc-border); display: flex; gap: 8px;">
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
      horarios: Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`),
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
      const parts = d.split("-");
      if (parts.length < 3) return d;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    },
    async carregarHorariosOcupados() {
      if (!this.quadra || !this.quadra.id) return;
      try {
        const res = await api.getHorariosOcupados(this.quadra.id, this.dataSelecionada);
        if (Array.isArray(res)) {
          this.horariosOcupados = res.map(i => (typeof i === "string" ? i : i.horario || i.horario_reserva || ""));
        } else {
          this.horariosOcupados = [];
        }
      } catch (e) {
        console.error("Erro ao buscar horários ocupados:", e);
        this.horariosOcupados = [];
      }
    },
    isOcupado(h) {
      return this.horariosOcupados.includes(h);
    },
    async confirmarReserva() {
      if (!this.quadra || !this.quadra.id) {
        alert("Nenhuma quadra selecionada. Volte para a busca e selecione uma quadra.");
        this.$router.push("/reserva");
        return;
      }
      if (!this.dataSelecionada || !this.horarioSelecionado) {
        alert("Selecione a data e o horário desejados.");
        return;
      }
      if (!this.jogador.nome.trim() || !this.jogador.telefone.trim()) {
        alert("Preencha seu nome e telefone para contato.");
        return;
      }
      try {
        this.salvando = true;
        await api.createReserva({
          quadraId: this.quadra.id,
          nomeJogador: this.jogador.nome.trim(),
          telefoneJogador: this.jogador.telefone.trim(),
          data: this.dataSelecionada,
          horario: this.horarioSelecionado,
          dataReserva: this.dataSelecionada,
          horarioReserva: this.horarioSelecionado,
          tipoJogo: this.tipoJogo,
          nomeTime: this.nomeTime
        });
        alert("Reserva enviada com sucesso ao proprietário da quadra!");
        this.$router.push("/menu-jogador");
      } catch (e) {
        console.error("Erro ao efetuar reserva:", e);
        alert(e.message || "Erro ao efetuar reserva.");
      } finally {
        this.salvando = false;
      }
    },
    async carregarChat() {
      if (!this.quadra || !this.quadra.id) return;
      try {
        this.mensagensChat = await api.getChatMensagens(this.quadra.id);
      } catch (e) {
        console.error(e);
      }
    },
    async enviarMensagemChat() {
      if (!this.textoChat.trim() || !this.quadra || !this.quadra.id) return;
      try {
        await api.enviarMensagem(this.quadra.id, this.textoChat.trim(), this.jogador.nome);
        this.textoChat = "";
        await this.carregarChat();
      } catch (e) {
        alert(e.message || "Erro ao enviar mensagem.");
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
