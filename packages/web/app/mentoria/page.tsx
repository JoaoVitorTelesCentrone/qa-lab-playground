import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, ClipboardCheck, FlaskConical, MessageSquareText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mentorshipCurriculum } from "@/lib/mentorship/curriculum";

export const metadata = { title: "Mentoria QA Lab", description: "Mentoria prática de QA em 12 semanas." };

export default function MentorshipLandingPage() {
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <section className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Mentoria QA Lab · 12 semanas</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-.05em] text-off-white sm:text-7xl">Técnica para entregar. Posicionamento para se destacar.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#AAB2BC]">Em cada semana, você entende um conceito de QA, aplica em um ambiente do QA Lab e entrega uma evidência. O mentor revisa seu raciocínio; os encontros ao vivo trabalham comunicação, autonomia e carreira.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/login?next=/mentoria/app">Entrar na minha mentoria <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/mentoria/conteudo">Explorar o conteúdo</Link></Button></div>
      </div>
      <aside className="rounded-2xl border border-neon/25 bg-neon/[.05] p-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-neon">O que você termina com</p>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#D9DEE4]">{["Projeto integrado de release", "Suíte de automação e pipeline", "Relatório de teste de carga", "Cases para portfólio", "Plano pessoal de próxima evolução"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 size-4 shrink-0 text-mint" />{item}</li>)}</ul>
      </aside>
    </section>

    <section className="mt-16 grid gap-5 md:grid-cols-3">
      <Info title="Teoria aplicada" text="Conceitos e guias de estudo levam a uma prática concreta no ExpenseFlow ou em outro ambiente do QA Lab." />
      <Info title="Um ao vivo por semana" text="Conversas sobre confiança, comunicação, relacionamento, posicionamento e entrevistas." icon={<Video className="size-5" />} />
      <Info title="Dois níveis, uma turma" text="A mesma missão com requisitos de iniciante e intermediário, sem duplicar a jornada." />
    </section>

    <section className="mt-16 border-y border-white/10 py-14" aria-labelledby="method-title"><h2 id="method-title" className="text-3xl font-black text-off-white">Da teoria ao trabalho real</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">O estudo prepara uma pergunta; o ambiente permite investigar; a entrega mostra a decisão tomada. O feedback fecha o ciclo e orienta a próxima tentativa.</p><ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><MethodStep icon={<BookOpenText className="size-5" />} title="Entender" text="Leia o conceito e descubra qual problema ele resolve." /><MethodStep icon={<FlaskConical className="size-5" />} title="Aplicar" text="Investigue o ExpenseFlow ou o lab indicado na semana." /><MethodStep icon={<ClipboardCheck className="size-5" />} title="Mostrar" text="Produza um mapa de risco, cenário, teste ou relatório." /><MethodStep icon={<MessageSquareText className="size-5" />} title="Evoluir" text="Receba a revisão do mentor e ajuste sua entrega." /></ol></section>

    <section className="mt-16" aria-labelledby="example-title"><h2 id="example-title" className="text-3xl font-black text-off-white">Um exemplo: a primeira semana</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">Antes de testar telas, você aprende a identificar quem usa o produto, o que pode falhar e qual risco merece atenção primeiro.</p><div className="mt-7 grid border border-white/10 md:grid-cols-3"><article className="border-b border-white/10 bg-[#171B21] p-6 md:border-b-0 md:border-r"><p className="text-sm font-bold text-mint">Conceito</p><h3 className="mt-3 text-xl font-black text-off-white">{mentorshipCurriculum[0].concepts[3].title}</h3><p className="mt-3 text-sm leading-7 text-[#C8CFD7]">{mentorshipCurriculum[0].concepts[3].content}</p></article><article className="border-b border-white/10 bg-[#171B21] p-6 md:border-b-0 md:border-r"><p className="text-sm font-bold text-mint">Prática</p><h3 className="mt-3 text-xl font-black text-off-white">ExpenseFlow</h3><p className="mt-3 text-sm leading-7 text-[#C8CFD7]">Percorra cadastro, lançamento e consulta de despesas. Observe falhas possíveis e o impacto para quem usa o produto.</p><Link href="/playground/expenseflow" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-neon hover:text-mint">Conhecer o ambiente <ArrowRight className="size-4" /></Link></article><article className="bg-mint/[.05] p-6"><p className="text-sm font-bold text-mint">Entrega</p><h3 className="mt-3 text-xl font-black text-off-white">Mapa de risco</h3><p className="mt-3 text-sm leading-7 text-[#C8CFD7]">Descreva cinco riscos, justifique a prioridade e registre uma pergunta de negócio para cada um. O mentor avalia contexto, clareza e evidência.</p></article></div></section>

    <section className="mt-16 border-t border-white/10 pt-12" aria-labelledby="curriculum-title">
      <div className="max-w-[72ch]">
        <p className="text-sm font-bold text-mint">Programa completo</p>
        <h2 id="curriculum-title" className="mt-3 text-3xl font-black text-off-white">Veja as 12 semanas por dentro</h2>
        <p className="mt-4 text-base leading-8 text-[#C8CFD7]">Na área de conteúdo, cada semana tem suas aulas, quiz, exemplo prático e desafio em páginas separadas. Explore o percurso e escolha por onde começar.</p>
        <Link href="/mentoria/conteudo" className="mt-7 inline-flex items-center gap-2 bg-mint px-5 py-3 text-sm font-bold text-[#101319] hover:bg-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-off-white">Abrir programa de estudos <ArrowRight aria-hidden="true" className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

function Info({ title, text, icon }: { title: string; text: string; icon?: React.ReactNode }) {
  return <article className="rounded-2xl border border-white/10 bg-[#171B21] p-6"><span className="flex size-10 items-center justify-center rounded-xl bg-mint/10 text-mint">{icon ?? <CheckCircle2 className="size-5" />}</span><h2 className="mt-5 text-lg font-bold text-off-white">{title}</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{text}</p></article>;
}

function MethodStep({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <li className="border-t-2 border-mint/60 pt-4"><span className="text-mint" aria-hidden="true">{icon}</span><h3 className="mt-3 font-bold text-off-white">{title}</h3><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{text}</p></li>;
}
