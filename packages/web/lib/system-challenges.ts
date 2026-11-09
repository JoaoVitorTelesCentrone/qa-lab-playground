import { plantedBugs } from "./product/practice/bugs";
import { brotoTrainingCase } from "./mentorship/broto-training-case";
import { brotoSpaceSite } from "./mentorship/brotospace-track";
import { mentorshipLabs } from "./labs/mentorship-labs";
import { labPositions } from "./playground/lab-order";
import type { DeliveryFieldId } from "./product/delivery";

/** O que fazer antes de testar: itens marcáveis e textos para copiar. */
export type LabPrepare = {
  items: string[];
  copy?: { label: string; text: string }[];
  /** Material de apoio opcional (ex.: o caso de treino completo). */
  reading?: { label: string; href: string };
};

export type SystemChallenge = {
  id: string; number: number; title: string; area: string; mode: "fluxo" | "investigacao"; difficulty: "Basico" | "Intermediario" | "Avancado"; route: string; objective: string; testData: string; expected: string; steps: string[]; acceptance: string[]; plantedBug: string;
  /** "Observe:" de cada passo do roteiro, na mesma posição de `steps`. Vazio = sem dica. */
  stepObserve?: string[];
  prepare?: LabPrepare;
  /** Sistema testado, quando ele não é a própria `route` (ex.: o Broto, externo). */
  system?: { name: string; url: string; external: boolean };
  /** Campos que dão suporte estrutural a cada critério, na mesma ordem de `acceptance`. */
  acceptanceFields?: readonly (readonly DeliveryFieldId[])[];
};

// O caso de treino do Broto entra no próprio Lab: conta de estudo, textos para
// copiar e o "Observe" de cada etapa. Antes isso morava só em /conteudo/broto,
// e o aluno precisava de uma terceira aba para seguir dois roteiros.
const brotoSystem = { name: "Broto", url: brotoSpaceSite.url, external: true };
const brotoSeed = (...labels: string[]) => brotoTrainingCase.seed.filter((item) => labels.includes(item.label)).map((item) => ({ label: item.label, text: item.text }));
const brotoPrepare = (copy: { label: string; text: string }[]): LabPrepare => ({
  items: ["Crie ou entre na sua conta de estudo no Broto. Use só os textos fictícios abaixo; e-mail e senha ficam no Broto.", `Marque os registros com "${brotoTrainingCase.label}" para encontrá-los de novo.`],
  copy,
  reading: { label: "Caso de treino completo", href: "/conteudo/broto" },
});
const [stageCapture, stageOrganize, stageAction, stageReturn] = brotoTrainingCase.stages;

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
  ["Broto", "Critérios e oráculos para ideia, desafio e ação", "/conteudo/broto", "Crie uma ideia, um desafio e uma ação com os textos fictícios do caso de treino. Antes de testar, liste os campos e as relações que a sua conta oferece e escreva o resultado esperado de cada um.", ""],
  ["Broto", "Crescimento visível: heatmap e sequência", "/conteudo/broto", "Registre pensamentos fictícios em dias diferentes e compare o heatmap e a sequência com o que você de fato registrou.", ""],
  ["Broto", "Conexões entre registros", "/conteudo/broto", "Conecte uma ideia a um desafio e a uma ação do caso de treino e confira, nos dois sentidos, se a conexão aparece e se mantém depois de sair e voltar.", ""],
  ["Broto", "Estados de ideia, desafio e ação", "/conteudo/broto", "Percorra os estados que a sua conta oferece para uma ideia, um desafio e uma ação, anotando cada transição permitida e cada uma que a interface não deixa fazer.", ""],
  ["Broto", "Limites dos campos de texto", "/conteudo/broto", "Use o texto fictício do caso de treino em versões vazia, curta, muito longa, com acentos e com caracteres especiais, e compare o que é aceito, cortado ou recusado.", ""],
  ["Broto", "Números exibidos contra o dado", "/conteudo/broto", "Registre uma quantidade conhecida de pensamentos fictícios e compare cada contador, total ou sequência que a tela mostra com o que a rede devolve.", ""],
  ["Broto", "Mudança de estado de um desafio", "/conteudo/broto", "Mude o estado de um desafio do caso de treino e confira, depois de recarregar, se o estado salvo é o que a tela indicou.", ""],
  ["Broto", "Busca dos seus registros", "/conteudo/broto", "Se a sua conta oferecer busca, procure um texto fictício com e sem acento, em maiúsculas e minúsculas, e compare o que cada busca encontra.", ""],
  ["Broto", "Registros parecidos ou duplicados", "/conteudo/broto", "Registre duas vezes o mesmo texto fictício e confira se o Broto trata como um só, avisa ou aceita os dois.", ""],
  ["Broto", "Ações ligadas a um desafio", "/conteudo/broto", "Crie duas ações ligadas ao mesmo desafio do caso de treino e confira se ambas aparecem nos dois lados, antes e depois de recarregar.", ""],
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
    return `Este ponto não tem desvio próprio: use "Restaurar massa" na barra do ambiente e valide contra o seed. Se for sortear, confira antes quantos desvios ficaram ativos — o sorteio pode não ligar nenhum.`;
  }

  return `${setup} e marque "${bug.title}" (severidade ${bug.severity}). Com ele ligado o sintoma e: ${bug.symptom} Compare com o comportamento correto e use "Restaurar massa" para voltar ao seed antes de cada rodada.`;
}

