import Link from "next/link";
import { RequirementsLab } from "@/components/mentorship/requirements-lab";

export const metadata = { title: "Uma história, duas interpretações | Mentoria QA Lab" };

export default function RequirementsLabPage() {
  return <main className="mx-auto max-w-5xl px-5 py-10 text-off-white sm:px-8">
    <Link href="/mentoria/conteudo/3/desafio" className="text-sm font-bold text-mint underline underline-offset-4">Voltar ao desafio da semana 3</Link>
    <header className="my-9 max-w-[70ch]">
      <p className="text-sm text-mint">Prática científica · Semana 3 · Cerca de 30 minutos</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Uma história, duas interpretações</h1>
      <p className="mt-4 text-lg leading-8 text-[#C8CFD7]">Desenhe testes para uma regra incompleta. Depois, confronte sua interpretação com critérios verificáveis e explique o que mudou.</p>
      <p className="mt-3 text-sm leading-6 text-[#AAB2BC]">Cenário de pensamentos e ações inspirado no BrotoSpace e em pesquisa sobre clareza de requisitos. As regras desta atividade pertencem somente a este exercício.</p>
    </header>
    <RequirementsLab />
    <details className="mt-12 border-t border-white/15 pt-5 text-sm leading-7 text-[#C8CFD7]">
      <summary className="cursor-pointer font-semibold text-mint">Fundamentação e critérios de revisão</summary>
      <p className="mt-4">O mentor observará distinção entre regra e hipótese, cobertura de limites e permissões, resultados verificáveis e qualidade da comparação. Não há nota automática baseada na quantidade de texto.</p>
      <p className="mt-3">A segunda resposta também pode melhorar por prática e repetição. Uma tentativa individual não demonstra que a clareza causou a melhoria nem reproduz os resultados de um artigo.</p>
      <a className="mt-3 inline-block text-mint underline" href="https://doi.org/10.15282/ijsecs.12.1.2026.1.0147" target="_blank" rel="noreferrer">Modelo conceitual sobre clareza de requisitos, eficiência da sprint e qualidade</a>
    </details>
  </main>;
}
