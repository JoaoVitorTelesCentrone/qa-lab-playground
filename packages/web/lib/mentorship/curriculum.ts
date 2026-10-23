export type MentorshipReference = { title: string; organization: string; url: string };
export type MentorshipConcept = { title: string; content: string };

export type MentorshipWeekContent = {
  week: number;
  promise: string;
  outcomes: string[];
  concepts: MentorshipConcept[];
  guidedPractice: string[];
  checkpoints: string[];
  commonMistakes: string[];
  mentorQuestions: string[];
  references: MentorshipReference[];
};

const istqb = { title: "Certified Tester Foundation Level v4.0", organization: "ISTQB", url: "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/" };
const playwrightBestPractices = { title: "Best Practices", organization: "Playwright", url: "https://playwright.dev/docs/best-practices" };
const playwrightWaiting = { title: "Auto-waiting and actionability", organization: "Playwright", url: "https://playwright.dev/docs/actionability" };
const playwrightFixtures = { title: "Test fixtures", organization: "Playwright", url: "https://playwright.dev/docs/test-fixtures" };
const cypressBestPractices = { title: "Best practices", organization: "Cypress", url: "https://docs.cypress.io/app/core-concepts/best-practices" };
const cypressRetry = { title: "Retry-ability", organization: "Cypress", url: "https://docs.cypress.io/app/core-concepts/retry-ability" };
const postmanScripts = { title: "Write scripts to test API response data", organization: "Postman", url: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts" };
const postmanRunner = { title: "Test APIs using the Collection Runner", organization: "Postman", url: "https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs" };
const owaspWstg = { title: "Web Security Testing Guide", organization: "OWASP", url: "https://owasp.org/projects/web-security-testing-guide" };
const owaspApi = { title: "API Security Top 10", organization: "OWASP", url: "https://owasp.org/API-Security/" };
const githubActions = { title: "Understanding GitHub Actions", organization: "GitHub", url: "https://docs.github.com/actions/get-started/understand-github-actions" };
const githubMatrix = { title: "Running variations of jobs in a workflow", organization: "GitHub", url: "https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow" };
const githubContexts = { title: "Contexts reference", organization: "GitHub", url: "https://docs.github.com/actions/reference/workflows-and-actions/contexts" };
const k6Thresholds = { title: "Thresholds", organization: "Grafana k6", url: "https://grafana.com/docs/k6/latest/using-k6/thresholds/" };
const k6Api = { title: "API load testing", organization: "Grafana k6", url: "https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/" };
const wcagTools = { title: "Web Accessibility Evaluation Tools", organization: "W3C WAI", url: "https://www.w3.org/WAI/test-evaluate/tools/list/" };
const wcagReport = { title: "WCAG-EM Report Tool", organization: "W3C WAI", url: "https://www.w3.org/WAI/eval/report-tool/" };
const scrumGuide = { title: "The Scrum Guide", organization: "Scrum Guides", url: "https://scrumguides.org/scrum-guide.html" };
const kanbanGuide = { title: "The Kanban Guide", organization: "Kanban Guides", url: "https://kanbanguides.org/the-kanban-guide" };
const gherkinReference = { title: "Gherkin Reference", organization: "Cucumber", url: "https://cucumber.io/docs/gherkin/reference/" };
const azureTestPlans = { title: "Azure Test Plans documentation", organization: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/azure/devops/test/" };
const gitBook = { title: "Pro Git", organization: "Git", url: "https://git-scm.com/book/en/v2" };
const chromeDevTools = { title: "Chrome DevTools documentation", organization: "Chrome for Developers", url: "https://developer.chrome.com/docs/devtools/" };
const lighthouse = { title: "Introduction to Lighthouse", organization: "Chrome for Developers", url: "https://developer.chrome.com/docs/lighthouse/overview/" };
const locust = { title: "Locust documentation", organization: "Locust", url: "https://docs.locust.io/" };
const azurePipelines = { title: "Azure Pipelines documentation", organization: "Microsoft Learn", url: "https://learn.microsoft.com/azure/devops/pipelines/" };
const appInsights = { title: "Application Insights overview", organization: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/azure/azure-monitor/app/overview-dashboard" };
const xunitOfficial = { title: "Unit testing C# using xUnit", organization: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-xunit" };
const jestOfficial = { title: "Getting Started", organization: "Jest", url: "https://jestjs.io/docs/getting-started" };

export const mentorshipCurriculum: MentorshipWeekContent[] = [
  {
    week: 1,
    promise: "Sair do papel de executor de casos e começar a investigar produto, impacto e risco.",
    outcomes: ["Explicar por que testar não é provar ausência de defeitos", "Mapear fluxo, regra, dado e dependência", "Priorizar riscos por probabilidade e impacto", "Transformar dúvida de negócio em hipótese testável"],
    concepts: [
      { title: "Qualidade depende de contexto", content: "Um comportamento pode estar tecnicamente correto e ainda falhar para o usuário ou para o negócio. Antes de testar, identifique quem usa, qual objetivo precisa alcançar, quais dados circulam e qual prejuízo existe se o fluxo falhar." },
      { title: "Teste reduz incerteza", content: "O trabalho de QA produz informação para uma decisão. Cada teste deve responder a uma pergunta: este risco está controlado o suficiente para seguirmos? Isso muda a conversa de quantidade de casos para valor da evidência." },
      { title: "Modelo de produto", content: "Represente entradas, regras, estados, saídas, integrações e atores. O modelo não precisa ser perfeito; precisa revelar lacunas e orientar onde observar primeiro." },
      { title: "Risco como critério de ordem", content: "Combine probabilidade, impacto e detectabilidade. Um erro raro que causa perda financeira pode vir antes de um erro frequente apenas visual. Registre a justificativa para tornar a prioridade discutível e auditável." },
    ],
    guidedPractice: ["Percorra o sistema uma vez sem registrar bugs e descreva o objetivo do usuário", "Desenhe o fluxo principal do início ao resultado", "Liste falhas possíveis em regra, dado, integração, segurança e usabilidade", "Escolha cinco riscos e classifique impacto e probabilidade", "Escreva uma pergunta de negócio para cada risco"],
    checkpoints: ["Consigo explicar o produto sem citar telas", "Cada risco possui causa, evento e impacto", "Minha ordem de teste tem uma justificativa", "Separo observação, hipótese e conclusão"],
    commonMistakes: ["Começar clicando sem uma pergunta", "Confundir quantidade de testes com cobertura", "Tratar todo defeito com a mesma prioridade"],
    mentorQuestions: ["Qual falha faria você interromper a release?", "Que informação está faltando para reduzir o maior risco?", "O que você decidiu não testar agora e por quê?"],
    references: [istqb],
  },
  {
    week: 2,
    promise: "Executar sessões exploratórias curtas que geram descobertas reproduzíveis e próximos passos claros.",
    outcomes: ["Escrever um charter com missão e limite", "Usar heurísticas sem transformar teste em checklist cego", "Registrar cobertura, achados e dúvidas", "Diferenciar exploração de navegação aleatória"],
    concepts: [
      { title: "Charter", content: "Defina alvo, recursos, riscos e tempo. Uma missão útil é específica o bastante para orientar e aberta o bastante para permitir aprendizagem durante a execução." },
      { title: "Sessão com timebox", content: "Use blocos de 30 a 60 minutos. Separe execução, investigação e documentação para perceber onde o tempo foi gasto e evitar uma sessão sem conclusão." },
      { title: "Heurísticas", content: "Explore limites, sequências, interrupções, estados, permissões, dados incompletos e repetição. Heurística é uma lente para gerar perguntas, não uma garantia de cobertura." },
      { title: "Debrief", content: "Ao final, relate o que cobriu, o que descobriu, o que ficou bloqueado e qual sessão deve vir depois. O aprendizado é parte do entregável." },
    ],
    guidedPractice: ["Escolha um risco da semana anterior", "Escreva um charter de uma frase", "Defina três heurísticas e um timebox de 40 minutos", "Registre ações, observações, perguntas e evidências", "Faça um debrief de cinco minutos com recomendação"],
    checkpoints: ["A missão cabe no tempo", "Os achados têm evidência", "Sei dizer o que não foi coberto", "A próxima investigação nasce do que aprendi"],
    commonMistakes: ["Confundir liberdade com ausência de método", "Parar a sessão para escrever um relatório longo", "Registrar conclusão sem evidência"],
    mentorQuestions: ["Qual foi a descoberta mais inesperada?", "Que heurística trouxe mais valor?", "Como você mudaria a próxima sessão?"],
    references: [istqb],
  },
  {
    week: 3,
    promise: "Projetar cobertura enxuta para regras, limites e combinações sem produzir casos redundantes.",
    outcomes: ["Aplicar partição de equivalência e valor limite", "Montar tabela de decisão para regras combinadas", "Derivar transições de estado", "Vincular cenário a risco e resultado esperado"],
    concepts: [
      { title: "Equivalência", content: "Agrupe entradas que o sistema deve tratar da mesma forma e escolha representantes. O objetivo é reduzir combinações sem perder classes de comportamento relevantes." },
      { title: "Valores limite", content: "Defeitos aparecem com frequência nas bordas. Teste imediatamente abaixo, no limite e imediatamente acima, considerando limites inclusivos e exclusivos." },
      { title: "Tabela de decisão", content: "Quando o resultado depende de várias condições, represente combinações válidas e ações esperadas. Elimine combinações impossíveis e destaque regras de maior risco." },
      { title: "Estados e transições", content: "Modele estados possíveis, eventos que mudam o estado e transições inválidas. Isso revela falhas que casos lineares felizes não encontram." },
    ],
    guidedPractice: ["Escolha uma regra com faixa numérica e derive classes", "Teste bordas inferior e superior", "Modele uma regra com pelo menos três condições", "Desenhe os estados de uma entidade do produto", "Remova cenários redundantes e explique o corte"],
    checkpoints: ["Cada cenário cobre uma classe ou regra", "Esperados são observáveis", "Casos negativos têm propósito", "Consigo explicar lacunas de cobertura"],
    commonMistakes: ["Criar variações sem ganho de cobertura", "Usar apenas exemplos felizes", "Escrever passos antes de entender a regra"],
    mentorQuestions: ["Qual técnica encontrou uma lacuna no requisito?", "Que cenário você removeu?", "Onde a combinação explode e como controlar isso?"],
    references: [istqb, wcagTools],
  },
  {
    week: 4,
    promise: "Comunicar defeitos e risco de release de forma que produto e engenharia consigam agir.",
    outcomes: ["Escrever título específico e reproduzível", "Separar severidade de prioridade", "Anexar evidência útil e segura", "Recomendar release com base em risco residual"],
    concepts: [
      { title: "Anatomia do bug", content: "Inclua contexto, pré-condição, passos mínimos, resultado atual, resultado esperado, ambiente e evidência. O título deve dizer ação, condição e impacto observável." },
      { title: "Severidade e prioridade", content: "Severidade descreve impacto técnico ou de negócio; prioridade descreve quando corrigir. Elas podem divergir e precisam de justificativa." },
      { title: "Evidência", content: "Capture o necessário para reproduzir: tela, log, request, response, horário e identificador. Remova tokens, dados pessoais e segredos antes de compartilhar." },
      { title: "Decisão de release", content: "Consolide cobertura executada, falhas, riscos aceitos, bloqueios e recomendação. Uma recomendação profissional deixa explícito o custo de seguir e o custo de adiar." },
    ],
    guidedPractice: ["Reproduza dois defeitos de naturezas diferentes", "Reduza os passos ao mínimo", "Colete evidência de interface e de rede quando aplicável", "Classifique severidade e proponha prioridade", "Escreva uma recomendação de release em até cinco linhas"],
    checkpoints: ["Outra pessoa reproduz sem falar comigo", "Esperado vem de uma regra ou hipótese explícita", "A evidência não expõe dados sensíveis", "A recomendação admite incerteza"],
    commonMistakes: ["Título genérico como não funciona", "Misturar vários defeitos no mesmo relato", "Definir prioridade sem contexto de negócio"],
    mentorQuestions: ["Qual decisão este relatório habilita?", "O que prova que não é problema de ambiente?", "Que risco permanece se a correção for adiada?"],
    references: [istqb, owaspWstg],
  },
  {
    week: 5,
    promise: "Escolher automação pelo retorno e pela camada certa, evitando uma suíte cara que só repete cliques.",
    outcomes: ["Avaliar candidato por risco, repetição e estabilidade", "Escolher entre unidade, integração, API e interface", "Definir critério de sucesso da automação", "Estimar custo de dados, ambiente e manutenção"],
    concepts: [
      { title: "Automação é investimento", content: "O ganho vem da repetição confiável, do feedback rápido e da cobertura de regressão. O custo inclui implementação, ambiente, dados, diagnóstico e manutenção." },
      { title: "Camada mais econômica", content: "Verifique a regra na camada mais baixa que ainda oferece confiança. Interface é valiosa para jornadas críticas, mas não deve carregar toda a matriz de dados." },
      { title: "Bom candidato", content: "Fluxo frequente, estável, determinístico, crítico e caro de repetir manualmente tende a gerar retorno. Exploração, percepção visual subjetiva e funcionalidades voláteis pedem outra estratégia." },
      { title: "Pirâmide como conversa", content: "Distribuição de testes é uma heurística, não uma meta fixa. Use risco, arquitetura e velocidade de feedback para decidir a combinação." },
    ],
    guidedPractice: ["Liste dez verificações do produto", "Pontue risco, frequência, estabilidade e custo manual", "Escolha a melhor camada para cada uma", "Selecione três candidatos e dois que continuarão manuais", "Defina como medir se a automação valeu a pena"],
    checkpoints: ["Cada automação protege um risco", "A camada escolhida tem justificativa", "Dados e ambiente estão previstos", "Existe estratégia para falhas e manutenção"],
    commonMistakes: ["Automatizar tudo pela interface", "Escolher pelo que é fácil de programar", "Ignorar diagnóstico de falha"],
    mentorQuestions: ["Qual teste deve falhar primeiro?", "O que fica melhor manual?", "Como saberemos que esta automação perdeu valor?"],
    references: [istqb, playwrightBestPractices],
  },
  {
    week: 6,
    promise: "Construir uma automação web legível, independente e estável com Playwright ou Cypress.",
    outcomes: ["Organizar teste em intenção, ação e verificação", "Usar locators orientados ao usuário", "Evitar espera fixa", "Controlar massa, estado e evidências de falha"],
    concepts: [
      { title: "Seletores por intenção", content: "Prefira papéis, nomes acessíveis, labels e contratos explícitos. Seletores acoplados à estrutura ou ao estilo quebram quando a interface muda sem alterar o comportamento." },
      { title: "Espera orientada a condição", content: "Playwright faz verificações de actionability e Cypress repete queries e assertions. Espere o estado observável necessário, não um número arbitrário de milissegundos." },
      { title: "Independência", content: "Cada teste prepara o próprio estado e pode executar sozinho. Dependência de ordem transforma uma falha em cascata e esconde a causa real." },
      { title: "Diagnóstico", content: "Nomeie o comportamento, mantenha assertions próximas do risco e gere screenshot, trace, vídeo ou log quando falhar. Um teste útil reduz o tempo até entender o problema." },
    ],
    guidedPractice: ["Automatize login ou checkout feliz", "Troque seletores frágeis por role ou label", "Remova qualquer espera fixa", "Prepare dados isolados para o teste", "Force uma falha e avalie a evidência gerada"],
    checkpoints: ["O teste passa isoladamente", "O nome descreve comportamento", "Assertions verificam resultado de negócio", "A falha aponta onde investigar"],
    commonMistakes: ["Usar CSS profundo", "Adicionar retry para esconder flakiness", "Compartilhar estado entre testes"],
    mentorQuestions: ["Que mudança visual quebraria seu teste?", "O que o framework já espera por você?", "Como reproduzir a falha no CI?"],
    references: [playwrightBestPractices, playwrightWaiting, playwrightFixtures, cypressBestPractices, cypressRetry],
  },
  {
    week: 7,
    promise: "Testar APIs como contratos de negócio, cobrindo autorização, dados, erros e fluxos encadeados.",
    outcomes: ["Decompor request, response e contrato", "Validar comportamento além do status HTTP", "Controlar dados e autenticação", "Cobrir riscos comuns de autorização e exposição"],
    concepts: [
      { title: "Contrato observável", content: "Valide status, headers, schema, tipos, regras, efeitos persistidos e mensagens de erro. Um 200 pode carregar um resultado incorreto e um 400 pode ser o comportamento esperado." },
      { title: "Dados e ambientes", content: "Use variáveis para URL e credenciais, gere dados únicos e limpe quando necessário. Testes reproduzíveis não dependem de IDs manuais ou da ordem da collection." },
      { title: "Fluxos encadeados", content: "Capture identificadores de uma resposta e use-os no próximo request, mantendo setup separado das assertions. A cadeia deve deixar claro onde falhou." },
      { title: "Segurança de API", content: "Teste autenticação, autorização por objeto e função, limites, entrada malformada e exposição excessiva. Nunca execute testes invasivos fora de um ambiente autorizado." },
    ],
    guidedPractice: ["Mapeie recursos e operações da API Lab", "Cubra sucesso, validação, inexistente e não autorizado", "Valide schema e regra de negócio", "Crie um fluxo POST → GET → PATCH → DELETE", "Tente acessar o recurso de outro usuário em ambiente seguro"],
    checkpoints: ["Assertions explicam o contrato", "A massa pode ser recriada", "Segredos não estão versionados", "Autorização é testada separadamente da autenticação"],
    commonMistakes: ["Validar somente status", "Fixar token ou ID no código", "Confundir erro funcional com vulnerabilidade"],
    mentorQuestions: ["Qual regra não aparece no schema?", "Como o teste prova isolamento entre usuários?", "Que falha deve bloquear a release?"],
    references: [postmanScripts, postmanRunner, owaspApi, owaspWstg],
  },
  {
    week: 8,
    promise: "Diagnosticar flakiness e evoluir a arquitetura da suíte com mudanças pequenas e mensuráveis.",
    outcomes: ["Classificar causas de instabilidade", "Separar intenção de detalhe de implementação", "Usar fixtures sem criar estado oculto", "Medir tempo, falha e custo de manutenção"],
    concepts: [
      { title: "Flaky é sintoma", content: "As causas comuns são sincronização, dados compartilhados, dependência externa, seletor instável, estado residual e ambiente. Repetir o teste ajuda a observar, mas não corrige a origem." },
      { title: "Abstração com propósito", content: "Extraia fluxos ou fixtures quando isso melhora intenção e reutilização. Page objects gigantes e helpers genéricos escondem comportamento e aumentam acoplamento." },
      { title: "Isolamento", content: "Controle dados por teste, restaure estado e simule dependências apenas quando o objetivo não é validá-las. Um mock reduz escopo; não substitui integração real." },
      { title: "Saúde da suíte", content: "Acompanhe duração, taxa de falha, reincidência, tempo de diagnóstico e testes sem valor. Uma suíte sustentável remove ou reposiciona testes quando o custo supera a confiança." },
    ],
    guidedPractice: ["Escolha um teste instável ou propositalmente frágil", "Colete trace, log e padrão de ocorrência", "Formule três hipóteses e isole uma variável por vez", "Refatore seletor, dado ou sincronização", "Registre causa, correção e evidência antes/depois"],
    checkpoints: ["A causa está demonstrada", "Retry não é a única correção", "Abstrações preservam legibilidade", "O teste continua protegendo o risco original"],
    commonMistakes: ["Aumentar timeout global", "Chamar toda falha intermitente de problema do ambiente", "Criar abstração antes de existir repetição"],
    mentorQuestions: ["Qual evidência elimina uma hipótese?", "O teste está na camada certa?", "Quando remover este teste seria a melhor decisão?"],
    references: [playwrightBestPractices, playwrightFixtures, cypressBestPractices, cypressRetry],
  },
  {
    week: 9,
    promise: "Transformar testes em feedback confiável dentro do pull request e preservar evidências para diagnóstico.",
    outcomes: ["Ler trigger, job, step e runner", "Ordenar verificações por custo e velocidade", "Publicar relatórios e artefatos", "Usar matriz e secrets com responsabilidade"],
    concepts: [
      { title: "Pipeline como sistema de feedback", content: "Comece com verificações rápidas e determinísticas, depois avance para testes mais caros. Falhar cedo economiza recursos e devolve informação quando a mudança ainda está fresca." },
      { title: "Gates", content: "Um gate precisa de dono, critério, evidência e resposta quando falha. Nem toda métrica deve bloquear; escolha sinais ligados a risco real." },
      { title: "Artefatos", content: "Relatórios, logs, screenshots e traces precisam sobreviver ao runner. Defina retenção e evite publicar dados sensíveis." },
      { title: "Matriz e paralelismo", content: "Execute combinações relevantes de sistema, navegador ou versão. Mais combinações aumentam custo; use dados de uso e risco para escolher." },
    ],
    guidedPractice: ["Crie workflow para instalação, lint, testes e build", "Configure cache sem esconder dependência ausente", "Publique relatório mesmo quando o teste falhar", "Adicione uma matriz pequena e justificada", "Leia uma falha e escreva o primeiro passo de diagnóstico"],
    checkpoints: ["O workflow roda em pull request", "Segredos não aparecem em logs", "Falhas mantêm evidência", "A ordem reduz tempo de feedback"],
    commonMistakes: ["Executar tudo em um único step", "Usar secret em contribuição não confiável", "Paralelizar sem controlar dados compartilhados"],
    mentorQuestions: ["Qual etapa deve falhar primeiro?", "Que evidência some quando o runner termina?", "Qual combinação da matriz pode ser removida?"],
    references: [githubActions, githubMatrix, githubContexts],
  },
  {
    week: 10,
    promise: "Tomar decisões de release com sinais imperfeitos, exceções explícitas e caminho seguro de recuperação.",
    outcomes: ["Distinguir regressão, flakiness e infraestrutura", "Definir gate alinhado ao risco", "Documentar exceção com prazo e responsável", "Propor rollback, feature flag ou contenção"],
    concepts: [
      { title: "Sinal não é decisão", content: "Cobertura, testes verdes e análise estática informam, mas não substituem contexto. Combine evidências para estimar risco residual." },
      { title: "Triagem de falha", content: "Classifique produto, teste, dado, ambiente ou infraestrutura. Preserve evidência antes de reexecutar e compare com mudanças recentes." },
      { title: "Exceção controlada", content: "Quando um gate é ignorado, registre motivo, alcance, aprovador, mitigação e validade. Exceção permanente é um gate inexistente." },
      { title: "Recuperação", content: "Rollback, feature flag e rollout gradual reduzem impacto, mas exigem observabilidade e critérios de parada. Teste também o caminho de voltar." },
    ],
    guidedPractice: ["Analise um pipeline com três sinais conflitantes", "Classifique a causa provável de cada falha", "Decida liberar, bloquear ou liberar parcialmente", "Escreva uma exceção com prazo e mitigação", "Defina gatilhos de rollback e evidências pós-deploy"],
    checkpoints: ["A decisão cita evidências", "O risco aceito está explícito", "Existe responsável pela exceção", "O plano de recuperação é executável"],
    commonMistakes: ["Transformar cobertura em meta isolada", "Reexecutar até ficar verde", "Planejar rollback sem testar dados e migrações"],
    mentorQuestions: ["Que sinal mudaria sua decisão?", "Qual é o raio de impacto?", "Quem precisa aceitar o risco residual?"],
    references: [githubActions, githubContexts, istqb],
  },
  {
    week: 11,
    promise: "Planejar carga segura, interpretar percentis e conectar um smoke de performance ao pipeline.",
    outcomes: ["Modelar um fluxo e perfil de uso", "Diferenciar baseline, carga gradual e pico", "Definir checks e thresholds antes da execução", "Interpretar latência, erro e throughput e recomendar o próximo passo"],
    concepts: [
      { title: "Pergunta de performance", content: "Comece com objetivo e expectativa: quantos usuários, quais operações, por quanto tempo e qual nível de serviço. Sem modelo de carga, o número de VUs não representa negócio." },
      { title: "Percentis", content: "Média esconde cauda. p95 informa o limite abaixo do qual ficaram 95% das observações; avalie também erro e throughput para evitar uma leitura isolada." },
      { title: "Checks e thresholds", content: "Checks validam respostas; thresholds definem critérios de aprovação e podem produzir saída não zero para CI. Um teste rápido não é necessariamente aprovado se falhou funcionalmente." },
      { title: "Segurança operacional", content: "Tenha autorização, ambiente, janela, limites e mecanismo de interrupção. Comece pequeno, monitore o sistema e nunca aponte a prática para terceiros." },
    ],
    guidedPractice: ["Escreva a pergunta de performance e o perfil de uso", "Configure o alvo loopback e confira o limite LOCAL_ONLY", "Execute baseline, carga gradual e pico controlado", "Compare p95/p99, throughput, erros e checks", "Desenhe um smoke curto de performance para o CI e separe-o de um teste de capacidade"],
    checkpoints: ["O alvo está autorizado", "O modelo representa uso esperado", "Thresholds expressam um objetivo", "A recomendação separa fato de hipótese"],
    commonMistakes: ["Testar produção sem coordenação", "Olhar apenas média", "Aumentar VUs sem observar gargalo e erro"],
    mentorQuestions: ["Que comportamento de usuário o script representa?", "O sistema ficou lento ou começou a errar?", "Que telemetria confirmaria o gargalo?"],
    references: [k6Thresholds, k6Api],
  },
  {
    week: 12,
    promise: "Defender uma decisão de release com evidências conectadas e transformar o trabalho em case profissional.",
    outcomes: ["Conectar risco, estratégia, execução e resultado", "Selecionar evidências relevantes", "Explicar trade-offs para público técnico e não técnico", "Propor próximos investimentos de qualidade"],
    concepts: [
      { title: "Narrativa do case", content: "Apresente contexto, problema, risco, abordagem, evidência, decisão e aprendizado. Ferramenta é meio; destaque o raciocínio que escolheu o que fazer." },
      { title: "Triangulação", content: "Combine exploração, automação, API, CI e performance apenas quando cada sinal reduz uma incerteza. Mais artefatos não significam uma decisão melhor." },
      { title: "Limites", content: "Declare o que não foi testado, dados indisponíveis e hipóteses abertas. Transparência aumenta a confiança porque impede uma certeza que a evidência não sustenta." },
      { title: "Portfólio responsável", content: "Remova segredos e dados pessoais, explique sua contribuição e publique somente material autorizado. Um bom case permite avaliação sem expor o projeto original." },
    ],
    guidedPractice: ["Escolha o risco central do Release Challenge", "Monte uma linha de evidências por técnica", "Escreva decisão e risco residual", "Prepare apresentação de cinco minutos", "Faça revisão de segurança, acessibilidade e clareza antes de publicar"],
    checkpoints: ["Cada evidência sustenta uma afirmação", "A decisão pode ser contestada", "As lacunas estão declaradas", "O case protege dados e autoria"],
    commonMistakes: ["Listar ferramentas sem explicar decisão", "Esconder falhas e lacunas", "Publicar token, dado pessoal ou informação confidencial"],
    mentorQuestions: ["Qual foi sua decisão mais difícil?", "Que evidência você descartou e por quê?", "O que faria diferente em uma segunda versão?"],
    references: [istqb, owaspWstg, wcagReport, githubActions, k6Thresholds],
  },
];

const roadmapReferencesByWeek: Record<number, MentorshipReference[]> = {
  2: [scrumGuide, kanbanGuide],
  3: [gherkinReference, azureTestPlans],
  4: [azureTestPlans],
  6: [chromeDevTools, jestOfficial, cypressBestPractices],
  7: [xunitOfficial],
  9: [gitBook, azurePipelines],
  10: [appInsights],
  11: [lighthouse, locust, chromeDevTools],
};

for (const week of mentorshipCurriculum) {
  week.references.push(...(roadmapReferencesByWeek[week.week] ?? []));
}

export function getMentorshipWeekContent(week: number) {
  return mentorshipCurriculum.find((item) => item.week === week);
}
