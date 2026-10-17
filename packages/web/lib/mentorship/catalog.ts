import type { MentorshipLevel } from "./types";

export type MentorshipLesson = {
  key: string;
  title: string;
  kind: "video" | "reading" | "demo";
  duration: string;
  summary: string;
  videoUrl?: string;
};

export type MentorshipAssignment = {
  key: string;
  title: string;
  objective: string;
  delivery: string;
  beginnerRequirements: string[];
  intermediateRequirements: string[];
  rubric: string[];
  labRoute?: string;
  practice: {
    environment: string;
    route: string;
    artifact: string;
    estimatedMinutes: number;
    instructions: string[];
    completionCriteria: string[];
  };
};

export type MentorshipWeek = {
  number: number;
  slug: string;
  title: string;
  technicalFocus: string;
  liveFocus: string;
  lessons: MentorshipLesson[];
  assignment: MentorshipAssignment;
};

const week = (
  number: number,
  title: string,
  technicalFocus: string,
  liveFocus: string,
  assignment: Omit<MentorshipAssignment, "key" | "practice"> & { practice: MentorshipAssignment["practice"] },
  lessons: Array<Omit<MentorshipLesson, "key">>,
): MentorshipWeek => ({
  number,
  slug: `semana-${number}`,
  title,
  technicalFocus,
  liveFocus,
  lessons: lessons.map((lesson, index) => ({ ...lesson, key: `mentoria.w${String(number).padStart(2, "0")}.l${index + 1}` })),
  assignment: { ...assignment, key: `mentoria.w${String(number).padStart(2, "0")}.assignment` },
});

