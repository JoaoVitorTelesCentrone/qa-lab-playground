// Bugs plantados, controlados por feature flag.
//
// Regra de produto: explícitos no modo instrutor, ocultos no modo aluno. Por
// isso o catálogo guarda duas descrições — `symptom`, que o aluno pode ver na
// forma de sintoma reportado, e `mechanism`, que só o instrutor enxerga.
//
// Cada bug tem efeito real no servidor (ou no cálculo compartilhado), nunca só
// um aviso na tela: o aluno precisa conseguir reproduzir e provar.

import type { PracticeAppId } from "../apps";

export type PlantedBug = {
  id: string;
  appId: PracticeAppId;
  title: string;
  /** Como o problema aparece para quem usa — é o que vira um bug report. */
  symptom: string;
  /** O que realmente está errado. Só o modo instrutor mostra. */
  mechanism: string;
  severity: "baixa" | "media" | "alta" | "critica";
  /** Cenário do pack de regressão que costuma pegar este bug. */
  scenario: string;
};

export const plantedBugs: PlantedBug[] = [
  {
    id: "financas.total-ignora-recorrente",
    appId: "financas",
    title: "Total de despesas ignora lançamentos recorrentes",
    symptom: "O saldo exibido não bate com a soma dos lançamentos da lista.",
    mechanism: "O cálculo de despesas filtra `recurring === false` antes de somar.",
    severity: "alta",
    scenario: "Valor limite / Smoke final",
  },
  {
    id: "financas.orcamento-sem-alerta",
    appId: "financas",
    title: "Orçamento estourado não alerta",
    symptom: "A barra de orçamento passa de 100% sem nenhuma mensagem.",
    mechanism: "O limiar do alerta compara com 0 em vez de com o valor do orçamento.",
    severity: "media",
    scenario: "Valor limite",
  },
  {
    id: "agendamentos.conflito-permitido",
    appId: "agendamentos",
    title: "Aceita dois agendamentos no mesmo horário",
    symptom: "O mesmo horário pode ser reservado duas vezes sem erro.",
    mechanism: "A verificação de conflito só compara a hora, ignorando a data.",
    severity: "critica",
    scenario: "Duplicidade",
  },
  {
    id: "agendamentos.cancelado-ocupa-horario",
    appId: "agendamentos",
    title: "Agendamento cancelado continua ocupando o horário",
    symptom: "Depois de cancelar, o horário segue indisponível.",
    mechanism: "A verificação de conflito não filtra por status.",
    severity: "alta",
    scenario: "Excluir/cancelar registro",
  },
  {
    id: "crm.pipeline-soma-perdidos",
    appId: "crm",
    title: "Pipeline soma oportunidades perdidas",
    symptom: "O valor do pipeline não muda quando uma oportunidade é marcada como perdida.",
    mechanism: "O total soma todos os estágios em vez de excluir `perdido`.",
    severity: "alta",
    scenario: "Ordenação / Smoke final",
  },
  {
    id: "crm.busca-ignora-acentos",
    appId: "crm",
    title: "Busca de contatos não encontra nomes com acento",
    symptom: "Buscar por \"Marina\" acha, buscar por \"Antônio\" não.",
    mechanism: "A busca compara sem normalizar acentuação nos dois lados.",
    severity: "media",
    scenario: "Busca por texto",
  },
  {
    id: "qa-lab.wrong-total",
    appId: "qa-lab",
    title: "Total do checkout diverge do resumo",
    symptom: "O valor cobrado é diferente do total exibido no resumo do pedido.",
    mechanism: "O desconto é aplicado depois do imposto em uma das telas.",
    severity: "critica",
    scenario: "Valor limite",
  },
];

export function bugsForApp(appId: PracticeAppId) {
  return plantedBugs.filter((bug) => bug.appId === appId);
}

export function isBugActive(active: string[], id: string) {
  return active.includes(id);
}

/** Só ids que existem no catálogo entram — flag desconhecida é descartada. */
export function sanitizeBugIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return ids.filter((id): id is string => typeof id === "string" && plantedBugs.some((bug) => bug.id === id));
}
