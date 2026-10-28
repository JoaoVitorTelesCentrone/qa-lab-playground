export type AppiumSeleniumModule = {
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

export const appiumSeleniumModules: AppiumSeleniumModule[] = [
  {
    id: "choose-the-target",
    week: 1,
    duration: "45 min",
    title: "Escolha o alvo e a camada certa",
    objective: "Separar app nativo, híbrido e mobile web e escolher a ferramenta pela superfície que precisa ser validada.",
    concepts: ["nativo", "híbrido", "mobile web", "emulação", "risco"],
    practice: "Classifique os fluxos de um app fictício de compras: navegação no browser, carrinho dentro de WebView e permissões nativas. Indique o que precisa de device real e o que cabe em browser desktop responsivo.",
    deliverable: "Mapa de riscos com alvo, camada de teste e motivo da escolha.",
    checklist: ["Selenium sozinho não é descrito como driver universal de app nativo.", "Emulação de viewport não é confundida com teste em device.", "A ferramenta atende ao risco, não apenas à familiaridade do time."],
    example: `Mobile web no Chrome do Android → sessão remota via Appium + browser.\nApp nativo Android → Appium + UiAutomator2.\nApp nativo iOS → Appium + XCUITest em host macOS.\nRegra de domínio sem UI → testar numa camada mais rápida.`,
  },
  {
    id: "webdriver-architecture",
    week: 1,
    duration: "60 min",
    title: "Entenda WebDriver, cliente e servidor",
    objective: "Explicar como o teste envia comandos WebDriver, como o Appium encaminha ações ao driver e como capabilities definem a sessão.",
    concepts: ["W3C WebDriver", "cliente-servidor", "sessão", "capabilities", "driver"],
    practice: "Desenhe a ida e volta de uma ação e identifique o que é responsabilidade do teste, do Appium Server, do driver da plataforma e do sistema operacional.",
    deliverable: "Diagrama da sessão e capabilities mínimas para um emulador Android de teste.",
    checklist: ["O cliente não controla o aparelho diretamente.", "Capabilities descrevem plataforma, dispositivo e alvo.", "Extensões Appium são diferenciadas dos comandos WebDriver padrão."],
    example: `Teste Java → Selenium/WebDriver API → Appium Server → UiAutomator2 → Android Emulator\n\nSempre registre URL do servidor, capabilities usadas e versão dos componentes.`,
  },
  {
    id: "android-setup",
    week: 2,
    duration: "90 min",
    title: "Prepare o Android e o Appium",
    objective: "Subir um emulador, instalar um driver Appium compatível e criar uma sessão Android repetível.",
    concepts: ["Android SDK", "emulador", "UiAutomator2", "Appium 3", "ambiente local"],
    practice: "Use um emulador de QA, confira `adb devices`, instale UiAutomator2 no Appium e inicie uma sessão com uma aplicação fictícia ou autorizada.",
    deliverable: "README com pré-requisitos, comandos de inicialização e capabilities fora do código de teste.",
    checklist: ["Appium Server e driver estão instalados separadamente ou declarados conscientemente.", "O emulador aparece como online.", "Nenhum alvo ou conta de produção é usado."],
    example: `appium driver install uiautomator2\nappium\nadb devices\n\n# Appium 2/3 usa a raiz como base path por padrão: http://127.0.0.1:4723`,
  },
  {
    id: "first-native-test",
    week: 2,
    duration: "75 min",
    title: "Escreva o primeiro teste nativo",
    objective: "Abrir um app Android e validar um resultado visível usando um identificador acessível e uma asserção clara.",
    concepts: ["AndroidDriver", "AppiumBy", "accessibility id", "asserção", "estado"],
    practice: "Inicie o app demo autorizado, localize um título por accessibility id e valide que o conteúdo principal está visível. Finalize a sessão mesmo se o teste falhar.",
    deliverable: "Um smoke test com setup, ação, asserção e encerramento confiáveis.",
    checklist: ["O identificador representa intenção acessível.", "O teste valida comportamento observável.", "A sessão termina em bloco `finally` ou teardown."],
    example: `AndroidDriver driver = new AndroidDriver(serverUrl, options);\ntry {\n  assertTrue(driver.findElement(AppiumBy.accessibilityId("home-title")).isDisplayed());\n} finally {\n  driver.quit();\n}`,
  },
  {
    id: "selenium-api-locators-waits",
    week: 3,
    duration: "75 min",
    title: "Reaproveite Selenium: localizadores e esperas",
    objective: "Aplicar APIs WebDriver e esperas explícitas no cliente Java do Appium sem sincronização frágil por tempo fixo.",
    concepts: ["WebDriver", "By", "WebDriverWait", "ExpectedConditions", "sincronização"],
    practice: "Troque pausas fixas por espera explícita para um estado observável. Compare accessibility id, resource id e texto visível no app demo.",
    deliverable: "Page Object pequeno com localizadores semânticos e uma espera explícita justificada.",
    checklist: ["Esperas aguardam uma condição útil.", "Não há sleep fixo para mascarar sincronização.", "Page Object encapsula a interface sem esconder asserções de negócio."],
    example: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));\nWebElement title = wait.until(\n  ExpectedConditions.visibilityOfElementLocated(\n    AppiumBy.accessibilityId("home-title")\n  )\n);\nassertEquals("QA Shop", title.getText());`,
  },
  {
    id: "mobile-interactions",
    week: 3,
    duration: "75 min",
    title: "Faça gestos sem coordenadas mágicas",
    objective: "Modelar scroll, toque e teclado com ações WebDriver ou extensões documentadas do driver, evitando coordenadas frágeis.",
    concepts: ["W3C Actions", "gestos", "scroll", "teclado", "mobile extensions"],
    practice: "Role uma lista longa até um item acessível, toque nele e feche o teclado. Anote diferenças entre ação padrão e extensão específica da plataforma.",
    deliverable: "Fluxo de interação com alvo semântico e alternativa quando a API variar por plataforma.",
    checklist: ["A ação aponta para elemento ou regra, não pixel arbitrário.", "Gestos específicos da plataforma estão isolados.", "O teste não depende de velocidade fixa de animação."],
    example: `// Prefira localizar o item e então interagir.\nWebElement item = wait.until(\n  ExpectedConditions.elementToBeClickable(\n    AppiumBy.accessibilityId("order-history")\n  )\n);\nitem.click();\n\n// Para gestos não cobertos por WebDriver, consulte a extensão mobile: do driver.`,
  },
  {
    id: "hybrid-contexts",
    week: 4,
    duration: "75 min",
    title: "Automatize apps híbridos e WebViews",
    objective: "Alternar entre contexto nativo e WebView, escolhendo locators próprios para cada árvore de interface.",
    concepts: ["NATIVE_APP", "WEBVIEW", "context", "DOM", "transição"],
    practice: "Abra uma tela de ajuda em WebView, espere o contexto aparecer, valide conteúdo web e retorne ao contexto nativo para conferir o estado do app.",
    deliverable: "Teste híbrido que espera contexto disponível e retorna ao nativo de forma explícita.",
    checklist: ["A lista de contexts é observada antes da troca.", "Locators web só são usados no contexto WebView.", "O teste restaura o contexto necessário para o próximo passo."],
    example: `String webview = wait.until(d -> d.getContextHandles().stream()\n  .filter(name -> name.startsWith("WEBVIEW"))\n  .findFirst().orElse(null));\ndriver.context(webview);\nassertTrue(driver.findElement(By.cssSelector("main h1")).isDisplayed());\ndriver.context("NATIVE_APP");`,
  },
  {
    id: "mobile-web-selenium",
    week: 5,
    duration: "60 min",
    title: "Teste mobile web com Selenium e Appium",
    objective: "Executar um fluxo web num browser de dispositivo e distinguir comportamento responsivo de comportamento específico do browser mobile.",
    concepts: ["Chrome Android", "Safari iOS", "WebDriver", "browserName", "viewport"],
    practice: "Abra um site de teste no browser do emulador, valide navegação e formulário, e compare com browser desktop em viewport equivalente.",
    deliverable: "Smoke mobile web com diferenças reais do browser e do layout registradas.",
    checklist: ["Browser e device estão identificados nas capabilities.", "Viewport estreito sozinho não é chamado de teste mobile real.", "Comparações preservam diferenças de teclado, permissões e browser."],
    example: `// Selenium WebDriver controla o browser; Appium fornece a sessão no dispositivo.\n// Configure browserName e platformName conforme o driver e device.\n// Em mobile web, use locators DOM como CSS acessível e esperas explícitas.`,
  },
  {
    id: "permissions-lifecycle",
    week: 6,
    duration: "60 min",
    title: "Valide permissões e ciclo de vida",
    objective: "Cobrir estados de permissão, background/foreground e interrupções com setup e limpeza previsíveis.",
    concepts: ["permissão", "background", "foreground", "notificações", "estado do app"],
    practice: "Teste o primeiro pedido de uma permissão fictícia, a recusa e a retomada do app após alternar para background. Não automatize configurações reais de usuário.",
    deliverable: "Tabela de estados e um fluxo de permissão com retorno ao estado inicial.",
    checklist: ["Permissões cobrem concedida, negada e reentrada conforme regra.", "A limpeza restaura apenas dados de teste.", "Diálogos do sistema são separados dos elementos do app."],
    example: `Cenário: primeiro acesso à câmera\nDado que a permissão ainda não foi decidida\nQuando abro a leitura de código\nEntão o app explica o uso antes de solicitar acesso`,
  },
  {
    id: "reliability-artifacts",
    week: 7,
    duration: "75 min",
    title: "Reduza flakiness e preserve diagnóstico",
    objective: "Controlar dados e estado do device e guardar evidências úteis quando uma sessão falha.",
    concepts: ["isolamento", "reset", "logs", "screenshot", "flakiness"],
    practice: "Execute o mesmo caso repetidas vezes com estado limpo. Em falha, salve screenshot, page source e logs com identificador de sessão sem incluir segredos.",
    deliverable: "Estratégia de reset e artefatos condicionais para diagnóstico.",
    checklist: ["Testes não dependem da ordem.", "Reset é proporcional e não apaga dados fora do app de teste.", "Artefatos não armazenam dados pessoais, tokens ou conteúdo sensível."],
    example: `@AfterEach\nvoid captureFailureAndClose(TestInfo info) {\n  // Salvar screenshot/page source somente se o teste falhou.\n  // Nomear artefatos com teste, device e timestamp.\n  if (driver != null) driver.quit();\n}`,
  },
  {
    id: "ios-device-matrix",
    week: 8,
    duration: "75 min",
    title: "Planeje iOS e a matriz de devices",
    objective: "Levar o desenho de testes para iOS com XCUITest e escolher uma matriz enxuta por risco e suporte real.",
    concepts: ["XCUITest", "macOS", "simulador", "device real", "matriz"],
    practice: "Mapeie os fluxos críticos em Android e iOS. Escolha simuladores para feedback rápido e devices físicos para sensores, permissões e diferenças de hardware quando relevantes.",
    deliverable: "Matriz com plataforma, versão, device, prioridade e motivo de cobertura.",
    checklist: ["Build e host de iOS respeitam os requisitos da plataforma.", "A matriz cobre risco e público real, não todas combinações possíveis.", "Diferenças entre drivers não ficam escondidas em condicionais espalhadas."],
    example: `Smoke por pull request: 1 Android Emulator + fluxo principal.\nRegressão noturna: versões suportadas de Android e iOS Simulator.\nDevice real: câmera, push ou comportamento de hardware que o simulador não representa.`,
  },
  {
    id: "ci-capstone",
    week: 8,
    duration: "2 h",
    title: "Projeto final: entregue um smoke mobile confiável",
    objective: "Integrar um fluxo prioritário com Appium, cliente WebDriver, configuração externa e diagnóstico reproduzível.",
    concepts: ["suite", "CI", "device farm", "artefatos", "limites"],
    practice: "Automatize uma jornada crítica num app autorizado, rode o smoke em emulador e documente como ampliar para iOS ou device farm sem prometer cobertura inexistente.",
    deliverable: "Projeto executável com README, teste independente, configuração segura, evidências e matriz inicial.",
    checklist: ["Versões de Appium, drivers e Selenium client são compatíveis e fixadas.", "O smoke não contém credenciais nem endpoints de produção.", "A sessão sempre é fechada e falhas preservam diagnóstico seguro.", "README deixa claros devices, comandos e limites da cobertura."],
    example: `Entrega: Android smoke executável localmente, matriz planejada para iOS e browser mobile,\ncom comando CI documentado e artefatos somente em falha.`,
  },
];

