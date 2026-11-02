import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/blog-posts";
import { getSessionUser, trackEvent } from "@/lib/product/store";

const eventNames = {
  article_view: "blog_article_view",
  practice_cta_click: "blog_practice_cta_click",
  practice_arrival: "blog_practice_arrival",
  series_navigation: "blog_series_navigation",
} as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  const { event, slug } = body as Record<string, unknown>;
  if (typeof slug !== "string" || typeof event !== "string" || !Object.hasOwn(eventNames, event)) {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  const post = getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

  const user = await getSessionUser();
  if (user) {
    const eventName = eventNames[event as keyof typeof eventNames];
    await trackEvent(user.id, eventName, {
      slug: post.slug,
      ...(post.editorial ? { seriesId: post.editorial.seriesId, section: post.editorial.section } : {}),
    });
  }
  return new Response(null, { status: 204 });
}
