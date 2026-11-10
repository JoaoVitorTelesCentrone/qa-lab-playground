import type { Metadata } from "next";
import { AuthorityHome } from "@/components/authority/authority-home";
import { author } from "@/content/site";

// A home antiga (components/home/product-home.tsx) continua no repositório; a
// troca faz parte da mudança de mentoria para autoridade (docs/PLANO_AUTORIDADE_2026-11.md).
export const metadata: Metadata = {
  title: { absolute: `QA Lab by ${author.name}: hands-on QA labs with real bugs` },
  description: `Hands-on QA labs with real, switchable bugs, built by ${author.name}, ${author.title}. Start a lab or take the weekly challenge.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  return <AuthorityHome />;
}
