<template>
  <div class="cadastro-quadra">
    <h2>Preencha as informações da sua quadra</h2>

    <form @submit.prevent="proximaParte">
      <input v-model.trim="nomeQuadra" placeholder="Nome da Quadra" required>
      <input v-model.trim="endereco" placeholder="Endereço" required>
      <input v-model.trim="telefone" placeholder="Telefone" type="tel">

      <button type="submit">Confirmar</button>
    </form>
    <div class="barra-inferior">
      <router-link to="/confirmar-quadra" class="item">
        <img src="@/assets/menu.png" alt="Menu" class="icone" />
        <span>Menu</span>
      </router-link>

      <router-link to="/reserva-dono" class="item">
        <img src="@/assets/reserva.png" alt="Reservas" class="icone" />
        <span>Reservas</span>
      </router-link>

      <router-link to="/perfil" class="item">
        <img src="@/assets/perfi.png" alt="Perfil" class="icone" />
        <span>Perfil</span>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      nomeQuadra: "",
      endereco: "",
      telefone: ""
    };
  },
  methods: {
    async proximaParte() {
      if (!this.nomeQuadra || !this.endereco) {
        alert("Preencha todos os campos obrigatórios!");
        return;
      }

      localStorage.setItem("cadastroQuadraParte1", JSON.stringify({
        nomeQuadra: this.nomeQuadra,
        endereco: this.endereco,
        telefone: this.telefone
      }));

      this.$router.push("/cadastro-quadra-parte2");
    }
  }
};
</script>

<style scoped>
.cadastro-quadra {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 70px; 
  min-height: 100vh;
  box-sizing: border-box;
}

button {
  margin-top: 1rem;
}
.barra-inferior {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

/* Botões da barra */
.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
}


.icone {
  width: 22px;
  height: 22px;
}
</style>
