import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseView } from "@/components/portfolio/case-view";
import { ProfileLinks } from "@/components/portfolio/profile-links";
import { caseSummary } from "@/lib/product/case";
import { getPublicCase } from "@/lib/product/portfolio";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string; labSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, labSlug } = await params;
  const found = await getPublicCase(username, labSlug);
  if (!found) return { title: "Case não encontrado | QA Lab", robots: { index: false, follow: false } };

  // O título é o que aparece no card do LinkedIn: nome de quem assina primeiro,
  // porque o link é compartilhado por ela, não pelo produto.
  const title = `${found.author.name} — ${found.case.title}`;
  const description = caseSummary(found.case);
  return { title, description, openGraph: { title, description, type: "article", publishedTime: found.case.createdAt }, twitter: { card: "summary_large_image", title, description } };
}

export default async function CasePage({ params }: Props) {
  const { username, labSlug } = await params;
  const found = await getPublicCase(username, labSlug);
  // Case despublicado e case inexistente respondem igual, de propósito.
  if (!found) notFound();

  const { author, project, more } = found;
  const projectHref = `/portfolio/${author.username}/projeto/${project.id}`;

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    {/* O caminho de volta é o projeto, não a home do portfólio: a evidência é
        a folha de perfil → projeto → evidência. */}
    <Link href={projectHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
      <ArrowLeft className="size-3.5" aria-hidden="true" /> {project.name}
    </Link>

    <header className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-5">
      <Link href={`/portfolio/${author.username}`} className="text-sm font-medium hover:text-primary">{author.name}</Link>
      {author.role && <span className="text-sm text-muted-foreground">{author.role}</span>}
      <ProfileLinks linkedin={author.linkedin} github={author.github} className="ml-auto" />
    </header>

    <div className="mt-8"><CaseView item={found.case} /></div>

    {more.length > 0 && <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Outras evidências de {author.name.split(" ")[0]}</h2>
      <ul className="mt-4 grid gap-2">{more.slice(0, 5).map((item) => <li key={item.labSlug}>
        <Link href={`/portfolio/${author.username}/${item.labSlug}`} className="flex flex-wrap items-center gap-2.5 rounded-lg border border-border/70 p-3 text-sm transition hover:border-primary">
          <span className="font-mono text-xs text-primary">LAB {item.label}</span>
          <span className="min-w-0 flex-1 truncate">{item.title}</span>
          <span className="text-xs text-muted-foreground">severidade {item.severity}</span>
        </Link>
      </li>)}</ul>
    </section>}

    <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <p className="max-w-md text-sm leading-6 text-muted-foreground">Evidência produzida testando um sistema real no QA Lab Playground. Cada Lab só fecha com passos de reprodução e critérios de aceite confirmados.</p>
      <div className="flex gap-2">
        <Button asChild variant="outline"><Link href={projectHref}>Ver projeto</Link></Button>
        <Button asChild><Link href="/labs">Praticar também</Link></Button>
      </div>
    </footer>
  </div></main>;
}
