import { CicdTrackPage } from "./cicd-track-page";

export const metadata = {
  title: "Trilha CI/CD | QA Lab",
  description: "Dez Labs sobre pipeline, quality gates, deploy, rollback, observabilidade e confiabilidade.",
};

export default function Page() {
  return <CicdTrackPage />;
}
