# QA Lab Playground

Laboratório público e gratuito para profissionais de QA praticarem investigação de bugs, análise de risco, escrita de cenários e pensamento crítico em produto.

> Qualidade se aprende praticando.

## Produto público

- `/` — apresentação da plataforma e catálogo
- `/datas` — Datas Bugadas, com falhas intencionais de cálculo, formato e timezone
- `/despesas` — ExpenseFlow, desafio exploratório em um fluxo financeiro
- `/bdd` — gerador de cenários Gherkin com cópia e exportação `.feature`
- `/missoes` — desafios guiados com progresso salvo no navegador
- `/blog` — artigos gratuitos sobre qualidade de software

Não há cadastro ou paywall obrigatório. Os recursos free funcionam no navegador; uma conta opcional ativa o QA Lab Workspace com projetos, rascunhos, favoritos e sincronização do progresso.

## QA Lab Workspace

- `/login` e `/cadastro` — autenticação por e-mail/senha ou Google
- `/lab` — projetos, rascunhos, favoritos e progresso sincronizado
- `/perfil` — perfil profissional e gestão da conta
- Recuperação de senha e exclusão permanente de conta
- Plano Free limitado a três projetos ativos; estrutura preparada para Pro e Team

O Workspace usa Supabase. Aplique `supabase/migrations/202606220001_workspace.sql` pelo SQL Editor ou CLI e configure as variáveis de `.env.example`. Sem essas variáveis, o produto free continua funcionando normalmente.

No painel do Supabase, habilite o provedor Google se desejar OAuth e adicione estas URLs permitidas:

```text
http://localhost:3000/auth/callback
https://seu-dominio.com.br/auth/callback
```

## Stack

- Next.js 16 e React 19
- TypeScript
- Tailwind CSS 4
- Bun workspaces
- Vercel

O monorepo contém módulos experimentais, API Hono e integrações Supabase legadas. Eles não fazem parte da navegação pública desta versão.

## Desenvolvimento

Requisitos: Bun 1.x ou Node.js 20+.

```bash
bun install
bun run dev:web
```

Acesse `http://localhost:3000`.

## Verificação

```bash
bun run lint
bun run build
```

## Publicação na Vercel

Importe o repositório e configure o Root Directory como `packages/web`. O `vercel.json` instala as dependências a partir da raiz do monorepo.

Variáveis:

```text
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
```

Somente `NEXT_PUBLIC_SITE_URL` é opcional. As variáveis Supabase ativam o Workspace.

## Próxima fase

A evolução planejada é uma API intencionalmente bugada dentro do próprio Next.js, permitindo práticas com payloads, contratos, status HTTP e automação via Postman, Cypress ou Playwright — ainda mantendo o núcleo gratuito.
