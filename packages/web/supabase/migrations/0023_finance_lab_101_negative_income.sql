-- Lab 101: a massa controlada inclui uma receita negativa (#012) para que o
-- aluno consiga investigar a validação de borda. A regra normal da aplicação
-- continua recusando esse valor; o desvio plantado é o único caminho que o
-- permite em criação/edição. A constraint antiga impedia até a massa de teste
-- de ser restaurada para usuários autenticados.

alter table public.practice_finance_transactions
  drop constraint if exists practice_finance_transactions_amount_check;

