# Login da Conta (`PaginaLogin.vue`)

## 📝 Descrição Geral
Página de autenticação da plataforma. Permite ao usuário (tanto jogador quanto proprietário de quadra) fazer login informando seu e-mail e senha cadastrados. Lida com a gravação dos tokens de autenticação no cache local e faz o direcionamento inteligente do usuário com base no tipo de perfil (proprietário com/sem quadras ou jogador).

## 🎨 Layout e Elementos Visuais
- **Visual Split Screen (Desktop Only):**
  - *Lado Visual (Esquerdo):* Painel escuro com luzes de fundo esmeralda/azul, logotipo grande do SportCourt em negativo, slogans sobre a plataforma e bloco de estatísticas rápidas (Estatísticas: +500 Jogadores, 47 Quadras, ★ 4.9 Avaliação).
  - *Lado do Formulário (Direito):* Card central de autenticação com inputs integrados por ícones.
- **Formulário de Entrada:**
  - E-mail (input tipo email com ícone de envelope).
  - Senha (input tipo password ou text com ícone de cadeado, link lateral "Esqueceu a senha?" e botão de revelar/ocultar senha baseado em ícone de olho).
  - Botão de envio "Entrar" (`#btn-login`) em degradê verde.
- **Divisor & Botões Sociais:**
  - Divisor textual ("ou continue com").
  - Botões para login alternativo via Google e Apple com os respectivos ícones corporativos.
- **Rodapé do Card:** Link "Cadastre-se grátis" (redireciona para `/escolher-perfil`).

## ⚙️ Estado Local (`data`)
- `email`: String contendo o e-mail digitado.
- `senha`: String contendo a senha digitada.
- `mostrarSenha`: Boolean para chavear a visibilidade da senha (tipo text vs password).
- `logo`: Logotipo do site importado de `@/assets/logosite1.png`.
- `olho`: Ícone do olho para alternar visibilidade importado de `@/assets/olho.png`.
- `google`: Ícone do Google importado de `@/assets/logogoogle.png`.
- `apple`: Ícone da Apple importado de `@/assets/logoapple.png`.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `handleLogin()`: Método assíncrono. Submete o e-mail e senha para `api.login`. Salva o token de sessão e os dados do usuário no `localStorage` sob as chaves `"token"` e `"user"`.
  - Se `user.tipo === "dono"`: Consulta todas as quadras registradas via `api.getQuadras()`, filtrando as pertencentes àquele proprietário (`donoId === user.id`). Se possuir quadra, salva o ID nos registros de `"quadraId"` e `"quadraInfo"` do localStorage, e encaminha para `/confirmar-quadra`. Se não possuir, envia-o para o formulário de cadastro de quadra `/cadastro-quadra-parte1`.
  - Se `user.tipo === "jogador"`: Redireciona para a página de busca de quadras `/reserva`.
  - Se o tipo for inválido/inexistente, alerta o usuário. Em caso de falha de login na API, exibe o alerta com a mensagem do erro.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.login(email, senha)`: Executa a validação de credenciais e retorna o token JWT e objeto do usuário.
  - `api.getQuadras()`: Consulta a base completa de quadras para verificação do onboarding do dono.
- **Persistência / Armazenamento local:**
  - Grava `"token"` e `"user"`.
  - Grava `"quadraId"` e `"quadraInfo"`.
- **Redirecionamento / Rotas:**
  - `/` (Retorno à Home via Logo)
  - `/confirmar-quadra` (Dono com quadra cadastrada)
  - `/cadastro-quadra-parte1` (Dono sem quadra cadastrada)
  - `/reserva` (Jogador autenticado)
  - `/escolher-perfil` (Link para novos cadastros)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
