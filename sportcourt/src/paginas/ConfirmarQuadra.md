# Detalhes da Quadra (`ConfirmarQuadra.vue`)

## 📝 Descrição Geral
Página de visualização detalhada da quadra selecionada pelo proprietário (dono). Mostra as especificações da quadra, permite navegar para a edição da quadra ou gerenciamento de seus horários, e exibe a média de avaliações e comentários recebidos dos atletas.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` importado e exibido no topo.
- **Card de Informações da Quadra:**
  - Imagem de capa (aspecto 16:9) ou ícone de câmera padrão se não houver foto.
  - Nome da arena/quadra destacado.
  - Detalhes com ícones dedicados: Localização (cidade + endereço), telefone, preço por hora (em destaque verde), badge azul com o esporte, horário de funcionamento e descrição do espaço.
- **Painel de Ações Rápidas:**
  - Botão "Editar Quadra" (redireciona para `/editar-quadra`).
  - Botão "Gerenciar Horários" (redireciona para `/menu-quadra`).
- **Painel de Avaliações:** Exibe estrelas douradas (até 5) calculadas com base na média aritmética e a contagem total de avaliações dos jogadores.
- **Barra de Navegação Inferior (Mobile):** Menu de acesso rápido com abas para:
  - Quadras (`/minhas-quadras`)
  - Reservas (`/reservas`)
  - Dashboard (`/faturamento-dono`)
  - Perfil (`/perfil`)

## ⚙️ Estado Local (`data`)
- `nomeQuadra`: String com o nome da quadra.
- `endereco`: String com o endereço físico.
- `cidade`: String com a cidade.
- `telefone`: String com o telefone de contato.
- `preco`: Numérico com o preço por hora.
- `horario`: String formatada do horário de funcionamento.
- `descricao`: Texto livre descritivo da quadra.
- `esporte`: String representando o esporte principal da quadra.
- `fotoPerfilUrl`: URL da foto da quadra (resolvida para o servidor backend).
- `defaultImage`: Imagem padrão do perfil da quadra (`@/assets/perfil.png`).
- `mediaEstrelas`: Média aritmética de avaliações (número de 0 a 5).
- `totalAvaliacoes`: Contagem total de avaliações recebidas.
- `quadraId`: Identificador único da quadra ativa no contexto.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `editarQuadra()`: Redireciona o usuário para a tela `/editar-quadra`.
- `carregarQuadraDono()`: Método assíncrono acionado no ciclo de vida `mounted`. Obtém o `quadraId` armazenado no `localStorage` (via chave `"quadraId"` ou de dentro do objeto JSON `"quadraInfo"`). Caso encontre, consome a API através de `api.getQuadra(quadraId)`, preenchendo todos os estados locais da página e tratando a URL da imagem correspondente (resolvendo o prefixo `http://localhost:3006` caso o caminho seja relativo).

## 🌐 Integrações & API
- **Endpoint/Função da API:**
  - `api.getQuadra(quadraId)`: Busca os detalhes completos da quadra e avaliações.
- **Persistência / Armazenamento local:**
  - Lê `"quadraId"` ou `"quadraInfo"`.
- **Redirecionamento / Rotas:**
  - `/editar-quadra` (Edição)
  - `/menu-quadra` (Gerenciador de horários/agenda)
  - Abas da barra inferior: `/minhas-quadras`, `/reservas`, `/faturamento-dono`, `/perfil`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
