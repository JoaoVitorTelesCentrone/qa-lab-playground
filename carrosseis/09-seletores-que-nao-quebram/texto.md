# Carrossel 9 — Educacional · Automação

### Slide 1
**Capa** — AUTOMAÇÃO
# SELETORES QUE NÃO QUEBRAM
data-testid x CSS x XPath.

### Slide 2
**O PROBLEMA** — Mudou o CSS, quebrou o teste
Seu E2E dependia de '.btn-primary-2'. O dev renomeou. Vermelho geral.

### Slide 3
**OPÇÃO RUIM** — XPath frágil
/div[3]/span[2]/button quebra ao mínimo refactor de layout. Evite.

### Slide 4
**OPÇÃO OK** — CSS semântico
Classe estável e significativa ajuda, mas ainda muda com redesign.

### Slide 5
**OPÇÃO BOA** — data-testid
Um atributo só pro teste. Independente de estilo, texto e estrutura.

### Slide 6
**A REGRA** — Amarre na intenção
Teste o que o elemento É, não como ele parece. Refactor deixa de assustar.

### Slide 7
**CTA** — TREINE COM SELETORES REAIS
O módulo de Elementos expõe todos os seletores pra prática.
→ Acesse o QA Lab · linkedin.com/company/qa-lab-oficial

---

## Legenda sugerida (LinkedIn)

Seu teste quebrou porque mudaram o CSS. De novo.

data-testid x CSS x XPath: o guia rápido de seletores que sobrevivem a refactor.

Regra de ouro: amarre o teste na intenção, não na aparência.

#Automação #Seletores #dataTestid #TestesE2E #Playwright
