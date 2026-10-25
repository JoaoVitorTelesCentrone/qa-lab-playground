export type MentorshipLessonGuide = {
  idea: string;
  example: string;
  apply: string;
};

export const mentorshipLessonGuides: Record<string, MentorshipLessonGuide> = {
  "mentoria.w01.l1": {
    idea: "QA ajuda o time a decidir com menos incerteza. Comece pela pergunta que o teste precisa responder: qual falha poderia prejudicar o usuário ou o negócio? Uma lista grande de casos só tem valor quando esclarece riscos relevantes.",
    example: "No BrotoSpace, uma confirmação de captura precisa corresponder a um pensamento que continua acessível ao retornar. Se o texto desaparecer após recarga, a pessoa perde contexto e confiança no produto.",
    apply: "Escreva três perguntas de risco antes de abrir o ambiente. Para cada uma, diga que observação mudaria sua decisão.",
  },
  "mentoria.w01.l2": {
    idea: "Um briefing descreve objetivos e restrições, mas quase sempre deixa regras implícitas. Procure atores, dados, estados, cálculos e integrações; transforme lacunas em perguntas que podem ser respondidas por produto, código ou experimento.",
    example: "Se o briefing diz que a pessoa transforma pensamentos em ações, pergunte como o contexto é preservado, quem pode acessar o registro e o que significa concluir a ação.",
    apply: "Monte uma tabela com regra conhecida, hipótese e pergunta aberta para captura, organização e retomada no BrotoSpace.",
  },
  "mentoria.w01.l3": {
    idea: "Explorar não e clicar sem direção. Escolha um risco, execute um caminho curto, compare o resultado com a regra e registre evidências. Ao encontrar algo inesperado, teste uma variação para separar defeito de configuração ou dado.",
    example: "Capture o pensamento fictício do caso, relacione-o a um desafio quando o recurso estiver disponível e volte após recarregar. Registre os estados observados antes de concluir que houve falha.",
    apply: "Percorra um fluxo do sistema e produza uma nota com ação, resultado, hipótese e próximo experimento.",
  },
  "mentoria.w02.l1": {
    idea: "Uma sessão exploratoria tem missao, tempo e registro. A missao limita o foco; o registro separa o que você fez do que concluiu. Quando o tempo termina, sintetize cobertura, achados e lacunas.",
    example: "Em vez de explorar todo o BrotoSpace sem objetivo, investigue por 30 minutos se o pensamento pode ser reencontrado depois de interromper e retomar a captura.",
    apply: "Escreva um charter de uma frase e um timebox antes de abrir o Lab Exploratorio.",
  },
  "mentoria.w02.l2": {
    idea: "Heuristicas são perguntas que ampliam o olhar: o que muda nas bordas, com dados ausentes, com repetição, com interrupção ou com dois usuários? Elas não garantem cobertura; ajudam a descobrir onde investigar.",
    example: "No BrotoSpace, varie texto vazio, texto longo, interrupção e retorno em outra sessão; confirme a regra de cada condição antes de classificar um achado.",
    apply: "Escolha três heuristicas, anote o que cada uma revelou e indique uma lacuna que ainda ficou aberta.",
  },
  "mentoria.w03.l1": {
    idea: "Particao de equivalência agrupa entradas com comportamento esperado igual. Valores-limite testam onde a regra troca de classe. Tabelas de decisão ajudam quando varias condições interagem. Use a técnica que esclarece a regra, não todas por obrigacao.",
    example: "Para um limite de 1 a 100, 0, 1, 100 e 101 explicam mais que testar 20 numeros aleatorios dentro da faixa.",
    apply: "Escolha uma regra do Lab de critérios e derive classes, bordas e pelo menos um caso negativo.",
  },
  "mentoria.w03.l2": {
    idea: "Um cenário útil liga contexto, entrada, ação e resultado observavel. A cobertura fica mais forte quando cada caso aponta para uma regra ou risco, e quando casos redundantes são removidos conscientemente.",
    example: "Dizer 'testar valor inválido' e vago. Escreva 'dado valor 0, ao salvar, o sistema impede o registro e explica o limite mínimo'.",
    apply: "Revise seus cenários: identifique a regra protegida, o esperado e a prioridade de cada um.",
  },
  "mentoria.w04.l1": {
    idea: "Um bug report precisa permitir reprodução e decisão. Registre ambiente, precondicoes, passos minimos, resultado atual, resultado esperado e evidência. Diferencie o tamanho do dano da urgência para corrigir.",
    example: "Se o resumo de crescimento diverge dos estados das ações no cenário sintético, mostre conta de estudo, período, contagem esperada e impacto para quem acompanha seu progresso.",
    apply: "Escreva um relato que outra pessoa consiga reproduzir sem falar com você.",
  },
  "mentoria.w04.l2": {
    idea: "Uma recomendação de release combina impacto, alcance, probabilidade, mitigacao e incerteza. O papel de QA e mostrar evidências e opções, deixando clara a decisão proposta e o que ainda precisa ser observado.",
    example: "Uma divergência na contagem de ações concluídas pode bloquear a release; um desalinhamento visual pode seguir com correção planejada, dependendo do contexto.",
    apply: "Para cada defeito relatado, escreva em cinco linhas se liberaria, bloquearia ou investigaria mais, e por que.",
  },
  "mentoria.w05.l1": {
    idea: "Automatize verificações repetidas e valiosas cujo resultado seja observavel. Considere frequência, risco, estabilidade, custo de manter e camada adequada. Uma suite grande de testes frágeis pode reduzir a confiança do time.",
    example: "Uma regra confirmada de conclusão de ação pode ter um teste rápido; uma interface em mudança constante pode pedir exploração manual até a jornada estabilizar.",
    apply: "Pontue dez verificações e escolha três candidatos para automatizar primeiro.",
  },
  "mentoria.w05.l2": {
    idea: "A matriz de candidatos explicita trade-offs. Descreva risco protegido, frequência de execução, dependência de dados, camada sugerida e custo de manutenção. Ela também justifica o que permanece manual.",
    example: "Validar cálculo de total em API pode ser mais rápido e estável que repetir todo o fluxo pela interface; um smoke web ainda pode proteger a jornada crítica.",
    apply: "Preencha a matriz para três candidatos e dois descartes, com uma frase de justificativa para cada decisão.",
  },
  "mentoria.w06.l1": {
    idea: "Um teste executável prepara o estado, executa uma ação e verifica um resultado de negócio. Nomeie o comportamento; evite depender da ordem de outros testes e garanta que uma falha aponte para a etapa relevante.",
    example: "Ao capturar um pensamento fictício no BrotoSpace, verifique que ele pode ser reencontrado com texto e contexto preservados, além de conferir o acionamento do controle.",
    apply: "Escreva um smoke que rode sozinho e explique como os dados iniciais são criados ou restaurados.",
  },
  "mentoria.w06.l2": {
    idea: "Seletores por papel, nome e label acompanham a intenção do usuário. Espere estados observaveis em vez de pausas fixas. Controle massa e dependências para que o mesmo teste passe localmente e no CI.",
    example: "Troque um seletor CSS profundo pelo papel e nome acessível reais do controle de captura. Espere o pensamento específico aparecer sem sleep de dois segundos.",
    apply: "Revise um teste frágil e registre o seletor, a espera e o dado que você alterou.",
  },
  "mentoria.w07.l1": {
    idea: "Uma API é um contrato de comportamento. Valide status, schema, tipos, regra de negócio e efeito persistido. Teste erros esperados; uma resposta 200 com dado de outro usuário é uma falha grave.",
    example: "A partir da privacidade do pensamento no BrotoSpace, modele verificações de autoria e conteúdo. Execute criação e consulta na API Lab local e registre a diferença entre o contrato praticado e a hipótese sobre o produto.",
    apply: "Liste pelo menos uma assertion de transporte, uma de regra e uma de autorização.",
  },
  "mentoria.w07.l2": {
    idea: "Requests encadeados devem criar os próprios dados, guardar identificadores e limpar quando necessario. Tokens e URLs ficam em variaveis do ambiente; assertions explicam a regra e deixam clara a etapa que falhou.",
    example: "Crie um registro, guarde o ID, consulte, altere e remova. Repita uma etapa com campo ausente para conferir a validação.",
    apply: "Monte uma collection reproduzível sem IDs fixos nem segredos no arquivo.",
  },
  "mentoria.w08.l1": {
    idea: "Uma suite saudavel separa intenção de detalhe de interface sem esconder o comportamento. Use fixtures e helpers pequenos para reduzir repetição; acompanhe duração, instabilidade e utilidade dos testes.",
    example: "Um helper que prepara pensamento fictício pode ser útil; um helper genérico que clica em qualquer elemento obscurece o comportamento protegido.",
    apply: "Escolha uma abstração e explique que duplicacao ela remove e que informacao preserva.",
  },
  "mentoria.w08.l2": {
    idea: "Flakiness é sintoma. Recolha trace, log, dados e frequência de falha; formule hipóteses sobre espera, estado compartilhado, seletor ou ambiente. Altere uma variavel por vez e compare execuções.",
    example: "Se a lista demora após salvar, a causa pode ser uma espera incorreta ou uma falha real de persistência. Retry sozinho não distingue as duas.",
    apply: "No Lab de waits, demonstre a causa provavel e documente a evidência antes e depois da correção.",
  },
  "mentoria.w09.l1": {
    idea: "Um pipeline devolve feedback sobre a mudança. Execute verificações rápidas primeiro, mantenha etapas legiveis e escolha gates por risco. Um verde só tem valor se os testes e dados forem confiaveis.",
    example: "Lint e unidade podem rodar antes do E2E; se o E2E falhar, o time precisa saber qual fluxo quebrou e encontrar artefatos da execução.",
    apply: "Desenhe a ordem dos jobs e diga qual falha bloqueia o pull request.",
  },
  "mentoria.w09.l2": {
    idea: "Secrets ficam no provedor de CI e não devem aparecer em logs. Publique traces, screenshots e relatórios mesmo quando testes falham, com retencao e acesso adequados. Paralelismo exige dados isolados.",
    example: "Um workflow pode usar uma etapa de upload com condicao para sempre executar, preservando o relatório de uma falha.",
    apply: "Revise um workflow e marque onde ele usa secrets, coleta evidências e decide bloquear.",
  },
  "mentoria.w10.l1": {
    idea: "Quality gate transforma sinal em decisão. Defina o risco protegido, o limiar, o responsável e a resposta a uma falha. Cobertura e testes verdes não substituem contexto ou avaliação do impacto.",
    example: "Uma falha no fluxo de pagamento pesa mais que uma alteracao visual de baixo impacto, ainda que ambas aparecam como uma linha vermelha no CI.",
    apply: "Para três sinais conflitantes, escreva que evidência pediria antes de liberar.",
  },
  "mentoria.w10.l2": {
    idea: "Rollback e feature flag reduzem o impacto de uma mudança, mas precisam de critério de acionamento, observabilidade e plano para dados já gravados. Uma exceção de gate precisa de motivo, dono e prazo.",
    example: "Se uma nova tela elevar erros, a flag pode desligar a interface; se uma migration alterou dados, voltar o código pode não resolver sozinho.",
    apply: "Defina um gatilho de parada, responsável e verificação depois da recuperação.",
  },
  "mentoria.w11.l1": {
    idea: "Teste de carga comeca com pergunta, modelo de uso e alvo autorizado. Diferencie baseline, carga, pico e stress; limite duração e intensidade. Nunca aponte um experimento para um terceiro sem permissao.",
    example: "Para uma API local, modele a proporção de leitura e escrita e comece com baseline antes de aumentar usuários virtuais.",
    apply: "Escreva objetivo, fluxo, limite e critério de interrupção antes de rodar k6.",
  },
  "mentoria.w11.l2": {
    idea: "A media pode esconder a cauda. Leia p95 ou p99 junto com throughput e taxa de erro. Checks validam respostas; thresholds transformam metas em critério de aprovacao. Compare execuções sob a mesma carga.",
    example: "Media de 200 ms com p95 de 1,8 s e erros crescentes pede investigação, mesmo que o número medio pareca bom.",
    apply: "Monte uma tabela com baseline, carga e pico e escreva uma recomendação sustentada pelos dados.",
  },
  "mentoria.w12.l1": {
    idea: "Um case profissional conta contexto, risco, abordagem, evidência, decisão e aprendizado. Nomear ferramentas não explica o seu raciocinio. Mostre o que mudou por causa da informacao produzida.",
    example: "Em vez de 'usei Playwright e k6', explique que risco cada técnica investigou e como o resultado afetou a recomendação de release.",
    apply: "Escreva um resumo de cinco minutos que outra pessoa consiga questionar e verificar.",
  },
  "mentoria.w12.l2": {
    idea: "Revise a rastreabilidade das evidências, a clareza da decisão e os limites declarados. Remova segredos e dados pessoais; publique apenas material autorizado. O portfolio deve permitir entender sua contribuicao.",
    example: "Se um resultado de carga veio de ambiente local, diga isso claramente e não apresente o número como capacidade de produção.",
    apply: "Confirme evidências de manual, automação, CI e performance antes de enviar o projeto final.",
  },
};

export function getMentorshipLessonGuide(key: string) {
  return mentorshipLessonGuides[key];
}
