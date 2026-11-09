// Quem pode abrir um Lab.
//
// O catálogo público tem só os Labs liberados (a amostra grátis). Quem está
// matriculado na mentoria (programa v2) abre também os Labs que são prática de
// uma aula ou reforço de um módulo — sem isso a aula apontaria para um Lab que
// manda o aluno para a lista de espera.
//
// Servidor apenas: a matrícula é lida com a chave de serviço.

import type { Lab } from "@/lib/playground/catalog";
import { mentorshipLabNumbers } from "@/lib/mentorship/lesson-labs";
import { getEnrollmentForUser } from "@/lib/mentorship/access";

export type LabViewer = { mentee: boolean };

export function canOpenLab(lab: Pick<Lab, "number" | "status">, viewer: LabViewer) {
  return lab.status === "liberado" || (viewer.mentee && mentorshipLabNumbers.has(lab.number));
}

/** Matrícula v2 que dá acesso aos Labs da mentoria. Falha de leitura = sem acesso extra. */
export async function isMentee(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  try {
    const enrollment = await getEnrollmentForUser(userId);
    return Boolean(enrollment && enrollment.programVersion === "v2" && ["active", "paused", "completed"].includes(enrollment.status));
  } catch {
    return false;
  }
}

export async function labViewer(userId: string | null | undefined): Promise<LabViewer> {
  return { mentee: await isMentee(userId) };
}
