import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Clock3, GraduationCap, Layers3, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPaidCourse, paidCourses } from "@/lib/paid-course-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const accentClass = {
  mint: "border-mint/25 bg-mint/[.04] text-mint",
  neon: "border-neon/25 bg-neon/[.04] text-neon",
  coral: "border-coral/25 bg-coral/[.04] text-coral",
  blue: "border-[#7BA7E8]/25 bg-[#7BA7E8]/[.04] text-[#9BC0F5]",
};

export function generateStaticParams() {
  return paidCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = getPaidCourse(slug);
  if (!course) return {};
  return {
    title: course.shortTitle,
    description: course.subtitle,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getPaidCourse(slug);
  if (!course) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Link href="/cursos" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">
        <ArrowLeft className="size-4" />
        Voltar para catálogo
      </Link>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <Badge variant="outline" className="gap-2">
            <GraduationCap className="size-3.5" />
            Trilha QA Lab
          </Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-off-white sm:text-6xl">{course.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#AAB2BC]">{course.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#modulos" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
              Ver módulos
              <ArrowRight className="size-4" />
            </a>
            <a href="#projeto" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-off-white">
              Entregável final
              <Trophy className="size-4" />
            </a>
          </div>
        </div>

        <aside className={`rounded-lg border p-5 ${accentClass[course.accent]}`}>
          <BookOpenCheck className="size-5" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em]">Investimento</p>
          <p className="mt-3 text-5xl font-black text-neon">{course.price}</p>
          <p className="mt-2 text-sm text-[#AAB2BC]">{course.installments}</p>
          <div className="mt-5 grid gap-3">
            {[
              ["Nível", course.level],
              ["Carga", course.hours],
              ["Pré-requisito", course.prerequisite],
              ["Papel no funil", course.funnelRole],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-[#101319] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B949E]">{label}</p>
                <p className="mt-1 text-sm font-bold text-off-white">{value}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-white/10 bg-[#171B21] p-6">
          <div className="flex items-start gap-4">
            <Target className="mt-1 size-5 shrink-0 text-mint" />
            <div>
              <h2 className="text-2xl font-black text-off-white">Objetivo da trilha</h2>
              <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{course.objective}</p>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-[#171B21] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Formato</p>
          <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{course.format}</p>
        </aside>
      </section>

      <section className="mt-14 rounded-lg border border-white/10 bg-[#171B21] p-6">
        <div className="flex items-center gap-3">
          <Layers3 className="size-5 text-neon" />
          <h2 className="text-2xl font-black text-off-white">Quem deve fazer</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {course.audience.map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-[#101319] p-4 text-sm leading-6 text-[#AAB2BC]">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="modulos" className="mt-14 scroll-mt-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Ementa completa</p>
        <h2 className="mt-3 text-3xl font-black text-off-white">Módulos e carga horária</h2>
        <div className="mt-7 grid gap-4">
          {course.modules.map((module) => (
            <article key={module.number} className="grid gap-4 rounded-lg border border-white/10 bg-[#171B21] p-5 lg:grid-cols-[4rem_1fr_6rem] lg:items-start">
              <div className="flex size-12 items-center justify-center rounded-lg border border-mint/25 bg-mint/10 text-lg font-black text-mint">
                {module.number}
              </div>
              <div>
                <h3 className="text-xl font-black text-off-white">{module.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#AAB2BC]">{module.content}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-[#AAB2BC]">
                <Clock3 className="size-4 text-mint" />
                {module.duration}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="projeto" className="mt-14 scroll-mt-24 rounded-lg border border-neon/25 bg-neon/[.05] p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <Trophy className="size-6 text-neon" />
            <h2 className="mt-4 text-3xl font-black text-off-white">Entregável final</h2>
            <p className="mt-4 text-base leading-8 text-[#AAB2BC]">{course.finalDeliverable}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#171B21] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neon">Próximo passo recomendado</p>
            <p className="mt-3 text-xl font-black text-off-white">{course.nextStep}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
