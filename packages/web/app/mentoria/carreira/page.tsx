import Link from "next/link";
import { BriefcaseBusiness, Linkedin, MessageCircle, Mic2 } from "lucide-react";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { CareerTemplate } from "@/components/mentorship/career-toolkit";

export const metadata = { title: "Carreira em QA | Mentoria QA Lab" };

const resources = [
  {
    title: "Currículo de QA",
    icon: BriefcaseBusiness,
    purpose: "Mostre decisões e resultados observáveis. Ajuste o currículo para a vaga e não declare ferramentas, métricas ou responsabilidades que você não consegue explicar.",
    steps: ["Abra com um resumo de 2 a 3 linhas: nível, contexto de produto e tipo de problema que sabe investigar.", "Em cada experiência, descreva contexto, ação de QA e resultado. Quantifique apenas quando tiver um dado real.", "Inclua ferramentas junto do uso que fez delas; uma lista isolada não demonstra prática."],
    template: "QA [nível] com experiência em [tipo de produto/contexto]. Investigo [riscos ou jornadas] e transformo achados em evidências e decisões claras. Prática com [ferramentas usadas de verdade].",
    label: "Resumo profissional",
  },
  {
    title: "LinkedIn",
    icon: Linkedin,
    purpose: "Deixe claro o trabalho que você busca e a forma como contribui. Use palavras que aparecem nas vagas-alvo sem transformar o perfil em uma sequência de keywords.",
    steps: ["Atualize título, sobre, experiências e competências com o mesmo posicionamento.", "Adicione um case do portfólio com contexto, risco, evidência, decisão e resultado.", "Peça recomendações específicas sobre uma colaboração ou entrega observada."],
    template: "QA [nível] | [domínio ou tipo de produto] | Testes manuais e exploratórios · [automação que pratica] · qualidade orientada a risco\n\nAjudo times a entender o comportamento do produto, investigar riscos e comunicar evidências para decisões de release. Tenho praticado [projeto/case real] usando [ferramentas e métodos].",
    label: "Título e seção Sobre",
  },
  {
    title: "Pitch profissional de 60 segundos",
    icon: Mic2,
    purpose: "Apresente seu foco com naturalidade: quem você é, que tipo de problema resolve, um exemplo concreto e o próximo desafio que procura.",
    steps: ["Treine em voz alta e cronometre; retire detalhes que não ajudam a entender seu foco.", "Use um exemplo real do seu projeto integrado ou de experiência profissional.", "Adapte a última frase à conversa: vaga, networking, apresentação ou entrevista."],
    template: "Sou QA [nível] com foco em [contexto]. No projeto/experiência [exemplo], eu [ação específica] para investigar [risco], registrei [evidência] e isso apoiou [decisão/resultado]. Quero contribuir em um time que [característica do próximo desafio].",
    label: "Roteiro do pitch",
  },
  {
    title: "Entrevistas",
    icon: MessageCircle,
    purpose: "Prepare histórias curtas que revelem seu raciocínio. Explique contexto, sua responsabilidade, ação, resultado e o que faria diferente; não tente decorar respostas genéricas.",
    steps: ["Prepare exemplos de bug difícil, conflito, priorização, automação e aprendizado após uma falha.", "Quando não souber, explique como reduziria a incerteza e quais informações pediria.", "Faça perguntas sobre produto, definição de pronto, estratégia de qualidade e colaboração com desenvolvimento."],
    template: "Contexto: qual era o produto, usuário e risco?\nResponsabilidade: qual parte dependia de mim?\nAção: o que investiguei, com quem alinhei e que evidência produzi?\nResultado: que decisão ou mudança aconteceu?\nAprendizado: o que manteria ou mudaria na próxima vez?",
    label: "Estrutura de resposta",
  },
];

export default function MentorshipCareerPage() {
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><MentorshipNav current="/mentoria/carreira" /><header className="mt-8 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-mint">Carreira em QA</p><h1 className="mt-3 text-4xl font-black text-off-white sm:text-5xl">Apresente sua prática com clareza.</h1><p className="mt-4 text-base leading-8 text-[#AAB2BC]">Materiais de apoio para organizar currículo, LinkedIn, pitch e entrevistas. Use os modelos como ponto de partida e substitua os campos por exemplos verdadeiros da sua trajetória.</p></header><div className="mt-9 grid gap-5">{resources.map((resource) => { const Icon = resource.icon; return <article key={resource.title} className="border border-white/10 bg-[#171B21] p-5 sm:p-7"><div className="flex items-center gap-3"><Icon className="size-5 text-mint" /><h2 className="text-xl font-black text-off-white">{resource.title}</h2></div><p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">{resource.purpose}</p><ol className="mt-4 grid gap-2 text-sm leading-6 text-[#D9DEE4] sm:grid-cols-3">{resource.steps.map((step, index) => <li key={step} className="border border-white/[.07] p-3"><span className="mr-2 font-black text-mint">{index + 1}.</span>{step}</li>)}</ol><CareerTemplate label={resource.label} text={resource.template} /></article>; })}</div><section className="mt-8 border border-neon/20 bg-neon/[.04] p-5"><h2 className="font-bold text-off-white">Conecte o material à sua evidência</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Seu projeto final e os cases aprovados podem servir de exemplo. Revise os dados antes de publicar e remova nomes, credenciais e informações de clientes.</p><Link href="/mentoria/semanas/12" className="mt-4 inline-flex text-sm font-bold text-mint hover:text-neon">Rever projeto integrado →</Link></section></main>;
}
