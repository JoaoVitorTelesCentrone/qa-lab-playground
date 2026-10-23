import { requireStaff } from "@/lib/mentorship/access";
import { createAdminClient } from "@/lib/supabase/admin";

export async function WaitlistLeads() {
  await requireStaff("admin");
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentorship_waitlist_leads")
    .select("id,full_name,email,source,utm_source,utm_medium,utm_campaign,created_at").order("created_at", { ascending: false }).limit(200);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const attributionRows: Array<{ utm_source: string | null; utm_medium: string | null; utm_campaign: string | null }> = [];
  let attributionError = false;
  for (let offset = 0; ; offset += 500) {
    const result = await admin.from("mentorship_waitlist_leads")
      .select("utm_source,utm_medium,utm_campaign")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .range(offset, offset + 499);
    if (result.error) {
      attributionError = true;
      break;
    }
    attributionRows.push(...(result.data ?? []));
    if ((result.data?.length ?? 0) < 500) break;
  }
  const attributionCounts = new Map<string, number>();
  for (const row of attributionRows) {
    const label = [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" / ") || "Sem UTM";
    attributionCounts.set(label, (attributionCounts.get(label) ?? 0) + 1);
  }
  const attributionSummary = [...attributionCounts.entries()].sort((a, b) => b[1] - a[1]);

  return <section className="mt-8 border-y border-white/10 py-7">
    <h2 className="text-2xl font-black text-off-white">Lista de interesse pública</h2>
    <div className="mt-5 rounded-xl border border-white/10 bg-[#171B21] p-5">
      <h3 className="font-bold text-off-white">Origem dos cadastros · últimos 30 dias</h3>
      {attributionError ? <p className="mt-3 text-sm text-[#F4CF68]">Aplique a migração de atribuição para consultar este resumo.</p> : attributionSummary.length ? <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{attributionSummary.map(([source, total]) => <li key={source} className="flex justify-between gap-3 border border-white/[.07] px-3 py-2 text-sm"><span className="truncate text-[#AAB2BC]">{source}</span><strong className="text-off-white">{total}</strong></li>)}</ul> : <p className="mt-3 text-sm text-[#AAB2BC]">Nenhum cadastro neste período.</p>}
    </div>
    {error ? <p className="mt-4 text-sm text-[#F4CF68]">A lista ou a migração de atribuição ainda não está disponível neste banco.</p> : data?.length ? <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="border-b border-white/10 text-[#AAB2BC]"><tr><th className="pb-3">Nome</th><th className="pb-3">E-mail</th><th className="pb-3">Origem</th><th className="pb-3">Cadastro</th></tr></thead>
        <tbody>{data.map((lead) => <tr key={lead.id} className="border-b border-white/10">
          <td className="py-3 pr-5 text-off-white">{lead.full_name}</td>
          <td className="py-3 pr-5"><a href={`mailto:${lead.email}`} className="text-mint underline">{lead.email}</a></td>
          <td className="py-3 pr-5 text-[#AAB2BC]">{[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || lead.source}</td>
          <td className="py-3 text-[#AAB2BC]">{new Date(lead.created_at).toLocaleDateString("pt-BR")}</td>
        </tr>)}</tbody>
      </table>
    </div> : <p className="mt-4 text-sm text-[#AAB2BC]">Ninguém entrou na lista ainda.</p>}
  </section>;
}
