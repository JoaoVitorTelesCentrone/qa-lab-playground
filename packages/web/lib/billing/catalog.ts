export type BillingOffer = {
  id: "pro-lifetime";
  plan: "pro";
  title: string;
  price: number;
  displayPrice: string;
  description: string;
  highlights: string[];
};

// Oferta única no lançamento: não prometemos renovação recorrente antes de ela
// existir. O acesso vitalício também simplifica a primeira integração com o
// Checkout Pro, que cria uma preferência por compra.
export const billingOffers: BillingOffer[] = [
  {
    id: "pro-lifetime",
    plan: "pro",
    title: "QA Lab Pro — acesso vitalício",
    price: 297,
    displayPrice: "R$ 297",
    description: "Acesso completo aos ambientes e desafios práticos do QA Lab.",
    highlights: [
      "Todos os ambientes de prática e bugs plantados",
      "Trilhas, missões guiadas e desafios integradores",
      "Evidências, portfólio e exportações avançadas",
      "Acesso vitalício ao núcleo Pro já lançado",
    ],
  },
];

export function getBillingOffer(id: string | null | undefined) {
  return billingOffers.find((offer) => offer.id === id);
}

export function hasPaidAccess(plan: string | null | undefined) {
  return plan === "pro" || plan === "team";
}
