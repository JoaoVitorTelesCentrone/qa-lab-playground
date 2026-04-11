"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStoredUser, clearStoredUser, setStoredCart as syncCart,
  type EcommerceUser,
} from "@/lib/ecommerce";
import {
  ShoppingCart,
  Search,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  X,
  Heart,
  AlertCircle,
  LogIn,
  LogOut,
  User,
  Package,
  Tag,
} from "lucide-react";

// ── Componentes locais ────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-xl border border-border shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 pt-0 ${className}`}>{children}</div>
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
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default:     "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:     "border border-border bg-card text-foreground hover:bg-accent",
    ghost:       "text-foreground hover:bg-accent",
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2 text-sm",
    sm:      "h-8 px-3 text-xs",
    lg:      "h-11 px-8 text-sm",
    icon:    "size-8 p-0",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
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
    className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary";
  className?: string;
}) => {
  const variants = {
    default:     "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline:     "border border-border text-foreground",
    secondary:   "bg-secondary text-secondary-foreground",
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

// ── Dados ─────────────────────────────────────────────────────────────────────

const products = [
  { id: 1,  nome: "Smartphone X Pro",        preco: 2999.99, precoOriginal: 3499.99, rating: 4.5, reviews: 128, estoque: 10, imagem: "/api/placeholder/300/300", categoria: "Eletrônicos",   descricao: "Câmera de 108MP e bateria de 5000mAh" },
  { id: 2,  nome: "Notebook Ultra Gamer",    preco: 5899.99, precoOriginal: 6499.99, rating: 4.8, reviews: 89,  estoque: 5,  imagem: "/api/placeholder/300/300", categoria: "Eletrônicos",   descricao: "RTX 3060, 16GB RAM e SSD 512GB" },
  { id: 3,  nome: "Fone Bluetooth Pro",      preco: 399.99,  precoOriginal: 499.99,  rating: 4.3, reviews: 256, estoque: 0,  imagem: "/api/placeholder/300/300", categoria: "Áudio",         descricao: "Cancelamento de ruído ativo e 30h de bateria" },
  { id: 4,  nome: "Smartwatch Series 5",     preco: 899.99,  precoOriginal: 1199.99, rating: 4.6, reviews: 167, estoque: 15, imagem: "/api/placeholder/300/300", categoria: "Wearables",     descricao: "GPS integrado e monitor cardíaco" },
  { id: 5,  nome: "Câmera DSLR 4K",          preco: 3199.99, precoOriginal: 3899.99, rating: 4.7, reviews: 45,  estoque: 3,  imagem: "/api/placeholder/300/300", categoria: "Fotografia",    descricao: "Sensor full-frame com gravação 4K" },
  { id: 6,  nome: "Teclado Mecânico RGB",    preco: 349.99,  precoOriginal: 429.99,  rating: 4.4, reviews: 312, estoque: 25, imagem: "/api/placeholder/300/300", categoria: "Periféricos",   descricao: "Switches Cherry MX Red com iluminação RGB" },
  { id: 7,  nome: 'Monitor 4K 27"',          preco: 2199.99, precoOriginal: 2699.99, rating: 4.6, reviews: 78,  estoque: 8,  imagem: "/api/placeholder/300/300", categoria: "Monitores",     descricao: "Painel IPS 144Hz com HDR600" },
  { id: 8,  nome: "Mouse Gamer Pro",         preco: 199.99,  precoOriginal: 249.99,  rating: 4.5, reviews: 421, estoque: 30, imagem: "/api/placeholder/300/300", categoria: "Periféricos",   descricao: "Sensor 25600 DPI e 8 botões programáveis" },
  { id: 9,  nome: "SSD NVMe 1TB",            preco: 459.99,  precoOriginal: 599.99,  rating: 4.9, reviews: 189, estoque: 20, imagem: "/api/placeholder/300/300", categoria: "Armazenamento", descricao: "Gen4 com leitura de 7000MB/s" },
  { id: 10, nome: "Webcam Full HD",          preco: 279.99,  precoOriginal: 349.99,  rating: 4.2, reviews: 93,  estoque: 12, imagem: "/api/placeholder/300/300", categoria: "Periféricos",   descricao: "1080p60fps com microfone embutido" },
  { id: 11, nome: 'Tablet Pro 11"',          preco: 3499.99, precoOriginal: 3999.99, rating: 4.7, reviews: 67,  estoque: 6,  imagem: "/api/placeholder/300/300", categoria: "Eletrônicos",   descricao: "Chip M2, tela OLED e suporte a Pencil" },
  { id: 12, nome: "Caixa de Som Bluetooth",  preco: 599.99,  precoOriginal: 749.99,  rating: 4.3, reviews: 204, estoque: 0,  imagem: "/api/placeholder/300/300", categoria: "Áudio",         descricao: "Som 360° e autonomia de 20h" },
];

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
  categoria: string;
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function EcommerceStorePage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<EcommerceUser | null>(null);
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

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/ecommerce/login?redirect=/ecommerce");
    } else {
      setUser(stored);
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    syncCart(cart);
  }, [cart]);

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
    setCart(prev =>
      prev
        .map(item =>
          item.id === productId
            ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
            : item
        )
        .filter(item => item.quantidade > 0)
    );
  }

  function calcularFrete() {
    if (cep.length < 8) return;
    setFrete(Number((Math.random() * 50 + 10).toFixed(2)));
  }

  function aplicarCupom() {
    if (cupomAplicado) return;
    if (cupom.toUpperCase() === "DESCONTO10") {
      setCupomAplicado(true);
    }
  }

  function avaliarProduto(productId: number, nota: number) {
    setRating(prev => ({ ...prev, [productId]: Math.min(5, Math.max(1, nota)) }));
  }

  const subtotal = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const desconto = cupomAplicado ? subtotal * 0.1 : 0;
  const totalCarrinho = subtotal - desconto;

  const categorias = ["all", ...new Set(products.map(p => p.categoria))];

  const produtosFiltrados = products.filter(p => {
    const matchSearch =
      !searchTerm ||
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "all" || p.categoria === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalItens = cart.reduce((acc, item) => acc + item.quantidade, 0);

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-muted-foreground animate-pulse">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap animate-slide-in-up">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-primary">KODE</h1>
          <p className="text-xs text-muted-foreground">Eletrônicos de alta qualidade</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {user ? (
            <>
              <Link href="/ecommerce/pedidos">
                <Button variant="outline" size="sm">
                  <Package className="size-4 mr-1.5" />
                  Pedidos
                </Button>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-lg">
                <User className="size-3.5" />
                <span className="max-w-[100px] truncate">{user.nome}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { clearStoredUser(); setUser(null); }}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Link href="/ecommerce/login">
              <Button variant="outline" size="sm">
                <LogIn className="size-4 mr-1.5" />
                Entrar
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const next = new Set(wishlist);
              // toggle all — just show count
            }}
            className="text-muted-foreground"
          >
            <Heart className="size-4 mr-1.5" />
            {wishlist.size}
          </Button>

          <Button
            variant={showCart ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart className="size-4 mr-1.5" />
            Carrinho ({totalItens})
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── Loja ───────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Busca e filtros */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">Todas</option>
                  {categorias.filter(c => c !== "all").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Grid de produtos */}
          {produtosFiltrados.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {produtosFiltrados.map(product => (
                <Card key={product.id} className="overflow-hidden flex flex-col">
                  <div className="relative">
                    <div className="aspect-square bg-secondary relative">
                      <Image
                        src={product.imagem}
                        alt={product.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      className="absolute top-2 right-2 size-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
                      onClick={() => {
                        const next = new Set(wishlist);
                        if (next.has(product.id)) next.delete(product.id);
                        else next.add(product.id);
                        setWishlist(next);
                      }}
                    >
                      <Heart
                        className={`size-3.5 ${
                          wishlist.has(product.id) ? "fill-coral text-coral" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    {product.estoque === 0 && (
                      <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                        Esgotado
                      </span>
                    )}
                    {product.estoque > 0 && product.estoque <= 5 && (
                      <span className="absolute top-2 left-2 bg-coral/20 text-coral text-xs font-semibold px-2 py-0.5 rounded-full border border-coral/30">
                        Últimas unidades
                      </span>
                    )}
                  </div>

                  <CardContent className="flex-1 space-y-2">
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">{product.categoria}</Badge>
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{product.nome}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{product.descricao}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => {
                          const current = rating[product.id] ?? product.rating;
                          return (
                            <button key={star} onClick={() => avaliarProduto(product.id, star)} className="focus:outline-none">
                              <Star className={`size-3.5 ${star <= current ? "fill-neon text-neon" : "text-muted-foreground"}`} />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>

                    {/* Preço */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        R$ {product.preco.toFixed(2)}
                      </span>
                      {product.precoOriginal > product.preco && (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            R$ {product.precoOriginal.toFixed(2)}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-neon/20 text-neon border-0">
                            -{Math.round((1 - product.preco / product.precoOriginal) * 100)}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product)}
                      disabled={product.estoque === 0}
                    >
                      {product.estoque === 0 ? "Indisponível" : "Adicionar ao Carrinho"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Carrinho */}
          {showCart && (
            <Card>
              <div className="p-4 pb-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="size-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Carrinho</span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <CardContent className="space-y-4 pt-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Seu carrinho está vazio
                  </p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.nome}</p>
                            <p className="text-xs text-muted-foreground">R$ {item.preco.toFixed(2)}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <button
                                className="size-6 rounded border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="size-3 text-foreground" />
                              </button>
                              <span className="text-sm text-foreground w-6 text-center">{item.quantidade}</span>
                              <button
                                className="size-6 rounded border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="size-3 text-foreground" />
                              </button>
                              <button
                                className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-foreground">
                              R$ {(item.preco * item.quantidade).toFixed(2)}
                            </p>
                            {item.quantidade > item.estoque && (
                              <p className="text-[10px] text-destructive flex items-center gap-0.5 mt-0.5">
                                <AlertCircle className="size-2.5" />
                                Estoque insuficiente
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Frete */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-foreground">Calcular Frete</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="CEP (8 dígitos)"
                          value={cep}
                          onChange={e => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                          className="text-xs h-8"
                        />
                        <button
                          onClick={calcularFrete}
                          disabled={cep.length < 8}
                          className="h-8 px-3 rounded-lg border border-border text-xs text-foreground hover:bg-accent disabled:opacity-50 transition-colors whitespace-nowrap"
                        >
                          OK
                        </button>
                      </div>
                      {frete !== null && (
                        <p className="text-xs text-neon flex items-center gap-1">
                          <Truck className="size-3" />
                          Frete: R$ {frete.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Cupom */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-foreground flex items-center gap-1">
                        <Tag className="size-3" />
                        Cupom de Desconto
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Código do cupom"
                          value={cupom}
                          onChange={e => setCupom(e.target.value)}
                          disabled={cupomAplicado}
                          className="text-xs h-8"
                        />
                        <button
                          onClick={aplicarCupom}
                          disabled={cupomAplicado}
                          className="h-8 px-3 rounded-lg border border-border text-xs text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {cupomAplicado && (
                        <p className="text-xs text-neon">Cupom aplicado: 10% OFF</p>
                      )}
                    </div>

                    <Separator />

                    {/* Totais */}
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      {cupomAplicado && (
                        <div className="flex justify-between text-neon">
                          <span>Desconto</span>
                          <span>−R$ {desconto.toFixed(2)}</span>
                        </div>
                      )}
                      {frete !== null && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Frete</span>
                          <span>R$ {frete.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-foreground border-t border-border pt-1.5">
                        <span>Total</span>
                        <span>R$ {(totalCarrinho + (frete ?? 0)).toFixed(2)}</span>
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

          {/* Benefícios */}
          <Card>
            <CardContent className="space-y-3 pt-4">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Por que a KODE?</p>
              <div className="space-y-2.5">
                {[
                  { icon: Truck,    label: "Frete Grátis",       desc: "Em compras acima de R$ 299" },
                  { icon: Shield,   label: "Compra Segura",      desc: "Pagamento 100% protegido"    },
                  { icon: RefreshCw, label: "30 dias para trocar", desc: "Sem burocracia"             },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="size-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="size-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
