"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, ArrowRight, Bug, CircleDot, FlaskConical, GripVertical, KanbanSquare, ListTodo, Plus, Search, Sparkles, SquareCheckBig } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { moveInMemory } from "@/lib/board/domain";
import type { BoardColumn, BoardSnapshot, BoardWorkItem, WorkItemPriority, WorkItemType } from "@/lib/board/types";
import { parseBoardUrlState, serializeBoardUrlState, type BoardPriorityFilter, type BoardTypeFilter, type BoardView } from "@/lib/board/url-state";
import { BoardSettings } from "./board-settings";
import { ItemDetails } from "./item-details";

type ApiResult<T> = { data?: T; error?: { message?: string } };

const typeLabels: Record<WorkItemType, string> = { epic: "Épico", story: "História", task: "Tarefa", bug: "Bug", test: "Teste", subtask: "Subtarefa" };
const priorityLabels: Record<WorkItemPriority, string> = { lowest: "Muito baixa", low: "Baixa", medium: "Média", high: "Alta", highest: "Crítica" };
const priorityClasses: Record<WorkItemPriority, string> = { lowest: "text-muted-foreground", low: "text-sky-400", medium: "text-primary", high: "text-amber-400", highest: "text-destructive" };
const columnColors: Record<string, string> = { blue: "bg-sky-400", amber: "bg-amber-400", violet: "bg-violet-400", green: "bg-emerald-400", slate: "bg-slate-400" };

function WorkItemTypeIcon({ type }: { type: WorkItemType }) {
  if (type === "bug") return <Bug className="size-3.5 text-primary" />;
  if (type === "test") return <FlaskConical className="size-3.5 text-primary" />;
  if (type === "task" || type === "subtask") return <SquareCheckBig className="size-3.5 text-primary" />;
  if (type === "epic") return <Sparkles className="size-3.5 text-primary" />;
  return <CircleDot className="size-3.5 text-primary" />;
}

