import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Bug, CheckCircle2, Compass, Database, FileCode2, FlaskConical, Gauge, GitBranch, MessageCircle, RotateCcw, Search, Smartphone, Sparkles, SquareTerminal } from "lucide-react";
import { cicdMissions } from "@/lib/cicd-lab";
import { emptyJourney } from "@/lib/product/journey";
import { getJourney, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, learningTracks, trackHasReleasedLab } from "@/lib/product/tracks";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Trilhas | QA Lab",
  description: "Percursos de aprendizagem formados por Labs práticos em uma sequência intencional.",
};

type TrackCardData = {
  href: string;
  icon: typeof GitBranch;
  title: string;
  description: string;
  completed?: number;
  total?: number;
  progressLabel?: string;
  detail?: string;
};

export default async function TracksPage() {
  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : emptyJourney;
  let solvedCicd: string[] = [];

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .like("mission_id", "cicd:%");
    solvedCicd = (data ?? []).map((row) => row.mission_id.replace("cicd:", ""));
  }

  const catalogTracks = learningTracks
    .filter(trackHasReleasedLab)
    .map((track) => buildTrackProgress(track, journey.labs));

  const groups: { id: string; title: string; description: string; cards: TrackCardData[] }[] = [
    {
      id: "fundamentos",
      title: "Fundamentos e investigação",
      description: "Construa a base e pratique como investigar.",
      cards: [
        { href: "/trilhas/qa-do-zero", icon: BookOpen, title: "QA do Zero", description: "Construa a base de qualidade antes de se especializar.", detail: "Desafios por blocos" },
        { href: "/trilhas/testes-exploratorios", icon: Search, title: "Testes exploratórios", description: "Investigue com objetivo, siga pistas e registre descobertas.", detail: "6 Labs · prática guiada" },
        { href: "/trilhas/testes-regressao", icon: RotateCcw, title: "Testes de regressão", description: "Analise impactos e escolha verificações após mudanças.", detail: "6 Labs · prática guiada" },
        { href: "/trilhas/bug-report", icon: Bug, title: "Bug report", description: "Registre defeitos com evidências claras e reproduzíveis.", detail: "12 Labs · projeto final" },
        { href: "/trilhas/gherkin", icon: FileCode2, title: "Especificação com Gherkin", description: "Transforme regras em exemplos claros para o time.", detail: "12 Labs · projeto final" },
      ],
    },
    {
      id: "tecnicas",
      title: "Ferramentas e técnicas",
      description: "Aprofunde habilidades técnicas para diferentes tipos de teste.",
      cards: [
        { href: "/trilhas/cicd", icon: GitBranch, title: "CI/CD", description: "Automatize integrações e entregas com qualidade no pipeline.", completed: solvedCicd.length, total: cicdMissions.length, progressLabel: "Labs" },
        { href: "/trilhas/cypress", icon: SquareTerminal, title: "Automação com Cypress", description: "Crie testes web confiáveis e execute-os no CI.", detail: "12 Labs · projeto final" },
        { href: "/trilhas/playwright", icon: SquareTerminal, title: "Automação com Playwright", description: "Teste jornadas web, cross-browser e investigue falhas.", detail: "13 Labs · projeto final" },
        { href: "/trilhas/appium-selenium", icon: Smartphone, title: "Automação mobile", description: "Pratique automação para Android, iOS e WebViews.", detail: "Appium + Selenium · projeto final" },
        { href: "/trilhas/testes-api", icon: FileCode2, title: "Testes de API", description: "Valide contratos e pratique coleções no Bruno e Postman.", detail: "Fundamentos + 2 subtrilhas" },
        { href: "/trilhas/k6", icon: Gauge, title: "Performance com k6", description: "Modele carga, defina limites e investigue gargalos.", detail: "12 Labs · projeto final" },
        { href: "/trilhas/sql-qa", icon: Database, title: "SQL para QA", description: "Consulte dados e valide regras com segurança.", detail: "8 Labs · PostgreSQL" },
        { href: "/trilhas/metricas-qa", icon: BarChart3, title: "Métricas para QA", description: "Use indicadores para orientar melhorias de qualidade.", detail: "12 Labs · projeto final" },
        { href: "/trilhas/ia-generativa-qa", icon: Sparkles, title: "IA generativa para QA", description: "Crie cenários e revise sugestões com responsabilidade.", detail: "8 Labs · projeto final" },
      ],
    },
    {
      id: "colaboracao",
      title: "Colaboração e carreira",
      description: "Desenvolva a forma de trabalhar com o time.",
      cards: [
        { href: "/trilhas/comunicacao-agil", icon: MessageCircle, title: "Comunicação e desenvolvimento ágil", description: "Pratique refinamento, Scrum, Kanban e feedback.", detail: "12 Labs · projeto final" },
        { href: "/trilhas/mentalidade-qa", icon: Compass, title: "Mentalidade de QA", description: "Priorize riscos e comunique evidências sem culpabilizar.", detail: "12 Labs · caso final" },
      ],
    },
    {
      id: "percursos-labs",
      title: "Percursos por Labs",
      description: "Aplique conhecimentos em sequências práticas do QA Lab.",
      cards: catalogTracks.map((progress) => {
        const released = progress.steps.filter((step) => step.lab.status === "liberado");
        const completed = released.filter((step) => step.status === "completed").length;
        return {
          href: `/trilhas/${progress.track.slug}`,
          icon: FlaskConical,
          title: progress.track.name,
          description: progress.track.objective,
          completed,
          total: released.length,
          detail: progress.track.outcome,
        };
      }),
    },
  ].filter((group) => group.cards.length > 0);

  return <main className="qa-tracks min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10 lg:py-12">
      <header className="qa-next-lab">
        <h1 className="qa-page-title qa-page-title-hero text-foreground">Trilhas de prática em sequência.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Escolha um tema e avance pelos Labs na ordem. Seu progresso fica reunido aqui.</p>
      </header>

      <nav aria-label="Categorias de trilhas" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-border py-4 text-sm">
        {groups.map((group) => <a key={group.id} href={`#${group.id}`} className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{group.title}</a>)}
      </nav>

      {groups.map((group) => <section key={group.id} id={group.id} className="mt-9 scroll-mt-24" aria-labelledby={`${group.id}-title`}>
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 id={`${group.id}-title`} className="text-xl font-bold text-foreground">{group.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
          </div>
          <span className="text-xs text-muted-foreground">{group.cards.length} {group.cards.length === 1 ? "trilha" : "trilhas"}</span>
        </header>
        <div className="mt-4 grid gap-3 lg:grid-cols-2 lg:gap-4">
          {group.cards.map((card) => <TrackCard key={card.href} {...card} />)}
        </div>
      </section>)}

      <section className="mt-10 flex flex-col gap-4 border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Roadmap completo de QA</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Desafios organizados por área e nível, além das trilhas curadas.</p>
        </div>
        <Link href="/trilhas/roadmap" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Ver desafios <ArrowRight className="size-4" /></Link>
      </section>
    </div>
  </main>;
}

function TrackCard({ href, icon: Icon, title, description, completed, total, progressLabel = "Labs", detail }: TrackCardData) {
  const hasProgress = completed !== undefined && total !== undefined && total > 0;
  const percent = hasProgress ? Math.round((completed / total) * 100) : 0;

  return <Link href={href} className="group flex min-h-48 flex-col rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <span className="flex size-10 items-center justify-center rounded-sm border border-primary/20 bg-primary/[.06] text-primary"><Icon aria-hidden="true" className="size-5" /></span>
      {hasProgress && <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-muted-foreground"><CheckCircle2 aria-hidden="true" className="size-3.5 text-primary" />{completed}/{total} {progressLabel}</span>}
    </div>
    <h3 className="mt-5 text-xl font-bold text-foreground">{title}</h3>
    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</p>
    <div className="mt-auto pt-5">
      {hasProgress && <div className="mb-3 h-1 overflow-hidden bg-secondary" role="progressbar" aria-label={`Progresso em ${title}`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}><div className="h-full bg-primary" style={{ width: `${percent}%` }} /></div>}
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">{detail && <span className="line-clamp-1">{detail}</span>}<ArrowRight className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
    </div>
  </Link>;
}
