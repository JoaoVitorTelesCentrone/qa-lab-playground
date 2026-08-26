// Trilha CI/CD — dez Labs com missões determinísticas em um pipeline simulado.
// Cada missão treina uma decisão real de entrega: ordenar etapas, diagnosticar
// logs, escolher quality gates, decidir sobre falhas e corrigir YAML.

export type CicdLevel = "Iniciante" | "Intermediário" | "Avançado";

export type CicdModule = {
  id: string;
  index: number;
  name: string;
  summary: string;
};

export const cicdModules: CicdModule[] = [
  { id: "anatomia", index: 1, name: "Anatomia de um pipeline", summary: "Etapas, dependências e a ordem que protege a entrega." },
  { id: "gates", index: 2, name: "Build, testes e quality gates", summary: "O que bloqueia merge e por quê, sem virar burocracia." },
  { id: "piramide", index: 3, name: "Pirâmide de testes no pipeline", summary: "Cada verificação no nível mais barato que ainda protege o risco." },
  { id: "flaky", index: 4, name: "Testes instáveis e quarentena", summary: "Recuperar confiança no sinal sem desligar a rede de proteção." },
  { id: "ambientes", index: 5, name: "Ambientes, dados e segredos", summary: "Isolar configuração e proteger credenciais entre estágios." },
  { id: "artefatos", index: 6, name: "Versionamento e artefatos", summary: "Construir uma vez, promover o mesmo artefato entre ambientes." },
  { id: "deploy", index: 7, name: "Estratégias de deploy", summary: "Canário, blue-green e rollout progressivo conforme o risco." },
  { id: "rollback", index: 8, name: "Rollback e feature flags", summary: "Desfazer rápido e separar deploy de liberação." },
  { id: "observabilidade", index: 9, name: "Observabilidade e pós-release", summary: "Validar em produção com sinais, não com torcida." },
  { id: "metricas", index: 10, name: "Métricas de fluxo e confiabilidade", summary: "Medir velocidade e estabilidade sem otimizar vaidade." },
];

/**
 * Na hierarquia de aprendizagem, cada módulo de CI/CD é um Lab da trilha.
 * O alias preserva os consumidores antigos enquanto a UI passa a usar a
 * nomenclatura Trilha -> Labs -> missões.
 */
export type CicdTrackLab = CicdModule;
export const cicdTrackLabs: CicdTrackLab[] = cicdModules;

export function findCicdTrackLab(id: string) {
  return cicdTrackLabs.find((lab) => lab.id === id);
}

export type OrderStep = { id: string; label: string; hint: string };
export type Choice = { id: string; label: string; feedback: string };

type OrderPayload = { kind: "order"; steps: OrderStep[] };
type DiagnosePayload = { kind: "diagnose"; log: string[]; options: (Choice & { correct: boolean })[] };
type GatePayload = { kind: "gate"; options: (Choice & { recommended: boolean })[] };
type DecisionPayload = { kind: "decision"; options: (Choice & { verdict: "best" | "ok" | "bad" })[] };
export type YamlValidator = { pattern: string; flags?: string; message: string };
type YamlPayload = { kind: "yaml"; yaml: string; bugHint: string; solution: string; validators: YamlValidator[] };

export type CicdMissionKind = (OrderPayload | DiagnosePayload | GatePayload | DecisionPayload | YamlPayload)["kind"];

export type CicdMission = {
  id: string;
  moduleId: string;
  level: CicdLevel;
  title: string;
  context: string;
  question: string;
  competencies: string[];
  mentorNote: string;
} & (OrderPayload | DiagnosePayload | GatePayload | DecisionPayload | YamlPayload);

