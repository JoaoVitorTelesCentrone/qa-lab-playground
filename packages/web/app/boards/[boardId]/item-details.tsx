"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Archive, Check, History, ListChecks, Loader2, MessageSquare, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BoardChecklistItem, BoardColumn, BoardComment, BoardWorkItem, BoardWorkItemDetail, BoardWorkItemEvent, WorkItemPriority, WorkItemType } from "@/lib/board/types";

type ApiResult<T> = { data?: T; error?: { message?: string } };
type Tab = "details" | "comments" | "activity";

const typeLabels: Record<WorkItemType, string> = { epic: "Épico", story: "História", task: "Tarefa", bug: "Bug", test: "Teste", subtask: "Subtarefa" };
const priorityLabels: Record<WorkItemPriority, string> = { lowest: "Muito baixa", low: "Baixa", medium: "Média", high: "Alta", highest: "Crítica" };
const severityLabels = { low: "Baixa", medium: "Média", high: "Alta", critical: "Crítica" } as const;

async function jsonRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const result = await response.json() as ApiResult<T>;
  if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível concluir a operação.");
  return result.data;
}

export function ItemDetails({
  item,
  initialDetail,
  columns,
  viewerId,
  readOnly,
  close,
  move,
  onUpdated,
  onArchived,
}: {
  item: BoardWorkItem | null;
  initialDetail?: BoardWorkItemDetail;
  columns: BoardColumn[];
  viewerId: string;
  readOnly: boolean;
  close: () => void;
  move: (itemId: string, columnId: string) => Promise<BoardWorkItem | null>;
  onUpdated: (item: BoardWorkItem) => void;
  onArchived: (itemId: string) => void;
}) {
  return <Sheet open={Boolean(item)} onOpenChange={(open) => !open && close()}>
    <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-2xl">
      {item && <ItemDetailsContent key={item.id} initialItem={item} initialDetail={initialDetail} columns={columns} viewerId={viewerId} readOnly={readOnly} move={move} onUpdated={onUpdated} onArchived={onArchived} close={close} />}
    </SheetContent>
  </Sheet>;
}

