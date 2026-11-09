import Link from "next/link";
import { ArrowRight, ExternalLink, Globe, Lock } from "lucide-react";
import { ProfileHero } from "./profile-hero";
import { AccountSection } from "./account-section";
import { labLabel, labs } from "@/lib/playground/catalog";
import type { Journey, Submission } from "@/lib/product/journey";

type Profile = {
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  role?: string | null;
  plan?: string | null;
  portfolio_public?: boolean | null;
} | null;

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });

// O perfil é o painel de quem pratica: onde parou, o que já provou e como
// isso aparece para fora. Antes mostrava só nome, e-mail e um link.
export function ProfileClient({ email, profile, journey, submissions }: { email: string; profile: Profile; journey: Journey; submissions: Submission[] }) {
  const released = labs.filter((lab) => lab.status === "liberado");
  const next = journey.nextLab;
  const nextInProgress = next ? journey.labs.some((item) => item.lab.slug === next.slug && item.status === "started") : false;
  const latest = submissions.slice(0, 3);
  const username = profile?.username ?? "";
  const isPublic = Boolean(profile?.portfolio_public && username);

  return (
    <main className="qa-profile mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:py-10">
      <ProfileHero
        name={profile?.full_name ?? ""}
        email={email}
        plan={profile?.plan ?? "free"}
        role={profile?.role ?? "QA Iniciante"}
        bio={profile?.bio ?? ""}
        username={username}
      />

      <section aria-labelledby="pratica-title" className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="pratica-title" className="text-xl font-bold tracking-[-0.02em]">Sua prática</h2>
          <p className="text-sm text-muted-foreground"><strong className="font-semibold text-foreground">{journey.completed} de {released.length}</strong> Labs concluídos</p>
        </div>
        {next
          ? <Link href={`/labs/${next.number}`} className="group mt-4 flex items-center justify-between gap-5 border border-border bg-card p-5 transition-colors hover:border-primary">
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">{nextInProgress ? "Continue de onde parou" : "Próxima missão"} · Lab {labLabel(next)}</span>
                <span className="mt-1 block text-lg font-semibold leading-snug">{next.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">Cerca de {next.minutes} min</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">{nextInProgress ? "Continuar" : "Começar"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
            </Link>
          : <p className="mt-4 border border-border bg-card p-5 text-sm text-muted-foreground">Você concluiu todos os Labs liberados. Os próximos aparecem em <Link href="/labs" className="font-medium text-primary underline underline-offset-4">Labs</Link> assim que forem publicados.</p>}
      </section>

      <section aria-labelledby="entregas-title" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="entregas-title" className="text-xl font-bold tracking-[-0.02em]">Suas entregas</h2>
          {submissions.length > 0 && <p className="text-sm text-muted-foreground">{submissions.length} {submissions.length === 1 ? "evidência entregue" : "evidências entregues"}</p>}
        </div>
        {latest.length === 0
          ? <p className="mt-4 border-y border-border py-5 text-sm leading-6 text-muted-foreground">Você ainda não entregou nenhuma evidência. Cada Lab concluído aparece aqui e pode virar um case no seu portfólio.</p>
          : <ul className="mt-4 divide-y divide-border border-y border-border">
              {latest.map((submission) => {
                const lab = labs.find((item) => item.slug === submission.labSlug);
                return <li key={submission.id}>
                  <Link href={lab ? `/labs/${lab.number}/conclusao` : "/perfil/portfolio"} className="group flex items-center justify-between gap-4 py-4">
                    <span className="min-w-0">
                      <span className="block truncate font-medium group-hover:text-primary">{submission.portfolioCase?.title || lab?.title || "Entrega"}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        {lab && <span>Lab {labLabel(lab)}</span>}
                        <span>{dateFormat.format(new Date(submission.createdAt))}</span>
                        {submission.published
                          ? <span className="inline-flex items-center gap-1 text-primary"><Globe className="size-3.5" aria-hidden="true" />No portfólio</span>
                          : <span className="inline-flex items-center gap-1"><Lock className="size-3.5" aria-hidden="true" />Privada</span>}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                  </Link>
                </li>;
              })}
            </ul>}
      </section>

      <section aria-labelledby="portfolio-title" className="mt-12">
        <h2 id="portfolio-title" className="text-xl font-bold tracking-[-0.02em]">Portfólio</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-border py-5">
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {isPublic
              ? <>Sua página pública está ativa. Só aparecem as entregas que você escolheu publicar.</>
              : <>Sua página pública ainda não está ativa. Nada é publicado sem a sua escolha.</>}
          </p>
          <div className="flex flex-wrap gap-2">
            {isPublic && <Link href={`/portfolio/${username}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-sm border border-border px-4 text-sm font-semibold hover:border-primary">Ver página pública <ExternalLink className="size-4" aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span></Link>}
            <Link href="/perfil/portfolio" className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{isPublic ? "Editar portfólio" : "Montar meu portfólio"}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <AccountSection email={email} />
    </main>
  );
}
