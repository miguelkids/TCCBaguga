export interface ChatMessage {
  id: string;
  courtId: string;
  threadId: string; // playerId (or "guest:" + name)
  from: "player" | "owner";
  authorName: string;
  authorPhoto?: string | null;
  text: string;
  createdAt: string;
}

export interface ChatThread {
  courtId: string;
  threadId: string;
  playerName: string;
  playerPhoto?: string | null;
  lastMessage?: ChatMessage;
  unreadForOwner: number;
  unreadForPlayer: number;
}

const KEY = "sc:chat:messages";
const READ_KEY = "sc:chat:read";

function readAll(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: ChatMessage[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function readState(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeState(s: Record<string, string>) {
  localStorage.setItem(READ_KEY, JSON.stringify(s));
}

export function threadKey(courtId: string, threadId: string) {
  return `${courtId}::${threadId}`;
}

export function sendMessage(msg: Omit<ChatMessage, "id" | "createdAt">) {
  const list = readAll();
  const full: ChatMessage = {
    ...msg,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  list.push(full);
  writeAll(list);
  return full;
}

export function getThreadMessages(courtId: string, threadId: string): ChatMessage[] {
  return readAll()
    .filter((m) => m.courtId === courtId && m.threadId === threadId)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export function getOwnerThreads(courtId: string): ChatThread[] {
  const msgs = readAll().filter((m) => m.courtId === courtId);
  const map = new Map<string, ChatThread>();
  const state = readState();
  for (const m of msgs) {
    const key = threadKey(courtId, m.threadId);
    const existing = map.get(m.threadId) ?? {
      courtId,
      threadId: m.threadId,
      playerName: m.from === "player" ? m.authorName : "Jogador",
      playerPhoto: m.from === "player" ? m.authorPhoto : undefined,
      unreadForOwner: 0,
      unreadForPlayer: 0,
    };
    if (m.from === "player") {
      existing.playerName = m.authorName;
      existing.playerPhoto = m.authorPhoto;
    }
    existing.lastMessage = m;
    map.set(m.threadId, existing);
    const readAt = state[`owner:${key}`];
    if (m.from === "player" && (!readAt || readAt < m.createdAt)) existing.unreadForOwner++;
    const pReadAt = state[`player:${key}`];
    if (m.from === "owner" && (!pReadAt || pReadAt < m.createdAt)) existing.unreadForPlayer++;
  }
  return Array.from(map.values()).sort((a, b) =>
    (a.lastMessage?.createdAt ?? "") < (b.lastMessage?.createdAt ?? "") ? 1 : -1,
  );
}

export function markRead(courtId: string, threadId: string, side: "owner" | "player") {
  const s = readState();
  s[`${side}:${threadKey(courtId, threadId)}`] = new Date().toISOString();
  writeState(s);
}

export function unreadForPlayer(courtId: string, threadId: string): number {
  const state = readState();
  const readAt = state[`player:${threadKey(courtId, threadId)}`];
  return readAll().filter(
    (m) =>
      m.courtId === courtId &&
      m.threadId === threadId &&
      m.from === "owner" &&
      (!readAt || readAt < m.createdAt),
  ).length;
}