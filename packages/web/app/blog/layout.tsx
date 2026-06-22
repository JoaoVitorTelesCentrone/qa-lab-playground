import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artigos",
  description: "Conteúdo gratuito sobre estratégia de qualidade, testes, BDD, riscos e carreira em QA.",
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
