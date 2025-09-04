<template>
  <div class="menu-quadra">
    <h2>Sua Quadra</h2>

    <div class="opcoes">
      <button @click="$router.push('/editar-datas')" class="opcao">
        <img src="@/assets/datas.png" class="icone" /> <span>Datas</span>
      </button>
      <button @click="$router.push('/editar-horarios')" class="opcao">
        <img src="@/assets/horario.png" class="icone" /> <span>Horarioas</span>
      </button>
    </div>

    <button class="btn-voltar" @click="$router.push('/confirmar-quadra')">Voltar</button>

    <!-- Barra inferior -->
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

<style scoped>
.menu-quadra {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
}

.opcoes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}
.opcao {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  background: #fff;
}
.btn-voltar {
  background: black;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
.barra-inferior {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  color: #333;
  text-decoration: none;
}
.icone { width: 22px; height: 22px; }
</style>
