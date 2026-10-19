# Produção das videoaulas da mentoria

O fluxo de publicação já existe em `/mentoria/admin#conteudo-aulas`. Os vídeos em si ainda precisam ser gravados e hospedados; não há arquivos ou links de gravação neste workspace. Esta pauta converte o catálogo atual em uma lista pronta para produção. Cada aula deve terminar com uma ação observável no lab, não com um resumo longo.

## Roteiro padrão de gravação

1. **Pergunta (0:00–0:30):** qual decisão ou erro o aluno precisa resolver?
2. **Contexto (0:30–1:30):** cenário e risco, em uma tela.
3. **Demonstração:** execute o fluxo real; narre o que observa e por quê.
4. **Síntese:** mostre um critério de qualidade e uma limitação do exemplo.
5. **Próxima ação:** indique a missão e a evidência que o aluno vai produzir.

Gravar em blocos curtos; zoom legível, dados sintéticos, legendas revisadas, sem credenciais ou dados pessoais. Para demos, manter a captura de tela e voz; evitar slides explicativos quando a própria interface demonstra o conceito.

## Fila de gravação

| Tema | Aula | Formato | Demonstração/entrega |
|---|---|---|---|
| 1 | O que um QA decide | Vídeo | Priorizar um risco e explicar o impacto |
| 1 | Exploração guiada | Demo | Percorrer uma jornada no ExpenseFlow e registrar evidência |
| 2 | Teste exploratório | Vídeo | Escrever charter, timebox e debrief |
| 3 | Técnicas que economizam tempo | Vídeo | Derivar equivalências, limites e casos de decisão |
| 4 | Bug report que resolve | Vídeo | Reproduzir, comparar esperado/atual e recomendar ação |
| 5 | O que vale automatizar | Vídeo | Comparar risco, repetição, estabilidade e custo |
| 6 | Primeiro teste executável | Vídeo | Criar smoke com seletor por intenção e assertion de negócio |
| 6 | Seletores e massa | Demo | Preparar dados isolados e remover espera fixa |
| 7 | API como produto | Vídeo | Importar coleção, configurar Local e ler contrato/status/corpo |
| 7 | Contrato e dados | Demo | Executar reset → criar → ler → autenticar → atualizar → excluir |
| 8 | Suíte sustentável | Vídeo | Isolar dependências e revisar abstrações |
| 9 | Pipeline do commit ao feedback | Vídeo | Traçar etapas e gates de qualidade |
| 9 | GitHub Actions seguro | Demo | Proteger secrets e guardar artefato de falha |
| 10 | Quality gate não é número mágico | Vídeo | Decidir com evidências de risco, não só percentual |
| 11 | Planejar e executar carga com segurança | Vídeo | Preparar alvo loopback e cenários seguros do k6 |
| 11 | Ler métricas e definir thresholds | Demo | Relacionar p95, throughput e erros a uma decisão |
| 12 | Como contar seu case | Vídeo | Estruturar contexto, risco, evidência e decisão |

## Publicar

Hospedar vídeo com legendas e incorporar pelo painel de administração, vinculando a aula existente. Para instruções de plataforma, formatos aceitos e comportamento antes da publicação, consulte [PUBLICAR_VIDEOAULAS.md](PUBLICAR_VIDEOAULAS.md). Depois de publicar, conferir como aluno: player, legenda, material, continuidade e progresso.
