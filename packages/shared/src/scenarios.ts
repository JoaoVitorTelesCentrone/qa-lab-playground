import type { Scenario, EndpointInfo } from "./types";

export const scenarios: Scenario[] = [
  {
    id: "validar-listagem-usuarios",
    titulo: "Valide a listagem de usuarios",
    descricao:
      "Verifique se a API de usuarios retorna dados consistentes e corretos.",
    descricaoCompleta:
      "A API de listagem de usuarios deveria retornar uma lista paginada com dados consistentes. Sua missao e verificar se os campos obrigatorios estao presentes, se a paginacao funciona corretamente e se os dados fazem sentido. Ative o modo caos e veja o que acontece.",
    modulo: "api",
    dificuldade: "iniciante",
    endpointsRelacionados: ["GET /api/users", "GET /api/users/:id"],
    objetivos: [
      {
        id: "obj-1-1",
        descricao: "Verifique se todos os usuarios tem campos obrigatorios (id, nome, email)",
        dica: "Faca um GET /api/users e inspecione cada objeto no array",
        respostaEsperada: "Todos os usuarios devem ter id, nome e email preenchidos",
      },
      {
        id: "obj-1-2",
        descricao: "Teste a paginacao com page=1&perPage=5 e page=2&perPage=5",
        dica: "Compare os resultados das duas paginas - os itens se repetem?",
        respostaEsperada: "As paginas devem ter itens diferentes e o meta.total deve ser consistente",
      },
      {
        id: "obj-1-3",
        descricao: "Ative o modo caos e identifique o comportamento anomalo",
        dica: "Com caos ativo, faca varias requests e observe os status codes",
        respostaEsperada: "O endpoint retorna 500 aleatoriamente quando o caos esta ativo",
      },
    ],
  },
  {
    id: "encontrar-bugs-formulario",
    titulo: "Encontre os bugs no formulario",
    descricao:
      "Um formulario de cadastro tem 5 bugs escondidos. Encontre todos.",
    descricaoCompleta:
      "O formulario de cadastro foi implementado por um dev apressado e tem 5 bugs. Alguns sao obvios, outros sao sutis. Teste cada campo, tente submeter dados invalidos, cole texto nos campos e preste atencao nas mensagens. Marque cada bug que encontrar.",
    modulo: "form",
    dificuldade: "iniciante",
    objetivos: [
      {
        id: "obj-2-1",
        descricao: "Encontre o bug na validacao de email",
        dica: "Tente emails como 'user@' ou 'user@.com' - eles passam?",
        respostaEsperada: "A regex de email aceita formatos invalidos como user@ e user@.com",
      },
      {
        id: "obj-2-2",
        descricao: "Encontre o campo obrigatorio que nao e obrigatorio",
        dica: "Deixe cada campo vazio e tente submeter",
        respostaEsperada: "O campo 'nome' tem asterisco mas nao bloqueia submit quando vazio",
      },
      {
        id: "obj-2-3",
        descricao: "Encontre o bug na mascara de telefone",
        dica: "Tente colar um numero de telefone ao inves de digitar",
        respostaEsperada: "A mascara quebra quando se usa Ctrl+V para colar texto",
      },
      {
        id: "obj-2-4",
        descricao: "Encontre o bug no botao de submit",
        dica: "Preencha dados invalidos e observe o botao",
        respostaEsperada: "O botao submit fica habilitado mesmo com erros visiveis no formulario",
      },
      {
        id: "obj-2-5",
        descricao: "Encontre o bug na mensagem de sucesso",
        dica: "Preencha tudo corretamente e observe a mensagem de confirmacao",
        respostaEsperada: "A mensagem de sucesso mostra um email diferente do que foi digitado",
      },
    ],
  },
  {
    id: "testar-busca-produtos",
    titulo: "Teste a busca de produtos com casos extremos",
    descricao:
      "Explore os limites da API de produtos com inputs inesperados.",
    descricaoCompleta:
      "A API de produtos tem uma busca que deveria funcionar bem, mas nao foi testada com edge cases. Sua missao e enviar requests com dados extremos e inesperados: strings vazias, caracteres especiais, numeros negativos, valores muito grandes. Documente cada comportamento estranho.",
    modulo: "api",
    dificuldade: "iniciante",
    endpointsRelacionados: ["GET /api/products", "GET /api/products/:id"],
    objetivos: [
      {
        id: "obj-3-1",
        descricao: "Teste GET /api/products com page=0 e page=-1",
        dica: "O que acontece com valores invalidos de paginacao?",
        respostaEsperada: "A API deveria retornar erro 400 mas pode aceitar valores invalidos",
      },
      {
        id: "obj-3-2",
        descricao: "Teste GET /api/products/:id com id inexistente e id com letras",
        dica: "Tente /api/products/99999 e /api/products/abc",
        respostaEsperada: "O endpoint retorna 200 com body de erro ao inves de 404",
      },
      {
        id: "obj-3-3",
        descricao: "Ative o caos e verifique se a paginacao esta consistente",
        dica: "Navegue pagina por pagina e conte os itens totais",
        respostaEsperada: "Com caos ativo, a paginacao pula itens entre paginas",
      },
    ],
  },
  {
    id: "resposta-inconsistente",
    titulo: "Identifique a resposta inconsistente",
    descricao:
      "Um endpoint retorna dados em formatos diferentes a cada chamada.",
    descricaoCompleta:
      "O endpoint de detalhes do pedido tem um problema serio: ele retorna os dados em formatos diferentes dependendo de quando voce chama. Faca varias requisicoes para o mesmo pedido e compare as respostas. Documente todas as variacoes que encontrar.",
    modulo: "api",
    dificuldade: "iniciante",
    endpointsRelacionados: ["GET /api/orders/:id"],
    objetivos: [
      {
        id: "obj-4-1",
        descricao: "Faca 5 requests para GET /api/orders/1 e compare as respostas",
        dica: "Preste atencao nos nomes dos campos e na estrutura do JSON",
        respostaEsperada: "O formato muda: as vezes usa camelCase, as vezes snake_case, as vezes muda a estrutura",
      },
      {
        id: "obj-4-2",
        descricao: "Identifique quantos formatos diferentes existem",
        dica: "Faca pelo menos 10 requests para ver todos os formatos",
        respostaEsperada: "Existem 3 formatos diferentes que alternam aleatoriamente",
      },
      {
        id: "obj-4-3",
        descricao: "Verifique se os dados sao os mesmos apesar do formato diferente",
        dica: "Compare os valores (nao as chaves) entre os formatos",
        respostaEsperada: "Os dados subjacentes sao os mesmos, so a estrutura/nomenclatura muda",
      },
    ],
  },
  {
    id: "validar-erros-pedido",
    titulo: "Valide o tratamento de erros no pedido",
    descricao:
      "Teste como a API de pedidos lida com dados invalidos e falhas.",
    descricaoCompleta:
      "A API de criacao de pedidos deveria validar os dados recebidos e retornar erros claros quando algo esta errado. Sua missao e enviar pedidos com dados invalidos, faltantes e mal formatados, e verificar se as respostas de erro sao uteis e consistentes.",
    modulo: "api",
    dificuldade: "iniciante",
    endpointsRelacionados: ["POST /api/orders", "GET /api/orders/:id"],
    objetivos: [
      {
        id: "obj-5-1",
        descricao: "Envie um POST /api/orders com body vazio",
        dica: "O que a API retorna? O status code e apropriado?",
        respostaEsperada: "A API deve retornar 400 com mensagem descritiva sobre campos faltantes",
      },
      {
        id: "obj-5-2",
        descricao: "Envie um pedido com produtoId inexistente",
        dica: "Use um produtoId como 99999 e veja se a API valida",
        respostaEsperada: "A API pode aceitar o pedido sem validar se o produto existe",
      },
      {
        id: "obj-5-3",
        descricao: "Ative o caos e tente criar um pedido valido",
        dica: "Com caos ativo, o endpoint tem timeout intermitente",
        respostaEsperada: "O endpoint da timeout aleatoriamente, simulando instabilidade do servico",
      },
    ],
  },
];

