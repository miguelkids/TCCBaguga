<template>
  <div class="pagina" ref="scrollContainer">
    
    <TopbarJogador />

    <!-- Efeito de Glow de Fundo -->
    <div class="glow-fundo" aria-hidden="true"></div>

    <main class="conteudo">
      
      <!-- Cabeçalho da página -->
      <div class="cabecalho-secao">
        <div class="cabecalho-titulos">
          <h1 class="titulo-pagina">Minhas Reservas</h1>
          <p class="subtitulo-pagina">Acompanhe e avalie seus agendamentos esportivos.</p>
        </div>
        <button class="btn-reservar" @click="$router.push('/reserva')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Reservar Quadra
        </button>
      </div>

      <!-- Estado Vazio (Sem Reservas) -->
      <div v-if="reservas.length === 0" class="estado-vazio">
        <div class="estado-vazio-icone">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3 class="estado-vazio-titulo">Nenhuma reserva encontrada</h3>
        <p class="estado-vazio-subtitulo">Você ainda não agendou nenhuma partida. Que tal começar agora?</p>
        <button class="btn-buscar" @click="$router.push('/reserva')">Buscar uma quadra</button>
      </div>

      <!-- Lista de Reservas -->
      <div v-else class="lista-reservas">
        <div v-for="(reserva, index) in reservasOrdenadas" :key="index" class="reserva-card">

          <!-- Card Top (Imagem + Informações básicas + Badge de Status) -->
          <div class="reserva-cabecalho">
            <div class="reserva-foto-container">
              <img v-if="reserva.fotoPreview" :src="reserva.fotoPreview" :alt="reserva.quadraNome" class="reserva-foto" />
              <div v-else class="reserva-foto-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
            </div>
            
            <div class="reserva-info">
              <h3 class="reserva-titulo-nome">
                <span v-if="reserva.tipoJogo === 'contra_time' && reserva.nomeTimeB" class="confronto-flex">
                  <span>⚔️ {{ reserva.nomeTime }}</span>
                  <span class="vs-badge">VS</span>
                  <span>{{ reserva.nomeTimeB }}</span>
                </span>
                <span v-else>{{ reserva.quadraNome }}</span>
              </h3>
              
              <div v-if="reserva.tipoJogo === 'contra_time'" class="reserva-subtitulo-esporte">
                {{ reserva.quadraNome }}
              </div>
              
              <div class="reserva-meta">
                <span class="meta-item">
                  📅 {{ formatarDataBR(reserva.data) }}
                </span>
                <span class="meta-divisao">•</span>
                <span class="meta-item">
                  ⏰ {{ reserva.horario }}
                </span>
              </div>
              
              <div class="reserva-endereco" v-if="reserva.endereco">
                <svg class="endereco-icone" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="endereco-texto">{{ reserva.endereco }}</span>
              </div>
            </div>

            <!-- Status Badge -->
            <span class="status-badge" :class="reserva.confirmada ? 'status-badge--confirmada' : 'status-badge--pendente'">
              {{ reserva.confirmada ? 'Confirmada' : 'Pendente' }}
            </span>
          </div>

          <!-- Contatos (Times) -->
          <div class="reserva-contatos" v-if="reserva.telefone || (reserva.tipoJogo === 'contra_time' && reserva.telefoneJogadorB)">
            <div class="contato-chip" v-if="reserva.telefone">
              <span class="contato-emoji">📞</span>
              <strong>{{ reserva.nomeTime || 'Time A' }}:</strong> <span class="contato-numero">{{ reserva.telefone }}</span>
            </div>
            <div class="contato-chip" v-if="reserva.tipoJogo === 'contra_time' && reserva.telefoneJogadorB">
              <span class="contato-emoji">📞</span>
              <strong>{{ reserva.nomeTimeB || 'Time B' }}:</strong> <span class="contato-numero">{{ reserva.telefoneJogadorB }}</span>
            </div>
          </div>

          <!-- Avaliação (Apenas para confirmadas) -->
          <div v-if="reserva.confirmada" class="reserva-avaliacao-painel">
            
            <!-- Média da Quadra -->
            <div class="avaliacao-media">
              <span class="avaliacao-label">Média Geral:</span>
              <div class="estrelas-container">
                <svg v-for="n in 5" :key="'avg-'+n+'-'+index" class="estrela-icone" :class="n <= Math.round(reserva.media || 0) ? 'estrela-icone--ativo' : 'estrela-icone--inativo'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <span class="avaliacao-texto">{{ Number(reserva.media || 0).toFixed(1) }} ({{ reserva.totalAvaliacoes || 0 }})</span>
            </div>

            <!-- Estrelas do Usuário -->
            <div class="avaliacao-voto">
              <span class="avaliacao-label">Sua nota:</span>
              <div class="estrelas-voto-container">
                <button
                  v-for="n in 5"
                  :key="'star-'+n+'-'+index"
                  @click="avaliarQuadra(reserva.quadraId, n, reserva)"
                  :disabled="reserva.avaliado"
                  class="btn-estrela-voto"
                >
                  <svg class="estrela-voto-icone" :class="[n <= (reserva.nota || 0) ? 'estrela-icone--ativo' : 'estrela-icone--inativo', !reserva.avaliado ? 'estrela-voto-icone--ativo' : '']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </button>
              </div>
              <small v-if="reserva.avaliado" class="voto-confirmado-badge">Nota: {{ reserva.nota }}★</small>
            </div>
          </div>

          <!-- Ações do Card (Apenas para pendentes) -->
          <div v-if="!reserva.confirmada" class="reserva-acoes">
            <button class="btn-reserva-acao btn-reserva-acao--cinza" @click="abrirEdicao(reserva)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/></svg>
              Editar Info
            </button>
            <button class="btn-reserva-acao btn-reserva-acao--vermelho" @click="confirmarCancelar(reserva)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {{ (reserva.tipoJogo === 'contra_time' && reserva.jogadorIdB === jogadorId) ? 'Sair da Partida' : 'Cancelar Reserva' }}
            </button>
          </div>

        </div>
      </div>
    </main>

    <!-- Bottom Nav Mobile -->
    <transition name="slide-up">
      <nav class="bottom-nav" v-show="mostrarBarra">
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
    </transition>

    <!-- Modal de Edição -->
    <div v-if="modalEdicao.aberto" class="modal-overlay" @click.self="fecharEdicao">
      <div class="modal-card">
        
        <div class="modal-header">
          <h2 class="modal-titulo">Editar Informações</h2>
          <button class="btn-fechar" @click="fecharEdicao">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form @submit.prevent="salvarEdicao" class="modal-formulario">
          
          <div class="campo">
            <label for="edit-nome-time" class="campo-label">Nome do Time</label>
            <input id="edit-nome-time" v-model="modalEdicao.nomeTime" type="text" placeholder="Ex: Os Parças FC" class="input-campo" />
          </div>

          <div class="campo">
            <label for="edit-nome-jogador" class="campo-label">Seu Nome / Contato</label>
            <input id="edit-nome-jogador" v-model="modalEdicao.nome" type="text" required placeholder="Ex: João Silva" class="input-campo" />
          </div>

          <div class="campo">
            <label for="edit-telefone" class="campo-label">Telefone</label>
            <input id="edit-telefone" v-model="modalEdicao.telefone" type="tel" required placeholder="Ex: (11) 99999-9999" class="input-campo" />
          </div>

          <!-- Slots de Jogadores -->
          <div class="campo">
            <label class="campo-label">Lista de Jogadores</label>
            <div class="jogadores-scroll">
              <div v-for="(item, i) in modalEdicao.jogadoresLista" :key="i" class="jogador-item-linha">
                <span class="jogador-numero">{{ i + 1 }}</span>
                <input v-model="item.nome" :placeholder="`Jogador ${i + 1}`" class="input-campo flex-grow" />
                <button type="button" class="btn-remover-jogador" @click="modalEdicao.jogadoresLista.splice(i, 1)">&times;</button>
              </div>
            </div>
            <button type="button" class="btn-adicionar-jogador" @click="modalEdicao.jogadoresLista.push({ nome: '', goleiro: false, goleiroPaga: true })">
              + Adicionar Jogador
            </button>
          </div>

          <!-- Ações do Modal -->
          <div class="modal-botoes-acoes">
            <button type="button" class="btn-acao btn-acao--cancelar" @click="fecharEdicao">Cancelar</button>
            <button type="submit" class="btn-acao btn-acao--salvar" :disabled="modalEdicao.salvando">
              {{ modalEdicao.salvando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "MenuJogador",
  components: { TopbarJogador },
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return {
      reservas: [],
      jogadorId: user.id || null,
      mostrarBarra: true,
      ultimoScroll: 0,
      logo: require("@/assets/logosite1.png"),
      modalEdicao: {
        aberto: false,
        salvando: false,
        reservaId: null,
        nomeTime: "",
        nome: "",
        telefone: "",
        jogadoresLista: [],
        reservaRef: null
      }
    };
  },
  computed: {
    reservasOrdenadas() {
      return [...this.reservas].sort((a, b) => new Date(b.data) - new Date(a.data));
    },
  },
  mounted() {
    if (this.jogadorId) this.ouvirReservas();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    formatarDataBR(dataStr) {
      if (!dataStr || typeof dataStr !== 'string') return dataStr;
      const dataLimpa = dataStr.split('T')[0];
      const partes = dataLimpa.split('-');
      if (partes.length !== 3) return dataLimpa;
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },
    handleScroll() {
      const s = window.scrollY;
      this.mostrarBarra = s < this.ultimoScroll || s < 10;
      this.ultimoScroll = s;
    },
    async ouvirReservas() {
      try {
        const reservas = await api.getReservas();
        // Filtra reservas do jogador logado
        this.reservas = reservas
          .filter(r => r.jogadorId === this.jogadorId || r.jogadorIdB === this.jogadorId)
          .map(r => ({
            ...r,
            fotoPreview: r.fotoPreview ? (r.fotoPreview.startsWith('http') ? r.fotoPreview : `http://localhost:3006${r.fotoPreview}`) : ""
          }));
      } catch (err) {
        console.error("Erro ouvindo reservas:", err);
      }
    },
    async avaliarQuadra(quadraId, estrelas, reserva) {
      try {
        if (!this.jogadorId) { alert("Você precisa estar logado para avaliar."); return; }
        const data = await api.avaliarQuadra(quadraId, estrelas);
        reserva.avaliado = true;
        reserva.nota = estrelas;
        reserva.media = data.novaMedia;
        reserva.totalAvaliacoes = data.totalAvaliacoes;
        alert(`Você avaliou a quadra com ${estrelas} estrelas!`);
      } catch (err) {
        alert("Erro ao avaliar: " + err.message);
      }
    },
    abrirEdicao(reserva) {
      const isJogadorB = reserva.jogadorIdB === this.jogadorId;
      const listaOriginal = isJogadorB ? (reserva.jogadoresListaB || []) : (reserva.jogadoresLista || []);
      this.modalEdicao = {
        aberto: true,
        salvando: false,
        reservaId: reserva.id,
        nomeTime: isJogadorB ? (reserva.nomeTimeB || "") : (reserva.nomeTime || ""),
        nome: isJogadorB ? (reserva.nomeJogadorB || "") : (reserva.nome || ""),
        telefone: isJogadorB ? (reserva.telefoneJogadorB || "") : (reserva.telefone || ""),
        jogadoresLista: listaOriginal.map(j => ({
          nome: j.nome || "",
          goleiro: !!j.goleiro,
          goleiroPaga: j.goleiroPaga !== undefined ? !!j.goleiroPaga : true
        })),
        reservaRef: reserva
      };
    },
    fecharEdicao() {
      this.modalEdicao.aberto = false;
    },
    async salvarEdicao() {
      try {
        this.modalEdicao.salvando = true;
        const listaFiltrada = this.modalEdicao.jogadoresLista.filter(j => j.nome && typeof j.nome === 'string' && j.nome.trim());
        await api.editarJogador(this.modalEdicao.reservaId, {
          nome: this.modalEdicao.nome,
          telefone: this.modalEdicao.telefone,
          nomeTime: this.modalEdicao.nomeTime,
          jogadoresLista: listaFiltrada.map(j => ({ nome: j.nome.trim(), goleiro: !!j.goleiro, goleiroPaga: !!j.goleiroPaga }))
        });
        
        const isJogadorB = this.modalEdicao.reservaRef.jogadorIdB === this.jogadorId;
        if (isJogadorB) {
          this.modalEdicao.reservaRef.nomeJogadorB = this.modalEdicao.nome;
          this.modalEdicao.reservaRef.telefoneJogadorB = this.modalEdicao.telefone;
          this.modalEdicao.reservaRef.nomeTimeB = this.modalEdicao.nomeTime;
          this.modalEdicao.reservaRef.jogadoresListaB = listaFiltrada;
        } else {
          this.modalEdicao.reservaRef.nome = this.modalEdicao.nome;
          this.modalEdicao.reservaRef.telefone = this.modalEdicao.telefone;
          this.modalEdicao.reservaRef.nomeTime = this.modalEdicao.nomeTime;
          this.modalEdicao.reservaRef.jogadoresLista = listaFiltrada;
        }
        
        this.fecharEdicao();
        alert("Informações atualizadas com sucesso!");
        this.ouvirReservas();
      } catch (err) {
        alert("Erro ao salvar alterações: " + err.message);
      } finally {
        this.modalEdicao.salvando = false;
      }
    },
    async confirmarCancelar(reserva) {
      const isJogadorB = reserva.jogadorIdB === this.jogadorId;
      const msg = isJogadorB 
        ? "Deseja realmente sair deste contra-time?" 
        : "Deseja realmente cancelar esta reserva?";
      
      if (confirm(msg)) {
        try {
          await api.cancelarReserva(reserva.id);
          alert(isJogadorB ? "Você saiu da partida com sucesso!" : "Reserva cancelada com sucesso!");
          this.ouvirReservas();
        } catch (err) {
          alert("Erro ao cancelar: " + err.message);
        }
      }
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
}

.glow-fundo {
  position: absolute;
  top: 48px;
  left: 25%;
  width: 350px;
  height: 350px;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.conteudo {
  flex-grow: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 100px;
  position: relative;
  z-index: 10;
}

/* Cabeçalho */
.cabecalho-secao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.cabecalho-titulos {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.btn-reservar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.25);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-reservar:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.35);
}

/* Estado Vazio */
.estado-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
  animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
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
  font-size: 16px;
  font-weight: 800;
  color: var(--foreground);
}

