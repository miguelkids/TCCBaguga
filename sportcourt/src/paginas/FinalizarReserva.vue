<template>
  <div class="flex flex-col min-h-screen bg-slate-50">

    <TopbarJogador />

    <div class="w-full max-w-5xl mx-auto px-4 pb-28 pt-6 md:pb-10">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <button
          class="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          @click="$router.push('/reserva')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="text-xl font-extrabold text-slate-800 m-0">Finalizar Reserva</h1>
      </div>

      <!-- Layout desktop: 2 colunas -->
      <div class="flex flex-col md:flex-row md:gap-8 md:items-start">
        <!-- Coluna Esquerda: Card da quadra + Calendário -->
        <div class="flex-1 min-w-0">
      <!-- Card da quadra -->
      <div v-if="quadra && quadra.nomeQuadra" class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-5">
        <div class="w-full h-40 overflow-hidden bg-slate-100">
          <img v-if="quadra.fotoUrl" :src="quadra.fotoUrl.startsWith('http') ? quadra.fotoUrl : `http://localhost:3006${quadra.fotoUrl}`" :alt="quadra.nomeQuadra" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center bg-slate-100">
            <div class="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
          </div>
        </div>
        <div class="p-4">
          <h2 class="text-lg font-bold text-slate-800 m-0 mb-1">{{ quadra.nomeQuadra }}</h2>
          <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ quadra.endereco }}<span v-if="quadra.cidade"> — {{ quadra.cidade }}</span>
          </div>
          <div class="text-base font-bold text-emerald-600">R$ {{ quadra.preco }} / hora</div>
        </div>
      </div>

      <p v-else-if="!quadra || !quadra.nomeQuadra" class="text-center text-slate-500 py-5">Carregando informações da quadra...</p>

      <!-- Calendário -->
      <div v-if="quadra && quadra.nomeQuadra" class="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 p-5 flex flex-col gap-4">
        <h3 class="text-base font-bold text-slate-800 m-0">Escolha um dia</h3>
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <div class="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button @click="mudarMes(-1)" class="bg-transparent border-none text-lg cursor-pointer text-slate-700 w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-200 transition-colors">&lt;</button>
            <div class="font-bold text-sm capitalize text-slate-800">{{ mesAtualNome }} {{ anoAtual }}</div>
            <button @click="mudarMes(1)" class="bg-transparent border-none text-lg cursor-pointer text-slate-700 w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-200 transition-colors">&gt;</button>
          </div>
          <div class="grid grid-cols-7 text-center py-2.5 bg-white text-xs font-semibold text-slate-400 border-b border-slate-100">
            <div v-for="d in diasSemanaLabel" :key="d">{{ d }}</div>
          </div>
          <div class="grid grid-cols-7 bg-white p-2 gap-1">
            <div
              v-for="dia in diasMes"
              :key="dia.id"
              class="aspect-square flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all"
              :class="{
                'text-slate-300 cursor-default': dia.data && !dia.valido,
                'bg-emerald-500 text-white font-bold shadow-sm': dia.data && dia.data === dataSelecionada,
                'hover:bg-slate-100 hover:text-emerald-600': dia.data && dia.valido && dia.data !== dataSelecionada,
              }"
              @click="selecionarDia(dia)"
            >
              <span v-if="dia.data">{{ dia.numero }}</span>
            </div>
          </div>
        </div>
        </div><!-- /calendário -->

        </div><!-- /Coluna Esquerda -->
        <!-- Coluna Direita: Resumo e Confirmação -->
        <div class="w-full md:w-[420px] md:flex-shrink-0">
      <!-- Resumo e Confirmação -->
      <div v-if="dataSelecionada && horarioSelecionado" class="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 p-5 flex flex-col gap-4">
        <h3 class="text-base font-bold text-slate-800 m-0">Resumo da Reserva</h3>
        <div class="flex gap-3">
          <div class="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm font-semibold text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{{ formatarDataBR(dataSelecionada) }}</span>
          </div>
          <div class="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm font-semibold text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{{ horarioSelecionado }}</span>
          </div>
        </div>

        <div class="mt-1">
          <h3 class="text-base font-bold text-slate-800 mb-3">Seus dados</h3>
          <div class="flex flex-col gap-1 mb-3">
            <label class="text-xs font-semibold text-slate-700">Nome</label>
            <input v-model="jogador.nome" placeholder="Seu nome completo" class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
          </div>
          <div class="flex flex-col gap-1 mb-3">
            <label class="text-xs font-semibold text-slate-700">Telefone</label>
            <input v-model="jogador.telefone" placeholder="(11) 99999-9999" class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
          </div>
        </div>

        <!-- Tipo de Jogo -->
        <div>
          <h3 class="text-base font-bold text-slate-800 mb-2.5">Tipo de jogo</h3>
          <div class="flex gap-2 flex-wrap">
            <button
              type="button"
              class="flex-1 min-w-36 flex items-center justify-center gap-2 px-3.5 py-3 border-2 rounded-xl text-sm font-semibold cursor-pointer transition-all"
              :class="tipoJogo === 'horario_cheio' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-400'"
              @click.prevent="tipoJogo = 'horario_cheio'; slotAguardando = null"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Horário Cheio
            </button>
            <button
              type="button"
              class="flex-1 min-w-36 flex items-center justify-center gap-2 px-3.5 py-3 border-2 rounded-xl text-sm font-semibold cursor-pointer transition-all"
              :class="tipoJogo === 'contra_time' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-400'"
              @click.prevent="tipoJogo = 'contra_time'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Contra Outro Time
            </button>
          </div>

          <div v-if="tipoJogo === 'contra_time'" class="flex flex-col gap-1 mt-3">
            <label class="text-xs font-semibold text-slate-700">Nome do Time <span class="text-red-500 text-xs font-semibold ml-1">*</span></label>
            <input v-model="nomeTime" placeholder="Ex: Raios do Sul" class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
          </div>
        </div>

        <!-- Quem vai jogar -->
        <div :class="listaSemNomes ? 'p-3 bg-red-50 border-2 border-red-200 rounded-xl' : ''">
          <h3 class="text-base font-bold text-slate-800 mb-1">
            Quem vai jogar?
            <span v-if="jogadoresNomes.length" class="inline-flex items-center justify-center bg-emerald-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 ml-1.5">{{ jogadoresNomes.length }}</span>
            <span v-else class="text-red-500 text-xs font-semibold ml-1.5">* obrigatório</span>
          </h3>
          <p class="text-xs text-slate-500 mb-2.5">Informe quantas pessoas vão participar e os nomes de cada uma.</p>
          <div class="flex gap-2 items-stretch">
            <input type="number" v-model.number="quantidadeJogadores" min="1" max="50" class="w-28 flex-shrink-0 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Nº de pessoas" />
            <button type="button" class="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 transition-opacity disabled:opacity-40 hover:opacity-85" :disabled="!quantidadeJogadores || quantidadeJogadores < 1" @click.prevent="abrirPopupJogadores">
              {{ jogadoresNomes.length ? 'Editar lista' : 'Montar lista' }}
            </button>
          </div>
          <div v-if="jogadoresNomes.length" class="flex flex-wrap gap-1.5 mt-2.5">
            <span v-for="(jog, i) in jogadoresNomes" :key="i"
              class="inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700"
              :class="jog.goleiro ? 'bg-emerald-50 border-emerald-200' : ''"
            >
              {{ jog.nome }}
              <span v-if="jog.goleiro" class="text-[10px] opacity-80 ml-1 font-semibold text-emerald-600">
                (Goleiro{{ jog.goleiroPaga ? '' : ' - não paga' }})
              </span>
            </span>
          </div>
          <p v-if="listaSemNomes" class="flex items-center gap-1.5 text-xs text-red-600 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Informe a quantidade de jogadores e monte a lista de nomes antes de confirmar.
          </p>
        </div>

        <button
          type="button"
          class="flex items-center justify-center gap-2.5 w-full py-4 mt-2 bg-emerald-500 text-white border-none rounded-2xl text-base font-bold cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg"
          @click.prevent="finalizarReserva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Confirmar Reserva
        </button>
      </div><!-- /card resumo -->

        </div><!-- /Coluna Direita -->
      </div><!-- /Layout desktop -->

    </div><!-- /container principal -->

    <!-- Popup Horários -->
    <div v-if="mostrarPopup" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="mostrarPopup = false">
      <div class="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl" style="animation: slideUp 0.2s ease-out">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-extrabold text-slate-800 m-0">Horários: {{ formatarDataBR(dataSelecionada) }}</h3>
          <button class="bg-transparent border-none flex items-center justify-center cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors w-7 h-7 p-0 rounded-md" @click="mostrarPopup = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div v-if="isDiaBloqueado" class="flex items-center gap-2 px-3.5 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Este dia foi bloqueado pelo proprietário.
        </div>

        <div v-else>
          <p class="text-xs text-slate-500 mb-3">Selecione um horário disponível</p>
          <div class="grid grid-cols-3 gap-2.5 mb-5 max-h-72 overflow-y-auto pr-1">
            <template v-for="hora in horariosDoDia" :key="hora.horario">
              <!-- Slot aguardando adversário -->
              <button
                v-if="hora.aguardandoContraTime"
                class="flex flex-col items-center justify-center gap-0.5 py-2 border-2 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                :class="horarioSelecionado === hora.horario ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100'"
                @click="selecionarSlotAguardando(hora)"
                :title="`${hora.nomeTimeAguardando} busca adversário`"
              >
                <span class="text-sm">⚔️</span>
                <span class="text-xs font-bold">{{ hora.horario }}</span>
                <span class="text-[9px] max-w-[72px] whitespace-nowrap overflow-hidden text-ellipsis opacity-85">{{ hora.nomeTimeAguardando }}</span>
                <span class="text-[8px] opacity-70 italic">Esperando adversário</span>
              </button>
              <!-- Slot normal -->
              <button
                v-else
                class="py-2.5 border rounded-xl text-sm font-semibold cursor-pointer transition-all"
                :class="{
                  'bg-slate-100 text-slate-400 line-through cursor-not-allowed opacity-60': hora.ocupado,
                  'bg-emerald-500 text-white border-emerald-500': horarioSelecionado === hora.horario,
                  'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-600': !hora.ocupado && horarioSelecionado !== hora.horario
                }"
                :disabled="hora.ocupado"
                @click="horarioSelecionado = hora.horario; slotAguardando = null"
              >
                {{ hora.horario }}
              </button>
            </template>
          </div>
          <p v-if="horariosDoDia.length === 0" class="text-xs text-red-500 col-span-3 text-center py-2.5">Nenhum horário de funcionamento configurado.</p>
        </div>

        <button
          v-if="!isDiaBloqueado"
          class="w-full py-3.5 bg-emerald-500 text-white border-none rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!horarioSelecionado"
          @click="mostrarPopup = false"
        >
          Confirmar {{ horarioSelecionado }}
        </button>
      </div>
    </div>

    <!-- Mini-Modal: Entrar como adversário -->
    <div v-if="mostrarModalEntrar" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="cancelarEntrarContraTime">
      <div class="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl text-center">
        <div class="text-4xl mb-2.5">⚔️</div>
        <h3 class="text-lg font-extrabold text-slate-800 mb-1.5">Adversário encontrado!</h3>
        <p class="text-xs text-slate-500 mb-4">
          O time <strong>{{ slotAguardando && slotAguardando.nomeTime }}</strong> está esperando um adversário
          para <strong>{{ horarioSelecionado }}</strong>.
          Deseja entrar nessa partida com o seu time?
        </p>
        <div class="flex flex-col gap-2 mt-4">
          <button class="w-full py-3.5 bg-emerald-500 text-white border-none rounded-xl text-sm font-bold cursor-pointer" @click="confirmarEntrarContraTime">⚔️ Entrar na Partida</button>
          <button class="w-full py-3 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold cursor-pointer hover:bg-slate-200 transition-colors" @click="cancelarEntrarContraTime">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Popup Lista de Jogadores -->
    <div v-if="mostrarPopupJogadores" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="mostrarPopupJogadores = false">
      <div class="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-extrabold text-slate-800 m-0">Lista de Jogadores</h3>
          <button class="bg-transparent border-none flex items-center justify-center cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors w-7 h-7 p-0 rounded-md" @click="mostrarPopupJogadores = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p class="text-xs text-slate-500 mb-3">Preencha os nomes. Pode adicionar mais se precisar.</p>
        <div class="flex flex-col gap-3 max-h-72 overflow-y-auto mb-3 pr-0.5">
          <div v-for="(item, i) in nomesSlotsTemp" :key="i" class="flex flex-col gap-1.5 py-2 border-b border-slate-100 last:border-none">
            <div class="flex items-center gap-2">
              <span class="min-w-[22px] text-xs font-bold text-slate-400 text-center">{{ i + 1 }}</span>
              <input v-model="item.nome" :placeholder="`Jogador ${i + 1}`" class="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div v-if="mostrarOpcaoGoleiro" class="flex gap-3.5 ml-7 text-xs text-slate-500 items-center">
              <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" v-model="item.goleiro" class="cursor-pointer m-0" /> Goleiro?
              </label>
              <label v-if="item.goleiro" class="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" v-model="item.goleiroPaga" class="cursor-pointer m-0" /> Paga a quadra?
              </label>
            </div>
          </div>
        </div>
        <button class="flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-100 text-slate-700 border border-dashed border-slate-300 rounded-xl text-sm font-semibold cursor-pointer mb-2.5 hover:bg-slate-200 transition-colors" @click="adicionarSlotExtra">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar mais um
        </button>
        <button class="w-full py-3.5 bg-emerald-500 text-white border-none rounded-xl text-sm font-bold cursor-pointer mt-2.5" @click="confirmarListaJogadores">
          Confirmar lista ({{ slotsPreenchidosCount }})
        </button>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50 md:hidden">
      <router-link to="/menu-jogador" class="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-400 no-underline px-2 py-1 rounded-xl transition-colors hover:text-emerald-500 [&.router-link-active]:text-emerald-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/reserva" class="flex flex-col items-center gap-0.5 text-[11px] font-medium text-emerald-500 no-underline px-2 py-1 rounded-xl transition-colors [&.router-link-active]:text-emerald-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Buscar</span>
      </router-link>
      <router-link to="/conta-jogador" class="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-400 no-underline px-2 py-1 rounded-xl transition-colors hover:text-emerald-500 [&.router-link-active]:text-emerald-500">
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
      const partes = dataIso.split("-");
      if (partes.length !== 3) return dataIso;
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
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
        const el = document.querySelector('.bg-red-50.border-red-200');
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

<style>
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
