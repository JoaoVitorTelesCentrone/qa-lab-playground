import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { generativeAIQAFinalProject, generativeAIQAModules, generativeAIQAOutcomes, generativeAIQAResources } from "@/lib/generative-ai-qa-course";
import { GenerativeAIQATrackOverview } from "./track-client";
import { getGenerativeAIQAProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "IA generativa para QA | QA Lab",
  description: "Use IA generativa para criar e revisar cenários de teste com segurança, rastreabilidade e validação humana.",
};

export default async function GenerativeAIQATrackPage() {
  const progress = await getGenerativeAIQAProgress();

  return <main className="qa-ia-generativa min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · IA generativa para QA · 4 semanas</p>
        <h1 className="qa-page-title mt-3">Use IA para explorar mais cenários. Valide cada um.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Crie prompts úteis, amplie a cobertura e revise sugestões para cenários, Gherkin, dados sintéticos, automação e triagem — sem terceirizar o julgamento de QA.</p>
      </header>

      <aside className="mt-7 border-l-2 border-primary bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
        Não é preciso integrar uma API ou escolher um fornecedor. Pratique com requisitos fictícios ou autorizados; nunca cole dados pessoais, credenciais ou informações confidenciais em ferramentas públicas.
      </aside>

      <GenerativeAIQATrackOverview modules={generativeAIQAModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            {generativeAIQAOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}
          </ul>
          <h3 className="mt-8 text-sm font-semibold">A regra da trilha</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A IA sugere; QA confere com requisitos, evidências e execução. Uma resposta convincente ainda pode estar errada, incompleta ou desatualizada.</p>
        </div>
        <div className="border-l border-border pl-5">
          <h2 className="text-sm font-semibold">Leituras de referência</h2>
          <ul className="mt-3 grid gap-2">
            {generativeAIQAResources.map((resource) => <li key={resource.href}>
              <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Projeto final</p>
        <h2 className="mt-2 text-2xl font-bold">{generativeAIQAFinalProject.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{generativeAIQAFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {generativeAIQAFinalProject.deliverables.map((item) => <li key={item} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{item}</span></li>)}
        </ul>
      </section>
    </div>
  </main>;
}
