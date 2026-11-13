import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", label: "home", imagePath: "/opengraph-image" },
  { path: "/blog", label: "índice do blog", imagePath: "/blog/opengraph-image" },
  { path: "/blog/qa-antes-de-executar-testes", label: "artigo", imagePath: "/blog/qa-antes-de-executar-testes/opengraph-image" },
];

for (const { path, label, imagePath } of pages) {
  test(`@smoke ${label} expõe uma OG image PNG`, async ({ page, request }) => {
    await page.goto(path);
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveCount(1);
    const content = await image.getAttribute("content");
    expect(content).toBeTruthy();

    // O metadataBase de produção aparece na URL absoluta; o teste busca a
    // mesma rota no servidor local para não depender do deploy.
    const imageUrl = new URL(content!, page.url());
    expect(imageUrl.pathname).toBe(imagePath);
    const response = await request.get(`${imageUrl.pathname}${imageUrl.search}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const body = await response.body();
    expect(body.subarray(1, 4).toString("ascii")).toBe("PNG");
  });
}
