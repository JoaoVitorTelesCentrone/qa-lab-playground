import Link from "next/link";
import { FlaskConical, ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex items-center justify-center size-24 rounded-3xl bg-mint/10 border border-mint/20">
              <Construction className="size-12 text-mint/60" />
            </div>
            <span className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
              404
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-wider text-mint italic">
            Em breve.
          </h1>
          <p className="text-off-white/60 leading-relaxed">
            Esta página ainda está sendo construída ou foi temporariamente desativada.
            Confira os{" "}
            <Link href="/proximos-passos" className="text-mint hover:underline font-semibold">
              Próximos Passos
            </Link>{" "}
            para saber o que vem por aí.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/proximos-passos">
              <FlaskConical className="size-4" />
              Próximos Passos
            </Link>
          </Button>
        </div>

        {/* Watermark */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-mint/20">
          QA Lab Playground
        </p>
      </div>
    </div>
  );
}
