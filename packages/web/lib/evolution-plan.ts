import type { ChallengeDeliverables } from "./challenge-deliverables";

export const EVOLUTION_PREFIX = "evolution:";

export type EvolutionIconKey = "folder" | "clipboard" | "graduation" | "layers" | "file" | "target" | "workflow" | "check" | "users";
export type EvolutionStatus = "Agora" | "Depois" | "Portfolio";

export type EvolutionSignalInput = {
  projects: { status: string }[];
  drafts: { kind: string }[];
  progress: { mission_id: string; status: string }[];
  sessions: { status: string }[];
  deliverables: ChallengeDeliverables;
};

export type EvolutionLab = {
  stepId: string;
  scenario: string;
  mission: string;
  tasks: string[];
  rubric: string[];
  minimumEvidence: string[];
  starter: string;
};
export type EvolutionStep = {
  id: string;
  title: string;
  competency: string;
  reason: string;
  href: string;
  cta: string;
  evidence: string;
  content: string;
  contentHref: string;
  contentCta: string;
  status: EvolutionStatus;
  icon: EvolutionIconKey;
  done: boolean;
};

type StepDefinition = Omit<EvolutionStep, "done"> & { draftKind: "note" | "bug_report" | "test_case" | "gherkin" | "test_plan" };

const definitions = {
  "setup-project": {
    id: "setup-project",
    title: "Criar um contexto real de pratica",
    competency: "Base do Lab",
    reason: "Antes de acumular telas, defina um produto, objetivo e risco principal. Isso deixa cada exercicio mais parecido com trabalho real.",
    href: "/lab",
    cta: "Criar projeto",
    content: "Briefing curto: produto, usuario, fluxo critico, risco de negocio e criterio de sucesso.",
    contentHref: "/estudos/estrategia-de-testes-baseada-em-risco",
    contentCta: "Estudar estrategia",
    evidence: "Um projeto ativo com descricao objetiva do contexto.",
    status: "Agora",
    icon: "folder",
    draftKind: "note",
  },
  "investigate-expenseflow": {
    id: "investigate-expenseflow",
    title: "Investigar o ExpenseFlow",
    competency: "Investigacao",
    reason: "A primeira evolucao forte vem de observar comportamento, levantar hipoteses e transformar achados em bugs acionaveis.",
    href: "/playground/expenseflow",
    cta: "Abrir playground",
    content: "Bug report que acelera decisao + diferenca entre severidade e prioridade.",
    contentHref: "/estudos/como-escrever-um-bug-report-que-ajuda",
    contentCta: "Ler guia",
    evidence: "Cinco bugs com passos, resultado atual, esperado, impacto e evidencia.",
    status: "Depois",
    icon: "clipboard",
    draftKind: "bug_report",
  },
  "review-competency-map": {
    id: "review-competency-map",
    title: "Revisar o mapa de competencias",
    competency: "Progressao",
    reason: "Depois da primeira entrega, o Lab calcula quais competencias ainda estao sem evidencia e sugere a proxima pratica.",
    href: "/lab/competencias",
    cta: "Ver mapa",
    content: "Leitura guiada dos sinais de progresso por area.",
    contentHref: "/lab/competencias",
    contentCta: "Abrir mapa",
    evidence: "Uma decisao clara sobre a proxima competencia a treinar.",
    status: "Portfolio",
    icon: "graduation",
    draftKind: "note",
  },
  "complete-bug-reports": {
    id: "complete-bug-reports",
    title: "Fechar uma bateria de bug reports",
    competency: "Investigacao",
    reason: "O salto agora e sair de achados soltos para uma entrega revisavel.",
    href: "/playground/entregas",
    cta: "Completar entrega",
    content: "Titulo orientado a impacto, passos minimos, resultado atual, esperado e evidencias.",
    contentHref: "/estudos/como-escrever-um-bug-report-que-ajuda",
    contentCta: "Revisar bug report",
    evidence: "Pacote de bug reports pronto para revisao.",
    status: "Agora",
    icon: "clipboard",
    draftKind: "bug_report",
  },
  "create-bdd-scenarios": {
    id: "create-bdd-scenarios",
    title: "Transformar achados em cenarios",
    competency: "Design de testes",
    reason: "Depois de encontrar falhas, o proximo nivel e converter risco em exemplos que previnem regressao.",
    href: "/playground/entregas",
    cta: "Criar BDD",
    content: "BDD a partir de comportamento, com regra de negocio antes de detalhe de tela.",
    contentHref: "/estudos/bdd-alem-do-dado-quando-entao",
    contentCta: "Estudar BDD",
    evidence: "Cenarios Gherkin cobrindo fluxo feliz, validacao negativa e edge case.",
    status: "Depois",
    icon: "layers",
    draftKind: "gherkin",
  },
  "save-investigation-notes": {
    id: "save-investigation-notes",
    title: "Registrar aprendizado no workspace",
    competency: "Portfolio",
    reason: "Rascunhos bem organizados viram historico de evolucao e material para demonstrar competencia.",
    href: "/lab",
    cta: "Salvar rascunho",
    content: "Resumo da investigacao: riscos, padroes de falha, duvidas e proximas verificacoes.",
    contentHref: "/playground/template-bug-report",
    contentCta: "Ver template",
    evidence: "Um rascunho de bug report ou plano de teste salvo no Lab.",
    status: "Portfolio",
    icon: "file",
    draftKind: "note",
  },
  "risk-strategy": {
    id: "risk-strategy",
    title: "Montar estrategia baseada em risco",
    competency: "Gestao da qualidade",
    reason: "Voce ja tem investigacao suficiente. Agora precisa decidir cobertura, prioridade e risco residual com clareza.",
    href: "/lab/studio",
    cta: "Abrir Studio",
    content: "Matriz simples: area critica, probabilidade, impacto, tecnica de teste e o que fica fora.",
    contentHref: "/estudos/estrategia-de-testes-baseada-em-risco",
    contentCta: "Estudar risco",
    evidence: "Plano de teste com riscos priorizados e justificativa de cobertura.",
    status: "Agora",
    icon: "target",
    draftKind: "test_plan",
  },
  "e2e-automation-decision": {
    id: "e2e-automation-decision",
    title: "Escolher automacao com criterio",
    competency: "Automacao pragmatica",
    reason: "Automatizar tudo e tao fraco quanto nao automatizar nada. O Lab deve treinar decisao, nao volume.",
    href: "/playground/entregas",
    cta: "Definir E2E",
    content: "Piramide de testes, custo de manutencao e fluxo critico.",
    contentHref: "/trilhas/cicd",
    contentCta: "Ver CI/CD",
    evidence: "Lista de candidatos E2E com decisao e justificativa.",
    status: "Depois",
    icon: "workflow",
    draftKind: "test_plan",
  },
  "portfolio-export": {
    id: "portfolio-export",
    title: "Publicar uma entrega de portfolio",
    competency: "Comunicacao",
    reason: "A entrega final precisa explicar o raciocinio, nao apenas listar artefatos.",
    href: "/playground/conclusao",
    cta: "Gerar conclusao",
    content: "Narrativa curta: contexto, riscos, evidencias, decisoes e proximos passos.",
    contentHref: "/playground/conclusao",
    contentCta: "Abrir conclusao",
    evidence: "Pacote exportavel do desafio ExpenseFlow.",
    status: "Portfolio",
    icon: "graduation",
    draftKind: "note",
  },
  "cicd-foundation": {
    id: "cicd-foundation",
    title: "Levar qualidade para o pipeline",
    competency: "CI/CD",
    reason: "O proximo salto e ligar risco, gate e confianca de entrega.",
    href: "/trilhas/cicd",
    cta: "Resolver missao",
    content: "Ordem de pipeline, diagnostico de log, quality gates e segredo por ambiente.",
    contentHref: "/trilhas/cicd",
    contentCta: "Abrir CI/CD Lab",
    evidence: "Tres missoes resolvidas com feedback lido.",
    status: "Agora",
    icon: "workflow",
    draftKind: "test_plan",
  },
  "release-decision": {
    id: "release-decision",
    title: "Revisar decisoes de release",
    competency: "Gestao da entrega",
    reason: "Um QA forte nao so encontra bug: ele ajuda o time a decidir quando bloquear, mitigar ou liberar.",
    href: "/lab/studio",
    cta: "Revisar plano",
    content: "Criterios de entrada, saida, rollback e risco residual.",
    contentHref: "/estudos/estrategia-de-testes-baseada-em-risco",
    contentCta: "Estudar decisao",
    evidence: "Uma decisao de release documentada no projeto.",
    status: "Depois",
    icon: "check",
    draftKind: "test_plan",
  },
  "pressure-communication": {
    id: "pressure-communication",
    title: "Treinar comunicacao sob pressao",
    competency: "People Lab",
    reason: "A decisao tecnica precisa sobreviver a prazo, conflito e ambiguidade.",
    href: "/lab/pessoas",
    cta: "Praticar situacao",
    content: "Comunicar risco sem virar bloqueador automatico.",
    contentHref: "/lab/pessoas",
    contentCta: "Abrir People Lab",
    evidence: "Uma resposta avaliada no People Lab.",
    status: "Portfolio",
    icon: "users",
    draftKind: "note",
  },
  "integrator-cycle": {
    id: "integrator-cycle",
    title: "Rodar um ciclo integrador",
    competency: "Profissional",
    reason: "Voce ja tem sinais em investigacao, estrategia e entrega. Agora o valor esta em conectar tudo em uma decisao completa.",
    href: "/lab/competencias",
    cta: "Ver lacunas",
    content: "Release critica: investigar, priorizar, configurar gate e comunicar decisao.",
    contentHref: "/lab/competencias",
    contentCta: "Ver competencias",
    evidence: "Relatorio unico com achados, plano, gates e comunicacao final.",
    status: "Agora",
    icon: "graduation",
    draftKind: "test_plan",
  },
  "weakest-competency": {
    id: "weakest-competency",
    title: "Aprofundar a menor competencia",
    competency: "Progressao adaptativa",
    reason: "O melhor proximo passo nao e fazer mais do mesmo: e atacar a area com menos evidencia no mapa.",
    href: "/lab/competencias",
    cta: "Abrir mapa",
    content: "Comparar percentuais por competencia e escolher uma missao com evidencia diferente.",
    contentHref: "/lab/competencias",
    contentCta: "Abrir mapa",
    evidence: "Uma nova evidencia na competencia mais fraca.",
    status: "Depois",
    icon: "target",
    draftKind: "note",
  },
  "shareable-portfolio": {
    id: "shareable-portfolio",
    title: "Preparar uma entrega compartilhavel",
    competency: "Portfolio",
    reason: "Conteudo top vira ativo quando mostra raciocinio, trade-off e resultado, nao so checklist.",
    href: "/playground/conclusao",
    cta: "Exportar entrega",
    content: "Antes/depois: risco inicial, investigacao, decisao e impacto esperado.",
    contentHref: "/playground/conclusao",
    contentCta: "Abrir entrega",
    evidence: "Entrega final revisada para portfolio.",
    status: "Portfolio",
    icon: "file",
    draftKind: "note",
  },
} satisfies Record<string, StepDefinition>;

