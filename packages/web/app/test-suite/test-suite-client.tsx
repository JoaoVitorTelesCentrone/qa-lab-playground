"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Archive, ChevronDown, ChevronRight, Code2, FileCode2, Folder, FolderOpen, FolderPlus, Loader2, Plus, Save, TestTube2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { buildTestSuiteTree, descendantIds } from "@/lib/test-suite/domain";
import { testSuiteFileTypes, testSuiteLanguages, type PersonalTestSuite, type TestSuiteFileType, type TestSuiteLanguage, type TestSuiteNode, type TestSuiteSnapshot, type TestSuiteTreeNode } from "@/lib/test-suite/types";

const languageLabels: Record<TestSuiteLanguage, string> = { typescript: "TypeScript", javascript: "JavaScript", python: "Python", gherkin: "Gherkin", json: "JSON", yaml: "YAML", markdown: "Markdown", text: "Texto" };
const fileTypeLabels: Record<TestSuiteFileType, string> = { spec: "Spec", fixture: "Fixture", page_object: "Page object", helper: "Helper", config: "Configuração", data: "Massa de dados", other: "Outro" };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível concluir a operação.");
  return body.data as T;
}

export function TestSuiteClient({ initialSnapshot }: { initialSnapshot: TestSuiteSnapshot }) {
  const [suite, setSuite] = useState(initialSnapshot.suite);
  const [nodes, setNodes] = useState(initialSnapshot.nodes);
  const [selectedId, setSelectedId] = useState<string | null>(() => initialSnapshot.nodes.find((node) => node.nodeType === "file")?.id ?? initialSnapshot.nodes[0]?.id ?? null);
  const [expanded, setExpanded] = useState(() => new Set(initialSnapshot.nodes.filter((node) => node.nodeType === "folder").map((node) => node.id)));
  const [creating, setCreating] = useState<{ open: boolean; parentId: string | null; nodeType: "folder" | "file" }>({ open: false, parentId: null, nodeType: "file" });
  const [renamingSuite, setRenamingSuite] = useState(false);

  const tree = useMemo(() => buildTestSuiteTree(nodes), [nodes]);
  const selected = nodes.find((node) => node.id === selectedId) ?? null;
  const folders = nodes.filter((node) => node.nodeType === "folder").sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const files = nodes.filter((node) => node.nodeType === "file");

  function openCreate(nodeType: "folder" | "file", parentId?: string | null) {
    const target = parentId !== undefined ? parentId : selected?.nodeType === "folder" ? selected.id : selected?.parentId ?? null;
    setCreating({ open: true, parentId: target, nodeType });
  }

  function upsertNode(node: TestSuiteNode) {
    setNodes((current) => current.some((item) => item.id === node.id) ? current.map((item) => item.id === node.id ? node : item) : [...current, node]);
  }

  async function renameSuite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const updated = await request<PersonalTestSuite>("/api/v1/test-suite", { method: "PATCH", body: JSON.stringify({ name: form.get("name"), expectedVersion: suite.version }) });
      setSuite(updated);
      setRenamingSuite(false);
      toast.success("Test Suite renomeada.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível renomear."); }
  }

  async function archive(node: TestSuiteNode) {
    const label = node.nodeType === "folder" ? "esta pasta e todo o conteúdo dentro dela" : "este arquivo";
    if (!window.confirm(`Arquivar ${label}?`)) return;
    try {
      await request(`/api/v1/test-suite/nodes/${node.id}`, { method: "DELETE", body: JSON.stringify({ expectedVersion: node.version }) });
      const removed = descendantIds(nodes, node.id); removed.add(node.id);
      setNodes((current) => current.filter((item) => !removed.has(item.id)));
      if (selectedId && removed.has(selectedId)) setSelectedId(null);
      toast.success(node.nodeType === "folder" ? "Pasta arquivada." : "Arquivo arquivado.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível arquivar."); }
  }

  return <main className="min-h-[calc(100vh-5rem)] bg-[#0D1117]">
    <header className="border-b border-white/10 bg-[#12161C] px-5 py-4 sm:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neon text-[#101319]"><TestTube2 className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-neon">Workspace pessoal</p>
            <button onClick={() => setRenamingSuite(true)} className="mt-0.5 max-w-full truncate text-left text-lg font-black text-off-white hover:text-mint">{suite.name}</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => openCreate("folder")}><FolderPlus /> Nova pasta</Button>
          <Button onClick={() => openCreate("file")}><Plus /> Novo arquivo</Button>
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1600px] lg:min-h-[calc(100vh-10rem)] lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-white/10 bg-[#101319] p-4 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-2 pb-3">
          <p className="text-xs font-black uppercase tracking-[.15em] text-[#69737E]">Arquivos</p>
          <span className="text-[10px] text-[#69737E]">{folders.length} pastas · {files.length} arquivos</span>
        </div>
        {tree.length ? <ul className="space-y-0.5"><Tree entries={tree} selectedId={selectedId} expanded={expanded} onSelect={setSelectedId} onToggle={(id) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} onCreate={openCreate} /></ul> : <div className="rounded-xl border border-dashed border-white/15 p-5 text-center"><FolderOpen className="mx-auto size-6 text-[#69737E]" /><p className="mt-3 text-sm font-bold text-off-white">Sua suíte está vazia</p><p className="mt-2 text-xs leading-5 text-[#8B949E]">Crie uma pasta ou comece por um arquivo de teste.</p></div>}
      </aside>

      <section className="min-w-0 p-5 sm:p-8">
        {selected ? <NodeEditor key={`${selected.id}:${selected.version}`} node={selected} nodes={nodes} onSaved={upsertNode} onArchive={archive} /> : <EmptyEditor onCreate={() => openCreate("file", null)} />}
      </section>
    </div>

    <CreateNodeSheet state={creating} folders={folders} onClose={() => setCreating((current) => ({ ...current, open: false }))} onCreated={(node) => { upsertNode(node); setSelectedId(node.id); if (node.parentId) setExpanded((current) => new Set(current).add(node.parentId!)); setCreating((current) => ({ ...current, open: false })); }} />

    <Sheet open={renamingSuite} onOpenChange={setRenamingSuite}><SheetContent><SheetHeader><SheetTitle>Renomear Test Suite</SheetTitle><SheetDescription>Este nome identifica seu workspace pessoal.</SheetDescription></SheetHeader><form onSubmit={renameSuite} className="mt-6 space-y-4"><div className="space-y-2"><Label htmlFor="suite-name">Nome</Label><Input id="suite-name" name="name" defaultValue={suite.name} required maxLength={100} autoFocus /></div><Button className="w-full"><Save /> Salvar nome</Button></form></SheetContent></Sheet>
  </main>;
}

