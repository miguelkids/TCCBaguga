<template>
  <div class="pagina">
    <TopbarDono />

    <!-- Glow de Fundo -->
    <div class="glow-fundo" aria-hidden="true"></div>

    <main class="conteudo">

      <!-- Cabeçalho -->
      <div class="cabecalho-secao">
        <div class="cabecalho-titulos">
          <h1 class="titulo-pagina">Minhas Quadras</h1>
          <p class="subtitulo-pagina">Selecione uma quadra para gerenciá-la.</p>
        </div>
        <button class="btn-nova-quadra" @click="adicionarNovaQuadra">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova Quadra
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="estado-loading">
        <div class="spinner"></div>
        <p class="loading-texto">Carregando suas quadras...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="quadras.length === 0" class="estado-vazio">
        <div class="estado-vazio-icone">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h3 class="estado-vazio-titulo">Nenhuma quadra cadastrada</h3>
        <p class="estado-vazio-subtitulo">Cadastre seu espaço para começar a receber reservas.</p>
        <button class="btn-cadastrar-primeira" @click="$router.push('/cadastro-quadra-parte1')">
          Cadastrar minha primeira quadra
        </button>
      </div>

      <!-- Lista de Quadras -->
      <div v-else class="grade-quadras">
        <div
          v-for="q in quadras"
          :key="q.id"
          class="card-quadra"
          :class="q.id === quadraAtiva ? 'card-quadra--ativa' : ''"
        >
          <!-- Foto -->
          <div class="quadra-foto-container">
            <img v-if="q.fotoUrl" :src="fotoUrl(q)" :alt="q.nomeQuadra" class="quadra-foto" />
            <div v-else class="quadra-foto-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <!-- Badge Ativa -->
            <span v-if="q.id === quadraAtiva" class="badge-ativa">Ativa</span>
          </div>

          <!-- Info + Ações -->
          <div class="quadra-info">
            <div class="quadra-header">
              <div class="quadra-identificacao">
                <h2 class="quadra-nome">{{ q.nomeQuadra }}</h2>
                <div class="quadra-localizacao">
                  <svg class="localizacao-icone" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ q.cidade || q.endereco || '—' }}</span>
                </div>
              </div>
              <div class="quadra-badges">
                <span v-if="q.esporte" class="badge-esporte">{{ q.esporte }}</span>
                <span class="badge-preco">R$ {{ q.preco }}/h</span>
              </div>
            </div>
            
            <div v-if="q.horario" class="quadra-horario">
              <svg class="horario-icone" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ q.horario }}</span>
            </div>

            <button class="btn-gerenciar" @click="selecionarQuadra(q)">
              <span>Gerenciar esta Quadra</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- Bottom Nav Mobile -->
    <nav class="bottom-nav">
      <router-link to="/minhas-quadras" class="nav-item" :class="$route.path === '/minhas-quadras' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Quadras</span>
      </router-link>
      <router-link to="/reservas" class="nav-item" :class="$route.path === '/reservas' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/faturamento-dono" class="nav-item" :class="$route.path === '/faturamento-dono' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
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
  name: "MinhasQuadras",
  components: { TopbarDono },
  data() {
    return {
      quadras: [],
      loading: true,
      quadraAtiva: localStorage.getItem("quadraId") || null,
    };
  },
  async mounted() {
    await this.carregarQuadras();
  },
  methods: {
    async carregarQuadras() {
      try {
        this.quadras = await api.getMinhasQuadras();
        if (!this.quadraAtiva && this.quadras.length > 0) {
          localStorage.setItem("quadraId", this.quadras[0].id);
          this.quadraAtiva = this.quadras[0].id;
        }
      } catch (err) {
        console.error("Erro ao carregar quadras:", err);
      } finally {
        this.loading = false;
      }
    },

    selecionarQuadra(q) {
      localStorage.setItem("quadraId", q.id);
      this.quadraAtiva = q.id;
      this.$router.push("/confirmar-quadra");
    },

    adicionarNovaQuadra() {
      if (this.quadras.length > 0) {
        const ref = this.quadras[0];
        localStorage.setItem("cadastroQuadraParte1", JSON.stringify({
          nomeQuadra: ref.nomeQuadra || "",
          endereco: ref.endereco || "",
          cidade: ref.cidade || "",
          telefone: ref.telefone || "",
          quantidadeQuadras: 1,
          modoAdicionar: true
        }));
        this.$router.push("/cadastro-quadra-parte2");
      } else {
        this.$router.push("/cadastro-quadra-parte1");
      }
    },

    fotoUrl(q) {
      if (!q.fotoUrl) return require("@/assets/perfil.png");
      return q.fotoUrl.startsWith("http") ? q.fotoUrl : `http://localhost:3006${q.fotoUrl}`;
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
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
}

.glow-fundo {
  position: absolute;
  top: 96px;
  right: 25%;
  width: 350px;
  height: 350px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.conteudo {
  flex-grow: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
  position: relative;
  z-index: 10;
}

/* Cabeçalho */
.cabecalho-secao {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.cabecalho-titulos {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.titulo-pagina {
  font-size: 24px;
  font-weight: 800;
  color: var(--foreground);
}

.subtitulo-pagina {
  color: var(--muted-foreground);
  font-size: 14px;
}

.btn-nova-quadra {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--gradient-accent);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.25);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}

.btn-nova-quadra:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
}

/* Loading */
.estado-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96px 0;
  color: var(--muted-foreground);
  gap: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loading-texto {
  font-size: 14px;
  font-weight: 500;
}

/* Estado Vazio */
.estado-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96px 24px;
  text-align: center;
}

.estado-vazio-icone {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
  margin-bottom: 16px;
}

.estado-vazio-titulo {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 4px;
}

.estado-vazio-subtitulo {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 20px;
  max-width: 280px;
}

.btn-cadastrar-primeira {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--gradient-accent);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-cadastrar-primeira:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

/* Grade de quadras */
.grade-quadras {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .grade-quadras {
    grid-template-columns: 1fr 1fr;
  }
}

.card-quadra {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.2s, transform 0.2s;
}

.card-quadra:hover {
  box-shadow: var(--shadow-soft);
}

.card-quadra--ativa {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.quadra-foto-container {
  position: relative;
  width: 100%;
  height: 176px;
  background: var(--muted);
}

.quadra-foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quadra-foto-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
}

.badge-ativa {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  box-shadow: var(--shadow-xs);
}

.quadra-info {
  padding: 20px;
}

.quadra-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.quadra-identificacao {
  min-width: 0;
}

.quadra-nome {
  font-size: 16px;
  font-weight: 800;
  color: var(--foreground);
  line-height: 1.3;
}

.quadra-localizacao {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 4px;
}

.localizacao-icone {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.quadra-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.badge-esporte {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 2px 10px;
  border-radius: 999px;
}

.badge-preco {
  font-size: 13px;
  font-weight: 800;
  color: var(--primary-dark);
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  padding: 2px 10px;
  border-radius: 999px;
}

.quadra-horario {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
  margin-bottom: 16px;
}

.horario-icone {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.btn-gerenciar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--gradient-accent);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-gerenciar:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
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

@media (min-width: 768px) {
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
  color: var(--accent);
}
</style>
