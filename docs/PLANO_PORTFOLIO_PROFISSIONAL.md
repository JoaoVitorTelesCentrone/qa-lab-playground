# Plano de evolução do portfólio profissional

**Status:** etapas 1 e 2 e personalização visual da etapa 3 implementadas localmente; aplicar as migrações e validar em staging antes de liberar.

## Personalização visual implementada

- `/perfil` permite escolher entre Clássico (uma coluna), Editorial (perfil ao lado dos trabalhos) e Galeria (projetos em duas colunas). Em telas estreitas, todas as composições usam uma coluna.
- Paletas Floresta, Oceano e Papel, com contraste AA verificado para texto, links e botões. As cores ficam restritas à superfície do portfólio.
- A prévia privada usa os mesmos componentes da página pública, com larguras de 1024 px e 390 px. Consulta apenas o perfil da sessão autenticada e mostra os trabalhos publicados, inclusive quando o perfil está privado. Não publica rascunhos.
- A escolha fica em edição até clicar em “Salvar aparência”; o salvamento atualiza a apresentação pública. Estados de carregamento, sucesso, falha e alterações não salvas aparecem no editor.
- A API aceita apenas layouts e paletas conhecidos e atualiza exclusivamente o perfil autenticado. A migração `20261025020450_portfolio_appearance.sql` adiciona a coluna e a restrição de valores; a leitura preserva o padrão anterior enquanto essa migração não estiver aplicada.
- Validação local: testes de preferências e contraste; 18 combinações de layout/paleta/viewport no navegador sem rolagem horizontal da página; controles de prévia e salvamento com respostas simuladas; acesso anônimo rejeitado na API e redirecionado para login na prévia. Persistência no banco e jornada entre contas continuam pendentes do gate de staging.


## Implementação local da base de projetos autorais

- `/perfil` voltou a renderizar o painel autenticado e inclui um editor para criar, alterar, publicar, atualizar a publicação e remover projetos pessoais ou profissionais.
- Um projeto pode reunir cases de Lab já publicados. A publicação guarda um snapshot próprio; editar o projeto não muda o conteúdo público até a pessoa atualizar a publicação.
- O portfólio público lista os projetos autorais e suas evidências, e cada página apresenta papel, período, links externos e galeria de imagens e vídeos. Cases vinculados deixam de duplicar o projeto automático do ambiente.
- O editor aceita até quatro arquivos e 20 MB no total. Imagens são limitadas a 3 MB e redimensionadas para até 1600 px; vídeos MP4/WebM ficam limitados a 10 MB e não carregam até o visitante dar play. O navegador envia o arquivo diretamente ao Supabase Storage, e a API confere tamanho e tipo reais antes de registrá-lo no projeto.
- O dono pode selecionar até três cases publicados como destaque e ordenar esses destaques; a página pública mostra a seleção antes das evidências recentes.
- Cada imagem ou vídeo do projeto tem visibilidade própria. Novos arquivos começam privados; uma imagem pública pode ser escolhida como capa, e arquivos privados não recebem URL pública.
- O dono consegue ordenar seus projetos com os controles de subir/descer. A ordem salva é sincronizada com as publicações para refletir na página pública.
- `portfolio_projects` guarda os rascunhos privados e `portfolio_project_publications` guarda a versão pública. A migração `20261023192027_portfolio_projects.sql` ainda precisa ser aplicada; sem ela, o cadastro não funciona no banco.
- `portfolio_featured_work` adiciona os destaques ao perfil; essa migração também precisa ser aplicada para salvar a seleção.
- `portfolio_project_media` adiciona os ponteiros de mídia aos rascunhos e snapshots públicos, sempre usando o bucket privado `lab-evidence`.
- `20261023195000_portfolio_project_order.sql` adiciona a ordem dos projetos e a operação autenticada que atualiza rascunho e publicação juntos.
- `20261023214640_evidence_upload_quota.sql` exige reserva temporária por arquivo e limita armazenamento e frequência de envio por conta, inclusive em chamadas diretas ao Storage.
- A faxina do bucket considera referências de Labs, mentoria, rascunhos e publicações do portfólio; arquivos enviados e não finalizados só podem ser removidos após a janela de segurança.
- A base local das etapas 1 e 2 está implementada; ainda falta aplicar as migrações e validar a jornada com contas separadas em staging.
## Resultado que queremos entregar

