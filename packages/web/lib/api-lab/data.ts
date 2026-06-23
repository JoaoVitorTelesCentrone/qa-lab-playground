import type { Order, Product, User } from "@qa-lab/shared";

const names = ["Ana Costa", "Bruno Souza", "Carla Mendes", "Diego Ferreira", "Elena Santos", "Felipe Lima", "Gabriela Rocha", "Hugo Almeida", "Isabela Nunes", "Joao Oliveira", "Karen Ribeiro", "Lucas Martins", "Marina Barbosa", "Nicolas Gomes", "Olivia Pereira", "Pedro Araujo", "Raquel Teixeira", "Samuel Dias", "Tatiana Cardoso", "Vinicius Castro"];
const roles = ["QA Engineer", "Dev Frontend", "Dev Backend", "Tech Lead", "Product Manager", "Designer UX", "DevOps", "Scrum Master", "Data Analyst", "QA Lead"];
const productNames = ["Teclado Mecânico", "Mouse Gamer", "Monitor 27 polegadas", "Webcam HD", "Headset Pro", "Hub USB-C", "SSD 1TB", "Cadeira Ergonômica", "Mousepad XL", "Microfone USB", "Notebook Slim", "Tablet 10 polegadas", "Carregador Wireless", "Cabo HDMI 2m", "Caixa de Som"];
const categories = ["Eletrônicos", "Livros", "Roupas", "Casa", "Esportes"];

export const users: User[] = names.map((nome, index) => ({ id: index + 1, nome, email: `${nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", ".")}@qalab.com`, telefone: `(11) 9${String(1000 + index).padStart(4, "0")}-${String(8000 + index).padStart(4, "0")}`, cargo: roles[index % roles.length], ativo: index % 7 !== 0, criadoEm: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString() }));

export const products: Product[] = productNames.map((nome, index) => ({ id: index + 1, nome, descricao: `${nome} para prática de testes de API`, preco: 79.9 + index * 113.5, estoque: (index * 7) % 31, categoria: categories[index % categories.length], ativo: index % 6 !== 0 }));

export const orders: Order[] = Array.from({ length: 10 }, (_, index) => { const product = products[index % products.length]; return { id: index + 1, usuarioId: (index % users.length) + 1, produtos: [{ produtoId: product.id, quantidade: (index % 3) + 1, precoUnitario: product.preco }], status: (["pendente", "processando", "enviado", "entregue", "cancelado"] as const)[index % 5], total: product.preco * ((index % 3) + 1), criadoEm: new Date(Date.UTC(2025, index % 12, index + 1)).toISOString() }; });

