import { getPortfolio } from "@/lib/product/portfolio";
import { buildPortfolioExport, portfolioReadme, portfolioLinkedInPost, portfolioHtml } from "@/lib/product/portfolio-export";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "preview";
  if (!["preview", "github", "linkedin", "json", "html"].includes(format)) {
    return Response.json({ error: { message: "Formato de exportação inválido." } }, { status: 422 });
  }
  if (!/^[a-z0-9_-]{3,30}$/.test(username)) return Response.json({ error: { message: "Portfólio não encontrado." } }, { status: 404 });
  try {
    // Uses the same published snapshots and visibility checks as the public page.
    const portfolio = await getPortfolio(username);
    if (!portfolio) return Response.json({ error: { message: "Portfólio não encontrado ou privado." } }, { status: 404, headers: { "Cache-Control": "no-store" } });
    const data = buildPortfolioExport(portfolio, url.origin);
    const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    if (format === "preview") return Response.json({ data: { github: portfolioReadme(data), linkedin: portfolioLinkedInPost(data), portfolio: data } }, { headers });
    const formats = {
      github: { body: portfolioReadme(data), filename: "README.md", type: "text/markdown;charset=utf-8" },
      linkedin: { body: portfolioLinkedInPost(data), filename: "linkedin.txt", type: "text/plain;charset=utf-8" },
      json: { body: JSON.stringify(data, null, 2), filename: "portfolio.json", type: "application/json;charset=utf-8" },
      html: { body: portfolioHtml(data), filename: "portfolio.html", type: "text/html;charset=utf-8" },
    };
    const file = formats[format as keyof typeof formats];
    return new Response(file.body, { headers: { ...headers, "Content-Type": file.type, "Content-Disposition": `attachment; filename="${file.filename}"` } });
  } catch {
    return Response.json({ error: { message: "Não foi possível gerar a exportação. Tente novamente." } }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
