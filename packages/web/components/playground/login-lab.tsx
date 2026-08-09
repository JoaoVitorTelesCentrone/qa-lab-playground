"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { LogIn } from "lucide-react";
import { shopUsers } from "@/lib/playground/shop-data";

export function LoginLab() {
  const bug = useSearchParams().get("bug");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [logged, setLogged] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!username) {
      setMessage("Usuario obrigatorio.");
      usernameRef.current?.focus();
      return;
    }
    if (!password) {
      setMessage("Senha obrigatoria.");
      passwordRef.current?.focus();
      return;
    }
    const user = shopUsers.find((item) => item.username === username);
    if (!user || user.password !== password) {
      setMessage("Credenciais invalidas.");
      return;
    }
    if (user.state === "locked") {
      setMessage(bug === "locked-message" ? "Credenciais invalidas." : "Usuario bloqueado.");
      return;
    }
    localStorage.setItem("qa-lab-user", username);
    if (remember) localStorage.setItem("qa-lab-remembered-user", username);
    setLogged(true);
    setMessage("Login realizado com sucesso.");
  }

  return (
    <LabShell title="Lab 1: login quebravel" description="Valide campos obrigatorios, credenciais invalidas, usuario bloqueado, foco em erro e rota protegida.">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-card p-5" aria-describedby="login-feedback">
          <label className="grid gap-2 text-sm font-bold text-off-white">
            Usuario
            <input ref={usernameRef} value={username} onChange={(event) => setUsername(event.target.value)} className="field" data-testid="username" autoComplete="username" />
          </label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-off-white">
            Senha
            <input ref={passwordRef} value={password} onChange={(event) => setPassword(event.target.value)} className="field" data-testid="password" type="password" autoComplete="current-password" />
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm text-[#AAB2BC]">
            <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" data-testid="remember-user" />
            Lembrar usuario
          </label>
          <button type="submit" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neon px-4 text-sm font-black text-[#101319]" data-testid="login-button">
            <LogIn className="size-4" /> Entrar
          </button>
          <p id="login-feedback" role="status" aria-live="polite" className={`mt-4 rounded-lg border p-3 text-sm ${logged ? "border-neon/30 bg-neon/10 text-neon" : "border-coral/30 bg-coral/10 text-coral"}`} data-testid="login-message">
            {message || "Aguardando tentativa de login."}
          </p>
          {logged && <Link href="/shop/products" className="mt-4 inline-flex text-sm font-bold text-mint">Abrir loja protegida</Link>}
        </form>
        <LabBrief items={["standard_user / qa_lab_secret deve logar.", "locked_out_user deve exibir Usuario bloqueado.", "Campo vazio deve mover foco para o campo com erro.", "Mensagens devem ser anunciadas por aria-live."]} />
      </div>
    </LabShell>
  );
}

export function LabShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/labs" className="text-sm font-bold text-mint">Voltar para labs</Link>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-none text-off-white">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function LabBrief({ items }: { items: string[] }) {
  return (
    <aside className="rounded-lg border border-white/10 bg-[#161B22] p-5">
      <h2 className="text-sm font-black uppercase tracking-wide text-off-white">Criterios de aceite</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#AAB2BC]">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </aside>
  );
}
