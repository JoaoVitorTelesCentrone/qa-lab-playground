import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Missões de QA",
  description: "Desafios guiados para praticar investigação, análise de risco, BDD e documentação de bugs.",
};

export default function MissionsLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
