// src/api.js
// Esta API substitui as chamadas do Firebase no Frontend

const API_URL = 'http://localhost:3006/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- AUTENTICAÇÃO ---
  async login(email, senha) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao registrar');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Sessão expirada ou acesso negado');
    return await res.json();
  },

  async atualizarPerfil(dados, arquivoFoto) {
    const headers = getHeaders();
    let body;

    if (arquivoFoto) {
      delete headers['Content-Type'];
      body = new FormData();
      body.append('nome', dados.nome);
      body.append('nomeUsuario', dados.nomeUsuario);
      body.append('telefone', dados.telefone);
      if (dados.cpf) body.append('cpf', dados.cpf);
      if (dados.genero) body.append('genero', dados.genero);
      if (dados.dataNascimento) body.append('dataNascimento', dados.dataNascimento);
      body.append('foto', arquivoFoto);
    } else {
      body = JSON.stringify(dados);
    }

    const res = await fetch(`${API_URL}/auth/perfil`, {
      method: 'PUT',
      headers,
      body
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar perfil');
    return data;
  },

  // --- QUADRAS ---
  async getQuadras() {
    const res = await fetch(`${API_URL}/quadras`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao carregar quadras');
    return await res.json();
  },

  async getQuadra(id) {
    const res = await fetch(`${API_URL}/quadras/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao carregar quadra');
    return await res.json();
  },

  async getQuadraOcupacoes(id) {
    const res = await fetch(`${API_URL}/quadras/${id}/ocupacoes`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao carregar ocupações');
    return await res.json();
  },

  async createQuadra(dados, arquivoFoto) {
    const headers = getHeaders();
    let body;

    if (arquivoFoto) {
      delete headers['Content-Type'];
      body = new FormData();
      Object.keys(dados).forEach(key => body.append(key, dados[key]));
      body.append('foto', arquivoFoto);
    } else {
      body = JSON.stringify(dados);
    }

    const res = await fetch(`${API_URL}/quadras`, {
      method: 'POST',
      headers,
      body
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar quadra');
    return data;
  },

  async atualizarQuadra(id, dados, arquivoFoto) {
    const headers = getHeaders();
    let body;

    if (arquivoFoto) {
      delete headers['Content-Type'];
      body = new FormData();
      Object.keys(dados).forEach(key => body.append(key, dados[key]));
      body.append('foto', arquivoFoto);
    } else {
      body = JSON.stringify(dados);
    }

    const res = await fetch(`${API_URL}/quadras/${id}`, {
      method: 'PUT',
      headers,
      body
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar quadra');
    return data;
  },

  // --- HORÁRIOS OCUPADOS ---
  async getHorariosOcupados(quadraId, data) {
    const url = data
      ? `${API_URL}/quadras/${quadraId}/horarios-ocupados?data=${data}`
      : `${API_URL}/quadras/${quadraId}/horarios-ocupados`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar horários ocupados');
    return await res.json();
  },

  async marcarHorarioOcupado(quadraId, data, horario) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/horarios-ocupados`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data, horario })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao marcar horário');
    return result;
  },

  async desmarcarHorarioOcupado(quadraId, id) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/horarios-ocupados/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao desmarcar horário');
    return result;
  },

  // --- DATAS OCUPADAS ---
  async getDatasOcupadas(quadraId) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/datas-ocupadas`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao carregar datas ocupadas');
    return await res.json();
  },

  async marcarDataOcupada(quadraId, data) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/datas-ocupadas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao marcar data');
    return result;
  },

  async desmarcarDataOcupada(quadraId, id) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/datas-ocupadas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao desmarcar data');
    return result;
  },

  // --- RESERVAS ---
  async getReservas() {
    const res = await fetch(`${API_URL}/reservas`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao carregar reservas');
    return await res.json();
  },

  async createReserva(reservaData) {
    const res = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservaData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao fazer reserva');
    return data;
  },

  async confirmarReserva(id) {
    const res = await fetch(`${API_URL}/reservas/${id}/confirmar`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao confirmar reserva');
    return data;
  },

  async concluirReserva(id) {
    const res = await fetch(`${API_URL}/reservas/${id}/concluir`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao concluir reserva');
    return data;
  },

  async cancelarReserva(id) {
    const res = await fetch(`${API_URL}/reservas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao cancelar reserva');
    return data;
  },

  // --- AVALIAÇÕES ---
  async getAvaliacoesQuadra(quadraId) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/avaliacoes`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao buscar avaliações');
    return await res.json();
  },

  async avaliarQuadra(quadraId, estrelas, mensagem) {
    const res = await fetch(`${API_URL}/quadras/${quadraId}/avaliar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ estrelas, mensagem: mensagem || null })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao avaliar quadra');
    return data;
  },

  // --- LISTA DE JOGADORES ---
  async atualizarListaJogadores(reservaId, jogadoresLista, jogadoresListaB) {
    const res = await fetch(`${API_URL}/reservas/${reservaId}/jogadores`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ jogadoresLista, jogadoresListaB })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar lista de jogadores');
    return data;
  },

  // --- STATUS DE PAGAMENTO ---
  async atualizarStatusPagamento(reservaId, statusPagamento) {
    const res = await fetch(`${API_URL}/reservas/${reservaId}/status-pagamento`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ statusPagamento })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar status de pagamento');
    return data;
  },

  // --- MÚLTIPLAS QUADRAS ---
  async getMinhasQuadras() {
    const res = await fetch(`${API_URL}/quadras/minhas`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao carregar suas quadras');
    return await res.json();
  },

  // --- CONTRA OUTRO TIME ---
  async getContraTimeAguardandoDia(quadraId, data) {
    const url = `${API_URL}/reservas/contra-time-aguardando-dia?quadraId=${encodeURIComponent(quadraId)}&data=${encodeURIComponent(data)}`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) return { slots: {} };
    return await res.json();
  },

  async getContraTimeAguardando(quadraId, data, horario) {
    const url = `${API_URL}/reservas/contra-time-aguardando?quadraId=${encodeURIComponent(quadraId)}&data=${encodeURIComponent(data)}&horario=${encodeURIComponent(horario)}`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) return { aguardando: false };
    return await res.json();
  },

  async entrarContraTime(reservaId, dados) {
    const res = await fetch(`${API_URL}/reservas/${reservaId}/entrar-contra-time`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao entrar na partida');
    return data;
  },

  async editarJogador(reservaId, dados) {
    const res = await fetch(`${API_URL}/reservas/${reservaId}/editar-jogador`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao editar informações');
    return data;
  },

  async atualizarTipoJogo(reservaId, tipoJogo) {
    const res = await fetch(`${API_URL}/reservas/${reservaId}/tipo-jogo`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ tipoJogo })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar tipo de jogo');
    return data;
  },

  // --- CHAT ---
  async getChatMensagens(quadraId) {
    const res = await fetch(`${API_URL}/chat/${quadraId}`, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar mensagens');
    return await res.json();
  },

  async getChatThreads(quadraId) {
    const res = await fetch(`${API_URL}/chat/${quadraId}/threads`, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar conversas');
    return await res.json();
  },

  async getChatThreadJogador(quadraId, jogadorId) {
    const res = await fetch(`${API_URL}/chat/${quadraId}/jogador/${jogadorId}`, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar conversa');
    return await res.json();
  },

  async enviarMensagem(quadraId, texto, autorNome) {
    const res = await fetch(`${API_URL}/chat/${quadraId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ texto, autorNome })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem');
    return data;
  },

  async marcarMensagensLidas(quadraId, jogadorId) {
    const res = await fetch(`${API_URL}/chat/${quadraId}/lida`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ jogadorId })
    });
    return await res.json();
  },

  // --- DASHBOARD / KPIS ---
  async getDashboardKpis(mes) {
    const url = mes ? `${API_URL}/dashboard/kpis?mes=${mes}` : `${API_URL}/dashboard/kpis`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar KPIs');
    return await res.json();
  },

  async getDashboardSerieDiaria(mes) {
    const url = mes ? `${API_URL}/dashboard/serie-diaria?mes=${mes}` : `${API_URL}/dashboard/serie-diaria`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar faturamento diário');
    return await res.json();
  },

  async getDashboardHorariosPopulares(mes) {
    const url = mes ? `${API_URL}/dashboard/horarios-populares?mes=${mes}` : `${API_URL}/dashboard/horarios-populares`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar horários populares');
    return await res.json();
  },

  async getCRMClientes(quadraId) {
    const res = await fetch(`${API_URL}/dashboard/clientes/${quadraId}`, { method: 'GET', headers: getHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar clientes');
    return await res.json();
  }
};

