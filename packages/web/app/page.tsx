import Link from "next/link";
import {
  ArrowRight, BookOpen, Bug, CalendarClock, CheckCircle2, ClipboardCheck,
  FileCode2, FlaskConical, FolderKanban, Search, ShieldCheck, Target, Wallet,
} from "lucide-react";

const modules = [
  { href: "/datas", icon: CalendarClock, title: "Datas Bugadas", label: "Playground", description: "Investigue formatos, cálculos, vencimentos e armadilhas de timezone em componentes interativos.", meta: "10 bugs intencionais", color: "text-coral" },
  { href: "/despesas", icon: Wallet, title: "ExpenseFlow", label: "Playground", description: "Teste um fluxo financeiro com filtros, cadastro, edição, exclusão, paginação e exportação.", meta: "Teste exploratório", color: "text-mint" },
  { href: "/bdd", icon: FileCode2, title: "Gerador de BDD", label: "Ferramenta", description: "Transforme uma regra de negócio em cenários Gherkin claros e prontos para refinar com o time.", meta: "Exportação .feature", color: "text-neon" },
  { href: "/missoes", icon: Target, title: "Missões de QA", label: "Desafios", description: "Pratique investigação, escrita de casos, análise de risco e comunicação com tarefas guiadas.", meta: "Progresso local", color: "text-coral" },
  { href: "/blog", icon: BookOpen, title: "Artigos QA Lab", label: "Conteúdo", description: "Leituras práticas para conectar estratégia de qualidade, técnica e decisões de produto.", meta: "Conteúdo gratuito", color: "text-mint" },
  { href: "/lab", icon: FolderKanban, title: "QA Lab Workspace", label: "Conta opcional", description: "Salve projetos, rascunhos, favoritos e seu progresso em um espaço pessoal sincronizado.", meta: "Plano Free disponível", color: "text-neon" },
];

const practices = [
  { icon: Search, title: "Investigue", text: "Explore fluxos reais sem depender de uma lista de respostas." },
  { icon: ShieldCheck, title: "Pense em risco", text: "Priorize impacto para usuários, dados e negócio." },
  { icon: ClipboardCheck, title: "Comunique", text: "Registre cenários e bugs de forma objetiva e reproduzível." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute left-1/2 top-20 size-[38rem] -translate-x-1/2 rounded-full bg-mint/[0.08] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-mint">
              <FlaskConical className="size-3.5" /> Laboratório público de QA
            </div>
            <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.045em] text-off-white sm:text-7xl lg:text-[5.5rem]">
              Qualidade se aprende <span className="text-coral">praticando.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-[#AAB2BC] sm:text-lg">
              Playground gratuito para praticar análise, escrita de cenários, investigação de bugs e pensamento crítico em produto — direto no navegador.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#playgrounds" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neon px-6 text-sm font-black text-[#101319] transition hover:-translate-y-0.5 hover:bg-[#E0FF7D]">
                Explorar laboratórios <ArrowRight className="size-4" />
              </Link>
              <Link href="/missoes" className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-off-white transition hover:border-mint/35 hover:text-mint">
                Ver missões
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-[#7D8793]"><CheckCircle2 className="size-3.5 text-mint" /> Sem cadastro · sem paywall · sem instalação</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24" id="playgrounds">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-mint">Escolha onde praticar</p>
          <h2 className="text-3xl font-black tracking-tight text-off-white sm:text-4xl">Ferramentas e desafios gratuitos</h2>
          <p className="mt-4 leading-7 text-[#8B949E]">Cada módulo trabalha uma habilidade diferente. Seu progresso fica no próprio navegador quando aplicável.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ href, icon: Icon, title, label, description, meta, color }) => (
            <Link key={href} href={href} className="group flex min-h-64 flex-col rounded-2xl border border-white/10 bg-[#171B21] p-6 transition hover:-translate-y-1 hover:border-mint/30 hover:shadow-2xl hover:shadow-black/25">
              <div className="flex items-start justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#69737E]">{label}</span><Icon className={`size-5 ${color}`} /></div>
              <h3 className="mt-8 text-xl font-black text-off-white group-hover:text-mint">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#8B949E]">{description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs"><span className="text-[#69737E]">{meta}</span><ArrowRight className="size-4 text-[#69737E] transition group-hover:translate-x-1 group-hover:text-mint" /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0D1015]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-5 md:grid-cols-3">
            {practices.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-6"><span className="font-mono text-xs text-mint/60">0{index + 1}</span><Icon className="mt-8 size-5 text-mint" /><h2 className="mt-4 text-lg font-bold text-off-white">{title}</h2><p className="mt-2 text-sm leading-6 text-[#8B949E]">{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-2xl border border-mint/20 bg-mint/[0.065] px-6 py-12 text-center sm:px-12">
          <Bug className="mx-auto mb-5 size-8 text-coral" /><h2 className="text-3xl font-black text-off-white sm:text-4xl">Comece pelo ExpenseFlow</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#AAB2BC]">Um sistema financeiro com falhas intencionais, briefing de investigação e modelo de bug report.</p>
          <Link href="/despesas" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neon px-6 text-sm font-black text-[#101319] transition hover:-translate-y-0.5 hover:bg-[#E0FF7D]">Abrir desafio <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </>
  );
}
