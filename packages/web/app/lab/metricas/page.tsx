import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/product/store";
import { isAdmin, loadMetrics, metricsAvailable } from "@/lib/product/metrics-store";

export const metadata = { title: "Métricas | QA Lab", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/lab/metricas");
  // Quem não é administrador recebe 404, não 403: a existência do painel não
  // precisa ser anunciada.
  if (!isAdmin(user.email) || !metricsAvailable()) notFound();

  const metrics = await loadMetrics(30);
  const peak = Math.max(1, ...metrics.daily.map((item) => item.events));

  return <main className="qa-system"><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <p className="qa-eyebrow">Últimos 30 dias</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">Métricas do produto</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">Ativação, conclusão e erros a partir dos eventos registrados pelo próprio produto.</p>

    <dl className="mt-8 grid divide-y divide-border rounded-xl border border-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      <Stat label="Contas ativas" value={metrics.activeUsers} hint={`${metrics.activatedUsers} ativaram no primeiro dia`} />
      <Stat label="Ativação" value={`${metrics.activationRate}%`} hint="iniciou um Lab no dia do cadastro" />
      <Stat label="Conclusão" value={`${metrics.completionRate}%`} hint={`${metrics.labsCompleted} de ${metrics.labsStarted} Labs`} />
      <Stat label="Erros de API" value={metrics.errors} hint="respostas 5xx registradas" />
    </dl>

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
