<template>
  <div class="pagina">

    <TopbarJogador />

    <div class="container">

      <!-- Barra de Busca -->
      <div class="busca-wrapper">
        <svg class="busca-icone" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="busca" type="text" v-model="busca" @input="buscarQuadras" placeholder="Buscar por cidade..." class="busca-input" />
        <span v-if="busca && espacos.length > 0" class="busca-badge">{{ espacos.length }}</span>
      </div>

      <!-- Estado inicial (busca vazia) -->
      <div v-if="!busca" class="estado-vazio">
        <div class="estado-icone estado-icone--verde">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h2 class="estado-titulo">Onde você quer jogar?</h2>
        <p class="estado-descricao">Digite o nome da cidade para encontrar quadras próximas</p>
      </div>

      <!-- Sem resultados -->
      <div v-else-if="busca && espacos.length === 0" class="estado-vazio">
        <div class="estado-icone estado-icone--cinza">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h2 class="estado-titulo">Nenhuma quadra encontrada</h2>
        <p class="estado-descricao">Não há quadras disponíveis para "{{ busca }}"</p>
      </div>

      <!-- Lista de resultados -->
      <div v-else class="grade-quadras">
        <div v-for="espaco in espacos" :key="espaco.chave" class="card-quadra">

          <!-- Banner da quadra -->
          <div class="card-banner">
            <img v-if="espaco.fotoPerfil" :src="fotoSrc(espaco.fotoPerfil)" :alt="espaco.nomeQuadra" class="card-foto" />
            <svg v-else class="card-foto-placeholder" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <div v-if="espaco.avaliacoes" class="card-avaliacao">
              <span>★</span><span>4.9</span>
            </div>
          </div>

          <!-- Info -->
          <div class="card-info">
            <h3 class="card-nome">{{ espaco.nomeQuadra }}</h3>

            <div class="card-detalhes">
              <div class="detalhe-linha">
                <svg class="detalhe-icone" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p class="detalhe-texto">{{ espaco.endereco }}, {{ espaco.cidade }}</p>
              </div>
              <div v-if="espaco.telefone" class="detalhe-linha">
                <svg class="detalhe-icone" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <p class="detalhe-texto">{{ espaco.telefone }}</p>
              </div>
            </div>

            <!-- Múltiplas quadras no espaço -->
            <div v-if="espaco.quadras.length > 1" class="modalidades">
              <button v-for="q in espaco.quadras" :key="q.id" @click="espaco.quadraAtiva = q.id"
                class="modalidade-btn"
                :class="espaco.quadraAtiva === q.id ? 'modalidade-btn--ativo' : ''">
                {{ q.esporte }} — R$ {{ q.preco }}/h
              </button>
            </div>

            <!-- Única quadra -->
            <div v-else class="modalidade-unica">
              <span class="badge-esporte">{{ espaco.quadras[0].esporte }}</span>
              <span class="preco-texto">R$ {{ espaco.quadras[0].preco }}/h</span>
            </div>

            <button @click="reservarEspaco(espaco)" class="btn-reservar">
              Reservar Agora
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav Mobile -->
    <nav class="bottom-nav">
      <router-link to="/menu-jogador" class="nav-item" :class="$route.path === '/menu-jogador' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/reserva" class="nav-item" :class="$route.path === '/reserva' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Buscar</span>
      </router-link>
      <router-link to="/conta-jogador" class="nav-item" :class="$route.path === '/conta-jogador' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "PaginaReserva",
  components: { TopbarJogador },
  data() {
    return {
      busca: "",
      espacos: [],
    };
  },
  methods: {
    async buscarQuadras() {
      if (!this.busca.trim()) {
        this.espacos = [];
        return;
      }
      try {
        const quadras = await api.getQuadras();
        const termo = this.busca.toLowerCase();
        const filtradas = quadras.filter(q => q.cidade && q.cidade.toLowerCase().startsWith(termo));

        const mapa = {};
        for (const q of filtradas) {
          const chave = `${q.donoId}_${q.nomeQuadra}_${q.endereco}`;
          if (!mapa[chave]) {
            mapa[chave] = {
              chave,
              nomeQuadra: q.nomeQuadra,
              endereco: q.endereco,
              cidade: q.cidade,
              telefone: q.telefone,
              fotoPerfil: q.fotoPerfil,
              avaliacoes: q.avaliacoes,
              quadras: [],
              quadraAtiva: q.id,
            };
          }
          mapa[chave].quadras.push({ id: q.id, esporte: q.esporte, preco: q.preco });
        }
        this.espacos = Object.values(mapa);
      } catch (err) {
        console.error("Erro ao buscar quadras:", err);
      }
    },
    reservarEspaco(espaco) {
      const quadraId = espaco.quadraAtiva || espaco.quadras[0].id;
      localStorage.setItem("quadraSelecionada", quadraId);
      this.$router.push("/finalizar-reserva");
    },
    fotoSrc(url) {
      if (!url) return null;
      return url.startsWith("http") ? url : `http://localhost:3006${url}`;
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
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 100px;
}

/* Busca */
.busca-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.busca-icone {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

.busca-input {
  width: 100%;
  padding: 14px 48px 14px 44px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  box-shadow: var(--shadow-xs);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.busca-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

.busca-badge {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-dark);
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 8px;
  border-radius: 999px;
}

/* Estado vazio */
.estado-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  text-align: center;
}

.estado-icone {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.estado-icone--verde {
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary);
}

.estado-icone--cinza {
  background: var(--muted);
  color: var(--muted-foreground);
}

.estado-titulo {
  font-size: 16px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 6px;
}

.estado-descricao {
  font-size: 14px;
  color: var(--muted-foreground);
  max-width: 280px;
}

/* Grade de quadras */
.grade-quadras {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .grade-quadras {
    grid-template-columns: 1fr 1fr;
  }
}

/* Card de quadra */
.card-quadra {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.2s, transform 0.2s;
}

.card-quadra:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-banner {
  position: relative;
  width: 100%;
  height: 160px;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-foto-placeholder {
  color: #cbd5e1;
}

.card-avaliacao {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-info {
  padding: 16px;
}

.card-nome {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 10px;
}

.card-detalhes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.detalhe-linha {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.detalhe-icone {
  color: var(--muted-foreground);
  flex-shrink: 0;
  margin-top: 2px;
}

.detalhe-texto {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}

/* Modalidades */
.modalidades {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.modalidade-btn {
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--muted);
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}

.modalidade-btn:hover {
  border-color: var(--primary);
  transform: none;
  box-shadow: none;
}

.modalidade-btn--ativo {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.modalidade-unica {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.badge-esporte {
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 999px;
}

.preco-texto {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary-dark);
}

/* Botão reservar */
.btn-reservar {
  width: 100%;
  padding: 12px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-reservar:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
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
  padding: 8px 24px;
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
