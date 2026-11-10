import { describe, expect, test } from "bun:test";
import { releasedLabsInOrder } from "@/lib/playground/catalog";
import { LAB_TRACKS, labTrackOf, PLAYGROUND_LABS } from "./lab-tracks";

describe("trilhas dos Labs", () => {
  test("todo Lab liberado cai em uma das 6 trilhas", () => {
    const orphans = releasedLabsInOrder.filter((lab) => !labTrackOf(lab)).map((lab) => `${lab.number} ${lab.requiredFeature}`);
    expect(orphans).toEqual([]);
  });

  test("toda trilha tem pelo menos um Lab", () => {
    for (const track of LAB_TRACKS) {
      const count = releasedLabsInOrder.filter((lab) => labTrackOf(lab) === track.id).length;
      expect(count, track.id).toBeGreaterThan(0);
    }
  });

  test("Labs de pipeline vão para CI mesmo morando numa área de ferramenta", () => {
    expect(labTrackOf({ number: 232, requiredFeature: "Playwright" })).toBe("ci");
    expect(labTrackOf({ number: 221, requiredFeature: "Playwright" })).toBe("ui");
  });

  test("Labs do playground apontam para rotas de /labs", () => {
    for (const lab of PLAYGROUND_LABS) expect(lab.href.startsWith("/labs/")).toBe(true);
  });
});
