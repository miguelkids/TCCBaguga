<template>
  <div class="editar-horarios">
    <img src="@/assets/horario.png" class="icone" /> <h2>Horarioas</h2>
    
    <div>
      <label>Início:</label>
      <select v-model="horaInicio">
        <option v-for="h in horarios" :key="'ini-'+h">{{ h }}</option>
      </select>
      <label>Fim:</label>
      <select v-model="horaFim">
        <option v-for="h in horarios" :key="'fim-'+h">{{ h }}</option>
      </select>
      <button @click="marcarHorario">Ocupar</button>
    </div>
    <ul>
      <li v-for="(h, i) in horariosOcupados" :key="i">
        {{ h }} <button @click="removerHorario(i)">Remover</button>
      </li>
    </ul>

    <div class="botoes">
      <button @click="$router.push('/menu-quadra')">Voltar</button>
    </div>
  </div>
</template>

<script>
export default {
  name:'EditarHorarios',
  data() {
  return {
    horaInicio: "",
    horaFim: "",
    horarios: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
    horariosOcupados: JSON.parse(localStorage.getItem("horariosOcupados")) || []
  };
},
methods: {
  marcarHorario() {
    if (this.horaInicio && this.horaFim) {
      const intervalo = `${this.horaInicio} - ${this.horaFim}`;
      if (!this.horariosOcupados.includes(intervalo)) {
        this.horariosOcupados.push(intervalo);
        localStorage.setItem("horariosOcupados", JSON.stringify(this.horariosOcupados));
      }
    }
  },
  removerHorario(i) {
    this.horariosOcupados.splice(i, 1);
    localStorage.setItem("horariosOcupados", JSON.stringify(this.horariosOcupados));
  }
}
};
</script>
<style>
.editar-horarios {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  text-align: center;
}

</style>