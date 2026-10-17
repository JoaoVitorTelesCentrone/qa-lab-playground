type MegazordCheck = { question: string; answer: string };

/** Perguntas de revisão para os aprofundamentos do Megazord 2026. */
export const megazord2026Checks: Record<number, readonly MegazordCheck[]> = {
  1: [
    { question: "Por que um teste aprovado não prova que o produto tem qualidade?", answer: "O teste observa condições e oráculos limitados. Pode haver riscos, contextos ou necessidades não representados; aprovação descreve só o que foi verificado." },
    { question: "Como escolher um oráculo quando o requisito está incompleto?", answer: "Registre a lacuna e consulte fontes como regra de negócio, pessoa responsável, propriedade invariável ou sistema de referência. Não transforme uma suposição em resultado esperado." },
  ],
  2: [
    { question: "O que shift left e shift right acrescentam ao trabalho de QA?", answer: "Shift left antecipa perguntas, exemplos e risco antes do código; shift right usa sinais após deploy para detectar e recuperar falhas que os ambientes anteriores não revelaram." },
    { question: "O que torna uma sessão exploratória reproduzível sem engessá-la?", answer: "Charter, time-box, dados e condições registradas, notas de observação e um resumo de cobertura, hipótese e próxima pergunta." },
  ],
  3: [
    { question: "Como tratar uma ambiguidade que muda o resultado esperado?", answer: "Transforme-a em pergunta explícita, mostre exemplos de fronteira e confirme a regra antes de classificar o comportamento como defeito." },
    { question: "Qual relação útil existe entre bug report e rastreabilidade?", answer: "O relato deve conectar a observação ao ambiente, requisito ou risco, evidência e decisão, para outra pessoa reproduzir e entender o impacto." },
  ],
  4: [
    { question: "Por que um smoke e um teste de aceitação do usuário não são equivalentes?", answer: "Smoke confere rapidamente caminhos essenciais; UAT avalia se o fluxo atende ao uso acordado. Objetivo, participantes e evidências são diferentes." },
    { question: "Como reduzir uma matriz de compatibilidade sem escolher combinações ao acaso?", answer: "Priorize por perfil de uso, telemetria, mudança e impacto; registre a cobertura excluída e o risco que permanece." },
  ],
  5: [
    { question: "Quando vale aprender uma segunda linguagem de programação para QA?", answer: "Quando o produto, a equipe ou a especialização pede. Primeiro construa autonomia numa linguagem para ler, escrever e depurar testes." },
    { question: "Que pergunta ajuda a selecionar a camada de um teste?", answer: "Qual é a camada mais barata e confiável que observa o risco com fidelidade suficiente? Considere também o que ela não consegue provar." },
  ],
  6: [
    { question: "O que verificar além do status HTTP ao investigar uma falha de interface?", answer: "Request e resposta, headers, conteúdo, timing, estado persistido, erros no Console e armazenamento/sessão no contexto do navegador." },
    { question: "Quando um mock de rede é útil e qual limite deve ser declarado?", answer: "Ele permite controlar uma resposta ou falha para testar o comportamento da interface; não prova que o serviço real respeita o contrato." },
  ],
  7: [
    { question: "O que um teste de contrato do consumidor verifica que um schema sozinho pode não verificar?", answer: "Interações concretas que o consumidor usa e espera do provedor. O schema descreve formatos mais amplos e não valida sozinho todas essas expectativas." },
    { question: "Como verificar que uma operação de API persistiu corretamente?", answer: "Consulte a resposta e o estado após a operação, compare os dados próprios de teste e verifique efeitos indiretos ou duplicação em repetição." },
  ],
  8: [
    { question: "Por que uma repetição automática não é uma correção suficiente para flakiness?", answer: "Ela pode mascarar estado compartilhado, corrida, dependência externa ou espera frágil. Identifique a causa e preserve evidência antes de alterar a suíte." },
    { question: "Que cuidados uma simulação de falha de dependência exige?", answer: "Alvo autorizado, escopo pequeno, limite de impacto, critério de interrupção e confirmação de recuperação; comece em ambiente controlado." },
  ],
  9: [
    { question: "Que evidência deve sobreviver quando um job de CI falha?", answer: "Log e artefatos necessários ao diagnóstico, como relatório, screenshot ou trace, com retenção e acesso definidos e sem secrets ou dados pessoais." },
    { question: "Por que a execução em Docker não garante que local e CI sejam idênticos?", answer: "Imagem, dependências, variáveis, recursos, rede e dados ainda podem diferir; registre versões e configuração relevante." },
  ],
  10: [
    { question: "Por que autenticação bem-sucedida não prova autorização correta?", answer: "A identidade pode ser válida e ainda tentar acessar um recurso ou ação fora do seu escopo. Teste papéis, propriedade do objeto e efeitos posteriores." },
    { question: "Que sinal cada um entre log, métrica e trace ajuda a investigar?", answer: "Log descreve evento, métrica resume comportamento agregado e trace acompanha o percurso de uma requisição entre componentes." },
  ],
  11: [
    { question: "Por que avaliar performance e acessibilidade com uma única nota é insuficiente?", answer: "São perguntas e evidências diferentes. Desempenho combina latência, throughput e erro; acessibilidade exige tarefas e modos de interação, além de automação." },
    { question: "Quando um teste mobile precisa de aparelho real?", answer: "Quando hardware, permissões, interrupções ou comportamento do sistema operacional forem relevantes e não estiverem representados adequadamente no emulador." },
  ],
  12: [
    { question: "Qual cuidado deve acompanhar um cenário de teste sugerido por IA?", answer: "Verifique regra, cobertura e plausibilidade; não envie código ou dados sem autorização e não trate texto gerado como evidência de execução." },
    { question: "O que torna um portfólio Megazord convincente?", answer: "A ligação entre riscos, escolhas de teste, evidências, decisões, lacunas e execução reproduzível, com dados e segredos protegidos." },
  ],
};
