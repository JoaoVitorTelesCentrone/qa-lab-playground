"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStoredUser, clearStoredUser, setStoredCart as syncCart,
  type EcommerceUser,
} from "@/lib/ecommerce";

// Componentes nativos substituindo shadcn/ui
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

const Button = ({ 
  children, 
  onClick, 
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10 p-0",
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ 
  children, 
  variant = "default",
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "destructive" | "outline" | "secondary";
  className?: string;
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background",
    secondary: "bg-secondary text-secondary-foreground",
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-border ${className}`} />
);

// Select nativo
const Select = ({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) => (
  <select
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    value={value}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onValueChange?.(e.target.value)}
  >
    {children}
  </select>
);

const SelectTrigger = Select;
const SelectValue = ({ placeholder }: { placeholder?: string }) => null;
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

// Ícones do Lucide React
import {
  ShoppingCart,
  Search,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Check,
  Circle,
  Bug,
  Minus,
  Plus,
  X,
  Heart,
  AlertCircle,
  LogIn,
  LogOut,
  User,
  Package,
} from "lucide-react";

// Produtos com bugs propositais
const products = [
  {
    id: 1,
    nome: "Smartphone X Pro",
    preco: 2999.99,
    precoOriginal: 3499.99,
    rating: 4.5,
    reviews: 128,
    estoque: 10,
    imagem: "/api/placeholder/300/300",
    categoria: "Eletrônicos",
    descricao: "Smartphone com câmera de 108MP e bateria de 5000mAh",
  },
  {
    id: 2,
    nome: "Notebook Ultra Gamer",
    preco: 5899.99,
    precoOriginal: 6499.99,
    rating: 4.8,
    reviews: 89,
    estoque: 5,
    imagem: "/api/placeholder/300/300",
    categoria: "Eletrônicos",
    descricao: "Notebook com RTX 3060 e 16GB RAM",
  },
  {
    id: 3,
    nome: "Fone Bluetooth Pro",
    preco: 399.99,
    precoOriginal: 499.99,
    rating: 4.3,
    reviews: 256,
    estoque: 0,
    imagem: "/api/placeholder/300/300",
    categoria: "Áudio",
    descricao: "Fone com cancelamento de ruído ativo",
  },
  {
    id: 4,
    nome: "Smartwatch Series 5",
    preco: 899.99,
    precoOriginal: 1199.99,
    rating: 4.6,
    reviews: 167,
    estoque: 15,
    imagem: "/api/placeholder/300/300",
    categoria: "Wearables",
    descricao: "Smartwatch com GPS e monitor cardíaco",
  },
  {
    id: 5,
    nome: "Câmera DSLR 4K",
    preco: 3199.99,
    precoOriginal: 3899.99,
    rating: 4.7,
    reviews: 45,
    estoque: 3,
    imagem: "/api/placeholder/300/300",
    categoria: "Fotografia",
    descricao: "Câmera DSLR com gravação 4K e sensor full-frame",
  },
  {
    id: 6,
    nome: "Teclado Mecânico RGB",
    preco: 349.99,
    precoOriginal: 429.99,
    rating: 4.4,
    reviews: 312,
    estoque: 25,
    imagem: "/api/placeholder/300/300",
    categoria: "Periféricos",
    descricao: "Teclado mecânico com switches Cherry MX Red e iluminação RGB",
  },
  {
    id: 7,
    nome: 'Monitor 4K 27"',
    preco: 2199.99,
    precoOriginal: 2699.99,
    rating: 4.6,
    reviews: 78,
    estoque: 8,
    imagem: "/api/placeholder/300/300",
    categoria: "Monitores",
    descricao: "Monitor 4K IPS com 144Hz e painel HDR600",
  },
  {
    id: 8,
    nome: "Mouse Gamer Pro",
    preco: 199.99,
    precoOriginal: 249.99,
    rating: 4.5,
    reviews: 421,
    estoque: 30,
    imagem: "/api/placeholder/300/300",
    categoria: "Periféricos",
    descricao: "Mouse gamer com sensor de 25600 DPI e 8 botões programáveis",
  },
  {
    id: 9,
    nome: "SSD NVMe 1TB",
    preco: 459.99,
    precoOriginal: 599.99,
    rating: 4.9,
    reviews: 189,
    estoque: 20,
    imagem: "/api/placeholder/300/300",
    categoria: "Armazenamento",
    descricao: "SSD NVMe Gen4 com velocidade de leitura de 7000MB/s",
  },
  {
    id: 10,
    nome: "Webcam Full HD",
    preco: 279.99,
    precoOriginal: 349.99,
    rating: 4.2,
    reviews: 93,
    estoque: 12,
    imagem: "/api/placeholder/300/300",
    categoria: "Periféricos",
    descricao: "Webcam 1080p60fps com microfone embutido e correção de luz",
  },
  {
    id: 11,
    nome: 'Tablet Pro 11"',
    preco: 3499.99,
    precoOriginal: 3999.99,
    rating: 4.7,
    reviews: 67,
    estoque: 6,
    imagem: "/api/placeholder/300/300",
    categoria: "Eletrônicos",
    descricao: "Tablet com chip M2, tela OLED e suporte a Apple Pencil",
  },
  {
    id: 12,
    nome: "Caixa de Som Bluetooth",
    preco: 599.99,
    precoOriginal: 749.99,
    rating: 4.3,
    reviews: 204,
    estoque: 0,
    imagem: "/api/placeholder/300/300",
    categoria: "Áudio",
    descricao: "Caixa de som portátil com 360° de som e autonomia de 20h",
  },
];

// Bugs do e-commerce
const bugs = [
  {
    id: 1,
    titulo: "Carrinho permite adicionar mais itens que o estoque",
    categoria: "Carrinho",
    severidade: "Alta",
  },
  {
    id: 2,
    titulo: "Cálculo de frete aceita CEP com menos de 8 dígitos",
    categoria: "Checkout",
    severidade: "Média",
  },
  {
    id: 3,
    titulo: "Cupom de desconto pode ser reaplicado múltiplas vezes",
    categoria: "Promoção",
    severidade: "Crítica",
  },
  {
    id: 4,
    titulo: "Checkout aceita pedido com quantidade acima do estoque",
    categoria: "Estoque",
    severidade: "Alta",
  },
  {
    id: 5,
    titulo: "Cálculo do total com cupom aplica desconto de forma incorreta",
    categoria: "Carrinho",
    severidade: "Média",
  },
  {
    id: 6,
    titulo: "Busca não retorna resultados para palavras com acento",
    categoria: "Busca",
    severidade: "Baixa",
  },
  {
    id: 7,
    titulo: "Avaliações permitem notas maiores que 5 estrelas via teclado",
    categoria: "Reviews",
    severidade: "Média",
  },
  {
    id: 8,
    titulo: "Login revela se o e-mail existe no sistema (information disclosure)",
    categoria: "Autenticação",
    severidade: "Crítica",
  },
  {
    id: 9,
    titulo: "Sem bloqueio após múltiplas tentativas de login (brute force)",
    categoria: "Autenticação",
    severidade: "Crítica",
  },
  {
    id: 10,
    titulo: '"Lembrar de mim" não tem efeito funcional',
    categoria: "Autenticação",
    severidade: "Baixa",
  },
  {
    id: 11,
    titulo: "Token JWT armazenado sem expiração",
    categoria: "Autenticação",
    severidade: "Alta",
  },
  {
    id: 12,
    titulo: "Links 'Esqueci a senha' e 'Criar conta' levam a página 404",
    categoria: "Autenticação",
    severidade: "Média",
  },
  {
    id: 13,
    titulo: "Schema do detalhe do pedido muda a cada request (camelCase / snake_case / flat)",
    categoria: "Pedidos",
    severidade: "Alta",
  },
];

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
  categoria: string;
}

export default function EcommerceBugadoPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<EcommerceUser | null>(null);
  const [foundBugs, setFoundBugs] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);
  const [rating, setRating] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  // Carrega usuário e redireciona para login se não autenticado
  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/ecommerce/login?redirect=/ecommerce");
    } else {
      setUser(stored);
      setAuthLoading(false);
    }
  }, []);

  // Sincroniza carrinho com localStorage para o checkout ler
  useEffect(() => {
    syncCart(cart);
  }, [cart]);

  function toggleBug(id: number) {
    const next = new Set(foundBugs);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setFoundBugs(next);
  }

  // Funções bugadas do carrinho
  function addToCart(product: typeof products[0]) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      return [...prev, {
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        quantidade: 1,
        estoque: product.estoque,
        categoria: product.categoria,
      }];
    });
  }

  function removeFromCart(productId: number) {
    setCart(prev => prev.filter(item => item.id !== productId));
  }

  function updateQuantity(productId: number, delta: number) {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const novaQuantidade = item.quantidade + delta;
        return { ...item, quantidade: Math.max(0, novaQuantidade) };
      }
      return item;
    }).filter(item => item.quantidade > 0));
  }

  function calcularFrete() {
    if (cep.length < 8) {
      setFrete(null);
      return;
    }
    
    const valorFrete = Math.random() * 50 + 10;
    setFrete(Number(valorFrete.toFixed(2)));
  }

  function aplicarCupom() {
    if (cupom.toUpperCase() === "BUGADO10" && !cupomAplicado) {
      setCupomAplicado(true);
    } else if (cupom.toUpperCase() === "BUGADO10" && cupomAplicado) {
      setCupomAplicado(true);
    }
  }

  function filtrarProdutos() {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }
    
    return filtered;
  }

  function avaliarProduto(productId: number, nota: number) {
    setRating(prev => ({ ...prev, [productId]: Math.min(10, Math.max(0, nota)) }));
  }

  const totalCarrinho = cart.reduce((acc, item) => {
    let subtotal = acc + (item.preco * item.quantidade);
    
    if (cupomAplicado) {
      subtotal = subtotal * 0.9;
    }
    
    return subtotal;
  }, 0);

  const categorias = ["all", ...new Set(products.map(p => p.categoria))];
  const produtosFiltrados = filtrarProdutos();

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-gray-400 animate-pulse">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">E-commerce Bugado</h1>
          <p className="text-sm text-gray-500">
            Teste todas as funcionalidades da loja virtual e encontre os {bugs.length} bugs propositais
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/ecommerce/board">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
              Board
            </Button>
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/ecommerce/pedidos">
                <Button variant="outline" size="sm">
                  <Package className="size-4 mr-1.5" />
                  Pedidos
                </Button>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-md">
                <User className="size-3.5" />
                <span className="max-w-[100px] truncate">{user.nome}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { clearStoredUser(); setUser(null); }}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <Link href="/ecommerce/login">
              <Button variant="outline" size="sm">
                <LogIn className="size-4 mr-1.5" />
                Entrar
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setWishlist(new Set())}
          >
            <Heart className="size-4 mr-1.5" />
            ({wishlist.size})
          </Button>

          <Button
            variant={showCart ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart className="size-4 mr-1.5" />
            Carrinho ({cart.reduce((acc, item) => acc + item.quantidade, 0)})
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Loja */}
        <div className="space-y-6">
          {/* Busca e Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectItem value="all">Todas</SelectItem>
                  {categorias.filter(c => c !== "all").map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Produtos */}
          <div className="grid gap-6 sm:grid-cols-2 stagger-scale">
            {produtosFiltrados.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src={product.imagem}
                      alt={product.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const next = new Set(wishlist);
                      if (next.has(product.id)) {
                        next.delete(product.id);
                      } else {
                        next.add(product.id);
                      }
                      setWishlist(next);
                    }}
                  >
                    <Heart 
                      className={`size-4 ${
                        wishlist.has(product.id) ? "fill-red-500 text-red-500" : ""
                      }`} 
                    />
                  </Button>
                  {product.estoque === 0 && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                      Esgotado
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline">{product.categoria}</Badge>
                  </div>
                  
                  <h3 className="font-semibold">{product.nome}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.descricao}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const currentRating = rating[product.id] || product.rating;
                        return (
                          <button
                            key={star}
                            onClick={() => avaliarProduto(product.id, star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`size-4 ${
                                star <= currentRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-bold">
                      R$ {product.preco.toFixed(2)}
                    </span>
                    {product.precoOriginal > product.preco && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          R$ {product.precoOriginal.toFixed(2)}
                        </span>
                        <Badge variant="secondary">
                          -{Math.round((1 - product.preco/product.precoOriginal) * 100)}%
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Truck className="size-4" />
                      <span>Estoque: {product.estoque}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full"
                    onClick={() => addToCart(product)}
                    disabled={product.estoque === 0}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar com Checklist de Bugs e Carrinho */}
        <div className="space-y-6">
          {/* Carrinho */}
          {showCart && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Carrinho</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCart([])}
                  >
                    Limpar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Carrinho vazio
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.nome}</p>
                          <p className="text-xs text-gray-500">
                            R$ {item.preco.toFixed(2)} cada
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-6"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">
                              {item.quantidade}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-6"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="size-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-6 ml-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                          </p>
                          {item.quantidade > item.estoque && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="size-3" />
                              Estoque insuficiente
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <Separator />

                    {/* Cálculo de Frete */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Calcular Frete</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="CEP"
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                          maxLength={8}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={calcularFrete}
                        >
                          OK
                        </Button>
                      </div>
                      {frete !== null && (
                        <p className="text-sm">
                          Frete: R$ {frete.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Cupom de Desconto */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Cupom de Desconto</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="CUPOM10"
                          value={cupom}
                          onChange={(e) => setCupom(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={aplicarCupom}
                        >
                          Aplicar
                        </Button>
                      </div>
                      {cupomAplicado && (
                        <p className="text-xs text-green-600">
                          Cupom aplicado: 10% OFF
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>R$ {totalCarrinho.toFixed(2)}</span>
                      </div>
                      {frete !== null && (
                        <div className="flex justify-between text-sm">
                          <span>Frete</span>
                          <span>R$ {frete.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>
                          R$ {(totalCarrinho + (frete || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        if (user) {
                          router.push("/ecommerce/checkout");
                        } else {
                          router.push("/ecommerce/login?redirect=/ecommerce/checkout");
                        }
                      }}
                    >
                      {user ? "Finalizar Compra" : "Entrar para Comprar"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bug Checklist */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bug className="size-4 text-green-600" />
                <CardTitle className="text-base">Bugs Encontrados</CardTitle>
              </div>
              <CardDescription>
                {foundBugs.size}/{bugs.length} bugs encontrados
              </CardDescription>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all"
                  style={{ width: `${(foundBugs.size / bugs.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {bugs.map((bug) => {
                  const found = foundBugs.has(bug.id);
                  return (
                    <button
                      key={bug.id}
                      onClick={() => toggleBug(bug.id)}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                    >
                      {found ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                      ) : (
                        <Circle className="mt-0.5 size-4 shrink-0 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              found
                                ? "line-through text-gray-400"
                                : "text-gray-900"
                            }
                          >
                            Bug #{bug.id}: {bug.titulo}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {bug.categoria}
                          </Badge>
                          <Badge 
                            variant={
                              bug.severidade === "Crítica" ? "destructive" :
                              bug.severidade === "Alta" ? "default" :
                              "secondary"
                            }
                            className="text-xs"
                          >
                            {bug.severidade}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {foundBugs.size === bugs.length && (
                <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-3 text-center">
                  <p className="text-sm font-medium text-green-600">
                    🎉 Parabéns! Você encontrou todos os {bugs.length} bugs!
                  </p>
                </div>
              )}

              {/* Dicas de Teste */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium mb-2">🧪 Dicas de Teste:</p>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Tente adicionar mais itens que o estoque</li>
                  <li>Use CEPs inválidos como "00000000"</li>
                  <li>Aplique o cupom "BUGADO10" várias vezes</li>
                  <li>Teste buscas com palavras acentuadas</li>
                  <li>Tente dar notas acima de 5 estrelas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}