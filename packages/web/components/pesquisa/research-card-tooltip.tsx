"use client";

// Envolve um card da biblioteca no tooltip com o resumo do trabalho.
//
// Entra pelo `renderCardLink` do Blog2 — o bloco já expõe esse prop justamente
// para quem precisa decidir como o card vira link. Assim o Blog2 continua
// sendo componente de servidor: só este wrapper é client.
//
// O tooltip usa `components/ui/tooltip` (Radix), que é o mesmo componente do
// registry do Watermelon — ver o comentário em app/pesquisa/page.tsx.

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ResearchCardTooltip({
  href,
  summary,
  children,
}: {
  href: string;
  summary?: string;
  children: React.ReactNode;
}) {
  const link = (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-[1.5rem] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {children}
    </a>
  );

  // Trabalho sem resumo não ganha tooltip vazio.
  if (!summary) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        collisionPadding={16}
        className="max-w-sm px-4 py-3 text-xs leading-relaxed text-balance"
      >
        {summary}
      </TooltipContent>
    </Tooltip>
  );
}
