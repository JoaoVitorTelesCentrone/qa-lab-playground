import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (VIEW_ONLY_LAUNCH) notFound();
  return children;
}
