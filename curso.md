# QA Lab — Curso Completo de QA
**Do fundamento ao mercado. Com prática real no QA Lab Playground.**

---

## Como usar este curso

Cada módulo tem:
- **Conceitos** — o que você precisa entender
- **Na prática** — como isso aparece no dia a dia
- **Exercício no Playground** — onde você aplica agora

Não pule os exercícios. Eles são o curso.

---

## Estrutura

| Módulo | Tema | Tipo |
|---|---|---|
| 01 | Mentalidade QA | Fundamento |
| 02 | Fundamentos de Teste | Fundamento |
| 03 | Casos de Teste | Técnica |
| 04 | Bug Report | Técnica |
| 05 | QA em Times Ágeis | Contexto |
| 06 | Testes de API | Técnica |
| 07 | Caos, Regressão e Edge Cases | Avançado |
| 08 | Introdução à Automação | Avançado |
| 09 | Carreira em QA | Carreira |
| 10 | Projeto Final | Portfólio |

---

## MÓDULO 01 — Mentalidade QA

### Objetivo
Entender o que QA é de verdade — antes de aprender qualquer ferramenta.

---

### 1.1 O que é QA (e o que não é)

QA significa **Quality Assurance** — garantia de qualidade. Não é apenas "achar bug".

QA é o profissional responsável por:
- Questionar requisitos antes do desenvolvimento começar
- Identificar riscos que o time ainda não viu
- Garantir que o que foi combinado é o que foi entregue
- Comunicar problemas com clareza e contexto

**O que QA não é:**
- A última barreira antes do cliente
- O culpado quando vai bug pra produção
- Alguém que "só clica na tela"
- Entry level por definição

---

### 1.2 A diferença real entre júnior e sênior em QA

| | Júnior | Sênior |
|---|---|---|
| Foco | Executar casos de teste | Definir estratégia de teste |
| Comunicação | Reporta bug | Explica impacto do bug |
| Visão | Tela | Sistema |
| Postura | Espera requisito | Questiona requisito |
| Automação | Conhece ferramentas | Sabe o que automatizar e por quê |

A evolução em QA não é sobre saber mais ferramentas. É sobre ampliar a visão do que precisa ser testado e por quê.

---

### 1.3 Qualidade não é responsabilidade só do QA

Qualidade é responsabilidade do time. O QA é o especialista em qualidade — não o único responsável por ela.

- **Dev** escreve código testável e faz code review
- **PO** escreve critérios de aceite claros
- **QA** mapeia riscos, define estratégia, executa e reporta
- **Time** cuida da Definition of Done

QA que trabalha isolado é QA que falha.

---

### Exercício 01 — Playground
**Acesse o Playground e passe 15 minutos navegando sem nenhum objetivo.**

Depois responda por escrito:
- Qual é o propósito do sistema?
- Quem são os usuários prováveis?
- Quais funcionalidades você identifica?
- O que te pareceu estranho ou suspeito?

Esse exercício simula o primeiro dia num time novo. Observação antes de execução.

---

## MÓDULO 02 — Fundamentos de Teste

### Objetivo
Dominar os tipos de teste, quando usar cada um e como pensar na cobertura.

---

### 2.1 Tipos de Teste

**Por objetivo:**

| Tipo | O que verifica |
|---|---|
| Funcional | O sistema faz o que deveria fazer |
| Não-funcional | Como o sistema se comporta (performance, usabilidade, segurança) |
| Estrutural | Como o código foi construído (white box) |

**Por abordagem:**

| Abordagem | Descrição |
|---|---|
| Manual | Testador executa e observa |
| Automatizado | Script executa e verifica resultado |
| Exploratório | Testador navega sem script, usa intuição e conhecimento |

**Por escopo:**

| Escopo | Descrição |
|---|---|
| Unitário | Testa uma função isolada |
| Integração | Testa a comunicação entre componentes |
| Sistema (E2E) | Testa o fluxo completo do usuário |
| Regressão | Garante que o que funcionava ainda funciona |
| Smoke | Verificação mínima de que o sistema está de pé |
| Sanidade | Verificação rápida após uma correção específica |

