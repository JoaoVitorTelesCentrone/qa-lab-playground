# O que falta — visão do Claude

> Escrito em 9/11/2026, depois do commit `a86d449`.
> É uma opinião, não um plano aprovado. Complementa `docs/PROXIMOS_PASSOS_2026-11.md`.
> Repete de lá só o que eu colocaria em outra prioridade.

A plataforma já tem muito conteúdo: 164 Labs de mentoria, 61 de curso, 56 de bancada, 21 trilhas e agora 18 guias de ferramenta. O que falta é menos conteúdo novo e mais **amarrar o que existe**, **provar que funciona logado** e **cuidar do básico de lançamento**.

---

## P0 — Antes de cobrar de alguém

| # | O que falta | Por que importa |
| --- | --- | --- |
| 1 | **Termos de uso e política de privacidade.** As páginas não existem e o rodapé não tem link para elas. | Há login, dados de aluno, evidências enviadas e plano Pro pago. Sem esses textos não dá para vender com tranquilidade (LGPD). |
| 2 | **Política de reembolso do Pro.** | Tem que estar escrita antes da primeira venda. |
| 3 | **Quem é o mentor.** O bloco "quem conduz" da mentoria está vazio. | É o principal argumento de venda da mentoria. |
| 4 | **Testar o fluxo logado de ponta a ponta com um mentor de verdade.** Aluno entrega um Lab, mentor revisa, evidência aparece no marco, projeto final referencia os Labs. | Até hoje só o fluxo deslogado e o e2e com banco local foram verificados. É o coração do produto pago. |
| 5 | **Confirmar as migrações `0010_profile_links` e `0011_portfolio_sections` no Supabase.** | Em agosto estavam pendentes. Sem elas, o campo GitHub do perfil e as seções do portfólio não funcionam. |

## P1 — Coerência do que já existe

### Bancadas (`/lab/ferramentas`)
1. **Tema.** As bancadas usam cores fixas de tema escuro (`text-white`, `#89939f`, `border-white/10`), mas nem a página nem os componentes usam a classe `.qa-practice`. Pela regra da revisão de UX, a bancada deveria estar dentro de `.qa-practice`. Do contrário, deve aparecer quebrada no tema claro "Caderno de campo". **Abrir no navegador e corrigir.**
2. **A dificuldade é sorteada pela posição.** Em `lib/qa-tool-labs.ts`, a dificuldade sai de `index % 3`. Hoje o Lab 401 é "Básico" e o 402 "Intermediário" só pela ordem em que aparecem. Cada spec deveria declarar a própria dificuldade.
3. **Os critérios dos Labs 441–471 vêm de um gabarito.** O `extra-tool-labs.ts` gera "Condição de execução reproduzível / Evidência: … / Conclusão: …" para todos. Os Labs 401–439 têm critérios escritos à mão e são claramente melhores. Vale reescrever os 31 Labs no mesmo nível.
4. **A lógica das bancadas não tem teste.** `runSafeQuery` e `checkContract` ficam dentro do componente (`components/qa-tools/tool-workbench.tsx`). A convenção do projeto é deixar a regra em `lib/`, como função pura e testada. O validador de contrato e o SQL "seguro" são justamente o tipo de código que precisa de teste.
5. **O resultado da bancada não é salvo.** Não achei persistência nas bancadas. Falta confirmar se o aluno consegue levar o que viu para a entrega do Lab, por exemplo com um botão "copiar evidência".

### Labs e mentoria
6. **Módulo 6 (Labs 157–164) ainda não foi convertido para o Broto**, e os Labs 159–164 se sobrepõem aos de k6 (261–272). Eu aposentaria os antigos de carga em vez de convertê-los.
7. **Os roteiros do Broto nunca foram conferidos no produto real** (seção 3.5 do PROXIMOS_PASSOS). É o maior risco de o aluno travar num passo que não existe.
8. **Falta a collection e o contrato de referência do Broto** (Postman, Bruno e OpenAPI). Sem isso, o mentor não tem gabarito para corrigir os Labs 142–146.
9. **O progresso do curso e o do Lab são separados.** Concluir o módulo do curso de Cypress não marca o Lab 201, e vice-versa. O aluno vai achar que é bug.

### Guias de ferramenta (`/ferramentas/[slug]`, feitos hoje)
10. **Os guias não apontam para os cursos da própria plataforma.** Já existem `/trilhas/cypress`, `/trilhas/playwright`, `/trilhas/k6`, `/trilhas/gherkin`, `/trilhas/sql-qa`, `/trilhas/appium-selenium`, `/trilhas/cicd` e `/trilhas/testes-api`. O guia deveria abrir com "Curso no QA Lab" e só depois listar o material externo. **É a falha mais óbvia do que fiz hoje.**
11. **As aulas da mentoria não linkam os guias.** O capítulo que cita k6 deveria ter um "Estudar k6" que leve para `/ferramentas/k6`.
12. **Faltam guias de ferramentas importantes:**
    - **Jira**: a ferramenta que todo QA usa, e não está na lista.
    - **axe DevTools / WAVE**: a bancada de acessibilidade só tem o Lighthouse como ferramenta real correspondente.
    - **OWASP ZAP**: a bancada Security Probe não tem nenhuma ferramenta real correspondente.
    - **Pact**: teste de contrato de verdade, ligado ao Contract Inspector.
    - TestRail, Zephyr e Xray (pelo menos um, além do Qase), Robot Framework, Sentry e Kibana.
13. **Faltam vídeos em português** para Selenium, Appium, Lighthouse, Qase e Jest. Hoje esses guias só têm vídeos em inglês.
14. **Links vão quebrar.** Vídeo sai do ar, documentação muda de endereço. Falta um script (ou uma GitHub Action mensal) que confira de novo os links pelo oEmbed e pelo status HTTP e avise o que quebrou. O comentário no topo de `lib/tool-guides.ts` já explica como checar.

## P2 — Descoberta e qualidade

15. **O sitemap está desatualizado.** O `app/sitemap.ts` não inclui `/ferramentas`, os 18 guias, `/lab/ferramentas`, `/trilhas/*` nem `/conteudo`. É um ganho fácil de SEO, principalmente com os guias, que são conteúdo público e pesquisável.
16. **Nenhum teste e2e cobre `/ferramentas/[slug]` nem `/lab/ferramentas`.** Um smoke abrindo cada slug e cada bancada já basta.
17. **A imagem `public/mentoria/qa-lab-bug-report.webp` ainda mostra a interface antiga.**
18. **Falta um `.gitattributes`.** Todo commit avisa "LF will be replaced by CRLF". Com `* text=auto eol=lf` o aviso some e os diffs param de mudar o final de linha.

## P3 — Faxina

19. A branch `feat/guias-ferramentas` sobrou, local e no GitHub, e já está incorporada à `main`. Dá para apagar.
20. Há dois documentos de próximos passos (`PROXIMOS_PASSOS_2026-11.md` e este). Quando um item daqui for aceito, vale mover para lá e manter um só.
21. Correção: na conversa e no commit `a86d449` eu escrevi "55 Labs" de bancada. O certo são **56**, como diz o PROXIMOS_PASSOS.

---

## Se fosse para escolher três coisas

1. **Termos, privacidade e reembolso** (P0 1–2). Sem isso não dá para vender.
2. **Um teste real do fluxo logado com mentor** (P0 4). É o que o aluno paga para ter.
3. **Ligar guias, cursos internos e Labs** (P1 10–11). O conteúdo já existe; hoje cada parte é uma ilha.
