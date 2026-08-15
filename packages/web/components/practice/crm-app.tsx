"use client";

// Ambiente de prática CRM.
//
// O funil move oportunidade por oportunidade com um `select` por card: é uma
// alteração de estágio de verdade (PATCH no servidor), então o valor do
// pipeline no topo tem que mudar junto. Quando não muda, o desvio plantado
// está ligado — e é isso que o cenário de regressão cobra.

import { useState } from "react";
import { Building2, Mail, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnvironmentShell } from "@/components/practice/environment-shell";
import { ResourceForm } from "@/components/practice/resource-form";
import { RecordTable } from "@/components/practice/record-table";
import { useListControls } from "@/components/practice/list-controls";
import { ExportCsv } from "@/components/practice/export-csv";
import { PracticeSection, StatGrid } from "@/components/practice/ui";
import { usePracticeApp, type AppRows } from "@/components/practice/use-practice-app";
import { findPracticeApp } from "@/lib/product/apps";
import { fold, money } from "@/lib/product/practice/format";
import { crmSummary, pipelineByStage, stageOrder } from "@/lib/product/practice/views";
import { searchContacts, type Contact, type Deal } from "@/lib/product/practice/rules";
import type { PracticeSettings } from "@/lib/product/practice/store";

const app = findPracticeApp("crm")!;

const stageLabels: Record<Deal["stage"], string> = { novo: "Novo", qualificado: "Qualificado", proposta: "Proposta", ganho: "Ganho", perdido: "Perdido" };
const activityIcons = { ligacao: Phone, email: Mail, reuniao: Users } as const;