function Tree({ entries, selectedId, expanded, onSelect, onToggle, onCreate, depth = 0 }: {
  entries: TestSuiteTreeNode[]; selectedId: string | null; expanded: Set<string>; onSelect: (id: string) => void; onToggle: (id: string) => void; onCreate: (type: "folder" | "file", parentId: string | null) => void; depth?: number;
}) {
  return entries.map((entry) => {
    const open = expanded.has(entry.id);
    return <li key={entry.id}>
      <div className={`group flex items-center rounded-lg transition ${selectedId === entry.id ? "bg-neon/10 text-neon" : "text-[#AAB2BC] hover:bg-white/5 hover:text-off-white"}`} style={{ paddingLeft: `${depth * 14 + 4}px` }}>
        {entry.nodeType === "folder" ? <button className="p-1" onClick={() => onToggle(entry.id)} aria-label={open ? `Fechar ${entry.name}` : `Abrir ${entry.name}`}>{open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}</button> : <span className="w-[22px]" />}
        <button onClick={() => onSelect(entry.id)} className="flex min-w-0 flex-1 items-center gap-2 px-1 py-2 text-left text-xs font-semibold">
          {entry.nodeType === "folder" ? open ? <FolderOpen className="size-4 shrink-0 text-mint" /> : <Folder className="size-4 shrink-0 text-mint" /> : <FileCode2 className="size-4 shrink-0 text-[#9BC0F5]" />}
          <span className="truncate">{entry.name}</span>
        </button>
        {entry.nodeType === "folder" && <button onClick={() => onCreate("file", entry.id)} className="mr-1 rounded p-1 opacity-0 hover:bg-white/10 group-hover:opacity-100" aria-label={`Criar arquivo em ${entry.name}`}><Plus className="size-3.5" /></button>}
      </div>
      {entry.nodeType === "folder" && open && entry.children.length > 0 && <ul><Tree entries={entry.children} selectedId={selectedId} expanded={expanded} onSelect={onSelect} onToggle={onToggle} onCreate={onCreate} depth={depth + 1} /></ul>}
    </li>;
  });
}

