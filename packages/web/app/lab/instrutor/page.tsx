import { redirect } from "next/navigation";
import { InstructorConsole } from "@/components/practice/instructor-console";
import { getSessionUser } from "@/lib/product/store";
import { getSettings } from "@/lib/product/practice/store";

export const metadata = { title: "Modo instrutor | QA Lab" };
export const dynamic = "force-dynamic";

export default async function InstructorPage() {
  // Aqui não vale o "experimentar sem conta": os desvios são configuração da
  // conta, e a página existe para revelar o mecanismo de cada um.
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/lab/instrutor");

  return <InstructorConsole settings={await getSettings(user.id)} />;
}
