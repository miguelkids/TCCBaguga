# Buscar Quadras (`PaginaReserva.vue`)

## 📝 Descrição Geral
Página de busca e catálogo de quadras esportivas destinada aos jogadores. Permite pesquisar quadras por cidade, agrupar múltiplos espaços cadastrados sob uma mesma marca/endereço e selecionar modalidades alternativas antes de prosseguir com a reserva.

## 🎨 Layout e Elementos Visuais
- **Componente Topbar:** `TopbarJogador` no topo.
- **Barra de Busca Premium:** Campo de entrada textual largo de cantos arredondados contendo ícone de lupa e contador de resultados obtidos flutuante (`#busca`).
- **Estados da Listagem:**
  - *Dica Inicial (Busca vazia):* Exibe ícone verde de localização e instrução ("Onde você quer jogar?").
  - *Nenhum Resultado (Busca ativa sem correspondência):* Exibe ícone de lupa cinza e aviso informando que não foram encontrados registros para o texto digitado.
  - *Resultados da Busca:* Grid responsivo de cards mostrando as quadras da cidade pesquisada.
- **Cartão do Estabelecimento (Resultado):**
  - Banner fotográfico da quadra (com badge preto transparente exibindo a nota estrelas `★ 4.9` se houver avaliações).
  - Nome da Arena.
  - Dados do local com ícone: Endereço completo, cidade e telefone.
  - *Seletor de Modalidade (Se houver > 1 quadra no espaço):* Lista de botões pequenos side-by-side permitindo ao usuário selecionar a quadra/esporte de interesse, exibindo o respectivo preço de cada esporte.
  - *Exibição Simples (Se houver apenas 1 quadra no espaço):* Badge com o nome da modalidade (Futebol, Vôlei, etc.) e o valor por hora ao lado.
  - Botão "Reservar Agora" (verde gradiente) redirecionando para a finalização.
- **Barra de Navegação Inferior (Mobile):** Abas padrão com ícone Buscar destacado em verde.

## ⚙️ Estado Local (`data`)
- `busca`: String contendo o termo digitado na barra de pesquisa (cidade).
- `espacos`: Array contendo os estabelecimentos filtrados e agrupados para renderização em tela.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `buscarQuadras()`: Disparador do input de busca. Se o texto for limpo, limpa os resultados locais. Caso contrário, consome `api.getQuadras()`, filtra as quadras cujo nome da cidade comece com o termo buscado (case-insensitive) e agrupa os itens que possuem o mesmo `donoId`, `nomeQuadra` e `endereco` sob uma chave composta. Esse agrupamento permite tratar estabelecimentos de múltiplas quadras como um único card com chaves de seleção internas.
- `reservarEspaco(espaco)`: Captura a ID da quadra ativa selecionada no card, grava no `localStorage` sob a chave `"quadraSelecionada"` e redireciona o fluxo para a rota `/finalizar-reserva`.
- `fotoSrc(fotoUrl)`: Resolve caminhos de imagens relativas para o servidor de backend.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getQuadras()`: Retorna a listagem completa de todas as quadras cadastradas na plataforma.
- **Persistência / Armazenamento local:**
  - Grava a ID da quadra selecionada na chave `"quadraSelecionada"`.
- **Redirecionamento / Rotas:**
  - `/finalizar-reserva` (Ao confirmar reserva)
  - Abas da barra inferior: `/menu-jogador`, `/reserva`, `/conta-jogador`.

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
