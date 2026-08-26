"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowUp, Plus, Save, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { BoardColumn, BoardColumnCategory, BoardColumnColor } from "@/lib/board/types";

type ApiResult<T> = { data?: T; error?: { message?: string } };

const categoryLabels: Record<BoardColumnCategory, string> = {
  todo: "A fazer",
  in_progress: "Em andamento",
  done: "Concluído",
};

const colorLabels: Record<BoardColumnColor, string> = {
  slate: "Cinza",
  blue: "Azul",
  amber: "Âmbar",
  violet: "Violeta",
  green: "Verde",
  coral: "Coral",
};

const colorClasses: Record<BoardColumnColor, string> = {
  slate: "bg-slate-400",
  blue: "bg-sky-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
  green: "bg-emerald-400",
  coral: "bg-orange-400",
};

async function boardRequest<T>(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...init.headers } });
  const result = await response.json() as ApiResult<T>;
  if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível salvar o workflow.");
  return result.data;
}

export function BoardSettings({ boardId, boardName, projectId, projectName, columns, onColumnsChange }: {
  boardId: string;
  boardName: string;
  projectId: string;
  projectName: string;
  columns: BoardColumn[];
  onColumnsChange: (columns: BoardColumn[]) => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  async function addColumn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving("new");
    try {
      const created = await boardRequest<BoardColumn>(`/api/v1/boards/${boardId}/columns`, {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          category: form.get("category"),
          color: form.get("color"),
          wipLimit: form.get("wipLimit"),
        }),
      });
      onColumnsChange([...columns, created].sort((a, b) => a.position - b.position));
      formElement.reset();
      toast.success("Coluna adicionada ao workflow.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível adicionar a coluna.");
    } finally {
      setSaving(null);
    }
  }

  async function saveColumn(event: FormEvent<HTMLFormElement>, column: BoardColumn) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(column.id);
    try {
      const updated = await boardRequest<BoardColumn>(`/api/v1/board-columns/${column.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.get("name"),
          category: form.get("category"),
          color: form.get("color"),
          wipLimit: form.get("wipLimit"),
        }),
      });
      onColumnsChange(columns.map((current) => current.id === updated.id ? updated : current));
      toast.success(`${updated.name} atualizada.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a coluna.");
    } finally {
      setSaving(null);
    }
  }

  async function moveColumn(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    const previous = columns;
    const next = [...columns];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    const optimistic = next.map((column, position) => ({ ...column, position }));
    onColumnsChange(optimistic);
    setSaving("order");
    try {
      const saved = await boardRequest<BoardColumn[]>(`/api/v1/boards/${boardId}/columns`, {
        method: "PATCH",
        body: JSON.stringify({ columnIds: optimistic.map((column) => column.id) }),
      });
      onColumnsChange(saved);
    } catch (error) {
      onColumnsChange(previous);
      toast.error(error instanceof Error ? error.message : "Não foi possível reordenar as colunas.");
    } finally {
      setSaving(null);
    }
  }

  async function archiveColumn(column: BoardColumn) {
    if (!window.confirm(`Remover a coluna “${column.name}” do workflow?`)) return;
    setSaving(column.id);
    try {
      await boardRequest<BoardColumn>(`/api/v1/board-columns/${column.id}`, { method: "DELETE" });
      onColumnsChange(columns.filter((current) => current.id !== column.id).map((current, position) => ({ ...current, position })));
      toast.success("Coluna removida do workflow.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover a coluna.");
    } finally {
      setSaving(null);
    }
  }

  async function archive(scope: "board" | "project") {
    const deletingProject = scope === "project";
    const target = deletingProject ? `o projeto “${projectName}” e todos os seus boards` : `o board “${boardName}”`;
    if (!window.confirm(`Excluir ${target}? Os dados serão arquivados e sairão da sua lista.`)) return;
    setSaving(`archive-${scope}`);
    try {
      await boardRequest<{ id: string; status: "archived" }>(
        deletingProject ? `/api/v1/board-projects/${projectId}` : `/api/v1/boards/${boardId}`,
        { method: "DELETE" },
      );
      toast.success(deletingProject ? "Projeto arquivado." : "Board arquivado.");
      router.replace("/boards");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir.");
      setSaving(null);
    }
  }

  return <Sheet>
    <SheetTrigger asChild><Button variant="outline" size="icon" aria-label="Configurar workflow"><Settings2 /></Button></SheetTrigger>
    <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
      <SheetHeader>
        <SheetTitle>Configurar workflow</SheetTitle>
        <SheetDescription>Edite as etapas, cores, categorias e limites de trabalho em andamento.</SheetDescription>
      </SheetHeader>

      <div className="space-y-4 px-4 pb-8">
        {columns.map((column, index) => <form
          key={`${column.id}:${column.name}:${column.category}:${column.color}:${column.wipLimit ?? "none"}`}
          onSubmit={(event) => void saveColumn(event, column)}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", colorClasses[column.color])} />
            <strong className="min-w-0 flex-1 truncate text-sm">{column.name}</strong>
            {column.isInitial && <span className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">Inicial</span>}
            {column.isFinal && <span className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">Final</span>}
            <Button type="button" variant="ghost" size="icon-sm" disabled={index === 0 || saving !== null} onClick={() => void moveColumn(index, -1)} aria-label={`Mover ${column.name} para a esquerda`}><ArrowUp /></Button>
            <Button type="button" variant="ghost" size="icon-sm" disabled={index === columns.length - 1 || saving !== null} onClick={() => void moveColumn(index, 1)} aria-label={`Mover ${column.name} para a direita`}><ArrowDown /></Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2"><Label htmlFor={`column-name-${column.id}`}>Nome</Label><Input id={`column-name-${column.id}`} name="name" required maxLength={60} defaultValue={column.name} /></div>
            <div className="space-y-2"><Label htmlFor={`column-category-${column.id}`}>Categoria</Label><select id={`column-category-${column.id}`} name="category" className="field w-full" defaultValue={column.category} disabled={column.isInitial || column.isFinal}>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{(column.isInitial || column.isFinal) && <input type="hidden" name="category" value={column.category} />}</div>
            <div className="space-y-2"><Label htmlFor={`column-color-${column.id}`}>Cor</Label><select id={`column-color-${column.id}`} name="color" className="field w-full" defaultValue={column.color}>{Object.entries(colorLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor={`column-wip-${column.id}`}>Limite WIP</Label><Input id={`column-wip-${column.id}`} name="wipLimit" type="number" min={1} max={9999} defaultValue={column.wipLimit ?? ""} placeholder="Sem limite" /></div>
            <div className="flex items-end justify-end gap-2">
              {!column.isInitial && !column.isFinal && <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" disabled={saving !== null} onClick={() => void archiveColumn(column)}><Trash2 /> Remover</Button>}
              <Button disabled={saving !== null}><Save /> {saving === column.id ? "Salvando…" : "Salvar"}</Button>
            </div>
          </div>
        </form>)}

        <form onSubmit={(event) => void addColumn(event)} className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <div className="mb-4 flex items-center gap-2"><Plus className="size-4 text-primary" /><strong className="text-sm">Nova coluna</strong></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="new-column-name">Nome</Label><Input id="new-column-name" name="name" required maxLength={60} placeholder="Ex.: Em revisão" /></div>
            <div className="space-y-2"><Label htmlFor="new-column-category">Categoria</Label><select id="new-column-category" name="category" className="field w-full" defaultValue="in_progress">{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="new-column-color">Cor</Label><select id="new-column-color" name="color" className="field w-full" defaultValue="blue">{Object.entries(colorLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="new-column-wip">Limite WIP</Label><Input id="new-column-wip" name="wipLimit" type="number" min={1} max={9999} placeholder="Sem limite" /></div>
            <div className="flex items-end justify-end"><Button disabled={saving !== null}><Plus /> {saving === "new" ? "Adicionando…" : "Adicionar coluna"}</Button></div>
          </div>
        </form>

        <section className="rounded-xl border border-destructive/30 bg-destructive/[.04] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div>
              <h3 className="text-sm font-bold text-destructive">Zona de perigo</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">A exclusão arquiva os dados. Itens, comentários e histórico não são apagados fisicamente.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" className="border-destructive/40 text-destructive hover:text-destructive" disabled={saving !== null} onClick={() => void archive("board")}><Trash2 /> {saving === "archive-board" ? "Excluindo…" : "Excluir board"}</Button>
            <Button type="button" variant="destructive" disabled={saving !== null} onClick={() => void archive("project")}><Trash2 /> {saving === "archive-project" ? "Excluindo…" : "Excluir projeto inteiro"}</Button>
          </div>
        </section>
      </div>
    </SheetContent>
  </Sheet>;
}