export const mentorshipWeeks: MentorshipWeek[] = [
  week(1, "Entender o produto e o risco", "Mentalidade QA, contexto e mapa de risco", "Objetivos e plano de 90 dias", {
    title: "Mapa de risco do ExpenseFlow",
    objective: "Entender o produto antes de clicar sem estrategia e transformar observacoes em riscos testaveis.",
    delivery: "Mapa do produto, cinco riscos priorizados e uma pergunta de negocio para cada risco.",
    beginnerRequirements: ["Descrever o fluxo principal", "Listar cinco riscos", "Explicar o risco mais importante"],
    intermediateRequirements: ["Relacionar risco a impacto", "Definir heuristicas de exploracao", "Justificar a priorizacao"],
    rubric: ["Contexto compreendido", "Riscos especificos", "Prioridade justificada", "Evidencia clara"],
    labRoute: "/playground",
    practice: { environment: "ExpenseFlow", route: "/playground/expenseflow", artifact: "Mapa de risco", estimatedMinutes: 35, instructions: ["Compare os perfis de colaborador, gestora e admin e identifique quem decide sobre cada reembolso.", "Percorra nova despesa, lista, aprovações e relatórios; observe o que muda após salvar e decidir.", "Anote o que observou, o impacto possível e o que ainda precisa confirmar."], completionCriteria: ["Cinco riscos descritos com impacto", "Risco mais importante justificado", "Uma pergunta de negócio registrada"] },
  }, [
    { title: "O que um QA decide", kind: "video", duration: "12 min", summary: "Qualidade como decisão, risco e comunicação." },
    { title: "Leitura do briefing", kind: "reading", duration: "10 min", summary: "Como extrair regras e perguntas antes de executar." },
    { title: "Exploração guiada", kind: "demo", duration: "18 min", summary: "Uma investigação curta no ExpenseFlow." },
  ]),
  week(2, "Explorar com intencao", "Teste exploratorio e priorizacao", "Inseguranca e sindrome do impostor", {
    title: "Charter exploratorio",
    objective: "Investigar um fluxo critico com tempo limitado e tornar o raciocinio visivel.",
    delivery: "Charter, notas da sessao, achados e proxima pergunta de investigacao.",
    beginnerRequirements: ["Definir missao", "Registrar observacoes", "Separar fato de hipotese"],
    intermediateRequirements: ["Escolher heuristicas", "Registrar cobertura e lacunas", "Propor proxima sessao por risco"],
    rubric: ["Missao delimitada", "Evidencia reproduzivel", "Cobertura explicada", "Aprendizado registrado"],
    practice: { environment: "Lab Exploratorio", route: "/labs/exploratorio", artifact: "Charter e notas de sessao", estimatedMinutes: 40, instructions: ["Escolha uma missao curta no lab.", "Defina tempo, area e pergunta de investigacao antes de comecar.", "Registre observacoes separando fatos, hipoteses e duvidas."], completionCriteria: ["Missao com escopo e tempo", "Notas reproduziveis", "Achados e proxima pergunta"] },
  }, [
    { title: "Teste exploratório", kind: "video", duration: "20 min", summary: "Como investigar sem virar uma navegação aleatória." },
    { title: "Heurísticas úteis", kind: "reading", duration: "15 min", summary: "Perguntas para encontrar riscos novos." },
  ]),
  week(3, "Projetar testes", "Tecnicas e cobertura", "Raciocinio critico e autonomia", {
    title: "Cenarios por risco",
    objective: "Transformar requisitos em cenarios uteis, incluindo negativos e limites.",
    delivery: "Cenarios priorizados usando equivalencia, limites e tabela de decisao.",
    beginnerRequirements: ["Cobrir fluxo principal", "Adicionar caso negativo", "Adicionar caso de limite"],
    intermediateRequirements: ["Explicitar combinacoes", "Relacionar cenario a risco", "Cortar redundancias"],
    rubric: ["Tecnica adequada", "Cobertura de bordas", "Prioridade", "Clareza dos resultados"],
    practice: { environment: "Lab de criterios", route: "/lab/criterios", artifact: "Cenarios priorizados", estimatedMinutes: 40, instructions: ["Selecione uma historia e extraia regras e exemplos.", "Use particao de equivalencia e valores-limite.", "Inclua um caminho feliz, um negativo e um caso de borda."], completionCriteria: ["Cenarios ligados a regras", "Caminho feliz, erro e limite cobertos", "Prioridade explicada"] },
  }, [
    { title: "Técnicas que economizam tempo", kind: "video", duration: "22 min", summary: "Como ampliar cobertura sem escrever centenas de casos." },
    { title: "Checklist de cenários", kind: "reading", duration: "12 min", summary: "Modelo para revisar uma cobertura." },
  ]),
  week(4, "Comunicar um defeito", "Bug report e estrategia manual", "Comunicacao e posicionamento", {
    title: "Relatorio de release",
    objective: "Comunicar defeitos com contexto, impacto e passos que permitam decisao.",
    delivery: "Dois bug reports, evidencias e recomendacao de release.",
    beginnerRequirements: ["Reproduzir o defeito", "Descrever esperado e atual", "Anexar evidencia"],
    intermediateRequirements: ["Explicar impacto de negocio", "Relacionar risco de regressao", "Recomendar decisao"],
    rubric: ["Reproducao", "Severidade coerente", "Impacto", "Acionabilidade"],
    labRoute: "/labs",
    practice: { environment: "Template de bug report", route: "/playground/template-bug-report", artifact: "Dois relatos de defeito", estimatedMinutes: 35, instructions: ["Explore um fluxo e confirme o comportamento inesperado.", "Registre ambiente, pre-condicoes, passos, resultado atual e esperado.", "Avalie impacto e recomende liberar, bloquear ou investigar."], completionCriteria: ["Dois relatos reproduziveis", "Impacto/severidade coerentes", "Evidencia e recomendacao de release"] },
  }, [
    { title: "Bug report que resolve", kind: "video", duration: "18 min", summary: "O que um time precisa saber para agir." },
    { title: "Template de release", kind: "reading", duration: "10 min", summary: "Como sintetizar risco para stakeholders." },
  ]),
  week(5, "Automatizar com criterio", "Piramide e selecao de automacao", "Rotina e consistencia", {
    title: "Decisao de automacao",
    objective: "Escolher o que automatizar e explicar o retorno da decisao.",
    delivery: "Matriz de candidatos, riscos e plano de automacao.",
    beginnerRequirements: ["Escolher tres fluxos", "Explicar repeticao", "Separar manual de automatizado"],
    intermediateRequirements: ["Considerar custo de manutencao", "Propor camada de teste", "Definir criterio de estabilidade"],
    rubric: ["Criterio de escolha", "Risco considerado", "Escopo viavel", "Justificativa"],
    practice: { environment: "Curso Cypress E2E", route: "/cursos/cypress", artifact: "Matriz de candidatos", estimatedMinutes: 35, instructions: ["Revise os fluxos praticados nas semanas anteriores e os modulos de estrategia do curso.", "Compare frequencia, risco, estabilidade e custo de manutencao.", "Escolha o que automatizar primeiro e o que manter exploratorio."], completionCriteria: ["Tres candidatos comparados", "Camada de teste escolhida", "Trade-off e criterio de estabilidade"] },
  }, [
    { title: "O que vale automatizar", kind: "video", duration: "20 min", summary: "Piramide, risco e retorno." },
    { title: "Matriz de candidatos", kind: "reading", duration: "12 min", summary: "Como tomar a decisao sem automatizar por moda." },
  ]),
  week(6, "Automacao web confiavel", "Cypress/Playwright, seletores e assertions", "Pedir ajuda e lidar com bloqueios", {
    title: "Fluxo web automatizado",
    objective: "Implementar uma automacao legivel e estavel para um fluxo critico.",
    delivery: "Repositorio ou patch com suite, README e evidencias de execucao.",
    beginnerRequirements: ["Automatizar um smoke", "Usar seletores por intencao", "Adicionar assertions"],
    intermediateRequirements: ["Isolar massa", "Tratar ambientes", "Evitar espera fixa e acoplamento"],
    rubric: ["Legibilidade", "Estabilidade", "Assertions uteis", "Reproducibilidade"],
    practice: { environment: "Workspace de automacao", route: "/test-suite", artifact: "Smoke automatizado", estimatedMinutes: 50, instructions: ["Use o workspace para estruturar uma spec para o ExpenseFlow ou outro fluxo web simples.", "Implemente ou esboce passos com seletores por intencao.", "Valide resultado de negocio com assertions e documente a execucao."], completionCriteria: ["Fluxo smoke definido", "Assertions observaveis", "Massa e execucao reproduziveis"] },
  }, [
    { title: "Primeiro teste executável", kind: "video", duration: "25 min", summary: "Estrutura mínima e fluxo de trabalho." },
    { title: "Seletores e massa", kind: "demo", duration: "20 min", summary: "Como reduzir flakiness desde o primeiro teste." },
  ]),
  week(7, "Testar APIs", "Automacao de API e integracao", "Relacao com dev e produto", {
    title: "Suite de contrato",
    objective: "Verificar contrato, dados e erros de uma API de treino.",
    delivery: "Collection ou suite automatizada cobrindo sucesso, erro e limite.",
    beginnerRequirements: ["Executar requests", "Validar status e corpo", "Cobrir erro"],
    intermediateRequirements: ["Validar contrato", "Encadear dados", "Separar setup e assertions"],
    rubric: ["Cobertura", "Dados controlados", "Contrato", "Diagnostico de falha"],
    labRoute: "/api-playground",
    practice: { environment: "API Playground", route: "/api-playground", artifact: "Collection ou suite de contrato", estimatedMinutes: 40, instructions: ["Execute uma operacao de leitura e uma de escrita no ambiente de treino.", "Valide status, campos e regra de negocio da resposta.", "Repita com dado ausente ou invalido e registre o diagnostico."], completionCriteria: ["Caminho de sucesso validado", "Erro/limite coberto", "Dados e assertions reproduziveis"] },
  }, [
    { title: "API como produto", kind: "video", duration: "18 min", summary: "O que verificar alem do status 200." },
    { title: "Contrato e dados", kind: "demo", duration: "22 min", summary: "Requests reproduziveis e assertions de negocio." },
  ]),
  week(8, "Manter a suite saudavel", "Arquitetura, manutencao e flakiness", "Receber e aplicar feedback", {
    title: "Revisao de automacao",
    objective: "Revisar uma suite existente, localizar fragilidades e propor melhoria.",
    delivery: "Code review, refatoracao de um fluxo e diagnostico de um teste instavel.",
    beginnerRequirements: ["Identificar duplicacao", "Melhorar um seletor", "Documentar um problema"],
    intermediateRequirements: ["Propor arquitetura", "Investigar causa de flakiness", "Definir prioridade tecnica"],
    rubric: ["Diagnostico", "Melhoria efetiva", "Trade-off", "Clareza da revisao"],
    practice: { environment: "Lab de waits e automacao", route: "/labs/waits", artifact: "Revisao tecnica de suite", estimatedMinutes: 40, instructions: ["Execute o lab e observe sincronizacao e estados da interface.", "Identifique uma espera fragil, seletor acoplado ou dependencia entre testes.", "Proponha uma mudanca e explique o risco que ela remove."], completionCriteria: ["Fragilidade demonstrada", "Melhoria concreta proposta", "Trade-off e diagnostico registrados"] },
  }, [
    { title: "Suíte sustentável", kind: "video", duration: "24 min", summary: "Abstração, isolamento e manutenção." },
    { title: "Como investigar flakiness", kind: "reading", duration: "15 min", summary: "Evidencia antes de culpar o teste." },
  ]),
  week(9, "Levar qualidade ao pipeline", "CI/CD, Git e artefatos", "Participar de refinamentos", {
    title: "Pipeline de qualidade",
    objective: "Executar verificacoes de qualidade de forma automatica e observavel.",
    delivery: "Workflow, logs, artefatos e instrucoes de execucao.",
    beginnerRequirements: ["Ordenar etapas", "Executar testes", "Ler resultado"],
    intermediateRequirements: ["Escolher gates", "Paralelizar com criterio", "Separar smoke e regressao"],
    rubric: ["Ordem de falha", "Gates", "Artefatos", "Diagnostico"],
    practice: { environment: "Lab de CI/CD", route: "/lab/cicd", artifact: "Workflow de qualidade", estimatedMinutes: 45, instructions: ["Desenhe o caminho do commit ao feedback.", "Defina verificacoes rapidas e completas e a ordem de execucao.", "Indique o que deve ser salvo como artefato quando algo falhar."], completionCriteria: ["Etapas ordenadas", "Gate associado a risco", "Log/artefato e caminho de diagnostico"] },
  }, [
    { title: "Pipeline do commit ao feedback", kind: "video", duration: "24 min", summary: "Como qualidade entra no fluxo de entrega." },
    { title: "GitHub Actions seguro", kind: "demo", duration: "20 min", summary: "Secrets, artefatos e falhas uteis." },
  ]),
  week(10, "Decidir com sinais do CI", "Quality gates, deploy e rollback", "Conflito e comunicacao de risco", {
    title: "Diagnostico de release",
    objective: "Interpretar uma falha de pipeline e tomar uma decisao de release.",
    delivery: "Relatorio de falha, decisao de gate e plano de rollback.",
    beginnerRequirements: ["Localizar etapa falha", "Explicar impacto", "Propor proxima acao"],
    intermediateRequirements: ["Distinguir flaky de regressao", "Definir excecao documentada", "Propor observabilidade"],
    rubric: ["Leitura dos sinais", "Risco", "Decisao", "Plano de recuperacao"],
    practice: { environment: "Lab de logs", route: "/lab/logs", artifact: "Diagnostico de release", estimatedMinutes: 40, instructions: ["Investigue os sinais e logs do cenario de falha.", "Separe evidencias de hipoteses e identifique o impacto.", "Decida entre corrigir, rollback ou excecao controlada."], completionCriteria: ["Causa provavel sustentada por evidencia", "Risco e decisao explicitados", "Proxima acao/rollback definida"] },
  }, [
    { title: "Quality gate não é número mágico", kind: "video", duration: "20 min", summary: "Gates alinhados a risco." },
    { title: "Rollback e feature flag", kind: "reading", duration: "12 min", summary: "Como reduzir custo de uma decisao errada." },
  ]),
  week(11, "Medir comportamento sob carga", "Teste de carga, metricas e gargalos", "LinkedIn, curriculo e networking", {
    title: "Relatorio de performance",
    objective: "Executar carga controlada em ambiente seguro e explicar seus resultados.",
    delivery: "Script k6, thresholds, relatorio e recomendacao.",
    beginnerRequirements: ["Executar baseline", "Ler latencia e erros", "Comparar dois cenarios"],
    intermediateRequirements: ["Definir modelo de carga", "Usar percentis", "Localizar gargalo e limite"],
    rubric: ["Cenario realista", "Seguranca do alvo", "Metricas", "Recomendacao"],
    labRoute: "/api-playground",
    practice: { environment: "Lab local de performance com k6", route: "/mentoria/performance", artifact: "Script, evidencias de execucao e relatorio de performance", estimatedMinutes: 40, instructions: ["Suba a API de treino local e confira o alvo loopback permitido.", "Execute o baseline, depois carga gradual e pico somente com a confirmacao LOCAL_ONLY.", "Registre latencia, percentis, throughput e erros; compare os resultados e recomende o proximo experimento."], completionCriteria: ["Script e alvo local identificados", "Baseline e duas cargas comparaveis", "Thresholds, percentis, erros e recomendacao explicados"] },
  }, [
    { title: "Carga com responsabilidade", kind: "video", duration: "22 min", summary: "Tipos de carga e limites seguros." },
    { title: "p95, p99 e throughput", kind: "demo", duration: "18 min", summary: "Como transformar numero em decisao." },
  ]),
  week(12, "Apresentar uma decisao de release", "Projeto integrado", "Entrevista e apresentacao final", {
    title: "Release Challenge",
    objective: "Unir teste manual, automacao, CI/CD e carga em uma decisao profissional.",
    delivery: "Case completo, repositorio, relatorio e apresentacao de cinco minutos.",
    beginnerRequirements: ["Cobrir fluxo critico", "Entregar evidencia", "Explicar a recomendacao"],
    intermediateRequirements: ["Defender trade-offs", "Relacionar sinais", "Propor proximos investimentos"],
    rubric: ["Visao de sistema", "Evidencias", "Decisao", "Comunicacao", "Aprendizado"],
    practice: { environment: "Release Challenge", route: "/mentoria/semanas/12", artifact: "Case integrado e apresentacao", estimatedMinutes: 60, instructions: ["Reuna evidencias das missoes anteriores em um unico contexto de produto.", "Conecte risco, testes, automacao, sinais do pipeline e performance.", "Escreva uma decisao de release e prepare um resumo de cinco minutos."], completionCriteria: ["Evidencias rastreaveis", "Trade-offs e risco explicados", "Decisao e proximos passos claros"] },
  }, [
    { title: "Como contar seu case", kind: "video", duration: "18 min", summary: "Contexto, risco, abordagem e resultado." },
    { title: "Checklist final", kind: "reading", duration: "10 min", summary: "Prepare um case que outra pessoa consiga avaliar." },
  ]),
];

