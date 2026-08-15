// Ambiente de prática CRM — painel de indicadores do funil.
//
// Diferente dos outros três ambientes, este é só leitura: o aluno não cadastra
// nada, ele confere se o que os números dizem bate com os dados que os
// alimentam. É esse o exercício aqui — rastrear um indicador de painel até a
// linha que o originou e provar onde a conta não fecha.
//
// Server Component: nada nesta tela tem estado. Só os gráficos são cliente,
// por causa do hover.

import { EnvironmentShell } from "@/components/practice/environment-shell";
import { BarList, funnelRamp, nominalHue } from "@/components/practice/bar-list";
import { StatGrid } from "@/components/practice/ui";
import { findPracticeApp } from "@/lib/product/apps";
import { money } from "@/lib/product/practice/format";
import { activitiesByKind, crmSummary, funnelByStage, valueByCompany, type Activity } from "@/lib/product/practice/views";
import type { Deal } from "@/lib/product/practice/rules";
import type { PracticeRows, PracticeSettings } from "@/lib/product/practice/store";

const app = findPracticeApp("crm")!;

const stageLabels: Record<Deal["stage"], string> = { novo: "Novo", qualificado: "Qualificado", proposta: "Proposta", ganho: "Ganho", perdido: "Perdido" };
const kindLabels: Record<string, string> = { ligacao: "Ligação", email: "E-mail", reuniao: "Reunião" };

export function CrmApp({ initial, settings, signedIn }: { initial: PracticeRows; settings: PracticeSettings; signedIn: boolean }) {
  const deals = (initial["crm.deals"] ?? []) as unknown as Deal[];
  const activities = (initial["crm.activities"] ?? []) as unknown as Activity[];
  const companies = initial["crm.companies"] ?? [];

  const summary = crmSummary(deals, settings.activeBugs);
  const funnel = funnelByStage(deals);
  const byCompany = valueByCompany(deals);
  const byKind = activitiesByKind(activities);

  return <EnvironmentShell app={app} settings={settings} signedIn={signedIn}>
    <section className="mt-8" aria-labelledby="pipeline-title">
      <h2 id="pipeline-title" className="text-xs font-medium text-muted-foreground">Valor no pipeline</h2>
      {/* Figura-herói: o número que o painel lidera. Uma por tela. */}
      <p className="mt-1.5 text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">{money(summary.pipeline)}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {summary.open} oportunidade(s) em aberto · ticket médio de {money(summary.averageOpen)} · {companies.length} empresa(s) na carteira
      </p>
    </section>

    <div className="mt-8">
      <StatGrid items={[
        { label: "Ganhos", value: money(summary.wonValue), hint: `${summary.won} negócio(s) fechado(s)`, tone: "positive" },
        { label: "Taxa de ganho", value: `${summary.winRate}%`, hint: "sobre os negócios já fechados" },
        { label: "Perdidas", value: money(summary.lostValue), hint: `${summary.lost} oportunidade(s)`, tone: summary.lost > 0 ? "negative" : "default" },
      ]} />
    </div>

    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <BarList
        title="Funil por estágio"
        description="Valor parado em cada etapa. A cor acompanha o avanço no funil; perdidas ficam de fora, porque são saída e não etapa."
        data={funnel.map((item, index) => ({
          label: stageLabels[item.stage],
          value: item.total,
          color: funnelRamp[index],
          note: `${item.count} oportunidade(s)`,
        }))}
        format="money"
        emptyMessage="Nenhuma oportunidade no funil."
      />

      <BarList
        title="Valor por empresa"
        description="Quanto cada conta representa do que ainda está em jogo."
        data={byCompany.map((item) => ({ label: item.company, value: item.total, color: nominalHue }))}
        format="money"
        emptyMessage="Nenhuma oportunidade viva na carteira."
      />

      <BarList
        title="Atividades por tipo"
        description="Como o time tem tocado as oportunidades."
        data={byKind.map((item) => ({ label: kindLabels[item.kind] ?? item.kind, value: item.total, color: nominalHue }))}
        emptyMessage="Nenhuma atividade registrada."
      />

      <BarList
        title="Oportunidades por valor"
        description="As maiores negociações da carteira, do maior valor para o menor."
        data={[...deals]
          .filter((deal) => deal.stage !== "perdido")
          .sort((left, right) => Number(right.amount) - Number(left.amount))
          .slice(0, 6)
          .map((deal) => ({ label: deal.title, value: Number(deal.amount), color: nominalHue, note: `${deal.company} · ${stageLabels[deal.stage]}` }))}
        format="money"
        emptyMessage="Nenhuma oportunidade viva na carteira."
      />
    </div>

    <p className="mt-6 text-xs leading-5 text-muted-foreground">
      Os números saem todos da mesma massa de teste. Compare cada gráfico com a tabela embaixo dele e com o total do topo:
      quando um deles discorda dos outros, há o que reportar.
    </p>
  </EnvironmentShell>;
}
