# Cadastro Dono (`CadastroDono.vue`)

## 📝 Descrição Geral
Página de cadastro dedicada a novos proprietários (donos de arenas). Permite coletar dados pessoais básicos e credenciais de acesso para criar uma conta do tipo "dono" na plataforma.

## 🎨 Layout e Elementos Visuais
- **Header / Topbar:** Botão "Voltar" (`#btn-voltar-dono`) apontando para `/escolher-perfil`, centralizado com o logo do SportCourt (que aponta para `/`).
- **Formulário de Cadastro:** Card centralizado com badge de identificação do perfil ("Dono de Arena" em estilo azul). Possui campos estruturados com ícones internos:
  - Nome completo (`#input-nome-dono`)
  - Nome de usuário (`#input-usuario-dono`)
  - Telefone (`#input-telefone-dono`)
  - E-mail (`#input-email-dono`)
  - Senha (`#input-senha-dono`)
- **Botões e Ações:**
  - Botão "Criar conta como Proprietário" (`#btn-cadastrar-dono`) para submeter os dados.
  - Link de redirecionamento rápido "Entrar agora" apontando para a página de login (`/login`).

## ⚙️ Estado Local (`data`)
- `nome`: String contendo o nome completo do proprietário.
- `usuario`: String contendo o nome de usuário (ex: `@usuario`).
- `telefone`: String contendo o telefone de contato formatado.
- `email`: String contendo o endereço de e-mail.
- `senha`: String contendo a senha de acesso.
- `logo`: Logotipo do site importado de `@/assets/logosite1.png`.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `handleCadastro()`: Método assíncrono acionado pelo envio do formulário. Invoca `api.register` passando as informações do estado local e definindo o campo `tipo` como `"dono"`. Exibe um alerta de sucesso e redireciona o usuário para a rota `/login`, ou exibe um alerta de erro em caso de falha.

## 🌐 Integrações & API
- **Endpoint/Função da API:** `api.register` do módulo `@/api`.
- **Redirecionamento / Rotas:**
  - `/` (Home via Logo)
  - `/escolher-perfil` (Escolha de Perfil ao voltar)
  - `/login` (Página de login após cadastro ou no link do rodapé)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
