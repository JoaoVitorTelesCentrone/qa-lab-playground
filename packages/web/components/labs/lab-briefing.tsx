"use client";

// Um Lab, uma tela, uma entrega.
//
// Três etapas, e todas pedem uma ação:
//   1. Preparar  — missão, o que entregar, conta e dados para copiar.
//   2. Testar    — checklist do roteiro ao lado do botão do sistema, com
//                  anotações rápidas que viram rascunho da entrega.
//   3. Entregar  — quatro campos curtos (fiz, esperava, aconteceu, conclusão)
//                  e as verificações do que ainda falta.
//
// Antes eram quatro etapas, três só de leitura, e o Broto exigia uma terceira
// aba (/conteudo/broto) com um segundo roteiro. O caso de treino agora entra
// no próprio Lab; a página continua existindo como material de apoio.
//
// Checklist, anotações e rascunho ficam no navegador, por Lab: dá para fechar
// a aba, entrar na conta e voltar sem perder nada. Quem decide se a entrega
// entra é a API, com a mesma regra mínima de sempre.

import { labReportMarkdown, reportFileName } from "@/lib/authority/lab-report";
import { DownloadMarkdownButton } from "@/components/labs/download-markdown";
import { Byline } from "@/components/authority/byline";
import { ShareOnLinkedIn } from "@/components/authority/share-on-linkedin";
import { ACCOUNTS_ENABLED, MENTORSHIP_ENABLED } from "@/lib/product/features";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, ExternalLink, Info, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EvidenceField } from "./evidence-field";
import { SubmissionHistory } from "./submission-history";
import { findLabByNumber, labLabel } from "@/lib/playground/catalog";
import type { SystemChallenge } from "@/lib/system-challenges";
import type { Attachment, EnrollmentStatus, Submission } from "@/lib/product/journey";
import type { TrackProgress } from "@/lib/product/tracks";
import { evaluateEvidence } from "@/lib/product/evaluation";
import { checkAcceptanceCoverage, checkDelivery, composeEvidence, conclusionLabels, draftFromChecklist, emptyDelivery, severityLabels, type Conclusion, type DeliveryFields, type Severity } from "@/lib/product/delivery";

/** Onde o Lab mora na mentoria, já resolvido no servidor. */
export type LabPathContext = {
  moduleNumber: number;
  moduleTitle: string;
  chapterId: string;
  chapterTitle: string;
  chapterHref: string;
  lessonNumber: number;
  lessonTitle: string;
  position: number;
  total: number;
};

const steps = [
  { label: "Preparar", slug: "preparar" },
  { label: "Testar", slug: "testar" },
  { label: "Entregar", slug: "entregar" },
] as const;

// Links antigos (?etapa=contexto, roteiro, ambiente, entrega) continuam abrindo a etapa certa.
const legacySteps: Record<string, number> = { contexto: 0, roteiro: 1, ambiente: 1, entrega: 2 };

const difficultyLabel: Record<SystemChallenge["difficulty"], string> = { Basico: "Básico", Intermediario: "Intermediário", Avancado: "Avançado" };
const modeLabel: Record<SystemChallenge["mode"], string> = { fluxo: "Validar um fluxo", investigacao: "Investigar um risco" };
const deliveryFieldLabel = { did: "o que fiz", expected: "o que esperava", observed: "o que aconteceu", conclusion: "conclusão", severity: "severidade" } as const;

