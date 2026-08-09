export type LabTrack =
  | "UI Automation"
  | "API e Contrato"
  | "Exploratorio"
  | "Produto e Estrategia"
  | "CI e Manutencao"
  | "Nao Funcionais";

export type LabDifficulty = "iniciante" | "intermediario" | "avancado";
export type LabStatus = "pronto" | "parcial" | "planejado";

export type Lab = {
  number: number;
  slug: string;
  title: string;
  track: LabTrack;
  difficulty: LabDifficulty;
  minutes: 15 | 30 | 60 | 90;
  objective: string;
  requiredFeature: string;
  delivery: string;
  acceptanceCriteria: string[];
  tags: string[];
  route: string;
  status: LabStatus;
  postPrompt: string;
};

export const tracks: LabTrack[] = [
  "UI Automation",
  "API e Contrato",
  "Exploratorio",
  "Produto e Estrategia",
  "CI e Manutencao",
  "Nao Funcionais",
];

const uiLabs = [
  ["Login quebravel", "Validar login feliz, obrigatorios, credencial invalida, bloqueio e sessao expirada", "Tela de login com mensagens testaveis"],
  ["Formulario e criterios", "Cobrir inputs, validacoes e mensagens com seletores saudaveis", "Formulario com dados bons e ruins"],
  ["Locators resilientes", "Comparar seletor ruim com data-testid e role acessivel", "Tela com IDs dinamicos e classes instaveis"],
  ["Carrinho resiliente", "Automatizar add, quantidade e remocao sem depender de ordem visual", "Loja QA Lab Shop"],
  ["Waits inteligentes", "Esperar estado real de UI/API sem sleep fixo", "Tela de delays, skeleton, overlay e progress bar"],
  ["Elementos dinamicos", "Testar conteudo que muda entre renders", "Cartoes com IDs e textos variaveis"],
  ["Checklist de 5 pontos", "Montar smoke curto para fluxo critico", "Checklist executavel"],
  ["Code review de teste", "Identificar fragilidade em testes automatizados", "Comparacao antes/depois"],
  ["Tabela dinamica", "Testar sorting, filtro e paginacao", "Tabela interativa"],
  ["Upload e download", "Validar arquivo enviado e baixado", "Area de arquivos"],
  ["Smoke vs sanity", "Separar testes por objetivo", "Suite curta categorizada"],
  ["Cobertura util", "Relacionar cobertura a risco", "Mapa de cobertura"],
  ["Pergunta antes de assumir", "Transformar incerteza em criterio testavel", "Perguntas de refinamento"],
  ["Automacao rapida sustentavel", "Refatorar teste fragil", "Versao sustentavel"],
  ["Manual estrategico", "Definir quando automacao nao paga", "Decisao justificada"],
  ["IA em testes", "Avaliar sugestoes de IA com criterio", "Filtro de qualidade"],
  ["Definition of Done", "Comparar DoD escrito e praticado", "Checklist de pronto"],
  ["Bug em producao", "Distinguir falha de QA e processo", "Analise de causa"],
  ["Automacao doente", "Diagnosticar sinais de suite ruim", "Plano de tratamento"],
  ["Bug report ignorado", "Reescrever bug para destravar decisao", "Report persuasivo"],
];

const apiLabs = [
  ["CRUD completo de API", "Criar, ler, atualizar, atualizar parcialmente e deletar reservas", "API REST de reservas"],
  ["Status codes", "Validar 200, 201, 400, 401, 404, 405 e 409", "Matriz de status"],
  ["Payload minimo", "Descobrir campos obrigatorios por contrato", "Casos positivos e negativos"],
  ["Contrato JSON", "Validar nomes, tipos e campos obrigatorios", "Contrato documentado"],
  ["Auth por token", "Proteger alteracoes de reserva", "Cenarios 401/403"],
  ["Idempotencia", "Evitar duplicidade em retry", "Teste com chave idempotente"],
  ["Paginacao", "Validar page, perPage e total", "Suite de pagina"],
  ["Ordenacao", "Validar ordem por nome, data e preco", "Assertions de ordenacao"],
  ["Filtros combinados", "Combinar filtros sem perder dados", "Tabela de combinacoes"],
  ["Dados dinamicos", "Resetar seed e isolar massa", "Plano de dados"],
  ["Rate limit", "Observar limites e resposta 429 simulada", "Relatorio de limite"],
  ["Retry", "Validar retry sem mascarar bug", "Politica de retry"],
  ["Timeout", "Definir tempo limite coerente", "Teste de timeout"],
  ["Contrato quebrado", "Detectar campo removido ou renomeado", "Breaking change report"],
  ["Mock server", "Simular terceiro feliz e erro", "Mock documentado"],
  ["Fixture", "Organizar seed, factory e massa estatica", "Estrutura de fixtures"],
  ["Ambientes", "Separar local, staging e prod readonly", "Config por variavel"],
  ["Postman para CI", "Executar collection no pipeline", "Script de CI"],
  ["API primeiro bug", "Reportar bug visivel primeiro na API", "Request/response/impacto"],
  ["Contrato entre times", "Escrever acordo de endpoint", "Contrato com exemplos"],
];

