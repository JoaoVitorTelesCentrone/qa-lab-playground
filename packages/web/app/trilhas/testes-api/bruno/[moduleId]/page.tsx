import { notFound } from "next/navigation";
import { apiTestingBrunoModules } from "@/lib/api-testing-course";
import { ApiModuleLesson } from "../../lesson";
import { getApiTestingProgress } from "../../progress";

export const dynamic = "force-dynamic";

export default async function BrunoApiModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = apiTestingBrunoModules.find((item) => item.id === moduleId);
  if (!module) notFound();
  const progress = await getApiTestingProgress();
  return <ApiModuleLesson module={module} track="bruno" completed={progress.completed.includes(module.id)} signedIn={progress.signedIn} />;
}
