# Chat do Dono (`ChatDono.vue`)

## 📝 Descrição Geral
Página de atendimento via mensagens diretas entre o proprietário da quadra e os atletas. Permite visualizar lista de conversas ativas, mensagens não lidas e enviar respostas em tempo real.

## 🎨 Layout e Elementos Visuais
- **Header:** `TopbarDono`.
- **Sidebar de Conversas (Lista de Threads):** Lista cada jogador com foto/inicial, nome, prévia da última mensagem e indicador de mensagens pendentes.
- **Painel de Chat:** Histórico de balões de mensagens divididos em remetente jogador e proprietário.
- **Caixa de Entrada:** Input de texto com botão "Enviar" primário.

## 🌐 Integrações & API
- `api.getChatThreads(quadraId)`
- `api.getChatThreadJogador(quadraId, jogadorId)`
- `api.enviarMensagem(quadraId, texto)`
