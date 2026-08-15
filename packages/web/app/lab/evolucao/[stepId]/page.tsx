import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, FileText, GraduationCap, ListChecks, Target } from "lucide-react";
import { submitEvolutionLab } from "../../actions";
import { getEvolutionLab, getEvolutionStepDefinition } from "@/lib/evolution-plan";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Missao de evolucao", robots: { index: false, follow: false } };

export default async function EvolutionLabPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params;
  const step = getEvolutionStepDefinition(stepId);
  const lab = getEvolutionLab(stepId);
  if (!step || !lab) notFound();

  let authed = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    authed = Boolean(user);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/lab" className="inline-flex items-center gap-2 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" />Voltar ao Lab</Link>
      <header className="mt-8 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-neon">Missao pratica</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-off-white sm:text-5xl">{step.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#AAB2BC]">{lab.scenario}</p>
        </div>
        <aside className="rounded-2xl border border-neon/20 bg-neon/[.045] p-5">
          <GraduationCap className="size-5 text-neon" />
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[.18em] text-mint">Competencia</p>
          <h2 className="mt-1 text-lg font-black text-off-white">{step.competency}</h2>
          <p className="mt-3 text-sm leading-6 text-[#8B949E]">{step.evidence}</p>
        </aside>
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-6">
            <div className="flex items-start gap-3"><Target className="mt-1 size-5 shrink-0 text-neon" /><div><p className="text-xs font-bold uppercase tracking-[.18em] text-neon">Objetivo</p><h2 className="mt-2 text-xl font-black text-off-white">{lab.mission}</h2></div></div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-6">
            <div className="flex items-center gap-2"><ListChecks className="size-5 text-mint" /><h2 className="text-xl font-black text-off-white">Tarefas da missao</h2></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {lab.tasks.map((task: string, index: number) => <div key={task} className="rounded-xl border border-white/10 bg-[#101319] p-4 text-sm leading-6 text-[#AAB2BC]"><strong className="text-mint">{index + 1}.</strong> {task}</div>)}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-6">
            <div className="flex items-center gap-2"><ClipboardCheck className="size-5 text-neon" /><h2 className="text-xl font-black text-off-white">Entrega obrigatoria</h2></div>
            <p className="mt-2 text-sm leading-6 text-[#8B949E]">Escreva a entrega com detalhe suficiente para outra pessoa revisar sua decisao. Menos de 120 caracteres nao conclui a missao.</p>
            {authed ? (
              <form action={submitEvolutionLab} className="mt-5 space-y-4">
                <input type="hidden" name="step_id" value={step.id} />
                <textarea name="response" required minLength={120} rows={18} defaultValue={lab.starter} className="field w-full resize-y font-mono text-xs leading-6" />
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-mint px-5 text-sm font-black text-[#101319]">Salvar entrega e concluir<CheckCircle2 className="size-4" /></button>
              </form>
            ) : <div className="mt-5 rounded-xl border border-coral/20 bg-coral/[.04] p-4 text-sm text-[#AAB2BC]">Entre na sua conta para salvar a entrega e concluir esta missao.</div>}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
            <FileText className="size-5 text-mint" />
            <h2 className="mt-4 text-lg font-black text-off-white">Evidencia minima</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#AAB2BC]">
              {lab.minimumEvidence.map((item: string) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-mint" />{item}</li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
            <h2 className="text-lg font-black text-off-white">Rubrica de avaliacao</h2>
            <div className="mt-4 space-y-3">
              {lab.rubric.map((item: string) => <div key={item} className="rounded-xl border border-white/10 bg-[#101319] p-3 text-xs leading-5 text-[#AAB2BC]">{item}</div>)}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
            <h2 className="text-lg font-black text-off-white">Ambiente e apoio</h2>
            <div className="mt-4 grid gap-2">
              <Link href={step.href} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neon/25 px-3 text-xs font-black text-neon hover:bg-neon/10">Abrir ambiente<ArrowRight className="size-3.5" /></Link>
              <Link href={step.contentHref} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-[#AAB2BC] hover:border-mint/30 hover:text-mint">Conteudo de apoio</Link>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}