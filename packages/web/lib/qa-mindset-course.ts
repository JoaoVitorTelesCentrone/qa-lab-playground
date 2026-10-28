export type QAMindsetModule = {
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

export const qaMindsetModules: QAMindsetModule[] = [
  {
    id: "quality-is-shared", week: 1, duration: "45 min",
    title: "Qualidade é resultado do sistema inteiro",
    objective: "Entender QA como prática que ajuda o time a prevenir e descobrir problemas, não como uma pessoa que recebe o produto no fim.",
    concepts: ["quality assurance", "testing", "qualidade compartilhada"],
    practice: "Um erro chega à produção e alguém diz: ‘O QA deixou passar’. Reconstrua o fluxo para mapear decisões, sinais e condições do sistema que contribuíram para o resultado.",
    deliverable: "Mapa de contribuições para qualidade antes, durante e depois da entrega.",
    checklist: ["Separou a atividade de testar da responsabilidade mais ampla por qualidade.", "Investigou condições do sistema, não culpados.", "Identificou uma prevenção viável para o time."],
    example: `Em vez de: “O QA precisa testar tudo.”\nPergunte: “Que informação ou controle teria ajudado o time a evitar ou detectar esse risco mais cedo?”`,
  },
  {
    id: "curiosity-not-cynicism", week: 1, duration: "45 min",
    title: "Troque desconfiança por curiosidade disciplinada",
    objective: "Questionar comportamentos e suposições sem tratar pessoas, requisitos ou sistemas como culpados de antemão.",
    concepts: ["curiosidade", "ceticismo profissional", "hipótese", "pergunta aberta"],
    practice: "Investigue um campo de endereço que ‘sempre funcionou’. Faça perguntas sobre formatos, limites e contexto; registre hipóteses antes de testar.",
    deliverable: "Três perguntas e uma hipótese que possa ser confirmada ou refutada.",
    checklist: ["A pergunta busca aprender, não provar que alguém errou.", "Hipótese está identificada como hipótese.", "Resultado pode mudar sua opinião."],
    example: `“Estou assumindo que aceitamos CEP internacional. O produto pretende atender esse caso? Posso testar um exemplo e confirmar a regra com Produto?”`,
  },
  {
    id: "user-context", week: 2, duration: "55 min",
    title: "Veja a funcionalidade pelo contexto de uso",
    objective: "Considerar objetivos, ambiente, acessibilidade e consequências para diferentes pessoas, não só se o fluxo passa no caminho feliz.",
    concepts: ["empatia", "contexto", "acessibilidade", "impacto"],
    practice: "Avalie uma tela de login em celular lento, navegação por teclado e recuperação de conta. Escolha situações com impacto real para o produto.",
    deliverable: "Mapa curto de contexto, barreiras e perguntas para o time.",
    checklist: ["Não presumiu um único perfil ou dispositivo.", "Conectou cenário a uma necessidade real.", "Distinguiu risco observado de risco hipotético."],
    example: `Quem está tentando entrar? Em que dispositivo e conexão? O que impede a pessoa de continuar? Como ela percebe e recupera um erro?`,
  },
  {
    id: "systems-thinking", week: 2, duration: "60 min",
    title: "Pense em fluxo e relações, não só em telas",
    objective: "Examinar dependências, estados, integrações e efeitos indiretos para compreender como uma falha pode surgir e se propagar.",
    concepts: ["pensamento sistêmico", "dependências", "estados", "efeito cascata"],
    practice: "Trace um pedido entre checkout, pagamento, estoque e notificação. Identifique estados que podem divergir e sinais para perceber cada divergência.",
    deliverable: "Diagrama simples de fluxo com duas falhas plausíveis e seus efeitos.",
    checklist: ["Incluiu fronteiras entre componentes ou times.", "Observou estado e sequência, não apenas aparência.", "Explicou impacto a partir do fluxo."],
    example: `Pedido criado → pagamento autorizado → estoque reservado → confirmação enviada\nPergunta: o que vê a pessoa se o estoque falhar depois da autorização?`,
  },
  {
    id: "risk-guides-attention", week: 3, duration: "60 min",
    title: "Use risco para escolher onde olhar primeiro",
    objective: "Priorizar investigação conforme impacto, probabilidade, exposição e incerteza, reconhecendo que tempo e cobertura são limitados.",
    concepts: ["risco de produto", "impacto", "probabilidade", "priorização"],
    practice: "Há uma hora para testar cupom, cadastro e cobrança. Compare consequências de falha, frequência de uso, mudanças recentes e sinais disponíveis.",
    deliverable: "Ordem de investigação com justificativa e riscos residuais explícitos.",
    checklist: ["Prioridade tem motivo verificável.", "Não tratou uma pontuação como verdade objetiva.", "Registrou o que ficou sem testar."],
    example: `Cobrança duplicada: impacto alto, exposição moderada → investigar primeiro\nTexto truncado em ajuda: impacto baixo → registrar e negociar prioridade`,
  },
  {
    id: "exploration-as-learning", week: 3, duration: "60 min",
    title: "Explore para aprender, não para clicar sem rumo",
    objective: "Conduzir uma sessão exploratória com objetivo, observações, perguntas e revisão contínua do próximo teste.",
    concepts: ["teste exploratório", "charter", "observação", "adaptação"],
    practice: "Explore o fluxo de redefinição de senha por 30 minutos. Siga uma missão, anote o que percebe e ajuste o próximo passo conforme o sistema responder.",
    deliverable: "Charter, notas da sessão, evidência e perguntas ainda abertas.",
    checklist: ["Missão delimita o foco, sem antecipar todos os passos.", "Observações permitem retomar a sessão.", "Achados e perguntas estão separados."],
    example: `Missão: explorar limites e recuperação do link de senha\nObserve: estados, mensagens, expiração, reenvio\nAdapte: se o link antigo continuar ativo, investigar impacto e sequência`,
  },
  {
    id: "evidence-and-uncertainty", week: 4, duration: "55 min",
    title: "Separe evidência, interpretação e incerteza",
    objective: "Explicar o que foi observado, em quais condições e o que ainda não é possível concluir.",
    concepts: ["evidência", "reprodutibilidade", "incerteza", "limites do teste"],
    practice: "Um erro aconteceu uma vez em rede instável. Registre condições, procure repetição segura e comunique o que a evidência permite afirmar.",
    deliverable: "Relato proporcional à evidência, com próximos passos para reduzir a incerteza.",
    checklist: ["Fato não foi misturado com hipótese.", "Condições e limites são legíveis.", "Não afirmou ausência de defeitos porque os testes passaram."],
    example: `Observado: uma falha após 18 s em rede simulada lenta\nAinda não sabemos: frequência em rede normal\nPróximo passo: repetir 5 vezes com a mesma condição e comparar o log`,
  },
  {
    id: "challenge-assumptions", week: 4, duration: "50 min",
    title: "Reconheça vieses e desafie suas próprias hipóteses",
    objective: "Reduzir viés de confirmação e ancoragem buscando evidência que poderia contrariar a primeira explicação.",
    concepts: ["viés de confirmação", "oráculo de teste", "explicações alternativas"],
    practice: "Você suspeita que uma falha vem do cache. Liste pelo menos duas explicações alternativas e um teste que diferencie cada uma.",
    deliverable: "Plano breve para testar a hipótese sem selecionar somente evidência favorável.",
    checklist: ["Criou explicações alternativas plausíveis.", "Escolheu uma observação que diferencia hipóteses.", "Está disposto a atualizar sua conclusão."],
    example: `Hipótese A: cache antigo\nAlternativa B: dado de origem desatualizado\nAlternativa C: ordenação instável\nTeste: comparar origem, resposta da API e resultado após novo registro`,
  },
  {
    id: "investigate-without-blame", week: 5, duration: "55 min",
    title: "Investigue falhas sem procurar culpados",
    objective: "Descrever comportamento e impacto com precisão, colaborando com Desenvolvimento para entender causa e prevenir recorrência.",
    concepts: ["bug report", "causa raiz", "colaboração", "segurança psicológica"],
    practice: "Uma validação incorreta foi implementada depois de um refinamento ambíguo. Prepare uma conversa que reconstrua o contexto e convide o time a melhorar a regra e o processo.",
    deliverable: "Handoff factual e uma pergunta de prevenção compartilhada.",
    checklist: ["Relatou comportamento sem rotular autoria.", "Distinguiu causa provável de causa confirmada.", "A prevenção está no processo/sistema, não só em ‘ter mais atenção’."],
    example: `“Com valor zero, a compra aparece como concluída. A regra ficou ambígua no refinamento. Vamos alinhar o comportamento e acrescentar um exemplo ao critério?”`,
  },
  {
    id: "quality-tradeoffs", week: 5, duration: "55 min",
    title: "Comunique trade-offs sem prometer certeza",
    objective: "Ajudar o time a decidir com contexto, evidência e risco residual, sem assumir sozinho o papel de autorizar release.",
    concepts: ["trade-off", "risco residual", "decisão informada", "transparência"],
    practice: "O prazo não permite concluir todos os testes. Organize o que foi validado, o que falta, impacto potencial e opções de mitigação para as pessoas responsáveis decidirem.",
    deliverable: "Resumo de qualidade curto com sinal, limite, risco e opção recomendada.",
    checklist: ["Evidência cobre o que está sendo afirmado.", "Risco restante está visível.", "Responsabilidade de decisão está clara e compartilhada."],
    example: `Validado: compra normal e cancelamento\nNão validado: reembolso após falha do provedor\nRisco: recuperação pode exigir suporte manual\nOpção: liberar gradualmente com monitoramento e plano de reversão`,
  },
  {
    id: "automation-with-judgment", week: 6, duration: "55 min",
    title: "Use automação sem terceirizar o pensamento",
    objective: "Escolher verificações automatizadas pelo valor e estabilidade, mantendo investigação humana onde contexto e julgamento importam.",
    concepts: ["automação", "feedback", "manutenção", "cobertura por risco"],
    practice: "Avalie quatro verificações: regra de cálculo estável, texto promocional, fluxo crítico de checkout e experimento visual. Escolha camada e justificativa.",
    deliverable: "Decisão de automação com valor, custo de manutenção e lacunas declaradas.",
    checklist: ["Automatizou uma regra repetível com resultado observável.", "Não automatizou somente para aumentar contagem.", "Considerou manutenção e feedback produzido."],
    example: `Automatize regressão de cálculo; explore legibilidade e interpretação do texto com pessoas; monitore checkout real em produção controlada.`,
  },
  {
    id: "learn-and-improve", week: 7, duration: "50 min",
    title: "Transforme falhas e acertos em aprendizado",
    objective: "Revisar o que o sistema ensinou, melhorar uma prática e acompanhar se a mudança realmente reduz risco ou retrabalho.",
    concepts: ["aprendizado contínuo", "retrospectiva", "experimento", "métricas com contexto"],
    practice: "Um defeito escapou apesar de muitos casos de teste. Procure causas possíveis — regra ausente, ambiente, dado, comunicação — e proponha um experimento pequeno.",
    deliverable: "Uma melhoria testável, responsável, prazo de revisão e sinal de sucesso.",
    checklist: ["Não concluiu que ‘mais testes’ é sempre a resposta.", "A mudança pode ser experimentada em pequeno escopo.", "O indicador mede aprendizado/resultado, não culpa individual."],
    example: `Hipótese: exemplos de estado expirado no refinamento evitam ambiguidades\nExperimento: aplicar em 3 histórias\nRevisar: quantas dúvidas críticas surgiram depois do início?`,
  },
  {
    id: "final-case", week: 8, duration: "90 min",
    title: "Caso final: investigue antes de concluir",
    objective: "Aplicar mentalidade de QA a um caso ambíguo do primeiro sinal até a comunicação de risco e o aprendizado do time.",
    concepts: ["contexto", "hipóteses", "evidência", "decisão", "melhoria"],
    practice: "Investigue um checkout fictício com falhas intermitentes. Faça perguntas, mapeie o fluxo, priorize riscos, busque evidência e compartilhe limites e opções sem culpar ninguém.",
    deliverable: "Caderno de investigação, recomendação contextualizada e experimento preventivo.",
    checklist: ["A investigação partiu de contexto e impacto.", "Hipóteses foram comparadas com evidência.", "A recomendação comunica limites e risco residual."],
    example: `Contexto → pergunta → hipótese → experimento → evidência → decisão informada → aprendizado do sistema`,
  },
];

export const qaMindsetOutcomes = [
  "Investigar com curiosidade sem confundir ceticismo com cinismo.",
  "Priorizar pelo risco e pelo contexto real de uso.",
  "Explicar evidência, limites e incerteza com clareza.",
  "Colaborar para prevenir problemas e aprender com o sistema.",
];

export const qaMindsetResources = [
  { label: "ISTQB CTFL v4.0.1 — fundamentos e princípios", href: "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/" },
  { label: "Manifesto Ágil — valores", href: "https://agilemanifesto.org/iso/ptbr/manifesto.html" },
  { label: "Princípios por trás do Manifesto Ágil", href: "https://agilemanifesto.org/principles.html" },
];

export const qaMindsetFinalProject = {
  title: "Investigar com clareza, decidir com contexto",
  description: "Em um caso de falha ambígua, mostre como suas perguntas e evidências conduziram a uma decisão compartilhada — incluindo o que ainda não se sabe.",
  deliverables: ["Contexto e impacto percebido", "Hipóteses e experimentos para diferenciá-las", "Evidências com limites declarados", "Risco residual e opções para o time", "Melhoria preventiva para revisar depois"],
  rubric: [
    { criterion: "Curiosidade e qualidade das perguntas", weight: "20%" },
    { criterion: "Priorização coerente com risco", weight: "20%" },
    { criterion: "Evidência e transparência", weight: "25%" },
    { criterion: "Colaboração sem culpabilização", weight: "20%" },
    { criterion: "Aprendizado acionável", weight: "15%" },
  ],
};

export const qaMindsetCompass = [
  { name: "Contexto", question: "Quem usa? O que importa aqui?" },
  { name: "Curiosidade", question: "Que suposição merece uma pergunta?" },
  { name: "Evidência", question: "O que observei de fato?" },
  { name: "Risco", question: "O que pode causar mais impacto?" },
  { name: "Aprendizado", question: "O que podemos melhorar no sistema?" },
];
