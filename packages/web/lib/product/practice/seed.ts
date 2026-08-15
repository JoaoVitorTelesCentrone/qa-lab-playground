// Massa de teste inicial dos ambientes de prática.
//
// Regra de produto: os dados podem ser restaurados para garantir
// repetibilidade. Este é o estado conhecido a que "Restaurar massa de teste"
// sempre volta, então ele precisa ser fixo — nada de datas relativas a hoje ou
// valores aleatórios, senão dois alunos veem cenários diferentes.

import type { PracticeAppId } from "../apps";

export const seedRows: Record<string, Array<Record<string, unknown>>> = {
  "financas.accounts": [
    { name: "Conta corrente", kind: "corrente", balance: 4820.5 },
    { name: "Poupança", kind: "poupanca", balance: 12300 },
    { name: "Carteira", kind: "carteira", balance: 180 },
  ],
  "financas.transactions": [
    { description: "Salário", amount: 6800, kind: "receita", category: "Trabalho", date: "2026-08-05", recurring: true },
    { description: "Aluguel", amount: 1850, kind: "despesa", category: "Moradia", date: "2026-08-08", recurring: true },
    { description: "Mercado", amount: 430.9, kind: "despesa", category: "Alimentação", date: "2026-08-10", recurring: false },
    { description: "Internet", amount: 129.9, kind: "despesa", category: "Moradia", date: "2026-08-12", recurring: true },
    { description: "Freelance", amount: 1200, kind: "receita", category: "Trabalho", date: "2026-08-14", recurring: false },
    { description: "Farmácia", amount: 87.4, kind: "despesa", category: "Saúde", date: "2026-08-15", recurring: false },
  ],
  "financas.budgets": [
    { category: "Moradia", limit_amount: 2200 },
    { category: "Alimentação", limit_amount: 900 },
    { category: "Saúde", limit_amount: 300 },
  ],
  "financas.goals": [
    { name: "Reserva de emergência", target_amount: 20000, saved_amount: 12300 },
    { name: "Viagem", target_amount: 8000, saved_amount: 1450 },
  ],
  "agendamentos.services": [
    { name: "Consulta inicial", duration_minutes: 60, price: 250 },
    { name: "Retorno", duration_minutes: 30, price: 120 },
    { name: "Reunião de planejamento", duration_minutes: 90, price: 400 },
  ],
  // Segunda a sexta, comercial; sábado só de manhã.
  "agendamentos.availability": [
    { weekday: 1, start_time: "09:00", end_time: "18:00" },
    { weekday: 2, start_time: "09:00", end_time: "18:00" },
    { weekday: 3, start_time: "09:00", end_time: "18:00" },
    { weekday: 4, start_time: "09:00", end_time: "18:00" },
    { weekday: 5, start_time: "09:00", end_time: "18:00" },
    { weekday: 6, start_time: "09:00", end_time: "13:00" },
  ],
  "agendamentos.bookings": [
    { customer: "Ana Costa", service: "Consulta inicial", date: "2026-08-18", time: "10:00", status: "confirmado" },
    { customer: "Bruno Dias", service: "Retorno", date: "2026-08-18", time: "14:00", status: "confirmado" },
    { customer: "Carla Nunes", service: "Consulta inicial", date: "2026-08-19", time: "09:00", status: "cancelado" },
  ],
  "crm.companies": [
    { name: "Norte Digital", segment: "Tecnologia", size: "media" },
    { name: "Orbit SaaS", segment: "Software", size: "grande" },
    { name: "Casa Verde", segment: "Varejo", size: "pequena" },
  ],
  // "Antônio" existe de propósito: é o contato que expõe o bug de busca sem
  // normalização de acento quando a flag correspondente está ligada.
  "crm.contacts": [
    { name: "Marina Costa", email: "marina@nortedigital.com", company: "Norte Digital", role: "Head de Produto" },
    { name: "Antônio Ribeiro", email: "antonio@orbitsaas.com", company: "Orbit SaaS", role: "Diretor de TI" },
    { name: "Pedro Lima", email: "pedro@casaverde.com", company: "Casa Verde", role: "Sócio" },
  ],
  "crm.deals": [
    { title: "Implantação do módulo fiscal", company: "Norte Digital", amount: 48000, stage: "proposta" },
    { title: "Renovação anual", company: "Orbit SaaS", amount: 96000, stage: "qualificado" },
    { title: "Piloto de automação", company: "Casa Verde", amount: 18000, stage: "novo" },
    { title: "Expansão de licenças", company: "Orbit SaaS", amount: 32000, stage: "ganho" },
    { title: "Consultoria pontual", company: "Casa Verde", amount: 12000, stage: "perdido" },
  ],
  "crm.activities": [
    { deal: "Implantação do módulo fiscal", kind: "reuniao", summary: "Apresentação da proposta para o time de produto." },
    { deal: "Renovação anual", kind: "email", summary: "Envio da minuta de renovação." },
  ],
};

export const seedAppIds: PracticeAppId[] = ["financas", "agendamentos", "crm"];
