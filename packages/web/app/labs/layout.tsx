import { notFound } from "next/navigation";
import { CONTENT_ONLY_LAUNCH } from "@/lib/product/launch";
import { BlogPracticeArrival } from "@/components/blog/blog-event";

export default function LabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (CONTENT_ONLY_LAUNCH) notFound();
  return <><BlogPracticeArrival />{children}</>;
}
