// Conteúdo dos carrosséis do QA Lab Playground.
// Cada carrossel: { n, slug, pilar, caption, hashtags, slides: [...] }
// Tipos de slide: cover | content | cta
// accent: mint | coral | neon | amarelo  (controla a cor de destaque do slide)

export const carousels = [
  {
    n: 1,
    slug: "70-porcento-nao-testam-api",
    pilar: "Problema + Solução",
    accent: "mint",
    caption:
      "Você sabe clicar em botões. Mas sabe o que acontece quando a API responde 200 e não salva nada?\n\nA maioria dos QAs testa só o caminho feliz — 20% do que importa. Os outros 80% (status code errado, contrato inconsistente, paginação que pula item, DELETE que não deleta) ninguém pratica.\n\nNo QA Lab você treina contra uma API quebrada de propósito e escreve o teste que prova o bug.\n\nLink nos comentários.",
    hashtags: ["#QA", "#TesteDeAPI", "#Automação", "#Playwright", "#QualidadeDeSoftware"],
    slides: [
      { kind: "cover", eyebrow: "PROBLEMA + SOLUÇÃO", title: "70% DOS QAs NÃO TESTAM APIs DE VERDADE", subtitle: "E o mercado já percebeu.", accent: "coral" },
      { kind: "content", label: "O CONFORTO", heading: "Você sabe clicar em botões", body: "Mas sabe o que acontece quando a API responde 200 e não salva nada no banco?", accent: "mint" },
      { kind: "content", label: "A ARMADILHA", heading: "O caminho feliz é só 20%", body: "Status code errado, contrato inconsistente, paginação que pula item. Os outros 80% quase ninguém testa.", accent: "coral" },
      { kind: "content", label: "POR QUE ACONTECE", heading: "Teoria não pega bug", body: "Curso de API ensina a sintaxe do request. Não ensina onde o bug costuma se esconder.", accent: "amarelo" },
      { kind: "content", label: "A SOLUÇÃO", heading: "Treine em API quebrada de propósito", body: "DELETE que não deleta. Health check mentiroso. Login sem rate limit. Bugs reais pra você caçar.", accent: "neon" },
      { kind: "content", label: "O MÉTODO", heading: "Prove, não decore", body: "Escreva o teste que confirma o bug. É assim que se vira QA de API de verdade.", accent: "mint" },
      { kind: "cta", title: "PARE DE TESTAR SÓ O CAMINHO FELIZ", body: "Pratique automação contra uma API com bugs reais.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 2,
    slug: "5-bugs-de-formulario",
    pilar: "Educacional · Tutorial",
    accent: "coral",
    caption:
      "Aquele botão que envia o form mesmo com erro? É bug. E não é o único.\n\n5 bugs que quase todo formulário esconde — e como encontrar cada um:\n\n1. Validação que aceita campo vazio\n2. Submit habilitado com erro na tela\n3. E-mail inválido passando batido\n4. Mensagem de erro que não some\n5. Duplo clique = envio dobrado\n\nTodos praticáveis no módulo Form Bugado do QA Lab.",
    hashtags: ["#QA", "#TesteDeSoftware", "#ValidaçãoFrontend", "#Automação", "#QAWeb"],
    slides: [
      { kind: "cover", eyebrow: "TUTORIAL", title: "5 BUGS QUE TODO FORMULÁRIO ESCONDE", subtitle: "E como encontrar cada um.", accent: "coral" },
      { kind: "content", label: "BUG #1", heading: "Validação que aceita vazio", body: "Campo obrigatório que envia em branco. Teste sempre o submit sem preencher nada.", accent: "coral" },
      { kind: "content", label: "BUG #2", heading: "Submit habilitado com erro", body: "A tela mostra erro vermelho, mas o botão continua clicável. E envia.", accent: "amarelo" },
      { kind: "content", label: "BUG #3", heading: "E-mail inválido passa batido", body: "'joao@', 'a@b', 'sem-arroba'. Se o regex é fraco, o dado sujo entra.", accent: "coral" },
      { kind: "content", label: "BUG #4", heading: "Erro que não some", body: "Você corrige o campo, mas a mensagem de erro continua na tela. Estado preso.", accent: "amarelo" },
      { kind: "content", label: "BUG #5", heading: "Duplo clique, envio dobrado", body: "Sem debounce, dois cliques rápidos criam dois registros. Clássico em produção.", accent: "coral" },
      { kind: "cta", title: "PRATIQUE OS 5 NO FORM BUGADO", body: "Um formulário cheio de bugs intencionais esperando seus testes.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 3,
    slug: "chaos-engineering-para-qa",
    pilar: "Autoridade · Metodologia",
    accent: "mint",
    caption:
      "Ligar e desligar o bug quando quiser muda como você aprende a testar.\n\nVocê compara o comportamento correto com o bugado lado a lado — e o padrão fica óbvio. É a base do método por trás do QA Lab.\n\nPra líderes: é assim que você acelera a evolução de um time de QA sem depender de bug em produção.",
    hashtags: ["#ChaosEngineering", "#QA", "#TreinamentoDeQA", "#QualidadeDeSoftware", "#TechLead"],
    slides: [
      { kind: "cover", eyebrow: "METODOLOGIA", title: "CHAOS ENGINEERING PARA QA", subtitle: "O método pra treinar testadores mais rápido.", accent: "mint" },
      { kind: "content", label: "A IDEIA", heading: "Bug controlável ensina", body: "E se você pudesse ligar e desligar o bug na hora que quiser?", accent: "neon" },
      { kind: "content", label: "PASSO 1", heading: "Veja o certo", body: "Observe o sistema funcionando como deveria. Esse é seu ponto de referência.", accent: "mint" },
      { kind: "content", label: "PASSO 2", heading: "Ligue o caos", body: "Ative o bug. Agora compare: o que mudou na resposta, no estado, na tela?", accent: "coral" },
      { kind: "content", label: "PASSO 3", heading: "Escreva o teste", body: "Automatize a diferença. O teste que falha no caos é o teste que protege em produção.", accent: "amarelo" },
      { kind: "content", label: "O RESULTADO", heading: "Aprendizado lado a lado", body: "Correto x bugado na mesma tela. O padrão do bug deixa de ser abstrato.", accent: "mint" },
      { kind: "cta", title: "TREINE SEU TIME COM CAOS CONTROLADO", body: "Sistemas quebráveis de propósito, sem risco de produção.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 4,
    slug: "jornada-90-dias-qa",
    pilar: "Inspiracional · Jornada",
    accent: "neon",
    caption:
      "Dia 1: testando formulário no clique.\nDia 90: escrevendo BDD e automatizando API.\n\nA diferença não é talento. É prática progressiva e deliberada.\n\nUm roadmap realista de 90 dias pra sair do teste manual e chegar na automação — usando módulos que vão do básico ao avançado.",
    hashtags: ["#CarreiraQA", "#RoadmapQA", "#Automação", "#QAJunior", "#QualidadeDeSoftware"],
    slides: [
      { kind: "cover", eyebrow: "JORNADA", title: "DE CLICAR BOTÕES À AUTOMAÇÃO EM 90 DIAS", subtitle: "Um roadmap realista de QA.", accent: "neon" },
      { kind: "content", label: "DIAS 1–15", heading: "Aprenda a enxergar bug", body: "Form Bugado: encontre, reproduza e documente. Olho clínico antes de código.", accent: "neon" },
      { kind: "content", label: "DIAS 16–40", heading: "Domine a API", body: "API Playground: status codes, contrato, paginação. Teste o que o usuário não vê.", accent: "mint" },
      { kind: "content", label: "DIAS 41–65", heading: "Escreva seu primeiro teste", body: "Playwright e Cypress nas Missões. Automatize bugs reais, não 'hello world'.", accent: "amarelo" },
      { kind: "content", label: "DIAS 66–90", heading: "Pense em cenários", body: "BDD em Gherkin, edge cases, smoke suite. Você passa de executor a estrategista.", accent: "coral" },
      { kind: "content", label: "O QUE MUDA", heading: "Mentalidade, não só ferramenta", body: "No fim você não 'usa Playwright'. Você sabe onde o bug mora — e prova.", accent: "neon" },
      { kind: "cta", title: "COMECE SEU DIA 1 HOJE", body: "Os módulos progressivos estão prontos. Falta você.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 5,
    slug: "manual-vs-qa-de-verdade",
    pilar: "Educacional · Comparação",
    accent: "coral",
    caption:
      "Se você só clica em botões, você não é QA. É um clicador de botões muito bem pago.\n\nProvocativo? Sim. Mas olha as 7 diferenças entre um testador manual e um QA de verdade — todas treináveis.\n\nEm qual lado você está hoje? E onde quer estar em 6 meses?",
    hashtags: ["#CarreiraQA", "#TesteManual", "#Automação", "#QASenior", "#QualidadeDeSoftware"],
    slides: [
      { kind: "cover", eyebrow: "COMPARAÇÃO", title: "TESTADOR MANUAL X QA DE VERDADE", subtitle: "7 diferenças que ninguém te conta.", accent: "coral" },
      { kind: "content", label: "#1", heading: "Reage x previne", body: "Manual espera o ticket. QA caça o bug antes dele virar incidente.", accent: "coral" },
      { kind: "content", label: "#2", heading: "Clica x automatiza", body: "Manual repete o teste na mão. QA escreve uma vez e roda mil vezes.", accent: "mint" },
      { kind: "content", label: "#3", heading: "Tela x API", body: "Manual confia no que aparece. QA valida o que a API realmente devolve.", accent: "amarelo" },
      { kind: "content", label: "#4", heading: "Caminho feliz x edge case", body: "Manual testa o óbvio. QA quebra com timezone, vazio, limite e duplicidade.", accent: "coral" },
      { kind: "content", label: "#5–7", heading: "Acha x prova", body: "QA documenta, classifica severidade e entrega evidência. Não é 'achismo'.", accent: "neon" },
      { kind: "cta", title: "VIRE UM QA DE VERDADE", body: "Cada diferença acima tem um módulo pra você treinar.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 6,
    slug: "10-endpoints-47-bugs",
    pilar: "Prova Social · Caso de Estudo",
    accent: "mint",
    caption:
      "Eles aprenderam a quebrar APIs de mentira. Agora estão salvando APIs de verdade.\n\nO raciocínio treinado num ambiente seguro vai junto pro trabalho: status code, contrato, idempotência, rate limit.\n\nQuando você pratica caçar bug de propósito, achar bug em produção vira hábito.",
    hashtags: ["#ChaosEngineering", "#TesteDeAPI", "#BugsEmProdução", "#QA", "#QualidadeDeSoftware"],
    slides: [
      { kind: "cover", eyebrow: "CASO DE ESTUDO", title: "QUEBRAR API DE MENTIRA SALVA API DE VERDADE", subtitle: "Como a prática transfere pro trabalho.", accent: "mint" },
      { kind: "content", label: "O TREINO", heading: "Endpoints bugados de propósito", body: "DELETE que não deleta, health check mentiroso, contrato inconsistente.", accent: "coral" },
      { kind: "content", label: "O QUE FICA", heading: "Padrões, não exemplos", body: "Você para de memorizar casos e começa a reconhecer onde o bug mora.", accent: "mint" },
      { kind: "content", label: "NO TRABALHO", heading: "O mesmo olhar, em produção", body: "Status code errado, idempotência furada, rate limit ausente — você já viu isso antes.", accent: "amarelo" },
      { kind: "content", label: "O RESULTADO", heading: "Bug achado antes do deploy", body: "Caçar bug deixa de ser sorte e vira processo repetível.", accent: "neon" },
      { kind: "cta", title: "TREINE O OLHAR QUE PEGA BUG", body: "Os endpoints quebrados estão esperando.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 7,
    slug: "checklist-5-pontos",
    pilar: "Educacional · Framework",
    accent: "amarelo",
    caption:
      "Testou com dados válidos? Ótimo. Agora faz os outros 80% que você esqueceu.\n\nO checklist de 5 pontos pra você nunca mais chamar um teste de 'completo' cedo demais:\n\n1. Funcional\n2. Regressão\n3. Smoke\n4. Segurança\n5. Exploratório\n\nCada um praticável no QA Lab.",
    hashtags: ["#TiposDeTeste", "#FrameworkDeTeste", "#QA", "#BoasPráticas", "#QualidadeDeSoftware"],
    slides: [
      { kind: "cover", eyebrow: "FRAMEWORK", title: "5 PONTOS ANTES DE CHAMAR DE 'COMPLETO'", subtitle: "O checklist que separa QA bom de QA mediano.", accent: "amarelo" },
      { kind: "content", label: "PONTO 1", heading: "Funcional", body: "Faz o que promete? Teste a regra de negócio com dados válidos e inválidos.", accent: "mint" },
      { kind: "content", label: "PONTO 2", heading: "Regressão", body: "O que funcionava ainda funciona? Mudança nova não pode quebrar o antigo.", accent: "neon" },
      { kind: "content", label: "PONTO 3", heading: "Smoke", body: "O básico sobe? Um teste rápido que diz se vale a pena continuar testando.", accent: "amarelo" },
      { kind: "content", label: "PONTO 4", heading: "Segurança", body: "Sem rate limit? Sem validação? Input malicioso passa? Teste o abuso.", accent: "coral" },
      { kind: "content", label: "PONTO 5", heading: "Exploratório", body: "Saia do roteiro. Use o sistema como um usuário caótico usaria.", accent: "mint" },
      { kind: "cta", title: "PRATIQUE OS 5 TIPOS", body: "Cada ponto do checklist tem onde treinar no lab.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 8,
    slug: "3-coisas-que-voce-nao-testou",
    pilar: "Problema + Urgência",
    accent: "coral",
    caption:
      "Timezone, paginação quebrada e validação mentirosa.\nSe você não testou, você não testou.\n\nEsses 3 são os que mais escapam pra produção — e os que mais aparecem em todo sistema.\n\nJá te pegou? Conta nos comentários.",
    hashtags: ["#BugsEmProdução", "#EdgeCases", "#TestesAvançados", "#QA", "#QualidadeDeSoftware"],
    slides: [
      { kind: "cover", eyebrow: "ALERTA", title: "SEU BUG FOI PRA PRODUÇÃO POR 3 COISAS", subtitle: "Que você provavelmente não testou.", accent: "coral" },
      { kind: "content", label: "COISA #1", heading: "Timezone", body: "Fuso, horário de verão, virada de dia. O relógio é o assassino silencioso do QA.", accent: "coral" },
      { kind: "content", label: "COISA #2", heading: "Paginação", body: "Item que some entre páginas, ordenação que muda, total que não bate.", accent: "amarelo" },
      { kind: "content", label: "COISA #3", heading: "Validação mentirosa", body: "A tela diz 'salvo'. O banco não recebeu nada. 200 não é garantia.", accent: "coral" },
      { kind: "content", label: "POR QUE ESCAPAM", heading: "Não estão no caminho feliz", body: "São invisíveis no teste óbvio. Só aparecem quando você procura no limite.", accent: "neon" },
      { kind: "cta", title: "TESTE O QUE ESCAPA", body: "Esses 3 cenários têm módulo dedicado no lab.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 9,
    slug: "seletores-que-nao-quebram",
    pilar: "Educacional · Automação",
    accent: "mint",
    caption:
      "Seu teste quebrou porque mudaram o CSS. De novo.\n\ndata-testid x CSS x XPath: o guia rápido de seletores que sobrevivem a refactor.\n\nRegra de ouro: amarre o teste na intenção, não na aparência.",
    hashtags: ["#Automação", "#Seletores", "#dataTestid", "#TestesE2E", "#Playwright"],
    slides: [
      { kind: "cover", eyebrow: "AUTOMAÇÃO", title: "SELETORES QUE NÃO QUEBRAM", subtitle: "data-testid x CSS x XPath.", accent: "mint" },
      { kind: "content", label: "O PROBLEMA", heading: "Mudou o CSS, quebrou o teste", body: "Seu E2E dependia de '.btn-primary-2'. O dev renomeou. Vermelho geral.", accent: "coral" },
      { kind: "content", label: "OPÇÃO RUIM", heading: "XPath frágil", body: "/div[3]/span[2]/button quebra ao mínimo refactor de layout. Evite.", accent: "coral" },
      { kind: "content", label: "OPÇÃO OK", heading: "CSS semântico", body: "Classe estável e significativa ajuda, mas ainda muda com redesign.", accent: "amarelo" },
      { kind: "content", label: "OPÇÃO BOA", heading: "data-testid", body: "Um atributo só pro teste. Independente de estilo, texto e estrutura.", accent: "neon" },
      { kind: "content", label: "A REGRA", heading: "Amarre na intenção", body: "Teste o que o elemento É, não como ele parece. Refactor deixa de assustar.", accent: "mint" },
      { kind: "cta", title: "TREINE COM SELETORES REAIS", body: "O módulo de Elementos expõe todos os seletores pra prática.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
  {
    n: 10,
    slug: "parar-de-clicar-comecar-a-quebrar",
    pilar: "Manifesto · Visão",
    accent: "neon",
    caption:
      "Clicar é reagir. Quebrar de propósito é prevenir.\n\nQA não é quem confirma que funciona. É quem descobre como falha — antes do usuário.\n\nO QA brasileiro precisa trocar o roteiro pelo raciocínio. Bora?",
    hashtags: ["#MentalidadeQA", "#CulturaDeQualidade", "#QABrasil", "#QualidadeDeSoftware", "#QALab"],
    slides: [
      { kind: "cover", eyebrow: "MANIFESTO", title: "PARE DE CLICAR. COMECE A QUEBRAR.", subtitle: "Uma nova mentalidade de QA.", accent: "neon" },
      { kind: "content", label: "A VERDADE", heading: "Clicar é reagir", body: "Seguir roteiro confirma o óbvio. Não é isso que protege o usuário.", accent: "coral" },
      { kind: "content", label: "A VIRADA", heading: "Quebrar é prevenir", body: "Procurar a falha de propósito é o que pega o bug antes da produção.", accent: "neon" },
      { kind: "content", label: "O QA NOVO", heading: "Descobre como falha", body: "Não pergunta 'funciona?'. Pergunta 'em que condição isso quebra?'.", accent: "mint" },
      { kind: "content", label: "A PRÁTICA", heading: "Treine em sistema quebrado", body: "Você não aprende a achar bug em sistema sem bug. Precisa de alvo real.", accent: "amarelo" },
      { kind: "cta", title: "JUNTE-SE AO MOVIMENTO", body: "Aprenda QA quebrando coisas de propósito.", cta: "Acesse o QA Lab", accent: "mint" },
    ],
  },
];
