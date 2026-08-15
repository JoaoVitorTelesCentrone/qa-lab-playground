import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import type { LabProgress } from "./journey";
import { buildTrackProgress, findTrack, learningTracks, trackForLab } from "./tracks";

const track = findTrack("fluxos-criticos")!;

function progress(labNumber: number, status: LabProgress["status"]): LabProgress {
  const lab = labs.find((item) => item.number === labNumber)!;
  return { lab, status, submissions: status === "completed" ? 1 : 0, updatedAt: "2026-08-10T10:00:00Z" };
}

describe("trilha de aprendizagem", () => {
  test("a trilha de fluxos críticos tem 10 Labs, todos no catálogo", () => {
    expect(track.labNumbers).toHaveLength(10);
    expect(track.labNumbers.every((number) => labs.some((lab) => lab.number === number))).toBe(true);
  });

  test("não repete Lab dentro da trilha", () => {
    expect(new Set(track.labNumbers).size).toBe(track.labNumbers.length);
  });

  test("começa zerada e aponta para o primeiro passo", () => {
    const result = buildTrackProgress(track, []);
    expect(result.completed).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.total).toBe(10);
    expect(result.nextLab?.number).toBe(track.labNumbers[0]);
    expect(result.steps[0].position).toBe(1);
    expect(result.steps.every((step) => step.status === "nao-iniciado")).toBe(true);
  });

  test("pula os concluídos ao sugerir o próximo", () => {
    const result = buildTrackProgress(track, [progress(track.labNumbers[0], "completed"), progress(track.labNumbers[1], "started")]);
    expect(result.completed).toBe(1);
    expect(result.percent).toBe(10);
    expect(result.nextLab?.number).toBe(track.labNumbers[1]);
    expect(result.steps[1].status).toBe("started");
  });

  test("trilha inteira concluída não sugere próximo Lab", () => {
    const result = buildTrackProgress(track, track.labNumbers.map((number) => progress(number, "completed")));
    expect(result.percent).toBe(100);
    expect(result.nextLab).toBeNull();
  });

  test("progresso de um Lab fora da trilha não conta", () => {
    const outsider = labs.find((lab) => !track.labNumbers.includes(lab.number))!;
    const result = buildTrackProgress(track, [progress(outsider.number, "completed")]);
    expect(result.completed).toBe(0);
  });

  test("encontra a trilha a partir de um Lab dela", () => {
    expect(trackForLab(track.labNumbers[3])?.slug).toBe(track.slug);
    const outsider = labs.find((lab) => !learningTracks.some((item) => item.labNumbers.includes(lab.number)))!;
    expect(trackForLab(outsider.number)).toBeUndefined();
  });
});
