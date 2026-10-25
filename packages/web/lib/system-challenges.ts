import { plantedBugs } from "./product/practice/bugs";

export type SystemChallenge = { id: string; number: number; title: string; area: string; mode: "fluxo" | "investigacao"; difficulty: "Basico" | "Intermediario" | "Avancado"; route: string; objective: string; testData: string; expected: string; steps: string[]; acceptance: string[]; plantedBug: string };

const features = [
  ["Catalogo", "Busca com estado vazio", "/shop/products"], ["Catalogo", "Filtros por categoria, status e preco", "/shop/products"], ["Catalogo", "Ordenacao do catalogo", "/shop/products"], ["Catalogo", "Paginacao e itens por pagina", "/shop/products"], ["Catalogo", "Cards de item", "/shop/products"], ["Catalogo", "Detalhe do item", "/shop/products/1"], ["Catalogo", "Favoritos persistentes", "/shop/products"], ["Catalogo", "Comparacao entre itens", "/shop/products"], ["Catalogo", "Avaliacoes", "/shop/products/1"], ["Catalogo", "Estoque e reposicao", "/shop/products/4"],
  ["Checkout", "Adicionar ao carrinho", "/shop/products"], ["Checkout", "Quantidade e remocao", "/shop/cart"], ["Checkout", "Carrinho persistente", "/shop/cart"], ["Checkout", "Cupom de desconto", "/shop/cart"], ["Checkout", "Calculo de frete", "/shop/checkout"], ["Checkout", "Regra de frete gratis", "/shop/checkout"], ["Checkout", "Desconto, imposto e total", "/shop/checkout"], ["Checkout", "Endereco com validacoes", "/shop/checkout"], ["Checkout", "Tipos de entrega", "/shop/checkout"], ["Checkout", "Formas de pagamento", "/shop/checkout"],
  ["Pedidos", "Historico e filtro de pedidos", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Detalhe do pedido", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Linha do tempo de status", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Rastreio", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Cancelamento", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Solicitacao de devolucao", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Reembolso parcial ou total", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Nota fiscal simulada", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Recompra", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Pesquisa pos-entrega", "/shop/orders/QL-DEMO-001"],
  ["Clientes", "Cadastro e e-mail duplicado", "/shop/modules/clientes"], ["Clientes", "Login, logout e sessao expirada", "/shop/modules/clientes"], ["Clientes", "Recuperacao de senha", "/shop/modules/clientes"], ["Clientes", "Edicao de perfil", "/shop/modules/clientes"], ["Clientes", "Enderecos", "/shop/modules/clientes"], ["Clientes", "Preferencias de comunicacao", "/shop/modules/clientes"], ["Clientes", "Preferencias de acessibilidade", "/shop/modules/clientes"], ["Clientes", "MFA simulada", "/shop/modules/clientes"], ["Clientes", "Dispositivos e sessoes", "/shop/modules/clientes"], ["Clientes", "Exclusao e exportacao LGPD", "/shop/modules/clientes"],
  ["Atendimento", "Abertura de ticket", "/shop/modules/suporte"], ["Atendimento", "Fila, filtros e SLA", "/shop/modules/suporte"], ["Atendimento", "Conversa e anexos", "/shop/modules/suporte"], ["Atendimento", "Base de ajuda", "/shop/modules/suporte"], ["Operacao", "Estoque minimo", "/shop/modules/operacao"], ["Operacao", "Fornecedores", "/shop/modules/operacao"], ["Operacao", "Promocoes", "/shop/modules/operacao"], ["Operacao", "Regras e aprovacao de preco", "/shop/modules/operacao"], ["Relatorios", "Dashboard, metricas e datas", "/shop/modules/relatorios"], ["Governanca", "Auditoria, permissoes, flags e alertas", "/shop/modules/automacao"],
] as const;

// Features dos ambientes de pratica. O Broto usa o caso ficticio guiado em
// /conteudo/broto; os ambientes locais usam seu proprio seed de teste.
//
// O quinto campo e o id do desvio plantado que cai neste ponto. Ele existe para
// a pista dizer ONDE ligar e O QUE esperar: sem isso a dica virava a mesma
// frase generica em todos os desafios, e o aluno nao sabia qual desvio ligar
// nem que sintoma procurar. String vazia = ponto sem desvio proprio.
const practiceFeatures = [
  ["Broto", "Captura e retomada de um pensamento", "/conteudo/broto", "Use os textos fictícios do caso de treino. Registre um pensamento na Mente, saia da tela e volte ao registro.", ""],
  ["Broto", "Organização do problema e do objetivo", "/conteudo/broto", "Use o problema e o objetivo do caso de treino. Observe os recursos disponíveis na sua conta e separe o que conseguiu fazer do que é apenas hipótese.", ""],
  ["Broto", "Próximo passo e contexto da jornada", "/conteudo/broto", "Use o próximo passo fictício do caso de treino. Compare o estado antes e depois de registrá-lo e de retomar a jornada.", ""],
  ["Broto", "Exploração móvel e interrupção da captura", "/conteudo/broto", "Inicie o caso de treino em um viewport móvel, interrompa a tarefa e retome. Registre dispositivo, estado e dúvidas.", ""],
  ["Broto", "Revisita e histórico do crescimento", "/conteudo/broto", "Volte ao mesmo caso em outra sessão e compare o que foi registrado com o histórico ou a revisita disponível.", ""],
  ["Agendamentos", "Grade de horarios e disponibilidade", "/agendamentos#grade", "Dia 18/08/2026 com 10:00 e 14:00 ocupados; atendimento de segunda a sexta das 09:00 as 18:00 e sabado ate as 13:00.", ""],
  ["Agendamentos", "Conflito de horario", "/agendamentos#nova-reserva", "Tente 10:00 de 18/08/2026, ja ocupado por Ana Costa, e o mesmo horario em 25/08/2026, livre.", "agendamentos.conflito-permitido"],
  ["Agendamentos", "Reagendamento", "/agendamentos#agenda", "Mova Bruno Dias de 14:00 para 15:00 no mesmo dia e confira a grade antes e depois.", "agendamentos.conflito-permitido"],
  ["Agendamentos", "Cancelamento e liberacao do horario", "/agendamentos#por-dia", "Cancele Ana Costa e tente agendar outro cliente no horario liberado.", "agendamentos.cancelado-ocupa-horario"],
  ["Agendamentos", "Atendimento fora da faixa configurada", "/agendamentos#disponibilidade", "Tente agendar as 20:00 e em um domingo, que nao tem faixa configurada.", ""],
  ["CRM", "Funil e valor do pipeline", "/crm#funil", "Cinco oportunidades no seed, somando 194.000 sem a perdida (consultoria pontual, 12.000).", "crm.pipeline-soma-perdidos"],
  ["CRM", "Mudanca de estagio de oportunidade", "/crm#funil", "Mova o piloto de automacao (18.000) de Novo ate Ganho e depois marque outra como Perdido.", "crm.pipeline-soma-perdidos"],
  ["CRM", "Busca de contatos", "/crm#contatos", "Contatos do seed: Marina Costa, Antonio Ribeiro (com acento no cadastro) e Pedro Lima.", "crm.busca-ignora-acentos"],
  ["CRM", "Duplicidade de contato e empresa", "/crm#contatos", "marina@nortedigital.com e a empresa Orbit SaaS ja existem na massa.", ""],
  ["CRM", "Atividades da oportunidade", "/crm#atividades", "Duas atividades no seed, ligadas ao modulo fiscal e a renovacao anual.", ""],
] as const;

const allFeatures = [
  ...features.map(([area, title, route]) => ({ area, title, route, sample: "", bugId: "" })),
  ...practiceFeatures.map(([area, title, route, sample, bugId]) => ({ area, title, route, sample, bugId })),
];

// A pista precisa responder duas coisas: onde mexer e o que esperar depois.
//
// "Onde" e a barra "Controles do ambiente de pratica", no topo do ambiente —
// e o passo do "Modo instrutor" nao pode faltar, porque a lista de desvios so
// aparece com ele ligado (components/practice/environment-bar.tsx). Sem esse
// detalhe o aluno abre a barra, nao acha desvio nenhum e trava.
//
// "O que" e o sintoma do desvio, nunca o mecanismo: `symptom` e o que viraria
// um bug report, `mechanism` e a resposta e fica so no modo instrutor.
function practiceHint(route: string, bugId: string) {
  const app = route.split("#")[0];
  const bug = plantedBugs.find((item) => item.id === bugId);
  const setup = `Abra ${app}, ligue "Modo instrutor" na barra "Controles do ambiente de prática" (sem ele a lista de desvios fica oculta)`;

  if (!bug) {
    // Sortear usa 50% por desvio, entao pode nao ligar nada: prometer sorteio
    // aqui faria o aluno validar contra um ambiente limpo achando que nao.
    return `Este ponto nao tem desvio proprio: use "Restaurar massa" na barra do ambiente e valide contra o seed. Se for sortear, confira antes quantos desvios ficaram ativos — o sorteio pode nao ligar nenhum.`;
  }

  return `${setup} e marque "${bug.title}" (severidade ${bug.severity}). Com ele ligado o sintoma e: ${bug.symptom} Compare com o comportamento correto e use "Restaurar massa" para voltar ao seed antes de cada rodada.`;
}

export const systemChallenges: SystemChallenge[] = allFeatures.flatMap(({ area, title, route, sample, bugId }, index) => {
  const feature = index + 1;
  return (["fluxo", "investigacao"] as const).map((mode, variant) => {
    const number = index * 2 + variant + 1;
    const flow = mode === "fluxo";
    // Lab 01 é a experiência de entrada do lançamento. Ele precisa ter um
    // briefing autocontido, com uma massa e um oráculo verificáveis, em vez
    // de herdar o texto genérico usado pelos demais pontos do catálogo.
    if (number === 101) {
      return {
        id: "desafio-101", number, area: "Broto", mode, route,
        title: "Investigar a captura e a retomada de um pensamento",
        difficulty: "Basico" as const,
        objective: "Investigar se um pensamento fictício pode ser registrado e encontrado novamente no Broto, distinguindo comportamento observado de hipótese.",
        testData: "Use a conta de estudo e o pensamento fictício do caso de treino em /conteudo/broto. Não inclua e-mail, senha ou reflexões pessoais nas evidências.",
        expected: "Depois de registrar o pensamento, a pessoa deve conseguir encontrá-lo ao voltar. Se a interface não oferecer uma etapa esperada, registre a dúvida sem presumir defeito.",
        steps: [
          "Leia o caso de treino e abra o Broto com uma conta de estudo.",
          "Registre o pensamento fictício na Mente, saia da tela e tente encontrá-lo novamente.",
          "Compare o estado antes e depois da retomada; repita com uma interrupção ou em viewport móvel se puder.",
          "Entregue passos reproduzíveis, resultado observado, expectativa ou dúvida e impacto, sem dados pessoais.",
        ],
        acceptance: [
          "Conta de estudo, dado fictício e condição do teste ficam claros sem expor acesso",
          "A evidência descreve a captura, a saída e a retomada com o resultado observado",
          "Regra confirmada, hipótese e impacto são separados com clareza",
        ],
        plantedBug: "Este é um produto real, sem defeito plantado. Registre apenas o que conseguir observar; uma investigação sem falha também pode gerar uma boa evidência.",
      };
    }
    if (number === 103) {
      return {
        id: "desafio-103", number, area: "Broto", mode, route,
        title: "Investigar problema, objetivo e organização do caso",
        difficulty: "Basico" as const,
        objective: "Investigar como o Broto ajuda a distinguir um pensamento, um problema e um objetivo na jornada do caso de treino.",
        testData: "Use o problema e o objetivo fictícios de /conteudo/broto. Observe somente os recursos disponíveis na sua conta.",
        expected: "A pessoa deve entender o que conseguiu registrar e recuperar. Relações entre registros que não aparecerem devem ser tratadas como pergunta de produto.",
        steps: ["Abra o caso de treino e identifique problema e objetivo.", "Use os recursos disponíveis no Broto para organizar esses registros.", "Volte aos registros e compare o que a interface mostrou com o que você esperava encontrar."],
        acceptance: ["Os dados fictícios usados são identificados", "A organização e a revisita são descritas com passos reproduzíveis", "Observações e hipóteses sobre relações entre registros são separadas"],
        plantedBug: "Não há desvio controlado: documente a experiência real e formule perguntas quando uma regra não estiver clara.",
      };
    }
    if (number === 105) {
      return {
        id: "desafio-105", number, area: "Broto", mode, route,
        title: "Investigar o próximo passo e a retomada da jornada",
        difficulty: "Basico" as const,
        objective: "Investigar se o próximo passo fictício continua compreensível quando a pessoa retorna à jornada do Broto.",
        testData: "Use o próximo passo e os demais textos fictícios do caso de treino em /conteudo/broto.",
        expected: "Ao retomar a jornada, a pessoa deve conseguir identificar o que registrou e qual ação ainda faz sentido. Qualquer ligação não disponível deve ser anotada como hipótese.",
        steps: ["Abra o caso de treino e registre o próximo passo com os recursos disponíveis.", "Saia da jornada e retorne ao mesmo caso em outra sessão.", "Compare o estado visível antes e depois e anote o que a interface permite concluir."],
        acceptance: ["O próximo passo fictício e as condições de retomada são identificados", "Estados antes e depois são comparados", "Conclusão e dúvidas se apoiam em evidência sem dados pessoais"],
        plantedBug: "Não há resposta escondida nem defeito plantado; investigue o comportamento observável.",
      };
    }
    if (area === "Broto") {
      return {
        id: `desafio-${number}`, number, area, mode, route,
        title: `${flow ? "Validar" : "Investigar"} ${title[0].toLowerCase()}${title.slice(1)}`,
        difficulty: flow ? "Basico" as const : "Intermediario" as const,
        objective: `${flow ? "Descrever o comportamento observável de" : "Investigar riscos em"} ${title.toLowerCase()} no Broto com evidência reproduzível.`,
        testData: `${sample} Use somente a conta de estudo e os dados fictícios de /conteudo/broto.`,
        expected: "O registro e a retomada devem ser compreensíveis para a pessoa usuária; confirme as regras disponíveis antes de tratá-las como oráculo.",
        steps: ["Leia o caso de treino e prepare os textos fictícios.", `Explore ${title.toLowerCase()} no Broto e registre o estado inicial.`, "Saia e retorne à jornada; compare o observado com a expectativa confirmada ou com a hipótese aberta.", "Documente passos, resultado, impacto e limites da investigação sem dados pessoais."],
        acceptance: ["Dados e condições do teste são identificados", "O resultado observado tem passos reproduzíveis", "Hipóteses são separadas de regras confirmadas"],
        plantedBug: "O Broto não tem defeitos plantados para este Lab. Registre a investigação mesmo quando não encontrar uma falha.",
      };
    }
    return {
      id: `desafio-${String(number).padStart(3, "0")}`, number, area, mode, route,
      // Sem o índice da feature no título: "Validar 51: Lancamentos" mostrava ao
      // aluno um número de catálogo que não significa nada pra ele.
      title: `${flow ? "Validar" : "Quebrar"} ${title[0].toLowerCase()}${title.slice(1)}`,
      // Os ambientes novos entram por fora da escala da loja: validar o fluxo e
      // basico, investigar o mesmo ponto e um degrau acima.
      difficulty: sample ? (flow ? "Basico" : "Intermediario") : feature <= 15 ? "Basico" : feature <= 35 ? "Intermediario" : "Avancado",
      objective: flow ? `Produzir evidencia de que ${title.toLowerCase()} atende ao comportamento esperado.` : `Investigar um risco real em ${title.toLowerCase()} e registrar um bug reproduzivel ou uma conclusao justificada.`,
      testData: flow
        ? sample || "Usuario: standard_user · senha: qa_lab_secret · CEP: 01310-100 · cupom: QA10."
        : `${sample ? `${sample} ` : ""}Use valor vazio, limite (0 / 999999), caractere especial, recarregamento e navegacao por teclado.`,
      expected: flow ? "O fluxo deve informar o resultado, preservar dados quando aplicavel e manter foco/feedback acessivel." : "A aplicacao deve bloquear entradas invalidas, explicar a falha e nao corromper estado ou calculos.",
      steps: flow ? [
        `Abra ${title.toLowerCase()} pela superficie indicada e registre a pre-condicao.`,
        "Execute o caminho principal usando os dados de teste fornecidos.",
        "Valide valor exibido, persistencia apos recarregar e mensagem para leitor de tela (aria-live).",
        "Colete resultado obtido e anote se ele corresponde ao oraculo.",
      ] : [
        `Mapeie o comportamento normal de ${title.toLowerCase()} antes de tentar falhar.`,
        "Aplique uma variacao invalida e uma variacao de limite; repita usando somente teclado.",
        "Recarregue a pagina no meio do fluxo e compare estado, valor e mensagem.",
        "Registre passos minimos de reproducao, impacto, severidade e evidencia.",
      ],
      acceptance: flow ? ["Passos reproduziveis", "Resultado obtido comparado ao esperado", "Evidencia com valor ou mensagem exibida"] : ["Passos minimos para reproduzir", "Impacto e severidade justificados", "Resultado esperado e real claramente separados"],
      plantedBug: flow
        ? sample
          ? practiceHint(route, bugId)
          : "Ative /shop/checkout?bug=wrong-total ao testar calculos relacionados; para os demais, valide tambem foco e persistencia."
        // Modo investigacao nao nomeia o desvio: entregar o sintoma aqui mataria
        // o exercicio, que e justamente descobrir o que esta errado.
        : `Procure inconsistencias de validacao, estado apos recarregar, feedback acessivel e fronteiras em ${title.toLowerCase()}.`,
    };
  });
});
