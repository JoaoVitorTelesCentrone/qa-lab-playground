# Resumo da iteração — Mentoria e QA Lab científico

**Data:** 16 de outubro de 2026
**Escopo:** transformar o roadmap e a base científica em uma experiência de mentoria navegável, prática e rastreável.

## O que foi entregue

### Mentoria e conteúdo

- Estrutura de 12 semanas com aulas, quiz, exemplo e desafio em páginas próprias.
- Página pública da mentoria separada da área de conteúdo.
- Navegação de conteúdo adicionada ao cabeçalho.
- Conteúdo teórico aprofundado e consolidado a partir do roadmap original, `RoadMapQA.docx` e `qa-roadmap-megazord-2026.md`.
- Exercícios, casos resolvidos, checklists, critérios de conclusão e preparação de entregas por semana.
- Rotas de entregas, revisão, portfólio, notificações, certificados e administração da mentoria.

### Cadastro e acesso

- Fluxos de cadastro, login, recuperação e atualização de senha revisados.
- Callback e middleware do Supabase ajustados para sessão e redirecionamento.
- Requisitos de senha apresentados no formulário.
- Migrations da estrutura da mentoria, portfólio, notificações, conteúdo administrativo, certificados e hardening de e-mail.

### Biblioteca científica

- Índice dos artigos científicos com origem e assunto abordado.
- Referências organizadas em nove pastas temáticas.
- Síntese individual, dossiê consolidado por pasta e resumo geral da biblioteca.
- Dez novas propostas de artigos científicos derivadas das lacunas encontradas.
- Plano que converte as propostas em laboratórios aplicáveis à mentoria.

### Primeiro pacote de laboratórios científicos

1. **L04 — Uma história, duas interpretações** (`/mentoria/labs/requisitos`)
   - Preserva a interpretação inicial antes de revelar critérios.
   - Permite revisar cenários e comparar respostas.
   - Mantém rascunho local e exporta relatório Markdown versionado.

2. **L05 — O teste verde que não encontra o defeito** (`/mentoria/labs/oraculo`)
   - Executa teste superficial e oráculo de negócio em versões correta e defeituosa.
   - Usa massa sintética e cálculo independente do resultado esperado.
   - Demonstra por que presença da tela não comprova correção da regra.

3. **L09 — Do incidente ao teste que impede a volta** (`/mentoria/labs/incidente`)
   - Conecta relato, release, logs correlacionados, hipótese e reprodução.
   - Executa regressão antes e depois da correção.
   - Inclui nova massa e contracaso para evitar um teste memorizado.

Os três laboratórios estão ligados aos desafios das semanas correspondentes e exportam evidências para revisão do mentor. As atividades usam cenários sintéticos e identificam explicitamente os limites das conclusões.

### Ambientes e operação

- Pacote local de performance com cenários de baseline, carga e pico.
- Documentação de execução, pesquisa, implantação e operação da mentoria.
- Sitemap atualizado com as páginas dos novos laboratórios.
- Arquivos locais de logs, screenshots, resultados e scripts temporários excluídos do versionamento.

## Validação realizada

- Testes unitários dos três experimentos científicos: **11 testes, 38 asserções, todos aprovados**.
- TypeScript executado sem erros.
- ESLint executado nos componentes, modelos e rotas alterados sem erros.
- Fluxos dos três laboratórios verificados em Chromium, incluindo navegação pela semana, execução, exportação e largura móvel.

## Limites conhecidos

- Rascunhos dos labs são locais ou mantidos apenas durante a sessão; exportar um relatório não envia automaticamente a entrega.
- Os laboratórios são adaptações didáticas, não replicações integrais dos artigos citados.
- Inferências causais, avaliação longitudinal e comparação entre participantes exigem protocolo de pesquisa, consentimento e coleta próprios.
- Os laboratórios restantes do plano científico continuam registrados para implementações futuras.
