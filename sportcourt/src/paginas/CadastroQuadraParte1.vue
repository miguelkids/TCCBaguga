<template>
  <div class="pagina-cadastro">

    <!-- Header -->
    <header class="header">
      <router-link to="/perfil" class="btn-voltar">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </router-link>
      <div class="progresso-wrapper">
        <span class="progresso-passo">Passo 1 de 2</span>
        <span class="progresso-titulo">Nova Quadra</span>
      </div>
    </header>

    <!-- Formulário -->
    <main class="conteudo">
      <div class="form-wrapper">
        
        <div class="card-cadastro">
          <h1 class="card-titulo">Dados da Arena</h1>
          <p class="card-subtitulo">Informe as informações básicas do seu espaço.</p>

          <form @submit.prevent="proximaParte" class="formulario">
            <!-- Nome da Quadra -->
            <div class="campo">
              <label class="campo-label">Nome da Quadra *</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input type="text" v-model="nomeQuadra" placeholder="Ex: Arena Central" required class="input-campo" />
              </div>
            </div>

            <!-- Endereço -->
            <div class="campo">
              <label class="campo-label">Endereço *</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <input type="text" v-model="endereco" placeholder="Rua, número, bairro" required class="input-campo" />
              </div>
            </div>

            <!-- Cidade -->
            <div class="campo">
              <label class="campo-label">Cidade *</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <input type="text" v-model="cidade" placeholder="Ex: São Paulo" required class="input-campo" />
              </div>
            </div>

            <!-- Telefone -->
            <div class="campo">
              <label class="campo-label">Telefone</label>
              <div class="input-wrapper">
                <svg class="input-icone" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input type="text" v-model="telefone" placeholder="(00) 00000-0000" class="input-campo" />
              </div>
            </div>

            <!-- Quantidade de Quadras -->
            <div class="campo">
              <label class="campo-label">Quantidade de quadras</label>
              <div class="select-wrapper">
                <select v-model="quantidadeQuadras" class="select-campo">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }} {{ n === 1 ? 'quadra' : 'quadras' }}</option>
                </select>
                <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <button type="submit" class="btn-submit">
              Continuar
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </form>
        </div>
      </div>
    </main>

    <!-- Bottom Nav Mobile -->
    <nav class="bottom-nav">
      <router-link to="/confirmar-quadra" class="nav-item" :class="$route.path === '/confirmar-quadra' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Menu</span>
      </router-link>
      <router-link to="/reservas" class="nav-item" :class="$route.path === '/reservas' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Reservas</span>
      </router-link>
      <router-link to="/perfil" class="nav-item" :class="$route.path === '/perfil' ? 'nav-item--ativo' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "CadastroQuadraParte1",
  data() {
    return {
      nomeQuadra: "",
      endereco: "",
      telefone: "",
      cidade: "",
      quantidadeQuadras: 1,
    };
  },
  methods: {
    proximaParte() {
      if (!this.nomeQuadra || !this.endereco || !this.cidade) {
        alert("Preencha os campos obrigatórios: Nome, Endereço e Cidade.");
        return;
      }
      localStorage.setItem("cadastroQuadraParte1", JSON.stringify({
        nomeQuadra: this.nomeQuadra,
        endereco: this.endereco,
        telefone: this.telefone,
        cidade: this.cidade,
        quantidadeQuadras: this.quantidadeQuadras,
      }));
      this.$router.push("/cadastro-quadra-parte2");
    },
  },
};
</script>

<style scoped>
.pagina-cadastro {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
}

/* Header */
.header {
  width: 100%;
  background: white;
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: var(--shadow-xs);
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 0.2s;
  margin-right: auto;
}

.btn-voltar:hover {
  color: var(--foreground);
}

.progresso-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.progresso-passo {
  font-size: 11px;
  font-weight: 700;
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progresso-titulo {
  font-size: 14px;
  font-weight: 800;
  color: var(--foreground);
}

/* Conteúdo */
.conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.form-wrapper {
  width: 100%;
  max-width: 440px;
}

/* Card */
.card-cadastro {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.card-titulo {
  font-size: 24px;
  font-weight: 900;
  color: var(--foreground);
  margin-bottom: 4px;
}

.card-subtitulo {
  color: var(--muted-foreground);
  font-size: 14px;
  margin-bottom: 24px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.input-icone {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

.input-campo {
  width: 100%;
  padding: 12px 16px 12px 42px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-campo:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

/* Select custom wrapper */
.select-wrapper {
  position: relative;
}

.select-campo {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-campo:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

.select-seta {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

/* Submit */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 40;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
}

@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-foreground);
  padding: 8px 16px;
  transition: color 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  color: #475569;
}

.nav-item--ativo {
  color: var(--primary);
}
</style>
