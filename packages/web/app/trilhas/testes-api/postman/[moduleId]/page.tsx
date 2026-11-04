import { notFound } from "next/navigation";
import { apiTestingPostmanModules } from "@/lib/api-testing-course";
import { ApiModuleLesson } from "../../lesson";
import { getApiTestingProgress } from "../../progress";

export const dynamic = "force-dynamic";

export default async function PostmanApiModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const lesson = apiTestingPostmanModules.find((item) => item.id === moduleId);
  if (!lesson) notFound();
  const progress = await getApiTestingProgress();
  return <ApiModuleLesson module={lesson} track="postman" completed={progress.completed.includes(lesson.id)} signedIn={progress.signedIn} />;
}
