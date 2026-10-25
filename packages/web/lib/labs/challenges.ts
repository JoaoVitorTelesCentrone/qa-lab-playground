export type PracticeChallenge = {
  id: string;
  title: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  task: string;
  delivery: string;
  href: string;
  lab: string;
};

export type ChallengeTheme = {
  id: string;
  title: string;
  summary: string;
  challenges: readonly PracticeChallenge[];
};

export const challengeThemes: readonly ChallengeTheme[] = [
  {
    id: "fundamentos-risco",
    title: "Fundamentos, produto e risco",
    summary: "Entenda o produto, escolha onde investigar e registre o que aprendeu.",
    challenges: [
      { id: "01", title: "Desenhe a jornada crítica", level: "Iniciante", task: "Explore a captura e a retomada de um pensamento fictício no Broto; identifique ator, entrada, decisão e resultado visível.", delivery: "Um mapa com pelo menos cinco etapas e duas perguntas ainda sem resposta.", href: "/labs/101", lab: "Lab do Broto" },
      { id: "02", title: "Priorize três riscos", level: "Iniciante", task: "Observe como o caso fictício distingue pensamento, problema e objetivo. Compare impacto para a pessoa usuária e chance de ocorrência de três falhas possíveis.", delivery: "Uma lista ordenada com a justificativa da prioridade e o primeiro teste de cada risco.", href: "/labs/103", lab: "Lab do Broto" },
      { id: "03", title: "Investigue com um charter", level: "Intermediário", task: "Defina uma pergunta sobre o fluxo exploratório, limite a sessão a 20 minutos e alterne dados e caminhos.", delivery: "Charter, notas cronológicas, evidências e uma hipótese a investigar depois.", href: "/labs/exploratorio", lab: "Lab exploratório" },
      { id: "04", title: "Separe fato de suspeita", level: "Intermediário", task: "Diante de um resultado inesperado, repita a ação, varie uma condição e registre o que realmente foi observado.", delivery: "Relato com passos, resultado atual, resultado esperado e hipóteses separadas.", href: "/lab/triagem", lab: "Lab de triagem" },
      { id: "05", title: "Escolha o próximo teste", level: "Avançado", task: "Depois de uma sessão, compare cobertura obtida, dúvidas abertas e custo de seguir investigando.", delivery: "Recomendação de uma próxima investigação com risco residual explícito.", href: "/lab/studio", lab: "Test Design Studio" },
    ],
  },
  {
    id: "estrategia-comunicacao",
    title: "Estratégia e comunicação de testes",
    summary: "Transforme regras em cenários úteis e descobertas em decisões.",
    challenges: [
      { id: "06", title: "Refine uma regra ambígua", level: "Iniciante", task: "Escolha uma história com termos vagos e formule perguntas sobre atores, exceções e resultado esperado.", delivery: "História revisada e cinco perguntas que mudam o teste ou a implementação.", href: "/lab/refinamento", lab: "Lab de refinamento" },
      { id: "07", title: "Escreva critérios observáveis", level: "Iniciante", task: "Converta uma regra de produto em critérios que possam ser verificados sem interpretar a intenção de quem escreveu.", delivery: "Três critérios: fluxo principal, validação negativa e limite.", href: "/lab/criterios", lab: "Lab de critérios" },
      { id: "08", title: "Cubra o limite de um registro", level: "Intermediário", task: "Escolha um campo disponível no caso fictício do Broto e investigue limites observáveis, como texto vazio ou muito longo, sem presumir uma regra não publicada.", delivery: "Tabela de dados, expectativa ou hipótese e resultado para cada fronteira.", href: "/labs/103", lab: "Lab do Broto" },
      { id: "09", title: "Conte a regra em BDD", level: "Intermediário", task: "Escolha uma regra confirmada e escreva exemplos em Dado/Quando/Então que distingam sucesso, erro e exceção.", delivery: "Cinco cenários Gherkin com resultados observáveis e sem detalhes de interface desnecessários.", href: "/lab/criterios", lab: "Lab de critérios" },
      { id: "10", title: "Defenda uma decisão de release", level: "Avançado", task: "Classifique achados por impacto, urgência e possibilidade de contorno antes de decidir o que bloqueia a entrega.", delivery: "Parecer curto com decisão, evidências, responsáveis e risco aceito.", href: "/lab/triagem", lab: "Lab de triagem" },
    ],
  },
  {
    id: "automacao-web",
    title: "Automação web com critério",
    summary: "Escolha bons candidatos e construa verificações que sobrevivam a mudanças de interface.",
    challenges: [
      { id: "11", title: "Escolha o que automatizar", level: "Iniciante", task: "Compare três fluxos por frequência, risco e estabilidade; selecione um para um primeiro smoke.", delivery: "Decisão com critério de escolha, camada sugerida e fluxo deixado de fora.", href: "/labs/regressao", lab: "Lab de regressão" },
      { id: "12", title: "Encontre o elemento certo", level: "Intermediário", task: "Examine o login e proponha seletores baseados em papel, nome ou comportamento, sem depender de posição visual.", delivery: "Plano de seletores e assertions para sucesso e falha de autenticação.", href: "/labs/login", lab: "Lab de login" },
      { id: "13", title: "Elimine uma espera frágil", level: "Intermediário", task: "Reproduza uma mudança assíncrona e substitua a ideia de tempo fixo por uma condição observável.", delivery: "Cenário com condição de espera, limite de tempo e diagnóstico em caso de falha.", href: "/labs/waits", lab: "Lab de esperas" },
      { id: "14", title: "Faça um smoke de negócio", level: "Intermediário", task: "Percorra a captura e a retomada do pensamento fictício no Broto e valide o resultado que a pessoa usuária vê.", delivery: "Roteiro automatizável com pré-condição, ação, verificação e limpeza dos dados de estudo.", href: "/labs/101", lab: "Lab do Broto" },
      { id: "15", title: "Diagnostique um teste instável", level: "Avançado", task: "Analise uma falha intermitente e distinga problema de sincronização, dado compartilhado e defeito real.", delivery: "Hipóteses, evidências que confirmariam cada uma e correção mais segura.", href: "/lab/logs", lab: "Lab de logs" },
    ],
  },
  {
    id: "api-arquitetura",
    title: "APIs e arquitetura de testes",
    summary: "Verifique contratos, dados e permissões sem perder a capacidade de diagnosticar falhas.",
    challenges: [
      { id: "16", title: "Crie e consulte um recurso", level: "Iniciante", task: "Execute criação e leitura na API de treino e compare identificador, campos retornados e estado persistido.", delivery: "Requests reproduzíveis com status, corpo e regra de negócio verificados.", href: "/labs/api-crud", lab: "Lab de API CRUD" },
      { id: "17", title: "Teste entrada inválida", level: "Intermediário", task: "Envie campos ausentes, valores fora do intervalo e formato incorreto; observe se o erro orienta a correção.", delivery: "Matriz de casos negativos com resposta esperada e observada.", href: "/labs/api-crud", lab: "Lab de API CRUD" },
      { id: "18", title: "Proteja a propriedade dos dados", level: "Avançado", task: "Modele dois usuários e verifique se um consegue ler ou alterar o recurso do outro.", delivery: "Cenários de autorização com papéis, recurso, resposta esperada e risco coberto.", href: "/lab/seguranca", lab: "Lab de segurança" },
      { id: "19", title: "Isole sua massa de teste", level: "Intermediário", task: "Planeje criação, uso e remoção de dados para executar o mesmo teste duas vezes sem depender de ordem.", delivery: "Fluxo de setup e limpeza com identificadores únicos e tratamento de falha.", href: "/labs/api-crud", lab: "Lab de API CRUD" },
      { id: "20", title: "Revise o oráculo da API", level: "Avançado", task: "Compare uma resposta 2xx com a regra de negócio e encontre um caso em que o status sozinho daria falso positivo.", delivery: "Assertions de conteúdo e estado, com a limitação de cada verificação.", href: "/labs/api-crud", lab: "Lab de API CRUD" },
    ],
  },
  {
    id: "entrega-operacao",
    title: "CI/CD, segurança e operação",
    summary: "Use sinais do pipeline e da aplicação para proteger uma entrega.",
    challenges: [
      { id: "21", title: "Monte um pipeline mínimo", level: "Iniciante", task: "Organize lint, testes rápidos, build e smoke de acordo com custo e velocidade de retorno.", delivery: "Diagrama das etapas, gatilhos e condição que interrompe o deploy.", href: "/trilhas/cicd", lab: "Trilha de CI/CD" },
      { id: "22", title: "Defina um gate por risco", level: "Intermediário", task: "Escolha uma mudança crítica e decida qual evidência o pipeline deve exigir antes da publicação.", delivery: "Gate com motivo, sinal de aprovação, falha e responsável por exceção.", href: "/lab/cicd", lab: "Lab de CI/CD" },
      { id: "23", title: "Investigue a falha pelo log", level: "Intermediário", task: "Correlacione evento, horário e efeito percebido; descarte uma hipótese com base no registro disponível.", delivery: "Linha do tempo curta, causa provável, incerteza e próximo sinal necessário.", href: "/lab/logs", lab: "Lab de logs" },
      { id: "24", title: "Revise uma exposição de segredo", level: "Avançado", task: "Identifique onde uma credencial poderia aparecer em código, pipeline ou log e proponha contenção.", delivery: "Plano com rotação, redução de acesso e verificação de que o segredo não volta a vazar.", href: "/lab/seguranca", lab: "Lab de segurança" },
      { id: "25", title: "Decida como recuperar", level: "Avançado", task: "Após uma falha em produção simulada, compare corrigir adiante, desligar a função e reverter.", delivery: "Decisão de recuperação com gatilho, risco e mensagem para o time.", href: "/lab/cicd", lab: "Lab de CI/CD" },
    ],
  },
  {
    id: "qualidade-carreira",
    title: "Qualidade avançada e carreira",
    summary: "Amplie a avaliação da experiência e transforme trabalho em evidência profissional.",
    challenges: [
      { id: "26", title: "Navegue só com teclado", level: "Iniciante", task: "Conclua uma tarefa sem mouse e observe foco, ordem, rótulos e retorno de erro.", delivery: "Registro dos bloqueios com passo, impacto e sugestão de correção.", href: "/labs/acessibilidade", lab: "Lab de acessibilidade" },
      { id: "27", title: "Defina uma meta de desempenho", level: "Intermediário", task: "Escolha uma jornada, o público e uma métrica; explique qual degradação mudaria a decisão de release.", delivery: "Hipótese de carga, limiar, método de medição e limite do experimento.", href: "/mentoria/performance", lab: "Prática de performance" },
      { id: "28", title: "Comunique risco a outra pessoa", level: "Intermediário", task: "Adapte um achado técnico para produto e engenharia sem perder impacto, evidência ou incerteza.", delivery: "Dois resumos curtos com recomendação e próxima ação clara.", href: "/lab/pessoas", lab: "Lab de pessoas" },
      { id: "29", title: "Una sinais contraditórios", level: "Avançado", task: "Compare testes funcionais aprovados com um achado de acessibilidade ou desempenho que ainda afeta a jornada.", delivery: "Parecer de release que explique o conflito e a decisão possível.", href: "/labs/acessibilidade", lab: "Lab de acessibilidade" },
      { id: "30", title: "Monte um case de QA", level: "Avançado", task: "Escolha um desafio concluído e conte contexto, risco, método, evidência, decisão e aprendizado sem expor dados sensíveis.", delivery: "Case de uma página com artefatos verificáveis e sua contribuição explícita.", href: "/perfil", lab: "Meu perfil" },
    ],
  },
];
