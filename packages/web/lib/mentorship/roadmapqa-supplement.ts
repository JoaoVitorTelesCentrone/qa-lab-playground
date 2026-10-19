/** Conteúdos do RoadMapQA.docx que não estavam desenvolvidos nas aulas da mentoria. */
export type RoadmapQATopic = {
  title: string;
  explanation: string;
  application: string;
};

export type RoadmapQASupplement = {
  intro: string;
  topics: readonly RoadmapQATopic[];
};

export const roadmapQASupplement: Record<string, RoadmapQASupplement> = {
  "mentoria.w01.l1": {
    intro: "Qualidade precisa ser observada no produto e no modo como a equipe o constrói.",
    topics: [
      { title: "Qualidade de produto e de processo", explanation: "Qualidade de produto descreve o resultado percebido: regras corretas, facilidade de uso, acessibilidade, segurança, desempenho e confiabilidade. Qualidade de processo descreve a capacidade de entregar e corrigir esse resultado de modo consistente. Um processo rápido pode publicar defeitos; um produto bom hoje pode se degradar se o time não consegue detectar regressões.", application: "No ExpenseFlow, separe um problema que afeta o usuário de uma falha no fluxo de entrega que permitiu sua publicação. Registre ambas as ações de melhoria." },
      { title: "Métricas com pergunta e contexto", explanation: "Conte defeitos por tipo, origem e gravidade, mas observe também reincidência, escapes para produção, histórias devolvidas e testes que detectaram riscos. Para o processo, acompanhe tempo de uma mudança até a revisão ou entrega, retrabalho e histórias bloqueadas. Números isolados incentivam conclusões ruins: mais bugs podem significar investigação melhor, e mais histórias fechadas podem esconder trabalho menor.", application: "Escolha uma pergunta concreta, como 'onde perdemos tempo antes de corrigir erros?'. Defina período, fonte, segmento e decisão que a métrica apoiará." },
    ],
  },
  "mentoria.w01.l2": {
    intro: "O pensamento de testador transforma requisitos e dúvidas em observações úteis.",
    topics: [
      { title: "Pensamento crítico e tipos de sistema", explanation: "Questione suposições, compare o comportamento com uma fonte confiável e procure condições nas quais a regra pode deixar de valer. A estratégia muda conforme o sistema: aplicações web dependem de navegador e rede; mobile envolve permissões, conectividade e sistema operacional; desktop considera instalação e arquivos locais; PWA inclui cache, atualização e uso offline. O mesmo fluxo pode ter riscos diferentes em cada plataforma.", application: "Descreva três condições em que a criação de uma despesa pode falhar: perda de rede, troca de dispositivo e permissão insuficiente. Indique quais se aplicam ao produto real." },
      { title: "Definition of Ready, Definition of Done e priorização", explanation: "Definition of Ready é um acordo sobre informação suficiente para começar uma história: objetivo, exemplos, dependências e dúvidas visíveis. Definition of Done é o acordo para considerá-la concluída: critérios verificados, revisão, evidências e documentação necessária. Nenhuma definição substitui análise de risco. Sob tempo limitado, priorize impacto, chance de falha, mudança recente e dificuldade de detectar o problema depois.", application: "Para uma história de aprovação, escreva duas perguntas antes do desenvolvimento e duas evidências necessárias antes de declará-la concluída." },
    ],
  },
  "mentoria.w01.l3": {
    intro: "Na exploração guiada, uma abordagem de teste deve servir à pergunta e à evidência que você precisa obter.",
    topics: [
      { title: "Abordagens caixa-preta e caixa-branca", explanation: "Na abordagem caixa-preta, parta das regras e dos resultados que uma pessoa ou outro sistema consegue observar, sem depender do código. Na caixa-branca, use conhecimento da implementação para investigar condições, ramos e tratamento de erros. A abordagem escolhida muda o desenho do experimento, mas nenhuma delas garante qualidade por si só. Um comportamento correto por fora pode esconder caminho interno sem tratamento; cobrir ramos pode deixar de fora uma necessidade real do usuário.", application: "Para o salvamento de despesa, escreva uma verificação da regra observável e uma pergunta sobre o tratamento interno de falha de persistência." },
      { title: "Smoke e estratégia de investigação", explanation: "Um smoke é uma checagem breve dos caminhos indispensáveis para decidir se vale iniciar uma investigação mais ampla. Depois dele, aprofunde estados, limites e permissões conforme o risco. Não confunda passar no smoke com produto aprovado: o conjunto é propositalmente pequeno. Registre ambiente, versão e a razão pela qual escolheu os fluxos essenciais, para que a próxima pessoa compreenda o alcance da evidência.", application: "Escolha três passos essenciais do ExpenseFlow para um smoke e dois riscos que continuam sem resposta mesmo quando todos passam." },
    ],
  },
  "mentoria.w02.l1": {
    intro: "O ciclo de desenvolvimento determina quando e com quem o QA obtém feedback.",
    topics: [
      { title: "Cascata, ágil, XP, Scrum e Kanban", explanation: "No cascata, fases sequenciais tendem a concentrar validação formal mais tarde; descubra e registre riscos cedo para evitar correção cara. Métodos ágeis favorecem ciclos curtos e revisão frequente. XP enfatiza práticas técnicas como testes, integração contínua e trabalho colaborativo. Scrum organiza planejamento e revisão em ciclos; Kanban visualiza fluxo e limita trabalho em andamento. Nenhum método elimina a necessidade de critérios claros e testes proporcionais ao risco.", application: "Localize onde uma dúvida sobre regra de aprovação seria descoberta, discutida e validada em um fluxo sequencial e em um fluxo iterativo." },
      { title: "Cerimônias e pontos de decisão", explanation: "No planning, o QA ajuda a discutir escopo e riscos. No kick-off, confirma objetivo e dependências. No deskcheck, revisa a solução com quem implementou; no code review, observa testes e efeitos colaterais; na review, demonstra comportamento e expõe lacunas. A equipe pode usar outros nomes. O importante é saber qual decisão cada conversa permite, quem participa e que evidência precisa estar pronta.", application: "Escreva uma pergunta de QA para planning, deskcheck e review de uma funcionalidade do ExpenseFlow." },
    ],
  },
  "mentoria.w02.l2": {
    intro: "Investigar cedo inclui verificar o caminho completo de entrega e o ambiente em que ele roda.",
    topics: [
      { title: "Fases de entrega e gargalos", explanation: "Mapeie pedido, refinamento, desenvolvimento, revisão, teste, implantação e observação após entrega. Um gargalo é uma etapa cuja capacidade limita o fluxo: filas acumulam, tempo de espera cresce e itens envelhecem. Meça tempo em fila e tempo de trabalho separadamente antes de culpar uma pessoa ou otimizar uma etapa que não limita a entrega.", application: "Desenhe cinco etapas do fluxo de uma história e marque onde uma mudança pode ficar parada. Proponha um sinal que confirmaria o gargalo." },
      { title: "Compatibilidade como matriz de risco", explanation: "Compatibilidade não significa testar todas as combinações possíveis. Escolha dispositivos, navegadores, versões, resoluções, sistemas operacionais e condições de rede usados pelo público ou exigidos por contrato. Registre a matriz e o motivo de cada combinação; valide caminhos críticos nela e rode testes mais amplos onde houver risco específico.", application: "Monte uma matriz mínima para usar o ExpenseFlow em desktop e celular, com ao menos um critério de corte explícito." },
    ],
  },
  "mentoria.w03.l1": {
    intro: "O planejamento manual organiza risco, cobertura e resultados esperados antes da execução.",
    topics: [
      { title: "Plano, cenário e caso de teste", explanation: "O plano define objetivo, escopo, riscos, ambiente, pessoas, critérios de entrada e saída. O cenário descreve uma situação relevante; o caso detalha pré-condições, dados, ações e resultado observável. Uma lista de passos sem esperado serve pouco para diagnóstico. Mantenha vínculo com regra e risco e deixe explícito o que ficou fora do escopo.", application: "Escreva um cenário de despesa acima do limite e um caso executável, incluindo estado anterior e efeito persistido esperado." },
      { title: "Passo a passo e Gherkin", explanation: "Um caso passo a passo é útil quando a execução exige dados e operação precisos. Gherkin expressa comportamento em Dado, Quando e Então e funciona melhor como exemplo compartilhado de regra, sem narrar cada clique. Em ambos, verifique resultado de negócio. Evite cenários longos que misturam várias regras e falham sem indicar qual delas quebrou.", application: "Reescreva o mesmo caso em Gherkin, mantendo no Então a mudança de estado da despesa, e compare a clareza das duas formas." },
    ],
  },
  "mentoria.w03.l2": {
    intro: "A forma de escrever e armazenar testes deve facilitar revisão, execução e manutenção.",
    topics: [
      { title: "TDD, BDD, verificação e validação", explanation: "TDD usa o ciclo teste falhando, implementação mínima e refatoração para orientar o desenho do código. BDD aproxima negócio, desenvolvimento e QA por exemplos de comportamento; não se reduz à sintaxe Gherkin. Verificação pergunta se o produto atende à especificação acordada; validação pergunta se resolve a necessidade real. Uma regra pode passar em todos os testes e ainda ser inadequada ao usuário.", application: "Dê um exemplo de cálculo que passa na especificação, mas exige uma pergunta de validação ao negócio." },
      { title: "Organização e ferramentas", explanation: "Agrupe testes por comportamento ou área de negócio, use nomes pesquisáveis e mantenha versões quando o caso for artefato duradouro. Repositório, Azure Test Plans e Qase podem registrar casos e execuções; Trello, Azure Boards, Wiki e Shortcut podem acompanhar trabalho e decisões. Canvas e captura de vídeo ajudam a explicar fluxos, mas a ferramenta não substitui resultado esperado e rastreabilidade. Escolha um lugar de referência e evite cópias divergentes.", application: "Defina uma pasta ou agrupamento para cadastro, aprovação e relatórios e indique onde ficariam execução, evidência e decisão de produto." },
    ],
  },
  "mentoria.w04.l1": {
    intro: "Um bom relatório permite reproduzir, decidir e corrigir sem depender da memória de quem testou.",
    topics: [
      { title: "Relatório de execução e evidência", explanation: "Além do bug individual, reporte escopo executado, ambiente, versão, quantidade e natureza dos achados, bloqueios e riscos não cobertos. Captura de tela ou vídeo curto, inclusive com ferramentas como ScreenToGif, pode mostrar sequência e estado; complemente com horário, dados de entrada e resposta da rede quando relevantes. Oculte dados pessoais, tokens e segredos antes de compartilhar.", application: "Monte um resumo de execução de cinco linhas para um ciclo de teste, citando um risco residual sem afirmar cobertura total." },
      { title: "Verificar correção e regressão", explanation: "Após uma correção, reproduza o caso original nas mesmas condições, verifique o estado persistido e rode uma seleção de cenários vizinhos que compartilham regra ou componente. Um smoke curto confirma que o produto abre e os fluxos essenciais funcionam; regressão orientada por mudança procura efeitos colaterais. O teste que encontrou o bug não é suficiente para declarar a release segura.", application: "Para uma correção no cálculo de total, liste um reteste, dois cenários de regressão e um smoke de entrada no produto." },
    ],
  },
  "mentoria.w04.l2": {
    intro: "A comunicação da release precisa conectar defeitos, cobertura e decisão.",
    topics: [
      { title: "Rastreabilidade da decisão", explanation: "Ligue história, critério, cenário, execução, defeito e recomendação por identificadores ou links. A rastreabilidade ajuda a responder quais regras foram examinadas e quais ficaram bloqueadas. Prefira uma estrutura enxuta: situação observada, impacto, evidência, opção de mitigação e dono da decisão. Um painel com muitos números sem explicação não substitui essa cadeia.", application: "Associe uma falha de autorização à história, ao caso e à recomendação de bloquear ou limitar a entrega." },
      { title: "Teste funcional, não funcional e contexto", explanation: "Teste funcional verifica o que o sistema faz; testes não funcionais observam características como tempo de resposta, acessibilidade, segurança e usabilidade. Um fluxo pode produzir o resultado correto e ainda ser impraticável para parte do público. Inclua o tipo de risco e as condições de execução no relatório para que o leitor não confunda aprovação funcional com qualidade integral.", application: "Escreva duas conclusões distintas para um formulário que salva corretamente, mas não pode ser operado pelo teclado." },
    ],
  },
  "mentoria.w05.l1": {
    intro: "Antes de automatizar, escolha a abordagem e a camada que respondem à pergunta de teste.",
    topics: [
      { title: "Caixa-preta, caixa-branca e smoke", explanation: "Caixa-preta deriva testes de entradas, saídas e regras observáveis. Caixa-branca usa conhecimento da estrutura interna, como ramos e caminhos, para orientar verificações mais próximas do código. As abordagens se complementam. Smoke é uma seleção curta de fluxos essenciais para detectar falhas amplas após uma mudança ou implantação; não substitui investigação de regras complexas.", application: "Para o total de despesas, proponha uma pergunta caixa-preta, uma hipótese sobre um ramo interno e um smoke que indique se vale continuar a testar." },
      { title: "AAA e níveis de teste", explanation: "Arrange prepara estado e dados, Act executa a ação, Assert confere o resultado. A estrutura pode ser aplicada a teste unitário, de integração e ponta a ponta. Unidade localiza regra pequena com rapidez; integração verifica a conversa entre partes; ponta a ponta observa a jornada real, com maior custo e mais dependências. A pirâmide é uma heurística de distribuição, não uma quota fixa: escolha o nível mais barato que ainda observa o risco.", application: "Distribua três verificações do fluxo de aprovação entre unidade, integração e ponta a ponta, justificando a observação necessária." },
    ],
  },
  "mentoria.w05.l2": {
    intro: "A decisão de automatizar muda conforme plataforma, frequência e custo de manutenção.",
    topics: [
      { title: "Web, mobile e serviços", explanation: "Na web, navegador, DOM e rede tornam seletores e sincronização centrais. No mobile, instalação, permissões, gestos e variação de dispositivo ampliam a matriz. No back-end, chamadas diretas a funções e APIs geralmente permitem feedback mais rápido, mas não mostram se a interface funciona. Registre o risco que cada teste cobre e não transfira automaticamente um roteiro de uma plataforma para outra.", application: "Escolha uma regra de negócio que merece teste de API e uma jornada que ainda precisa ser observada no navegador." },
      { title: "TDD e retorno da automação", explanation: "Automação vale quando a verificação se repete, protege comportamento importante, gera feedback acionável e pode ser mantida. TDD pode orientar o desenho de uma regra nova, enquanto uma suíte de regressão protege regras já existentes. Estime tempo de execução, estabilidade, preparo de dados e custo de diagnóstico antes de escolher a ferramenta. Testar automaticamente um caso mal definido apenas acelera uma conclusão fraca.", application: "Preencha para dois candidatos: risco, frequência de execução, camada, custo de manutenção e critério de sucesso." },
    ],
  },
  "mentoria.w06.l1": {
    intro: "Entender o navegador ajuda a testar a interface e a interpretar falhas da automação.",
    topics: [
      { title: "HTML, CSS, JavaScript e DevTools", explanation: "HTML representa estrutura e semântica; CSS determina apresentação; JavaScript reage a eventos e atualiza estado. No DevTools, Elements permite inspecionar DOM e atributos acessíveis, Console mostra erros e avisos, e Network revela requests, respostas e tempos. Um botão visível pode estar desabilitado pela regra, coberto por CSS ou aguardando rede; cada causa pede investigação diferente.", application: "Ao salvar uma despesa, observe o elemento acionado, um erro no Console e a resposta em Network. Descreva qual evidência confirma ou elimina cada hipótese." },
      { title: "Responsividade e adaptabilidade", explanation: "Responsividade reorganiza layout para tamanhos de tela; adaptabilidade considera também entrada por toque ou teclado, orientação, zoom, idioma, contraste e recursos disponíveis. Teste conteúdo cortado, ordem de foco, controles alcançáveis e mudanças de estado em tamanhos representativos. Apenas reduzir a janela não reproduz todas as condições de um dispositivo real.", application: "Execute a mesma jornada em largura pequena e ampla, com teclado e toque quando possível; registre diferenças relevantes para concluir a tarefa." },
    ],
  },
  "mentoria.w06.l2": {
    intro: "Frameworks são meios para observar comportamento, não o objetivo da verificação.",
    topics: [
      { title: "Cypress, Playwright, Jest e Jasmine", explanation: "Cypress e Playwright automatizam jornadas no navegador e oferecem execução, assertions e diagnóstico próprios. Jest e Jasmine são usados com frequência para testes de JavaScript em níveis mais próximos do código. Escolha conforme a pergunta: regra isolada, integração de componente ou jornada real. Compare suporte ao ambiente, preparo de dados e qualidade da falha antes de migrar ou duplicar suítes.", application: "Para validação de valor, chamada de API e conclusão do formulário, indique o nível de teste e uma ferramenta possível para cada um." },
      { title: "Seletores e espera confiáveis", explanation: "Prefira papel acessível, nome visível e rótulo quando representam a ação do usuário. Espere por condição observável, como resposta relevante ou conteúdo final, em vez de um atraso fixo. Se o teste falha intermitentemente, preserve trace, dados e sequência antes de aumentar timeout. Uma assertion deve provar o efeito de negócio, não apenas que o clique aconteceu.", application: "Troque um seletor posicional por papel e nome e substitua uma espera de segundos pela observação do registro criado." },
    ],
  },
  "mentoria.w07.l1": {
    intro: "O back-end implementa regras e persistência que precisam ser observadas além da interface.",
    topics: [
      { title: "Back-end, unidade e integração", explanation: "O back-end recebe chamadas, aplica autorização e regras, conversa com serviços e persiste dados. Testes de unidade verificam decisões isoladas; testes de integração verificam banco, fila ou serviço; testes de API observam contrato exposto. Em ecossistemas .NET, xUnit é uma opção comum para testar código. Separar camadas facilita localizar se uma falha está na regra, no contrato ou na apresentação.", application: "Para uma aprovação, liste uma regra testável sem HTTP, uma integração com persistência e um contrato visível ao cliente." },
      { title: "Swagger/OpenAPI e Bruno", explanation: "Uma especificação OpenAPI, frequentemente vista em uma interface Swagger, descreve operações, parâmetros, respostas e esquemas. Use-a como ponto de partida, mas confirme regras que o contrato não expressa, como isolamento entre usuários. Bruno pode organizar e versionar coleções de requests; mantenha URLs e credenciais em variáveis apropriadas e nunca publique tokens reais junto dos exemplos.", application: "A partir de uma operação de criação, derive um caso válido, um erro de validação e um acesso sem permissão." },
    ],
  },
  "mentoria.w07.l2": {
    intro: "Uma API correta precisa proteger recursos e devolver efeitos coerentes em toda a cadeia.",
    topics: [
      { title: "Autenticação, autorização e papéis", explanation: "Autenticação identifica quem faz a chamada; autorização decide se essa pessoa pode executar a ação naquele recurso. Papéis ajudam a definir permissões, mas a regra pode depender também de autoria, estado e organização. Teste ausência de credencial, credencial válida sem permissão e tentativa de acessar o objeto de outra pessoa. Um 403 ou 404 isolado não prova que os dados ficaram protegidos.", application: "Crie uma matriz pequena com colaborador, gestor e recurso próprio ou alheio. Indique ação, resultado e efeito persistido esperado." },
      { title: "Integração e fluxo ponta a ponta", explanation: "Uma resposta de criação bem-sucedida pode não significar persistência correta. Encadeie criação, leitura, alteração e exclusão e compare estados. Testes de integração detectam erros entre componentes; o ponta a ponta acrescenta a interface e a jornada do usuário. Mantenha cada teste focado para que uma falha revele qual contrato ou transição foi violado.", application: "Após um POST de despesa, leia o registro e o relatório; explique que divergência faria você investigar uma integração." },
    ],
  },
  "mentoria.w08.l1": {
    intro: "Padrões de automação devem reduzir repetição sem esconder a intenção dos testes.",
    topics: [
      { title: "Page Object e comandos reutilizáveis", explanation: "Page Object concentra interações de uma área da interface e protege testes de detalhes de localização que mudam juntos. Custom commands podem encapsular preparo ou ações recorrentes em ferramentas como Cypress. Crie abstrações quando existe repetição real e dê nomes de negócio; esconder assertions ou transformar cada clique em um método dificulta entender por que o teste falhou.", application: "Extraia somente a ação repetida de criar despesa e deixe no teste a assertion do total esperado." },
      { title: "Builder para dados de teste", explanation: "Builder monta entidades de teste com valores válidos por padrão e permite variar apenas campos relevantes ao cenário. Isso evita objetos enormes e inconsistentes em cada teste. Documente o padrão, gere identificadores únicos e deixe a variação explícita; um builder que cria dependências invisíveis torna a suíte difícil de depurar.", application: "Desenhe um builder de despesa com valor e categoria padrão e altere somente o valor para testar um limite." },
    ],
  },
  "mentoria.w08.l2": {
    intro: "A arquitetura da suíte precisa preservar isolamento e tornar falhas diagnosticáveis.",
    topics: [
      { title: "Chain of Responsibility e uso cuidadoso", explanation: "Chain of Responsibility passa uma solicitação por uma sequência de responsáveis até que um deles a trate. Em testes, a ideia pode organizar validações ou preparação por etapas, mas adiciona indireção. Use somente quando há uma sequência variável e responsabilidade bem definida; para duas ações fixas, código direto é mais fácil de ler e investigar.", application: "Explique se uma cadeia de validações por papel, valor e status ajuda ou atrapalha um teste simples de aprovação." },
      { title: "Regressão, smoke e saúde da suíte", explanation: "Smoke verifica rapidamente se os caminhos essenciais estão disponíveis. Regressão cobre efeitos de uma mudança nas regras e integrações vizinhas. Revise taxa de falha, tempo para diagnosticar e testes sem valor; uma suíte lenta e intermitente atrasa a entrega. Registre quando um teste foi corrigido, movido de camada ou removido e qual risco permanece protegido.", application: "Classifique cinco testes existentes em smoke ou regressão, justifique a frequência e identifique um teste redundante." },
    ],
  },
  "mentoria.w09.l1": {
    intro: "Controle de versão e revisão sustentam colaboração e rastreabilidade da qualidade.",
    topics: [
      { title: "Git, GitHub e GitLab", explanation: "Git registra mudanças locais em commits e branches; GitHub e GitLab hospedam repositórios e oferecem revisão, automações e histórico compartilhado. Um pull ou merge request torna a mudança revisável: descrição, testes executados, riscos e evidências devem acompanhar o código. QA pode revisar critérios e resultados sem ser o único responsável por encontrar defeitos após o merge.", application: "Escreva uma descrição curta de PR para corrigir uma regra de total, incluindo risco, teste de unidade, teste de API e limitação conhecida." },
      { title: "Métricas de fluxo e code review", explanation: "Tempo de PR e quantidade de histórias podem indicar fila ou mudanças grandes, mas não medem qualidade sozinhos. Observe tempo até a primeira revisão, tamanho da mudança, retrabalho e defeitos após entrega. Se PRs aguardam dias, descubra a causa antes de impor meta individual. A revisão deve examinar regra, teste, segurança e capacidade de diagnosticar falhas.", application: "Compare duas semanas com tempos de revisão diferentes e proponha uma hipótese verificável para a diferença." },
    ],
  },
  "mentoria.w09.l2": {
    intro: "CI/CD publica feedback e artefatos em um caminho controlado até a entrega.",
    topics: [
      { title: "CI, CD e Azure DevOps Pipelines", explanation: "Integração contínua executa verificações quando mudanças se juntam; entrega ou implantação contínua prepara ou publica versões conforme regras do time. Em Azure DevOps Pipelines, assim como em outros provedores, organize gatilhos, estágios, jobs, variáveis e artefatos. Separe build, testes e implantação para saber onde ocorreu a falha e defina aprovação quando o risco justificar.", application: "Desenhe um pipeline com commit, tipos, unidade, API, smoke, pacote e implantação; marque o primeiro ponto em que uma falha bloqueia." },
      { title: "Segredos e informação publicada", explanation: "Guarde credenciais no mecanismo de secrets do provedor, conceda permissões mínimas e evite expor valores em logs, capturas e artefatos. Um código de teste pode conter URL pública e ainda revelar dados internos quando combinado com payloads reais. Revise o que sai do ambiente de CI antes de tornar relatórios compartilháveis.", application: "Faça uma lista de informações que podem aparecer em trace, log e variável de ambiente e defina como removê-las da evidência." },
    ],
  },
  "mentoria.w10.l1": {
    intro: "Monitoramento mostra como o sistema se comporta depois de implantado e ajuda a interpretar gates.",
    topics: [
      { title: "Logs, funções e observabilidade", explanation: "Funções e serviços podem falhar fora da jornada vista no navegador. Logs de aplicação, banco e serviços de telemetria como Application Insights ajudam a reconstruir requisição, horário, erro e efeito. Use identificadores de correlação e monitore taxas de erro, latência e operações críticas. Logs precisam de retenção e proteção de dados; não devem conter senhas, tokens ou informações pessoais desnecessárias.", application: "Para um lançamento que não aparece no relatório, liste os identificadores e eventos que permitem seguir a operação da interface à persistência." },
      { title: "Detectar gargalo depois do deploy", explanation: "Observe fila, tempo de processamento, consultas lentas, erros e volume antes de atribuir lentidão a um componente. Uma função lenta pode ser causa ou consequência de uma dependência saturada. Compare com uma linha de base e mudanças recentes, separando fato observado de hipótese técnica. A reação pode ser reduzir tráfego, desativar uma flag ou reverter uma versão.", application: "Escreva um gatilho de alerta, um passo de investigação e uma condição de recuperação para aumento de tempo no relatório." },
    ],
  },
  "mentoria.w10.l2": {
    intro: "Uma liberação segura considera permissões, vulnerabilidades e recuperação.",
    topics: [
      { title: "Vulnerabilidade, autenticação e autorização", explanation: "Teste se fluxos sensíveis exigem identidade válida, se papéis recebem apenas ações permitidas e se cada objeto pertence ao escopo do usuário. Validações da interface não substituem controles no servidor. Diferencie falha funcional, configuração insegura e vulnerabilidade explorável; reporte alcance e evidência mínima em ambiente autorizado, sem publicar instruções ou dados sensíveis.", application: "Tente consultar um objeto de outro usuário em ambiente de teste e registre status, corpo, persistência e possível exposição de dados." },
      { title: "Normas internas e gestão de secrets", explanation: "Políticas de segurança definem classificação de dados, acesso, retenção, comunicação de incidentes e ferramentas permitidas. Secrets devem ser armazenados em serviço apropriado, rotacionados quando expostos e excluídos de repositórios e evidências. A decisão de release deve considerar uma falha de controle de acesso mesmo que todos os testes funcionais estejam verdes.", application: "Revise um relatório de teste fictício e retire token, e-mail real e dado financeiro antes de enviá-lo ao time." },
    ],
  },
  "mentoria.w11.l1": {
    intro: "Performance e carga precisam de cenários, limites e ferramentas adequados ao alvo.",
    topics: [
      { title: "Lighthouse e Locust", explanation: "Lighthouse avalia aspectos da experiência web, incluindo desempenho percebido em condições simuladas. Locust executa carga programável com usuários e fluxos concorrentes. As ferramentas respondem a perguntas diferentes: uma página lenta no navegador não prova que a API satura sob carga; uma API rápida sob carga não garante boa experiência visual. Registre versão, dados, rede e perfil de carga ao comparar medições.", application: "Defina uma pergunta para Lighthouse sobre a tela de relatório e outra para Locust sobre consultas simultâneas à API." },
      { title: "Carga, sobrecarga e parada", explanation: "Carga verifica comportamento esperado por um período; sobrecarga aproxima ou ultrapassa capacidade para descobrir limite e modo de falha. Aumente intensidade gradualmente, acompanhe erro e latência e combine critério de interrupção antes de começar. Execute somente em ambiente autorizado. Um sistema pode manter p95 baixo porque passou a responder erros; interprete taxa de sucesso e throughput junto dos tempos.", application: "Escreva hipótese, volume inicial, incremento, duração, limiar de erro e condição de parada para uma consulta local." },
    ],
  },
  "mentoria.w11.l2": {
    intro: "Uma análise não funcional deve considerar quem usa e como acessa o produto.",
    topics: [
      { title: "Acessibilidade com DevTools e uso real", explanation: "Use Elements para inspecionar nomes e papéis acessíveis, Console para erros e Network para recursos que não carregam. Complemente ferramentas automáticas com teclado, foco, zoom, contraste e leitura da ordem de conteúdo. Uma auditoria automática encontra apenas parte das barreiras; descreva tarefa impedida, condição e impacto para que o time priorize a correção.", application: "Tente concluir uma despesa sem mouse; registre ordem de foco, rótulos, mensagem de erro e ponto em que a tarefa fica bloqueada." },
      { title: "Usabilidade e compatibilidade", explanation: "Usabilidade pergunta se a pessoa entende e conclui a tarefa; acessibilidade pergunta se barreiras impedem pessoas com diferentes capacidades de usá-la. Responsividade e compatibilidade examinam apresentação e funcionamento em condições de dispositivo e software. Separe os achados: um botão difícil de entender, um controle sem nome e um layout cortado têm causas e correções distintas.", application: "Descreva um achado de cada categoria para a mesma tela e indique qual evidência seria suficiente para reproduzi-lo." },
    ],
  },
  "mentoria.w12.l1": {
    intro: "O case final também demonstra como você protegeu informação e decidiu usar ferramentas de apoio.",
    topics: [
      { title: "IA no trabalho de QA", explanation: "IA pode ajudar a gerar hipóteses, resumir requisitos e revisar clareza de casos, desde que a pessoa confira cada resultado e preserve autoria da decisão. Não envie código fechado, credenciais, dados de clientes ou documentos internos a uma ferramenta sem autorização da organização. Registre quais partes foram assistidas, o que foi validado e quais riscos permaneceram; uma sugestão plausível ainda pode inventar regra ou esperado.", application: "Revise um cenário sugerido por IA: identifique a fonte da regra, retire dados sensíveis e acrescente o esperado observável antes de usá-lo." },
      { title: "Segurança da informação no portfólio", explanation: "Ao publicar um case, remova nomes de clientes, tokens, URLs internas, dados pessoais e capturas que revelem informação privada. Respeite normas e contratos do projeto. Apresente problema, método e evidência com dados fictícios ou anonimizados; indique limitações. A qualidade da argumentação importa mais que expor um sistema real.", application: "Faça uma revisão de publicação em um relatório e anote cada dado que precisa ser substituído, omitido ou autorizado." },
    ],
  },
  "mentoria.w12.l2": {
    intro: "O roteiro de aprendizagem termina com uma direção profissional sustentada por evidências.",
    topics: [
      { title: "Caminhos de carreira em qualidade", explanation: "A experiência pode evoluir para investigação exploratória, automação, engenharia de qualidade, API, acessibilidade, segurança, performance, liderança ou atuação próxima de produto. Títulos e responsabilidades variam por empresa; avalie descrições reais de vagas e o tipo de problema que você quer resolver. Uma especialização forte conserva fundamentos de risco, comunicação e análise de evidência.", application: "Escolha duas trilhas de interesse e conecte cada uma a uma entrega concreta feita durante a mentoria e a uma lacuna de estudo." },
      { title: "Plano de evolução após a mentoria", explanation: "Transforme feedback do mentor e falhas do case em um plano verificável: competência, exercício, evidência de progresso e prazo de revisão. Evite uma lista de ferramentas sem objetivo. Pode ser mais valioso melhorar a análise de risco de um caso existente do que adicionar um framework novo sem problema definido.", application: "Escreva uma meta para as próximas quatro semanas, com artefato público seguro e critério de revisão." },
    ],
  },
};