O aluno conclui uma prática, transforma o trabalho em um case que consegue explicar e publica uma página que usaria em uma candidatura. Quem recebe o link entende rapidamente **qual problema ele investigou, o que fez, o que encontrou e quais evidências sustentam suas decisões**.

O primeiro resultado completo será: **concluir um Lab → criar um case editável → visualizar a página → publicar → compartilhar o link → voltar para melhorar o rascunho sem alterar a versão pública até republicar**.

## Ponto de partida no código

- O perfil já salva nome, apresentação, links, endereço público e estado público/privado.
- Entregas de Labs já têm texto, anexos e um controle individual de publicação. A página pública agrega essas entregas, monta projetos por ambiente e calcula algumas competências a partir das evidências.
- O aluno já pode escrever e ordenar seções livres. Existem páginas públicas para portfólio, projeto, case de Lab e case da mentoria.
- Os projetos exibidos ainda são derivados dos ambientes do QA Lab. O tipo prevê projetos pessoais e profissionais, mas o aluno ainda não consegue criá-los e apresentar seu próprio contexto.
- O case de Lab combina o briefing com a entrega. O aluno quase não consegue editar título, narrativa, contribuição e conclusão para o público externo.
- A primeira fatia adiciona rascunho privado com título, contexto, abordagem, achados, decisão e aprendizados. A publicação copia esses campos para um snapshot separado na entrega; editar o rascunho não altera o case público.
- Essas capacidades estão no repositório; a execução e as permissões no ambiente de produção ainda precisam de validação.

## Experiência desejada

### Para quem cria

1. **Meu portfólio:** ver prévia, status público, projetos, cases em rascunho e próximos passos. A primeira visita explica como criar o primeiro case a partir de uma entrega existente.
2. **Editor de case:** começar a partir de um Lab ou de um projeto próprio. O sistema traz contexto e evidências existentes, e o aluno escreve sua contribuição em campos guiados: problema, risco, abordagem, execução, achados, decisão e aprendizado.
3. **Curadoria:** escolher até três trabalhos em destaque, ordenar projetos e cases, selecionar anexos e vincular competências a evidências concretas.
4. **Personalização:** editar apresentação, links e chamada de contato; escolher entre layouts e cores acessíveis; ordenar e ocultar seções; definir capa e imagem de cada projeto.
5. **Publicação:** comparar a prévia com a página pública, revisar privacidade de cada anexo e publicar explicitamente. Alterações posteriores ficam em rascunho até uma nova publicação.

### Para quem visita

1. Ver nome, atuação, frase de posicionamento e trabalhos em destaque sem procurar em abas.
2. Abrir um projeto e entender contexto, papel do aluno e resultado antes de ler evidências detalhadas.
3. Abrir um case e verificar decisões, artefatos e anexos. Cada competência apontada no perfil leva a pelo menos um trabalho que a sustenta.
4. Conseguir contato pelo LinkedIn, GitHub ou outro link escolhido pelo aluno e compartilhar uma URL estável.

## Entregas em ordem

