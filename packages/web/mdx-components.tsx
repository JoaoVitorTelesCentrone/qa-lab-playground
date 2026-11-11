import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Obrigatório para o @next/mdx no App Router. Os estilos do corpo vêm de
// .qa-article-body (o mesmo dos posts antigos); aqui só os links internos viram
// <Link> e os externos abrem em nova aba.
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => href.startsWith("/")
    ? <Link href={href} {...props}>{children}</Link>
    : <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
