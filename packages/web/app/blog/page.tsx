import { Compass, Bug, ShieldCheck, type LucideIcon } from "lucide-react";
import { posts } from "@/lib/blog-posts";
import { CollaborateCta } from "@/components/blog/collaborate-cta";
import {
  BlogHighlights,
  type BlogAccent,
  type BlogHighlightArticle,
} from "@/components/blog/blog-highlights";

const accents: BlogAccent[] = ["violet", "green", "blue"];
const icons: LucideIcon[] = [Compass, Bug, ShieldCheck];

export default function BlogPage() {
  const featured = posts.find((post) => post.destaque) ?? posts[0];

  const articles: BlogHighlightArticle[] = posts.map((post, index) => ({
    category: post.tags[0] ?? "QA Lab",
    readTime: `${post.tempoLeitura} min de leitura`,
    title: post.titulo,
    href: `/blog/${post.slug}`,
    accent: accents[index % accents.length],
    icon: icons[index % icons.length],
  }));

  return (
    <main className="qa-blog">
      <div className="mx-auto max-w-6xl px-5 pt-6 pb-12 sm:px-8 lg:pt-8 lg:pb-20">
        <BlogHighlights
          data={{
            heading: "Ideias para quem\nconstrói qualidade.",
            description:
              "Estratégia, investigação e prática para decisões de produto melhores.",
            asideText:
              "De cultura de time a técnicas de teste, compartilhamos o que funciona no dia a dia de quem garante qualidade.",
            viewAllLabel: featured ? "Ler o artigo em destaque" : "Ver o blog",
            viewAllHref: featured ? `/blog/${featured.slug}` : "/blog",
            articles,
          }}
        />
        <CollaborateCta />
      </div>
    </main>
  );
}