---

### 2.2 A Pirâmide de Testes

```
        /\
       /  \
      / E2E \        ← Poucos, lentos, caros
     /--------\
    /Integração\     ← Médio volume, velocidade média
   /------------\
  /   Unitário   \   ← Muitos, rápidos, baratos
 /________________\
```

**Regra prática:**
- Quanto mais alto na pirâmide, mais caro é manter e mais lento é rodar
- A base unitária forte reduz a necessidade de testes E2E extensivos
- Automação E2E sem base unitária é uma pirâmide invertida — instável

---

### 2.3 Teste Manual vs Automação

Automação não substitui teste manual. Eles têm papéis diferentes.

| Manual | Automação |
|---|---|
| Exploração | Regressão |
| Usabilidade | Repetição |
| Novos fluxos | Fluxos estáveis |
| Julgamento humano | Volume e velocidade |

**Regra:** Só automatize o que você já testou manualmente e entende bem.

---

### Exercício 02 — Playground
**Execute o Cenário 1: Validar listagem de usuários.**

Documente:
- Que tipo de teste você fez? (funcional, exploratório, API?)
- O que estava na especificação vs o que você encontrou
- Classifique cada comportamento estranho por tipo de falha

---

## MÓDULO 03 — Casos de Teste

### Objetivo
Aprender a escrever casos de teste que realmente servem para o time.

---

### 3.1 O que é um caso de teste

Um caso de teste é uma instrução documentada para verificar um comportamento específico do sistema.

**Estrutura básica:**

```
ID:               CT-001
Título:           Login com credenciais válidas
Pré-condição:     Usuário cadastrado no sistema
Passos:           1. Acesse /login
                  2. Insira e-mail válido
                  3. Insira senha correta
                  4. Clique em "Entrar"
Resultado Esperado: Usuário redirecionado para dashboard
Resultado Obtido:   [preencher na execução]
Status:           Passou / Falhou / Bloqueado
```

---

### 3.2 Tipos de casos de teste

| Tipo | Objetivo | Exemplo |
|---|---|---|
| Positivo | Fluxo feliz funciona | Login com dados corretos |
| Negativo | Sistema rejeita entrada inválida | Login com senha errada |
| Edge case | Limites e extremos | Campo com 0 caracteres, com 1000 |
| Destrutivo | Forçar falha intencional | Enviar null, injetar caracteres especiais |

---

### 3.3 Técnicas de derivação de casos

**Partição de Equivalência**
Divida as entradas em grupos que se comportam igual. Teste um representante de cada grupo.

Exemplo — campo de idade:
- Grupo inválido negativo: qualquer número < 0
- Grupo válido: 0 a 120
- Grupo inválido positivo: qualquer número > 120

**Análise de Valor Limite**
Teste os limites dos grupos, não só o meio.

Para campo de idade com mínimo 18 e máximo 65:
- Teste: 17, 18, 19 e 64, 65, 66

**Tabela de Decisão**
Para lógicas com múltiplas condições combinadas.

---

### 3.4 Casos de teste ruins (o que evitar)

❌ "Testar o login" — vago demais, não reproduzível  
❌ Passos que dependem de memória do testador  
❌ Resultado esperado subjetivo ("deve parecer certo")  
❌ Um caso de teste com 40 passos — quebre em vários  

---

### Exercício 03 — Playground
**Escreva casos de teste para o Form Bugado antes de testá-lo.**

Requisito simulado:
> O formulário de cadastro deve aceitar nome, e-mail válido, senha com mínimo 8 caracteres e confirmação de senha idêntica. Todos os campos são obrigatórios.

Escreva:
- Mínimo 3 casos positivos
- Mínimo 5 casos negativos
- Mínimo 2 edge cases

Depois execute no Playground e compare o resultado esperado com o obtido.

---

## MÓDULO 04 — Bug Report

