<template>
  <div class="cadastro">
    <h2>Vamos registrar sua conta</h2>
    
    <form @submit.prevent="handleCadastro">
      <input v-model.trim="nome" placeholder="Nome" required>
      <input v-model.trim="usuario" placeholder="Nome de usuário" required>
      <input v-model.trim="telefone" placeholder="Telefone" type="tel">
      <input v-model.trim="email" placeholder="Email" type="email" required>
      <input v-model.trim="senha" placeholder="Senha" type="password" required>
      
      <button type="submit">Cadastrar</button>
    </form>
    
    <p class="texto-login">
      Já tem uma conta? <strong><router-link to="/login">Entrar</router-link></strong>
    </p>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default {
  data() {
    return {
      nome: "",
      usuario: "",
      telefone: "",
      email: "",
      senha: ""
    };
  },
  methods: {
    async handleCadastro() {
      try {
        const cred = await createUserWithEmailAndPassword(auth, this.email, this.senha);
        const uid = cred.user.uid;

        await setDoc(doc(db, "donos", uid), {
          uid,
          nome: this.nome,
          nome_usuario: this.usuario,
          telefone: this.telefone,
          email: this.email,
          tipo: "dono",
          criado_em: serverTimestamp()
        }, { merge: true });

        alert("Dono cadastrado com sucesso!");
        this.$router.push("/login");
      } catch (err) {
        console.error("Erro ao cadastrar dono:", err);
        alert("Erro: " + (err?.message || err));
      }
    }
  }
};
</script>

<style scoped>
.cadastro {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.texto-login {
  margin-top: 1.5rem;
  text-align: center;
}
</style>
