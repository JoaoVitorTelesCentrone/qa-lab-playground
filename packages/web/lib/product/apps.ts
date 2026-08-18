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