const exploratoryLabs = [
  ["Charter exploratorio", "Executar sessao com timer, notas e bugs", "Relatorio Markdown"],
  ["Heuristica CRUD", "Mapear riscos de criar, ler, atualizar e deletar", "Mapa de riscos"],
  ["Persona extrema", "Testar por comportamento de usuario", "Achados por persona"],
  ["Interrupcoes", "Observar refresh, voltar, fechar aba e rede lenta", "Comportamento observado"],
  ["Dados ruins", "Forcar limites, caracteres especiais e espacos", "Validacoes ausentes"],
  ["Sessao expirada", "Expirar token no meio do fluxo", "Bug ou evidencia correta"],
  ["Concorrencia manual", "Alterar estado em duas abas", "Analise de conflito"],
  ["Permissoes", "Validar guest, customer, admin e suporte", "Matriz de autorizacao"],
  ["Favoritos do navegador", "Abrir deep links protegidos", "Resultado e risco"],
  ["Mensagens confusas", "Comparar mensagens boas e ruins", "Antes/depois"],
  ["Risco por tela", "Priorizar impacto, frequencia e historico", "Top 5 riscos"],
  ["Teste baseado em estado", "Validar transicoes de pedido ou reserva", "Diagrama e cenarios"],
  ["Caminho alternativo", "Comprar via catalogo, busca, detalhe e recomendados", "Comparacao"],
  ["Teste sem roteiro", "Explorar livremente com notas organizadas", "Notas de sessao"],
  ["Bug advocacy", "Argumentar impacto de negocio", "Bug report persuasivo"],
];

const productLabs = [
  ["Definicao de pronto", "Reescrever criterios incompletos", "Criterios testaveis"],
  ["Refinamento QA", "Perguntar por risco em requisitos vagos", "Perguntas por risco"],
  ["Exemplo concreto", "Separar exemplos validos e invalidos", "Tabela de exemplos"],
  ["Bug que nao e bug", "Classificar bug, melhoria, duvida ou esperado", "Justificativa"],
  ["Impacto no usuario", "Traduzir bug tecnico em impacto", "Reports reescritos"],
  ["Release notes testaveis", "Transformar release notes em checklist", "Checklist priorizado"],
  ["Metricas uteis", "Escolher metricas de qualidade acionaveis", "Definicao e uso"],
  ["Smoke test", "Montar smoke de 10 minutos", "Lista priorizada"],
  ["Regressao enxuta", "Cortar suite por risco e historico", "Criterios de remocao"],
  ["Matriz de risco", "Pontuar impacto, probabilidade e historico", "Mapa de decisao"],
  ["Bug bash", "Planejar missao e quadro de coleta", "Roteiro e quadro"],
  ["Qualidade em discovery", "Antecipar riscos antes do codigo", "Checklist de refinamento"],
  ["Teste de aceite", "Separar aceite, regressao e exploratorio", "Exemplos por tipo"],
  ["Requisito contraditorio", "Encontrar conflito em regras de negocio", "Perguntas para destravar"],
  ["Decisao de nao testar", "Registrar risco aceito e motivo", "Registro de risco"],
];

const ciLabs = [
  ["Pipeline minimo", "Rodar API e E2E em GitHub Actions", "YAML simples"],
  ["Falha legivel", "Melhorar mensagens de teste", "Output antes/depois"],
  ["Teste flake", "Reproduzir falha intermitente controlada", "Hipotese e correcao"],
  ["Paralelismo", "Isolar dados por worker", "Estrategia de isolamento"],
  ["Tags", "Classificar smoke, regressao, contrato e a11y", "Convencao de tags"],
  ["Relatorio HTML", "Gerar relatorio e evidencias", "Artefato"],
  ["Screenshot na falha", "Configurar screenshot/trace em falha", "Config de framework"],
  ["Trace", "Usar trace para explicar falha", "Passo de origem"],
  ["Dependencia externa", "Decidir mock, contrato ou real", "Decisao tecnica"],
  ["Versionamento de dados", "Versionar fixtures e migrar schema", "Regra de manutencao"],
  ["Secrets", "Evitar segredo commitado", "Variavel segura"],
  ["Pull request testavel", "Criar template de PR com riscos", "Template curto"],
  ["Cobertura honesta", "Cobrir risco, nao quantidade", "Mapa de cobertura"],
  ["Teste lento", "Medir tempos e otimizar", "Top 3 melhorias"],
  ["Ambiente quebrado", "Distinguir produto, teste e ambiente", "Arvore de decisao"],
];