// Aulas complementares do RoadMapQA entram no fim de cada semana para preservar
// as chaves mentoria.wXX.lN que já podem estar gravadas no progresso dos alunos.
const roadmapQALessonDefinitions: Record<number, Omit<MentorshipLesson, "key">> = {
  2: { title: "Como o trabalho de QA percorre a entrega", kind: "reading", duration: "18 min", summary: "Cascata, métodos ágeis, eventos de equipe, gargalos e compatibilidade." },
  3: { title: "Do plano de teste ao exemplo executável", kind: "reading", duration: "20 min", summary: "Test planning, Gherkin, passo a passo, TDD, BDD e validação." },
  4: { title: "Organizar técnicas e evidências de teste", kind: "reading", duration: "18 min", summary: "Tipos de teste, relatórios, registros, ferramentas e rastreabilidade." },
  5: { title: "Camadas, AAA e estratégia de automação", kind: "reading", duration: "18 min", summary: "Quando automatizar e distribuir cobertura entre unidade, integração e E2E." },
  6: { title: "Fundamentos de front-end para QA", kind: "reading", duration: "20 min", summary: "HTML, CSS, JavaScript, DevTools, responsividade e frameworks." },
  7: { title: "API, contrato e controle de acesso", kind: "reading", duration: "20 min", summary: "Back-end, OpenAPI, ferramentas de API, papéis e autorização." },
  8: { title: "Padrões de automação com propósito", kind: "reading", duration: "18 min", summary: "Page Objects, custom commands, Builder e limites de abstração." },
  9: { title: "Git, CI/CD e gates de qualidade", kind: "reading", duration: "20 min", summary: "Revisão de mudanças, pipelines, matrizes, métricas e proteção de secrets." },
  10: { title: "Monitoramento e segurança na operação", kind: "reading", duration: "20 min", summary: "Logs, telemetria, vulnerabilidades, políticas e contenção." },
  11: { title: "Performance e acessibilidade com evidências", kind: "reading", duration: "20 min", summary: "Lighthouse, Locust, carga, DevTools e avaliação por tarefa." },
  12: { title: "Carreira e uso responsável de informação", kind: "reading", duration: "18 min", summary: "IA, privacidade, portfólio e próximos passos profissionais." },
};

