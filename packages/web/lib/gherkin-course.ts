export type GherkinTrackModule = {
  id: string;
  week: number;
  duration: string;
  title: string;
  objective: string;
  concepts: string[];
  practice: string;
  deliverable: string;
  checklist: string[];
  code: string;
};

export const gherkinCourseModules: GherkinTrackModule[] = [
  {
    id: "bdd-discovery", week: 1, duration: "45 min", title: "Comece pelo comportamento, não pelo arquivo .feature",
    objective: "Entender BDD como colaboração para descobrir e alinhar comportamento, usando exemplos antes da automação.",
    concepts: ["BDD", "descoberta", "Three Amigos", "Example Mapping", "acordo do time"],
    practice: "Faça uma conversa curta sobre a regra de acesso ao carrinho. Separe perguntas, exemplos, regras e pontos ainda sem decisão antes de escrever Gherkin.",
    deliverable: "Um mapa de exemplos com pelo menos uma regra, três exemplos e as dúvidas que precisam de resposta.",
    checklist: ["Produto, desenvolvimento e QA contribuem com perspectivas diferentes.", "Gherkin registra exemplos acordados; não substitui a conversa.", "Dúvidas de regra aparecem como perguntas, não como pressupostos no cenário."],
    code: `Pergunta: o que um visitante sem sessão pode fazer?\n\nRegra: dados pessoais do carrinho só aparecem para a pessoa autenticada.\n\nExemplos para discutir:\n- visitante consulta o carrinho\n- pessoa autenticada consulta o carrinho\n- sessão expirada durante a consulta`,
  },
  {
    id: "feature-scenario", week: 1, duration: "60 min", title: "Estruture Funcionalidade e Cenário",
    objective: "Escrever uma especificação pequena com contexto legível e um resultado que outra pessoa consegue reconhecer.",
    concepts: ["Funcionalidade", "Cenário", "Dado", "Quando", "Então", "idioma pt"],
    practice: "Descreva o acesso anônimo ao carrinho com palavras do domínio. Leia o cenário em voz alta e confira se alguém de produto entende sem explicar código.",
    deliverable: "Um arquivo .feature em português com um cenário observável e independente.",
    checklist: ["A primeira palavra-chave é Funcionalidade.", "Dado descreve contexto, Quando a ação, Então o resultado observável.", "O nome explica o comportamento, não a implementação."],
    code: `# language: pt\nFuncionalidade: Acesso ao carrinho\n  Uma pessoa visitante não pode consultar dados pessoais.\n\n  Cenário: Visitante sem sessão tenta abrir o carrinho\n    Dado que não existe uma sessão autenticada\n    Quando consulto o carrinho da loja\n    Então o sistema responde com status 401`,
  },
  {
    id: "behavior-language", week: 2, duration: "60 min", title: "Escreva o resultado que importa para a pessoa",
    objective: "Trocar passos de interface e detalhes internos por linguagem concreta sobre intenção e efeito percebido.",
    concepts: ["linguagem do domínio", "resultado observável", "nível de detalhe", "independência da UI"],
    practice: "Revise cenários que descrevem seletores, cliques ou nomes de funções. Reescreva como comportamento e mantenha detalhes técnicos na automação.",
    deliverable: "Antes/depois de cinco passos com uma justificativa de legibilidade e estabilidade.",
    checklist: ["Passos não narram cada clique sem valor de negócio.", "Então descreve um efeito que pode ser observado.", "A especificação não depende de uma tela específica se a regra é de domínio."],
    code: `# Acoplado à tela\nQuando clico no botão verde "Adicionar" na linha 1\n\n# Focado no comportamento\nQuando adiciono o Kit Smoke Test ao carrinho\nEntão o carrinho contém esse produto`,
  },
  {
    id: "scenario-design", week: 2, duration: "75 min", title: "Escolha bons exemplos e cubra limites",
    objective: "Usar exemplos concretos para revelar resultados diferentes, sem transformar cada cenário em uma lista de ações.",
    concepts: ["partições", "limites", "caminho feliz", "alternativas", "casos negativos"],
    practice: "Para uma regra de quantidade do carrinho, mapeie valor válido, limite, acima do limite e valor ausente; discuta o resultado esperado em cada caso.",
    deliverable: "Conjunto de exemplos priorizados por risco, com condições e resultados distintos.",
    checklist: ["Cada cenário protege uma regra ou decisão diferente.", "Valores de limite foram escolhidos por uma regra real.", "Cenários negativos afirmam o comportamento correto, não apenas que algo falha."],
    code: `Cenário: Quantidade válida pode ser adicionada\n  Dado que o produto está disponível\n  Quando adiciono 2 unidades ao carrinho\n  Então o carrinho mostra quantidade 2\n\nCenário: Quantidade acima do limite é recusada\n  Dado que o produto permite no máximo 5 unidades\n  Quando tento adicionar 6 unidades\n  Então o carrinho informa o limite permitido`,
  },
  {
    id: "rules-background", week: 3, duration: "75 min", title: "Organize regras sem esconder contexto",
    objective: "Agrupar cenários por regra e usar Contexto/Background apenas para contexto comum e curto.",
    concepts: ["Regra", "Contexto", "Background", "escopo", "leitura isolada"],
    practice: "Agrupe exemplos de acesso ao carrinho por regra. Extraia somente o contexto repetido que ajuda a leitura de cada cenário.",
    deliverable: "Funcionalidade com regras separadas e Contexto curto, sem setup oculto.",
    checklist: ["Cada regra mantém cenários próximos do motivo de negócio.", "Contexto não cria estado difícil de perceber.", "O cenário continua compreensível quando lido sozinho."],
    code: `Funcionalidade: Acesso ao carrinho\n\n  Contexto:\n    Dado que a loja está disponível\n\n  Regra: somente a pessoa autenticada vê seu carrinho\n    Cenário: Visitante não acessa o carrinho\n      Dado que não existe uma sessão autenticada\n      Quando consulto o carrinho\n      Então recebo status 401`,
  },
  {
    id: "scenario-outline", week: 3, duration: "75 min", title: "Use Esquema do Cenário com intenção",
    objective: "Reduzir repetição com exemplos tabulares quando o mesmo comportamento deve valer para uma família de dados.",
    concepts: ["Esquema do Cenário", "Exemplos", "parâmetros", "casos distintos", "legibilidade"],
    practice: "Modele respostas de busca para termos que retornam produto, lista vazia e texto com espaços, mantendo explícito o resultado esperado em cada linha.",
    deliverable: "Um esquema com exemplos nomeados e pelo menos uma linha que exercita um limite relevante.",
    checklist: ["Cada linha da tabela é um exemplo válido por si só.", "A abstração reduz duplicação sem esconder o comportamento.", "Casos com resultados diferentes não foram forçados no mesmo esquema."],
    code: `Esquema do Cenário: Buscar produtos\n  Dado que estou no catálogo da loja\n  Quando busco por "<termo>"\n  Então vejo o resultado "<resultado>"\n\n  Exemplos:\n    | termo             | resultado              |\n    | Kit Smoke Test    | Kit Smoke Test         |\n    | produto inexistente | nenhum produto encontrado |`,
  },
  {
    id: "tables-docstrings", week: 4, duration: "75 min", title: "Passe dados com Tabela ou Doc String",
    objective: "Escolher argumento multilinha para um conjunto estruturado ou para um documento/texto que pertence ao exemplo.",
    concepts: ["Data Table", "Doc String", "carga útil", "contrato", "transformação"],
    practice: "Especifique um resumo de pedido com tabela e um comentário longo com Doc String. Evite colocar fixtures inteiras no arquivo .feature.",
    deliverable: "Um exemplo de tabela transformada em objetos e um Doc String validado por uma regra clara.",
    checklist: ["A tabela contém somente dados úteis para entender o exemplo.", "Doc String é usado para texto longo, não para esconder um JSON gigante.", "Transformação e validação ficam no código de apoio."],
    code: `Cenário: Resumo do carrinho mostra linhas escolhidas\n  Dado que o carrinho contém:\n    | produto        | quantidade |\n    | Kit Smoke Test | 2          |\n  Quando consulto o carrinho\n  Então vejo as mesmas quantidades`,
  },
  {
    id: "step-definitions", week: 4, duration: "90 min", title: "Conecte frases a step definitions reutilizáveis",
    objective: "Implementar passos pequenos com Cucumber Expressions, parâmetros tipados e intenção clara.",
    concepts: ["step definition", "Cucumber Expressions", "{int}", "{string}", "undefined steps"],
    practice: "Ligue um cenário à API somente de leitura do carrinho. Use parâmetros quando alterarem o valor de um mesmo comportamento.",
    deliverable: "Steps para Dado/Quando/Então com nomes de domínio e sem duplicação de expressões.",
    checklist: ["Cada step realiza uma ação ou validação pequena.", "Não há frases ambíguas que casam com vários handlers.", "A implementação não guarda fluxo inteiro em um step genérico."],
    code: `import { Given, When, Then } from "@cucumber/cucumber";\nimport assert from "node:assert/strict";\n\nGiven("que não existe uma sessão autenticada", function () {\n  this.baseUrl = process.env.BASE_URL || "http://localhost:3000";\n});\n\nWhen("consulto o carrinho da loja", async function () {\n  this.response = await fetch(this.baseUrl + "/api/v1/shop/cart");\n});\n\nThen("o sistema responde com status {int}", function (status) {\n  assert.equal(this.response.status, status);\n});`,
  },
  {
    id: "world-hooks", week: 5, duration: "75 min", title: "Isole estado com World e hooks pequenos",
    objective: "Manter dados e respostas separados por cenário e usar hooks para preparar ou limpar recursos sem esconder intenção.",
    concepts: ["World", "Before", "After", "isolamento", "cleanup", "estado por cenário"],
    practice: "Mantenha URL e resposta HTTP no World do cenário. Adicione hook apenas para uma necessidade comum real e garanta limpeza mesmo quando uma asserção falhar.",
    deliverable: "World explícito e hooks com responsabilidade curta, sem dependência de ordem.",
    checklist: ["Cada cenário recebe estado próprio.", "Hooks não fazem setup surpreendente para o leitor.", "Recursos temporários são limpos mesmo em falha."],
    code: `import { Before, After } from "@cucumber/cucumber";\n\nBefore(function () {\n  this.baseUrl = process.env.BASE_URL || "http://localhost:3000";\n});\n\nAfter(async function () {\n  // Limpe somente dados temporários que este cenário criou.\n});`,
  },
  {
    id: "tags-organization", week: 6, duration: "75 min", title: "Organize a suíte com tags e convenções",
    objective: "Executar subconjuntos com propósito e manter arquivos de feature fáceis de localizar e revisar.",
    concepts: ["tags", "@smoke", "@regression", "paths", "convenção de nomes"],
    practice: "Separe o smoke da loja da regressão e combine tags para selecionar cenários. Revise se o nome das tags expressa risco ou suite, não time interno.",
    deliverable: "Estrutura de arquivos e comandos de execução para smoke e regressão.",
    checklist: ["Tags têm significado estável e documentado.", "Smoke é curto e cobre fluxo crítico.", "A organização não duplica cenário em vários arquivos."],
    code: `@smoke\nFuncionalidade: Acesso ao carrinho\n\n  @auth @api\n  Cenário: Visitante não lê dados pessoais\n    Dado que não existe uma sessão autenticada\n    Quando consulto o carrinho da loja\n    Então o sistema responde com status 401\n\n# Executar apenas o smoke\nnpx cucumber-js --tags "@smoke and not @wip"`,
  },
  {
    id: "automation-boundaries", week: 7, duration: "90 min", title: "Escolha o nível de automação adequado",
    objective: "Integrar Gherkin com API, browser ou domínio sem transformar todo exemplo em um teste E2E caro e frágil.",
    concepts: ["teste de API", "browser", "contrato", "pirâmide", "valor do exemplo"],
    practice: "Classifique cenários do carrinho por camada. Automatize o contrato de acesso anônimo por API e reserve browser para jornadas que dependem da experiência visual.",
    deliverable: "Mapa de cenários e camada escolhida, com justificativa de cobertura e custo.",
    checklist: ["BDD não é tratado como sinônimo de teste UI.", "Cada camada cobre um risco específico.", "A linguagem de negócio não mascara uma implementação instável."],
    code: `# A regra pode ser verificada sem abrir um browser\nDado que não existe uma sessão autenticada\nQuando consulto o carrinho da loja pela API\nEntão o sistema responde com status 401\n\n# Um cenário de browser fica reservado à jornada visual\nQuando adiciono um produto disponível ao carrinho pela loja\nEntão vejo o produto e a quantidade no resumo`,
  },
  {
    id: "reports-ci-capstone", week: 8, duration: "2 h", title: "Projeto final: especifique e entregue uma regra",
    objective: "Fechar uma pequena especificação colaborativa, executável, revisável em CI e rastreável até uma regra de negócio.",
    concepts: ["rastreabilidade", "revisão", "relatório", "CI", "living documentation"],
    practice: "Escolha uma regra do carrinho, faça Example Mapping, escreva os cenários, conecte ao Cucumber e rode o smoke em CI contra um ambiente autorizado.",
    deliverable: "Feature revisada, evidência da conversa e decisões, step definitions, execução reproduzível e relatório de limites.",
    checklist: ["Cada cenário representa exemplo acordado e resultado observável.", "Steps estão mapeados sem duplicação e com estado isolado.", "CI executa smoke contra ambiente autorizado e sinaliza falha.", "A documentação deixa claro o que ainda não está coberto."],
    code: `# Execução manual em ambiente de teste autorizado\nnpm ci\nBASE_URL=http://staging-aprovado npm run bdd:smoke`,
  },
];

