import { ManualTestingTrackPage } from "../_components/manual-testing-track-page";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Testes exploratórios | QA Lab",
  description: "Trilha básica para investigar software com charters, exploração guiada, evidências e debrief.",
};

export default function ExploratoryTestingTrackPage() {
  return <ManualTestingTrackPage slug="testes-exploratorios" />;
}
