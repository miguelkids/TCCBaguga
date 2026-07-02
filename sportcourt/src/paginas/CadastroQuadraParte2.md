# Cadastro Quadra Parte 2 (`CadastroQuadraParte2.vue`)

## 📝 Descrição Geral
Segunda etapa do formulário de cadastro de quadras. Permite ao proprietário configurar individualmente os detalhes específicos de cada uma de suas quadras (esporte praticado, preço/hora, dias de funcionamento, horários de abertura e fechamento, descrição e foto). Caso múltiplas quadras tenham sido especificadas no Passo 1, a tela funciona como um assistente de múltiplos passos para configurar cada uma antes de salvar todas no banco de dados.

## 🎨 Layout e Elementos Visuais
- **Header / Topbar:** Botão "Voltar" acionado por `voltarPasso()`, título dinâmico indicando o progresso da quadra atual (ex: "Quadra 1 de 3" ou "Nova Quadra"), e alinhamento centralizado.
- **Indicador de Progresso:** Pequenos círculos verdes que destacam visualmente qual quadra está sendo configurada (oculto no modo de adição individual).
- **Foto da Quadra:** Área circular clicável que exibe a imagem carregada ou um ícone padrão de perfil. Permite o upload de arquivos de imagem (`image/*`).
- **Formulário de Configurações:**
  - Esporte (dropdown: Futebol, Futsal, Society, Beach Tennis, Vôlei, Basquete, Tênis, Padel, Outro)
  - Preço por hora em R$ (input de número)
  - Dias de funcionamento - início e fim (dropdowns de Segunda a Domingo)
  - Horário de funcionamento - abre e fecha às (dropdowns de 24 horas)
  - Descrição do espaço (área de texto opcional, visível apenas na primeira quadra)
- **Ações:** Botão verde dinâmico que exibe "Próxima Quadra" ou "Concluir Cadastro"/"Adicionar Quadra" conforme o progresso.

## ⚙️ Estado Local (`data`)
- `modoAdicionar`: Boolean indicando se a página está adicionando uma quadra de forma avulsa (a partir da tela de lista de quadras).
- `quadraAtual`: Índice inteiro da quadra sob configuração (0-indexed).
- `totalQuadras`: Quantidade total de quadras a serem cadastradas (padrão `1`).
- `quadras`: Array de objetos contendo as configurações individuais de cada quadra.
- `salvando`: Boolean para indicar o estado de envio dos dados para a API (previne cliques repetidos).
- `defaultImage`: Caminho para a imagem padrão de perfil (`@/assets/perfil.png`).
- `esportes`: Array com as opções de modalidades esportivas.
- `diasSemana`: Array com os dias de segunda a domingo.
- `horarios`: Array de strings formatadas com as horas cheias do dia (`00:00` a `23:00`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarImagem(e)`: Captura o arquivo de imagem enviado pelo usuário, gera uma URL local temporária para preview e a armazena no objeto da quadra atual.
- `voltarPasso()`: Retrocede para a quadra anterior (`quadraAtual--`) ou, se estiver na primeira, redireciona o usuário para `/cadastro-quadra-parte1` (ou `/minhas-quadras` se estiver no modo de adição avulsa).
- `avancarOuSalvar()`: Valida os campos obrigatórios da quadra corrente. Se houver mais quadras a configurar, avança o índice (`quadraAtual++`), caso contrário, invoca o salvamento geral.
- `salvarTodasQuadras()`: Método assíncrono que realiza o cadastro sequencial de todas as quadras configuradas. Lê as informações do passo 1 (`cadastroQuadraParte1`) e do usuário logado no `localStorage`, formata o horário de funcionamento (ex: `"Segunda até Sexta, 08:00 às 22:00"`) e faz requisições consecutivas para a API (`api.createQuadra`), transmitindo os dados e o arquivo de imagem. Por fim, consulta todas as quadras daquele usuário, armazena a primeira ID criada no `localStorage` (`quadraId` e `quadraInfo`) e redireciona para `/minhas-quadras`.

## 🌐 Integrações & API
- **Endpoint/Função da API:**
  - `api.createQuadra(dados, arquivo)`: Chamado no laço para criar cada quadra.
  - `api.getMinhasQuadras()`: Busca a lista atualizada de quadras do proprietário para determinar a ID inicial.
- **Persistência / Armazenamento local:**
  - Lê `"cadastroQuadraParte1"` e `"user"`.
  - Escreve `"quadraId"` e `"quadraInfo"`.
- **Redirecionamento / Rotas:**
  - `/minhas-quadras` (Redirecionamento final após cadastro ou no voltar do modo de adição)
  - `/cadastro-quadra-parte1` (Ao voltar da primeira quadra no fluxo padrão)
  - `/login` (Se o usuário não estiver autenticado)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
