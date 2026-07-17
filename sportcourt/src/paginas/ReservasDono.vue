<template>
  <div class="pagina">

    <TopbarDono />

    <div class="container">

      <!-- Cabeçalho -->
      <div class="cabecalho">
        <div>
          <h1 class="titulo">CRM de Reservas</h1>
          <p class="subtitulo">{{ reservas.length }} agendamento{{ reservas.length !== 1 ? 's' : '' }} no total</p>
        </div>
        <span class="badge-total">{{ reservas.length }}</span>
      </div>

      <!-- Abas de Status -->
      <div class="abas-wrapper">
        <button v-for="aba in abas" :key="aba.id" @click="abaAtiva = aba.id"
          class="aba-btn"
          :class="abaAtiva === aba.id ? 'aba-btn--ativo' : ''">
          {{ aba.label }}
          <span class="aba-badge" :class="abaAtiva === aba.id ? aba.badgeClass : 'aba-badge--inativo'">
            {{ aba.id !== 'crm' ? listaFiltrada(aba.id).length : clientesList.length }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-wrapper">
        <div class="spinner"></div>
      </div>

      <!-- ======================== -->
      <!-- Aba CRM Clientes         -->
      <!-- ======================== -->
      <div v-else-if="abaAtiva === 'crm'" class="lista-crm">
        <div class="crm-filtros">
          <div class="crm-busca-wrapper">
            <svg class="crm-busca-icone" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="buscaCRM" placeholder="Buscar cliente..." class="crm-busca-input" />
          </div>
          <div class="crm-filtros-btns">
            <button v-for="f in filtrosFinanceiros" :key="f.id" @click="filtroFinanceiro = f.id"
              class="filtro-btn"
              :class="filtroFinanceiro === f.id ? 'filtro-btn--ativo' : ''">
              {{ f.label }}
            </button>
          </div>
        </div>

        <div v-if="clientesFiltrados.length === 0" class="lista-vazia">
          <p>Nenhum cliente encontrado.</p>
        </div>

        <div v-for="c in clientesFiltrados" :key="c.id" class="cliente-card">
          <button @click="selectedClienteId = selectedClienteId === c.id ? null : c.id" class="cliente-header">
            <div class="avatar" :style="{ background: avatarColor(c.nome) }">{{ iniciais(c.nome) }}</div>
            <div class="cliente-info">
              <p class="cliente-nome">{{ c.nome }}</p>
              <p class="cliente-stats">{{ c.totalJogos }} jogo{{ c.totalJogos !== 1 ? 's' : '' }} · R$ {{ c.totalPago.toFixed(2) }} pagos</p>
              <p v-if="c.telefone" class="cliente-tel">📞 {{ c.telefone }}</p>
            </div>
            <div class="cliente-status">
              <span class="status-badge" :class="c.divida > 0 ? 'status-badge--pendente' : 'status-badge--em-dia'">
                {{ c.divida > 0 ? 'Pendente' : 'Em dia' }}
              </span>
              <p v-if="c.divida > 0" class="divida-valor">R$ {{ c.divida.toFixed(2) }}</p>
            </div>
          </button>

          <div v-if="selectedClienteId === c.id" class="cliente-historico">
            <div class="historico-lista">
              <div v-for="r in c.reservas" :key="r.id" class="historico-item">
                <div>
                  <p class="historico-data">{{ formatarData(r.data) }} · {{ r.horario }}</p>
                  <p class="historico-quadra">{{ r.quadraNome }} · R$ {{ r.preco }}</p>
                </div>
                <span class="pagamento-badge" :class="r.statusPagamento === 'pago' ? 'pagamento-badge--pago' : 'pagamento-badge--pendente'">
                  {{ r.statusPagamento === 'pago' ? 'Pago' : 'Pendente' }}
                </span>
              </div>
            </div>
            <a :href="whatsappCRM(c)" target="_blank" class="btn-whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.927 0C5.364 0 .068 5.296.068 11.86c0 2.091.549 4.056 1.508 5.757L0 24l6.567-1.718A11.85 11.85 0 0 0 11.927 23.72c6.563 0 11.86-5.296 11.86-11.86S18.49 0 11.927 0zm0 21.653a9.79 9.79 0 0 1-4.987-1.366l-.358-.213-3.699.969.984-3.596-.233-.371a9.772 9.772 0 0 1-1.499-5.216c0-5.405 4.396-9.8 9.792-9.8 5.397 0 9.792 4.395 9.792 9.8s-4.395 9.793-9.792 9.793z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- ======================== -->
      <!-- Abas de Reservas         -->
      <!-- ======================== -->
      <div v-else class="lista-reservas">
        <div v-if="listaAtiva.length === 0" class="lista-vazia">
          <p>Nenhuma reserva {{ abaAtiva }}.</p>
        </div>

        <div v-for="r in listaAtiva" :key="r.id" class="reserva-card">

          <!-- Cabeçalho do card -->
          <div class="reserva-cabecalho">
            <div class="avatar" :style="{ background: avatarColor(r.nome) }">{{ iniciais(r.nome) }}</div>
            <div class="reserva-jogador">
              <p class="jogador-nome">{{ r.nome || 'Jogador' }}</p>
              <p class="jogador-tel">{{ r.telefone }}</p>
            </div>
            <div class="card-badges">
              <span v-if="r.tipoJogo === 'contra_time' && !r.nomeJogadorB"
                class="badge-contra-aguardando">⚔️ Aguardando</span>
              <span v-else-if="r.tipoJogo === 'contra_time'"
                class="badge-contra-fechado">⚔️ Contra Time</span>
              <span class="status-reserva"
                :class="r.confirmada ? 'status-reserva--confirmada' : 'status-reserva--pendente'">
                {{ r.confirmada ? 'Confirmada' : 'Pendente' }}
              </span>
            </div>
          </div>

          <!-- Info Contra Time (VS) -->
          <div v-if="r.tipoJogo === 'contra_time'" class="contra-time-info">
            <span class="time-nome time-nome-a">{{ r.nomeTime || r.nome || 'Time A' }}</span>
            <span class="vs-separador">VS</span>
            <span v-if="r.nomeJogadorB" class="time-nome time-nome-b">{{ r.nomeTimeB || r.nomeJogadorB }}</span>
            <span v-else class="time-aguardando">??? adversário</span>
          </div>

          <!-- Detalhes da reserva -->
          <div class="reserva-detalhes">
            <div class="detalhe-item">
              <svg class="detalhe-icone detalhe-icone--azul" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="detalhe-valor">{{ formatarData(r.data) }}</span>
            </div>
            <div class="detalhe-item">
              <svg class="detalhe-icone detalhe-icone--amarelo" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="detalhe-valor">{{ r.horario }}</span>
            </div>
            <div class="detalhe-item">
              <svg class="detalhe-icone detalhe-icone--verde" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span class="detalhe-valor">R$ {{ r.preco }}</span>
            </div>
            <div class="detalhe-item">
              <svg class="detalhe-icone detalhe-icone--azul" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span class="detalhe-valor">{{ r.quadraNome }}</span>
            </div>
          </div>

          <!-- Lista de Jogadores (confirmadas e encerradas) -->
          <div v-if="abaAtiva !== 'pendentes' && expandidoId !== r.id" class="jogadores-section">
            <div class="times-wrapper" :class="r.tipoJogo === 'contra_time' && r.nomeJogadorB ? 'times-duplo' : ''">

              <!-- Time A -->
              <div class="time-bloco">
                <p class="time-titulo">
                  {{ r.tipoJogo === 'contra_time' ? (r.nomeTime || 'Time A') : 'Jogadores' }}
                  <span class="time-cota-info">
                    (Cota: R$ {{ calcularValorPorJogadorA(r).toFixed(2) }})
                  </span>
                </p>
                <div v-if="r.jogadoresLista && r.jogadoresLista.length > 0" class="jogadores-chips">
                  <div v-for="(j, idx) in r.jogadoresLista" :key="'a-' + idx" class="jogador-item">
                    <span class="jogador-item-nome">
                      {{ j.nome }}
                      <span v-if="j.goleiro" class="goleiro-tag">🥅</span>
                    </span>
                    <div class="jogador-financeiro-info">
                      <span class="jogador-cota">
                        {{ (!j.goleiro || j.goleiroPaga) ? 'R$ ' + calcularValorPorJogadorA(r).toFixed(2) : 'Isento' }}
                      </span>
                      <button v-if="abaAtiva === 'encerradas'"
                        @click="togglePagamentoJogador(r, idx)"
                        class="pago-btn"
                        :class="j.pago ? 'pago-btn--pago' : 'pago-btn--pendente'">
                        {{ j.pago ? '✓ Pago' : 'Pendente' }}
                      </button>
                      <span v-else class="pago-tag" :class="j.pago ? 'pago-tag--pago' : 'pago-tag--pendente'">
                        {{ j.pago ? 'Pago' : 'Pendente' }}
                      </span>
                    </div>
                  </div>
                </div>
                <p v-else class="sem-jogadores">Nenhum jogador cadastrado</p>
              </div>

              <!-- Time B (contra_time com adversário) -->
              <div v-if="r.tipoJogo === 'contra_time' && r.nomeJogadorB" class="time-bloco time-bloco--b">
                <p class="time-titulo">
                  {{ r.nomeTimeB || r.nomeJogadorB || 'Time B' }}
                  <span class="time-cota-info">
                    (Cota: R$ {{ calcularValorPorJogadorB(r).toFixed(2) }})
                  </span>
                </p>
                <div v-if="r.jogadoresListaB && r.jogadoresListaB.length > 0" class="jogadores-chips">
                  <div v-for="(j, idx) in r.jogadoresListaB" :key="'b-' + idx" class="jogador-item">
                    <span class="jogador-item-nome">
                      {{ j.nome }}
                      <span v-if="j.goleiro" class="goleiro-tag">🥅</span>
                    </span>
                    <div class="jogador-financeiro-info">
                      <span class="jogador-cota">
                        {{ (!j.goleiro || j.goleiroPaga) ? 'R$ ' + calcularValorPorJogadorB(r).toFixed(2) : 'Isento' }}
                      </span>
                      <button v-if="abaAtiva === 'encerradas'"
                        @click="togglePagamentoJogadorB(r, idx)"
                        class="pago-btn"
                        :class="j.pago ? 'pago-btn--pago' : 'pago-btn--pendente'">
                        {{ j.pago ? '✓ Pago' : 'Pendente' }}
                      </button>
                      <span v-else class="pago-tag" :class="j.pago ? 'pago-tag--pago' : 'pago-tag--pendente'">
                        {{ j.pago ? 'Pago' : 'Pendente' }}
                      </span>
                    </div>
                  </div>
                </div>
                <p v-else class="sem-jogadores">Nenhum jogador cadastrado</p>
              </div>
            </div>
          </div>

          <!-- Painel de Edição (pendentes e confirmadas) -->
          <div v-if="abaAtiva === 'pendentes' || abaAtiva === 'confirmadas'" class="edicao-wrapper">
            <button @click="toggleExpandido(r.id)" class="btn-editar-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {{ expandidoId === r.id ? 'Fechar edição' : 'Editar jogadores' }}
            </button>

            <div v-if="expandidoId === r.id" class="edicao-painel">

              <!-- Jogadores Time A -->
              <div class="edicao-time">
                <p class="edicao-time-label">{{ r.nomeTime || 'Time A' }}</p>
                <div v-for="(j, idx) in r.jogadoresLista" :key="'ea-' + idx" class="edicao-linha">
                  <span class="edicao-nome">{{ j.nome }}</span>
                  <div class="edicao-controles-jogador">
                    <label class="edicao-goleiro-label">
                      <input type="checkbox" v-model="r.jogadoresLista[idx].goleiro" class="edicao-checkbox" />
                      Goleiro
                    </label>
                    <label v-if="r.jogadoresLista[idx].goleiro" class="edicao-goleiro-label">
                      <input type="checkbox" v-model="r.jogadoresLista[idx].goleiroPaga" class="edicao-checkbox" />
                      Paga?
                    </label>
                  </div>
                  <button @click="removerJogador(r, idx)" class="btn-remover">✕</button>
                </div>
                <div class="edicao-adicionar">
                  <input :value="novoJogador[r.id] || ''" @input="novoJogador[r.id] = $event.target.value"
                    type="text" placeholder="Nome do jogador..." class="input-novo-jogador"
                    @keyup.enter="adicionarJogador(r)" />
                  <button @click="adicionarJogador(r)" class="btn-adicionar">+</button>
                </div>
              </div>

              <!-- Jogadores Time B (se contra_time e adversário entrou) -->
              <div v-if="r.tipoJogo === 'contra_time' && r.nomeJogadorB" class="edicao-time">
                <p class="edicao-time-label">{{ r.nomeTimeB || r.nomeJogadorB || 'Time B' }}</p>
                <div v-for="(j, idx) in (r.jogadoresListaB || [])" :key="'eb-' + idx" class="edicao-linha">
                  <span class="edicao-nome">{{ j.nome }}</span>
                  <div class="edicao-controles-jogador">
                    <label class="edicao-goleiro-label">
                      <input type="checkbox" v-model="r.jogadoresListaB[idx].goleiro" class="edicao-checkbox" />
                      Goleiro
                    </label>
                    <label v-if="r.jogadoresListaB[idx].goleiro" class="edicao-goleiro-label">
                      <input type="checkbox" v-model="r.jogadoresListaB[idx].goleiroPaga" class="edicao-checkbox" />
                      Paga?
                    </label>
                  </div>
                  <button @click="removerJogadorB(r, idx)" class="btn-remover">✕</button>
                </div>
                <div class="edicao-adicionar">
                  <input :value="novoJogadorB[r.id] || ''" @input="novoJogadorB[r.id] = $event.target.value"
                    type="text" placeholder="Nome do jogador Time B..." class="input-novo-jogador"
                    @keyup.enter="adicionarJogadorB(r)" />
                  <button @click="adicionarJogadorB(r)" class="btn-adicionar">+</button>
                </div>
              </div>

              <!-- Mudar para Horário Cheio (se contra sem adversário) -->
              <button v-if="r.tipoJogo === 'contra_time' && !r.nomeJogadorB && abaAtiva === 'pendentes'"
                @click="mudarParaHorarioCheio(r)" class="btn-modo-cheio">
                🔄 Aceitar como Horário Cheio (sem adversário)
              </button>

              <button @click="salvarListaJogadores(r)" class="btn-salvar-edicao">
                💾 Salvar lista
              </button>
            </div>
          </div>

          <!-- Ações -->
          <div class="reserva-acoes">
            <button v-if="!r.confirmada" @click="confirmarReserva(r)"
              class="acao-btn acao-btn--azul"
              :disabled="r.tipoJogo === 'contra_time' && !r.nomeJogadorB"
              :title="r.tipoJogo === 'contra_time' && !r.nomeJogadorB ? 'Aguardando adversário entrar no jogo' : 'Confirmar reserva'">
              {{ r.tipoJogo === 'contra_time' && !r.nomeJogadorB ? '⏳ Aguardando' : 'Confirmar' }}
            </button>
            <button v-if="r.confirmada && r.statusPagamento !== 'pago'" @click="abrirModalEncerramento(r)"
              class="acao-btn acao-btn--verde">
              Encerrar Horário
            </button>
            <button @click="cancelarReserva(r)" class="acao-btn acao-btn--vermelho">Cancelar</button>
            <a :href="`https://wa.me/55${(r.telefone||'').replace(/\D/g,'')}`"
              target="_blank" class="acao-btn acao-btn--whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WA
            </a>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal de Encerramento (Rateio) -->
    <div v-if="modalEncerramento.aberto && modalEncerramento.reserva" class="modal-overlay" @click.self="fecharModalEncerramento">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-titulo">Encerrar Horário & Rateio</h2>
          <button class="btn-fechar" @click="fecharModalEncerramento">&times;</button>
        </div>
        <div class="modal-body">
          <p class="resumo-titulo">{{ modalEncerramento.reserva.quadraNome }}</p>
          <p class="resumo-data">{{ formatarData(modalEncerramento.reserva.data) }} às {{ modalEncerramento.reserva.horario }}</p>
          
          <div class="divisor-linha"></div>
          
          <div class="rateio-secao">
            <div class="rateio-row">
              <span class="rateio-row-label">Valor Total da Quadra:</span>
              <span class="rateio-valor-destaque">R$ {{ parseFloat(modalEncerramento.reserva.preco).toFixed(2) }}</span>
            </div>
            
            <!-- Rateio Time A -->
            <div class="rateio-bloco">
              <p class="rateio-bloco-titulo">
                {{ modalEncerramento.reserva.tipoJogo === 'contra_time' ? (modalEncerramento.reserva.nomeTime || 'Time A') : 'Rateio Jogadores' }}
              </p>
              <div class="rateio-detalhe">
                <span>Valor do Time (50%):</span>
                <span>R$ {{ (modalEncerramento.reserva.tipoJogo === 'contra_time' ? parseFloat(modalEncerramento.reserva.preco)/2 : parseFloat(modalEncerramento.reserva.preco)).toFixed(2) }}</span>
              </div>
              <div class="rateio-detalhe">
                <span>Jogadores Pagantes:</span>
                <span>{{ (modalEncerramento.reserva.jogadoresLista || []).filter(j => !j.goleiro || j.goleiroPaga).length }}</span>
              </div>
              <div class="rateio-detalhe rateio-cota-destaque">
                <span>Cota por Jogador:</span>
                <span>R$ {{ calcularValorPorJogadorA(modalEncerramento.reserva).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Rateio Time B -->
            <div v-if="modalEncerramento.reserva.tipoJogo === 'contra_time' && modalEncerramento.reserva.nomeJogadorB" class="rateio-bloco">
              <p class="rateio-bloco-titulo">{{ modalEncerramento.reserva.nomeTimeB || modalEncerramento.reserva.nomeJogadorB || 'Time B' }}</p>
              <div class="rateio-detalhe">
                <span>Valor do Time (50%):</span>
                <span>R$ {{ (parseFloat(modalEncerramento.reserva.preco)/2).toFixed(2) }}</span>
              </div>
              <div class="rateio-detalhe">
                <span>Jogadores Pagantes:</span>
                <span>{{ (modalEncerramento.reserva.jogadoresListaB || []).filter(j => !j.goleiro || j.goleiroPaga).length }}</span>
              </div>
              <div class="rateio-detalhe rateio-cota-destaque">
                <span>Cota por Jogador:</span>
                <span>R$ {{ calcularValorPorJogadorB(modalEncerramento.reserva).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-botoes-acoes">
          <button class="btn-acao btn-acao--cancelar" @click="fecharModalEncerramento">Voltar</button>
          <button class="btn-acao btn-acao--salvar" @click="confirmarEncerramento">Concluir e Registrar</button>
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
  name: "ReservasDono",
  components: { TopbarDono },
  data() {
    return {
      reservas: [],
      loading: true,
      pollInterval: null,
      abaAtiva: "pendentes",
      buscaCRM: "",
      selectedClienteId: null,
      filtroFinanceiro: "todos",
      expandidoId: null,
      novoJogador: {},
      novoJogadorB: {},
      modalEncerramento: {
        aberto: false,
        reserva: null
      },
      abas: [
        { id: "pendentes", label: "Pendentes", badgeClass: "aba-badge--amber" },
        { id: "confirmadas", label: "Confirmadas", badgeClass: "aba-badge--verde" },
        { id: "encerradas", label: "Encerradas", badgeClass: "aba-badge--cinza" },
        { id: "crm", label: "CRM Clientes", badgeClass: "aba-badge--azul" },
      ],
      filtrosFinanceiros: [
        { id: "todos", label: "Todos" },
        { id: "pendentes", label: "Pend." },
        { id: "em_dia", label: "Em dia" },
      ],
    };
  },
  computed: {
    pendentes() {
      return this.reservas.filter(r => !r.confirmada && r.status !== "cancelada");
    },
    confirmadas() {
      return this.reservas.filter(r => r.confirmada && r.statusPagamento !== "pago");
    },
    encerradas() {
      return this.reservas.filter(r => r.statusPagamento === "pago");
    },
    listaAtiva() {
      return this.listaFiltrada(this.abaAtiva);
    },
    clientesList() {
      const mapa = {};
      for (const r of this.reservas) {
        const id = r.jogadorId;
        if (!mapa[id]) {
          mapa[id] = {
            id,
            nome: r.nome || "Jogador",
            telefone: r.telefone || "",
            totalJogos: 0,
            totalPago: 0,
            divida: 0,
            reservas: []
          };
        }
        mapa[id].totalJogos++;
        mapa[id].reservas.push(r);
        if (r.statusPagamento === "pago") mapa[id].totalPago += parseFloat(r.preco || 0);
        else mapa[id].divida += parseFloat(r.preco || 0);
      }
      return Object.values(mapa);
    },
    clientesFiltrados() {
      return this.clientesList.filter(c => {
        const matchBusca = c.nome.toLowerCase().includes(this.buscaCRM.toLowerCase());
        const matchFiltro = this.filtroFinanceiro === "todos"
          || (this.filtroFinanceiro === "pendentes" && c.divida > 0)
          || (this.filtroFinanceiro === "em_dia" && c.divida === 0);
        return matchBusca && matchFiltro;
      });
    },
  },
  async mounted() {
    await this.carregarReservas();
    this.pollInterval = setInterval(this.carregarReservas, 10000);
  },
  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
  methods: {
    formatarData(dataStr) {
      if (!dataStr) return "";
      return String(dataStr).slice(0, 10).replace(/-/g, "/");
    },
    listaFiltrada(id) {
      if (id === "pendentes") return this.pendentes;
      if (id === "confirmadas") return this.confirmadas;
      if (id === "encerradas") return this.encerradas;
      return [];
    },
    toggleExpandido(id) {
      this.expandidoId = this.expandidoId === id ? null : id;
    },
    async carregarReservas() {
      try {
        const data = await api.getReservas();
        this.reservas = (data || []).sort((a, b) => new Date(b.data) - new Date(a.data));
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
      } finally {
        this.loading = false;
      }
    },
    async confirmarReserva(r) {
      if (r.tipoJogo === "contra_time" && !r.nomeJogadorB) return;
      await api.confirmarReserva(r.id);
      r.confirmada = true;
      await this.carregarReservas();
    },
    async cancelarReserva(r) {
      if (!confirm("Cancelar esta reserva?")) return;
      await api.cancelarReserva(r.id);
      await this.carregarReservas();
    },
    abrirModalEncerramento(r) {
      this.modalEncerramento.reserva = r;
      this.modalEncerramento.aberto = true;
    },
    fecharModalEncerramento() {
      this.modalEncerramento.reserva = null;
      this.modalEncerramento.aberto = false;
    },
    async confirmarEncerramento() {
      const r = this.modalEncerramento.reserva;
      if (!r) return;
      try {
        await api.concluirReserva(r.id);
        r.statusPagamento = "pago";
        this.fecharModalEncerramento();
        await this.carregarReservas();
      } catch (err) {
        alert("Erro ao encerrar horário: " + err.message);
      }
    },
    calcularValorPorJogadorA(r) {
      const precoTotal = parseFloat(r.preco || 0);
      const isContra = r.tipoJogo === "contra_time";
      const precoTime = isContra ? precoTotal / 2 : precoTotal;
      const pagantes = (r.jogadoresLista || []).filter(j => !j.goleiro || j.goleiroPaga).length;
      if (pagantes <= 0) return precoTime;
      return precoTime / pagantes;
    },
    calcularValorPorJogadorB(r) {
      const precoTotal = parseFloat(r.preco || 0);
      const precoTime = precoTotal / 2;
      const pagantes = (r.jogadoresListaB || []).filter(j => !j.goleiro || j.goleiroPaga).length;
      if (pagantes <= 0) return precoTime;
      return precoTime / pagantes;
    },
    async togglePagamentoJogador(r, idx) {
      r.jogadoresLista.splice(idx, 1, {
        ...r.jogadoresLista[idx],
        pago: !r.jogadoresLista[idx].pago
      });
      try {
        await api.atualizarListaJogadores(r.id, r.jogadoresLista, r.jogadoresListaB || []);
      } catch (err) {
        console.error("Erro ao atualizar pagamento:", err);
      }
    },
    async togglePagamentoJogadorB(r, idx) {
      r.jogadoresListaB.splice(idx, 1, {
        ...r.jogadoresListaB[idx],
        pago: !r.jogadoresListaB[idx].pago
      });
      try {
        await api.atualizarListaJogadores(r.id, r.jogadoresLista || [], r.jogadoresListaB);
      } catch (err) {
        console.error("Erro ao atualizar pagamento:", err);
      }
    },
    adicionarJogador(r) {
      const nome = (this.novoJogador[r.id] || "").trim();
      if (!nome) return;
      if (!Array.isArray(r.jogadoresLista)) r.jogadoresLista = [];
      r.jogadoresLista.push({ nome, pago: false, goleiro: false, goleiroPaga: true });
      this.novoJogador = { ...this.novoJogador, [r.id]: "" };
    },
    removerJogador(r, idx) {
      r.jogadoresLista.splice(idx, 1);
    },
    adicionarJogadorB(r) {
      const nome = (this.novoJogadorB[r.id] || "").trim();
      if (!nome) return;
      if (!Array.isArray(r.jogadoresListaB)) r.jogadoresListaB = [];
      r.jogadoresListaB.push({ nome, pago: false, goleiro: false, goleiroPaga: true });
      this.novoJogadorB = { ...this.novoJogadorB, [r.id]: "" };
    },
    removerJogadorB(r, idx) {
      r.jogadoresListaB.splice(idx, 1);
    },
    async mudarParaHorarioCheio(r) {
      if (!confirm("Mudar para Horário Cheio? Isso remove o slot para adversário.")) return;
      try {
        await api.atualizarTipoJogo(r.id, "horario_cheio");
        r.tipoJogo = "horario_cheio";
        r.nomeJogadorB = null;
        r.nomeTimeB = null;
        r.jogadoresListaB = [];
      } catch (err) {
        console.error("Erro ao mudar tipo:", err);
      }
    },
    async salvarListaJogadores(r) {
      try {
        await api.atualizarListaJogadores(r.id, r.jogadoresLista || [], r.jogadoresListaB || []);
        this.expandidoId = null;
      } catch (err) {
        console.error("Erro ao salvar lista:", err);
        alert("Erro ao salvar: " + err.message);
      }
    },
    iniciais(nome) {
      if (!nome) return "?";
      return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
    },
    avatarColor(nome) {
      let hash = 0;
      for (let i = 0; i < (nome || "").length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
      const angle = Math.abs(hash) % 360;
      return `hsl(${angle}, 70%, 45%)`;
    },
    whatsappCRM(c) {
      const tel = (c.telefone || "").replace(/\D/g, "");
      const msg = c.divida > 0
        ? `Olá ${c.nome}, você tem R$ ${c.divida.toFixed(2)} pendentes conosco. Podemos acertar?`
        : `Olá ${c.nome}, obrigado por jogar conosco! 🎉`;
      return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
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

/* Cabeçalho */
.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.titulo {
  font-size: 20px;
  font-weight: 800;
  color: var(--foreground);
}

.subtitulo {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-top: 2px;
}

.badge-total {
  padding: 6px 12px;
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
  font-size: 12px;
  font-weight: 800;
  border-radius: 999px;
}

/* Abas */
.abas-wrapper {
  display: flex;
  gap: 4px;
  background: var(--muted);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.aba-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.aba-btn:hover {
  transform: none;
  box-shadow: none;
  color: #475569;
}

.aba-btn--ativo {
  background: white;
  color: var(--foreground);
  box-shadow: var(--shadow-xs);
}

.aba-badge {
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.aba-badge--inativo { background: #e2e8f0; color: #64748b; }
.aba-badge--amber { background: rgba(245, 158, 11, 0.12); color: #b45309; }
.aba-badge--verde { background: rgba(34, 197, 94, 0.12); color: var(--primary-dark); }
.aba-badge--cinza { background: #e2e8f0; color: #475569; }
.aba-badge--azul { background: rgba(59, 130, 246, 0.12); color: #1d4ed8; }

/* Loading */
.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid rgba(34, 197, 94, 0.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* Lista vazia */
.lista-vazia {
  text-align: center;
  padding: 48px 0;
  color: var(--muted-foreground);
  font-size: 14px;
}

/* Avatar */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

/* =============== CRM =============== */
.lista-crm {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crm-filtros {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.crm-busca-wrapper {
  position: relative;
  flex: 1;
}

.crm-busca-icone {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

.crm-busca-input {
  width: 100%;
  padding: 10px 16px 10px 36px;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s;
}

.crm-busca-input:focus {
  border-color: var(--primary);
  outline: none;
}

.crm-filtros-btns {
  display: flex;
  gap: 4px;
}

.filtro-btn {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  border: 1.5px solid var(--border);
  background: white;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.15s;
}

.filtro-btn:hover {
  transform: none;
  box-shadow: none;
}

.filtro-btn--ativo {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.cliente-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.cliente-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.cliente-header:hover {
  background: var(--muted);
  transform: none;
  box-shadow: none;
}

.cliente-info {
  flex: 1;
  min-width: 0;
}

.cliente-nome {
  font-weight: 800;
  color: var(--foreground);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cliente-stats {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-top: 2px;
}

.cliente-tel {
  font-size: 11px;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.cliente-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
}

.status-badge--pendente {
  background: rgba(245, 158, 11, 0.1);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-badge--em-dia {
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.divida-valor {
  font-size: 12px;
  font-weight: 800;
  color: var(--destructive);
}

.cliente-historico {
  border-top: 1px solid var(--border);
  padding: 16px;
}

.historico-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.historico-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.historico-item:last-child { border-bottom: none; }

.historico-data { font-weight: 700; color: #475569; }
.historico-quadra { color: var(--muted-foreground); font-size: 11px; }

.pagamento-badge {
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  flex-shrink: 0;
}

.pagamento-badge--pago { background: rgba(34, 197, 94, 0.1); color: var(--primary-dark); }
.pagamento-badge--pendente { background: rgba(245, 158, 11, 0.1); color: #b45309; }

.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background: #25d366;
  color: white;
  font-weight: 700;
  border-radius: 12px;
  font-size: 13px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-whatsapp:hover { opacity: 0.9; }

/* =============== Reservas =============== */
.lista-reservas {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reserva-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.reserva-cabecalho {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 12px;
}

.reserva-jogador {
  flex: 1;
  min-width: 0;
}

.jogador-nome {
  font-weight: 800;
  color: var(--foreground);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.jogador-tel {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
}

/* Badges agrupados */
.card-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.badge-contra-aguardando {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(249, 115, 22, 0.12);
  color: #c2410c;
  border: 1px solid rgba(249, 115, 22, 0.25);
  white-space: nowrap;
}

.badge-contra-fechado {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  border: 1px solid rgba(139, 92, 246, 0.2);
  white-space: nowrap;
}

.status-reserva {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.status-reserva--confirmada {
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary-dark);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-reserva--pendente {
  background: rgba(245, 158, 11, 0.1);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

/* VS info */
.contra-time-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 10px;
  font-size: 13px;
  font-weight: 700;
}

.time-nome { color: var(--foreground); }
.time-nome-a { color: var(--primary-dark); }
.time-nome-b { color: var(--accent); }

.vs-separador {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 6px;
  background: var(--muted);
  border-radius: 6px;
  color: var(--muted-foreground);
}

.time-aguardando {
  color: #c2410c;
  font-style: italic;
  font-size: 12px;
}

/* Detalhes */
.reserva-detalhes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 16px 12px;
}

.detalhe-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--muted);
  border-radius: 8px;
  padding: 8px;
}

.detalhe-icone { flex-shrink: 0; }
.detalhe-icone--azul { color: var(--accent); }
.detalhe-icone--amarelo { color: #f59e0b; }
.detalhe-icone--verde { color: var(--primary); }

.detalhe-valor {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Lista de jogadores */
.jogadores-section {
  padding: 0 16px 12px;
}

.times-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.times-duplo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.time-bloco {
  background: var(--muted);
  border-radius: 12px;
  padding: 10px 12px;
}

.time-bloco--b { border-left: 2px solid var(--accent); }

.time-titulo {
  font-size: 11px;
  font-weight: 800;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-cota-info {
  font-size: 10px;
  color: var(--accent);
  text-transform: none;
  font-weight: 700;
}

.jogadores-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.jogador-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.jogador-item-nome {
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.goleiro-tag {
  font-size: 11px;
}

.jogador-financeiro-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jogador-cota {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
}

.pago-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.pago-btn:hover { opacity: 0.8; transform: none; box-shadow: none; }

.pago-btn--pago { background: rgba(34, 197, 94, 0.15); color: var(--primary-dark); }
.pago-btn--pendente { background: rgba(245, 158, 11, 0.15); color: #b45309; }

.pago-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  flex-shrink: 0;
}

.pago-tag--pago { background: rgba(34, 197, 94, 0.12); color: var(--primary-dark); }
.pago-tag--pendente { background: rgba(245, 158, 11, 0.12); color: #b45309; }

.sem-jogadores {
  font-size: 12px;
  color: var(--muted-foreground);
  font-style: italic;
}

/* Edição (pendentes e confirmadas) */
.edicao-wrapper {
  padding: 0 16px 8px;
}

.btn-editar-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: var(--muted);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-editar-toggle:hover {
  background: white;
  color: var(--foreground);
  transform: none;
  box-shadow: none;
}

.edicao-painel {
  margin-top: 12px;
  background: var(--muted);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edicao-time {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edicao-time-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.edicao-linha {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 8px;
  padding: 8px 10px;
}

.edicao-nome {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
  min-width: 0;
}

.edicao-controles-jogador {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edicao-goleiro-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  cursor: pointer;
  white-space: nowrap;
}

.edicao-checkbox {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: var(--primary);
  padding: 0;
  border: none;
  border-radius: 3px;
  font-size: inherit;
  background: transparent;
}

.btn-remover {
  padding: 4px 8px;
  background: rgba(239, 68, 68, 0.1);
  color: var(--destructive);
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.btn-remover:hover {
  background: var(--destructive);
  color: white;
  transform: none;
  box-shadow: none;
}

.edicao-adicionar {
  display: flex;
  gap: 8px;
}

.input-novo-jogador {
  flex: 1;
  padding: 8px 12px;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
}

.input-novo-jogador:focus {
  border-color: var(--primary);
  outline: none;
}

.btn-adicionar {
  padding: 8px 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}

.btn-adicionar:hover {
  opacity: 0.9;
  transform: none;
  box-shadow: none;
}

.edicao-time-b {
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.btn-modo-cheio {
  padding: 10px 14px;
  background: rgba(249, 115, 22, 0.08);
  color: #c2410c;
  border: 1.5px solid rgba(249, 115, 22, 0.2);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}

.btn-modo-cheio:hover {
  background: rgba(249, 115, 22, 0.15);
  transform: none;
  box-shadow: none;
}

.btn-salvar-edicao {
  padding: 10px 14px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
}

.btn-salvar-edicao:hover {
  opacity: 0.9;
  transform: none;
  box-shadow: none;
}

/* Ações */
.reserva-acoes {
  border-top: 1px solid var(--border);
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.acao-btn {
  flex: 1;
  padding: 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: opacity 0.2s;
  text-decoration: none;
  white-space: nowrap;
}

.acao-btn:hover { opacity: 0.85; transform: none; box-shadow: none; }

.acao-btn--azul { background: var(--accent); color: white; }
.acao-btn--azul:disabled {
  background: var(--muted);
  color: var(--muted-foreground);
  cursor: not-allowed;
  opacity: 0.7;
}

.acao-btn--verde { background: var(--primary); color: white; }

.acao-btn--vermelho {
  background: rgba(239, 68, 68, 0.08);
  color: var(--destructive);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.acao-btn--whatsapp {
  flex: 0 0 auto;
  background: #25d366;
  color: white;
  padding: 8px 12px;
}

/* Modal Overlay & Card (Modais Customizados) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal-card {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-titulo {
  font-size: 16px;
  font-weight: 800;
  color: var(--foreground);
}

.btn-fechar {
  background: transparent;
  border: none;
  font-size: 24px;
  color: var(--muted-foreground);
  cursor: pointer;
  line-height: 1;
  padding: 4px;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: 70vh;
}

.resumo-titulo {
  font-size: 15px;
  font-weight: 800;
  color: var(--foreground);
}

.resumo-data {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 4px;
  font-weight: 500;
}

.divisor-linha {
  height: 1px;
  background: var(--border);
  margin: 16px 0;
}

.rateio-secao {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rateio-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--foreground);
}

.rateio-row-label {
  color: var(--muted-foreground);
}

.rateio-valor-destaque {
  font-size: 18px;
  color: var(--primary-dark);
  font-weight: 800;
}

.rateio-bloco {
  background: var(--muted);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--border);
}

.rateio-bloco-titulo {
  font-size: 12px;
  font-weight: 800;
  color: var(--foreground);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.rateio-detalhe {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.rateio-cota-destaque {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
  font-weight: 700;
  color: var(--foreground);
  font-size: 13px;
}

.modal-botoes-acoes {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
}

.btn-acao {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.15s;
}

.btn-acao:hover { opacity: 0.9; }

.btn-acao--cancelar {
  background: var(--muted);
  color: var(--muted-foreground);
  border: 1px solid var(--border);
}

.btn-acao--salvar {
  background: var(--primary);
  color: white;
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
  .bottom-nav { display: none; }
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

.nav-item:hover { color: #475569; }
.nav-item--ativo { color: var(--primary); }
</style>
