# Minhas Reservas do Jogador (`MenuJogador.vue`)

## 📝 Descrição Geral
Painel principal do atleta/jogador. Exibe o histórico completo de agendamentos realizados, permite avaliar a arena com estrelas após a confirmação e agendar novas partidas.

## 🎨 Layout e Elementos Visuais
- **Header:** `TopbarJogador`.
- **Cards de Reserva:** Foto da quadra, confronto de times (se modalidade contra_time), data e horário formatados e indicador de status (Pendente/Confirmada).
- **Sistema de Avaliação:** Estrelas interativas para votar na qualidade da quadra pós-jogo.

## 🌐 Integrações & API
- `api.getReservas()`
- `api.avaliarQuadra(quadraId, estrelas)`