// Labs da mentoria (módulos 2 e 4) que usam o Broto como sistema testado. O Broto é
// um produto real, sem defeito plantado: cada Lab pede investigação e evidência,
// e uma dúvida bem formulada também vale como entrega. Só preenche o que o
// gerador do Broto não cobre bem (título, objetivo, roteiro e critérios).
const brotoPathLabs: Readonly<Record<number, Partial<SystemChallenge>>> = {
  122: {
    title: "Comparar o número exibido com o dado da resposta",
    objective: "Rastrear um número que o Broto exibe (contador, total ou sequência) até o dado que a rede devolve, e dizer se a conta fecha.",
    expected: "O número na tela é o que se obtém contando os registros da resposta. Se a regra de contagem não estiver clara na interface, registre a dúvida em vez de tratá-la como defeito.",
    steps: [
      "Registre uma quantidade conhecida de pensamentos fictícios e anote a quantidade.",
      "Veja o número que a tela mostra e a requisição que traz os dados.",
      "Conte os registros da resposta e compare com o número da tela.",
      "Escreva a conclusão: a conta fecha, não fecha ou depende de uma regra que você não conhece.",
    ],
    stepObserve: ["", "O número da tela é calculado na tela ou vem pronto da resposta?", "Algum registro da resposta ficou fora do número?", ""],
    acceptance: [
      "A quantidade registrada e o número exibido estão informados",
      "A contagem da resposta foi feita e comparada com a tela",
      "A conclusão separa conta que fecha, conta que não fecha e regra desconhecida",
    ],
  },
  111: {
    title: "Definir critérios e oráculos para ideia, desafio e ação",
    objective: "Escrever critérios de aceite verificáveis para registrar uma ideia, um desafio e uma ação no Broto, dizendo de onde vem o resultado esperado de cada um.",
    expected: "Cada critério tem uma condição observável e uma fonte para o esperado: regra confirmada na interface ou hipótese marcada como tal.",
    steps: [
      "Abra o Broto com a conta de estudo e liste os campos e as relações que ela oferece para ideia, desafio e ação.",
      "Para cada item, escreva um critério no formato \"quando eu faço X, devo ver Y\".",
      "Execute cada critério e anote o que apareceu na tela.",
      "Classifique cada esperado como regra confirmada na interface ou hipótese a confirmar com o produto.",
    ],
    stepObserve: ["", "A condição é observável por outra pessoa?", "Resultado igual ao critério, diferente ou ambíguo?", ""],
    acceptance: [
      "Cada critério tem condição observável e resultado esperado",
      "A evidência mostra o que apareceu na tela para cada critério executado",
      "Regra confirmada e hipótese ficam separadas, com a fonte de cada esperado",
    ],
  },
  114: {
    title: "Relatar com evidência o que o crescimento visível mostra",
    objective: "Comparar o heatmap e a sequência do Broto com o que foi registrado e entregar um relato de defeito, ou uma dúvida, que outra pessoa consiga reproduzir.",
    expected: "O heatmap e a sequência refletem os dias em que houve registro. Se a interface não explicar uma regra (por exemplo, o que conta como um dia), registre a dúvida sem presumir defeito.",
    steps: [
      "Anote, antes de testar, os dias e os registros que você fez com a conta de estudo.",
      "Abra o heatmap e a sequência e compare cada dia com o que você anotou.",
      "Repita depois de recarregar e em outro viewport; anote qualquer diferença.",
      "Escreva o relato: passos, esperado, observado, impacto e o que você não conseguiu confirmar.",
    ],
    stepObserve: ["", "Todo dia com registro aparece? Algum dia sem registro aparece?", "Muda ao recarregar ou ao trocar de viewport?", ""],
    acceptance: [
      "Os passos reproduzem a comparação entre o que foi registrado e o que foi exibido",
      "Esperado e observado estão separados, com impacto descrito sem exagero",
      "O relato diz o que não pôde ser confirmado e qual dado falta",
    ],
  },
  116: {
    title: "Organizar a evidência de uma investigação sobre conexões",
    objective: "Investigar as conexões entre ideia, desafio e ação no Broto e organizar a evidência de modo que o relato possa ser revisado sem refazer o teste.",
    expected: "Uma conexão feita de um lado aparece do outro e continua depois de sair e voltar. Se a interface não indicar o sentido da conexão, registre como dúvida.",
    steps: [
      "Conecte uma ideia a um desafio e a uma ação com os textos do caso de treino.",
      "Confira a conexão nos dois sentidos: abrindo a ideia e abrindo o desafio.",
      "Saia, recarregue e volte; compare o que persistiu com o que você anotou.",
      "Monte a evidência em uma ordem que outra pessoa possa seguir: contexto, passos, observado, esperado e conclusão.",
    ],
    stepObserve: ["", "A conexão aparece nos dois lados com o mesmo texto?", "O que mudou depois de recarregar?", ""],
    acceptance: [
      "A evidência segue uma ordem que permite repetir a investigação",
      "A conexão foi conferida nos dois sentidos e depois de recarregar",
      "A conclusão diz o que foi confirmado, o que é hipótese e o que ficou sem testar",
    ],
  },
  117: {
    title: "Mapear estados e transições de ideia, desafio e ação",
    objective: "Montar a tabela de estados e transições que o Broto permite para ideia, desafio e ação, a partir do que se observa na interface.",
    expected: "Cada transição permitida acontece e é visível; cada transição que a interface não oferece fica registrada como não permitida, sem presumir defeito.",
    steps: [
      "Liste os estados que a sua conta mostra para ideia, desafio e ação.",
      "Tente cada transição entre eles e anote se foi permitida ou impedida, e como a interface avisou.",
      "Monte a tabela: estado de origem, ação, estado de destino e o que a tela mostrou.",
      "Marque as combinações que você não conseguiu alcançar e por quê.",
    ],
    stepObserve: ["", "A interface avisa quando impede uma transição?", "O estado muda no mesmo instante ou só depois de recarregar?", ""],
    acceptance: [
      "A tabela lista origem, ação, destino e resultado observado de cada transição",
      "Transições impedidas aparecem com a mensagem ou o comportamento da interface",
      "Combinações não alcançadas estão listadas com o motivo",
    ],
  },
  118: {
    title: "Investigar uma transição de estado inesperada",
    objective: "Escolher uma transição de estado do Broto que pareça inconsistente, reproduzi-la e entregar o relato, ou a dúvida, com evidência.",
    expected: "O estado depois da transição corresponde ao que a interface indicava antes e continua igual depois de recarregar. Se a regra não estiver clara, registre a dúvida.",
    steps: [
      "Releia a tabela de estados e escolha uma transição que pareça incomum.",
      "Repita a transição três vezes partindo do mesmo estado inicial e anote se o resultado é sempre o mesmo.",
      "Recarregue e compare o estado salvo com o que a tela mostrou logo após a transição.",
      "Escreva o relato com passos mínimos, esperado, observado e o que ainda não dá para afirmar.",
    ],
    stepObserve: ["", "O resultado é o mesmo nas três tentativas?", "O estado de antes de recarregar é o de depois?", ""],
    acceptance: [
      "Os passos partem de um estado inicial claro e repetem a transição",
      "O relato compara o estado exibido com o estado salvo depois de recarregar",
      "A conclusão separa falha confirmada, comportamento esperado e dúvida",
    ],
  },
  119: {
    title: "Dividir em classes e limites o texto de uma ideia",
    objective: "Aplicar partição em classes e valores-limite ao campo de texto de uma ideia no Broto e escolher um conjunto pequeno de casos que cubra as classes.",
    expected: "Texto válido é aceito e aparece igual ao voltar; texto vazio e acima do limite são tratados de forma explicada. Onde o limite não for informado, registre-o como a descobrir.",
    steps: [
      "Liste as classes de entrada: vazio, curto, comum, longo, com acentos e com caracteres especiais.",
      "Para cada classe, escolha um valor representativo e um valor na fronteira com a classe vizinha.",
      "Execute os casos e anote se foi aceito, cortado ou recusado e com qual mensagem.",
      "Monte a tabela de casos executados e diga o que cada classe cobre.",
    ],
    stepObserve: ["", "O limite aparece na interface ou só se descobre testando?", "O texto salvo é idêntico ao digitado?", ""],
    acceptance: [
      "As classes e os valores de fronteira estão listados com o motivo de cada escolha",
      "Cada caso mostra o valor usado e o comportamento observado",
      "Limites que a interface não informa estão marcados como hipótese ou descoberta",
    ],
  },
  120: {
    title: "Investigar os limites dos campos de texto",
    objective: "Explorar os limites do texto no Broto além do caso comum e entregar o que foi aceito, cortado ou recusado, ou a dúvida, com evidência reproduzível.",
    expected: "O Broto aceita, corta ou recusa o texto de modo previsível e deixa a pessoa saber o que aconteceu. Texto cortado em silêncio merece um relato; sem regra confirmada, registre como dúvida.",
    steps: [
      "Parta da tabela de classes e escolha o limite que mais pode afetar uma pessoa real.",
      "Tente passar do limite e anote o que a interface fez: aceitou, cortou, recusou ou travou.",
      "Salve, saia e volte; compare o que ficou salvo com o que você digitou.",
      "Escreva o relato com o texto exato usado (fictício), o esperado, o observado e o impacto.",
    ],
    stepObserve: ["", "A interface avisa que passou do limite?", "O que foi salvo é o que foi digitado?", ""],
    acceptance: [
      "O texto de teste e o limite explorado estão informados, sem dados pessoais",
      "O relato compara o digitado com o que ficou salvo depois de voltar",
      "Impacto e conclusão separam falha confirmada, comportamento esperado e dúvida",
    ],
  },
};

