<template>
  <div class="home">
    <h1>SportCourt!</h1>
    <br>
    <img :src="logo" alt="Logo SportCourt" class="logo" />
    <br>
    <br>
    <h2>Marque seu jogo</h2>
    <br>
    <p class = "texto-home">Garanta seu horário no futebol de forma rápida e prática: em poucos cliques, você marca o jogo e ainda transforma a diversão em rotina, se mantendo ativo e se divertindo com os amigos!</p>

    <router-link to="/login" class="botao-primario">Entrar</router-link>
    <p class="texto-cadastro">
      Não tem uma conta? <strong><router-link to="/escolher-perfil">Cadastre-se agora</router-link></strong>
    </p>
  </div>
</template>

<script>
import logo from '@/assets/logosite.png'
export default {
  name: 'PaginaHome',
  data(){
    return{
      logo
    }
  }
}
</script>

<style scoped>
.home {
 display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100vh;
  text-align: center
}
.botao-primario {
  background-color: #000;
  color: white;
  padding: 14px 24px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 1rem;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.botao-primario:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.texto-cadastro {
  margin-top: 2rem;
}
.texto-home {
  max-width: 320px; 
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #333;
  line-height: 1.4;
  word-break: break-word; 
}
</style>