| Etapa | Entrega | Critério de aceite |
| --- | --- | --- |
| **1. Primeiro case autoral** | Editor para transformar uma entrega de um Lab liberado em case, com rascunho, prévia e publicação. | O aluno cria, revisa, publica e compartilha um case; editar o rascunho não muda a versão pública; outro usuário não vê rascunho nem arquivos privados. |
| **2. Projetos de verdade** | Cadastro e edição de projetos do QA Lab, pessoais e profissionais; título, resumo, papel, período, links, capa, ordem e cases relacionados. | A pessoa consegue explicar um projeto próprio e reunir vários cases nele. A origem de cada trabalho aparece claramente. |
| **3. Página personalizável** | Trabalhos em destaque, ordem das seções, duas ou três composições de página, paletas acessíveis, capa e blocos opcionais. Editor com prévia para desktop e celular. | A página reflete as escolhas salvas, funciona por teclado e em tela estreita, e mantém boa leitura em cada tema. |
| **4. Prova e compartilhamento** | Competências ligadas a cases, imagem e descrição de compartilhamento por página, links estáveis, exportação e medidas básicas de uso. | O visitante encontra a prova de cada competência; links publicados continuam funcionando após ajustes no perfil. |

A etapa 1 é o recorte inicial. Ela deve usar um Lab já disponível e dados reais de uma conta de teste. As demais etapas só avançam depois de publicar e validar essa jornada completa.

## Modelo de dados proposto

- **Reaproveitar:** `profiles`, `lab_submissions`, `portfolio_sections`, bucket privado de evidências e cases da mentoria. Manter os endereços públicos existentes enquanto a nova experiência é introduzida.
- **`portfolio_projects`:** dono, origem (`qa_lab`, `pessoal`, `profissional`), nome, resumo, papel, período, links permitidos, capa, ordem e estado de publicação. Um projeto pode existir antes de ter um case publicado.
- **`portfolio_case_drafts`:** dono, projeto, origem opcional em uma entrega de Lab ou mentoria, campos narrativos estruturados, anexos selecionados, ordem, atualização e versão do rascunho. Leitura e escrita restritas ao dono.
- **`portfolio_case_publications`:** cópia dos campos aprovados para publicação, URL estável, data e versão publicada. A leitura anônima só alcança essa cópia quando o portfólio estiver público. Despublicar remove o acesso público sem apagar o rascunho.
- **Preferências do portfólio:** layout, paleta, capa, trabalhos em destaque, seções visíveis e ordem. Aceitar apenas opções validadas pelo servidor.
- **Histórico de endereço:** guardar nomes de usuário anteriores para redirecionar links compartilhados quando o aluno mudar o endereço do portfólio.

O vínculo com a entrega original preserva a origem do trabalho, mas o texto público pertence ao aluno. A página deve identificar com clareza se a experiência veio de um ambiente simulado do QA Lab, de um projeto pessoal ou de trabalho profissional. Certificados, revisão de mentor e resultados de automação só recebem esse rótulo quando houver registro verificável correspondente.

### Ordem técnica da primeira entrega

1. Confirmar no banco de staging as tabelas, políticas e migrações já aplicadas para perfil, entregas e anexos.
2. Criar as tabelas de rascunho e publicação com políticas de acesso; testar as três identidades (dono, outra conta e visitante).
3. Criar operações autenticadas para iniciar um rascunho a partir de `lab_submissions`, salvar campos, gerar prévia, publicar e despublicar. A publicação copia apenas os campos e anexos selecionados.
4. Construir o editor em `/perfil/portfolio/cases/[id]` e a leitura pública em `/portfolio/[username]/case/[slug]`. Integrar o botão “Criar case” à lista de evidências já existente.
5. Exibir o case na página pública do portfólio e no projeto correspondente. Preservar links antigos de `/portfolio/[username]/[labSlug]`.
6. Executar a jornada completa em staging, corrigir os problemas encontrados e liberar a função por etapa, mantendo a publicação como ação explícita do aluno.

### Implementação local da primeira fatia

