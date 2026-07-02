# Gerenciar Horários da Quadra (`EditarDataHorario.vue`)

## 📝 Descrição Geral
Página de administração de agenda para o proprietário da quadra. Apresenta um calendário interativo para o mês corrente, permitindo selecionar dias válidos de funcionamento e abrir um painel popup para bloquear ou liberar horários específicos (marcação manual de ocupado/indisponível).

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Cabeçalho de Navegação:** Botão "Voltar" (para `/confirmar-quadra`) e título "Gerenciar Horários".
- **Calendário Mensal:**
  - Controles de mês anterior (`<`) e seguinte (`>`).
  - Cabeçalho dos dias da semana (Dom a Sáb).
  - Grade de dias do mês. Dias anteriores à data de hoje ou fora do intervalo de funcionamento da quadra aparecem apagados/inativos e não são clicáveis. O dia selecionado é destacado em azul.
- **Popup/Modal de Horários (Bloqueios):** Abre ao selecionar um dia válido. Contém:
  - Título com a data selecionada em formato brasileiro (DD/MM/AAAA).
  - Lista rolável vertical contendo botões de horário (ex: das 08:00 às 22:00).
  - Botão de status do horário: slots bloqueados aparecem em vermelho com a etiqueta "Bloqueado"; slots livres aparecem em branco com a etiqueta "Livre".
  - Botão de fechamento ("Concluir" ou ícone `X`).
- **Barra de Navegação Inferior (Mobile):** Abas padrão com ícones para Quadras, Reservas, Dashboard e Perfil.

## ⚙️ Estado Local (`data`)
- `quadraId`: ID da quadra ativa recuperada do `localStorage`.
- `quadra`: Objeto contendo os dados da quadra obtidos do banco.
- `mesAtual`: Número inteiro do mês sendo exibido no calendário (0 a 11).
- `anoAtual`: Número inteiro do ano exibido no calendário.
- `diasSemanaLabel`: Cabeçalhos dos dias da semana (`["Dom", "Seg", ...]`).
- `dataSelecionada`: String da data selecionada em formato ISO (`AAAA-MM-DD`).
- `diasFuncionamento`: Array de números representando os dias em que a quadra abre (`0` para Domingo, `1` para Segunda, etc.). Padrão inicial: `[0,1,2,3,4,5,6]`.
- `horaAbertura`: Inteiro correspondente à hora de início de expediente (padrão `0`).
- `horaFechamento`: Inteiro correspondente à hora final de expediente (padrão `23`).
- `horariosOcupadosApi`: Lista de horários bloqueados vindos do banco de dados para a data selecionada.
- `mostrarPopup`: Boolean de controle de abertura do modal de horários.
- `horariosDoDia`: Array de objetos representando as faixas de horário do dia selecionado e seu status (`id`, `horario`, `ocupado`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `parseHorarioFuncionamento(horarioStr)`: Analisa a string de horário configurada na quadra (ex: `"Segunda até Sexta, 08:00 às 22:00"`), mapeando quais dias da semana pertencem ao intervalo aberto (`diasFuncionamento`) e extraindo os limites numéricos de abertura e fechamento para a geração dos blocos horários.
- `mudarMes(delta)`: Incrementa ou decrementa o valor de `mesAtual` por `-1` ou `1`, rotacionando o ano caso ultrapasse os limites.
- `selecionarDia(dia)`: Acionado ao clicar em um dia ativo no calendário. Atualiza `dataSelecionada`, carrega os horários e abre o popup.
- `carregarHorariosDoDia()`: Método assíncrono. Consome a API `api.getHorariosOcupados` filtrando pela quadra e data. Popula o array `horariosDoDia` com loops de hora em hora entre os limites de abertura e fechamento, marcando `ocupado: true` se o horário estiver bloqueado e vinculando o ID do bloqueio correspondente.
- `toggleHorario(hora)`: Bloqueia ou desbloqueia um slot. Se já estiver ocupado, solicita confirmação ao proprietário e chama `api.desmarcarHorarioOcupado`. Se estiver livre, envia a requisição `api.marcarHorarioOcupado` para indisponibilizá-lo.
- `formatarDataBR(dataIso)`: Converte strings de data do formato `AAAA-MM-DD` para `DD/MM/AAAA`.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getQuadra(quadraId)`: Busca o horário de funcionamento cadastrado da quadra.
  - `api.getHorariosOcupados(quadraId, data)`: Lista os bloqueios do dia especificado.
  - `api.marcarHorarioOcupado(quadraId, data, horario)`: Bloqueia um horário específico na agenda.
  - `api.desmarcarHorarioOcupado(quadraId, bloqueioId)`: Exclui o bloqueio de agenda pelo seu ID.
- **Redirecionamento / Rotas:**
  - `/confirmar-quadra` (Voltar ou Aba Menu)
  - `/reservas` (Aba Reservas)
  - `/faturamento-dono` (Aba Dashboard)
  - `/perfil` (Aba Perfil)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
