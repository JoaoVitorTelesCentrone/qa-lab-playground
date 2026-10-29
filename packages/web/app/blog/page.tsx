import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { editorialSeries } from "@/lib/blog-editorial";
import { getPostBySlug, posts } from "@/lib/blog-posts";
import { CollaborateCta } from "@/components/blog/collaborate-cta";

const sections = [
  { id: "fundamentos", title: "Fundamentos e investigação", note: "Aprenda a fazer perguntas melhores e registrar o que descobriu." },
  { id: "tecnicas", title: "Ferramentas e técnicas", note: "Escolha a ferramenta pela pergunta que o teste precisa responder." },
  { id: "colaboracao", title: "Colaboração e carreira", note: "Qualidade também depende de conversas e decisões compartilhadas." },
  { id: "labs", title: "Percursos por Labs", note: "Aplique as ideias em jornadas concretas dos ambientes de treino." },
] as const;

export default function BlogPage() {
  const featured = posts.find((post) => post.destaque);

  return (
    <main className="qa-blog qa-editorial-home">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
        <header className="qa-editorial-home-hero">
          <div>
            <span className="qa-editorial-eyebrow">Caderno de campo · QA Lab</span>
            <h1>Ler para <em>testar melhor.</em></h1>
            <p>Ideias curtas, exemplos concretos e um exercício para cada tema das trilhas. Escolha a pergunta que você precisa responder hoje.</p>
            <a href="#fundamentos" className="qa-editorial-start">Explorar os artigos <ArrowDown className="size-4" aria-hidden="true" /></a>
          </div>
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="qa-editorial-featured">
              <span>Para começar · artigo em destaque</span>
              <strong>{featured.titulo}</strong>
              <small>{featured.resumo}</small>
              <span className="qa-editorial-featured-action">Ler artigo <ArrowRight className="size-4" aria-hidden="true" /></span>
            </Link>
          )}
        </header>

        <nav aria-label="Assuntos do blog" className="qa-editorial-index">
          {sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>
          ))}
        </nav>

        {sections.map((section) => {
          const series = editorialSeries.filter((item) => item.section === section.title);
          return (
            <section key={section.id} id={section.id} className="qa-editorial-section" aria-labelledby={`${section.id}-title`}>
              <header className="qa-editorial-section-heading">
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <p>{section.note}</p>
              </header>
              {series.map((track) => (
                <div key={track.id} className="qa-editorial-track" style={{ "--essay-accent": track.color } as CSSProperties}>
                  <div className="qa-editorial-track-heading">
                    <h3>{track.title}</h3>
                    <Link href={track.href}>Ir para a trilha <ArrowRight className="size-4" aria-hidden="true" /></Link>
                  </div>
                  <div className="qa-editorial-story-grid">
                    {track.stories.map((story, index) => {
                      const post = getPostBySlug(story.slug);
                      return (
                        <Link href={`/blog/${story.slug}`} key={story.slug} className="qa-editorial-story-card" data-composition={(["field", "sequence", "decision"] as const)[index]}>
                          <span className="qa-editorial-story-card-top"><span>{String(index + 1).padStart(2, "0")} / 03</span><span>{post?.tempoLeitura ?? 2} min</span></span>
                          <strong>{story.title}</strong>
                          <span className="qa-editorial-story-summary">{story.summary}</span>
                          <span className="qa-editorial-story-action">Ler artigo <ArrowRight className="size-4" aria-hidden="true" /></span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          );
        })}

        <div className="mt-16"><CollaborateCta /></div>
      </div>
    </main>
  );
}
