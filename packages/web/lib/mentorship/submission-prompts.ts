export const mentorshipSubmissionPrompts: Record<number, readonly [string, string, string]> = {
  1: ["Qual fluxo do ExpenseFlow você investigou e quem depende dele?", "Quais cinco riscos encontrou e por que priorizou o primeiro?", "Que observação ou evidência sustenta suas hipóteses e o que ainda precisa confirmar?"],
  2: ["Qual foi o charter da sessão e quanto tempo você reservou?", "Que ações e observações registrou, separando fatos de hipóteses?", "O que ficou sem cobertura e qual seria a próxima pergunta de investigação?"],
  3: ["Que regra ou historia você escolheu e quais classes ou condições identificou?", "Quais cenários cobrem caminho feliz, erro e limite, com resultado esperado?", "Como priorizou os cenários e que lacuna de cobertura permaneceu?"],
  4: ["Qual defeito reproduziu e quais são os passos minimos para observa-lo?", "Qual era o resultado esperado, o resultado atual e a evidência coletada?", "Qual impacto você atribui e que decisão de release recomenda?"],
  5: ["Quais fluxos comparou e que risco cada um protege?", "Como avaliou frequência, estabilidade, camada de teste e custo de manutenção?", "O que automatizaria primeiro, o que manteria manual e por que?"],
  6: ["Que comportamento de negócio o smoke protege e como prepara os dados?", "Que seletores, esperas e assertions tornam a execução confiável?", "Como o teste roda isolado e que evidência deixa quando falha?"],
  7: ["Que recurso e regra de negócio da API você testou?", "Quais requests e assertions cobrem sucesso, erro e autorização?", "Como criou ou isolou os dados para outra pessoa reproduzir o fluxo?"],
  8: ["Qual falha instável você observou e que evidência coletou?", "Que hipóteses considerou e qual causa ficou mais bem sustentada?", "O que mudou, qual resultado obteve e que risco ainda permanece?"],
  9: ["Qual e a ordem das verificações do pipeline e por que?", "Que falha bloqueia o pull request e quem recebe o feedback?", "Quais artefatos sobrevivem ao runner para permitir diagnóstico?"],
  10: ["Quais sinais do CI e dos logs você observou, separando fatos de hipóteses?", "Voce liberaria, bloquearia ou mitigaria a release? Qual risco sustenta a decisão?", "Qual gatilho de rollback, responsável e próxima verificação definiu?"],
  11: ["Qual alvo local, fluxo e modelo de carga você usou?", "Como baseline, carga e pico se comparam em p95, throughput e erros?", "Que limite encontrou, que hipótese formulou e qual experimento faria depois?"],
  12: ["Qual risco central orientou o projeto e quais evidências o investigaram?", "Que decisão de release você defende e que limite das evidências precisa declarar?", "Que resultado e aprendizado apresentaria em cinco minutos a outra pessoa?"],
};

export function getMentorshipSubmissionPrompts(week: number) {
  return mentorshipSubmissionPrompts[week] ?? [];
}
