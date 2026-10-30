import { describe, expect, test } from "bun:test";
import { validatePublicOfferDetails, type MentorshipOfferDetails } from "./offer-details";

const complete: MentorshipOfferDetails = {
  deliveryFormat: "Encontros ao vivo e prática assíncrona",
  recordingsPolicy: "Gravações publicadas conforme a agenda da turma.",
  weeklyRhythm: "Uma unidade prática e um encontro ao vivo por semana.",
  supportResponseHours: 72,
  expectedOutcome: "Concluir entregas revisadas e construir um case demonstrável; não há promessa de contratação.",
};

describe("public mentorship offer details", () => {
  test("allows drafts without public promises", () => {
    expect(validatePublicOfferDetails({ ...complete, deliveryFormat: "", supportResponseHours: 0 }, false)).toBeNull();
  });

  test("requires every operating detail before publication", () => {
    expect(validatePublicOfferDetails({ ...complete, recordingsPolicy: "" }, true)).toMatch(/gravações/i);
    expect(validatePublicOfferDetails({ ...complete, supportResponseHours: 0 }, true)).toMatch(/prazo/i);
  });

  test("rejects invalid support windows even on drafts", () => {
    expect(validatePublicOfferDetails({ ...complete, supportResponseHours: 70000 }, false)).toMatch(/prazo/i);
  });

  test("accepts a complete offer inside the response window", () => {
    expect(validatePublicOfferDetails(complete, true)).toBeNull();
  });
});
