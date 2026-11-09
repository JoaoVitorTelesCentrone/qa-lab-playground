import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, FlaskConical, GraduationCap, ListVideo, PlayCircle } from "lucide-react";
import { findToolGuide, toolGuideCategories, toolGuides, youtubeThumb, youtubeUrl, type GuideLang, type GuideLink, type GuideVideo } from "@/lib/tool-guides";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return toolGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const guide = findToolGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.name}: documentação, cursos e vídeos | QA Lab`,
    description: guide.tagline,
  };
}

function LangTag({ lang }: { lang: GuideLang }) {
  return <span className="shrink-0 border border-border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "pt" ? "PT-BR" : "EN"}</span>;
}

function LinkList({ items }: { items: GuideLink[] }) {
  return <ul className="divide-y divide-border border-y border-border">
    {items.map((item) => <li key={item.url}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-2 py-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4">
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2"><span className="font-semibold">{item.title}</span><LangTag lang={item.lang} /></span>
          <span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.note}</span>
        </span>
        <ArrowUpRight className="mt-1 size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </a>
    </li>)}
  </ul>;
}

function VideoCard({ video }: { video: GuideVideo }) {
  const thumb = youtubeThumb(video);
  return <a href={youtubeUrl(video)} target="_blank" rel="noopener noreferrer" className="group flex flex-col border border-border bg-card transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
    <span className="relative block aspect-video overflow-hidden bg-muted">
      {thumb
        // eslint-disable-next-line @next/next/no-img-element -- miniatura do YouTube, servida pelo próprio i.ytimg.com
        ? <img src={thumb} alt="" loading="lazy" className="size-full object-cover" />
        : <span className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"><ListVideo className="size-8" aria-hidden="true" /><span className="text-sm font-semibold">Playlist</span></span>}
      {thumb && <PlayCircle className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white opacity-90 drop-shadow transition-transform group-hover:scale-110" aria-hidden="true" />}
    </span>
    <span className="flex flex-1 flex-col gap-2 p-4">
      <span className="font-semibold leading-snug">{video.title}</span>
      <span className="mt-auto flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{video.channel}</span>
        {video.official && <span className="border border-primary/40 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">Canal oficial</span>}
        {video.kind === "playlist" && <span className="text-[11px] font-semibold uppercase tracking-wide">Playlist</span>}
        <LangTag lang={video.lang} />
      </span>
    </span>
  </a>;
}

function Section({ id, icon: Icon, title, hint, children }: { id: string; icon: typeof BookOpen; title: string; hint: string; children: React.ReactNode }) {
  return <section aria-labelledby={id} className="mt-12">
    <div className="flex items-center gap-3"><Icon className="size-5 text-primary" aria-hidden="true" /><h2 id={id} className="text-xl font-semibold">{title}</h2></div>
    <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    <div className="mt-4">{children}</div>
  </section>;
}

export default async function ToolGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = findToolGuide(slug);
  if (!guide) notFound();

  const videos = [...guide.videos].sort((a, b) => (a.lang === b.lang ? 0 : a.lang === "pt" ? -1 : 1));
  const others = toolGuides.filter((item) => item.category === guide.category && item.slug !== guide.slug);

  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <Link href="/ferramentas#guias" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      <ArrowLeft className="size-4" aria-hidden="true" /> Todas as ferramentas
    </Link>

    <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <p className="text-sm font-semibold text-primary">{toolGuideCategories[guide.category].title}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">{guide.name}</h1>
        <p className="mt-3 text-lg leading-8">{guide.tagline}</p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{guide.summary}</p>
      </div>
      <aside className="border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">O que estudar primeiro</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {guide.qaFocus.map((item) => <li key={item}>{item}</li>)}
        </ol>
        {guide.practice && <Link href={guide.practice.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <FlaskConical className="size-4" aria-hidden="true" /> Praticar no QA Lab: {guide.practice.label}
        </Link>}
      </aside>
    </header>

    <Section id="docs" icon={BookOpen} title="Documentação" hint="A fonte oficial. Volte aqui sempre que um vídeo estiver desatualizado.">
      <LinkList items={guide.docs} />
    </Section>

    {guide.courses.length > 0 && <Section id="cursos" icon={GraduationCap} title="Cursos gratuitos" hint="Trilhas estruturadas, sem custo para estudar.">
      <LinkList items={guide.courses} />
    </Section>}

    <Section id="videos" icon={PlayCircle} title="Vídeos no YouTube" hint="Selecionados de canais oficiais e de criadores reconhecidos na comunidade. Os em português aparecem primeiro.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => <VideoCard key={video.youtubeId} video={video} />)}
      </div>
    </Section>

    {others.length > 0 && <section aria-labelledby="relacionadas" className="mt-16 border-t border-border pt-8">
      <h2 id="relacionadas" className="text-lg font-semibold">Mais em {toolGuideCategories[guide.category].title.toLowerCase()}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {others.map((item) => <Link key={item.slug} href={`/ferramentas/${item.slug}`} className="border border-border px-3 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{item.name}</Link>)}
      </div>
    </section>}
  </main>;
}
