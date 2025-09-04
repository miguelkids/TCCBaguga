<template>
  <div class="container">
    <h2 class="titulo">Meu Perfil</h2>

    <!-- FOTO DE PERFIL -->
    <div class="foto-perfil">
      <label>
        <input type="file" @change="carregarImagem" accept="image/*" hidden />
        <img
          :src="fotoPerfilUrl || defaultImage"
          alt="Foto de perfil"
          class="foto-preview"
        />
      </label>
      <p>Foto do perfil</p>
    </div>

    <!-- FORMULÁRIO -->
    <div class="form">
      <label>Nome e Sobrenome</label>
      <input type="text" placeholder="Nome e Sobrenome" />

      <label>Nome de Usuário</label>
      <input type="text" placeholder="Nome do Usuário" />

      <label>Gênero</label>
      <select>
        <option>Masculino</option>
        <option>Feminino</option>
        <option>Outro</option>
      </select>

      <label>E-mail</label>
      <input type="email" placeholder="Email" />

      <label>Senha</label>
      <input type="password" placeholder="Senha" />

      <label>Telefone</label>
      <input type="text" placeholder="Telefone" />

      <label>CPF</label>
      <input type="text" placeholder="CPF" />

      <label>Data de Nascimento</label>
      <input type="date" />
    </div>

    <button class="btn salvar">salvar</button>
  </div>

  <!-- BARRA INFERIOR -->
  <transition name="slide-up">
    <div v-show="mostrarBarra" class="barra-inferior">
      <router-link to="/confirmar-quadra" class="item">
        <img src="@/assets/menu.png" class="icone" />
        <span>Menu</span>
      </router-link>
      <router-link to="/reservas-dono" class="item">
        <img src="@/assets/reserva.png" class="icone" />
        <span>Reservas</span>
      </router-link>
      <router-link to="/perfil" class="item">
        <img src="@/assets/perfi.png" class="icone" />
        <span>Perfil</span>
      </router-link>
    </div>
  </transition>
</template>

<script>
export default {
  name: "PerfilDono",
  data() {
    return {
      fotoPerfilUrl: "",
      defaultImage: require("@/assets/perfil.png"),
      mostrarBarra: true,
      ultimaPosicaoScroll: 0,
    };
  },
  methods: {
    carregarImagem(event) {
      const file = event.target.files[0];
      if (file) {
        this.fotoPerfilUrl = URL.createObjectURL(file);
      }
    },
    verificarScroll() {
      const posicaoAtual = window.scrollY;

      if (posicaoAtual > this.ultimaPosicaoScroll) {
        // Rolando para baixo → esconder barra
        this.mostrarBarra = false;
      } else {
        // Rolando para cima → mostrar barra
        this.mostrarBarra = true;
      }

      this.ultimaPosicaoScroll = posicaoAtual;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.verificarScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.verificarScroll);
  },
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

/* FOTO PERFIL */
.foto-perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.foto-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ddd;
  margin-bottom: 10px;
}

/* FORM */
.form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.form label {
  font-size: 14px;
  font-weight: bold;
}

.form input,
.form select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
}

/* BOTÃO */
.btn.salvar {
  width: 100%;
  max-width: 400px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #000;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn.salvar:hover {
  background: #333;
}

/* BARRA INFERIOR */
.barra-inferior {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  text-decoration: none;
  color: #333;
}

.icone {
  width: 24px;
  height: 24px;
  margin-bottom: 3px;
}

/* TRANSIÇÃO DA BARRA */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
