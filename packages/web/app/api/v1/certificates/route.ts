import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { getDisplayName, getJourney, issueCertificate, listCertificates, listSubmissions } from "@/lib/product/store";
import { buildTrackProgress, findTrack } from "@/lib/product/tracks";
import { certificateStats, eligibility } from "@/lib/product/certificate";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/v1/certificates — certificados já emitidos para o aluno.
export function GET() {
  return withUser(async (user) => ok(await listCertificates(user.id)));
}

// POST /api/v1/certificates { track } — emite (ou atualiza) o certificado da trilha.
export function POST(request: Request) {
  return withUser(async (user) => {
    const body = await readJson(request);
    const track = typeof body.track === "string" ? findTrack(body.track) : undefined;
    if (!track) return fail("Trilha não encontrada.", 404);

    // A elegibilidade é reavaliada aqui, no servidor: o botão da tela é
    // conveniência, quem decide se a trilha fechou é o progresso no banco.
    const journey = await getJourney(user.id);
    const progress = buildTrackProgress(track, journey.labs);
    const status = eligibility(progress);
    if (!status.eligible) {
      return fail(
        status.required === 0
          ? "Esta trilha ainda não tem Labs liberados."
          : `Faltam ${status.missing} Lab(s) desta trilha para emitir o certificado.`,
        409,
      );
    }

    const [submissions, name] = await Promise.all([listSubmissions(user.id), holderName(user.id, user.email)]);
    const stats = certificateStats(track, progress, submissions);
    return ok(await issueCertificate(user.id, { trackSlug: track.slug, holderName: name, labs: stats.labs, evidence: stats.evidence }));
  });
}

/**
 * O certificado leva o nome completo, não o primeiro nome da saudação: é um
 * documento que a pessoa cola no LinkedIn.
 */
async function holderName(userId: string, email: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const full = data?.full_name?.trim();
  return full || (await getDisplayName(userId, email));
}
