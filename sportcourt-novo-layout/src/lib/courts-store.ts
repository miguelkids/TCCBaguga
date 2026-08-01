export type Sport =
  | "Futebol"
  | "Futsal"
  | "Society"
  | "Beach Tênis"
  | "Vôlei"
  | "Basquete"
  | "Tênis"
  | "Padel"
  | "Outro";

export interface Court {
  id: string;
  ownerId?: string;
  nome: string;
  cidade: string;
  endereco: string;
  telefone: string;
  quantidade: number;
  sports: string[];
  days: string[];
  openTime: string;
  closeTime: string;
  description: string;
  extra: string;
  photo: string | null;
  precoHora?: number;
  subcourts?: Subcourt[];
  reviews?: Review[];
  blocks?: Block[];
  mensalistaMsg?: string;
  cancelPolicy?: string;
  announcements?: Announcement[];
  subAccounts?: SubAccount[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  tone?: "info" | "warning" | "success";
}

export interface SubAccount {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  cargo?: string;
  createdAt: string;
}

export interface Subcourt {
  id: string;
  nome: string;
}

export interface Review {
  id: string;
  autor: string;
  nota: number;
  texto: string;
  data: string;
}

export interface Block {
  id: string;
  date: string; // yyyy-mm-dd
  time?: string; // HH:00 — se ausente, dia inteiro
  description: string;
}

export type SlotStatus = "free" | "past" | "busy" | "open-match";

export interface Slot {
  time: string;
  status: SlotStatus;
  teamName?: string;
}

const KEY = "sc:courts";

const SEED: Court[] = [
  {
    id: "arena-central",
    nome: "Arena Central",
    cidade: "São Paulo",
    endereco: "Av. Paulista, 1234",
    telefone: "(11) 99999-0001",
    quantidade: 3,
    sports: ["Futsal", "Society", "Futebol"],
    days: ["seg", "ter", "qua", "qui", "sex", "sab", "dom"],
    openTime: "08:00",
    closeTime: "23:00",
    description: "Arena coberta com grama sintética de alta qualidade e iluminação profissional.",
    extra: "Estacionamento gratuito, vestiários, lanchonete, aluguel de coletes.",
    photo: null,
    precoHora: 180,
    subcourts: [
      { id: "sc-1", nome: "Quadra 1" },
      { id: "sc-2", nome: "Quadra 2" },
    ],
    reviews: [
      { id: "r1", autor: "João P.", nota: 5, texto: "Grama impecável, adorei o atendimento.", data: "2025-11-02" },
      { id: "r2", autor: "Marina S.", nota: 4, texto: "Boa iluminação, só faltou mais estacionamento.", data: "2025-11-10" },
    ],
    blocks: [],
  },
  {
    id: "beach-club",
    nome: "Beach Club Zona Sul",
    cidade: "Rio de Janeiro",
    endereco: "Av. Atlântica, 500",
    telefone: "(21) 98888-0002",
    quantidade: 4,
    sports: ["Beach Tênis", "Vôlei"],
    days: ["seg", "ter", "qua", "qui", "sex", "sab", "dom"],
    openTime: "07:00",
    closeTime: "22:00",
    description: "Quadras de areia à beira-mar, com professores disponíveis.",
    extra: "Duchas, guarda-volumes, bar e aluguel de raquetes.",
    photo: null,
    precoHora: 140,
  },
  {
    id: "padel-house",
    nome: "Padel House",
    cidade: "Curitiba",
    endereco: "R. XV de Novembro, 200",
    telefone: "(41) 97777-0003",
    quantidade: 2,
    sports: ["Padel", "Tênis"],
    days: ["seg", "ter", "qua", "qui", "sex", "sab"],
    openTime: "09:00",
    closeTime: "22:00",
    description: "Quadras oficiais de padel com paredes de vidro e piso profissional.",
    extra: "Loja de raquetes, aulas, cafeteria.",
    photo: null,
    precoHora: 160,
  },
];

export function getCourts(): Court[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as Court[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

export function saveCourt(court: Court) {
  const list = getCourts();
  const idx = list.findIndex((c) => c.id === court.id);
  if (idx >= 0) list[idx] = court;
  else list.push(court);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getCourt(id: string): Court | undefined {
  return getCourts().find((c) => c.id === id);
}

// Deterministic pseudo-random for demo slot statuses
function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function generateSlots(court: Court, dateISO: string): Slot[] {
  const open = parseInt(court.openTime.split(":")[0], 10);
  const close = parseInt(court.closeTime.split(":")[0], 10);
  const now = new Date();
  const target = new Date(dateISO + "T00:00:00");
  const isToday = target.toDateString() === now.toDateString();

  const slots: Slot[] = [];
  for (let h = open; h < close; h++) {
    const time = `${String(h).padStart(2, "0")}:00`;
    const key = court.id + dateISO + time;
    const seed = hash(key);
    let status: SlotStatus = "free";
    if (isToday && h <= now.getHours()) status = "past";
    else if (seed % 7 === 0) status = "busy";
    else if (seed % 11 === 0) status = "open-match";

    slots.push({
      time,
      status,
      teamName: status === "open-match" ? ["Time Alfa", "FC Amigos", "Racha do Bairro", "Panelinha FC"][seed % 4] : undefined,
    });
  }
  return slots;
}

export interface BookingRequest {
  id: string;
  courtId: string;
  date: string;
  time: string;
  playerName: string;
  playerPhone: string;
  playerPhoto?: string | null;
  playerId?: string;
  vsTeam?: string;
  roster?: RosterPlayer[];
  status?: BookingStatus;
  subcourtId?: string;
  precoTotal?: number;
  teamName?: string;
  obs?: string;
  createdAt: string;
}

export type BookingStatus = "pendente" | "confirmada" | "encerrada" | "cancelada";

export interface RosterPlayer {
  nome: string;
  goleiro: boolean;
  paga: boolean;
  pagou?: boolean;
}

const BOOKINGS_KEY = "sc:bookings";

export function createBooking(b: Omit<BookingRequest, "id" | "createdAt">) {
  const list: BookingRequest[] = JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? "[]");
  const full: BookingRequest = {
    ...b,
    status: b.status ?? "pendente",
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  list.push(full);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  return full;
}

export function getBookings(): BookingRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? (JSON.parse(raw) as BookingRequest[]) : [];
  } catch {
    return [];
  }
}

export function updateBooking(id: string, patch: Partial<BookingRequest>) {
  const list = getBookings();
  const idx = list.findIndex((b) => b.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

export function deleteBooking(id: string) {
  const list = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

/** Bookings do dono agrupadas por (date,time) para detectar partidas entre dois times. */
export function pairedPending(courtId: string): Record<string, BookingRequest[]> {
  const grouped: Record<string, BookingRequest[]> = {};
  for (const b of getBookings()) {
    if (b.courtId !== courtId) continue;
    if (b.status !== "pendente") continue;
    const key = b.date + "T" + b.time;
    (grouped[key] ||= []).push(b);
  }
  return grouped;
}

export interface ClientRecord {
  nome: string;
  telefone: string;
  jogos: number;
  pagos: number;
  pendentes: number;
  valorPendente: number;
  ultimoJogo: string;
}

export function buildClientsCRM(courtId: string): ClientRecord[] {
  const map = new Map<string, ClientRecord>();
  const add = (
    nome: string,
    telefone: string,
    dataISO: string,
    pagou: boolean,
    valor: number,
  ) => {
    const key = (nome.trim().toLowerCase() + "|" + telefone.trim()) || nome;
    const existing = map.get(key) ?? {
      nome: nome.trim() || "Sem nome",
      telefone,
      jogos: 0,
      pagos: 0,
      pendentes: 0,
      valorPendente: 0,
      ultimoJogo: dataISO,
    };
    existing.jogos += 1;
    if (pagou) existing.pagos += 1;
    else {
      existing.pendentes += 1;
      existing.valorPendente += valor;
    }
    if (dataISO > existing.ultimoJogo) existing.ultimoJogo = dataISO;
    if (!existing.telefone && telefone) existing.telefone = telefone;
    map.set(key, existing);
  };

  for (const b of getBookings()) {
    if (b.courtId !== courtId) continue;
    if (b.status !== "encerrada" && b.status !== "confirmada") continue;
    const valorPorJogador = computePerPlayer(b);
    if (b.roster && b.roster.length > 0) {
      for (const p of b.roster) {
        if (!p.paga) continue; // não paga = convidado, não entra no rateio
        add(p.nome, "", b.date, !!p.pagou, valorPorJogador);
      }
    } else {
      add(b.playerName, b.playerPhone, b.date, b.status === "encerrada", b.precoTotal ?? 0);
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.ultimoJogo < b.ultimoJogo ? 1 : -1));
}

/** Calcula quanto cada jogador paga em uma reserva. */
export function computePerPlayer(b: BookingRequest): number {
  const total = b.precoTotal ?? 0;
  if (!total) return 0;
  const isVs = !!b.vsTeam;
  const share = isVs ? total / 2 : total;
  const pagantes = (b.roster ?? []).filter((p) => p.paga).length;
  if (pagantes <= 0) return share;
  return share / pagantes;
}

/** Bloqueios manuais */
export function isBlocked(court: Court, date: string, time: string): Block | undefined {
  return (court.blocks ?? []).find(
    (b) => b.date === date && (b.time === undefined || b.time === time),
  );
}

export function addBlock(courtId: string, block: Omit<Block, "id">) {
  const court = getCourt(courtId);
  if (!court) return;
  const blocks = [...(court.blocks ?? []), { ...block, id: crypto.randomUUID() }];
  saveCourt({ ...court, blocks });
}

export function removeBlock(courtId: string, blockId: string) {
  const court = getCourt(courtId);
  if (!court) return;
  saveCourt({ ...court, blocks: (court.blocks ?? []).filter((b) => b.id !== blockId) });
}

export function addSubcourt(courtId: string, nome: string) {
  const court = getCourt(courtId);
  if (!court) return;
  const subcourts = [...(court.subcourts ?? []), { id: crypto.randomUUID(), nome }];
  saveCourt({ ...court, subcourts });
}

export function removeSubcourt(courtId: string, subId: string) {
  const court = getCourt(courtId);
  if (!court) return;
  saveCourt({ ...court, subcourts: (court.subcourts ?? []).filter((s) => s.id !== subId) });
}

/** Adiciona uma avaliação. Bloqueia se o mesmo autor já avaliou a quadra. */
export function addReview(
  courtId: string,
  review: Omit<Review, "id" | "data"> & { authorId?: string; data?: string },
): { ok: boolean; reason?: string } {
  const court = getCourt(courtId);
  if (!court) return { ok: false, reason: "Quadra não encontrada." };
  const reviews = court.reviews ?? [];
  const already = reviews.some(
    (r) => r.autor.trim().toLowerCase() === review.autor.trim().toLowerCase(),
  );
  if (already) return { ok: false, reason: "Você já avaliou esta quadra." };
  const full: Review = {
    id: crypto.randomUUID(),
    autor: review.autor,
    nota: review.nota,
    texto: review.texto,
    data: review.data ?? new Date().toISOString().slice(0, 10),
  };
  saveCourt({ ...court, reviews: [full, ...reviews] });
  return { ok: true };
}

export function hasReviewed(courtId: string, autor: string): boolean {
  const court = getCourt(courtId);
  if (!court) return false;
  const key = autor.trim().toLowerCase();
  return (court.reviews ?? []).some((r) => r.autor.trim().toLowerCase() === key);
}

function currentOwnerId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("sc:user");
    if (!raw) return null;
    const u = JSON.parse(raw) as { id?: string };
    return u?.id ?? null;
  } catch {
    return null;
  }
}

function ownedIds(ownerId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem("sc:owner:courts:" + ownerId) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Retorna somente as quadras criadas pela conta logada.
 * Sem fallback: uma conta nunca enxerga quadras de outro dono.
 */
export function getMyCourts(): Court[] {
  if (typeof window === "undefined") return [];
  const ownerId = currentOwnerId();
  if (!ownerId) return [];
  const ids = ownedIds(ownerId);
  return getCourts().filter((c) => c.ownerId === ownerId || ids.includes(c.id));
}

export function markCourtOwned(id: string) {
  if (typeof window === "undefined") return;
  const ownerId = currentOwnerId();
  if (!ownerId) return;
  const ids = ownedIds(ownerId);
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem("sc:owner:courts:" + ownerId, JSON.stringify(ids));
  }
  const court = getCourt(id);
  if (court && court.ownerId !== ownerId) saveCourt({ ...court, ownerId });
}

/** Verifica se a quadra pertence à conta logada (para telas do dono). */
export function ownsCourt(id: string): boolean {
  return getMyCourts().some((c) => c.id === id);
}