### Objetivo
Aprender a comunicar falhas com clareza para que o dev consiga reproduzir e corrigir.

---

### 4.1 O que é um bug

Bug é qualquer desvio entre o comportamento esperado (definido nos requisitos ou critérios de aceite) e o comportamento real do sistema.

Não é só crash. Não é só erro visual.

- Dado salvo errado = bug
- Mensagem de erro sem contexto = bug
- Timeout sem feedback ao usuário = bug
- Status code errado = bug

---

### 4.2 Ciclo de vida do bug

```
Encontrado → Reportado → Triado → Em correção → Corrigido → Retestado → Fechado
                                                                  ↓
                                                            Reaberto (se ainda falha)
```

---

### 4.3 Severidade vs Prioridade

Dois conceitos que parecem iguais e não são.

**Severidade** — impacto técnico da falha no sistema:

| Nível | Descrição | Exemplo |
|---|---|---|
| Crítico | Sistema inoperante ou perda de dados | Login não funciona para nenhum usuário |
| Alto | Funcionalidade principal comprometida | Checkout não finaliza pedido |
| Médio | Funcionalidade degradada com workaround | Filtro retorna resultado errado mas há busca manual |
| Baixo | Cosmético ou impacto mínimo | Texto com typo, cor levemente errada |

**Prioridade** — urgência de correção dado o contexto de negócio:

Um bug de severidade baixa pode ter prioridade alta (typo no nome do CEO na home antes de uma apresentação).
Um bug de severidade alta pode ter prioridade baixa (funcionalidade usada por 2 usuários internos).

---

### 4.4 Como escrever um bug report de qualidade

**Estrutura:**

```
Título:        [Ação] + [Componente] + [Comportamento incorreto]
               Exemplo: "POST /api/users descarta o campo 'role' silenciosamente"

Ambiente:      Versão, browser, OS, endpoint

Pré-condição:  O que precisa estar pronto para reproduzir

Passos para
reproduzir:    1. ...
               2. ...
               3. ...

Resultado
esperado:      O que deveria acontecer

Resultado
obtido:        O que aconteceu de fato

Severidade:    Crítico / Alto / Médio / Baixo
Prioridade:    Alta / Média / Baixa

Evidência:     Print, log, response body
```

**Título é metade do bug report.** Um bom título já diz o que, onde e como.

---

### 4.5 O que NÃO escrever num bug report

❌ "O sistema bugou" — sem contexto  
❌ "Tá errado" — sem comportamento esperado  
❌ "Às vezes falha" — sem condição de reprodução  
❌ Tom acusatório — bug report é técnico, não julgamento  

---

### Exercício 04 — Playground
**Execute o Cenário 2: Encontrar bugs no formulário.**

Para cada bug encontrado, escreva um bug report completo usando a estrutura acima.

Critério de qualidade: o dev conseguiria reproduzir só lendo o seu report, sem falar com você?

---

## MÓDULO 05 — QA em Times Ágeis

### Objetivo
Entender como QA funciona dentro de um time Scrum e onde QA agrega mais valor.

---

### 5.1 O básico de Scrum para QA

| Evento | O que é | Papel do QA |
|---|---|---|
| Sprint Planning | Time define o que entra na sprint | QA questiona critérios de aceite |
| Daily | Sincronização diária | QA reporta bloqueios e riscos |
| Sprint Review | Demonstração do que foi feito | QA valida o que está sendo demonstrado |
| Retrospectiva | Melhoria do processo | QA aponta falhas de processo, não de pessoas |
| Refinamento | Detalhamento das histórias futuras | QA é essencial aqui |

---

### 5.2 Histórias de Usuário e Critérios de Aceite

**História de Usuário:**
```
Como [persona]
Quero [ação]
Para [objetivo de negócio]
```

**Critérios de Aceite em Gherkin:**
```
Dado que [contexto/pré-condição]
Quando [ação do usuário]
Então [resultado esperado]
```

Exemplo:
```
Dado que o usuário está na página de login
Quando inserir e-mail e senha corretos e clicar em "Entrar"
Então deve ser redirecionado para o dashboard com nome exibido no header
```

