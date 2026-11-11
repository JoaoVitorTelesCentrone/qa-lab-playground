import { Linkedin } from "lucide-react";
import { linkedInShareUrl } from "@/lib/authority/share";
import { cn } from "@/lib/utils";

/**
 * Botão "Compartilhar no LinkedIn". `text` pré-preenche o post (ex.: o gerador de post
 * do Lab); sem ele, o LinkedIn compartilha só o link com o card da OG image.
 * `data-event` é o gancho do evento "share" de analytics (etapa 9).
 */
export function ShareOnLinkedIn({ url, text, className, label = "Compartilhar no LinkedIn" }: { url: string; text?: string; className?: string; label?: string }) {
  return <a href={linkedInShareUrl({ url, text })} target="_blank" rel="noopener noreferrer" data-event="share" data-share-target="linkedin"
    className={cn("inline-flex min-h-11 items-center gap-2 rounded-md border border-gold/40 px-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold", className)}>
    <Linkedin className="size-4" aria-hidden="true" />{label}<span className="sr-only"> (abre em nova aba)</span>
  </a>;
}
