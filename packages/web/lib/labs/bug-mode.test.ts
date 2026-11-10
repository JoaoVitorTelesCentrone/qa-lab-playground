import { describe, expect, test } from "bun:test";
import { bugModeHref, resolveBug } from "./bug-mode";

describe("resolveBug", () => {
  test("?bug=1 liga o bug padrão do Lab", () => {
    for (const value of ["1", "true", "on", " ON "]) expect(resolveBug(value, "wrong-total")).toBe("wrong-total");
  });
  test("ids específicos continuam valendo", () => {
    expect(resolveBug("contract-broken", "delete-without-auth")).toBe("contract-broken");
  });
  test("sem bug, 0 ou false é o modo correto", () => {
    for (const value of [null, undefined, "", "0", "false", "off"]) expect(resolveBug(value, "x")).toBeNull();
  });
});

describe("bugModeHref", () => {
  test("liga e desliga preservando os outros parâmetros", () => {
    expect(bugModeHref("/labs/waits", "?delay=900", true)).toBe("/labs/waits?delay=900&bug=1");
    expect(bugModeHref("/labs/waits", "?delay=900&bug=infinite-loading", false)).toBe("/labs/waits?delay=900");
    expect(bugModeHref("/labs/login", "", false)).toBe("/labs/login");
  });
});
