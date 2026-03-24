import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Send, ListChecks, ClipboardList, ArrowRight, ShoppingBag, Calendar, BookOpen, Trophy, SearchCheck, Map } from "lucide-react";

const modules = [
  {
    href: "/api-playground",
    icon: Send,
    titulo: "API Playground",
    descricao:
      "Envie requests para uma API com bugs configuraveis. Ative o modo caos e descubra falhas.",
    stats: "10 endpoints",
  },
  {
    href: "/cenarios",
    icon: ListChecks,
    titulo: "Cenarios de Teste",
    descricao:
      "Cenarios guiados com objetivos claros para praticar tecnicas de QA.",
    stats: "5 cenarios",
  },
  {
    href: "/ecommerce/board",
    icon: ClipboardList,
    titulo: "Board de Tarefas",
    descricao:
      "Kanban com as historias do e-commerce. Cada card conecta a um modulo de QA para praticar.",
    stats: "8 tarefas",
  },
  {
    href: "/ecommerce",
    icon: ShoppingBag,
    titulo: "E-commerce",
    descricao:
      "Loja virtual com bugs propositais e um board de tarefas que conecta todos os modulos do lab.",
    stats: "7 bugs · board",
  },
  {
    href: "/datas",
    icon: Calendar,
    titulo: "Datas Bugadas",
    descricao:
      "Calendarios, timers e fusos horarios com 10 bugs propositais para encontrar.",
    stats: "10 bugs",
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
    href: "/desafios",
    icon: Trophy,
    titulo: "Desafios",
    descricao:
      "Desafios semanais e mensais para a comunidade. Aceite, complete os passos e acumule XP.",
    stats: "4 semanais · 4 mensais",
  },
  {
    href: "/pdca",
    icon: SearchCheck,
    titulo: "Análise PDCA",
    descricao:
      "Investigue bugs com o ciclo PDCA: registre, planeje, execute e documente a causa raiz com 5 Porquês.",
    stats: "6 etapas · 3 templates",
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
                Acesse o <strong className="text-foreground">API Playground</strong> e
                envie sua primeira request para <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">GET /api/users</code>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>
                Ative o <strong className="text-foreground">Modo Caos</strong> e
                observe como os endpoints comecam a falhar de formas
                diferentes
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>
                Explore os <strong className="text-foreground">Cenarios</strong> para
                praticar com objetivos guiados e dicas
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                4
              </span>
              <span>
                Abra o <strong className="text-foreground">Board de Tarefas</strong> e
                navegue pelas historias do e-commerce para ver os bugs mapeados e os cenarios vinculados
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
