import { notFound, redirect } from "next/navigation";
import { ConclusionClient } from "./conclusion-client";
import { systemChallenges } from "@/lib/system-challenges";
import { labs } from "@/lib/playground/catalog";
import { buildCase } from "@/lib/product/case";
import { getJourney, getLabState, getSessionUser, listCertificates, listSubmissions } from "@/lib/product/store";
import { buildTrackProgress, trackForLab } from "@/lib/product/tracks";
import { certificateStats, eligibility } from "@/lib/product/certificate";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Conclusão do Lab", robots: { index: false, follow: false } };

export default async function ConclusionPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const challenge = systemChallenges.find((item) => item.number === Number(number));
  const lab = labs.find((item) => item.number === Number(number));
  if (!challenge || !lab) notFound();

  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/labs/${number}/conclusao`)}`);

  const supabase = await createClient();
  const [state, journey, { data: profile }] = await Promise.all([
    getLabState(user.id, challenge.id),
    getJourney(user.id),
    supabase.from("profiles").select("full_name,username,portfolio_public").eq("id", user.id).maybeSingle(),
  ]);

  // Sem evidência não há case. Voltar para o briefing é mais útil que uma
  // página vazia dizendo que falta entregar.
  if (state.submissions.length === 0) redirect(`/labs/${number}`);

  const item = buildCase(state.submissions[0], lab, challenge)!;
  const track = trackForLab(challenge.number);
  const progress = track ? buildTrackProgress(track, journey.labs) : null;

  const [submissions, certificates] = await Promise.all([
    progress ? listSubmissions(user.id) : Promise.resolve([]),
    listCertificates(user.id),
  ]);

  const trackSummary = progress && track
    ? {
        slug: track.slug,
        name: track.name,
        outcome: track.outcome,
        nextLab: progress.nextLab ? { number: progress.nextLab.number, title: progress.nextLab.title } : null,
        ...eligibility(progress),
        stats: certificateStats(track, progress, submissions),
        certificateCode: certificates.find((certificate) => certificate.trackSlug === track.slug)?.code ?? null,
      }
    : null;

  return <ConclusionClient
    item={item}
    olderCount={state.submissions.length - 1}
    name={profile?.full_name?.trim() || user.email.split("@")[0]}
    profile={{ username: profile?.username ?? "", portfolioPublic: Boolean(profile?.portfolio_public) }}
    track={trackSummary}
    siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app"}
  />;
}
