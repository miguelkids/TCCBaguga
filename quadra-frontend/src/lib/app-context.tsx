import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Role = "jogador" | "dono";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  telefone?: string;
  cidade?: string;
  avatarUrl?: string;
}

export interface Avaliacao {
  id: string;
  autor: string;
  nota: number;
  comentario: string;
  data: string;
}

export interface Quadra {
  id: string;
  nome: string;
  donoId: string;
  cidade: string;
  endereco: string;
  esporte: string;
  preco: number;
  rating: number;
  fotoUrl: string;
  descricao: string;
  avaliacoes: Avaliacao[];
  horariosOcupados: string[]; // formato "YYYY-MM-DD-HH"
}

export interface Reserva {
  id: string;
  quadraId: string;
  quadraNome: string;
  quadraFoto: string;
  jogadorId: string;
  jogadorNome: string;
  jogadorIdB?: string;
  nomeJogadorB?: string;
  telefoneJogador?: string;
  telefoneJogadorB?: string;
  nomeTime?: string;
  nomeTimeB?: string;
  tipoJogo?: "simples" | "contra_time";
  data: string; // YYYY-MM-DD
  horario: string; // HH:00
  preco: number;
  status: "pendente" | "confirmada" | "concluida" | "cancelada";
  statusPagamento?: "pago" | "pendente";
}

interface AppState {
  user: User | null;
  quadras: Quadra[];
  reservas: Reserva[];
  login: (email: string, role: Role) => void;
  signup: (data: Omit<User, "id">) => void;
  logout: () => void;
  addQuadra: (q: Omit<Quadra, "id" | "donoId" | "rating" | "avaliacoes" | "horariosOcupados">) => Quadra;
  updateQuadra: (id: string, data: Partial<Quadra>) => void;
  toggleHorarioOcupado: (quadraId: string, slot: string) => void;
  addReserva: (r: Omit<Reserva, "id" | "status">) => Reserva;
  cancelReserva: (id: string) => void;
  updateReserva: (id: string, dados: { jogadorNome: string; telefone: string; nomeTime: string }) => void;
  concluirReserva: (id: string) => void;
  updateReservaPagamento: (id: string, statusPagamento: "pago" | "pendente") => void;
}

const AppContext = createContext<AppState | null>(null);

import courtSoccer from "@/assets/court-soccer.jpg";
import courtBasketball from "@/assets/court-basketball.jpg";
import courtVolleyball from "@/assets/court-volleyball.jpg";
import courtTennis from "@/assets/court-tennis.jpg";

const SEED_QUADRAS: Quadra[] = [
  {
    id: "q1", donoId: "dono-demo", nome: "Arena Verde Society", cidade: "São Paulo",
    endereco: "Rua das Palmeiras, 123 — Vila Madalena",
    esporte: "Futebol Society", preco: 120, rating: 4.8, fotoUrl: courtSoccer,
    descricao: "Campo de grama sintética profissional, iluminação LED, vestiários e estacionamento.",
    avaliacoes: [
      { id: "a1", autor: "Carlos M.", nota: 5, comentario: "Campo impecável, recomendo!", data: "2025-04-10" },
      { id: "a2", autor: "Pedro L.", nota: 5, comentario: "Melhor da região.", data: "2025-04-02" },
      { id: "a3", autor: "Lucas S.", nota: 4, comentario: "Boa estrutura, só faltou água gelada.", data: "2025-03-25" },
    ],
    horariosOcupados: ["2026-05-02-19", "2026-05-03-20"],
  },
  {
    id: "q2", donoId: "dono-demo", nome: "Hoops Center", cidade: "São Paulo",
    endereco: "Av. Paulista, 2000",
    esporte: "Basquete", preco: 90, rating: 4.6, fotoUrl: courtBasketball,
    descricao: "Quadra coberta de basquete com piso de madeira oficial.",
    avaliacoes: [{ id: "a4", autor: "Ana", nota: 5, comentario: "Quadra top!", data: "2025-04-15" }],
    horariosOcupados: [],
  },
  {
    id: "q3", donoId: "dono-demo", nome: "Praia & Areia", cidade: "Rio de Janeiro",
    endereco: "Av. Atlântica, 500 — Copacabana",
    esporte: "Vôlei de Praia", preco: 80, rating: 4.9, fotoUrl: courtVolleyball,
    descricao: "Quadra de areia à beira-mar com vista incrível.",
    avaliacoes: [{ id: "a5", autor: "Marina", nota: 5, comentario: "Vista linda!", data: "2025-04-12" }],
    horariosOcupados: [],
  },
  {
    id: "q4", donoId: "outro", nome: "Clube do Saibro", cidade: "Belo Horizonte",
    endereco: "Rua dos Esportes, 88",
    esporte: "Tênis", preco: 100, rating: 4.7, fotoUrl: courtTennis,
    descricao: "Quadra de saibro com manutenção diária.",
    avaliacoes: [{ id: "a6", autor: "Rafael", nota: 5, comentario: "Perfeita!", data: "2025-04-08" }],
    horariosOcupados: [],
  },
];

