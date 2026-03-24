// ==============================
// Types
// ==============================

export type PDCAStep = "registro" | "plan" | "do" | "check" | "act" | "relatorio";
export type Severity = "critico" | "alto" | "medio" | "baixo";
export type Environment = "dev" | "staging" | "prod";
export type HypothesisStatus = "pendente" | "confirmada" | "descartada";
export type PreventiveActionType = "processo" | "codigo" | "teste" | "documentacao";

export interface BugRegistro {
  titulo: string;
  descricao: string;
  comportamentoEsperado: string;
  ambiente: Environment;
  severidade: Severity;
  evidenciaUrl: string;
  criadoEm: string;
}

export interface ChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
}

export interface PlanData {
  hipoteses: string[];
  planoInvestigacao: ChecklistItem[];
  recursosNecessarios: string[];
  criteriosSucesso: string;
}

export interface HypothesisTest {
  hipoteseIndex: number;
  oQueFoiTestado: string;
  resultado: string;
  status: HypothesisStatus;
  timestamp: string;
}

export interface DoData {
  testes: HypothesisTest[];
  descobertasInesperadas: string;
}

export interface FiveWhyEntry {
  pergunta: string;
  resposta: string;
}

export interface CheckData {
  resumoHipoteses: string;
  cincoporques: FiveWhyEntry[];
  causaRaiz: string;
  evidencia: string;
}

export interface ActData {
  correcaoImediata: {
    descricao: string;
    responsavel: string;
    prazo: string;
  };
  acaoPreventiva: {
    descricao: string;
    tipo: PreventiveActionType;
  };
  licoesAprendidas: string;
  testeRegressao: boolean;
}

export interface PDCACycle {
  id: string;
  registro: BugRegistro;
  plan: PlanData;
  do: DoData;
  check: CheckData;
  act: ActData;
  status: "em_andamento" | "concluido";
  stepAtual: PDCAStep;
  templateId?: string;
  iniciadoEm: string;
  concluidoEm?: string;
}

export type BadgeId = "detetive" | "cinco-porques-master" | "documentador" | "velocista" | "perfeccionista";

export interface BadgeDefinition {
  id: BadgeId;
  titulo: string;
  descricao: string;
  criterio: (cycles: PDCACycle[]) => boolean;
}

export interface PDCATemplate {
  id: string;
  titulo: string;
  descricao: string;
  categoria: "performance" | "integracao" | "ui";
  cor: string;
  registro: Partial<BugRegistro>;
  hipoteses: string[];
}

// ==============================
// Config
// ==============================

export const stepOrder: PDCAStep[] = ["registro", "plan", "do", "check", "act", "relatorio"];

export const stepConfig: Record<PDCAStep, { label: string; descricao: string; cor: string }> = {
  registro:  { label: "Registro",    descricao: "Registrar o bug encontrado",                       cor: "text-blue-500" },
  plan:      { label: "Plan",        descricao: "Planejar a investigação com hipóteses",             cor: "text-amber-500" },
  do:        { label: "Do",          descricao: "Executar testes para cada hipótese",                cor: "text-orange-500" },
  check:     { label: "Check",       descricao: "Verificar resultados e encontrar causa raiz",       cor: "text-violet-500" },
  act:       { label: "Act",         descricao: "Definir correções e ações preventivas",             cor: "text-green-500" },
  relatorio: { label: "Relatório",   descricao: "Visualizar relatório final completo",               cor: "text-primary" },
};

export const severityConfig: Record<Severity, { label: string; cor: string }> = {
  critico: { label: "Crítico", cor: "bg-red-500" },
  alto:    { label: "Alto",    cor: "bg-amber-500" },
  medio:   { label: "Médio",   cor: "bg-blue-400" },
  baixo:   { label: "Baixo",   cor: "bg-gray-400" },
};

export const environmentConfig: Record<Environment, string> = {
  dev: "Desenvolvimento",
  staging: "Staging",
  prod: "Produção",
};

export const resourceTags = ["Logs", "Banco de Dados", "Código-fonte", "API", "DevTools", "Monitoramento", "Documentação", "Testes"];

export const preventiveTypes: Record<PreventiveActionType, string> = {
  processo: "Processo",
  codigo: "Código",
  teste: "Teste",
  documentacao: "Documentação",
};

// ==============================
// Templates
// ==============================

