import { notFound } from "next/navigation";
import { ToolWorkbench } from "@/components/qa-tools/tool-workbench";
import { findQaTool, qaTools } from "@/lib/qa-tools";
import { qaToolLabsFor } from "@/lib/qa-tool-labs";

export function generateStaticParams() { return qaTools.map(({ id }) => ({ tool: id })); }

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const metadata = findQaTool(tool);
  return { title: metadata ? `${metadata.title} | QA Lab` : "Ferramenta | QA Lab" };
}

export default async function ToolPage({ params, searchParams }: { params: Promise<{ tool: string }>; searchParams: Promise<{ lab?: string }> }) {
  const { tool } = await params;
  const metadata = findQaTool(tool);
  if (!metadata) notFound();
  const { lab } = await searchParams;
  const requestedNumber = Number(lab);
  const selectedLab = qaToolLabsFor(metadata.id).find((item) => item.number === requestedNumber) ?? qaToolLabsFor(metadata.id)[0];
  return <ToolWorkbench toolId={metadata.id} labNumber={selectedLab.number} />;
}
