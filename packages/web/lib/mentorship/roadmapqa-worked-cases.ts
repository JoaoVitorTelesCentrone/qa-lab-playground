/** Casos resolvidos para aplicar os tópicos incorporados do RoadMapQA.docx. */
export type RoadmapQAWorkedCase = {
  title: string;
  context: string;
  procedure: readonly string[];
  deliverable: string;
  interpretation: string;
};

export const roadmapQAWorkedCases: Record<number, RoadmapQAWorkedCase> = {
  1: {
    title: "Medir qualidade sem premiar a métrica errada",
    context: "Em duas semanas, o time entregou 18 histórias e registrou 12 bugs. Na quinzena seguinte, entregou 12 histórias e registrou 20 bugs. Alguém conclui que a qualidade piorou porque o número de bugs subiu.",
    procedure: [
      "Separe os 20 relatos por gravidade, origem, data de introdução e momento de descoberta. Dez podem ter vindo de uma sessão exploratória sobre código antigo; isso muda a interpretação.",
      "Calcule o tempo entre abertura e primeira revisão dos PRs das duas quinzenas. Distinga tempo em fila de tempo efetivo de revisão para encontrar eventual gargalo.",
      "Compare escapes para produção e reincidência do mesmo tipo de defeito. Histórias concluídas e bugs encontrados são sinais, mas não representam sozinhos valor entregue ou qualidade percebida.",
      "Escolha uma ação verificável: revisar exemplos de regras financeiras antes de codificar e observar, no próximo ciclo, escapes dessa categoria e tempo de espera por revisão.",
    ],
    deliverable: "Uma tabela curta com período, origem e gravidade dos defeitos, tempo de espera do PR, escapes e uma hipótese de melhoria com responsável e data de revisão.",
    interpretation: "O aumento de bugs pode significar melhor detecção, produto mais defeituoso ou ambos. Sem segmentar origem e impacto, a conclusão é fraca. A métrica deve responder a uma decisão concreta.",
  },
  2: {
    title: "Encontrar o gargalo sem culpar a etapa errada",
    context: "Uma equipe trabalha em Kanban. Itens levam em média oito dias do início à entrega, embora codificação e teste ocupem apenas três dias. O QA recebe vários itens juntos no fim da semana.",
    procedure: [
      "Desenhe as colunas pedido, pronto, em desenvolvimento, revisão, teste e entregue. Para cinco histórias recentes, anote horário de entrada e saída de cada coluna.",
      "Calcule tempo em espera e em execução por etapa. Se revisão acumula quatro dias, aumentar a velocidade dos testes não removerá o gargalo principal.",
      "Observe trabalho em andamento e tamanho das histórias. Experimente limitar o número de itens em revisão e pedir revisão de mudanças menores, mantendo o mesmo critério de qualidade.",
      "No próximo ciclo, compare tempo até primeira revisão, idade dos itens bloqueados e defeitos após entrega. Verifique também se a melhoria não deslocou a fila para teste.",
    ],
    deliverable: "Mapa do fluxo com tempos por etapa, hipótese de gargalo, experimento de uma semana e sinais que mostrarão se ele funcionou.",
    interpretation: "Cerimônias de Scrum ou um quadro Kanban não corrigem filas por si. O objetivo é obter feedback mais cedo sem ocultar trabalho ou dispensar verificação necessária.",
  },
  3: {
    title: "Da regra ao cenário, ao teste e à validação",
    context: "A regra diz: despesas acima de R$ 100 exigem aprovação de uma pessoa gestora. Não informa o que acontece exatamente em R$ 100 nem se o autor pode aprovar a própria despesa.",
    procedure: [
      "Marque R$ 100 e a autoaprovação como dúvidas de requisito; não invente o esperado. Confirme a regra com produto usando exemplos de R$ 99, R$ 100 e R$ 101.",
      "Escreva um cenário Gherkin para a regra confirmada: Dado uma despesa de R$ 101 criada por colaborador, Quando o colaborador tenta aprovar, Então a operação é recusada e o estado permanece pendente.",
      "Escreva um caso passo a passo com perfil, dados, pré-condição, ação, resposta e consulta posterior. O Gherkin comunica comportamento; o caso detalhado torna a execução reproduzível.",
      "Se a regra for implementada agora, proponha um teste de unidade que falha antes do código e passe depois, seguindo o ciclo de TDD. Em BDD, revise os exemplos com produto, desenvolvimento e QA antes de automatizá-los.",
    ],
    deliverable: "Duas perguntas respondidas pelo negócio, uma regra com exemplos, um cenário Gherkin e um caso executável com estado persistido esperado.",
    interpretation: "Verificar que o código segue a regra acordada é diferente de validar se a regra atende à necessidade de aprovação da empresa. Ambas as perguntas precisam de evidência.",
  },
  4: {
    title: "Relatar uma correção com alcance honesto",
    context: "O relatório do ExpenseFlow soma R$ 140 em despesas aprovadas, mas a lista mostra R$ 80 aprovados e R$ 60 pendentes. A equipe corrige um filtro de status.",
    procedure: [
      "Registre versão, perfil, período, valores e status. Faça captura da lista e do relatório, preservando os identificadores necessários e removendo dados pessoais.",
      "Escreva resultado atual e esperado com base na regra confirmada. Classifique impacto financeiro e prioridade de correção separadamente.",
      "Após a correção, repita o caso original e consulte o estado após recarga. Teste relatório em outro período e uma despesa rejeitada para procurar regressão no mesmo filtro.",
      "Execute um smoke de entrada, criação e consulta. No resumo de release, separe o defeito corrigido, a cobertura executada, o resultado e os tipos de despesa ainda não examinados.",
    ],
    deliverable: "Bug reproduzível, evidência editada, reteste, duas verificações de regressão e recomendação de release em até cinco linhas.",
    interpretation: "Um vídeo como ScreenToGif pode demonstrar sequência, mas não substitui dados, esperado e condições de reprodução. Um reteste verde não prova que todos os relatórios estão corretos.",
  },
  5: {
    title: "Escolher a camada certa para um limite financeiro",
    context: "O sistema deve rejeitar despesas com valor zero, aceitar R$ 0,01 e mostrar o novo total somente após persistência. O time propõe testar tudo apenas por cliques no navegador.",
    procedure: [
      "Na unidade, use Arrange para preparar a regra de valor, Act para validar 0 e 0,01, e Assert para conferir rejeição e aceitação. Cubra o limite com feedback rápido.",
      "Na integração ou API, envie a despesa válida e leia o recurso criado. Verifique formato, status e valor persistido; confirme que zero não gerou registro.",
      "No ponta a ponta, percorra uma jornada essencial para verificar formulário, mensagem e total visível. Mantenha poucos casos assim porque cada um depende de navegador, rede e dados.",
      "Use um smoke para decidir se a aplicação está testável após deploy. Em uma investigação caixa-branca, verifique se um ramo de erro de persistência recebeu tratamento; em caixa-preta, confirme o efeito observável ao usuário.",
    ],
    deliverable: "Matriz com risco, caso, camada, dado, assertion de negócio e motivo para manter apenas uma jornada completa no navegador.",
    interpretation: "A pirâmide orienta custo e velocidade, mas não impõe números universais. Um teste de unidade verde não comprova apresentação, e um E2E verde pode não localizar uma falha de regra.",
  },
  6: {
    title: "Diagnosticar um formulário que falha só no celular",
    context: "Em tela estreita, o botão Salvar parece acionável, mas a despesa não aparece. Um teste automatizado falha de modo intermitente após o clique.",
    procedure: [
      "No Elements, confira se o botão HTML está habilitado, seu nome acessível e se outro elemento CSS cobre a área de toque. No Console, procure erros de JavaScript no momento da ação.",
      "No Network, observe se houve request, o status, a resposta e o horário. Diferencie clique não recebido, erro de validação, falha no servidor e atraso de atualização da lista.",
      "Repita em largura ampla e estreita, com zoom e teclado. Responsividade envolve layout; a adaptabilidade também considera modo de entrada e condições do dispositivo.",
      "No Playwright ou Cypress, localize por papel e nome e espere o registro específico aparecer. Verifique também persistência após recarga, sem usar espera fixa para mascarar a causa.",
    ],
    deliverable: "Linha do tempo com ação, estado do elemento, request, resposta e estado final; hipótese descartada e causa mais provável.",
    interpretation: "Uma falha em teste de navegador pode estar na interface, no serviço, no dado ou na sincronização do teste. O trace e as ferramentas do navegador ajudam a separar essas causas.",
  },
  7: {
    title: "Provar autorização na API além do status HTTP",
    context: "A documentação OpenAPI mostra GET /despesas/{id}. Uma conta colaboradora consegue ler suas despesas. O risco é consultar uma despesa de outra pessoa trocando apenas o ID.",
    procedure: [
      "Crie duas contas de teste e uma despesa para cada uma, mantendo IDs e tokens em variáveis locais de uma coleção no Bruno ou ferramenta equivalente.",
      "Consulte a despesa própria com token válido e confira campos, tipos e valor. Sem token, confirme o comportamento de autenticação definido pelo contrato.",
      "Com o token da primeira conta, consulte o ID da segunda. Confira status, corpo e ausência de dados sensíveis; repita com um papel gestor se a regra prevê acesso diferente.",
      "Após tentativas de alteração, releia os recursos para confirmar que a operação recusada não teve efeito persistido. Separe falha de autorização de erro de dado ou recurso inexistente.",
    ],
    deliverable: "Matriz de perfil × dono do recurso × operação, requests reproduzíveis sem secrets versionados e evidência do estado antes e depois.",
    interpretation: "Swagger descreve forma e operações; não garante que cada objeto esteja protegido. Uma resposta de erro correta acompanhada de vazamento no corpo ainda é defeito de segurança.",
  },
  8: {
    title: "Refatorar uma suíte frágil sem esconder o comportamento",
    context: "Cinco testes criam despesas repetindo campos, cliques e uma espera de três segundos. Um deles falha uma vez a cada dez execuções.",
    procedure: [
      "Colete trace das falhas e compare com execuções verdes. Determine se o registro não foi persistido, se a lista demorou a atualizar ou se o seletor atingiu outro botão.",
      "Crie um builder pequeno para dados válidos, com valores únicos por teste. Extraia em Page Object somente a interação repetida com o formulário; mantenha assertions de negócio visíveis no teste.",
      "Substitua a espera fixa por uma condição observável, como resposta de criação seguida do registro correspondente na lista. Execute cada teste isoladamente e em conjunto.",
      "Avalie se existe uma cadeia variável de validações que justifique Chain of Responsibility. Se as ações são sempre as mesmas, prefira fluxo explícito. Compare taxa de falha e tempo de diagnóstico antes e depois.",
    ],
    deliverable: "Diferença de execução com causa demonstrada, código mais legível, medida de estabilidade e risco que cada teste continua protegendo.",
    interpretation: "Um custom command ou padrão de projeto só ajuda quando reduz duplicação real e preserva clareza. Retry e timeout maiores podem esconder o defeito sem corrigir a causa.",
  },
  9: {
    title: "Levar uma correção do Git até um gate útil",
    context: "Um PR corrige o total do relatório. O pipeline atual roda apenas build e mostra verde mesmo quando a regra financeira volta a falhar.",
    procedure: [
      "Crie commit com mudança pequena e descrição do risco. No PR do GitHub ou GitLab, indique regra, dados usados, evidência, teste adicionado e efeito esperado.",
      "No pipeline, execute tipos e testes de unidade cedo; depois API e smoke sobre ambiente preparado. Faça o teste financeiro bloquear o PR e publique trace ou relatório quando falhar.",
      "Se usar Azure DevOps Pipelines, modele gatilho, estágios, jobs, variáveis e artefatos com o mesmo critério. Secrets ficam no mecanismo apropriado e não aparecem em logs ou capturas.",
      "Meça tempo até primeira revisão e tempo total de PR. Se a fila crescer, investigue tamanho das mudanças e disponibilidade de revisão antes de estabelecer uma meta numérica.",
    ],
    deliverable: "Descrição de PR, sequência de jobs, gate vinculado ao risco financeiro e evidência preservada em falha.",
    interpretation: "CI confirma apenas as verificações configuradas. Um build verde informa que o projeto compilou; não demonstra que o total de despesas está correto.",
  },
  10: {
    title: "Investigar erro após deploy sem expor dados",
    context: "Depois de uma implantação, a taxa de erro do relatório aumenta. Alguns logs exibem e-mail e token de usuários; a equipe considera publicar as capturas no canal geral.",
    procedure: [
      "Defina janela do incidente, versão e fluxo afetado. Use identificador de correlação para seguir chamada, função, consulta ao banco e resposta, comparando com a linha de base anterior.",
      "Confira se o erro atinge todos os perfis ou apenas um papel. Teste autorização de recursos próprios e alheios em ambiente apropriado, preservando apenas evidência mínima.",
      "Restrinja e redija logs antes de compartilhá-los. Trate o token exposto conforme a política da organização, incluindo revogação ou rotação quando necessária.",
      "Se um limite de erro previamente acordado for ultrapassado, acione a pessoa responsável por rollback ou flag. Após a ação, confirme queda dos erros e sucesso de uma consulta real.",
    ],
    deliverable: "Linha do tempo do incidente, hipótese com evidência, alcance por perfil, ação de contenção e confirmação de recuperação sem dados sensíveis.",
    interpretation: "Monitoramento e segurança precisam caminhar juntos: logs úteis devem permitir diagnóstico sem criar uma nova exposição. Uma função lenta pode ser sintoma de dependência saturada.",
  },
  11: {
    title: "Separar lentidão, sobrecarga e barreira de acesso",
    context: "Pessoas relatam que a tela de relatório demora e que o filtro não funciona pelo teclado. O time sugere apenas aumentar a capacidade do servidor.",
    procedure: [
      "Rode Lighthouse em condições registradas para obter pistas sobre carregamento e renderização da página. Confirme o problema em navegação real antes de concluir a causa.",
      "Em ambiente autorizado, use Locust ou ferramenta de carga equivalente para executar consultas com volume gradual. Acompanhe sucesso, p95, throughput e erros, com limite de parada definido.",
      "No DevTools, compare tempo de rede e tempo até renderização. Se a API responde rápido e a tela demora, investigue trabalho no navegador; se a API erra sob carga, investigue serviço e banco.",
      "Percorra o filtro com teclado, foco e zoom. Registre a tarefa bloqueada e o elemento afetado; uma melhora de performance não corrige um controle sem nome ou inacessível.",
    ],
    deliverable: "Dois relatórios separados: um de desempenho com condições, percentis e erros; outro de acessibilidade com passos, impacto e evidência da barreira.",
    interpretation: "Lighthouse, teste de carga e avaliação de acessibilidade respondem a perguntas distintas. Combine os resultados na decisão sem confundir uma nota de ferramenta com experiência real.",
  },
  12: {
    title: "Publicar um case e um plano de carreira responsáveis",
    context: "Uma pessoa concluiu a mentoria com cenários, testes automatizados, relatório de carga e um bug real do projeto. Quer publicar o case e usar IA para preparar a apresentação.",
    procedure: [
      "Selecione uma decisão central de release e três evidências que a sustentem. Para cada uma, diga o que observou, o que não cobriu e como isso afetou a recomendação.",
      "Substitua nomes, URLs internas, tokens, dados pessoais e capturas privadas por exemplos fictícios. Verifique as regras de publicação da organização antes de compartilhar material real.",
      "Se usar IA para resumir ou revisar a narrativa, envie apenas material permitido, confira toda afirmação com a fonte e registre as mudanças feitas por você.",
      "Escolha duas trilhas profissionais, como automação e acessibilidade. Para cada uma, relacione um artefato do case, uma lacuna atual e um exercício das próximas quatro semanas.",
    ],
    deliverable: "Case com contexto, risco, método, evidência, decisão e limites; revisão de privacidade e plano de evolução com artefato verificável.",
    interpretation: "Um portfólio forte mostra raciocínio e responsabilidade. Listar ferramentas ou publicar informação confidencial não demonstra maturidade em qualidade.",
  },
};
