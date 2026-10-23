# Gate de staging — QA Lab

Este registro acompanha `docs/PLANO_PROXIMO_NIVEL_2026-10-21.md` e `docs/MENTORIA_RUNBOOK.md`. O gate está **pendente** até haver um projeto Supabase de staging identificado, três contas de teste, checkout Mercado Pago sandbox e remetente de e-mail verificado. Não usar projetos de outros produtos como substitutos.

## Identificação da execução

| Campo | Valor |
| --- | --- |
| Responsável pela execução | A definir |
| URL da aplicação de staging | A definir |
| Supabase project ref | A definir |
| Commit implantado | A definir |
| Migrations aplicadas | A definir; incluir `20261021222551_mentorship_waitlist_attribution.sql` e `20261021233458_mentorship_order_attribution.sql` |
| Contas aluno, mentor, admin | A definir; guardar credenciais em cofre, nunca neste arquivo |
| Data, navegador, viewport | A definir |

## Verificações automáticas

Execute a partir de `packages/web`, com variáveis locais apontando somente para staging:

```powershell
bun run mentorship:readiness
bun run test:e2e
bunx supabase test db
```

O primeiro comando confere Auth, service role, tabelas, colunas de atribuição, RLS básico, e-mail e rotas. O E2E autenticado requer as variáveis descritas no runbook; sem elas, apenas os cenários públicos rodam. Execute pgTAP em banco de teste local ou staging preparado, nunca em produção. Registre comando, saída, data e commit; não cole segredos nos logs.

## Matriz de jornadas

Para cada linha, anexe link privado para captura, log ou ID verificável. Preencha resultado como `aprovado`, `falhou` ou `não executado`; uma linha sem evidência continua pendente.

| Jornada | Perfil | Evidência mínima | Resultado |
| --- | --- | --- | --- |
| Landing → desafio → cadastro | Visitante/aluno | URL, viewport móvel e desktop, redirecionamento após cadastro | Não executado |
| Entrega válida do ExpenseFlow → case público | Aluno | ID da versão salva, URL pública, checklist completo, atualização no painel de métricas | Não executado |
| Lista de interesse com UTM e consentimento | Visitante/admin | Lead no admin com origem; tentativas inválidas rejeitadas | Não executado |
| Oferta aberta → cadastro → checkout sandbox | Aluno | Reserva, origem UTM no pedido, preferência sandbox | Não executado |
| Pagamento aprovado → matrícula | Aluno/admin | Pedido, webhook e matrícula da turma correta | Não executado |
| Pagamento pendente/recusado/repetido/reembolsado | Aluno/admin | Um registro por evento de conciliação; sem acesso indevido nem vaga dupla | Não executado |
| Capacidade esgotada e acesso cruzado | Dois alunos/turmas | Rejeição da vaga excedente e leitura negada de dados alheios | Não executado |
| Diagnóstico → entrega → pedido de ajuste → reenvio | Aluno/mentor | IDs de submissão e revisão, arquivo acessível somente aos autorizados | Não executado |
| Revisão aprovada → certificado/portfólio | Mentor/aluno | Estado final, URL pública autorizada, certificado conforme regras | Não executado |
| E-mail e cron repetido | Admin | Outbox, recebimento de teste, ausência de duplicatas | Não executado |
| Teclado, zoom e 390 px | Visitante/aluno/mentor | Foco, mensagens de erro, ausência de rolagem horizontal inesperada | Não executado |

**Decisão do gate:** bloquear abertura da turma enquanto qualquer jornada crítica estiver sem evidência, houver P0/P1 aberto, matrícula indevida ou exposição de dados. O piloto de duas semanas e as sessões observadas exigem participantes reais; registrar seus resultados depois da execução, sem inferi-los dos testes de código.
