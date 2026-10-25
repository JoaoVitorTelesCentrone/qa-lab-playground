export const ONBOARDING_STORAGE_KEY = "qa-lab:onboarding:floating:v1";
export type TourState = { version: 1; step: number; status: "active" | "dismissed" | "completed" };
export type TourLab = { number: number; label: string; title: string };
export type TourStep = { title: string; text: string; route: string; selector: string; action: string; labStep?: number };

export function onboardingSteps(lab: TourLab | null): TourStep[] {
  const steps: TourStep[] = [
    { title: "Aprenda QA fazendo.", text: "Você escolhe uma missão, testa um sistema e explica o que descobriu. Vamos percorrer esse caminho juntos?", route: "/", selector: '[data-onboarding="home-cta"]', action: "Explorar Labs" },
    { title: "Escolha uma missão.", text: lab ? `Comece pelo Lab ${lab.label}: ${lab.title}. Cada Lab traz contexto, dados de treino e uma entrega clara.` : "O catálogo reúne as práticas disponíveis. Escolha uma missão para conhecer seu objetivo e a entrega esperada.", route: "/labs", selector: lab ? `[data-onboarding="lab-${lab.number}"]` : '[data-onboarding="lab-catalog"]', action: lab ? `Abrir Lab ${lab.label}` : "Concluir" },
  ];
  if (!lab) return steps;
  const route = `/labs/${lab.number}`;
  return [...steps,
    { title: "Entenda o que investigar.", text: "Leia o objetivo, confira os dados de teste e veja o que precisa aparecer na entrega. Essa é a sua missão.", route, selector: '[data-onboarding="lab-step-0"]', labStep: 0, action: "Ver ambiente" },
    { title: "Agora, teste o sistema.", text: "Abra o ambiente em outra aba e compare o esperado com o observado. Você pode explorar com dados de treino, mesmo sem conta.", route, selector: '[data-onboarding="lab-step-2"]', labStep: 2, action: "Ver entrega" },
    { title: "Transforme a descoberta em evidência.", text: "Registre os passos, o resultado e sua conclusão. Entre na sua conta quando quiser salvar. Você pode reabrir este guia em Primeiros passos.", route, selector: '[data-onboarding="lab-step-3"]', labStep: 3, action: "Concluir" },
  ];
}

export function parseTourState(raw: string | null, stepCount: number): TourState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || !Number.isInteger(value.step) || value.step < 0 || value.step >= stepCount || !["active", "dismissed", "completed"].includes(value.status)) return null;
    return { version: 1, step: value.step, status: value.status };
  } catch { return null; }
}

export function supportsOnboarding(pathname: string) {
  return pathname === "/" || ["/labs", "/lab", "/trilhas", "/conteudo", "/perfil", "/blog", "/cursos", "/estudos"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
