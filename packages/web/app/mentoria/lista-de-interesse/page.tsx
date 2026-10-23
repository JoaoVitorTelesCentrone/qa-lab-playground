import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MentorshipLabVisual } from "../mentorship-lab-visual";
import { MentorshipWaitlistForm } from "./waitlist-form";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { normalizeWaitlistAttribution } from "@/lib/mentorship/waitlist-request";
import "../mentoria.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lista de interesse | Mentoria QA Lab",
  description: "Receba um aviso quando a próxima turma da Mentoria QA Lab abrir.",
};

export default async function MentorshipWaitlistPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const attribution = {
    source: normalizeWaitlistAttribution(first(query.utm_source)),
    medium: normalizeWaitlistAttribution(first(query.utm_medium)),
    campaign: normalizeWaitlistAttribution(first(query.utm_campaign)),
  };
  let available = false;
  if (hasServiceRole()) {
    try {
      const { error } = await createAdminClient().from("mentorship_waitlist_leads").select("id,utm_source,utm_medium,utm_campaign", { head: true }).limit(0);
      available = !error;
    } catch {
      available = false;
    }
  }
  return <main className="mentoria-page mentoria-list-page">
    <div className="mentoria-list-inner">
      <div className="mentoria-list-story">
        <Link href="/mentoria" className="mentoria-list-back"><ArrowLeft aria-hidden="true" size={17} /> Voltar à mentoria</Link>
        <h1>A próxima turma começa com <em>o seu interesse.</em></h1>
        <p>Pratique em um sistema real, receba feedback de quem vive QA e construa um case para mostrar seu raciocínio.</p>
        <div className="mentoria-list-art"><MentorshipLabVisual compact /></div>
      </div>
      <MentorshipWaitlistForm available={available} attribution={attribution} />
    </div>
  </main>;
}
