import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Camera,
  User,
  Save,
  Trash2,
  UsersRound,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUser, saveUser, type Genero, type UserProfile } from "@/lib/user-store";
import {
  getMyCourts,
  saveCourt,
  type Court,
  type SubAccount,
} from "@/lib/courts-store";
import logoAsset from "@/assets/logo-sportcourt.png.asset.json";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Meu perfil — SportCourt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user) return null;

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setUser((u) => (u ? { ...u, [key]: value } : u));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveUser(user);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const backHref = user.tipo === "dono" ? "/owner" : "/search";

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="SportCourt" className="h-10 w-auto" />
          </Link>
          <Button variant="ghost" onClick={() => navigate({ to: backHref })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black">Meu perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.tipo === "dono"
              ? "Suas informações pessoais como dono de quadra."
              : "Suas informações são visíveis para donos quando você marca um jogo."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-primary/40 bg-secondary">
                {user.photo ? (
                  <img src={user.photo} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2 text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90"
                aria-label="Trocar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-lg font-bold">{user.nome || "Sem nome"}</div>
              <div className="text-sm text-muted-foreground">{user.email || "sem email"}</div>
              <div className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
                {user.tipo === "dono" ? "Dono de quadra" : "Jogador"}
              </div>
              {user.photo && (
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => update("photo", null)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Remover foto
                  </Button>
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo" required>
              <Input value={user.nome} onChange={(e) => update("nome", e.target.value)} required />
            </Field>
            <Field label="E-mail" required>
              <Input type="email" value={user.email} onChange={(e) => update("email", e.target.value)} required />
            </Field>
            <Field label="Telefone">
              <Input
                value={user.telefone ?? ""}
                onChange={(e) => update("telefone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="CPF (opcional)">
              <Input
                value={user.cpf ?? ""}
                onChange={(e) => update("cpf", e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </Field>
            <Field label="Data de nascimento (opcional)">
              <Input
                type="date"
                value={user.nascimento ?? ""}
                onChange={(e) => update("nascimento", e.target.value)}
              />
            </Field>
            <Field label="Gênero (opcional)">
              <Select
                value={user.genero ?? ""}
                onValueChange={(v) => update("genero", v as Genero)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-primary">Salvo!</span>}
            <Button type="submit" className="bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Save className="mr-1.5 h-4 w-4" /> Salvar alterações
            </Button>
          </div>
        </form>

        {user.tipo === "dono" && <ProfilesManagement />}
      </main>
    </div>
  );
}

function ProfilesManagement() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [reload, setReload] = useState(0);
  const [courtId, setCourtId] = useState<string>("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [showId, setShowId] = useState<string | null>(null);

  useEffect(() => {
    const list = getMyCourts();
    setCourts(list);
    setCourtId((prev) => prev || list[0]?.id || "");
  }, [reload]);

  const court = courts.find((c) => c.id === courtId);
  const items: SubAccount[] = court?.subAccounts ?? [];

  const add = () => {
    if (!court || !nome.trim() || !email.trim() || !senha.trim()) return;
    saveCourt({
      ...court,
      subAccounts: [
        ...items,
        {
          id: crypto.randomUUID(),
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha: senha,
          cargo: cargo.trim() || undefined,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("");
    setReload((n) => n + 1);
  };

  const remove = (id: string) => {
    if (!court) return;
    saveCourt({ ...court, subAccounts: items.filter((s) => s.id !== id) });
    setReload((n) => n + 1);
  };

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <UsersRound className="h-5 w-5 text-primary" /> Gerenciamento de perfis
          </h2>
          <p className="text-sm text-muted-foreground">
            Crie subcontas de acesso para funcionários. Eles entram com o e-mail e a senha definidos aqui.
          </p>
        </div>
        {courts.length > 1 && (
          <Select value={courtId} onValueChange={setCourtId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Quadra" />
            </SelectTrigger>
            <SelectContent>
              {courts.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!court ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Cadastre uma quadra para poder criar subcontas de acesso.
        </p>
      ) : (
        <>
          <div className="mt-4 space-y-2">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma subconta cadastrada ainda.</p>
            )}
            {items.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-semibold">
                    {s.nome}{" "}
                    {s.cargo && <span className="font-normal text-muted-foreground">· {s.cargo}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Senha: {showId === s.id ? (s.senha ?? "—") : "••••••••"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowId(showId === s.id ? null : s.id)}
                    aria-label="Mostrar senha"
                  >
                    {showId === s.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)} aria-label="Remover">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do funcionário" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail de acesso"
            />
            <Input
              type="text"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha de acesso"
            />
            <Input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo (opcional)" />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={add} className="bg-primary text-primary-foreground">
              <Plus className="mr-1 h-4 w-4" /> Adicionar subconta
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}