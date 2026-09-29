import { redirect } from "next/navigation";

export const metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default function LoginPage() {
  redirect("/");
}
