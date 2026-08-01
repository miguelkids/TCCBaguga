<template>
  <div class="sc-page">
    <TopbarJogador />

    <main class="sc-container-sm sc-main sc-main-padded">
      <div style="margin-bottom: 24px; text-align: center;">
        <h1 class="sc-h2">Meu Perfil</h1>
        <p class="sc-muted">Gerencie seus dados pessoais e de contato</p>
      </div>

      <div class="sc-card" style="padding: 32px;">
        <!-- Avatar Uploader -->
        <div style="text-align: center; margin-bottom: 24px;">
          <label style="cursor: pointer; display: inline-block;">
            <input type="file" accept="image/*" @change="carregarImagem" hidden />
            <div class="sc-avatar" style="width: 100px; height: 100px; margin: 0 auto; border: 2px solid var(--sc-primary);">
              <img v-if="previewFoto || jogador.fotoPerfilUrl" :src="previewFoto || fotoSrc(jogador.fotoPerfilUrl)" alt="Foto de perfil" />
              <span v-else style="font-size: 32px;">👤</span>
            </div>
            <div class="sc-muted" style="font-size: 12px; margin-top: 8px; color: var(--sc-primary);">
              Toque para alterar foto
            </div>
          </label>
        </div>

        <form @submit.prevent="salvarPerfil">
          <div class="sc-form-group">
            <label class="sc-label">Nome Completo</label>
            <input type="text" class="sc-input" v-model="jogador.nomeCompleto" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Nome de Usuário</label>
            <input type="text" class="sc-input" v-model="jogador.nomeUsuario" required />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">E-mail</label>
            <input type="email" class="sc-input" v-model="jogador.email" disabled />
          </div>

          <div class="sc-form-row">
            <div class="sc-form-group">
              <label class="sc-label">Telefone (WhatsApp)</label>
              <input type="text" class="sc-input" v-model="jogador.telefone" />
            </div>

            <div class="sc-form-group">
              <label class="sc-label">CPF (Opcional)</label>
              <input type="text" class="sc-input" v-model="jogador.cpf" placeholder="000.000.000-00" />
            </div>
          </div>

          <div class="sc-form-row">
            <div class="sc-form-group">
              <label class="sc-label">Gênero</label>
              <select class="sc-input" v-model="jogador.genero">
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div class="sc-form-group">
              <label class="sc-label">Data de Nascimento</label>
              <input type="date" class="sc-input" v-model="jogador.dataNascimento" />
            </div>
          </div>

          <button type="submit" class="sc-btn sc-btn-primary sc-btn-lg" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar Alterações ✓' }}
          </button>
        </form>

        <div style="margin-top: 24px; text-align: center;">
          <button class="sc-btn sc-btn-danger sc-btn-sm" @click="sairDaConta">
            Sair da Conta
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopbarJogador from "@/components/TopbarJogador.vue";
import { api } from "@/api";

export default {
  name: "ContaJogador",
  components: { TopbarJogador },
  data() {
    return {
      jogador: {
        id: "",
        nomeCompleto: "",
        nomeUsuario: "",
        email: "",
        telefone: "",
        cpf: "",
        genero: "",
        dataNascimento: "",
        fotoPerfilUrl: ""
      },
      previewFoto: null,
      fileFoto: null,
      salvando: false
    };
  },
  async created() {
    await this.carregarPerfil();
  },
  methods: {
    fotoSrc(url) {
      if (!url) return "";
      return url.startsWith("http") ? url : `http://localhost:3006${url}`;
    },
    async carregarPerfil() {
      try {
        const dados = await api.getMe();
        this.jogador = {
          id: dados.id,
          nomeCompleto: dados.nome || "",
          nomeUsuario: dados.nome_usuario || "",
          email: dados.email || "",
          telefone: dados.telefone || "",
          cpf: dados.cpf || "",
          genero: dados.genero || "",
          dataNascimento: dados.data_nascimento ? dados.data_nascimento.slice(0, 10) : "",
          fotoPerfilUrl: dados.foto_perfil_url || ""
        };
      } catch (e) {
        console.error(e);
      }
    },
    carregarImagem(e) {
      const file = e.target.files[0];
      if (file) {
        this.fileFoto = file;
        this.previewFoto = URL.createObjectURL(file);
      }
    },
    async salvarPerfil() {
      try {
        this.salvando = true;
        await api.atualizarPerfil({
          nome: this.jogador.nomeCompleto,
          nomeUsuario: this.jogador.nomeUsuario,
          telefone: this.jogador.telefone,
          cpf: this.jogador.cpf,
          genero: this.jogador.genero,
          dataNascimento: this.jogador.dataNascimento
        }, this.fileFoto);
        alert("Perfil atualizado com sucesso!");
        await this.carregarPerfil();
      } catch (e) {
        alert(e.message || "Erro ao salvar perfil.");
      } finally {
        this.salvando = false;
      }
    },
    sairDaConta() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  }
};
</script>
