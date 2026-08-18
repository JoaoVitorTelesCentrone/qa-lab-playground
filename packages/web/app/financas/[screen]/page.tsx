import { redirect } from "next/navigation";

// A tela única de /financas já mostra tudo que existe hoje (saldo + despesas).
// Mantido para não quebrar links já publicados para telas antigas do menu.
export default function FinanceScreenPage() {
  redirect("/financas");
}
