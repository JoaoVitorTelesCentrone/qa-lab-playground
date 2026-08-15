import Link from "next/link";
import { ArrowRight, BadgeDollarSign, BookOpenCheck, Boxes, CheckCircle2, Clock3, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { courseBundle, launchStrategy, paidCourses } from "@/lib/paid-course-catalog";

export const metadata = {
  title: "Catálogo de Cursos",
  description: "Catálogo de lançamento das trilhas pagas v1 do QA Lab.",
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
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <Badge variant="outline" className="gap-2">
            <BookOpenCheck className="size-3.5" />
            Catálogo de lançamento v1
          </Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-off-white sm:text-6xl">
            Trilhas pagas QA Lab para formar do fundamento à gestão da qualidade.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#AAB2BC]">
            5 trilhas priorizadas para lançamento: Fundamentos de QA, JS/TS para QA, Cypress E2E,
            BDD com Cucumber e PDCA/Gestão da Qualidade. A estratégia combina entrada acessível,
            trilha técnica carro-chefe e diferenciação por processo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#trilhas" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
              Ver trilhas
              <ArrowRight className="size-4" />
            </a>
            <a href="#bundle" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-off-white">
              Ver bundle
              <Trophy className="size-4" />
            </a>
          </div>
        </div>

        <aside className="rounded-lg border border-neon/20 bg-neon/[.05] p-5">
          <Boxes className="size-5 text-neon" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-neon">Resumo v1</p>
          <div className="mt-4 grid gap-3">
            {[
              ["5 trilhas", "catálogo inicial"],
              ["≈ 62 horas", "conteúdo total"],
              ["R$ 197 a R$ 397", "ticket individual"],
              ["R$ 897", "bundle completo"],
            ].map(([value, label]) => (
              <div key={value} className="rounded-lg border border-white/10 bg-[#171B21] p-4">
                <p className="text-xl font-black text-off-white">{value}</p>
                <p className="mt-1 text-xs text-[#8B949E]">{label}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-14 rounded-lg border border-white/10 bg-[#171B21] p-6">
        <div className="flex items-start gap-4">
          <Target className="mt-1 size-5 shrink-0 text-mint" />
          <div>
            <h2 className="text-2xl font-black text-off-white">Estratégia de lançamento</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {launchStrategy.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-[#101319] p-4 text-sm leading-6 text-[#AAB2BC]">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-lg border border-white/10 bg-[#171B21]">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Tabela comparativa</p>
          <h2 className="mt-3 text-3xl font-black text-off-white">As 5 trilhas do catálogo</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-[#101319] text-xs uppercase tracking-[0.16em] text-[#8B949E]">
              <tr>
                <th className="px-5 py-4">Trilha</th>
                <th className="px-5 py-4">Nível</th>
                <th className="px-5 py-4">Carga</th>
                <th className="px-5 py-4">Pré-requisito</th>
                <th className="px-5 py-4">Preço</th>
                <th className="px-5 py-4">Papel no funil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {paidCourses.map((course) => (
                <tr key={course.slug} className="text-[#AAB2BC]">
                  <td className="px-5 py-4 font-bold text-off-white">
                    <Link href={`/cursos/${course.slug}`} className="hover:text-mint">{course.shortTitle}</Link>
                  </td>
                  <td className="px-5 py-4">{course.level}</td>
                  <td className="px-5 py-4">{course.hours}</td>
                  <td className="px-5 py-4">{course.prerequisite}</td>
                  <td className="px-5 py-4 font-black text-neon">{course.price}</td>
                  <td className="px-5 py-4">{course.funnelRole}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="trilhas" className="mt-14 scroll-mt-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Ementas completas</p>
        <h2 className="mt-3 text-3xl font-black text-off-white">Escolha a trilha</h2>
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
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#101319] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">Preço</p>
                  <p className="mt-2 text-2xl font-black text-neon">{course.price}</p>
                  <p className="text-xs text-[#8B949E]">{course.installments}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#101319] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">Entregável</p>
                  <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{course.finalDeliverable}</p>
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
              Soma individual: <strong className="text-off-white">{courseBundle.fullPrice}</strong>. Bundle sugerido:
              <strong className="text-neon"> {courseBundle.bundlePrice}</strong>, economia de {courseBundle.discount}.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#171B21] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neon">Oferta âncora</p>
            <p className="mt-3 text-5xl font-black text-neon">{courseBundle.bundlePrice}</p>
            <p className="mt-2 text-sm text-[#AAB2BC]">{courseBundle.discountPercent} de desconto vs. compra individual</p>
          </div>
        </div>
      </section>
    </main>
  );
}
