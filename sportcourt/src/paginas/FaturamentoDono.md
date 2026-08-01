# Dashboard do Dono (`FaturamentoDono.vue`)

## 📝 Descrição Geral
Painel analítico financeiro e de ocupação para o proprietário de quadra. Exibe indicadores de faturamento recebido, valores a receber, quantidade de horários agendados, gráfico diário de desempenho e top horários mais buscados.

## 🎨 Layout e Elementos Visuais
- **Header:** `TopbarDono`.
- **Filtro:** Seletor de mês.
- **KPI Cards:** Faturamento recebido, faturamento pendente, total de reservas e total de clientes únicos.
- **Gráfico de Barras CSS:** Distribuição do faturamento dia a dia no mês selecionado.
- **Horários Mais Populares:** Ranking top 5.

## 🌐 Integrações & API
- `api.getDashboardKpis(mes)`
- `api.getDashboardSerieDiaria(mes)`
- `api.getDashboardHorariosPopulares(mes)`
