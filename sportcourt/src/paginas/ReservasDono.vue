<template>
  <div class="reservas">
    <h2>Veja quem reservou um horário em sua quadra</h2>

    <div v-if="reservas.length === 0">
      <p>Nenhuma reserva encontrada.</p>
    </div>

    <div v-else>
      <div v-for="(reserva, i) in reservas" :key="i" class="reserva-card">
        <div class="info">
          <strong>{{ reserva.nome }}</strong>
          <p>{{ reserva.data }} - {{ reserva.horario }}</p>
        </div>
        <button class="btn-ver">Ver</button>
      </div>
    </div>

    <div class="barra-inferior">
      <router-link to="/confirmar-quadra" class="item">
        <img src="@/assets/menu.png" class="icone" /> <span>Menu</span>
      </router-link>
      <router-link to="/reservas-dono" class="item">
        <img src="@/assets/reserva.png" class="icone" /> <span>Reservas</span>
      </router-link>
      <router-link to="/perfil" class="item">
        <img src="@/assets/perfi.png" class="icone" /> <span>Perfil</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reservas: JSON.parse(localStorage.getItem("reservas")) || []
    };
  }
};
</script>

<style scoped>
.reserva-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.btn-ver {
  background: black;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
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
</style>
