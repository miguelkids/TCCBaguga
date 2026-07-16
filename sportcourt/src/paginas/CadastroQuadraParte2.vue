<template>
  <div class="pagina-cadastro">

    <!-- Header -->
    <header class="header">
      <button @click="voltarPasso" class="btn-voltar">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </button>
      <div class="progresso-wrapper">
        <span class="progresso-passo">Passo 2 de 2</span>
        <p v-if="!modoAdicionar && totalQuadras > 1" class="progresso-titulo">
          Quadra {{ quadraAtual + 1 }} de {{ totalQuadras }}
        </p>
        <p v-else class="progresso-titulo">{{ modoAdicionar ? 'Nova Quadra' : 'Configurar Quadra' }}</p>
      </div>
    </header>

    <main class="conteudo">
      <div class="form-wrapper">

        <!-- Indicador de progresso (múltiplas quadras) -->
        <div v-if="!modoAdicionar && totalQuadras > 1" class="pontos-progresso">
          <div v-for="i in totalQuadras" :key="i"
            class="ponto"
            :class="i - 1 === quadraAtual ? 'ponto--ativo' : ''">
          </div>
        </div>

        <!-- Foto da Quadra -->
        <div class="upload-foto-secao">
          <label class="upload-label">
            <input type="file" accept="image/*" @change="carregarImagem" hidden />
            <div class="foto-moldura">
              <img :src="quadraAtualObj.fotoPreview || defaultImage" alt="Foto da quadra" class="foto-img" />
            </div>
            <div class="upload-icone-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </label>
          <p class="upload-dica">Toque para adicionar foto</p>
        </div>

        <!-- Formulário da Quadra -->
        <div class="card-cadastro">
          <!-- Esporte -->
          <div class="campo">
            <label class="campo-label">Esporte *</label>
            <div class="select-wrapper">
              <select v-model="quadraAtualObj.esporte" class="select-campo">
                <option value="">Selecione o esporte</option>
                <option v-for="e in esportes" :key="e" :value="e">{{ e }}</option>
              </select>
              <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <!-- Preço por hora -->
          <div class="campo">
            <label class="campo-label">Preço por hora (R$) *</label>
            <div class="input-wrapper">
              <span class="preco-prefixo">R$</span>
              <input type="number" v-model="quadraAtualObj.preco" placeholder="0,00" min="0" step="0.01" class="input-campo input-campo--preco" />
            </div>
          </div>

          <!-- Dias de funcionamento -->
          <div class="campo">
            <label class="campo-label">Dias de funcionamento</label>
            <div class="dias-flex">
              <div class="select-wrapper flex-1">
                <select v-model="quadraAtualObj.diaInicio" class="select-campo">
                  <option v-for="d in diasSemana" :key="d" :value="d">{{ d }}</option>
                </select>
                <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <span class="dias-divisao">até</span>
              <div class="select-wrapper flex-1">
                <select v-model="quadraAtualObj.diaFim" class="select-campo">
                  <option v-for="d in diasSemana" :key="d" :value="d">{{ d }}</option>
                </select>
                <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <!-- Horários de funcionamento -->
          <div class="campo">
            <label class="campo-label">Horário de funcionamento</label>
            <div class="horarios-flex">
              <div class="select-wrapper flex-1">
                <select v-model="quadraAtualObj.horaAbre" class="select-campo">
                  <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                </select>
                <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <span class="horarios-divisao">às</span>
              <div class="select-wrapper flex-1">
                <select v-model="quadraAtualObj.horaFecha" class="select-campo">
                  <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                </select>
                <svg class="select-seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <!-- Descrição (apenas primeira quadra) -->
          <div v-if="quadraAtual === 0" class="campo">
            <label class="campo-label">Descrição do espaço</label>
            <textarea v-model="quadraAtualObj.descricao" placeholder="Descreva sua arena (opcional)..." rows="3" class="textarea-campo"></textarea>
          </div>

          <button @click="avancarOuSalvar" :disabled="salvando" class="btn-submit">
            {{ salvando ? 'Salvando...' : (quadraAtual < totalQuadras - 1 ? 'Próxima Quadra' : (modoAdicionar ? 'Adicionar Quadra' : 'Concluir Cadastro')) }}
          </button>
        </div>
      </div>
    </main>

  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "CadastroQuadraParte2",
  data() {
    return {
      modoAdicionar: false,
      quadraAtual: 0,
      totalQuadras: 1,
      salvando: false,
      defaultImage: require("@/assets/perfil.png"),
      esportes: ["Futebol", "Futsal", "Society", "Beach Tennis", "Vôlei", "Basquete", "Tênis", "Padel", "Outro"],
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horarios: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
      quadras: [],
    };
  },
  computed: {
    quadraAtualObj() {
      return this.quadras[this.quadraAtual] || {};
    },
  },
  mounted() {
    const parte1 = JSON.parse(localStorage.getItem("cadastroQuadraParte1") || "{}");
    this.modoAdicionar = !!this.$route.query.adicionar;
    this.totalQuadras = this.modoAdicionar ? 1 : (parte1.quantidadeQuadras || 1);
    this.quadras = Array.from({ length: this.totalQuadras }, () => ({
      esporte: "",
      preco: "",
      diaInicio: "Segunda",
      diaFim: "Domingo",
      horaAbre: "08:00",
      horaFecha: "22:00",
      descricao: "",
      fotoPreview: null,
      fotoFile: null,
    }));
  },
  methods: {
    carregarImagem(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.quadras[this.quadraAtual].fotoFile = file;
      this.quadras[this.quadraAtual].fotoPreview = URL.createObjectURL(file);
    },
    voltarPasso() {
      if (this.quadraAtual > 0) {
        this.quadraAtual--;
      } else if (this.modoAdicionar) {
        this.$router.push("/minhas-quadras");
      } else {
        this.$router.push("/cadastro-quadra-parte1");
      }
    },
    avancarOuSalvar() {
      const q = this.quadras[this.quadraAtual];
      if (!q.esporte || !q.preco) {
        alert("Preencha o esporte e o preço por hora.");
        return;
      }
      if (this.quadraAtual < this.totalQuadras - 1) {
        this.quadraAtual++;
      } else {
        this.salvarTodasQuadras();
      }
    },
    async salvarTodasQuadras() {
      this.salvando = true;
      try {
        const parte1 = JSON.parse(localStorage.getItem("cadastroQuadraParte1") || "{}");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        for (const q of this.quadras) {
          const horario = `${q.diaInicio} até ${q.diaFim}, ${q.horaAbre} às ${q.horaFecha}`;
          const dados = {
            nomeQuadra: parte1.nomeQuadra || "",
            endereco: parte1.endereco || "",
            cidade: parte1.cidade || "",
            telefone: parte1.telefone || "",
            esporte: q.esporte,
            preco: q.preco,
            horario,
            descricao: q.descricao || "",
            donoId: user.id,
          };
          await api.createQuadra(dados, q.fotoFile);
        }

        const minhasQuadras = await api.getMinhasQuadras();
        if (minhasQuadras.length > 0) {
          localStorage.setItem("quadraId", minhasQuadras[0].id);
          localStorage.setItem("quadraInfo", JSON.stringify(minhasQuadras[0]));
        }
        this.$router.push("/minhas-quadras");
      } catch (err) {
        alert("Erro ao salvar: " + (err.message || "Tente novamente."));
      } finally {
        this.salvando = false;
      }
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
  padding-bottom: 48px;
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
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
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
  margin-top: 2px;
}

/* Conteúdo */
.conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
}

