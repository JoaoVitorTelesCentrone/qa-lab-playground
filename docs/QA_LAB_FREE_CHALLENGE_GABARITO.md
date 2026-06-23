# Gabarito interno — ExpenseFlow Free Challenge

> Arquivo interno. Não publicar seu conteúdo na interface do desafio.

## 1. Valor negativo aceito
- **Reprodução:** Nova despesa → informar título, comprovante e valor negativo → salvar.
- **Atual:** a despesa negativa é criada.
- **Esperado:** bloquear o envio e explicar que o valor deve ser maior que zero.
- **Severidade sugerida:** Alta.
- **Documentação:** evidenciar o valor, o feedback de sucesso e o impacto nos totais.

## 2. Título aceita apenas espaços
- **Reprodução:** criar despesa usando espaços no título e preencher os demais campos.
- **Atual:** o registro é salvo sem título útil.
- **Esperado:** aplicar `trim` e exigir conteúdo real.
- **Severidade sugerida:** Média.
- **Documentação:** mostrar o registro vazio na listagem e seu impacto operacional.

## 3. Colaborador aprova a própria despesa
- **Reprodução:** usar João Silva → Aprovações → aprovar “Almoço com cliente”.
- **Atual:** João decide a própria solicitação.
- **Esperado:** Aprovações deve ser inacessível ao colaborador; decisões devem exigir gestor do time.
- **Severidade sugerida:** Crítica.
- **Documentação:** destacar fraude, segregação de função e impacto financeiro.

## 4. Filtro Reprovada mistura status
- **Reprodução:** Despesas → filtrar por Reprovada.
- **Atual:** “Táxi para aeroporto”, que está aprovada, também aparece.
- **Esperado:** somente despesas com status `rejected`.
- **Severidade sugerida:** Média.
- **Documentação:** anexar filtro selecionado e status divergente na mesma evidência.

## 5. Relatório aprovado diverge da listagem
- **Reprodução:** somar despesas aprovadas da listagem e comparar com Relatórios.
- **Atual:** o relatório adiciona R$ 37,90 ao valor real.
- **Esperado:** relatório e fonte transacional devem apresentar o mesmo total.
- **Severidade sugerida:** Alta.
- **Documentação:** registrar cálculo esperado, valor exibido e diferença exata.

## 6. Data futura aceita
- **Reprodução:** criar despesa com qualquer data posterior ao dia atual.
- **Atual:** cadastro concluído sem alerta.
- **Esperado:** bloquear ou exigir tratamento explícito conforme regra do produto.
- **Severidade sugerida:** Média.
- **Documentação:** evidenciar data do teste, data informada e sucesso do cadastro.

## 7. Comprovante aceita extensão inválida
- **Reprodução:** anexar `.exe` ou `.txt` em Nova despesa e salvar.
- **Atual:** qualquer extensão é aceita.
- **Esperado:** aceitar somente formatos autorizados, validar MIME/extensão e tamanho.
- **Severidade sugerida:** Alta.
- **Documentação:** incluir nome/extensão, ausência de validação e risco de segurança.
