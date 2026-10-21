import { notFound, redirect } from "next/navigation";
import { themeForUnit } from "@/lib/mentorship/themes";
import { pathV2Chapters, pathV2ChapterHref } from "@/lib/mentorship/path-v2";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { getSessionUser } from "@/lib/product/store";

export default async function LegacyUnitContentPage({ params }: { params: Promise<{ week: string }> }) {
  const number = Number((await params).week);
  const theme = Number.isInteger(number) ? themeForUnit(number) : undefined;
  if (!theme) notFound();
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  if (dashboard?.enrollment.programVersion !== "v1") {
    const prefix = `mentoria.w${String(number).padStart(2, "0")}.`;
    const destination = pathV2Chapters.find(({ chapter }) => chapter.lessonKeys.some((key) => key.startsWith(prefix)));
    redirect(destination ? pathV2ChapterHref(destination.module, destination.chapter) : "/conteudo");
  }
  redirect(`/conteudo/temas/${theme.slug}#unidade-${number}`);
}
