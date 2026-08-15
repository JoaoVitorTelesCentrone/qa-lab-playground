import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { SystemModuleClient } from "@/components/playground/system-module";
import { systemModules } from "@/lib/lab-system";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = systemModules.find((item) => item.slug === slug);
  if (!module) notFound();
  return <main className="qa-system"><div className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> QA Lab System</Link><section className="qa-module-detail mt-8"><p className="qa-eyebrow">Modulo</p><h1>{module.name}</h1><p>{module.description}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{module.features.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><CheckCircle2 className="size-4 text-primary" />{feature}</div>)}</div></section><SystemModuleClient module={module} /></div></main>;
}
