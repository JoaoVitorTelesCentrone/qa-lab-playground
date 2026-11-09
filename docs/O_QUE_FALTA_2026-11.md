# O que falta — visão do Claude

> Escrito em 9/11/2026 e atualizado no mesmo dia, depois da primeira rodada de implementação.
> É uma opinião, não um plano aprovado. Complementa `docs/PROXIMOS_PASSOS_2026-11.md`.

Legenda: ✅ feito · ⏳ depende do João · ⏸️ adiado de propósito

---

## P0 — Antes de cobrar de alguém

Todos dependem de decisão ou de informação que só o João tem.

| # | O que falta | Estado |
| --- | --- | --- |
| 1 | **Termos de uso e política de privacidade.** As páginas não existem e o rodapé não tem link. Há login, dados de aluno, evidências e plano pago (LGPD). | ⏳ Precisa de razão social ou CPF do responsável, contato do encarregado de dados, onde os dados ficam (Supabase) e prazo de retenção. Com isso, dá para escrever as duas páginas. |
| 2 | **Política de reembolso do Pro.** | ⏳ Prazo e condições são decisão comercial. |
| 3 | **Quem é o mentor.** O bloco "quem conduz" da mentoria está vazio. | ⏳ Nome, foto e trajetória. |
| 4 | **Testar o fluxo logado de ponta a ponta com um mentor de verdade.** | ⏳ Precisa de uma conta de mentor e uma de aluno no ambiente real. |
| 5 | **Confirmar as migrações `0010_profile_links` e `0011_portfolio_sections` no Supabase.** | ⏳ Só dá para conferir no painel do Supabase. |

## P1 — Coerência do que já existe

### Bancadas (`/lab/ferramentas`)
1. ✅ **Tema.** Correção do diagnóstico: a plataforma não tem tema claro (o `:root` também é escuro), então as bancadas não estavam quebradas. Elas só não seguiam a convenção. Agora usam `qa-system qa-practice`, como os outros ambientes de prática.
2. ✅ **Dificuldade declarada em cada Lab.** Não sai mais de `index % 3`. Cada spec tem `difficulty` e, quando faz sentido, `mode: "fluxo"`.
3. ✅ **Critérios dos Labs 441–471 escritos à mão.** O `extra-tool-labs.ts` deixou de gerar critérios por gabarito. Cada Lab diz o que a entrega precisa mostrar: status, valor, linha ou estado.
4. ✅ **Lógica das bancadas extraída e testada.** Está em `lib/qa-tool-engine.ts`, com 27 testes em `qa-tool-engine.test.ts`, um para cada sintoma que os Labs prometem. Os testes acharam três defeitos, já corrigidos:
   - **Lab 411:** a resposta com `status: "200"` (texto) parava no status e nunca mostrava o `total` em texto, que é justamente o que o Lab pede.
   - **Lab 411:** o status em texto aparecia como `200`, sem aspas, igual a um número. Agora aparece como `"200"`.
   - **Lab 451:** com p95 e erros estourados ao mesmo tempo, a mensagem só citava o p95. O critério pede todas as metas violadas.
   - **Lab 466 (melhoria):** idade ausente agora aparece como "idade ausente", separada de "fora de 18–120".
5. ✅ **A bancada leva para a entrega.** Ela continua sem salvar nada (de propósito), mas agora tem "Copiar modelo de evidência" (com os critérios do Lab) e "Registrar entrega do Lab", que abre `/labs/<número>`.

### Labs e mentoria
6. ⏳ **Módulo 6 (Labs 157–164) não convertido** e Labs 159–164 sobrepostos aos de k6 (261–272). Recomendo aposentar os antigos de carga. Falta o OK.
7. ⏳ **Roteiros do Broto nunca conferidos no produto real** (seção 3.5 do PROXIMOS_PASSOS).
8. ⏳ **Collection e contrato de referência do Broto.** Exigem acesso à API real.
9. ⏸️ **Progresso do curso e do Lab separados.** Juntar os dois mexe no modelo de dados e na tela de progresso, e merece uma rodada própria.

### Guias de ferramenta (`/ferramentas/[slug]`)
10. ✅ **Os guias abrem pelo curso do QA Lab.** Os 12 guias com curso interno mostram "Comece pelo curso do QA Lab" antes do material externo. Um teste garante que a rota de cada curso existe.
11. ✅ **As aulas da mentoria linkam os guias.** O último capítulo de cada módulo mostra "Estudar as ferramentas: …", ao lado de "Aprofundar". O mapa fica em `guidesForModule` (`lib/tool-guides.ts`), e um teste garante que todo guia aparece em algum módulo.
12. ✅ **Quatro guias novos:** Jira, axe DevTools, OWASP ZAP e Pact, numa categoria nova, "Acessibilidade e segurança". Agora são 22 guias.
13. ✅ **Vídeos em português** adicionados para Selenium, Appium, Jest, Lighthouse e Qase. Continuam só em inglês: axe e Pact, porque não achei material em PT-BR de canal confiável.
14. ✅ **Verificador de links.** `bun run guides:check-links` confere vídeos pelo oEmbed e páginas pelo status HTTP, com 3 tentativas por link. O workflow `.github/workflows/tool-guide-links.yml` roda todo dia 1º do mês. Última execução: 163 links ok, 1 aviso (a Postman Academy bloqueia robôs).

## P2 — Descoberta e qualidade

15. ✅ **Sitemap.** Inclui `/conteudo`, `/labs`, `/trilhas`, os cursos recomendados pelos guias, `/ferramentas`, os 22 guias, `/lab/ferramentas` e as 10 bancadas.
16. ✅ **E2E.** O `tests/e2e/tools.e2e.ts` cobre o índice, todos os guias (incluindo `rel=noopener` nos links externos), o 404, todas as bancadas e dois Labs de ponta a ponta. Os 4 primeiros são `@smoke` e rodam no CI.
17. ⏳ **Imagem `public/mentoria/qa-lab-bug-report.webp` desatualizada.** Melhor gerar quando a tela final da mentoria estiver aprovada.
18. ⏸️ **`.gitattributes`.** Adiado de propósito. Com `core.autocrlf` ligado na máquina, introduzir `eol=lf` agora pode marcar o repositório inteiro como modificado. Vale fazer num commit isolado, com `git add --renormalize .` e conferindo o diff.

## P3 — Faxina

19. ⏳ A branch `feat/guias-ferramentas` ainda existe, local e no GitHub, já incorporada à `main`. Apagar depende de OK.
20. Há dois documentos de próximos passos. Quando os itens ⏳ forem decididos, vale mover o que sobrar para o PROXIMOS_PASSOS e apagar este.
21. ✅ Correção registrada: são **56** Labs de bancada, não 55 como dizia o commit `a86d449`.

Extra feito nesta rodada: o item "Ferramentas" do header agora fica ativo também em `/lab/ferramentas`.

---

## O que mais destrava agora

1. **Os dados para termos, privacidade e reembolso** (P0 1–2). Com eles, as páginas saem em uma rodada.
2. **Uma conta de mentor para o teste ponta a ponta** (P0 4).
3. **OK para aposentar os Labs 159–164** (P1 6).
