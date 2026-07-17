<template>
  <div class="pagina">

    <TopbarJogador />

    <div class="container">

      <!-- Header -->
      <div class="cabecalho-secao">
        <button class="btn-voltar" @click="$router.push('/reserva')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="titulo-secao">Finalizar Reserva</h1>
      </div>

      <!-- Layout desktop: 2 colunas -->
      <div class="layout-flex">

        <!-- Coluna Esquerda: Card da quadra + Calendário -->
        <div class="coluna-esquerda">

          <!-- Card da quadra -->
          <div v-if="quadra && quadra.nomeQuadra" class="card-quadra">
            <div class="quadra-foto-container">
              <img v-if="quadra.fotoUrl" :src="quadra.fotoUrl.startsWith('http') ? quadra.fotoUrl : `http://localhost:3006${quadra.fotoUrl}`" :alt="quadra.nomeQuadra" class="quadra-foto" />
              <div v-else class="quadra-foto-placeholder">
                <div class="foto-placeholder-icone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>
                </div>
              </div>
            </div>
            <div class="quadra-info">
              <h2 class="quadra-nome">{{ quadra.nomeQuadra }}</h2>
              <div class="quadra-detalhes">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ quadra.endereco }}<span v-if="quadra.cidade"> — {{ quadra.cidade }}</span></span>
              </div>
              <div class="quadra-preco">R$ {{ quadra.preco }} / hora</div>
            </div>
          </div>

          <p v-else-if="!quadra || !quadra.nomeQuadra" class="carregando-texto">Carregando informações da quadra...</p>

          <!-- Calendário -->
          <div v-if="quadra && quadra.nomeQuadra" class="calendario-card">
            <h3 class="calendario-titulo">Escolha um dia</h3>
            <div class="calendario-moldura">
              <div class="calendario-mes-header">
                <button @click="mudarMes(-1)" class="btn-mes-nav">&lt;</button>
                <div class="calendario-mes-titulo">{{ mesAtualNome }} {{ anoAtual }}</div>
                <button @click="mudarMes(1)" class="btn-mes-nav">&gt;</button>
              </div>
              <div class="calendario-semana-labels">
                <div v-for="d in diasSemanaLabel" :key="d" class="semana-label">{{ d }}</div>
              </div>
              <div class="calendario-dias-grid">
                <div
                  v-for="dia in diasMes"
                  :key="dia.id"
                  class="dia-item"
                  :class="{
                    'dia-item--vazio': !dia.data,
                    'dia-item--invalido': dia.data && !dia.valido,
                    'dia-item--selecionado': dia.data && dia.data === dataSelecionada,
                  }"
                  @click="selecionarDia(dia)"
                >
                  <span v-if="dia.data">{{ dia.numero }}</span>
                </div>
              </div>
            </div>
          </div>

        </div><!-- /Coluna Esquerda -->

        <!-- Coluna Direita: Resumo e Confirmação -->
        <div class="coluna-direita">

          <!-- Resumo e Confirmação -->
          <div v-if="dataSelecionada && horarioSelecionado" class="card-resumo">
            <h3 class="resumo-titulo">Resumo da Reserva</h3>
            <div class="resumo-dados-reserva">
              <div class="resumo-bloco-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-azul"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ formatarDataBR(dataSelecionada) }}</span>
              </div>
              <div class="resumo-bloco-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-amarelo"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ horarioSelecionado }}</span>
              </div>
            </div>

            <div class="secao-inputs">
              <h3 class="subsecao-titulo">Seus dados</h3>
              <div class="campo">
                <label class="campo-label">Nome</label>
                <input v-model="jogador.nome" placeholder="Seu nome completo" class="input-campo" />
              </div>
              <div class="campo">
                <label class="campo-label">Telefone</label>
                <input v-model="jogador.telefone" placeholder="(11) 99999-9999" class="input-campo" />
              </div>
            </div>

            <!-- Tipo de Jogo -->
            <div class="secao-tipo-jogo">
              <h3 class="subsecao-titulo">Tipo de jogo</h3>
              <div class="tipo-jogo-botoes">
                <button
                  type="button"
                  class="btn-opcao-jogo"
                  :class="tipoJogo === 'horario_cheio' ? 'btn-opcao-jogo--ativo' : ''"
                  @click.prevent="tipoJogo = 'horario_cheio'; slotAguardando = null"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Horário Cheio
                </button>
                <button
                  type="button"
                  class="btn-opcao-jogo"
                  :class="tipoJogo === 'contra_time' ? 'btn-opcao-jogo--ativo' : ''"
                  @click.prevent="tipoJogo = 'contra_time'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Contra Outro Time
                </button>
              </div>

              <div v-if="tipoJogo === 'contra_time'" class="campo mt-3">
                <label class="campo-label">Nome do Time <span class="text-obrigatorio">*</span></label>
                <input v-model="nomeTime" placeholder="Ex: Raios do Sul" class="input-campo" />
              </div>
            </div>

            <!-- Quem vai jogar -->
            <div class="secao-jogadores" :class="listaSemNomes ? 'secao-jogadores--erro' : ''">
              <h3 class="subsecao-titulo flex-header">
                Quem vai jogar?
                <span v-if="jogadoresNomes.length" class="contador-badge">{{ jogadoresNomes.length }}</span>
                <span v-else class="text-obrigatorio ml-1.5">* obrigatório</span>
              </h3>
              <p class="secao-dica">Informe quantas pessoas vão participar e os nomes de cada uma.</p>
              <div class="jogadores-montagem">
                <input type="number" v-model.number="quantidadeJogadores" min="1" max="50" class="input-campo input-campo--qtd" placeholder="Nº pessoas" />
                <button type="button" class="btn-montar-lista" :disabled="!quantidadeJogadores || quantidadeJogadores < 1" @click.prevent="abrirPopupJogadores">
                  {{ jogadoresNomes.length ? 'Editar lista' : 'Montar lista' }}
                </button>
              </div>
              <div v-if="jogadoresNomes.length" class="chips-jogadores">
                <span v-for="(jog, i) in jogadoresNomes" :key="i"
                  class="chip"
                  :class="jog.goleiro ? 'chip--goleiro' : ''"
                >
                  {{ jog.nome }}
                  <span v-if="jog.goleiro" class="chip-goleiro-texto">
                    (Goleiro{{ jog.goleiroPaga ? '' : ' - não paga' }})
                  </span>
                </span>
              </div>
              <p v-if="listaSemNomes" class="aviso-erro">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Informe a quantidade de jogadores e monte a lista de nomes antes de confirmar.
              </p>
            </div>

            <button type="button" class="btn-confirmar-reserva" @click.prevent="finalizarReserva">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Confirmar Reserva
            </button>
          </div><!-- /card resumo -->

        </div><!-- /Coluna Direita -->
      </div><!-- /Layout desktop -->

    </div><!-- /container principal -->

    <!-- Popup Horários -->
    <div v-if="mostrarPopup" class="modal-overlay" @click.self="mostrarPopup = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-titulo">Horários: {{ formatarDataBR(dataSelecionada) }}</h3>
          <button class="btn-fechar" @click="mostrarPopup = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div v-if="isDiaBloqueado" class="bloqueio-alerta">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Este dia foi bloqueado pelo proprietário.
        </div>

        <div v-else>
          <p class="modal-subtitulo">Selecione um horário disponível</p>
          <div class="modal-grid-horarios">
            <template v-for="hora in horariosDoDia" :key="hora.horario">
              <!-- Slot aguardando adversário -->
              <button
                v-if="hora.aguardandoContraTime"
                class="hora-bloco-desafio"
                :class="horarioSelecionado === hora.horario ? 'hora-bloco-desafio--selecionado' : ''"
                @click="selecionarSlotAguardando(hora)"
                :title="`${hora.nomeTimeAguardando} busca adversário`"
              >
                <span class="desafio-emoji">⚔️</span>
                <span class="desafio-hora">{{ hora.horario }}</span>
                <span class="desafio-time">{{ hora.nomeTimeAguardando }}</span>
                <span class="desafio-status">Esperando adversário</span>
              </button>
              <!-- Slot normal -->
              <button
                v-else
                class="hora-bloco"
                :class="{
                  'hora-bloco--ocupado': hora.ocupado,
                  'hora-bloco--selecionado': horarioSelecionado === hora.horario,
                  'hora-bloco--livre': !hora.ocupado && horarioSelecionado !== hora.horario
                }"
                :disabled="hora.ocupado"
                @click="horarioSelecionado = hora.horario; slotAguardando = null"
              >
                {{ hora.horario }}
              </button>
            </template>
          </div>
          <p v-if="horariosDoDia.length === 0" class="hora-aviso-erro">Nenhum horário de funcionamento configurado.</p>
        </div>

        <button
          v-if="!isDiaBloqueado"
          class="btn-confirmar-hora"
          :disabled="!horarioSelecionado"
          @click="mostrarPopup = false"
        >
          Confirmar {{ horarioSelecionado }}
        </button>
      </div>
    </div>

    <!-- Mini-Modal: Entrar como adversário -->
    <div v-if="mostrarModalEntrar" class="modal-overlay" @click.self="cancelarEntrarContraTime">
      <div class="modal-card modal-card--center">
        <div class="modal-desafio-emoji">⚔️</div>
        <h3 class="modal-desafio-titulo">Adversário encontrado!</h3>
        <p class="modal-desafio-texto">
          O time <strong>{{ slotAguardando && slotAguardando.nomeTime }}</strong> está esperando um adversário
          para <strong>{{ horarioSelecionado }}</strong>.
          Deseja entrar nessa partida com o seu time?
        </p>
        <div class="desafio-botoes">
          <button class="btn-desafio-acao btn-desafio-acao--confirmar" @click="confirmarEntrarContraTime">⚔️ Entrar na Partida</button>
          <button class="btn-desafio-acao btn-desafio-acao--cancelar" @click="cancelarEntrarContraTime">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Popup Lista de Jogadores -->
    <div v-if="mostrarPopupJogadores" class="modal-overlay" @click.self="mostrarPopupJogadores = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-titulo">Lista de Jogadores</h3>
          <button class="btn-fechar" @click="mostrarPopupJogadores = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p class="modal-subtitulo">Preencha os nomes. Pode adicionar mais se precisar.</p>
        
        <div class="jogadores-lista-scroll">
          <div v-for="(item, i) in nomesSlotsTemp" :key="i" class="jogador-campo-linha">
            <div class="jogador-input-wrapper">
              <span class="jogador-numero">{{ i + 1 }}</span>
              <input v-model="item.nome" :placeholder="`Jogador ${i + 1}`" class="input-campo" />
            </div>
            <div v-if="mostrarOpcaoGoleiro" class="jogador-goleiro-opcoes">
              <label class="goleiro-checkbox-label">
                <input type="checkbox" v-model="item.goleiro" class="goleiro-checkbox" /> Goleiro?
              </label>
              <label v-if="item.goleiro" class="goleiro-checkbox-label">
                <input type="checkbox" v-model="item.goleiroPaga" class="goleiro-checkbox" /> Paga a quadra?
              </label>
            </div>
          </div>
        </div>

        <button class="btn-adicionar-jogador" @click="adicionarSlotExtra">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar mais um
        </button>
        
        <button class="btn-salvar-jogadores" @click="confirmarListaJogadores">
          Confirmar lista ({{ slotsPreenchidosCount }})
        </button>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="bottom-nav">
      <router-link to="/menu-jogador" class="nav-item" :class="$route.path === '/menu-jogador' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/reserva" class="nav-item" :class="$route.path === '/reserva' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Buscar</span>
      </router-link>
      <router-link to="/conta-jogador" class="nav-item" :class="$route.path === '/conta-jogador' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>

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
      quadra: {}, quadraId: "",
      
      // Calendario
      mesAtual: new Date().getMonth(),
      anoAtual: new Date().getFullYear(),
      diasSemanaLabel: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dataSelecionada: "",
      
      // Funcionamento e ocupações
      diasFuncionamento: [], // [0,1,2,3,4,5,6] (0=Dom, 6=Sáb)
      horaAbertura: 0,
      horaFechamento: 23,
      horariosOcupadosLista: [],
      datasBloqueadas: [],
      isDiaBloqueado: false,
      
      // Popup
      mostrarPopup: false,
      horariosDoDia: [],
      horarioSelecionado: "",
      
      // Tipo de jogo e jogadores
      tipoJogo: "horario_cheio",
      nomeTime: "",
      jogadoresNomes: [],
      quantidadeJogadores: 0,
      mostrarPopupJogadores: false,
      nomesSlotsTemp: [],
      listaSemNomes: false,

      // Contra outro time
      slotAguardando: null, // { reservaId, nomeTime } quando o slot selecionado tem time esperando
      mostrarModalEntrar: false,

      jogador: { id: null, nome: "", telefone: "" },
    };
  },
  computed: {
    mesAtualNome() {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      return meses[this.mesAtual];
    },
    diasMes() {
      const dias = [];
      const dataInicio = new Date(this.anoAtual, this.mesAtual, 1);
      const dataFim = new Date(this.anoAtual, this.mesAtual + 1, 0);
      
      // Dias vazios no início
      for (let i = 0; i < dataInicio.getDay(); i++) {
        dias.push({ id: `vazio-${i}`, data: null });
      }
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      // Dias do mês
      for (let i = 1; i <= dataFim.getDate(); i++) {
        const d = new Date(this.anoAtual, this.mesAtual, i);
        // compensar fuso horário para pegar yyyy-mm-dd correto
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, 10);
        const dataStr = localISOTime;
        
        // Verifica se é passado
        let valido = d >= hoje;
        // Verifica se é dia de funcionamento
        if (valido && this.diasFuncionamento.length > 0) {
          valido = this.diasFuncionamento.includes(d.getDay());
        }
        
        dias.push({
          id: dataStr,
          data: dataStr,
          numero: i,
          valido: valido,
          diaSemana: d.getDay()
        });
      }
      return dias;
    },
    mostrarOpcaoGoleiro() {
      const esp = (this.quadra && this.quadra.esporte || "").toLowerCase();
      return ["futebol", "futsal", "society"].includes(esp);
    },
    slotsPreenchidosCount() {
      return this.nomesSlotsTemp.filter(item => item.nome && typeof item.nome === 'string' && item.nome.trim()).length;
    }
  },
  async mounted() {
    const q = this.$route.query.quadra;
    if (q) { try { const parsed = JSON.parse(q); this.quadraId = parsed.id || parsed.quadraId || parsed.uid || this.quadraId; } catch (e) { console.warn("query parse:", e); } }
    if (!this.quadraId) { const sid = localStorage.getItem("quadraSelecionada") || localStorage.getItem("quadraId"); if (sid) this.quadraId = sid; }
    
    if (this.quadraId) { 
      try { 
        this.quadra = await api.getQuadra(this.quadraId); 
        this.parseHorarioFuncionamento(this.quadra.horario);
        await this.carregarOcupacoes();
      } catch (e) { 
        console.error("Erro ao carregar quadra:", e); 
      } 
    }
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) { this.jogador.id = user.id; this.jogador.nome = user.nome || ""; this.jogador.telefone = user.telefone || ""; }
    else { const n = localStorage.getItem("jogadorNome"); const t = localStorage.getItem("jogadorTelefone"); if (n) this.jogador.nome = n; if (t) this.jogador.telefone = t; }
  },
  methods: {
    parseHorarioFuncionamento(horarioStr) {
      if (!horarioStr) {
        this.diasFuncionamento = [0,1,2,3,4,5,6]; // Se nao tiver, libera todos
        this.horaAbertura = 0;
        this.horaFechamento = 23;
        return;
      }
      
      const diasMap = { "Domingo": 0, "Segunda": 1, "Terça": 2, "Quarta": 3, "Quinta": 4, "Sexta": 5, "Sábado": 6 };
      
      try {
        const parts = horarioStr.split(',');
        if (parts.length === 2) {
          const diasPart = parts[0].trim();
          const horasPart = parts[1].trim();
          
          // Parse dias "Segunda até Sexta"
          if (diasPart.includes(' até ')) {
            const [inicio, fim] = diasPart.split(' até ');
            const dInicio = diasMap[inicio.trim()];
            const dFim = diasMap[fim.trim()];
            
            if (dInicio !== undefined && dFim !== undefined) {
              let dias = [];
              if (dInicio <= dFim) {
                for (let i = dInicio; i <= dFim; i++) dias.push(i);
              } else {
                for (let i = dInicio; i <= 6; i++) dias.push(i);
                for (let i = 0; i <= dFim; i++) dias.push(i);
              }
              this.diasFuncionamento = dias;
            } else {
              this.diasFuncionamento = [0,1,2,3,4,5,6];
            }
          } else {
             // Caso não seja 'até', ex: só um dia, na duvida libera tudo e confia no dono
             this.diasFuncionamento = [0,1,2,3,4,5,6];
          }
          
          // Parse horas "10:00 às 23:00"
          const horasMatch = horasPart.match(/(\d{2}):\d{2}\s+(?:às|as)\s+(\d{2}):\d{2}/i);
          if (horasMatch) {
            this.horaAbertura = parseInt(horasMatch[1]);
            this.horaFechamento = parseInt(horasMatch[2]);
          }
        }
      } catch (err) {
        console.error("Falha ao fazer parse do horario da quadra", err);
        this.diasFuncionamento = [0,1,2,3,4,5,6];
      }
    },
    
    async carregarOcupacoes() {
      try {
        const ocupacoes = await api.getQuadraOcupacoes(this.quadraId);
        // Formata datas pra garantir YYYY-MM-DD local timezone
        this.datasBloqueadas = (ocupacoes.datasOcupadas || []).map(d => {
           return d && typeof d === 'string' && d.includes('T') ? d.split('T')[0] : (d || '');
        });
        
        // Combina bloqueios do dono com reservas aprovadas
        const bloqueios = (ocupacoes.horariosOcupados || []).map(h => ({ 
           data: h.data && typeof h.data === 'string' && h.data.includes('T') ? h.data.split('T')[0] : (h.data || ''), 
           horario: h.horario 
        }));
        const reservas = (ocupacoes.reservas || []).map(r => ({ 
           data: r.data && typeof r.data === 'string' && r.data.includes('T') ? r.data.split('T')[0] : (r.data || ''), 
           horario: r.horario 
        }));
        
        this.horariosOcupadosLista = [...bloqueios, ...reservas];
      } catch (err) {
        console.error("Erro ao carregar ocupações", err);
      }
    },
    
    mudarMes(delta) {
      this.mesAtual += delta;
      if (this.mesAtual > 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      } else if (this.mesAtual < 0) {
        this.mesAtual = 11;
        this.anoAtual--;
      }
    },
    
    selecionarDia(dia) {
      if (!dia.data || !dia.valido) return;
      const diaAnterior = this.dataSelecionada;
      this.dataSelecionada = dia.data;
      // Se o dia mudou, reseta o horário selecionado
      if (diaAnterior !== dia.data && this.horarioSelecionado) {
        this.horarioSelecionado = "";
        this.slotAguardando = null;
      }
      this.montarHorariosDoDia();
      // Só reabre o popup se ainda não tem horário escolhido
      if (!this.horarioSelecionado) {
        this.mostrarPopup = true;
      }
    },
    
    async montarHorariosDoDia() {
      if (!this.dataSelecionada) return;
      
      this.isDiaBloqueado = this.datasBloqueadas.includes(this.dataSelecionada);
      if (this.isDiaBloqueado) {
        this.horariosDoDia = [];
        return;
      }
      
      const ocupadosNoDia = this.horariosOcupadosLista
        .filter(h => h.data === this.dataSelecionada)
        .map(h => h.horario);

      // Verifica se o dia selecionado é hoje para bloquear horas passadas
      const agora = new Date();
      const hojeStr = agora.toLocaleDateString('sv-SE'); // formato YYYY-MM-DD local
      const horaAtual = agora.getHours();
      const ehHoje = this.dataSelecionada === hojeStr;
        
      const horarios = [];
      for (let i = this.horaAbertura; i <= this.horaFechamento; i++) {
        const horaStr = `${String(i).padStart(2, '0')}:00`;
        // Se for hoje, horários já passados ficam ocupados
        const jáPassou = ehHoje && i <= horaAtual;
        horarios.push({
          horario: horaStr,
          ocupado: ocupadosNoDia.includes(horaStr) || jáPassou,
          aguardandoContraTime: false,
          nomeTimeAguardando: "",
          reservaIdAguardando: ""
        });
      }

      // Sempre busca slots contra_time aguardando adversário (visíveis para todos os jogadores)
      if (this.quadraId) {
        try {
          const { slots } = await api.getContraTimeAguardandoDia(this.quadraId, this.dataSelecionada);
          horarios.forEach(h => {
            if (!h.ocupado && slots[h.horario]) {
              h.aguardandoContraTime = true;
              h.nomeTimeAguardando = slots[h.horario].nomeTime;
              h.reservaIdAguardando = slots[h.horario].reservaId;
            }
          });
        } catch (_) { /* silencioso */ }
      }

      this.horariosDoDia = horarios;
    },
    
    formatarDataBR(dataIso) {
      if (!dataIso) return "";
      return String(dataIso).slice(0, 10).replace(/-/g, "/");
    },
    
    abrirPopupJogadores() {
      if (!this.quantidadeJogadores || this.quantidadeJogadores < 1) return;
      if (this.jogadoresNomes.length > 0) {
        this.nomesSlotsTemp = this.jogadoresNomes.map(item => {
          if (typeof item === 'object' && item !== null) {
            return {
              nome: item.nome || '',
              goleiro: !!item.goleiro,
              goleiroPaga: item.goleiroPaga !== undefined ? !!item.goleiroPaga : true
            };
          }
          return { nome: item || '', goleiro: false, goleiroPaga: true };
        });
        while (this.nomesSlotsTemp.length < this.quantidadeJogadores) {
          this.nomesSlotsTemp.push({ nome: '', goleiro: false, goleiroPaga: true });
        }
      } else {
        this.nomesSlotsTemp = Array.from({ length: this.quantidadeJogadores }, () => ({
          nome: '',
          goleiro: false,
          goleiroPaga: true
        }));
      }
      this.mostrarPopupJogadores = true;
    },
    adicionarSlotExtra() {
      this.nomesSlotsTemp.push({ nome: '', goleiro: false, goleiroPaga: true });
    },
    confirmarListaJogadores() {
      this.jogadoresNomes = this.nomesSlotsTemp
        .filter(item => item.nome && typeof item.nome === 'string' && item.nome.trim())
        .map(item => ({
          nome: item.nome.trim(),
          goleiro: !!item.goleiro,
          goleiroPaga: item.goleiro ? !!item.goleiroPaga : true
        }));
      this.quantidadeJogadores = this.jogadoresNomes.length;
      this.mostrarPopupJogadores = false;
    },
    selecionarSlotAguardando(hora) {
      // Auto-define modo contra_time ao clicar num slot laranja
      this.tipoJogo = 'contra_time';
      this.horarioSelecionado = hora.horario;
      this.slotAguardando = {
        reservaId: hora.reservaIdAguardando,
        nomeTime: hora.nomeTimeAguardando
      };
      this.mostrarModalEntrar = true;
    },
    cancelarEntrarContraTime() {
      this.mostrarModalEntrar = false;
      this.slotAguardando = null;
      this.horarioSelecionado = "";
    },
    confirmarEntrarContraTime() {
      this.mostrarModalEntrar = false;
      this.mostrarPopup = false;
    },
    async finalizarReserva() {
      if (!this.dataSelecionada || !this.horarioSelecionado) return alert("Escolha data e horário.");
      if (!this.jogador.nome || !this.jogador.telefone) return alert("Informe seu nome e telefone.");
      if (this.tipoJogo === 'contra_time' && (!this.nomeTime || typeof this.nomeTime !== 'string' || !this.nomeTime.trim())) return alert("Informe o nome do seu time.");
      if (!this.jogadoresNomes.length) {
        this.listaSemNomes = true;
        const el = document.querySelector('.secao-jogadores--erro');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      this.listaSemNomes = false;
      const quadraId = this.quadraId;
      if (!quadraId) return alert("Quadra inválida.");

      try {
        // Se estiver entrando como adversário num slot aguardando
        if (this.slotAguardando) {
          await api.entrarContraTime(this.slotAguardando.reservaId, {
            nomeJogador: this.jogador.nome,
            telefoneJogador: this.jogador.telefone,
            jogadoresLista: this.jogadoresNomes,
            nomeTime: this.nomeTime
          });
          localStorage.setItem("jogadorNome", this.jogador.nome);
          localStorage.setItem("jogadorTelefone", this.jogador.telefone);
          alert("Você entrou na partida! Aguarde confirmação do dono.");
          this.$router.push("/menu-jogador");
          return;
        }

        const reserva = {
          jogadorId: this.jogador.id || null,
          nomeJogador: this.jogador.nome,
          telefoneJogador: this.jogador.telefone,
          quadraId,
          data: this.dataSelecionada,
          horario: this.horarioSelecionado,
          tipoJogo: this.tipoJogo,
          jogadoresLista: this.jogadoresNomes,
          nomeTime: this.tipoJogo === 'contra_time' ? this.nomeTime : null
        };
        await api.createReserva(reserva);
        localStorage.setItem("jogadorNome", this.jogador.nome);
        localStorage.setItem("jogadorTelefone", this.jogador.telefone);
        alert("Reserva enviada! Aguarde confirmação do dono.");
        this.$router.push("/menu-jogador");
      } catch (err) {
        console.error("Erro ao finalizar reserva:", err);
        alert("Erro ao salvar reserva.");
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
}

.container {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 100px;
}

.cabecalho-secao {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--muted);
  border: none;
  color: #475569;
  font-weight: 700;
  font-size: 13px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

.titulo-secao {
  font-size: 20px;
  font-weight: 800;
  color: var(--foreground);
}

/* Layout flex */
.layout-flex {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 768px) {
  .layout-flex {
    flex-direction: row;
    align-items: flex-start;
  }
}

.coluna-esquerda {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.coluna-direita {
  width: 100%;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .coluna-direita {
    width: 420px;
  }
}

/* Card quadra */
.card-quadra {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.quadra-foto-container {
  width: 100%;
  height: 160px;
  overflow: hidden;
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
}

.foto-placeholder-icone {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
}

.quadra-info {
  padding: 16px;
}

.quadra-nome {
  font-size: 18px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 6px;
}

.quadra-detalhes {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-bottom: 8px;
}

.quadra-preco {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-dark);
}

.carregando-texto {
  text-align: center;
  color: var(--muted-foreground);
  padding: 20px 0;
  font-size: 14px;
}

/* Calendario */
.calendario-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.calendario-titulo {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
}

.calendario-moldura {
  border: 1.5px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.calendario-mes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border);
}

.btn-mes-nav {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #475569;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-mes-nav:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

.calendario-mes-titulo {
  font-weight: 800;
  font-size: 13px;
  color: var(--foreground);
  text-transform: capitalize;
}

.calendario-semana-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 10px 0;
  background: white;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-foreground);
  border-bottom: 1px solid #f1f5f9;
}

.calendario-dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
  padding: 8px;
  gap: 4px;
}

.dia-item {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.dia-item--vazio {
  pointer-events: none;
  opacity: 0;
}

.dia-item--invalido {
  color: #cbd5e1;
  cursor: default;
}

.dia-item--invalido:hover {
  background: transparent;
}

.dia-item--selecionado {
  background: var(--primary) !important;
  color: white !important;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.dia-item:hover:not(.dia-item--invalido):not(.dia-item--selecionado) {
  background: #f1f5f9;
  color: var(--primary-dark);
}

/* Card resumo */
.card-resumo {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resumo-titulo {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
}

.resumo-dados-reserva {
  display: flex;
  gap: 12px;
}

.resumo-bloco-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--muted);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.icone-azul { color: var(--accent); }
.icone-amarelo { color: #f59e0b; }

.secao-inputs,
.secao-tipo-jogo,
.secao-jogadores {
  display: flex;
  flex-direction: column;
}

.subsecao-titulo {
  font-size: 14px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 12px;
}

.flex-header {
  display: flex;
  align-items: center;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.campo:last-child {
  margin-bottom: 0;
}

.campo-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

/* Tipo de jogo */
.tipo-jogo-botoes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-opcao-jogo {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid var(--border);
  background: white;
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-opcao-jogo:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: none;
  box-shadow: none;
}

.btn-opcao-jogo--ativo {
  border-color: var(--primary);
  background: rgba(34, 197, 94, 0.06);
  color: var(--primary-dark);
}

.text-obrigatorio {
  color: var(--destructive);
  font-size: 12px;
  font-weight: 600;
}

.mt-3 {
  margin-top: 12px;
}

/* Jogadores */
.secao-jogadores--erro {
  padding: 12px;
  background: #fef2f2;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
}

.secao-dica {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-bottom: 10px;
}

.jogadores-montagem {
  display: flex;
  gap: 8px;
}

.input-campo--qtd {
  width: 110px;
  flex-shrink: 0;
}

.btn-montar-lista {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--primary);
  color: white;
  border: none;
  font-weight: 700;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-montar-lista:hover {
  opacity: 0.9;
  transform: none;
  box-shadow: none;
}

.btn-montar-lista:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.contador-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
  font-size: 11px;
  font-weight: 800;
  border-radius: 99px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 6px;
}

.chips-jogadores {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.chip--goleiro {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
}

.chip-goleiro-texto {
  font-size: 10px;
  opacity: 0.8;
  margin-left: 4px;
  font-weight: 700;
  color: var(--primary-dark);
}

.aviso-erro {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--destructive);
  margin-top: 8px;
}

.btn-confirmar-reserva {
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-confirmar-reserva:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

/* Modals overlays & Popups */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 380px;
  padding: 20px;
  box-shadow: var(--shadow-glow);
  position: relative;
  animation: slideUp 0.2s ease-out;
}

.modal-card--center {
  text-align: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.bloqueio-alerta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  font-size: 13px;
  color: var(--destructive);
  margin-bottom: 16px;
}

.modal-subtitulo {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-bottom: 12px;
}

.modal-grid-horarios {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.hora-bloco {
  padding: 10px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: white;
  transition: all 0.2s;
  text-align: center;
}

.hora-bloco:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary-dark);
  transform: none;
  box-shadow: none;
}

.hora-bloco--ocupado {
  background: #f1f5f9;
  color: #94a3b8;
  text-decoration: line-through;
  cursor: not-allowed;
  opacity: 0.6;
}

.hora-bloco--selecionado {
  background: var(--primary) !important;
  color: white !important;
  border-color: var(--primary) !important;
}

.hora-bloco--livre {
  border-color: var(--border);
  color: #475569;
}

/* Horas desafios ⚔️ */
.hora-bloco-desafio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px;
  border: 2px solid #f59e0b;
  background: #fffbeb;
  color: #b45309;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.hora-bloco-desafio:hover {
  background: #fef3c7;
  transform: none;
  box-shadow: none;
}

.hora-bloco-desafio--selecionado {
  background: #f59e0b !important;
  color: white !important;
  border-color: #f59e0b !important;
}

.desafio-emoji {
  font-size: 14px;
}

.desafio-hora {
  font-size: 12px;
  font-weight: 800;
}

.desafio-time {
  font-size: 9px;
  font-weight: 700;
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desafio-status {
  font-size: 8px;
  opacity: 0.7;
  font-style: italic;
}

.hora-aviso-erro {
  font-size: 12px;
  color: var(--destructive);
  text-align: center;
  padding: 10px 0;
}

.btn-confirmar-hora {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-confirmar-hora:hover {
  opacity: 0.9;
}

.btn-confirmar-hora:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Adversario Modal */
.modal-desafio-emoji {
  font-size: 36px;
  margin-bottom: 10px;
}

.modal-desafio-titulo {
  font-size: 18px;
  font-weight: 800;
  color: var(--foreground);
  margin-bottom: 6px;
}

.modal-desafio-texto {
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.5;
  margin-bottom: 16px;
}

.desafio-botoes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-desafio-acao {
  width: 100%;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn-desafio-acao--confirmar {
  background: var(--primary);
  color: white;
}

.btn-desafio-acao--cancelar {
  background: var(--muted);
  color: #475569;
  border: 1px solid var(--border);
}

/* Popup Lista Jogadores */
.jogadores-lista-scroll {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 12px;
  padding-right: 4px;
}

.jogador-campo-linha {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.jogador-campo-linha:last-child {
  border-bottom: none;
}

.jogador-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jogador-numero {
  min-width: 20px;
  font-size: 12px;
  font-weight: 800;
  color: var(--muted-foreground);
  text-align: center;
}

.jogador-goleiro-opcoes {
  display: flex;
  gap: 14px;
  margin-left: 28px;
  font-size: 12px;
  color: #64748b;
  align-items: center;
}

.goleiro-checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.goleiro-checkbox {
  cursor: pointer;
}

.btn-adicionar-jogador {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: var(--muted);
  color: #475569;
  border: 1px dashed var(--border);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}

.btn-adicionar-jogador:hover {
  background: #e2e8f0;
  transform: none;
  box-shadow: none;
}

.btn-salvar-jogadores {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
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
