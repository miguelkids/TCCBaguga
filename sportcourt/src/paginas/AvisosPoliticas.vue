<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div style="margin-bottom: 24px;">
        <h1 class="sc-h2">Avisos e Políticas da Quadra</h1>
        <p class="sc-muted">Configure informações exibidas para os atletas na página da sua arena.</p>
      </div>

      <div class="sc-grid-2">
        <!-- Card 1: Políticas da Arena -->
        <div class="sc-card" style="padding: 24px;">
          <h2 class="sc-h3" style="margin-bottom: 16px;">Políticas e Regras</h2>

          <div class="sc-form-group">
            <label class="sc-label">Mensalistas & Horários Fixos</label>
            <textarea
              class="sc-textarea"
              v-model="form.mensalistaMsg"
              placeholder="Ex: Oferecemos planos para mensalistas. Entre em contato para reserva de horário fixo."
            ></textarea>
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Política de Cancelamento e Reembolso</label>
            <textarea
              class="sc-textarea"
              v-model="form.politicaCancelamento"
              placeholder="Ex: Cancelamento gratuito até 24h antes do horário agendado."
            ></textarea>
          </div>

          <button class="sc-btn sc-btn-primary" @click="salvarPoliticas" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>

        <!-- Card 2: Anúncios Adicionais -->
        <div class="sc-card" style="padding: 24px;">
          <h2 class="sc-h3" style="margin-bottom: 16px;">Anúncios e Avisos Especiais</h2>

          <div class="sc-card-elevated" style="padding: 16px; margin-bottom: 16px;">
            <div class="sc-label">Criar Novo Anúncio</div>
            <div class="sc-form-group">
              <input type="text" class="sc-input" v-model="novoAnuncio.titulo" placeholder="Título (ex: Torneio de Fim de Semana)" />
            </div>
            <div class="sc-form-group">
              <textarea class="sc-textarea" v-model="novoAnuncio.corpo" placeholder="Descrição do anúncio ou recado importante..."></textarea>
            </div>
            <div class="sc-flex-between">
              <select class="sc-input" v-model="novoAnuncio.tom" style="width: auto;">
                <option value="info">Info (Azul/Neutro)</option>
                <option value="warning">Aviso (Amarelo)</option>
                <option value="success">Destaque (Verde)</option>
              </select>
              <button class="sc-btn sc-btn-primary sc-btn-sm" @click="adicionarAnuncio">
                + Adicionar Anúncio
              </button>
            </div>
          </div>

          <div class="sc-label">Anúncios Ativos</div>
          <div v-if="anuncios.length === 0" class="sc-muted" style="font-size: 13px;">Nenhum anúncio ativo.</div>
          <div v-else style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
            <div
              v-for="(a, idx) in anuncios"
              :key="idx"
              class="sc-flex-between"
              style="padding: 12px; border-radius: var(--sc-radius); border: 1px solid var(--sc-border);"
              :style="getEstiloTom(a.tom)"
            >
              <div>
                <div style="font-weight: 700; font-size: 14px;">{{ a.titulo }}</div>
                <div style="font-size: 13px; opacity: 0.9;">{{ a.corpo }}</div>
              </div>
              <button class="sc-btn sc-btn-ghost sc-btn-sm" @click="removerAnuncio(idx)">✕</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarDono from '@/components/TopbarDono.vue';
import { api } from '@/api';

export default {
  name: 'AvisosPoliticas',
  components: { TopbarDono },
  data() {
    return {
      quadraId: null,
      form: {
        mensalistaMsg: '',
        politicaCancelamento: ''
      },
      anuncios: [],
      novoAnuncio: {
        titulo: '',
        corpo: '',
        tom: 'info'
      },
      salvando: false
    };
  },
  async created() {
    this.quadraId = localStorage.getItem('quadraId');
    if (!this.quadraId) {
      const minhas = await api.getMinhasQuadras();
      if (minhas.length > 0) this.quadraId = minhas[0].id;
    }
    if (this.quadraId) {
      await this.carregarQuadra();
    }
  },
  methods: {
    async carregarQuadra() {
      try {
        const q = await api.getQuadra(this.quadraId);
        this.form.mensalistaMsg = q.mensalistaMsg || '';
        this.form.politicaCancelamento = q.politicaCancelamento || '';
        if (q.anuncios) this.anuncios = q.anuncios;
      } catch (e) {
        console.error(e);
      }
    },
    async salvarPoliticas() {
      try {
        this.salvando = true;
        await api.atualizarQuadra(this.quadraId, {
          mensalistaMsg: this.form.mensalistaMsg,
          politicaCancelamento: this.form.politicaCancelamento
        });
        alert('Políticas atualizadas com sucesso!');
      } catch (e) {
        alert(e.message || 'Erro ao salvar.');
      } finally {
        this.salvando = false;
      }
    },
    adicionarAnuncio() {
      if (!this.novoAnuncio.titulo.trim() && !this.novoAnuncio.corpo.trim()) return;
      this.anuncios.push({ ...this.novoAnuncio });
      this.novoAnuncio = { titulo: '', corpo: '', tom: 'info' };
    },
    removerAnuncio(idx) {
      this.anuncios.splice(idx, 1);
    },
    getEstiloTom(tom) {
      if (tom === 'warning') return 'background: var(--sc-amber-subtle); color: var(--sc-amber); border-color: rgba(251,191,36,0.3);';
      if (tom === 'success') return 'background: var(--sc-primary-subtle); color: var(--sc-primary); border-color: rgba(74,222,128,0.3);';
      return 'background: var(--sc-bg-elevated); color: var(--sc-text);';
    }
  }
};
</script>
