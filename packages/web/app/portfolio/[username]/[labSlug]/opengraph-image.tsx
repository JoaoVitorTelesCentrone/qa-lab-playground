import { getPublicCase } from "@/lib/product/portfolio";
import { headline } from "@/lib/product/case";
import { ogContentType, ogImage, ogSize } from "@/lib/product/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Case de QA no QA Lab Playground";

export default async function Image({ params }: { params: { username: string; labSlug: string } }) {
  const found = await getPublicCase(params.username, params.labSlug);
  if (!found) return ogImage({ kicker: "Case de QA", title: "QA Lab Playground", subtitle: "Portfólio de evidências de teste." });

  const item = found.case;
  return ogImage({
    kicker: `Case de QA · Lab ${item.label}`,
    title: headline(item, 110),
    subtitle: item.objective,
    stats: [
      { label: item.mode === "investigacao" ? "teste exploratório" : "validação de fluxo", value: item.area },
      { label: "anexos", value: String(item.submission.attachments.length) },
      { label: "critérios do Lab", value: String(item.criteria.length) },
    ],
    author: found.author.name,
  });
}