const SEED_RESERVAS: Reserva[] = [
  {
    id: "r1", quadraId: "q1", quadraNome: "Arena Verde Society", quadraFoto: courtSoccer,
    jogadorId: "jog-demo", jogadorNome: "João Silva",
    nomeTime: "Os Feras", telefoneJogador: "(11) 99999-0001",
    data: "2026-05-25", horario: "19:00", preco: 120, status: "pendente",
    tipoJogo: "contra_time", statusPagamento: "pendente",
  },
  {
    id: "r2", quadraId: "q2", quadraNome: "Hoops Center", quadraFoto: courtBasketball,
    jogadorId: "jog-demo", jogadorNome: "João Silva",
    nomeTime: "Os Feras", telefoneJogador: "(11) 99999-0001",
    data: "2026-05-30", horario: "20:00", preco: 90, status: "confirmada",
    statusPagamento: "pendente",
  },
  {
    id: "r3", quadraId: "q3", quadraNome: "Praia & Areia", quadraFoto: courtVolleyball,
    jogadorId: "jog-demo", jogadorNome: "João Silva", telefoneJogador: "(11) 99999-0001",
    data: "2026-04-22", horario: "16:00", preco: 80, status: "concluida",
    statusPagamento: "pago",
  },
  {
    id: "r4", quadraId: "q1", quadraNome: "Arena Verde Society", quadraFoto: courtSoccer,
    jogadorId: "jog-pedro", jogadorNome: "Pedro Lima",
    telefoneJogador: "(11) 98888-2222", nomeTime: "Os Guris",
    data: "2026-05-26", horario: "21:00", preco: 120, status: "confirmada",
    statusPagamento: "pendente",
  },
  {
    id: "r5", quadraId: "q1", quadraNome: "Arena Verde Society", quadraFoto: courtSoccer,
    jogadorId: "jog-pedro", jogadorNome: "Pedro Lima",
    telefoneJogador: "(11) 98888-2222", nomeTime: "Os Guris",
    data: "2026-05-18", horario: "18:00", preco: 120, status: "concluida",
    statusPagamento: "pago",
  },
  {
    id: "r6", quadraId: "q3", quadraNome: "Praia & Areia", quadraFoto: courtVolleyball,
    jogadorId: "jog-carlos", jogadorNome: "Carlos Santos",
    telefoneJogador: "(21) 97777-3333",
    data: "2026-05-15", horario: "15:00", preco: 80, status: "concluida",
    statusPagamento: "pago",
  },
  {
    id: "r7", quadraId: "q3", quadraNome: "Praia & Areia", quadraFoto: courtVolleyball,
    jogadorId: "jog-carlos", jogadorNome: "Carlos Santos",
    telefoneJogador: "(21) 97777-3333",
    data: "2026-05-28", horario: "17:00", preco: 80, status: "confirmada",
    statusPagamento: "pendente",
  },
  {
    id: "r8", quadraId: "q1", quadraNome: "Arena Verde Society", quadraFoto: courtSoccer,
    jogadorId: "jog-marcos", jogadorNome: "Marcos Souza",
    telefoneJogador: "(11) 96666-4444", nomeTime: "Galáticos",
    data: "2026-05-24", horario: "20:00", preco: 120, status: "concluida",
    statusPagamento: "pendente",
  }
];

