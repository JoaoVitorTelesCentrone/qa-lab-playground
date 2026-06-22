"use client";

export default function LabError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-lg px-5 py-24 text-center"><h1 className="text-2xl font-black text-off-white">Não foi possível carregar o Workspace</h1><p className="mt-3 text-sm leading-6 text-[#8B949E]">Confira a conexão e tente novamente. Seus dados salvos não foram alterados.</p><button type="button" onClick={reset} className="mt-6 rounded-lg bg-mint px-4 py-2.5 text-xs font-black text-[#101319]">Tentar novamente</button></div>;
}
