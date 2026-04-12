// ==============================
// Types
// ==============================

export type BlockType =
  | "paragraph"
  | "heading"
  | "subheading"
  | "list"
  | "ordered-list"
  | "callout"
  | "code"
  | "quote"
  | "divider";

export interface Block {
  type: BlockType;
  content?: string;
  items?: string[];
  language?: string;
  variant?: "info" | "warning" | "tip" | "danger";
}

export interface BlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string;
  tags: string[];
  tempoLeitura: number;
  destaque?: boolean;
  blocos: Block[];
}

// ==============================
// Posts
// ==============================

export const posts: BlogPost[] = [
  {
    slug: "testes-exploratorios-como-pensar-como-usuario-real",
    titulo: "Testes Exploratórios: Como Pensar Como um Usuário Real",
    resumo:
      "O teste exploratório vai além dos scripts. Descubra como desenvolver o raciocínio investigativo que transforma um QA em um verdadeiro caçador de bugs.",
    autor: "QA Lab",
    data: "2025-01-15",
    tags: ["Exploratório", "Fundamentos", "Técnicas"],
    tempoLeitura: 7,
    destaque: true,
    blocos: [
      {
        type: "paragraph",
        content:
          "Quando a maioria das pessoas pensa em testes de software, imagina planilhas com centenas de casos de teste numerados, cada um com passos precisos a seguir. Essa é a realidade dos testes scripted — e ela tem seu valor. Mas existe um tipo de teste que é simultaneamente mais desafiador e mais recompensador: o teste exploratório.",
      },
      {
        type: "heading",
        content: "O que é teste exploratório?",
      },
      {
        type: "paragraph",
        content:
          "Teste exploratório é uma abordagem simultânea de aprendizado, design de teste e execução. Em vez de seguir um roteiro fixo, o testador usa sua inteligência, curiosidade e conhecimento do sistema para descobrir problemas que nenhum script previsto encontraria.",
      },
      {
        type: "callout",
        variant: "tip",
        content:
          "Pense assim: um teste scripted pergunta 'O sistema faz o que esperamos que faça?' O teste exploratório pergunta 'O que mais esse sistema pode fazer — e o que acontece quando ele faz?'",
      },
      {
        type: "heading",
        content: "A mentalidade do testador exploratório",
      },
      {
        type: "paragraph",
        content:
          "Desenvolver o raciocínio exploratório é uma habilidade que se aprende. Existe uma série de perguntas que um bom testador faz inconscientemente ao explorar qualquer funcionalidade:",
      },
      {
        type: "list",
        items: [
          "O que acontece se eu fizer exatamente o oposto do que é esperado?",
          "Qual é o valor mínimo e máximo que esse campo aceita?",
          "O que acontece se eu deixar esse campo vazio e prosseguir?",
          "Consigo repetir essa ação duas vezes seguidas?",
          "O que acontece se eu interromper o fluxo no meio?",
          "Isso funciona da mesma forma em diferentes navegadores e dispositivos?",
        ],
      },
      {
        type: "heading",
        content: "Sessões de teste exploratório",
      },
      {
        type: "paragraph",
        content:
          "Uma técnica popular é o Session-Based Test Management (SBTM). A ideia é simples: defina um foco (charter), explore por um tempo determinado (30 a 90 minutos) e documente o que encontrou. Isso combina a liberdade do exploratório com a estrutura necessária para comunicar resultados.",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "Exemplo de charter: 'Explorar o fluxo de checkout do e-commerce focando em estados de erro e validações de formulário por 45 minutos.'",
      },
      {
        type: "heading",
        content: "Heurísticas que todo QA deve conhecer",
      },
      {
        type: "paragraph",
        content:
          "Heurísticas são atalhos mentais para direcionar a exploração. Algumas das mais poderosas:",
      },
      {
        type: "ordered-list",
        items: [
          "CRUD — Criar, Ler, Atualizar, Deletar: teste todas as operações básicas de um recurso.",
          "Valores Limítrofes — teste 0, 1, máximo-1, máximo, máximo+1.",
          "Usuário Malicioso — tente injeção de SQL, XSS e inputs inesperados.",
          "Usuário Impaciente — clique duas vezes, pressione voltar, recarregue a página.",
          "Usuário Distante — teste com latência alta, conexão fraca, fuso horário diferente.",
        ],
      },
      {
        type: "heading",
        content: "Praticando no QA Lab",
      },
      {
        type: "paragraph",
        content:
          "O E-commerce do QA Lab foi construído especificamente para praticar teste exploratório. Não há um roteiro — você precisa descobrir os 7 bugs por conta própria usando exatamente as heurísticas descritas acima. Experimente ser o usuário impaciente: clique em 'Adicionar ao Carrinho' 10 vezes seguidas. O que acontece com o estoque?",
      },
      {
        type: "callout",
        variant: "warning",
        content:
          "Dica: documente tudo que encontrar, mesmo o que parece 'funcionar'. Às vezes o comportamento correto é o bug — o sistema faz o que foi programado, mas não o que deveria.",
      },
    ],
  },
  {
    slug: "testando-apis-do-basico-ao-chaos-engineering",
    titulo: "Testando APIs: Do Básico ao Chaos Engineering",
    resumo:
      "APIs são a espinha dorsal do software moderno. Aprenda a testá-las sistematicamente — dos casos básicos de sucesso até a simulação de falhas em produção.",
    autor: "QA Lab",
    data: "2025-01-22",
    tags: ["API", "Chaos Engineering", "Backend"],
    tempoLeitura: 9,
    blocos: [
      {
        type: "paragraph",
        content:
          "Uma API pode ter uma interface bonita e bem documentada e, ainda assim, falhar de formas catastróficas em produção. A razão? A maioria dos testes de API verifica apenas o caminho feliz — o que acontece quando tudo vai bem. Testes robustos precisam ir muito além disso.",
      },
      {
        type: "heading",
        content: "Os quatro pilares do teste de API",
      },
      {
        type: "ordered-list",
        items: [
          "Funcionalidade: a API faz o que a documentação diz que faz?",
          "Confiabilidade: ela funciona de forma consistente sob condições normais?",
          "Resiliência: como ela se comporta quando algo dá errado?",
          "Segurança: ela expõe dados ou permite operações que não deveria?",
        ],
      },
      {
        type: "heading",
        content: "Testando além do status 200",
      },
      {
        type: "paragraph",
        content:
          "O erro mais comum em testes de API é verificar apenas se a resposta tem status 200 e se o body não está vazio. Um teste bem feito verifica muito mais:",
      },
      {
        type: "list",
        items: [
          "O schema da resposta — todos os campos existem e têm os tipos corretos?",
          "A consistência — a mesma request feita 10 vezes retorna o mesmo resultado?",
          "Os status codes — 404 para recurso inexistente, 400 para dados inválidos, 422 para regras de negócio?",
          "Os headers — Content-Type, CORS, cache headers estão corretos?",
          "A performance — o tempo de resposta está dentro do SLA?",
        ],
      },
      {
        type: "callout",
        variant: "danger",
        content:
          "Bug real: um endpoint retorna status 200 OK mas o body contém {\"error\": \"Not Found\"}. Isso quebra qualquer cliente que verifique apenas o status code. Você consegue encontrar esse comportamento no API Playground do QA Lab?",
      },
      {
        type: "heading",
        content: "Testando com dados inválidos",
      },
      {
        type: "paragraph",
        content:
          "Cada campo da request é uma oportunidade para encontrar bugs. Para cada campo, tente:",
      },
      {
        type: "list",
        items: [
          "Valor null ou ausente",
          "String vazia ''",
          "Número negativo ou zero",
          "Valor muito grande (buffer overflow)",
          "Caracteres especiais e Unicode: <script>, '; DROP TABLE, 你好",
          "Tipo errado: string onde se espera number",
        ],
      },
      {
        type: "heading",
        content: "O que é Chaos Engineering?",
      },
      {
        type: "paragraph",
        content:
          "Chaos Engineering é a prática de introduzir falhas intencionais em um sistema para descobrir suas fraquezas antes que o ambiente de produção o faça. O conceito foi popularizado pela Netflix com o Chaos Monkey — um serviço que desligava servidores aleatoriamente em produção para garantir que o sistema sobrevivesse.",
      },
      {
        type: "callout",
        variant: "tip",
        content:
          "A premissa do Chaos Engineering: se você não testa como seu sistema falha, a produção vai testar por você — no pior momento possível.",
      },
      {
        type: "heading",
        content: "Chaos Mode no QA Lab",
      },
      {
        type: "paragraph",
        content:
          "O API Playground do QA Lab tem um Modo Caos que simula exatamente esses cenários. Quando ativado, os endpoints começam a: retornar 500 aleatoriamente, adicionar delays artificiais, retornar dados incorretos e fazer timeout. Ative-o e observe como o frontend se comporta — ele lida bem com essas falhas ou quebra completamente?",
      },
      {
        type: "code",
        language: "bash",
        content: `# Ativar Chaos Mode para todos os endpoints
POST /api/_chaos/toggle
{ "enabled": true }

# Ativar apenas para um endpoint específico
POST /api/_chaos/config
{ "endpoint": "GET /api/users", "config": { "enabled": true, "errorRate": 50 } }`,
      },
    ],
  },
  {
    slug: "bugs-de-data-hora-e-timezone",
    titulo: "Bugs de Data, Hora e Timezone: Os Mais Difíceis de Encontrar",
    resumo:
      "Bugs relacionados a datas são responsáveis por falhas em sistemas financeiros, agendamentos e integrações globais. Veja por que eles são tão difíceis e como testá-los.",
    autor: "QA Lab",
    data: "2025-02-03",
    tags: ["Datas", "Timezone", "Edge Cases"],
    tempoLeitura: 6,
    blocos: [
      {
        type: "paragraph",
        content:
          "Existe uma categoria especial de bugs que atormenta desenvolvedores e testadores: os bugs de data e hora. Eles aparecem silenciosamente, frequentemente só em produção, e costumam causar impactos financeiros reais. Em 2012, um bug de timezone causou prejuízo de 440 milhões de dólares em 45 minutos para a empresa Knight Capital.",
      },
      {
        type: "heading",
        content: "Por que datas são tão complicadas?",
      },
      {
        type: "list",
        items: [
          "Anos bissextos: 2024 tem 366 dias, 2023 tem 365. Fevereiro muda de tamanho.",
          "Horário de verão: relógios avançam e atrasam em datas diferentes em cada país.",
          "Timezones: existem mais de 400 fusos horários, alguns com offsets de 30 ou 45 minutos.",
          "Calendários diferentes: o mundo não usa só o calendário gregoriano.",
          "Unix timestamp: tem limite de 32 bits — o problema do ano 2038.",
          "Meses com tamanhos diferentes: 28, 29, 30 ou 31 dias.",
        ],
      },
      {
        type: "heading",
        content: "Os casos de teste essenciais para datas",
      },
      {
        type: "callout",
        variant: "tip",
        content:
          "Regra de ouro: nunca confie que uma data 'parece certa'. Sempre teste com casos extremos.",
      },
      {
        type: "ordered-list",
        items: [
          "29/02 em ano não bissexto (ex: 29/02/2023 — não existe)",
          "31/12 às 23:59 passando para 01/01 do ano seguinte",
          "Datas no início e fim do horário de verão",
          "Diferença de timezone que atravessa meia-noite (São Paulo 23:00 = Tóquio 11:00 do dia seguinte)",
          "Unix timestamp 0 (01/01/1970 00:00:00 UTC)",
          "Ano 2038 (limite do int32 para timestamps Unix)",
          "Datas muito antigas (antes de 1900) e muito futuras (após 2100)",
          "Strings de data em formatos ambíguos: 01/02/2024 — é janeiro ou fevereiro?",
        ],
      },
      {
        type: "heading",
        content: "O bug do timezone que ninguém percebe",
      },
      {
        type: "paragraph",
        content:
          "Um dos bugs mais comuns: o servidor salva a data em UTC, mas a exibe sem converter para o timezone do usuário. Um usuário em São Paulo (UTC-3) agenda uma reunião para 15:00. O sistema salva como 15:00 UTC. Quando outro usuário em Lisboa (UTC+0) abre o sistema, vê a reunião marcada para 15:00 — mas ambos estão lendo o mesmo timestamp, sem conversão.",
      },
      {
        type: "code",
        language: "javascript",
        content: `// Bug comum: salvar sem considerar timezone
const data = new Date("2024-03-15T15:00:00"); // Qual timezone?

// Correto: sempre usar UTC explicitamente
const dataUTC = new Date("2024-03-15T15:00:00Z"); // Z = UTC
const dataLocal = new Date("2024-03-15T15:00:00-03:00"); // São Paulo`,
      },
      {
        type: "heading",
        content: "Praticando no QA Lab",
      },
      {
        type: "paragraph",
        content:
          "O módulo de Datas do QA Lab tem 10 bugs propositais envolvendo exatamente esses cenários: um timer que continua rodando mesmo pausado, um calendário com dias da semana errados, cálculos de expiração que ignoram meses com tamanhos diferentes, e conversões de timezone que usam offsets aleatórios. É o laboratório perfeito para desenvolver o instinto para esse tipo de bug.",
      },
    ],
  },
  {
    slug: "como-escrever-casos-de-teste-que-realmente-funcionam",
    titulo: "Como Escrever Casos de Teste que Realmente Funcionam",
    resumo:
      "Um bom caso de teste é aquele que qualquer pessoa consegue executar e que encontra bugs quando algo está errado. Veja os princípios para escrever testes que realmente valem.",
    autor: "QA Lab",
    data: "2025-02-10",
    tags: ["Casos de Teste", "Documentação", "Processos"],
    tempoLeitura: 8,
    blocos: [
      {
        type: "paragraph",
        content:
          "Você já pegou um caso de teste escrito por outra pessoa e não fez ideia do que precisava testar? Ou executou um teste, não encontrou nenhum bug, mas depois descobriu que um defeito grave passou despercebido? Esses são sintomas de casos de teste mal escritos — e é um problema muito mais comum do que parece.",
      },
      {
        type: "heading",
        content: "O que faz um caso de teste ser bom?",
      },
      {
        type: "list",
        items: [
          "Qualquer pessoa consegue executá-lo sem precisar perguntar nada",
          "O resultado esperado é específico e verificável, não vago",
          "Ele encontra o bug quando o bug está lá",
          "Não é redundante com outros casos de teste",
          "É independente — não depende da execução de outro teste",
        ],
      },
      {
        type: "heading",
        content: "A estrutura clássica: Given / When / Then",
      },
      {
        type: "paragraph",
        content:
          "A estrutura Given/When/Then (Dado/Quando/Então) vem do BDD (Behavior-Driven Development) e é excelente para escrever casos de teste claros:",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "DADO que estou na página de checkout com 2 itens no carrinho\nQUANDO eu digito o CEP '00000000' e clico em 'Calcular Frete'\nENTÃO devo ver a mensagem 'CEP inválido' e o campo de frete deve permanecer vazio",
      },
      {
        type: "heading",
        content: "O erro mais comum: resultado esperado vago",
      },
      {
        type: "paragraph",
        content:
          "O maior problema em casos de teste é o resultado esperado mal definido. Compare os dois exemplos abaixo:",
      },
      {
        type: "callout",
        variant: "danger",
        content: "❌ Ruim: 'O sistema deve exibir uma mensagem de erro'\n✅ Bom: 'O sistema deve exibir a mensagem \"E-mail inválido\" em vermelho abaixo do campo e-mail, e o botão Salvar deve permanecer desabilitado'",
      },
      {
        type: "heading",
        content: "Tipos de casos de teste que você precisa ter",
      },
      {
        type: "ordered-list",
        items: [
          "Caminho feliz — o fluxo principal funcionando perfeitamente",
          "Casos negativos — o que acontece com dados inválidos",
          "Valores limítrofes — mínimo, máximo, mínimo-1, máximo+1",
          "Campos obrigatórios — o que acontece quando estão vazios",
          "Permissões — um usuário sem permissão consegue acessar?",
          "Concorrência — o que acontece se dois usuários fazem a mesma ação ao mesmo tempo?",
        ],
      },
      {
        type: "heading",
        content: "Usando o módulo de Cenários do QA Lab",
      },
      {
        type: "paragraph",
        content:
          "O módulo de Cenários do QA Lab foi construído exatamente no estilo de um Azure DevOps Test Plans. Você pode criar suites, adicionar casos de teste manuais com passos e resultados esperados, vincular a cenários guiados existentes e registrar o resultado de cada execução. É o ambiente ideal para praticar a criação de casos de teste bem estruturados antes de fazer isso em um projeto real.",
      },
    ],
  },
  {
    slug: "shift-left-testing-qa-na-era-do-devops",
    titulo: "Shift-Left Testing: QA na Era do DevOps",
    resumo:
      "Testar tarde custa caro. O movimento shift-left defende que qualidade deve ser construída desde o início — e isso muda tudo na forma de trabalhar de um QA.",
    autor: "QA Lab",
    data: "2025-02-18",
    tags: ["DevOps", "Shift-Left", "Estratégia"],
    tempoLeitura: 6,
    blocos: [
      {
        type: "paragraph",
        content:
          "Existe uma regra clássica na indústria de software: o custo de corrigir um bug aumenta exponencialmente quanto mais tarde ele é encontrado. Um bug encontrado durante o desenvolvimento custa 1x. O mesmo bug encontrado em produção pode custar 100x ou mais — em tempo, reputação e, às vezes, em processos judiciais.",
      },
      {
        type: "heading",
        content: "O que significa 'shift-left'?",
      },
      {
        type: "paragraph",
        content:
          "Se você imaginar o ciclo de desenvolvimento como uma linha do tempo da esquerda (planejamento) para a direita (produção), 'shift-left' significa mover as atividades de teste para mais cedo nessa linha. Em vez de testar só no final, você testa desde o início.",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "Modelo tradicional: Requisitos → Desenvolvimento → QA → Produção\nShift-Left: QA está em TODAS as etapas simultaneamente",
      },
      {
        type: "heading",
        content: "O papel do QA mudou",
      },
      {
        type: "paragraph",
        content:
          "No modelo shift-left, um QA não é mais a última linha de defesa antes da produção. As responsabilidades se expandem:",
      },
      {
        type: "list",
        items: [
          "Revisar requisitos antes de qualquer código ser escrito",
          "Identificar ambiguidades e casos de borda nas histórias de usuário",
          "Colaborar na criação de critérios de aceitação",
          "Automatizar testes junto com o desenvolvimento (não depois)",
          "Participar do design de APIs e contratos de integração",
          "Monitorar qualidade em produção com métricas e alertas",
        ],
      },
      {
        type: "heading",
        content: "Por que o Board de Tarefas importa aqui",
      },
      {
        type: "paragraph",
        content:
          "O Board de Tarefas do QA Lab simula exatamente esse workflow. Cada história de desenvolvimento já vem com os bugs conhecidos mapeados e os cenários de teste vinculados. Isso é shift-left na prática: antes mesmo de o desenvolvedor terminar a feature, o QA já sabe o que testar, quais são os riscos e onde ficam os casos de borda.",
      },
      {
        type: "callout",
        variant: "tip",
        content:
          "Prática: abra o Board de Tarefas e, para uma tarefa em 'Backlog', tente escrever os casos de teste antes de 'desenvolver' a feature. Quais edge cases você consegue identificar só lendo a descrição?",
      },
      {
        type: "heading",
        content: "Métricas de qualidade que todo QA deveria acompanhar",
      },
      {
        type: "ordered-list",
        items: [
          "Escape rate: porcentagem de bugs encontrados em produção vs. em desenvolvimento",
          "Test coverage: cobertura de código pelos testes automatizados",
          "MTTR (Mean Time to Repair): tempo médio para corrigir um bug após ser detectado",
          "Defect density: número de bugs por linha de código ou por feature",
          "Test execution rate: quantos casos de teste são executados antes de cada release",
        ],
      },
    ],
  },
  {
    slug: "timing-e-waits",
    titulo: "Timing e Waits: como parar de escrever testes flaky",
    resumo:
      "Testes que passam na sua máquina mas falham no CI. Testes que precisam de um sleep(3000) para funcionar. Entenda por que isso acontece e como explicit waits resolvem de vez.",
    autor: "JV Centrone",
    data: "2026-03-20",
    tags: ["Playwright", "Automação", "Flaky Tests", "Timing"],
    tempoLeitura: 8,
    blocos: [
      {
        type: "paragraph",
        content:
          "Testes flaky — aqueles que passam às vezes e falham às outras sem mudança de código — têm uma causa raiz em mais de 80% dos casos: suposições de timing. O teste assume que um elemento já está na tela, ou que uma requisição já terminou, quando na realidade ainda não.",
      },
      {
        type: "heading",
        content: "O problema: testes que assumem estado",
      },
      {
        type: "paragraph",
        content:
          "Quando você clica num botão que dispara uma chamada de API e logo em seguida verifica o resultado, está assumindo que a API respondeu instantaneamente. Em desenvolvimento local, com cache quente e conexão rápida, isso quase sempre funciona. No CI, com máquina mais lenta, sem cache e mais carga, falha.",
      },
      {
        type: "code",
        language: "typescript",
        content: `// ❌ Frágil: assume que a mensagem já apareceu
await page.click('[data-testid="salvar-btn"]')
expect(await page.textContent('[data-testid="status"]')).toBe('Salvo')

// ✅ Robusto: espera a condição ser verdadeira
await page.click('[data-testid="salvar-btn"]')
await expect(page.locator('[data-testid="status"]')).toHaveText('Salvo')`,
      },
      {
        type: "callout",
        variant: "danger",
        content:
          "Nunca use sleep() ou page.waitForTimeout() como solução permanente. É um band-aid que esconde o problema real e torna os testes lentos sem garantia de estabilidade.",
      },
      {
        type: "heading",
        content: "Implicit vs. Explicit Waits",
      },
      {
        type: "paragraph",
        content:
          "Implicit wait define um timeout global: 'se não encontrar o elemento, tenta por até X segundos'. O problema é que isso vale para TODAS as buscas, mesmo as que deveriam falhar rápido, tornando os testes lentos e mascarando erros reais.",
      },
      {
        type: "paragraph",
        content:
          "Explicit wait espera uma condição específica. É preciso, comunicativo e não afeta o restante da suite.",
      },
      {
        type: "subheading",
        content: "Os waits mais úteis no Playwright",
      },
      {
        type: "list",
        items: [
          "toBeVisible() — elemento está no DOM e visível na tela",
          "toHaveText() — texto do elemento corresponde ao esperado",
          "toHaveValue() — valor de input corresponde ao esperado",
          "toBeEnabled() / toBeDisabled() — estado do elemento",
          "waitForURL() — aguarda a URL mudar (ideal após navegação)",
          "waitForResponse() — aguarda uma requisição de rede específica",
          "waitForLoadState('networkidle') — aguarda rede parar de fazer requests",
        ],
      },
      {
        type: "heading",
        content: "O padrão correto para carregamento assíncrono",
      },
      {
        type: "paragraph",
        content:
          "Quando um elemento aparece após uma ação (clique, submit, navegação), sempre espere pela condição resultante — não pelo elemento que disparou a ação.",
      },
      {
        type: "code",
        language: "typescript",
        content: `// Cenário: clicar em 'Carregar dados' e aguardar o conteúdo aparecer
// Seletor: [data-testid="gatilho-btn"] e [data-testid="gatilho-conteudo"]

test('deve carregar dados após clicar no botão', async ({ page }) => {
  await page.goto('/elementos')

  // O conteúdo ainda não existe
  await expect(
    page.locator('[data-testid="gatilho-conteudo"]')
  ).not.toBeVisible()

  // Clica no gatilho
  await page.click('[data-testid="gatilho-btn"]')

  // Espera o conteúdo aparecer (até o timeout padrão de 30s)
  await expect(
    page.locator('[data-testid="gatilho-conteudo"]')
  ).toBeVisible()
})`,
      },
      {
        type: "heading",
        content: "Polling: quando o conteúdo muda sozinho",
      },
      {
        type: "paragraph",
        content:
          "Alguns elementos atualizam periodicamente sem interação do usuário — dashboards em tempo real, contadores, status de processamento. Para esses casos, use expect.poll() ou waitForFunction().",
      },
      {
        type: "code",
        language: "typescript",
        content: `// Aguarda o contador chegar em 3 (atualiza a cada 2s)
await expect.poll(
  async () => {
    const text = await page.textContent('[data-testid="poll-contador"]')
    return Number(text)
  },
  { timeout: 10_000 }
).toBeGreaterThanOrEqual(3)`,
      },
      {
        type: "heading",
        content: "Retry após falha de rede",
      },
      {
        type: "paragraph",
        content:
          "Aplicações reais têm estados de erro e botões de retry. Seu teste deve validar o estado de erro E o estado de sucesso após o retry — não assumir que sempre vai dar certo.",
      },
      {
        type: "code",
        language: "typescript",
        content: `test('deve recuperar após falha de rede', async ({ page }) => {
  await page.goto('/elementos')
  await page.getByRole('tab', { name: 'Carregamento' }).click()

  // Verifica o estado de erro inicial
  await expect(
    page.locator('[data-testid="retry-erro"]')
  ).toBeVisible()

  // Clica em retry
  await page.click('[data-testid="retry-btn"]')

  // Aguarda a recuperação
  await expect(
    page.locator('[data-testid="retry-conteudo"]')
  ).toBeVisible()
})`,
      },
      {
        type: "callout",
        variant: "tip",
        content:
          "O módulo Elementos do QA Lab tem todos esses padrões implementados com data-testid prontos para você praticar: auto-carregamento, gatilho, retry e polling.",
      },
      {
        type: "heading",
        content: "Checklist anti-flaky",
      },
      {
        type: "list",
        items: [
          "Nunca use sleep() — sempre prefira waits condicionais",
          "Após qualquer clique que muda estado, espere pela mudança — não pelo clique",
          "Use toBeVisible() em vez de verificar o DOM diretamente",
          "Para formulários, aguarde toHaveValue() antes de verificar resultado",
          "Para navegação, use waitForURL() ou waitForLoadState()",
          "Para APIs, use waitForResponse() para garantir que o request terminou",
          "Rode seus testes 3x seguidas em modo headless antes de considerar estáveis",
        ],
      },
    ],
  },
];

// ==============================
// Helpers
// ==============================

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  return posts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
