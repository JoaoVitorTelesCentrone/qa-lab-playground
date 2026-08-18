"use client";

// Conclusão do Lab: transforma a evidência entregue em algo publicável.
//
// A entrega crua já ficava salva antes desta página existir — o que faltava era
// o passo entre "salvei" e "mostrei para alguém". Aqui o aluno vê o case como
// um estranho veria, publica em um clique e sai com o texto do post pronto.
//
// Publicar é uma decisão em três níveis no banco (portfólio público, evidência
// publicada e endereço definido). Ficavam espalhados em /perfil e quase ninguém
// completava os três; aqui viram um botão só, com o efeito escrito na tela.

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { ArrowRight, Award, Check, ChevronRight, Copy, Download, ExternalLink, FlaskConical, Globe, ImageIcon, Linkedin, Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CaseView } from "@/components/portfolio/case-view";
import { CaseCardView, CASE_CARD_SIZE } from "@/components/portfolio/case-card";
import { caseSkills, linkedInPost, severityLabels, type QaCase } from "@/lib/product/case";
import { normalizeUsername } from "@/lib/product/username";

const PREVIEW_WIDTH = 224;

type TrackSummary = {
  slug: string;
  name: string;
  outcome: string;
  nextLab: { number: number; title: string } | null;
  eligible: boolean;
  required: number;
  completed: number;
  missing: number;
  stats: { labs: number; evidence: number; highImpact: number };
  certificateCode: string | null;
};

