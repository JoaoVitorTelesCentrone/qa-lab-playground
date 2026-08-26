// Card de evidência na listagem do portfólio.
//
// Raso de propósito: manchete, uma linha de contexto e data. A evidência
// inteira, os anexos e os critérios ficam na página da evidência — despejar
// tudo aqui faz cada card crescer meia tela e mata a leitura em varredura, que
// é como um recrutador olha portfólio.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { summarize, summaryRest, type PortfolioEntry } from "@/lib/product/portfolio-format";

export function EvidenceCard({ entry, username, showProject }: { entry: PortfolioEntry; username: string; showProject?: string }) {
  const isBug = entry.labMode === "investigacao";
  const text = entry.evidence.trim();
  const rest = summaryRest(text);

  return <Link
    href={`/portfolio/${username}/${entry.labSlug}`}
    className="group block rounded-xl border border-border/70 bg-card/40 p-5 transition hover:border-primary/60 hover:bg-card/70"
  >
    <div className="flex flex-wrap items-center gap-2.5">
      <span className={`font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${isBug ? "text-orange-400" : "text-primary"}`}>
        {isBug ? "Bug" : "Validação"}
      </span>
      <span className="text-[11px] text-muted-foreground">Lab {entry.labLabel}</span>
      {showProject && <span className="text-[11px] text-muted-foreground">· {showProject}</span>}
    </div>

    <h3 className="mt-2.5 text-base font-medium leading-6 tracking-[-0.01em] group-hover:text-primary">
      {text ? summarize(text, 110) : `Evidência em ${entry.attachments.length} arquivo(s)`}
    </h3>
    {rest && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">{rest}</p>}

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
      <span className="flex flex-wrap items-center gap-3">
        {entry.attachments.length > 0 && <span>{entry.attachments.length} anexo(s)</span>}
      </span>
      <span className="flex items-center gap-3">
        <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</time>
        <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
          Ver evidência <ArrowRight className="size-3" aria-hidden="true" />
        </span>
      </span>
    </div>
  </Link>;
}
