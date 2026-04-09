import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Send, Target, Layers, ArrowRight, BookOpen, Map } from "lucide-react";

const modules = [
  {
    href: "/missoes",
    icon: Target,
    titulo: "Missões",
    descricao:
      "Prove bugs reais com automação. Cada missão tem objetivo, dica e snippet pra você adaptar.",
    stats: "8 missões · 2 níveis",
  },
  {
    href: "/alvos",
    icon: Layers,
    titulo: "Alvos",
    descricao:
      "Documentação dos sistemas que você vai testar — endpoints, seletores e bugs conhecidos.",
    stats: "API · E-commerce · Form",
  },
  {
    href: "/api-playground",
    icon: Send,
    titulo: "API Playground",
    descricao:
      "Envie requests manualmente e explore os endpoints disponíveis antes de automatizar.",
    stats: "10 endpoints",
  },
  {
    href: "/blog",
    icon: BookOpen,
    titulo: "Blog QA Lab",
    descricao:
      "Artigos sobre qualidade de software, tecnicas de teste e boas praticas para QAs.",
    stats: "5 artigos",
  },
  {
    href: "/roadmap",
    icon: Map,
    titulo: "Roadmap",
    descricao:
      "Trilhas de aprendizado para se tornar senior em testes unitarios, API, automacao e mais.",
    stats: "5 trilhas · 4 niveis",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="space-y-3 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <FlaskConical className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            QA Lab Playground
          </h1>
        </div>
        <p className="max-w-xl text-muted-foreground">
          Aprenda QA na pratica quebrando coisas de proposito. Explore APIs
          instáveis, formularios bugados e cenarios de teste reais.
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-scale">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="group h-full transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <mod.icon className="size-5 text-primary" />
                  <CardTitle className="text-base">{mod.titulo}</CardTitle>
                </div>
                <CardDescription>{mod.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {mod.stats}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="gap-1 opacity-0 transition-opacity group-hover:opacity-100"
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como comecar</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <span>
                Abra <strong className="text-foreground">Alvos</strong> e
                leia os endpoints, seletores e bugs conhecidos dos sistemas que você vai testar
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>
                Escolha uma <strong className="text-foreground">Missão</strong> pelo
                seu nível, leia o objetivo e tente escrever o teste antes de ver o snippet
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>
                Use o <strong className="text-foreground">API Playground</strong> para
                explorar manualmente os endpoints antes de automatizar
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
