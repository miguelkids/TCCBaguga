# Perfil do Jogador (`ContaJogador.vue`)

## 📝 Descrição Geral
Página de perfil do atleta/jogador. Exibe e permite editar os dados cadastrais (nome, usuário, e-mail, telefone, CPF, gênero, data de nascimento e foto de perfil) bem como realizar o logout da plataforma.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarJogador` no topo.
- **Foto de Perfil:** Área circular interativa com borda verde (`#border-emerald-500`) e ícone de câmera sob hover para alteração da imagem de avatar.
- **Formulário de Dados do Jogador:**
  - Nome completo (input de texto)
  - Nome de usuário (input de texto)
  - Gênero (dropdown: Masculino, Feminino, Outro)
  - E-mail (desabilitado para edição)
  - Telefone (input de texto)
  - CPF (input de texto)
  - Data de Nascimento (input tipo date)
- **Ações:**
  - Botão "Salvar alterações" (verde/esmeralda, exibe "Salvando..." durante a requisição).
  - Botão "Sair da Conta" (estilo alerta, com fundo e bordas vermelhas).
- **Barra de Navegação Inferior (Mobile):** Transição de subida/descida controlada pelo scroll. Possui links para:
  - Reservas (`/menu-jogador`)
  - Buscar (`/reserva`)
  - Perfil (`/conta-jogador`)

## ⚙️ Estado Local (`data`)
- `jogador`: Objeto contendo os dados do jogador (`id`, `nomeCompleto`, `nomeUsuario`, `email`, `telefone`, `cpf`, `genero`, `dataNascimento`, `fotoPerfilUrl`).
- `previewFoto`: String/URL temporária para a pré-visualização local da imagem selecionada.
- `fileFoto`: Objeto File contendo o arquivo binário da imagem carregada.
- `defaultImage`: Imagem padrão de avatar (`@/assets/perfil.png`).
- `mostrarBarra`: Boolean para controlar a visibilidade da barra de navegação inferior.
- `ultimaPosicaoScroll`: Numérico para monitorar o deslocamento da página (scroll Y).
- `salvando`: Boolean indicador de envio de formulário para a API.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarDados()`: Chamado no ciclo de vida `mounted`. Realiza a consulta `api.getMe()`, vinculando as chaves retornadas pelo backend ao estado local `jogador` (com tratamento de caminho absoluto para a foto).
- `salvarPerfil()`: Atualiza as informações do jogador na base. Invoca `api.atualizarPerfil` enviando as propriedades modificadas e o arquivo binário da nova imagem (`fileFoto`). Atualiza a tela com alerta de sucesso.
- `carregarImagem(event)`: Manipulador do evento de upload de imagem. Gera o objeto local `URL.createObjectURL` para renderização imediata do avatar.
- `sairDaConta()`: Limpa os registros de autenticação e contexto do `localStorage` (`token`, `user`, `quadraId`, `quadraInfo`) e redireciona o usuário para `/login`.
- `verificarScroll()`: Evento do listener de scroll. Esconde a barra inferior se o usuário rolar para baixo e a reexibe se rolar para cima.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getMe()`: Consulta dados do perfil logado.
  - `api.atualizarPerfil(dados, arquivo)`: Envia a payload com campos de dados e arquivo de imagem no formato multipart.
- **Persistência / Armazenamento local:**
  - Remove as chaves `"token"`, `"user"`, `"quadraId"` e `"quadraInfo"` no logout.
- **Redirecionamento / Rotas:**
  - `/login` (Redirecionamento após sair da conta)
  - `/menu-jogador` (Barra inferior)
  - `/reserva` (Barra inferior)
  - `/conta-jogador` (Barra inferior)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
