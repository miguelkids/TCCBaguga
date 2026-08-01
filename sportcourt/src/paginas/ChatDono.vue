<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div style="margin-bottom: 20px;">
        <h1 class="sc-h2">Chat com Jogadores</h1>
        <p class="sc-muted">Responda dúvidas de atletas e negocie horários de mensalistas.</p>
      </div>

      <div class="sc-card grid-chat">
        <!-- Sidebar de conversas -->
        <aside class="chat-sidebar">
          <div class="sc-label" style="padding: 16px 16px 8px;">Conversas</div>
          <div v-if="carregandoThreads" class="sc-empty" style="padding: 20px;">Carregando...</div>
          <div v-else-if="threads.length === 0" class="sc-empty" style="padding: 20px;">
            Nenhuma conversa iniciada.
          </div>
          <div v-else class="threads-list">
            <div
              v-for="t in threads"
              :key="t.jogador_id"
              class="thread-item"
              :class="{ active: threadAtiva === t.jogador_id }"
              @click="selecionarThread(t.jogador_id)"
            >
              <div class="sc-avatar" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--sc-bg-elevated);">
                <img v-if="t.jogador_foto" :src="t.jogador_foto" :alt="t.jogador_nome" style="width: 100%; height: 100%; object-fit: cover;" />
                <span v-else style="font-weight: 700; color: var(--sc-primary);">{{ (t.jogador_nome || '?').charAt(0).toUpperCase() }}</span>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div class="sc-flex-between">
                  <span style="font-weight: 700; font-size: 13px;" class="truncate">{{ t.jogador_nome }}</span>
                  <span v-if="t.nao_lidas > 0" class="sc-badge sc-badge-green" style="font-size: 10px;">{{ t.nao_lidas }}</span>
                </div>
                <div class="sc-muted truncate" style="font-size: 12px; margin-top: 2px;">
                  {{ t.ultima_mensagem || 'Iniciou conversa' }}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Área de mensagens -->
        <section class="chat-main">
          <div v-if="!threadAtiva" class="sc-empty" style="margin: auto; padding: 40px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); margin-bottom: 12px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p class="sc-muted">Selecione uma conversa para visualizar as mensagens.</p>
          </div>
          <template v-else>
            <div class="messages-wrap" ref="messagesWrap">
              <div
                v-for="m in mensagens"
                :key="m.id"
                class="msg-bubble-wrap"
                :class="{ 'mine': m.tipo_remetente === 'dono' }"
              >
                <div class="msg-bubble" :class="m.tipo_remetente === 'dono' ? 'msg-dono' : 'msg-jogador'">
                  <div style="font-size: 10px; opacity: 0.7; margin-bottom: 2px;">{{ m.autor_nome || m.usuario_nome }}</div>
                  <div>{{ m.texto }}</div>
                </div>
              </div>
            </div>

            <!-- Input de envio -->
            <form @submit.prevent="enviar" class="sc-flex sc-gap-2" style="padding: 12px; border-top: 1px solid var(--sc-border);">
              <input
                type="text"
                class="sc-input"
                v-model="textoNovaMensagem"
                placeholder="Escreva uma resposta..."
              />
              <button type="submit" class="sc-btn sc-btn-primary" :disabled="!textoNovaMensagem.trim() || enviando">
                Enviar
              </button>
            </form>
          </template>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarDono from '@/components/TopbarDono.vue';
import { api } from '@/api';

export default {
  name: 'ChatDono',
  components: { TopbarDono },
  data() {
    return {
      quadraId: null,
      threads: [],
      threadAtiva: null,
      mensagens: [],
      textoNovaMensagem: '',
      carregandoThreads: true,
      enviando: false,
      pollInterval: null
    };
  },
  async created() {
    this.quadraId = localStorage.getItem('quadraId');
    await this.carregarThreads();
    this.pollInterval = setInterval(this.carregarMensagensSilencioso, 3000);
  },
  beforeUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  },
  methods: {
    async carregarThreads() {
      if (!this.quadraId) return;
      try {
        this.carregandoThreads = true;
        this.threads = await api.getThreadsDono(this.quadraId);
        if (this.threads.length > 0 && !this.threadAtiva) {
          this.selecionarThread(this.threads[0].jogador_id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.carregandoThreads = false;
      }
    },
    async selecionarThread(jogadorId) {
      this.threadAtiva = jogadorId;
      await this.carregarMensagens();
    },
    async carregarMensagens() {
      if (!this.quadraId || !this.threadAtiva) return;
      try {
        this.mensagens = await api.getMensagensChat(this.quadraId, this.threadAtiva);
        this.$nextTick(() => {
          this.rolarParaBaixo();
        });
      } catch (e) {
        console.error(e);
      }
    },
    async carregarMensagensSilencioso() {
      if (!this.quadraId || !this.threadAtiva) return;
      try {
        const msgs = await api.getMensagensChat(this.quadraId, this.threadAtiva);
        if (msgs.length !== this.mensagens.length) {
          this.mensagens = msgs;
          this.$nextTick(() => this.rolarParaBaixo());
        }
      } catch (e) {
        // silencioso
      }
    },
    async enviar() {
      if (!this.textoNovaMensagem.trim() || !this.quadraId || !this.threadAtiva) return;
      try {
        this.enviando = true;
        await api.enviarMensagemChat(this.quadraId, this.threadAtiva, this.textoNovaMensagem.trim());
        this.textoNovaMensagem = '';
        await this.carregarMensagens();
      } catch (e) {
        alert(e.message || 'Erro ao enviar mensagem.');
      } finally {
        this.enviando = false;
      }
    },
    rolarParaBaixo() {
      const el = this.$refs.messagesWrap;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }
};
</script>

<style scoped>
.grid-chat {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 520px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .grid-chat {
    grid-template-columns: 1fr;
  }
}

.chat-sidebar {
  border-right: 1px solid var(--sc-border);
  display: flex;
  flex-direction: column;
}

.threads-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.thread-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--sc-border);
  cursor: pointer;
  transition: background var(--sc-transition);
}

.thread-item:hover {
  background: var(--sc-bg-elevated);
}

.thread-item.active {
  background: var(--sc-primary-subtle);
  border-left: 3px solid var(--sc-primary);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-wrap {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 440px;
}

.msg-bubble-wrap {
  display: flex;
  justify-content: flex-start;
}

.msg-bubble-wrap.mine {
  justify-content: flex-end;
}

.msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
}

.msg-jogador {
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  color: var(--sc-text);
  border-top-left-radius: 2px;
}

.msg-dono {
  background: var(--sc-primary);
  color: #0f1117;
  font-weight: 500;
  border-top-right-radius: 2px;
}
</style>