export const appiumSeleniumOutcomes = [
  "Escolher entre Selenium, Appium e testes de camadas mais rápidas.",
  "Criar sessões W3C WebDriver para apps Android e browsers mobile.",
  "Usar locators acessíveis, esperas explícitas e interações estáveis.",
  "Testar WebViews, permissões, ciclo de vida e diferenças entre plataformas.",
  "Montar uma matriz de devices e um smoke pronto para CI com diagnóstico.",
];

export const appiumSeleniumFinalProject = {
  title: "Projeto final: smoke mobile multiplataforma",
  description: "Uma jornada crítica testada num alvo autorizado, com Appium, APIs WebDriver, sessões limpas e estratégia clara para ampliar a matriz.",
  deliverables: [
    "README com ambiente, versões compatíveis e instruções de execução.",
    "Um fluxo Android nativo ou mobile web com assertions observáveis.",
    "Locators semânticos e sincronização por condição.",
    "Setup e teardown que deixam o device em estado conhecido.",
    "Screenshot, page source e logs seguros em caso de falha.",
    "Matriz inicial Android/iOS e limites de cobertura documentados.",
  ],
  rubric: [
    { criterion: "Escolha da camada e risco", weight: "20%" },
    { criterion: "Estabilidade e legibilidade", weight: "25%" },
    { criterion: "Sessão, dados e ciclo de vida", weight: "20%" },
    { criterion: "Diagnóstico e segurança", weight: "15%" },
    { criterion: "Matriz e execução", weight: "20%" },
  ],
};

export const appiumSeleniumResources = [
  { label: "Appium · documentação e conceitos", href: "https://appium.io/docs/en/latest/" },
  { label: "Appium · drivers oficiais", href: "https://appium.io/docs/en/latest/ecosystem/drivers/" },
  { label: "Appium · Android UiAutomator2 quickstart", href: "https://appium.io/docs/en/latest/quickstart/uiauto2-driver/" },
  { label: "Appium · contexts para apps híbridos", href: "https://appium.io/docs/en/latest/guides/context/" },
  { label: "Appium Java Client · compatibilidade", href: "https://github.com/appium/java-client" },
  { label: "Selenium · WebDriver", href: "https://www.selenium.dev/documentation/webdriver/" },
  { label: "Selenium · Actions API", href: "https://www.selenium.dev/documentation/webdriver/actions_api/" },
];

export function findAppiumSeleniumModule(id: string) {
  return appiumSeleniumModules.find((module) => module.id === id);
}
