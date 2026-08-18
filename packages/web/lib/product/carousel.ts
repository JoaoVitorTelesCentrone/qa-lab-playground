import { posts, type BlogPost } from "@/lib/blog-posts";
import { challenges, type Challenge } from "@/lib/challenges";
import { researchLibrary, type ResearchWork } from "@/lib/research-library";

export type CarouselSourceKind = "blog" | "desafio" | "referencia";

export type CarouselSlide = {
  id: string;
  kind: "cover" | "content" | "list" | "cta";
  eyebrow: string;
  title: string;
  body?: string;
  bullets?: string[];
  footer?: string;
};

export type CarouselSourceOption = {
  kind: CarouselSourceKind;
  id: string;
  label: string;
  hint: string;
};

const MAX_SLIDES = 8;

function slugTitle(kind: CarouselSourceKind) {
  return kind === "blog" ? "Artigo" : kind === "desafio" ? "Desafio" : "Referência";
}

function slidesFromBlogPost(post: BlogPost): CarouselSlide[] {
  const slides: CarouselSlide[] = [
    { id: "cover", kind: "cover", eyebrow: "QA Lab · Artigo", title: post.titulo, body: post.resumo, footer: post.tags.slice(0, 3).join("  ·  ") },
  ];
  for (const block of post.blocos) {
    if (slides.length >= MAX_SLIDES - 1) break;
    if (block.type === "heading" && block.content) {
      slides.push({ id: `h-${slides.length}`, kind: "content", eyebrow: "Continua", title: block.content });
    } else if (block.type === "subheading" && block.content) {
      slides.push({ id: `sh-${slides.length}`, kind: "content", eyebrow: "Continua", title: block.content });
    } else if ((block.type === "list" || block.type === "ordered-list") && block.items?.length) {
      const last = slides[slides.length - 1];
      if (last && last.kind === "content" && !last.bullets) last.bullets = block.items.slice(0, 5);
      else slides.push({ id: `l-${slides.length}`, kind: "list", eyebrow: "Continua", title: "Pontos-chave", bullets: block.items.slice(0, 5) });
    } else if (block.type === "paragraph" && block.content) {
      const last = slides[slides.length - 1];
      if (last && last.kind === "content" && !last.body) last.body = block.content;
    }
  }
  slides.push({ id: "cta", kind: "cta", eyebrow: "Leia completo", title: "No blog do QA Lab", body: `qalab.dev/blog/${post.slug}`, footer: "Link nos comentários" });
  return slides;
}

function slidesFromChallenge(challenge: Challenge): CarouselSlide[] {
  const slides: CarouselSlide[] = [
    {
      id: "cover",
      kind: "cover",
      eyebrow: `QA Lab · Desafio ${challenge.tipo === "semanal" ? "semanal" : "mensal"}`,
      title: challenge.titulo,
      body: challenge.descricao,
      footer: `${challenge.dificuldade.toUpperCase()}  ·  ${challenge.xp} XP`,
    },
    {
      id: "passos",
      kind: "list",
      eyebrow: "Como topar",
      title: "Passo a passo",
      bullets: challenge.passos.slice(0, 6).map((step) => step.descricao),
    },
  ];
  slides.push({
    id: "cta",
    kind: "cta",
    eyebrow: "Bora praticar?",
    title: "Topa o desafio?",
    body: `${challenge.participantes} pessoas já toparam. Sua vez.`,
    footer: challenge.tags.slice(0, 3).join("  ·  "),
  });
  return slides;
}

function slidesFromResearch(work: ResearchWork): CarouselSlide[] {
  const authors = work.authors.slice(0, 3).join(", ") + (work.authors.length > 3 ? " et al." : "");
  return [
    { id: "cover", kind: "cover", eyebrow: "QA Lab · Referência", title: work.title, body: `${authors} · ${work.year}`, footer: work.venue },
    { id: "abstract", kind: "content", eyebrow: "Do que trata", title: "Resumo", body: work.abstract.slice(0, 420) },
    { id: "topics", kind: "list", eyebrow: "Por que interessa ao QA", title: "Tópicos", bullets: work.topics.slice(0, 6) },
    { id: "cta", kind: "cta", eyebrow: "Fonte", title: work.source, body: work.doi || work.url, footer: "Link nos comentários" },
  ];
}

export function listCarouselSources(): CarouselSourceOption[] {
  const blog = posts.map((post) => ({ kind: "blog" as const, id: post.slug, label: post.titulo, hint: `${slugTitle("blog")} · ${post.tempoLeitura} min` }));
  const desafios = challenges.map((challenge) => ({ kind: "desafio" as const, id: challenge.id, label: challenge.titulo, hint: `${slugTitle("desafio")} · ${challenge.dificuldade}` }));
  const referencias = researchLibrary.items.slice(0, 60).map((work) => ({ kind: "referencia" as const, id: work.id, label: work.title, hint: `${slugTitle("referencia")} · ${work.year}` }));
  return [...blog, ...desafios, ...referencias];
}

export function buildCarouselDeck(kind: CarouselSourceKind, id: string): CarouselSlide[] | null {
  if (kind === "blog") {
    const post = posts.find((item) => item.slug === id);
    return post ? slidesFromBlogPost(post) : null;
  }
  if (kind === "desafio") {
    const challenge = challenges.find((item) => item.id === id);
    return challenge ? slidesFromChallenge(challenge) : null;
  }
  const work = researchLibrary.items.find((item) => item.id === id);
  return work ? slidesFromResearch(work) : null;
}