const challenges: SystemChallenge[] = allFeatures.flatMap(({ area, title, route, sample, bugId }, index): SystemChallenge[] => {
  const feature = index + 1;
  return (["fluxo", "investigacao"] as const).map((mode, variant): SystemChallenge => {
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
        testData: "Use a conta de estudo e o pensamento fictício copiado no Preparar. Não inclua e-mail, senha ou reflexões pessoais nas evidências.",
        expected: "Depois de registrar o pensamento, a pessoa deve conseguir encontrá-lo ao voltar. Se a interface não oferecer uma etapa esperada, registre a dúvida sem presumir defeito.",
        steps: [
          "Abra o Broto com a conta de estudo e anote o estado inicial da Mente.",
          "Registre o pensamento fictício na Mente, saia da tela e tente encontrá-lo novamente.",
          "Compare o estado antes e depois da retomada; repita com uma interrupção ou em viewport móvel se puder.",
          "Anote o que fez, o que esperava e o que viu. Isso vira a sua entrega.",
        ],
        stepObserve: ["", stageCapture.observe, "Onde o registro aparece ao voltar? O texto continua igual?", ""],
        prepare: brotoPrepare(brotoSeed("Pensamento para a Mente")),
        system: brotoSystem,
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
        testData: "Use o problema e o objetivo fictícios copiados no Preparar. Observe somente os recursos disponíveis na sua conta.",
        expected: "A pessoa deve entender o que conseguiu registrar e recuperar. Relações entre registros que não aparecerem devem ser tratadas como pergunta de produto.",
        steps: ["Abra o Broto com a conta de estudo e localize onde registrar problema e objetivo.", "Use os recursos disponíveis no Broto para organizar esses registros.", "Volte aos registros e compare o que a interface mostrou com o que você esperava encontrar."],
        stepObserve: ["", stageOrganize.observe, "O que você conseguiu fazer e o que apenas esperava encontrar?"],
        prepare: brotoPrepare(brotoSeed("Problema", "Objetivo")),
        system: brotoSystem,
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
        testData: "Use o próximo passo fictício copiado no Preparar, junto com os registros dos Labs anteriores se já tiver feito.",
        expected: "Ao retomar a jornada, a pessoa deve conseguir identificar o que registrou e qual ação ainda faz sentido. Qualquer ligação não disponível deve ser anotada como hipótese.",
        steps: ["Abra o Broto e registre o próximo passo com os recursos disponíveis.", "Saia da jornada e retorne ao mesmo caso em outra sessão.", "Compare o estado visível antes e depois e anote o que a interface permite concluir."],
        stepObserve: [stageAction.observe, "", stageReturn.observe],
        prepare: brotoPrepare(brotoSeed("Próximo passo")),
        system: brotoSystem,
        acceptance: ["O próximo passo fictício e as condições de retomada são identificados", "Estados antes e depois são comparados", "Conclusão e dúvidas se apoiam em evidência sem dados pessoais"],
        plantedBug: "Não há resposta escondida nem defeito plantado; investigue o comportamento observável.",
      };
    }
    if (number === 102) {
      return {
        id: "desafio-102", number, area: "Broto", mode, route,
        title: "Investigar riscos na captura e retomada de um pensamento",
        difficulty: "Intermediario" as const,
        objective: "Investigar riscos de perda ou mudança de contexto ao registrar um pensamento fictício e retomá-lo depois no Broto.",
        stepObserve: ["", "Texto, posição e contexto continuam iguais?", "O que mudou entre recarregar e interromper?", ""],
        prepare: brotoPrepare(brotoSeed("Pensamento para a Mente")),
        system: brotoSystem,
        testData: "Use a conta de estudo e o pensamento fictício copiado no Preparar. Antes de salvar, anote o texto e o contexto exibidos; depois saia da Mente, recarregue e volte ao registro. Repita com uma interrupção no meio da captura e, se possível, em viewport móvel. Não inclua e-mail, senha ou reflexões pessoais.",
        expected: "O pensamento registrado deve continuar disponível e compreensível ao retornar, inclusive após recarregar ou interromper a tarefa. Se a interface não confirmar uma regra, registre a dúvida em vez de tratá-la como defeito.",
        steps: [
          "Registre o pensamento fictício na Mente; anote texto e contexto exibidos antes de sair.",
          "Saia da tela e volte ao registro; compare texto, posição e contexto com o que foi anotado.",
          "Repita com recarregamento e com uma interrupção no meio da captura; registre o que mudou em cada tentativa.",
          "Documente passos, resultado observado, expectativa ou dúvida, impacto e limites da investigação sem dados pessoais.",
        ],
        acceptance: [
          "Conta de estudo, pensamento fictício e condições de cada tentativa ficam claros sem expor acesso",
          "A evidência distingue perda do registro, dificuldade de encontrá-lo e mudança de contexto",
          "Regra confirmada, hipótese e impacto são separados com clareza",
        ],
        plantedBug: "O Broto é um produto real, sem defeito plantado. Registre a investigação mesmo quando não encontrar uma falha; uma dúvida bem formulada também é evidência.",
      };
    }
    if (area === "Broto") {
      return {
        id: `desafio-${number}`, number, area, mode, route,
        title: `${flow ? "Validar" : "Investigar"} ${title[0].toLowerCase()}${title.slice(1)}`,
        difficulty: flow ? "Basico" as const : "Intermediario" as const,
        objective: `${flow ? "Descrever o comportamento observável de" : "Investigar riscos em"} ${title.toLowerCase()} no Broto com evidência reproduzível.`,
        testData: `${sample} Use somente a conta de estudo e os textos fictícios copiados no Preparar.`,
        expected: "O registro e a retomada devem ser compreensíveis para a pessoa usuária; confirme as regras disponíveis antes de tratá-las como oráculo.",
        steps: ["Abra o Broto com a conta de estudo e tenha os textos fictícios à mão.", `Explore ${title.toLowerCase()} no Broto e registre o estado inicial.`, "Saia e retorne à jornada; compare o observado com a expectativa confirmada ou com a hipótese aberta.", "Documente passos, resultado, impacto e limites da investigação sem dados pessoais."],
        stepObserve: ["", stageCapture.observe, stageReturn.observe, ""],
        prepare: brotoPrepare(brotoTrainingCase.seed.map((item) => ({ label: item.label, text: item.text }))),
        system: brotoSystem,
        acceptance: ["Dados e condições do teste são identificados", "O resultado observado tem passos reproduzíveis", "Hipóteses são separadas de regras confirmadas"],
        plantedBug: "O Broto não tem defeitos plantados para este Lab. Registre a investigação mesmo quando não encontrar uma falha.",
        ...brotoPathLabs[number],
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
      objective: flow ? `Produzir evidência de que ${title.toLowerCase()} atende ao comportamento esperado.` : `Investigar um risco real em ${title.toLowerCase()} e registrar um bug reproduzível ou uma conclusão justificada.`,
      testData: flow
        ? sample || "Usuário: standard_user · senha: qa_lab_secret · CEP: 01310-100 · cupom: QA10."
        : `${sample ? `${sample} ` : ""}Use valor vazio, limite (0 / 999999), caractere especial, recarregamento e navegação por teclado.`,
      expected: flow ? "O fluxo deve informar o resultado, preservar dados quando aplicável e manter foco e feedback acessíveis." : "A aplicação deve bloquear entradas inválidas, explicar a falha e não corromper estado ou cálculos.",
      steps: flow ? [
        `Abra ${title.toLowerCase()} pela superfície indicada e registre a pré-condição.`,
        "Execute o caminho principal usando os dados de teste fornecidos.",
        "Valide o valor exibido, a persistência após recarregar e a mensagem para leitor de tela (aria-live).",
        "Colete resultado obtido e anote se ele corresponde ao oráculo.",
      ] : [
        `Mapeie o comportamento normal de ${title.toLowerCase()} antes de tentar falhar.`,
        "Aplique uma variação inválida e uma variação de limite; repita usando somente teclado.",
        "Recarregue a página no meio do fluxo e compare estado, valor e mensagem.",
        "Registre passos mínimos de reprodução, impacto, severidade e evidência.",
      ],
      acceptance: flow ? ["Passos reproduzíveis", "Resultado obtido comparado ao esperado", "Evidência com valor ou mensagem exibida"] : ["Passos mínimos para reproduzir", "Impacto e severidade justificados", "Resultado esperado e real claramente separados"],
      plantedBug: flow
        ? sample
          ? practiceHint(route, bugId)
          : "Ative /shop/checkout?bug=wrong-total ao testar cálculos relacionados; para os demais, valide também foco e persistência."
        // Modo investigacao nao nomeia o desvio: entregar o sintoma aqui mataria
        // o exercicio, que e justamente descobrir o que esta errado.
        : `Procure inconsistências de validação, estado após recarregar, feedback acessível e fronteiras em ${title.toLowerCase()}.`,
      // Ambientes locais com massa: começar do seed é o que torna o resultado
      // comparável com o de outra pessoa.
      prepare: sample ? { items: [`Abra ${route.split("#")[0]} e use "Restaurar massa" na barra do ambiente para começar do seed.`, "Tenha os dados de teste abaixo à mão."], copy: [{ label: "Dados de teste", text: sample }] } : undefined,
    };
  });
}).concat(mentorshipLabs);

