export type LabMethod = "GET" | "POST" | "PUT" | "DELETE";

export type LabEndpoint = {
  method: LabMethod;
  path: string;
  title: string;
  description: string;
  bug: string;
  exampleBody?: Record<string, unknown>;
};

export const apiLabEndpoints: LabEndpoint[] = [
  { method: "GET", path: "/api/health", title: "Saúde da API", description: "Informa o estado dos serviços simulados.", bug: "Informa healthy mesmo com um serviço indisponível." },
  { method: "GET", path: "/api/users?page=1&perPage=5", title: "Listar usuários", description: "Lista usuários com paginação.", bug: "Repete o último registro da página anterior." },
  { method: "GET", path: "/api/users/1", title: "Detalhar usuário", description: "Busca um usuário pelo identificador.", bug: "Retorna 200 com body de erro quando o usuário não existe." },
  { method: "POST", path: "/api/users", title: "Criar usuário", description: "Valida e cria um usuário simulado.", bug: "Descarta telefone e cargo sem informar o cliente.", exampleBody: { nome: "Maria QA", email: "maria@qalab.com", telefone: "11999999999", cargo: "QA Engineer" } },
  { method: "PUT", path: "/api/users/1", title: "Atualizar usuário", description: "Retorna a representação atualizada.", bug: "Retorna sucesso, mas a resposta mantém os dados antigos.", exampleBody: { nome: "Maria Atualizada" } },
  { method: "GET", path: "/api/products?page=1&perPage=5", title: "Listar produtos", description: "Lista produtos com paginação.", bug: "Calcula o offset incorretamente e pula registros." },
  { method: "GET", path: "/api/products/1", title: "Detalhar produto", description: "Busca um produto pelo identificador.", bug: "Retorna status 200 para produto inexistente." },
  { method: "DELETE", path: "/api/products/1", title: "Excluir produto", description: "Simula a remoção de um produto.", bug: "Retorna 204 sem remover o recurso." },
  { method: "POST", path: "/api/orders", title: "Criar pedido", description: "Valida usuário, itens e estoque.", bug: "Aceita produto inexistente e introduz atraso controlado.", exampleBody: { usuarioId: 1, produtos: [{ produtoId: 1, quantidade: 2 }] } },
  { method: "GET", path: "/api/orders/1", title: "Detalhar pedido", description: "Retorna um pedido com contrato estável.", bug: "Troca o contrato para snake_case." },
  { method: "POST", path: "/api/auth/login", title: "Autenticação", description: "Simula autenticação sem usar credenciais reais.", bug: "Revela se o e-mail existe por mensagens diferentes.", exampleBody: { email: "ana.costa@qalab.com", senha: "qualquer-senha" } },
];

