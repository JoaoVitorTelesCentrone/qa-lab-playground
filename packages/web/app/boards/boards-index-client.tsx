"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KanbanSquare, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { BoardSummary } from "@/lib/board/types";

type ApiResult<T> = { data?: T; error?: { message?: string } };

export function BoardsIndexClient({ initialBoards }: { initialBoards: BoardSummary[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(initialBoards.length === 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/v1/board-projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), key: form.get("key"), kind: form.get("kind") }),
      });
      const result = await response.json() as ApiResult<{ boardId: string }>;
      if (!response.ok || !result.data?.boardId) throw new Error(result.error?.message ?? "Não foi possível criar o board.");
      setOpen(false);
      router.push(`/boards/${result.data.boardId}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível criar o board.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary"><LayoutDashboard className="size-4" /> Planejamento e execução</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Boards</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Organize histórias, tarefas, bugs e testes em um fluxo compartilhado.</p>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><Button><Plus /> Novo board</Button></SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Novo projeto de board</SheetTitle>
            <SheetDescription>Comece com um workflow Kanban pronto para usar.</SheetDescription>
          </SheetHeader>
          <form onSubmit={create} className="space-y-5 px-4 pb-8">
            <div className="space-y-2"><Label htmlFor="board-name">Nome do projeto</Label><Input id="board-name" name="name" required maxLength={100} placeholder="Ex.: Plataforma QA" /></div>
            <div className="space-y-2"><Label htmlFor="board-key">Chave</Label><Input id="board-key" name="key" required minLength={2} maxLength={10} pattern="[A-Za-z][A-Za-z0-9]{1,9}" className="uppercase" placeholder="QALAB" /><p className="text-xs text-muted-foreground">Usada em itens como QALAB-1.</p></div>
            <div className="space-y-2"><Label htmlFor="board-kind">Método</Label><select id="board-kind" name="kind" className="field w-full"><option value="kanban">Kanban</option><option value="scrum">Scrum</option></select></div>
            {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={saving}>{saving ? "Criando…" : "Criar projeto e board"}</Button>
          </form>
        </SheetContent>
      </Sheet>
    </header>

    {initialBoards.length > 0 ? <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {initialBoards.map((board) => <Link key={board.id} href={`/boards/${board.id}`} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><KanbanSquare className="size-5" /></span><span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">{board.kind}</span></div>
        <p className="mt-5 font-mono text-xs font-bold text-primary">{board.project.key}</p>
        <h2 className="mt-2 text-lg font-bold">{board.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{board.project.name}</p>
        <span className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">Abrir board <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span>
      </Link>)}
    </section> : <section className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
      <KanbanSquare className="mx-auto size-8 text-muted-foreground" />
      <h2 className="mt-5 text-xl font-bold">Seu primeiro board começa aqui</h2>
      <p className="mt-2 text-sm text-muted-foreground">Crie um projeto e receba quatro colunas configuradas automaticamente.</p>
      <Button className="mt-6" onClick={() => setOpen(true)}><Plus /> Criar board</Button>
    </section>}
  </main>;
}

