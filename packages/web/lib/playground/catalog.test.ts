import { describe, expect, test } from "bun:test";
import { featuredLabNumbers, labs, tracks } from "./catalog";

describe("QA Lab Playground catalog", () => {
  test("cadastra os 100 labs navegaveis", () => {
    expect(labs).toHaveLength(100);
    expect(new Set(labs.map((lab) => lab.number)).size).toBe(100);
    expect(labs[0].route).toBe("/labs/login");
    expect(labs[4].route).toBe("/labs/waits");
    expect(labs[20].route).toBe("/labs/api-crud");
    expect(labs[40].route).toBe("/labs/exploratorio");
    expect(labs[88].route).toBe("/labs/acessibilidade");
  });

  test("mantem seis trilhas e cinco labs principais prontos", () => {
    expect(tracks).toHaveLength(6);
    const ready = labs.filter((lab) => featuredLabNumbers.includes(lab.number));
    expect(ready).toHaveLength(5);
    expect(ready.every((lab) => lab.status === "pronto")).toBe(true);
    expect(ready.every((lab) => lab.postPrompt.includes("#QALab"))).toBe(true);
  });
});
