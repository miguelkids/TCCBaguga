# Editar Quadra (`EditarQuadra.vue`)

## 📝 Descrição Geral
Página de edição cadastral da quadra esportiva. Permite ao proprietário atualizar qualquer detalhe previamente cadastrado para a quadra, incluindo o nome, endereço, cidade, telefone de contato, modalidade, preço/hora, limites da agenda de funcionamento e a foto principal de exibição.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Cabeçalho:** Botão "Voltar" (para `/confirmar-quadra`) e título "Editar Quadra".
- **Banner da Foto:** Bloco retangular responsivo com proporção 16:9 (`aspect-video`) exibindo a foto atual da quadra. Possui hover effect de escurecimento com a mensagem "Trocar foto" para sinalizar que é interativo.
- **Formulário de Edição:**
  - Nome da Quadra (input de texto)
  - Endereço (input de texto)
  - Cidade (input de texto)
  - Telefone (input de texto)
  - Esporte (dropdown)
  - Preço por hora (input numérico)
  - Dias de funcionamento - De/Até (dois dropdowns lado a lado)
  - Horário de funcionamento - Abertura/Fechamento (dois dropdowns lado a lado)
  - Descrição (área de texto com redimensionamento vertical)
- **Ações:** Duas colunas na base contendo o botão "Cancelar" (cinza) e o botão "Salvar Alterações" (gradiente azul).

## ⚙️ Estado Local (`data`)
- `nomeQuadra`: String do nome da quadra.
- `endereco`: String do endereço físico.
- `cidade`: String do município.
- `telefone`: String do contato.
- `preco`: Numérico representando o valor da hora.
- `descricao`: Texto livre descritivo.
- `esporte`: String indicativa da modalidade esportiva principal.
- `diaInicio`: String do dia em que se inicia o funcionamento (ex: "Segunda").
- `diaFim`: String do dia em que se encerra o funcionamento (ex: "Sábado").
- `horaAbertura`: String do horário de abertura (ex: "08:00").
- `horaFechamento`: String do horário de fechamento (ex: "22:00").
- `fotoPreview`: URL/String para exibição local da foto da quadra.
- `fotoArquivo`: Objeto File do arquivo binário de imagem selecionado para envio.
- `defaultImage`: Fallback de imagem de perfil (`@/assets/perfil.png`).
- `diasSemana`: Array estático de dias (`["Segunda", "Terça", ...]`).
- `horarios`: Array de strings contendo horas cheias do dia (`00:00` a `23:00`).
- `esportes`: Array com modalidades esportivas aceitas.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarImagem(e)`: Captura o evento de mudança do input file, armazena o binário em `fotoArquivo` e cria o link temporário em `fotoPreview` para renderização imediata do banner.
- `salvarEdicao()`: Método assíncrono. Mescla as seleções de dias e horas em uma única string de horário padrão (ex: `"Segunda até Sexta, 08:00 às 22:00"`), e invoca `api.atualizarQuadra` passando o ID da quadra (carregado do `localStorage`), a payload com os dados e o arquivo de imagem caso tenha sido alterado. Notifica o sucesso e redireciona para `/confirmar-quadra`.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getQuadra(quadraId)`: Chamado no `mounted` para preencher os dados atuais do formulário. Realiza o parse da string `horario` para preencher os dropdowns individuais de funcionamento.
  - `api.atualizarQuadra(quadraId, dados, arquivo)`: Envia a requisição de atualização (Multipart).
- **Persistência / Armazenamento local:**
  - Lê `"quadraId"` no ciclo `mounted` e no `salvarEdicao`.
- **Redirecionamento / Rotas:**
  - `/confirmar-quadra` (Voltar / Cancelar / Sucesso ao salvar)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
