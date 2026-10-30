export type AdmissionDecision = "confirmed" | "waitlisted" | "rejected";

export function admissionDecisionMessage(decision: AdmissionDecision) {
  if (decision === "confirmed") return {
    title: "Sua vaga na Mentoria QA Lab está confirmada",
    body: "Sua matrícula está ativa. Faça o diagnóstico para começar sua jornada.",
    href: "/mentoria/diagnostico",
  };
  if (decision === "waitlisted") return {
    title: "Sua inscrição está na lista de espera",
    body: "Ainda não há uma vaga confirmada para você. A equipe entrará em contato se a disponibilidade mudar; não faça pagamento enquanto não receber uma nova oferta.",
    href: "/mentoria/inscricao",
  };
  return {
    title: "Atualização sobre sua inscrição na Mentoria QA Lab",
    body: "Não foi possível incluir você nesta turma. Essa decisão não altera seu acesso ao QA Lab. Consulte as próximas turmas ou fale com a equipe se precisar de esclarecimento.",
    href: "/mentoria",
  };
}
