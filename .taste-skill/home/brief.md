# Home redesign notes

## Inventory

- The old home had a generic QA headline, one short sentence, a small Lab 01 exercise and three compressed steps.
- The page already uses Inter, a deep green base, mint action color and copper accent. Keep those brand choices.
- The repository contains real BrotoSpace screenshots for Mente, Desafios and Hábitos. Use these as the subject evidence instead of unrelated stock images.
- Keep the existing guided-practice action and its `data-onboarding="home-cta"` target so the first-run flow remains intact.
- Direct destinations available here are `/labs`, `/trilhas`, `/conteudo` and the BrotoSpace public site.

## Argument

QA Lab teaches people to investigate software by practicing on real BrotoSpace journeys: ask a question, follow the path, compare expected and observed behavior, and record evidence.

## Direction

Use the `editorial-report` direction saved in `direction.json`: a magazine-like story, strong type, real UI screenshots and one copper field to break up the green. The broad hero pairs the claim and action with a BrotoSpace screen. The following sections move through a screenshot mosaic, a live investigation, a method list, route index and final CTA.

The optional photo strip in the source direction was folded into the evidence mosaic. A final screenshot strip would repeat the same interfaces without adding new information. No suitable video exists in this project's product assets; readable BrotoSpace UI screens are more relevant evidence than unrelated footage.

## Copy deck

- Hero: “Aprenda QA no BrotoSpace.”
- Standfirst: “O QA Lab ensina testes de software com práticas guiadas nos espaços Mente, Desafios e Hábitos do BrotoSpace.”
- Primary action: “Começar a praticar” (existing guided onboarding).
- Secondary action: “Abrir o BrotoSpace”.
- Showcase: “Investigue jornadas reais.” Explain that BrotoSpace is the testing context and that the shown examples use demo data.
- Live exercise: “Uma ideia. Duas visitas.” Ask if the thought remains after leaving; let the visitor reveal a practical observation checklist.
- Method: “Investigue com clareza.” Four steps: start with a question, follow the same idea, compare expected behavior, explain the observation.
- Routes: Labs, Trilhas and Conteúdo, each with a direct description and link.
- Closing CTA: “Explore o BrotoSpace.”

## Round 1 critique and revision

The first render showed a three-line hero title and two other overlong section headings. The practice route links read as a row of cards, and small labels acted like eyebrow headings. The screenshots also exposed an overly long demo question on mobile. Revised the hero and section titles, removed the labels, made the exercise question shorter, and turned route cards into an open index. Added viewport-aware section entrance motion and a crossfade that pauses when the tab is hidden and stops for reduced-motion preferences.

## Final verification

- 1440px, 768px and 390px inspected. Hero title is two lines at all three sizes; no horizontal overflow or broken images were reported.
- Design inspector: 0 FAIL, 4 WARN. Remaining warnings are shared footer/navigation details, the inspector's type-size count across the whole site shell, and no video; video is intentionally omitted because real UI screenshots are the evidence this page needs.
- Taste-skill source lint: no banned patterns.
- Targeted ESLint and TypeScript checks passed.
- Existing guided onboarding E2E smoke passed.
