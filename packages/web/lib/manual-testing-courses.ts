export type ManualTestingTrackSlug = "testes-exploratorios" | "testes-regressao";

export type ManualTestingModule = {
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

export type ManualTestingCourse = {
  slug: ManualTestingTrackSlug;
  prefix: string;
  title: string;
  description: string;
  introTitle: string;
  flow: [string, string][];
  modules: ManualTestingModule[];
  outcomes: string[];
  resources: { label: string; href: string }[];
  project: { title: string; description: string; deliverables: string[] };
};

const istqb = { label: "ISTQB CTFL v4.0.1", href: "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/" };

export const manualTestingCourses: Record<ManualTestingTrackSlug, ManualTestingCourse> = {
  "testes-exploratorios": {
    slug: "testes-exploratorios",
    prefix: "manual-exploratory:",
    title: "Testes exploratórios",
    description: "Aprenda a investigar com objetivo, adaptar os testes ao que descobrir e registrar evidências úteis.",
    introTitle: "Explore com direção, aprenda com cada resposta.",
    flow: [["Missão", "escolher uma pergunta"], ["Exploração", "seguir pistas"], ["Evidência", "registrar sinais"], ["Debrief", "compartilhar o que aprendeu"]],
    modules: [
      {
        id: "exploratory-basics", week: 1, duration: "35 min", title: "Exploratório não é teste sem plano",
        objective: "Entender como aprendizado, desenho e execução acontecem juntos em uma sessão exploratória.",
        concepts: ["exploração", "objetivo", "adaptação"],
        practice: "No BrotoSpace, explore a jornada de registrar uma ideia e reencontrá-la depois. Investigue uma pergunta específica em vez de clicar aleatoriamente.",
        deliverable: "Uma pergunta de investigação e três observações relevantes.",
        checklist: ["Escolheu uma área e uma pergunta.", "Adaptou o caminho a partir do comportamento observado.", "Distinguiu exploração de navegação aleatória."],
        example: `Missão: descobrir como uma ideia é registrada e localizada depois.\nObserve: confirmação, estado da lista e opções de organização.\nAdapte: tente texto curto, caracteres especiais e retome a jornada após navegar para outra área.`,
      },
      {
        id: "charter-and-timebox", week: 1, duration: "40 min", title: "Defina charter e limite de tempo",
        objective: "Delimitar missão, alvo, riscos e timebox sem escrever cada passo antes de começar.",
        concepts: ["charter", "timebox", "escopo", "risco"],
        practice: "Crie um charter de 25 minutos para investigar capturar uma ideia, conectá-la a um desafio e transformá-la em ação.",
        deliverable: "Charter com missão, área, riscos e limite de tempo.",
        checklist: ["Missão descreve algo a aprender.", "Área e limite evitam escopo infinito.", "Há liberdade para seguir descobertas relevantes."],
        example: `Explore [captura, conexão e retomada de uma ideia]\nPara descobrir [se o registro preserva contexto e pode virar uma ação]\nConsiderando [interrupção e retorno à jornada]\nDurante 25 minutos.`,
      },
      {
        id: "session-notes", week: 2, duration: "40 min", title: "Registre notas que permitam retomar",
        objective: "Anotar ações, dados, observações e perguntas em quantidade suficiente para reconstruir o raciocínio.",
        concepts: ["notas de sessão", "dados", "observação", "pergunta aberta"],
        practice: "Execute seu charter no BrotoSpace. Registre o que tentou, o que esperava, o que aconteceu e o que pretende investigar depois.",
        deliverable: "Notas curtas com ações, evidências, achados e perguntas em aberto.",
        checklist: ["Outra pessoa consegue entender o caminho percorrido.", "Achado não confirmado aparece como pergunta ou hipótese.", "Dados pessoais ou reais não foram usados."],
        example: `10:04 — registrei a ideia sintética “regar a horta”.\nEsperava: confirmação e possibilidade de reencontrá-la.\nObservei: [descreva o resultado visível].\nPróximo: conectar a um desafio e verificar a ação criada.`,
      },
      {
        id: "heuristics-and-tours", week: 2, duration: "45 min", title: "Use heurísticas e tours para gerar ideias",
        objective: "Escolher uma heurística ou tour como estímulo quando a exploração perder foco, sem transformar isso em roteiro obrigatório.",
        concepts: ["heurísticas", "tours", "acessibilidade", "estados"],
        practice: "Faça um tour de acessibilidade pela jornada de captura usando teclado. Depois investigue estados de carregamento, erro, vazio e sucesso que estejam disponíveis.",
        deliverable: "Dois tours com observações e uma oportunidade de investigação.",
        checklist: ["Tour ajuda a encontrar uma perspectiva diferente.", "Resultado considera o que a aplicação realmente oferece.", "Não confundiu checklist com prova de qualidade."],
        example: `Tour de teclado: percorrer captura, organização e ação sem mouse.\nTour de estados: rascunho, salvo, conectado e concluído, quando disponíveis.\nPergunta: a pessoa percebe o estado e consegue retomar a tarefa?`,
      },
      {
        id: "report-findings", week: 3, duration: "45 min", title: "Transforme uma descoberta em evidência útil",
        objective: "Comunicar um achado com contexto e passos claros, incluindo condições quando a falha é intermitente.",
        concepts: ["reprodução", "evidência", "impacto", "intermitência"],
        practice: "Escolha uma observação que pareça defeito. Tente repeti-la com os mesmos dados; se não ocorrer sempre, registre frequência e condições sem esconder a incerteza.",
        deliverable: "Relato reproduzível ou evidência honesta de intermitência, sem hipótese apresentada como causa.",
        checklist: ["Passos e resultado esperado/observado estão claros.", "Evidência apoia a afirmação.", "Limites de reprodução estão explícitos."],
        example: `Passos: registrar ideia sintética, conectá-la a um desafio e voltar ao histórico.\nEsperado: o vínculo continua visível.\nObservado: [resultado e frequência observados].\nAmbiente: navegador, dispositivo e horário registrados.`,
      },
      {
        id: "debrief-and-coverage", week: 3, duration: "35 min", title: "Feche a sessão com debrief",
        objective: "Resumir cobertura, descobertas, riscos restantes e próximos passos ao terminar o timebox.",
        concepts: ["debrief", "cobertura", "risco residual", "próximo passo"],
        practice: "Revise as notas da sessão, agrupe os achados e explique o que ficou fora do charter ou sem resposta.",
        deliverable: "Resumo de debrief com evidências, cobertura e lacunas.",
        checklist: ["Achados têm prioridade ou impacto contextualizado.", "Lacunas não foram ocultadas.", "Próximo passo ajuda alguém a decidir ou investigar."],
        example: `Explorado: busca parcial, sem resultados e limpar campo.\nAchado: limpeza preserva a lista filtrada em uma tentativa.\nPendente: repetir com mudança rápida de termo.\nDecisão apoiada: corrigir estado e validar antes do release.`,
      },
    ],
    outcomes: ["Criar charters claros e timeboxes úteis.", "Explorar seguindo sinais do sistema.", "Registrar evidência e incerteza.", "Encerrar sessão com cobertura e próximos passos."],
    resources: [istqb],
    project: {
      title: "Sessão exploratória no BrotoSpace",
      description: "Investigue a jornada de captura, conexão e ação com um charter, preserve suas notas e apresente um debrief que outra pessoa consiga usar.",
      deliverables: ["Charter de 30 minutos", "Notas e dados usados", "Achados com evidência", "Cobertura, perguntas abertas e risco restante"],
    },
  },
  "testes-regressao": {
    slug: "testes-regressao",
    prefix: "manual-regression:",
    title: "Testes de regressão",
    description: "Aprenda a escolher e executar verificações que ajudam a perceber efeitos indesejados após uma mudança.",
    introTitle: "Mudou uma parte. O que mais pode ter mudado?",
    flow: [["Mudança", "entender o que foi alterado"], ["Impacto", "mapear relações e riscos"], ["Seleção", "escolher verificações"], ["Retorno", "comunicar sinal e lacunas"]],
    modules: [
      {
        id: "regression-basics", week: 1, duration: "35 min", title: "Entenda o objetivo da regressão",
        objective: "Verificar se uma alteração causou efeitos indesejados em comportamentos que já funcionavam.",
        concepts: ["regressão", "confirmação", "mudança", "comportamento existente"],
        practice: "A forma de salvar uma ideia mudou. Liste comportamentos existentes que podem ser afetados ao capturar, reencontrar, conectar e transformar o registro em ação.",
        deliverable: "Lista de comportamentos em risco e razão de cada escolha.",
        checklist: ["Foco em efeitos da mudança, não só em reexecutar todos os testes.", "Distinguiu testar a correção de procurar regressões relacionadas.", "Identificou o que não sabe sobre o impacto."],
        example: `Confirmação: a ideia nova aparece após salvar.\nRegressão: ela continua localizável, mantém suas conexões e pode virar uma ação.`,
      },
      {
        id: "impact-analysis", week: 1, duration: "45 min", title: "Faça análise de impacto da mudança",
        objective: "Usar requisito, código alterado, dependências, dados e histórico para descobrir áreas afetadas direta e indiretamente.",
        concepts: ["análise de impacto", "dependências", "histórico", "fronteiras"],
        practice: "Uma mudança altera como ideias se conectam a desafios. Mapeie os componentes e jornadas que dependem dessa relação.",
        deliverable: "Mapa de impacto com relações conhecidas e suposições a confirmar.",
        checklist: ["Incluiu consumidores e integrações relacionadas.", "Histórico de defeitos informa prioridades.", "Impacto presumido está marcado como hipótese."],
        example: `Ideia → vínculo com desafio → ação → histórico de progresso.\nPergunta: a edição ou remoção da ideia afeta a ação relacionada?\nVerificação extra: retomar a jornada após sair e voltar.`,
      },
      {
        id: "choose-regression-scope", week: 2, duration: "45 min", title: "Escolha o tamanho da regressão pelo risco",
        objective: "Selecionar verificações proporcionais ao impacto, exposição, frequência de uso, confiança na mudança e tempo disponível.",
        concepts: ["risco", "impacto", "frequência", "escopo de regressão"],
        practice: "Há 30 minutos antes de uma demonstração. Ordene as verificações da jornada de captura e ação por impacto e probabilidade, registrando o que ficará para depois.",
        deliverable: "Escopo prioritário e lacunas explícitas, sem alegar cobertura total.",
        checklist: ["Critério de prioridade é explicado.", "Fluxo crítico e falhas conhecidas foram considerados.", "O limite de tempo não virou uma promessa de risco zero."],
        example: `Primeiro: salvar ideia, reencontrá-la e confirmar o vínculo com a ação.\nDepois: combinações menos frequentes de edição e retomada.\nRegistrar: modo offline ficou fora desta rodada.`,
      },
      {
        id: "regression-checklist-data", week: 2, duration: "45 min", title: "Prepare checklist, ambiente e dados",
        objective: "Organizar casos reutilizáveis com resultado observável e dados controlados, evitando uma lista sem dono ou propósito.",
        concepts: ["checklist", "casos de teste", "dados", "ambiente"],
        practice: "Monte uma checklist curta para a jornada de uma ideia com estado inicial, dado sintético e resultado esperado em cada verificação.",
        deliverable: "Checklist executável e instrução mínima para preparar dados.",
        checklist: ["Cada item verifica um resultado identificável.", "Dados não dependem de execução anterior.", "A checklist pode ser atualizada quando o comportamento mudar."],
        example: `□ Registrar ideia mostra confirmação observável.\n□ Conectar a um desafio preserva o vínculo.\n□ Transformar em ação atualiza o estado correspondente.\nDado: use somente conteúdo sintético; anote o estado inicial antes da execução.`,
      },
      {
        id: "execute-and-triage", week: 3, duration: "50 min", title: "Execute, compare e faça triagem",
        objective: "Comparar resultado atual com o esperado e com uma referência confiável, preservando evidências de falhas e bloqueios.",
        concepts: ["execução", "resultado esperado", "triagem", "evidência"],
        practice: "Execute a checklist da jornada de ideias antes e depois de uma mudança fictícia na conexão com desafios. Registre falhas, ambiente e relação possível com a mudança.",
        deliverable: "Resultado com status, evidência, impacto e perguntas para triagem.",
        checklist: ["Falha tem passos e condições para investigação.", "Não assumiu causa apenas porque ocorreu após a mudança.", "Bloqueios e defeitos estão diferenciados."],
        example: `Falha: a ideia deixa de aparecer no desafio após a conexão.\nImpacto: a pessoa pode perder o contexto do próximo passo.\nVisto: navegador e dados sintéticos registrados.\nRelação com a mudança: hipótese; investigar atualização do vínculo.`,
      },
      {
        id: "maintain-regression-suite", week: 3, duration: "40 min", title: "Mantenha a regressão útil",
        objective: "Revisar verificações redundantes, desatualizadas ou instáveis e decidir o que deve continuar manual ou pode ser automatizado.",
        concepts: ["manutenção", "repetição", "automação por valor", "sinal de release"],
        practice: "Revise uma checklist com itens duplicados, regra removida e um passo instável. Proponha manter, atualizar, remover ou automatizar cada item com justificativa.",
        deliverable: "Checklist revisada e decisão de execução manual/automática baseada em valor.",
        checklist: ["Cada teste protege um risco ou comportamento identificável.", "Itens antigos foram confirmados antes de remover.", "Automação foi proposta quando melhora feedback ou repetição."],
        example: `Manter: ideia salva continua localizável — risco alto de perda de contexto.\nAtualizar: texto de confirmação mudou no produto.\nRemover: verificação de uma regra retirada, após confirmar a mudança.\nAutomatizar: conexão estável entre ideia e ação, se o seletor e o ambiente forem confiáveis.`,
      },
    ],
    outcomes: ["Entender regressão e confirmação da correção.", "Mapear impactos e selecionar testes por risco.", "Executar uma checklist com dados controlados.", "Manter a suíte manual e identificar automação de valor."],
    resources: [istqb],
    project: {
      title: "Plano enxuto de regressão para o BrotoSpace",
      description: "Simule uma mudança na jornada de ideias, avalie impactos e proponha uma regressão que caiba no tempo disponível sem esconder lacunas.",
      deliverables: ["Resumo da mudança e mapa de impacto", "Checklist priorizada com dados e resultados esperados", "Execução fictícia com evidências e triagem", "Itens a manter, revisar ou automatizar e riscos restantes"],
    },
  },
};
