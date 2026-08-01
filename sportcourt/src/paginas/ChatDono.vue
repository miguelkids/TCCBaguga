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
              <div class="sc-avatar" style="width: 36px; height: 36px;">
                <img v-if="t.jogador_foto" :src="t.jogador_foto" :alt="t.jogador_nome" />
                <span v-else>{{ (t.jogador_nome || '?').charAt(0).toUpperCase() }}</span>
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
          <div v-if="!threadAtiva" class="sc-empty" style="margin: auto;">
            <div class="sc-empty-icon">💬</div>
            <p>Selecione uma conversa para visualizar as mensagens.</p>
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
    if (!this.quadraId) {
      const minhas = await api.getMinhasQuadras();
      if (minhas.length > 0) this.quadraId = minhas[0].id;
    }
    if (this.quadraId) {
      await this.carregarThreads();
      this.pollInterval = setInterval(this.carregarThreads, 3000);
    }
  },
  unmounted() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  },
  methods: {
    async carregarThreads() {
      try {
        this.threads = await api.getChatThreads(this.quadraId);
        this.carregandoThreads = false;
        if (this.threadAtiva) {
          await this.carregarMensagensThread(this.threadAtiva);
        }
      } catch (e) {
        console.error(e);
      }
    },
    async selecionarThread(jogadorId) {
      this.threadAtiva = jogadorId;
      await this.carregarMensagensThread(jogadorId);
    },
    async carregarMensagensThread(jogadorId) {
      try {
        this.mensagens = await api.getChatThreadJogador(this.quadraId, jogadorId);
        this.$nextTick(() => {
          if (this.$refs.messagesWrap) {
            this.$refs.messagesWrap.scrollTop = this.$refs.messagesWrap.scrollHeight;
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    async enviar() {
      if (!this.textoNovaMensagem.trim() || !this.threadAtiva) return;
      try {
        this.enviando = true;
        await api.enviarMensagem(this.quadraId, this.textoNovaMensagem.trim());
        this.textoNovaMensagem = '';
        await this.carregarMensagensThread(this.threadAtiva);
        await this.carregarThreads();
      } catch (e) {
        alert(e.message || 'Erro ao enviar.');
      } finally {
        this.enviando = false;
      }
    }
  }
};
</script>

<style scoped>
.grid-chat {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 600px;
  overflow: hidden;
}
@media (max-width: 768px) {
  .grid-chat { grid-template-columns: 1fr; height: auto; }
}

.chat-sidebar {
  border-right: 1px solid var(--sc-border);
  display: flex;
  flex-direction: column;
}
.threads-list {
  overflow-y: auto;
  flex: 1;
}
.thread-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--sc-border);
  transition: background 0.2s;
}
.thread-item:hover, .thread-item.active {
  background: var(--sc-bg-elevated);
}

.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  border-radius: var(--sc-radius-lg);
  font-size: 14px;
  line-height: 1.4;
}
.msg-jogador {
  background: var(--sc-bg-elevated);
  border: 1px solid var(--sc-border);
  color: var(--sc-text);
}
.msg-dono {
  background: var(--sc-primary);
  color: #0f1117;
  font-weight: 500;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
