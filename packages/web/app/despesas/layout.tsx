import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ExpenseFlow",
  description: "Desafio gratuito de teste exploratório em um sistema financeiro com falhas intencionais.",
};

export default function ExpensesLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
