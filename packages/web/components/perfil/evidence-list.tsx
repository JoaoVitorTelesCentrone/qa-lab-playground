"use client";

// Lista de evidências: densa e escaneável, não um card gigante por entrega.
// Cada linha responde três coisas de uma vez — de que Lab veio, quando foi
// entregue e se está publicada.

import Link from "next/link";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { labLabel, labs } from "@/lib/playground/catalog";
import type { Portfolio } from "./use-portfolio";

export function EvidenceList({ portfolio }: { portfolio: Portfolio }) {
  const { items, busy, togglePublished } = portfolio;
  const published = items.filter((item) => item.published).length;

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="evidencias-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <ClipboardCheck className="size-4 text-primary" aria-hidden="true" />
          <h2 id="evidencias-title" className="text-base font-semibold">Evidências</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {items.length} registrada{items.length === 1 ? "" : "s"} · {published} publicada{published === 1 ? "" : "s"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-border px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma evidência registrada ainda.</p>
          <Button asChild size="sm" variant="outline" className="mt-4"><Link href="/labs">Escolher um Lab</Link></Button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => {
            const lab = labs.find((candidate) => candidate.slug === item.labSlug);
            return (
              <li key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                {/* Miniatura sem quebrar a densidade da linha: só a primeira
                    imagem, para o aluno reconhecer a entrega de relance. */}
                <Thumb item={item} />
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-xs text-primary">{lab ? `LAB ${labLabel(lab)}` : item.labSlug}</span>
                  <p className="mt-1.5 truncate text-sm font-medium">{lab?.title ?? item.labSlug}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{item.evidence || "Evidência só em anexo."}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                  {item.attachments.length > 0 && <span className="text-xs text-muted-foreground">{item.attachments.length} anexo(s)</span>}
                  <span className="text-xs text-muted-foreground tabular-nums">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                  <Badge variant={item.published ? "default" : "ghost"} className={item.published ? "font-normal" : "border-border font-normal"}>
                    {item.published ? "publicada" : "privada"}
                  </Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy === item.id}
                    onClick={() => togglePublished(item)}
                  >
                    {busy === item.id && <Loader2 className="size-3.5 animate-spin" />}
                    {item.published ? "Despublicar" : "Publicar"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Thumb({ item }: { item: { attachments: Array<{ url: string; type: string; name: string }> } }) {
  const image = item.attachments.find((file) => file.type.startsWith("image/"));
  if (!image) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- anexo do aluno, fora do domínio otimizado
    <img src={image.url} alt="" className="size-10 shrink-0 rounded border border-border object-cover" />
  );
}