.form-wrapper {
  width: 100%;
  max-width: 440px;
}

/* Pontos de progresso */
.pontos-progresso {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.ponto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.2s;
}

.ponto--ativo {
  background: var(--primary);
  transform: scale(1.2);
}

/* Upload foto */
.upload-foto-secao {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.upload-label {
  position: relative;
  cursor: pointer;
  display: block;
}

.foto-moldura {
  width: 96px;
  height: 96px;
  border-radius: 20px;
  overflow: hidden;
  border: 2.5px solid rgba(34, 197, 94, 0.3);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s;
}

.upload-label:hover .foto-moldura {
  border-color: var(--primary);
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.upload-icone-wrapper {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 32px;
  height: 32px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.upload-dica {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
  margin-top: 10px;
}

/* Card */
.card-cadastro {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-xs);
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

.preco-prefixo {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  font-weight: 700;
  font-size: 14px;
}

.input-campo {
  width: 100%;
  padding: 12px 16px 12px 16px;
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-campo--preco {
  padding-left: 38px;
}

.input-campo:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
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

/* Flex layouts */
.dias-flex,
.horarios-flex {
  display: flex;
  gap: 8px;
}

.flex-1 {
  flex: 1;
}

.dias-divisao,
.horarios-divisao {
  display: flex;
  align-items: center;
  color: var(--muted-foreground);
  font-weight: 600;
  font-size: 14px;
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
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.textarea-campo:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
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
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-submit:disabled {
  opacity: 0.65;
  pointer-events: none;
}
</style>
