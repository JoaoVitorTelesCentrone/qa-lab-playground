type CheckQuestion = { question: string; answer: string };

/** Perguntas que avaliam interpretação dos tópicos incorporados do roadmap. */
export const roadmapQAChecks: Record<number, readonly CheckQuestion[]> = {
  1: [
    { question: "Por que o total de bugs por sprint não deve ser usado sozinho como nota de qualidade?", answer: "O total varia conforme escopo, momento de descoberta e qualidade da investigação. Segmente por origem, impacto, escapes, reincidência e relacione a uma decisão do time." },
    { question: "Que diferença prática existe entre Definition of Ready e Definition of Done?", answer: "Ready sinaliza que há contexto suficiente para iniciar o trabalho; Done define evidências e condições para considerar o resultado concluído. São acordos do time, não certificados de qualidade." },
    { question: "Uma investigação caixa-preta e uma caixa-branca respondem à mesma pergunta?", answer: "Podem se complementar, mas a caixa-preta observa entradas e efeitos visíveis; a caixa-branca usa a estrutura interna para orientar caminhos e condições. O risco determina qual perspectiva falta." },
  ],
  2: [
    { question: "Quando há itens parados em revisão, o que medir antes de aumentar a capacidade de QA?", answer: "Tempo em fila e em execução por etapa, idade dos itens e tamanho do trabalho. Isso mostra onde o fluxo está limitado e evita otimizar uma etapa que não é gargalo." },
    { question: "Scrum ou Kanban garante que os critérios de teste estejam claros?", answer: "Não. O método organiza o trabalho; a equipe precisa discutir regra, risco e evidência nos pontos de decisão adequados." },
    { question: "Como escolher ambientes de compatibilidade sem testar todas as combinações?", answer: "Use público, telemetria, contrato e histórico de risco para selecionar combinações representativas; documente o que ficou fora." },
  ],
  3: [
    { question: "Quando um passo a passo é mais útil que um cenário Gherkin?", answer: "Quando a preparação e os dados precisam ser precisos para reprodução. Gherkin expressa exemplos de comportamento em linguagem compartilhada e não deve virar uma sequência de cliques técnicos." },
    { question: "TDD e BDD são nomes diferentes para escrever casos manuais?", answer: "Não. TDD é um ciclo de desenvolvimento guiado por testes; BDD é uma prática de descobrir e especificar comportamento com exemplos compartilhados." },
    { question: "Como diferenciar verificação de validação?", answer: "Verificação compara com especificação e critérios; validação examina se a solução atende à necessidade real de quem vai usá-la." },
  ],
  4: [
    { question: "Qual informação torna uma captura de tela útil como evidência?", answer: "Contexto, ambiente, dado, passos e resultado esperado/atual; para alguns problemas, vídeo curto, request ou resposta complementam a imagem." },
    { question: "O que distingue smoke de regressão?", answer: "Smoke é um conjunto curto para saber se caminhos essenciais estão disponíveis. Regressão examina efeitos de uma mudança nas regras e áreas relacionadas." },
    { question: "Por que manter uma fonte de referência para casos e execuções?", answer: "Para evitar versões divergentes e manter ligações entre regra, teste, resultado e decisão, independentemente da ferramenta escolhida." },
  ],
  5: [
    { question: "Em Arrange, Act e Assert, o que deve aparecer no Assert?", answer: "O resultado observável que prova a regra, incluindo ausência de efeito indevido quando necessário; não apenas que a ação foi clicada." },
    { question: "Por que a pirâmide não deve ser tratada como uma proporção fixa?", answer: "A distribuição depende do sistema e do risco. O princípio é usar a camada de menor custo que ainda observe o comportamento necessário." },
    { question: "Quando uma jornada completa no navegador agrega valor?", answer: "Quando a interação entre interface, serviço e estado precisa ser observada. Regras combinatórias costumam ser mais rápidas de cobrir em camadas inferiores." },
  ],
  6: [
    { question: "Se o botão não dispara request, que evidência ajuda a separar problema visual e de JavaScript?", answer: "Elements mostra se o botão está habilitado ou coberto; Console mostra exceções; Network confirma se a chamada aconteceu. Repita com ações e condições registradas." },
    { question: "Responsividade e adaptabilidade são equivalentes?", answer: "Não. Responsividade considera reorganização conforme espaço; adaptabilidade inclui outras condições de uso, como entrada, orientação, zoom e preferências." },
    { question: "Qual camada faz sentido para uma regra de cálculo em uma aplicação web?", answer: "A regra pode ser coberta em teste unitário; integração verifica persistência e API; navegador cobre a jornada que depende da interface." },
  ],
  7: [
    { question: "Swagger/OpenAPI descreve todas as regras de negócio da API?", answer: "Não necessariamente. A especificação descreve operações e formatos; regras e efeitos podem exigir exemplos, contrato adicional ou comportamento observado." },
    { question: "Qual a diferença entre autenticação e autorização?", answer: "Autenticação identifica a chamada; autorização decide se a identidade pode executar a ação no recurso em questão." },
    { question: "Uma resposta 403 prova que nenhum dado foi exposto?", answer: "Não. Verifique corpo, headers e estado após a tentativa; resposta de erro pode ainda conter informação indevida ou ter produzido efeito." },
  ],
  8: [
    { question: "Que comportamento deve continuar explícito após criar um Page Object?", answer: "A regra e as assertions importantes. O Page Object deve concentrar interação repetida sem esconder o propósito do teste." },
    { question: "Quando um Builder melhora dados de teste?", answer: "Quando cria defaults válidos e variações claras, sem esconder campos importantes, IDs compartilhados ou dependências de estado." },
    { question: "Quando uma Chain of Responsibility é exagero?", answer: "Quando a sequência é fixa e curta. Uma função direta costuma ser mais legível se não há cadeia variável de responsáveis." },
  ],
  9: [
    { question: "Que informações devem acompanhar um PR que altera uma regra crítica?", answer: "Intenção, risco, critérios, testes executados, evidência, limitações e instruções de reprodução." },
    { question: "Um pipeline verde significa que a mudança está livre de defeitos?", answer: "Significa que as verificações configuradas passaram nas condições executadas. O risco não coberto continua existindo." },
    { question: "Por que não usar o tempo de PR como meta individual isolada?", answer: "A métrica mistura fila, revisão e tamanho do trabalho; pode induzir pressa ou mudanças artificiais. Use-a para investigar o fluxo e suas causas." },
  ],
  10: [
    { question: "Como logs e métricas se complementam num incidente?", answer: "Métricas mostram padrão e escala ao longo do tempo; logs ajudam a reconstruir eventos específicos e correlacionar chamadas." },
    { question: "O que deve ser feito quando um secret aparece em evidência compartilhada?", answer: "Restringir a evidência, seguir o procedimento da organização e avaliar revogação/rotação; depois remover o dado dos registros compartilháveis." },
    { question: "Por que teste de vulnerabilidade precisa de escopo autorizado?", answer: "A atividade pode afetar disponibilidade e dados. Ambiente, alvo, intensidade e limites precisam estar acordados antes da execução." },
  ],
  11: [
    { question: "O que p95 alto com throughput estável e aumento de erros sugere?", answer: "Um limite no cenário pode estar próximo, mas não revela a causa. Correlacione com telemetria e ambiente antes de recomendar otimização." },
    { question: "Que tipo de verificação de performance cabe no pull request?", answer: "Um smoke curto, estável e de baixa intensidade para detectar regressão evidente. Ele não substitui um teste de capacidade em ambiente preparado." },
    { question: "O que um pipeline deve guardar quando um threshold falha?", answer: "Versão, alvo, perfil, duração, checks, percentis, throughput, erros e a saída que permite investigar o resultado." },
  ],
  12: [
    { question: "Que conteúdo não deve ser enviado a uma IA externa sem autorização?", answer: "Código proprietário, segredos, dados de clientes e documentos internos; consulte a política da organização e use conteúdo seguro." },
    { question: "Como apresentar um case sem publicar código ou dados reais?", answer: "Use dados fictícios ou anonimizados, descreva o raciocínio e mostre evidência autorizada, com contexto e limites claros." },
    { question: "Como comparar caminhos de carreira em QA?", answer: "Compare responsabilidades e competências em vagas reais com entregas demonstráveis e lacunas próprias, sem inferir critérios internos de uma empresa." },
  ],
};
