import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de BDD",
  description: "Crie cenários Gherkin e exporte arquivos feature gratuitamente, sem cadastro.",
};

export default function BddLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
