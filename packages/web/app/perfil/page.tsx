import { redirect } from "next/navigation";

export const metadata = { title: "Perfil", robots: { index: false, follow: false } };

export default function ProfilePage() {
  redirect("/");
}
