<template>
  <div class="login">
    <h2>Vamos fazer seu login</h2>
    <p>Bem vindo de volta, sentimos sua falta</p>

    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Email" required />
      <div class="senha-wrapper">
        <input
        :type="mostrarSenha ? 'text' : 'password'"
        v-model="senha"
        placeholder="Senha"
        required
        />
        <button type="button" class="btn-ver-senha" @click="mostrarSenha = !mostrarSenha">
          <img src="@/assets/olho.png" alt="Mostrar senha" />
        </button>
      </div>
      <a href="#" class="esqueci-senha">Esqueceu sua senha?</a>
      <button type="submit">Entrar</button>
    </form>

    <div class="botoes-sociais">
       <img src="@/assets/logogoogle.png" alt="Google" />
       <img src="@/assets/logofacebook.png" alt="Facebook" />
       <img src="@/assets/logoapple.png" alt="Apple" />
    </div>

    <div class="divisor">ou</div>

    <p class="texto-cadastro">
      Não tem uma conta?
      <strong><router-link to="/escolher-perfil">Cadastre-se agora</router-link></strong>
    </p>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
export default {
  name: 'PaginaLogin',
  data() {
    return {
      email: '',
      senha: '',
      mostrarSenha: false
    }
  },
  methods: {
    async handleLogin() {
      try {
        const cred = await signInWithEmailAndPassword(auth, this.email, this.senha);
        const uid = cred.user.uid;
        const docDono = await getDoc(doc(db, "donos", uid));
        const docJogador = await getDoc(doc(db, "jogadores", uid));
        
        if (docDono.exists()) {
          this.$router.push("/cadastro-quadra-parte1");
        } else if (docJogador.exists()) {
          this.$router.push("/reserva");
        } else {
          alert("Perfil não encontrado. Cadastre-se novamente.");
        }
      } catch (err) {
        console.error("Erro ao logar:", err);
        alert("Erro: " + err.message);
      }
    }
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.botoes-sociais {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin: 24px 0;
}

.botoes-sociais img {
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.botoes-sociais img:hover {
  transform: scale(1.1);
}

.esqueci-senha {
  display: block;
  margin-top: 10px;
  color: #888;
  font-size: 0.9rem;
}

.divisor {
  margin: 20px 0;
  font-weight: bold;
}

.texto-cadastro {
  margin-top: 1.5rem;
}
.senha-wrapper {
  position: relative;
  width: 100%;
}

.senha-wrapper input {
  width: 100%;
  padding-right: 20px; /* espaço pro ícone não ficar em cima do texto */
  box-sizing: border-box;
}

.btn-ver-senha {
  position: absolute;
  right: -145px; /* gruda no canto direito */
  top: 25%;
  transform: translateY(-50%);
  background: none;
  border:none;
  cursor: pointer;
  padding: 0;
}

.btn-ver-senha img {
  width: 20px;
  height: 20px;
}

</style>


