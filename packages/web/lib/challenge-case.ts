import { isChallengeReady, type ChallengeDeliverables } from "./challenge-deliverables";
import { validChallengeDeliverables } from "./challenge-account";

export const CHALLENGE_CASE_TITLE = "Investigação de QA no ExpenseFlow";
export const CHALLENGE_CASE_SUMMARY = "Este case reúne os bug reports, cenários BDD e decisões de teste registrados durante o desafio ExpenseFlow.";

export type ChallengeCase = {
  title: string;
  summary: string;
  snapshot: ChallengeDeliverables;
  published: boolean;
  updatedAt: string;
};

export function validChallengeCaseInput(title: unknown, summary: unknown) {
  return typeof title === "string" && title.trim().length >= 3 && title.trim().length <= 120
    && typeof summary === "string" && summary.trim().length >= 40 && summary.trim().length <= 1000;
}

export function publicCaseFromRow(row: { title: string; summary: string; snapshot: unknown; published: boolean; updated_at: string } | null): ChallengeCase | null {
  if (!row || !row.published || !validChallengeDeliverables(row.snapshot) || !isChallengeReady(row.snapshot)) return null;
  return { title: row.title, summary: row.summary, snapshot: row.snapshot, published: true, updatedAt: row.updated_at };
}
