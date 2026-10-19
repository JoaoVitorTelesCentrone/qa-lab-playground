import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LegacyContentPage from "@/app/mentoria/conteudo/page";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { mentorshipPathV2, pathV2Assignments, pathV2Progress } from "@/lib/mentorship/path-v2";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Conteúdo por módulos | QA Lab", description: "Estude QA por competências, com teoria e prática no Broto Space e nos labs." };
export const dynamic = "force-dynamic";

export default async function ContentCatalogPage() {
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  if (dashboard?.enrollment.programVersion === "v1") return <LegacyContentPage />;
  const completed = new Set((dashboard?.lessons ?? []).filter((row) => row.status === "completed").map((row) => row.lesson_key));
  const latest = new Map<string, string>();
  for (const submission of dashboard?.submissions ?? []) if (!latest.has(submission.assignmentKey)) latest.set(submission.assignmentKey, submission.status);
  const approved = new Set([...latest].filter(([, status]) => status === "approved").map(([key]) => key));
  const progress = pathV2Progress(completed, approved, completed);
  const next = progress.find((item) => !item.complete);

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <header className="max-w-3xl"><h1 className="text-4xl font-black tracking-[-.03em] text-off-white sm:text-5xl">Aprenda por competências. Mostre o que sabe fazer.</h1><p className="mt-4 text-base leading-7 text-[#C8CFD7]">Sete módulos, capítulos no tamanho certo e prática que vira evidência. Explore livremente; a mentoria acompanha suas entregas.</p></header>
    {dashboard?.enrollment.programVersion === "v2" ? <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-5"><p className="text-sm text-[#C8CFD7]">{next ? `Continue em ${next.module.title}.` : "Percurso concluído. Revise seu case e feedback."}</p><Link href="/mentoria/app" className="inline-flex min-h-11 items-center gap-2 font-bold text-mint hover:text-neon">Minha mentoria <ArrowRight aria-hidden="true" className="size-4" /></Link></div> : <p className="mt-8 border-y border-white/15 py-4 text-sm text-[#C8CFD7]">O catálogo é aberto. <Link href="/login?next=/mentoria/app" className="font-bold text-mint underline underline-offset-4">Entre na mentoria para salvar o progresso.</Link></p>}
    <ol aria-label="Módulos de aprendizagem" className="mt-10 divide-y divide-white/15 border-y border-white/15">{mentorshipPathV2.map((module, index) => {
      const item = progress[index];
      const assignmentCount = pathV2Assignments.filter((assignment) => assignment.moduleId === module.id).length;
      return <li key={module.id} className="grid gap-5 py-7 md:grid-cols-[minmax(0,1fr)_12rem] md:items-center"><div><p className="text-xs font-bold text-mint">Módulo {index + 1}</p><h2 className="mt-2 text-2xl font-black text-off-white"><Link href={`/conteudo/modulos/${module.slug}`} className="hover:text-mint">{module.title}</Link></h2><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">{module.summary}</p></div><div className="text-sm text-[#AAB2BC]"><p>{module.chapters.length} capítulos · {assignmentCount} {assignmentCount === 1 ? "entrega" : "entregas"}</p>{dashboard?.enrollment.programVersion === "v2" && <p className="mt-2 text-xs text-mint">{item.lessonsDone}/{item.lessonsTotal} aulas · {item.practicesDone}/{item.practicesTotal} práticas · {item.assignmentsDone}/{item.assignmentsTotal} entregas</p>}<Link href={`/conteudo/modulos/${module.slug}`} className="mt-3 inline-flex min-h-10 items-center gap-1 font-bold text-mint hover:text-neon">Abrir módulo <ArrowRight aria-hidden="true" className="size-4" /></Link></div></li>;
    })}</ol>
    <p className="mt-8 text-sm leading-6 text-[#AAB2BC]">Os encontros ao vivo seguem o calendário da turma. Os capítulos não são travados por semana.</p>
  </main>;
}
