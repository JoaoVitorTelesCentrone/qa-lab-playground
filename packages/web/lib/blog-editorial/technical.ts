import type { EditorialSeries } from "./types";

export const technicalSeries: EditorialSeries[] = [
  {
    id: "cicd", title: "CI/CD", href: "/trilhas/cicd", section: "Ferramentas e técnicas", color: "#9fbce7",
    stories: [
      {
        slug: "o-que-deve-bloquear-um-deploy", title: "O que deve impedir um deploy no pipeline", summary: "Transforme critérios de qualidade em decisões automáticas e compreensíveis.",
        opening: "Um pipeline pode executar dezenas de verificações e ainda não dizer se a entrega está segura. Um bloqueio só ajuda quando o time entende qual risco ele protege e como corrigir a falha. Regras arbitrárias geram exceções frequentes; regras invisíveis fazem o deploy parecer uma loteria.",
        example: "Para um checkout, falha de compilação, teste do pedido principal ou contrato de pagamento podem impedir a entrega. Uma diferença visual em uma página secundária talvez gere análise, não bloqueio imediato. A decisão depende do impacto e da confiança da verificação.",
        steps: ["Separe verificações obrigatórias de sinais que pedem revisão humana.", "Associe cada bloqueio a um risco de usuário ou operação.", "Garanta que a falha mostre evidência e um responsável pelo próximo passo."],
        caution: "Um teste instável como gate faz o time aprender a ignorar o pipeline. Corrija a instabilidade antes de endurecer a regra.",
        exercise: "Desenhe três gates para uma mudança no carrinho e explique qual risco cada um impede de chegar à produção."
      },
      {
        slug: "teste-falha-so-no-ci", title: "Como investigar um teste que falha só no CI", summary: "Compare ambiente, dados e tempo antes de culpar a ferramenta.",
        opening: "‘Na minha máquina funciona’ descreve uma diferença, não uma causa. O CI pode usar outra versão de navegador, outro fuso, menos recursos, dados concorrentes ou segredos ausentes. A investigação ganha velocidade quando cada tentativa elimina uma hipótese.",
        example: "Um teste de pedido passa localmente e falha no CI ao procurar a confirmação. Compare a resposta da API, o tempo de criação do pedido, o usuário de teste e a captura do navegador. Uma espera fixa maior pode esconder o sintoma sem explicar por que ele apareceu.",
        steps: ["Reúna logs, captura, ambiente, versão e horário da execução que falhou.", "Reproduza com configurações semelhantes às do CI e altere uma variável por vez.", "Corrija a causa e mantenha uma evidência de que a falha deixou de ocorrer."],
        caution: "Reexecutar até ficar verde não prova que o problema desapareceu; pode apenas selecionar uma tentativa favorável.",
        exercise: "Liste cinco diferenças possíveis entre seu ambiente e o CI para um teste de login; ordene-as por facilidade de verificação."
      },
      {
        slug: "evidencias-de-execucao-automatica", title: "Quais evidências guardar de uma execução automática", summary: "Guarde o suficiente para reconstruir a falha sem arquivar ruído infinito.",
        opening: "Uma linha vermelha no pipeline avisa que algo falhou, mas raramente explica o motivo. Evidências úteis ligam teste, versão, ambiente e momento da falha. O objetivo é permitir diagnóstico depois que o ambiente temporário já desapareceu.",
        example: "Em um teste de pagamento, um trace ou vídeo curto, a resposta relevante da API e o identificador do commit podem mostrar se houve falha de interface, serviço ou dados. Um arquivo gigante com todos os logs do dia dificulta encontrar esse ponto.",
        steps: ["Registre commit, ambiente, versão e nome do cenário junto ao resultado.", "Salve artefatos que mostrem a última ação e a resposta observada.", "Defina retenção e remova credenciais, tokens e dados pessoais dos arquivos."],
        caution: "Evidência automática também pode vazar dados. Revise o que screenshots e logs capturam antes de torná-los acessíveis.",
        exercise: "Escolha uma falha de CI fictícia e escreva quais três artefatos permitiriam investigá-la no dia seguinte."
      }
    ]
  },
  {
    id: "cypress", title: "Cypress", href: "/trilhas/cypress", section: "Ferramentas e técnicas", color: "#a1d9bd",
    source: { label: "Documentação do Cypress", href: "https://docs.cypress.io/" },
    stories: [
      {
        slug: "seletores-estaveis-no-cypress", title: "Seletores que sobrevivem a mudanças de interface", summary: "Faça o teste apontar para a intenção, não para um detalhe acidental do CSS.",
        opening: "Quando um teste depende da terceira div dentro de um card, uma mudança visual quebra a suíte sem mudar o comportamento. O seletor deve representar um elemento reconhecível e uma intenção estável. Rótulos acessíveis ajudam quando fazem parte da experiência; identificadores de teste ajudam quando o texto muda com frequência.",
        example: "Para confirmar um pedido, localizar o botão pelo nome ‘Finalizar compra’ expressa o que a pessoa faz. Se houver dois botões com o mesmo texto, delimite a área do checkout. Evite uma cadeia longa de classes geradas pelo estilo.",
        steps: ["Prefira um alvo com significado: papel, rótulo ou identificador acordado com o time.", "Delimite o contexto antes de buscar um elemento repetido.", "Revise seletores após mudanças de produto, não apenas quando o teste quebrar."],
        caution: "Um seletor estável não corrige uma asserção fraca. Verifique também o resultado que importa.",
        exercise: "Reescreva três seletores frágeis de um fluxo de compra e anote por que os novos resistem melhor a mudanças de layout."
      },
      {
        slug: "cypress-intercept-ou-api-real", title: "Quando usar cy.intercept e quando chamar a API real", summary: "Escolha o tipo de dependência que o teste precisa exercitar.",
        opening: "Interceptar uma resposta permite controlar erro, carregamento e estado vazio com dados previsíveis. Isso é ótimo para testar a reação da interface. Mas uma suíte que simula todas as respostas pode passar mesmo quando a integração real está quebrada. Os dois tipos de teste respondem a perguntas diferentes.",
        example: "Simule uma resposta 500 para verificar se a Shop explica o erro e oferece nova tentativa. Em outro cenário, use o serviço real do ambiente de teste para garantir que um pedido criado aparece na lista. Não peça ao mesmo teste para provar isolamento e integração ao mesmo tempo.",
        steps: ["Escreva qual comportamento quer provar: UI diante de uma resposta ou integração ponta a ponta.", "Use respostas controladas para estados difíceis de produzir de forma confiável.", "Mantenha pelo menos um fluxo crítico contra serviços reais e dados isolados."],
        caution: "Uma resposta simulada deve representar o contrato atual; mocks antigos podem esconder uma mudança de API.",
        exercise: "Separe quatro cenários de carrinho entre simulados e integrados. Diga o que cada grupo consegue e não consegue provar."
      },
      {
        slug: "reduzir-flakiness-no-cypress", title: "Como reduzir testes instáveis sem esconder defeitos", summary: "Troque espera por observação e recupere a confiança na suíte.",
        opening: "Um teste instável falha sem que o time saiba se houve defeito no produto. A resposta comum é aumentar esperas ou repetir a execução. Isso reduz o barulho momentâneo, mas aumenta o tempo e enfraquece o sinal. Investigue sincronização, dados e dependência entre testes antes de mexer nos tempos.",
        example: "Um teste clica em ‘Salvar’ e espera dois segundos antes de conferir o resultado. Em uma execução lenta, dois segundos não bastam. Em uma rápida, são desperdício. Espere por um estado observável: resposta da requisição, mensagem de confirmação ou item atualizado.",
        steps: ["Descubra se a falha vem de sincronização, massa compartilhada ou ambiente.", "Substitua tempos fixos por asserções sobre o estado que marca o fim da ação.", "Execute o caso isolado e em conjunto para detectar dependências ocultas."],
        caution: "Não silencie uma falha intermitente antes de confirmar se ela também afeta pessoas reais.",
        exercise: "Encontre um `wait` fixo em uma suíte de treino e descreva qual evento observável pode substituí-lo."
      }
    ]
  },
  {
    id: "playwright", title: "Playwright", href: "/trilhas/playwright", section: "Ferramentas e técnicas", color: "#b4acec",
    source: { label: "Documentação do Playwright", href: "https://playwright.dev/docs/intro" },
    stories: [
      {
        slug: "playwright-locators-e-esperas", title: "Locators e esperas automáticas na prática", summary: "Encontre o elemento certo e espere pelo estado certo.",
        opening: "Locators representam um alvo que o Playwright procura no momento da ação. Eles funcionam bem quando o teste descreve um controle que a pessoa reconhece, como um botão ou campo com nome. A espera automática ajuda com ações e asserções, mas não adivinha que processo de negócio você esperava terminar.",
        example: "Depois de enviar um formulário, buscar a mensagem ‘Pedido confirmado’ e afirmar que ela aparece é mais claro que dormir três segundos. Se o pedido depende de processamento assíncrono, o teste ainda precisa observar um resultado apropriado para esse processo.",
        steps: ["Comece com papel e nome acessível; use rótulo de formulário quando fizer sentido.", "Faça uma asserção sobre o resultado final, não só sobre o clique.", "Investigue timeout com trace e estado da página antes de aumentar o prazo."],
        caution: "Esperar automaticamente não transforma um seletor ambíguo em confiável; o locator precisa identificar o controle correto.",
        exercise: "Escreva um teste de login usando nomes visíveis e uma asserção que prove que a sessão foi iniciada."
      },
      {
        slug: "playwright-trace-para-entender-falhas", title: "Como usar o trace para entender uma falha", summary: "Reconstitua ações, estado visual e rede no ponto em que o teste divergiu.",
        opening: "Um erro final como ‘elemento não encontrado’ raramente conta a história completa. O trace permite percorrer ações e observar como a página estava antes e depois de cada uma. Ele é especialmente útil quando a falha ocorreu no CI e não aparece localmente.",
        example: "O teste esperava o botão de confirmação, mas o trace mostra um aviso de sessão expirada após o envio. A causa provável deixa de ser o seletor do botão e passa a ser a autenticação ou o tempo de vida da sessão.",
        steps: ["Abra o trace no passo anterior à falha, não apenas na última tela.", "Compare ação, DOM, captura e requisições relevantes.", "Formule uma hipótese e tente reproduzi-la com a mesma massa e ambiente."],
        caution: "O trace mostra o que aconteceu naquela execução; não prova sozinho por que o sistema se comportou assim.",
        exercise: "Pegue um teste falho de treino e escreva três observações do trace, separadas de sua hipótese de causa."
      },
      {
        slug: "o-que-testar-em-varios-navegadores", title: "O que vale testar em vários navegadores", summary: "Escolha cobertura de navegador a partir de comportamento e risco.",
        opening: "Executar tudo em todos os navegadores pode consumir tempo sem acrescentar muito sinal. Cobertura útil começa com as plataformas usadas pelo público e com comportamentos sensíveis a diferenças de implementação: formulários, upload, permissões, navegação e layout.",
        example: "Uma página de compra pode receber um smoke em todos os navegadores suportados e uma regressão profunda em um deles. Se um componente de upload apresentou histórico de diferenças, seus testes merecem distribuição maior.",
        steps: ["Defina quais navegadores e versões o produto realmente suporta.", "Mapeie fluxos críticos e componentes com maior chance de divergência.", "Distribua smoke e regressão detalhada de modo proporcional ao risco."],
        caution: "Uma matriz enorme de combinações não substitui a decisão explícita sobre quais usuários serão protegidos.",
        exercise: "Monte uma matriz de três navegadores e cinco fluxos; explique onde faria smoke e onde faria teste aprofundado."
      }
    ]
  },
  {
    id: "appium-selenium", title: "Automação mobile", href: "/trilhas/appium-selenium", section: "Ferramentas e técnicas", color: "#f0b894",
    source: { label: "Documentação do Appium", href: "https://appium.io/docs/en/latest/" },
    stories: [
      {
        slug: "web-nativo-webview-no-mobile", title: "Web, aplicativo nativo e WebView: o que muda no teste", summary: "Reconheça a superfície antes de escolher ferramenta e estratégia.",
        opening: "Uma jornada no celular pode atravessar navegador, telas nativas e conteúdo web embutido. A aparência parecida não significa a mesma árvore de elementos, os mesmos gestos nem o mesmo ambiente. Identificar a superfície evita selecionar um elemento da tela errada ou confiar em um teste que nunca atravessou a transição importante.",
        example: "Um pagamento abre uma WebView dentro do aplicativo. O teste precisa verificar a passagem de contexto, a resposta do pagamento e a volta à tela nativa. Testar apenas o formulário web deixa a integração com o app sem cobertura.",
        steps: ["Mapeie cada etapa da jornada e marque se é web, nativa ou híbrida.", "Escolha o driver e os contextos compatíveis com a plataforma usada.", "Verifique transições e retorno ao app com um resultado observável."],
        caution: "Um teste verde dentro de uma WebView não garante que notificações, permissões e navegação nativa funcionem.",
        exercise: "Desenhe uma jornada de login mobile com as superfícies atravessadas e o resultado esperado em cada transição."
      },
      {
        slug: "elementos-estaveis-no-appium", title: "Como escolher elementos estáveis no Appium", summary: "Use identificadores com significado e trate mudanças de tela com cuidado.",
        opening: "Localizadores baseados em coordenadas ou hierarquias longas tendem a quebrar quando muda o aparelho, a fonte ou o layout. O ideal é negociar identificadores e descrições acessíveis que representem controles importantes. Gestos por posição ainda podem ser necessários, mas devem ser exceção justificada.",
        example: "Para abrir o histórico, um identificador estável para a aba é melhor que tocar em x=320, y=780. Em um aparelho estreito, a coordenada pode cair em outra área; um alvo semântico mantém a intenção legível.",
        steps: ["Inspecione a árvore do app e procure identificadores ou rótulos consistentes.", "Combine com desenvolvimento nomes estáveis para controles críticos.", "Valide o locator em tamanhos e estados de tela diferentes."],
        caution: "Um elemento encontrável pode estar coberto ou desabilitado. Confirme que a interação produziu o comportamento esperado.",
        exercise: "Revise três interações por coordenada em um fluxo mobile e proponha alvos semânticos ou uma justificativa para mantê-las."
      },
      {
        slug: "matriz-realista-de-dispositivos", title: "Uma estratégia realista para dispositivos e versões", summary: "Selecione combinações que representem usuários e riscos reais.",
        opening: "Não existe tempo para testar cada aparelho do mercado. Uma matriz útil combina dados de uso, versões suportadas e características que mudam o comportamento: tamanho de tela, permissões, desempenho e sistema operacional. Ela deve ser revista quando o público ou o app mudarem.",
        example: "Uma jornada de câmera pode receber teste profundo em um aparelho real de cada plataforma suportada e smoke em emuladores de tamanhos distintos. Se a falha ocorre só em uma versão específica do Android, essa combinação passa a ter prioridade.",
        steps: ["Liste plataformas e versões que o produto decidiu suportar.", "Escolha aparelhos representativos e identifique recursos sensíveis a hardware.", "Separe smoke frequente de uma rodada mais ampla antes de releases importantes."],
        caution: "Emulador ajuda a encontrar muita coisa, mas não substitui toda verificação de câmera, biometria ou desempenho em aparelho real.",
        exercise: "Monte uma matriz enxuta para um app de agenda: dois tamanhos, duas plataformas e uma função que exige dispositivo físico."
      }
    ]
  },
  {
    id: "testes-api", title: "Testes de API", href: "/trilhas/testes-api", section: "Ferramentas e técnicas", color: "#8fd0d2",
    stories: [
      {
        slug: "api-contrato-erros-autorizacao", title: "Como testar contrato, erros e autorização de uma API", summary: "Uma resposta 200 não basta para confiar numa integração.",
        opening: "Testar API exige olhar estrutura, significado e controle de acesso. Um endpoint pode responder com sucesso e devolver dados incompletos; pode negar a pessoa errada e liberar a pessoa certa por acidente. Comece pelo contrato acordado e pelos papéis que podem executar cada ação.",
        example: "Em `GET /pedidos/123`, confirme os campos exigidos e seus tipos, a resposta para um ID inexistente e a negação de acesso a um pedido de outra pessoa. A combinação mostra mais que um único teste feliz autenticado.",
        steps: ["Descreva operação, entradas, saída e regras de autorização esperadas.", "Teste valores válidos, inválidos, ausentes e limites relevantes.", "Verifique corpo, status e ausência de dados sensíveis nos caminhos de erro."],
        caution: "Não trate toda resposta de erro como equivalente. O status e a mensagem devem ajudar o cliente sem revelar informação privada.",
        exercise: "Escolha um endpoint do Lab de API e escreva três verificações: contrato, dado inválido e acesso proibido."
      },
      {
        slug: "bruno-colecoes-versionadas", title: "Coleções Bruno versionadas com o projeto", summary: "Faça a coleção acompanhar o código e as decisões do time.",
        opening: "Uma coleção útil registra exemplos de requisição, ambiente e expectativas. Quando seus arquivos acompanham o repositório, a revisão da API pode incluir a revisão das verificações. Isso não substitui testes automatizados de serviço; torna a exploração e a documentação operacional mais próximas da mudança.",
        example: "Ao adicionar uma regra de desconto, inclua na coleção uma requisição válida e outra rejeitada. Na revisão do código, o time enxerga se os exemplos refletem o novo contrato e pode executá-los no ambiente de treino.",
        steps: ["Organize requisições por recurso e nomeie cada cenário pela regra que verifica.", "Separe valores de ambiente e mantenha segredos fora dos arquivos versionados.", "Revise a coleção no mesmo fluxo em que o contrato muda."],
        caution: "Versionar a coleção não autoriza versionar tokens reais ou dados de clientes.",
        exercise: "Crie duas requisições para um recurso fictício de pedidos e descreva qual alteração no contrato exigiria atualizar ambas."
      },
      {
        slug: "postman-ambientes-e-dados", title: "Como organizar ambientes e dados no Postman", summary: "Evite que uma coleção passe por causa de estado escondido.",
        opening: "Uma coleção que depende do último teste executado ou de um ID copiado manualmente é difícil de repetir. Ambientes devem declarar URLs e variáveis necessárias; cada fluxo precisa preparar ou identificar seus dados e limpar o que for possível. O objetivo é permitir que outra pessoa execute a mesma intenção.",
        example: "Um teste de cancelar pedido precisa de um pedido ativo. Em vez de depender de um ID antigo, crie o pedido no começo do fluxo, guarde o identificador para a execução e confirme o estado final. Não use dados de produção.",
        steps: ["Separe URL, credenciais e dados por ambiente com nomes claros.", "Prepare pré-condições dentro do fluxo ou documente um fixture reproduzível.", "Revise scripts e variáveis para impedir dependência de estado de uma execução anterior."],
        caution: "Uma coleção que só passa na conta do autor ainda não está pronta para uso pelo time.",
        exercise: "Descreva um fluxo criar, consultar e cancelar pedido que rode duas vezes seguidas sem intervenção manual."
      }
    ]
  },
  {
    id: "k6", title: "Performance com k6", href: "/trilhas/k6", section: "Ferramentas e técnicas", color: "#e8b9d4",
    source: { label: "Documentação do k6", href: "https://grafana.com/docs/k6/latest/" },
    stories: [
      {
        slug: "modelar-carga-sem-inventar-numero", title: "Como modelar usuários e carga sem inventar números", summary: "Uma carga útil representa uma hipótese sobre o uso do produto.",
        opening: "Começar um teste com mil usuários virtuais porque parece desafiador gera números difíceis de interpretar. Modele jornadas, chegada de usuários, duração e distribuição de ações com base em tráfego observado ou em uma meta de capacidade explicitamente hipotética. O cenário deve dizer o que se pretende aprender.",
        example: "Se a Shop recebe picos de consulta ao catálogo e menos finalizações de pedido, um cenário só de checkout não representa esse uso. Misture operações na proporção conhecida ou assuma uma proporção de treino e deixe a hipótese visível.",
        steps: ["Defina a pergunta: capacidade atual, comparação de versões ou comportamento em pico.", "Escolha jornada, ritmo e duração com base em dado ou hipótese declarada.", "Registre ambiente e volume para comparar execuções equivalentes."],
        caution: "Não interprete uma execução em ambiente compartilhado como capacidade de produção sem conhecer as diferenças.",
        exercise: "Desenhe um cenário de carga para catálogo e checkout com proporções assumidas e explique por que escolheu cada uma."
      },
      {
        slug: "thresholds-de-experiencia-aceitavel", title: "Thresholds que representam uma experiência aceitável", summary: "Transforme a expectativa do serviço em critério de aprovação.",
        opening: "No k6, thresholds expressam condições de aprovação para métricas. Um limite útil nasce de uma expectativa do produto e de uma linha de base, não de um número copiado de outro sistema. Defina também qual taxa de falha é aceitável, porque rapidez com respostas erradas não é qualidade.",
        example: "Para um endpoint de busca, o time pode decidir medir o percentil 95 de duração e a proporção de requisições com erro. O valor exato deve ser acordado conforme o uso e medido no ambiente relevante; não há um ‘500 ms’ universal.",
        steps: ["Escolha a jornada e o efeito percebido por quem usa o produto.", "Defina métricas de tempo e correção, com limites justificados.", "Execute uma linha de base e revise os limites quando o contexto mudar."],
        caution: "Um threshold verde não prova boa experiência se o script deixou de representar a jornada real.",
        exercise: "Proponha dois thresholds para uma busca e escreva qual decisão cada um permitiria tomar."
      },
      {
        slug: "ler-resultado-k6-encontrar-gargalo", title: "Lendo resultados do k6 para encontrar o gargalo", summary: "Use métricas como pistas para investigar, não como diagnóstico automático.",
        opening: "Uma média de tempo de resposta pode esconder uma cauda lenta. Compare percentis, taxa de erros, volume e comportamento ao longo da carga. Depois correlacione com observabilidade do servidor, banco e rede. O resultado do k6 aponta onde olhar; sozinho não identifica a linha de código culpada.",
        example: "Durante uma rampa de carga, o percentil 95 sobe e começam erros 503. Isso sugere um limite de capacidade, mas a causa pode estar em conexões, fila, dependência externa ou configuração. Métricas internas ajudam a separar essas hipóteses.",
        steps: ["Confirme que a carga executada correspondeu ao cenário planejado.", "Compare tempo, erros e throughput por etapa, não apenas a média final.", "Cruze o ponto de degradação com logs e métricas dos serviços envolvidos."],
        caution: "Mude uma condição por vez entre execuções comparativas para não atribuir melhora à causa errada.",
        exercise: "Imagine uma curva com tempo estável até certo volume e erros crescentes depois. Liste três hipóteses e um dado que testaria cada uma."
      }
    ]
  },
  {
    id: "sql-qa", title: "SQL para QA", href: "/trilhas/sql-qa", section: "Ferramentas e técnicas", color: "#d8c792",
    stories: [
      {
        slug: "sql-conferir-dados-da-interface", title: "Consultas SQL para conferir dados após uma ação", summary: "Use o banco como uma evidência adicional do estado salvo.",
        opening: "Uma mensagem de sucesso na interface não garante que a mudança foi persistida corretamente. Uma consulta pode verificar o registro criado, os valores normalizados e o vínculo com a pessoa certa. Faça isso em ambiente autorizado de treino, com acesso somente ao que o teste precisa.",
        example: "Após criar um pedido, consulte pelo identificador retornado e compare itens, total e status. Se a tela mostra um total e o banco guarda outro, você tem uma pista concreta para investigar a transformação dos dados.",
        steps: ["Defina qual ação e qual campo persistido comprovam a regra.", "Filtre por um identificador único da execução para evitar registros parecidos.", "Compare o estado antes e depois e registre a consulta usada na investigação."],
        caution: "Não trate o banco como única fonte da verdade: algumas regras dependem de eventos ou serviços fora dele.",
        exercise: "Escreva uma consulta filtrada para verificar um pedido de treino recém-criado e anote o resultado esperado."
      },
      {
        slug: "joins-investigar-inconsistencias", title: "JOIN para investigar registros inconsistentes", summary: "Relacione tabelas para descobrir onde uma regra deixou de se cumprir.",
        opening: "Muitos defeitos aparecem na relação entre entidades, não em uma tabela isolada. Um JOIN permite comparar o pedido com seus itens, o agendamento com o profissional ou a oportunidade com o cliente. O cuidado principal é entender cardinalidade para não confundir duplicação de linhas com duplicação de dados.",
        example: "Um pedido diz ter três itens, mas a soma exibida considera dois. Junte pedidos e itens, confira quantos registros existem e compare os subtotais. Um LEFT JOIN pode mostrar pedidos sem itens, caso isso seja um estado inválido.",
        steps: ["Desenhe a relação e identifique as chaves antes de escrever a consulta.", "Filtre um caso conhecido e confira a quantidade de linhas esperada.", "Agregue apenas depois de confirmar que o JOIN não multiplicou resultados."],
        caution: "Uma linha a mais após o JOIN não é automaticamente um registro duplicado; pode ser uma relação um para muitos.",
        exercise: "Monte uma consulta de treino para listar pedidos e quantidade de itens, incluindo pedidos sem itens."
      },
      {
        slug: "preparar-limpar-dados-de-teste", title: "Como preparar e limpar dados de teste com segurança", summary: "Faça a execução ser repetível sem deixar resíduos perigosos.",
        opening: "Dados improvisados tornam testes dependentes de estado antigo. Dados bem preparados têm identidade, objetivo e duração conhecidos. A limpeza deve respeitar chaves, auditoria e ambiente; apagar em massa para deixar tudo ‘limpo’ é uma fonte de risco, não uma prática de QA.",
        example: "Para testar conflito de agenda, crie dois horários com IDs controlados em um ambiente de treino. Depois remova apenas os registros dessa execução, se o fluxo permitir, ou use transação descartável quando apropriado. O próximo teste deve começar previsivelmente.",
        steps: ["Separe dados mínimos por cenário e marque os registros criados pela execução.", "Use transações ou rotinas de limpeza específicas e verificáveis.", "Confirme que a próxima execução não depende do resultado da anterior."],
        caution: "Nunca execute limpeza destrutiva em dados compartilhados sem escopo e autorização claros.",
        exercise: "Descreva a preparação e a limpeza de três registros para um teste de agendamento, sem usar um comando genérico de apagar tabela."
      }
    ]
  },
  {
    id: "metricas-qa", title: "Métricas para QA", href: "/trilhas/metricas-qa", section: "Ferramentas e técnicas", color: "#b9d5a0",
    stories: [
      {
        slug: "kpis-que-ajudam-qa-decidir", title: "KPIs que ajudam QA a tomar decisões", summary: "Escolha indicadores a partir da pergunta que o time precisa responder.",
        opening: "Um KPI vale pelo comportamento que ajuda a melhorar. Acompanhar defeitos em produção, tempo de resolução e estabilidade de testes pode revelar riscos diferentes. Antes de criar um gráfico, defina qual decisão será tomada quando o indicador mudar e quem pode agir sobre ela.",
        example: "Se incidentes de pagamento crescem após releases, o time pode comparar frequência por versão, tipo de mudança e tempo até detectar a falha. Isso orienta revisão da cobertura e do processo de entrega; um número isolado de bugs não explica nada.",
        steps: ["Formule uma pergunta operacional, como ‘onde estamos descobrindo defeitos tarde?’.", "Escolha indicador, fórmula, janela e fonte de dados compreensíveis.", "Combine uma ação possível para alta, queda ou falta de dados."],
        caution: "Não use o KPI para ranquear pessoas. Métricas de qualidade descrevem o sistema de trabalho.",
        exercise: "Escolha uma decisão de release e proponha dois indicadores que a informem, com limitações explícitas."
      },
      {
        slug: "por-que-contar-bugs-engana", title: "Por que contar bugs isoladamente engana", summary: "Quantidade sem contexto mistura descoberta, risco e hábito de registro.",
        opening: "Mais bugs registrados podem significar pior qualidade, mais investigação ou simplesmente um novo padrão de registro. Menos bugs podem significar melhoria ou pouca observação. Para interpretar uma contagem, considere impacto, exposição, fase de detecção e volume de mudanças.",
        example: "Um time registra vinte problemas cosméticos antes do release; outro registra dois defeitos críticos em produção. O primeiro número é maior, mas o segundo revela risco mais grave. Comparar apenas totais levaria a uma conclusão errada.",
        steps: ["Classifique defeitos por impacto e momento de descoberta.", "Compare tendências com volume e tipo de entregas no mesmo período.", "Leia uma amostra dos casos para validar se a classificação faz sentido."],
        caution: "Uma métrica perde valor quando as pessoas mudam o registro para parecer bem no painel.",
        exercise: "Crie duas narrativas diferentes para uma queda de 30% no número de bugs. Diga quais dados distinguiriam as hipóteses."
      },
      {
        slug: "painel-de-tendencias-e-riscos", title: "Como montar um painel que mostra tendências e riscos", summary: "Um painel enxuto deve ajudar a fazer a próxima pergunta.",
        opening: "Um dashboard cheio de números pode parecer completo e ainda não revelar o que precisa de atenção. Agrupe indicadores por decisão: saúde da entrega, experiência em produção e capacidade de detectar problemas. Mostre definição e período; sem isso, curvas de cores bonitas viram interpretações conflitantes.",
        example: "Um painel de release pode mostrar incidentes por severidade, tempo até detecção e testes instáveis por fluxo crítico. Se a instabilidade aumenta ao mesmo tempo que a detecção atrasa, o time tem uma hipótese para investigar, não uma conclusão automática.",
        steps: ["Escolha no máximo algumas perguntas que a reunião realmente precisa responder.", "Mostre tendência, referência anterior e contexto das mudanças relevantes.", "Inclua links para casos e dados de origem quando alguém precisar investigar."],
        caution: "Evite semáforos sem regra explícita. A cor não substitui definição, contexto e conversa.",
        exercise: "Desenhe um painel de uma página para uma equipe pequena, com três indicadores e uma ação possível para cada um."
      }
    ]
  },
  {
    id: "ia-generativa-qa", title: "IA generativa para QA", href: "/trilhas/ia-generativa-qa", section: "Ferramentas e técnicas", color: "#c7b3ed",
    stories: [
      {
        slug: "prompts-para-cenarios-de-teste", title: "Prompts para propor cenários a partir de regras", summary: "Use a IA como parceira de ideias, mantendo a regra e o risco sob seu controle.",
        opening: "Um pedido vago como ‘crie testes para login’ costuma gerar uma lista genérica. Para obter ideias úteis, forneça a regra, o público, o ambiente e o que ainda é incerto. Peça que a ferramenta separe suposições de cenários e destaque limites e exceções.",
        example: "Para recuperação de senha, informe prazo do link, comportamento para e-mail desconhecido e limite de tentativas. Peça cenários positivos, negativos e de segurança, com a regra que cada um cobre. Revise o resultado com a especificação real.",
        steps: ["Remova dados sensíveis e forneça somente contexto necessário.", "Peça cenários com pré-condição, ação, resultado e dúvida explícita.", "Revise duplicatas e priorize pelo risco antes de levar a lista ao time."],
        caution: "Uma resposta convincente pode conter regras inventadas; ela não substitui a fonte do requisito.",
        exercise: "Escreva um prompt para uma regra de cupom e marque duas informações que você precisaria confirmar antes de usar os cenários."
      },
      {
        slug: "revisar-casos-inventados-pela-ia", title: "Como revisar casos inventados ou incompletos pela IA", summary: "Verifique cada sugestão contra regra, evidência e valor de teste.",
        opening: "Modelos podem completar lacunas com um comportamento plausível, mas inexistente. A revisão deve perguntar de onde veio cada expectativa, se o cenário pode ser executado e se detectaria uma falha relevante. Uma lista longa de casos semelhantes é menos útil que poucos exemplos que diferenciam decisões.",
        example: "A IA sugere que um cupom expirado deve ser renovado automaticamente. Se nenhuma regra prevê renovação, o teste está inventando produto. Transforme a sugestão em pergunta para produto, não em asserção automática.",
        steps: ["Marque cada resultado como confirmado, hipótese ou incompatível com a regra.", "Elimine cenários repetidos e procure fronteiras que faltaram.", "Revise com alguém do domínio antes de automatizar expectativas novas."],
        caution: "A IA pode errar com linguagem segura. Confiança no texto não é evidência de correção.",
        exercise: "Pegue cinco cenários gerados para um checkout fictício e classifique-os por origem da regra e risco coberto."
      },
      {
        slug: "dados-sensiveis-em-ferramentas-de-ia", title: "Dados sensíveis ao usar IA em QA", summary: "Proteja pessoas, segredos e contexto interno durante a investigação.",
        opening: "Bugs e logs carregam dados de conta, tokens, mensagens e detalhes internos. Copiar esse material para uma ferramenta externa pode criar um problema maior que o defeito original. A escolha depende das regras da organização e das opções de proteção da ferramenta; quando houver dúvida, use um caso sintético.",
        example: "Para pedir ajuda com um erro de autenticação, substitua e-mails, identificadores, tokens e URLs privadas por valores fictícios. Preserve apenas a estrutura do fluxo e a resposta necessária para discutir o problema.",
        steps: ["Classifique os dados antes de enviá-los a qualquer serviço externo.", "Redija ou sintetize exemplos mantendo o comportamento relevante.", "Confirme políticas de retenção e acesso aprovadas para a ferramenta usada."],
        caution: "Anonimizar só o nome não basta quando IDs, trechos de mensagem ou timestamps permitem reidentificar uma pessoa.",
        exercise: "Reescreva um bug report de treino como prompt seguro, removendo tudo que não é necessário para discutir a hipótese."
      }
    ]
  }
];
