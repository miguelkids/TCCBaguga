# Perfil do Proprietário (`PerfilDono.vue`)

## 📝 Descrição Geral
Página de perfil dedicada aos proprietários (donos) de quadras. Apresenta o formulário de dados cadastrais da conta do gestor, permitindo editar nome completo, nome de usuário, e-mail, telefone, CPF, gênero, data de nascimento e foto de perfil, além de possibilitar a saída da conta (logout).

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Foto de Perfil:** Área circular de avatar destacada com borda azul (`#border-blue-500`) e sobreposição translúcida de ícone de câmera sob passagem do mouse.
- **Formulário de Dados do Dono:**
  - Nome e Sobrenome (input de texto)
  - Nome de Usuário (input de texto)
  - Gênero (dropdown: Masculino, Feminino, Outro)
  - E-mail de contato (input de texto)
  - Telefone (input de texto)
  - CPF (input de texto)
  - Data de Nascimento (input tipo date)
- **Ações:**
  - Botão "Salvar alterações" (azul/índigo gradiente, exibe "Salvando..." se bloqueado).
  - Botão "Sair da Conta" (fundo e borda vermelha).
- **Barra de Navegação Inferior (Mobile):** Abas com ícone ativo em Perfil.

## ⚙️ Estado Local (`data`)
- `form`: Objeto contendo os dados do proprietário (`id`, `nomeCompleto`, `nomeUsuario`, `email`, `telefone`, `genero`, `cpf`, `dataNascimento`, `fotoPerfilUrl`).
- `fileFoto`: Objeto File contendo o binário do avatar.
- `defaultImage`: Fallback de imagem de avatar (`@/assets/perfil.png`).
- `mostrarBarra`: Boolean de controle de scroll da navegação inferior.
- `ultimaPosicaoScroll`: Numérico indicador do Y-scroll da janela.
- `salvando`: Boolean indicador de requisição de salvamento ativa.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarDados()`: Método assíncrono chamado no `mounted`. Consulta `api.getMe()`, vincula as propriedades para o objeto `form` (com tratamento de caminho absoluto da imagem) e preenche a tela.
- `salvarPerfil()`: Grava as alterações do perfil. Submete a payload e o arquivo `fileFoto` para a API `api.atualizarPerfil`. Notifica o sucesso por alerta.
- `carregarImagem(event)`: Captura o arquivo de imagem do input file, armazena em `fileFoto` e cria URL Object temporária em `fotoPerfilUrl`.
- `sairDaConta()`: Limpa os registros de autenticação do `localStorage` (`token`, `user`, `quadraId`, `quadraInfo`) e redireciona para `/login`.
- `verificarScroll()`: Oculta a barra de menu inferior ao rolar para baixo e reexibe ao rolar para cima.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getMe()`: Consulta dados cadastrais do perfil logado.
  - `api.atualizarPerfil(dados, arquivo)`: Modifica os campos e envia imagem de avatar.
- **Persistência / Armazenamento local:**
  - Deleta as chaves de autenticação do `localStorage` ao deslogar.
- **Redirecionamento / Rotas:**
  - `/login` (Logout)
  - Barra inferior mobile: `/confirmar-quadra`, `/reservas`, `/faturamento-dono`, `/perfil`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
| 16/07/2026 | Antigravity | Remoção de classes Tailwind e reescrita do visual em CSS puro escopado. |
