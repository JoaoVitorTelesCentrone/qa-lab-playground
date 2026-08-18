"use client";

// Editor das seções livres da página pública.
//
// Cada seção é uma caixa com título, corpo e um interruptor de visibilidade. A
// visibilidade e a ordem salvam sozinhas (são um clique só, e um botão
// "salvar" para um toggle seria burocracia); o texto salva no botão, porque a
// pessoa está escrevendo e um autosave por tecla mandaria request a cada letra.

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moveSection, SECTION_LIMITS, sortSections, type PortfolioSection } from "@/lib/product/portfolio-sections";

type Draft = { title: string; body: string };

export function PortfolioSectionsEditor({ sections: initial, available }: { sections: PortfolioSection[]; available: boolean }) {
  const [sections, setSections] = useState(sortSections(initial));
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [creating, setCreating] = useState<Draft | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");

  const full = sections.length >= SECTION_LIMITS.max;

  async function send(method: "POST" | "PATCH" | "DELETE", body: Record<string, unknown>, tag: string) {
    setBusy(tag); setError(""); setSavedId("");
    const response = await fetch("/api/v1/portfolio/sections", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) {
      setError(payload?.error?.details?.title ?? payload?.error?.message ?? "Não foi possível salvar a seção.");
      return null;
    }
    return payload?.data ?? null;
  }

  function draftFor(section: PortfolioSection): Draft {
    return drafts[section.id] ?? { title: section.title, body: section.body };
  }

  function editDraft(section: PortfolioSection, patch: Partial<Draft>) {
    setDrafts((current) => ({ ...current, [section.id]: { ...draftFor(section), ...patch } }));
  }

  function isDirty(section: PortfolioSection) {
    const draft = drafts[section.id];
    return Boolean(draft) && (draft.title !== section.title || draft.body !== section.body);
  }

  async function create() {
    if (!creating || !creating.title.trim()) { setError("Dê um título à seção."); return; }
    const data = await send("POST", { title: creating.title, body: creating.body }, "create");
    if (!data) return;
    const section = data as PortfolioSection;
    setSections((current) => sortSections([...current, section]));
    setCreating(null);
    setSavedId(section.id);
  }

  async function saveSection(section: PortfolioSection) {
    const draft = draftFor(section);
    if (!draft.title.trim()) { setError("Dê um título à seção."); return; }
    const data = await send("PATCH", { id: section.id, title: draft.title, body: draft.body }, section.id);
    if (!data) return;
    setSections((current) => current.map((item) => (item.id === section.id ? (data as PortfolioSection) : item)));
    setDrafts((current) => { const next = { ...current }; delete next[section.id]; return next; });
    setSavedId(section.id);
  }

  async function toggleVisible(section: PortfolioSection) {
    const data = await send("PATCH", { id: section.id, visible: !section.visible }, `visible-${section.id}`);
    if (!data) return;
    setSections((current) => current.map((item) => (item.id === section.id ? { ...item, visible: (data as PortfolioSection).visible } : item)));
  }

  async function move(section: PortfolioSection, delta: number) {
    const order = moveSection(sections, section.id, delta);
    if (order.every((id, index) => sections[index]?.id === id)) return;
    // Otimista: a troca é visual e o servidor só confirma as posições.
    const reordered = order.map((id, index) => ({ ...sections.find((item) => item.id === id)!, position: index }));
    setSections(reordered);
    const data = await send("PATCH", { order }, `move-${section.id}`);
    if (data) setSections(sortSections(data as PortfolioSection[]));
  }

  async function remove(section: PortfolioSection) {
    const data = await send("DELETE", { id: section.id }, `delete-${section.id}`);
    if (!data) return;
    setSections((current) => current.filter((item) => item.id !== section.id));
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="secoes-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h2 id="secoes-title" className="text-base font-semibold">Seções da página pública</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Texto livre para o que a evidência não conta — formação, certificações, ferramentas. Aparecem na sua página pública, na ordem definida aqui, e só quando marcadas como visíveis.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" disabled={!available || full || creating !== null} onClick={() => setCreating({ title: "", body: "" })}>
          <Plus className="size-3.5" /> Adicionar seção
        </Button>
      </div>

      {!available && (
        <p className="mt-4 rounded-lg border border-border bg-background/40 p-4 text-xs leading-5 text-muted-foreground">
          As seções ainda não estão disponíveis: falta aplicar a migração <code>0011_portfolio_sections</code> no Supabase. O resto do portfólio continua funcionando normalmente.
        </p>
      )}

      {full && <p className="mt-4 text-xs text-muted-foreground">Limite de {SECTION_LIMITS.max} seções atingido. Apague uma para criar outra.</p>}
      {error && <p role="alert" className="mt-4 text-xs text-destructive">{error}</p>}

      {creating && (
        <div className="mt-4 grid gap-3 rounded-lg border border-primary/30 bg-background/40 p-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Título</span>
            <input
              autoFocus
              value={creating.title}
              onChange={(event) => setCreating({ ...creating, title: event.target.value })}
              maxLength={SECTION_LIMITS.title}
              className="field w-full"
              placeholder="Certificações"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Conteúdo</span>
              <span className="tabular-nums">{creating.body.length}/{SECTION_LIMITS.body}</span>
            </span>
            <textarea
              value={creating.body}
              onChange={(event) => setCreating({ ...creating, body: event.target.value })}
              maxLength={SECTION_LIMITS.body}
              rows={5}
              className="field w-full resize-none"
              placeholder={"CTFL — ISTQB (2026)\nAutomação com Cypress — 40h"}
            />
          </label>
          <div className="flex gap-2">
            <Button type="button" size="sm" disabled={busy === "create"} onClick={create}>
              {busy === "create" ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Criar seção
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => { setCreating(null); setError(""); }}>
              <X className="size-3.5" /> Cancelar
            </Button>
          </div>
        </div>
      )}

      {sections.length === 0
        ? available && !creating && (
            <div className="mt-4 rounded-lg border border-dashed border-border px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma seção criada ainda.</p>
              <p className="mt-1 text-xs text-muted-foreground">Sua página pública continua mostrando projetos e evidências.</p>
            </div>
          )
        : (
          <ul className="mt-4 grid gap-3">
            {sections.map((section, index) => {
              const draft = draftFor(section);
              const dirty = isDirty(section);
              return (
                <li key={section.id} className="rounded-lg border border-border bg-background/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant={section.visible ? "default" : "ghost"} className={section.visible ? "font-normal" : "border-border font-normal"}>
                      {section.visible ? "visível" : "oculta"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button type="button" size="icon-sm" variant="ghost" disabled={index === 0 || busy !== ""} onClick={() => move(section, -1)} aria-label={`Mover ${section.title} para cima`}>
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button type="button" size="icon-sm" variant="ghost" disabled={index === sections.length - 1 || busy !== ""} onClick={() => move(section, 1)} aria-label={`Mover ${section.title} para baixo`}>
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button type="button" size="icon-sm" variant="ghost" disabled={busy === `visible-${section.id}`} onClick={() => toggleVisible(section)} aria-label={section.visible ? `Ocultar ${section.title} da página pública` : `Mostrar ${section.title} na página pública`}>
                        {busy === `visible-${section.id}` ? <Loader2 className="size-3.5 animate-spin" /> : section.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </Button>
                      <Button type="button" size="icon-sm" variant="ghost" disabled={busy === `delete-${section.id}`} onClick={() => remove(section)} aria-label={`Apagar seção ${section.title}`} className="text-muted-foreground hover:text-destructive">
                        {busy === `delete-${section.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <label className="grid gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Título</span>
                      <input value={draft.title} onChange={(event) => editDraft(section, { title: event.target.value })} maxLength={SECTION_LIMITS.title} className="field w-full" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Conteúdo</span>
                        <span className="tabular-nums">{draft.body.length}/{SECTION_LIMITS.body}</span>
                      </span>
                      <textarea value={draft.body} onChange={(event) => editDraft(section, { body: event.target.value })} maxLength={SECTION_LIMITS.body} rows={4} className="field w-full resize-none" />
                    </label>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button type="button" size="sm" variant="outline" disabled={!dirty || busy === section.id} onClick={() => saveSection(section)}>
                      {busy === section.id ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} Salvar seção
                    </Button>
                    {savedId === section.id && !dirty && <span role="status" className="inline-flex items-center gap-1.5 text-xs text-primary"><Check className="size-3.5" /> Seção salva.</span>}
                    {!section.body.trim() && <span className="text-xs text-muted-foreground">Sem conteúdo — não aparece na página pública.</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </section>
  );
}
