import { mentorshipWeeks, type MentorshipWeek } from "./catalog";

export type MentorshipTheme = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  promise: string;
  competencies: string[];
  units: readonly [number, number];
  synthesis: {
    title: string;
    brief: string;
    beginner: string;
    intermediate: string;
    evidence: string[];
  };
  checkpoint: string[];
};

export const mentorshipThemes: readonly MentorshipTheme[] = [
  {
    id: "fundamentos-risco",
    slug: "fundamentos-produto-risco",
    title: "Fundamentos, produto e risco",
    summary: "Entenda o produto antes de testar e use risco para decidir onde investigar primeiro.",
    promise: "Você vai sair de uma navegação sem direção com um modelo de produto, riscos priorizados e uma sessão exploratória reproduzível.",
    competencies: ["Contextualizar regras, atores e dados", "Priorizar por impacto e incerteza", "Investigar com charter e registrar evidências"],
    units: [1, 2],
    synthesis: {
      title: "Dossiê de investigação",
      brief: "Use a jornada de captura, organização e ação do Broto Space para explicar um risco crítico, conduzir uma sessão com limite de tempo e propor o próximo passo com base no que observou.",
      beginner: "Entregue um mapa simples do fluxo, três riscos priorizados e notas reproduzíveis de uma sessão exploratória.",
      intermediate: "Relacione risco residual e cobertura, compare heurísticas e justifique qual investigação deve vir a seguir.",
      evidence: ["Fluxo e atores identificados", "Risco ligado a causa e impacto", "Charter com missão e limite", "Observações separadas de hipóteses", "Lacunas e próximo passo explícitos"],
    },
    checkpoint: ["Consigo explicar o risco sem depender de uma tela específica", "Minha sessão responde a uma pergunta definida", "Outra pessoa consegue continuar a investigação com minhas notas"],
  },
  {
    id: "estrategia-comunicacao",
    slug: "estrategia-comunicacao-testes",
    title: "Estratégia e comunicação de testes",
    summary: "Transforme regras em cobertura útil e comunique defeitos de forma acionável.",
    promise: "Você vai conectar requisito, cenário, evidência e recomendação de release sem confundir volume de testes com cobertura.",
    competencies: ["Aplicar técnicas de desenho de testes", "Rastrear cenários a regras e riscos", "Comunicar defeitos e risco residual"],
    units: [3, 4],
    synthesis: {
      title: "Plano de teste e decisão de release",
      brief: "Escolha uma mudança de produto, derive cenários com técnicas adequadas, investigue um comportamento inesperado e recomende uma decisão de release sustentada por evidências.",
      beginner: "Apresente um caminho feliz, um negativo e um limite, além de um bug report reproduzível e uma recomendação curta.",
      intermediate: "Mostre a rastreabilidade entre riscos e cenários, explique os cortes de cobertura e explicite custo, incerteza e risco residual.",
      evidence: ["Regra ou hipótese identificada", "Cenários com resultado observável", "Técnica de desenho justificada", "Defeito reproduzível com impacto", "Decisão e limites documentados"],
    },
    checkpoint: ["Cada cenário cobre uma regra, risco ou classe relevante", "O relato permite reprodução sem contexto verbal", "Minha recomendação deixa claro o que ainda não sei"],
  },
  {
    id: "automacao-web",
    slug: "automacao-web-criterio",
    title: "Automação web com critério",
    summary: "Escolha o que automatizar e construa uma jornada web estável que proteja comportamento de negócio.",
    promise: "Você vai justificar uma estratégia de automação e demonstrar um smoke legível, isolado e confiável.",
    competencies: ["Selecionar candidatos por risco e retorno", "Escolher a camada adequada", "Usar seletores e assertions observáveis"],
    units: [5, 6],
    synthesis: {
      title: "Da decisão à primeira suíte",
      brief: "Escolha uma jornada crítica do Broto Space, explique por que automatizá-la nessa camada e transforme a decisão em um smoke com dados sintéticos e resultado de negócio verificável.",
      beginner: "Automatize uma jornada curta com seletores por intenção e assertions que confirmem o resultado para a pessoa usuária.",
      intermediate: "Inclua isolamento de dados, execução repetível e diagnóstico de falhas; compare o custo da camada escolhida com uma alternativa.",
      evidence: ["Candidato e risco descritos", "Camada escolhida com trade-off", "Dados e pré-condições controlados", "Assertions ligadas ao comportamento", "Passos de execução reproduzíveis"],
    },
    checkpoint: ["O teste falha quando a regra de negócio falha", "A suíte não depende de espera fixa", "Sei quando remover ou mover esse teste para outra camada"],
  },
  {
    id: "api-arquitetura",
    slug: "apis-arquitetura-testes",
    title: "APIs e arquitetura de testes",
    summary: "Teste contratos e permissões, controle dados e mantenha a automação fácil de diagnosticar.",
    promise: "Você vai validar comportamento de API e revisar a arquitetura de uma suíte a partir de evidências, não de padrões por moda.",
    competencies: ["Validar contrato, regra e autorização", "Preparar dados e dependências", "Reduzir acoplamento e investigar flakiness"],
    units: [7, 8],
    synthesis: {
      title: "Suíte de contrato com diagnóstico",
      brief: "Pratique sucesso, erro, autorização e isolamento na API de treino do QA Lab. Quando houver staging autorizado e contrato do Broto Space, adapte a suíte e explique como ela controla dados e distingue falha do produto de falha do teste.",
      beginner: "Entregue requests reproduzíveis com assertions de status, corpo e regra de negócio, incluindo ao menos um caso inválido.",
      intermediate: "Adicione verificações de contrato e autorização, setup determinístico e um diagnóstico de uma falha intermitente com evidências.",
      evidence: ["Contrato e regra observados", "Casos positivo e negativo", "Massa de dados controlada", "Permissão verificada por papel", "Diagnóstico e limite da conclusão"],
    },
    checkpoint: ["Não trato status HTTP como prova suficiente", "Os dados podem ser preparados e removidos com segurança", "Consigo explicar onde uma abstração ajuda ou atrapalha"],
  },
  {
    id: "entrega-operacao",
    slug: "cicd-seguranca-operacao",
    title: "CI/CD, segurança e operação",
    summary: "Leve verificações ao pipeline e use sinais de execução para decidir, conter e recuperar.",
    promise: "Você vai desenhar feedback de qualidade no fluxo de entrega e conduzir um diagnóstico com evidências operacionais.",
    competencies: ["Versionar mudanças e artefatos com segurança", "Definir gates proporcionais ao risco", "Correlacionar logs, hipótese e recuperação"],
    units: [9, 10],
    synthesis: {
      title: "Pipeline e diagnóstico de release",
      brief: "Desenhe o caminho de uma mudança no Broto Space até a decisão de deploy. Diante de uma falha no crescimento visível, localize sinais, avalie o impacto e recomende correção, rollback ou exceção documentada.",
      beginner: "Organize as verificações em ordem, localize a etapa que falhou e descreva uma ação segura para o time.",
      intermediate: "Justifique gates e paralelismo, proteja secrets, relacione logs a uma hipótese e inclua condições de rollback e observabilidade.",
      evidence: ["Etapas e artefatos identificados", "Gate ligado a risco concreto", "Segredos e permissões considerados", "Evidência separada de hipótese", "Recuperação e comunicação propostas"],
    },
    checkpoint: ["Uma falha crítica interrompe o fluxo antes de propagar dano", "Sei quais dados preciso para diagnosticar uma falha", "A exceção tem responsável, prazo e evidência"],
  },
  {
    id: "qualidade-carreira",
    slug: "qualidade-avancada-carreira",
    title: "Qualidade avançada e carreira",
    summary: "Avalie experiência e carga com responsabilidade e sintetize seu raciocínio em um case profissional.",
    promise: "Você vai relacionar performance, acessibilidade e evidências anteriores a uma decisão de release clara e segura para compartilhar.",
    competencies: ["Definir objetivos e limites de medição", "Avaliar acessibilidade por tarefa", "Construir um case verificável e proteger informação"],
    units: [11, 12],
    synthesis: {
      title: "Release Challenge e case de portfólio",
      brief: "Una evidências manuais, automatizadas, de API, pipeline, acessibilidade e desempenho do Broto Space para recomendar uma decisão e apresentar o que os dados permitem — e não permitem — concluir.",
      beginner: "Monte uma narrativa de cinco minutos com contexto, risco, evidências, decisão e uma lacuna prioritária para continuar estudando.",
      intermediate: "Compare sinais, defenda trade-offs e proponha próximos investimentos com impacto esperado, limitações e critério de acompanhamento.",
      evidence: ["Afirmações ligadas a evidências rastreáveis", "Thresholds e impacto interpretados", "Experiência por tarefa considerada", "Risco residual e lacunas declarados", "Dados sensíveis removidos e autoria clara"],
    },
    checkpoint: ["As métricas sustentam a decisão em vez de substituí-la", "Meu case pode ser avaliado sem expor dados confidenciais", "Sei nomear a próxima competência e uma evidência para praticá-la"],
  },
];

export function findMentorshipTheme(slug: string) {
  return mentorshipThemes.find((theme) => theme.slug === slug);
}

export function themeForUnit(unitNumber: number) {
  return mentorshipThemes.find(({ units }) => unitNumber >= units[0] && unitNumber <= units[1]);
}

export function getThemeUnits(theme: MentorshipTheme): MentorshipWeek[] {
  return mentorshipWeeks.filter((week) => week.number >= theme.units[0] && week.number <= theme.units[1]);
}

export function getThemeProgress(theme: MentorshipTheme, approvedAssignmentKeys: ReadonlySet<string>) {
  const units = getThemeUnits(theme);
  const approved = units.filter((unit) => approvedAssignmentKeys.has(unit.assignment.key)).length;
  return { approved, total: units.length, complete: approved === units.length, percent: Math.round((approved / units.length) * 100) };
}

export function getCurrentThemeUnit(theme: MentorshipTheme, currentUnitNumber: number) {
  return getThemeUnits(theme).find((unit) => unit.number === currentUnitNumber) ?? getThemeUnits(theme)[0];
}
