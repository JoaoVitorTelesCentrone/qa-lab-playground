import featuredLabsData from "@/content/featured-labs.json";
import projectsData from "@/content/projects.json";
import type { BlogPost } from "@/lib/blog-posts";
import { allPosts as posts } from "@/lib/blog/all-posts";

export type FeaturedLab = { title: string; track: string; summary: string; href: string; bugHref?: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  /** Caminho interno ou URL externa. */
  demo: string | null;
  video: string | null;
  github: string | null;
  /** Rascunho não aparece no site: preencha os dados e troque para false. */
  draft: boolean;
};

export const featuredLabs: FeaturedLab[] = featuredLabsData;

export const projects: Project[] = (projectsData as Project[]).filter((project) => !project.draft);

/** Post mais recente pela data de publicação; posts sem data ficam por último. */
export function latestPost(list: BlogPost[] = posts): BlogPost | undefined {
  return [...list].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))[0];
}
