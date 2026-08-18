"use client";

// Card do portfólio público: estado da página, endereço, chamada e o que dá
// para levar embora (Markdown/JSON).
//
// Publicar continua sendo decisão em dois níveis — ligar a página aqui e marcar
// cada evidência na lista abaixo. O texto do card diz isso em vez de sugerir
// que o interruptor expõe tudo.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, Download, ExternalLink, Globe, Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { countBySeverity, toEntries, toMarkdown } from "@/lib/product/portfolio-format";
import { SeverityChip } from "./severity-chip";
import type { Portfolio } from "./use-portfolio";

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function PublicPortfolioCard({ portfolio, username, onUsername, name }: {
  portfolio: Portfolio;
  username: string;
  onUsername: (value: string) => void;
  name: string;
}) {
  const { items, headline, setHeadline, isPublic, busy, error, saved, patch, commitUsername, commitHeadline } = portfolio;
  const [copied, setCopied] = useState(false);
  const ready = username.length >= 3;
  const entries = toEntries(items);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/portfolio/${username}`);
      setCopied(true);
    } catch {
      // Sem permissão de área de transferência (ou contexto inseguro): o
      // endereço continua visível no campo ao lado para copiar à mão.
      setCopied(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="portfolio-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="portfolio-title" className="text-base font-semibold">Portfólio público</h2>
        <Badge variant={isPublic ? "default" : "ghost"} className={isPublic ? "font-medium" : "border-border font-medium"}>
          {isPublic ? <Globe className="size-3" aria-hidden="true" /> : <Lock className="size-3" aria-hidden="true" />}
          {isPublic ? "Página pública" : "Privado"}
        </Badge>
      </div>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {isPublic
          ? "Sua página está no ar com as evidências que você marcou como publicadas. As demais continuam privadas."
          : "Sua página está desligada. Nada seu aparece para quem não está logado — nem as evidências marcadas como publicadas."}
      </p>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="portfolio-username" className="text-xs font-medium text-muted-foreground">
            Endereço · /portfolio/
          </label>
          <div className="flex gap-2">
            <input
              id="portfolio-username"
              value={username}
              onChange={(event) => onUsername(event.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase())}
              onBlur={(event) => commitUsername(event.target.value)}
              minLength={3}
              maxLength={30}
              className="field w-full min-w-0"
              placeholder="seu-nome"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!ready}
              onClick={copyUrl}
              aria-label="Copiar endereço do portfólio"
              className="shrink-0"
            >
              {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
            </Button>
          </div>
          {copied && <span role="status" className="text-xs text-primary">Link copiado</span>}
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="portfolio-headline" className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Chamada</span>
            <span className="tabular-nums">{headline.length}/160</span>
          </label>
          <input
            id="portfolio-headline"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            onBlur={(event) => commitHeadline(event.target.value)}
            maxLength={160}
            className="field w-full"
            placeholder="QA em formação, focada em fluxos de e-commerce"
          />
        </div>
      </div>

      {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
      <p aria-live="polite" className="mt-3 min-h-4 text-xs">
        {saved && !error ? <span className="inline-flex items-center gap-1.5 text-primary"><Check className="size-3.5" aria-hidden="true" /> Portfólio atualizado.</span> : null}
      </p>

      <div className="mt-4 grid gap-2 border-t border-border pt-5">
        {isPublic && ready && (
          <Button asChild size="sm" className="w-full">
            <Link href={`/portfolio/${username}`}><ExternalLink className="size-3.5" /> Ver minha página pública</Link>
          </Button>
        )}
        {items.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => download("evidencias-qa-lab.md", toMarkdown(entries, { name }), "text/markdown;charset=utf-8")}>
              <Download className="size-3.5" /> Markdown
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => download("evidencias-qa-lab.json", JSON.stringify(entries, null, 2), "application/json")}>
              <Download className="size-3.5" /> JSON
            </Button>
          </div>
        )}
        <Button
          type="button"
          size="sm"
          variant={isPublic ? "outline" : "default"}
          disabled={busy !== "" || (!isPublic && !ready)}
          onClick={() => patch({ portfolioPublic: !isPublic }, "public")}
          className={isPublic ? "border-destructive/30 text-destructive hover:bg-destructive/10" : ""}
        >
          {busy === "public" && <Loader2 className="size-3.5 animate-spin" />}
          {isPublic ? "Deixar privado" : "Publicar portfólio"}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs font-medium text-muted-foreground">Severidades registradas</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {countBySeverity(items).map((item) => (
              <SeverityChip key={item.severity} severity={item.severity} label={`${item.severity}: ${item.total}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
