export type TheoryExpansion = {
  sections: readonly {
    title: string;
    paragraphs: readonly [string, string];
  }[];
  caseStudy: {
    title: string;
    context: string;
    reasoning: string;
    conclusion: string;
  };
};

export const theoryExpansion: Record<number, TheoryExpansion> = {
  1: {
    sections: [
      {
        title: "Construir um modelo antes de escolher testes",
        paragraphs: [
          "Um produto não é uma coleção de telas: é um conjunto de atores, objetivos, regras, estados e efeitos sobre dados. Para modelá-lo, escolha uma jornada importante e descreva quem inicia a ação, quais pré-condições precisam existir, quais decisões o sistema toma e o que deve permanecer verdadeiro ao final. No sistema, a criação de uma despesa muda uma lista, um saldo pendente, as permissões de aprovação e possivelmente um relatório. Cada efeito cria uma pergunta de teste diferente. Um mapa simples dessas relações é mais útil do que começar com uma lista genérica de cliques.",
          "O modelo também precisa registrar o que se sabe e a fonte desse conhecimento. Uma regra descrita no briefing, um comportamento observado e uma suposição da equipe não têm o mesmo peso. Se a regra de quem aprova despesas não está clara, você pode explorar o comportamento atual, mas não deve chamar de defeito qualquer resultado que contradiga apenas sua hipótese. Escreva a dúvida, identifique quem pode respondê-la e prepare exemplos concretos para a conversa. Essa disciplina evita tanto bugs falsos quanto decisões baseadas em expectativas inventadas.",
        ],
      },
      {
        title: "Priorizar risco sem fingir precisão",
        paragraphs: [
          "Risco de produto combina um evento possível com uma consequência relevante. Descreva-o na forma ‘se ocorrer X em condição Y, então Z pode acontecer’. Em seguida, avalie impacto, chance de ocorrência, alcance, detectabilidade e possibilidade de recuperar o estado. Não é necessário converter tudo em uma nota exata: escalas como alto, médio e baixo são suficientes quando acompanhadas de justificativa. Um total financeiro incorreto pode merecer atenção antes de um desalinhamento visual frequente porque a consequência e a dificuldade de perceber o erro são maiores.",
          "A prioridade de teste muda quando surgem evidências novas. Se a equipe mostra que um cálculo é feito em serviço já coberto por testes confiáveis, você pode transferir tempo para a autorização por perfil. Se um defeito aparece em produção, a probabilidade estimada deixa de ser hipótese. Registre o que mudou e por quê. O mapa de risco deve orientar a próxima investigação, não virar um documento estático: para cada risco relevante, proponha uma condição inicial, uma observação verificável e uma decisão que o resultado ajudará a tomar.",
        ],
      },
    ],
    caseStudy: {
      title: "Relatório de reembolso divergente",
      context: "Uma gestora aprova uma despesa de R$ 40 e deixa outra de R$ 60 pendente. O relatório mostra R$ 100 como total aprovado.",
      reasoning: "O comportamento observado é a divergência entre o relatório e os estados das despesas. Antes de concluir que o cálculo está errado, confirme período, filtros, moeda e perfil; depois repita com dados identificáveis e compare lista, relatório e estado após recarga.",
      conclusion: "Se a divergência persistir sob as mesmas condições, há evidência de risco financeiro. O relatório deve indicar os valores, a regra esperada, as condições de reprodução e quais variações ainda não foram cobertas.",
    },
  },
  2: {
    sections: [
      {
        title: "Exploração como desenho e execução simultâneos",
        paragraphs: [
          "No teste exploratório, aprender, propor um experimento e executá-lo acontecem durante a mesma sessão. Isso exige uma missão explícita, não improvisação irrestrita. Um charter útil identifica área, risco, usuário, dados, restrições de ambiente e tempo disponível. ‘Testar agendamentos’ é amplo demais; ‘investigar se a troca de data preserva um horário inválido antes da confirmação’ indica o comportamento e a decisão em foco. A missão pode mudar diante de um achado relevante, mas a mudança precisa ser anotada para que a cobertura continue inteligível.",
          "Durante a execução, altere uma variável importante por vez quando precisar entender causalidade. Se você troca usuário, data e tipo de serviço antes de observar o resultado, fica difícil saber o que produziu a diferença. Use notas leves com ação, dado, resultado e próxima pergunta; guarde evidência no momento em que o estado ainda existe. Reserve parte do timebox para reproduzir achados e fazer o debrief. Uma sessão que só produz cliques e capturas, sem síntese do que foi aprendido, oferece pouco apoio para a próxima decisão.",
        ],
      },
      {
        title: "Heurísticas, cobertura e limites da conclusão",
        paragraphs: [
          "Heurísticas são maneiras de gerar perguntas: examine bordas, estados, papéis, interrupções, repetições, concorrência e retornos após erro. Elas ajudam a lembrar riscos que um fluxo feliz esconde, mas não garantem cobertura completa. Escolha lentes coerentes com a missão. Em uma reserva, transições de estado e concorrência entre usuários importam mais que repetir todos os textos da interface. Registre quais dimensões foram examinadas, com quais dados, e quais permanecem abertas. Isso torna a exploração revisável por outra pessoa.",
          "No debrief, separe defeitos reproduzidos, comportamentos suspeitos, dúvidas de regra e bloqueios de ambiente. Um resultado correto em três tentativas não prova ausência de falhas; ele sustenta uma afirmação mais restrita sobre aquelas condições. Termine indicando a próxima melhor sessão e a informação que falta para decidir. Essa honestidade é especialmente valiosa quando o tempo de teste é limitado: ela permite priorizar investigação adicional sem transformar uma lacuna em falsa segurança.",
        ],
      },
    ],
    caseStudy: {
      title: "Troca de data em uma reserva",
      context: "Uma pessoa seleciona um horário livre, muda a data e chega à confirmação sem escolher outro horário.",
      reasoning: "O charter pergunta se o horário anterior é limpo ou revalidado. Execute primeiro a jornada normal, depois mude apenas a data; registre os estados antes e depois, a disponibilidade e a resposta final.",
      conclusion: "Um horário inválido confirmado é um defeito reproduzível. Se a interface bloquear a ação, documente a cobertura e investigue a mesma transição sob retorno de navegação ou duas sessões concorrentes.",
    },
  },
  3: {
    sections: [
      {
        title: "Escolher a técnica a partir da forma da regra",
        paragraphs: [
          "Partição de equivalência ajuda quando várias entradas devem receber o mesmo tratamento. Primeiro identifique classes válidas e inválidas; depois escolha representantes que possam revelar diferença entre classes. Valores limite focam as bordas onde comparações inclusivas ou exclusivas costumam falhar. Se a regra aceita quantidades de 1 a 10, os valores 0, 1, 10 e 11 têm mais informação que quatro números no meio da faixa. Documente também formato, campo vazio e unidade, porque uma borda numérica não cobre por si só a validação da entrada.",
          "Uma tabela de decisão é mais adequada quando o resultado depende de condições combinadas, como perfil, status e valor. Liste condições, combinações possíveis e ações esperadas, eliminando combinações impossíveis com justificativa. Para entidades que mudam ao longo do tempo, modele estados e eventos: uma despesa pode estar pendente, aprovada ou reprovada, e cada transição permitida tem uma regra. Técnicas diferentes iluminam estruturas diferentes do requisito; usá-las como checklist universal gera casos sem propósito e deixa lacunas em regras complexas.",
        ],
      },
      {
        title: "Transformar cobertura em evidência de decisão",
        paragraphs: [
          "Um cenário profissional contém pré-condição, entrada, ação, resultado observável e vínculo com uma regra ou risco. ‘Testar valor inválido’ não informa o que executar nem o que verificar. ‘Com valor zero e perfil de colaborador, salvar uma despesa deve ser impedido sem criar registro’ define uma condição, um esperado e um efeito persistido. Esse nível de clareza permite revisão antes da execução e diagnóstico depois de uma falha. Quando a regra for incerta, marque o esperado como hipótese e peça confirmação.",
          "Cobertura não é contagem bruta de cenários. Dois casos que atravessam a mesma classe e a mesma condição podem ser redundantes; um único caso que combina cinco regras pode ser difícil de diagnosticar. Procure um conjunto pequeno que torne falhas localizáveis e riscos importantes observáveis. Registre cortes deliberados, como combinações raras ou estados sem ambiente de teste. A matriz final deve permitir responder: quais regras receberam evidência, quais só foram inferidas e quais permanecem sem verificação.",
        ],
      },
    ],
    caseStudy: {
      title: "Regra de limite com autorização",
      context: "Uma despesa aceita valores entre R$ 1 e R$ 100, mas apenas uma gestora pode aprová-la.",
      reasoning: "Separe as classes de valor da regra de papel. Teste 0, 1, 100 e 101 no cadastro; depois use uma despesa válida para verificar aprovação por colaborador e gestora. Assim, uma falha de autorização não fica mascarada por valor inválido.",
      conclusion: "A evidência deve apontar exatamente qual regra falhou e qual estado ficou persistido. Não conclua que toda a autorização está coberta apenas porque um perfil foi rejeitado.",
    },
  },
  4: {
    sections: [
      {
        title: "Um relato de defeito é uma hipótese verificável",
        paragraphs: [
          "O objetivo do bug report é permitir que outra pessoa observe o mesmo comportamento e decida o que fazer. Um título eficaz combina condição, comportamento e impacto, sem antecipar uma causa não comprovada. No corpo, informe ambiente, versão, papel, dados, pré-condições, passos mínimos, resultado atual, resultado esperado e origem da regra. A evidência pode incluir captura, request, response ou log, mas precisa manter contexto suficiente para interpretação. Redija de modo que uma pessoa que nunca viu a sessão consiga reproduzir e verificar a correção.",
          "Quando o defeito é intermitente, registre frequência, horário, tentativas, estado inicial e variáveis que mudaram. Não transforme uma suspeita de causa em fato; ‘o total divergiu após edição’ é observação, enquanto ‘o cache não invalidou’ é hipótese. Antes de compartilhar anexos, remova tokens, credenciais, dados pessoais e outros identificadores desnecessários. Evidência segura é parte da qualidade do relato, não uma etapa administrativa posterior.",
        ],
      },
      {
        title: "Severidade, prioridade e recomendação de release",
        paragraphs: [
          "Severidade descreve a consequência da falha; prioridade expressa quando o time deve agir. Uma falha visual pode ter alta prioridade se bloquear uma campanha importante, e uma falha tecnicamente séria pode ter tratamento planejado se o fluxo está desativado e existe mitigação comprovada. Justifique a classificação com alcance, impacto, frequência, reversibilidade e momento da entrega. Evite usar rótulos isolados como ‘crítico’ sem descrever quem é afetado e o que deixa de funcionar.",
          "Uma recomendação de release sintetiza evidências, lacunas e risco residual. Informe o que mudou, que fluxos foram verificados, que falhas permanecem abertas e qual condição alteraria a decisão. ‘Liberar’ pode exigir monitoramento ou uma feature flag; ‘bloquear’ deve indicar o sinal necessário para reavaliar. Quando não há evidência suficiente, ‘investigar antes de decidir’ é uma recomendação válida se vier acompanhada de pergunta, responsável e prazo. O parecer de QA apoia uma decisão compartilhada, não substitui a responsabilidade de produto e engenharia.",
        ],
      },
    ],
    caseStudy: {
      title: "Defeito em relatório financeiro",
      context: "O relatório aprovado diverge da soma dos itens aprovados, mas o cadastro e a consulta de despesas passaram.",
      reasoning: "O relato deve incluir valores concretos, período, filtros, perfil e passos. Na recomendação, separe cobertura dos fluxos que passaram da falha do cálculo; não use o número total de testes verdes para diluir o risco financeiro.",
      conclusion: "Uma decisão defensável pode bloquear a liberação do relatório até correção e regressão dos estados afetados, ou isolar a função com mitigação explícita. A escolha depende do uso real e do risco aceito.",
    },
  },
  5: {
    sections: [
      {
        title: "Automação é uma estratégia de feedback",
        paragraphs: [
          "Automatizar um teste só cria valor quando uma verificação conhecida precisa ser repetida com confiança e quando o resultado chega a tempo de orientar uma decisão. Compare custo de construir, preparar dados, executar, diagnosticar falhas e manter a suíte com o custo de repetir a verificação manualmente. Frequência e criticidade elevam o retorno; volatilidade da interface, dependência de terceiros e resultados subjetivos aumentam o custo. A escolha profissional inclui também o que permanece exploratório, porque automação repete perguntas previstas e pessoas continuam necessárias para descobrir perguntas novas.",
          "A camada de teste muda o tipo de evidência. Um teste de unidade pode verificar uma regra de cálculo rapidamente; um teste de API cobre contrato e persistência; um teste de interface confirma que uma jornada integrada funciona para a pessoa usuária. Nenhuma camada substitui todas as outras. Escolha a camada mais econômica que observe o risco relevante e mantenha poucos testes de ponta a ponta para fluxos cujo valor depende da integração completa. Evite usar a pirâmide de testes como meta numérica rígida: arquitetura, produto e velocidade de feedback determinam a distribuição útil.",
        ],
      },
      {
        title: "Desenhar uma matriz de candidatos verificável",
        paragraphs: [
          "Para cada candidato, registre comportamento protegido, frequência de execução, consequência de falha, estabilidade da regra, dados necessários, camada proposta e sinal de sucesso. Uma linha como ‘automatizar login’ ainda é vaga; ‘verificar que uma conta válida acessa a área correta e que credenciais inválidas não criam sessão’ define perguntas observáveis. Acrescente o custo de manutenção esperado e o motivo de não escolher camadas alternativas. Assim, a matriz vira uma decisão revisável, não uma lista de desejos tecnológicos.",
          "Defina também gatilho e proprietário: o teste roda no pull request, no deploy ou em uma rotina periódica? Quem investiga uma falha e em quanto tempo ela precisa ser esclarecida? Uma suíte que falha com frequência sem ação perde credibilidade. Reavalie candidatos quando a regra muda, o fluxo fica estável ou o custo de investigação cresce. É legítimo retirar um teste que já não protege risco relevante, desde que a lacuna e a substituição sejam registradas.",
        ],
      },
    ],
    caseStudy: {
      title: "Escolher onde verificar o total aprovado",
      context: "O sistema calcula o total de despesas aprovadas e o exibe em relatório.",
      reasoning: "Use teste de regra para combinações de valores e estados, teste de API para persistência e um smoke de interface que aprove uma despesa e confira o total. Deixe a exploração visual e de clareza do relatório para revisão humana.",
      conclusion: "A matriz deve explicar por que cada camada existe, quais dados prepara, qual falha detecta e quais riscos continuam fora da automação.",
    },
  },
  6: {
    sections: [
      {
        title: "Um E2E confiável protege comportamento, não passos",
        paragraphs: [
          "Estruture um teste web em preparação, ação e verificação de resultado de negócio. ‘Clicar em salvar’ é uma ação; ‘a despesa aparece com valor, categoria e status corretos após recarga’ é uma afirmação verificável. Nomeie o teste pelo comportamento esperado e mantenha assertions próximas do risco. Se uma jornada longa cobre muitos resultados independentes, quebre-a em testes menores ou use verificações intermediárias para localizar a falha. O teste deve funcionar sozinho, com dados próprios e sem depender da ordem de execução da suíte.",
          "Seletores semânticos, como papel e nome acessível, acompanham a intenção da pessoa usuária e tendem a resistir a mudanças irrelevantes no HTML. Use contratos explícitos quando não houver semântica suficiente. Evite classes de estilo, posição de elemento e cadeias profundas de CSS como identidade do alvo. Antes de adicionar um seletor de teste, pergunte se a interface deveria ter um rótulo acessível. A qualidade do teste e a acessibilidade frequentemente melhoram juntas quando o comportamento é descrito de forma observável.",
        ],
      },
      {
        title: "Sincronização, isolamento e diagnóstico",
        paragraphs: [
          "A interface é assíncrona: requests, animações, validações e renderizações podem terminar em momentos diferentes. Espere por uma condição que signifique conclusão, como mensagem visível, linha persistida ou estado atualizado. Pausas fixas atrasam testes rápidos e ainda falham quando a operação demora mais que o número escolhido. Frameworks como Playwright oferecem verificações de acionabilidade e assertions com nova tentativa; isso não elimina a necessidade de entender qual estado final realmente importa para o produto.",
          "Quando um teste falha, preserve trace, captura, logs relevantes e identificador dos dados usados. Rode o mesmo teste isoladamente e compare execução local e CI antes de atribuir culpa ao ambiente. Retries podem medir frequência de falha, mas não devem esconder uma causa ainda desconhecida. Prefira corrigir estado compartilhado, seletor frágil ou expectativa incorreta. Uma suíte profissional devolve informação que permite investigação; uma suíte que apenas alterna entre verde e vermelho consome confiança e tempo.",
        ],
      },
    ],
    caseStudy: {
      title: "Smoke de cadastro de despesa",
      context: "Um teste cadastra uma despesa e termina assim que o botão de salvar responde.",
      reasoning: "O clique não demonstra persistência. Gere um valor identificável, preencha campos por rótulo, aguarde a linha na lista, confirme valor e status e recarregue a página. Capture trace se qualquer etapa falhar.",
      conclusion: "O teste passa a proteger a jornada de criação e consulta. Execute-o isoladamente com dados novos para provar que o resultado não depende de estado deixado por outra spec.",
    },
  },
  7: {
    sections: [
      {
        title: "Ler uma API como contrato entre sistemas",
        paragraphs: [
          "Um status HTTP informa a classe do resultado, mas não prova que a operação cumpriu a regra de negócio. Para cada endpoint, identifique método, recurso, autenticação, entrada permitida, campos obrigatórios, tipos, invariantes e efeitos persistidos. Uma criação pode retornar sucesso e gravar um valor incorreto; uma rejeição pode ter status adequado e ainda vazar detalhes internos. Escreva assertions para o corpo, os headers relevantes e o estado consultável depois da operação. Diferencie o contrato documentado de comportamento apenas observado, porque a documentação pode estar incompleta ou desatualizada.",
          "Organize cenários por classes de comportamento: sucesso, validação, ausência de recurso, conflito, autenticação e autorização. Nem todo endpoint precisa de todas as classes, mas cada exclusão deve refletir a regra. Use dados únicos e previsíveis, crie pré-condições pela própria suíte e limpe recursos quando possível. Um fluxo POST, GET, PATCH e DELETE pode verificar continuidade de estado, desde que cada etapa informe claramente sua falha. Se o POST falhar, os requests seguintes devem mostrar a pré-condição ausente, não produzir uma cadeia confusa de sintomas.",
        ],
      },
      {
        title: "Autorização por objeto e segurança dos dados",
        paragraphs: [
          "Autenticação responde quem é a pessoa ou o sistema; autorização responde o que esse ator pode fazer com aquele recurso. Um usuário autenticado não deve conseguir ler ou alterar a despesa de outra pessoa apenas trocando o identificador na URL. Teste o mesmo objeto com papéis diferentes e compare resposta e efeito persistido, sempre em ambiente autorizado com contas e dados de treino. Um erro de autorização pode aparecer tanto como exposição de dados quanto como modificação indevida, mesmo quando o status de outras operações está correto.",
          "Não publique tokens em coleções, repositórios ou capturas. Separe variáveis de ambiente, use credenciais limitadas e remova dados pessoais de exemplos. Ao relatar uma falha, registre método, recurso, papel, condição e resultado sem incluir segredo reutilizável. A qualidade do diagnóstico depende de reproduzir o risco com segurança. Na ausência de contrato ou ambiente de teste autorizado, documente a lacuna e faça a prática na API de treino; observar endpoints internos no navegador não concede permissão para explorá-los.",
        ],
      },
    ],
    caseStudy: {
      title: "Consulta de despesa de outra conta",
      context: "Duas contas de treino criam despesas diferentes; a segunda tenta consultar o ID criado pela primeira.",
      reasoning: "Verifique autenticação, papel, escopo de acesso e resposta. Compare também se algum campo privado aparece no corpo de erro. Repita com recurso próprio para confirmar que o endpoint funciona na condição permitida.",
      conclusion: "A suíte deve demonstrar tanto a operação legítima quanto a restrição por objeto. Um status isolado não basta se dados de outra conta ainda forem expostos.",
    },
  },
  8: {
    sections: [
      {
        title: "Arquitetura de suíte a serviço da mudança",
        paragraphs: [
          "Uma suíte sustentável separa intenção de teste, preparo de dados e detalhes de interação. Use abstrações apenas quando eliminam repetição real ou concentram um contrato estável; esconder cada clique atrás de um método genérico torna a investigação mais difícil. Fixtures devem explicitar o estado que cada teste recebe, e helpers devem ter nomes que revelem seu efeito. O leitor precisa entender qual risco o teste protege sem abrir cinco arquivos. Revise duplicação, ordem implícita, limpeza de dados e tempos de execução antes de criar mais camadas de abstração.",
          "Dados compartilhados e dependência entre testes criam falhas em cascata. Prefira entidades próprias por execução, identificadores únicos e preparação idempotente. Quando um ambiente externo é inevitável, documente o contrato, a política de limpeza e o comportamento diante de indisponibilidade. Classifique testes por finalidade, como smoke ou regressão, a partir da decisão que apoiam, não do tempo que demoram. Uma suíte pequena que sinaliza risco relevante cedo costuma ser mais útil que uma suíte extensa cujos resultados ninguém consegue interpretar.",
        ],
      },
      {
        title: "Investigar flakiness como incidente técnico",
        paragraphs: [
          "Flakiness é uma diferença de resultado sob condições aparentemente equivalentes; a primeira tarefa é descobrir quais condições não eram equivalentes. Registre horário, duração, worker, ambiente, dados, captura, trace e etapa exata da falha. Formule hipóteses separadas para sincronização, ordem, concorrência, rede, serviço externo e comportamento real do produto. Altere uma causa provável por vez e compare execuções. Aumentar timeout ou retry sem evidência pode reduzir o ruído visível enquanto mantém o defeito escondido.",
          "Uma quarentena pode ser útil para impedir que um teste instável bloqueie toda a entrega, mas precisa ter responsável, prazo e risco explicitado. Não conte um teste em quarentena como cobertura confiável. Depois da correção, execute repetidamente sob condições próximas às que falhavam e documente o antes e depois. Se o comportamento do produto for de fato intermitente, o problema não é apenas ‘teste flaky’: a suíte revelou um risco real que merece investigação própria.",
        ],
      },
    ],
    caseStudy: {
      title: "Falha intermitente após salvar",
      context: "Um smoke passa localmente e falha em CI porque a confirmação ainda não apareceu quando o teste verifica a página.",
      reasoning: "Inspecione trace e rede para distinguir resposta lenta, renderização atrasada e falha real de persistência. Substitua espera fixa por assertion sobre o estado final observável e isole os dados usados em cada execução.",
      conclusion: "Confirme a correção com execuções repetidas em CI. Se o registro às vezes não persistir, abra investigação de produto em vez de apenas ajustar o teste.",
    },
  },
  9: {
    sections: [
      {
        title: "Pipeline como sistema de feedback",
        paragraphs: [
          "Integração contínua deve devolver informação útil enquanto ainda é barato corrigir uma mudança. Desenhe o caminho do commit à decisão: instalação reproduzível, checagens estáticas, testes rápidos, build, testes de integração e verificações mais lentas quando apropriadas. A ordem depende de custo e capacidade de detectar riscos, não de uma receita fixa. Uma falha de lint ou tipo pode interromper etapas caras; um smoke de jornada crítica pode ser indispensável antes de promover um artefato. Registre o que cada etapa protege e que conclusão um resultado verde permite tirar.",
          "Um workflow só é confiável se puder ser reproduzido. Fixe dependências, separe configuração por ambiente, controle massa de teste e evite depender de estado manual. Paralelização reduz tempo, mas exige isolamento: dois jobs que alteram a mesma conta podem criar falhas falsas. Logs devem identificar a etapa, o comando, a versão e os dados não sensíveis necessários para investigar. Salve artefatos como relatórios, capturas e traces quando agregam diagnóstico; não transforme o CI em depósito de segredos ou dados pessoais.",
        ],
      },
      {
        title: "Segurança e leitura do resultado",
        paragraphs: [
          "Tokens e credenciais devem entrar por mecanismos próprios de segredo e com o menor escopo necessário. Evite exibi-los em logs, capturas e comandos verbosos; considere também que uma contribuição externa pode executar código não confiável no contexto do workflow. Permissões, ambientes protegidos e gatilhos merecem revisão antes de conectar uma rotina de teste a deploy. Um teste que passa com privilégios excessivos pode deixar de representar o usuário real e ainda ampliar o impacto de uma falha de configuração.",
          "O estado final do pipeline precisa responder o que foi executado, o que falhou, o que ficou sem execução e se o artefato pode avançar. Um job cancelado, pulado ou verde após retry não transmite a mesma evidência que uma primeira execução estável. Defina critérios explícitos para cada gate e um procedimento de triagem que diferencie regressão, problema de ambiente e falha da suíte. Quando uma exceção for necessária, documente responsável, justificativa e condição de retirada; caso contrário, o gate deixa de significar uma decisão verificável.",
        ],
      },
    ],
    caseStudy: {
      title: "Falha de smoke no pull request",
      context: "O build passou, mas o smoke de cadastro falhou no CI e gerou trace.",
      reasoning: "Verifique se o teste executou com dados isolados, se a aplicação respondeu e em qual etapa a falha ocorreu. Compare trace, logs e mudança do pull request antes de classificar como regressão ou instabilidade do ambiente.",
      conclusion: "O gate deve bloquear enquanto o risco não estiver esclarecido. Se for falha conhecida da suíte, uma exceção temporária precisa preservar o registro do risco e a responsabilidade pela correção.",
    },
  },
  10: {
    sections: [
      {
        title: "Gate de qualidade é uma regra de decisão",
        paragraphs: [
          "Um quality gate traduz riscos aceitáveis em condições observáveis. ‘Todos os testes passaram’ é insuficiente se os fluxos críticos não foram executados; ‘cobertura acima de 80%’ é insuficiente se o número não representa comportamento protegido. Defina quais evidências importam para aquela mudança: smoke de jornada central, contrato de API, ausência de falha severa aberta, migração reversível ou alerta operacional pronto. Diferencie bloqueios obrigatórios de sinais que exigem revisão humana. O gate deve ser proporcional ao risco e compreensível para quem decide a release.",
          "Triagem começa separando fato de hipótese. Identifique job, etapa, versão, ambiente, horário e mudança associada. Verifique se a falha é reproduzível, se afeta produto ou apenas mecanismo de teste e se existe evidência suficiente para decidir. Um retry verde não apaga a primeira falha; ele pode indicar intermitência. Relate o risco residual e a próxima ação concreta. Decisões de exceção precisam de prazo, responsável e monitoramento, porque uma exceção sem controle vira normalização silenciosa de risco.",
        ],
      },
      {
        title: "Recuperação faz parte da estratégia de release",
        paragraphs: [
          "Rollback, feature flag e correção em frente têm custos e pré-condições diferentes. Reverter código pode não reverter dados já migrados ou efeitos externos; desligar uma flag pode interromper uma jornada sem corrigir registros inconsistentes. Antes do deploy, saiba que sinal indicará problema, quem tem autoridade para agir, quanto tempo a decisão pode esperar e quais passos recuperam o serviço. Teste o plano de recuperação em ambiente adequado sempre que o impacto justificar, em vez de presumir que um comando antigo ainda funciona.",
          "Após a liberação, monitore sinais relacionados ao risco que motivou o gate: erros da jornada, divergência de dados, latência, chamados ou métricas de negócio. A ausência de alerta não demonstra qualidade se o indicador não observa a falha relevante. Registre o que foi visto e quando a decisão será revista. Uma release profissional combina evidência antes da implantação, detecção depois dela e capacidade de recuperar o produto caso a hipótese inicial esteja errada.",
        ],
      },
    ],
    caseStudy: {
      title: "Pipeline verde com falha conhecida",
      context: "O smoke principal passou, mas existe um defeito aberto no relatório de despesas aprovado para alguns perfis.",
      reasoning: "O gate automático informa apenas sobre os cenários executados. Avalie alcance do defeito, uso do relatório, mitigação disponível e possibilidade de desligar a função sem afetar dados. Documente quem aceita o risco e qual sinal será observado.",
      conclusion: "A decisão pode ser bloquear, limitar a liberação ou seguir com exceção controlada. Qualquer opção precisa declarar evidência, lacuna, responsável e condição de reavaliação.",
    },
  },
  11: {
    sections: [
      {
        title: "Modelar carga antes de medir números",
        paragraphs: [
          "Teste de performance começa com uma pergunta sobre comportamento esperado: quantas pessoas ou operações, durante quanto tempo, com que distribuição de ações e sob qual limite aceitável? Diferencie baseline, carga típica, pico e crescimento gradual. Um script que repete apenas uma requisição em velocidade máxima mede um cenário diferente de uma jornada de uso. Prepare dados, aquecimento, concorrência, pausas e volume de respostas de modo coerente com o objetivo. Documente máquina geradora, ambiente, versão do sistema e dependências para que comparações posteriores tenham significado.",
          "Execute carga apenas em alvo local ou em ambiente autorizado. Um serviço público sem permissão não é laboratório de performance. Antes de iniciar, confirme limites de usuários virtuais, duração, taxa de requisições e procedimento para interromper o teste. A própria máquina de carga pode virar gargalo e distorcer resultados; observe CPU, memória e rede do gerador quando relevante. Se o ambiente não representa produção, apresente a medição como evidência daquele ambiente e declare as diferenças, em vez de prometer capacidade real do produto.",
        ],
      },
      {
        title: "Interpretar percentis, erros e vazão em conjunto",
        paragraphs: [
          "A média pode esconder experiências ruins concentradas na cauda. O p95 informa que 95% das amostras ficaram até aquele valor; ele não diz que todos os usuários receberam essa latência. Leia p95 e p99 junto de taxa de erro, volume de requisições, vazão e distribuição de carga. Uma latência aparentemente melhor pode ser enganosa se muitas requisições falharam rapidamente. Compare cenários com a mesma configuração, massa e janela de medição antes de atribuir uma mudança a código ou infraestrutura.",
          "Thresholds transformam um objetivo explícito em critério de aprovação, mas o número precisa vir de uma necessidade do produto ou de uma hipótese assumida para o exercício. Não copie valores de outro sistema como se fossem metas universais. Quando um limite falha, procure o ponto onde latência, erros ou throughput mudaram e formule um próximo experimento: aumentar usuários em passos menores, separar endpoints ou observar recurso específico. Um relatório bom apresenta dados, interpretação, limitações e decisão recomendada, não apenas uma captura do terminal.",
        ],
      },
    ],
    caseStudy: {
      title: "p95 melhora enquanto erros aumentam",
      context: "No lab local, o p95 caiu de 420 ms para 260 ms, mas a taxa de erro subiu de 0% para 8% sob carga maior.",
      reasoning: "Não conclua que o sistema ficou mais rápido. Respostas de erro podem terminar cedo e alterar a distribuição. Separe sucesso e falha, compare throughput útil e localize a carga em que os erros começaram.",
      conclusion: "O relatório deve apontar a perda de confiabilidade, declarar o limite do ambiente local e propor um experimento controlado para investigar a causa.",
    },
  },
  12: {
    sections: [
      {
        title: "Construir um argumento de qualidade rastreável",
        paragraphs: [
          "Um case profissional conecta contexto, risco, método, evidência e decisão. Comece pela necessidade do produto e pelo impacto de uma falha; depois mostre por que escolheu cada tipo de verificação. O mapa de risco orienta os cenários manuais, a automação protege repetição relevante, o pipeline devolve feedback e a análise de performance cobre comportamento sob carga. Não apresente esses artefatos como uma coleção de ferramentas. Cada um deve responder uma pergunta e deixar claro como sua conclusão mudaria se a evidência fosse diferente.",
          "Rastreabilidade não exige documentação pesada, mas exige vínculos claros. Relacione risco a verificação, verificação a resultado e resultado a recomendação. Use links, IDs e versões para que outra pessoa encontre a origem da afirmação. Separe evidência observada, hipótese, limite de cobertura e decisão tomada. Se uma parte do projeto foi praticada em ambiente de treino e outra em produto público, identifique os ambientes em cada resultado; uma métrica do lab local não pode ser atribuída ao produto real.",
        ],
      },
      {
        title: "Defender trade-offs e fechar a decisão",
        paragraphs: [
          "Toda investigação tem limite de tempo e acesso. Explique por que priorizou um fluxo, por que uma verificação ficou manual, por que um teste roda em determinada camada e quais sinais fariam você mudar de opinião. Uma apresentação de cinco minutos não comporta todos os detalhes, então selecione uma narrativa verificável: problema, risco, escolha, evidência principal, decisão e próximo passo. Mantenha os artefatos completos disponíveis para revisão, inclusive resultados que contrariaram sua expectativa inicial.",
          "A recomendação final deve ser proporcional ao que se sabe. ‘Pronto para release’ só faz sentido se vier com escopo, condições e risco residual. Se faltam acesso, dados ou ambiente, proponha a menor investigação que reduziria essa incerteza. Evite publicar dados pessoais, segredos, achados de segurança exploráveis ou informações de um produto sem autorização. O valor do case está na qualidade do raciocínio e na possibilidade de outra pessoa auditar a decisão, não em parecer que tudo foi testado.",
        ],
      },
    ],
    caseStudy: {
      title: "Recomendação final com ambientes distintos",
      context: "A pessoa estudou um fluxo público do Broto Space e praticou API e k6 nos labs locais do QA Lab.",
      reasoning: "Apresente evidências públicas apenas para os fluxos observados no site. Use os resultados dos labs para demonstrar técnica, identificando claramente outro sistema e outro ambiente. Liste as verificações privadas que exigiriam acesso concedido.",
      conclusion: "O case pode recomendar próximos testes e uma decisão condicional sobre o escopo observado. Ele não deve afirmar que a API ou a capacidade do Broto Space foram validadas pelos exercícios locais.",
    },
  },
};