export const pdcaTemplates: PDCATemplate[] = [
  {
    id: "performance",
    titulo: "Bug de Performance",
    descricao: "Página ou funcionalidade lenta, alto tempo de resposta",
    categoria: "performance",
    cor: "text-red-500 bg-red-500/10",
    registro: {
      titulo: "Página de listagem de produtos carrega lentamente",
      descricao: "A página de produtos demora mais de 5 segundos para carregar quando há mais de 50 produtos. O spinner fica visível por tempo excessivo e a interface trava durante o carregamento.",
      comportamentoEsperado: "A página deveria carregar em menos de 2 segundos, mesmo com 100+ produtos, usando paginação ou lazy loading.",
      ambiente: "staging",
      severidade: "alto",
    },
    hipoteses: [
      "Query N+1 no backend carregando relações desnecessárias",
      "Falta de paginação no endpoint — retorna todos os registros",
      "Imagens dos produtos sem otimização (tamanho excessivo)",
      "Ausência de cache na camada de API",
    ],
  },
  {
    id: "integracao",
    titulo: "Bug de Integração API",
    descricao: "Endpoint retornando erro intermitente ou dados inconsistentes",
    categoria: "integracao",
    cor: "text-violet-500 bg-violet-500/10",
    registro: {
      titulo: "POST /api/orders retorna 500 intermitente",
      descricao: "Ao finalizar uma compra, o endpoint POST /api/orders retorna status 500 de forma intermitente. Aproximadamente 1 em cada 5 requests falha. O body da resposta contém 'Internal Server Error' sem detalhes.",
      comportamentoEsperado: "O endpoint deveria retornar 201 com o pedido criado, ou um erro descritivo (400/422) quando o payload é inválido.",
      ambiente: "dev",
      severidade: "critico",
    },
    hipoteses: [
      "Timeout na conexão com banco de dados sob carga",
      "Validação de payload falhando silenciosamente em edge cases",
      "Race condition na verificação de estoque",
      "Serviço externo de pagamento instável",
    ],
  },
  {
    id: "ui",
    titulo: "Bug de UI/UX",
    descricao: "Problema visual ou de interação na interface",
    categoria: "ui",
    cor: "text-sky-500 bg-sky-500/10",
    registro: {
      titulo: "Botão de checkout não responde ao clique",
      descricao: "O botão 'Finalizar Compra' no carrinho não responde ao clique em telas menores (< 768px). O cursor muda para pointer mas nada acontece. Em desktop funciona normalmente.",
      comportamentoEsperado: "O botão deveria abrir o modal de checkout em qualquer resolução de tela.",
      ambiente: "dev",
      severidade: "medio",
    },
    hipoteses: [
      "Elemento com z-index maior sobrepondo o botão em mobile",
      "Event handler não vinculado corretamente após re-render",
      "CSS media query escondendo ou desabilitando o botão",
    ],
  },
];

// ==============================
// Badges
// ==============================

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "detetive",
    titulo: "Detetive",
    descricao: "Complete 5 análises PDCA",
    criterio: (cycles) => cycles.filter(c => c.status === "concluido").length >= 5,
  },
  {
    id: "cinco-porques-master",
    titulo: "5 Porquês Master",
    descricao: "Chegue ao 5º nível dos porquês em 3 análises",
    criterio: (cycles) =>
      cycles.filter(c => c.status === "concluido" && c.check.cincoporques.length >= 5).length >= 3,
  },
  {
    id: "documentador",
    titulo: "Documentador",
    descricao: "Obtenha pontuação 100% em uma análise",
    criterio: (cycles) => cycles.some(c => c.status === "concluido" && calcularPontuacao(c) === 100),
  },
  {
    id: "velocista",
    titulo: "Velocista",
    descricao: "Complete uma análise em menos de 15 minutos",
    criterio: (cycles) =>
      cycles.some(c => {
        if (c.status !== "concluido" || !c.concluidoEm) return false;
        const diff = new Date(c.concluidoEm).getTime() - new Date(c.iniciadoEm).getTime();
        return diff < 15 * 60 * 1000;
      }),
  },
  {
    id: "perfeccionista",
    titulo: "Perfeccionista",
    descricao: "Pontuação acima de 90% em 3 análises",
    criterio: (cycles) =>
      cycles.filter(c => c.status === "concluido" && calcularPontuacao(c) >= 90).length >= 3,
  },
];

// ==============================
// Helpers
// ==============================

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function createEmptyCycle(templateId?: string): PDCACycle {
  const now = new Date().toISOString();
  const template = templateId ? pdcaTemplates.find(t => t.id === templateId) : undefined;

  const cycle: PDCACycle = {
    id: generateId(),
    registro: {
      titulo: "",
      descricao: "",
      comportamentoEsperado: "",
      ambiente: "dev",
      severidade: "medio",
      evidenciaUrl: "",
      criadoEm: now,
    },
    plan: {
      hipoteses: ["", "", ""],
      planoInvestigacao: [],
      recursosNecessarios: [],
      criteriosSucesso: "",
    },
    do: { testes: [], descobertasInesperadas: "" },
    check: { resumoHipoteses: "", cincoporques: [{ pergunta: "Por que o bug ocorreu?", resposta: "" }], causaRaiz: "", evidencia: "" },
    act: {
      correcaoImediata: { descricao: "", responsavel: "", prazo: "" },
      acaoPreventiva: { descricao: "", tipo: "codigo" },
      licoesAprendidas: "",
      testeRegressao: false,
    },
    status: "em_andamento",
    stepAtual: "registro",
    templateId,
    iniciadoEm: now,
  };

  if (template) {
    cycle.registro = { ...cycle.registro, ...template.registro, criadoEm: now };
    cycle.plan.hipoteses = [...template.hipoteses];
  }

  return cycle;
}

