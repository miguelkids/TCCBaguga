# Reservas do Dono (`ReservasDono.vue`)

## 📝 Descrição Geral
Painel de gestão operacional de agendamentos para o proprietário da quadra. Organizado por abas (Pendentes, Confirmadas, Encerradas), permite aceitar/recusar pedidos e encerrar partidas marcando os recebimentos.

## 🎨 Layout e Elementos Visuais
- **Header:** `TopbarDono`.
- **Abas por Status:** Pendente, Confirmada, Encerrada.
- **Card de Agendamento:** Nome do jogador, telefone, data/horário e valor.

## 🌐 Integrações & API
- `api.getReservas()`
- `api.confirmarReserva(id)`
- `api.concluirReserva(id)`
- `api.cancelarReserva(id)`
