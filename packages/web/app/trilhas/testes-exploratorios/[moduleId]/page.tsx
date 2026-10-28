import { ManualTestingLessonPage, getManualTestingLessonMetadata } from "../../_components/manual-testing-lesson-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return getManualTestingLessonMetadata("testes-exploratorios", moduleId);
}

export default async function ExploratoryTestingLabPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return <ManualTestingLessonPage slug="testes-exploratorios" moduleId={moduleId} />;
}
