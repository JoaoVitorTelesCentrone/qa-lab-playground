import { author } from "@/content/site";
import { LABS_ENABLED } from "@/lib/product/features";
import { ogContentType, ogImage, ogSize } from "@/lib/product/og";

// Imagem padrão dos links do site. Rotas com imagem própria (blog, Labs,
// portfólio e certificado) sobrescrevem esta.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "QA Lab — qualidade de software";

export default function Image() {
  return ogImage({
    kicker: LABS_ENABLED ? "QA Lab · prática de QA" : "QA Lab · qualidade de software",
    title: LABS_ENABLED ? "Labs práticos de QA com bugs reais" : "Qualidade de software se aprende investigando",
    subtitle: LABS_ENABLED
      ? "Teste sistemas, encontre falhas e transforme descobertas em evidências."
      : "Artigos, guias de ferramentas e referências científicas para entender, testar e discutir qualidade.",
    author: `${author.name} · ${author.title}`,
  });
}
