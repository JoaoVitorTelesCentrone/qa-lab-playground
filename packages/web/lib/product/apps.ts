// Ambientes de prática do QA Lab.
//
// Fonte única sobre os 4 apps que o aluno testa. Home, navegação, packs de
// regressão e a API v1 leem daqui — nenhum deles redeclara nome, rota ou
// entidade. Módulo puro de propósito: sem React e sem lucide, para poder ser
// importado por route handlers, testes e Server Components.

export type PracticeAppId = "qa-lab" | "financas" | "agendamentos" | "crm";

export type PracticeApp = {
  id: PracticeAppId;
  name: string;
  route: string;
  /** O que o ambiente é, em uma linha, para o card da home. */
  summary: string;
  /** Entidade principal do domínio, usada na redação dos cenários de regressão. */
  entity: string;
  /** Fluxos testáveis que o aluno encontra dentro do ambiente. */
  flows: string[];
};

export const practiceApps: PracticeApp[] = [
  {
    id: "qa-lab",
    name: "QA Lab",
    route: "/shop/products",
    summary: "Loja completa: catálogo, carrinho, checkout, pedidos, conta e operação.",
    entity: "produto, carrinho e pedido",
    flows: ["Catálogo e busca", "Carrinho e checkout", "Pedidos e pós-venda", "Conta e sessão", "Operação e governança"],
  },
  {
    id: "financas",
    name: "Finanças",
    route: "/financas",
    summary: "Controle financeiro com lançamentos, orçamento, metas e recorrências.",
    entity: "lançamento financeiro",
    flows: ["Lançamentos", "Orçamento por categoria", "Metas", "Recorrências", "Relatórios"],
  },
  {
    id: "agendamentos",
    name: "Agendamentos",
    route: "/agendamentos",
    summary: "Agenda de serviços com disponibilidade, conflito, reagendamento e cancelamento.",
    entity: "agendamento",
    flows: ["Disponibilidade", "Conflito de horário", "Reagendamento", "Cancelamento", "Confirmação"],
  },
  {
    id: "crm",
    name: "CRM",
    route: "/crm",
    summary: "Painel comercial: funil por estágio, valor por conta e as métricas que dependem deles.",
    entity: "indicador do funil",
    flows: ["Funil por estágio", "Valor por empresa", "Atividades", "Taxa de ganho", "Gráfico versus tabela"],
  },
];

export function findPracticeApp(id: string) {
  return practiceApps.find((app) => app.id === id);
}

export function isPracticeAppId(value: string): value is PracticeAppId {
  return practiceApps.some((app) => app.id === value);
}