export const gherkinCourseOutcomes = [
  "Conduzir descoberta por exemplos e alinhar regras antes de automatizar.",
  "Escrever cenários curtos em Gherkin claro e orientado a comportamento.",
  "Modelar regras, limites, outlines, tabelas e Doc Strings sem exagerar na abstração.",
  "Conectar features ao Cucumber com steps reutilizáveis e estado isolado.",
  "Organizar a suíte e escolher a camada de automação certa para cada exemplo.",
];

export const gherkinFinalProject = {
  title: "Projeto final: especifique e entregue uma regra",
  description: "Uma regra de negócio discutida pelo time, descrita com exemplos claros, automatizada na camada adequada e executada de forma reproduzível.",
  deliverables: [
    "Mapa de exemplos com regra, exemplos, perguntas e decisões registradas.",
    "Feature em português com cenários nomeados e resultados observáveis.",
    "Cobertura de caminho feliz, alternativa e limite relevante.",
    "Step definitions pequenas, expressões sem ambiguidade e World isolado.",
    "Tags e comando smoke executado em CI contra ambiente autorizado.",
    "README com intenção, execução e limites de cobertura conhecidos.",
  ],
  rubric: [
    { criterion: "Alinhamento e exemplos de negócio", weight: "25%" },
    { criterion: "Clareza e legibilidade do Gherkin", weight: "25%" },
    { criterion: "Isolamento e qualidade dos steps", weight: "20%" },
    { criterion: "Camada, tags e CI", weight: "15%" },
    { criterion: "Limites e rastreabilidade", weight: "15%" },
  ],
};

export const gherkinCourseResources = [
  { label: "Referência Gherkin", href: "https://cucumber.io/docs/gherkin/reference/" },
  { label: "BDD com Cucumber", href: "https://cucumber.io/docs/bdd/" },
  { label: "Three Amigos", href: "https://cucumber.io/docs/bdd/who-does-what/" },
  { label: "Step definitions", href: "https://cucumber.io/docs/cucumber/step-definitions/" },
  { label: "Cucumber Expressions", href: "https://cucumber.io/docs/cucumber/cucumber-expressions/" },
  { label: "Configuração e tags", href: "https://cucumber.io/docs/cucumber/configuration/" },
];

export function findGherkinModule(id: string) {
  return gherkinCourseModules.find((module) => module.id === id);
}
