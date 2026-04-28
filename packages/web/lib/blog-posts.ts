// ==============================
// Types
// ==============================

export type BlockType =
  | "paragraph"
  | "heading"
  | "subheading"
  | "list"
  | "ordered-list"
  | "callout"
  | "code"
  | "quote"
  | "divider";

export interface Block {
  type: BlockType;
  content?: string;
  items?: string[];
  language?: string;
  variant?: "info" | "warning" | "tip" | "danger";
}

export interface BlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string;
  tags: string[];
  tempoLeitura: number;
  destaque?: boolean;
  blocos: Block[];
}

// ==============================
// Posts
// ==============================

export const posts: BlogPost[] = [];

// ==============================
// Helpers
// ==============================

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  return posts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
