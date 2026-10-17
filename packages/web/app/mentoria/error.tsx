"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MentorshipError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Erro ao carregar a area da mentoria", error);
  }, [error]);

  return <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
    <section role="alert" className="border border-coral/30 bg-[#171B21] p-6 sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-coral">Nao foi possivel carregar</p>
      <h1 className="mt-3 text-3xl font-black text-off-white">Sua jornada continua salva.</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#AAB2BC]">Ocorreu um problema ao abrir esta parte da mentoria. Tente carregar novamente; suas aulas e entregas salvas permanecem na conta.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>Tentar novamente</Button>
        <Button asChild variant="outline"><Link href="/mentoria/app">Voltar ao painel</Link></Button>
      </div>
    </section>
  </main>;
}
