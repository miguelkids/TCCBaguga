<template>
  <div class="editar-datas">
    <img src="@/assets/datas.png" class="icone" /> <h2>Datas</h2>
    <input type="date" v-model="dataSelecionada" />
    <button @click="marcarData">Marcar como Ocupada</button>

    <ul>
      <li v-for="(d, index) in datasOcupadas" :key="index">
        {{ d }} <button @click="removerData(index)">Remover</button>
      </li>
    </ul>

    <div class="botoes">
      <button @click="$router.push('/menu-quadra')">Voltar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditarDatas', 
  data() {
    return {
      dataSelecionada: "",
      datasOcupadas: JSON.parse(localStorage.getItem("datasOcupadas")) || []
    };
  },
  methods: {
    marcarData() {
      if (this.dataSelecionada && !this.datasOcupadas.includes(this.dataSelecionada)) {
        this.datasOcupadas.push(this.dataSelecionada);
        localStorage.setItem("datasOcupadas", JSON.stringify(this.datasOcupadas));
      }
    },
    removerData(i) {
      this.datasOcupadas.splice(i, 1);
      localStorage.setItem("datasOcupadas", JSON.stringify(this.datasOcupadas));
    }
  }
};
</script>
<style>
.editar-datas {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  text-align: center;
}

</style>
