import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ExpenseFlow Free Challenge",
  description: "Explore um sistema financeiro com falhas intencionais e pratique análise de risco, teste exploratório e documentação de bugs.",
};

export default function ChallengeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