export const evolutionStepIds = Object.keys(definitions);

export function toEvolutionMissionId(stepId: string) {
  return `${EVOLUTION_PREFIX}${stepId}`;
}

export function isEvolutionStepId(value: string): value is keyof typeof definitions {
  return value in definitions;
}

export function getEvolutionStepDefinition(stepId: string) {
  return isEvolutionStepId(stepId) ? definitions[stepId] : null;
}

export function getEvolutionEvidenceDraft(stepId: string) {
  const step = getEvolutionStepDefinition(stepId);
  if (!step) return null;
  return {
    kind: step.draftKind,
    title: `Evidencia - ${step.title}`.slice(0, 120),
    content: [
      `# ${step.title}`,
      "",
      `**Competencia:** ${step.competency}`,
      `**Conteudo de apoio:** ${step.content}`,
      `**Evidencia esperada:** ${step.evidence}`,
      "",
      "## Contexto",
      "Descreva o produto, fluxo, risco ou situacao praticada.",
      "",
      "## Decisao ou execucao",
      "Registre o que voce fez, quais trade-offs considerou e por que escolheu esse caminho.",
      "",
      "## Evidencias",
      "Inclua links, prints, dados, bug reports, cenarios, logs ou conclusoes relevantes.",
      "",
      "## Reflexao",
      "O que ficou mais claro? O que voce faria diferente no proximo ciclo?",
    ].join("\n"),
  };
}

