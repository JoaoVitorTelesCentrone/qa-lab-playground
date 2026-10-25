import Link from "next/link";
import { OracleLab } from "@/components/mentorship/oracle-lab";

export const metadata = { title: "O teste verde que não encontra o defeito | Mentoria QA Lab" };

export default function OracleLabPage() {
  return <main className="mx-auto max-w-5xl px-5 py-10 text-off-white sm:px-8">
    <Link href="/mentoria/conteudo/6/desafio" className="text-sm font-bold text-mint underline underline-offset-4">Voltar ao desafio da semana 6</Link>
    <header className="my-9 max-w-[70ch]"><p className="text-sm text-mint">Prática científica · Semanas 6 e 8 · Cerca de 25 minutos</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">O teste verde que não encontra o defeito</h1><p className="mt-4 text-lg leading-8 text-[#C8CFD7]">Execute o mesmo teste contra duas versões. Depois, construa um resultado esperado independente que detecte a variante defeituosa.</p><p className="mt-3 text-sm leading-6 text-[#AAB2BC]">As execuções usam funções e dados sintéticos versionados dentro deste laboratório. O caso simula ações e crescimento do BrotoSpace; nenhum registro real do produto é criado ou alterado.</p></header>
    <OracleLab />
    <details className="mt-12 border-t border-white/15 pt-5 text-sm leading-7 text-[#C8CFD7]"><summary className="cursor-pointer font-semibold text-mint">Como interpretar o resultado</summary><p className="mt-4">Um teste verde confirma somente as condições que verificou. Aqui, o primeiro teste comprova renderização; o segundo compara a contagem de ações concluídas com um esperado calculado fora da função testada.</p><p className="mt-3">A variante defeituosa conta uma ação pendente como concluída. Encontrá-la neste seed demonstra a sensibilidade deste oráculo ao defeito controlado, sem medir cobertura geral ou capacidade de encontrar falhas desconhecidas.</p><p className="mt-3">A atividade aplica a lacuna descrita no plano científico sobre validade de oráculos e manutenção. Como contexto, consulte o <a className="text-mint underline" href="https://doi.org/10.54254/2755-2721/2026.ld36950" target="_blank" rel="noreferrer">trabalho sobre automação de testes com IA</a> e o <a className="text-mint underline" href="https://arxiv.org/abs/2601.02454" target="_blank" rel="noreferrer">preprint sobre teste agentivo com feedback de execução</a>.</p></details>
  </main>;
}