// Rotas internas citadas no texto viram link. Rotas da API ficam como texto:
// abrir /api/users no navegador mostra JSON cru, não ajuda.
function withLinks(text: string): ReactNode {
  return text.split(/(?<=^|[\s(])(\/(?!api\/)[a-z0-9][a-z0-9/_?=&#-]*[a-z0-9])/gi).map((part, index) =>
    index % 2 === 1
      ? <Link key={index} href={part} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">{part}</Link>
      : <Fragment key={index}>{part}</Fragment>);
}

type Draft = { prepared: number[]; checked: number[]; notes: string; fields: DeliveryFields };
const emptyDraft: Draft = { prepared: [], checked: [], notes: "", fields: emptyDelivery };
const draftKey = (slug: string) => `qa-lab:lab-draft:${slug}`;

function readDraft(slug: string): Draft {
  try {
    const raw = window.localStorage.getItem(draftKey(slug));
    if (!raw) return emptyDraft;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return { ...emptyDraft, ...parsed, fields: { ...emptyDelivery, ...parsed.fields } };
  } catch {
    return emptyDraft;
  }
}

export function LabBriefing({ challenge, status, submissions, trackProgress, signedIn, path, mentee }: {
  challenge: SystemChallenge;
  status: EnrollmentStatus | "nao-iniciado";
  submissions: Submission[];
  trackProgress: TrackProgress | null;
  signedIn: boolean;
  /** Aula da mentoria a que este Lab pertence, se pertencer a alguma. */
  path: LabPathContext | null;
  /** Quem está matriculado vê a aula; o público vê a trilha. */
  mentee: boolean;
}) {
  const router = useRouter();
  const [step, setStepState] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set(status === "completed" ? [0, 1, 2] : [0]));
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(status !== "nao-iniciado");
  const [askLogin, setAskLogin] = useState(false);
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);

  const lab = findLabByNumber(challenge.number);
  const label = lab ? labLabel(lab) : String(challenge.number).padStart(2, "0");
  const system = challenge.system ?? { name: "ambiente", url: challenge.route, external: false };
  const stepObserve = challenge.stepObserve ?? [];
  const checks = checkDelivery(draft.fields, attachments.length);
  const acceptanceCoverage = checkAcceptanceCoverage(challenge.acceptance, challenge.acceptanceFields ?? [], draft.fields, attachments.length);
  const missing = checks.filter((check) => !check.ok);
  const trackStep = trackProgress?.steps.find((item) => item.lab.slug === challenge.id);
  const loginNext = `/labs/${challenge.number}?etapa=entregar`;
  const canSave = ACCOUNTS_ENABLED && signedIn;

  // Etapa da URL e rascunho salvo: lidos depois de montar para não divergir do HTML do servidor.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("etapa") ?? "";
    const fromUrl = steps.findIndex((item) => item.slug === slug);
    const index = fromUrl >= 0 ? fromUrl : legacySteps[slug] ?? 0;
    setDraft(readDraft(challenge.id));
    setDraftLoaded(true);
    if (index > 0) {
      setStepState(index);
      setVisited((current) => new Set([...current, ...Array.from({ length: index + 1 }, (_, i) => i)]));
    }
  }, [challenge.id]);

  useEffect(() => {
    if (!draftLoaded) return;
    try { window.localStorage.setItem(draftKey(challenge.id), JSON.stringify(draft)); } catch { /* armazenamento bloqueado: o Lab funciona sem rascunho */ }
  }, [draft, draftLoaded, challenge.id]);

  // Ao trocar de etapa, o foco vai para o título do painel: o leitor de tela
  // anuncia o conteúdo novo em vez de ficar no botão que acabou de ser usado.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    panelHeading.current?.focus();
  }, [step]);

  function setStep(index: number) {
    if (index === step || index < 0 || index >= steps.length) return;
    moveFocus.current = true;
    setStepState(index);
    setVisited((seen) => new Set(seen).add(index));
    // Entrando na entrega pela primeira vez, o checklist e as anotações viram rascunho.
    if (index === 2) {
      setDraft((current) => ({
        ...current,
        fields: {
          ...current.fields,
          did: current.fields.did || draftFromChecklist(challenge.steps, current.checked),
          observed: current.fields.observed || current.notes,
        },
      }));
    }
    const url = new URL(window.location.href);
    if (index === 0) url.searchParams.delete("etapa");
    else url.searchParams.set("etapa", steps[index].slug);
    window.history.replaceState(window.history.state, "", url);
  }

  const toggle = (key: "prepared" | "checked", index: number) => setDraft((current) => ({
    ...current,
    [key]: current[key].includes(index) ? current[key].filter((item) => item !== index) : [...current[key], index],
  }));
  const setField = <K extends keyof DeliveryFields>(key: K, value: DeliveryFields[K]) => setDraft((current) => ({ ...current, fields: { ...current.fields, [key]: value } }));

  async function start() {
    if (!canSave || starting || started) return;
    setStarting(true);
    try {
      const response = await fetch("/api/v1/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id }) });
      if (response.ok) setStarted(true);
    } catch {
      // Registrar o início é conveniência: a entrega conclui o Lab de qualquer jeito.
    } finally {
      setStarting(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!canSave) { if (ACCOUNTS_ENABLED) setAskLogin(true); return; }
    const evidence = composeEvidence(draft.fields);
    const local = evaluateEvidence({ evidence, attachments: attachments.length });
    if (!local.passed) { setError(local.issues[0]?.message ?? "Preencha a entrega antes de enviar."); return; }

    setState("saving");
    try {
      const response = await fetch("/api/v1/submissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id, evidence, attachments }) });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error?.message ?? "Não foi possível salvar a evidência. Tente novamente.");
        return;
      }
      setState("done");
      setDraft(emptyDraft);
      setAttachments([]);
      router.refresh();
    } catch {
      setError("Sem conexão com o servidor. Sua entrega continua no formulário; tente novamente.");
    } finally {
      setState((current) => current === "saving" ? "idle" : current);
    }
  }

  const back = mentee && path
    ? { href: path.chapterHref, label: `Módulo ${path.moduleNumber} · Cap ${path.chapterId} · ${path.chapterTitle}` }
    : trackProgress
      ? { href: `/trilhas/${trackProgress.track.slug}`, label: `Trilha ${trackProgress.track.name}` }
      : { href: "/labs", label: "Labs" };

  return <main className="qa-system"><div className="mx-auto max-w-5xl px-5 pb-28 pt-8 sm:px-8 sm:py-12">
    {/* Contexto: a aula para quem está na mentoria; a trilha para o público. */}
    <nav aria-label="Onde este Lab está" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      <Link href={back.href} className="inline-flex min-h-11 items-center gap-1.5 hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />{back.label}</Link>
      {mentee && path && <span>· <strong className="font-medium text-[var(--field-copper)]">Aula {path.lessonNumber}: {path.lessonTitle} · Lab {path.position} de {path.total}</strong></span>}
      {!mentee && trackProgress && trackStep && <span>· etapa {trackStep.position} de {trackProgress.steps.length}</span>}
    </nav>
    {MENTORSHIP_ENABLED && !mentee && path && <p className="mt-1 text-sm text-muted-foreground">Este Lab é a prática da aula &ldquo;{path.lessonTitle}&rdquo; da mentoria. <Link href="/mentoria" className="font-medium text-primary underline underline-offset-4">Conhecer a mentoria</Link></p>}

    <header className="mt-5 flex flex-wrap items-center gap-3">
      <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">{challenge.title}</h1>
      {status === "completed" && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="size-3" aria-hidden="true" /> concluído</Badge>}
      {status !== "completed" && started && canSave && <Badge variant="secondary">em andamento</Badge>}
    </header>
    <p className="mt-3 text-sm text-muted-foreground">Lab {label} · {challenge.area} · {difficultyLabel[challenge.difficulty] ?? challenge.difficulty} · {modeLabel[challenge.mode] ?? challenge.mode}{lab ? ` · cerca de ${lab.minutes} min` : ""}</p>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border py-2">
      <Byline />
      <ShareOnLinkedIn url={`/labs/${challenge.number}`} />
    </div>

    {submissions.length > 0 && state !== "done" && <Link href={`/labs/${challenge.number}/conclusao`} className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-primary/30 bg-primary/[0.04] p-3 text-sm transition hover:border-primary">
      <span>Você já entregou evidência neste Lab. <strong className="font-medium text-primary">Abrir o case e publicar</strong></span>
      <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
    </Link>}

    <ol className="mt-6 grid grid-cols-3 gap-1 border-b border-border pb-3 sm:mt-8 sm:flex sm:gap-2" aria-label="Etapas do Lab">
      {steps.map((item, index) => {
        const current = index === step;
        const seen = visited.has(index) && !current;
        return <li key={item.slug} className="min-w-0 sm:shrink-0">
          <button
            type="button"
            aria-label={`Etapa ${index + 1}: ${item.label}${seen ? ", já aberta" : ""}`}
            data-onboarding={`lab-step-${index}`}
            aria-current={current ? "step" : undefined}
            onClick={() => setStep(index)}
            className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-sm px-1 py-2 text-center text-xs font-medium transition sm:min-h-11 sm:w-auto sm:flex-row sm:gap-2 sm:px-3 sm:pr-4 sm:text-left sm:text-sm ${current ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${current ? "bg-primary-foreground/20" : seen ? "bg-primary/15 text-primary" : "border border-border"}`}>
              {seen ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        </li>;
      })}
    </ol>

    <div data-onboarding="lab-panel" className="mt-6">
      <div key={step} className="qa-lab-step-panel grid gap-5">

      {step === 0 && <>
        <section className="grid gap-4 rounded-sm bg-card p-5 sm:p-7" aria-labelledby="lab-missao">
          <h2 id="lab-missao" ref={panelHeading} tabIndex={-1} className="text-sm font-semibold text-muted-foreground outline-none">Missão</h2>
          <p className="text-base leading-7">{challenge.objective}</p>
          <div>
            <h3 className="text-sm font-semibold">Você vai entregar</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{challenge.acceptance.map((criterion) => <li key={criterion} className="flex gap-2"><span aria-hidden="true" className="shrink-0 text-primary">•</span><span>{criterion}</span></li>)}</ul>
          </div>
          <dl className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <Brief label="Dados de teste" value={withLinks(challenge.testData)} />
            <Brief label="Resultado esperado" value={challenge.expected} />
          </dl>
        </section>

        {challenge.prepare && <section className="grid gap-4 rounded-sm bg-card p-5 sm:p-7" aria-labelledby="lab-antes">
          <h2 id="lab-antes" className="text-sm font-semibold text-muted-foreground">Antes de testar</h2>
          <ul className="grid gap-3">
            {challenge.prepare.items.map((item, index) => <li key={item}><CheckRow checked={draft.prepared.includes(index)} onToggle={() => toggle("prepared", index)} label={item} /></li>)}
          </ul>
          {challenge.prepare.copy && <div className="grid gap-2">
            {challenge.prepare.copy.map((item) => <CopyBox key={item.label} label={item.label} text={item.text} />)}
          </div>}
          {challenge.prepare.reading && <p className="text-sm text-muted-foreground">Material de apoio, opcional: <Link href={challenge.prepare.reading.href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">{challenge.prepare.reading.label}</Link></p>}
        </section>}

        <details className="border-t border-border pt-2">
          <summary className="flex min-h-11 w-fit cursor-pointer items-center text-sm font-medium text-primary">Precisa de uma pista? Ela indica onde olhar</summary>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{withLinks(challenge.plantedBug)}</p>
        </details>
      </>}

      {step === 1 && <>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-card p-4 sm:p-5">
          <p className="text-sm">{challenge.system ? `Teste no ${system.name} com a conta de estudo.` : "Abra o ambiente em outra aba e siga o roteiro."}</p>
          {/* Abrir o sistema conta como início do Lab. */}
          <Button asChild><a href={system.url} target="_blank" rel="noopener noreferrer" onClick={() => void start()}>
            {challenge.system ? `Abrir o ${system.name}` : "Abrir o ambiente"} <ExternalLink className="size-4" aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
          </a></Button>
        </div>
        {starting && <p role="status" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Registrando o início do Lab...</p>}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="rounded-sm bg-card p-5 sm:p-6" aria-labelledby="lab-roteiro">
            <h2 id="lab-roteiro" ref={panelHeading} tabIndex={-1} className="text-sm font-semibold text-muted-foreground outline-none">Roteiro · {draft.checked.length} de {challenge.steps.length}</h2>
            <ol className="mt-4 grid gap-4">
              {challenge.steps.map((item, index) => <li key={item} className="grid gap-1">
                <CheckRow checked={draft.checked.includes(index)} onToggle={() => toggle("checked", index)} label={item} />
                {stepObserve[index] && <p className="pl-8 text-sm text-muted-foreground"><span className="font-medium text-[var(--field-copper)]">Observe:</span> {stepObserve[index]}</p>}
              </li>)}
            </ol>
          </section>
          <section className="rounded-sm bg-card p-5 sm:p-6" aria-labelledby="lab-notas">
            <h2 id="lab-notas" className="text-sm font-semibold text-muted-foreground"><label htmlFor="lab-notes-field">Anotações rápidas</label></h2>
            <Textarea id="lab-notes-field" value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} placeholder="O que a tela mostrou, horários, mensagens, dúvidas..." className="mt-3 min-h-40 text-sm leading-6" />
            <p className="mt-2 text-xs text-muted-foreground">Salvo neste navegador. Vai como rascunho para a Entrega.</p>
          </section>
        </div>
      </>}

      {step === 2 && <section className="grid gap-5 rounded-sm bg-card p-5 sm:p-7" aria-labelledby="lab-entrega">
        <div>
          <h2 id="lab-entrega" ref={panelHeading} tabIndex={-1} className="text-sm font-semibold text-muted-foreground outline-none">Entrega de evidência</h2>
          <p className="mt-1 text-xs text-muted-foreground">Passos e anotações do teste já vêm como rascunho. Ajuste e complete.</p>
        </div>

        <form className="grid gap-5" onSubmit={submit} noValidate>
          <DeliveryField id="did" label="O que você fez" hint="Os passos na ordem em que executou." value={draft.fields.did} onChange={(value) => setField("did", value)} rows={4} />
          <DeliveryField id="expected" label="O que você esperava" hint="O comportamento esperado ou a regra que você usou como referência." value={draft.fields.expected} onChange={(value) => setField("expected", value)} rows={2} />
          <DeliveryField id="observed" label="O que aconteceu" hint="O que a tela, a resposta ou o log mostrou. Um anexo também conta." value={draft.fields.observed} onChange={(value) => setField("observed", value)} rows={4} />

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold">Sua conclusão</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(conclusionLabels) as Conclusion[]).map((value) => <Choice key={value} name="conclusion" checked={draft.fields.conclusion === value} onChange={() => setField("conclusion", value)} label={conclusionLabels[value]} />)}
            </div>
          </fieldset>
          {draft.fields.conclusion === "falha" && <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold">Severidade</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(severityLabels) as Severity[]).map((value) => <Choice key={value} name="severity" checked={draft.fields.severity === value} onChange={() => setField("severity", value)} label={severityLabels[value]} />)}
            </div>
          </fieldset>}

          <div className="grid gap-2">
            <span className="text-sm font-semibold">Anexos</span>
            {canSave
              ? <EvidenceField labSlug={challenge.id} attachments={attachments} onAttachmentsChange={setAttachments} disabled={state === "saving"} />
              : <p className="text-sm text-muted-foreground">Descreva prints e vídeos no relatório; anexos não são enviados nesta versão.</p>}
          </div>

          <div className="grid gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Sua entrega até agora</h3>
              <DownloadMarkdownButton fileName={reportFileName(`lab-${label}`, challenge.title)} build={() => labReportMarkdown({ label, title: challenge.title, path: `/labs/${challenge.number}`, fields: draft.fields, notes: draft.notes })} />
            </div>
            <ul className="grid gap-2" aria-live="polite">
              {checks.map((check) => <li key={check.id} className={`flex items-start gap-2 text-sm ${check.ok ? "" : "text-[var(--field-copper)]"}`}>
                <span aria-hidden="true" className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${check.ok ? "bg-primary text-primary-foreground" : "border-[1.5px] border-[var(--field-copper)]"}`}>{check.ok ? "✓" : "!"}</span>
                <span>{check.ok ? check.label : check.missing}<span className="sr-only">{check.ok ? ": preenchido" : ": pendente"}</span></span>
              </li>)}
            </ul>
            <details>
              <summary className="flex min-h-11 w-fit cursor-pointer items-center text-sm text-muted-foreground">Critérios do Lab ({challenge.acceptance.length})</summary>
              <p className="mb-2 max-w-2xl text-xs leading-5 text-muted-foreground">O indicador mostra se os campos associados foram preenchidos; a qualidade do conteúdo continua sendo avaliada por você{MENTORSHIP_ENABLED ? " e pelo mentor" : ""}.</p>
              <ul className="grid gap-2 text-sm">{acceptanceCoverage.map(({ criterion, fields, fieldsPresent }) => <li key={criterion} className="flex items-start gap-2">
                <span aria-hidden="true" className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${fieldsPresent ? "bg-primary text-primary-foreground" : "border-[1.5px] border-[var(--field-copper)]"}`}>{fieldsPresent ? "✓" : "!"}</span>
                <span className="text-muted-foreground">{criterion}<span className="block text-xs">{fieldsPresent ? "Campos associados preenchidos" : "Faltam campos associados"}{fields.length > 0 ? ` · ${fields.map((field) => deliveryFieldLabel[field]).join(", ")}` : " · sem vínculo definido"}</span></span>
              </li>)}</ul>
            </details>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {ACCOUNTS_ENABLED && <Button disabled={state === "saving"}>{state === "saving" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />} Entregar evidência</Button>}
            {ACCOUNTS_ENABLED && missing.length > 0 && state !== "saving" && <span className="text-xs text-muted-foreground">Dá para enviar agora, mas {missing.length === 1 ? "falta 1 item" : `faltam ${missing.length} itens`} para a entrega ficar completa.</span>}
            {!ACCOUNTS_ENABLED && <p className="text-sm text-muted-foreground">O rascunho fica neste navegador. Baixe o relatório em Markdown acima para guardar ou compartilhar sua entrega.</p>}
          </div>
        </form>

        {ACCOUNTS_ENABLED && askLogin && !signedIn && <div role="alert" className="rounded-sm border border-border bg-muted/40 p-4 text-sm">
          <p>Para entregar, entre na sua conta. Sua entrega fica salva neste navegador e você volta direto para cá.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm"><Link href={`/cadastro?next=${encodeURIComponent(loginNext)}`}>Criar conta grátis</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={`/login?next=${encodeURIComponent(loginNext)}`}>Já tenho conta</Link></Button>
          </div>
        </div>}
        {error && <p role="alert" className="text-sm text-[var(--negative-foreground)]">{error}</p>}
        {state === "done" && <div role="status" aria-live="polite" className="rounded-sm border border-primary/30 bg-primary/[0.04] p-4">
          <p className="text-sm font-medium text-primary">Evidência salva. Lab concluído.</p>
          <p className="mt-2 text-sm text-muted-foreground">Sua entrega virou um case com contexto, evidência e passos para reproduzir.</p>
          <Button asChild size="sm" className="mt-3"><Link href={`/labs/${challenge.number}/conclusao`}>Ver meu case <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
        </div>}

        <SubmissionHistory labSlug={challenge.id} submissions={submissions} />
      </section>}
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      {step === 0
        ? <Button asChild variant="ghost" size="sm"><Link href={back.href}><ArrowLeft className="size-3.5" aria-hidden="true" /> Voltar</Link></Button>
        : <Button type="button" variant="ghost" size="sm" onClick={() => setStep(step - 1)}><ArrowLeft className="size-3.5" aria-hidden="true" /> {steps[step - 1].label}</Button>}
      {step < steps.length - 1 && <Button type="button" onClick={() => setStep(step + 1)}>{step === 0 ? "Ir para o teste" : "Registrar a entrega"} <ArrowRight className="size-4" aria-hidden="true" /></Button>}
    </div>

    {ACCOUNTS_ENABLED && !signedIn && step < 2 && <p className="mt-6 flex gap-3 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <span>Você pode fazer o Lab inteiro sem conta. Para enviar a entrega,{" "}
        <Link href={`/login?next=${encodeURIComponent(loginNext)}`} className="font-medium text-primary underline underline-offset-4">entre</Link> ou{" "}
        <Link href={`/cadastro?next=${encodeURIComponent(loginNext)}`} className="font-medium text-primary underline underline-offset-4">crie uma conta grátis</Link>. O que você anotar fica salvo neste navegador.
      </span>
    </p>}
  </div></main>;
}

function Brief({ label, value }: { label: string; value: ReactNode }) {
  return <div><dt className="text-sm font-semibold">{label}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{value}</dd></div>;
}

function CheckRow({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return <label className="flex min-h-6 cursor-pointer items-start gap-3 text-sm leading-6">
    <input type="checkbox" checked={checked} onChange={onToggle} className="mt-1 size-4 shrink-0 accent-[var(--primary)]" />
    <span className={checked ? "text-muted-foreground line-through decoration-border" : ""}>{label}</span>
  </label>;
}

function CopyBox({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return <div className="grid gap-1">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    <div className="flex items-start justify-between gap-3 rounded-sm border border-dashed border-border bg-background p-3">
      <p className="min-w-0 select-all font-mono text-xs leading-5">{text}</p>
      <Button type="button" size="sm" variant="outline" onClick={() => void copy()} aria-label={`Copiar ${label}`} className="shrink-0">
        {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />} {copied ? "Copiado" : "Copiar"}
      </Button>
    </div>
  </div>;
}

function DeliveryField({ id, label, hint, value, onChange, rows }: { id: string; label: string; hint: string; value: string; onChange: (value: string) => void; rows: number }) {
  return <div className="grid gap-1.5">
    <label htmlFor={`lab-${id}`} className="text-sm font-semibold">{label}</label>
    <p id={`lab-${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>
    <Textarea id={`lab-${id}`} aria-describedby={`lab-${id}-hint`} value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="text-sm leading-6" />
  </div>;
}

function Choice({ name, checked, onChange, label }: { name: string; checked: boolean; onChange: () => void; label: string }) {
  return <label className={`inline-flex min-h-11 cursor-pointer items-center rounded-sm border px-3 text-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring ${checked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
    <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
    {label}
  </label>;
}
