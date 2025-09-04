<template>
  <div class="container">
    <h1>Quadra Criada com Sucesso!</h1>

    <div class="card">
      <img :src="fotoPerfilUrl || imagemDefault" alt="Quadra" class="foto-preview" />
      <h2>{{ nome }}</h2>
      <p>{{ endereco }}</p>
      <p>Telefone: {{ telefone }}</p>
      <p>Preço: R$ {{ preco }} / hora</p>
      <p>Horário: {{ horario }}</p>
      <p>Descrição: {{ descricao }}</p>
    </div>

    <button @click="$router.push('/menu-quadra')" class="btn-editar">
      Editar Quadra
    </button>

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
  name: "ConfirmarQuadra",
  data() {
    return {
      nome: "",
      endereco: "",
      telefone: "",
      preco: "",
      horario: "",
      descricao: "",
      fotoPerfilUrl: "",
      imagemDefault: require("@/assets/perfil.png") 
    };
  },
  mounted() {
    const parte1 = JSON.parse(localStorage.getItem("cadastroQuadraParte1")) || {};
    
    const parte2 = JSON.parse(localStorage.getItem("cadastroQuadraParte2")) || {};

    this.nome = parte1.nomeQuadra || "";
    this.endereco = parte1.endereco || "";
    this.telefone = parte1.telefone || "";
    this.preco = parte2.preco || "";
    this.horario = parte2.horario || "";
    this.descricao = parte2.descricao || "";
    this.fotoPerfilUrl = parte2.fotoPerfilUrl || "";
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
  padding-bottom: 70px; 
  min-height: 100vh;
  box-sizing: border-box;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  background: #fafafa;
}

.foto-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.btn-editar {
  background-color: black;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