export const cicdMissions: CicdMission[] = [
  {
    id: "anatomia-ordem",
    moduleId: "anatomia",
    level: "Iniciante",
    kind: "order",
    title: "Monte o esqueleto do pipeline",
    context: "Um time configurou as etapas de CI fora de ordem e o pipeline desperdiça tempo: builds rodam antes de testes baratos falharem, e o deploy dispara mesmo com a suíte vermelha.",
    question: "Coloque as etapas na ordem que faz o pipeline falhar cedo e barato, deixando o deploy por último.",
    steps: [
      { id: "checkout", label: "Checkout do código", hint: "Sem o código no runner, nenhuma etapa seguinte existe." },
      { id: "deps", label: "Instalar dependências", hint: "Precisa vir antes de qualquer comando que use as libs do projeto." },
      { id: "lint", label: "Lint e formatação", hint: "Verificação mais barata e rápida: falha em segundos antes de gastar com testes." },
      { id: "unit", label: "Testes unitários", hint: "Feedback rápido sobre lógica antes de construir o artefato." },
      { id: "build", label: "Build da aplicação", hint: "Só vale construir depois que lint e unidade passaram." },
      { id: "deploy", label: "Deploy em staging", hint: "Última etapa: só promove o que passou por todas as anteriores." },
    ],
    competencies: ["Anatomia de pipeline", "Feedback rápido", "Estratégia de CI"],
    mentorNote: "A ordem de um pipeline não é estética: ela existe para falhar cedo e barato. Verificações rápidas (lint, unidade) vêm antes de etapas caras (build, deploy) para não gastar minutos quando um erro de segundos já reprovaria a mudança.",
  },
  {
    id: "gates-diagnose-install",
    moduleId: "gates",
    level: "Intermediário",
    kind: "diagnose",
    title: "O build quebrou e ninguém mexeu no código",
    context: "O mesmo commit que passou ontem falha hoje na etapa de instalação. O time jura que não alterou nada e suspeita de 'problema do CI'.",
    log: [
      "$ npm ci",
      "npm warn old lockfile",
      "npm error code EUSAGE",
      "npm error `npm ci` can only install with an existing package-lock.json",
      "npm error in sync with package.json. Missing: lodash@4.17.21 from lock file",
      "npm error Clean install a project",
      "npm error Run \"npm install\" to update package-lock.json",
      "Process completed with exit code 1.",
    ],
    question: "Qual é a causa raiz mais provável da falha?",
    options: [
      { id: "lock", label: "Uma dependência foi adicionada ao package.json sem atualizar o package-lock.json", correct: true, feedback: "Exato. `npm ci` é determinístico e exige que lock e package.json estejam em sincronia. Alguém instalou algo localmente com outra flag e não commitou o lockfile atualizado." },
      { id: "registry", label: "O registro npm está fora do ar", correct: false, feedback: "Não. O erro é EUSAGE de sincronia entre lock e package.json, não de rede ou indisponibilidade do registro." },
      { id: "node", label: "A versão do Node mudou no runner", correct: false, feedback: "Versão de Node geraria outro erro (engine/incompatibilidade), não a mensagem de lockfile fora de sincronia." },
      { id: "cache", label: "O cache do CI corrompeu", correct: false, feedback: "O próprio npm aponta a causa: falta `lodash` no lock file. É sincronia de dependências, não cache." },
    ],
    competencies: ["Diagnóstico de logs", "Determinismo de build", "Dependências"],
    mentorNote: "Ler o log até o fim economiza horas. O npm literalmente diz a causa e a correção. 'Funciona na minha máquina' costuma ser justamente um artefato (como o lockfile) que ficou de fora do commit.",
  },
  {
    id: "gates-yaml-checkout",
    moduleId: "gates",
    level: "Intermediário",
    kind: "yaml",
    title: "Conserte o workflow do GitHub Actions",
    context: "Um workflow novo falha logo na instalação com 'npm error: ENOENT no such file or directory, open package.json'. O job sobe a máquina, mas não encontra o projeto.",
    yaml: [
      "name: CI",
      "on: [push, pull_request]",
      "jobs:",
      "  test:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/setup-node@v4",
      "        with:",
      "          node-version: 20",
      "      - run: npm ci",
      "      - run: npm test",
    ].join("\n"),
    bugHint: "O runner começa vazio. Algo precisa clonar o repositório antes do setup-node e do install.",
    question: "Edite o workflow para que ele encontre o projeto e os testes rodem. Dica: falta o passo que traz o código para o runner.",
    solution: [
      "name: CI",
      "on: [push, pull_request]",
      "jobs:",
      "  test:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "      - uses: actions/setup-node@v4",
      "        with:",
      "          node-version: 20",
      "      - run: npm ci",
      "      - run: npm test",
    ].join("\n"),
    validators: [
      { pattern: "uses:\\s*actions/checkout", message: "Adicione um passo `- uses: actions/checkout@v4` para clonar o código no runner." },
      { pattern: "actions/checkout[\\s\\S]*actions/setup-node", message: "O checkout precisa vir antes do setup-node — senão a máquina configura o Node sem ter o projeto." },
      { pattern: "npm\\s+ci", message: "Mantenha a instalação de dependências (`npm ci`)." },
      { pattern: "npm\\s+test", message: "Mantenha a execução dos testes (`npm test`)." },
    ],
    competencies: ["GitHub Actions", "YAML", "Diagnóstico"],
    mentorNote: "`actions/checkout` é tão básico que vira ponto cego. Quando o erro é 'arquivo não encontrado' logo no início, desconfie de que o código nem chegou ao runner antes de procurar causas mais exóticas.",
  },
  {
    id: "gates-quality-gates",
    moduleId: "gates",
    level: "Intermediário",
    kind: "gate",
    title: "Escolha os quality gates que bloqueiam o merge",
    context: "Você vai definir os gates obrigatórios para abrir merge na branch principal de um produto financeiro. O time reclama que gates demais travam tudo, mas regressões estão escapando.",
    question: "Marque os gates que valem a pena bloquear o merge neste contexto. Deixe de fora os que geram atrito sem proteger risco real.",
    options: [
      { id: "tests", label: "Suíte de testes automatizados verde", recommended: true, feedback: "Obrigatório. É a rede de proteção principal; merge com suíte vermelha derrota o propósito do CI." },
      { id: "lint", label: "Lint e build sem erros", recommended: true, feedback: "Barato e rápido. Impede que código que nem compila ou viola padrões entre na principal." },
      { id: "coverage-90", label: "Cobertura de código mínima de 90% em todo o repositório", recommended: false, feedback: "Meta rígida e global vira jogo de número: leva a testes inúteis só para subir a barra. Prefira cobertura no código novo/crítico." },
      { id: "review", label: "Ao menos uma revisão de código aprovada", recommended: true, feedback: "Em produto financeiro, revisão humana pega risco que a automação não vê. Vale o gate." },
      { id: "manual-signoff", label: "Aprovação manual do gerente em todo PR", recommended: false, feedback: "Gargalo que não escala e não agrega ao risco técnico. Reserve sign-off manual para releases sensíveis, não para todo merge." },
      { id: "secret-scan", label: "Varredura de segredos no diff", recommended: true, feedback: "Barato e crítico: impede que chave ou senha vaze para o histórico, algo caríssimo de reverter depois." },
    ],
    competencies: ["Quality gates", "Análise de risco", "Pragmatismo"],
    mentorNote: "Bom gate bloqueia risco real com baixo atrito. Suíte verde, build, lint, varredura de segredos e revisão protegem muito por pouco custo. Metas rígidas de cobertura global e aprovação manual em todo PR custam caro e protegem pouco.",
  },
  {
    id: "piramide-gate",
    moduleId: "piramide",
    level: "Intermediário",
    kind: "gate",
    title: "Reequilibre a pirâmide de testes",
    context: "A suíte do time é uma pirâmide invertida: dezenas de testes E2E lentos cobrindo regras que mudam toda semana e quase nada de unidade. O pipeline leva 40 minutos e quebra mais por ambiente do que por lógica.",
    question: "Marque as verificações que deveriam descer para testes de unidade ou integração baratos. Deixe no E2E apenas o que precisa do fluxo completo de verdade.",
    options: [
      { id: "imposto", label: "Cálculo de imposto sobre uma despesa", recommended: true, feedback: "Lógica pura e determinística: caso clássico de teste de unidade, roda em milissegundos e é estável." },
      { id: "email", label: "Validação de formato de e-mail no cadastro", recommended: true, feedback: "Regra isolada; não precisa subir o navegador para verificar um formato." },
      { id: "autorizacao", label: "Regra de quem pode aprovar uma despesa (autorização)", recommended: true, feedback: "Testável na camada de serviço/API, sem UI. Teste de integração cobre com muito menos custo." },
      { id: "componente-erro", label: "Mensagem de erro do campo de valor quando a entrada é inválida", recommended: true, feedback: "Comportamento de um componente: um teste de componente cobre sem precisar do fluxo inteiro." },
      { id: "login-fluxo", label: "Fluxo completo login → criar despesa → aprovar pelo gestor", recommended: false, feedback: "É o caminho crítico ponta a ponta que justifica um E2E. Mantenha poucos e valiosos no topo." },
      { id: "relatorio-e2e", label: "Relatório financeiro consolidando vários módulos de ponta a ponta", recommended: false, feedback: "Integração real entre módulos vale um E2E enxuto: aqui o risco está justamente na junção." },
    ],
    competencies: ["Pirâmide de testes", "Estratégia de testes", "Custo de manutenção"],
    mentorNote: "A pirâmide saudável tem base larga de testes rápidos e poucos E2E no topo. Cada verificação deve viver no nível mais barato que ainda protege o risco: lógica em unidade, regras de negócio em integração, e só o caminho crítico completo em E2E.",
  },
  {
    id: "flaky-decision",
    moduleId: "flaky",
    level: "Avançado",
    kind: "decision",
    title: "O teste que falha 1 em cada 5 execuções",
    context: "Um teste E2E de checkout falha de forma intermitente. O time já reroda o pipeline até passar e a confiança no sinal está caindo: começam a ignorar falhas vermelhas reais por achar que 'é o flaky de sempre'.",
    question: "O que você decide fazer agora com esse teste instável?",
    options: [
      { id: "quarantine", label: "Mover para quarentena (não bloqueia merge), abrir tarefa com dono e prazo para investigar a causa", verdict: "best", feedback: "Melhor caminho. A quarentena para de envenenar o sinal sem apagar a verificação, e o registro com dono e prazo impede que ela seja esquecida. Confiança no pipeline volta enquanto a causa é tratada." },
      { id: "delete", label: "Excluir o teste, já que ele só dá trabalho", verdict: "bad", feedback: "Você troca um sinal ruidoso por nenhum sinal: o fluxo de checkout, que é crítico, fica sem cobertura. Quarentena preserva a verificação; exclusão joga fora a rede de proteção." },
      { id: "retry", label: "Configurar retry automático de 3 tentativas e seguir a vida", verdict: "ok", feedback: "Defensável como contenção imediata, mas mascara a instabilidade em vez de tratá-la. Sem investigar a causa, o flaky volta e pode esconder uma falha real de timing no produto." },
      { id: "ignore", label: "Pedir ao time para rerodar até passar quando falhar", verdict: "bad", feedback: "É a normalização do desvio: treina o time a ignorar vermelho. Em pouco tempo uma falha real passa porque 'todo flaky a gente reroda'." },
    ],
    competencies: ["Quarentena", "Confiabilidade", "Decisão sob ruído"],
    mentorNote: "Teste flaky é dívida de confiança. A jogada madura não é apagar nem conviver: é isolar o ruído (quarentena), preservar a cobertura e tratar a causa com dono e prazo. Retry resolve o sintoma; investigação resolve o problema.",
  },
  {
    id: "ambientes-decision",
    moduleId: "ambientes",
    level: "Intermediário",
    kind: "decision",
    title: "A chave de produção no seu .env",
    context: "Para reproduzir um bug difícil você precisa da API key do gateway de pagamento. Um colega te manda a chave de produção pelo chat e sugere colar no seu .env local para agilizar a investigação.",
    question: "Como você lida com esse segredo?",
    options: [
      { id: "sandbox", label: "Recusar a chave de produção, usar a credencial de sandbox/teste do gateway e, se precisar de algo real, acessá-lo por um cofre/secret manager com acesso controlado", verdict: "best", feedback: "Certo. Segredo de produção não vira variável de debug. Sandbox cobre a maioria dos casos e o cofre dá acesso auditável quando há necessidade real." },
      { id: "temp", label: "Usar a chave só localmente e apagar do .env depois", verdict: "ok", feedback: "Defensável na pressa, mas a chave já trafegou pelo chat e pode ficar em histórico, backup ou commit acidental. O risco não é só o seu arquivo." },
      { id: "local", label: "Colar no .env e seguir, afinal é só a sua máquina", verdict: "bad", feedback: "Sua máquina não é um ambiente seguro: backup, sync, screen share e malware existem. Chave de produção exposta é incidente esperando acontecer." },
      { id: "commit", label: "Commitar a chave num arquivo de config de teste para o time reusar", verdict: "bad", feedback: "Pior caso: segredo no histórico do git é praticamente impossível de remover e fica exposto a quem clonar o repositório." },
    ],
    competencies: ["Ambientes e segredos", "Segurança", "Boas práticas"],
    mentorNote: "Segredos vivem por ambiente e fora do código. Sandbox para desenvolver, cofre/secret manager para o que é real, e nada de credencial de produção circulando em chat ou .env. Um segredo exposto custa rotação de chave e, às vezes, vazamento de dados.",
  },
  {
    id: "artefatos-decision",
    moduleId: "artefatos",
    level: "Iniciante",
    kind: "decision",
    title: "Mesmo commit, builds diferentes",
    context: "A versão foi construída e testada em staging e está aprovada. Para subir em produção, o pipeline vai gerar o pacote de novo, a partir do mesmo commit, em outra máquina, com instalação de dependências sem lockfile travado.",
    question: "Qual abordagem dá mais confiança de que produção recebe exatamente o que foi testado?",
    options: [
      { id: "promote", label: "Promover para produção o mesmo artefato que passou em staging (build once, deploy many), sem reconstruir", verdict: "best", feedback: "Certo. Reconstruir abre brecha para diferença sutil de dependência ou ambiente. Promover o binário idêntico garante que você testou exatamente o que vai rodar." },
      { id: "lock", label: "Reconstruir, mas com lockfile travado e versões fixas para reduzir a diferença", verdict: "ok", feedback: "Melhora muito o determinismo, mas ainda não é idêntico: ambiente e timing de build podem variar. Promover o mesmo artefato elimina a dúvida de vez." },
      { id: "rebuild", label: "Reconstruir do mesmo commit, afinal o mesmo commit garante o mesmo resultado", verdict: "bad", feedback: "Mesmo commit não garante o mesmo build: sem lockfile, dependências transitivas mudam entre execuções. É o 'funciona na minha máquina' disfarçado de build." },
      { id: "manual", label: "Subir direto da máquina de quem aprovou, que já está com tudo pronto", verdict: "bad", feedback: "Build manual e não rastreável é a receita do artefato fantasma: ninguém reproduz, ninguém audita." },
    ],
    competencies: ["Artefatos", "Reprodutibilidade", "Versionamento"],
    mentorNote: "Construa uma vez, promova o mesmo artefato entre ambientes. Reconstruir por estágio reintroduz variabilidade e quebra a garantia de que o que foi testado é o que será entregue. Lockfile e versionamento tornam o build reproduzível.",
  },
  {
    id: "deploy-diagnose",
    moduleId: "deploy",
    level: "Avançado",
    kind: "diagnose",
    title: "Verde no CI, vermelho ao subir",
    context: "Todos os testes passaram, o build foi publicado, mas o deploy em produção falha na inicialização. O log da aplicação no ambiente mostra a falha abaixo.",
    log: [
      "Starting ExpenseFlow v2.14.0 ...",
      "[boot] connecting to database",
      "[error] PaymentService: missing required env STRIPE_API_KEY",
      "[error] failed to initialize PaymentService",
      "Error: Cannot read configuration: STRIPE_API_KEY is undefined",
      "    at validateConfig (config.js:42)",
      "Application crashed during startup. Exit code 1.",
    ],
    question: "Por que passou no CI e quebrou só em produção?",
    options: [
      { id: "secret", label: "A variável/segredo STRIPE_API_KEY existe no CI e em staging, mas não foi configurada no ambiente de produção", correct: true, feedback: "Exato. Config e segredos vivem por ambiente. O CI tinha a chave (mock ou de teste), produção não. Validar configuração no boot, como o app faz, é justamente o que evita um deploy meio quebrado." },
      { id: "code", label: "Tem um bug no código que os testes não pegaram", correct: false, feedback: "O código está checando a config corretamente e falhando de propósito. O problema não é lógica, é configuração ausente no ambiente." },
      { id: "build", label: "O artefato publicado está corrompido", correct: false, feedback: "O app inicia e chega a validar config; um artefato corrompido nem rodaria até aqui. A causa é a env faltante." },
      { id: "db", label: "O banco de produção está fora do ar", correct: false, feedback: "O log mostra a conexão com o banco antes do erro; a falha é explicitamente a env STRIPE_API_KEY indefinida." },
    ],
    competencies: ["Ambientes e segredos", "Diagnóstico de deploy", "Configuração"],
    mentorNote: "'Funciona no CI' não é 'funciona em produção' quando configuração difere por ambiente. Segredos e variáveis precisam ser provisionados em cada estágio, e validar a config logo no boot transforma um incidente silencioso em uma falha clara e cedo.",
  },
  {
    id: "rollback-decision",
    moduleId: "rollback",
    level: "Avançado",
    kind: "decision",
    title: "Bug em produção 20 minutos após o deploy",
    context: "Uma release subiu há 20 minutos. Usuários relatam erro ao finalizar pedido. A mesma release também traz uma correção de login que vários clientes esperavam. Existe feature flag para a parte nova de checkout; o rollback reverteria também a correção de login.",
    question: "Qual é a primeira ação para reduzir o impacto agora?",
    options: [
      { id: "flag", label: "Desligar a feature flag do novo checkout, mantendo a correção de login no ar", verdict: "best", feedback: "Melhor ação: a flag isola exatamente a parte quebrada, parando o sangramento sem desfazer a correção de login que os clientes esperavam. É o motivo de separar deploy de liberação." },
      { id: "rollback", label: "Rollback completo da release imediatamente", verdict: "ok", feedback: "Seguro e legítimo se não houvesse a flag, mas aqui ele também reverte a correção de login. Quando dá para isolar o problema com flag, prefira o corte cirúrgico." },
      { id: "hotfix", label: "Escrever e subir um hotfix correndo", verdict: "bad", feedback: "Sob pressão, código novo às pressas costuma criar o próximo incidente. Primeiro estanca o impacto (flag), depois corrige com calma." },
      { id: "wait", label: "Aguardar mais relatos para confirmar o tamanho do problema", verdict: "bad", feedback: "Esperar com checkout quebrado é perda direta de receita e confiança. Você já tem sinal suficiente para conter agora e investigar em paralelo." },
    ],
    competencies: ["Rollback", "Feature flags", "Resposta a incidentes"],
    mentorNote: "Separar deploy de liberação dá opções em crise. Com feature flag você desliga só o que quebrou, sem sacrificar o resto da release. A ordem é sempre conter o impacto primeiro, corrigir com calma depois.",
  },
  {
    id: "observabilidade-gate",
    moduleId: "observabilidade",
    level: "Avançado",
    kind: "gate",
    title: "Os primeiros 30 minutos pós-deploy",
    context: "Você acabou de promover uma release para produção. Em vez de torcer e esperar o suporte reclamar, vai acompanhar sinais que confirmam, ou negam, que está tudo bem.",
    question: "Marque os sinais que de fato indicam saúde nos primeiros minutos pós-release. Deixe de fora os que dão falsa sensação de segurança.",
    options: [
      { id: "erros", label: "Taxa de erro (5xx) e exceções por minuto comparadas ao baseline", recommended: true, feedback: "Sinal mais direto de regressão. Um salto de erros logo após o deploy é o alerta mais confiável." },
      { id: "latencia", label: "Latência (p95/p99) das rotas principais", recommended: true, feedback: "Degradação de performance nem sempre quebra, mas afasta o usuário. Comparar com o baseline isola o efeito da release." },
      { id: "health", label: "Health checks e disponibilidade das instâncias", recommended: true, feedback: "Confirma que a aplicação subiu e está respondendo em todas as instâncias, não só em uma." },
      { id: "jornada", label: "Taxa de sucesso da jornada crítica (ex.: checkout concluído)", recommended: true, feedback: "Métrica de negócio que prova que o caminho que importa funciona, não só que o servidor responde." },
      { id: "acessos", label: "Número total de acessos acumulados no dia", recommended: false, feedback: "Métrica de vaidade e lenta: não isola o efeito do deploy e nem se move nos primeiros minutos." },
      { id: "social", label: "Curtidas e comentários nas redes sociais da empresa", recommended: false, feedback: "Não tem relação com a saúde técnica da release. Puro ruído." },
    ],
    competencies: ["Observabilidade", "Validação pós-release", "Métricas de saúde"],
    mentorNote: "Validar pós-release é olhar sinais que se movem rápido e se comparam a um baseline: erros, latência, disponibilidade e sucesso da jornada crítica. Métricas acumuladas e indiretas chegam tarde demais para conter um deploy ruim. Observar é o que transforma 'deu certo, eu acho' em decisão baseada em evidência.",
  },
  {
    id: "metricas-gate",
    moduleId: "metricas",
    level: "Intermediário",
    kind: "gate",
    title: "Quais métricas realmente dizem que a entrega está saudável",
    context: "A liderança quer um painel de saúde de entrega. Sugerem várias métricas; algumas mostram fluxo e estabilidade de verdade, outras são vaidade que incentivam o comportamento errado.",
    question: "Marque as métricas que vale a pena acompanhar como sinal de saúde de entrega. Deixe de fora as de vaidade.",
    options: [
      { id: "lead-time", label: "Lead time para mudança (commit até produção)", recommended: true, feedback: "Métrica DORA de fluxo. Mede quão rápido valor chega ao usuário com segurança." },
      { id: "deploy-freq", label: "Frequência de deploy", recommended: true, feedback: "Métrica DORA. Deploys pequenos e frequentes reduzem risco por mudança." },
      { id: "cfr", label: "Taxa de falha de mudança (deploys que causam incidente)", recommended: true, feedback: "Métrica DORA de estabilidade. Equilibra a velocidade: entregar rápido quebrando muito não é saúde." },
      { id: "mttr", label: "Tempo de restauração após falha (MTTR)", recommended: true, feedback: "Métrica DORA. Falhar acontece; o que distingue times bons é a rapidez para se recuperar." },
      { id: "loc", label: "Linhas de código escritas por dev por semana", recommended: false, feedback: "Vaidade clássica: premia volume, não valor. Incentiva código inflado e penaliza simplificação." },
      { id: "commits", label: "Número de commits por pessoa", recommended: false, feedback: "Mede atividade, não resultado. Fácil de inflar e desconectado da saúde real da entrega." },
    ],
    competencies: ["Métricas DORA", "Confiabilidade", "Métricas de vaidade"],
    mentorNote: "As quatro métricas DORA (lead time, frequência de deploy, taxa de falha e tempo de restauração) equilibram velocidade e estabilidade. Contagem de linhas e commits mede movimento, não entrega de valor, e empurra o time para o comportamento errado.",
  },
];