function withDone(stepId: keyof typeof definitions, completed: Set<string>, inferredDone = false): EvolutionStep {
  const step = definitions[stepId];
  return { ...step, done: inferredDone || completed.has(toEvolutionMissionId(step.id)) };
}

export function buildEvolutionPlan(input: EvolutionSignalInput): EvolutionStep[] {
  const completed = new Set(input.progress.filter((item) => item.status === "completed").map((item) => item.mission_id));
  const hasActiveProject = input.projects.some((item) => item.status === "active");
  const completedSessions = input.sessions.filter((item) => item.status === "completed").length;
  const bugsWithEvidence = input.deliverables.bugs.filter((bug) => bug.evidence?.trim()).length;
  const cicdDone = [...completed].filter((id) => id.startsWith("cicd:")).length;
  const hasStrategyDraft = input.drafts.some((draft) => ["test_plan", "gherkin", "bug_report"].includes(draft.kind));

  if (!hasActiveProject && !completedSessions && input.deliverables.bugs.length === 0) {
    return [
      withDone("setup-project", completed, hasActiveProject),
      withDone("investigate-expenseflow", completed),
      withDone("review-competency-map", completed),
    ];
  }

  if (input.deliverables.bugs.length < 5 || bugsWithEvidence < input.deliverables.bugs.length) {
    const bugStep = withDone("complete-bug-reports", completed, input.deliverables.bugs.length >= 5 && bugsWithEvidence === input.deliverables.bugs.length);
    const reason = input.deliverables.bugs.length < 5
      ? `Voce tem ${input.deliverables.bugs.length}/5 bugs. ${definitions["complete-bug-reports"].reason}`
      : `Voce tem ${bugsWithEvidence}/${input.deliverables.bugs.length} bugs com evidencia. Sem evidencia, o report perde forca na triagem.`;
    return [
      { ...bugStep, title: input.deliverables.bugs.length < 5 ? bugStep.title : "Fortalecer evidencias dos bugs", reason },
      withDone("create-bdd-scenarios", completed, input.deliverables.bdd.length > 0),
      withDone("save-investigation-notes", completed, hasStrategyDraft),
    ];
  }

  if (!hasStrategyDraft || input.deliverables.bdd.length === 0 || input.deliverables.e2e.length === 0) {
    return [
      withDone("risk-strategy", completed, hasStrategyDraft),
      withDone("e2e-automation-decision", completed, input.deliverables.e2e.length > 0),
      withDone("portfolio-export", completed),
    ];
  }

  if (cicdDone < 3) {
    const cicd = withDone("cicd-foundation", completed, cicdDone >= 3);
    return [
      { ...cicd, reason: `Voce resolveu ${cicdDone}/3 missoes iniciais de CI/CD. ${cicd.reason}` },
      withDone("release-decision", completed),
      withDone("pressure-communication", completed),
    ];
  }

  return [
    withDone("integrator-cycle", completed),
    withDone("weakest-competency", completed),
    withDone("shareable-portfolio", completed),
  ];
}

