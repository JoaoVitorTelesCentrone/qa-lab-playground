import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type FeaturedItem = { title: string; meta: string; href: string; external?: boolean };

const rowClass = "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-border bg-muted px-4 py-3 transition-colors hover:border-brand-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-4";

/**
 * Destaque de acesso rápido: poucas linhas numeradas, cada uma um link inteiro.
 * Link externo abre em outra aba; interno navega na mesma.
 */
export function FeaturedList({ items, linkLabel }: { items: FeaturedItem[]; linkLabel: string }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => {
        const content = <>
          <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
          <span className="min-w-0">
            <span className="line-clamp-2 text-base font-medium leading-snug">{item.title}</span>
            <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{item.meta}</span>
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-accent">
            <span className="hidden sm:inline">{linkLabel}</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </>;
        return <li key={item.href}>
          {item.external
            ? <a href={item.href} target="_blank" rel="noopener noreferrer" className={rowClass}>{content}<span className="sr-only"> (abre em nova aba)</span></a>
            : <Link href={item.href} className={rowClass}>{content}</Link>}
        </li>;
      })}
    </ol>
  );
}
