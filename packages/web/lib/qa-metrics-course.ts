export type QaMetricsModule = {
  id: string;
  week: number;
  duration: string;
  title: string;
  objective: string;
  concepts: string[];
  practice: string;
  deliverable: string;
  checklist: string[];
  example: string;
};

export const qaMetricsModules: QaMetricsModule[] = [
  {
    id: "decisions-not-dashboards",
    week: 1,
    duration: "45 min",
    title: "Comece pela decisão, não pelo gráfico",
    objective: "Escolher sinais de qualidade que ajudem uma equipe a decidir o que melhorar, em vez de medir atividade por medir.",
    concepts: ["pergunta de negócio", "indicador", "KPI", "leading/lagging", "contramétrica"],
    practice: "Receba o pedido fictício “quero saber se QA está performando”. Transforme-o em três decisões observáveis sobre risco, feedback e experiência de quem usa o produto.",
    deliverable: "Árvore de decisão com pergunta, ação possível e um sinal que ajude a avaliar o efeito.",
    checklist: ["Cada métrica se conecta a uma decisão real.", "Indicador não é tratado como objetivo isolado.", "Há um sinal de equilíbrio para evitar otimizar um lado e piorar outro."],
    example: `Pergunta: o feedback de regressão chega cedo o bastante?\nSinal: p95 do tempo entre commit e resultado do smoke.\nAção possível: remover fila ou reduzir duração.\nContramétrica: incidentes escapados não aumentaram.`,
  },
  {
    id: "metric-contract",
    week: 1,
    duration: "60 min",
    title: "Defina o contrato de cada métrica",
    objective: "Documentar significado, cálculo, unidade, janela, população, fonte e responsável antes de comparar números.",
    concepts: ["numerador", "denominador", "coorte", "janela", "fonte", "proprietário"],
    practice: "Escreva a definição operacional de “defeito escapado”. Delimite releases incluídos, período após publicação, severidades, dados faltantes e sistema de origem.",
    deliverable: "Ficha de métrica reproduzível por outra pessoa, com suposições e exclusões explícitas.",
    checklist: ["Numerador e denominador usam a mesma coorte.", "Janela e unidade estão definidas.", "Fonte, responsável e limitações estão registrados."],
    example: `Métrica: defeitos confirmados escapados por release\nNumerador: defeitos confirmados em produção e atribuídos à release.\nDenominador: defeitos confirmados antes da release + escapados, na mesma coorte.\nJanela: primeiros 14 dias após cada release.\nLimite: depende da qualidade da classificação e do reporte.`,
  },
  {
    id: "customer-quality",
    week: 2,
    duration: "60 min",
    title: "Meça qualidade percebida por quem usa",
    objective: "Combinar incidentes, reclamações, tarefas concluídas e sinais de experiência sem confundir ausência de relatos com ausência de problemas.",
    concepts: ["defeito escapado", "severidade", "exposição", "feedback", "jornada crítica"],
    practice: "Compare releases fictícias com volumes diferentes de sessões e incidentes. Segmente impacto por jornada e severidade, e anote o que os dados não observam.",
    deliverable: "Resumo por coorte que combina pelo menos um resultado para usuário e o contexto de exposição.",
    checklist: ["Contagens são acompanhadas por exposição ou janela comparável.", "Severidade e alcance não são somados como se fossem iguais.", "Dados ausentes não viram evidência de qualidade."],
    example: `Release A: 4 defeitos confirmados em 100 mil sessões.\nRelease B: 5 defeitos em 1 milhão de sessões.\nA contagem isolada aumentou; a taxa por sessão caiu. Investigue gravidade, jornadas afetadas e consistência do reporte antes de concluir.`,
  },
  {
    id: "risk-coverage",
    week: 2,
    duration: "75 min",
    title: "Mostre risco coberto e risco desconhecido",
    objective: "Descrever cobertura a partir de jornadas e riscos, sem usar quantidade de testes ou cobertura de linhas como prova suficiente de qualidade.",
    concepts: ["risco", "criticidade", "cobertura de jornada", "lacuna", "código vs comportamento"],
    practice: "Mapeie login, pagamento e recuperação de pedido a riscos, evidências de teste e lacunas. Priorize por impacto e probabilidade acordados pelo time.",
    deliverable: "Mapa de risco com área coberta, última evidência, lacuna e próxima ação.",
    checklist: ["Cobertura está vinculada a comportamento ou risco.", "Lacunas estão visíveis, não escondidas por médias.", "Cobertura de código não substitui evidência de comportamento."],
    example: `Pagamento — alto impacto\nCoberto: autorização recusada e confirmação de pedido duplicado\nEvidência: API + jornada browser em staging\nLacuna: timeout do provedor\nAção: simular timeout com contrato controlado`,
  },
  {
    id: "defect-flow",
    week: 3,
    duration: "60 min",
    title: "Leia o fluxo de defeitos sem ranking",
    objective: "Usar tempo de triagem, idade, reabertura e defeitos escapados para encontrar gargalos de processo, sem avaliar pessoas por contagem.",
    concepts: ["tempo de triagem", "idade", "reabertura", "coorte", "viés de classificação"],
    practice: "Analise uma amostra fictícia de tickets. Compare mediana e p85 de idade por severidade, e investigue reaberturas com contexto de requisitos e reteste.",
    deliverable: "Hipótese de gargalo de fluxo e pergunta de investigação que não atribua culpa individual.",
    checklist: ["Distribuição e severidade acompanham o agregado.", "A contagem de bugs não mede produtividade individual.", "Status e transições têm definições consistentes."],
    example: `Mediana até triagem: 1 dia · p85: 5 dias\nO p85 alto sugere uma cauda de itens parados. Segmente por dependência, severidade e fila; não conclua que uma pessoa é lenta.`,
  },
  {
    id: "test-suite-health",
    week: 3,
    duration: "75 min",
    title: "Separe falha de produto de falha de teste",
    objective: "Classificar resultados de execução para distinguir defeito no produto, teste, ambiente, dado e instabilidade.",
    concepts: ["primeira execução", "retry", "flake", "causa da falha", "taxonomia"],
    practice: "Classifique execuções fictícias de CI. Calcule sucesso na primeira tentativa e recuperações por retry separadamente; revise casos sem causa conhecida.",
    deliverable: "Taxonomia de falhas e uma série que não esconda instabilidade atrás de retries.",
    checklist: ["Retries não transformam falha inicial em sucesso silencioso.", "Causa desconhecida continua visível.", "A taxa inclui sua população e filtros de cancelamento."],
    example: `100 execuções:\n88 passaram na primeira tentativa.\n7 falharam e passaram após retry.\n5 falharam sem recuperação.\n\nSinal de estabilidade inicial: 88/100.\nRecuperação por retry: 7/100 — investigar em separado.`,
  },
  {
    id: "feedback-time",
    week: 4,
    duration: "60 min",
    title: "Meça tempo e confiabilidade do feedback",
    objective: "Avaliar duração de suíte, fila e disponibilidade do resultado por percentis e pelo impacto na decisão do time.",
    concepts: ["tempo até feedback", "p50/p95", "fila", "disponibilidade", "segmentação"],
    practice: "Compare duração p50/p95 do smoke e da regressão, separando tempo de fila, execução e publicação de resultado. Relacione o tempo a uma decisão bloqueada.",
    deliverable: "Linha de base do ciclo de feedback com gargalo e experimento proposto.",
    checklist: ["Tempo de fila e de execução não são misturados.", "Percentis revelam caudas que a média esconde.", "A métrica corresponde ao fluxo que alguém espera."],
    example: `Commit → primeiro sinal do smoke\np50: 6 min · p95: 24 min\nFila: p50 1 min / p95 15 min\nHipótese: concorrência no runner explica a cauda; validar por executor antes de otimizar testes.`,
  },
  {
    id: "automation-value",
    week: 4,
    duration: "60 min",
    title: "Avalie valor da automação, não percentual",
    objective: "Conectar automação à redução de risco e custo de feedback, considerando manutenção e falsos alarmes.",
    concepts: ["risco automatizado", "custo de manutenção", "sinal falso", "frequência", "retorno"],
    practice: "Priorize três casos para automatizar cruzando risco, repetição, duração manual, estabilidade do alvo e custo de manutenção.",
    deliverable: "Backlog de automação com motivo, benefício esperado e contramétrica por caso.",
    checklist: ["Percentual automatizado não é tratado como qualidade do produto.", "Manutenção e ruído entram no custo.", "Automatizar não significa mover todo teste para UI."],
    example: `Fluxo: renovação de assinatura\nRisco: alto · repetição: cada release · feedback manual: 20 min\nCandidato: teste de API no contrato; um smoke UI cobre a jornada crítica.\nContramétrica: falsos alarmes e tempo de manutenção por release.`,
  },
  {
    id: "delivery-performance",
    week: 5,
    duration: "75 min",
    title: "Conecte QA ao desempenho de entrega",
    objective: "Interpretar as cinco métricas DORA no nível de aplicação e relacionar qualidade a throughput e instabilidade sem reivindicar causalidade isolada.",
    concepts: ["change lead time", "deployment frequency", "recovery", "change fail rate", "rework"],
    practice: "Leia o scorecard fictício de uma aplicação. Procure relação entre falhas de mudança, retrabalho e tempo de entrega, anotando fatores que também mudaram.",
    deliverable: "Perguntas que conectem sinais de teste a estabilidade e fluxo de entrega.",
    checklist: ["A leitura segue o modelo atual de cinco métricas.", "Comparações ficam no contexto de uma aplicação semelhante.", "Correlação não é apresentada como causalidade nem KPI exclusivo de QA."],
    example: `Throughput: frequência de deploy + change lead time + failed deployment recovery time.\nInstabilidade: change fail rate + deployment rework rate.\nUse a série para escolher uma investigação conjunta, não para ranquear QAs.`,
  },
  {
    id: "reliability-slos",
    week: 6,
    duration: "75 min",
    title: "Use SLI, SLO e error budget com produto",
    objective: "Definir um indicador de confiabilidade centrado numa jornada e transformar o objetivo acordado em decisões de risco.",
    concepts: ["SLI", "SLO", "error budget", "janela", "jornada crítica"],
    practice: "Escolha uma jornada transacional fictícia. Defina sucesso percebido, janela, origem dos eventos e resposta do time quando o orçamento se aproxima do limite.",
    deliverable: "Proposta de SLI/SLO com limites explícitos e política de ação revisável.",
    checklist: ["O indicador reflete o que a pessoa considera sucesso.", "Numerador, denominador e janela estão explícitos.", "A política é acordo do time, não número universal."],
    example: `SLI: pedidos elegíveis confirmados em até 3 s / pedidos elegíveis.\nSLO proposto: definir com produto após medir baseline e impacto.\nError budget: parcela de falhas tolerada na mesma janela.\nNão copie metas de outro serviço sem contexto.`,
  },
  {
    id: "dashboard-governance",
    week: 7,
    duration: "60 min",
    title: "Desenhe um painel que convide investigação",
    objective: "Organizar sinais com tendência, coorte, definição acessível e contexto, incluindo privacidade e limites de uso.",
    concepts: ["baseline", "segmentação", "definição", "privacidade", "gaming"],
    practice: "Revise um painel fictício cheio de contagens. Remova cartões sem decisão, adicione links para definições e destaque mudanças que pedem investigação.",
    deliverable: "Wireframe com até cinco sinais, baseline, owner, janela e perguntas de leitura.",
    checklist: ["Métricas estão no nível do sistema ou equipe, não em ranking individual.", "Dados sensíveis são minimizados e acessados por necessidade.", "Mudança de definição ou instrumentação fica anotada."],
    example: `Sinal: falha de CI na primeira tentativa\nTendência: 8 semanas · segmentação: suite e tipo de falha\nDefinição: link para numerador, exclusões e fonte\nPergunta: a mudança coincide com teste, ambiente ou produto?`,
  },
  {
    id: "capstone-scorecard",
    week: 8,
    duration: "2 h",
    title: "Projeto final: monte um scorecard de QA",
    objective: "Entregar um sistema enxuto de métricas para uma decisão de qualidade, com baseline, definições, limites e plano de revisão.",
    concepts: ["scorecard", "baseline", "triangulação", "ação", "revisão"],
    practice: "Escolha um produto fictício. Monte um scorecard com sinais de resultado, risco e fluxo; defina como coletar dados e qual experimento cada alerta desencadeia.",
    deliverable: "Scorecard documentado, dicionário de métricas e uma ação de melhoria com contramétrica.",
    checklist: ["Cada sinal tem contrato e fonte verificável.", "O scorecard combina resultados e sinais de processo.", "Metas partem de baseline e decisão compartilhada.", "Não mede performance individual nem promete causalidade."],
    example: `Escolha até 5 sinais:\n• resultado para usuário / confiabilidade\n• cobertura de risco crítico\n• estabilidade de testes na primeira execução\n• p95 até feedback acionável\n• mudança ou contramétrica\n\nPara cada um: decisão, definição, baseline, responsável e limite.`,
  },
];

