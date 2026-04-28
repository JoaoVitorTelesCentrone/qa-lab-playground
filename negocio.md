# QA Lab Playground — Regras de Negócio e Funcionamento

## Visão Geral

O **QA Lab Playground** é uma plataforma educacional para ensinar QA (Quality Assurance) através de prática real. O lema é **"Aprenda QA na prática quebrando coisas de propósito"**. A plataforma é voltada para profissionais e estudantes de QA brasileiros que querem exercitar habilidades de teste em módulos temáticos com sistemas intencionalmente bugados.

---

## Arquitetura e Tecnologias

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript 5 |
| Estilização | Tailwind CSS 4 + shadcn/ui + Radix UI |
| Backend | Hono + Bun + TypeScript 5 |
| Monorepo | Bun Workspaces |
| Containerização | Docker + docker-compose |

### Pacotes do Monorepo

| Pacote | Porta | Descrição |
|--------|-------|-----------|
| `@qa-lab/web` | 3000 | Frontend Next.js |
| `@qa-lab/api` | 3001 | Backend Hono |
| `@qa-lab/shared` | — | Tipos e constantes compartilhados |

---

## Entidades e Modelos de Dados

### Usuário (`User`)
```typescript
{
  id: number
  nome: string
  email: string
  telefone: string
  cargo: string
  ativo: boolean
  criadoEm: string  // ISO timestamp
}
```

### Produto (`Product`)
```typescript
{
  id: number
  nome: string
  descricao: string
  preco: number
  estoque: number
  categoria: string
  ativo: boolean
}
```

### Pedido (`Order`)
```typescript
{
  id: number
  usuarioId: number
  produtos: OrderItem[]
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado"
  total: number
  criadoEm: string
}
```

### Item de Pedido (`OrderItem`)
```typescript
{
  produtoId: number
  quantidade: number
  precoUnitario: number
}
```

### Caso de Teste (`TestCase`)
```typescript
{
  id: string
  titulo: string
  descricao: string
  resultado_esperado: string
  sistema: "API" | "E-commerce" | "Form Bugado"
  tipo: "funcional" | "regressao" | "smoke" | "seguranca" | "exploratorio"
  prioridade: "alta" | "media" | "baixa"
  status: "nao_executado" | "passou" | "falhou" | "bloqueado"
  passos: string[]
  criadoEm: string
}
```

### Cenário (`Scenario`)
```typescript
{
  id: string
  titulo: string
  descricao: string
  descricaoCompleta: string
  modulo: "api" | "form" | "exploratorio"
  dificuldade: "iniciante" | "intermediario" | "avancado"
  objetivos: ScenarioObjective[]
  endpointsRelacionados?: string[]
}
```

### Configuração de Chaos (`ChaosConfig`)
```typescript
{
  [endpointKey: string]: {
    enabled: boolean
    errorRate: number     // 0–100 (percentual de erros)
    delayMs: number       // atraso artificial em ms
    wrongData: boolean    // retorna dados incorretos
  }
}
```

---

## Dados Iniciais (Seed)

A API é inicializada com dados em memória:
- **20 usuários** gerados automaticamente
- **15 produtos** gerados automaticamente
- **10 pedidos** gerados automaticamente

Todos os dados podem ser resetados a qualquer momento via `POST /api/_admin/reset`.

---

## Regras de Negócio Globais

1. **Dados em memória**: Não há banco de dados persistente. Todos os dados vivem em memória e são perdidos ao reiniciar o servidor.
2. **Reset disponível**: `POST /api/_admin/reset` restaura o estado inicial com os dados seed.
3. **Paginação padrão**: Todas as listagens paginadas usam 10 itens por página como padrão, com máximo de 50.
4. **Chaos desligado por padrão**: Todos os endpoints funcionam corretamente por padrão; os bugs só são ativados quando o Chaos Mode está habilitado.
5. **Idioma**: A plataforma é inteiramente em português do Brasil.

---

## Módulos da Plataforma

### Módulo 1 — API Playground com Chaos Engineering

**Objetivo**: Praticar testes de API com falhas reais simuladas via Chaos Engineering.

#### Endpoints da API

