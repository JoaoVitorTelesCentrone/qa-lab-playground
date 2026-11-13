import Link from "next/link";
import { ArrowUpRight, Bug, Code2, FileCode2, FolderKanban, ListChecks, SearchCode, Sparkles, TestTube2, WandSparkles } from "lucide-react";
import { toolGuideCategories, toolGuides, type ToolGuideCategory } from "@/lib/tool-guides";
import { FeaturedList } from "@/components/pesquisa/featured-list";
import { ACCOUNTS_ENABLED, LABS_ENABLED } from "@/lib/product/features";

export const metadata = {
  title: "Ferramentas de QA",
  description: "Guias de estudo das ferramentas de QA: documentação oficial, cursos gratuitos e vídeos selecionados.",
};

const featured = [
  { href: "/lab/bdd", title: "Gerador de BDD", description: "Escreva cenários Gherkin e exporte o resultado.", icon: FileCode2, access: "Aberto para praticar" },
  { href: "/boards", title: "Board de testes", description: "Explore um board de exemplo.", icon: FolderKanban, access: "Demo pública" },
] as const;

const available = [
  { href: "/api-playground", title: "API Playground", description: "Teste endpoints e compare respostas.", icon: Code2 },
  { href: "/test-suite", title: "Test Suite", description: "Organize specs, fixtures e casos.", icon: TestTube2 },
  ...(ACCOUNTS_ENABLED ? [{ href: "/lab/studio", title: "Test Design Studio", description: "Estruture riscos, cobertura e casos.", icon: Sparkles }] : []),
  { href: "/lab/refinamento", title: "Refinamento", description: "Melhore PBIs e bugs mal escritos.", icon: WandSparkles },
  { href: "/lab/criterios", title: "Critérios de aceite", description: "Transforme demandas em critérios testáveis.", icon: ListChecks },
  { href: "/lab/triagem", title: "Triagem de bugs", description: "Avalie impacto, prioridade e próximos passos.", icon: Bug },
  { href: "/lab/logs", title: "Investigação de logs", description: "Forme hipóteses a partir dos sinais.", icon: SearchCode },
] as const;

const guideGroups = (Object.keys(toolGuideCategories) as ToolGuideCategory[])
  .map((category) => [category, toolGuides.filter((guide) => guide.category === category)] as const);

// Ferramentas que mais aparecem em vaga e rotina de QA, na ordem em que eu estudaria.
const startHere = ["playwright", "postman", "git", "sql", "k6"]
  .flatMap((slug) => toolGuides.filter((guide) => guide.slug === slug))
  .map((guide) => ({
    title: `${guide.name}: ${guide.tagline}`,
    meta: toolGuideCategories[guide.category].title,
    href: `/ferramentas/${guide.slug}`,
  }));

export default function ToolsPage() {
  return <main className="qa-tools mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <header className="max-w-2xl">
      <h1 className="text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">Ferramentas de QA</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">Escolha o que precisa para planejar, testar ou investigar.</p>
    </header>

    {LABS_ENABLED && <section aria-labelledby="tools-main-title" className="mt-10">
      <h2 id="tools-main-title" className="text-lg font-semibold">BDD e board</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {featured.map((item) => <Link key={item.href} href={item.href} className="group flex min-h-40 flex-col border border-border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="flex items-center justify-between"><item.icon className="size-6 text-primary" aria-hidden="true" /><ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" /></span>
          <span className="mt-5 text-lg font-semibold">{item.title}</span>
          <span className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</span>
          <span className="mt-3 text-xs text-muted-foreground">{ACCOUNTS_ENABLED ? "Entre para salvar na sua conta" : item.access}</span>
        </Link>)}
      </div>
    </section>}

    {LABS_ENABLED && <section aria-labelledby="tools-other-title" className="mt-12">
      <h2 id="tools-other-title" className="text-lg font-semibold">Mais ferramentas</h2>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {available.map((item) => <Link key={item.href} href={item.href} className="group grid min-h-24 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-2 py-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-6 sm:px-4">
          <item.icon className="size-5 text-primary" aria-hidden="true" />
          <span className="min-w-0"><span className="block font-semibold">{item.title}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.description}</span></span>
          <ArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>)}
      </div>
    </section>}

    <section aria-labelledby="fila-title" className="mt-10 border border-brand-accent/40 bg-card p-5 sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">Em destaque</p>
      <h2 id="fila-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">Por onde começar</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Cinco guias para abrir primeiro, na ordem em que eu estudaria.</p>
      <div className="mt-5"><FeaturedList items={startHere} linkLabel="Ver guia" /></div>
    </section>

    <section id="guias" aria-labelledby="tools-guides-title" className="mt-16 scroll-mt-20">
      <h2 id="tools-guides-title" className="text-lg font-semibold">Guias de estudo das ferramentas do mercado</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Documentação oficial, cursos gratuitos e vídeos selecionados para estudar ferramentas de QA.</p>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {guideGroups.map(([category, guides]) => <div key={category} className="grid gap-5 py-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
          <div>
            <h3 className="text-base font-semibold">{toolGuideCategories[category].title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{toolGuideCategories[category].description}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => <li key={guide.slug}>
              <Link href={`/ferramentas/${guide.slug}`} className="group flex h-full flex-col border border-border bg-card p-4 transition-colors hover:border-brand-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <span className="flex items-center justify-between gap-2"><span className="font-semibold">{guide.name}</span><ArrowUpRight className="size-4 shrink-0 text-brand-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
                <span className="mt-1.5 text-sm leading-6 text-muted-foreground">{guide.tagline}</span>
              </Link>
            </li>)}
          </ul>
        </div>)}
      </div>
    </section>
  </main>;
}
