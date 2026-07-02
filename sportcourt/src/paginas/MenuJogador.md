# Minhas Reservas do Jogador (`MenuJogador.vue`)

## 📝 Descrição Geral
Página de painel do atleta/jogador. Centraliza o histórico de reservas do usuário logado (seja como o agendador principal ou desafiante). Exibe o status da partida, informações de contato de times desafiantes, permite editar dados da reserva enquanto pendente, cancelar/desistir do jogo e avaliar a quadra com estrelas após a confirmação do agendamento.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarJogador` no topo.
- **Cabeçalho:** Título "Minhas Reservas" e botão verde "Reservar Quadra" (aponta para `/reserva`).
- **Estado Vazio:** Exibe ilustrações simples e o botão "Buscar uma quadra" caso não haja agendamentos cadastrados.
- **Lista de Agendamentos (Cards):**
  - *Cabeçalho do Card:* Foto da quadra, título dinâmico (mostra o confronto "Time A ⚔️ VS Time B" se for contra_time ou o nome da quadra se for horário cheio), data e hora formatados, endereço e badge de status ("Confirmada" em verde ou "Pendente" em laranja).
  - *Contatos Telefônicos:* Chips com o telefone do Capitão A (verde) e Capitão B (azul) se estiverem preenchidos no banco de dados.
  - *Rodapé de Avaliação (Disponível apenas para reservas Confirmadas):* Exibe a média de avaliações gerais da quadra e um painel de 5 estrelas interativas douradas para que o jogador vote. Após votar, exibe a nota concedida.
  - *Rodapé de Ações (Disponível apenas para reservas Pendentes):* Botão cinza "Editar Info" (abre modal de edição) e botão vermelho de desistência ("Sair da Partida" se for o desafiante B ou "Cancelar Reserva" se for o criador A).
- **Barra de Navegação Inferior (Mobile):** Abas padrão com visual ativo no ícone Reservas.
- **Modal de Edição de Informações:**
  - Abre em tela cheia (overlay escuro).
  - Campos: Nome do Time, Nome do Jogador, Telefone.
  - Seção dinâmica "Lista de Jogadores" permitindo adicionar nomes e excluir linhas individuais.
  - Ações: "Cancelar" e "Salvar Alterações".

## ⚙️ Estado Local (`data`)
- `reservas`: Array com os registros das reservas do jogador consultadas da API.
- `jogadorId`: ID do jogador logado recuperado do `localStorage`.
- `mostrarBarra`: Boolean para gerenciar a exibição da navegação inferior no mobile.
- `ultimoScroll`: Posição do scroll Y para controle de scroll.
- `logo`: Caminho para `@/assets/logosite1.png`.
- `modalEdicao`: Objeto contendo o estado da caixa de diálogo de edição (`aberto`, `salvando`, `reservaId`, `nomeTime`, `nome`, `telefone`, `jogadoresLista`, `reservaRef`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `formatarDataBR(dataStr)`: Limpa a data ISO e retorna a string formatada em `DD/MM/AAAA`.
- `handleScroll()`: Monitora o scroll para esconder a barra inferior ao rolar para baixo e reexibir ao rolar para cima.
- `ouvirReservas()`: Método assíncrono. Obtém as reservas da API via `api.getReservas()`, filtrando aquelas em que o usuário logado participa (como jogador principal `jogadorId` ou oponente desafiante `jogadorIdB`). Formata os caminhos absolutos das fotos de capa.
- `avaliarQuadra(quadraId, estrelas, reserva)`: Submete uma nota de 1 a 5 para a quadra via `api.avaliarQuadra`. Em caso de sucesso, atualiza o status de votação local da reserva para evitar novos cliques e recalcula a nova média.
- `abrirEdicao(reserva)`: Carrega o formulário do modal com os dados salvos da partida. Verifica dinamicamente se o usuário logado é o desafiante (B) ou o criador (A) para ler as propriedades corretas (`nomeJogadorB`/`nome` etc.) e clona a lista de jogadores.
- `salvarEdicao()`: Envia as alterações da partida para a API `api.editarJogador` e sincroniza o objeto atualizado no array de visualização na tela.
- `confirmarCancelar(reserva)`: Trata a exclusão/cancelamento da reserva. Identifica se o usuário é o Jogador B (desafiante) ou A para disparar o aviso de confirmação adequado, e chama `api.cancelarReserva(reserva.id)`.

## 👁️ Propriedades Computadas (`computed`)
- `reservasOrdenadas`: Ordena as reservas de forma decrescente com base na data (jogos mais recentes no topo).

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getReservas()`: Consulta reservas registradas.
  - `api.avaliarQuadra(quadraId, estrelas)`: Registra avaliação da quadra.
  - `api.editarJogador(reservaId, payload)`: Altera informações e lista de participantes da reserva.
  - `api.cancelarReserva(reservaId)`: Deleta/cancela uma reserva.
- **Redirecionamento / Rotas:**
  - `/reserva` (Redirecionamento ao buscar quadras)
  - `/menu-jogador` (Barra inferior)
  - `/conta-jogador` (Barra inferior)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
