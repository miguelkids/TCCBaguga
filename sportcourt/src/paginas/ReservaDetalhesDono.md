# Detalhes da Reserva (Dono) (`ReservaDetalhesDono.vue`)

## 📝 Descrição Geral
Página de visualização e controle operacional de uma reserva sob o ponto de vista do proprietário (dono). Permite gerenciar o fluxo de aprovação de partidas, alterar status de pagamento das locações, finalizar jogos manualmente, verificar desafiantes e abrir contato direto com o cliente via WhatsApp.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Cabeçalho:** Botão "Voltar" (para `/reservas`) e título "Detalhes da Reserva".
- **Cartão do Cliente Principal (Time A):**
  - Bloco contendo um avatar colorido com as iniciais do capitão (cor gerada aleatoriamente a partir do nome).
  - Nome do cliente e do seu time.
  - Grupo de badges indicativas: Status de Confirmação (Verde "Confirmada" vs Laranja "Pendente"), Status de Faturamento (Verde "Pago" vs Laranja "Pagamento Pendente") e Tipo de Partida (Laranja "Contra Time" vs Azul "Horário Cheio").
- **Cartão do Adversário (Time B):** Visível apenas em jogos "Contra Time" quando houver desafiante. Exibe o avatar com iniciais do capitão desafiante e seu nome/time.
- **Detalhamento das Informações (Card):** Itens organizados verticalmente por ícones:
  - Telefone Jogador 1
  - Telefone Jogador 2 (se contra_time)
  - Data do agendamento
  - Horário
  - Nome da Quadra
  - Endereço da arena
- **Painel de Ações Operacionais:**
  - *Se pendente:* Botão azul "Confirmar Reserva" e botão vermelho "Cancelar Reserva".
  - *Se confirmada e não paga:* Botão azul "Encerrar Horário" (finaliza o jogo e registra como pago) e botão vermelho "Cancelar Reserva".
  - *Se confirmada (qualquer pagamento):* Botão alternador de cobrança "Marcar como Pago" (verde) ou "Marcar como Pagamento Pendente" (laranja/âmbar).
  - *WhatsApp:* Botão largo verde oficial do WhatsApp (`#25d366`) para iniciar chat direto.
- **Barra de Navegação Inferior (Mobile):** Abas padrão com ícone de Reservas ativo.

## ⚙️ Estado Local (`data`)
- `reserva`: Objeto de dados da reserva ativa, recebido serializado via query de rota e parseado no mounted.
- `quadraId`: ID da quadra ativa recuperado do `localStorage`.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `confirmarReserva()`: Método assíncrono. Submete a confirmação da partida para `api.confirmarReserva`. Atualiza o status local para `confirmada = true` e avisa o usuário.
- `cancelarReserva()`: Método assíncrono. Invoca `api.cancelarReserva` para cancelar a locação e redireciona o dono de volta para `/reservas`.
- `concluirHorario()`: Método assíncrono. Encerra a reserva chamando `api.concluirReserva`, marcando o status como confirmada e faturada (`pago`).
- `toggleStatusPagamento()`: Método assíncrono. Alterna a cobrança entre `'pago'` e `'pendente'` acionando o método `api.atualizarStatusPagamento`.
- `enviarWhatsApp()`: Limpa caracteres não numéricos do telefone do capitão e abre uma nova aba direcionada para o chat do WhatsApp (`wa.me`) com uma mensagem padrão de confirmação de horário com a data formatada.
- `iniciais(nome)`: Extrai até duas iniciais em letras maiúsculas de um nome fornecido.
- `avatarColor(nome)`: Gera pseudo-aleatoriamente uma cor de fundo no padrão HSL a partir da hash do nome fornecido para o círculo de avatar.
- `formatarData(dataStr)`: Limpa a data ISO e retorna a string formatada em `YYYY/MM/DD`.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.confirmarReserva(reservaId)`: Aprova o agendamento.
  - `api.cancelarReserva(reservaId)`: Cancela/exclui o agendamento.
  - `api.concluirReserva(reservaId)`: Encerra o horário e define status de pagamento como pago.
  - `api.atualizarStatusPagamento(reservaId, status)`: Seta a cobrança como `'pago'` ou `'pendente'`.
- **Redirecionamento / Rotas:**
  - `/reservas` (Ao voltar ou cancelar)
  - Barra inferior mobile: `/confirmar-quadra`, `/reservas`, `/faturamento-dono`, `/perfil`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
| 16/07/2026 | Antigravity | Remoção de classes Tailwind e reescrita do visual em CSS puro escopado. |
| 16/07/2026 | Antigravity | Sincronização de campos da reserva com o backend (statusPagamento, tipoJogo, nomeJogadorB, etc.) e formatação de data para `YYYY/MM/DD`. |
