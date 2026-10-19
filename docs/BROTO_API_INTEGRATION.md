# Preparar a API do Broto Space para a mentoria

O módulo de API já pode ser praticado no QA Lab. A coleção fornecida aponta apenas para a API educacional local; ela **não** testa o Broto Space.

## Para habilitar um alvo Broto com segurança

Antes de criar requests reais, obter do responsável pelo Broto:

- URL e janela de uso do staging, com confirmação explícita de autorização para testes;
- OpenAPI/Swagger ou documentação equivalente, incluindo autenticação e contratos;
- contas e dados sintéticos dedicados, com instrução de reset/limpeza;
- limites de frequência, endpoints fora de escopo e contatos para incidentes;
- política para logs, evidências e remoção de dados pessoais.

Com isso, adicionar um ambiente separado chamado `Broto staging`, sem credenciais versionadas. Manter `Local` como ambiente padrão e bloquear qualquer URL de produção. Validar primeiro health/read-only, depois autenticação e leitura; só habilitar escrita após confirmar dados sintéticos e limpeza. Carga ou segurança precisam de autorização e limites próprios, independentes da autorização funcional.

## Estado atual

- API de treino, documentação e coleções Postman/Bruno: disponíveis no API Playground.
- API do Broto, contrato e staging autorizado neste workspace: não disponíveis.
- Próximo passo de integração: receber os itens acima e mapear o contrato real; não inferir endpoints a partir da interface do produto.