Object.assign(roadmapQASupplement, {
  "mentoria.w02.l3": { intro: "Conecte práticas ágeis ao fluxo e aos ambientes reais de entrega.", topics: [
    { title: "Eventos apoiam decisões", explanation: "Planning esclarece escopo e risco; kick-off alinha a execução; deskcheck antecipa revisão do comportamento; code review examina mudança e testes; review valida o incremento com quem pediu. Os nomes variam entre times. Registre qual pergunta precisa ser respondida em cada conversa e qual pessoa tem contexto para responder.", application: "Monte um fluxo com três pontos de feedback e indique qual risco cada conversa pode reduzir." },
    { title: "Compatibilidade e matriz de ambiente", explanation: "Desktop, web, mobile e PWA têm dependências diferentes de sistema, navegador, rede, instalação e cache. Uma matriz útil parte do público e do histórico de risco; testar toda combinação custa mais e pode atrasar feedback sem evidência de valor. Registre a combinação, o propósito e as condições fora do escopo.", application: "Defina uma matriz pequena de navegador, largura e rede para o fluxo de envio de despesa." },
  ]},
  "mentoria.w03.l3": { intro: "Planejar teste é definir escopo, critérios e rastreabilidade antes da execução.", topics: [
    { title: "Test plan e artefatos", explanation: "Inclua objetivo, itens dentro e fora do escopo, riscos, abordagem, ambiente, dados, dependências, responsáveis e critérios de entrada/saída. Não use o plano como inventário estático: atualize bloqueios, decisões e lacunas após a execução. Casos podem viver em Qase, Azure Test Plans ou repositório, desde que haja uma fonte de referência acordada.", application: "Preencha um plano de uma página para validar a aprovação e o relatório de despesas." },
    { title: "Gherkin, TDD e BDD", explanation: "Gherkin ajuda a expressar exemplos de comportamento, mas BDD depende de colaboração para descobrir a regra. TDD orienta o desenvolvimento com teste falhando, mudança mínima e refatoração; não é o nome de um formato de caso. Verificação confere o que foi especificado, enquanto validação examina se a solução atende a necessidade real.", application: "Escreva exemplos de limite com produto e descreva como um teste unitário e uma conversa de validação responderiam perguntas distintas." },
  ]},
  "mentoria.w04.l3": { intro: "Escolha técnica e ferramenta em função da pergunta e do tipo de evidência.", topics: [
    { title: "Técnicas funcionais", explanation: "Exploratório gera perguntas durante a execução; regressão verifica efeitos de mudanças; integração foca fronteiras; unidade localiza regra; API avalia contrato; ponta a ponta verifica jornada; smoke oferece um sinal curto após uma mudança. Usabilidade observa compreensão e conclusão de tarefa. Uma suíte bem desenhada combina técnicas quando cada uma reduz uma incerteza diferente.", application: "Selecione uma técnica para cada risco de cálculo, persistência e compreensão do formulário." },
    { title: "Registro e gestão visual", explanation: "Canvas pode representar fluxo; Trello, Azure Boards, Wiki, Shortcut e Microsoft Loop podem apoiar acompanhamento ou documentação conforme a rotina do time. ScreenToGif pode capturar uma sequência curta. Use cada ferramenta para um propósito explícito e preserve uma referência única para plano, caso e evidência; a escolha de produto não substitui critério de execução.", application: "Desenhe onde ficariam o plano, os casos, o status da execução, a evidência e a decisão final." },
  ]},
  "mentoria.w05.l3": { intro: "Use uma estrutura reconhecível para que cada teste deixe claro seu propósito.", topics: [
    { title: "AAA: Arrange, Act, Assert", explanation: "Arrange prepara pré-condições e dados; Act realiza a operação sob teste; Assert verifica resultado. A divisão ajuda a encontrar preparação implícita e assertions fracas. O teste pode ter várias verificações coerentes, mas deve evitar executar muitas ações independentes que dificultem saber onde ocorreu a falha.", application: "Separe um teste de rejeição de valor zero nesses três blocos e inclua uma assertion de ausência de persistência." },
    { title: "Camada correta para o risco", explanation: "Use unidade para regra isolada, integração para comunicação entre partes e ponta a ponta para interação de uma jornada completa. Teste caixa-preta observa entradas e saídas; caixa-branca usa estrutura interna para orientar caminhos. Smoke é uma seleção rápida de operações essenciais. Não existe uma camada que cubra todas as perspectivas.", application: "Descreva o que cada camada prova e deixa em aberto para aprovação de uma despesa." },
  ]},
  "mentoria.w06.l3": { intro: "A inspeção do navegador torna falhas de interface mais fáceis de diagnosticar.", topics: [
    { title: "HTML, CSS, JavaScript e DevTools", explanation: "HTML descreve estrutura; CSS define apresentação e layout; JavaScript conduz comportamento dinâmico. Elements permite examinar elementos e atributos, Console registra mensagens e exceções, e Network mostra requests e respostas. Correlacione essas pistas com a tarefa observada, pois um elemento presente no DOM pode ainda estar inacessível ou coberto.", application: "Investigue um botão que não salva e registre evidência dessas três áreas do navegador." },
    { title: "Frameworks e condições de tela", explanation: "Cypress e Playwright focam jornadas web; Jest e Jasmine cobrem código JavaScript em níveis mais próximos da unidade ou integração. Responsividade adapta layout ao espaço; adaptabilidade inclui modo de entrada, orientação, zoom e preferências. A ferramenta deve corresponder ao risco e à stack já mantida pelo time.", application: "Escolha a ferramenta para uma regra, um request e uma jornada; anote uma condição móvel que o teste precisa cobrir." },
  ]},
  "mentoria.w07.l3": { intro: "Uma coleção confiável protege o contrato e o acesso aos dados.", topics: [
    { title: "Back-end, xUnit e integração", explanation: "Back-end aplica regra, autenticação, integração e persistência. xUnit é uma opção de framework de teste no ecossistema .NET. Separe regra isolada, interação com banco e contrato HTTP para que falhas sejam diagnosticáveis; verifique estado após escrita e não somente o código de resposta.", application: "Classifique verificações de uma alteração de despesa em unidade, integração e API." },
    { title: "Bruno e OpenAPI/Swagger", explanation: "OpenAPI documenta caminhos, operações, parâmetros e respostas. Swagger permite explorar e visualizar descrições OpenAPI; Bruno organiza coleções que podem ser versionadas. O contrato não descreve necessariamente todas as regras de negócio. Use dados únicos, variáveis locais e assertions de conteúdo, autorização e efeito persistido.", application: "Prepare uma sequência criar-consultar-atualizar com uma tentativa negada para um objeto de outra conta." },
  ]},
  "mentoria.w08.l3": { intro: "Padrões devem tornar o propósito do teste mais fácil de enxergar.", topics: [
    { title: "Page Object e custom commands", explanation: "Page Objects agrupam interações de uma área; custom commands encapsulam ações recorrentes do framework. Mantenha o nome semântico, assertions relevantes à vista e evite abstrair cada clique. Um objeto central que esconde navegação, dados e validações dificulta o diagnóstico.", application: "Extraia somente uma sequência repetida e compare a leitura do teste antes e depois." },
    { title: "Builder e Chain of Responsibility", explanation: "Builder cria dados com defaults válidos e variações explícitas. Chain of Responsibility encaminha uma solicitação entre responsáveis que podem tratar ou passar adiante. Builder facilita cenários de dados; cadeia só se justifica quando a sequência de validadores é variável ou extensível. Nenhum padrão é obrigatório para satisfazer uma convenção.", application: "Crie uma despesa de limite com Builder e decida se as validações precisam realmente de uma cadeia." },
  ]},
  "mentoria.w09.l3": { intro: "Versionamento e pipeline estabelecem um caminho repetível do commit ao feedback.", topics: [
    { title: "Git e repositórios", explanation: "Commits registram alterações; branches isolam trabalho em andamento; repositórios GitHub ou GitLab ligam o código a revisão e automação. Mensagens e PRs devem expor intenção, risco e evidência. Métricas de tempo de PR ajudam a observar filas, mas precisam ser interpretadas com tamanho da mudança e espera por revisão.", application: "Descreva um PR para correção de regra com teste, evidência e limite conhecido." },
    { title: "CI/CD e Azure Pipelines", explanation: "CI roda verificações ao integrar mudanças; CD prepara ou publica versões sob controles definidos. Um Azure Pipeline organiza gatilho, estágios, jobs e artefatos. Faça gates bloquearem riscos relevantes, retenha evidência em falha e limite permissões. Secrets pertencem ao cofre do provedor e não podem aparecer em log ou pacote publicado.", application: "Esboce etapas de tipos, unidade, API e E2E e indique que falha bloqueia merge e o que fica de evidência." },
  ]},
  "mentoria.w10.l3": { intro: "Monitoramento combina evento, métrica e resposta operacional.", topics: [
    { title: "Functions, logs e correlação", explanation: "Funções de aplicação executam operações com entradas e saídas; logs ajudam a reconstruir eventos e ferramentas como App Insights relacionam traces, dependências e falhas. Identificadores de correlação conectam registros sem incluir dados pessoais ou secrets. Compare com baseline e limite de retenção antes de ampliar coleta.", application: "Monte a sequência de eventos que investigaria entre request, função, banco e resposta." },
    { title: "Segurança e gestão de credenciais", explanation: "Autenticação identifica, autorização permite ou nega operações. Testes de vulnerabilidade devem ser autorizados e limitados ao alvo definido. Normas da organização determinam classificação, divulgação de código e resposta a incidentes; consulte-as antes de usar ferramentas externas. Remova e rotacione secrets expostos conforme procedimento interno.", application: "Escreva três casos de papel e recurso e uma regra para evitar token em evidência." },
  ]},
  "mentoria.w11.l3": { intro: "Leve ao pipeline um sinal curto de regressão e reserve testes de capacidade para ambientes preparados.", topics: [
    { title: "Smoke de performance no pull request", explanation: "Escolha uma operação crítica, poucos usuários virtuais, duração curta e dados estáveis. Registre ambiente, versão, p95, erros e resultado dos checks. O smoke procura uma piora grosseira que seja repetível no runner; thresholds precisam considerar a variação desse ambiente. Se o runner é compartilhado ou instável, use o sinal como alerta e não como gate rígido até calibrá-lo.", application: "Defina uma operação de leitura do Broto, o perfil mínimo do smoke e o artefato que ajudaria a investigar uma falha." },
    { title: "Capacidade em execução controlada", explanation: "Carga sustentada, pico e busca de limite exigem recursos, dados, observabilidade, janela e parada acordados. Separe esse job do caminho rápido de pull request, use alvo autorizado e impeça que concorrência afete produção ou outras equipes. Compare versões apenas sob condições equivalentes e guarde contexto junto dos resultados.", application: "Especifique quando rodaria o teste de capacidade, quem autoriza o alvo, qual condição interrompe a execução e onde ficam os resultados." },
  ]},
  "mentoria.w12.l3": { intro: "Proteja os dados do portfólio e transforme aprendizagem em próximos passos demonstráveis.", topics: [
    { title: "IA e divulgação de código", explanation: "IA pode ajudar a revisar texto ou sugerir perguntas, mas cada afirmação deve ser comparada com requisito e evidência. Política da organização define se código pode ser enviado a serviços externos; na dúvida, não inclua material proprietário, credenciais ou dados pessoais. Registre autoria e validação humana.", application: "Revise um resumo produzido com IA e associe cada afirmação a uma evidência segura." },
    { title: "Carreira em QA", explanation: "Trilhas podem focar exploração, automação, APIs, CI/CD, acessibilidade, segurança, performance ou engenharia de qualidade. Títulos mudam por empresa; analise responsabilidades e habilidades em vagas atuais. Compare oportunidades com entregas já demonstráveis e lacunas específicas, sem assumir requisitos de empresas sem fonte.", application: "Compare duas descrições de vaga e crie uma meta de estudo ligada a um artefato publicável." },
  ]},
});
