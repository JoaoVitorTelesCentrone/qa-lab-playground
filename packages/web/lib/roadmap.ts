// ── Types ──────────────────────────────────────────────────────────────────────

export type ItemStatus = "nao_iniciado" | "em_progresso" | "concluido";
export type NivelFase  = "iniciante" | "intermediario";

export interface RoadmapItem {
  id: string;
  titulo: string;
  descricao: string;
  recurso?: { label: string; href: string };
}

export interface RoadmapFase {
  id: string;
  numero: number;
  titulo: string;
  descricao: string;
  nivel: NivelFase;
  icon: string;
  items: RoadmapItem[];
}

// ── Level config ───────────────────────────────────────────────────────────────

export const nivelConfig: Record<NivelFase, { label: string; textClass: string; borderClass: string; bgClass: string }> = {
  iniciante:     { label: "Iniciante",     textClass: "text-mint",  borderClass: "border-mint/30",  bgClass: "bg-mint/10"  },
  intermediario: { label: "Intermediário", textClass: "text-neon",  borderClass: "border-neon/30",  bgClass: "bg-neon/10"  },
};

// ── Roadmap Data ───────────────────────────────────────────────────────────────

export const fases: RoadmapFase[] = [

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 1
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-1",
    numero: 1,
    titulo: "Fundamentos de QA",
    descricao: "O que é qualidade de software, a mentalidade do testador e onde o QA se encaixa no ciclo de desenvolvimento.",
    nivel: "iniciante",
    icon: "🧠",
    items: [
      {
        id: "f1-01",
        titulo: "O que é qualidade de software",
        descricao: "Diferença entre qualidade de produto (o software funciona?) e qualidade de processo (o time trabalha bem?). Por que ambas importam e como se relacionam.",
      },
      {
        id: "f1-02",
        titulo: "Mentalidade do QA",
        descricao: "Pensar como um adversário: questionar o óbvio, explorar o que o dev não testou, buscar o que pode dar errado em vez de confirmar que funciona.",
      },
      {
        id: "f1-03",
        titulo: "SDLC e onde QA se encaixa",
        descricao: "Ciclo de vida do desenvolvimento (Waterfall, Ágil, Kanban). Em qual fase o QA entra em cada modelo e por que entrar cedo é mais barato.",
      },
      {
        id: "f1-04",
        titulo: "Tipos de teste",
        descricao: "Funcional vs. não funcional. Manual vs. automatizado. Caixa preta, caixa branca e caixa cinza. Saber nomear e distinguir cada abordagem.",
      },
      {
        id: "f1-05",
        titulo: "A pirâmide de testes",
        descricao: "Unitários na base, integração no meio, E2E no topo. Proporção ideal, custo de manutenção e velocidade de feedback de cada camada.",
      },
      {
        id: "f1-06",
        titulo: "Lendo e questionando requisitos",
        descricao: "Como identificar ambiguidades, condições não especificadas e edge cases antes mesmo de começar a testar. A arte de fazer a pergunta certa.",
      },
      {
        id: "f1-07",
        titulo: "Definition of Done (DoD)",
        descricao: "O que significa 'pronto' para QA. Critérios de saída de uma história: testes executados, bugs críticos fechados, documentação atualizada.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 2
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-2",
    numero: 2,
    titulo: "Testes Manuais na Prática",
    descricao: "Técnicas consagradas de design de testes manuais, exploratórios e de usabilidade.",
    nivel: "iniciante",
    icon: "🔬",
    items: [
      {
        id: "f2-01",
        titulo: "Análise de valor limite (BVA)",
        descricao: "Testar nas fronteiras: mínimo, mínimo+1, máximo-1, máximo. Onde a maioria dos bugs de validação se esconde.",
      },
      {
        id: "f2-02",
        titulo: "Partição de equivalência",
        descricao: "Dividir entradas em classes válidas e inválidas. Testar um representante de cada classe em vez de testar tudo — eficiência sem perder cobertura.",
      },
      {
        id: "f2-03",
        titulo: "Teste exploratório",
        descricao: "Sessões com charter (objetivo + tempo), aprendizado enquanto testa, notas estruturadas. Quando explorar é mais eficiente que seguir script.",
      },
      {
        id: "f2-04",
        titulo: "Escrevendo casos de teste que prestam",
        descricao: "Título objetivo, precondições claras, passos atômicos, resultado esperado vs. obtido. Por que um caso ruim é pior do que nenhum.",
      },
      {
        id: "f2-05",
        titulo: "Checklists de regressão",
        descricao: "Quando usar checklist em vez de casos formais. Como criar, manter atualizado e não deixar virar uma lista morta.",
      },
      {
        id: "f2-06",
        titulo: "Teste de usabilidade manual",
        descricao: "10 heurísticas de Nielsen: consistência, feedback, prevenção de erros. Como avaliar a UI sem precisar de um laboratório de UX.",
      },
      {
        id: "f2-07",
        titulo: "Priorizando o que testar",
        descricao: "Risco × impacto × frequência de uso. Como decidir o que testar quando o tempo é curto — e defender essa decisão com dados.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 3
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-3",
    numero: 3,
    titulo: "Bug Report que Presta",
    descricao: "A arte de comunicar um problema de forma que o dev consiga reproduzir, entender e corrigir sem precisar perguntar nada.",
    nivel: "iniciante",
    icon: "🐛",
    items: [
      {
        id: "f3-01",
        titulo: "Anatomia de um bom bug report",
        descricao: "Título descritivo, ambiente (OS, browser, versão), passos de reprodução numerados, resultado obtido vs. esperado, evidências. Cada campo tem um motivo.",
      },
      {
        id: "f3-02",
        titulo: "Severidade vs. Prioridade",
        descricao: "Severidade é o impacto técnico; prioridade é a urgência de negócio. Confundir os dois gera conflito com produto e desenvolvimento.",
      },
      {
        id: "f3-03",
        titulo: "Reproduzindo de forma consistente",
        descricao: "Isolar variáveis, confirmar em diferentes ambientes, simplificar os passos ao mínimo reproduzível. Nunca reportar sem reproduzir.",
      },
      {
        id: "f3-04",
        titulo: "Evidências de qualidade",
        descricao: "Screenshot com anotação, vídeo curto, log relevante (não 500 linhas). O que incluir, o que cortar e como nomear os arquivos.",
      },
      {
        id: "f3-05",
        titulo: "Comunicação com o time",
        descricao: "Quando vai para o Jira, quando é uma conversa. Linguagem objetiva, sem tom acusatório. Como descrever o problema sem sugerir a causa.",
      },
      {
        id: "f3-06",
        titulo: "Ciclo de vida do bug",
        descricao: "Open → In Progress → Fixed → Verification → Closed / Reopen / Won't Fix. O que o QA faz em cada transição e por que a verification é crítica.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 4
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-4",
    numero: 4,
    titulo: "Agile & Processo de QA",
    descricao: "Como o QA opera em times ágeis: cerimônias, critérios de aceite, refinamento e o conceito de shift-left.",
    nivel: "iniciante",
    icon: "🔄",
    items: [
      {
        id: "f4-01",
        titulo: "Scrum para QA",
        descricao: "Sprint planning (o QA estima junto?), daily (o que reportar?), review (quem demonstra?), retrospectiva (o que levar?). O papel ativo do QA em cada cerimônia.",
      },
      {
        id: "f4-02",
        titulo: "Critérios de aceite com Gherkin",
        descricao: "GIVEN (contexto) / WHEN (ação) / THEN (resultado esperado). Como escrever ACs que eliminam ambiguidade e já sugerem os testes.",
      },
      {
        id: "f4-03",
        titulo: "Three Amigos: dev, QA, PM",
        descricao: "Refinamento colaborativo antes do desenvolvimento. Cada papel traz uma perspectiva: o QA traz os 'e se...?' que os outros não veem.",
      },
      {
        id: "f4-04",
        titulo: "Shift-left testing",
        descricao: "Entrar na conversa antes do código: revisar wireframe, questionar spec, participar do design. Quanto mais cedo o bug é encontrado, mais barato é corrigir.",
        recurso: { label: "Artigo: Shift-Left no Blog QA Lab", href: "/blog/shift-left-testing-qa-na-era-do-devops" },
      },
      {
        id: "f4-05",
        titulo: "Git básico para QA",
        descricao: "Clone, checkout de branch, como testar uma feature branch antes do merge. Você não precisa codar — mas precisa saber navegar o código.",
      },
      {
        id: "f4-06",
        titulo: "Ambientes e paridade",
        descricao: "Dev vs. staging vs. produção: diferenças de dados, configuração e infraestrutura. Por que 'funciona no dev' não é suficiente e o que perguntar sobre cada ambiente.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 5
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-5",
    numero: 5,
    titulo: "Programação para QA",
    descricao: "O mínimo de JavaScript/TypeScript e Node.js que você precisa para escrever e entender testes automatizados.",
    nivel: "intermediario",
    icon: "💻",
    items: [
      {
        id: "f5-01",
        titulo: "JavaScript/TypeScript essencial",
        descricao: "Variáveis (const/let), tipos básicos, funções, arrow functions, template literals. Ler e escrever o código de um teste simples sem travar.",
      },
      {
        id: "f5-02",
        titulo: "Estruturas de controle e dados",
        descricao: "if/else, loops (for, forEach, map, filter), arrays e objetos, destructuring. O necessário para ler fixtures de teste e manipular dados de API.",
      },
      {
        id: "f5-03",
        titulo: "Async/await e Promises",
        descricao: "Por que testes de UI e API são assíncronos. Como usar async/await sem criar race conditions. O erro mais comum de iniciantes em automação.",
      },
      {
        id: "f5-04",
        titulo: "Módulos e organização de código",
        descricao: "import/export, como separar page objects, helpers e configurações em arquivos diferentes. Estrutura que o time inteiro consegue manter.",
      },
      {
        id: "f5-05",
        titulo: "Tratamento de erros",
        descricao: "try/catch, como identificar onde o erro ocorreu, como escrever assertions que dão mensagens de erro úteis quando falham.",
      },
      {
        id: "f5-06",
        titulo: "Node.js e npm básico",
        descricao: "O que é Node.js, por que a maioria dos frameworks de automação roda nele. package.json, instalar dependências, rodar scripts no terminal.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 6
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-6",
    numero: 6,
    titulo: "Testes de API",
    descricao: "Do HTTP básico ao Postman avançado: testar APIs REST de forma sistemática, incluindo autenticação, schemas e cenários de erro.",
    nivel: "intermediario",
    icon: "🔌",
    items: [
      {
        id: "f6-01",
        titulo: "HTTP: verbos, status codes e headers",
        descricao: "GET/POST/PUT/PATCH/DELETE e quando usar cada um. 200/201/400/401/403/404/422/500 — o que cada código significa para o QA. Content-Type, Authorization.",
        recurso: { label: "Praticar no API Playground", href: "/api-playground" },
      },
      {
        id: "f6-02",
        titulo: "Postman na prática",
        descricao: "Criar requests, configurar environments e variáveis, pre-request scripts, assertions no Tests tab. O básico que todo QA de API precisa dominar.",
      },
      {
        id: "f6-03",
        titulo: "REST: princípios e boas práticas",
        descricao: "Recursos, endpoints RESTful, idempotência, stateless. Como identificar se uma API está bem ou mal projetada — e o que perguntar ao dev.",
      },
      {
        id: "f6-04",
        titulo: "Autenticação em APIs",
        descricao: "API Key, Bearer token, OAuth2 básico. Testar com token válido, inválido, expirado e ausente. O que cada resposta deve retornar em cada caso.",
      },
      {
        id: "f6-05",
        titulo: "Validação de schema",
        descricao: "Verificar que a resposta tem a estrutura correta: campos obrigatórios, tipos, formatos. JSON Schema básico como documentação viva do contrato.",
      },
      {
        id: "f6-06",
        titulo: "Testando erros e edge cases",
        descricao: "Campos ausentes, tipos errados, strings com caracteres especiais, payloads enormes, concorrência. A API se comporta corretamente quando o input é inválido?",
        recurso: { label: "Missões de API no Playground", href: "/api-playground" },
      },
      {
        id: "f6-07",
        titulo: "Collections e fluxos no Postman",
        descricao: "Organizar testes em fluxos end-to-end: criar → buscar → atualizar → deletar. Runner de collections, encadear requests passando dados entre elas.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 7
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-7",
    numero: 7,
    titulo: "Automação Web com Playwright",
    descricao: "Do primeiro script ao Page Object Model: automatizar fluxos de UI de forma estável, legível e fácil de manter.",
    nivel: "intermediario",
    icon: "🤖",
    items: [
      {
        id: "f7-01",
        titulo: "O que vale a pena automatizar",
        descricao: "ROI da automação: testes repetitivos, fluxos críticos, smoke de regressão. O que deve ficar manual e por quê — automação ruim é pior que nenhuma.",
      },
      {
        id: "f7-02",
        titulo: "Setup do Playwright",
        descricao: "Instalar, configurar playwright.config.ts: browsers, base URL, timeouts, screenshots on failure, modo headed vs. headless.",
      },
      {
        id: "f7-03",
        titulo: "Seletores robustos",
        descricao: "Hierarquia de seletores: role > label > texto > test-id > CSS. Por que XPath quebra a cada mudança de UI. Como pedir data-testid ao dev.",
      },
      {
        id: "f7-04",
        titulo: "Assertions que esperam",
        descricao: "toBeVisible(), toHaveText(), toHaveValue(), toBeEnabled(). Por que as assertions do Playwright já fazem retry automático — e nunca use sleep().",
      },
      {
        id: "f7-05",
        titulo: "Page Object Model (POM)",
        descricao: "Separar seletores e ações em classes reutilizáveis. LoginPage, CartPage, CheckoutPage. Por que POM reduz manutenção drasticamente quando a UI muda.",
      },
      {
        id: "f7-06",
        titulo: "Testando fluxos completos",
        descricao: "Login, formulários com validação, navegação multi-página, upload de arquivo, modais, alerts. Cobrir o happy path e os principais sad paths.",
        recurso: { label: "Praticar no E-commerce", href: "/ecommerce" },
      },
      {
        id: "f7-07",
        titulo: "Debug de testes quebrados",
        descricao: "Headed mode para ver o que acontece, Playwright Inspector (--debug) para inspecionar passo a passo, Trace Viewer para analisar falhas no CI.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FASE 8
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "fase-8",
    numero: 8,
    titulo: "CI/CD e QA no Pipeline",
    descricao: "Integrar testes automatizados ao pipeline de entrega, configurar quality gates e fazer os testes rodarem em cada PR.",
    nivel: "intermediario",
    icon: "⚙️",
    items: [
      {
        id: "f8-01",
        titulo: "O que é CI/CD e por que importa para QA",
        descricao: "Integração contínua: todo commit valida. Entrega contínua: cada build está pronto para produção. O QA que entende o pipeline influencia onde os testes entram.",
      },
      {
        id: "f8-02",
        titulo: "GitHub Actions básico",
        descricao: "Workflows, triggers (push, pull_request), jobs, steps, actions prontas. Ler e entender um arquivo .yml de pipeline existente.",
      },
      {
        id: "f8-03",
        titulo: "Rodando testes no pipeline",
        descricao: "Job de testes: checkout, setup Node, instalar Playwright, rodar os testes, publicar artefatos (HTML report, screenshots de falha).",
      },
      {
        id: "f8-04",
        titulo: "Quality gates",
        descricao: "Branch protection rules: testes precisam passar antes do merge. Status checks obrigatórios no GitHub. Como bloquear código ruim de entrar na main.",
      },
      {
        id: "f8-05",
        titulo: "Relatórios de teste no pipeline",
        descricao: "Playwright HTML report como artefato de CI, comentar resultado no PR, notificação de falha no Slack. Visibilidade que acelera o debugging.",
      },
      {
        id: "f8-06",
        titulo: "O que vem depois",
        descricao: "Testes de performance (k6), contract testing (Pact), security testing (OWASP), observabilidade em produção. O mapa para o nível sênior.",
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function countFaseItems(fase: RoadmapFase): number {
  return fase.items.length;
}

export function countAllItems(): number {
  return fases.reduce((sum, f) => sum + f.items.length, 0);
}