// Cada critério liga-se às partes da entrega mais próximas do tipo de prova:
// execução, comparação entre esperado/observado e conclusão. A cobertura só
// confirma que os campos associados foram preenchidos; não avalia a qualidade
// semântica do texto.
const acceptanceFieldsByMode: Record<SystemChallenge["mode"], readonly (readonly DeliveryFieldId[])[]> = {
  fluxo: [["did"], ["expected", "observed"], ["observed"]],
  investigacao: [["did"], ["conclusion"], ["expected", "observed"]],
};

// Os três Labs grátis têm critérios próprios; associamos os campos ao sentido
// de cada critério em vez de usar a regra geral por tipo de Lab.
const freeLabAcceptanceFields: Readonly<Record<number, readonly (readonly DeliveryFieldId[])[]>> = {
  101: [["did"], ["did", "observed"], ["expected", "conclusion"]],
  103: [["did"], ["did", "observed"], ["expected", "conclusion"]],
  105: [["did"], ["expected", "observed"], ["observed", "conclusion"]],
};

const brotoAcceptanceFields: readonly (readonly DeliveryFieldId[])[] = [
  ["did"],
  ["did", "observed"],
  ["expected", "conclusion"],
];

// Mapeamento editorial dos Labs 131–164. A ordem acompanha os critérios do
// briefing; as associações são estruturais e continuam sujeitas à revisão do
// mentor, não uma avaliação automática do significado da resposta.
const mentorshipAcceptanceFields: Readonly<Record<number, readonly (readonly DeliveryFieldId[])[]>> = {
  131: [["did", "observed"], ["conclusion"], ["conclusion"]],
  132: [["did"], ["did", "expected"], ["conclusion"]],
  133: [["did"], ["expected", "conclusion"], ["conclusion"]],
  134: [["did", "observed"], ["observed"], ["expected", "observed"]],
  135: [["expected", "observed"], ["observed"], ["conclusion"]],
  136: [["did"], ["expected", "observed"], ["did", "observed"]],
  137: [["did", "observed"], ["did"], ["conclusion"]],
  138: [["observed", "conclusion"], ["did"], ["conclusion"]],
  139: [["observed", "conclusion"], ["observed"], ["expected", "observed"]],
  140: [["did"], ["did", "observed"], ["did", "conclusion"]],
  141: [["did"], ["conclusion"], ["conclusion"]],
  142: [["did", "observed"], ["observed"], ["expected", "observed", "conclusion"]],
  143: [["did"], ["expected", "observed"], ["observed"]],
  144: [["did", "observed"], ["expected", "conclusion"], ["observed"]],
  145: [["did", "observed"], ["observed"], ["conclusion"]],
  146: [["did"], ["expected", "observed"], ["observed"]],
  147: [["did", "observed"], ["observed"], ["conclusion"]],
  148: [["conclusion"], ["did"], ["observed", "conclusion"]],
  149: [["expected", "observed"], ["did"], ["conclusion"]],
  150: [["did"], ["observed"], ["conclusion"]],
  151: [["did"], ["did", "expected"], ["conclusion"]],
  152: [["observed"], ["conclusion"], ["conclusion"]],
  153: [["expected", "conclusion"], ["conclusion"], ["conclusion"]],
  154: [["did", "observed"], ["observed"], ["observed"]],
  155: [["conclusion"], ["observed", "conclusion"], ["conclusion"]],
  156: [["observed"], ["conclusion"], ["did", "conclusion"]],
  157: [["did"], ["observed", "conclusion"], ["did", "observed"]],
  158: [["observed"], ["did", "observed"], ["conclusion"]],
  159: [["did"], ["did", "observed"], ["expected", "conclusion"]],
  160: [["did"], ["did", "observed"], ["observed"]],
  161: [["did"], ["observed"], ["did", "observed"]],
  162: [["did"], ["did"], ["observed"]],
  163: [["observed"], ["observed"], ["conclusion"]],
  164: [["expected", "observed"], ["conclusion"], ["did", "conclusion"]],
};

