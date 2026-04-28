import Link from "next/link";
import {
  FlaskConical, LayoutGrid, ArrowRight, BookOpen,
  CalendarDays, Wallet, Rocket, Linkedin,
  Terminal, Bug, Zap,
} from "lucide-react";

const modules = [
  {
    href: "/elementos",
    icon: LayoutGrid,
    titulo: "Elementos",
    descricao: "Tabela dinâmica, loading states e interações de UI com data-testid prontos para automação.",
    stats: "Tabela · Loading · Interações",
    num: "01",
    color: "text-mint border-mint/20 bg-mint/[0.06] hover:bg-mint/[0.10]",
    icon_color: "text-mint",
  },
  {
    href: "/blog",
    icon: BookOpen,
    titulo: "Blog QA Lab",
    descricao: "Artigos sobre qualidade de software, técnicas de teste e boas práticas para QAs.",
    stats: "6 artigos publicados",
    num: "02",
    color: "text-neon border-neon/20 bg-neon/[0.04] hover:bg-neon/[0.08]",
    icon_color: "text-neon",
  },
  {
    href: "/datas",
    icon: CalendarDays,
    titulo: "Datas Bugadas",
    descricao: "10 bugs propositais de data, hora e timezone. Encontre todos e marque no checklist.",
    stats: "10 bugs · Calendário · Fuso",
    num: "03",
    color: "text-coral border-coral/20 bg-coral/[0.05] hover:bg-coral/[0.09]",
    icon_color: "text-coral",
  },
  {
    href: "/despesas",
    icon: Wallet,
    titulo: "Despesas",
    descricao: "CRUD financeiro com paginação, seleção múltipla, filtros combinados e export CSV.",
    stats: "Paginação · Bulk delete · Filtros",
    num: "04",
    color: "text-mint border-mint/20 bg-mint/[0.06] hover:bg-mint/[0.10]",
    icon_color: "text-mint",
  },
  {
    href: "/proximos-passos",
    icon: Rocket,
    titulo: "Próximos Passos",
    descricao: "Veja o que está sendo desenvolvido e o que vem por aí no QA Lab Playground.",
    stats: "Em construção",
    num: "05",
    color: "text-[#F0C040] border-[#F0C040]/20 bg-[#F0C040]/[0.04] hover:bg-[#F0C040]/[0.08]",
    icon_color: "text-[#F0C040]",
  },
];

const steps = [
  {
    n: "01",
    label: "Elementos",
    href: "/elementos",
    desc: "Tabela com sort, filtro, paginação e loading states — tudo com data-testid para você automatizar.",
  },
  {
    n: "02",
    label: "Datas Bugadas",
    href: "/datas",
    desc: "10 bugs intencionais de data, hora e timezone. Cada bug tem um checklist — marque conforme for encontrando.",
  },
  {
    n: "03",
    label: "Despesas",
    href: "/despesas",
    desc: "CRUD real: paginação, seleção múltipla, filtros e export CSV. Cobre fluxos completos de leitura e edição.",
  },
  {
    n: "04",
    label: "Blog",
    href: "/blog",
    desc: "Leia um artigo, volte para o módulo e aplique. Teoria e prática juntas.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-fade-in">

      <div className="animate-slide-in-up">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="flex items-center justify-center size-10 rounded-lg bg-mint/10 border border-mint/20 shrink-0 mt-0.5">
            <FlaskConical className="size-5 text-mint" />
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl tracking-wider text-mint italic">
                QA LAB
              </h1>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-mint/35 pb-1">
                Playground
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8B949E]">
              Break things on purpose
            </p>
          </div>
        </div>

        <div className="max-w-xl space-y-3">
          <p className="text-[#F0F6FC]/75 leading-relaxed">
            Aprenda QA na <span className="text-neon font-semibold">prática</span> quebrando coisas de{" "}
            <span className="text-coral font-semibold">propósito</span>.
            Explore APIs instáveis, formulários bugados e cenários de teste reais.
          </p>
          <a
            href="https://www.linkedin.com/company/qa-lab-oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#30363D] px-3.5 py-2 text-xs font-medium text-[#8B949E] hover:border-mint/25 hover:text-mint transition-all duration-150"
          >
            <Linkedin className="size-3.5" />
            Siga o QA Lab no LinkedIn
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 animate-slide-in-up" style={{ animationDelay: "60ms" }}>
        {[
          { label: "Módulos ativos",     value: "5",   icon: Terminal, color: "text-mint"  },
          { label: "Bugs intencionais",  value: "15+", icon: Bug,      color: "text-coral" },
          { label: "Artigos publicados", value: "6",   icon: Zap,      color: "text-neon"  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-[#30363D] bg-[#1A1D23] px-4 py-3.5">
            <Icon className={`size-4 shrink-0 ${color}`} />
            <div>
              <p className={`text-lg font-black leading-none ${color}`}>{value}</p>
              <p className="text-[10px] uppercase tracking-wide text-[#8B949E] mt-0.5 leading-none">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B949E] mb-3">
          Módulos disponíveis
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-scale">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <div className={`group relative h-full rounded-lg border bg-[#1A1D23] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 overflow-hidden cursor-pointer ${mod.color}`}>
                <span className="absolute right-2 bottom-1 font-black text-7xl text-[#F0F6FC]/[0.03] leading-none select-none pointer-events-none">
                  {mod.num}
                </span>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <mod.icon className={`size-4 shrink-0 ${mod.icon_color}`} />
                    <span className="text-sm font-semibold text-[#F0F6FC]">{mod.titulo}</span>
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed mb-4">{mod.descricao}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8B949E]/60 uppercase tracking-wider">{mod.stats}</span>
                    <ArrowRight className="size-3 text-[#8B949E] group-hover:translate-x-0.5 transition-transform duration-150" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#30363D] bg-[#1A1D23] overflow-hidden animate-slide-in-up" style={{ animationDelay: "160ms" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#30363D] bg-[#161B22]">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-coral/60" />
            <span className="size-2.5 rounded-full bg-[#F0C040]/60" />
            <span className="size-2.5 rounded-full bg-neon/60" />
          </div>
          <Terminal className="size-3 text-[#8B949E] ml-1" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-[#8B949E]">
            como_comecar.md
          </span>
        </div>
        <ol className="p-5 space-y-5">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-mint/10 border border-mint/20 text-[11px] font-black font-mono text-mint">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F0F6FC]">
                  Explore{" "}
                  <Link href={step.href} className="text-mint hover:underline decoration-mint/40">
                    {step.label}
                  </Link>
                </p>
                <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}