export function ConclusionClient({ item, olderCount, name, profile, track, siteUrl }: {
  item: QaCase;
  olderCount: number;
  name: string;
  profile: { username: string; portfolioPublic: boolean };
  track: TrackSummary | null;
  /** URL canônica do site, vinda do servidor. */
  siteUrl: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username || normalizeUsername(name));
  const [isPublic, setIsPublic] = useState(profile.portfolioPublic);
  const [published, setPublished] = useState(item.submission.published);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [certificate, setCertificate] = useState(track?.certificateCode ?? null);
  const [post, setPost] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const live = isPublic && published && username.length >= 3;
  // A URL vem do servidor, não de window.location: o aluno pode estar em um
  // preview ou em localhost, e o link que ele publica precisa ser o canônico.
  const caseUrl = `${siteUrl}/portfolio/${username}/${item.labSlug}`;
  const generated = useMemo(() => linkedInPost(item, { name, url: caseUrl }), [item, name, caseUrl]);

  // O texto sugerido acompanha a URL enquanto o aluno não mexer nele — senão
  // quem edita antes de definir o endereço publica um link que não resolve.
  const text = post || generated;

  async function copy(value: string, tag: string) {
    await navigator.clipboard.writeText(value);
    setCopied(tag);
    window.setTimeout(() => setCopied(""), 2000);
  }

  async function publish() {
    setBusy("publish");
    setError("");
    const settings = await fetch("/api/v1/portfolio", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, portfolioPublic: true }),
    });
    const settingsBody = await settings.json().catch(() => null);
    if (!settings.ok) {
      setBusy("");
      setError(settingsBody?.error?.details?.username ?? settingsBody?.error?.message ?? "Não foi possível publicar o case.");
      return;
    }
    setUsername(settingsBody.data.username);
    setIsPublic(true);

    const evidence = await fetch("/api/v1/portfolio", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ submissionId: item.submission.id, published: true }),
    });
    setBusy("");
    if (!evidence.ok) {
      const body = await evidence.json().catch(() => null);
      setError(body?.error?.message ?? "Não foi possível publicar a evidência.");
      return;
    }
    setPublished(true);
    router.refresh();
  }

  async function unpublish() {
    setBusy("publish");
    setError("");
    const response = await fetch("/api/v1/portfolio", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ submissionId: item.submission.id, published: false }),
    });
    setBusy("");
    if (!response.ok) {
      setError("Não foi possível despublicar o case.");
      return;
    }
    setPublished(false);
    router.refresh();
  }

  async function issueCertificate() {
    if (!track) return;
    setBusy("certificate");
    setError("");
    const response = await fetch("/api/v1/certificates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ track: track.slug }),
    });
    const body = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) {
      setError(body?.error?.message ?? "Não foi possível emitir o certificado.");
      return;
    }
    setCertificate(body.data.code);
  }

  /**
   * O card vira PNG a partir do nó real, não de um canvas desenhado à mão: o
   * que o aluno vê na prévia é byte a byte o que sai no arquivo.
   */
  async function renderCard() {
    if (!cardRef.current) return null;
    return toPng(cardRef.current, { ...CASE_CARD_SIZE, pixelRatio: 1 });
  }

  async function downloadCard() {
    setBusy("card");
    try {
      const dataUrl = await renderCard();
      if (!dataUrl) return;
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `case-lab-${item.label}.png`;
      anchor.click();
    } finally {
      setBusy("");
    }
  }

  /** Copiar a imagem deixa colar direto no compositor do LinkedIn, sem passar pelo arquivo. */
  async function copyCard() {
    setBusy("card");
    setError("");
    try {
      const dataUrl = await renderCard();
      if (!dataUrl) return;
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied("card");
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      // Firefox e Safari mais antigos não têm ClipboardItem para imagem.
      setError("Seu navegador não deixa copiar imagem. Use o botão de baixar.");
    } finally {
      setBusy("");
    }
  }

  function downloadCase() {
    const content = [
      `# ${item.title}`,
      "",
      `**Lab ${item.label} · ${item.area} · severidade ${severityLabels[item.severity]}**`,
      "",
      "## Objetivo",
      "",
      item.objective,
      "",
      "## Comportamento esperado (oráculo)",
      "",
      item.expected,
      "",
      "## Resultado observado",
      "",
      item.submission.result,
      "",
      "## Passos de reprodução",
      "",
      ...item.steps.map((step, index) => `${index + 1}. ${step}`),
      ...(item.criteria.length > 0 ? ["", "## Critérios de aceite confirmados", "", ...item.criteria.map((criterion) => `- [x] ${criterion}`)] : []),
      "",
      "## Competências comprovadas",
      "",
      ...caseSkills(item).map((skill) => `- ${skill}`),
      "",
      `_Produzido no QA Lab Playground em ${new Date(item.createdAt).toLocaleDateString("pt-BR")}._`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `case-lab-${item.label}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <main className="qa-system"><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <Breadcrumb>
      <BreadcrumbList className="gap-1.5 text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/labs" className="flex items-center gap-1.5 rounded-sm px-1 py-0.5 hover:text-foreground">
              <FlaskConical className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Labs
            </Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator className="text-muted-foreground/70"><ChevronRight /></BreadcrumbSeparator>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/labs/${item.labNumber}`} className="rounded-sm px-1 py-0.5 hover:text-foreground">Lab {item.label}</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator className="text-muted-foreground/70"><ChevronRight /></BreadcrumbSeparator>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage className="rounded-sm px-1 py-0.5 font-medium">Conclusão</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <p className="qa-eyebrow mt-6">Lab {item.label} concluído</p>
    <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Sua entrega virou um case de portfólio.</h1>
    <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
      Abaixo está o case exatamente como um recrutador vai abrir: o contexto do sistema, o que você tinha que provar, o que encontrou e como reproduzir. Publique, copie o texto do post e leve para o LinkedIn.
    </p>

    <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="rounded-xl border border-border bg-card p-6 sm:p-8" aria-label="Prévia do case">
        <CaseView item={item} />
        {olderCount > 0 && <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          Você tem {olderCount} entrega(s) anterior(es) neste Lab. O case público mostra sempre a mais recente. <Link href="/perfil" className="text-primary">Ver histórico</Link>
        </p>}
      </section>

      <div className="grid gap-6">
        <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="publicar">
          <h2 id="publicar" className="flex items-center gap-2 text-sm font-medium">
            {live ? <Globe className="size-4 text-primary" aria-hidden="true" /> : <Lock className="size-4 text-muted-foreground" aria-hidden="true" />}
            {live ? "Case publicado" : "Publicar o case"}
          </h2>

          <label className="mt-4 grid gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Seu endereço público</span>
            <div className="flex items-center rounded-md border border-border bg-background px-2.5 text-sm">
              <span className="shrink-0 text-muted-foreground">/portfolio/</span>
              <input
                value={username}
                onChange={(event) => setUsername(normalizeUsername(event.target.value))}
                minLength={3}
                maxLength={30}
                aria-label="Nome de usuário do portfólio"
                className="w-full bg-transparent py-2 outline-none"
                placeholder="seu-nome"
              />
            </div>
          </label>

          {live
            ? <>
                <p className="mt-3 break-all rounded-md border border-border bg-background p-2.5 font-mono text-xs text-muted-foreground">{caseUrl}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" onClick={() => copy(caseUrl, "url")}>
                    {copied === "url" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Copiar link
                  </Button>
                  <Button asChild size="sm" variant="outline"><Link href={`/portfolio/${username}/${item.labSlug}`} target="_blank" rel="noopener noreferrer">Abrir <ExternalLink className="size-3.5" /></Link></Button>
                </div>
                <Button type="button" size="sm" variant="ghost" className="mt-2 px-0 text-muted-foreground" disabled={busy === "publish"} onClick={unpublish}>
                  {busy === "publish" && <Loader2 className="size-3.5 animate-spin" />} Despublicar este case
                </Button>
              </>
            : <>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Publicar liga sua página pública e deixa <strong>este case</strong> visível no endereço acima. Suas outras evidências continuam privadas até você publicar cada uma.
                </p>
                <Button type="button" className="mt-3 w-full" disabled={busy === "publish" || username.length < 3} onClick={publish}>
                  {busy === "publish" ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />} Publicar case
                </Button>
              </>}

          {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}

          <Button type="button" size="sm" variant="outline" className="mt-4 w-full" onClick={downloadCase}>
            <Download className="size-3.5" /> Baixar case em Markdown
          </Button>
        </section>

        {track && <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="trilha">
          <h2 id="trilha" className="flex items-center gap-2 text-sm font-medium"><Award className="size-4 text-primary" aria-hidden="true" /> Trilha {track.name}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{track.completed} de {track.required} Labs liberados concluídos · {track.stats.evidence} evidência(s)</p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${track.required === 0 ? 0 : Math.round((track.completed / track.required) * 100)}%` }} />
          </div>

          {certificate
            ? <>
                <Badge className="mt-4 font-normal">Certificado emitido</Badge>
                <p className="mt-2 font-mono text-xs text-muted-foreground">{certificate}</p>
                <Button asChild size="sm" className="mt-3 w-full"><Link href={`/certificado/${certificate}`}>Ver certificado <ArrowRight className="size-3.5" /></Link></Button>
              </>
            : track.eligible
              ? <>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">Você fechou todos os Labs liberados desta trilha. O certificado é público e verificável por código — dá para colar em &ldquo;Licenças e certificados&rdquo; do LinkedIn.</p>
                  <Button type="button" className="mt-3 w-full" disabled={busy === "certificate"} onClick={issueCertificate}>
                    {busy === "certificate" ? <Loader2 className="size-4 animate-spin" /> : <Award className="size-4" />} Emitir certificado
                  </Button>
                </>
              : <>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">Faltam {track.missing} Lab(s) para o certificado da trilha. Ao fechar: {track.outcome}</p>
                  {track.nextLab && <Button asChild size="sm" className="mt-3 w-full"><Link href={`/labs/${track.nextLab.number}`}>Próximo: {track.nextLab.title} <ArrowRight className="size-3.5" /></Link></Button>}
                </>}
        </section>}
      </div>
    </div>

    {/* O card fica fora da tela em tamanho real: html-to-image captura o nó como
        ele é, então não dá para escalar aqui — só mostrar uma prévia reduzida. */}
    <div aria-hidden="true" className="pointer-events-none fixed left-[-9999px] top-0">
      <CaseCardView ref={cardRef} item={item} author={name} />
    </div>

    <section className="mt-10 rounded-xl border border-border bg-card p-6 sm:p-8" aria-labelledby="imagem">
      <h2 id="imagem" className="flex items-center gap-2 text-lg font-semibold"><ImageIcon className="size-5 text-primary" aria-hidden="true" /> Imagem do case</h2>
      <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
        Post com imagem alcança mais que post com link. Publique este card e deixe o link do case no primeiro comentário ou no fim do texto.
      </p>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* `scale` não muda o layout, então a caixa externa precisa da altura já
            reduzida — sem isso ela esticaria os 1350px reais do card. */}
        <div
          className="shrink-0 overflow-hidden rounded-lg border border-border"
          style={{ width: PREVIEW_WIDTH, height: PREVIEW_WIDTH * (CASE_CARD_SIZE.height / CASE_CARD_SIZE.width) }}
          aria-label="Prévia da imagem"
        >
          <div className="origin-top-left" style={{ transform: `scale(${PREVIEW_WIDTH / CASE_CARD_SIZE.width})`, width: CASE_CARD_SIZE.width, height: CASE_CARD_SIZE.height }}>
            <CaseCardView item={item} author={name} />
          </div>
        </div>

        <div className="grid gap-2">
          <p className="text-xs text-muted-foreground">{CASE_CARD_SIZE.width} × {CASE_CARD_SIZE.height} · retrato, o formato que ocupa mais feed</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={busy === "card"} onClick={downloadCard}>
              {busy === "card" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} Baixar PNG
            </Button>
            <Button type="button" variant="outline" disabled={busy === "card"} onClick={copyCard}>
              {copied === "card" ? <Check className="size-4" /> : <Copy className="size-4" />} {copied === "card" ? "Copiada" : "Copiar imagem"}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-10 rounded-xl border border-border bg-card p-6 sm:p-8" aria-labelledby="post">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="post" className="flex items-center gap-2 text-lg font-semibold"><Linkedin className="size-5 text-primary" aria-hidden="true" /> Post pronto para o LinkedIn</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">Escrito a partir da sua entrega — objetivo, achado, passos e critérios. Edite à vontade: o post é seu, o produto só evita a folha em branco.</p>
        </div>
        <span className="text-xs text-muted-foreground">{text.length}/3000</span>
      </div>

      <Textarea value={text} onChange={(event) => setPost(event.target.value)} aria-label="Texto do post" className="mt-4 min-h-72 text-sm leading-6" />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => copy(text, "post")}>
          {copied === "post" ? <Check className="size-4" /> : <Copy className="size-4" />} {copied === "post" ? "Copiado" : "Copiar texto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await copy(text, "post");
            window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank", "noopener,noreferrer");
          }}
        >
          <Linkedin className="size-4" /> Copiar e abrir o LinkedIn
        </Button>
        {post !== "" && <Button type="button" variant="ghost" onClick={() => setPost("")}>Restaurar texto sugerido</Button>}
      </div>

      {!live && <p className="mt-3 text-xs text-muted-foreground">O post já cita o link do case, mas ele só abre para outras pessoas depois que você publicar.</p>}
    </section>

    <nav className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
      <Button asChild variant="outline"><Link href={`/labs/${item.labNumber}`}>Voltar ao Lab</Link></Button>
      <Button asChild variant="outline"><Link href="/labs">Escolher o próximo Lab</Link></Button>
      <Button asChild variant="ghost"><Link href="/perfil">Meu portfólio</Link></Button>
    </nav>
  </div></main>;
}
