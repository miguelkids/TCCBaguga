<template>
  <div class="pagina-reserva">
    <h1 class="titulo">Encontre sua quadra esportiva e reserve o seu horário</h1>

    <div class="secao" @click="irParaCidade">
      <p class="label">Destino</p>
      <p class="valor">{{ quadraSelecionada?.cidade || 'Cidade' }}</p>
    </div>

    <div class="secao" @click="irParaData" :class="{ desativado: !quadraSelecionada }">
      <p class="label">Datas</p>
      <p class="valor">{{ dataSelecionada || 'Selecionar data' }}</p>
    </div>

    <div class="secao" @click="irParaHorario" :class="{ desativado: !dataSelecionada }">
      <p class="label">Horário</p>
      <p class="valor">{{ horarioSelecionado || 'Selecionar horário' }}</p>
    </div>

    <div v-if="quadraSelecionada && dataSelecionada && horarioSelecionado" class="resumo">
      <p><strong>Quadra:</strong> {{ quadraSelecionada.nome }}</p>
      <p><strong>Data:</strong> {{ dataSelecionada }}</p>
      <p><strong>Horário:</strong> {{ horarioSelecionado }}</p>
      <button @click="finalizar" class="botao-finalizar">Finalizar</button>
      <button @click="limparSelecao" class="botao-excluir">Excluir</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaReserva',
  data() {
    return {
      quadraSelecionada: null,
      dataSelecionada: '',
      horarioSelecionado: ''
    };
  },
  created() {
    const { quadra, data, horario } = this.$route.query;
    if (quadra) this.quadraSelecionada = JSON.parse(quadra);
    if (data) this.dataSelecionada = data;
    if (horario) this.horarioSelecionado = horario;
  },
  methods: {
    irParaCidade() {
      this.$router.push('/cidade');
    },
    irParaData() {
      if (!this.quadraSelecionada) return;
      this.$router.push({ path: '/data', query: { quadra: JSON.stringify(this.quadraSelecionada) } });
    },
    irParaHorario() {
      if (!this.dataSelecionada) return;
      this.$router.push({ path: '/horario', query: {
        quadra: JSON.stringify(this.quadraSelecionada),
        data: this.dataSelecionada
      }});
    },
    finalizar() {
      alert('Reserva concluída com sucesso!');
    },
    limparSelecao() {
      this.quadraSelecionada = null;
      this.dataSelecionada = '';
      this.horarioSelecionado = '';
    }
  }
};
</script>


<style scoped>
.pagina-reserva {
  padding: 24px;
  font-family: sans-serif;
}
.titulo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
}
.secao {
  margin-bottom: 20px;
  padding: 12px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.secao.desativado {
  opacity: 0.4;
  pointer-events: none;
}
.label {
  font-weight: bold;
  color: #777;
  margin-bottom: 4px;
}
.valor {
  font-size: 16px;
}
.resumo {
  margin-top: 40px;
}
.botao-finalizar {
  background-color: black;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  width: 100%;
  font-weight: bold;
  margin-top: 16px;
}
.botao-excluir {
  background-color: transparent;
  color: red;
  font-size: 14px;
  border: none;
  margin-top: 12px;
  text-decoration: underline;
}
</style>
