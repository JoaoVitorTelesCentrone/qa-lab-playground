"use client";

// Portfólio de evidências no perfil: o que publicar, para onde apontar e como
// levar o histórico embora.
//
// Publicar é decisão em dois níveis, os dois aqui: ligar o portfólio e marcar
// cada evidência. O painel deixa isso explícito em vez de um interruptor único
// que expõe tudo de uma vez.

import Link from "next/link";
import { useState } from "react";
import { Check, Download, ExternalLink, Globe, Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { labs } from "@/lib/playground/catalog";
import { countBySeverity, toEntries, toMarkdown } from "@/lib/product/portfolio-format";
import type { Submission } from "@/lib/product/journey";

export function PortfolioPanel({ submissions, profile, name }: {
  submissions: Submission[];
  profile: { username: string; portfolioPublic: boolean; portfolioHeadline: string };
  name: string;
}) {
  const [items, setItems] = useState(submissions);
  const [username, setUsername] = useState(profile.username);
  const [headline, setHeadline] = useState(profile.portfolioHeadline);
  const [isPublic, setIsPublic] = useState(profile.portfolioPublic);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const published = items.filter((item) => item.published);
  const entries = toEntries(items);

  async function patch(body: Record<string, unknown>, tag: string) {
    setBusy(tag); setError(""); setSaved(false);
    const response = await fetch("/api/v1/portfolio", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) { setError(payload?.error?.details?.username ?? payload?.error?.message ?? "Não foi possível salvar o portfólio."); return false; }
    setUsername(payload.data.username);
    setIsPublic(payload.data.portfolioPublic);
    setHeadline(payload.data.portfolioHeadline);
    setSaved(true);
    return true;
  }

  async function togglePublished(submission: Submission) {
    setBusy(submission.id); setError("");
    const response = await fetch("/api/v1/portfolio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ submissionId: submission.id, published: !submission.published }) });
    setBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Não foi possível publicar a evidência.");
      return;
    }
    setItems((current) => current.map((item) => (item.id === submission.id ? { ...item, published: !item.published } : item)));
  }

  function download(filename: string, content: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <section className="mt-10" aria-labelledby="portfolio-title">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="portfolio-title" className="text-lg font-semibold">Portfólio de evidências</h2>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} evidência(s) registrada(s) · {published.length} publicada(s)</p>
      </div>
      {items.length > 0 && <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => download("evidencias-qa-lab.md", toMarkdown(entries, { name }), "text/markdown;charset=utf-8")}>
          <Download className="size-3.5" /> Exportar Markdown
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => download("evidencias-qa-lab.json", JSON.stringify(entries, null, 2), "application/json")}>
          <Download className="size-3.5" /> Exportar JSON
        </Button>
      </div>}
    </div>

    <div className="mt-5 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            {isPublic ? <Globe className="size-4 text-primary" aria-hidden="true" /> : <Lock className="size-4 text-muted-foreground" aria-hidden="true" />}
            Página pública do portfólio
          </h3>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
            {isPublic
              ? "Sua página está no ar com as evidências que você marcou como publicadas. As demais continuam privadas."
              : "Sua página está desligada. Nada seu aparece para quem não está logado — nem as evidências marcadas como publicadas."}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isPublic ? "outline" : "default"}
          disabled={busy !== "" || (!isPublic && username.length < 3)}
          onClick={() => patch({ portfolioPublic: !isPublic }, "public")}
        >
          {busy === "public" && <Loader2 className="size-3.5 animate-spin" />}
          {isPublic ? "Deixar privado" : "Publicar página"}
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Endereço · /portfolio/{username || "seu-nome"}</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} onBlur={() => username !== profile.username && patch({ username }, "username")} minLength={3} maxLength={30} className="field w-full" placeholder="seu-nome" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Chamada · {headline.length}/160</span>
          <input value={headline} onChange={(event) => setHeadline(event.target.value)} onBlur={() => headline !== profile.portfolioHeadline && patch({ portfolioHeadline: headline }, "headline")} maxLength={160} className="field w-full" placeholder="QA em formação, focada em fluxos de e-commerce" />
        </label>
      </div>

      {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {saved && !error ? <span className="inline-flex items-center gap-1.5 text-primary"><Check className="size-3.5" aria-hidden="true" /> Portfólio atualizado.</span> : null}
      </p>

      {isPublic && username.length >= 3 && <Link href={`/portfolio/${username}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary">
        <ExternalLink className="size-3.5" aria-hidden="true" /> Ver minha página pública
      </Link>}
    </div>

    {items.length === 0
      ? <p className="mt-5 text-sm text-muted-foreground">Nenhuma evidência registrada ainda. <Link href="/labs" className="text-primary">Escolha um Lab</Link> e conclua sua primeira entrega.</p>
      : <>
          <div className="mt-6 flex flex-wrap gap-1.5">{countBySeverity(items).map((item) => <Badge key={item.severity} variant="secondary" className="font-normal">{item.severity}: {item.total}</Badge>)}</div>
          <ul className="mt-4 divide-y divide-border border-y border-border">{items.map((item) => {
            const lab = labs.find((candidate) => candidate.slug === item.labSlug);
            return <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs text-primary">{lab ? `LAB ${String(lab.number).padStart(2, "0")}` : item.labSlug}</span>
                  <span className="text-sm font-medium">{lab?.title ?? item.labSlug}</span>
                  <Badge variant="secondary" className="font-normal">severidade {item.severity}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                  {item.published && <Badge className="font-normal">publicada</Badge>}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.result}</p>
              </div>
              <Button type="button" size="sm" variant={item.published ? "outline" : "ghost"} disabled={busy === item.id} onClick={() => togglePublished(item)}>
                {busy === item.id && <Loader2 className="size-3.5 animate-spin" />}
                {item.published ? "Despublicar" : "Publicar"}
              </Button>
            </li>;
          })}</ul>
        </>}
  </section>;
}
