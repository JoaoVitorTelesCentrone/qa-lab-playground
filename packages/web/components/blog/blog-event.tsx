"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export type BlogEventName = "article_view" | "practice_cta_click" | "practice_arrival" | "series_navigation";

export function trackBlogEvent(event: BlogEventName, slug: string) {
  void fetch("/api/blog-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event, slug }),
    keepalive: true,
  }).catch(() => undefined);
}

export function BlogArticleView({ slug }: { slug: string }) {
  useEffect(() => {
    trackBlogEvent("article_view", slug);
  }, [slug]);

  return null;
}

export function BlogPracticeArrival() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const slug = url.searchParams.get("fromBlog");
    if (!slug) return;
    trackBlogEvent("practice_arrival", slug);
    url.searchParams.delete("fromBlog");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return null;
}

export function BlogEventCapture({ event, slug, className, children }: { event: BlogEventName; slug: string; className?: string; children: ReactNode }) {
  return <div className={className} onClick={() => trackBlogEvent(event, slug)}>{children}</div>;
}