function ItemDetailsContent({ initialItem, initialDetail, columns, viewerId, readOnly, move, onUpdated, onArchived, close }: {
  initialItem: BoardWorkItem;
  initialDetail?: BoardWorkItemDetail;
  columns: BoardColumn[];
  viewerId: string;
  readOnly: boolean;
  move: (itemId: string, columnId: string) => Promise<BoardWorkItem | null>;
  onUpdated: (item: BoardWorkItem) => void;
  onArchived: (itemId: string) => void;
  close: () => void;
}) {
  const [detail, setDetail] = useState<BoardWorkItemDetail | null>(initialDetail ?? null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("details");

  useEffect(() => {
    if (initialDetail) return;
    let active = true;
    void jsonRequest<BoardWorkItemDetail>(`/api/v1/work-items/${initialItem.id}`)
      .then((data) => { if (active) setDetail(data); })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Não foi possível carregar o item."); });
    return () => { active = false; };
  }, [initialDetail, initialItem.id]);

  const current = detail?.item ?? initialItem;
  return <>
    <SheetHeader className="border-b border-border pb-4">
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">{current.key}<span className="rounded bg-muted px-2 py-0.5 font-sans text-[10px] text-muted-foreground">{typeLabels[current.type]}</span></div>
      <SheetTitle className="pr-8 text-xl leading-7">{current.title}</SheetTitle>
      <SheetDescription>Versão {current.version} · atualizado em {formatDate(current.updatedAt)}{readOnly ? " · somente leitura" : ""}</SheetDescription>
    </SheetHeader>
    <nav className="grid grid-cols-3 border-b border-border px-4" aria-label="Detalhes do item">
      <TabButton active={tab === "details"} onClick={() => setTab("details")} icon={ListChecks} label="Detalhes" />
      <TabButton active={tab === "comments"} onClick={() => setTab("comments")} icon={MessageSquare} label={`Comentários ${detail?.comments.length ?? ""}`} />
      <TabButton active={tab === "activity"} onClick={() => setTab("activity")} icon={History} label="Atividade" />
    </nav>
    {error && <p role="alert" className="m-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {!detail && !error ? <div className="flex flex-1 items-center justify-center p-16 text-muted-foreground"><Loader2 className="mr-2 size-5 animate-spin" /> Carregando item…</div> : detail && <>
      {tab === "details" && <DetailsTab detail={detail} columns={columns} readOnly={readOnly} setDetail={setDetail} move={move} onUpdated={onUpdated} onArchived={onArchived} close={close} />}
      {tab === "comments" && <CommentsTab itemId={detail.item.id} comments={detail.comments} viewerId={viewerId} readOnly={readOnly} setComments={(comments) => setDetail((currentDetail) => currentDetail ? { ...currentDetail, comments } : currentDetail)} />}
      {tab === "activity" && <ActivityTab events={detail.events} columns={columns} viewerId={viewerId} />}
    </>}
  </>;
}

function DetailsTab({ detail, columns, readOnly, setDetail, move, onUpdated, onArchived, close }: {
  detail: BoardWorkItemDetail;
  columns: BoardColumn[];
  readOnly: boolean;
  setDetail: (detail: BoardWorkItemDetail | null | ((current: BoardWorkItemDetail | null) => BoardWorkItemDetail | null)) => void;
  move: (itemId: string, columnId: string) => Promise<BoardWorkItem | null>;
  onUpdated: (item: BoardWorkItem) => void;
  onArchived: (itemId: string) => void;
  close: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<WorkItemType>(detail.item.type);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const updated = await jsonRequest<BoardWorkItem>(`/api/v1/work-items/${detail.item.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedVersion: detail.item.version,
          title: form.get("title"),
          description: form.get("description"),
          type: form.get("type"),
          priority: form.get("priority"),
          severity: form.get("severity"),
          storyPoints: form.get("storyPoints"),
          dueAt: form.get("dueAt"),
          acceptanceCriteria: form.get("acceptanceCriteria"),
        }),
      });
      setDetail((current) => current ? { ...current, item: updated } : current);
      onUpdated(updated);
      toast.success(`${updated.key} atualizado.`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Não foi possível salvar o item.");
    } finally {
      setSaving(false);
    }
  }

  async function changeColumn(columnId: string) {
    if (columnId === detail.item.columnId) return;
    const updated = await move(detail.item.id, columnId);
    if (updated) setDetail((current) => current ? { ...current, item: updated } : current);
  }

  async function archive() {
    if (!window.confirm(`Arquivar ${detail.item.key}? O item sairá do board.`)) return;
    try {
      await jsonRequest<BoardWorkItem>(`/api/v1/work-items/${detail.item.id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedVersion: detail.item.version }),
      });
      onArchived(detail.item.id);
      close();
      toast.success(`${detail.item.key} arquivado.`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Não foi possível arquivar o item.");
    }
  }

  return <div className="space-y-8 px-4 py-6">
    <form onSubmit={save} className="space-y-5">
      <fieldset disabled={readOnly} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="detail-title">Título</Label><Input id="detail-title" name="title" defaultValue={detail.item.title} required maxLength={180} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label htmlFor="detail-type">Tipo</Label><select id="detail-type" name="type" value={type} onChange={(event) => setType(event.target.value as WorkItemType)} className="field w-full">{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="detail-priority">Prioridade</Label><select id="detail-priority" name="priority" defaultValue={detail.item.priority} className="field w-full">{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label htmlFor="detail-status">Status</Label>{detail.item.inBacklog ? <Input id="detail-status" value="Backlog" disabled /> : <select id="detail-status" value={detail.item.columnId} onChange={(event) => void changeColumn(event.target.value)} className="field w-full">{columns.map((column) => <option key={column.id} value={column.id}>{column.name}</option>)}</select>}</div>
        <div className="space-y-2"><Label htmlFor="detail-points">Story points</Label><Input id="detail-points" name="storyPoints" type="number" min="0" max="9999" step="0.5" defaultValue={detail.item.storyPoints ?? ""} /></div>
      </div>
      {type === "bug" && <div className="space-y-2"><Label htmlFor="detail-severity">Severidade</Label><select id="detail-severity" name="severity" defaultValue={detail.item.severity ?? "medium"} className="field w-full">{Object.entries(severityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>}
      <div className="space-y-2"><Label htmlFor="detail-due">Vencimento</Label><Input id="detail-due" name="dueAt" type="date" defaultValue={detail.item.dueAt?.slice(0, 10) ?? ""} /></div>
      <div className="space-y-2"><Label htmlFor="detail-description">Descrição</Label><Textarea id="detail-description" name="description" rows={7} maxLength={10000} defaultValue={detail.item.description} /></div>
      <div className="space-y-2"><Label htmlFor="detail-criteria">Critérios de aceite</Label><Textarea id="detail-criteria" name="acceptanceCriteria" rows={5} defaultValue={detail.item.acceptanceCriteria.join("\n")} placeholder="Um critério por linha" /></div>
      {!readOnly && <Button className="w-full" disabled={saving}><Save /> {saving ? "Salvando…" : "Salvar alterações"}</Button>}
      </fieldset>
    </form>
    <Checklist itemId={detail.item.id} entries={detail.checklist} readOnly={readOnly} setEntries={(checklist) => setDetail((current) => current ? { ...current, checklist } : current)} />
    {!readOnly && <div className="border-t border-border pt-6"><Button type="button" variant="destructive" onClick={() => void archive()}><Archive /> Arquivar item</Button></div>}
  </div>;
}

function Checklist({ itemId, entries, readOnly, setEntries }: { itemId: string; entries: BoardChecklistItem[]; readOnly: boolean; setEntries: (entries: BoardChecklistItem[]) => void }) {
  const done = entries.filter((entry) => entry.done).length;
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const entry = await jsonRequest<BoardChecklistItem>(`/api/v1/work-items/${itemId}/checklist`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: data.get("text") }) });
      setEntries([...entries, entry]);
      form.reset();
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Não foi possível adicionar ao checklist."); }
  }
  async function toggle(entry: BoardChecklistItem) {
    try {
      const updated = await jsonRequest<BoardChecklistItem>(`/api/v1/checklist-items/${entry.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ done: !entry.done }) });
      setEntries(entries.map((current) => current.id === entry.id ? updated : current));
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Não foi possível atualizar o checklist."); }
  }
  async function remove(entry: BoardChecklistItem) {
    try {
      await jsonRequest<{ id: string }>(`/api/v1/checklist-items/${entry.id}`, { method: "DELETE" });
      setEntries(entries.filter((current) => current.id !== entry.id));
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Não foi possível remover o item."); }
  }
  return <section>
    <div className="flex items-center justify-between"><h3 className="text-sm font-bold">Checklist</h3><span className="text-xs text-muted-foreground">{done}/{entries.length}</span></div>
    <div className="mt-3 space-y-2">{entries.map((entry) => <div key={entry.id} className="flex items-center gap-2 rounded-md border border-border p-2">
      <button type="button" disabled={readOnly} onClick={() => void toggle(entry)} className={cn("flex size-6 items-center justify-center rounded border disabled:cursor-default", entry.done ? "border-primary bg-primary text-primary-foreground" : "border-border")} aria-label={entry.done ? `Reabrir ${entry.text}` : `Concluir ${entry.text}`}>{entry.done && <Check className="size-3.5" />}</button>
      <span className={cn("flex-1 text-sm", entry.done && "text-muted-foreground line-through")}>{entry.text}</span>
      {!readOnly && <Button type="button" variant="ghost" size="icon-xs" onClick={() => void remove(entry)} aria-label={`Remover ${entry.text}`}><Trash2 /></Button>}
    </div>)}</div>
    {!readOnly && <form onSubmit={add} className="mt-3 flex gap-2"><Input name="text" maxLength={300} required placeholder="Adicionar item ao checklist" /><Button size="icon" aria-label="Adicionar ao checklist"><Plus /></Button></form>}
  </section>;
}

function CommentsTab({ itemId, comments, viewerId, readOnly, setComments }: { itemId: string; comments: BoardComment[]; viewerId: string; readOnly: boolean; setComments: (comments: BoardComment[]) => void }) {
  async function comment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const created = await jsonRequest<BoardComment>(`/api/v1/work-items/${itemId}/comments`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body: data.get("body") }) });
      setComments([...comments, created]);
      form.reset();
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Não foi possível comentar."); }
  }
  return <div className="space-y-5 px-4 py-6">
    {!readOnly && <form onSubmit={comment} className="space-y-3"><Label htmlFor="new-comment">Novo comentário</Label><Textarea id="new-comment" name="body" required rows={4} maxLength={4000} placeholder="Compartilhe contexto, decisão ou impedimento…" /><Button><MessageSquare /> Comentar</Button></form>}
    <div className="space-y-3">{comments.map((comment) => <article key={comment.id} className="rounded-lg border border-border bg-muted/20 p-4"><div className="flex items-center justify-between text-xs"><strong>{comment.authorId === viewerId ? "Você" : `Membro ${comment.authorId.slice(0, 6)}`}</strong><time className="text-muted-foreground">{formatDate(comment.createdAt)}</time></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{comment.body}</p></article>)}{comments.length === 0 && <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nenhum comentário ainda.</p>}</div>
  </div>;
}

function ActivityTab({ events, columns, viewerId }: { events: BoardWorkItemEvent[]; columns: BoardColumn[]; viewerId: string }) {
  return <div className="space-y-3 px-4 py-6">{events.map((event) => <article key={event.id} className="flex gap-3 rounded-lg border border-border p-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-primary" /><div><p className="text-sm"><strong>{event.actorId === viewerId ? "Você" : `Membro ${event.actorId.slice(0, 6)}`}</strong> {eventText(event, columns)}</p><time className="mt-1 block text-xs text-muted-foreground">{formatDate(event.createdAt)}</time></div></article>)}</div>;
}

function eventText(event: BoardWorkItemEvent, columns: BoardColumn[]) {
  if (event.eventType === "created") return "criou o item.";
  if (event.eventType === "updated") return "atualizou os detalhes.";
  if (event.eventType === "archived") return "arquivou o item.";
  if (event.eventType === "planned") return "planejou o item no board.";
  if (event.eventType === "sent_to_backlog") return "enviou o item ao backlog.";
  if (event.eventType === "moved") {
    const destination = columns.find((column) => column.id === event.payload.toColumnId)?.name;
    return `moveu o item${destination ? ` para ${destination}` : ""}.`;
  }
  return `registrou ${event.eventType}.`;
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof ListChecks; label: string }) {
  return <button type="button" onClick={onClick} className={cn("flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-xs font-bold", active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}><Icon className="size-3.5" />{label}</button>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "agora" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
