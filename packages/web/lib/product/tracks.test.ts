import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import type { LabProgress } from "./journey";
import { buildTrackProgress, findTrack, learningTracks, trackForLab, trackHasReleasedLab, TRACKS_ENABLED } from "./tracks";

// financas-do-zero, não fluxos-criticos: é a única trilha com Labs liberados
// no lançamento enxuto (101, 103 e 105) — ver [[qa-lab-lancamento-enxuto]].
const track = findTrack("financas-do-zero")!;

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
    expect(result.total).toBe(3);
    expect(result.nextLab?.number).toBe(track.labNumbers[0]);
    expect(result.steps[0].position).toBe(1);
    expect(result.steps.every((step) => step.status === "nao-iniciado")).toBe(true);
  });

  test("pula os concluídos ao sugerir o próximo", () => {
    const result = buildTrackProgress(track, [progress(track.labNumbers[0], "completed"), progress(track.labNumbers[1], "started")]);
    expect(result.completed).toBe(1);
    expect(result.percent).toBe(33);
    expect(result.steps[1].status).toBe("started");
  });

  test("pula um passo agendado ao sugerir o próximo, mesmo se não concluído", () => {
    // 101 liberado e concluído; o próximo passo disponível é o 103.
    const result = buildTrackProgress(track, [progress(101, "completed")]);
    expect(result.nextLab?.number).toBe(103);
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

  test("com as trilhas ligadas, cada Lab encontra seu percurso", () => {
    expect(TRACKS_ENABLED).toBe(true);
    expect(trackForLab(track.labNumbers[3])?.slug).toBe(track.slug);
    expect(trackHasReleasedLab(track)).toBe(true);
  });

  test("Labs liberados ocupam os primeiros passos sem buracos", () => {
    const result = buildTrackProgress(track, []);
    const released = result.steps.filter((step) => step.lab.status === "liberado");
    expect(released.map((step) => step.lab.number)).toEqual([101, 103, 105]);
    expect(released.map((step) => step.position)).toEqual([1, 2, 3]);
  });

  test("a busca por Lab continua correta quando religada", () => {
    const inside = learningTracks.filter((item) => item.labNumbers.includes(track.labNumbers[3]));
    expect(inside.map((item) => item.slug)).toEqual([track.slug]);
    const outsider = labs.find((lab) => !learningTracks.some((item) => item.labNumbers.includes(lab.number)))!;
    expect(learningTracks.some((item) => item.labNumbers.includes(outsider.number))).toBe(false);
  });
});
