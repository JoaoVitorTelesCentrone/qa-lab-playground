import type { User, Product, Order } from "@qa-lab/shared";

// ==============================
// Seed Data
// ==============================

const nomesBase = [
  "Ana Costa", "Bruno Souza", "Carla Mendes", "Diego Ferreira", "Elena Santos",
  "Felipe Lima", "Gabriela Rocha", "Hugo Almeida", "Isabela Nunes", "Joao Oliveira",
  "Karen Ribeiro", "Lucas Martins", "Marina Barbosa", "Nicolas Gomes", "Olivia Pereira",
  "Pedro Araujo", "Raquel Teixeira", "Samuel Dias", "Tatiana Cardoso", "Vinicius Castro",
];

const cargos = [
  "QA Engineer", "Dev Frontend", "Dev Backend", "Tech Lead", "Product Manager",
  "Designer UX", "DevOps", "Scrum Master", "Data Analyst", "QA Lead",
];

const categorias = ["Eletronicos", "Livros", "Roupas", "Casa", "Esportes"];

function gerarUsuarios(): User[] {
  return nomesBase.map((nome, i) => ({
    id: i + 1,
    nome,
    email: `${nome.toLowerCase().replace(/ /g, ".")}@qalab.com`,
    telefone: `(11) 9${String(Math.floor(Math.random() * 9000 + 1000))}-${String(Math.floor(Math.random() * 9000 + 1000))}`,
    cargo: cargos[i % cargos.length],
    ativo: i % 7 !== 0,
    criadoEm: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  }));
}

function gerarProdutos(): Product[] {
  const produtos = [
    "Teclado Mecanico", "Mouse Gamer", "Monitor 27\"", "Webcam HD", "Headset Pro",
    "Hub USB-C", "SSD 1TB", "Cadeira Gamer", "Mousepad XL", "Microfone USB",
    "Notebook Slim", "Tablet 10\"", "Carregador Wireless", "Cabo HDMI 2m", "Caixa de Som",
  ];
  return produtos.map((nome, i) => ({
    id: i + 1,
    nome,
    descricao: `${nome} de alta qualidade para profissionais de tecnologia`,
    preco: Math.floor(Math.random() * 5000 + 50),
    estoque: Math.floor(Math.random() * 100),
    categoria: categorias[i % categorias.length],
    ativo: i % 6 !== 0,
  }));
}

function gerarPedidos(): Order[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    usuarioId: Math.floor(Math.random() * 20) + 1,
    produtos: [
      {
        produtoId: Math.floor(Math.random() * 15) + 1,
        quantidade: Math.floor(Math.random() * 3) + 1,
        precoUnitario: Math.floor(Math.random() * 500 + 50),
      },
    ],
    status: (["pendente", "processando", "enviado", "entregue", "cancelado"] as const)[i % 5],
    total: Math.floor(Math.random() * 3000 + 100),
    criadoEm: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  }));
}

// ==============================
// In-Memory Store
// ==============================

class Store {
  users: User[];
  products: Product[];
  orders: Order[];
  private nextUserId: number;
  private nextProductId: number;
  private nextOrderId: number;

  constructor() {
    this.users = gerarUsuarios();
    this.products = gerarProdutos();
    this.orders = gerarPedidos();
    this.nextUserId = this.users.length + 1;
    this.nextProductId = this.products.length + 1;
    this.nextOrderId = this.orders.length + 1;
  }

  // Users
  getUsers(page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const items = this.users.slice(start, start + perPage);
    return {
      data: items,
      meta: {
        page,
        perPage,
        total: this.users.length,
        totalPages: Math.ceil(this.users.length / perPage),
      },
    };
  }

  getUserById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  createUser(data: Partial<User>): User {
    const user: User = {
      id: this.nextUserId++,
      nome: data.nome ?? "",
      email: data.email ?? "",
      telefone: data.telefone ?? "",
      cargo: data.cargo ?? "",
      ativo: true,
      criadoEm: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: number, data: Partial<User>): User | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, data);
    return user;
  }

  // Products
  getProducts(page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const items = this.products.slice(start, start + perPage);
    return {
      data: items,
      meta: {
        page,
        perPage,
        total: this.products.length,
        totalPages: Math.ceil(this.products.length / perPage),
      },
    };
  }

  getProductById(id: number) {
    return this.products.find((p) => p.id === id);
  }

  deleteProduct(id: number): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Orders
  getOrders(page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const items = this.orders.slice(start, start + perPage);
    return {
      data: items,
      meta: {
        page,
        perPage,
        total: this.orders.length,
        totalPages: Math.ceil(this.orders.length / perPage),
      },
    };
  }

  getOrderById(id: number) {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(data: { usuarioId: number; produtos: { produtoId: number; quantidade: number }[] }): Order {
    const produtos = data.produtos.map((p) => {
      const product = this.products.find((pr) => pr.id === p.produtoId);
      return {
        produtoId: p.produtoId,
        quantidade: p.quantidade,
        precoUnitario: product?.preco ?? 0,
      };
    });
    const total = produtos.reduce((sum, p) => sum + p.precoUnitario * p.quantidade, 0);
    const order: Order = {
      id: this.nextOrderId++,
      usuarioId: data.usuarioId,
      produtos,
      status: "pendente",
      total,
      criadoEm: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  // Reset
  reset() {
    this.users = gerarUsuarios();
    this.products = gerarProdutos();
    this.orders = gerarPedidos();
    this.nextUserId = this.users.length + 1;
    this.nextProductId = this.products.length + 1;
    this.nextOrderId = this.orders.length + 1;
  }
}

export const store = new Store();
