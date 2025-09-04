<template>
  <div class="escolher-perfil">
    <h2>Escolha seu perfil</h2>
    <h2>Jogador/Quadra</h2>
    <br>
    <br>
    <img :src="logo" alt="Logo SportCourt" class="logo" />
    <br>
    <br>
    <br>
    <div class="botoes-perfil">
      <router-link to="/cadastro-jogador" class="botao-perfil">
        <span>Jogador</span>
      </router-link>
      
      <router-link to="/cadastro-dono" class="botao-perfil">
        <span>Dono de Quadra</span>
      </router-link>
    </div>
    
    <p class="texto-login">
      Já tem uma conta? <strong><router-link to="/login">Entrar</router-link></strong>
    </p>
  </div>
</template>
<script>
import logo from '@/assets/logosite.png'
export default {
  name: 'EscolherPerfil',
  data(){
    return{
      logo
    }
  }
}
</script>

<style scoped>
.escolher-perfil {
  text-align: center;
  padding: 2rem;
}
.botoes-perfil {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 2rem 0;
}

.botao-perfil {
  flex: 1;
  max-width: 150px;
  padding: 16px;
  border: none;
  border-radius: 10px;
  background-color: #000;
  text-align: center;
  font-weight: bold;
  color: #f0f0f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.botao-perfil.router-link-active {
  background-color: #000;
  color: #fff;
}
.botao-perfil:hover{
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

}
.texto-login {
  margin-top: 2rem;
}
</style>
