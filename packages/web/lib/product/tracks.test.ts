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
  test("há uma trilha por ambiente de prática", () => {
    expect(learningTracks.map((item) => item.appId).sort()).toEqual(["agendamentos", "crm", "financas", "qa-lab"]);
    expect(new Set(learningTracks.map((item) => item.slug)).size).toBe(learningTracks.length);
  });

  test("toda trilha tem 10 Labs, todos no catálogo e sem repetir", () => {
    for (const item of learningTracks) {
      expect(item.labNumbers).toHaveLength(10);
      expect(item.labNumbers.every((number) => labs.some((lab) => lab.number === number))).toBe(true);
      expect(new Set(item.labNumbers).size).toBe(item.labNumbers.length);
    }
  });

  test("um Lab não aparece em duas trilhas", () => {
    const all = learningTracks.flatMap((item) => item.labNumbers);
    expect(new Set(all).size).toBe(all.length);
  });

  test("os Labs da trilha apontam para o ambiente da trilha", () => {
    for (const item of learningTracks.filter((candidate) => candidate.appId !== "qa-lab")) {
      const routes = item.labNumbers.map((number) => labs.find((lab) => lab.number === number)!.route);
      expect(routes.every((route) => route.startsWith(`/${item.appId}`))).toBe(true);
    }
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