export function calcularPontuacao(cycle: PDCACycle): number {
  let score = 0;

  // Registro (20 pts)
  if (cycle.registro.titulo) score += 4;
  if (cycle.registro.descricao) score += 4;
  if (cycle.registro.comportamentoEsperado) score += 4;
  if (cycle.registro.ambiente) score += 2;
  if (cycle.registro.severidade) score += 2;
  if (cycle.registro.evidenciaUrl) score += 4;

  // Plan (20 pts)
  const validH = cycle.plan.hipoteses.filter(h => h.trim()).length;
  score += Math.min(validH, 5) * 2;
  if (cycle.plan.planoInvestigacao.length > 0) score += 4;
  if (cycle.plan.recursosNecessarios.length > 0) score += 3;
  if (cycle.plan.criteriosSucesso) score += 3;

  // Do (20 pts)
  const tested = cycle.do.testes.filter(t => t.status !== "pendente").length;
  score += Math.min(tested, 5) * 3;
  if (cycle.do.descobertasInesperadas) score += 5;

  // Check (20 pts)
  const whys = cycle.check.cincoporques.filter(w => w.resposta.trim()).length;
  score += Math.min(whys, 5) * 2;
  if (cycle.check.causaRaiz) score += 5;
  if (cycle.check.evidencia) score += 5;

  // Act (20 pts)
  if (cycle.act.correcaoImediata.descricao) score += 5;
  if (cycle.act.correcaoImediata.responsavel) score += 3;
  if (cycle.act.correcaoImediata.prazo) score += 2;
  if (cycle.act.acaoPreventiva.descricao) score += 4;
  if (cycle.act.acaoPreventiva.tipo) score += 2;
  if (cycle.act.licoesAprendidas) score += 3;
  if (cycle.act.testeRegressao) score += 1;

  return Math.min(score, 100);
}

export function calcularMetricas(cycle: PDCACycle) {
  const inicio = new Date(cycle.iniciadoEm).getTime();
  const fim = cycle.concluidoEm ? new Date(cycle.concluidoEm).getTime() : Date.now();
  const tempoMs = fim - inicio;
  const minutos = Math.round(tempoMs / 60000);
  const hipotesesTestadas = cycle.do.testes.filter(t => t.status !== "pendente").length;
  const confirmadas = cycle.do.testes.filter(t => t.status === "confirmada").length;
  const descartadas = cycle.do.testes.filter(t => t.status === "descartada").length;
  const profundidadePorques = cycle.check.cincoporques.filter(w => w.resposta.trim()).length;

  return { tempoMs, minutos, hipotesesTestadas, confirmadas, descartadas, profundidadePorques, pontuacao: calcularPontuacao(cycle) };
}

export function gerarResumoHipoteses(plan: PlanData, doData: DoData): string {
  const hipoteses = plan.hipoteses.filter(h => h.trim());
  const lines: string[] = [];

  hipoteses.forEach((h, i) => {
    const teste = doData.testes.find(t => t.hipoteseIndex === i);
    if (teste) {
      const status = teste.status === "confirmada" ? "CONFIRMADA" : teste.status === "descartada" ? "DESCARTADA" : "PENDENTE";
      lines.push(`${i + 1}. ${h} → ${status}`);
    } else {
      lines.push(`${i + 1}. ${h} → NÃO TESTADA`);
    }
  });

  return lines.join("\n");
}

