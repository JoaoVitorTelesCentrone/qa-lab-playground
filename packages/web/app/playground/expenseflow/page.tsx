import { ExpenseFlowApp } from "@/components/expenseflow/expenseflow-app";

export const metadata = {
  title: "ExpenseFlow — ambiente de prática",
  description: "Ambiente completo de gestão de reembolsos para investigar fluxos, permissões, aprovações, filtros e relatórios.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ExpenseFlowApp />;
}