// Número lido de cada Lab, a partir da ordem de apresentação (lab-order.ts).
const positions = labPositions(challenges.map((challenge) => challenge.number));
export const labPositionOf = (number: number) => positions.get(number) ?? null;

// Os textos dos Labs citam outros Labs com {{136}}: é o número de catálogo, e o
// que aparece é o número lido (Lab 38). Assim a citação acompanha a lista.
const withLabRefs = <T,>(value: T): T => {
  if (typeof value === "string") return value.replace(/\{\{(\d+)\}\}/g, (_, number) => String(positions.get(Number(number)) ?? number).padStart(2, "0")) as T;
  if (Array.isArray(value)) return value.map(withLabRefs) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withLabRefs(item)])) as T;
  return value;
};

export const systemChallenges: SystemChallenge[] = challenges.map((challenge) => withLabRefs({
  ...challenge,
  acceptanceFields: challenge.acceptanceFields
    ?? freeLabAcceptanceFields[challenge.number]
    ?? mentorshipAcceptanceFields[challenge.number]
    ?? (challenge.area === "Broto" ? brotoAcceptanceFields : null)
    ?? challenge.acceptance.map((_, index) => acceptanceFieldsByMode[challenge.mode][index] ?? ["did", "expected", "observed", "conclusion"]),
}));
