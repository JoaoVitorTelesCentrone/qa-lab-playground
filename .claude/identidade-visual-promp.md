# QA Lab Playground — Design System Guide

## 🎯 Visão Geral do Projeto

O QA Lab Playground é uma plataforma educacional hands-on para profissionais de QA praticarem testes em cenários reais. O design deve transmitir: profissionalismo, clareza, confiança e acessibilidade — sem parecer "genérico de tech".

---

## 🎨 Direção Estética

### Conceito: "Clean Lab"
Inspiração em laboratórios modernos e ambientes de trabalho focados: limpo, funcional, com toques de cor que guiam a atenção. O verde claro representa "validação/sucesso" (conceito familiar para QAs), enquanto os tons de cinza criam uma base neutra e profissional.

### Palavras-chave do Design
- **Funcional** — cada elemento tem propósito
- **Respirado** — espaçamento generoso
- **Confiável** — sem ruído visual
- **Focado** — hierarquia clara

---

## 🌈 Paleta de Cores

### Cores Primárias

```css
:root {
  /* Cinzas (Base) */
  --gray-50: #FAFAFA;      /* Background principal */
  --gray-100: #F4F4F5;     /* Cards, containers */
  --gray-200: #E4E4E7;     /* Bordas suaves */
  --gray-300: #D4D4D8;     /* Bordas ativas */
  --gray-400: #A1A1AA;     /* Texto secundário */
  --gray-500: #71717A;     /* Texto muted */
  --gray-600: #52525B;     /* Texto regular */
  --gray-700: #3F3F46;     /* Texto forte */
  --gray-800: #27272A;     /* Headings */
  --gray-900: #18181B;     /* Texto principal */
  
  /* Verdes (Accent) */
  --green-50: #F0FDF4;     /* Background sutil de sucesso */
  --green-100: #DCFCE7;    /* Badges, tags */
  --green-200: #BBF7D0;    /* Hover states */
  --green-300: #86EFAC;    /* Borders accent */
  --green-400: #4ADE80;    /* Primary accent */
  --green-500: #22C55E;    /* Botões primários */
  --green-600: #16A34A;    /* Hover de botões */
  --green-700: #15803D;    /* Active states */
  
  /* Semânticas */
  --success: #22C55E;
  --error: #EF4444;
  --warning: #F59E0B;
  --info: #3B82F6;
}
```

### Regras de Uso

1. **Background principal**: `--gray-50` ou branco puro
2. **Cards e containers**: `--gray-100` com borda `--gray-200`
3. **Texto principal**: `--gray-900`
4. **Texto secundário**: `--gray-500` ou `--gray-600`
5. **Accent/CTAs**: `--green-500` (principal), `--green-400` (destaque sutil)
6. **Estados de sucesso**: gradiente de `--green-50` a `--green-100`

---

## 🔤 Tipografia

### Font Stack

```css
:root {
  /* Display/Headings */
  --font-display: 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;
  
  /* Body/Interface */
  --font-body: 'Inter', 'Source Sans 3', system-ui, sans-serif;
  
  /* Code/Technical */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Escala Tipográfica

```css
/* Headings */
.h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.025em; }
.h2 { font-size: 2rem; font-weight: 600; line-height: 1.25; letter-spacing: -0.02em; }
.h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
.h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
.h5 { font-size: 1.125rem; font-weight: 500; line-height: 1.4; }

/* Body */
.body-lg { font-size: 1.125rem; line-height: 1.6; }
.body { font-size: 1rem; line-height: 1.6; }
.body-sm { font-size: 0.875rem; line-height: 1.5; }
.caption { font-size: 0.75rem; line-height: 1.4; letter-spacing: 0.01em; }

