# QA Lab Playground — ExpenseFlow Free Challenge

MVP público e gratuito para profissionais de QA praticarem teste exploratório, análise de risco e documentação de bugs em um sistema de reembolso com falhas intencionais.

> Treine QA em sistemas quebrados de verdade.

## Jornada principal

- `/` — landing page do desafio
- `/playground` — briefing, regras de negócio e missão
- `/playground/expenseflow` — sistema fake ExpenseFlow
- `/playground/template-bug-report` — visualização e download do template
- `/playground/conclusao` — checklist, compartilhamento e próximos desafios
- `/waitlist` — conteúdo dos produtos e inscrição opcional para novidades

O sistema usa dados mockados e `localStorage`. Não exige login, backend, banco de dados ou pagamento. O gabarito interno está em `docs/QA_LAB_FREE_CHALLENGE_GABARITO.md` e não é exposto na interface.

## Rodar localmente

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

## Variáveis opcionais

Copie `packages/web/.env.example` para `packages/web/.env.local` quando necessário.

```text
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
NEXT_PUBLIC_LEAD_FORM_URL=https://seu-formulario-de-leads.example
```

Sem `NEXT_PUBLIC_LEAD_FORM_URL`, a conclusão apenas informa que o cadastro estará disponível em breve.

## Deploy na Vercel

1. Importe o repositório.
2. Configure `packages/web` como Root Directory.
3. Use o framework Next.js.
4. Adicione somente as variáveis opcionais desejadas.
5. Publique. Nenhum serviço externo é obrigatório.

## Bugs plantados

O desafio possui exatamente sete falhas intencionais: valor negativo, título em branco, autoaprovação, filtro de status, divergência de relatório, data futura e comprovante inválido. Os detalhes de reprodução ficam apenas no gabarito interno.
