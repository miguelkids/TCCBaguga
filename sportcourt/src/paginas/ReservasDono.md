# CRM de Reservas (Dono) (`ReservasDono.vue`)

## 📝 Descrição Geral
Página de central operacional e inteligência de negócios para o proprietário. Atua tanto como um painel CRM de reservas (organizado em abas de status de agendamento) quanto como uma ferramenta de controle de adimplência de clientes. Permite validar pagamentos individuais por participante, gerenciar times em confrontos abertos, e analisar o histórico financeiro consolidado de cada cliente.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Cabeçalho:** Título "CRM de Reservas" e badge com o total de agendamentos.
- **Seletor de Abas de Status:**
  - *Pendentes:* Exibe solicitações aguardando aprovação (badge laranja com contagem).
  - *Confirmadas:* Exibe jogos agendados que ainda não foram concluídos/pagos (badge verde com contagem).
  - *Encerradas:* Exibe jogos já finalizados e faturados (badge cinza com contagem).
  - *CRM Clientes:* Painel de gestão de relacionamento com o cliente.
- **Grade de Cards de Reservas (Abas Pendentes/Confirmadas/Encerradas):**
  - Apresenta cabeçalho do cliente (iniciais em círculo colorido, nome, telefone e status da partida).
  - Caixa de resumo com ícones (data, horário, valor, modalidade e quadra).
  - Painel de Ações Rápidas inline: "Confirmar" (azul), "Encerrar Horário" (verde), "Cancelar" (vermelho) e "WhatsApp" (verde oficial).
  - *Painel de Divisão de Custos (Organizadores e Jogadores):* Seção expansível cinza exibindo:
    - Valor rateado por pessoa (calculado automaticamente com base nos pagantes).
    - Chips com o contato dos organizadores (Time A e Time B).
    - *Modo Contra Time:* Exibe duas colunas paralelas (Time A e Time B) listando os jogadores convocados de cada lado, botões de faturamento individual ("Pago"/"Pendente") e formulário rápido para adicionar novos nomes.
    - *Modo Normal:* Exibe lista única de jogadores com controle de pagamento individual, indicador de goleiro isento de taxa e campo para adição.
- **Aba CRM Clientes (Painel Financeiro):**
  - Barra de busca textual e botões de filtro rápido (Todos, Pendentes, Em dia).
  - Lista de clientes em formato Accordion:
    - *Header do Item:* Avatar, nome, telefone, estatísticas consolidadas (Total de jogos, Total pago em R$, Dívida pendente em R$, Percentual de adimplência) e badge de status financeiro ("Pendente" em amarelo ou "Em dia" em verde). Possui botão verde para WhatsApp com mensagens de cobrança automáticas.
    - *Painel Expandido:* Tabela contendo a lista histórica de reservas daquele cliente detalhando data/hora, quadra, preço, status de aprovação e botão de pagamento.

## ⚙️ Estado Local (`data`)
- `reservas`: Array completo contendo os agendamentos registrados no estabelecimento.
- `loading`: Boolean para controle visual do spinner de carregamento.
- `pollInterval`: Referência ao temporizador de pooling para atualizar a página a cada 10 segundos.
- `abaAtiva`: Aba operacional ativa (`"pendentes"`, `"confirmadas"`, `"encerradas"` ou `"crm"`).
- `novoJogadorTemp`/`novoJogadorBTemp`: Campos textuais temporários para os inputs de adição de jogadores.
- `buscaCRM`: Termo de busca de clientes no CRM.
- `selectedClienteId`: ID do cliente atualmente expandido no acordeão do CRM.
- `filtroFinanceiro`: Filtro de adimplência na aba CRM (`"todos"`, `"pendentes"`, `"em_dia"`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarReservas()`: Busca todas as reservas da API (`api.getReservas()`), ordena-as de forma decrescente por data e normaliza as listas de participantes de cada time. É executado via pooling automático a cada 10 segundos.
- `normalizarJogadores(lista)`: Corrige inconsistências de estruturas no banco (dados corrompidos ou salvos como strings JSON), convertendo itens para o padrão `{ nome, pago, goleiro, goleiroPaga }`.
- `confirmarReserva(r)`: Submete a aprovação do horário para `api.confirmarReserva` e cria o bloqueio de agenda correspondente.
- `cancelarReserva(r)`: Cancela a reserva via `api.cancelarReserva` após consentimento do proprietário.
- `concluirHorario(r)`: Encerra o jogo e marca a reserva e todos os jogadores cadastrados como faturados (`pago`).
- `togglePagamentoReservaCRM(r)`: Atualiza o pagamento global de uma reserva na aba CRM.
- `chamarWhatsAppCRM(c)`: Dispara chat de WhatsApp com modelo de cobrança se o cliente estiver devendo, ou de agradecimento se estiver em dia.
- `custoporPessoa(r)` / `custoJogadorTimeA(r)` / `custoJogadorTimeB(r)`: Calculadoras de rateio do preço da hora da quadra dividido entre os pagantes de cada equipe (goleiros isentos não entram no cálculo).
- `togglePagamentoJogador(r, idx)` / `togglePagamentoJogadorB(r, idx)`: Alterna o pagamento de um atleta. Atualiza a lista via `api.atualizarListaJogadores` e, caso todos os pagantes tenham quitado suas cotas, altera automaticamente a reserva para o status global de `"pago"`.
- `adicionarJogador(r)` / `adicionarJogadorB(r)` / `removerJogador(r, idx)` / `removerJogadorB(r, idx)`: Funções de manipulação das listas de convocados das partidas que atualizam a API em tempo real.

## 👁️ Propriedades Computadas (`computed`)
- `pendentes`/`confirmadas`/`encerradas`: Arrays filtrados de reservas por status.
- `listaAtiva`: Retorna o array correspondente à aba de reservas selecionada.
- `clientesList`: Consolida o CRM de Clientes. Mapeia a lista global de reservas, agrupando os registros por usuário (`jogadorId`), somando suas transações pagas e pendentes e calculando a taxa de adimplência.
- `clientesFiltrados`: Filtra a listagem do CRM de acordo com os filtros financeiros e textuais ativos.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getReservas()`: Retorna agendamentos vinculados ao proprietário.
  - `api.confirmarReserva(reservaId)`: Aprova reserva pendente.
  - `api.cancelarReserva(reservaId)`: Deleta/cancela reserva.
  - `api.concluirReserva(reservaId)`: Finaliza reserva e faturamento.
  - `api.atualizarStatusPagamento(reservaId, status)`: Seta pagamento global.
  - `api.atualizarListaJogadores(reservaId, listaA, listaB)`: Atualiza participantes de cada time.
- **Redirecionamento / Rotas:**
  - Barra inferior mobile: `/minhas-quadras`, `/reservas`, `/faturamento-dono`, `/perfil`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
