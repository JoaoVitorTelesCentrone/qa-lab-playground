import { author } from "@/content/site";
import { allPosts } from "@/lib/blog/all-posts";
import { ogContentType, ogImage, ogSize } from "@/lib/product/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Blog de QA do QA Lab";

export default function Image() {
  return ogImage({
    kicker: "Blog de QA",
    title: "Investigar, testar e decidir",
    subtitle: "Artigos práticos sobre testes, automação, investigação e qualidade de software.",
    stats: [{ label: "artigos publicados", value: String(allPosts.length) }],
    author: `${author.name} · ${author.title}`,
  });
}
