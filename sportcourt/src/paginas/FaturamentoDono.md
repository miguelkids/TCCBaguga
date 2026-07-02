# Dashboard de Faturamento (`FaturamentoDono.vue`)

## 📝 Descrição Geral
Página de dashboard financeiro para o proprietário da arena. Consolida os dados de agendamentos com pagamento confirmado (`pago`), exibindo indicadores essenciais (receita total, quantidade de reservas, ticket médio e percentual de crescimento) e um gráfico linear interativo do faturamento por período.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarDono` no topo.
- **Cabeçalho & Filtros:**
  - Título "Dashboard" e subtítulo informativo.
  - Menu de filtros alinhado à direita para alternar o período analítico (Mês ou Ano).
  - Dropdown para selecionar o mês de análise (visível apenas se o período "Mês" estiver ativo).
  - Dropdown de conversão monetária (Real R$, Dólar US$, Euro €) para conversão em tempo real.
- **Grade de Indicadores (Stats Cards):** Quatro cartões com ícones e cores dedicadas:
  - *Faturamento:* Receita convertida na moeda escolhida.
  - *Horários Agendados:* Volume absoluto de reservas pagas no período.
  - *Variação vs. período anterior:* Percentual de variação colorido de verde (positivo/crescimento) ou vermelho (negativo/queda).
  - *Ticket Médio:* Faturamento total dividido pelo volume de reservas (em valor inteiro).
- **Painel do Gráfico:** Área dedicada com bordas suaves contendo um gráfico linear responsivo que desenha a curva do faturamento (dias do mês ou meses do ano) com efeito de gradiente esmeralda sob a linha de tendência.
- **Barra de Navegação Inferior (Mobile):** Abas padrão com ícone ativo no Dashboard.

## ⚙️ Estado Local (`data`)
- `periodo`: String de escopo do relatório (`"mes"` ou `"ano"`).
- `mesSelecionado`: Índice inteiro do mês selecionado para filtragem (0 a 11).
- `moeda`: String representando a moeda de exibição ativa (`"BRL"`, `"USD"` ou `"EUR"`).
- `simbolo`: Prefixo textual da moeda ativa (`"R$ "`, `"US$ "` ou `"€ "`).
- `taxas`: Objeto com as cotações fixas de conversão baseadas em 1 BRL (BRL: 1, USD: 0.18, EUR: 0.16).
- `nomesMeses`: Lista de strings com os nomes dos meses em português.
- `reservas`: Array contendo os agendamentos processados e validados `{ preco, dataReal }`.
- `totalPeriodo`: Valor acumulado de faturamento no período ativo em reais.
- `totalHorarios`: Total de agendamentos válidos no período ativo.
- `variacao`: Percentual de comparação com o ciclo anterior (mês anterior ou ano anterior).
- `valorConvertido`: Faturamento total multiplicado pela taxa de câmbio selecionada.
- `ticketMedio`: Média aritmética de faturamento por agendamento.
- `chart`: Referência à instância do objeto Chart.js ativa.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarReservas()`: Método assíncrono chamado no `mounted`. Obtém as reservas da API via `api.getReservas`, filtra apenas as que possuem `statusPagamento === 'pago'`, valida e faz o parse das datas e horários em instâncias `Date` (salvas em `dataReal`) e armazena o resultado em `reservas`.
- `atualizar()`: Realiza os cálculos estatísticos. Agrupa o faturamento pelas chaves temporárias (dias ou meses), calcula o `totalPeriodo`, a quantidade de agendamentos (`totalHorarios`), o ticket médio, converte os valores e projeta o percentual de variação (`variacao`). Dispara o redesenho do gráfico.
- `gerarLabels(data)`: Auxiliar para gerar o eixo X do gráfico (lista de 1 a 28-31 dias ou índices de meses de 0 a 11).
- `desenharGrafico(labels, valores)`: Instancia e desenha o gráfico linear usando Chart.js, aplicando suavização de curvas (`tension: 0.4`) e preenchimento gradiente sob a linha verde. Destrói o gráfico anterior caso exista.
- `converter()`: Atualiza o símbolo e recalcula o faturamento com base no dropdown de moeda.

## 👁️ Propriedades Computadas (`computed`)
- `periodoLabel`: Exibe uma string descritiva da fatia temporal ativa (ex: `"Junho 2026"` ou `"2026"`).

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getReservas()`: Busca a totalidade de reservas cadastradas para o estabelecimento.
- **Persistência / Armazenamento local:**
  - Lê `"user"` no `mounted` para validação do contexto do dono.
- **Redirecionamento / Rotas:**
  - Barra inferior mobile: `/minhas-quadras`, `/reservas`, `/faturamento-dono`, `/perfil`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
