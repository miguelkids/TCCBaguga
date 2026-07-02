<template>
  <div class="line-chart">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "LineChart",
  props: {
    dados: { type: Object, required: true } // { labels: [], datasets: [...] }
  },
  setup(props) {
    const canvas = ref(null);
    let chart = null;

    function buildOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { display: true, grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: undefined } }
        }
      };
    }

    onMounted(() => {
      if (!canvas.value) return;
      chart = new Chart(canvas.value.getContext("2d"), {
        type: "line",
        data: props.dados,
        options: buildOptions()
      });
    });

    // Atualiza o gráfico quando "dados" mudar
    watch(
      () => props.dados,
      (novo) => {
        if (!chart) return;
        chart.data = novo;
        chart.update();
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    });

    return { canvas };
  }
};
</script>

<style scoped>
.line-chart {
  height: 220px; /* preferível controlar tamanho aqui */
  width: 100%;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