export function exportarMarkdown(cycle: PDCACycle): string {
  const m = calcularMetricas(cycle);
  const sev = severityConfig[cycle.registro.severidade].label;
  const env = environmentConfig[cycle.registro.ambiente];

  return `# Relatório PDCA: ${cycle.registro.titulo}

**Severidade**: ${sev} | **Ambiente**: ${env} | **Pontuação**: ${m.pontuacao}/100
**Tempo de análise**: ${m.minutos} min | **Hipóteses testadas**: ${m.hipotesesTestadas} | **Profundidade 5 Porquês**: ${m.profundidadePorques}

---

## 1. Registro do Bug

**Descrição**: ${cycle.registro.descricao}

**Comportamento Esperado**: ${cycle.registro.comportamentoEsperado}

${cycle.registro.evidenciaUrl ? `**Evidência**: ${cycle.registro.evidenciaUrl}` : ""}

## 2. PLAN — Planejamento

### Hipóteses
${cycle.plan.hipoteses.filter(h => h.trim()).map((h, i) => `${i + 1}. ${h}`).join("\n")}

### Plano de Investigação
${cycle.plan.planoInvestigacao.map(p => `- [${p.concluido ? "x" : " "}] ${p.texto}`).join("\n") || "Nenhum passo registrado."}

### Recursos Necessários
${cycle.plan.recursosNecessarios.join(", ") || "Nenhum."}

### Critério de Sucesso
${cycle.plan.criteriosSucesso || "Não definido."}

## 3. DO — Execução

${cycle.do.testes.map(t => {
  const hipLabel = cycle.plan.hipoteses[t.hipoteseIndex] || `Hipótese ${t.hipoteseIndex + 1}`;
  const statusLabel = t.status === "confirmada" ? "CONFIRMADA" : t.status === "descartada" ? "DESCARTADA" : "PENDENTE";
  return `### Hipótese: ${hipLabel}
- **Status**: ${statusLabel}
- **O que foi testado**: ${t.oQueFoiTestado}
- **Resultado**: ${t.resultado}`;
}).join("\n\n") || "Nenhum teste executado."}

${cycle.do.descobertasInesperadas ? `### Descobertas Inesperadas\n${cycle.do.descobertasInesperadas}` : ""}

## 4. CHECK — Verificação

### Análise 5 Porquês
${cycle.check.cincoporques.filter(w => w.resposta.trim()).map((w, i) => `**Porquê ${i + 1}**: ${w.pergunta}\n**Resposta**: ${w.resposta}`).join("\n\n")}

### Causa Raiz
${cycle.check.causaRaiz || "Não identificada."}

${cycle.check.evidencia ? `### Evidências\n${cycle.check.evidencia}` : ""}

## 5. ACT — Ação

### Correção Imediata
${cycle.act.correcaoImediata.descricao || "Não definida."}
${cycle.act.correcaoImediata.responsavel ? `- **Responsável**: ${cycle.act.correcaoImediata.responsavel}` : ""}
${cycle.act.correcaoImediata.prazo ? `- **Prazo**: ${cycle.act.correcaoImediata.prazo}` : ""}

### Ação Preventiva
${cycle.act.acaoPreventiva.descricao || "Não definida."} (${preventiveTypes[cycle.act.acaoPreventiva.tipo]})

### Lições Aprendidas
${cycle.act.licoesAprendidas || "Nenhuma registrada."}

**Teste de regressão**: ${cycle.act.testeRegressao ? "Sim" : "Não"}

---
*Gerado pelo QA Lab Playground — Análise PDCA*
`;
}

export function verificarBadges(cycles: PDCACycle[]): BadgeId[] {
  return badgeDefinitions.filter(b => b.criterio(cycles)).map(b => b.id);
}

// ==============================
// Learning tooltips
// ==============================

export const learningTips: Record<string, string> = {
  "registro.titulo": "Dê um título claro e conciso que descreva o bug em uma frase.",
  "registro.descricao": "Descreva exatamente o que aconteceu, incluindo passos para reproduzir.",
  "registro.esperado": "O que deveria ter acontecido se o sistema funcionasse corretamente?",
  "registro.ambiente": "Em qual ambiente o bug foi encontrado? Isso ajuda a priorizar.",
  "registro.severidade": "Qual o impacto no usuário? Crítico = sistema inutilizável.",
  "registro.evidencia": "Screenshots, vídeos ou links ajudam a comunicar o problema.",
  "plan.hipoteses": "Liste pelo menos 3 possíveis causas. Pensar em múltiplas hipóteses evita viés de confirmação.",
  "plan.investigacao": "Crie um plano passo a passo do que investigar. Isso organiza seu trabalho.",
  "plan.recursos": "Que ferramentas e acessos você vai precisar para investigar?",
  "plan.criterio": "Como você vai saber que encontrou a causa certa? Defina antes de investigar.",
  "do.teste": "Descreva o que você fez para testar esta hipótese.",
  "do.resultado": "O que você descobriu? Inclua dados concretos.",
  "do.descobertas": "Bugs inesperados encontrados durante a investigação são valiosos!",
  "check.porques": "A técnica dos 5 Porquês ajuda a ir além do sintoma e encontrar a causa raiz real.",
  "check.causa": "A causa raiz é o motivo fundamental. Se corrigida, o bug não deveria voltar.",
  "check.evidencia": "Que provas você tem de que esta é realmente a causa?",
  "act.correcao": "Qual a correção imediata para resolver o bug agora?",
  "act.preventiva": "O que fazer para evitar que bugs similares aconteçam no futuro?",
  "act.licoes": "O que você aprendeu? Compartilhar conhecimento previne erros futuros.",
};
