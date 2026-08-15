"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
        <Card>
          <CardHeader>
            <CardTitle>Formulario de login</CardTitle>
            <CardDescription>Use os usuarios de teste do hub para validar estados.</CardDescription>
          </CardHeader>
          <CardContent>
        <form onSubmit={submit} aria-describedby="login-feedback">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Usuario
            <Input ref={usernameRef} value={username} onChange={(event) => setUsername(event.target.value)} data-testid="username" autoComplete="username" />
          </label>
          <label className="mt-4 grid gap-2 text-sm font-medium text-foreground">
            Senha
            <Input ref={passwordRef} value={password} onChange={(event) => setPassword(event.target.value)} data-testid="password" type="password" autoComplete="current-password" />
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" data-testid="remember-user" />
            Lembrar usuario
          </label>
          <Button type="submit" className="mt-5 w-full" data-testid="login-button">
            <LogIn className="size-4" /> Entrar
          </Button>
          <p id="login-feedback" role="status" aria-live="polite" className={`mt-4 rounded-md border p-3 text-sm ${logged ? "border-primary/30 bg-primary/10 text-primary" : "border-destructive/30 bg-destructive/10 text-destructive"}`} data-testid="login-message">
            {message || "Aguardando tentativa de login."}
          </p>
          {logged && <Button asChild variant="link" className="mt-2 px-0"><Link href="/shop/products">Abrir loja protegida</Link></Button>}
        </form>
          </CardContent>
        </Card>
        <LabBrief items={["standard_user / qa_lab_secret deve logar.", "locked_out_user deve exibir Usuario bloqueado.", "Campo vazio deve mover foco para o campo com erro.", "Mensagens devem ser anunciadas por aria-live."]} />
      </div>
    </LabShell>
  );
}

export function LabShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="qa-simple">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Button asChild variant="link" className="h-auto px-0"><Link href="/labs">Voltar para labs</Link></Button>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
      <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export function LabBrief({ items }: { items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline">Criterios de aceite</Badge>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 text-sm leading-6 text-muted-foreground">
          {items.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
