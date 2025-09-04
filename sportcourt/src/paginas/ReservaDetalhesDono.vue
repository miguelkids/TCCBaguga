<template>
  <div class="container">
    <h2 class="titulo">Detalhes da Reserva</h2>

    <div class="card">
      <p><strong>Nome:</strong> João da Silva</p>
      <p><strong>Telefone:</strong> (11) 99999-9999</p>
      <p><strong>Data:</strong> 05/09/2025</p>
      <p><strong>Horário:</strong> 18:00 - 19:00</p>
    </div>

    <div class="botoes">
      <button class="btn voltar" @click="$router.push('/reservas')">Voltar</button>
      <button class="btn confirmar">Confirmar</button>
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
</template>
<script>
export default {
  name: "ReservaDetalhesDono",
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 20px;
  background: #f8f9fa;
}

.titulo {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.botoes {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.voltar {
  background: #ccc;
}

.confirmar {
  background: #4CAF50;
  color: white;
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
