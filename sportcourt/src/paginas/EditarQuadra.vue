<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans pb-8">
    <TopbarDono />
    <div class="max-w-4xl w-full mx-auto px-4 py-8">

      <div class="flex items-center gap-3 mb-6">
        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer" @click="$router.push('/confirmar-quadra')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar
        </button>
        <h1 class="text-lg font-extrabold text-slate-900">Editar Quadra</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Coluna da Esquerda: Imagem e Dados Gerais -->
        <div class="flex flex-col gap-6">
          <!-- Foto -->
          <div>
            <label class="cursor-pointer block group">
              <input type="file" @change="carregarImagem" accept="image/*" hidden />
              <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                <img :src="fotoPreview || defaultImage" alt="Foto da quadra" class="w-full h-full object-cover block" />
                <div class="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-2 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Trocar foto
                </div>
              </div>
            </label>
          </div>

          <!-- Card de Dados Gerais -->
          <div class="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nome da Quadra</label>
                <input type="text" v-model="nomeQuadra" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ex: Quadra do João" required />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Endereço</label>
                <input type="text" v-model="endereco" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" placeholder="Rua, número" required />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Cidade</label>
                <input type="text" v-model="cidade" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" placeholder="Cidade" required />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Telefone</label>
                <input type="text" v-model="telefone" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" placeholder="(11) 99999-9999" required />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Esporte</label>
                <select v-model="esporte" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer" required>
                  <option disabled value="">Selecione</option>
                  <option v-for="e in esportes" :key="e" :value="e">{{ e }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Preço por hora (R$)</label>
                <input type="number" v-model="preco" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400" placeholder="0.00" required />
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Horários, Descrição e Salvar -->
        <div class="flex flex-col gap-6 justify-between">
          <div class="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-card flex-1 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Dias de funcionamento</label>
                <div class="grid grid-cols-2 gap-3">
                  <select v-model="diaInicio" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer" required>
                    <option disabled value="">De</option>
                    <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
                  </select>
                  <select v-model="diaFim" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer" required>
                    <option disabled value="">Até</option>
                    <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
                  </select>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Horário de funcionamento</label>
                <div class="grid grid-cols-2 gap-3">
                  <select v-model="horaAbertura" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer" required>
                    <option disabled value="">Abertura</option>
                    <option v-for="hora in horarios" :key="'a-'+hora" :value="hora">{{ hora }}</option>
                  </select>
                  <select v-model="horaFechamento" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 appearance-none cursor-pointer" required>
                    <option disabled value="">Fechamento</option>
                    <option v-for="hora in horarios" :key="'f-'+hora" :value="hora">{{ hora }}</option>
                  </select>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Descrição</label>
                <textarea v-model.trim="descricao" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all text-slate-800 font-medium placeholder:text-slate-400 min-h-[100px] resize-y" placeholder="Descrição da quadra"></textarea>
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="grid grid-cols-2 gap-3">
            <button class="w-full py-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold rounded-xl transition-all text-sm cursor-pointer mt-0 shadow-none hover:scale-100" @click="$router.push('/confirmar-quadra')">Cancelar</button>
            <button class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm cursor-pointer mt-0" @click="salvarEdicao">Salvar Alterações</button>
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


