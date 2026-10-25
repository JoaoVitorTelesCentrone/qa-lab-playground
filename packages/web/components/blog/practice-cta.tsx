import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { studyTracks } from "@/lib/study-content";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";

export function PracticeCta({ postSlug }: { postSlug?: string }) {
  const practice = postSlug ? studyTracks.find((track) => track.postSlugs.includes(postSlug)) : undefined;
  return <aside aria-labelledby="article-practice-title" className="mt-12 border-t border-border pt-8">
    <h2 id="article-practice-title" className="text-2xl font-semibold tracking-[-0.025em]">{postSlug ? "Coloque este conceito em prática." : "Da leitura à prática."}</h2>
    <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{practice ? practice.checkpoint : "Escolha uma prática, teste um sistema e registre o que descobriu. O QA Lab ajuda você a transformar estudo em evidências do que sabe fazer."}</p>
    {practice ? <Link href={practice.exerciseHref} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{practice.exerciseLabel}<ArrowRight aria-hidden="true" className="size-4" /></Link> : <OnboardingLink className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Encontrar uma prática para começar<ArrowRight aria-hidden="true" className="size-4" /></OnboardingLink>}
  </aside>;
}
