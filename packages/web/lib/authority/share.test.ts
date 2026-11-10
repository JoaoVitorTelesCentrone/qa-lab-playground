import { describe, expect, test } from "bun:test";
import { SITE_URL } from "@/content/site";
import { absoluteUrl, linkedInShareUrl } from "./share";

describe("linkedInShareUrl", () => {
  test("sem texto, usa share-offsite com a URL absoluta", () => {
    const url = new URL(linkedInShareUrl({ url: "/labs/101" }));
    expect(url.pathname).toBe("/sharing/share-offsite/");
    expect(url.searchParams.get("url")).toBe(`${SITE_URL}/labs/101`);
  });

  test("com texto, abre o composer com o texto e a URL no fim", () => {
    const url = new URL(linkedInShareUrl({ url: "/blog/x", text: "  Achei 3 bugs.  " }));
    expect(url.pathname).toBe("/feed/");
    expect(url.searchParams.get("shareActive")).toBe("true");
    expect(url.searchParams.get("text")).toBe(`Achei 3 bugs.\n\n${SITE_URL}/blog/x`);
  });

  test("mantém URLs que já são absolutas", () => {
    expect(absoluteUrl("https://example.com/a")).toBe("https://example.com/a");
  });
});