.estado-vazio-subtitulo {
  color: var(--muted-foreground);
  font-size: 14px;
  max-width: 280px;
  margin-top: 4px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.btn-buscar {
  padding: 10px 24px;
  background: var(--muted);
  color: #475569;
  font-weight: 700;
  font-size: 14px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-buscar:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

/* Lista de Reservas */
.lista-reservas {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.4s ease both;
}

.reserva-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.3s, transform 0.3s;
}

.reserva-card:hover {
  box-shadow: var(--shadow-soft);
}

.reserva-cabecalho {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
}

.reserva-foto-container {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: var(--muted);
  overflow: hidden;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .reserva-foto-container {
    width: 80px;
    height: 80px;
  }
}

.reserva-foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reserva-foto-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
}

.reserva-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reserva-titulo-nome {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
  line-height: 1.3;
}

.confronto-flex {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.vs-badge {
  font-size: 10px;
  color: var(--muted-foreground);
  font-weight: 700;
  padding: 1px 4px;
  background: #f1f5f9;
  border-radius: 4px;
}

.reserva-subtitulo-esporte {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-foreground);
}

.reserva-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 600;
}

.meta-divisao {
  color: #e2e8f0;
}

.reserva-endereco {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.endereco-icone {
  flex-shrink: 0;
  color: #94a3b8;
}

.status-badge {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.status-badge--confirmada {
  background: rgba(34, 197, 94, 0.08);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-badge--pendente {
  background: rgba(249, 115, 22, 0.08);
  color: var(--clay);
  border: 1px solid rgba(249, 115, 22, 0.2);
}

/* Contatos */
.reserva-contatos {
  padding: 0 20px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.contato-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #334155;
  background: #f8fafc;
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 700;
}

.contato-emoji {
  font-size: 12px;
}

.contato-numero {
  color: var(--muted-foreground);
  font-weight: 500;
}

/* Avaliacoes */
.reserva-avaliacao-painel {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
}

.avaliacao-media,
.avaliacao-voto {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avaliacao-label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.estrelas-container,
.estrelas-voto-container {
  display: flex;
  gap: 2px;
}

.estrela-icone,
.estrela-voto-icone {
  width: 16px;
  height: 16px;
}

.estrela-voto-icone {
  width: 20px;
  height: 20px;
}

.estrela-icone--ativo {
  color: #f59e0b;
  fill: currentColor;
}

.estrela-icone--inativo {
  color: #e2e8f0;
  fill: currentColor;
}

.avaliacao-texto {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 700;
}

.btn-estrela-voto {
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.15s;
  box-shadow: none;
  width: auto;
  margin-top: 0;
}

.btn-estrela-voto:hover {
  transform: scale(1.1);
  box-shadow: none;
}

.btn-estrela-voto:disabled {
  transform: none;
  cursor: default;
}

.estrela-voto-icone--ativo {
  cursor: pointer;
}

.estrela-voto-icone--ativo:hover {
  color: #fbbf24;
}

.voto-confirmado-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-foreground);
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
}

/* Card ações */
.reserva-acoes {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  background: #fdfdfd;
}

.btn-reserva-acao {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-weight: 700;
  font-size: 12px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-reserva-acao:hover {
  transform: none;
  box-shadow: none;
}

.btn-reserva-acao--cinza {
  background: white;
  border: 1.5px solid var(--border);
  color: #475569;
}

.btn-reserva-acao--cinza:hover {
  background: #f1f5f9;
}

.btn-reserva-acao--vermelho {
  background: #fef2f2;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  color: var(--destructive);
}

.btn-reserva-acao--vermelho:hover {
  background: var(--destructive);
  color: white;
  border-color: var(--destructive);
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

/* Popups & Modais */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  animation: fadeIn 0.3s ease both;
}

.modal-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  box-shadow: var(--shadow-glow);
  position: relative;
  animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-titulo {
  font-size: 16px;
  font-weight: 800;
  color: var(--foreground);
}

.btn-fechar {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted-foreground);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  padding: 0;
  margin: 0;
  transition: color 0.2s, background 0.2s;
}

.btn-fechar:hover {
  color: var(--primary);
  background: #f1f5f9;
  transform: none;
  box-shadow: none;
}

.modal-formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

.input-campo {
  width: 100%;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s;
}

.input-campo:focus {
  border-color: var(--primary);
  outline: none;
}

/* Jogadores Lista Scroll */
.jogadores-scroll {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 8px;
}

.jogador-item-linha {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jogador-numero {
  text-align: center;
  min-width: 24px;
  font-size: 12px;
  font-weight: 800;
  color: var(--muted-foreground);
}

.btn-remover-jogador {
  font-size: 20px;
  font-weight: 700;
  color: var(--destructive);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 8px;
  transition: background 0.2s;
  border-radius: 6px;
  width: auto;
  margin-top: 0;
}

.btn-remover-jogador:hover {
  background: #fef2f2;
  transform: none;
  box-shadow: none;
}

.btn-adicionar-jogador {
  width: 100%;
  padding: 10px;
  background: var(--muted);
  border: 1.5px dashed var(--border);
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-adicionar-jogador:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

/* Botoes modal */
.modal-botoes-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.btn-acao {
  padding: 10px 20px;
  font-weight: 700;
  font-size: 13px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-acao:hover {
  transform: none;
  box-shadow: none;
}

.btn-acao--cancelar {
  background: white;
  border: 1.5px solid var(--border);
  color: #475569;
}

.btn-acao--cancelar:hover {
  background: #f1f5f9;
}

.btn-acao--salvar {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
}

.btn-acao--salvar:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
}

.btn-acao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>
