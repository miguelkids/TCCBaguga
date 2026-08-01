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
        <div v-else-if="clientesFiltrados.length === 0" class="sc-empty" style="padding: 40px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted); margin-bottom: 12px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <p class="sc-muted">Nenhum cliente encontrado.</p>
        </div>
        <div v-else style="display: flex; flex-direction: column;">
          <div
            v-for="c in clientesFiltrados"
            :key="c.id"
            class="sc-flex-between sc-gap-4"
            style="padding: 16px 20px; border-bottom: 1px solid var(--sc-border); flex-wrap: wrap;"
          >
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--sc-bg-elevated); border: 1px solid var(--sc-border);">
                <img v-if="c.foto" :src="c.foto" :alt="c.nome" style="width: 100%; height: 100%; object-fit: cover;" />
                <span v-else style="font-weight: 800; color: var(--sc-primary);">{{ c.nome.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 15px;">{{ c.nome }}</div>
                <div class="sc-muted sc-flex sc-gap-2" style="font-size: 12px; margin-top: 2px; align-items: center;">
                  <span style="display: inline-flex; align-items: center; gap: 3px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {{ c.telefone || 'Sem telefone' }}
                  </span>
                  <span>•</span>
                  <span>{{ c.jogos }} jogo(s)</span>
                  <span>•</span>
                  <span>Último: {{ formatarData(c.ultimoJogo) }}</span>
                </div>
              </div>
            </div>

            <div class="sc-flex sc-gap-3" style="align-items: center;">
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
                style="display: inline-flex; align-items: center; gap: 6px;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                WhatsApp
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
    totalJogos() {
      return this.clientes.reduce((acc, c) => acc + (c.jogos || 0), 0);
    },
    totalGastoAcumulado() {
      return this.clientes.reduce((acc, c) => acc + (parseFloat(c.totalGasto) || 0), 0);
    },
    clientesFiltrados() {
      if (!this.busca.trim()) return this.clientes;
      const b = this.busca.toLowerCase();
      return this.clientes.filter(
        c => (c.nome && c.nome.toLowerCase().includes(b)) || (c.telefone && c.telefone.includes(b))
      );
    }
  },
  async created() {
    await this.carregarClientes();
  },
  methods: {
    formatarData(d) {
      if (!d) return '—';
      const date = new Date(d);
      return date.toLocaleDateString('pt-BR');
    },
    getLinkWhatsapp(tel) {
      if (!tel) return '#';
      const num = tel.replace(/\D/g, '');
      return `https://wa.me/55${num}`;
    },
    async carregarClientes() {
      try {
        this.carregando = true;
        const res = await api.getReservas().catch(() => []);
        const mapa = {};
        res.forEach(r => {
          const nome = r.nome || r.nome_jogador || r.nomeJogador || 'Cliente Avulso';
          const tel = r.telefone || r.telefone_jogador || r.telefoneJogador || '';
          const foto = r.fotoJogador ? (r.fotoJogador.startsWith('http') ? r.fotoJogador : `http://localhost:3006${r.fotoJogador}`) : null;
          const key = (tel || nome).trim().toLowerCase();
          const preco = parseFloat(r.preco_total || r.preco || 0);
          const dataJogo = r.data || r.data_reserva || r.dataReserva;

          if (!mapa[key]) {
            mapa[key] = {
              id: key,
              nome,
              telefone: tel,
              foto,
              jogos: 0,
              totalGastoNum: 0,
              ultimoJogo: dataJogo
            };
          } else {
            if (foto && !mapa[key].foto) mapa[key].foto = foto;
            if (dataJogo) mapa[key].ultimoJogo = dataJogo;
          }

          mapa[key].jogos += 1;
          mapa[key].totalGastoNum += preco;

          // Se a reserva incluir lista de jogadores (jogadoresLista)
          if (Array.isArray(r.jogadoresLista)) {
            r.jogadoresLista.forEach(j => {
              const nomeSub = typeof j === 'string' ? j : j.nome;
              if (nomeSub && nomeSub.trim() && nomeSub.trim().toLowerCase() !== key) {
                const subKey = nomeSub.trim().toLowerCase();
                if (!mapa[subKey]) {
                  mapa[subKey] = {
                    id: subKey,
                    nome: nomeSub.trim(),
                    telefone: '',
                    foto: null,
                    jogos: 1,
                    totalGastoNum: 0,
                    ultimoJogo: dataJogo
                  };
                } else {
                  mapa[subKey].jogos += 1;
                }
              }
            });
          }
        });

        this.clientes = Object.values(mapa).map(c => ({
          ...c,
          totalGasto: c.totalGastoNum.toFixed(2)
        }));
      } catch (e) {
        console.error("Erro ao carregar clientes do CRM:", e);
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>
