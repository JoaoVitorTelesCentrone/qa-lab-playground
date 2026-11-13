import Image from "next/image";
import Link from "next/link";
import { author } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * "Feito por João Centrone": aparece em todo Lab e todo post. Sem estado e sem
 * APIs de servidor, então funciona em componentes de servidor e de cliente.
 */
export function Byline({ className, label = "Feito por" }: { className?: string; label?: string }) {
  return <Link href={author.aboutHref} data-testid="author-byline" className={cn("group inline-flex min-h-11 items-center gap-3 rounded-full pr-3 text-sm transition-colors", className)}>
    <Image src={author.photo} alt="" width={36} height={36} unoptimized className="size-9 rounded-full border border-brand-accent/50 object-cover" />
    <span className="leading-tight">
      <span className="block text-muted-foreground">{label} <span className="font-semibold text-foreground group-hover:text-brand-accent">{author.name}</span></span>
      <span className="block text-xs text-muted-foreground">{author.title}</span>
    </span>
  </Link>;
}