function NodeEditor({ node, nodes, onSaved, onArchive }: { node: TestSuiteNode; nodes: TestSuiteNode[]; onSaved: (node: TestSuiteNode) => void; onArchive: (node: TestSuiteNode) => void }) {
  const [saving, setSaving] = useState(false);
  const blockedTargets = useMemo(() => { const ids = descendantIds(nodes, node.id); ids.add(node.id); return ids; }, [nodes, node.id]);
  const folders = nodes.filter((item) => item.nodeType === "folder" && !blockedTargets.has(item.id)).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const updated = await request<TestSuiteNode>(`/api/v1/test-suite/nodes/${node.id}`, { method: "PATCH", body: JSON.stringify({
        action: "update", name: form.get("name"), language: form.get("language"), fileType: form.get("fileType"), content: form.get("content"), expectedVersion: node.version,
      }) });
      onSaved(updated); toast.success(node.nodeType === "folder" ? "Pasta atualizada." : "Arquivo salvo.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível salvar."); }
    finally { setSaving(false); }
  }

  async function move(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const form = new FormData(event.currentTarget); const parentId = String(form.get("parentId") ?? "") || null;
    try {
      const updated = await request<TestSuiteNode>(`/api/v1/test-suite/nodes/${node.id}`, { method: "PATCH", body: JSON.stringify({ action: "move", parentId, expectedVersion: node.version }) });
      onSaved(updated); toast.success("Item movido.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível mover."); }
    finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-5xl">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
      <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-neon">{node.nodeType === "folder" ? "Pasta" : fileTypeLabels[node.fileType ?? "other"]}</p><h1 className="mt-2 break-all text-2xl font-black text-off-white">{node.name}</h1><p className="mt-1 text-xs text-[#69737E]">versão {node.version} · atualizado em {new Date(node.updatedAt).toLocaleString("pt-BR")}</p></div>
      <Button variant="ghost" className="text-coral hover:text-coral" onClick={() => void onArchive(node)}><Archive /> Arquivar</Button>
    </header>

    <form onSubmit={save} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="node-name">Nome</Label><Input id="node-name" name="name" defaultValue={node.name} required maxLength={120} /></div>
        {node.nodeType === "file" && <><div className="space-y-2"><Label htmlFor="node-language">Linguagem</Label><select id="node-language" name="language" defaultValue={node.language ?? "typescript"} className="field w-full">{testSuiteLanguages.map((language) => <option key={language} value={language}>{languageLabels[language]}</option>)}</select></div><div className="space-y-2"><Label htmlFor="node-file-type">Tipo</Label><select id="node-file-type" name="fileType" defaultValue={node.fileType ?? "spec"} className="field w-full">{testSuiteFileTypes.map((type) => <option key={type} value={type}>{fileTypeLabels[type]}</option>)}</select></div></>}
      </div>
      {node.nodeType === "file" && <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="node-content">Conteúdo</Label><span className="text-[10px] uppercase tracking-wider text-[#69737E]">{languageLabels[node.language ?? "text"]}</span></div><textarea id="node-content" name="content" defaultValue={node.content} maxLength={500000} spellCheck={false} className="min-h-[460px] w-full resize-y rounded-xl border border-white/10 bg-[#080B0F] p-4 font-mono text-sm leading-6 text-[#D9DEE4] outline-none transition focus:border-mint/45" /></div>}
      <Button disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Salvar alterações</Button>
    </form>

    <form onSubmit={move} className="mt-8 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#171B21] p-4 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1 space-y-2"><Label htmlFor="move-parent">Mover para</Label><select id="move-parent" name="parentId" defaultValue={node.parentId ?? ""} className="field w-full"><option value="">Raiz da suíte</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></div>
      <Button variant="outline" disabled={saving}>Mover</Button>
    </form>
  </div>;
}

function CreateNodeSheet({ state, folders, onClose, onCreated }: { state: { open: boolean; parentId: string | null; nodeType: "folder" | "file" }; folders: TestSuiteNode[]; onClose: () => void; onCreated: (node: TestSuiteNode) => void }) {
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget);
    try {
      const created = await request<TestSuiteNode>("/api/v1/test-suite/nodes", { method: "POST", body: JSON.stringify({ nodeType: state.nodeType, parentId: form.get("parentId") || null, name: form.get("name"), language: form.get("language"), fileType: form.get("fileType") }) });
      onCreated(created); toast.success(state.nodeType === "folder" ? "Pasta criada." : "Arquivo criado com template inicial.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível criar."); }
    finally { setSaving(false); }
  }
  return <Sheet open={state.open} onOpenChange={(open) => { if (!open) onClose(); }}><SheetContent><SheetHeader><SheetTitle>{state.nodeType === "folder" ? "Nova pasta" : "Novo arquivo de teste"}</SheetTitle><SheetDescription>O item será criado somente dentro da sua Test Suite pessoal.</SheetDescription></SheetHeader><form onSubmit={submit} className="mt-6 space-y-4"><div className="space-y-2"><Label htmlFor="create-name">Nome</Label><Input id="create-name" name="name" placeholder={state.nodeType === "folder" ? "e2e" : "login.spec.ts"} required maxLength={120} autoFocus /></div><div className="space-y-2"><Label htmlFor="create-parent">Local</Label><select key={state.parentId ?? "root"} id="create-parent" name="parentId" defaultValue={state.parentId ?? ""} className="field w-full"><option value="">Raiz da suíte</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></div>{state.nodeType === "file" && <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="create-language">Linguagem</Label><select id="create-language" name="language" defaultValue="typescript" className="field w-full">{testSuiteLanguages.map((language) => <option key={language} value={language}>{languageLabels[language]}</option>)}</select></div><div className="space-y-2"><Label htmlFor="create-type">Tipo</Label><select id="create-type" name="fileType" defaultValue="spec" className="field w-full">{testSuiteFileTypes.map((type) => <option key={type} value={type}>{fileTypeLabels[type]}</option>)}</select></div></div>}<Button className="w-full" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : state.nodeType === "folder" ? <FolderPlus /> : <FileCode2 />} Criar</Button></form></SheetContent></Sheet>;
}

function EmptyEditor({ onCreate }: { onCreate: () => void }) {
  return <div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-neon/10 text-neon"><Code2 className="size-7" /></span><h1 className="mt-5 text-2xl font-black text-off-white">Crie seu primeiro arquivo de teste</h1><p className="mt-3 text-sm leading-7 text-[#8B949E]">Organize specs, fixtures, page objects, helpers e massas de dados em uma árvore privada vinculada à sua conta.</p><Button className="mt-6" onClick={onCreate}><Plus /> Novo arquivo</Button></div></div>;
}
