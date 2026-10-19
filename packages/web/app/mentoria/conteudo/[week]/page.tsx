import { notFound, redirect } from "next/navigation";
import { themeForUnit } from "@/lib/mentorship/themes";

export default async function LegacyUnitContentPage({ params }: { params: Promise<{ week: string }> }) {
  const number = Number((await params).week);
  const theme = Number.isInteger(number) ? themeForUnit(number) : undefined;
  if (!theme) notFound();
  redirect(`/conteudo/temas/${theme.slug}#unidade-${number}`);
}
