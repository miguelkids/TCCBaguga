# CRM de Clientes (`CRMClientes.vue`)

## 📝 Descrição Geral
Página de gestão de clientes para o proprietário de quadra. Exibe o histórico consolidados dos atletas que já agendaram partidas na arena, quantidade de partidas jogadas, montante total gasto e atalho para contato direto via WhatsApp.

## 🎨 Layout e Elementos Visuais
- **Header:** `TopbarDono`.
- **Cartões de KPI:** Total de clientes únicos, total de partidas e faturamento acumulado.
- **Barra de Pesquisa:** Input com ícone para filtro instantâneo por nome ou telefone.
- **Tabela / Lista de Clientes:** Exibe foto de perfil (ou inicial), nome, telefone, contador de jogos, data do último jogo, valor total gasto e botão "WhatsApp".

## 🌐 Integrações & API
- `api.getCRMClientes(quadraId)`: Retorna a lista agregada dos clientes no backend.