export function CrmApp({ initial, settings, signedIn }: { initial: AppRows; settings: PracticeSettings; signedIn: boolean }) {
  const practice = usePracticeApp(initial, { persist: signedIn, activeBugs: settings.activeBugs });
  const deals = practice.use("crm.deals");
  const contacts = practice.use("crm.contacts");
  const companies = practice.use("crm.companies");
  const activities = practice.use("crm.activities");

  const [query, setQuery] = useState("");

  const rows = {
    deals: deals.rows as unknown as Deal[],
    contacts: contacts.rows as unknown as Contact[],
  };
  const summary = crmSummary(rows.deals, settings.activeBugs);
  const columns = pipelineByStage(rows.deals);
  const companyNames = companies.rows.map((company) => String(company.name));
  const dealTitles = rows.deals.map((deal) => deal.title);

  // A busca de contatos usa a regra compartilhada de propósito: é ela que o
  // desvio de acentuação corrompe.
  const foundContacts = searchContacts(rows.contacts, query, settings.activeBugs);

  const dealList = useListControls(deals.rows, {
    searchLabel: "Buscar oportunidade",
    searchPlaceholder: "Título ou empresa",
    search: (items, search) => {
      const needle = fold(search);
      return items.filter((item) => fold(`${item.title} ${item.company}`).includes(needle));
    },
    filters: [
      { field: "stage", label: "Estágio", options: stageOrder.map((stage) => ({ value: stage, label: stageLabels[stage] })) },
      { field: "company", label: "Empresa", options: companyNames.map((name) => ({ value: name, label: name })) },
    ],
    sorts: [
      { id: "amount-desc", label: "Valor (maior)", compare: (a, b) => Number(b.amount) - Number(a.amount) },
      { id: "amount-asc", label: "Valor (menor)", compare: (a, b) => Number(a.amount) - Number(b.amount) },
      { id: "title", label: "Título (A–Z)", compare: (a, b) => String(a.title).localeCompare(String(b.title), "pt-BR") },
    ],
  });

  return <EnvironmentShell app={app} settings={settings} signedIn={signedIn}>
    <div className="mt-8">
      <StatGrid items={[
        { label: "Valor no pipeline", value: money(summary.pipeline), tone: "positive", hint: `${summary.open} oportunidade(s) em aberto` },
        { label: "Ganhos", value: money(summary.wonValue), hint: `${summary.won} negócio(s) fechado(s)` },
        { label: "Taxa de ganho", value: `${summary.winRate}%`, hint: "sobre os negócios já fechados" },
      ]} />
    </div>

    <PracticeSection id="funil" title="Funil" description="Mude o estágio de uma oportunidade e confira o valor do pipeline acima." >
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {columns.map((column) => <section key={column.stage} aria-labelledby={`stage-${column.stage}`} className="rounded-lg border border-border p-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 id={`stage-${column.stage}`} className="text-sm font-medium">{stageLabels[column.stage]}</h3>
            <span className="font-mono text-[11px] text-muted-foreground">{column.deals.length}</span>
          </div>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">{money(column.total)}</p>
          <ul className="mt-3 grid gap-2">
            {column.deals.length === 0 && <li className="rounded-md border border-dashed border-border px-2 py-4 text-center text-xs text-muted-foreground">Vazio</li>}
            {column.deals.map((deal) => <li key={deal.id} className="rounded-md border border-border p-2.5">
              <p className="text-sm font-medium leading-5">{deal.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{deal.company}</p>
              <p className="mt-1 font-mono text-xs">{money(Number(deal.amount))}</p>
              <label className="mt-2 block">
                <span className="sr-only">Estágio de {deal.title}</span>
                <select
                  value={deal.stage}
                  disabled={deals.pending === deal.id}
                  onChange={(event) => deals.update(deal.id, { stage: event.target.value })}
                  className="input h-8 w-full px-2 text-xs"
                >
                  {stageOrder.map((stage) => <option key={stage} value={stage}>{stageLabels[stage]}</option>)}
                </select>
              </label>
            </li>)}
          </ul>
        </section>)}
      </div>
      {deals.error && <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{deals.error}</p>}
    </PracticeSection>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-6">
        <PracticeSection id="oportunidades" title="Oportunidades" description="Cadastro completo do funil." action={<ExportCsv resource={deals.resource} rows={dealList.filtered} columns={["title", "company", "stage", "amount"]} filename="oportunidades" />}>
          <ResourceForm handle={deals} defaults={{ stage: "novo" }} suggestions={{ company: companyNames }} />
          <div className="mt-6 border-t border-border pt-5">{dealList.ui}</div>
          <div className="mt-4">
            <RecordTable
              handle={deals}
              rows={dealList.visible}
              columns={["title", "company", "stage", "amount"]}
              suggestions={{ company: companyNames }}
              empty={dealList.hasFilters ? "Nenhuma oportunidade encontrada com esses filtros." : "Nenhuma oportunidade cadastrada."}
              renderCell={(row, field) => field === "stage" ? <Badge variant={row.stage === "ganho" ? "default" : row.stage === "perdido" ? "destructive" : "secondary"} className="font-normal">{stageLabels[row.stage as Deal["stage"]]}</Badge> : undefined}
            />
          </div>
        </PracticeSection>

        <PracticeSection id="contatos" title="Contatos" description="Busque por nome, e-mail ou empresa." action={<ExportCsv resource={contacts.resource} rows={foundContacts as unknown as typeof contacts.rows} columns={["name", "email", "company", "role"]} filename="contatos" />}>
          <ResourceForm handle={contacts} suggestions={{ company: companyNames }} />
          <div className="mt-6 border-t border-border pt-5">
            <label className="grid max-w-xs gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Buscar contato</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, e-mail ou empresa" className="input" />
            </label>
            <p aria-live="polite" className="mt-2 text-xs text-muted-foreground">
              {query.trim() ? `${foundContacts.length} de ${rows.contacts.length} contato(s)` : `${rows.contacts.length} contato(s)`}
            </p>
          </div>
          <div className="mt-4">
            <RecordTable
              handle={contacts}
              rows={foundContacts as unknown as typeof contacts.rows}
              columns={["name", "email", "company", "role"]}
              suggestions={{ company: companyNames }}
              empty={query.trim() ? `Nenhum contato encontrado para "${query}".` : "Nenhum contato cadastrado."}
            />
          </div>
        </PracticeSection>
      </div>

      <div className="grid gap-6">
        <PracticeSection id="empresas" title="Empresas" description="Quem são as contas atendidas.">
          <ResourceForm handle={companies} columns={1} />
          <div className="mt-5">
            <RecordTable
              handle={companies}
              columns={["name", "segment", "size"]}
              empty="Nenhuma empresa cadastrada."
              renderCell={(row, field) => field === "name" ? <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 text-muted-foreground" aria-hidden="true" />{String(row.name)}</span> : undefined}
            />
          </div>
        </PracticeSection>

        <PracticeSection id="atividades" title="Atividades" description="O histórico de contato de cada oportunidade.">
          <ResourceForm handle={activities} columns={1} suggestions={{ deal: dealTitles }} />
          <ul className="mt-5 grid gap-2.5">
            {activities.rows.length === 0 && <li className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma atividade registrada.</li>}
            {activities.rows.map((activity) => {
              const Icon = activityIcons[activity.kind as keyof typeof activityIcons] ?? Mail;
              return <li key={activity.id} className="rounded-md border border-border p-3">
                <p className="flex items-center gap-2 text-sm font-medium"><Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />{String(activity.deal)}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{String(activity.summary)}</p>
              </li>;
            })}
          </ul>
          <div className="mt-5 border-t border-border pt-5">
            <RecordTable handle={activities} columns={["deal", "kind", "summary"]} empty="Nenhuma atividade cadastrada." suggestions={{ deal: dealTitles }} />
          </div>
        </PracticeSection>
      </div>
    </div>
  </EnvironmentShell>;
}