| Método | Rota | Bug (quando Chaos ativo) |
|--------|------|--------------------------|
| GET | `/api/users` | Erro 500 aleatório |
| GET | `/api/users/:id` | Retorna o usuário errado |
| POST | `/api/users` | Descarta campos silenciosamente |
| GET | `/api/products` | Paginação pula itens |
| GET | `/api/products/:id` | Retorna HTTP 200 com body de erro |
| POST | `/api/orders` | Timeout intermitente |
| GET | `/api/orders/:id` | Formato de resposta inconsistente |
| PUT | `/api/users/:id` | Falso sucesso — não atualiza nada |
| DELETE | `/api/products/:id` | Retorna 204 mas não deleta |
| GET | `/api/health` | Mente sobre o status do serviço |

#### Rotas de Chaos (Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/_chaos/config` | Visualiza configuração atual |
| POST | `/api/_chaos/config` | Atualiza configuração de um endpoint |
| POST | `/api/_chaos/toggle` | Liga/desliga todo o Chaos Mode |
| POST | `/api/_admin/reset` | Reseta todos os dados |

#### Regras de Chaos
- Cada endpoint tem sua configuração independente (`errorRate`, `delayMs`, `wrongData`)
- O toggle global (`/api/_chaos/toggle`) habilita ou desabilita todos os endpoints de uma vez
- `errorRate` de 0 a 100 representa o percentual de requisições que retornarão erro

#### Fluxo do QA
1. Acessar o dashboard e abrir a documentação dos endpoints
2. Habilitar Chaos Mode para os endpoints desejados
3. Disparar requisições e observar os comportamentos bugados
4. Documentar as descobertas (erros, inconsistências, status codes incorretos)
5. Desabilitar o Chaos e comparar o comportamento correto
6. Registrar os bugs encontrados como casos de teste

---

### Módulo 2 — Form Bugado

**Objetivo**: Encontrar 5 bugs intencionais escondidos em um formulário de cadastro.

#### Bugs presentes no formulário
1. Validação de e-mail aceita formatos inválidos (ex: `user@`, `user@.com`)
2. Campo obrigatório não é validado antes do envio
3. Máscara do campo de telefone quebra ao colar valores
4. Botão de envio permanece habilitado mesmo com erros no formulário
5. Mensagem de sucesso exibida é incorreta

#### Regras
- O formulário exibe um checklist interativo para marcar bugs encontrados
- O progresso é rastreado visualmente
- O desafio é considerado concluído quando todos os 5 bugs forem marcados

#### Fluxo do QA
1. Abrir o formulário
2. Testar cada campo com inputs variados (e-mails inválidos, campos vazios, colar texto)
3. Tentar submeter o formulário em diferentes estados
4. Verificar as mensagens exibidas
5. Marcar cada bug encontrado no checklist

---

### Módulo 3 — Cenários de Teste

**Objetivo**: Executar cenários guiados e progressivos de teste, com objetivos e dicas.

#### Cenários disponíveis (5)

| # | Título | Dificuldade | Módulo |
|---|--------|-------------|--------|
| 1 | Validar listagem de usuários com paginação | Iniciante | API |
| 2 | Encontrar bugs no formulário | Iniciante | Form |
| 3 | Testar busca de produtos com edge cases | Intermediário | API |
| 4 | Identificar respostas de API inconsistentes | Intermediário | API |
| 5 | Validar tratamento de erros em pedidos | Intermediário | API |

#### Regras
- Cada cenário possui múltiplos objetivos com dicas (`hints`) e resultados esperados
- Cenários podem ter endpoints relacionados listados para orientação
- Casos de teste podem ser vinculados a cenários para documentação
- Dificuldade é progressiva: Iniciante → Intermediário → Avançado

#### Fluxo do QA
1. Selecionar um cenário da lista
2. Ler a descrição completa e os objetivos
3. Executar o cenário (chamadas de API, interação com UI)
4. Verificar os resultados encontrados com os resultados esperados
5. Marcar objetivos como concluídos
6. Vincular descobertas a Casos de Teste para documentação

---

### Módulo 4 — Gerenciamento de Casos de Teste

**Objetivo**: Planejar e gerenciar casos de teste em planos e suítes.

#### Conceitos
- **Plano de Teste**: agrupa suítes de teste em torno de um objetivo maior
- **Suíte de Teste**: agrupa casos de teste relacionados
- **Caso de Teste**: unidade atômica de teste com passos, resultado esperado e status

#### Ciclo de Status do Caso de Teste
```
Não Executado → Passou → Falhou → Bloqueado → Não Executado (ciclo)
```

