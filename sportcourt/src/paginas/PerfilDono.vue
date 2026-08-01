<template>
  <div class="sc-page">
    <TopbarDono />

    <main class="sc-container sc-main sc-main-padded" style="max-width: 800px;">
      <div style="margin-bottom: 24px;">
        <h1 class="sc-h2">Meu Perfil</h1>
        <p class="sc-muted">Suas informações pessoais e gerenciamento da conta.</p>
      </div>

      <!-- Card do Perfil -->
      <div class="sc-card" style="padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 24px;">
          <div style="position: relative;">
            <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 2px solid var(--sc-primary); background: var(--sc-bg-elevated); display: flex; align-items: center; justify-content: center;">
              <img v-if="previewFoto || form.fotoPerfilUrl" :src="previewFoto || form.fotoPerfilUrl" alt="Foto" style="width: 100%; height: 100%; object-fit: cover;" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-text-muted);"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <label style="position: absolute; bottom: 0; right: 0; background: var(--sc-primary); color: #0f1117; padding: 8px; border-radius: 50%; cursor: pointer; box-shadow: var(--sc-shadow-glow-sm);">
              <input type="file" accept="image/*" @change="carregarImagem" hidden />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </label>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: 800; font-size: 18px;">{{ form.nomeCompleto || 'Sem nome' }}</div>
            <div class="sc-muted" style="font-size: 13px;">{{ form.email }}</div>
            <span class="sc-badge sc-badge-primary" style="margin-top: 6px; display: inline-block;">Dono de Quadra</span>
          </div>
        </div>

        <div class="sc-grid-2" style="gap: 16px;">
          <div class="sc-form-group">
            <label class="sc-label">Nome Completo</label>
            <input type="text" class="sc-input" v-model="form.nomeCompleto" placeholder="Seu nome" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Nome de Usuário</label>
            <input type="text" class="sc-input" v-model="form.nomeUsuario" placeholder="@usuario" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">E-mail</label>
            <input type="email" class="sc-input" v-model="form.email" disabled style="opacity: 0.7; cursor: not-allowed;" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Telefone</label>
            <input type="text" class="sc-input" v-model="form.telefone" placeholder="(00) 00000-0000" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">CPF</label>
            <input type="text" class="sc-input" v-model="form.cpf" placeholder="000.000.000-00" />
          </div>

          <div class="sc-form-group">
            <label class="sc-label">Gênero</label>
            <select class="sc-input" v-model="form.genero">
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; border-top: 1px solid var(--sc-border); padding-top: 20px;">
          <button class="sc-btn sc-btn-danger" @click="sairDaConta">
            Sair da Conta
          </button>

          <button class="sc-btn sc-btn-primary" @click="salvarPerfil" :disabled="salvando">
            {{ salvando ? "Salvando..." : "Salvar alterações" }}
          </button>
        </div>
      </div>

      <!-- Seção de Gerenciamento de Subcontas integrada ao Perfil -->
      <div class="sc-card" style="padding: 24px;">
        <div style="margin-bottom: 20px;">
          <h2 class="sc-h3" style="display: flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sc-primary);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Gerenciamento de Perfis (Subcontas)
          </h2>
          <p class="sc-muted" style="font-size: 13px; margin-top: 4px;">Crie contas de acesso adicionais para funcionários ou gerentes de recepção.</p>
        </div>

        <!-- Formulário de cadastro de subconta -->
        <div style="background: var(--sc-bg-elevated); padding: 16px; border-radius: var(--sc-radius); border: 1px solid var(--sc-border); margin-bottom: 20px;">
          <div class="sc-grid-2" style="gap: 12px; margin-bottom: 12px;">
            <input type="text" class="sc-input" v-model="novaSubconta.nome" placeholder="Nome do funcionário" />
            <input type="email" class="sc-input" v-model="novaSubconta.email" placeholder="E-mail de acesso" />
            <input type="password" class="sc-input" v-model="novaSubconta.senha" placeholder="Senha inicial" />
            <input type="text" class="sc-input" v-model="novaSubconta.cargo" placeholder="Cargo (ex: Recepcionista)" />
          </div>
          <button class="sc-btn sc-btn-primary sc-btn-sm" @click="adicionarSubconta" style="width: 100%;">
            Adicionar Subconta
          </button>
        </div>

        <!-- Lista de subcontas -->
        <div v-if="subcontas.length === 0" class="sc-empty" style="padding: 20px;">
          <p class="sc-muted">Nenhuma subconta cadastrada ainda.</p>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 10px;">
          <div
            v-for="(s, idx) in subcontas"
            :key="idx"
            class="sc-flex-between"
            style="padding: 12px; border-radius: var(--sc-radius); border: 1px solid var(--sc-border); background: var(--sc-bg-elevated);"
          >
            <div>
              <div style="font-weight: 700; font-size: 14px;">{{ s.nome }} <span v-if="s.cargo" style="font-weight: 400;" class="sc-muted">• {{ s.cargo }}</span></div>
              <div class="sc-muted" style="font-size: 12px;">{{ s.email }}</div>
            </div>
            <button class="sc-btn sc-btn-danger sc-btn-sm" @click="removerSubconta(idx)">
              Remover
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  name: "PerfilDono",
  components: { TopbarDono },
  data() {
    return {
      form: { id: "", nomeCompleto: "", nomeUsuario: "", email: "", telefone: "", genero: "", cpf: "", dataNascimento: "", fotoPerfilUrl: "" },
      previewFoto: null,
      fileFoto: null,
      salvando: false,
      subcontas: [],
      novaSubconta: { nome: "", email: "", senha: "", cargo: "" }
    };
  },
  mounted() {
    this.carregarDados();
    this.carregarSubcontas();
  },
  methods: {
    async carregarDados() {
      try {
        const user = await api.getMe();
        this.form.id = user.id;
        this.form.nomeCompleto = user.nome || "";
        this.form.nomeUsuario = user.nome_usuario || "";
        this.form.telefone = user.telefone || "";
        this.form.email = user.email || "";
        this.form.cpf = user.cpf || "";
        this.form.genero = user.genero || "";
        this.form.dataNascimento = user.data_nascimento ? user.data_nascimento.substring(0, 10) : "";
        if (user.foto_perfil_url) {
          this.form.fotoPerfilUrl = `http://localhost:3006${user.foto_perfil_url}`;
        }
      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
      }
    },
    async carregarSubcontas() {
      try {
        const salvo = localStorage.getItem("subcontas_dono");
        if (salvo) this.subcontas = JSON.parse(salvo);
      } catch (_e) { /* ignorado */ }
    },
    async salvarPerfil() {
      try {
        this.salvando = true;
        await api.atualizarPerfil({
          nome: this.form.nomeCompleto,
          nomeUsuario: this.form.nomeUsuario,
          telefone: this.form.telefone,
          cpf: this.form.cpf,
          genero: this.form.genero,
          dataNascimento: this.form.dataNascimento,
        }, this.fileFoto);

        alert("Perfil atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        alert("Erro ao salvar perfil: " + error.message);
      } finally {
        this.salvando = false;
      }
    },
    carregarImagem(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileFoto = file;
        this.previewFoto = URL.createObjectURL(file);
      }
    },
    adicionarSubconta() {
      if (!this.novaSubconta.nome.trim() || !this.novaSubconta.email.trim() || !this.novaSubconta.senha.trim()) {
        alert("Preencha nome, e-mail e senha da subconta.");
        return;
      }
      this.subcontas.push({ ...this.novaSubconta });
      localStorage.setItem("subcontas_dono", JSON.stringify(this.subcontas));
      this.novaSubconta = { nome: "", email: "", senha: "", cargo: "" };
      alert("Subconta adicionada com sucesso!");
    },
    removerSubconta(idx) {
      if (confirm("Deseja remover o acesso deste funcionário?")) {
        this.subcontas.splice(idx, 1);
        localStorage.setItem("subcontas_dono", JSON.stringify(this.subcontas));
      }
    },
    sairDaConta() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("quadraId");
      localStorage.removeItem("quadraInfo");
      this.$router.push("/login");
    }
  }
};
</script>
