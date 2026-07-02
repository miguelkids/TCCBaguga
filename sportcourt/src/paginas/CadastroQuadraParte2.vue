<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">

    <!-- Header -->
    <header class="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm">
      <button @click="voltarPasso"
        class="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mr-auto bg-transparent border-none cursor-pointer p-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </button>
      <div class="absolute left-1/2 -translate-x-1/2 text-center">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Passo 2 de 2</span>
        <p v-if="!modoAdicionar && totalQuadras > 1" class="text-sm font-extrabold text-slate-800">
          Quadra {{ quadraAtual + 1 }} de {{ totalQuadras }}
        </p>
        <p v-else class="text-sm font-extrabold text-slate-800">{{ modoAdicionar ? 'Nova Quadra' : 'Configurar Quadra' }}</p>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center px-6 py-8">
      <div class="w-full max-w-sm">

        <!-- Indicador de progresso (múltiplas quadras) -->
        <div v-if="!modoAdicionar && totalQuadras > 1" class="flex justify-center gap-2 mb-6">
          <div v-for="i in totalQuadras" :key="i"
            class="w-2.5 h-2.5 rounded-full transition-all"
            :class="i - 1 === quadraAtual ? 'bg-emerald-500 scale-125' : 'bg-slate-300'">
          </div>
        </div>

        <!-- Foto da Quadra -->
        <div class="flex flex-col items-center mb-6">
          <label class="relative cursor-pointer group block">
            <input type="file" accept="image/*" @change="carregarImagem" hidden />
            <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-md group-hover:border-emerald-500 transition-all">
              <img :src="quadraAtualObj.fotoPreview || defaultImage" alt="Foto da quadra" class="w-full h-full object-cover block" />
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </label>
          <p class="text-xs text-slate-400 mt-3 font-medium">Toque para adicionar foto</p>
        </div>

        <!-- Formulário da Quadra -->
        <div class="flex flex-col gap-4">
          <!-- Esporte -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Esporte *</label>
            <select v-model="quadraAtualObj.esporte"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
              <option value="">Selecione o esporte</option>
              <option v-for="e in esportes" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>

          <!-- Preço por hora -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Preço por hora (R$) *</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">R$</span>
              <input type="number" v-model="quadraAtualObj.preco" placeholder="0,00" min="0" step="0.01"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <!-- Dias de funcionamento -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Dias de funcionamento</label>
            <div class="flex gap-2">
              <select v-model="quadraAtualObj.diaInicio"
                class="flex-1 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                <option v-for="d in diasSemana" :key="d" :value="d">{{ d }}</option>
              </select>
              <span class="flex items-center text-slate-400 font-semibold text-sm">até</span>
              <select v-model="quadraAtualObj.diaFim"
                class="flex-1 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                <option v-for="d in diasSemana" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>

          <!-- Horários de funcionamento -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Horário de funcionamento</label>
            <div class="flex gap-2 items-center">
              <select v-model="quadraAtualObj.horaAbre"
                class="flex-1 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
              </select>
              <span class="text-slate-400 font-semibold text-sm">às</span>
              <select v-model="quadraAtualObj.horaFecha"
                class="flex-1 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>

          <!-- Descrição (apenas primeira quadra) -->
          <div v-if="quadraAtual === 0" class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Descrição do espaço</label>
            <textarea v-model="quadraAtualObj.descricao" placeholder="Descreva sua arena (opcional)..." rows="3"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 resize-none"></textarea>
          </div>

          <button @click="avancarOuSalvar" :disabled="salvando"
            class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-65 disabled:pointer-events-none mt-2">
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
