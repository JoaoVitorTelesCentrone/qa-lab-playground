"use client";

// Corpo da evidência: o texto do aluno e os arquivos que ele anexou.
//
// Um componente só para as três superfícies (case público, conclusão do Lab e
// histórico privado) porque o que o aluno revê antes de publicar precisa ser
// exatamente o que o recrutador abre — se cada tela renderizasse do seu jeito,
// a revisão deixaria de valer.

import { useCallback, useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { attachmentKind } from "@/lib/product/case";
import { linkLabel, linkify } from "@/lib/product/evidence-text";
import { formatBytes } from "@/lib/product/evidence-limits";
import type { Attachment } from "@/lib/product/journey";

export function EvidenceText({ text, className = "" }: { text: string; className?: string }) {
  return <p className={`whitespace-pre-line ${className}`}>
    {linkify(text).map((segment, index) => segment.type === "link"
      ? <a
          key={index}
          href={segment.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-primary underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-ring/40"
        >{linkLabel(segment.href)}</a>
      : <span key={index}>{segment.value}</span>)}
  </p>;
}

export function AttachmentGallery({ attachments, compact }: { attachments: Attachment[]; compact?: boolean }) {
  const [open, setOpen] = useState<Attachment | null>(null);
  const close = useCallback(() => setOpen(null), []);

  // Esc fecha: o lightbox cobre a página inteira e sair só pelo ✕ prende quem
  // navega por teclado.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Anexo sem URL assinada (chave de serviço ausente ou assinatura falhou) não
  // vira card quebrado: some da galeria.
  const files = attachments.filter((file) => file.url);
  if (files.length === 0) return null;

  return <>
    <ul className={`grid gap-3 ${compact ? "grid-cols-[repeat(auto-fill,minmax(88px,1fr))]" : "sm:grid-cols-2"}`} aria-label="Anexos da evidência">
      {files.map((file) => {
        const kind = attachmentKind(file.type);
        // PDF não abre no lightbox: visualizador embutido quebra em metade dos
        // navegadores, então vai direto para a aba nova.
        const asLink = kind === "file";

        const inner = <>
          {kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element -- anexo do aluno, fora do domínio otimizado
            <img src={file.url} alt={file.name} className={`w-full bg-background object-contain ${compact ? "h-20" : "max-h-72"}`} />
          )}
          {kind === "video" && <video src={file.url} preload="metadata" muted className={`w-full bg-background object-contain ${compact ? "h-20" : "max-h-72"}`} />}
          {kind === "file" && <span className={`flex items-center justify-center gap-2 bg-background text-muted-foreground ${compact ? "h-20" : "h-24"}`}>
            <FileText className="size-5" aria-hidden="true" />
          </span>}
          {!compact && <span className="block truncate border-t border-border p-2.5 text-left text-xs text-muted-foreground">
            {file.name} · {formatBytes(file.size)}
          </span>}
        </>;

        return <li key={file.path || file.url} className="overflow-hidden rounded-lg border border-border">
          {asLink
            ? <a href={file.url} target="_blank" rel="noopener noreferrer" className="block hover:border-primary focus-visible:ring-2 focus-visible:ring-ring/40" aria-label={`Abrir ${file.name}`}>{inner}</a>
            : <button type="button" onClick={() => setOpen(file)} className="block w-full text-left transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/40" aria-label={`Ampliar ${file.name}`}>{inner}</button>}
        </li>;
      })}
    </ul>

    {open && <div
      role="dialog"
      aria-modal="true"
      aria-label={open.name}
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Fechar"
        className="absolute right-4 top-4 rounded-md bg-black/50 p-2 text-white transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
      {/* Parar a propagação para clicar na própria mídia não fechar. */}
      <div onClick={(event) => event.stopPropagation()} className="max-h-full max-w-5xl">
        {attachmentKind(open.type) === "video"
          ? <video src={open.url} controls autoPlay className="max-h-[85vh] w-full" />
          // eslint-disable-next-line @next/next/no-img-element -- anexo do aluno, fora do domínio otimizado
          : <img src={open.url} alt={open.name} className="max-h-[85vh] w-auto" />}
        <p className="mt-2 text-center text-xs text-white/70">{open.name}</p>
      </div>
    </div>}
  </>;
}
