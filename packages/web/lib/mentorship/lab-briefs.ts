export type LabBrief = {
  scenario: string;
  startingPoint: string;
  mission: string;
  tasks: readonly string[];
  evidence: readonly string[];
  acceptance: readonly string[];
  extension: string;
};

export const labBriefs: Record<number, LabBrief> = {
  1: {
    scenario: "Você entrou no time do ExpenseFlow, um produto usado para solicitar, aprovar e acompanhar reembolsos. Antes de executar uma bateria de casos, o time quer saber onde uma falha causaria mais dano e que informações faltam sobre o produto.",
    startingPoint: "Abra o ExpenseFlow e observe o caminho de criar uma despesa, consultá-la, decidir uma aprovação e ler os relatórios. Troque entre os perfis de treino para investigar o acesso. Registre o que viu e o que ainda precisa confirmar antes de classificar um comportamento como defeito.",
    mission: "Produza um mapa do fluxo e cinco riscos priorizados que guiem a próxima rodada de testes.",
    tasks: ["Descreva o objetivo de cada perfil e represente entrada, regra, saída e dependências do fluxo principal.", "Crie uma despesa, observe lista e totais, depois compare o estado antes e depois de uma decisão de aprovação.", "Liste cinco riscos específicos em forma de causa possível, evento observável e impacto. Inclua pelo menos um risco de cálculo ou persistência e um de acesso ou uso.", "Classifique impacto e probabilidade com justificativa curta. Escolha o risco que investigaria primeiro e explique por quê.", "Para cada risco, escreva uma pergunta de negócio ou de comportamento que um teste futuro deve responder."],
    evidence: ["Mapa do fluxo com ator, dados, ações e resultado.", "Tabela de cinco riscos, prioridade e justificativa.", "Notas de observação separadas das hipóteses e cinco perguntas abertas."],
    acceptance: ["A prioridade se relaciona a dano real para usuário ou negócio.", "Os riscos são verificáveis no produto, sem frases genéricas como ‘pode dar erro’.", "Outra pessoa consegue escolher o próximo experimento a partir das perguntas."],
    extension: "Aprofundamento: compare os riscos de aprovação pelo próprio solicitante e de um relatório aprovado divergente da soma das despesas aprovadas. Registre qual regra de permissão ou cálculo precisa ser confirmada antes de concluir.",
  },
  2: {
    scenario: "O time recebeu relatos vagos de inconsistência em um fluxo do Lab Exploratório. Não há tempo para percorrer todo o produto; sua tarefa é conduzir uma sessão limitada e entregar informação reproduzível.",
    startingPoint: "Abra o Lab Exploratório. Escolha um fluxo que exponha estado, sequência ou regra de negócio. Defina usuário, dados e uma pergunta antes de interagir com o ambiente.",
    mission: "Execute uma sessão exploratória com charter, timebox, notas e debrief.",
    tasks: ["Escreva um charter de uma frase com área, risco investigado e limite de 40 minutos.", "Escolha três heurísticas adequadas, como borda, repetição, interrupção, estado ou concorrência, e diga por que elas servem ao risco.", "Execute primeiro o caminho esperado; depois faça as variações uma de cada vez, registrando ação, dado, resultado e nova pergunta.", "Quando aparecer algo inesperado, tente reproduzir sem alterar várias condições de uma vez. Guarde evidência ou explique por que a hipótese permanece aberta.", "Encerre com debrief: o que cobriu, o que descobriu, o que ficou sem cobertura e qual sessão recomenda em seguida."],
    evidence: ["Charter, timebox e heurísticas escolhidas.", "Notas da sessão com fatos separados de hipóteses.", "Debrief com achados, lacunas e próxima pergunta."],
    acceptance: ["A missão cabe no tempo escolhido e se relaciona a um risco.", "Um colega consegue repetir pelo menos uma observação a partir das notas.", "O debrief não apresenta uma suspeita como defeito confirmado."],
    extension: "Aprofundamento: faça uma segunda sessão curta orientada pela principal lacuna da primeira e compare o que mudou na sua hipótese.",
  },
  3: {
    scenario: "Uma história do Lab de Critérios descreve um comportamento com entradas válidas, inválidas e condições combinadas. O time precisa de cobertura enxuta que proteja as regras importantes sem multiplicar casos redundantes.",
    startingPoint: "Escolha uma história do lab e copie as regras explícitas. Anote como perguntas as regras incompletas; não invente um resultado esperado definitivo para uma lacuna do requisito.",
    mission: "Entregue uma matriz de cenários priorizados por risco, com caminho feliz, erro e borda.",
    tasks: ["Identifique pelo menos uma entrada com classes de equivalência e uma fronteira numérica ou temporal. Escreva valores imediatamente abaixo, no limite e acima.", "Se houver duas ou mais condições que mudam o resultado, monte uma tabela de decisão; descarte combinações impossíveis com justificativa.", "Escreva cenários com contexto, entrada, ação e resultado observável. Ligue cada cenário à regra ou ao risco protegido.", "Inclua pelo menos um cenário de fluxo normal, um de rejeição e um de limite; registre por que cada um acrescenta cobertura.", "Revise a lista, remova casos redundantes e descreva ao menos uma lacuna que ainda precisa de resposta de produto."],
    evidence: ["Classes, limites ou tabela de decisão usados para derivar cenários.", "Matriz com regra, cenário, esperado, risco e prioridade.", "Lista de lacunas e justificativa para cenários removidos."],
    acceptance: ["Resultados esperados podem ser observados no lab.", "As técnicas aparecem na escolha dos dados, não só no nome do documento.", "A priorização e a cobertura restante são explicadas."],
    extension: "Aprofundamento: modele estados e transições de uma entidade do fluxo, incluindo uma transição proibida que os casos lineares não capturam.",
  },
  4: {
    scenario: "Uma release se aproxima e o time encontrou comportamentos suspeitos. Produto e engenharia precisam de relatos que permitam reproduzir, estimar impacto e tomar uma decisão informada.",
    startingPoint: "Use um comportamento inesperado confirmado em um lab ou no ExpenseFlow. Se o primeiro achado não se repetir, investigue outra condição antes de chamá-lo de defeito. Abra o template de bug report para organizar o relato.",
    mission: "Escreva dois bug reports e um parecer curto de release baseado nas evidências.",
    tasks: ["Para cada achado, registre ambiente, conta ou papel, dados iniciais e menor sequência que reproduz o comportamento.", "Descreva resultado atual e esperado com valores concretos; indique de onde vem a regra esperada e anexe captura, resposta ou nota de execução.", "Diferencie severidade do dano e prioridade de correção. Explique usuários ou fluxos afetados e o que ainda não sabe sobre alcance.", "Repita uma variação relevante, como recarga ou dado diferente, para reforçar ou limitar a conclusão.", "Feche com recomendação de liberar, bloquear ou investigar mais. Cite a evidência decisiva, risco residual e condição que mudaria sua decisão."],
    evidence: ["Dois relatos independentes com passos, atual, esperado e contexto.", "Evidências de reprodução ou limite da investigação.", "Parecer de release com decisão e justificativa."],
    acceptance: ["Outra pessoa consegue reproduzir os relatos sem pedir informações básicas.", "Impacto, severidade e prioridade não são tratados como sinônimos.", "A recomendação de release decorre dos riscos observados."],
    extension: "Aprofundamento: proponha um teste de regressão para um dos defeitos e indique em qual camada ele ofereceria o melhor sinal.",
  },
  5: {
    scenario: "Depois de quatro semanas de investigação manual, o time quer reduzir regressões repetidas sem criar uma suíte lenta e frágil. Há mais candidatos que capacidade de implementação.",
    startingPoint: "Reabra seu mapa de riscos, cenários e relatos de defeito. Use o ExpenseFlow como produto de referência e consulte o curso Cypress para conhecer as opções de automação.",
    mission: "Priorize três candidatos de automação e justifique pelo menos dois adiamentos.",
    tasks: ["Liste ao menos cinco verificações que hoje exigiriam repetição manual; para cada uma, nomeie a regra e o risco protegido.", "Avalie frequência, impacto, estabilidade do fluxo, preparo de dados, facilidade de assertion e custo de manutenção usando a mesma escala.", "Para três candidatos, escolha unidade, API ou E2E e explique por que a camada responde à pergunta de risco.", "Para dois itens não escolhidos, descreva o motivo do adiamento e o sinal que faria você rever a decisão.", "Monte uma ordem de implementação com primeira entrega pequena, gatilho de execução e critério de estabilidade."],
    evidence: ["Matriz comparativa com critérios consistentes.", "Três escolhas de automação e duas decisões de manter manual ou adiar.", "Plano inicial com camada, dados e assertion principal."],
    acceptance: ["A escolha leva em conta retorno e custo, não apenas popularidade da ferramenta.", "Pelo menos um E2E protege uma jornada integrada e regras simples não dependem todas da UI.", "O plano permite iniciar a primeira spec sem rediscutir o objetivo."],
    extension: "Aprofundamento: estime o tempo de feedback e a manutenção mensal de cada candidato; compare uma opção rápida em API com um E2E equivalente.",
  },
  6: {
    scenario: "O time escolheu uma jornada crítica para smoke automático. O objetivo não é produzir muitos testes, e sim um teste que rode sozinho, falhe com motivo claro e deixe evidência de uma regressão.",
    startingPoint: "Abra o Workspace de Automação e o produto escolhido. Você pode usar Playwright ou Cypress; os exemplos de código desta semana mostram os dois estilos. Defina URL e estado inicial antes de escrever a spec.",
    mission: "Implemente um smoke E2E executável para um comportamento de negócio.",
    tasks: ["Escreva o nome do comportamento protegido e o resultado que comprova sucesso. Escolha um fluxo simples, como cadastrar e consultar uma despesa ou validar login.", "Prepare dados próprios ou documente um estado de treino fixo; evite depender da execução de outro teste.", "Implemente ações com seletores por papel, nome, label ou identificador estável. Troque pausas fixas por espera de estado observável.", "Adicione assertions de valor, categoria, mensagem ou persistência, conforme o risco. Rode a spec isolada e guarde resultado, trace ou captura de falha.", "Documente comando, URL, pré-requisitos e limpeza dos dados para outra pessoa reproduzir."],
    evidence: ["Arquivo da spec ou link para repositório com código.", "Instruções de execução e dados usados.", "Saída de uma execução e uma evidência útil quando o teste falha."],
    acceptance: ["O smoke valida resultado de negócio e funciona isoladamente.", "Não há espera fixa usada para encobrir sincronização.", "Uma falha permite identificar o passo e o esperado divergente."],
    extension: "Aprofundamento: rode a spec repetidas vezes ou em paralelo com massa isolada e investigue qualquer diferença de resultado.",
  },
  7: {
    scenario: "A API de treino oferece operações de consulta e escrita. Um teste que valida apenas HTTP 200 pode deixar passar schema errado, valor incorreto ou acesso indevido. Sua tarefa é verificar o contrato como consumidor da API.",
    startingPoint: "Abra o API Playground e a documentação do recurso escolhido. Use uma sessão de treino e dados criados por você. Registre base URL e credenciais fora da coleção ou spec compartilhada.",
    mission: "Crie uma coleção ou suíte de contrato com sucesso, erro e limite de autorização ou validação.",
    tasks: ["Selecione um recurso e anote método, endpoint, campos obrigatórios, status esperado e regra de negócio.", "Execute uma operação de criação, capture o ID retornado e consulte o recurso; valide status, campos e valor persistido.", "Execute uma alteração ou remoção e confirme o efeito com uma nova consulta, não apenas com o status da resposta.", "Faça um request com campo ausente ou inválido e registre código, corpo e ausência de alteração parcial.", "Se o recurso permitir, verifique comportamento com outra conta ou sem autorização. Documente setup, variáveis, limpeza e ordem das requests."],
    evidence: ["Collection ou spec executável sem IDs fixos e sem segredos embutidos.", "Resultados de sucesso, erro e validação do corpo.", "Notas sobre contrato, dados de teste e limite de autorização."],
    acceptance: ["As assertions verificam regra e efeito persistido além do código HTTP.", "Os dados são reproduzíveis por outro aluno ou mentor.", "O cenário negativo não altera indevidamente o estado."],
    extension: "Aprofundamento: compare duas contas e mostre que uma não consegue ler ou alterar o recurso criado pela outra, sem publicar dados reais.",
  },
  8: {
    scenario: "Uma suíte do time falha de forma intermitente após uma ação assíncrona. Alguns sugerem aumentar o tempo de espera; outros suspeitam de dado compartilhado. Você precisa investigar antes de mudar o teste.",
    startingPoint: "Abra o Lab de Waits e execute o fluxo com atraso configurado. Observe estados, resposta e momento em que a interface fica pronta. Use a spec da semana 6 ou um trecho equivalente para revisar.",
    mission: "Entregue diagnóstico de flakiness e uma melhoria demonstrável na suíte.",
    tasks: ["Registre sintoma, ambiente, frequência e passo da falha. Capture uma execução bem-sucedida e outra com falha, se possível.", "Liste hipóteses concorrentes: espera, seletor, massa, estado compartilhado ou defeito real. Associe uma evidência esperada a cada hipótese.", "Mude uma variável por vez. Troque pausa fixa por estado observável ou seletor frágil por intenção, conforme a causa mais bem sustentada.", "Rode novamente em condições semelhantes e compare resultado, duração e evidência de falha antes e depois.", "Documente o que corrigiu, o que ainda é hipótese e se o teste pode voltar a ser gate confiável."],
    evidence: ["Registro do sintoma e hipóteses com trace, log ou captura.", "Trecho antes e depois da alteração ou revisão técnica equivalente.", "Comparação de execuções e risco residual."],
    acceptance: ["A mudança responde a uma causa investigada, não apenas a um timeout maior.", "A execução continua verificando o comportamento correto do produto.", "O diagnóstico é compreensível para outra pessoa da equipe."],
    extension: "Aprofundamento: descubra se uma falha semelhante poderia vir de persistência real e descreva o experimento que diferencia problema de produto de problema de sincronização.",
  },
  9: {
    scenario: "O time tem specs locais, mas cada pessoa roda verificações em uma ordem diferente. Depois do merge, falhas chegam sem trace e ninguém sabe se o código, o ambiente ou os dados causaram o problema.",
    startingPoint: "Abra o Lab de CI/CD. Use o exemplo de GitHub Actions desta semana como ponto de partida e adapte comandos, serviços e diretórios ao projeto escolhido. Não coloque credenciais no arquivo do workflow.",
    mission: "Desenhe ou implemente um workflow que devolva feedback de qualidade acionável em pull requests.",
    tasks: ["Defina gatilho e permissões mínimas. Liste os serviços e dados que precisam estar prontos antes dos testes.", "Ordene verificações rápidas, build, API e E2E de acordo com custo e dependências. Explique qual falha bloqueia merge.", "Escreva os passos do workflow para instalar dependências, iniciar a aplicação, esperar prontidão e executar a suíte relevante.", "Publique relatório, trace ou captura quando houver falha. Descreva retenção, acesso e cuidados com segredos.", "Simule a leitura de um resultado vermelho: identifique job, comportamento, artefato e primeira hipótese de diagnóstico."],
    evidence: ["Arquivo YAML ou diagrama operacional com comandos concretos.", "Mapa de jobs, gates e dependências.", "Exemplo de falha com caminho para logs e artefatos."],
    acceptance: ["O E2E não começa antes de a aplicação estar pronta.", "Gates protegem riscos definidos e não dependem apenas de uma porcentagem.", "Uma falha deixa evidência suficiente após o runner terminar."],
    extension: "Aprofundamento: separe smoke e regressão em gatilhos diferentes e explique o ganho de tempo e o risco de cobertura da escolha.",
  },
  10: {
    scenario: "Após uma implantação, o pipeline mostra sinais mistos e o Lab de Logs apresenta uma anomalia. O time precisa decidir se investiga, mantém a release com mitigação ou reverte a mudança.",
    startingPoint: "Abra o Lab de Logs e leia a linha do tempo do incidente. Observe o que mudou, quando ocorreu, quais fluxos foram afetados e que sinais de CI ou aplicação estão disponíveis.",
    mission: "Escreva um parecer de release com decisão de gate e plano de recuperação.",
    tasks: ["Monte uma linha do tempo com implantação, primeira falha, aumento de erros e qualquer tentativa de mitigação.", "Separe fatos medidos de hipóteses causais. Relacione logs, falha de teste e impacto provável no usuário.", "Escolha liberar, bloquear, investigar mais ou reverter. Explique o risco residual e a informação que mudaria a decisão.", "Defina gatilho observável para rollback ou desligamento de flag, pessoa responsável e como confirmar recuperação.", "Registre comunicação ao time e próxima verificação antes de considerar o incidente encerrado."],
    evidence: ["Linha do tempo e tabela de sinais versus hipóteses.", "Parecer de release com decisão, impacto e incerteza.", "Plano de rollback ou mitigação com gatilho e confirmação."],
    acceptance: ["A decisão se apoia em evidência e consequência para o usuário.", "Rollback considera dados e compatibilidade, não apenas voltar o código.", "O plano diz quem age, quando e como verifica o resultado."],
    extension: "Aprofundamento: descreva uma situação em que desligar uma feature flag não resolveria o incidente e que outra ação seria necessária.",
  },
  11: {
    scenario: "Uma API local precisa ser observada sob baseline, carga sustentada e pico. O objetivo é encontrar sinais de limite e interpretar a experiência de quem usa o produto, sem extrapolar resultados locais para produção.",
    startingPoint: "Suba a API de treino local e abra a página de prática de k6. Configure o alvo loopback e PERF_TARGET_ACK=LOCAL_ONLY; o runner bloqueia outros destinos. Registre máquina, versão, dados e horário da execução.",
    mission: "Execute os três cenários de k6 e produza um relatório comparativo com recomendação.",
    tasks: ["Antes de executar, escreva a pergunta de performance e os thresholds didáticos para erro, p95 e p99. Identifique endpoint e modelo de uso.", "Rode baseline e guarde saída completa. Depois execute carga gradual e pico com o mesmo alvo e sem alterar a massa entre medições, quando possível.", "Monte tabela com VUs ou iterações, duração, throughput, taxa de erro, p95, p99 e resultado dos checks de cada cenário.", "Explique em que etapa houve mudança relevante de latência ou erro. Diferencie medição de hipótese de gargalo.", "Recomende próximo experimento com variável controlada e declare limites do ambiente local."],
    evidence: ["Comandos e identificação do alvo local, sem segredos.", "Saídas de baseline, carga e pico com tabela comparativa.", "Relatório com interpretação, thresholds e próximo experimento."],
    acceptance: ["Há três cenários comparáveis no mesmo alvo autorizado.", "A análise usa percentis, throughput e erros em conjunto.", "A conclusão não afirma capacidade de produção a partir de ambiente local."],
    extension: "Aprofundamento: proponha instrumentação adicional para diferenciar gargalo de aplicação, banco ou máquina do teste antes de otimizar.",
  },
  12: {
    scenario: "Chegou a revisão final do ExpenseFlow. O time precisa de uma recomendação de release que reúna investigação manual, automação, API, CI e performance numa narrativa verificável.",
    startingPoint: "Reúna os artefatos das onze semanas anteriores. Escolha um risco central que percorra o case. Se alguma etapa produziu evidência em outro ambiente, declare a diferença em vez de apresentar tudo como uma única execução.",
    mission: "Entregue um case integrado, um parecer de release e uma apresentação de cinco minutos.",
    tasks: ["Abra com contexto do produto, usuário afetado, fluxo crítico e risco central. Mostre por que priorizou esse risco.", "Selecione evidências manuais: mapa de risco, charter, cenários e bug report. Explique o que cada uma revelou e o que não cobre.", "Conecte smoke E2E, verificação de API, sinais de CI e resultado de k6 à mesma pergunta de release. Inclua links, comandos ou capturas rastreáveis.", "Recomende liberar, bloquear ou mitigar; indique risco residual, responsável, monitoramento e gatilho para reavaliar ou reverter.", "Prepare resumo oral de cinco minutos: contexto, risco, estratégia, duas ou três evidências fortes, decisão e próximo passo."],
    evidence: ["Case escrito com links ou anexos das trilhas manual, automação, CI/CD e performance.", "Repositório ou patch das verificações executáveis e instruções para reproduzir.", "Parecer de release e roteiro da apresentação."],
    acceptance: ["Cada afirmação central aponta para uma evidência verificável.", "O case distingue ambientes, limitações e hipóteses de fatos.", "A decisão pode ser entendida por produto e engenharia sem explicação adicional."],
    extension: "Aprofundamento: compare a decisão que tomaria com e sem o resultado do teste de carga e explique o quanto esse sinal realmente muda o risco da release.",
  },
};