export function BoardClient({ initial, viewerId, publicDemo = false }: { initial: BoardSnapshot; viewerId: string; publicDemo?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialUrlState = useMemo(() => parseBoardUrlState(searchParams), [searchParams]);
  const canEdit = initial.viewerRole !== "viewer";
  const [columns, setColumns] = useState(initial.columns);
  const [items, setItems] = useState(initial.items);
  const [view, setView] = useState<BoardView>(initialUrlState.view);
  const [query, setQuery] = useState(initialUrlState.query);
  const [typeFilter, setTypeFilter] = useState<BoardTypeFilter>(initialUrlState.type);
  const [priorityFilter, setPriorityFilter] = useState<BoardPriorityFilter>(initialUrlState.priority);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<BoardWorkItem | null>(() => findItem(initial.items, initialUrlState.item));
  const [saving, setSaving] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const next = parseBoardUrlState(searchParams);
    setView(next.view);
    setQuery(next.query);
    setTypeFilter(next.type);
    setPriorityFilter(next.priority);
    setSelected(findItem(items, next.item));
  }, [items, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = serializeBoardUrlState(new URLSearchParams(searchParams.toString()), {
        view,
        query,
        type: typeFilter,
        priority: priorityFilter,
        item: selected?.key ?? null,
      });
      const current = searchParams.toString();
      const serialized = next.toString();
      if (serialized !== current) router.replace(serialized ? `${pathname}?${serialized}` : pathname, { scroll: false });
    }, 200);
    return () => window.clearTimeout(timer);
  }, [pathname, priorityFilter, query, router, searchParams, selected?.key, typeFilter, view]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return items.filter((item) => {
      if (normalized && !`${item.key} ${item.title} ${item.type}`.toLocaleLowerCase("pt-BR").includes(normalized)) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
      return true;
    });
  }, [items, priorityFilter, query, typeFilter]);

  function destinationFor(overId: string) {
    if (overId.startsWith("column:")) return { columnId: overId.slice(7), overItemId: null };
    const overItem = items.find((item) => item.id === overId);
    return overItem ? { columnId: overItem.columnId, overItemId: overItem.id } : null;
  }

  async function persistMove(itemId: string, columnId: string, overItemId: string | null) {
    if (!canEdit) return null;
    const moving = items.find((item) => item.id === itemId);
    if (!moving || overItemId === itemId) return null;
    const previous = items;
    const moved = moveInMemory(items, itemId, columnId, overItemId);
    setItems(moved.items);
    setAnnouncement(`${moving.key} movido para ${columns.find((column) => column.id === columnId)?.name ?? "outra coluna"}.`);
    try {
      const response = await fetch(`/api/v1/work-items/${itemId}/move`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          toColumnId: columnId,
          beforeItemId: moved.beforeItemId,
          afterItemId: moved.afterItemId,
          expectedVersion: moving.version,
        }),
      });
      const result = await response.json() as ApiResult<BoardWorkItem>;
      if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível mover o item.");
      setItems((current) => current.map((item) => item.id === itemId ? { ...item, ...result.data } : item));
      return result.data;
    } catch (cause) {
      setItems(previous);
      const message = cause instanceof Error ? cause.message : "Não foi possível mover o item.";
      setAnnouncement(`Movimento de ${moving.key} desfeito. ${message}`);
      toast.error(message);
      return null;
    }
  }

  function dragEnd(event: DragEndEvent) {
    if (!event.over) return;
    const destination = destinationFor(String(event.over.id));
    if (destination) void persistMove(String(event.active.id), destination.columnId, destination.overItemId);
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/v1/boards/${initial.board.id}/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: form.get("title"), description: form.get("description"), type: form.get("type"), priority: form.get("priority"), inBacklog: view === "backlog" }),
      });
      const result = await response.json() as ApiResult<BoardWorkItem>;
      if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível criar o item.");
      setItems((current) => [...current, result.data!]);
      setCreateOpen(false);
      toast.success(`${result.data.key} criado.`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Não foi possível criar o item.");
    } finally {
      setSaving(false);
    }
  }

  async function persistBacklog(itemId: string, inBacklog: boolean) {
    if (!canEdit) return null;
    const moving = items.find((item) => item.id === itemId);
    if (!moving || moving.inBacklog === inBacklog) return null;
    const previous = items;
    const initialColumn = columns.find((column) => column.isInitial)?.id ?? moving.columnId;
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, inBacklog, columnId: inBacklog ? item.columnId : initialColumn } : item));
    try {
      const response = await fetch(`/api/v1/work-items/${itemId}/backlog`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ inBacklog, expectedVersion: moving.version }),
      });
      const result = await response.json() as ApiResult<BoardWorkItem>;
      if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível alterar o planejamento do item.");
      setItems((current) => current.map((item) => item.id === itemId ? result.data! : item));
      setSelected((current) => current?.id === itemId ? result.data! : current);
      toast.success(inBacklog ? `${moving.key} enviado ao backlog.` : `${moving.key} planejado no board.`);
      return result.data;
    } catch (cause) {
      setItems(previous);
      toast.error(cause instanceof Error ? cause.message : "Não foi possível alterar o planejamento do item.");
      return null;
    }
  }

  return <main className="min-h-[calc(100vh-4rem)] bg-muted/20">
    <header className="border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/boards" aria-label="Voltar para boards"><ArrowLeft /></Link></Button>
          <div><p className="font-mono text-xs font-bold text-primary">{initial.board.project.key}</p><h1 className="text-xl font-black">{initial.board.name}</h1><p className="text-xs text-muted-foreground">{initial.board.project.name}</p></div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Buscar por chave ou título" /></div>
          {!canEdit && <span className="whitespace-nowrap rounded-md border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-muted-foreground">Somente leitura</span>}
          {(initial.viewerRole === "owner" || initial.viewerRole === "admin") && <BoardSettings boardId={initial.board.id} boardName={initial.board.name} projectId={initial.board.project.id} projectName={initial.board.project.name} columns={columns} onColumnsChange={setColumns} />}
          {canEdit && <CreateItemSheet open={createOpen} onOpenChange={setCreateOpen} saving={saving} inBacklog={view === "backlog"} onSubmit={createItem} />}
        </div>
      </div>
    </header>

    <div className="border-b border-border bg-background px-5 py-3 sm:px-8"><div className="mx-auto flex max-w-[1700px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-fit rounded-lg border border-border bg-muted/30 p-1">
        <button type="button" onClick={() => setView("board")} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold", view === "board" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")} aria-pressed={view === "board"}><KanbanSquare className="size-3.5" /> Board <span className="rounded-full bg-muted px-1.5">{items.filter((item) => !item.inBacklog).length}</span></button>
        <button type="button" onClick={() => setView("backlog")} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold", view === "backlog" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")} aria-pressed={view === "backlog"}><ListTodo className="size-3.5" /> Backlog <span className="rounded-full bg-muted px-1.5">{items.filter((item) => item.inBacklog).length}</span></button>
      </div>
      <div className="flex gap-2">
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "all" | WorkItemType)} className="field h-9 min-w-36"><option value="all">Todos os tipos</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as "all" | WorkItemPriority)} className="field h-9 min-w-36"><option value="all">Prioridades</option>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>
    </div></div>

    <div className="sr-only" aria-live="polite">{announcement}</div>
    {view === "board" ? <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={dragEnd}>
      <section className="mx-auto flex max-w-[1700px] gap-4 overflow-x-auto px-5 py-6 sm:px-8">
        {columns.map((column) => <BoardLane
          key={column.id}
          column={column}
          items={filtered.filter((item) => !item.inBacklog && item.columnId === column.id).sort((a, b) => a.rank - b.rank)}
          total={items.filter((item) => !item.inBacklog && item.columnId === column.id).length}
          columns={columns}
          canEdit={canEdit}
          open={setSelected}
          move={(itemId, target) => void persistMove(itemId, target, null)}
          backlog={(itemId) => void persistBacklog(itemId, true)}
        />)}
      </section>
    </DndContext> : <BacklogList items={filtered.filter((item) => item.inBacklog).sort((a, b) => a.rank - b.rank)} canEdit={canEdit} open={setSelected} plan={(itemId) => void persistBacklog(itemId, false)} />}
    <ItemDetails
      item={selected}
      initialDetail={publicDemo && selected ? { item: selected, comments: [], checklist: [], events: [] } : undefined}
      columns={columns}
      viewerId={viewerId}
      readOnly={!canEdit}
      close={() => setSelected(null)}
      move={async (itemId, columnId) => {
        const updated = await persistMove(itemId, columnId, null);
        if (updated) setSelected(updated);
        return updated;
      }}
      onUpdated={(updated) => { setItems((current) => current.map((item) => item.id === updated.id ? updated : item)); setSelected(updated); }}
      onArchived={(itemId) => { setItems((current) => current.filter((item) => item.id !== itemId)); setSelected(null); }}
    />
  </main>;
}

