import { ManualTestingTrackPage } from "../_components/manual-testing-track-page";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Testes de regressão | QA Lab",
  description: "Trilha básica para analisar impacto, priorizar, executar e manter testes de regressão.",
};

export default function RegressionTestingTrackPage() {
  return <ManualTestingTrackPage slug="testes-regressao" />;
}
