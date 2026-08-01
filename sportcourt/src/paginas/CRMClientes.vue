<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded">
      <div class="sc-flex-between sc-gap-4" style="margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h1 class="sc-h2">CRM de Clientes</h1>
          <p class="sc-muted">Clientes atualizados automaticamente após cada reserva ou partida na sua quadra.</p>
        </div>
      </div>

      <!-- KPIs rápidos -->
      <div class="sc-grid-3" style="margin-bottom: 24px;">
        <div class="sc-kpi">
          <div class="sc-kpi-label">Total de Clientes</div>
          <div class="sc-kpi-value">{{ clientes.length }}</div>
        </div>
        <div class="sc-kpi">
          <div class="sc-kpi-label">Total de Jogos</div>
          <div class="sc-kpi-value green">{{ totalJogos }}</div>
        </div>
        <div class="sc-kpi">
          <div class="sc-kpi-label">Faturamento Total acumulado</div>
          <div class="sc-kpi-value green">R$ {{ totalGastoAcumulado.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Busca -->
      <div class="sc-card" style="padding: 16px; margin-bottom: 24px;">
        <div class="sc-input-icon-wrap">
          <svg class="sc-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="sc-input" v-model="busca" placeholder="Buscar cliente por nome ou telefone..." />
        </div>
      </div>

      <!-- Lista de clientes -->
      <div class="sc-card" style="overflow: hidden;">
        <div v-if="carregando" class="sc-empty">Carregando clientes...</div>
        <div v-else-if="clientesFiltrados.length === 0" class="sc-empty">
          <div class="sc-empty-icon">👥</div>
          <p>Nenhum cliente encontrado.</p>
        </div>
        <div v-else style="display: flex; flex-direction: column;">
          <div
            v-for="c in clientesFiltrados"
            :key="c.id"
            class="sc-flex-between sc-gap-4"
            style="padding: 16px 20px; border-bottom: 1px solid var(--sc-border); flex-wrap: wrap;"
          >
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 44px; height: 44px;">
                <img v-if="c.foto" :src="c.foto" :alt="c.nome" />
                <span v-else>{{ c.nome.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 15px;">{{ c.nome }}</div>
                <div class="sc-muted sc-flex sc-gap-2" style="font-size: 12px; margin-top: 2px;">
                  <span>📞 {{ c.telefone || 'Sem telefone' }}</span>
                  <span>•</span>
                  <span>🎮 {{ c.jogos }} jogo(s)</span>
                  <span>•</span>
                  <span>Último: {{ formatarData(c.ultimoJogo) }}</span>
                </div>
              </div>
            </div>

            <div class="sc-flex sc-gap-3">
              <div style="text-align: right;">
                <div class="sc-label" style="margin: 0;">Total Gasto</div>
                <div style="font-weight: 800; color: var(--sc-primary);">R$ {{ c.totalGasto }}</div>
              </div>
              <a
                v-if="c.telefone"
                :href="getLinkWhatsapp(c.telefone)"
                target="_blank"
                rel="noopener"
                class="sc-btn sc-btn-primary sc-btn-sm"
              >
                💬 WhatsApp
              </a>
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
  name: 'CRMClientes',
  components: { TopbarDono },
  data() {
    return {
      clientes: [],
      busca: '',
      carregando: true
    };
  },
  computed: {
    clientesFiltrados() {
      if (!this.busca.trim()) return this.clientes;
      const b = this.busca.toLowerCase();
      return this.clientes.filter(c =>
        c.nome.toLowerCase().includes(b) || (c.telefone && c.telefone.includes(b))
      );
    },
    totalJogos() {
      return this.clientes.reduce((acc, c) => acc + (c.jogos || 0), 0);
    },
    totalGastoAcumulado() {
      return this.clientes.reduce((acc, c) => acc + parseFloat(c.totalGasto || 0), 0);
    }
  },
  async created() {
    await this.carregarClientes();
  },
  methods: {
    async carregarClientes() {
      try {
        this.carregando = true;
        const quadraId = localStorage.getItem('quadraId');
        if (quadraId) {
          this.clientes = await api.getCRMClientes(quadraId);
        } else {
          const minhas = await api.getMinhasQuadras();
          if (minhas.length > 0) {
            this.clientes = await api.getCRMClientes(minhas[0].id);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
      } finally {
        this.carregando = false;
      }
    },
    formatarData(d) {
      if (!d) return '-';
      const date = new Date(d);
      return date.toLocaleDateString('pt-BR');
    },
    getLinkWhatsapp(tel) {
      const num = tel.replace(/\D/g, '');
      return `https://wa.me/55${num}`;
    }
  }
};
</script>
