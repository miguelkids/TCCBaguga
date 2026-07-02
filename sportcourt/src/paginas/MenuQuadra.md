# Menu de Gerenciamento da Quadra (`MenuQuadra.vue`)

## 📝 Descrição Geral
Página de atalhos e menu operacional para gerenciamento de uma quadra específica pelo seu proprietário. Funciona como um hub simplificado de navegação operacional da quadra de esportes.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Opção de Configuração (Card):**
  - Item clicável com ícone de relógio verde.
  - Título: "Gerenciar Datas e Horários".
  - Subtítulo: "Marque ou libere datas e horários ocupados".
  - Redireciona o usuário para a rota `/editar-data-horario` ao ser clicado.
- **Botão de Retorno:** Botão retangular cinza largo na base com o texto "Voltar para Quadras" (redireciona para `/minhas-quadras`).
- **Barra de Navegação Inferior (Mobile):** Abas padrão com ícone ativo dependendo da rota.

## ⚙️ Estado Local (`data`)
*Esta página não declara dados locais.*

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
*Esta página é puramente navegável e não possui métodos declarados na lógica Javascript, dependendo de binds de rota no template.*

## 🌐 Integrações & API
- **Redirecionamento / Rotas:**
  - `/editar-data-horario` (Gerenciador de agenda de horários)
  - `/minhas-quadras` (Retorno à lista de quadras)
  - Abas da barra inferior: `/confirmar-quadra`, `/reservas`, `/faturamento-dono`, `/perfil`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
