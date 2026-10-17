export type AppliedExample = {
  situation: string;
  reasoning: string;
  transfer: string;
  evidence: string;
};

const examples: Record<number, AppliedExample> = {
  1: {
    situation: "Uma despesa aparece como aprovada na lista do ExpenseFlow, mas o total aprovado no relatório não corresponde à soma das despesas aprovadas.",
    reasoning: "Antes de concluir que o cálculo falhou, confira o perfil selecionado, o status e os valores de cada despesa visível. Compare a soma manual com o relatório e repita após restaurar os dados de treino. O risco é uma decisão de reembolso baseada em número incorreto.",
    transfer: "Percorra lista, aprovações e relatórios. Anote quais despesas entram no total e que observação confirmaria a divergência.",
    evidence: "No mapa de risco, registre evento, impacto, prioridade e uma pergunta de negócio para esse fluxo.",
  },
  2: {
    situation: "Voce tem 40 minutos para explorar uma tela de agendamento e percebe que alterar a data pode manter um horario indisponivel selecionado.",
    reasoning: "Uma sessão exploratoria precisa de missao e limite. Escolha investigar mudança de data e disponibilidade; registre o que fez, o que viu e o que ainda e hipótese. Nao transforme toda observação em defeito sem confirmar a regra.",
    transfer: "No Lab Exploratorio, escreva o charter antes de abrir a interface. Use as notas para decidir qual area merece a próxima sessão.",
    evidence: "Entregue charter, notas reproduzíveis, achados e uma próxima pergunta de investigação.",
  },
  3: {
    situation: "Uma regra aceita valores de 1 a 100. Testar apenas 50 não mostra o que acontece nas bordas.",
    reasoning: "Separe entradas validas, abaixo do mínimo e acima do máximo. Teste 0, 1, 100 e 101; depois considere vazio e formato inválido. Cada caso precisa mostrar que regra protege, não apenas aumentar a contagem de testes.",
    transfer: "No Lab de critérios, extraia uma regra da historia e monte uma pequena tabela com entrada, resultado esperado e risco coberto.",
    evidence: "Entregue cenários de caminho feliz, erro e limite, com prioridade justificada.",
  },
  4: {
    situation: "Ao somar as despesas aprovadas visíveis, você obtém um valor diferente do total aprovado exibido no relatório.",
    reasoning: "Um relato útil permite que outra pessoa reproduza o problema. Informe estado inicial, passos minimos, resultado observado e regra que sustenta o esperado. Diferencie severidade do impacto de negócio e prioridade de correção.",
    transfer: "Use o template de bug report para registrar perfil, despesas consideradas, soma esperada e total exibido.",
    evidence: "Entregue dois relatos reproduzíveis e uma recomendação de release para cada risco.",
  },
  5: {
    situation: "O time quer automatizar todos os caminhos do ExpenseFlow e também uma área hipotética cujo comportamento ainda muda toda semana.",
    reasoning: "Automacao compensa quando protege risco frequente com resultado observavel e custo de manutenção aceitavel. Um cálculo financeiro estável pode ser bom candidato; uma exploração visual em area instável pode continuar manual.",
    transfer: "Compare fluxos por risco, repetição, estabilidade e camada de teste. Escreva por que automatizaria alguns e adiaria outros.",
    evidence: "Entregue uma matriz de candidatos com três escolhas, dois descartes e critérios claros.",
  },
  6: {
    situation: "Um teste clica no botão Salvar e espera dois segundos antes de procurar a confirmacao. Ele passa localmente e falha no CI.",
    reasoning: "O teste precisa esperar o estado que prova a regra, como a despesa persistida ou uma mensagem de sucesso, e usar um seletor ligado ao nome acessivel do controle. Uma pausa fixa não garante que a operacao terminou.",
    transfer: "No workspace de automação, escreva um smoke com preparacao de dados, ação e assertions sobre o resultado de negócio.",
    evidence: "Entregue a spec e explique como ela isola dados e ajuda a diagnosticar uma falha.",
  },
  7: {
    situation: "Uma API responde 200 ao consultar uma despesa, mas entrega um registro pertencente a outro usuário.",
    reasoning: "Status HTTP sozinho não prova contrato. Verifique campos, regra de negócio, persistência e autorização por objeto. O teste deve usar duas identidades de treino e mostrar que a segunda não acessa o recurso da primeira.",
    transfer: "No API Playground, encadeie criação e consulta, depois repita com dado inválido e com outro usuário quando o ambiente permitir.",
    evidence: "Entregue requests reproduzíveis e assertions para sucesso, erro e isolamento de acesso.",
  },
  8: {
    situation: "Um teste de interface falha uma vez em dez execuções ao carregar uma lista após salvar um item.",
    reasoning: "Antes de adicionar retry, compare trace, dados e tempo de resposta. A falha pode vir de seletor frágil, espera incorreta, estado compartilhado ou problema real do produto. Mude uma causa por vez e compare a evidência.",
    transfer: "No Lab de waits, identifique uma espera frágil e substitua por uma condicao observavel.",
    evidence: "Entregue causa provavel, correção, evidência antes e depois e risco removido.",
  },
  9: {
    situation: "Um pull request falha no teste E2E, mas o runner apaga screenshots e logs ao terminar.",
    reasoning: "Um pipeline só oferece feedback se a falha puder ser investigada. Rode verificações rápidas primeiro e publique os artefatos mesmo quando a etapa de teste falhar. Defina quais falhas bloqueiam a mudança.",
    transfer: "No Lab de CI/CD, desenhe jobs, ordem, gate e coleta de evidências para esse pull request.",
    evidence: "Entregue um workflow legivel e o caminho para diagnosticar uma falha.",
  },
  10: {
    situation: "O pipeline fica vermelho por um teste instável enquanto logs mostram aumento real de erros no fluxo de pagamento.",
    reasoning: "Nao trate todo vermelho da mesma forma. Preserve logs, classifique cada sinal e considere impacto e reversibilidade. A instabilidade do teste pede investigação; o aumento de erro no pagamento pode justificar bloquear ou reverter a release.",
    transfer: "No Lab de logs, separe fatos de hipóteses e escreva a decisão que tomaria com a evidência disponivel.",
    evidence: "Entregue diagnóstico, risco residual, responsável e gatilho de rollback.",
  },
  11: {
    situation: "Um teste de carga mostra media de 200 ms, p95 de 1,8 s e erros quando a taxa de chegada sobe.",
    reasoning: "A media esconde a experiencia da cauda. Compare percentis, taxa de erro e throughput com o objetivo definido antes da execução. Nao aumente a carga sem confirmar alvo autorizado e limites do ambiente.",
    transfer: "No lab local de performance, execute baseline, carga gradual e pico controlado para comparar o comportamento.",
    evidence: "Entregue script, resultados comparáveis, thresholds e uma recomendação sustentada pelos dados.",
  },
  12: {
    situation: "A release tem exploração manual, smoke automatizado, pipeline verde e um limite de performance conhecido.",
    reasoning: "Uma decisão defensavel conecta cada evidência a um risco. Explique o que foi coberto, o que continua incerto e que mitigacao cabe se a release seguir. Mais ferramentas na lista não substituem essa linha de raciocinio.",
    transfer: "Reuna as evidências das semanas anteriores no Release Challenge e prepare uma apresentacao curta para defender a decisão.",
    evidence: "Entregue um case com contexto, risco, abordagem, resultado, limites e próximo passo.",
  },
};

export function getAppliedExample(week: number) {
  return examples[week];
}