const nonFunctionalLabs = [
  ["Performance basica", "Medir assets pesados, request lento e Web Vitals", "Mini relatorio"],
  ["Carga em API", "Observar limite em endpoint de reserva", "Limite observado"],
  ["Teste de pico", "Comparar carga constante e pico", "Tabela de resposta"],
  ["Acessibilidade por teclado", "Concluir login, carrinho e checkout sem mouse", "Bugs de foco"],
  ["Contraste", "Comparar tema bom e modo ruim", "Lista com severidade"],
  ["Leitores de tela", "Validar labels, aria-live e nomes", "Checklist de labels"],
  ["Responsividade", "Testar mobile, tablet e desktop", "Bugs por viewport"],
  ["Toque mobile", "Validar alvos, teclado e scroll", "Checklist mobile"],
  ["Rede lenta", "Simular timeout, retry e fallback", "Recomendacoes de UX"],
  ["Offline parcial", "Perder rede durante envio", "Esperado versus atual"],
  ["Seguranca no formulario", "Sanitizar HTML inseguro", "Evidencia sanitizada"],
  ["Autorizacao quebrada", "Detectar IDOR simulado", "Risco e recomendacao"],
  ["Dados sensiveis", "Mascarar token, senha e PII", "Checklist de vazamento"],
  ["Headers de seguranca", "Inspecionar headers e riscos", "Tabela header/risco"],
  ["Lab final QA Lab", "Integrar plano, automacoes, bugs e post", "Mini portfolio"],
];

const groups: Array<[LabTrack, typeof uiLabs, number]> = [
  ["UI Automation", uiLabs, 1],
  ["API e Contrato", apiLabs, 21],
  ["Exploratorio", exploratoryLabs, 41],
  ["Produto e Estrategia", productLabs, 56],
  ["CI e Manutencao", ciLabs, 71],
  ["Nao Funcionais", nonFunctionalLabs, 86],
];

const readyRoutes: Record<number, string> = {
  1: "/labs/login",
  5: "/labs/waits",
  21: "/labs/api-crud",
  41: "/labs/exploratorio",
  89: "/labs/acessibilidade",
};

export const labs: Lab[] = groups.flatMap(([track, items, start]) =>
  items.map(([title, objective, requiredFeature], index) => {
    const number = start + index;
    const status: LabStatus = readyRoutes[number] ? "pronto" : number <= start + 4 ? "parcial" : "planejado";
    const route = readyRoutes[number] ?? `/labs/${number}`;
    const tags = [track.split(" ")[0].toLowerCase(), title.toLowerCase().split(" ")[0], status];
    const delivery = items[index][2];
    return {
      number,
      slug: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-"),
      title,
      track,
      difficulty: number % 3 === 0 ? "avancado" : number % 2 === 0 ? "intermediario" : "iniciante",
      minutes: number % 5 === 0 ? 60 : number % 2 === 0 ? 30 : 15,
      objective,
      requiredFeature,
      delivery,
      acceptanceCriteria: [
        "Executar o fluxo principal sem depender de servicos externos.",
        "Registrar evidencia clara do comportamento observado.",
        "Separar resultado esperado, resultado atual e impacto.",
      ],
      tags,
      route,
      status,
      postPrompt: `Gancho: voce conseguiria testar ${title} em menos de ${number % 5 === 0 ? 60 : number % 2 === 0 ? 30 : 15} minutos?\n\nDesafio: ${objective}.\nEntrega: ${delivery}.\nCriterios: evidencias, assertions e risco documentado.\nPergunta: que caso voce adicionaria?\n\n#QA #QualityAssurance #TestesDeSoftware #AutomacaoDeTestes #Playwright #APITesting #Acessibilidade #QALab`,
    };
  }),
);

export const featuredLabNumbers = [1, 5, 21, 41, 89];

export const bugCatalog = [
  { id: "locked-message", area: "Login", severity: "media", impact: "Usuario bloqueado recebe mensagem incorreta.", steps: "Acesse /labs/login?bug=locked-message e tente locked_out_user." },
  { id: "infinite-loading", area: "Waits", severity: "alta", impact: "Loading nunca termina e mascara falha de ambiente.", steps: "Acesse /labs/waits?bug=infinite-loading." },
  { id: "wrong-total", area: "Checkout", severity: "alta", impact: "Total cobrado difere do resumo esperado.", steps: "Acesse /shop/checkout?bug=wrong-total." },
  { id: "delete-without-auth", area: "API", severity: "critica", impact: "Reserva pode ser excluida sem token.", steps: "Envie DELETE /api/bookings/1?bug=delete-without-auth sem Authorization." },
  { id: "missing-focus", area: "Acessibilidade", severity: "alta", impact: "Usuario de teclado perde contexto visual.", steps: "Acesse /labs/acessibilidade?bug=missing-focus e navegue com Tab." },
];

export function findLabByNumber(number: number) {
  return labs.find((lab) => lab.number === number);
}
