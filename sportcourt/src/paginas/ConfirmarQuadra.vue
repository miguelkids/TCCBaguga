<template>
  <div class="pagina">

    <TopbarDono />

    <div class="container">
      <div class="grade-layouts">
        
        <!-- Coluna da Esquerda: Card da Quadra -->
        <div class="card-detalhes">
          <!-- Foto -->
          <div class="foto-container">
            <img v-if="fotoPerfilUrl" :src="fotoPerfilUrl" alt="Foto da quadra" class="foto-img" />
            <svg v-else class="foto-placeholder" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>

          <!-- Informações -->
          <div class="card-info">
            <h1 class="quadra-nome">{{ nomeQuadra || 'Minha Quadra' }}</h1>

            <div class="info-lista">
              <div class="info-item">
                <svg class="info-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p class="info-texto">{{ cidade }} — {{ endereco }}</p>
              </div>
              <div class="info-item">
                <svg class="info-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <p class="info-texto">{{ telefone || 'Sem telefone' }}</p>
              </div>
              <div class="info-item">
                <svg class="info-icone info-icone--verde" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <p class="info-texto info-texto--preco">R$ {{ preco }}<span class="info-texto--hora">/hora</span></p>
              </div>
              <div class="info-item">
                <svg class="info-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p class="info-texto">{{ horario }}</p>
              </div>
              <div class="info-item">
                <span class="badge-esporte">{{ esporte }}</span>
              </div>
              <p v-if="descricao" class="quadra-descricao">{{ descricao }}</p>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Ações e Avaliações -->
        <div class="card-painel">
          <!-- Card de Ações -->
          <div class="secao-painel">
            <h2 class="painel-titulo">Ações da Quadra</h2>
            <div class="painel-botoes">
              <button @click="editarQuadra" class="btn-acao btn-acao--cinza">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar Quadra
              </button>
              <button @click="$router.push('/menu-quadra')" class="btn-acao btn-acao--verde">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Gerenciar Horários
              </button>
            </div>
          </div>

          <!-- Card de Avaliações -->
          <div class="secao-painel">
            <h2 class="painel-titulo">Avaliações dos Clientes</h2>
            <div class="avaliacoes-flex">
              <div class="estrelas-wrapper">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  :fill="i <= Math.round(mediaEstrelas) ? '#f59e0b' : 'none'"
                  :stroke="i <= Math.round(mediaEstrelas) ? '#f59e0b' : '#d1d5db'"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="estrela-icone">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span class="media-score">{{ mediaEstrelas.toFixed(1) }}</span>
              <span class="avaliacoes-total">({{ totalAvaliacoes }} avaliações)</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="bottom-nav">
      <router-link to="/minhas-quadras" class="nav-item" :class="$route.path === '/minhas-quadras' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Quadras</span>
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
  name: "ConfirmarQuadra",
  components: { TopbarDono },
  data() {
    return {
      nomeQuadra: "",
      endereco: "",
      cidade: "",
      telefone: "",
      preco: "",
      horario: "",
      descricao: "",
      esporte: "",
      fotoPerfilUrl: null,
      defaultImage: require("@/assets/perfil.png"),
      mediaEstrelas: 0,
      totalAvaliacoes: 0,
      quadraId: null,
    };
  },
  async mounted() {
    await this.carregarQuadraDono();
  },
  methods: {
    async carregarQuadraDono() {
      try {
        this.quadraId = localStorage.getItem("quadraId") || JSON.parse(localStorage.getItem("quadraInfo") || "{}").id;
        if (!this.quadraId) return;
        const data = await api.getQuadra(this.quadraId);
        this.nomeQuadra = data.nomeQuadra || "";
        this.endereco = data.endereco || "";
        this.cidade = data.cidade || "";
        this.telefone = data.telefone || "";
        this.preco = data.preco || "";
        this.horario = data.horario || "";
        this.descricao = data.descricao || "";
        this.esporte = data.esporte || "";
        this.mediaEstrelas = data.mediaEstrelas || 0;
        this.totalAvaliacoes = data.totalAvaliacoes || 0;
        if (data.fotoPerfil) {
          this.fotoPerfilUrl = data.fotoPerfil.startsWith("http") ? data.fotoPerfil : `http://localhost:3006${data.fotoPerfil}`;
        }
      } catch (err) {
        console.error("Erro ao carregar quadra:", err);
      }
    },
    editarQuadra() {
      this.$router.push("/editar-quadra");
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
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 100px;
}

.grade-layouts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .grade-layouts {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

/* Card Detalhes */
.card-detalhes {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  height: fit-content;
}

.foto-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-placeholder {
  color: #cbd5e1;
}

.card-info {
  padding: 20px;
}

.quadra-nome {
  font-size: 20px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 16px;
}

.info-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icone {
  color: var(--muted-foreground);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-icone--verde {
  color: var(--primary);
}

.info-texto {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  line-height: 1.4;
}

.info-texto--preco {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-dark);
}

.info-texto--hora {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.badge-esporte {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: var(--accent);
  border-radius: 999px;
}

.quadra-descricao {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

/* Card Painel / Coluna Direita */
.card-painel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: fit-content;
}

.secao-painel {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
}

.painel-titulo {
  font-size: 14px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 12px;
}

.painel-botoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-acao {
  width: 100%;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  transition: background 0.2s, transform 0.15s;
}

.btn-acao:hover {
  transform: none;
  box-shadow: none;
}

.btn-acao--cinza {
  background: var(--muted);
  color: #475569;
}

.btn-acao--cinza:hover {
  background: #e2e8f0;
}

.btn-acao--verde {
  background: rgba(34, 197, 94, 0.08);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.btn-acao--verde:hover {
  background: rgba(34, 197, 94, 0.14);
}

/* Avaliações */
.avaliacoes-flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.estrelas-wrapper {
  display: flex;
  gap: 2px;
}

.estrela-icone {
  flex-shrink: 0;
}

.media-score {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
}

.avaliacoes-total {
  font-size: 13px;
  color: var(--muted-foreground);
  font-weight: 500;
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
  color: var(--primary);
}
</style>