Critérios de aceite são a base para os casos de teste. Se o critério é vago, o teste é vago.

---

### 5.3 Shift Left Testing

Shift Left significa mover o QA para mais cedo no processo — antes do código estar pronto.

**QA tradicional (tarde demais):**
```
Requisito → Dev → Dev → Dev → QA → Produção
```

**Shift Left:**
```
Requisito → QA → Dev → Dev + QA → QA → Produção
```

QA no refinamento evita bugs que nem chegam a ser desenvolvidos.

**Na prática:**
- Revisar histórias antes da sprint começar
- Apontar critérios ausentes ou contraditórios
- Questionar fluxos de erro (o que acontece se der errado?)
- Mapear riscos técnicos antes do dev começar

---

### 5.4 Definition of Done (DoD)

DoD é o checklist que define quando uma história está realmente pronta.

**Exemplo de DoD com QA:**
- [ ] Código revisado por par
- [ ] Testes unitários escritos e passando
- [ ] Casos de teste executados
- [ ] Bugs críticos e altos corrigidos
- [ ] Documentação atualizada
- [ ] Demo aprovado pelo PO
- [ ] Deploy em staging sem regressão

Se não passou pelo DoD, não foi para produção.

---

### 5.5 Quando o QA deve dizer não

QA tem autonomia para bloquear uma entrega quando:
- Critérios de aceite não foram atendidos
- Bug crítico ou alto não corrigido
- Sem tempo suficiente para testar o escopo combinado
- Mudança de último minuto sem reteste

Dizer não é técnico, não é pessoal. Sempre acompanhe de evidência.

---

### Exercício 05 — Playground
**Pegue o Cenário 3 (Testar busca com edge cases) e:**

1. Escreva a história de usuário correspondente
2. Crie 3 critérios de aceite em Gherkin
3. Derive casos de teste a partir dos critérios
4. Execute e reporte os resultados

---

## MÓDULO 06 — Testes de API

### Objetivo
Entender e testar APIs REST com profundidade — o skill mais demandado no mercado de QA hoje.

---

### 6.1 O que é uma API REST

API (Application Programming Interface) é a camada de comunicação entre sistemas.

REST é um estilo arquitetural que usa HTTP para troca de dados.

**Componentes de uma requisição:**

```
Método   → GET, POST, PUT, PATCH, DELETE
URL      → https://api.exemplo.com/users/42
Headers  → Authorization, Content-Type, Accept
Params   → ?page=1&limit=10 (query params) ou /users/42 (path params)
Body     → JSON com os dados (em POST/PUT/PATCH)
```

**Componentes de uma resposta:**
```
Status Code  → 200, 201, 400, 401, 404, 500...
Headers      → Content-Type, X-Rate-Limit...
Body         → JSON com dados ou mensagem de erro
```

---

### 6.2 Status Codes que todo QA precisa saber

| Código | Significado | Quando esperar |
|---|---|---|
| 200 | OK | GET/PUT bem-sucedido |
| 201 | Created | POST que cria recurso |
| 204 | No Content | DELETE bem-sucedido |
| 400 | Bad Request | Dados inválidos enviados |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Recurso já existe |
| 422 | Unprocessable Entity | Dados válidos mas inaceitáveis |
| 500 | Internal Server Error | Erro no servidor |

**Status code mentiroso** é um dos bugs mais perigosos. Um 200 com body de erro engana o cliente.

---

### 6.3 O que testar numa API

**Para cada endpoint, verifique:**

- Status code correto para cada cenário
- Body da resposta tem os campos esperados
- Tipos dos campos estão corretos (string, int, boolean, array)
- Campos obrigatórios presentes
- Campos sensíveis não expostos (senha, token interno)
- Comportamento com dados inválidos (400, não 500)
- Comportamento sem autenticação (401)
- Comportamento com ID inexistente (404)
- Comportamento com payload vazio
- Comportamento com campos extras no body

---

