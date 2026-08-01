import { createRouter, createWebHistory } from 'vue-router'

// Importações com lazy loading (recomendado para performance)
const PaginaInicial = () => import('../paginas/PaginaHome.vue')
const PaginaLogin = () => import('../paginas/PaginaLogin.vue')
const PaginaCadastroJogador = () => import('../paginas/CadastroJogador.vue')
const PaginaEscolherPerfil = () => import('../paginas/EscolherPerfil.vue')
const PaginaReserva = () => import('../paginas/PaginaReserva.vue')
const PaginaCadastroDono = () => import('../paginas/CadastroDono.vue') 
const PaginaCadastroQuadra1 = () => import('../paginas/CadastroQuadraParte1.vue')
const PaginaCadastroQuadra2 = () => import('../paginas/CadastroQuadraParte2.vue')
const PaginaConfirmarQuadra = () => import('../paginas/ConfirmarQuadra.vue')
const PaginaMenuQuadra = () => import('../paginas/MenuQuadra.vue')
const PaginaEditarDatas = () => import('../paginas/EditarDatas.vue')
const PaginaEditarHorarios = () => import('../paginas/EditarHorarios.vue')
const PaginaReservasDono = () => import('../paginas/ReservasDono.vue')
const PaginaReservaDetalhesDono = () => import('../paginas/ReservaDetalhesDono.vue')
const PaginaPerfilDono = () => import('../paginas/PerfilDono.vue')
const PaginaEditarQuadra = () => import('../paginas/EditarQuadra.vue')
const PaginaFinalizarReserva = () => import('../paginas/FinalizarReserva.vue')
const PaginaEditarDataHorario = () => import('../paginas/EditarDataHorario.vue')
const PaginaMenuJogador = () => import('../paginas/MenuJogador.vue')
const PaginaContaJogador = () => import('../paginas/ContaJogador.vue')
const PaginaFaturamentoDono = () => import('../paginas/FaturamentoDono.vue')
const PaginaMinhasQuadras = () => import('../paginas/MinhasQuadras.vue')
const rotas = [
  {
    path: '/',
    name: 'Inicio',
    component: PaginaInicial,
    meta: { requerAutenticacao: false } // Adicione metadados para controle de acesso
  },
  {
    path: '/login',
    name: 'Login',
    component: PaginaLogin,
    meta: { requerAutenticacao: false }
  },
  {
    path: '/cadastro-jogador', 
    name: 'CadastroJogador',
    component: PaginaCadastroJogador,
    meta: { requerAutenticacao: false }
  },
  {
    path: '/escolher-perfil', 
    name: 'EscolherPerfil',
    component: PaginaEscolherPerfil,
    meta: { requerAutenticacao: false }
  },
  {
    path: '/reserva',
    name: 'Reservas',
    component: PaginaReserva,
    meta: { requerAutenticacao: true } // Exige login
  },
  {
    path: '/cadastro-dono', 
    name: 'CadastroDono',
    component: PaginaCadastroDono,
    meta: { requerAutenticacao: false }
  },
  {
    path: '/cadastro-quadra-parte1',
    name: 'CadastroQuadraParte1',
    component: PaginaCadastroQuadra1,
    meta: { requerAutenticacao: true }
  },
  {
    path: '/cadastro-quadra-parte2',
    name: 'CadastroQuadraParte2',
    component: PaginaCadastroQuadra2,
    meta: { requerAutenticacao: true }
  },
  {
    path: '/confirmar-quadra',
    name: 'ConfirmarQuadra',
    component: PaginaConfirmarQuadra,
    meta: { requerAutenticacao: true }
  },
  {
    path: '/menu-quadra',
    name: 'MenuQuadra',
    component: PaginaMenuQuadra,
    meta: { requerAutenticacao: true }
  },
  {
    path: '/editar-datas',
    name: 'EditarDatas',
    component: PaginaEditarDatas,
    meta: { requerAutenticacao: true }
  },
  {
    path: '/editar-horarios',
    name: 'EditarHorarios',
    component: PaginaEditarHorarios,
    meta: { requerAutenticacao: true }
  },
  {
    path: '/reservas',
    name: 'ReservasDono',
    component: PaginaReservasDono,
    meta: { requerAutenticacao: true}
  },
  {
    path: '/reserva-detalhes-dono',
    name: 'ReservaDetalhesDono',
    component: PaginaReservaDetalhesDono,
    meta: { requerAutenticacao: true}
  },
  {
    path: '/perfil',
    name: 'ReservaPerfilDono',
    component: PaginaPerfilDono,
    meta: { requerAutenticacao: false}
  },
  {
    path: '/editar-quadra',
    name: 'EditarQuadra',
    component: PaginaEditarQuadra,
    meta: { requerAutenticacao: true}
  },
  {
    path: '/finalizar-reserva',
    name: 'FinalizarReserva',
    component: PaginaFinalizarReserva,
    meta: { requerAutenticacao: true}
  },
  {
    path: '/editar-data-horario',
    name: 'EditarDataHorario',
    component: PaginaEditarDataHorario,
    meta: { requerAutenticacao: true}
  },
  {
    path: '/menu-jogador',
    name: 'MenuJogador',
    component: PaginaMenuJogador,
    meta: { requerAutenticacao: true}
  },
  {
    path: '/conta-jogador',
    name: 'ContaJogador',
    component: PaginaContaJogador,
    meta: {requerAutenticacao: true}
  },
  {
    path: '/faturamento-dono',
    name: 'FaturamentoDono',
    component: PaginaFaturamentoDono,
    meta: {requerAutenticacao: true}
  },
  {
    path: '/minhas-quadras',
    name: 'MinhasQuadras',
    component: PaginaMinhasQuadras,
    meta: {requerAutenticacao: true}
  },
  {
    path: '/crm-clientes',
    name: 'CRMClientes',
    component: () => import('../paginas/CRMClientes.vue'),
    meta: {requerAutenticacao: true}
  },
  {
    path: '/chat-dono',
    name: 'ChatDono',
    component: () => import('../paginas/ChatDono.vue'),
    meta: {requerAutenticacao: true}
  },
  {
    path: '/avisos-politicas',
    name: 'AvisosPoliticas',
    component: () => import('../paginas/AvisosPoliticas.vue'),
    meta: {requerAutenticacao: true}
  },
  {
    path: '/subcontas',
    name: 'Subcontas',
    component: () => import('../paginas/Subcontas.vue'),
    meta: {requerAutenticacao: true}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: rotas
})

// Guarda de navegação (protege rotas que exigem autenticação)
router.beforeEach((to, from, next) => {
  const usuarioAutenticado = localStorage.getItem('token') // Simples verificação
  const rotaProtegida = to.matched.some(record => record.meta.requerAutenticacao)

  if (rotaProtegida && !usuarioAutenticado) {
    next('/login') // Redireciona para login se não autenticado
  } else {
    next() // Permite acesso
  }
})

export default router
