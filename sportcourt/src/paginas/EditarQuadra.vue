<template>
  <div class="pagina">
    <TopbarDono />
    <div class="container">

      <div class="cabecalho-secao">
        <button class="btn-voltar" @click="$router.push('/confirmar-quadra')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="titulo-secao">Editar Quadra</h1>
      </div>

      <div class="grade-layouts">
        
        <!-- Coluna da Esquerda: Imagem e Dados Gerais -->
        <div class="coluna-esquerda">
          <!-- Foto -->
          <div class="foto-secao">
            <label class="foto-label">
              <input type="file" @change="carregarImagem" accept="image/*" hidden />
              <div class="foto-moldura">
                <img :src="fotoPreview || defaultImage" alt="Foto da quadra" class="foto-img" />
                <div class="foto-hover-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span>Trocar foto</span>
                </div>
              </div>
            </label>
          </div>

          <!-- Card de Dados Gerais -->
          <div class="card-formulario">
            <div class="formulario-flex">
              <div class="campo">
                <label class="campo-label">Nome da Quadra</label>
                <input type="text" v-model="nomeQuadra" class="input-campo" placeholder="Ex: Quadra do João" required />
              </div>
              <div class="campo">
                <label class="campo-label">Endereço</label>
                <input type="text" v-model="endereco" class="input-campo" placeholder="Rua, número" required />
              </div>
              <div class="campo">
                <label class="campo-label">Cidade</label>
                <input type="text" v-model="cidade" class="input-campo" placeholder="Cidade" required />
              </div>
              <div class="campo">
                <label class="campo-label">Telefone</label>
                <input type="text" v-model="telefone" class="input-campo" placeholder="(11) 99999-9999" required />
              </div>
              <div class="campo">
                <label class="campo-label">Esporte</label>
                <div class="select-wrapper">
                  <select v-model="esporte" class="select-campo" required>
                    <option disabled value="">Selecione</option>
                    <option v-for="e in esportes" :key="e" :value="e">{{ e }}</option>
                  </select>
                  <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <div class="campo">
                <label class="campo-label">Preço por hora (R$)</label>
                <input type="number" v-model="preco" class="input-campo" placeholder="0.00" required />
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Horários, Descrição e Salvar -->
        <div class="coluna-direita">
          <div class="card-formulario card-formulario--direita">
            <div class="formulario-flex">
              <div class="campo">
                <label class="campo-label">Dias de funcionamento</label>
                <div class="dias-grid">
                  <div class="select-wrapper">
                    <select v-model="diaInicio" class="select-campo" required>
                      <option disabled value="">De</option>
                      <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
                    </select>
                    <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div class="select-wrapper">
                    <select v-model="diaFim" class="select-campo" required>
                      <option disabled value="">Até</option>
                      <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
                    </select>
                    <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>

              <div class="campo">
                <label class="campo-label">Horário de funcionamento</label>
                <div class="horarios-grid">
                  <div class="select-wrapper">
                    <select v-model="horaAbertura" class="select-campo" required>
                      <option disabled value="">Abertura</option>
                      <option v-for="hora in horarios" :key="'a-'+hora" :value="hora">{{ hora }}</option>
                    </select>
                    <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div class="select-wrapper">
                    <select v-model="horaFechamento" class="select-campo" required>
                      <option disabled value="">Fechamento</option>
                      <option v-for="hora in horarios" :key="'f-'+hora" :value="hora">{{ hora }}</option>
                    </select>
                    <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>

              <div class="campo">
                <label class="campo-label">Descrição</label>
                <textarea v-model.trim="descricao" class="textarea-campo" placeholder="Descrição da quadra"></textarea>
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="botoes-acoes">
            <button class="btn-acao btn-acao--cancelar" @click="$router.push('/confirmar-quadra')">Cancelar</button>
            <button class="btn-acao btn-acao--salvar" @click="salvarEdicao">Salvar Alterações</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import TopbarDono from "@/components/TopbarDono.vue";
import { api } from "@/api";

