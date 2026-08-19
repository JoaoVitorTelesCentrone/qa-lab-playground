// Corpo da evidência de QA, renderizado igual na página pública e na prévia logada.
//
// Um só componente de propósito: o que o aluno revisa antes de publicar tem
// que ser exatamente o que o recrutador abre. Continua sendo server component:
// só a galeria de anexos precisa de cliente, e ela é importada pronta.
//
// Esta é a folha da hierarquia perfil → projeto → evidência. Só aqui aparecem
// passos, oráculo e critérios: nos níveis de cima eles empurram tudo para
// baixo e impedem a leitura em varredura.

import { Badge } from "@/components/ui/badge";
import { caseSkills, headline, type QaCase } from "@/lib/product/case";
import { AttachmentGallery, EvidenceText } from "./evidence-body";

const modeLabels = { fluxo: "Validação de fluxo", investigacao: "Teste exploratório" } as const;

export function CaseView({ item }: { item: QaCase }) {
  const isBug = item.mode === "investigacao";

  return <article>
    <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.16em] ${isBug ? "text-orange-400" : "text-primary"}`}>
      {isBug ? "Bug" : "Validação"} #{String(item.labNumber).padStart(3, "0")} · Lab {item.label} · {item.area}
    </p>

    {/* A manchete é o que a pessoa encontrou, não o título do exercício: quem
        abre o link quer saber o achado, o Lab é só a origem. */}
    <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">{headline(item, 120)}</h2>

    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
      <span>{modeLabels[item.mode]}</span>
      {item.submission.attachments.length > 0 && <span>{item.submission.attachments.length} anexo(s)</span>}
      <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</time>
    </div>

    <Section title="Contexto — o que precisava ser provado">
      <p className="text-sm leading-7 text-muted-foreground">{item.objective}</p>
    </Section>

    <Section title="Resultado esperado">
      <p className="text-base leading-7">{item.expected}</p>
    </Section>

    <Section title="Evidência">
      {item.submission.evidence.trim()
        ? <EvidenceText text={item.submission.evidence} className="text-base leading-7" />
        : <p className="text-base leading-7 text-muted-foreground">A evidência deste case está nos anexos.</p>}
      {item.submission.attachments.length > 0 && <div className="mt-5"><AttachmentGallery attachments={item.submission.attachments} /></div>}
    </Section>

    <Section title={`Roteiro do Lab (${item.labSteps.length})`}>
      <ol className="grid gap-2">
        {item.labSteps.map((step, index) => <li key={`${index}-${step}`} className="flex gap-3 text-sm leading-6">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11px] text-primary">{index + 1}</span>
          <span className="text-muted-foreground">{step}</span>
        </li>)}
      </ol>
    </Section>

    {item.criteria.length > 0 && <Section title={`Critérios de aceite do Lab (${item.criteria.length})`}>
      <ul className="grid gap-1.5 text-sm leading-6">
        {item.criteria.map((criterion) => <li key={criterion} className="flex gap-2.5">
          <span aria-hidden="true" className="text-primary">✓</span>
          <span className="text-muted-foreground">{criterion}</span>
        </li>)}
      </ul>
    </Section>}

    <Section title="Ambiente">
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <Field label="Sistema testado" value={item.title} />
        <Field label="Superfície" value={item.route} mono />
        <Field label="Dificuldade do Lab" value={item.difficulty} />
      </dl>
    </Section>

    <Section title="O que este case comprova">
      <div className="flex flex-wrap gap-1.5">
        {caseSkills(item).map((skill) => <Badge key={skill} variant="outline" className="font-normal">{skill}</Badge>)}
      </div>
    </Section>
  </article>;
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className={`mt-1 text-sm ${mono ? "font-mono text-xs text-primary" : ""}`}>{value}</dd>
  </div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-8 border-t border-border pt-6">
    <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
    <div className="mt-3">{children}</div>
  </section>;
}