### 6.4 Ferramentas

**Postman / Insomnia** — para testes manuais de API
- Collections para organizar endpoints
- Environments para trocar base URL
- Tests (JavaScript) para validar response

**curl** — linha de comando, útil para reproduzir bugs rapidamente
```bash
curl -X GET http://localhost:3001/api/users \
  -H "Content-Type: application/json"
```

---

### 6.5 Os endpoints do Playground e seus bugs

O QA Lab Playground tem 10 endpoints com falhas intencionais:

| Endpoint | Bug plantado | O que testar |
|---|---|---|
| GET /api/users | 500 aleatório | Consistência — execute 10x seguidas |
| GET /api/users/:id | Retorna usuário errado | ID solicitado vs ID recebido |
| POST /api/users | Descarta campos silenciosamente | Body enviado vs body persistido |
| GET /api/products | Paginação pula itens | Total de itens vs itens recebidos |
| GET /api/products/:id | 200 com body de erro | Status code vs conteúdo do body |
| POST /api/orders | Timeout intermitente | Tempo de resposta em múltiplas chamadas |
| GET /api/orders/:id | Formato muda a cada request | Schema consistency |
| PUT /api/users/:id | Sucesso falso | Retorna 200 mas não persiste |
| DELETE /api/products/:id | 204 mas não deleta | GET após DELETE |
| GET /api/health | Mente sobre status | Health check vs comportamento real |

---

### Exercício 06 — Playground
**Execute todos os 10 endpoints da API. Para cada um:**

1. Faça pelo menos 3 chamadas diferentes (feliz, negativo, edge case)
2. Documente status code esperado vs obtido
3. Escreva um bug report para cada anomalia encontrada
4. Ative o Modo Caos e repita — compare os resultados

---

## MÓDULO 07 — Caos, Regressão e Edge Cases

### Objetivo
Ir além do fluxo feliz. Testar o que acontece quando as coisas dão errado.

---

### 7.1 Edge Cases — os limites que ninguém testa

Edge case é qualquer entrada ou condição nos limites do comportamento esperado.

**Onde procurar:**
- Campos de texto: vazio, 1 char, limite máximo, acima do limite, espaço em branco, HTML, SQL, emojis
- Números: 0, negativos, decimais, valor máximo inteiro
- Datas: passado, futuro, formatos diferentes, fuso horário, 29/02
- Listas: vazia, 1 item, muitos itens
- Uploads: arquivo vazio, arquivo enorme, formato errado, nome com caracteres especiais
- Concorrência: dois usuários fazendo a mesma ação ao mesmo tempo

---

### 7.2 Testes de Regressão

Regressão = garantir que o que funcionava antes ainda funciona depois de uma mudança.

**Quando executar regressão:**
- Após qualquer correção de bug
- Após deploy de nova funcionalidade
- Antes de releases
- Após refatoração de código

**Estratégia de regressão:**
- Não precisa testar tudo sempre — priorize o que é crítico e o que foi impactado
- Automatize regressão de fluxos estáveis
- Mantenha suite de smoke para verificação mínima

---

### 7.3 Testes de Comportamento Intermitente

Alguns bugs só aparecem às vezes. São os mais difíceis de reportar e os mais perigosos.

**Como abordar:**
- Execute o mesmo request dezenas de vezes
- Anote frequência de falha (6 de 10, 1 de 50)
- Procure padrão (horário, carga, sequência de chamadas)
- Capture logs e headers das chamadas que falharam

No Playground, o endpoint GET /api/users e POST /api/orders têm comportamento intermitente proposital.

---

### 7.4 O Modo Caos

Chaos Engineering é a prática de introduzir falhas intencionais para testar a resiliência do sistema.

O QA Lab Playground tem Modo Caos com:
- Respostas 500 aleatórias
- Dados incorretos
- Timeouts intermitentes
- Paginação inconsistente
- Status codes mentirosos

**Como usar no treinamento:**
```bash
# Ativar caos em todos os endpoints
POST /api/_chaos/toggle
{"enabled": true}

# Resetar dados
POST /api/_admin/reset
```

