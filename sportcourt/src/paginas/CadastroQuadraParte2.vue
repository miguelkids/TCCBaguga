<template>
  <div class="cadastro-quadra">
  <!-- Upload de foto -->
    <div class="foto-perfil">
      <label>
        <input type="file" @change="carregarImagem" accept="image/*" hidden>
        <img
          :src="fotoPerfilUrl || defaultImage"
          alt="Foto da quadra"
          class="foto-preview"
        />
      </label>
      <p>Foto do perfil</p>
    </div>

    <!-- Preço -->
    <input
      type="number"
      v-model.trim="preco"
      placeholder="Preço por hora (R$)"
      required
    />

    <!-- Dias da semana -->
    <div class="horario">
      <label>Dias de funcionamento:</label>
      <select v-model="diaInicio" required>
        <option disabled value="">De</option>
        <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
      </select>
      <select v-model="diaFim" required>
        <option disabled value="">Até</option>
        <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
      </select>
    </div>

    <!-- Horário -->
    <div class="horario">
      <label>Horário de funcionamento:</label>
      <select v-model="horaAbertura" required>
        <option disabled value="">Abertura</option>
        <option v-for="hora in horarios" :key="'abertura-' + hora" :value="hora">
          {{ hora }}
        </option>
      </select>
      <select v-model="horaFechamento" required>
        <option disabled value="">Fechamento</option>
        <option v-for="hora in horarios" :key="'fechamento-' + hora" :value="hora">
          {{ hora }}
        </option>
      </select>
    </div>

    <!-- Descrição -->
    <textarea
      v-model.trim="descricao"
      placeholder="Descrição da quadra"
    ></textarea>

    <!-- Botões -->
    <div class="botoes">
      <button type="button" class="btn-voltar" @click="$router.push('/cadastro-quadra-parte1')">
        Voltar
      </button>
      <button type="button" class="btn-criar" @click="salvarDados">
        Criar
      </button>
    </div>

    <!-- Barra inferior -->
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
import { db, auth } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default {
  data() {
    return {
      preco: "",
      descricao: "",
      fotoPerfilUrl: "",
      defaultImage: require("@/assets/perfil.png"),

      diasSemana: ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"],
      horarios: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2,"0")}:00`),

      diaInicio: "",
      diaFim: "",
      horaAbertura: "",
      horaFechamento: ""
    };
  },
  methods: {
    carregarImagem(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.fotoPerfilUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async salvarDados() {
      try {
        const parte1 = JSON.parse(localStorage.getItem("cadastroQuadraParte1")) || {};
        const user = auth.currentUser;

        if (!user) {
          alert("Você precisa estar logado para cadastrar uma quadra.");
          return;
        }

        const quadraRef = doc(db, "quadras", user.uid); // cada dono pode ter uma quadra vinculada ao seu uid
        await setDoc(quadraRef, {
          nome: parte1.nomeQuadra,
          endereco: parte1.endereco,
          telefone: parte1.telefone,
          preco: this.preco,
          descricao: this.descricao,
          foto: this.fotoPerfilUrl || this.defaultImage,
          horario: `${this.diaInicio} até ${this.diaFim}, ${this.horaAbertura} às ${this.horaFechamento}`,
          donoId: user.uid,
          criadoEm: serverTimestamp()
        });

        alert("Quadra cadastrada com sucesso!");
        this.$router.push("/confirmar-quadra");
      } catch (err) {
        console.error("Erro ao salvar quadra:", err);
        alert("Erro: " + err.message);
      }
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

.foto-perfil {
  text-align: center;
  margin-bottom: 1rem;
}

.foto-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
}

textarea {
  width: 100%;
  min-height: 80px;
  margin-top: 0.5rem;
}

select,
input,
textarea {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.horario {
  margin-top: 1rem;
}

.botoes {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-voltar {
  background-color: #aaa;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-criar {
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
