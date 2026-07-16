# Página Home (`PaginaHome.vue`)

## 📝 Descrição Geral
Página de destino (landing page) principal do SportCourt. Apresenta a proposta de valor da plataforma, os benefícios para arenas/gestores e para atletas/jogadores, faturamento simulado, prova social (estatísticas do sistema), seção de perguntas frequentes (FAQ) e chamadas para ação (CTAs).

## 🎨 Layout e Elementos Visuais
- **Header / Navbar:** Logo do SportCourt, links rápidos para login e cadastro.
- **Hero Section:** Título de impacto, slogan, botões de início e busca de quadras, credenciais do sistema e um mockup interativo simulando o dashboard do proprietário.
- **Seção de Funcionalidades (Abas):** Abas interativas para alternar entre benefícios para:
  - *Arenas & Gestores* (Gestão de horários, pagamento antecipado, painel financeiro, controle de equipes).
  - *Atletas & Jogadores* (Agendamento rápido, divisão de PIX, lembretes de WhatsApp, histórico/ranking).
- **Seção de Comparação:** Quadro comparativo de gestão manual ("No Passado") contra a gestão com SportCourt.
- **Seção de Números (Prova Social):** Cidades alcançadas, agendamentos realizados, jogadores cadastrados e total faturado.
- **Perguntas Frequentes (FAQ):** Acordeões expansíveis para tirar dúvidas comuns sobre o teste grátis, pagamentos, múltiplas quadras e lembretes.
- **CTA Final / Footer:** Chamada de fechamento para cadastro gratuito e links de rodapé.

## ⚙️ Estado Local (`data`)
- `logo`: Imagem do logo carregada de `@/assets/logosite1.png`.
- `abaAtiva`: String que controla qual aba de benefícios exibir (`'dono'` ou `'jogador'`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
*Esta página realiza alternância de estado de abas diretamente no template (`@click="abaAtiva = ..."`), sem métodos declarados.*

## 🌐 Integrações & API
- **Imagens:** Importação estática do logotipo.
- **Redirecionamento / Rotas:**
  - `/` (Home)
  - `/login` (Entrar / Buscar Quadras)
  - `/escolher-perfil` (Cadastrar Arena / Criar Arena)

## 📅 Histórico de Alterações
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
| 22/06/2026 | Antigravity | **Correção de layout:** Removidas regras CSS globais conflitantes (`input`, `button`) do `global.css` e CSS legado do `App.vue` que sobrescreviam as classes Tailwind. Página agora renderiza corretamente com padding, botões e tipografia do design system. |
| 22/06/2026 | Antigravity | **Correção de pipeline:** Resolvido problema raiz em que o Tailwind v4 não gerava classes utilitárias no Webpack/Vue CLI. Corrigido via `@import "tailwindcss" source("../..")` no `global.css` e `css.loaderOptions.postcss` no `vue.config.js`. Dev server reiniciado na porta 8080. |
| 16/07/2026 | Antigravity | Remoção de classes Tailwind e reescrita do visual em CSS puro escopado. |
