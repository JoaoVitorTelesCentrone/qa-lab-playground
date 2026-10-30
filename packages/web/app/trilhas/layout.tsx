import { notFound } from "next/navigation";
import { CONTENT_ONLY_LAUNCH } from "@/lib/product/launch";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";

export default function TracksLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (CONTENT_ONLY_LAUNCH) notFound();
  return <>
    <div className="border-b border-border bg-card/70 px-5 py-2 text-center text-xs text-muted-foreground">
      Ambiente de prática das trilhas: <a href={brotoSpaceSite.url} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">BrotoSpace ↗</a>
      <span className="ml-2">Use uma conta de teste e conteúdo sintético.</span>
    </div>
    {children}
  </>;
}
