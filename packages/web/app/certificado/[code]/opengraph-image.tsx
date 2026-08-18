import { getCertificateByCode } from "@/lib/product/store";
import { findTrack } from "@/lib/product/tracks";
import { ogContentType, ogImage, ogSize } from "@/lib/product/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Certificado de trilha do QA Lab Playground";

export default async function Image({ params }: { params: { code: string } }) {
  const certificate = await getCertificateByCode(params.code);
  const track = certificate ? findTrack(certificate.trackSlug) : undefined;
  if (!certificate || !track) return ogImage({ kicker: "Certificado", title: "QA Lab Playground", subtitle: "Certificado de trilha verificável." });

  return ogImage({
    kicker: `Certificado · ${track.name}`,
    title: certificate.holderName,
    subtitle: track.outcome,
    stats: [
      { label: "Labs concluídos", value: String(certificate.labs) },
      { label: "evidências", value: String(certificate.evidence) },
      { label: "código", value: certificate.code },
    ],
    author: new Date(certificate.issuedAt).toLocaleDateString("pt-BR"),
  });
}
