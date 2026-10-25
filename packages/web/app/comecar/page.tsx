import { redirect } from "next/navigation";

export const metadata = {
  title: "Encontre sua primeira prática de QA",
  description: "Escolha seu objetivo e encontre um Lab para testar um sistema, investigar resultados e produzir sua primeira evidência de QA.",
};

export default function StartPage() {
  redirect("/?onboarding=1");
}
