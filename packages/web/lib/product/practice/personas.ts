// Perfis de teste dos ambientes de prática.
//
// O aluno troca de perfil para exercitar cenários de permissão (o cenário 26
// de todo pack de regressão: "tentar ação restrita com perfil sem permissão").
// A permissão é conferida no servidor — esconder o botão não é controle de
// acesso, e um dos exercícios é justamente descobrir isso.

export type PracticeAction = "read" | "create" | "update" | "delete";

export const allActions: PracticeAction[] = ["read", "create", "update", "delete"];

export type Persona = {
  id: string;
  name: string;
  description: string;
  /** Ações por recurso. A chave `*` vale para todo recurso sem regra própria. */
  grants: Record<string, PracticeAction[]>;
};

// Recursos que representam a operação do dia a dia. O operador mexe neles;
// nos demais (cadastros, catálogos, orçamento) ele só lê.
const operational = ["financas.transactions", "agendamentos.bookings", "crm.deals", "crm.contacts", "crm.activities"];

export const personas: Persona[] = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acesso total, inclusive exclusão. Use para preparar massa de teste.",
    grants: { "*": allActions },
  },
  {
    id: "gerente",
    name: "Gerente",
    description: "Cria e edita tudo, mas não exclui. Bom para testar operações irreversíveis.",
    grants: { "*": ["read", "create", "update"] },
  },
  {
    id: "operador",
    name: "Operador",
    description: "Só opera o dia a dia: lançamentos, agendamentos, oportunidades, contatos e atividades.",
    grants: { "*": ["read"], ...Object.fromEntries(operational.map((resource) => [resource, ["read", "create", "update"] as PracticeAction[]])) },
  },
  {
    id: "leitor",
    name: "Somente leitura",
    description: "Consulta sem alterar nada. Use para verificar se a interface bloqueia o que deveria.",
    grants: { "*": ["read"] },
  },
];

export const defaultPersonaId = "admin";

export function findPersona(id: string | null | undefined): Persona {
  return personas.find((persona) => persona.id === id) ?? personas.find((persona) => persona.id === defaultPersonaId)!;
}

export function can(persona: Persona, resourceId: string, action: PracticeAction) {
  return (persona.grants[resourceId] ?? persona.grants["*"] ?? []).includes(action);
}
