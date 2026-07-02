# Cadastro Quadra Parte 1 (`CadastroQuadraParte1.vue`)

## 📝 Descrição Geral
Primeira etapa do formulário de cadastro de uma quadra/arena esportiva pelo proprietário. Coleta as informações físicas básicas do espaço (nome, endereço, cidade, contato e quantidade de quadras) e as salva temporariamente para prosseguir para o passo seguinte.

## 🎨 Layout e Elementos Visuais
- **Header / Topbar:** Botão "Voltar" apontando para `/perfil` e indicação visual do progresso ("Passo 1 de 2").
- **Formulário de Cadastro (Passo 1):** Card com campos para preenchimento de:
  - Nome da Quadra (obrigatório, input de texto)
  - Endereço (obrigatório, input de texto)
  - Cidade (obrigatório, input de texto)
  - Telefone (input de telefone)
  - Quantidade de quadras no espaço (dropdown de seleção de 1 a 10)
- **Ações:** Botão "Continuar" com ícone de seta apontando para a direita, em estilo verde/esmeralda.
- **Barra de Navegação Inferior (Mobile):** Menu de acesso rápido com links para:
  - Menu (`/confirmar-quadra`)
  - Reservas (`/reserva-dono`)
  - Perfil (`/perfil`)

## ⚙️ Estado Local (`data`)
- `nomeQuadra`: String para o nome da quadra.
- `endereco`: String para o endereço.
- `telefone`: String para o telefone.
- `cidade`: String para a cidade.
- `quantidadeQuadras`: Inteiro representando a quantidade de quadras do local (padrão `1`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `proximaParte()`: Valida se os campos obrigatórios `nomeQuadra` e `endereco` estão preenchidos. Salva os dados no `localStorage` sob a chave `"cadastroQuadraParte1"` serializados em JSON e redireciona o usuário para a rota do passo 2 (`/cadastro-quadra-parte2`).

## 🌐 Integrações & API
- **Persistência Temporária:** Armazena dados no `localStorage` sob a chave `"cadastroQuadraParte1"`.
- **Redirecionamento / Rotas:**
  - `/perfil` (Voltar ou Perfil na barra mobile)
  - `/cadastro-quadra-parte2` (Próximo passo após submissão)
  - `/confirmar-quadra` (Menu na barra mobile)
  - `/reserva-dono` (Reservas na barra mobile)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
