import { ManualTestingLessonPage, getManualTestingLessonMetadata } from "../../_components/manual-testing-lesson-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return getManualTestingLessonMetadata("testes-regressao", moduleId);
}

export default async function RegressionTestingLabPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return <ManualTestingLessonPage slug="testes-regressao" moduleId={moduleId} />;
}
