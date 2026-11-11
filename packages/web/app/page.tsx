import type { Metadata } from "next";
import { AuthorityHome } from "@/components/authority/authority-home";
import { author } from "@/content/site";
import { LABS_ENABLED } from "@/lib/product/features";

// A home antiga (components/home/product-home.tsx) continua no repositório; a
// troca faz parte da mudança de mentoria para autoridade (docs/PLANO_AUTORIDADE_2026-11.md).
export const metadata: Metadata = {
  title: { absolute: LABS_ENABLED ? `QA Lab por ${author.name}: labs práticos de QA com bugs reais` : `QA Lab: conteúdo sobre qualidade de software` },
  description: LABS_ENABLED ? `Labs práticos de QA com bugs reais que você liga e desliga, feitos por ${author.name}, ${author.title}. Comece um lab ou encare o desafio da semana.` : `Artigos, guias de ferramentas e referências científicas sobre qualidade de software, por ${author.name}, ${author.title}.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  return <AuthorityHome />;
}
