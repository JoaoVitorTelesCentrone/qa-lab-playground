export type PracticeAppId = "qa-lab" | "financas" | "agendamentos" | "crm";

export type PracticeApp = {
  id: PracticeAppId;
  name: string;
  route: string;
  summary: string;
  entity: string;
  flows: string[];
  screens?: Array<{ id: string; label: string }>;
};

export const practiceApps: PracticeApp[] = [
  { id: "qa-lab", name: "QA Lab", route: "/shop/products", summary: "Loja completa para praticar catálogo, carrinho, checkout, pedidos e operação.", entity: "produto, carrinho e pedido", flows: ["Catálogo e busca", "Carrinho e checkout", "Pedidos e pós-venda", "Conta e sessão", "Operação e governança"], screens: [{ id: "products", label: "Catálogo" }, { id: "cart", label: "Carrinho" }, { id: "checkout", label: "Checkout" }, { id: "orders", label: "Pedidos" }, { id: "account", label: "Conta" }, { id: "operations", label: "Operação" }] },
  { id: "financas", name: "Finanças", route: "/financas", summary: "Controle financeiro com lançamentos, orçamento, metas e relatórios.", entity: "lançamento financeiro", flows: ["Lançamentos", "Orçamento por categoria", "Metas", "Recorrências", "Relatórios"], screens: [{ id: "overview", label: "Visão geral" }, { id: "transactions", label: "Lançamentos" }, { id: "accounts", label: "Contas" }, { id: "budgets", label: "Orçamentos" }, { id: "goals", label: "Metas" }, { id: "reports", label: "Relatórios" }] },
  { id: "agendamentos", name: "Agendamentos", route: "/agendamentos", summary: "Agenda de serviços com disponibilidade, conflitos, reagendamento e cancelamento.", entity: "agendamento", flows: ["Disponibilidade", "Conflito de horário", "Reagendamento", "Cancelamento", "Confirmação"], screens: [{ id: "overview", label: "Visão geral" }, { id: "schedule", label: "Grade e reserva" }, { id: "bookings", label: "Agenda" }, { id: "services", label: "Serviços" }, { id: "availability", label: "Disponibilidade" }] },
  { id: "crm", name: "CRM", route: "/crm", summary: "Painel comercial com funil, empresas, atividades e indicadores.", entity: "indicador do funil", flows: ["Funil por estágio", "Valor por empresa", "Atividades", "Taxa de ganho", "Gráfico versus tabela"], screens: [{ id: "overview", label: "Visão geral" }, { id: "funnel", label: "Funil" }, { id: "companies", label: "Empresas" }, { id: "activities", label: "Atividades" }, { id: "deals", label: "Oportunidades" }] },
];

export function findPracticeApp(id: string) { return practiceApps.find((app) => app.id === id); }
export function isPracticeAppId(value: string): value is PracticeAppId { return practiceApps.some((app) => app.id === value); }

// Lançamento enxuto: só Finanças tem trilha e desafios liberados, então é o
// único ambiente que aparece na navegação e na home. Os outros continuam
// funcionando por rota direta — só saem da vitrine. Ver [[qa-lab-lancamento-enxuto]].
export const liveApps: PracticeApp[] = practiceApps.filter((app) => app.id === "financas");

export type RoadmapEnvironment = { id: string; name: string; route: string; summary: string };

// Ambientes usados pelas tarefas práticas do roadmap. Esta lista é de
// navegação; `liveApps` continua representando os apps do lançamento na home e
// nos packs de regressão.
export const roadmapEnvironments: RoadmapEnvironment[] = [
  { id: "shop", name: "QA Lab Shop", route: "/shop/products", summary: "Catálogo, carrinho, checkout, pedidos e operação." },
  { id: "financas", name: "Finanças", route: "/financas", summary: "Lançamentos, indicadores, regras e persistência." },
  { id: "agendamentos", name: "Agendamentos", route: "/agendamentos/schedule", summary: "Disponibilidade, conflito, reagendamento e cancelamento." },
  { id: "crm", name: "CRM", route: "/crm/funnel", summary: "Funil, oportunidades, empresas e atividades." },
  { id: "web", name: "Web Playground", route: "/playground/elements", summary: "Elementos, tabelas, arquivos, frames e Shadow DOM." },
  { id: "api", name: "API Playground", route: "/api-playground", summary: "Contratos, payloads, autenticação e respostas controladas." },
  { id: "expenseflow", name: "ExpenseFlow", route: "/playground/expenseflow", summary: "Fluxo financeiro responsivo com falhas reproduzíveis." },
  { id: "waits", name: "Waits Lab", route: "/labs/waits", summary: "Carregamento, sincronização e comportamento assíncrono." },
  { id: "cicd", name: "Trilha CI/CD", route: "/trilhas/cicd", summary: "Dez Labs sobre pipeline, quality gates, deploy e rollback." },
  { id: "people", name: "People Lab", route: "/lab/pessoas", summary: "Comunicação, negociação, conflito e liderança." },
  { id: "refinement", name: "Refinement Lab", route: "/lab/refinamento", summary: "Histórias, ambiguidades, riscos e perguntas." },
  { id: "criterios", name: "Critérios Lab", route: "/lab/criterios", summary: "Critérios de aceite testáveis e exemplos." },
  { id: "triagem", name: "Bug Triage", route: "/lab/triagem", summary: "Severidade, prioridade e decisão de risco." },
  { id: "logs", name: "Logs Investigation", route: "/lab/logs", summary: "Incidentes, hipóteses, logs e causa provável." },
  { id: "regressao", name: "Pack de regressão", route: "/labs/regressao", summary: "Execução sistemática dos cenários por ambiente." },
  { id: "execution", name: "Execution Hub", route: "/lab/execution", summary: "Projetos, estratégia, execução e evidências." },
  { id: "competencias", name: "Mapa de competências", route: "/lab/competencias", summary: "Evolução profissional baseada em evidências." },
  { id: "portfolio", name: "Portfólio", route: "/perfil", summary: "Perfil, projetos e entregas compartilháveis." },
];
