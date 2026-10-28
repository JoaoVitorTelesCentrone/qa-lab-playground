import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Clock3 } from "lucide-react";
import { courseBundle, paidCourses } from "@/lib/paid-course-catalog";

export const metadata = {
  title: "Catálogo de Cursos",
  description: "Aprenda QA com fundamentos, programação e automação aplicados a projetos. Compare as trilhas e veja o que você vai produzir em cada uma.",
};

const accentClass = {
  mint: "border-mint/25 bg-mint/[.04] text-mint",
  neon: "border-neon/25 bg-neon/[.04] text-neon",
  coral: "border-coral/25 bg-coral/[.04] text-coral",
  blue: "border-[#7BA7E8]/25 bg-[#7BA7E8]/[.04] text-[#9BC0F5]",
};

export default function CoursesCatalogPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <section className="border-b border-white/10 pb-10">
        <div className="max-w-3xl">
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-off-white sm:text-6xl">
            Aprenda QA com projetos para mostrar.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#AAB2BC]">
            Escolha uma trilha e veja o que vai aprender, quanto custa e o que vai produzir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#trilhas" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
              Comparar trilhas
              <ArrowRight className="size-4" />
            </a>
            <a href="#bundle" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-off-white">
              Ver pacote completo
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="trilhas" className="mt-12 scroll-mt-24">
        <h2 className="text-3xl font-black text-off-white">Compare as trilhas</h2>
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {paidCourses.map((course) => (
            <article key={course.slug} className={`rounded-lg border p-6 ${accentClass[course.accent]}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-current px-3 py-1 text-xs font-black">{course.level}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#AAB2BC]">
                  <Clock3 className="size-3.5" />
                  {course.hours}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-black text-off-white">{course.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{course.subtitle}</p>
              <div className="mt-5 grid gap-x-6 gap-y-4 border-y border-white/10 py-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B949E]">Investimento</p>
                  <p className="mt-1 text-xl font-black text-neon">{course.price}</p>
                  <p className="text-xs text-[#8B949E]">{course.installments}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B949E]">Pré-requisito</p>
                  <p className="mt-1 text-sm leading-6 text-[#AAB2BC]">{course.prerequisite}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B949E]">Projeto final</p>
                  <p className="mt-1 text-sm leading-6 text-[#AAB2BC]">{course.finalDeliverable}</p>
                </div>
              </div>
              <Link href={`/cursos/${course.slug}`} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
                Ver ementa
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="bundle" className="mt-14 scroll-mt-24 rounded-lg border border-neon/25 bg-neon/[.05] p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <BadgeDollarSign className="size-6 text-neon" />
            <h2 className="mt-4 text-3xl font-black text-off-white">{courseBundle.title}</h2>
            <p className="mt-4 text-base leading-8 text-[#AAB2BC]">{courseBundle.description}</p>
            <p className="mt-5 text-sm leading-7 text-[#AAB2BC]">
              Soma individual: <strong className="text-off-white">{courseBundle.fullPrice}</strong>. Pacote sugerido:
              <strong className="text-neon"> {courseBundle.bundlePrice}</strong>, economia de {courseBundle.discount}.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#171B21] p-5">
            <p className="text-sm font-semibold text-neon">Pacote completo</p>
            <p className="mt-3 text-5xl font-black text-neon">{courseBundle.bundlePrice}</p>
            <p className="mt-2 text-sm text-[#AAB2BC]">{courseBundle.discountPercent} de desconto vs. compra individual</p>
          </div>
        </div>
      </section>
    </main>
  );
}