for (const week of mentorshipWeeks) {
  const lesson = roadmapQALessonDefinitions[week.number];
  if (lesson) week.lessons.push({ ...lesson, key: `mentoria.w${String(week.number).padStart(2, "0")}.l${week.lessons.length + 1}` });
}

export function findMentorshipWeek(number: number) {
  return mentorshipWeeks.find((item) => item.number === number);
}

export function findMentorshipLesson(key: string) {
  return mentorshipWeeks.flatMap((item) => item.lessons).find((lesson) => lesson.key === key);
}

export function findMentorshipAssignment(key: string) {
  return mentorshipWeeks.map((item) => item.assignment).find((assignment) => assignment.key === key);
}

export function requirementsFor(level: MentorshipLevel, assignment: MentorshipAssignment) {
  return level === "intermediate" ? assignment.intermediateRequirements : assignment.beginnerRequirements;
}

export type MentorshipTechnicalTrack = "manual" | "automation" | "cicd" | "performance" | "integrated";

export function mentorshipTrackForWeek(weekNumber: number): MentorshipTechnicalTrack {
  if (weekNumber >= 1 && weekNumber <= 4) return "manual";
  if (weekNumber >= 5 && weekNumber <= 8) return "automation";
  if (weekNumber >= 9 && weekNumber <= 10) return "cicd";
  if (weekNumber === 11) return "performance";
  return "integrated";
}