---

### Exercício 07 — Playground
**Ative o Modo Caos e execute o Cenário 4 (Identificar respostas inconsistentes).**

1. Execute cada endpoint 10 vezes
2. Registre frequência de comportamento incorreto
3. Classifique os bugs por severidade
4. Escreva um relatório de sessão: o que você testou, como, o que encontrou

---

## MÓDULO 08 — Introdução à Automação

### Objetivo
Entender quando e o que automatizar — antes de aprender qualquer ferramenta.

---

### 8.1 Por que automatizar

- Velocidade em regressão
- Consistência — não esquece de executar um passo
- Feedback rápido para o dev
- Liberação do QA para testes exploratórios e de maior valor

Automação não é o objetivo. É um meio para ter qualidade com velocidade.

---

### 8.2 O que NÃO automatizar

- Funcionalidades instáveis ou em desenvolvimento ativo
- Testes de usabilidade e UX
- Fluxos que mudam a cada sprint
- Cenários exploratórios
- O que você ainda não testou manualmente e entende bem

**Regra de ouro:** automatize o que você já testou manualmente e vai precisar testar de novo muitas vezes.

---

### 8.3 Ferramentas por camada

| Camada | Ferramenta | Linguagem |
|---|---|---|
| API | Postman (Newman) | JavaScript |
| API | REST Assured | Java |
| API | pytest + requests | Python |
| E2E Web | Cypress | JavaScript |
| E2E Web | Playwright | JS / Python / C# |
| Mobile | Appium | Multi |
| Unitário | Jest, JUnit, pytest | Depende do stack |

---

### 8.4 Primeiro teste automatizado — API do Playground

Usando curl + script bash simples:

```bash
#!/bin/bash
# Teste: GET /api/users deve retornar status 200

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/users)

if [ "$RESPONSE" == "200" ]; then
  echo "✅ PASSOU: GET /api/users retornou 200"
else
  echo "❌ FALHOU: esperado 200, obtido $RESPONSE"
fi
```

---

### 8.5 Estrutura básica de um teste automatizado

Todo teste automatizado tem a mesma estrutura — independente da ferramenta:

```
// Arrange — preparar o estado
const userId = 1;

// Act — executar a ação
const response = await fetch(`/api/users/${userId}`);
const body = await response.json();

// Assert — verificar o resultado
expect(response.status).toBe(200);
expect(body.id).toBe(userId);
expect(body.name).toBeDefined();
```

---

### Exercício 08 — Playground
**Escreva um script que testa os 10 endpoints da API e reporta:**

- Quais passaram (status esperado)
- Quais falharam (status inesperado)
- Quantas vezes cada endpoint falhou em 10 chamadas

Pode usar qualquer linguagem ou ferramenta que você já conhece.

---

## MÓDULO 09 — Carreira em QA

### Objetivo
Entender o mercado, como se posicionar e como construir evidência do seu crescimento.

---

### 9.1 O mapa de carreira

```
Estágio / Trainee
      ↓
QA Júnior          → Executa casos de teste, reporta bugs, aprende ferramentas
      ↓
QA Pleno           → Define estratégia, escreve automação, questiona requisitos
      ↓
QA Sênior          → Lidera qualidade no time, mentora, define processos
      ↓
QA Lead / Manager  → Visão de produto, gestão de time, cultura de qualidade
      ↓
SDET / Engenheiro  → Foco em automação, infraestrutura de testes, framework próprio
```

Não existe caminho único. Alguns QAs vão fundo em automação, outros em processos, outros em liderança.

---

### 9.2 O que o mercado busca hoje

**Skills técnicos mais pedidos:**
- API testing (Postman, REST)
- Automação web (Cypress ou Playwright)
- SQL básico (consultar dados pra validar)
- Git (controle de versão dos testes)
- Docker básico (rodar ambiente local)
- CI/CD básico (entender pipeline, rodar testes nele)

