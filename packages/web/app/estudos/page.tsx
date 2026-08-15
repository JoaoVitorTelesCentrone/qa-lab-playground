import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3, Code2, MessageSquareText, PenLine, Route, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/blog-posts";
import { discussionPrompts, featuredPosts, getTrackPosts, studyTracks } from "@/lib/study-content";

export const metadata = {
  title: "Estudos",
  description: "Trilhas de estudo QA Lab conectadas aos exercicios praticos do playground.",
};

const levelStyle = {
  Fundacao: "border-mint/30 bg-mint/10 text-mint",
  Pratica: "border-neon/30 bg-neon/10 text-neon",
  Avancado: "border-coral/30 bg-coral/10 text-coral",
};

export default function EstudosPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <Badge className="gap-2" variant="outline">
            <BookOpenText className="size-3.5" />
            Forum, blog e curso
          </Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-off-white sm:text-6xl">
            Estude exatamente o que voce pratica no QA Lab.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#AAB2BC]">
            Cada trilha junta explicacao curta, artigo de apoio, discussao de comunidade e um exercicio
            real para transformar leitura em entrega.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#trilhas" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
              Ver trilhas
              <ArrowRight className="size-4" />
            </Link>
            <Link href="#forum" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-off-white">
              Abrir discussoes
              <MessageSquareText className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ["4", "trilhas guiadas"],
            ["6", "artigos conectados"],
            ["3", "debates iniciais"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-[#171B21] p-5">
              <p className="text-3xl font-black text-mint">{value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="trilhas" className="mt-16 scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Curso pratico</p>
            <h2 className="mt-3 text-3xl font-black text-off-white">Trilhas por competencia</h2>
          </div>
          <Route className="hidden size-6 text-neon sm:block" />
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {studyTracks.map((track) => {
            const trackPosts = getTrackPosts(track);
            return (
              <article key={track.id} className="rounded-lg border border-white/10 bg-[#171B21] p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${levelStyle[track.level]}`}>
                    {track.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B949E]">
                    <Clock3 className="size-3.5" />
                    {track.duration}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-black text-off-white">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{track.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {track.focus.map((item) => (
                    <Badge key={item} variant="secondary" className="normal-case tracking-normal">
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-mint/15 bg-mint/[.04] p-4">
                  <div className="flex items-start gap-3">
                    <Target className="mt-0.5 size-4 shrink-0 text-mint" />
                    <p className="text-sm leading-6 text-[#AAB2BC]">{track.checkpoint}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {trackPosts.map((post) => (
                    <Link key={post.slug} href={`/estudos/${post.slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-3 text-sm font-bold text-off-white transition hover:border-mint/30 hover:text-mint">
                      <span>{post.titulo}</span>
                      <ArrowRight className="size-4 shrink-0" />
                    </Link>
                  ))}
                </div>

                <Link href={track.exerciseHref} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-4 text-sm font-black text-[#101319]">
                  {track.exerciseLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-neon/25 bg-neon/[.05] p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Code2 className="size-5 text-neon" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Curso completo</p>
            </div>
            <h2 className="mt-4 text-3xl font-black text-off-white">Cypress do zero à arquitetura de suíte</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">
              Trilha de 8 semanas com fundamentos, intercept, API, autenticação, CI/CD, BDD, component testing,
              acessibilidade, relatórios, flakiness e IA aplicada à automação.
            </p>
          </div>
          <Link href="/cursos" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
            Abrir catálogo
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Blog de apoio</p>
            <h2 className="mt-3 text-3xl font-black text-off-white">Leituras curtas antes da pratica</h2>
          </div>
          <PenLine className="hidden size-6 text-coral sm:block" />
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/estudos/${post.slug}`} className="flex min-h-64 flex-col rounded-lg border border-white/10 bg-[#171B21] p-5 transition hover:border-mint/35">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="ghost" className="px-0 normal-case tracking-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="mt-4 text-lg font-black leading-snug text-off-white">{post.titulo}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#8B949E]">{post.resumo}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-mint">
                {formatDate(post.data)} - {post.tempoLeitura} min
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="forum" className="mt-16 scroll-mt-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Forum de estudo</p>
          <h2 className="mt-3 text-3xl font-black text-off-white">Perguntas para discutir depois do exercicio</h2>
        </div>
        <div className="mt-7 grid gap-4">
          {discussionPrompts.map((prompt) => (
            <article key={prompt.id} className="grid gap-4 rounded-lg border border-white/10 bg-[#171B21] p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="normal-case tracking-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="mt-4 text-xl font-black text-off-white">{prompt.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{prompt.summary}</p>
              </div>
              <div className="flex items-center gap-3 md:justify-end">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-[#AAB2BC]">
                  <MessageSquareText className="size-4 text-mint" />
                  {prompt.replies}
                </span>
                <Link href={prompt.exerciseHref} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-mint/25 px-4 text-sm font-bold text-mint">
                  Contexto
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-neon/20 bg-neon/[.05] p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="mt-1 size-5 shrink-0 text-neon" />
          <div>
            <h2 className="text-xl font-black text-off-white">Formato recomendado de estudo</h2>
            <p className="mt-2 text-sm leading-7 text-[#AAB2BC]">
              Leia um artigo, execute o exercicio indicado, registre sua entrega e volte para responder uma discussao.
              O objetivo e criar repertorio pratico, nao acumular teoria solta.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
