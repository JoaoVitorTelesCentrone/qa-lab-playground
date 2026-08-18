// LinkedIn e GitHub no topo do portfólio.
//
// Ficam no header, ao lado do nome, porque é o primeiro lugar onde quem avalia
// um QA vai procurar: o LinkedIn para ver a pessoa, o GitHub para ver o que ela
// escreveu. Renderiza só o que existe — botão vazio no topo é ruído.

import { Github, Linkedin } from "lucide-react";
import { profileLinkHandle } from "@/lib/product/profile-links";

const services = {
  linkedin: { label: "LinkedIn", Icon: Linkedin },
  github: { label: "GitHub", Icon: Github },
} as const;

export function ProfileLinks({ linkedin, github, className = "" }: { linkedin: string; github: string; className?: string }) {
  const links = [
    ["linkedin", linkedin] as const,
    ["github", github] as const,
  ].filter(([, url]) => url !== "");

  if (links.length === 0) return null;

  return <div className={`flex flex-wrap gap-2 ${className}`}>
    {links.map(([kind, url]) => {
      const { label, Icon } = services[kind];
      return <a
        key={kind}
        href={url}
        rel="me noopener noreferrer nofollow"
        target="_blank"
        title={profileLinkHandle(url)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
      >
        <Icon className="size-4" aria-hidden="true" /> {label}
      </a>;
    })}
  </div>;
}
