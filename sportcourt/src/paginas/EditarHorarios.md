# Editar Horários (`EditarHorarios.vue`)

> [!NOTE]
> Este arquivo possui conteúdo idêntico ao arquivo `EditarDatas.vue` no projeto atual.

## 📝 Descrição Geral
Página administrativa que permite ao dono da quadra gerenciar manualmente a ocupação e bloqueio de horários para uma data específica. O proprietário pode selecionar qualquer dia no calendário simples, escolher uma hora do dia e marcar como ocupado ou liberar um horário previamente bloqueado.

## 🎨 Layout e Elementos Visuais
- **Seletor de Dia:** Input do tipo date (`dataSelecionada`) para escolher o dia.
- **Seletor de Horário:** Dropdown select contendo todas as 24 horas cheias do dia (`00:00` a `23:00`).
- **Botão Alternador:** Botão verde "Ocupar / Desocupar" que aciona a lógica de alternar status.
- **Lista de Horários Ocupados:** Seção que lista em tempo real todos os horários atualmente marcados como indisponíveis/bloqueados na data selecionada. Cada item da lista possui um botão vermelho "Cancelar" para liberar o horário diretamente.
- **Botão Voltar:** Botão cinza na base que redireciona o usuário para `/menu-quadra`.

## ⚙️ Estado Local (`data`)
- `quadraId`: ID da quadra ativa recuperada do `localStorage`.
- `dataSelecionada`: String contendo a data selecionada (`AAAA-MM-DD`).
- `horarioSelecionado`: String com a faixa de hora selecionada no dropdown.
- `horarios`: Array estático de 24 horas cheias (`["00:00", "01:00", ..., "23:00"]`).
- `horariosDia`: Array contendo a lista de bloqueios retornada da API para a data informada.

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
- `carregarHorarios()`: Consulta a API através do método `api.getHorariosOcupados` passando a quadra e data selecionadas para popular o estado local `horariosDia`.
- `alternarHorario()`: Verifica se a data e o horário foram selecionados. Em seguida, checa se a hora desejada já consta na lista de bloqueados:
  - Se sim: invoca `removerHorario(id)` e notifica com "Horário liberado!".
  - Se não: chama `api.marcarHorarioOcupado` e notifica com "Horário marcado como ocupado!".
  - Ao final, recarrega a lista e limpa a seleção.
- `removerHorario(id)`: Invoca a API `api.desmarcarHorarioOcupado` para deletar o bloqueio pelo ID fornecido e atualiza a listagem na tela.

## 👁️ Observadores (`watch`)
- `dataSelecionada`: Sempre que o valor da data for alterado pelo usuário, dispara automaticamente a função `carregarHorarios()` para sincronizar os dados.

## 🌐 Integrações & API
- **Endpoints da API:**
  - `api.getHorariosOcupados(quadraId, data)`: Lista bloqueios existentes.
  - `api.marcarHorarioOcupado(quadraId, data, horario)`: Bloqueia um horário específico.
  - `api.desmarcarHorarioOcupado(quadraId, id)`: Remove o bloqueio pelo ID.
- **Redirecionamento / Rotas:**
  - `/menu-quadra` (Botão Voltar)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