export function buildEvolutionSummary(steps: EvolutionStep[]) {
  const done = steps.filter((step) => step.done).length;
  return {
    done,
    total: steps.length,
    percent: steps.length ? Math.round((done / steps.length) * 100) : 0,
    next: steps.find((step) => !step.done) ?? steps[0] ?? null,
  };
}
export function getEvolutionLab(stepId: string): EvolutionLab | null {
  const step = getEvolutionStepDefinition(stepId);
  if (!step) return null;
  const labs: Record<string, Omit<EvolutionLab, "stepId">> = {
    "setup-project": {
      scenario: "Voce entrou em um time sem estrategia de qualidade documentada. Produto, engenharia e negocio discordam sobre o que e critico.",
      mission: "Criar o primeiro briefing operacional do produto para guiar as proximas praticas do QA Lab.",
      tasks: ["Defina produto, usuario principal e fluxo mais critico.", "Liste tres riscos reais para negocio ou usuario.", "Escolha um criterio de sucesso mensuravel para a pratica.", "Explique qual evidencia provaria que a investigacao foi util."],
      rubric: ["Contexto claro o suficiente para outra pessoa testar.", "Riscos ligados a impacto real, nao so a telas.", "Criterio de sucesso verificavel.", "Proxima acao concreta no Lab."],
      minimumEvidence: ["Produto e fluxo critico", "Tres riscos priorizados", "Criterio de sucesso", "Proxima pratica escolhida"],
      starter: "Produto:\nUsuario principal:\nFluxo critico:\n\nRiscos priorizados:\n1.\n2.\n3.\n\nCriterio de sucesso:\nEvidencia esperada:\nProxima pratica:",
    },
    "investigate-expenseflow": {
      scenario: "ExpenseFlow tem falhas intencionais em filtros, aprovacao e calculos. Seu papel e investigar como um QA de produto, nao clicar aleatoriamente.",
      mission: "Executar uma sessao exploratoria e converter achados em bug reports que engenharia consiga reproduzir.",
      tasks: ["Abra o ExpenseFlow e escolha uma heuristica de investigacao.", "Encontre pelo menos dois comportamentos suspeitos.", "Documente passos minimos, resultado atual e esperado.", "Classifique impacto e anexe evidencia textual ou visual."],
      rubric: ["Bug reproduzivel sem interpretacao extra.", "Impacto explicado em linguagem de produto.", "Evidencia suficiente para triagem.", "Separacao entre fato observado e hipotese."],
      minimumEvidence: ["Dois bugs com passos", "Impacto por bug", "Resultado atual e esperado", "Evidencia"],
      starter: "Charter da sessao:\nTimebox:\nHeuristica usada:\n\nBUG 1\nTitulo:\nPassos:\nAtual:\nEsperado:\nImpacto:\nEvidencia:\n\nBUG 2\nTitulo:\nPassos:\nAtual:\nEsperado:\nImpacto:\nEvidencia:",
    },
    "complete-bug-reports": {
      scenario: "Voce ja tem achados, mas o valor nasce quando eles viram uma bateria revisavel de bugs priorizados.",
      mission: "Fechar um pacote de bug reports com evidencias e decisao de prioridade.",
      tasks: ["Revise os bugs existentes e remova duplicidades.", "Complete lacunas de reproducao e evidencia.", "Explique severidade e prioridade separadamente.", "Escreva uma recomendacao de triagem para o time."],
      rubric: ["Cada bug tem uma unica falha central.", "Prioridade considera negocio, nao so gravidade tecnica.", "Evidencia reduz debate desnecessario.", "Recomendacao de triagem e acionavel."],
      minimumEvidence: ["Lista revisada de bugs", "Severidade e prioridade", "Evidencias", "Recomendacao de triagem"],
      starter: "Resumo da bateria:\n\nBug mais critico:\nSeveridade:\nPrioridade:\nMotivo:\n\nDuplicidades removidas:\nLacunas preenchidas:\nRecomendacao de triagem:",
    },
    "create-bdd-scenarios": {
      scenario: "O time quer transformar bugs e duvidas em exemplos de comportamento antes que a regressao volte.",
      mission: "Criar cenarios BDD que expressem regra de negocio, validacao negativa e caso de limite.",
      tasks: ["Escolha uma regra ambigua ou defeituosa.", "Escreva um cenario de fluxo feliz.", "Escreva um cenario negativo.", "Escreva um edge case e explique por que ele importa."],
      rubric: ["Cenarios falam de comportamento, nao de clique.", "Cada cenario valida uma regra clara.", "Exemplos removem ambiguidade.", "Edge case tem justificativa de risco."],
      minimumEvidence: ["Tres cenarios Gherkin", "Regra coberta", "Justificativa do edge case"],
      starter: "Funcionalidade:\nRegra de negocio:\n\nCenario: fluxo principal\nDado \nQuando \nEntao \n\nCenario: validacao negativa\nDado \nQuando \nEntao \n\nCenario: edge case\nDado \nQuando \nEntao \n\nPor que esse edge case importa:",
    },
    "risk-strategy": {
      scenario: "Existe pouco tempo para testar uma release com impacto financeiro. O QA precisa orientar profundidade e trade-offs.",
      mission: "Montar uma estrategia baseada em risco com cobertura planejada e risco residual explicito.",
      tasks: ["Liste areas criticas e impactos.", "Classifique probabilidade e impacto.", "Escolha tecnicas de teste por area.", "Declare o que ficou fora e por que."],
      rubric: ["Prioridade segue risco, nao preferencia pessoal.", "Cobertura tem justificativa por area.", "Risco residual e dito com clareza.", "Plano ajuda decisao de release."],
      minimumEvidence: ["Matriz de risco", "Cobertura planejada", "Itens fora do escopo", "Risco residual"],
      starter: "Objetivo da release:\n\nArea | Probabilidade | Impacto | Cobertura planejada | Motivo\n1.\n2.\n3.\n\nFora do escopo:\nRisco residual:\nRecomendacao de release:",
    },
    "e2e-automation-decision": {
      scenario: "A suite E2E esta crescendo e o time quer automatizar tudo. Seu papel e decidir o que da confianca sem criar manutencao inutil.",
      mission: "Escolher candidatos E2E e justificar o que fica em unidade, integracao, manual ou exploratorio.",
      tasks: ["Liste tres fluxos candidatos.", "Classifique risco, frequencia e custo de manutencao.", "Decida automatizar ou nao cada um.", "Defina assercoes minimas para o E2E escolhido."],
      rubric: ["Decisao considera risco e custo.", "E2E cobre fluxo que precisa ponta a ponta.", "Nao automatizar tambem tem justificativa.", "Assercoes sao poucas e valiosas."],
      minimumEvidence: ["Tres candidatos", "Decisao por candidato", "Justificativa", "Assercoes do E2E"],
      starter: "Fluxo | Risco | Frequencia | Custo | Decisao | Justificativa\n1.\n2.\n3.\n\nE2E escolhido:\nAssercoes minimas:\nO que nao sera E2E e por que:",
    },
    "cicd-foundation": {
      scenario: "O pipeline esta lento, ruidoso e com gates pouco claros. O time nao sabe quando confiar no verde nem quando bloquear o merge.",
      mission: "Definir uma base de CI/CD com ordem de etapas, gates obrigatorios e resposta para falhas instaveis.",
      tasks: ["Ordene etapas de feedback barato para caro.", "Escolha gates que bloqueiam merge.", "Defina tratamento para flaky tests.", "Explique como isso aumenta confianca sem travar o time."],
      rubric: ["Falha cedo e barata.", "Gates bloqueiam risco real.", "Flaky test nao e ignorado nem tratado como normal.", "Decisao mostra trade-off entre velocidade e confianca."],
      minimumEvidence: ["Ordem do pipeline", "Lista de gates", "Politica para flaky", "Justificativa"],
      starter: "Ordem do pipeline:\n1.\n2.\n3.\n4.\n\nGates obrigatorios:\nGates nao obrigatorios:\nPolitica para flaky tests:\nJustificativa:",
    },
    "pressure-communication": {
      scenario: "Produto quer liberar hoje. Engenharia diz que o bug e raro. Suporte viu clientes afetados. Voce precisa comunicar risco sem virar bloqueador automatico.",
      mission: "Escrever uma comunicacao de decisao que traga evidencia, opcao de mitigacao e proximo acompanhamento.",
      tasks: ["Explique o risco em linguagem nao tecnica.", "Mostre evidencia sem exagero.", "Diferencie bloquear, mitigar ou liberar monitorando.", "Defina follow-up e dono."],
      rubric: ["Tom firme sem acusacao.", "Evidencia aparece antes da opiniao.", "Oferece alternativas de decisao.", "Inclui acompanhamento concreto."],
      minimumEvidence: ["Mensagem de comunicacao", "Evidencia resumida", "Alternativas", "Follow-up"],
      starter: "Mensagem para o time:\n\nEvidencia:\nImpacto:\nOpcoes:\n1. Bloquear se...\n2. Mitigar se...\n3. Liberar monitorando se...\n\nMinha recomendacao:\nFollow-up e dono:",
    },
  };

  const fallback: Omit<EvolutionLab, "stepId"> = {
    scenario: step.reason,
    mission: `Produzir uma evidencia real para demonstrar ${step.competency.toLowerCase()}.`,
    tasks: ["Releia o contexto da etapa.", "Execute a pratica indicada no Lab.", "Registre decisao, evidencia e trade-offs.", "Escreva uma reflexao curta sobre o proximo passo."],
    rubric: ["Evidencia concreta, nao promessa.", "Raciocinio explicito.", "Trade-off claro.", "Proxima acao definida."],
    minimumEvidence: [step.evidence, "Decisao tomada", "Reflexao", "Proximo passo"],
    starter: `Contexto:\n\nExecucao:\n\nEvidencias:\n\nDecisao:\n\nReflexao:\n\nProximo passo:`,
  };

  return { stepId: step.id, ...(labs[step.id] ?? fallback) };
}

export function buildEvolutionLabDraft(stepId: string, response: string) {
  const step = getEvolutionStepDefinition(stepId);
  const lab = getEvolutionLab(stepId);
  if (!step || !lab) return null;
  return {
    kind: step.draftKind,
    title: `Lab - ${step.title}`.slice(0, 120),
    content: [
      `# Lab - ${step.title}`,
      "",
      `**Competencia:** ${step.competency}`,
      `**Missao:** ${lab.mission}`,
      `**Evidencia esperada:** ${step.evidence}`,
      "",
      "## Entrega do aluno",
      response.trim(),
      "",
      "## Rubrica usada",
      ...lab.rubric.map((item) => `- ${item}`),
    ].join("\n"),
  };
}