function findItem(items: BoardWorkItem[], reference: string | null) {
  if (!reference) return null;
  const normalized = reference.toLocaleLowerCase("pt-BR");
  return items.find((item) => item.id === reference || item.key.toLocaleLowerCase("pt-BR") === normalized) ?? null;
}

function BoardLane({ column, items, total, columns, canEdit, open, move, backlog }: { column: BoardColumn; items: BoardWorkItem[]; total: number; columns: BoardColumn[]; canEdit: boolean; open: (item: BoardWorkItem) => void; move: (itemId: string, columnId: string) => void; backlog: (itemId: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `column:${column.id}` });
  const limitReached = column.wipLimit != null && total > column.wipLimit;
  return <section ref={setNodeRef} className={cn("w-[300px] shrink-0 rounded-xl border bg-card/80 p-3 transition sm:w-[330px]", isOver ? "border-primary bg-primary/[.03]" : "border-border", limitReached && "border-amber-400/50")} aria-label={`${column.name}, ${total} itens`}>
    <header className="flex items-center justify-between px-1 pb-3">
      <div className="flex items-center gap-2"><span className={cn("size-2 rounded-full", columnColors[column.color] ?? columnColors.slate)} /><h2 className="text-xs font-black uppercase tracking-wider">{column.name}</h2><span className="text-xs text-muted-foreground">{total}</span></div>
      {column.wipLimit && <span className={cn("text-[10px] font-bold", limitReached ? "text-amber-400" : "text-muted-foreground")}>WIP {total}/{column.wipLimit}</span>}
    </header>
    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
      <div className="min-h-24 space-y-3">
        {items.map((item) => <WorkItemCard key={item.id} item={item} columns={columns} canEdit={canEdit} open={() => open(item)} move={(columnId) => move(item.id, columnId)} backlog={() => backlog(item.id)} />)}
        {items.length === 0 && <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">Arraste um item para cá</div>}
      </div>
    </SortableContext>
  </section>;
}

function WorkItemCard({ item, columns, canEdit, open, move, backlog }: { item: BoardWorkItem; columns: BoardColumn[]; canEdit: boolean; open: () => void; move: (columnId: string) => void; backlog: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: !canEdit });
  return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn("rounded-lg border border-border bg-background p-3 shadow-sm transition", isDragging && "z-20 opacity-60 shadow-xl")}>
    <div className="flex items-start gap-2">
      {canEdit && <button type="button" {...attributes} {...listeners} className="mt-0.5 cursor-grab rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing" aria-label={`Arrastar ${item.key}`}><GripVertical className="size-4" /></button>}
      <button type="button" onClick={open} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2"><WorkItemTypeIcon type={item.type} /><span className="font-mono text-[10px] font-bold text-primary">{item.key}</span><span className={cn("ml-auto text-[10px] font-bold", priorityClasses[item.priority])}>{priorityLabels[item.priority]}</span></div>
        <h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>{typeLabels[item.type]}</span><span>v{item.version}</span></div>
      </button>
    </div>
    {canEdit && <label className="mt-3 block border-t border-border pt-2"><span className="sr-only">Mover {item.key}</span><select value={item.columnId} onChange={(event) => event.target.value === "__backlog" ? backlog() : move(event.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[10px] text-muted-foreground"><option value={item.columnId}>Mover para…</option>{columns.filter((column) => column.id !== item.columnId).map((column) => <option key={column.id} value={column.id}>{column.name}</option>)}<option value="__backlog">Enviar ao backlog</option></select></label>}
  </article>;
}

function BacklogList({ items, canEdit, open, plan }: { items: BoardWorkItem[]; canEdit: boolean; open: (item: BoardWorkItem) => void; plan: (itemId: string) => void }) {
  return <section className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8">
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-[100px_1fr_110px_100px] border-b border-border bg-muted/30 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span>Chave</span><span>Item</span><span>Prioridade</span><span className="text-right">Ação</span></div>
      {items.map((item) => <div key={item.id} className="grid grid-cols-[100px_1fr_110px_100px] items-center gap-2 border-b border-border px-4 py-3 last:border-0">
        <button type="button" onClick={() => open(item)} className="text-left font-mono text-xs font-bold text-primary">{item.key}</button>
        <button type="button" onClick={() => open(item)} className="min-w-0 text-left"><span className="block truncate text-sm font-semibold">{item.title}</span><span className="text-xs text-muted-foreground">{typeLabels[item.type]}</span></button>
        <span className={cn("text-xs font-bold", priorityClasses[item.priority])}>{priorityLabels[item.priority]}</span>
        {canEdit ? <button type="button" onClick={() => plan(item.id)} className="flex items-center justify-end gap-1 text-xs font-bold text-primary">Planejar <ArrowRight className="size-3.5" /></button> : <span className="text-right text-xs text-muted-foreground">Visualizar</span>}
      </div>)}
      {items.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">Nenhum item neste backlog com os filtros atuais.</div>}
    </div>
  </section>;
}

function CreateItemSheet({ open, onOpenChange, saving, inBacklog, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; saving: boolean; inBacklog: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild><Button><Plus /> Criar item</Button></SheetTrigger>
    <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
      <SheetHeader><SheetTitle>Novo item</SheetTitle><SheetDescription>{inBacklog ? "O item será criado no backlog para refinamento." : "O item será criado na primeira coluna do workflow."}</SheetDescription></SheetHeader>
      <form onSubmit={onSubmit} className="space-y-5 px-4 pb-8">
        <div className="space-y-2"><Label htmlFor="item-title">Título</Label><Input id="item-title" name="title" required maxLength={180} autoFocus placeholder="Ex.: Validar recuperação de senha" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label htmlFor="item-type">Tipo</Label><select id="item-type" name="type" className="field w-full">{Object.entries(typeLabels).filter(([type]) => type !== "subtask").map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="item-priority">Prioridade</Label><select id="item-priority" name="priority" className="field w-full">{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        </div>
        <div className="space-y-2"><Label htmlFor="item-description">Descrição</Label><Textarea id="item-description" name="description" rows={7} maxLength={10000} placeholder="Contexto, objetivo e critérios iniciais…" /></div>
        <Button className="w-full" disabled={saving}>{saving ? "Criando…" : "Criar item"}</Button>
      </form>
    </SheetContent>
  </Sheet>;
}
