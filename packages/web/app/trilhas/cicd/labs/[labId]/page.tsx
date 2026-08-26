import { notFound } from "next/navigation";
import { cicdTrackLabs, findCicdTrackLab } from "@/lib/cicd-lab";
import { CicdTrackPage } from "../../cicd-track-page";

export function generateStaticParams() {
  return cicdTrackLabs.map((lab) => ({ labId: lab.id }));
}

export default async function Page({ params }: { params: Promise<{ labId: string }> }) {
  const { labId } = await params;
  if (!findCicdTrackLab(labId)) notFound();
  return <CicdTrackPage initialLabId={labId} />;
}