export const qaMetricsOutcomes = [
  "Definir KPIs com numerador, denominador, coorte, janela e fonte.",
  "Medir qualidade percebida, risco coberto e defeitos escapados com contexto.",
  "Diagnosticar estabilidade de testes e tempo até feedback acionável.",
  "Ler DORA e SLOs como sinais de equipe e serviço, não como ranking de QA.",
  "Criar um scorecard que leva a investigação e melhoria contínua.",
];

export const qaMetricsFinalProject = {
  title: "Projeto final: scorecard de qualidade acionável",
  description: "Um conjunto pequeno de métricas para uma decisão real, com definições reproduzíveis, baseline e ações que podem ser revisadas em equipe.",
  deliverables: [
    "Pergunta de negócio e decisão que o scorecard deve apoiar.",
    "Até cinco métricas com cálculo, unidade, coorte, janela, fonte e responsável.",
    "Baseline e segmentações justificadas por risco.",
    "Sinais de resultado, processo e confiabilidade sem duplicar a mesma informação.",
    "Uma hipótese de melhoria com contramétrica e forma de revisão.",
    "Limitações, dados ausentes, privacidade e riscos de uso punitivo documentados.",
  ],
  rubric: [
    { criterion: "Definição e qualidade dos dados", weight: "25%" },
    { criterion: "Relação com decisão e risco", weight: "25%" },
    { criterion: "Interpretação e contexto", weight: "20%" },
    { criterion: "Plano de melhoria e contramétrica", weight: "20%" },
    { criterion: "Governança e comunicação", weight: "10%" },
  ],
};

export const qaMetricsResources = [
  { label: "DORA · métricas de desempenho de entrega", href: "https://dora.dev/guides/dora-metrics/" },
  { label: "DORA · histórico do modelo de cinco métricas", href: "https://dora.dev/insights/dora-metrics-history/" },
  { label: "Google SRE · definir SLOs", href: "https://sre.google/workbook/implementing-slos/" },
  { label: "Google SRE · política de error budget", href: "https://sre.google/workbook/error-budget-policy/" },
  { label: "Microsoft Research · framework SPACE", href: "https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/" },
];

export function findQaMetricsModule(id: string) {
  return qaMetricsModules.find((module) => module.id === id);
}
