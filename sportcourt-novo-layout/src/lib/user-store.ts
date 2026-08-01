export type UserType = "jogador" | "dono";
export type Genero = "masculino" | "feminino" | "outro" | "prefiro-nao-dizer";

export interface UserProfile {
  id: string;
  tipo: UserType;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  nascimento?: string; // yyyy-mm-dd
  genero?: Genero;
  photo?: string | null;
}

const KEY = "sc:user";

function readOrInit(): UserProfile {
  if (typeof window === "undefined") {
    return { id: "anon", tipo: "jogador", nome: "", email: "" };
  }
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      /* fallthrough */
    }
  }
  const tipo = (localStorage.getItem("sc:tipo") as UserType) || "jogador";
  const nome = localStorage.getItem("sc:nome") ?? "";
  const email = localStorage.getItem("sc:email") ?? "";
  const seed: UserProfile = {
    id: crypto.randomUUID(),
    tipo,
    nome,
    email,
  };
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

export function getUser(): UserProfile {
  return readOrInit();
}

export function saveUser(patch: Partial<UserProfile>): UserProfile {
  const current = readOrInit();
  const next = { ...current, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  if (patch.nome !== undefined) localStorage.setItem("sc:nome", next.nome);
  if (patch.tipo !== undefined) localStorage.setItem("sc:tipo", next.tipo);
  return next;
}

export function setUserType(tipo: UserType) {
  saveUser({ tipo });
}