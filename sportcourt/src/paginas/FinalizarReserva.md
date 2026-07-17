# Finalizar Reserva (`FinalizarReserva.vue`)

## 📝 Descrição Geral
Página crucial para a conclusão de reservas de quadras pelo atleta (jogador). Guia o usuário na escolha de uma data disponível por meio de calendário, exibição de horários livres, inserção de dados do capitão da partida, seleção do formato de jogo ("Horário Cheio" ou "Contra Outro Time"), montagem da lista de jogadores com controle de goleiro e finalização do agendamento (criando uma nova reserva ou entrando como desafiante em um jogo existente).

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarJogador` no topo.
- **Cabeçalho:** Botão "Voltar" (para `/reserva`) e título "Finalizar Reserva".
- **Cartão de Resumo da Quadra:** Exibe a foto da quadra, endereço, cidade e preço por hora.
- **Painel do Calendário:** Calendário dinâmico para seleção do dia da reserva. Destaca o dia selecionado em verde e bloqueia dias passados ou fora do expediente da arena.
- **Resumo da Reserva (Visível após escolha de dia/hora):**
  - Informações de data e hora escolhidas em blocos destacados.
  - Campos de entrada: Nome Completo do Jogador e Telefone de contato.
- **Tipo de Jogo (Seletor de Botões):**
  - *Horário Cheio:* Jogo fechado (capitão reserva todo o espaço).
  - *Contra Outro Time:* Jogo aberto (campo extra de "Nome do Time" aparece para aguardar desafiante).
- **Quem vai jogar (Seletor de Quantidade):**
  - Input numérico para quantidade de pessoas e botão "Montar/Editar Lista".
  - Exibição de chips/badges cinzas com o nome dos participantes e etiquetas especiais (ex: `Goleiro - não paga` em verde).
- **Popup de Seleção de Horários:**
  - Grade com horários divididos por cores:
    - *Branco:* Livre para reserva.
    - *Cinza (riscado):* Já ocupado ou horário do dia atual que já passou.
    - *Laranja (com ícone ⚔️):* Slot em modo "Contra Outro Time" buscando adversário.
- **Mini-Modal de Desafio (⚔️):** Confirmador visual ao clicar em um slot laranja ("Adversário encontrado!").
- **Popup de Lista de Jogadores:**
  - Inputs textuais para o nome de cada jogador.
  - Opções adicionais de futebol (goleiro? paga quadra?) se o esporte selecionado for Futebol, Futsal ou Society.
- **Barra de Navegação Inferior (Mobile):** Abas padrão do jogador (Reservas, Buscar, Perfil).

## ⚙️ Estado Local (`data`)
- `quadra`: Dados da quadra recuperados do backend.
- `quadraId`: Identificador da quadra em processamento.
- `mesAtual`/`anoAtual`: Controle de data do calendário exibido.
- `diasSemanaLabel`: Cabeçalhos dos dias da semana (`["Dom", "Seg", ...]`).
- `dataSelecionada`: String da data escolhida (`AAAA-MM-DD`).
- `diasFuncionamento`: Array de dias ativos na semana (0 para Domingo, 6 para Sábado).
- `horaAbertura`/`horaFechamento`: Limites da agenda baseados nas regras da quadra.
- `horariosOcupadosLista`: Lista mesclada de horários bloqueados pelo dono e reservas já confirmadas.
- `datasBloqueadas`: Array contendo dias indisponíveis por completo.
- `isDiaBloqueado`: Boolean indicando se a data sob consulta está totalmente bloqueada.
- `mostrarPopup`: Boolean de controle do modal de horários.
- `horariosDoDia`: Array de faixas de horário do dia selecionado com metadados de ocupação e desafiante.
- `horarioSelecionado`: String da hora escolhida.
- `tipoJogo`: Tipo de partida (`"horario_cheio"` ou `"contra_time"`).
- `nomeTime`: Nome do time solicitante (apenas para modo contra_time).
- `jogadoresNomes`: Array de objetos dos participantes (`{ nome, goleiro, goleiroPaga }`).
- `quantidadeJogadores`: Número inteiro de jogadores previstos.
- `mostrarPopupJogadores`: Boolean de controle do popup de nomes.
- `nomesSlotsTemp`: Array temporário de inputs do modal de jogadores.
- `listaSemNomes`: Boolean para alertar erros na validação da lista de jogadores.
- `slotAguardando`: Metadados do slot com adversário (`{ reservaId, nomeTime }`).
- `mostrarModalEntrar`: Boolean de confirmação para entrar contra time.
- `jogador`: Dados do capitão logado (`{ id, nome, telefone }`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `parseHorarioFuncionamento(horarioStr)`: Faz o parse das configurações de dias e horas de abertura/fechamento obtidas da string `horario` da quadra.
- `carregarOcupacoes()`: Carrega dados unificados de ocupações e reservas da quadra via `api.getQuadraOcupacoes`.
- `selecionarDia(dia)`: Define o dia no calendário e reseta a seleção de hora caso tenha mudado. Dispara `montarHorariosDoDia()`.
- `montarHorariosDoDia()`: Varre os horários de expediente. Desabilita horários retroativos se a consulta for para o dia de hoje. Consulta desafiantes do dia usando `api.getContraTimeAguardandoDia` para pintar os botões em laranja.
- `formatarDataBR(dataIso)`: Converte strings de data do formato `AAAA-MM-DD` para `YYYY/MM/DD`.
- `abrirPopupJogadores()`: Abre a listagem de jogadores populando os nomes com registros anteriores ou em branco até a quantidade informada.
- `confirmarListaJogadores()`: Salva e formata os inputs do popup no array definitivo de jogadores.
- `selecionarSlotAguardando(hora)`: Ativa modo de desafio contra adversário, carregando o modal visual.
- `finalizarReserva()`: Método principal. Valida regras de negócio do formulário e chama a API:
  - Se for um desafio (slot laranja): chama `api.entrarContraTime(reservaId, dados)`.
  - Se for nova reserva: chama `api.createReserva(dados)`.
  - Finalizado com sucesso, salva o contato localmente e redireciona para `/menu-jogador`.

## 👁️ Propriedades Computadas (`computed`)
- `mesAtualNome`: Nome do mês do calendário em exibição.
- `diasMes`: Matriz do mês com preenchimento e status de dias válidos.
- `mostrarOpcaoGoleiro`: Boolean que exibe a opção de goleiro caso o esporte pertença às modalidades de futebol.
- `slotsPreenchidosCount`: Quantidade de jogadores que possuem nome digitado no formulário.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getQuadra(quadraId)`: Busca a ficha cadastral do local.
  - `api.getQuadraOcupacoes(quadraId)`: Obtém bloqueios e reservas ocupadas.
  - `api.getContraTimeAguardandoDia(quadraId, data)`: Lista desafios abertos.
  - `api.entrarContraTime(reservaId, payload)`: Inscreve o desafiante em um jogo.
  - `api.createReserva(payload)`: Cadastra nova reserva na base de dados.
- **Redirecionamento / Rotas:**
  - `/reserva` (Voltar / Barra inferior)
  - `/menu-jogador` (Após sucesso / Barra inferior)
  - `/conta-jogador` (Barra inferior)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
| 16/07/2026 | Antigravity | Remoção de classes Tailwind e reescrita do visual em CSS puro escopado. |
| 16/07/2026 | Antigravity | Atualização do formato da data exibida para `YYYY/MM/DD`. |