- O editor fica na conclusão do Lab, aproveitando a prévia e os controles de publicação existentes.
- `portfolio_case_drafts` guarda a narrativa privada com RLS por dono. `lab_submissions.published_portfolio_case` é o snapshot visível apenas junto de uma entrega publicada; um trigger atualiza o snapshot na ação explícita de publicar.
- A publicação e a rota pública existentes continuam sendo usadas nesta primeira etapa. Cases que não vieram de uma entrega de Lab e URLs independentes ficam para a evolução do modelo.
- Ainda falta aplicar a migração em staging e validar dono, outra conta e visitante antes de considerar a etapa pronta para produção.

## Backend e regras de publicação

1. Criar migrações incrementais após conferir o histórico do Supabase de staging. Definir chaves estrangeiras, limites de tamanho, unicidade de URLs, índices por dono/projeto/ordem e exclusão em cascata quando apropriado.
2. Aplicar RLS às tabelas novas. O dono gerencia rascunhos e projetos; visitantes leem somente publicações permitidas por um perfil público. Validar com duas contas e uma sessão anônima.
3. Validar no servidor todos os campos, links, tipos de arquivo, tamanhos e mudanças de estado. O navegador não decide sozinho o que está pronto ou público.
4. Manter anexos no bucket privado. Antes de gerar um link público temporário, confirmar que o arquivo pertence a uma publicação acessível.
5. Salvar versão e data da publicação. Uma edição em rascunho não altera o case compartilhado; republicar substitui a versão pública de forma atômica.
6. Preservar as URLs de cases já publicados. Para entregas existentes, oferecer “Criar case a partir desta evidência” sem publicar automaticamente conteúdo antigo em um formato novo.
7. Registrar eventos úteis: primeiro rascunho, prévia, publicação, compartilhamento e despublicação. Medir ações sem incluir texto das entregas ou dados pessoais no evento.

## Interface e conteúdo

- **Editor guiado:** perguntas curtas em linguagem de QA, exemplo de resposta e indicação de quais campos ainda faltam. Salvar rascunho explicitamente ou com autosave confiável e estado visível.
- **Prévia fiel:** usar os mesmos componentes de apresentação da página pública, com indicação clara de que a prévia é privada.
- **Projetos em destaque:** capa, nome, papel, problema, resultado e uma evidência forte. Contagens de Labs e bugs ficam como apoio.
- **Cases legíveis:** resumo inicial, contexto, estratégia, execução, achados, decisão, aprendizados e anexos com legenda. Links para repositório, relatório ou demonstração quando fornecidos pelo aluno.
- **Personalização com limites:** temas e layouts prontos, cores com contraste testado, ordem de blocos e seções livres. Conteúdo inserido pelo aluno deve ser escapado ou sanitizado antes da renderização.
- **Estado vazio útil:** quem ainda não tem entrega recebe um caminho para o primeiro Lab; quem já entregou recebe um caminho para criar o primeiro case.

## Gate de cada etapa

- Testar a jornada em staging com aluno A, aluno B e visitante anônimo: criar, editar, visualizar, publicar, despublicar, trocar username e tentar acesso cruzado.
- Conferir permissões no banco e no Storage, inclusive anexos que foram removidos da publicação.
- Verificar desktop, celular, teclado, zoom, contraste, carregamento e compartilhamento do link em redes sociais.
- Confirmar persistência depois de sair e entrar novamente; registrar o commit, migrações e resultado dos testes antes de abrir a função em produção.
- Atualizar o gate de staging atual, que ainda descreve um desafio removido, para refletir a jornada de portfólio vigente.

## Medidas de sucesso

- **Ativação:** proporção de alunos com uma entrega que criam um rascunho de case.
- **Publicação:** proporção desses rascunhos que chegam à publicação e tempo até o primeiro case publicado.
- **Qualidade:** proporção de cases com contexto, decisão e pelo menos uma evidência verificável.
- **Uso externo:** visitas a cases e cliques nos contatos ou links de trabalho, medidos sem expor conteúdo privado.

O indicador principal é **alunos que publicaram ao menos um case completo e verificável**, não a quantidade de campos preenchidos ou de anexos enviados.
