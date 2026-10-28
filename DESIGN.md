---
name: QA Lab
description: Caderno de campo para aprender e praticar QA.
colors:
  field-bg: "#101715"
  field-surface: "#18221e"
  field-raised: "#213329"
  field-line: "#35483d"
  field-text: "#f2f3eb"
  field-muted: "#becbc0"
  field-green: "#95d4a7"
  field-copper: "#f0b886"
  action-text: "#0d1c13"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
rounded:
  sm: "2px"
  md: "6px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.field-green}"
    textColor: "{colors.action-text}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.field-surface}"
    textColor: "{colors.field-text}"
    rounded: "{rounded.sm}"
---

# Design System: QA Lab

## Overview

**Creative North Star: "Caderno de campo"**

A plataforma tem a atmosfera de um espaço de investigação: escuro, legível e direto. O conteúdo conduz a hierarquia; o verde assinala ações e progresso, e o cobre marca detalhes editoriais. A página Conteúdo é a referência visual para a Home, Mentoria, Perfil e navegação.

Os sistemas simulados de prática e os portfólios públicos personalizados preservam suas identidades próprias. Seus dados e fluxos não devem ser reestilizados só para combinar com a plataforma.

## Colors

`field-bg` é o fundo da plataforma; `field-surface` e `field-raised` distinguem planos sem depender de sombra. `field-line` separa seções e cartões. `field-text` e `field-muted` sustentam a leitura. Reserve `field-green` para links, controles ativos, CTAs e destaques. `field-copper` é um acento secundário discreto.

## Typography

Inter é a fonte principal. Títulos são densos e curtos, com peso alto e entrelinha compacta. Texto de leitura usa entrelinha generosa; rótulos e metadados devem ser menores sem comprometer contraste.

## Layout

Páginas usam largura máxima controlada, respiro amplo entre seções e empilhamento em telas estreitas. A navegação tem uma linha de base contínua; listas e divisórias organizam informações antes de acrescentar cartões.

## Elevation & Depth

O sistema é plano por padrão. Fundo, superfícies e bordas definem profundidade; sombras não são o mecanismo principal de hierarquia.

## Shapes

Use cantos retos ou discretos (2–6px) em controles e painéis. Evite cartões grandes com cantos excessivamente arredondados.

## Components

Botões primários usam verde e texto escuro. Campos usam fundo escuro, borda visível e foco verde. Cartões comuns usam `field-surface` e borda `field-line`; o header usa borda inferior e sublinhado para indicar navegação ativa.

## Do's and Don'ts

- Use contraste, espaçamento e hierarquia tipográfica para guiar a leitura.
- Use o verde para ação ou estado, não como decoração repetida.
- Não substitua os temas escolhidos para portfólios públicos ou o visual dos ambientes de prática.
