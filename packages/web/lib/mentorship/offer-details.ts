export type MentorshipOfferDetails = {
  deliveryFormat: string;
  recordingsPolicy: string;
  weeklyRhythm: string;
  supportResponseHours: number;
  expectedOutcome: string;
};

const textLimits = {
  deliveryFormat: 500,
  recordingsPolicy: 1000,
  weeklyRhythm: 1000,
  expectedOutcome: 1000,
} as const;

export function validatePublicOfferDetails(details: MentorshipOfferDetails, published: boolean) {
  if (!Number.isInteger(details.supportResponseHours) || (details.supportResponseHours !== 0 && (details.supportResponseHours < 1 || details.supportResponseHours > 168))) return "Defina um prazo de primeira resposta entre 1 e 168 horas ou deixe-o vazio enquanto a oferta for rascunho.";
  if (!published) return null;
  if (!details.deliveryFormat.trim() || details.deliveryFormat.length > textLimits.deliveryFormat) return "Informe o formato da mentoria (até 500 caracteres).";
  if (!details.recordingsPolicy.trim() || details.recordingsPolicy.length > textLimits.recordingsPolicy) return "Informe com clareza a disponibilidade das gravações (até 1.000 caracteres).";
  if (!details.weeklyRhythm.trim() || details.weeklyRhythm.length > textLimits.weeklyRhythm) return "Informe o ritmo semanal e os horários já definidos (até 1.000 caracteres).";
  if (details.supportResponseHours < 1) return "Defina um prazo de primeira resposta entre 1 e 168 horas.";
  if (!details.expectedOutcome.trim() || details.expectedOutcome.length > textLimits.expectedOutcome) return "Descreva o resultado esperado sem prometer contratação (até 1.000 caracteres).";
  return null;
}
