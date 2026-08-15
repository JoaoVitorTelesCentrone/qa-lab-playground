import { describe, expect, test } from "bun:test";
import { SEMANA_1, featuredLabNumbers, isLabReleased, labs, tracks } from "./catalog";

describe("QA Lab Playground catalog", () => {
  test("cadastra os 30 labs do primeiro build", () => {
    expect(labs).toHaveLength(30);
    expect(new Set(labs.map((lab) => lab.number)).size).toBe(30);
    expect(SEMANA_1).toBe("2026-08-10");
    expect(labs[0].route).toBe("/shop/products");
    expect(labs[4].route).toBe("/labs/waits");
    expect(labs[20].route).toBe("/labs/api-crud");
    expect(labs[29].route).toBe("/labs/api-crud");
    expect(labs[4].releaseDate).toBe("2026-09-07");
    expect(labs[29].releaseDate).toBe("2027-03-01");
  });

  test("mantem duas trilhas e conteudo semanal no registry", () => {
    expect(tracks).toHaveLength(2);
    const ready = labs.filter((lab) => featuredLabNumbers.includes(lab.number));
    expect(ready).toHaveLength(4);
    expect(ready.every((lab) => lab.postPrompt.includes("#QALab"))).toBe(true);
    expect(labs.every((lab) => lab.content.postSegunda && lab.content.blogQuinta && lab.content.videoSabado)).toBe(true);
  });

  test("gate de release usa a semana do lab", () => {
    expect(isLabReleased(labs[0], new Date("2026-08-10T12:00:00.000Z"))).toBe(true);
    expect(isLabReleased(labs[4], new Date("2026-08-31T12:00:00.000Z"))).toBe(false);
    expect(isLabReleased(labs[4], new Date("2026-09-07T12:00:00.000Z"))).toBe(true);
  });
});
