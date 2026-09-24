import { notFound } from "next/navigation";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";

export default function PlansLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (VIEW_ONLY_LAUNCH) notFound();
  return children;
}
