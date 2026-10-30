import { isAdmin, loadMetrics, metricsAvailable } from "@/lib/product/metrics-store";
import { buildMetrics } from "@/lib/product/metrics";
import { getSessionUser } from "@/lib/product/store";
import { notFound } from "next/navigation";

export const metadata = { title: "Métricas | QA Lab", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.email)) notFound();
  const metrics = metricsAvailable() ? await loadMetrics(30) : buildMetrics([]);
  const peak = Math.max(1, ...metrics.daily.map((item) => item.events));

  return <main className="qa-system"><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <p className="qa-eyebrow">Últimos 30 dias</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">Métricas do produto</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">Aprendizagem, publicação de cases, lista de interesse, inscrição na mentoria e erros registrados pelo produto.</p>

    <dl className="mt-8 grid divide-y divide-border rounded-xl border border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-6">
      <Stat label="Novas contas" value={metrics.newUsers} hint={`${metrics.activatedUsers} iniciaram um Lab no dia do cadastro`} />
      <Stat label="Primeira evidência em 7 dias" value={`${metrics.firstEvidenceWithin7Days.rate}%`} hint={`${metrics.firstEvidenceWithin7Days.users} de ${metrics.firstEvidenceWithin7Days.eligibleUsers} contas com coorte completa; atividades práticas`} />
      <Stat label="Tempo até evidência" value={metrics.medianHoursToFirstEvidence === null ? "—" : `${metrics.medianHoursToFirstEvidence} h`} hint="mediana da primeira evidência na coorte completa" />
      <Stat label="Publicaram um case" value={metrics.casesPublished} hint="contas com publicação registrada nos últimos 30 dias" />
      <Stat label="Ativação" value={`${metrics.activationRate}%`} hint="iniciou um Lab no dia do cadastro" />
      <Stat label="Conclusão" value={`${metrics.completionRate}%`} hint={`${metrics.labsCompleted} de ${metrics.labsStarted} Labs iniciados no período`} />
      <Stat label="Erros de API" value={metrics.errors} hint="exceções de rota registradas" />
      <Stat label="Uploads com falha" value={metrics.uploads.failed} hint={`${metrics.uploads.successful} uploads concluídos no período`} />
    </dl>

    <div className="mt-10 grid gap-8 lg:grid-cols-2">
      <CohortTable title="Coortes semanais" rows={metrics.weeklyCohorts} empty="Nenhuma conta nova no período." />
      <CohortTable title="Primeira origem conhecida" rows={metrics.acquisitionSources} empty="Nenhuma conta nova no período." />
    </div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Taxa de evidência = contas com primeira evidência válida até D+7 ÷ contas da coorte com sete dias completos. Inícios e evidências são deduplicados por conta; contas recentes aparecem no volume, mas não entram no denominador. Visitas anônimas à landing ainda não são atribuídas a pessoas e não entram nestas taxas.</p>

    <section className="mt-8" aria-labelledby="mentorship-funnel-title">
      <h2 id="mentorship-funnel-title" className="text-lg font-semibold">Funil da mentoria · últimos 30 dias</h2>
      <dl className="mt-3 grid grid-cols-2 divide-x divide-y divide-border rounded-xl border border-border sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
        <Stat label="Lista de interesse" value={metrics.mentorshipFunnel.waitlistLeads} hint="cadastros únicos, anônimos à conta" />
        <Stat label="Inscrição" value={metrics.mentorshipFunnel.applications} hint="contas únicas" />
        <Stat label="Checkout iniciado" value={metrics.mentorshipFunnel.checkouts} hint="contas únicas" />
        <Stat label="Pagamento confirmado" value={metrics.mentorshipFunnel.payments} hint="contas únicas" />
        <Stat label="Primeira entrega revisada" value={metrics.mentorshipFunnel.firstReviewedSubmissions} hint="alunos cuja primeira revisão ocorreu na janela" />
      </dl>
    </section>

    <section className="mt-10" aria-labelledby="daily-title">
      <h2 id="daily-title" className="text-lg font-semibold">Uso por dia</h2>
      {metrics.daily.length === 0
        ? <p className="mt-3 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Nenhum evento no período.</p>
        : <ul className="mt-4 grid gap-2">{metrics.daily.map((item) => <li key={item.date} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-sm">
            <span className="font-mono text-xs text-muted-foreground">{item.date.split("-").reverse().join("/")}</span>
            <span className="h-2 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${item.events} eventos em ${item.date}`}>
              <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.round((item.events / peak) * 100)}%` }} />
            </span>
            <span className="font-mono text-xs text-muted-foreground">{item.started}▶ {item.completed}✓ · {item.events}</span>
          </li>)}</ul>}
    </section>

    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <section aria-labelledby="labs-title">
        <h2 id="labs-title" className="text-lg font-semibold">Labs mais iniciados</h2>
        {metrics.topLabs.length === 0
          ? <p className="mt-3 text-sm text-muted-foreground">Nenhum Lab iniciado no período.</p>
          : <ul className="mt-4 divide-y divide-border border-y border-border">{metrics.topLabs.map((item) => <li key={item.lab} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="font-mono text-xs">{item.lab}</span>
              <span className="text-xs text-muted-foreground">{item.started} iniciado(s) · {item.completed} concluído(s)</span>
            </li>)}</ul>}
      </section>

      <section aria-labelledby="errors-title">
        <h2 id="errors-title" className="text-lg font-semibold">Erros mais frequentes</h2>
        {metrics.topErrors.length === 0
          ? <p className="mt-3 text-sm text-muted-foreground">Nenhum erro registrado no período.</p>
          : <ul className="mt-4 divide-y divide-border border-y border-border">{metrics.topErrors.map((item) => <li key={item.message} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="min-w-0 truncate">{item.message}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.total}</span>
            </li>)}</ul>}
      </section>
    </div>
  </div></main>;
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return <div className="p-4 sm:p-5">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">{value}</dd>
    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
  </div>;
}

function CohortTable({ title, rows, empty }: { title: string; rows: ReturnType<typeof buildMetrics>["weeklyCohorts"]; empty: string }) {
  return <section aria-label={title}>
    <h2 className="text-lg font-semibold">{title}</h2>
    {rows.length === 0
      ? <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      : <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[41rem] text-left text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground"><tr>
              <th scope="col" className="px-4 py-3 font-medium">Grupo</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Cadastros</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Começaram*</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Evidência*</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Abandono*</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Taxa D+7</th>
            </tr></thead>
            <tbody className="divide-y divide-border">{rows.map((row) => <tr key={row.key}>
              <th scope="row" className="px-4 py-3 font-medium">{title === "Coortes semanais" ? row.key.split("-").reverse().join("/") : row.key}</th>
              <td className="px-3 py-3 text-right tabular-nums">{row.signups}</td>
              <td className="px-3 py-3 text-right tabular-nums">{row.startedUsers}/{row.eligibleUsers}</td>
              <td className="px-3 py-3 text-right tabular-nums">{row.evidenceUsers}/{row.eligibleUsers}</td>
              <td className="px-3 py-3 text-right tabular-nums">{row.abandonedUsers}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.evidenceRate === null ? "—" : `${row.evidenceRate}%`}</td>
            </tr>)}</tbody>
          </table>
          <p className="px-4 py-2 text-[11px] text-muted-foreground">* Contas com janela D+7 completa; abandono conta quem começou e não entregou evidência até D+7. A origem vem da primeira campanha conhecida no cadastro.</p>
        </div>}
  </section>;
}
