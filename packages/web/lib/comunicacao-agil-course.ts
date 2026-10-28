export type CommunicationAgileModule = {
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

export const communicationAgileModules: CommunicationAgileModule[] = [
  {
    id: "quality-is-teamwork", week: 1, duration: "45 min",
    title: "Qualidade é trabalho do time",
    objective: "Posicionar QA como parceiro de aprendizado e redução de risco, não como etapa final de aprovação.",
    concepts: ["Manifesto Ágil", "qualidade compartilhada", "feedback curto"],
    practice: "Uma história chega pronta para desenvolvimento e o time quer testar só no fim. Mapeie quem pode esclarecer valor, regra, risco e testabilidade antes de começar.",
    deliverable: "Um mapa de conversas antecipadas com Produto, Design e Desenvolvimento.",
    checklist: ["Foco no resultado para quem usa.", "QA contribui desde a descoberta.", "A responsabilidade pela qualidade não foi transferida a uma pessoa."],
    example: `Em vez de: “Isso é responsabilidade do QA.”\nTente: “Vamos combinar como reconhecer o comportamento esperado e como vamos obter feedback cedo.”`,
  },
  {
    id: "listen-and-clarify", week: 1, duration: "50 min",
    title: "Escute, investigue, confirme",
    objective: "Transformar pedidos vagos em entendimento compartilhado sem presumir a intenção de Produto ou da pessoa usuária.",
    concepts: ["escuta ativa", "perguntas abertas", "paráfrase", "suposições"],
    practice: "Para o pedido ‘o checkout precisa ser rápido’, prepare perguntas sobre contexto, medida, dispositivo, exceções e impacto de uma demora.",
    deliverable: "Perguntas abertas e um resumo confirmado pelo interlocutor.",
    checklist: ["Perguntou antes de propor solução.", "Separou fato de suposição.", "Confirmou que entendeu corretamente."],
    example: `“Quando diz rápido, em qual etapa e em qual situação? Posso resumir o que entendi antes de registrarmos o critério?”`,
  },
  {
    id: "clear-async-updates", week: 2, duration: "45 min",
    title: "Escreva atualizações que ajudam a agir",
    objective: "Comunicar progresso, impacto e próximo passo com contexto suficiente e sem muralhas de texto.",
    concepts: ["comunicação assíncrona", "contexto", "pedido explícito", "evidência"],
    practice: "Reescreva uma atualização longa sobre falha de pagamento para que Produto e Desenvolvimento entendam o impacto e saibam o que você precisa.",
    deliverable: "Atualização curta com contexto, evidência, risco e próximo passo.",
    checklist: ["A primeira frase explica o ponto principal.", "O impacto está visível.", "Há um próximo passo ou pedido claro."],
    example: `Contexto: checkout em homologação\nSinal: pagamentos por Pix retornam erro 502 em 3/5 tentativas\nImpacto: não consigo validar a confirmação do pedido\nPróximo passo: alguém pode conferir o log do provedor às 14h?`,
  },
  {
    id: "refinement-three-amigos", week: 2, duration: "60 min",
    title: "Refine junto: QA, Produto e Desenvolvimento",
    objective: "Usar exemplos, riscos e perguntas para descobrir lacunas de uma história antes de seu desenvolvimento.",
    concepts: ["refinamento", "Three Amigos", "exemplos", "regras de negócio"],
    practice: "Refine a recuperação de senha com Produto e Desenvolvimento. Explore token expirado, e-mail ausente, reenvio e proteção de conta sem tentar cobrir todo o universo.",
    deliverable: "História esclarecida, exemplos prioritários, dúvidas abertas e responsáveis por resolvê-las.",
    checklist: ["Valor e usuário estão claros.", "Regras e exceções relevantes têm exemplos.", "Dúvidas sem resposta não viraram falsa certeza."],
    example: `Produto: “A pessoa pode pedir outro link.”\nQA: “O que acontece com o link anterior?”\nDev: “Podemos invalidá-lo ao gerar o novo.”\nAcordo: testar link atual válido e anterior invalidado.`,
  },
  {
    id: "acceptance-examples", week: 3, duration: "55 min",
    title: "Converta entendimento em exemplos testáveis",
    objective: "Registrar critérios observáveis que orientam implementação e teste, sem transformar cada regra em uma lista infinita.",
    concepts: ["critérios de aceite", "exemplos concretos", "Gherkin", "testabilidade"],
    practice: "Escreva exemplos para aplicar um cupom: válido, vencido e incompatível com o produto. Defina o resultado e quem precisa validá-lo.",
    deliverable: "Três exemplos revisáveis em linguagem de negócio.",
    checklist: ["Cada exemplo descreve resultado observável.", "Não prescreve detalhe técnico desnecessário.", "A regra pode ser entendida por Produto, Dev e QA."],
    example: `Dado um cupom válido para a categoria selecionada\nQuando a pessoa o aplica antes de confirmar o pedido\nEntão o desconto aparece no resumo e no total a pagar`,
  },
  {
    id: "sprint-planning-and-slicing", week: 3, duration: "60 min",
    title: "Ajude o time a planejar uma entrega possível",
    objective: "Colaborar no Sprint Planning, tornar riscos visíveis e fatiar histórias para receber feedback dentro do Sprint.",
    concepts: ["Sprint Goal", "fatiamento vertical", "dependências", "incerteza"],
    practice: "Uma história de cadastro inclui formulário, e-mail, painel e relatórios. Sugira cortes que entreguem valor e possam ser verificados em partes.",
    deliverable: "Fatia inicial, riscos e dependências visíveis, alinhados ao objetivo do Sprint.",
    checklist: ["O corte mantém um fluxo útil para alguém.", "Validação faz parte do trabalho, não fica para depois.", "Incertezas são comunicadas sem assumir compromisso artificial."],
    example: `Primeira fatia: criar conta e mostrar confirmação\nPróxima: validar e-mail\nDepois: painel e relatórios\nPergunta de planejamento: qual é o menor fluxo seguro para aprender se a proposta funciona?`,
  },
  {
    id: "daily-scrum-useful", week: 4, duration: "40 min",
    title: "Participe do Daily com foco no objetivo",
    objective: "Compartilhar informação que ajuda os Developers a inspecionar progresso e ajustar o plano do dia, sem fazer relatório ao gestor.",
    concepts: ["Daily Scrum", "Sprint Goal", "bloqueios", "plano adaptável"],
    practice: "Em vez de listar tarefas, relate que a jornada principal está validada, o cenário de reembolso bloqueia a conclusão e proponha uma conversa breve após o Daily.",
    deliverable: "Uma atualização de até 30 segundos conectada ao objetivo do Sprint.",
    checklist: ["Trouxe sinal útil para o plano coletivo.", "Bloqueio tem impacto e pedido claros.", "Discussão aprofundada segue com as pessoas necessárias."],
    example: `“O fluxo de compra está validado. Reembolso ainda depende de uma decisão sobre prazo; isso ameaça a história de devolução. Produto, podemos fechar a regra após o Daily?”`,
  },
  {
    id: "pairing-and-feedback", week: 4, duration: "55 min",
    title: "Colabore durante a implementação",
    objective: "Criar ciclos curtos de feedback com pairing, revisão de exemplos e conversas respeitosas sobre testabilidade.",
    concepts: ["pair testing", "shift-left", "testabilidade", "feedback específico"],
    practice: "Um campo de valor monetário não tem limite definido. Prepare uma conversa colaborativa para decidir regra, feedback da interface e pontos de validação.",
    deliverable: "Uma sessão de investigação conjunta com decisão e risco registrados.",
    checklist: ["Descreveu comportamento, não culpou pessoa.", "Incluiu quem pode decidir a regra.", "Acordou como verificar a mudança."],
    example: `“No teste com 0,00, a interface aceita o valor, mas o pedido falha depois. Qual limite representa a regra de negócio? Podemos decidir e cobrir esse exemplo juntos?”`,
  },
  {
    id: "defect-and-release-risk", week: 5, duration: "60 min",
    title: "Comunique bugs e risco de release sem culpar",
    objective: "Descrever evidência e impacto, distinguir severidade de prioridade e apoiar decisões de release com transparência.",
    concepts: ["bug report", "severidade", "prioridade", "risco residual"],
    practice: "Relate uma falha intermitente no pagamento. Diferencie o que foi observado, quem pode ser afetado, frequência e o que ainda não foi investigado.",
    deliverable: "Handoff reproduzível e resumo de risco para a decisão de release.",
    checklist: ["Fato e hipótese estão separados.", "Impacto é explicado sem dramatizar.", "Decisão e risco residual têm responsável visível."],
    example: `Observado: 2 de 10 compras duplicaram a tentativa no cartão\nImpacto: possível cobrança repetida; não confirmei liquidação duplicada\nEvidência: passos, horário e ID fictício da transação\nRisco aberto: verificar com o provedor antes do release`,
  },
  {
    id: "kanban-flow-conversations", week: 6, duration: "60 min",
    title: "Converse sobre fluxo no Kanban",
    objective: "Tornar bloqueios, políticas explícitas, WIP e previsibilidade conversáveis para melhorar a entrega contínua.",
    concepts: ["Kanban", "WIP", "políticas explícitas", "SLE", "fluxo"],
    practice: "No quadro, cinco itens aguardam validação e nenhum está sendo iniciado. Facilite uma conversa para descobrir a fila, o limite e o próximo item que gera mais valor.",
    deliverable: "Uma política de fluxo combinada e um experimento pequeno para reduzir espera.",
    checklist: ["O quadro representa o trabalho real.", "WIP e bloqueios são discutidos como sistema, não culpa individual.", "Previsão usa histórico ou é identificada como hipótese."],
    example: `“Há 5 itens em validação e 2 esperando regra. Vamos pausar novo trabalho, esclarecer a regra mais antiga e combinar o que significa ‘pronto para validar’?”`,
  },
  {
    id: "review-and-retrospective", week: 7, duration: "55 min",
    title: "Feche o ciclo: review e retrospectiva",
    objective: "Apresentar evidência e aprendizado na Sprint Review, e propor melhoria de processo na Retrospectiva sem misturar os objetivos.",
    concepts: ["Sprint Review", "Sprint Retrospective", "inspeção", "experimentos"],
    practice: "Apresente um fluxo que funciona e uma limitação conhecida. Depois transforme uma fila recorrente de bugs em hipótese de melhoria e ação pequena.",
    deliverable: "Resumo de feedback do produto e experimento de melhoria com dono e data de revisão.",
    checklist: ["Review conversa sobre resultado e próximos passos.", "Retrospectiva examina como o time trabalha.", "A ação cabe no próximo ciclo e será revista."],
    example: `Observação: dúvidas de regra aparecem após iniciar o teste\nHipótese: exemplos no refinamento reduzem retrabalho\nExperimento: testar 3 histórias por duas semanas\nSinal: dúvidas tardias registradas; revisar na próxima retro`,
  },
  {
    id: "final-simulation", week: 8, duration: "90 min",
    title: "Simule uma entrega ágil do início ao feedback",
    objective: "Integrar conversas, artefatos e decisões de qualidade em uma jornada de produto com Scrum ou Kanban.",
    concepts: ["colaboração", "acordos", "adaptação", "comunicação baseada em evidência"],
    practice: "Escolha uma funcionalidade fictícia, facilite refinamento, planeje uma fatia, colabore durante a validação, comunique o risco e proponha feedback para o próximo ciclo.",
    deliverable: "Um pacote conciso de refinamento, atualização, handoff e experimento de retrospectiva.",
    checklist: ["Decisões são rastreáveis a exemplos ou evidências.", "Riscos e dúvidas não resolvidas estão visíveis.", "Cada conversa termina em entendimento, decisão ou próximo passo."],
    example: `Pedido → perguntas → exemplos e riscos → fatia de entrega → evidência → feedback → próximo experimento`,
  },
];

export const communicationAgileOutcomes = [
  "Facilitar conversas de refinamento com Produto e Desenvolvimento.",
  "Levar exemplos e riscos para planejamento antes de a história virar surpresa.",
  "Dar atualizações úteis em canais síncronos e assíncronos.",
  "Apoiar fluxo, feedback e melhoria contínua em Scrum e Kanban.",
];

export const communicationAgileResources = [
  { label: "Manifesto Ágil e princípios", href: "https://agilemanifesto.org/iso/ptbr/manifesto.html" },
  { label: "Scrum Guide (2020)", href: "https://scrumguides.org/scrum-guide.html" },
  { label: "Kanban Guide (2025)", href: "https://kanbanguides.org/the-kanban-guide/" },
];

export const communicationAgileFinalProject = {
  title: "Uma funcionalidade, conversas melhores",
  description: "Simule a jornada de uma funcionalidade do primeiro pedido à retrospectiva. Use os templates como apoio, não como formulário obrigatório.",
  deliverables: ["Resumo de refinamento com exemplos e riscos", "Atualização curta com evidência e próximo passo", "Handoff de bug sem culpa e com impacto", "Experimento de melhoria com responsável e revisão"],
  rubric: [
    { criterion: "Clareza e contexto", weight: "25%" },
    { criterion: "Colaboração e perguntas", weight: "25%" },
    { criterion: "Evidência e transparência de risco", weight: "25%" },
    { criterion: "Ação viável e feedback contínuo", weight: "25%" },
  ],
};