/* Code */
.code { font-family: var(--font-mono); font-size: 0.875rem; }
```

---

## 📐 Espaçamento e Grid

### Sistema de Espaçamento (8pt Grid)

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

### Layout Grid

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## 🧩 Componentes Base

### Cards

```css
.card {
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: var(--space-6);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--gray-300);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-elevated {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

### Botões

```css
.btn {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  padding: var(--space-3) var(--space-5);
  border-radius: 8px;
  transition: all 0.15s ease;
  cursor: pointer;
}

.btn-primary {
  background: var(--green-500);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--green-600);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}

.btn-ghost {
  background: transparent;
  color: var(--gray-600);
  border: none;
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}
```

### Inputs

```css
.input {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  padding: var(--space-3) var(--space-4);
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  transition: all 0.15s ease;
}

.input:focus {
  outline: none;
  border-color: var(--green-400);
  box-shadow: 0 0 0 3px var(--green-100);
}

.input::placeholder {
  color: var(--gray-400);
}
```

### Badges/Tags

```css
.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.badge-success {
  background: var(--green-100);
  color: var(--green-700);
}

.badge-neutral {
  background: var(--gray-200);
  color: var(--gray-700);
}

.badge-warning {
  background: #FEF3C7;
  color: #B45309;
}
```

---

## 📱 Estrutura das Páginas

### 1. Landing Page (/)

```
┌─────────────────────────────────────────────────────┐
│  [Logo]                    [Login] [Começar Grátis] │  ← Header fixo
├─────────────────────────────────────────────────────┤
│                                                      │
│        Pratique QA em cenários reais.               │  ← Hero Section
│        Sem teoria vazia, sem ambiente fake.         │     Headline + CTA
│                                                      │
│            [ Começar Agora → ]                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ 🎯      │  │ 🐛      │  │ 📈      │             │  ← Features
│  │Cenários │  │ Bugs    │  │Progresso│             │     3 cards
│  │ reais   │  │plantados│  │ gamif.  │             │
│  └─────────┘  └─────────┘  └─────────┘             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Preview do Board de Cenários                       │  ← Demo visual
│  [Screenshot/Mockup interativo]                     │
│                                                      │
├─────────────────────────────────────────────────────┤
│  "Para quem é o QA Lab Playground?"                 │
│                                                      │  ← Público-alvo
│  • QA iniciante...                                  │     Lista simples
│  • QA em transição...                               │
│  • Dev que quer entender QA...                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│            [ Criar conta grátis ]                   │  ← CTA final
│                                                      │
│  Footer com links úteis                             │
└─────────────────────────────────────────────────────┘
```

### 2. Auth Pages (/login, /register)

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│   ┌───────────────────────────────────────────┐    │
│   │                                            │    │
│   │      [Logo]                               │    │
│   │                                            │    │
│   │      Entre no QA Lab Playground           │    │
│   │                                            │    │
│   │      ┌────────────────────────┐           │    │  ← Card centralizado
│   │      │ Email                   │           │    │     máx 400px
│   │      └────────────────────────┘           │    │
│   │      ┌────────────────────────┐           │    │
│   │      │ Senha                   │           │    │
│   │      └────────────────────────┘           │    │
│   │                                            │    │
│   │      [ Entrar ]                           │    │
│   │                                            │    │
│   │      ─────── ou ───────                   │    │
│   │                                            │    │
│   │      [ Continuar com Google ]             │    │
│   │                                            │    │
│   │      Não tem conta? Cadastre-se           │    │
│   │                                            │    │
│   └───────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 3. Dashboard/Home (/app)

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Board  Guias  Blog       [Avatar] [Sair]   │  ← Header interno
├────────┬────────────────────────────────────────────┤
│        │                                             │
│ 📊     │  Olá, [Nome]! 👋                           │
│ Home   │                                             │
│        │  ┌──────────────┐ ┌──────────────┐         │
│ 🎯     │  │ Cenários     │ │ Bugs         │         │  ← Stats cards
│ Board  │  │ concluídos   │ │ encontrados  │         │
│        │  │    12/48     │ │      8       │         │
│ 📚     │  └──────────────┘ └──────────────┘         │
│ Guias  │                                             │
│        │  Continue de onde parou                    │
│ 📝     │  ┌─────────────────────────────────┐       │
│ Blog   │  │ [Card do último cenário]        │       │
│        │  │ Validação de Carrinho - 60%     │       │  ← Progresso
│ ⚙️     │  │ [ Continuar → ]                 │       │
│ Config │  └─────────────────────────────────┘       │
│        │                                             │
│        │  Recomendados para você                    │
│        │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│        │  │Cenário 1│ │Cenário 2│ │Cenário 3│      │
│        │  └─────────┘ └─────────┘ └─────────┘      │
│        │                                             │
└────────┴────────────────────────────────────────────┘
```

### 4. Board de Cenários (/app/board)

```
┌─────────────────────────────────────────────────────┐
│  [← Voltar]  Board de Cenários     [Filtros ▼]     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🔍 Buscar cenários...                         │  │  ← Search
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Filtros: [Todos ▼] [Iniciante ▼] [Em progresso ▼] │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────┐    │
│  │ 🛒                  │  │ 🔐                  │    │
│  │ Validação de       │  │ Autenticação       │    │
│  │ Carrinho           │  │ e Login            │    │
│  │                     │  │                     │    │  ← Grid de cards
│  │ ██████░░░░ 60%     │  │ ░░░░░░░░░░ 0%      │    │
│  │                     │  │                     │    │
│  │ [Iniciante] 🐛 3   │  │ [Intermediário]    │    │
│  └────────────────────┘  └────────────────────┘    │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────┐    │
│  │ 💳                  │  │ 📦                  │    │
│  │ Checkout e         │  │ Catálogo de        │    │
│  │ Pagamento          │  │ Produtos           │    │
│  │                     │  │                     │    │
│  │ ░░░░░░░░░░ 0%      │  │ ██████████ 100% ✓  │    │
│  │                     │  │                     │    │
│  │ [Avançado]         │  │ [Iniciante] 🐛 5   │    │
│  └────────────────────┘  └────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 5. Detalhe do Cenário (/app/board/[id])

```
┌─────────────────────────────────────────────────────┐
│  [← Board]  Validação de Carrinho   [Marcar feito] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────┐ ┌────────────────────────┐│
│  │                      │ │                        ││
│  │   Descrição         │ │   TechStore            ││
│  │                      │ │   (App de teste)       ││
│  │   Valide o fluxo    │ │                        ││
│  │   de adição ao      │ │   ┌────────────────┐  ││  ← Split view
│  │   carrinho...       │ │   │                │  ││
│  │                      │ │   │   [Preview]   │  ││
│  │   ─────────────     │ │   │   da loja     │  ││
│  │                      │ │   │   fake        │  ││
│  │   Casos de teste:   │ │   │                │  ││
│  │                      │ │   └────────────────┘  ││
│  │   ☐ CT-001: Add     │ │                        ││
│  │   ☐ CT-002: Remove  │ │   [ Abrir TechStore ]  ││
│  │   ☐ CT-003: Qty     │ │                        ││
│  │   ☑ CT-004: Empty   │ │                        ││
│  │                      │ │                        ││
│  │   ─────────────     │ │                        ││
│  │                      │ │                        ││
│  │   Bugs plantados:   │ │                        ││
│  │   🐛 3 bugs neste   │ │                        ││
│  │      cenário        │ │                        ││
│  │                      │ │                        ││
│  └─────────────────────┘ └────────────────────────┘│
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 6. Perfil/Progresso (/app/profile)

```
┌─────────────────────────────────────────────────────┐
│  [← Home]  Meu Progresso                            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌───────────────────────────────────────────────┐ │
│  │  [Avatar]  Nome do Usuário                     │ │
│  │            QA em formação                      │ │  ← Header do perfil
│  │            Membro desde Jan 2026               │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ 12/48       │ │ 8           │ │ 156         │  │  ← Métricas
│  │ Cenários    │ │ Bugs        │ │ Pontos      │  │
│  │ completos   │ │ encontrados │ │ totais      │  │
│  └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                      │
│  Conquistas                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│  │ 🎯  │ │ 🐛  │ │ 🔥  │ │ 🏆  │ │ 🔒  │        │  ← Badges
│  │First│ │Bug  │ │Week │ │All  │ │???  │        │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │
│                                                      │
│  Histórico de atividades                            │
│  • Completou "Validação de Carrinho" — 2h atrás    │
│  • Encontrou bug no Checkout — ontem               │
│  • Iniciou "Autenticação" — 3 dias atrás          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Micro-interações e Animações

### Princípios

1. **Sutis, não distrativas** — feedback visual sem chamar atenção demais
2. **Rápidas** — máximo 300ms para interações básicas
3. **Propósito** — cada animação comunica algo

### Implementação

```css
/* Transições base */
.transition-fast { transition: all 0.15s ease; }
.transition-normal { transition: all 0.2s ease; }
.transition-slow { transition: all 0.3s ease; }

/* Hover lift */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Success pulse */
@keyframes success-pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.animate-success {
  animation: success-pulse 0.6s ease-out;
}

/* Fade in up (para cards) */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}

/* Stagger para listas */
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 50ms; }
.stagger > *:nth-child(3) { animation-delay: 100ms; }
.stagger > *:nth-child(4) { animation-delay: 150ms; }
```

---

## 🎭 Iconografia

### Estilo
- Linha fina (1.5-2px stroke)
- Cantos arredondados
- Consistência com Lucide Icons ou Phosphor Icons

### Ícones Principais
```
🎯 Target → Cenários
🐛 Bug → Bugs encontrados
📊 Chart → Métricas/Stats
📚 Book → Guias
📝 Note → Blog
⚙️ Settings → Configurações
✓ Check → Completo
→ Arrow → Navegação
🔍 Search → Busca
🔐 Lock → Auth/Segurança
🛒 Cart → E-commerce
💳 Card → Pagamento
📦 Package → Produtos
```

---

## 🖼️ Ilustrações e Elementos Visuais

### Estilo
- **Abstrato geométrico** — formas simples, não literais
- **Paleta limitada** — usar apenas cores do sistema
- **Sutil** — complementa, não compete com conteúdo

### Elementos decorativos

```css
/* Gradiente sutil de background */
.bg-gradient-subtle {
  background: linear-gradient(
    135deg,
    var(--gray-50) 0%,
    var(--green-50) 50%,
    var(--gray-50) 100%
  );
}

/* Grid pattern */
.bg-grid {
  background-image: 
    linear-gradient(var(--gray-200) 1px, transparent 1px),
    linear-gradient(90deg, var(--gray-200) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Blob decorativo */
.blob {
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  background: var(--green-100);
  opacity: 0.5;
  filter: blur(40px);
}
```

---

## 📋 Checklist de Implementação

### Fase 1 — Fundação
- [ ] Configurar CSS variables globais
- [ ] Importar fontes (Plus Jakarta Sans, Inter, JetBrains Mono)
- [ ] Criar componentes base (Button, Input, Card, Badge)
- [ ] Implementar layout base (Header, Sidebar, Container)

### Fase 2 — Páginas Públicas
- [ ] Landing Page com hero, features, CTA
- [ ] Páginas de Auth (Login, Register)

### Fase 3 — Área Logada
- [ ] Dashboard/Home
- [ ] Board de Cenários (listagem)
- [ ] Detalhe do Cenário
- [ ] Página de Perfil

### Fase 4 — Polish
- [ ] Animações e micro-interações
- [ ] Estados vazios e de loading
- [ ] Responsividade mobile
- [ ] Acessibilidade (a11y)

---

## 🚀 Prompt para Frontend Skill

Use este prompt ao gerar as telas com a skill de frontend:

---

**PROMPT:**

```
Crie a interface do QA Lab Playground, uma plataforma educacional para QAs praticarem testes em cenários reais.

## Direção Estética
Conceito "Clean Lab": design limpo, funcional e profissional. Inspiração em laboratórios modernos — organizado, espaçoso, com toques de cor que guiam a atenção.

## Paleta
- Base: tons de cinza (gray-50 #FAFAFA para backgrounds, gray-900 #18181B para texto)
- Accent: verde claro (#22C55E para CTAs, #4ADE80 para destaques, #F0FDF4 para backgrounds de sucesso)
- Semântico: mantenha verde para sucesso, vermelho para erro

## Tipografia
- Display/Headings: Plus Jakarta Sans (bold, tracking tight)
- Body: Inter (regular, espaçamento confortável)
- Code: JetBrains Mono

## Componentes-chave
- Cards com background gray-100, borda gray-200, border-radius 12px
- Botões primários em verde (#22C55E), secundários em ghost/outline
- Inputs com borda gray-300, focus ring em verde claro
- Badges/tags com backgrounds suaves

## Layout
- Grid de 8pt
- Espaçamento generoso (mínimo 24px entre seções)
- Max-width 1280px para container principal
- Sidebar de navegação na área logada (240px)

## Micro-interações
- Hover lift sutil nos cards (translateY -2px + shadow)
- Transições de 150-200ms
- Feedback visual em ações (success pulse)

## Páginas a criar
[Especificar qual página, ex:]
- Landing page com hero, 3 features, preview do board, público-alvo, CTA final
- OU: Board de cenários com grid de cards, filtros, barra de busca
- OU: Detalhe do cenário em split view (descrição + preview da app)

## Regras
- SEM purple gradients genéricos
- SEM fontes como Arial, Roboto
- SEM layouts previsíveis de template
- Priorize hierarquia visual clara
- Mantenha consistência com a paleta cinza + verde
```

---

**Variações por página:**

### Para Landing Page:
```
Adicione ao prompt acima:

Página: Landing Page pública

Seções:
1. Header fixo com logo, links (Login, Começar Grátis)
2. Hero section com headline impactante, subheadline, CTA primário
3. Features (3 cards): Cenários reais, Bugs plantados, Progresso gamificado
4. Preview visual do Board (pode ser mockup estilizado)
5. Seção "Para quem é" com 3-4 bullets
6. CTA final com botão de cadastro
7. Footer minimalista

Tom: confiante, direto, sem jargão. Foco em "prática real, não teoria vazia".
```

### Para Board de Cenários:
```
Adicione ao prompt acima:

Página: Board de Cenários (área logada)

Elementos:
1. Header interno com breadcrumb, título, filtros
2. Barra de busca proeminente
3. Chips de filtro (dificuldade, status, categoria)
4. Grid de cards (2-3 colunas)

Cada card deve ter:
- Ícone/emoji representativo
- Título do cenário
- Barra de progresso visual
- Badge de dificuldade
- Contador de bugs (se aplicável)
- Estado visual (não iniciado, em progresso, completo)

Incluir ao menos 4 cards de exemplo com estados diferentes.
```

### Para Página de Auth:
```
Adicione ao prompt acima:

Página: Login/Registro

Layout:
- Card centralizado (max 400px width)
- Background sutil (pode ter gradient ou pattern discreto)

Card contém:
- Logo no topo
- Título contextual ("Entre no QA Lab" ou "Crie sua conta")
- Campos de email e senha
- Botão primário
- Divisor "ou"
- Botão de login social (Google)
- Link para alternar entre login/registro

Mantenha minimalista e focado. Sem distrações.
```

---

*Documento criado para o projeto QALabBrain — Janeiro 2026*