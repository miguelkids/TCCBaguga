import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MessageCircle, Send, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyCourts, type Court } from "@/lib/courts-store";
import {
  getOwnerThreads,
  getThreadMessages,
  sendMessage,
  markRead,
  type ChatThread,
  type ChatMessage,
} from "@/lib/chat-store";

export const Route = createFileRoute("/owner/chat")({
  head: () => ({ meta: [{ title: "Chat — SportCourt" }, { name: "robots", content: "noindex" }] }),
  component: OwnerChat,
});

function OwnerChat() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const list = getMyCourts();
    setCourts(list);
    setCourtId((prev) => prev ?? list[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (!courtId) return;
    setThreads(getOwnerThreads(courtId));
  }, [courtId, tick]);

  useEffect(() => {
    if (!courtId || !activeThread) return;
    markRead(courtId, activeThread, "owner");
    setMessages(getThreadMessages(courtId, activeThread));
    const t = setInterval(() => {
      setMessages(getThreadMessages(courtId, activeThread));
      markRead(courtId, activeThread, "owner");
      setTick((n) => n + 1);
    }, 1500);
    return () => clearInterval(t);
  }, [courtId, activeThread]);

  const court = useMemo(() => courts.find((c) => c.id === courtId), [courts, courtId]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!court || !activeThread) return;
    const value = text.trim();
    if (!value) return;
    sendMessage({
      courtId: court.id,
      threadId: activeThread,
      from: "owner",
      authorName: court.nome,
      text: value,
    });
    setText("");
    setMessages(getThreadMessages(court.id, activeThread));
    setTick((n) => n + 1);
  };

  if (!court) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Cadastre uma quadra para receber mensagens.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courts.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {courts.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCourtId(c.id); setActiveThread(null); }}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                c.id === courtId
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground"
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-3">
          <h2 className="mb-2 flex items-center gap-2 px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <MessageCircle className="h-4 w-4" /> Conversas
          </h2>
          <div className="space-y-1">
            {threads.length === 0 && (
              <p className="px-2 text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
            )}
            {threads.map((t) => {
              const active = t.threadId === activeThread;
              return (
                <button
                  key={t.threadId}
                  onClick={() => setActiveThread(t.threadId)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                    active ? "bg-primary/15 text-primary" : "hover:bg-secondary/60"
                  }`}
                >
                  {t.playerPhoto ? (
                    <img src={t.playerPhoto} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate font-semibold">{t.playerName}</span>
                      {t.unreadForOwner > 0 && (
                        <span className="ml-2 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                          {t.unreadForOwner}
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.lastMessage?.text}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex h-[540px] flex-col rounded-2xl border border-border bg-card">
          {!activeThread ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Selecione uma conversa para responder.
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "owner" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        m.from === "owner"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-secondary/40"
                      }`}
                    >
                      <div className="text-[10px] opacity-70">{m.authorName}</div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Responder..." />
                <Button type="submit" className="bg-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}