export default {
  components: { TopbarDono },
  data() {
    return {
      nomeQuadra: "",
      endereco: "",
      cidade: "",
      telefone: "",
      preco: "",
      descricao: "",
      esporte: "",
      diaInicio: "",
      diaFim: "",
      horaAbertura: "",
      horaFechamento: "",
      fotoPreview: "",
      fotoArquivo: null,
      defaultImage: require("@/assets/perfil.png"),
      diasSemana: ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"],
      horarios: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2,"0")}:00`),
      esportes: ["Futebol", "Futsal", "Society", "Beach Tennis", "Vôlei", "Basquete", "Tênis", "Padel", "Outro"]
    };
  },
  async mounted() {
    const quadraId = localStorage.getItem("quadraId");
    if (!quadraId) return;
    try {
      const q = await api.getQuadra(quadraId);
      this.nomeQuadra = q.nomeQuadra || "";
      this.endereco = q.endereco || "";
      this.cidade = q.cidade || "";
      this.telefone = q.telefone || "";
      this.preco = q.preco || "";
      this.descricao = q.descricao || "";
      this.esporte = q.esporte || "";
      this.fotoPreview = q.fotoUrl ? (q.fotoUrl.startsWith('http') ? q.fotoUrl : `http://localhost:3006${q.fotoUrl}`) : "";
      if (q.horario) {
        const [dias, horas] = q.horario.split(",");
        const [diaInicio, diaFim] = dias.split(" até ").map(s => s.trim());
        const [horaAbertura, horaFechamento] = horas.split(" às ").map(s => s.trim());
        this.diaInicio = diaInicio;
        this.diaFim = diaFim;
        this.horaAbertura = horaAbertura;
        this.horaFechamento = horaFechamento;
      }
    } catch (err) {
      console.error("Erro ao carregar quadra:", err);
    }
  },
  methods: {
    carregarImagem(e) {
      const file = e.target.files[0];
      if (file) { this.fotoArquivo = file; this.fotoPreview = URL.createObjectURL(file); }
    },
    async salvarEdicao() {
      try {
        const quadraId = localStorage.getItem("quadraId");
        const horario = `${this.diaInicio} até ${this.diaFim}, ${this.horaAbertura} às ${this.horaFechamento}`;
        await api.atualizarQuadra(quadraId, {
          nomeQuadra: this.nomeQuadra,
          endereco: this.endereco,
          cidade: this.cidade,
          telefone: this.telefone,
          preco: this.preco,
          descricao: this.descricao,
          esporte: this.esporte,
          horario
        }, this.fotoArquivo);
        alert("Quadra atualizada com sucesso!");
        this.$router.push("/confirmar-quadra");
      } catch (err) {
        console.error("Erro ao salvar:", err);
        alert("Erro ao salvar alterações.");
      }
    }
  }
};
</script>

<style scoped>
.pagina {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  padding-bottom: 32px;
}

.container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px;
}

.cabecalho-secao {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1.5px solid var(--border);
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #f8fafc;
  transform: none;
  box-shadow: none;
}

.titulo-secao {
  font-size: 18px;
  font-weight: 800;
  color: var(--foreground);
}

.grade-layouts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .grade-layouts {
    grid-template-columns: 1fr 1fr;
  }
}

/* Coluna esquerda */
.coluna-esquerda,
.coluna-direita {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.coluna-direita {
  justify-content: space-between;
}

/* Foto */
.foto-secao {
  width: 100%;
}

.foto-label {
  cursor: pointer;
  display: block;
}

.foto-moldura {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-xs);
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.foto-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
}

.foto-label:hover .foto-hover-overlay {
  opacity: 1;
}

/* Card formulário */
.card-formulario {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.card-formulario--direita {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.formulario-flex {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
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

.input-campo {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-campo:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Select */
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
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-seta {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
}

/* Grids */
.dias-grid,
.horarios-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Textarea */
.textarea-campo {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.textarea-campo:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Botoes de Ação */
.botoes-acoes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-acao {
  width: 100%;
  padding: 14px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-acao:hover {
  transform: none;
  box-shadow: none;
}

.btn-acao--cancelar {
  background: var(--muted);
  color: #475569;
}

.btn-acao--cancelar:hover {
  background: #e2e8f0;
}

.btn-acao--salvar {
  background: var(--gradient-accent);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-acao--salvar:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}
</style>
