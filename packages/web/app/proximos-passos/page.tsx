import {
  ClipboardList,
  Send,
  Trophy,
  Rocket,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = "em-desenvolvimento" | "planejado" | "concluido";

interface Feature {
  titulo: string;
  descricao: string;
  detalhes: string[];
  status: Status;
}

interface Modulo {
  href: string;
  icon: React.ElementType;
  titulo: string;
  descricao: string;
  status: Status;
  features: Feature[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const modulos: Modulo[] = [
  {
    href: "/desafios",
    icon: Trophy,
    titulo: "Desafios",
    descricao: "Página de gamificação com desafios semanais, XP, ranking e conquistas para QAs.",
    status: "planejado",
    features: [
      {
        titulo: "Desafio da semana",
        descricao: "Um novo desafio de QA toda semana — encontre o bug, escreva o caso de teste ou automatize o fluxo.",
        detalhes: [
          "Desafio novo toda segunda-feira",
          "Dificuldade variada: Iniciante · Intermediário · Avançado",
          "Descrição do cenário, dicas e critérios de aceitação",
          "Timer mostrando quanto tempo resta para o desafio expirar",
          "Histórico de desafios anteriores",
        ],
        status: "planejado",
      },
      {
        titulo: "Sistema de XP e níveis",
        descricao: "Ganhe pontos ao completar desafios e suba de nível no ranking de QAs.",
        detalhes: [
          "XP por desafio concluído, com bônus por dificuldade",
          "Níveis: Aprendiz → Júnior → Pleno → Sênior → Especialista",
          "Barra de progresso para o próximo nível",
          "XP extra por completar dentro do prazo",
        ],
        status: "planejado",
      },
      {
        titulo: "Conquistas (Achievements)",
        descricao: "Badges desbloqueáveis por marcos atingidos dentro do QA Lab.",
        detalhes: [
          "Primeiro desafio concluído",
          "5 desafios seguidos sem perder uma semana",
          "Encontrou todos os bugs do módulo Datas",
          "Completou um desafio de nível Avançado",
          "Contribuiu com um artigo para o Blog",
        ],
        status: "planejado",
      },
      {
        titulo: "Ranking semanal",
        descricao: "Placar com os QAs que mais pontuaram na semana atual.",
        detalhes: [
          "Top 10 da semana com XP acumulado",
          "Destaque para o 1º, 2º e 3º colocados",
          "Histórico de vencedores por semana",
          "Filtro por nível para comparar com pares",
        ],
        status: "planejado",
      },
    ],
  },
  {
    href: "/api-playground",
    icon: Send,
    titulo: "API Playground",
    descricao: "Ferramenta para enviar requests manualmente e explorar os endpoints disponíveis antes de automatizar.",
    status: "planejado",
    features: [
      {
        titulo: "Backend integrado ao Next.js",
        descricao: "Mover o backend Hono para Route Handlers do Next.js, eliminando a dependência de um servidor separado.",
        detalhes: [
          "API rodando dentro do próprio Next.js via app/api/[...route]/route.ts",
          "Sem necessidade de Docker ou processo separado",
          "Funciona em deploy no Vercel ou similar",
          "Mantém todos os bugs intencionais do chaos middleware",
        ],
        status: "planejado",
      },
      {
        titulo: "Endpoints REST com bugs intencionais",
        descricao: "10 endpoints cobrindo products, users, orders, auth e health — todos com comportamentos propositalmente bugados.",
        detalhes: [
          "GET /api/products — paginação que pula itens",
          "GET /api/products/:id — retorna 200 com body de erro",
          "DELETE /api/products/:id — retorna 204 mas não remove",
          "POST /api/auth/login — sem rate limiting",
          "GET /api/orders/:id — formato de resposta inconsistente",
          "GET /api/health — reporta healthy mesmo quando falha",
        ],
        status: "planejado",
      },
      {
        titulo: "Chaos Mode",
        descricao: "Toggle para ativar falhas aleatórias e simular instabilidade de ambiente real.",
        detalhes: [
          "Delay aleatório em qualquer endpoint",
          "Erros 500 intermitentes",
          "Timeout simulado em POST /api/orders",
          "Indicador visual de chaos ativo na UI",
        ],
        status: "planejado",
      },
    ],
  },
  {
    href: "/casos",
    icon: ClipboardList,
    titulo: "Casos de Teste",
    descricao: "Suite de gerenciamento de casos de teste com CRUD completo e backend persistente.",
    status: "em-desenvolvimento",
    features: [
      {
        titulo: "CRUD de casos",
        descricao: "Criar, editar, excluir e listar casos com título, passos e resultado esperado.",
        detalhes: [
          "Formulário com validação de campos obrigatórios",
          "Lista com filtro por status (passou / falhou / bloqueado / não executado)",
          "Modal de confirmação antes de excluir",
          "Edição inline do status pelo card",
        ],
        status: "em-desenvolvimento",
      },
      {
        titulo: "Backend persistente",
        descricao: "API Hono/Bun com endpoints REST para persistir os casos entre sessões.",
        detalhes: [
          "GET / POST / PUT / DELETE em /api/casos",
          "Store em memória no servidor (reseta ao reiniciar)",
          "Proxy via Next.js rewrites — sem problemas de CORS",
        ],
        status: "em-desenvolvimento",
      },
      {
        titulo: "Estatísticas da suite",
        descricao: "Barra de stats com contagem por status no topo da página.",
        detalhes: [
          "Total · Passou · Falhou · Bloqueado · Não executado",
          "Atualizações em tempo real ao mudar status",
        ],
        status: "planejado",
      },
    ],
  },
];

// ── Config ────────────────────────────────────────────────────────────────────

const statusConfig: Record<Status, { label: string; icon: React.ElementType; badge: "neon" | "default" | "outline"; dot: string }> = {
  "em-desenvolvimento": { label: "Em desenvolvimento", icon: Clock,         badge: "default", dot: "bg-amber-400" },
  "planejado":          { label: "Planejado",           icon: Circle,        badge: "outline", dot: "bg-muted-foreground" },
  "concluido":          { label: "Concluído",           icon: CheckCircle2,  badge: "neon",    dot: "bg-neon" },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProximosPassosPage() {
  return (
    <div className="space-y-10 animate-fade-in">

      {/* Hero */}
      <div className="space-y-3 animate-slide-in-up">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-mint/20">
            <Rocket className="size-7 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-mint italic">
              Próximos Passos
            </h1>
            <span className="text-sm uppercase tracking-[0.2em] text-mint/50">
              Em construção
            </span>
          </div>
        </div>
        <p className="max-w-2xl text-off-white/70 leading-relaxed">
          Módulos que estão sendo desenvolvidos ou planejados para as próximas versões do QA Lab.
          Cada item lista as funcionalidades previstas para você já saber o que praticar quando estiver disponível.
        </p>
      </div>

      {/* Modulos */}
      <div className="space-y-8">
        {modulos.map((mod) => {
          const StatusIcon = statusConfig[mod.status].icon;
          const ModIcon    = mod.icon;

          return (
            <div key={mod.href} className="space-y-4">
              {/* Módulo header */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-10 rounded-xl bg-mint/10 shrink-0 mt-0.5">
                  <ModIcon className="size-5 text-mint" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-off-white tracking-tight">{mod.titulo}</h2>
                    <Badge variant={statusConfig[mod.status].badge}>
                      <StatusIcon className="size-3 mr-1" />
                      {statusConfig[mod.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-off-white/60 mt-1">{mod.descricao}</p>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pl-14">
                {mod.features.map((feat) => {
                  const FeatStatusIcon = statusConfig[feat.status].icon;
                  return (
                    <Card key={feat.titulo} className="border-mint/10 hover:border-mint/20 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm leading-snug">{feat.titulo}</CardTitle>
                          <span className={`size-2 rounded-full shrink-0 mt-1 ${statusConfig[feat.status].dot}`} title={statusConfig[feat.status].label} />
                        </div>
                        <CardDescription className="text-xs leading-relaxed">{feat.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {feat.detalhes.map((d) => (
                            <li key={d} className="flex items-start gap-1.5 text-xs text-off-white/50">
                              <FeatStatusIcon className={`size-3 shrink-0 mt-0.5 ${statusConfig[feat.status].dot.replace("bg-", "text-")}`} />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-6 pt-2 border-t border-mint/10">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-off-white/50">
              <span className={`size-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </div>
          );
        })}
      </div>

      {/* Watermark */}
      <div className="flex justify-end">
        <span className="font-[family-name:var(--font-display)] text-4xl text-off-white/10 italic tracking-wider select-none">
          #WIP
        </span>
      </div>
    </div>
  );
}
