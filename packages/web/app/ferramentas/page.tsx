import Link from "next/link";
import { ArrowUpRight, Bug, Code2, FileCode2, FolderKanban, ListChecks, SearchCode, Sparkles, TestTube2, WandSparkles } from "lucide-react";

export const metadata = {
  title: "Ferramentas de QA | QA Lab",
  description: "Acesse as ferramentas de planejamento, testes e investigação do QA Lab.",
};

const featured = [
  { href: "/lab/bdd", title: "Gerador de BDD", description: "Escreva cenários Gherkin e crie cards de teste.", icon: FileCode2, access: "Entre para usar" },
  { href: "/boards", title: "Board de testes", description: "Organize casos e acompanhe o trabalho em equipe.", icon: FolderKanban, access: "Entre para usar" },
] as const;

const available = [
  { href: "/api-playground", title: "API Playground", description: "Teste endpoints e compare respostas.", icon: Code2 },
  { href: "/test-suite", title: "Test Suite", description: "Organize specs, fixtures e casos.", icon: TestTube2 },
  { href: "/lab/studio", title: "Test Design Studio", description: "Estruture riscos, cobertura e casos.", icon: Sparkles },
  { href: "/lab/refinamento", title: "Refinamento", description: "Melhore PBIs e bugs mal escritos.", icon: WandSparkles },
  { href: "/lab/criterios", title: "Critérios de aceite", description: "Transforme demandas em critérios testáveis.", icon: ListChecks },
  { href: "/lab/triagem", title: "Triagem de bugs", description: "Avalie impacto, prioridade e próximos passos.", icon: Bug },
  { href: "/lab/logs", title: "Investigação de logs", description: "Forme hipóteses a partir dos sinais.", icon: SearchCode },
] as const;

export default function ToolsPage() {
  return <main className="qa-tools mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <header className="max-w-2xl">
      <h1 className="text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">Ferramentas de QA</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">Escolha o que precisa para planejar, testar ou investigar.</p>
    </header>

    <section aria-labelledby="tools-main-title" className="mt-10">
      <h2 id="tools-main-title" className="text-lg font-semibold">BDD e board</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {featured.map((item) => <Link key={item.href} href={item.href} className="group flex min-h-40 flex-col border border-border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="flex items-center justify-between"><item.icon className="size-6 text-primary" aria-hidden="true" /><ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" /></span>
          <span className="mt-5 text-lg font-semibold">{item.title}</span>
          <span className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</span>
          <span className="mt-3 text-xs text-muted-foreground">{item.access}</span>
        </Link>)}
      </div>
    </section>

    <section aria-labelledby="tools-other-title" className="mt-12">
      <h2 id="tools-other-title" className="text-lg font-semibold">Mais ferramentas</h2>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {available.map((item) => <Link key={item.href} href={item.href} className="group grid min-h-24 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-2 py-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-6 sm:px-4">
          <item.icon className="size-5 text-primary" aria-hidden="true" />
          <span className="min-w-0"><span className="block font-semibold">{item.title}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.description}</span></span>
          <ArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>)}
      </div>
    </section>
  </main>;
}
