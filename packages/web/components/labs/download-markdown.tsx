"use client";

import { FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Baixa um .md gerado na hora (o conteúdo é calculado no clique, com o estado atual). */
export function DownloadMarkdownButton({ fileName, build, label = "Download report (.md)", className }: { fileName: string; build: () => string; label?: string; className?: string }) {
  function download() {
    const url = URL.createObjectURL(new Blob([build()], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = fileName;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    URL.revokeObjectURL(url);
  }
  return <button type="button" onClick={download} data-testid="download-report"
    className={cn("inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold transition-colors hover:border-brand-accent hover:text-brand-accent", className)}>
    <FileDown className="size-4" aria-hidden="true" />{label}
  </button>;
}
