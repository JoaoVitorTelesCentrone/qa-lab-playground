import type { Metadata } from "next";
import { author } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Quais dados o QA Lab coleta, para quê e como falar com o responsável.",
  alternates: { canonical: "/privacidade" },
};

const UPDATED_AT = "11 de novembro de 2026";
const h2 = "font-display mt-10 text-2xl uppercase";
const p = "mt-3 leading-7 text-muted-foreground";

export default function PrivacyPage() {
  return <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
    <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">Política de privacidade</h1>
    <p className={p}>Atualizada em {UPDATED_AT}.</p>

    <h2 className={h2}>Quem é o responsável</h2>
    <p className={p}>O QA Lab é um projeto editorial mantido por {author.name}, que responde pelo tratamento dos dados descritos aqui, nos termos da LGPD (Lei 13.709/2018).</p>

    <h2 className={h2}>O que coletamos</h2>
    <p className={p}>Nesta versão pública, o site <strong>não tem login, formulários nem comentários</strong>, e não usamos ferramentas de analytics nem cookies de publicidade. Não pedimos nem guardamos nome, e-mail ou outro dado pessoal seu.</p>
    <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
      <li><strong>Origem da visita.</strong> Se o link que trouxe você tiver parâmetros <code>utm_source</code>, <code>utm_medium</code> ou <code>utm_campaign</code>, guardamos esses valores no armazenamento local do seu navegador (<code>localStorage</code>). Eles não saem do seu dispositivo nesta versão e você pode apagá-los limpando os dados do site.</li>
      <li><strong>Registros de acesso do provedor.</strong> O site roda na Vercel, que mantém logs técnicos de requisição (como endereço IP, data e página acessada) para segurança e operação da hospedagem. Veja a política da Vercel em vercel.com/legal/privacy-policy.</li>
    </ul>

    <h2 className={h2}>Links externos</h2>
    <p className={p}>O site tem links para LinkedIn, GitHub, YouTube e outros materiais de terceiros. Ao abri-los, valem as políticas de privacidade desses serviços.</p>

    <h2 className={h2}>Seus direitos</h2>
    <p className={p}>Pela LGPD você pode pedir confirmação de tratamento, acesso, correção ou eliminação de dados. Como não mantemos dados pessoais seus nesta versão, a resposta tende a ser que não há o que informar, mas o pedido será atendido do mesmo jeito.</p>

    <h2 className={h2}>Contato</h2>
    <p className={p}>Fale com {author.name} pelo <a href={author.links.linkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-accent">LinkedIn</a>.</p>

    <h2 className={h2}>Mudanças</h2>
    <p className={p}>Se o site passar a coletar mais dados (por exemplo, com contas de usuário), esta página será atualizada antes e a data acima mudará.</p>
  </main>;
}
