# Lista de Minhas Quadras (`MinhasQuadras.vue`)

## 📝 Descrição Geral
Página principal do painel do proprietário. Exibe a listagem de todas as quadras pertencentes ao usuário logado, permite selecionar qual quadra está sob gestão no momento (salvando-a como ativa no contexto global), e fornece atalhos rápidos para cadastrar novas quadras ou gerenciar quadras individuais.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Cabeçalho:** Título "Minhas Quadras" e botão azul "+ Nova Quadra" (`adicionarNovaQuadra`).
- **Estado de Carregamento (Loading):** Spinner de rotação azul centralizado.
- **Estado Vazio (Sem Quadras):** Desenho de pino com botão gradiente azul "Cadastrar minha primeira quadra".
- **Grade/Lista de Quadras:** Cards individuais que apresentam:
  - Imagem de capa (com badge flutuante "Ativa" caso seja a quadra ativa do contexto).
  - Nome do espaço esportivo.
  - Localização (cidade e endereço) com ícone de mapa.
  - Informações de esporte (badge azul) e preço/hora (badge verde).
  - Horário de funcionamento formatado.
  - Botão largo de ação rápida "Gerenciar esta Quadra" (azul degradê).
- **Barra de Navegação Inferior (Mobile):** Abas padrão com visual ativo em "Quadras".

## ⚙️ Estado Local (`data`)
- `quadras`: Lista de objetos contendo as quadras do proprietário vindas da API.
- `loading`: Boolean para controlar a exibição do spinner de carregamento (inicia como `true`).
- `quadraAtiva`: ID (string) da quadra marcada como ativa no `localStorage`.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarQuadras()`: Método assíncrono acionado no `mounted`. Executa a chamada `api.getMinhasQuadras()`. Se nenhuma quadra ativa (`quadraAtiva`) estiver cadastrada no localStorage e a lista retornar quadras, define automaticamente a primeira quadra da listagem como ativa.
- `selecionarQuadra(q)`: Grava o ID da quadra selecionada no `localStorage` sob a chave `"quadraId"`, atualiza `quadraAtiva` e redireciona para a página `/confirmar-quadra`.
- `adicionarNovaQuadra()`: Encaminha para o fluxo de cadastro.
  - Se o usuário já tiver alguma quadra cadastrada: clona os dados de endereço/cidade/contato da primeira para poupar digitação, grava no `localStorage` na chave `"cadastroQuadraParte1"` com `modoAdicionar: true` e pula diretamente para a etapa 2 (`/cadastro-quadra-parte2`).
  - Se não possuir: redireciona para a etapa 1 (`/cadastro-quadra-parte1`).
- `fotoUrl(q)`: Retorna a imagem do perfil do ativo do local (resolve caminhos relativos ao backend ou fornece fallback `@/assets/perfil.png`).

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getMinhasQuadras()`: Lista todas as quadras pertencentes ao usuário logado.
- **Persistência / Armazenamento local:**
  - Escreve `"quadraId"` (ao carregar ou selecionar).
  - Lê e escreve `"cadastroQuadraParte1"` (para cadastrar nova).
- **Redirecionamento / Rotas:**
  - `/confirmar-quadra` (Gerenciar quadra)
  - `/cadastro-quadra-parte1` (Fluxo inicial de nova quadra)
  - `/cadastro-quadra-parte2` (Adicionar quadra direta)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