const STORAGE_KEY = "quadra-app-state-v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [quadras, setQuadras] = useState<Quadra[]>(SEED_QUADRAS);
  const [reservas, setReservas] = useState<Reserva[]>(SEED_RESERVAS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user) setUser(parsed.user);
        if (parsed.quadras) setQuadras(parsed.quadras);
        if (parsed.reservas) setReservas(parsed.reservas);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, quadras, reservas }));
    } catch {}
  }, [user, quadras, reservas, hydrated]);

  const login = (email: string, role: Role) => {
    setUser({
      id: role === "jogador" ? "jog-demo" : "dono-demo",
      nome: role === "jogador" ? "João Silva" : "Mariana Dono",
      email, role, cidade: "São Paulo",
    });
  };

  const signup = (data: Omit<User, "id">) => {
    setUser({ ...data, id: crypto.randomUUID() });
  };

  const logout = () => setUser(null);

  const addQuadra: AppState["addQuadra"] = (q) => {
    const nova: Quadra = {
      ...q, id: crypto.randomUUID(),
      donoId: user?.id ?? "dono-demo",
      rating: 0, avaliacoes: [], horariosOcupados: [],
    };
    setQuadras((prev) => [...prev, nova]);
    return nova;
  };

  const updateQuadra = (id: string, data: Partial<Quadra>) => {
    setQuadras((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));
  };

  const toggleHorarioOcupado = (quadraId: string, slot: string) => {
    setQuadras((prev) =>
      prev.map((q) =>
        q.id === quadraId
          ? {
              ...q,
              horariosOcupados: q.horariosOcupados.includes(slot)
                ? q.horariosOcupados.filter((s) => s !== slot)
                : [...q.horariosOcupados, slot],
            }
          : q
      )
    );
  };

  const addReserva: AppState["addReserva"] = (r) => {
    const nova: Reserva = { ...r, id: crypto.randomUUID(), status: "confirmada" };
    setReservas((prev) => [nova, ...prev]);
    const slot = `${r.data}-${r.horario.split(":")[0]}`;
    toggleHorarioOcupado(r.quadraId, slot);
    return nova;
  };

  const cancelReserva = (id: string) => {
    setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, status: "cancelada" } : r)));
  };

  const updateReserva = (id: string, dados: { jogadorNome: string; telefone: string; nomeTime: string }) => {
    setReservas((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const isB = r.jogadorIdB !== undefined;
        if (isB) {
          return { ...r, nomeJogadorB: dados.jogadorNome, telefoneJogadorB: dados.telefone, nomeTimeB: dados.nomeTime };
        }
        return { ...r, jogadorNome: dados.jogadorNome, telefoneJogador: dados.telefone, nomeTime: dados.nomeTime };
      })
    );
  };

  const concluirReserva = (id: string) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "concluida", statusPagamento: "pago" } : r))
    );
  };

  const updateReservaPagamento = (id: string, statusPagamento: "pago" | "pendente") => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, statusPagamento } : r))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        quadras,
        reservas,
        login,
        signup,
        logout,
        addQuadra,
        updateQuadra,
        toggleHorarioOcupado,
        addReserva,
        cancelReserva,
        updateReserva,
        concluirReserva,
        updateReservaPagamento,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