// ---- Progresso ----

export const CICD_PROGRESS_KEY = "qa-lab-cicd-progress-v1";

export function parseCicdProgress(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function cicdProgressPercent(solvedIds: string[]): number {
  const solved = new Set(solvedIds.filter((id) => cicdMissions.some((mission) => mission.id === id)));
  if (!cicdMissions.length) return 0;
  return Math.round((solved.size / cicdMissions.length) * 100);
}

// ---- Verificação por tipo de missão ----

export function isOrderSolved(mission: Extract<CicdMission, { kind: "order" }>, attempt: string[]): boolean {
  const expected = mission.steps.map((step) => step.id);
  return attempt.length === expected.length && expected.every((id, index) => attempt[index] === id);
}

export function isChoiceCorrect(options: { id: string; correct: boolean }[], selectedId: string | null): boolean {
  return options.some((option) => option.id === selectedId && option.correct);
}

export function isDecisionBest(options: { id: string; verdict: "best" | "ok" | "bad" }[], selectedId: string | null): boolean {
  return options.some((option) => option.id === selectedId && option.verdict === "best");
}

export function validateYamlEdit(mission: Extract<CicdMission, { kind: "yaml" }>, text: string): { solved: boolean; message: string | null; passed: number; total: number } {
  let passed = 0;
  let firstFail: string | null = null;
  for (const validator of mission.validators) {
    const ok = new RegExp(validator.pattern, validator.flags).test(text);
    if (ok) passed += 1;
    else if (firstFail === null) firstFail = validator.message;
  }
  return { solved: passed === mission.validators.length, message: firstFail, passed, total: mission.validators.length };
}

export function scoreGate(options: { id: string; recommended: boolean }[], selectedIds: string[]): { matched: number; total: number; solved: boolean } {
  const selected = new Set(selectedIds);
  const matched = options.filter((option) => option.recommended === selected.has(option.id)).length;
  return { matched, total: options.length, solved: matched === options.length };
}

// ---- Trilha (mapa de módulos) ----

export type CicdModuleProgress = {
  module: CicdModule;
  missions: CicdMission[];
  solved: number;
  total: number;
  complete: boolean;
  started: boolean;
};

export function getModuleMissions(moduleId: string): CicdMission[] {
  return cicdMissions.filter((mission) => mission.moduleId === moduleId);
}

export function buildModuleProgress(solvedIds: string[]): CicdModuleProgress[] {
  const solved = new Set(solvedIds);
  return cicdModules.map((module) => {
    const missions = getModuleMissions(module.id);
    const solvedCount = missions.filter((mission) => solved.has(mission.id)).length;
    return { module, missions, solved: solvedCount, total: missions.length, complete: missions.length > 0 && solvedCount === missions.length, started: solvedCount > 0 };
  });
}

export function firstUnsolvedMission(solvedIds: string[]): CicdMission | null {
  const solved = new Set(solvedIds);
  return cicdMissions.find((mission) => !solved.has(mission.id)) ?? null;
}

export function isCicdComplete(solvedIds: string[]): boolean {
  const solved = new Set(solvedIds);
  return cicdMissions.every((mission) => solved.has(mission.id));
}

// ---- Evidência: relatório de confiabilidade para o portfólio ----

export function buildReliabilityReport(solvedIds: string[], date = new Date()): string {
  const solved = new Set(solvedIds);
  const done = cicdMissions.filter((mission) => solved.has(mission.id));
  const modules = buildModuleProgress(solvedIds);
  const competencies = Array.from(new Set(done.flatMap((mission) => mission.competencies))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const moduleName = (id: string) => cicdModules.find((module) => module.id === id)?.name ?? id;

  const lines: string[] = [
    "# Relatório de Confiabilidade — Trilha CI/CD",
    "",
    `Data: ${date.toLocaleDateString("pt-BR")}`,
    `Missões resolvidas: ${done.length}/${cicdMissions.length}`,
    `Labs concluídos: ${modules.filter((module) => module.complete).length}/${cicdModules.length}`,
    "",
    "## Trilha percorrida",
    ...modules.map((module) => `- [${module.complete ? "x" : " "}] Lab ${module.module.index} — ${module.module.name} (${module.solved}/${module.total})`),
    "",
    "## Decisões de entrega demonstradas",
    ...done.map((mission) => `- ${mission.title} · ${moduleName(mission.moduleId)}`),
    "",
    "## Princípios aplicados",
    ...done.map((mission) => `- ${mission.mentorNote}`),
    "",
    "## Competências exercitadas",
    competencies.length ? competencies.join(", ") : "—",
    "",
    "_Gerado no QA Lab · Trilha CI/CD._",
  ];

  return lines.join("\n");
}
