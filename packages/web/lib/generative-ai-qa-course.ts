export type GenerativeAIQAModule = {
  id: string;
  week: number;
  duration: string;
  title: string;
  objective: string;
  concepts: string[];
  practice: string;
  deliverable: string;
  checklist: string[];
  prompt: string;
};

export const generativeAIQAModules: GenerativeAIQAModule[] = [
  {
    id: "fundamentos-e-limites", week: 1, duration: "35 min",
    title: "Entenda onde a IA ajuda — e onde não decide",
    objective: "Reconhecer a IA generativa como apoio probabilístico: ela pode acelerar ideias, mas não comprova requisitos nem execução.",
    concepts: ["LLM", "alucinação", "revisão humana", "evidência"],
    practice: "Peça ideias de riscos para uma tela fictícia de cadastro. Separe sugestões úteis, afirmações sem fonte e itens que precisam de confirmação com produto ou evidência.",
    deliverable: "Lista curta com sugestões aceitas, rejeitadas e perguntas ainda abertas.",
    checklist: ["Nenhuma saída foi tratada como fato só por soar confiante.", "Requisitos e evidências continuam sendo a referência.", "Você registrou o que precisa de validação humana."],
    prompt: `Você é um assistente de QA. Analise apenas o contexto abaixo.\n\nContexto: formulário fictício de cadastro com nome, e-mail e senha.\nTarefa: sugerir riscos que valem uma conversa com o time.\nLimites: não invente regras ausentes; marque dúvidas como perguntas.\nFormato: risco | impacto possível | pergunta para esclarecer.\n\nNão afirme que testou o sistema.`,
  },
  {
    id: "contexto-e-prompts", week: 1, duration: "40 min",
    title: "Dê contexto para receber uma resposta útil",
    objective: "Montar prompts com objetivo, contexto, restrições e formato verificável em vez de depender de pedidos vagos.",
    concepts: ["objetivo", "contexto", "restrições", "formato de saída"],
    practice: "Compare “crie testes para o checkout” com um pedido que informa regras, público, limites, riscos e estrutura esperada. Ajuste o prompt para não completar lacunas por conta própria.",
    deliverable: "Um prompt reutilizável e a comparação de uma resposta vaga com uma resposta contextualizada.",
    checklist: ["A tarefa tem um resultado observável.", "O contexto separa fatos de suposições.", "O formato facilita revisar e rastrear cada sugestão."],
    prompt: `Objetivo: propor cenários de teste para a regra descrita.\nContexto confirmado: [cole somente requisitos fictícios ou autorizados]\nFora de escopo: [o que não deve ser presumido]\nTarefa: liste cenários positivos, negativos e de limite.\nFormato: ID | regra relacionada | pré-condição | ação | resultado esperado | dúvida.\nSe faltar informação, faça perguntas em vez de inventar regras.`,
  },
  {
    id: "requisitos-para-cenarios", week: 2, duration: "50 min",
    title: "Transforme requisitos em cenários revisáveis",
    objective: "Usar IA para ampliar uma primeira lista de cenários mantendo cada caso rastreável a uma regra ou dúvida explícita.",
    concepts: ["critério de aceite", "positivo", "negativo", "limite"],
    practice: "Use a regra fictícia “cupom válido dá 10% de desconto em compras a partir de R$ 100; não acumula com outra promoção”. Gere cenários e verifique valores abaixo, no limite e acima dele.",
    deliverable: "Matriz de cenários com regra de origem, dados, resultado esperado e lacunas identificadas.",
    checklist: ["Há caminhos válidos e inválidos.", "O limite de R$ 100 e os valores adjacentes estão cobertos.", "Cada resultado esperado pode ser conferido e aponta para uma regra."],
    prompt: `Com base apenas nestes critérios fictícios, proponha cenários:\n- Cupom válido aplica 10% a compras a partir de R$ 100.\n- Cupom não acumula com outra promoção.\n\nInclua caminho válido, inválido, limites e combinações relevantes. Para cada cenário, cite o critério de origem. Separe perguntas quando a regra não definir o comportamento (por exemplo, arredondamento ou validade do cupom). Não crie respostas para essas dúvidas.`,
  },
  {
    id: "riscos-e-cobertura", week: 2, duration: "45 min",
    title: "Avalie cobertura sem aceitar volume por volume",
    objective: "Criticar cenários redundantes ou genéricos e priorizar riscos pelo impacto e pela chance de falha, sem confundir cobertura sugerida com cobertura provada.",
    concepts: ["risco", "partições", "fronteiras", "redundância"],
    practice: "Peça casos para uma busca de produtos e agrupe por risco: resultado incorreto, falha de filtro, preço desatualizado e ausência de resultados. Remova duplicatas e justifique prioridades.",
    deliverable: "Conjunto priorizado com cobertura, duplicatas removidas e riscos que continuam sem evidência.",
    checklist: ["A prioridade tem justificativa de impacto e probabilidade.", "Casos repetidos foram consolidados sem perder uma regra diferente.", "A lista não usa quantidade de testes como sinônimo de qualidade."],
    prompt: `Revise a lista de cenários abaixo para uma busca fictícia de produtos.\nTarefa: identifique lacunas, duplicatas e casos de baixo valor. Agrupe por regra e risco.\nFormato: cenário | risco coberto | prioridade sugerida | justificativa | possível duplicata.\nNão declare cobertura total; explique quais informações faltam para concluir isso.\n\nLista para revisão: [cole os cenários]`,
  },
  {
    id: "gherkin-com-ia", week: 3, duration: "40 min",
    title: "Escreva Gherkin claro com apoio da IA",
    objective: "Converter um cenário aprovado para Gherkin legível por produto, QA e desenvolvimento, sem esconder várias regras em um passo genérico.",
    concepts: ["Given / When / Then", "exemplos", "linguagem de negócio", "manutenção"],
    practice: "Transforme a regra do cupom em um cenário no limite e outro para promoção concorrente. Reescreva passos que mencionem cliques ou detalhes internos da implementação.",
    deliverable: "Dois cenários Gherkin revisados, cada um focado em um comportamento observável.",
    checklist: ["Cada cenário verifica um comportamento principal.", "Os passos descrevem intenção e resultado de negócio.", "Valores de exemplo e dúvidas permanecem explícitos."],
    prompt: `Converta o cenário aprovado abaixo para Gherkin em português.\nUse Dado / Quando / Então, mantenha um comportamento por cenário e use linguagem de negócio.\nNão acrescente regras nem passos de implementação da interface. Se houver ambiguidade, liste-a depois do Gherkin.\n\nCenário aprovado: [cole um cenário revisado]`,
  },
  {
    id: "dados-sinteticos-e-privacidade", week: 3, duration: "45 min",
    title: "Crie dados sintéticos sem expor pessoas",
    objective: "Pedir dados fictícios que cubram limites e combinações relevantes sem inserir dados pessoais reais, segredos ou conteúdo de cliente.",
    concepts: ["dados sintéticos", "minimização", "privacidade", "casos-limite"],
    practice: "Monte valores fictícios para testar validação de e-mail, limite de senha e caracteres acentuados. Rejeite dados de produção mesmo quando mascarados ou enviados a uma ferramenta pública.",
    deliverable: "Tabela de dados fictícios associada aos cenários e às classes de equivalência pretendidas.",
    checklist: ["Não foram usados dados de produção, pessoais ou credenciais.", "Os valores cobrem classes válidas e inválidas relevantes.", "Cada valor tem propósito e resultado esperado definidos."],
    prompt: `Gere dados sintéticos para testar um formulário fictício.\nRegras confirmadas: e-mail obrigatório; senha entre 12 e 64 caracteres.\nInclua valores válidos, inválidos e de fronteira. Use apenas nomes e domínios reservados para teste, sem imitar pessoas reais.\nFormato: campo | valor fictício | classe | resultado esperado | regra relacionada.\nNão inclua credenciais reais, tokens nem dados pessoais.`,
  },
  {
    id: "apoio-a-automacao-e-triagem", week: 4, duration: "50 min",
    title: "Use IA como rascunho para automação e triagem",
    objective: "Solicitar um ponto de partida para teste automatizado ou análise de defeito, revisando seletores, asserções, contexto e limites antes de usar.",
    concepts: ["rascunho de automação", "asserções", "triagem", "reprodutibilidade"],
    practice: "Forneça um cenário aprovado e peça um esboço de teste Playwright. Confira se ele espera um resultado de negócio, usa um localizador estável e não alega ter sido executado. Depois peça uma hipótese de triagem para um bug fictício.",
    deliverable: "Rascunho revisado com alterações justificadas e uma hipótese de defeito separada dos fatos observados.",
    checklist: ["O código é tratado como rascunho até ser revisado e executado.", "Asserções verificam resultado, não apenas que a ação aconteceu.", "Hipóteses da triagem estão separadas de evidências."],
    prompt: `A partir deste cenário revisado, proponha um rascunho Playwright.\nInclua somente passos necessários e uma asserção do resultado observável. Prefira locators acessíveis por papel ou rótulo.\nNão invente seletores, APIs ou dados que não aparecem no contexto. Marque os pontos que exigem confirmação no produto e deixe claro que o teste não foi executado.\n\nCenário: [cole um cenário aprovado]`,
  },
  {
    id: "avaliacao-e-projeto-final", week: 4, duration: "60 min",
    title: "Avalie a saída e entregue um pacote confiável",
    objective: "Comparar respostas com critérios de qualidade e apresentar cenários gerados com assistência da IA, revisão humana, rastreabilidade e limites declarados.",
    concepts: ["avaliação", "rastreabilidade", "reprodutibilidade", "limites"],
    practice: "Repita o mesmo pedido com pequenas variações. Compare correção, cobertura útil, duplicatas, clareza, rastreabilidade e riscos. Escolha o que entra no pacote final e registre o que foi descartado.",
    deliverable: "Pacote final de cenários revisados com prompt, requisito de origem, decisões humanas, dúvidas e critérios de avaliação.",
    checklist: ["Toda sugestão aceita foi conferida contra requisito ou evidência.", "Fatos, hipóteses e perguntas estão diferenciados.", "A entrega não contém dados sensíveis e registra limites de uso da IA."],
    prompt: `Avalie esta saída de IA para criação de testes usando os critérios:\n1. Correção em relação aos requisitos fornecidos.\n2. Cobertura de caminhos positivos, negativos e limites pertinentes.\n3. Rastreabilidade e clareza do resultado esperado.\n4. Ambiguidades inventadas, redundâncias e dados sensíveis.\n\nPara cada problema, cite o trecho e sugira uma revisão. Não atribua nota sem justificar a evidência. Não declare que o produto foi testado.\n\nRequisitos: [cole requisitos fictícios ou autorizados]\nSaída a avaliar: [cole a sugestão]`,
  },
];

export const generativeAIQAOutcomes = [
  "Escrever prompts claros e delimitados para tarefas de QA.",
  "Gerar e revisar cenários rastreáveis a requisitos e riscos.",
  "Usar a IA como apoio em Gherkin, dados de teste, automação e triagem.",
  "Proteger dados e comunicar incertezas, limites e decisões humanas.",
];

export const generativeAIQAResources = [
  { label: "NIST: perfil de riscos para IA generativa", href: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
  { label: "OWASP: riscos de aplicações com LLM (2026)", href: "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/" },
];

export const generativeAIQAFinalProject = {
  title: "Pacote de cenários revisados com apoio de IA",
  description: "Escolha um fluxo fictício, parta de requisitos explícitos e produza cenários úteis. A entrega deve mostrar o que a IA sugeriu, o que você validou ou rejeitou e quais dúvidas continuam abertas.",
  deliverables: ["Requisitos e riscos de origem", "Prompt versionado e saída inicial", "Cenários revisados com prioridade e rastreabilidade", "Registro de ambiguidades, descarte e limites", "Declaração de que dados sensíveis não foram usados"],
};
