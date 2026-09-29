import { redirect } from "next/navigation";

export const metadata = { title: "Criar conta", robots: { index: false, follow: false } };

export default function SignupPage() {
  redirect("/");
}