#### Tipos de Caso de Teste
- `funcional` — testa funcionalidades específicas
- `regressao` — verifica que funcionalidades anteriores ainda funcionam
- `smoke` — validação básica de sanidade
- `seguranca` — testa vulnerabilidades e comportamento inseguro
- `exploratorio` — testes livres sem script definido

#### Prioridades
- `alta` — deve ser executado primeiro
- `media` — executado no ciclo normal
- `baixa` — executado quando há tempo disponível

#### Sistemas suportados
- `API` — testes contra os endpoints do backend
- `E-commerce` — testes de fluxos de compra
- `Form Bugado` — testes do formulário com bugs

#### Regras
- Casos de teste podem ser vinculados a cenários pré-definidos
- A rota `GET /api/casos` retorna todos os casos cadastrados
- Estatísticas de progresso são exibidas em tempo real

---

### Módulo 5 — Elementos Dinâmicos

**Objetivo**: Praticar automação de testes com seletores `data-testid` e elementos dinâmicos.

#### Componentes disponíveis

| Categoria | Elementos |
|-----------|-----------|
| Tabela | Ordenação, filtro, paginação, busca |
| Loading | Auto-load, trigger manual, retry, polling |
| Interativos | Sliders, toggles, accordions, modais, alertas |

#### Regras
- Todos os elementos interativos possuem atributo `data-testid` documentado
- Os seletores são expostos publicamente para facilitar o aprendizado de automação
- O módulo simula comportamentos reais de UIs complexas

#### Fluxo do QA
1. Revisar os seletores `data-testid` disponíveis
2. Testar a tabela dinâmica: ordenar colunas, filtrar, paginar e buscar
3. Testar os estados de loading e comportamentos de retry
4. Interagir com os componentes (modais, acordeões, toggles)
5. Escrever scripts de automação usando os seletores expostos

---

### Módulo 6 — Datas Bugadas

**Objetivo**: Encontrar 10 bugs intencionais relacionados a datas, horas e timezones.

#### Tipos de bugs presentes
- Formato de data incorreto
- Cálculo de timezone errado
- Não respeita horário de verão (DST)
- Comparação de datas com timezone diferente
- Exibição de datas em locale errado

#### Regras
- Checklist interativo para marcar bugs encontrados
- Módulo concluído quando todos os 10 bugs são encontrados

---

### Módulo 7 — Despesas (CRUD Simulado)

**Objetivo**: Praticar testes de CRUD completo com operações em massa e filtros combinados.

#### Funcionalidades
- Listagem paginada de despesas
- Seleção múltipla de linhas
- Exclusão em massa (bulk delete)
- Filtros combinados (categoria, data, valor)
- Exportação para CSV

#### Regras
- Simula um sistema real de gestão de despesas
- Testa cenários de e-commerce do mundo real
- O CRUD é simulado no frontend (sem persistência backend)

---

### Módulo 8 — Blog

**Objetivo**: Complementar o aprendizado prático com conteúdo teórico.

#### Artigos disponíveis (6)
- Técnicas de QA
- Tipos de teste
- Boas práticas de qualidade de software

---

## Rotas do Frontend

| Rota | Módulo |
|------|--------|
| `/` | Dashboard principal com cards dos módulos |
| `/elementos` | Elementos dinâmicos para automação |
| `/blog` | Artigos educacionais |
| `/datas` | Datas com bugs |
| `/despesas` | Gerenciamento de despesas (CRUD) |
| `/form-bugado` | Formulário com 5 bugs |
| `/cenarios` | Lista de cenários de teste |
| `/cenarios/[id]` | Detalhe de um cenário |
| `/alvos` | Módulo futuro |
| `/desafios` | Módulo futuro |
| `/missoes` | Módulo futuro |
| `/pdca` | Módulo futuro |
| `/proximos-passos` | Módulo futuro |

---

## Filosofia de Design

| Princípio | Descrição |
|-----------|-----------|
| **Educacional** | Cada módulo ensina uma habilidade específica de QA |
| **Prático** | Aprende-se fazendo, não apenas lendo |
| **Progressivo** | Cenários aumentam gradualmente em dificuldade |
| **Realista** | Bugs e cenários espelham problemas do mundo real |
| **Transparente** | Todos os seletores `data-testid` são documentados para os alunos |
| **Flexível** | Chaos pode ser ativado por endpoint, permitindo comparação entre comportamento correto e bugado |
| **Acessível** | Plataforma inteiramente em português do Brasil |
