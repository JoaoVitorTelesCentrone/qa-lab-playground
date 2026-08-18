import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCertificateByCode } from "@/lib/product/store";
import { findTrack } from "@/lib/product/tracks";
import { labs } from "@/lib/playground/catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

async function load(code: string) {
  const certificate = await getCertificateByCode(code);
  if (!certificate) return null;
  const track = findTrack(certificate.trackSlug);
  if (!track) return null;
  return { certificate, track };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const found = await load(code);
  if (!found) return { title: "Certificado não encontrado | QA Lab", robots: { index: false, follow: false } };

  const title = `${found.certificate.holderName} — trilha ${found.track.name} | QA Lab Playground`;
  const description = `Certificado verificável ${found.certificate.code}: ${found.certificate.labs} Labs concluídos com evidência de teste aceita. ${found.track.outcome}`;
  return { title, description, openGraph: { title, description, type: "profile" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function CertificatePage({ params }: Props) {
  const { code } = await params;
  const found = await load(code);
  if (!found) notFound();

  const { certificate, track } = found;
  const trackLabs = track.labNumbers.flatMap((number) => {
    const lab = labs.find((item) => item.number === number);
    return lab && lab.status === "liberado" ? [lab] : [];
  });

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
    <article className="rounded-xl border border-border bg-card p-7 sm:p-12">
      <div className="flex items-center gap-2">
        <Award className="size-5 text-primary" aria-hidden="true" />
        <p className="qa-eyebrow">Certificado de trilha</p>
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{certificate.holderName}</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        concluiu a trilha <strong className="text-foreground">{track.name}</strong> no QA Lab Playground em{" "}
        <time dateTime={certificate.issuedAt}>{new Date(certificate.issuedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</time>.
      </p>

      {/* O diferencial do certificado é o critério de emissão, então ele fica
          escrito na própria página — quem recebe o link não precisa acreditar. */}
      <p className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.04] p-4 text-sm leading-6">
        <ShieldCheck className="mr-2 inline size-4 text-primary" aria-hidden="true" />
        Este certificado não atesta presença em aula. Cada Lab da trilha só foi dado como concluído após uma entrega de evidência aceita: resultado observado, passos de reprodução e todos os critérios de aceite do Lab confirmados.
      </p>

      <dl className="mt-7 grid divide-y divide-border rounded-lg border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-4"><dt className="text-xs text-muted-foreground">Labs concluídos</dt><dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">{certificate.labs}</dd></div>
        <div className="p-4"><dt className="text-xs text-muted-foreground">Evidências registradas</dt><dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">{certificate.evidence}</dd></div>
        <div className="p-4"><dt className="text-xs text-muted-foreground">Código de verificação</dt><dd className="mt-1.5 font-mono text-lg">{certificate.code}</dd></div>
      </dl>

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">O que a trilha treina</h2>
        <p className="mt-2 text-sm leading-6">{track.objective}</p>
        <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Competência comprovada</h2>
        <p className="mt-2 text-sm leading-6">{track.outcome}</p>
      </section>

      {trackLabs.length > 0 && <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Labs do percurso</h2>
        <ol className="mt-3 grid gap-2">{trackLabs.map((lab, index) => <li key={lab.slug} className="flex gap-3 rounded-lg border border-border p-3 text-sm">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11px] text-primary">{index + 1}</span>
          <span>{lab.title}</span>
        </li>)}</ol>
      </section>}
    </article>

    <footer className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
      <p className="max-w-md text-sm leading-6 text-muted-foreground">Verificado em qalabplayground · o código acima resolve sempre para este certificado.</p>
      <Button asChild><Link href="/labs">Fazer esta trilha</Link></Button>
    </footer>
  </div></main>;
}
