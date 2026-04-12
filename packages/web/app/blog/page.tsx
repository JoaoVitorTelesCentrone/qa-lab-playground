import { BookOpen, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-6 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <BookOpen className="size-5 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              BLOG QA LAB
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              Conteúdo educacional
            </p>
          </div>
        </div>

        <div className="space-y-2 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-wider text-off-white italic">
            Novos textos <span className="text-mint">toda semana.</span>
          </p>
          <p className="text-off-white/50 leading-relaxed">
            Publicamos artigos semanalmente sobre qualidade de software,
            técnicas de teste e boas práticas para QAs em todos os níveis.
          </p>
        </div>
      </div>

      {/* CTA */}
      <Card className="border-mint/10 max-w-sm">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-neon/20 shrink-0 mt-0.5">
              <MessageCircle className="size-4 text-neon" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-off-white">
                Quer ter um texto publicado?
              </p>
              <p className="text-xs text-off-white/50 leading-relaxed">
                Manda uma mensagem para o QA Lab e a gente avalia publicar
                o seu conteúdo aqui.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