**Skills comportamentais que diferenciam:**
- Comunicação clara de riscos
- Autonomia para investigar sem precisar de mão
- Visão de produto (entender o negócio)
- Colaboração — QA que trabalha bem com dev é raro e valorizado

---

### 9.3 Como montar portfólio em QA

Portfólio de QA não é currículo. É evidência de como você pensa e trabalha.

**O que colocar:**
- Bug reports reais (anonimize o cliente)
- Casos de teste escritos com critérios claros
- Relatórios de sessão de testes
- Scripts de automação no GitHub
- Documentação de estratégia de teste

**Onde hospedar:**
- GitHub — para automação e documentação técnica
- Notion / Confluence — para relatórios e estratégias
- LinkedIn — para cases em texto

O QA Lab Playground foi criado para isso. Cada sessão é uma oportunidade de portfólio.

---

### 9.4 Certificações

| Certificação | Nível | Vale? |
|---|---|---|
| CTFL (ISTQB Foundation) | Iniciante | Sim — valida fundamentos, reconhecida internacionalmente |
| CTAL (ISTQB Advanced) | Sênior | Sim — para quem quer especialização |
| AWS / Azure | Qualquer | Sim — se trabalhar com cloud e testes de infraestrutura |

Certificação não substitui prática. Mas valida vocabulário e fundamentos.

---

### 9.5 O QA do futuro

Qualidade está se tornando mais integrada ao ciclo de desenvolvimento. O QA do futuro:

- Trabalha dentro do time de produto, não à parte
- Contribui com código de teste como qualquer dev
- Entende de dados — analisa métricas de qualidade em produção
- Tem visão de segurança básica
- Usa IA como ferramenta de apoio, não como substituto do raciocínio

---

### Exercício 09
**Monte seu perfil de QA respondendo:**

1. Em que nível você se considera hoje? Por quê?
2. Quais 3 skills técnicos você mais precisa desenvolver?
3. O que você já tem que pode entrar no portfólio agora?
4. Qual seria seu próximo passo de carreira em 12 meses?

---

## MÓDULO 10 — Projeto Final

### Objetivo
Integrar tudo que foi aprendido em uma sessão completa de testes real, com documentação pronta para portfólio.

---

### O desafio

Você é o QA de um time que vai fazer deploy do QA Lab Playground em produção amanhã.

Seu trabalho é:

**1. Plano de Teste**
Documente:
- Escopo do que será testado
- O que está fora de escopo
- Estratégia (quais tipos de teste, em qual ordem)
- Critérios de entrada e saída da sprint
- Riscos identificados

**2. Execução**
Execute pelo menos:
- Todos os 5 cenários guiados
- Todos os 10 endpoints da API (mínimo 5 chamadas cada)
- O Form Bugado completo
- Uma sessão exploratória de 30 minutos sem script

**3. Bug Reports**
Para cada anomalia encontrada:
- Bug report completo com título, passos, severidade e evidência

**4. Relatório Final de Sessão**
Documente:
- Total de casos executados
- Total de bugs encontrados por severidade
- Recomendação: o sistema está pronto para ir a produção?
- Justificativa técnica da sua recomendação

---

### Critério de conclusão

Você completou o curso quando conseguir responder com evidência:

> "Testei o sistema, documentei o que encontrei, e estou preparado para defender minha recomendação para o time."

Isso é QA.

---

## Referências e Próximos Passos

**Para aprofundar:**
- ISTQB Syllabus Foundation Level (gratuito, em inglês)
- "The Art of Software Testing" — Glenford Myers
- "Agile Testing" — Lisa Crispin & Janet Gregory
- "Testing Computer Software" — Cem Kaner

**Comunidades:**
- QA Brasil (LinkedIn)
- Ministry of Testing
- Test Automation University (gratuito)

**Ferramentas para aprender:**
- Postman (API testing)
- Cypress.io (automação web)
- GitHub Actions (CI/CD)
- k6 (performance)

---

*Curso desenvolvido pelo QA Lab. Playground disponível em http://localhost:3000.*
