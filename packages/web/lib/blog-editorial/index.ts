import type { BlogPost } from "../blog-posts";
import { foundationSeries } from "./foundations";
import { technicalSeries } from "./technical";
import { collaborationSeries } from "./collaboration";
import { labSeries } from "./labs";

export const editorialSeries = [
  ...foundationSeries,
  ...technicalSeries,
  ...collaborationSeries,
  ...labSeries,
];

// Data em que o caderno editorial entrou no ar. Cada história pode sobrescrever
// com `publishedAt` quando tiver uma data editorial própria.
const EDITORIAL_LAUNCH_DATE = "2026-10-28";

export const editorialPosts: BlogPost[] = editorialSeries.flatMap((series) =>
  series.stories.map((story, index) => {
    const words = [story.opening, story.example, ...story.steps, story.caution, story.exercise].join(" ").split(/\s+/).length;
    return {
      slug: story.slug,
      titulo: story.title,
      resumo: story.summary,
      autor: "QA Lab",
      publishedAt: story.publishedAt ?? EDITORIAL_LAUNCH_DATE,
      tags: [series.id, `section:${series.section}`],
      tempoLeitura: Math.max(2, Math.ceil(words / 170)),
      publicado: true,
      editorial: {
        seriesId: series.id,
        seriesTitle: series.title,
        seriesHref: series.href,
        section: series.section,
        color: series.color,
        number: index + 1,
        composition: (["field", "sequence", "decision"] as const)[index],
        artifact: story.steps,
        source: series.source,
      },
      blocos: [
        { type: "paragraph", content: story.opening },
        { type: "paragraph", content: story.example },
        { type: "ordered-list", items: story.steps },
        { type: "paragraph", content: story.caution },
        { type: "paragraph", content: story.exercise },
      ],
    };
  }),
);
