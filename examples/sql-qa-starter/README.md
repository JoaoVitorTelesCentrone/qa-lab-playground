# SQL para QA — conjunto de treino

Exercícios em PostgreSQL com dados fictícios. A preparação cria somente tabelas temporárias na conexão atual; ao fechar a conexão, elas desaparecem.

## Uso seguro

1. Abra uma conexão local descartável no seu cliente PostgreSQL.
2. Execute `setup.sql` uma vez nessa conexão.
3. Rode as consultas dos Labs na mesma conexão.
4. No Lab de alteração, confira que a transação termina com `ROLLBACK`.

Não execute scripts de treino em banco de produção ou compartilhado. As tabelas não têm chaves estrangeiras de propósito: algumas linhas foram preparadas com inconsistências para praticar consultas de QA. Isso não é recomendação de modelagem para aplicações reais.

Todos os nomes e e-mails são fictícios e usam o domínio reservado `.test`.
