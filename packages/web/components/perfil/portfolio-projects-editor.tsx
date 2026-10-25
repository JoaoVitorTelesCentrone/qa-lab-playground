"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, BriefcaseBusiness, ExternalLink, Globe2, Image as ImageIcon, ImagePlus, Loader2, LockKeyhole, Plus, Save, Trash2, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Submission } from "@/lib/product/journey";
import { labs } from "@/lib/playground/catalog";
import { formatBytes } from "@/lib/product/evidence-limits";
import { MAX_PORTFOLIO_PROJECT_IMAGE_BYTES, MAX_PORTFOLIO_PROJECT_MEDIA, MAX_PORTFOLIO_PROJECT_MEDIA_BYTES, MAX_PORTFOLIO_PROJECT_MEDIA_TOTAL_BYTES, PORTFOLIO_PROJECT_MEDIA_TYPES, type PortfolioProjectDraft, type PortfolioProjectMedia } from "@/lib/product/portfolio-projects";

type Fields = Omit<PortfolioProjectDraft, "id" | "sortOrder" | "published" | "updatedAt" | "media">;

const empty: Fields = {
  source: "pessoal", name: "", summary: "", role: "", period: "", links: [], caseSubmissionIds: [],
};

export function PortfolioProjectsEditor({ projects, submissions, username, portfolioPublic }: {
  projects: PortfolioProjectDraft[];
  submissions: Submission[];
  username: string;
  portfolioPublic: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(projects);
  const [creating, setCreating] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");

  function replace(project: PortfolioProjectDraft) {
    setItems((current) => current.some((item) => item.id === project.id)
      ? current.map((item) => item.id === project.id ? project : item)
      : [...current, project]);
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function move(id: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length || ordering) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((item, sortOrder) => ({ ...item, sortOrder }));
    setItems(ordered); setOrdering(true); setOrderError("");
    try {
      const response = await fetch("/api/v1/portfolio/projects/order", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ projectIds: ordered.map((item) => item.id) }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível salvar a ordem dos projetos.");
      router.refresh();
    } catch (cause) {
      setItems(items);
      setOrderError(cause instanceof Error ? cause.message : "Não foi possível salvar a ordem dos projetos.");
    } finally {
      setOrdering(false);
    }
  }

  return <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="portfolio-projects-title">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5"><BriefcaseBusiness className="size-4 text-primary" aria-hidden="true" /><h2 id="portfolio-projects-title" className="text-base font-semibold">Projetos do portfólio</h2></div>
      {!creating && <Button type="button" size="sm" variant="outline" onClick={() => setCreating(true)}><Plus className="size-3.5" /> Novo projeto</Button>}
    </div>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Apresente projetos pessoais ou profissionais e reúna neles os cases de QA que já publicou. Salvar alterações não troca a versão pública; publique quando estiver pronto.</p>
    {!portfolioPublic && <p className="mt-3 rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">Seu portfólio está privado. Projetos publicados só ficam acessíveis quando você também publica a página do portfólio.</p>}

    {creating && <div className="mt-5"><ProjectForm submissions={submissions} onCancel={() => setCreating(false)} onSave={(project) => { replace(project); setCreating(false); }} /></div>}

    {items.length === 0 && !creating
      ? <div className="mt-5 rounded-lg border border-dashed border-border px-5 py-8 text-center"><p className="text-sm text-muted-foreground">Nenhum projeto autoral ainda. Crie um para reunir cases e explicar seu papel.</p></div>
      : <div className="mt-5 grid gap-3">{items.map((project, index) => <ProjectForm key={project.id} project={project} submissions={submissions} username={username} portfolioPublic={portfolioPublic} canMoveUp={index > 0} canMoveDown={index < items.length - 1} ordering={ordering} onMove={(direction) => void move(project.id, direction)} onSave={replace} onDelete={remove} />)}</div>}
    {orderError && <p role="alert" className="mt-3 text-xs text-destructive">{orderError}</p>}
  </section>;
}

function ProjectForm({ project, submissions, username, portfolioPublic, canMoveUp, canMoveDown, ordering, onMove, onSave, onDelete, onCancel }: {
  project?: PortfolioProjectDraft;
  submissions: Submission[];
  username?: string;
  portfolioPublic?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  ordering?: boolean;
  onMove?: (direction: -1 | 1) => void;
  onSave: (project: PortfolioProjectDraft) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(() => project ? {
    source: project.source, name: project.name, summary: project.summary, role: project.role,
    period: project.period, links: project.links, caseSubmissionIds: project.caseSubmissionIds,
  } : empty);
  const [media, setMedia] = useState<PortfolioProjectMedia[]>(() => project?.media ?? []);
  const [published, setPublished] = useState(Boolean(project?.published));
  const [dirty, setDirty] = useState(!project);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const usableCases = submissions.filter((item) => item.published);

  function change<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setDirty(true); setError("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy("save"); setError("");
    const response = await fetch(project ? `/api/v1/portfolio/projects/${project.id}` : "/api/v1/portfolio/projects", {
      method: project ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(fields),
    });
    const body = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) {
      const validationMessage = Object.values(body?.error?.details ?? {}).find((value): value is string => typeof value === "string");
      setError(body?.error?.message ?? validationMessage ?? "Não foi possível salvar o projeto.");
      return;
    }
    const next = { ...body.data, media, published: published || project?.published || false } as PortfolioProjectDraft;
    setDirty(false); onSave(next); router.refresh();
  }

  async function setProjectPublished(nextPublished: boolean) {
    if (!project) return;
    if (dirty) { setError("Salve as alterações antes de publicar."); return; }
    setBusy("publish"); setError("");
    const response = await fetch(`/api/v1/portfolio/projects/${project.id}/publish`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ published: nextPublished }),
    });
    const body = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) { setError(body?.error?.message ?? "Não foi possível publicar o projeto."); return; }
    setPublished(nextPublished);
    onSave({ ...project, ...fields, media, published: nextPublished });
    router.refresh();
  }

  async function removeProject() {
    if (!project || !window.confirm("Excluir este projeto e sua publicação?")) return;
    setBusy("delete"); setError("");
    const response = await fetch(`/api/v1/portfolio/projects/${project.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) { setError(body?.error?.message ?? "Não foi possível excluir o projeto."); return; }
    onDelete?.(project.id); router.refresh();
  }

  const url = username && project ? `/portfolio/${username}/projeto/${project.id}` : "";

  return <form onSubmit={save} className="grid gap-4 rounded-lg border border-border bg-background/50 p-4 sm:p-5">
    {project && <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{published ? "Publicado" : "Rascunho"}{dirty && " · alterações não salvas"}</p><div className="flex items-center gap-2">{onMove && <span className="flex items-center gap-1"><button type="button" onClick={() => onMove(-1)} disabled={!canMoveUp || ordering} aria-label="Mover projeto para cima" title="Mover para cima" className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40"><ArrowUp className="size-3.5" aria-hidden="true" /></button><button type="button" onClick={() => onMove(1)} disabled={!canMoveDown || ordering} aria-label="Mover projeto para baixo" title="Mover para baixo" className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40"><ArrowDown className="size-3.5" aria-hidden="true" /></button></span>}{published && portfolioPublic && url && <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">Abrir página pública <ExternalLink className="size-3" /></a>}</div></div>}

    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-xs font-medium">Nome do projeto<input required minLength={3} maxLength={100} value={fields.name} onChange={(event) => change("name", event.target.value)} placeholder="Ex.: Reestruturação do fluxo de pagamentos" className="field w-full" /></label>
      <label className="grid gap-1.5 text-xs font-medium">Origem<select value={fields.source} onChange={(event) => change("source", event.target.value as Fields["source"])} className="field w-full"><option value="pessoal">Projeto pessoal</option><option value="profissional">Experiência profissional</option></select></label>
      <label className="grid gap-1.5 text-xs font-medium">Seu papel<input maxLength={160} value={fields.role} onChange={(event) => change("role", event.target.value)} placeholder="Ex.: QA responsável pelos testes funcionais" className="field w-full" /></label>
      <label className="grid gap-1.5 text-xs font-medium">Período<input maxLength={80} value={fields.period} onChange={(event) => change("period", event.target.value)} placeholder="Ex.: mar. 2025 – atual" className="field w-full" /></label>
    </div>

    <label className="grid gap-1.5 text-xs font-medium">Contexto e resultado<textarea maxLength={1800} rows={4} value={fields.summary} onChange={(event) => change("summary", event.target.value)} placeholder="O que o projeto faz, qual problema resolveu e qual foi o resultado do seu trabalho." className="field w-full resize-y leading-6" /></label>
    <label className="grid gap-1.5 text-xs font-medium">Links públicos <span className="font-normal text-muted-foreground">Até três URLs HTTP/HTTPS, uma por linha.</span><textarea maxLength={1500} rows={2} value={fields.links.join("\n")} onChange={(event) => change("links", event.target.value.split(/\r?\n/).map((link) => link.trim()).filter(Boolean))} placeholder="https://github.com/seu-projeto" className="field w-full resize-y font-mono text-xs" /></label>

    {project
      ? <ProjectMediaEditor projectId={project.id} media={media} onBusyChange={setMediaBusy} onChange={(next) => { setMedia(next); onSave({ ...project, ...fields, media: next, published }); router.refresh(); }} />
      : <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">Salve o projeto primeiro para adicionar imagens e vídeos.</p>}

    <fieldset className="grid gap-2">
      <legend className="text-xs font-medium">Cases de QA vinculados <span className="font-normal text-muted-foreground">(opcional)</span></legend>
      {usableCases.length === 0
        ? <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">Publique um case de Lab para poder vinculá-lo aqui.</p>
        : <div className="grid max-h-52 gap-1 overflow-y-auto rounded-md border border-border p-2">{usableCases.map((item) => {
            const lab = labs.find((candidate) => candidate.slug === item.labSlug);
            const checked = fields.caseSubmissionIds.includes(item.id);
            return <label key={item.id} className="flex items-start gap-2 rounded p-2 text-xs hover:bg-muted/50"><input type="checkbox" checked={checked} onChange={(event) => change("caseSubmissionIds", event.target.checked ? [...fields.caseSubmissionIds, item.id].slice(0, 12) : fields.caseSubmissionIds.filter((id) => id !== item.id))} className="mt-0.5 accent-primary" /><span className="min-w-0"><strong className="block truncate font-medium">{lab?.title ?? item.labSlug}</strong><span className="mt-0.5 block line-clamp-2 text-muted-foreground">{item.evidence || `${item.attachments.length} anexo(s)`}</span></span></label>;
          })}</div>}
    </fieldset>

    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    <div className="flex flex-wrap gap-2 border-t border-border pt-3">
      <Button type="submit" size="sm" disabled={busy !== "" || mediaBusy || !dirty}>{busy === "save" ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}{project ? "Salvar alterações" : "Criar projeto"}</Button>
      {project && <Button type="button" size="sm" variant={published ? "outline" : "secondary"} disabled={busy !== "" || mediaBusy || dirty} onClick={() => setProjectPublished(true)}>{busy === "publish" ? <Loader2 className="size-3.5 animate-spin" /> : null}{published ? "Atualizar publicação" : "Publicar projeto"}</Button>}
      {project && published && <Button type="button" size="sm" variant="ghost" disabled={busy !== "" || mediaBusy} onClick={() => setProjectPublished(false)} className="text-destructive hover:text-destructive">Despublicar</Button>}
      {project && <Button type="button" size="sm" variant="ghost" disabled={busy !== "" || mediaBusy} onClick={removeProject} className="ml-auto text-destructive hover:text-destructive">{busy === "delete" ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />} Excluir</Button>}
      {onCancel && <Button type="button" size="sm" variant="ghost" disabled={busy !== "" || mediaBusy} onClick={onCancel}>Cancelar</Button>}
    </div>
  </form>;
}

function ProjectMediaEditor({ projectId, media, onChange, onBusyChange }: { projectId: string; media: PortfolioProjectMedia[]; onChange: (next: PortfolioProjectMedia[]) => void; onBusyChange: (busy: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const totalBytes = media.reduce((total, file) => total + file.size, 0);

  async function upload(file: File) {
    setError("");
    if (!PORTFOLIO_PROJECT_MEDIA_TYPES.includes(file.type as typeof PORTFOLIO_PROJECT_MEDIA_TYPES[number])) {
      setError("Use JPG, PNG ou WebP para imagens, ou MP4 e WebM para vídeos."); return;
    }
    if (media.length >= MAX_PORTFOLIO_PROJECT_MEDIA) { setError(`O projeto aceita até ${MAX_PORTFOLIO_PROJECT_MEDIA} arquivos.`); return; }
    if (file.size > MAX_PORTFOLIO_PROJECT_MEDIA_BYTES) { setError("O arquivo precisa ter até 10 MB."); return; }

    setBusy(true); onBusyChange(true);
    try {
      const optimized = file.type.startsWith("image/") ? await optimizeProjectImage(file) : file;
      if (optimized.size > MAX_PORTFOLIO_PROJECT_IMAGE_BYTES && optimized.type.startsWith("image/")) throw new Error("A imagem otimizada precisa ficar abaixo de 3 MB.");
      if (totalBytes + optimized.size > MAX_PORTFOLIO_PROJECT_MEDIA_TOTAL_BYTES) throw new Error("O projeto pode armazenar até 20 MB de mídia no total.");
      const prepare = await fetch(`/api/v1/portfolio/projects/${projectId}/media`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ size: optimized.size, type: optimized.type }),
      });
      const prepared = await prepare.json().catch(() => null);
      if (!prepare.ok || typeof prepared?.data?.path !== "string") throw new Error(prepared?.error?.message ?? "Não foi possível preparar o envio.");
      const path = prepared.data.path as string;
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from("lab-evidence").upload(path, optimized, { contentType: optimized.type, upsert: false });
      if (uploadError) throw new Error(`Não foi possível enviar o arquivo: ${uploadError.message}`);
      const response = await fetch(`/api/v1/portfolio/projects/${projectId}/media`, {
        method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ path, name: optimized.name }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível finalizar o envio.");
      onChange([...media, body.data as PortfolioProjectMedia]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar o arquivo.");
    } finally {
      setBusy(false); onBusyChange(false);
    }
  }

  async function remove(file: PortfolioProjectMedia) {
    setError(""); setBusy(true); onBusyChange(true);
    try {
      const response = await fetch(`/api/v1/portfolio/projects/${projectId}/media`, {
        method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: file.path }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível remover o arquivo.");
      onChange(media.filter((item) => item.path !== file.path));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível remover o arquivo.");
    } finally {
      setBusy(false); onBusyChange(false);
    }
  }

  async function toggleVisibility(file: PortfolioProjectMedia) {
    const visibility = file.visibility === "public" ? "private" : "public";
    setError(""); setBusy(true); onBusyChange(true);
    try {
      const response = await fetch(`/api/v1/portfolio/projects/${projectId}/media`, {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: file.path, visibility }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível atualizar a visibilidade.");
      onChange(media.map((item) => item.path === file.path ? { ...item, visibility, isCover: visibility === "private" ? false : item.isCover } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a visibilidade.");
    } finally {
      setBusy(false); onBusyChange(false);
    }
  }

  async function toggleCover(file: PortfolioProjectMedia) {
    const isCover = !file.isCover;
    setError(""); setBusy(true); onBusyChange(true);
    try {
      const response = await fetch(`/api/v1/portfolio/projects/${projectId}/media`, {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: file.path, isCover }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível atualizar a capa.");
      onChange(media.map((item) => ({ ...item, isCover: isCover && item.path === file.path })));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a capa.");
    } finally {
      setBusy(false); onBusyChange(false);
    }
  }

  return <section className="grid gap-3 rounded-md border border-border p-4" aria-label="Mídia do projeto">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2"><ImagePlus className="size-4 text-primary" aria-hidden="true" /><h3 className="text-sm font-medium">Imagens e vídeos</h3></div>
      <span className="text-xs text-muted-foreground">{media.length}/{MAX_PORTFOLIO_PROJECT_MEDIA} · {formatBytes(totalBytes)}/20 MB</span>
    </div>
    <p className="text-xs leading-5 text-muted-foreground">Novos arquivos começam privados. Use o ícone de cadeado ou globo para escolher quais entram no portfólio. Tornar privada remove a mídia da página pública na hora; quem já recebeu um link direto pode acessá-la até o link expirar, e cópias em cache podem durar mais. Tornar pública exige atualizar a publicação do projeto. Imagens são otimizadas no navegador (até 3 MB); vídeos MP4 ou WebM podem ter até 10 MB e só carregam quando a pessoa dá play.</p>
    <p className="-mt-2 text-xs text-muted-foreground">Use o ícone de imagem em uma imagem pública para escolher a capa do projeto.</p>

    {media.length > 0 && <ul className="grid gap-2 sm:grid-cols-2">{media.map((file) => <li key={file.path} className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-background p-2">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
        {file.type.startsWith("video/") ? <Video className="size-5 text-muted-foreground" aria-label="Vídeo" /> : file.url ? (
          // eslint-disable-next-line @next/next/no-img-element -- prévia com URL assinada do Storage
          <img src={file.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        ) : <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />}
      </div>
      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{file.name}</span><span className="text-[11px] text-muted-foreground">{formatBytes(file.size)} · {file.visibility === "public" ? "Pública" : "Privada"}</span></span>
      <button type="button" onClick={() => void toggleVisibility(file)} disabled={busy} aria-label={`${file.visibility === "public" ? "Tornar privada" : "Tornar pública"}: ${file.name}`} title={`${file.visibility === "public" ? "Tornar privada" : "Tornar pública"} · ${file.name}`} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50">
        {file.visibility === "public" ? <Globe2 className="size-4" aria-hidden="true" /> : <LockKeyhole className="size-4" aria-hidden="true" />}
      </button>
      {file.type.startsWith("image/") && <button type="button" onClick={() => void toggleCover(file)} disabled={busy || file.visibility !== "public"} aria-label={`${file.isCover ? "Remover capa" : "Usar como capa"}: ${file.name}`} title={file.visibility !== "public" ? "Torne a imagem pública para usá-la como capa" : file.isCover ? "Remover capa" : "Usar como capa"} className={`rounded p-1.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 ${file.isCover ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
        <ImageIcon className="size-4" aria-hidden="true" />
      </button>}
      <button type="button" onClick={() => void remove(file)} disabled={busy} aria-label={`Remover ${file.name}`} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"><X className="size-4" aria-hidden="true" /></button>
    </li>)}</ul>}

    <label className={`inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-primary ${busy || media.length >= MAX_PORTFOLIO_PROJECT_MEDIA ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted/50"}`}>
      {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
      {busy ? "Processando mídia…" : "Adicionar mídia"}
      <input type="file" accept={PORTFOLIO_PROJECT_MEDIA_TYPES.join(",")} disabled={busy || media.length >= MAX_PORTFOLIO_PROJECT_MEDIA} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} />
    </label>
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </section>;
}

async function optimizeProjectImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") {
    if (file.size <= MAX_PORTFOLIO_PROJECT_IMAGE_BYTES) return file;
    throw new Error("Seu navegador não conseguiu otimizar a imagem. Exporte em WebP com até 3 MB.");
  }
  const bitmap = await createImageBitmap(file);
  try {
    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível processar a imagem neste navegador.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.78));
    if (!blob) {
      if (file.size <= MAX_PORTFOLIO_PROJECT_IMAGE_BYTES) return file;
      throw new Error("Não foi possível otimizar a imagem. Exporte em WebP com até 3 MB.");
    }
    if (blob.size > MAX_PORTFOLIO_PROJECT_IMAGE_BYTES) throw new Error("A imagem ainda ficou pesada. Use uma imagem menor que 3 MB.");
    if (blob.size >= file.size && file.size <= MAX_PORTFOLIO_PROJECT_IMAGE_BYTES) return file;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
    return new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}
