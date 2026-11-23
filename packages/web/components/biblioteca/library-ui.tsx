import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, Landmark, Microscope, Newspaper, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { kindLabel, levelLabel, topicLabel, type LibraryEntry, type LibraryKind, type ReferenceAccess, type ReferenceLevel } from "@/lib/reference-library";

export const kindStyle: Record<LibraryKind, { icon: typeof BookOpen; text: string; border: string }> = {
  livro: { icon: BookOpen, text: "text-primary", border: "border-primary/40" },
  artigo: { icon: FileText, text: "text-[#9EB8C6]", border: "border-[#9EB8C6]/40" },
  norma: { icon: Landmark, text: "text-copper", border: "border-copper/40" },
  guia: { icon: Newspaper, text: "text-brand-accent", border: "border-brand-accent/40" },
  pesquisa: { icon: Microscope, text: "text-muted-foreground", border: "border-border" },
};

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
export const kickerClass = "text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent";

export function KindBadge({ kind, className }: { kind: LibraryKind; className?: string }) {
  const style = kindStyle[kind];
  return <span className={cn("inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", style.text, style.border, className)}>
    <style.icon className="size-3.5" aria-hidden="true" />{kindLabel(kind)}
  </span>;
}

export function Tag({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "open" }) {
  return <span className={cn(
    "inline-flex items-center border px-1.5 py-0.5 text-[11px] font-medium",
    tone === "open" ? "border-primary/40 text-primary" : "border-border text-muted-foreground",
  )}>{children}</span>;
}

export function AccessTag({ access }: { access?: ReferenceAccess }) {
  if (!access) return null;
  return <Tag tone={access === "aberto" ? "open" : "muted"}>{access === "aberto" ? "Acesso aberto" : "Pago"}</Tag>;
}

export function LevelTag({ level }: { level?: ReferenceLevel }) {
  return level ? <Tag>{levelLabel(level)}</Tag> : null;
}

/** Linha do acervo. Curadoria abre a página da referência; pesquisa abre a fonte. */
export function EntryRow({ entry }: { entry: LibraryEntry }) {
  const titleContent = <>
    {entry.title}
    {entry.external && <><ArrowUpRight className="ml-1 inline size-4 align-[-2px] text-muted-foreground" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></>}
  </>;
  // O link cobre o card inteiro pelo ::after, sem aninhar elementos interativos.
  const linkClass = cn("after:absolute after:inset-0 hover:text-brand-accent", focusRing);

  return <article className="group relative grid gap-3 border border-border bg-card p-4 transition-colors hover:border-brand-accent/60 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5">
    <div className="flex items-center gap-2 sm:flex-col sm:items-start">
      <KindBadge kind={entry.kind} />
      <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
      {entry.essential && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-copper"><Star className="size-3" aria-hidden="true" />Essencial</span>}
    </div>
    <div className="min-w-0">
      <h3 className="text-base font-semibold leading-snug sm:text-lg">
        {entry.external
          ? <a href={entry.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{titleContent}</a>
          : <Link href={entry.href} className={linkClass}>{titleContent}</Link>}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{[entry.authors, entry.venue].filter(Boolean).join(" · ")}</p>
      {entry.summary && <p className={cn("mt-2 text-sm leading-6", entry.kind === "pesquisa" ? "line-clamp-2 text-muted-foreground" : "text-foreground/90")}>{entry.summary}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <LevelTag level={entry.level} />
        <AccessTag access={entry.access} />
        {entry.topics.slice(0, 3).map((topic) => <Tag key={topic}>{topicLabel(topic)}</Tag>)}
      </div>
    </div>
  </article>;
}

/** Card compacto para destaques e "leia também". */
export function ReferenceCard({ entry, note }: { entry: LibraryEntry; note?: string }) {
  return <Link href={entry.href} className={cn("group flex h-full flex-col border border-border bg-card p-4 transition-colors hover:border-brand-accent/60", focusRing)}>
    <span className="flex items-center justify-between gap-2">
      <KindBadge kind={entry.kind} />
      <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
    </span>
    <span className="mt-3 font-semibold leading-snug group-hover:text-brand-accent">{entry.title}</span>
    <span className="mt-1 text-xs text-muted-foreground">{entry.authors}</span>
    <span className="mt-2 text-sm leading-6 text-muted-foreground">{note ?? entry.summary}</span>
  </Link>;
}