export const endpointCatalog: EndpointInfo[] = [
  {
    method: "GET",
    path: "/api/users",
    descricao: "Lista todos os usuarios com paginacao",
    bugDescricao: "Retorna 500 aleatorio e delay configuravel",
  },
  {
    method: "GET",
    path: "/api/users/:id",
    descricao: "Retorna um usuario por ID",
    bugDescricao: "As vezes retorna o usuario errado",
  },
  {
    method: "POST",
    path: "/api/users",
    descricao: "Cria um novo usuario",
    bugDescricao: "Validacao silenciosamente descarta campos",
    bodyExemplo: {
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "(11) 99999-0000",
      cargo: "QA Engineer",
    },
  },
  {
    method: "GET",
    path: "/api/products",
    descricao: "Lista produtos com paginacao e busca",
    bugDescricao: "Paginacao pula itens entre paginas",
  },
  {
    method: "GET",
    path: "/api/products/:id",
    descricao: "Retorna um produto por ID",
    bugDescricao: "Retorna status 200 mas com body de erro",
  },
  {
    method: "POST",
    path: "/api/orders",
    descricao: "Cria um novo pedido",
    bugDescricao: "Timeout intermitente ao processar",
    bodyExemplo: {
      usuarioId: 1,
      produtos: [{ produtoId: 1, quantidade: 2 }],
    },
  },
  {
    method: "GET",
    path: "/api/orders/:id",
    descricao: "Retorna detalhes de um pedido",
    bugDescricao: "Formato da resposta muda a cada request",
  },
  {
    method: "PUT",
    path: "/api/users/:id",
    descricao: "Atualiza dados de um usuario",
    bugDescricao: "Retorna sucesso mas nao atualiza os dados",
    bodyExemplo: {
      nome: "Nome Atualizado",
      email: "novo@email.com",
    },
  },
  {
    method: "DELETE",
    path: "/api/products/:id",
    descricao: "Remove um produto",
    bugDescricao: "Retorna 204 mas o item continua existindo",
  },
  {
    method: "GET",
    path: "/api/health",
    descricao: "Verifica status dos servicos",
    bugDescricao: "Mente sobre o status real dos servicos",
  },
];
