import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, LayoutGrid, ArrowRight, BookOpen, CalendarDays, Wallet, Rocket } from "lucide-react";

const modules = [
  {
    href: "/elementos",
    icon: LayoutGrid,
    titulo: "Elementos",
    descricao:
      "Tabela dinâmica, carregamento assíncrono e interações de UI — todos com data-testid para automação.",
    stats: "Tabela · Loading · Interações",
    badge: "default",
  },
  {
    href: "/blog",
    icon: BookOpen,
    titulo: "Blog QA Lab",
    descricao:
      "Artigos sobre qualidade de software, técnicas de teste e boas práticas para QAs.",
    stats: "6 artigos",
    badge: "outline",
  },
  // {
  //   href: "/roadmap",
  //   icon: Map,
  //   titulo: "Roadmap",
  //   descricao:
  //     "Trilhas de aprendizado para se tornar sênior em testes unitários, API, automação e mais.",
  //   stats: "8 fases · Iniciante → Intermediário",
  //   badge: "neon",
  // },
  {
    href: "/datas",
    icon: CalendarDays,
    titulo: "Datas Bugadas",
    descricao:
      "Módulo com 10 bugs propositais de data, hora e timezone. Encontre todos e marque no checklist.",
    stats: "10 bugs · Calendário · Timer · Fuso",
    badge: "default",
  },
  {
    href: "/despesas",
    icon: Wallet,
    titulo: "Despesas",
    descricao:
      "Controle financeiro com tabela paginável, seleção de linhas, filtros combinados e export CSV.",
    stats: "Paginação · Bulk delete · Filtros",
    badge: "default",
  },
  {
    href: "/proximos-passos",
    icon: Rocket,
    titulo: "Próximos Passos",
    descricao:
      "Veja o que está sendo desenvolvido e o que vem por aí no QA Lab Playground.",
    stats: "Em construção",
    badge: "neon",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-mint/20">
            <FlaskConical className="size-7 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-wider text-mint italic">
              QA LAB
            </h1>
            <span className="text-sm uppercase tracking-[0.2em] text-mint/50">
              Playground
            </span>
          </div>
        </div>
        <div className="max-w-2xl">
          <p className="text-lg text-off-white/80 leading-relaxed">
            Aprenda QA na <span className="text-neon font-bold">prática</span> quebrando coisas de <span className="text-coral font-bold">propósito</span>.
          </p>
          <p className="text-off-white/60 mt-2">
            Explore APIs instáveis, formulários bugados e cenários de teste reais.
          </p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-scale">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="group h-full border-mint/10 hover:border-mint/30 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-mint/10 group-hover:bg-mint/20 transition-colors">
                      <mod.icon className="size-5 text-mint" />
                    </div>
                    <CardTitle className="text-lg">{mod.titulo}</CardTitle>
                  </div>
                  <Badge variant={mod.badge as any}>
                    #{modules.indexOf(mod) + 1}
                  </Badge>
                </div>
                <CardDescription className="mt-3">{mod.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-off-white/50">
                    {mod.stats}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="gap-1 opacity-0 transition-all group-hover:opacity-100 text-mint"
                  >
                    Abrir <ArrowRight className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Start */}
      <Card className="border-mint/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-neon/20">
              <span className="text-neon font-bold text-sm">#</span>
            </div>
            <CardTitle className="text-base uppercase tracking-wide">Como começar</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-mint/20 text-sm font-bold text-mint">
                1
              </span>
              <div>
                <span className="text-off-white/90 font-semibold">
                  Explore os <Link href="/elementos" className="text-mint hover:underline">Elementos</Link>
                </span>
                <p className="text-sm text-off-white/60">
                  Tabela dinâmica com sort, filtros e paginação — interações e carregamento assíncrono
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-mint/20 text-sm font-bold text-mint">
                2
              </span>
              <div>
                <span className="text-off-white/90 font-semibold">
                  Veja os <Link href="/proximos-passos" className="text-mint hover:underline">Próximos Passos</Link>
                </span>
                <p className="text-sm text-off-white/60">
                  Acompanhe o que está sendo desenvolvido e o que vem por aí no QA Lab
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
