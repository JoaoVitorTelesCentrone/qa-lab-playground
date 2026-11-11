import { posts as typescriptPosts, type BlogPost } from "@/lib/blog-posts";
import { isPublicPost } from "@/lib/product/features";
import { publishedMdxBlogPosts } from "./mdx-posts";

/**
 * Todos os posts publicados: MDX (content/blog) primeiro, depois os escritos em
 * TypeScript. Só no servidor: os posts MDX são lidos do disco.
 */
export const allPosts: BlogPost[] = [...publishedMdxBlogPosts(), ...typescriptPosts].filter((post) => isPublicPost(post.slug));
