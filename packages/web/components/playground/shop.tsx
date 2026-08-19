"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Heart, Minus, PackageCheck, Plus, ShoppingCart, Star, Trash2, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { shopProducts, type ShopProduct } from "@/lib/playground/shop-data";
import { startNavigationProgress } from "@/components/layout/navigation-progress";
import { systemApi } from "@/lib/api-client";
import { toast } from "sonner";
import { normalizeCart, priceCart, priceLines, type CartItem, type Order, type OrderStatus } from "@/lib/product/practice/shop";

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function readLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return normalizeCart(JSON.parse(localStorage.getItem("qa-lab-cart") ?? "[]"));
  } catch {
    return [];
  }
}

/**
 * Carrinho do aluno. Logado, a fonte de verdade é o servidor
 * (/api/v1/shop/cart); deslogado, a compra continua possível com o carrinho
 * vivendo só nesta sessão — login protege a persistência, não o experimentar.
 *
 * `activeBugs` vem junto do carrinho remoto porque o preço é recalculado na
 * tela com a mesma função pura que o servidor usa para cobrar.
 */
function useCart() {
  const [items, setItems] = useState<CartItem[]>(readLocalCart);
  const [remote, setRemote] = useState(false);
  const [activeBugs, setActiveBugs] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/v1/shop/cart")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!alive || !body?.data) return;
        setRemote(true);
        setActiveBugs(body.data.activeBugs ?? []);
        setItems(normalizeCart(body.data.items));
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  function save(next: CartItem[]) {
    const normalized = normalizeCart(next);
    setItems(normalized);
    if (remote) {
      void fetch("/api/v1/shop/cart", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: normalized }) });
      return;
    }
    localStorage.setItem("qa-lab-cart", JSON.stringify(normalized));
  }

  return { items, save, remote, activeBugs };
}

export function ProductsPage() {
  const { items, save } = useCart();
  const [favorites, setFavorites] = useState<number[]>(() => typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem("qa-lab-favorites") ?? "[]"));
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [sort, setSort] = useState("name");
  const [availability, setAvailability] = useState("todos");
  const [priceRange, setPriceRange] = useState("todos");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [comparison, setComparison] = useState<number[]>(() => typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem("qa-lab-comparison") ?? "[]"));
  const filtered = useMemo(() => {
    let result = [...shopProducts];
    if (search) result = result.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase()));
    if (category !== "todas") result = result.filter((product) => product.category === category);
    if (availability === "disponivel") result = result.filter((product) => product.stock > 0);
    if (availability === "indisponivel") result = result.filter((product) => product.stock === 0);
    if (priceRange === "ate-50") result = result.filter((product) => product.price <= 50);
    if (priceRange === "50-100") result = result.filter((product) => product.price > 50 && product.price <= 100);
    if (priceRange === "acima-100") result = result.filter((product) => product.price > 100);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price") result.sort((a, b) => a.price - b.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "date") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return result;
  }, [availability, category, priceRange, search, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visibleProducts = filtered.slice((Math.min(page, pages) - 1) * perPage, Math.min(page, pages) * perPage);

  function add(product: ShopProduct) {
    const current = items.find((item) => item.productId === product.id);
    save(current ? items.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId: product.id, quantity: 1 }]);
    toast.success(`${product.name} no carrinho.`, {
      description: current ? `Quantidade: ${current.quantity + 1}.` : money(product.price),
      action: { label: "Ver carrinho", onClick: () => { window.location.href = "/shop/cart"; } },
    });
  }
  function toggleFavorite(id: number) {
    const next = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    setFavorites(next); localStorage.setItem("qa-lab-favorites", JSON.stringify(next));
  }
  function toggleComparison(id: number) {
    const next = comparison.includes(id) ? comparison.filter((item) => item !== id) : [...comparison.slice(-1), id];
    setComparison(next); localStorage.setItem("qa-lab-comparison", JSON.stringify(next));
  }

  return (
    <ShopShell title="QA Lab" subtitle="Ambiente de prática para quem leva qualidade a sério." action={<Button asChild><Link href="/shop/cart"><ShoppingCart className="size-4" /> Carrinho ({items.reduce((sum, item) => sum + item.quantity, 0)})</Link></Button>}>
      <section className="store-highlight"><div><p className="store-kicker">Seleção do mês</p><h2>Ferramentas para testar melhor.</h2><p>Materiais práticos, cursos e referências para o seu processo.</p></div><Truck className="size-10" /></section>
      <Card>
        <CardContent className="pt-0">
          <div className="grid gap-3 md:grid-cols-[1fr_140px_140px_140px_150px]">
            <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Buscar produto" aria-label="Buscar produto" data-testid="product-search" />
            <Select value={category} onChange={setCategory} label="Categoria" values={["todas", "Livros", "Ferramentas", "Cursos", "Acessorios"]} />
            <Select value={availability} onChange={(value) => { setAvailability(value); setPage(1); }} label="Disponibilidade" values={["todos", "disponivel", "indisponivel"]} />
            <Select value={priceRange} onChange={(value) => { setPriceRange(value); setPage(1); }} label="Faixa de preco" values={["todos", "ate-50", "50-100", "acima-100"]} labels={{ todos: "todos os precos", "ate-50": "ate R$ 50", "50-100": "R$ 50 a R$ 100", "acima-100": "acima de R$ 100" }} />
            <Select value={sort} onChange={setSort} label="Ordenacao" values={["name", "price", "rating", "date"]} labels={{ name: "nome", price: "preco", rating: "avaliacao", date: "mais recentes" }} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Link href={`/shop/products/${product.id}`} className="store-product-image flex h-28 items-center justify-center rounded-md font-mono text-2xl font-semibold" aria-label={`Ver ${product.name}`}>{product.image}</Link>
              <Badge className="mt-2">{product.category}</Badge>
              <div className="flex items-start justify-between gap-3"><CardTitle><Link href={`/shop/products/${product.id}`}>{product.name}</Link></CardTitle><Button size="icon-xs" variant="ghost" aria-label="Favoritar produto" onClick={() => toggleFavorite(product.id)}><Heart className={favorites.includes(product.id) ? "size-3.5 fill-primary text-primary" : "size-3.5"} /></Button></div>
              <CardDescription>{product.description}</CardDescription><p className={product.stock ? "text-xs text-muted-foreground" : "text-xs text-destructive"}>{product.stock ? `${product.stock} em estoque` : "Indisponivel"}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono font-medium text-foreground">{money(product.price)}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Star className="size-3 fill-primary text-primary" /> {product.rating}</span>
              </div>
            </CardContent>
            <CardFooter className="grid gap-2">
              <Button disabled={!product.stock} onClick={() => add(product)} className="w-full" data-testid={`add-product-${product.id}`}>
                <Plus className="size-4" /> Adicionar
              </Button>
              <Button type="button" variant="outline" size="sm" aria-pressed={comparison.includes(product.id)} onClick={() => toggleComparison(product.id)}>{comparison.includes(product.id) ? "Selecionado para comparar" : "Comparar"}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!filtered.length && <Card className="mt-5"><CardContent><p role="status" aria-live="polite" className="text-sm text-muted-foreground">Nenhum produto encontrado. Limpe ou altere os filtros para continuar.</p></CardContent></Card>}
      {comparison.length > 0 && <Card className="mt-5"><CardHeader><CardTitle>Comparacao de produtos</CardTitle><CardDescription>Selecione ate dois itens para comparar.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{comparison.map((id) => { const product = shopProducts.find((item) => item.id === id)!; return <div key={id} className="rounded-md border p-3 text-sm"><strong>{product.name}</strong><p className="mt-1">{money(product.price)} · {product.rating} estrelas · {product.stock} em estoque</p></div>; })}</CardContent></Card>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-label="Paginacao do catalogo"><p className="text-sm text-muted-foreground">{filtered.length} itens encontrados</p><div className="flex items-center gap-2"><Select value={String(perPage)} onChange={(value) => { setPerPage(Number(value)); setPage(1); }} label="Itens por pagina" values={["3", "6", "12"]} /><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button><span className="text-sm" aria-live="polite">Pagina {Math.min(page, pages)} de {pages}</span><Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>Proxima</Button></div></div>
    </ShopShell>
  );
}

export function ProductDetailPage({ product }: { product: ShopProduct }) {
  const { items, save } = useCart();
  const [review, setReview] = useState("");
  const [notice, setNotice] = useState("");
  function add() { const current = items.find((item) => item.productId === product.id); save(current ? items.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId: product.id, quantity: 1 }]); toast.success(`${product.name} no carrinho.`, { description: current ? `Quantidade: ${current.quantity + 1}.` : money(product.price) }); }
  return <ShopShell title={product.name} subtitle={product.category} action={<Button asChild variant="outline"><Link href="/shop/cart"><ShoppingCart className="size-4" /> Carrinho</Link></Button>}><div className="grid gap-8 lg:grid-cols-[1fr_.85fr]"><div className="store-detail-image">{product.image}</div><section className="store-detail"><Badge>{product.category}</Badge><h2 className="mt-5 text-3xl font-semibold">{product.name}</h2><div className="mt-4 flex items-center gap-3"><span className="text-2xl font-semibold">{money(product.price)}</span><span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><Star className="size-4 fill-primary text-primary" /> {product.rating} / 5</span></div><p className="mt-6 leading-7 text-muted-foreground">{product.description} Criado para transformar conceitos de qualidade em decisoes de produto mais claras.</p><div className="mt-7 grid gap-3 text-sm text-muted-foreground"><p className="flex gap-2"><PackageCheck className="size-4 text-primary" /> Envio rastreado para todo o Brasil</p><p className="flex gap-2"><Truck className="size-4 text-primary" /> Frete gratis em pedidos acima de R$ 200</p><p className={product.stock ? "text-primary" : "text-destructive"}>{product.stock ? `${product.stock} unidades disponiveis` : "Produto indisponivel"}</p></div><Button disabled={!product.stock} className="mt-8 w-full" size="lg" onClick={add}><Plus className="size-4" /> Adicionar ao carrinho</Button>{!product.stock && <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => { localStorage.setItem(`qa-lab-restock-${product.id}`, "true"); setNotice("Aviso de reposicao ativado."); }}>Avisar quando chegar</Button>}</section></div><Card className="mt-8"><CardHeader><CardTitle>Avaliacoes</CardTitle><CardDescription>Compartilhe uma avaliacao do produto.</CardDescription></CardHeader><CardContent><form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); if (review.trim().length < 10) return setNotice("Escreva ao menos 10 caracteres na avaliacao."); const reviews = JSON.parse(localStorage.getItem(`qa-lab-reviews-${product.id}`) ?? "[]") as string[]; localStorage.setItem(`qa-lab-reviews-${product.id}`, JSON.stringify([...reviews, review])); setReview(""); setNotice("Avaliacao enviada com sucesso."); }}><Input value={review} onChange={(event) => setReview(event.target.value)} aria-label="Comentario da avaliacao" placeholder="Conte sua experiencia" /><Button>Enviar avaliacao</Button></form>{notice && <p role="status" aria-live="polite" className="mt-3 text-sm text-primary">{notice}</p>}</CardContent></Card></ShopShell>;
}

export function CartPage() {
  const { items, save, activeBugs } = useCart();
  const rows = items.map((item) => ({ ...item, product: shopProducts.find((product) => product.id === item.productId)! })).filter((item) => item.product);
  const [coupon, setCoupon] = useState(""); const [appliedCoupon, setAppliedCoupon] = useState(""); const [couponMessage, setCouponMessage] = useState("");
  const { subtotal, discount, shipping } = priceCart(priceLines(items, shopProducts), { coupon: appliedCoupon }, activeBugs);
  function change(productId: number, delta: number) {
    save(items.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  }

  function removeItem(productId: number) {
    const gone = rows.find((item) => item.productId === productId);
    save(items.filter((cart) => cart.productId !== productId));
    if (gone) toast.success(`${gone.product.name} removido do carrinho.`);
  }
  return (
    <ShopShell title="Carrinho" subtitle="Revise seus itens antes de finalizar." action={<Button asChild><Link href="/shop/checkout">Ir para checkout</Link></Button>}>
      <div className="grid gap-4">
        {rows.map((item) => (
          <Card key={item.productId}>
            <CardContent className="grid gap-3 pt-0 md:grid-cols-[1fr_160px_130px] md:items-center">
              <div>
                <h2 className="font-semibold text-foreground">{item.product.name}</h2>
                <p className="text-sm text-muted-foreground">{money(item.product.price)} por unidade</p>
              </div>
              <div className="flex items-center gap-2">
                <Button aria-label="Diminuir quantidade" onClick={() => change(item.productId, -1)} variant="outline" size="icon-sm"><Minus className="size-4" /></Button>
                <span className="w-8 text-center font-mono" data-testid={`qty-${item.productId}`}>{item.quantity}</span>
                <Button aria-label="Aumentar quantidade" onClick={() => change(item.productId, 1)} variant="outline" size="icon-sm"><Plus className="size-4" /></Button>
                <Button aria-label="Remover item" onClick={() => removeItem(item.productId)} variant="outline" size="icon-sm"><Trash2 className="size-4 text-destructive" /></Button>
              </div>
              <p className="font-mono text-sm font-medium text-primary">{money(item.product.price * item.quantity)}</p>
            </CardContent>
          </Card>
        ))}
        {!rows.length && <Card><CardContent><p className="text-sm text-muted-foreground">Carrinho vazio.</p></CardContent></Card>}
        <section className="store-summary"><label className="text-sm font-medium">Cupom de desconto<div className="mt-2 flex gap-2"><Input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Ex.: QA10" /><Button type="button" variant="outline" onClick={() => { const next = coupon.trim().toUpperCase(); if (next === "QA10") { setAppliedCoupon(next); setCouponMessage("Cupom QA10 aplicado: 10% de desconto."); toast.success("Cupom QA10 aplicado.", { description: "10% de desconto no subtotal." }); } else { setCouponMessage("Cupom invalido."); toast.error("Cupom invalido.", { description: `Nao encontramos o cupom "${next}".` }); } }}>Aplicar</Button>{appliedCoupon && <Button type="button" variant="ghost" onClick={() => { setAppliedCoupon(""); setCouponMessage("Cupom removido."); toast.info("Cupom removido."); }}>Remover</Button>}</div></label><p role="status" aria-live="polite" className="mt-2 text-sm text-primary">{couponMessage}</p><dl className="mt-5 grid gap-2 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div className="flex justify-between"><dt>Desconto</dt><dd className="text-primary">-{money(discount)}</dd></div><div className="flex justify-between"><dt>Frete</dt><dd>{shipping ? money(shipping) : "Grátis"}</dd></div><div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>Total</dt><dd>{money(subtotal - discount + shipping)}</dd></div></dl></section><p className="text-right font-mono text-lg font-semibold text-foreground" data-testid="cart-subtotal">Subtotal: {money(subtotal)}</p>
      </div>
    </ShopShell>
  );
}

export function CheckoutPage() {
  const bug = useSearchParams().get("bug");
  const router = useRouter();
  const instanceId = useId().replace(/\W/g, "").slice(0, 6);
  const { items, save, remote, activeBugs } = useCart();
  const rows = items.map((item) => ({ ...item, product: shopProducts.find((product) => product.id === item.productId)! })).filter((item) => item.product);
  const [coupon, setCoupon] = useState(""); const [zip, setZip] = useState(""); const [delivery, setDelivery] = useState<"padrao" | "expressa">("padrao");
  const zipValid = /^\d{5}-?\d{3}$/.test(zip);
  // O desvio continua acessível pelo atalho ?bug=wrong-total, que os Labs mais
  // antigos citam, além da flag da conta.
  const bugs = bug === "wrong-total" ? [...activeBugs, "qa-lab.wrong-total"] : activeBugs;
  // O frete só entra depois do CEP válido: antes disso não há como calcular.
  const { subtotal, discount, shipping, tax, total } = priceCart(priceLines(items, shopProducts), { coupon, delivery, chargeShipping: zipValid }, bugs);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("firstName") || !data.get("lastName") || !zipValid || !data.get("address") || !data.get("city") || !data.get("state")) {
      setMessage("Preencha nome, sobrenome, CEP valido, endereco, cidade e estado.");
      toast.error("Faltam dados para fechar o pedido.", { description: "Nome, sobrenome, CEP valido, endereco, cidade e estado." });
      return;
    }
    if (rows.length === 0) { setMessage("Carrinho vazio: adicione um produto antes de finalizar."); toast.error("Carrinho vazio."); return; }

    // Logado, quem fecha o pedido e decide o valor cobrado é o servidor.
    if (remote) {
      setSending(true);
      const response = await fetch("/api/v1/shop/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ coupon, delivery }) });
      const body = await response.json().catch(() => null);
      setSending(false);
      if (!response.ok) {
        const erro = body?.error?.message ?? "Nao foi possivel criar o pedido.";
        setMessage(erro);
        toast.error(erro);
        return;
      }
      toast.success(`Pedido ${body.data.reference} confirmado.`, { description: `Total: ${money(body.data.total)}.` });
      save([]);
      startNavigationProgress();
      router.push(`/shop/orders/${body.data.reference}`);
      return;
    }

    // Deslogado, o pedido existe só nesta sessão.
    const reference = `QL-LOCAL-${Date.now().toString().slice(-6)}`;
    toast.success(`Pedido ${reference} confirmado.`, { description: `Total: ${money(total)}. Sem conta, ele vive so nesta sessao.` });
    localStorage.setItem("qa-lab-last-order", JSON.stringify({ id: reference, total, status: "Confirmado", createdAt: new Date().toISOString(), items: items }));
    save([]);
    startNavigationProgress();
    router.push(`/shop/orders/${reference}`);
  }

  return (
    <ShopShell title="Checkout" subtitle="Quase lá. Preencha os dados para concluir seu pedido.">
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Dados do pedido</CardTitle>
            <CardDescription>Campos usados pelos labs de validacao e teclado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-foreground">Nome<Input name="firstName" data-testid="checkout-first-name" /></label>
              <label className="grid gap-2 text-sm font-medium text-foreground">Sobrenome<Input name="lastName" data-testid="checkout-last-name" /></label>
              <label className="grid gap-2 text-sm font-medium text-foreground">CEP<Input name="zip" value={zip} onChange={(event) => setZip(event.target.value)} inputMode="numeric" placeholder="00000-000" data-testid="checkout-zip" /></label>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">E-mail<Input name="email" required type="email" placeholder="voce@email.com" /></label><label className="grid gap-2 text-sm font-medium">Telefone<Input name="phone" inputMode="tel" placeholder="(00) 00000-0000" /></label><label className="grid gap-2 text-sm font-medium sm:col-span-2">Endereço<Input name="address" required placeholder="Rua, número e complemento" /></label><label className="grid gap-2 text-sm font-medium">Cidade<Input name="city" required /></label><label className="grid gap-2 text-sm font-medium">Estado<Input name="state" required maxLength={2} placeholder="SP" /></label></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Entrega<select name="delivery" value={delivery} onChange={(event) => setDelivery(event.target.value === "expressa" ? "expressa" : "padrao")} className="input"><option value="padrao">Entrega padrão · 3 a 5 dias</option><option value="expressa">Expressa · 1 a 2 dias</option></select></label><label className="grid gap-2 text-sm font-medium">Pagamento<select name="payment" className="input"><option>Cartão de crédito</option><option>PIX</option><option>Boleto</option></select></label></div>
            <p role="status" aria-live="polite" className="mt-4 text-sm text-destructive">{message}</p>
          </CardContent>
          <CardFooter>
            <Button data-testid="finish-order" disabled={sending}>{sending ? "Finalizando…" : "Finalizar pedido"}</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Cupom</dt><dd><Input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="QA10" className="h-8 w-24" /></dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Desconto</dt><dd className="text-primary">-{money(discount)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Frete</dt><dd>{shipping ? money(shipping) : "Grátis"}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Taxa</dt><dd>{money(tax)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 font-semibold text-primary"><dt>Total</dt><dd data-testid="checkout-total">{money(total)}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </form>
    </ShopShell>
  );
}

type StoredOrder = { id: string; total: number; status: "Confirmado" | "Enviado" | "Entregue" | "Cancelado"; createdAt: string; items: CartItem[] };

const statusLabels: Record<OrderStatus, StoredOrder["status"]> = { confirmado: "Confirmado", enviado: "Enviado", entregue: "Entregue", cancelado: "Cancelado" };
const statusValues = Object.fromEntries(Object.entries(statusLabels).map(([value, label]) => [label, value])) as Record<StoredOrder["status"], OrderStatus>;

function readOrders(): StoredOrder[] { if (typeof window === "undefined") return []; const saved = JSON.parse(localStorage.getItem("qa-lab-orders") ?? "[]") as StoredOrder[]; const last = JSON.parse(localStorage.getItem("qa-lab-last-order") ?? "null") as StoredOrder | null; return last && !saved.some((order) => order.id === last.id) ? [{ ...last, status: "Confirmado", createdAt: new Date().toISOString() }, ...saved] : saved; }
function saveOrders(orders: StoredOrder[]) { localStorage.setItem("qa-lab-orders", JSON.stringify(orders)); }

/**
 * Pedidos do aluno. Logado, vem de /api/v1/shop/orders com o valor que o
 * servidor cobrou; deslogado, do pedido efemero guardado nesta sessao.
 */
function useOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [remote, setRemote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/v1/shop/orders")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!alive) return;
        if (!body?.data) { setOrders(readOrders()); return; }
        setRemote(true);
        setOrders((body.data as Order[]).map((order) => ({ id: order.reference, total: order.total, status: statusLabels[order.status], createdAt: order.createdAt, items: order.items })));
      })
      .catch(() => { if (alive) setOrders(readOrders()); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { orders, setOrders, remote, loading };
}

export function OrdersPage() {
  const { orders, loading } = useOrders(); const [query, setQuery] = useState(""); const [status, setStatus] = useState("todos");
  const shown = orders.filter((order) => (!query || order.id.toLowerCase().includes(query.toLowerCase())) && (status === "todos" || order.status === status));
  return <ShopShell title="Historico de pedidos" subtitle="Busque e acompanhe suas compras."><div className="grid gap-3 sm:grid-cols-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar pedido" placeholder="Buscar por codigo" /><Select label="Status do pedido" value={status} onChange={setStatus} values={["todos", "Confirmado", "Enviado", "Entregue", "Cancelado"]} /></div><div className="mt-5 grid gap-3">{shown.map((order) => <Card key={order.id}><CardContent className="flex flex-wrap items-center justify-between gap-3"><div><strong className="font-mono">{order.id}</strong><p className="text-sm text-muted-foreground">{order.status} · {money(order.total)}</p></div><Button asChild variant="outline"><Link href={`/shop/orders/${order.id}`}>Ver pedido</Link></Button></CardContent></Card>)}{!shown.length && <Card><CardContent><p role="status" className="text-sm text-muted-foreground">{loading ? "Carregando pedidos..." : "Nenhum pedido encontrado."}</p></CardContent></Card>}</div></ShopShell>;
}

type Account = { email: string; name: string; password: string; addresses: string[]; communications: boolean; reducedMotion: boolean; mfa: boolean; sessions: string[] };
function readAccount(): Account | null { if (typeof window === "undefined") return null; return JSON.parse(localStorage.getItem("qa-lab-account") ?? "null") as Account | null; }
function writeAccount(account: Account | null) { if (account) localStorage.setItem("qa-lab-account", JSON.stringify(account)); else localStorage.removeItem("qa-lab-account"); }
export function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null); const [notice, setNotice] = useState(""); const [logged, setLogged] = useState(false);
  useEffect(() => { const saved = readAccount(); setAccount(saved); setLogged(Boolean(saved && localStorage.getItem("qa-lab-session"))); }, []);
  function persist(next: Account) { setAccount(next); writeAccount(next); }
  return <ShopShell title="Minha conta" subtitle="Conta, dados pessoais, preferencias e seguranca."><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Cadastro e sessao</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const email = String(data.get("email")).toLowerCase(); const password = String(data.get("password")); if (password.length < 8) return setNotice("A senha precisa ter ao menos 8 caracteres."); try { const remote = await systemApi<{ id: string; name: string; email: string }>("/auth/register", { method: "POST", body: JSON.stringify({ name: data.get("name"), email, password }) }); persist({ email: remote.email, password, name: remote.name, addresses: [], communications: false, reducedMotion: false, mfa: false, sessions: [] }); setNotice("Conta criada no backend. Faca login para iniciar a sessao."); } catch (error) { setNotice(error instanceof Error ? error.message : "Falha ao cadastrar."); } }}><Input name="name" required placeholder="Nome" /><Input name="email" required type="email" placeholder="E-mail" /><Input name="password" required type="password" minLength={8} placeholder="Senha (minimo 8)" /><Button>Criar conta</Button></form><form className="mt-5 grid gap-3 border-t pt-5" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); try { const remote = await systemApi<{ id: string; name: string; email: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) }); persist({ ...(account ?? { addresses: [], communications: false, reducedMotion: false, mfa: false, sessions: [] }), email: remote.email, name: remote.name, password: String(data.get("password")) }); localStorage.setItem("qa-lab-session", remote.id); setLogged(true); setNotice("Login realizado pelo backend."); } catch (error) { setNotice(error instanceof Error ? error.message : "Falha no login."); } }}><Input name="email" required type="email" placeholder="E-mail cadastrado" /><Input name="password" required type="password" placeholder="Senha" /><div className="flex gap-2"><Button>Entrar</Button><Button type="button" variant="outline" onClick={() => setNotice("Link de recuperacao de senha simulado enviado.")}>Recuperar senha</Button>{logged && <Button type="button" variant="ghost" onClick={() => { localStorage.removeItem("qa-lab-session"); setLogged(false); setNotice("Logout realizado."); }}>Sair</Button>}</div></form></CardContent></Card><Card><CardHeader><CardTitle>Perfil, endereco e preferencias</CardTitle></CardHeader><CardContent>{account ? <div className="grid gap-4"><label className="grid gap-1 text-sm">Nome<Input value={account.name} onChange={(event) => persist({ ...account, name: event.target.value })} /></label><div className="flex gap-2"><Input id="new-address" placeholder="Novo endereco" /><Button type="button" variant="outline" onClick={() => { const input = document.getElementById("new-address") as HTMLInputElement; if (input.value) { persist({ ...account, addresses: [...account.addresses, input.value] }); input.value = ""; } }}>Adicionar endereco</Button></div>{account.addresses.map((address) => <p key={address} className="rounded border p-2 text-sm">{address}</p>)}<label className="flex justify-between text-sm">Receber comunicacoes <input type="checkbox" checked={account.communications} onChange={() => persist({ ...account, communications: !account.communications })} /></label><label className="flex justify-between text-sm">Reduzir animacoes <input type="checkbox" checked={account.reducedMotion} onChange={() => persist({ ...account, reducedMotion: !account.reducedMotion })} /></label><label className="flex justify-between text-sm">MFA simulada <input type="checkbox" checked={account.mfa} onChange={() => persist({ ...account, mfa: !account.mfa })} /></label><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setNotice("Sessoes em outros dispositivos encerradas.")}>Gerenciar sessoes</Button><Button type="button" variant="outline" onClick={() => { const blob = new Blob([JSON.stringify(account, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "meus-dados.json"; link.click(); URL.revokeObjectURL(url); }}>Exportar dados</Button><Button type="button" variant="destructive" onClick={() => { writeAccount(null); localStorage.removeItem("qa-lab-session"); setAccount(null); setLogged(false); setNotice("Dados pessoais excluidos."); }}>Excluir dados</Button></div></div> : <p className="text-sm text-muted-foreground">Crie uma conta para editar perfil, enderecos e preferencias.</p>}</CardContent></Card></div>{notice && <p role="status" aria-live="polite" className="mt-5 rounded border border-primary/30 p-3 text-sm text-primary">{notice}</p>}</ShopShell>;
}

type Ticket = { id: string; subject: string; category: string; priority: string; status: string; messages: string[] };
type Audit = { at: string; action: string };
export function OperationsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]); const [stock, setStock] = useState(4); const [supplier, setSupplier] = useState(""); const [help, setHelp] = useState(""); const [flag, setFlag] = useState(false); const [alerts, setAlerts] = useState<string[]>([]); const [audit, setAudit] = useState<Audit[]>([]); const [notice, setNotice] = useState("");
  useEffect(() => { const saved = JSON.parse(localStorage.getItem("qa-lab-operations") ?? "null") as { tickets: Ticket[]; stock: number; supplier: string; flag: boolean; alerts: string[]; audit: Audit[] } | null; if (saved) { setTickets(saved.tickets); setStock(saved.stock); setSupplier(saved.supplier); setFlag(saved.flag); setAlerts(saved.alerts); setAudit(saved.audit); } }, []);
  function log(action: string) { const nextAudit = [{ at: new Date().toLocaleString("pt-BR"), action }, ...audit].slice(0, 12); const nextAlerts = stock < 5 ? ["Estoque abaixo do minimo: Caderno Bug Report.", ...alerts.filter((item) => !item.startsWith("Estoque abaixo"))] : alerts; setAudit(nextAudit); setAlerts(nextAlerts); localStorage.setItem("qa-lab-operations", JSON.stringify({ tickets, stock, supplier, flag, alerts: nextAlerts, audit: nextAudit })); setNotice(action); }
  return <ShopShell title="Central de operacao" subtitle="Atendimento, estoque, regras e governanca em um unico ambiente."><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Atendimento e SLA</CardTitle><CardDescription>Abra tickets, priorize e responda o cliente.</CardDescription></CardHeader><CardContent><form className="grid gap-2" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const ticket = { id: `TK-${String(tickets.length + 101).padStart(3, "0")}`, subject: String(data.get("subject")), category: String(data.get("category")), priority: String(data.get("priority")), status: "Aberto", messages: [] }; const next = [ticket, ...tickets]; setTickets(next); localStorage.setItem("qa-lab-operations", JSON.stringify({ tickets: next, stock, supplier, flag, alerts, audit })); log(`Ticket ${ticket.id} aberto.`); event.currentTarget.reset(); }}><Input name="subject" required placeholder="Assunto do ticket" /><div className="grid grid-cols-2 gap-2"><select name="category" className="input"><option>Pedido</option><option>Pagamento</option><option>Produto</option></select><select name="priority" className="input"><option>Baixa</option><option>Media</option><option>Alta</option></select></div><Button>Abrir ticket</Button></form><div className="mt-4 grid gap-2">{tickets.map((ticket) => <div key={ticket.id} className="rounded border p-3 text-sm"><strong>{ticket.id} · {ticket.subject}</strong><p>{ticket.category} · prioridade {ticket.priority} · SLA 4h · {ticket.status}</p><form className="mt-2 flex gap-2" onSubmit={(event) => { event.preventDefault(); const text = String(new FormData(event.currentTarget).get("reply")); if (text) { const next = tickets.map((item) => item.id === ticket.id ? { ...item, status: "Em atendimento", messages: [...item.messages, text] } : item); setTickets(next); log(`Resposta enviada no ticket ${ticket.id}.`); event.currentTarget.reset(); } }}><Input name="reply" placeholder="Responder" /><Button size="sm">Enviar</Button></form></div>)}</div></CardContent></Card><Card><CardHeader><CardTitle>Base de ajuda</CardTitle></CardHeader><CardContent><Input value={help} onChange={(event) => setHelp(event.target.value)} aria-label="Buscar artigo" placeholder="Buscar artigo de ajuda" /><div className="mt-3 grid gap-2 text-sm">{["Como rastrear um pedido", "Como solicitar devolucao", "Formas de pagamento"].filter((article) => article.toLowerCase().includes(help.toLowerCase())).map((article) => <button key={article} className="rounded border p-3 text-left" onClick={() => setNotice(`Artigo aberto: ${article}.`)}>{article}</button>)}</div></CardContent></Card><Card><CardHeader><CardTitle>Estoque, fornecedor e promocao</CardTitle></CardHeader><CardContent><div className="grid gap-3"><label className="grid gap-1 text-sm">Unidades em estoque<Input type="number" min="0" value={stock} onChange={(event) => setStock(Number(event.target.value))} /></label><p className={stock < 5 ? "text-sm text-destructive" : "text-sm text-primary"}>{stock < 5 ? "Alerta de estoque minimo ativo." : "Estoque acima do minimo."}</p><label className="grid gap-1 text-sm">Fornecedor<Input value={supplier} onChange={(event) => setSupplier(event.target.value)} placeholder="Nome do fornecedor" /></label><label className="grid gap-1 text-sm">Promocao (inicio e termino)<div className="grid grid-cols-2 gap-2"><Input type="date" /><Input type="date" /></div></label><Button onClick={() => log("Estoque, fornecedor e promocao salvos.")}>Salvar operacao</Button></div></CardContent></Card><Card><CardHeader><CardTitle>Preco, indicadores e governanca</CardTitle></CardHeader><CardContent><div className="grid gap-3"><Button variant="outline" onClick={() => log("Alteracao de preco enviada para aprovacao.")}>Solicitar aprovacao de preco</Button><label className="flex justify-between rounded border p-3 text-sm">Feature flag: checkout V2 <input type="checkbox" checked={flag} onChange={() => { setFlag(!flag); log(`Feature flag checkout V2 ${!flag ? "ativada" : "desativada"}.`); }} /></label><div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded border p-2"><strong>128</strong><br />pedidos</div><div className="rounded border p-2"><strong>94%</strong><br />SLA</div><div className="rounded border p-2"><strong>3,8%</strong><br />conversao</div></div><div><strong className="text-sm">Alertas</strong>{alerts.length ? alerts.map((alert) => <p key={alert} className="mt-1 text-sm text-destructive">{alert}</p>) : <p className="text-sm text-muted-foreground">Nenhum alerta ativo.</p>}</div><div><strong className="text-sm">Auditoria</strong>{audit.map((entry) => <p key={`${entry.at}-${entry.action}`} className="mt-1 text-xs text-muted-foreground">{entry.at} — {entry.action}</p>)}</div></div></CardContent></Card></div>{notice && <p role="status" aria-live="polite" className="mt-5 rounded border border-primary/30 p-3 text-sm text-primary">{notice}</p>}</ShopShell>;
}

export function OrderPage({ id }: { id: string }) {
  const { orders, setOrders, remote } = useOrders(); const [notice, setNotice] = useState(""); const [reason, setReason] = useState(""); const [survey, setSurvey] = useState(0);
  const order = orders.find((item) => item.id === id) ?? { id, total: 0, status: "Confirmado" as const, createdAt: new Date().toISOString(), items: [] };

  async function update(status: StoredOrder["status"], message: string) {
    // Logado, quem muda o status e o servidor: a linha do tempo do pedido nao
    // pode depender do que esta aba acha que aconteceu.
    if (remote) {
      const response = await fetch(`/api/v1/shop/orders?reference=${encodeURIComponent(id)}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: statusValues[status] }) });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const erro = body?.error?.message ?? "Nao foi possivel atualizar o pedido.";
        setNotice(erro);
        toast.error(erro);
        return;
      }
      setOrders(orders.map((item) => (item.id === id ? { ...item, status } : item)));
      setNotice(message);
      toast.success(message);
      return;
    }
    const next = orders.some((item) => item.id === id) ? orders.map((item) => item.id === id ? { ...item, status } : item) : [{ ...order, status }, ...orders];
    setOrders(next); saveOrders(next); setNotice(message); toast.success(message);
  }

  async function reorder() {
    const items = normalizeCart(order.items);
    if (remote) await fetch("/api/v1/shop/cart", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ items }) });
    else localStorage.setItem("qa-lab-cart", JSON.stringify(items));
    setNotice("Itens adicionados novamente ao carrinho.");
    toast.success("Itens adicionados novamente ao carrinho.");
  }
  return <ShopShell title="Detalhe do pedido" subtitle={`Pedido ${id}`} action={<Button asChild variant="outline"><Link href="/shop/orders">Historico</Link></Button>}><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="grid gap-5"><Card><CardHeader><CardDescription>Status atual</CardDescription><CardTitle className="font-mono text-2xl text-primary" data-testid="order-id">{id}</CardTitle></CardHeader><CardContent><p className="font-medium">{order.status}</p><ol className="mt-5 grid gap-3 text-sm">{["Confirmado", "Pagamento aprovado", "Enviado", "Entregue"].map((step, index) => <li key={step} className={index === 0 || order.status === "Enviado" || order.status === "Entregue" ? "text-primary" : "text-muted-foreground"}>{index + 1}. {step}</li>)}</ol><p className="mt-5 rounded-md bg-muted p-3 text-sm">Rastreio: <strong className="font-mono">BR-QL-{id.slice(-6)}</strong> · Atualizacao simulada em transito.</p></CardContent></Card><Card><CardHeader><CardTitle>Pos-venda</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void update("Cancelado", `Pedido cancelado. Motivo: ${reason || "nao informado"}.`)}>Cancelar</Button><Button variant="outline" onClick={() => setNotice("Solicitacao de devolucao aberta.")}>Solicitar devolucao</Button><Button variant="outline" onClick={() => setNotice("Reembolso total solicitado.")}>Solicitar reembolso</Button><Button variant="outline" onClick={() => { const blob = new Blob([`Nota fiscal simulada do pedido ${id}`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${id}-nota-fiscal.txt`; link.click(); URL.revokeObjectURL(url); }}>Baixar nota fiscal</Button><Button variant="outline" onClick={() => void reorder()}>Comprar novamente</Button></CardContent></Card></div><aside className="grid gap-5"><Card><CardHeader><CardTitle>Motivo do cancelamento</CardTitle></CardHeader><CardContent><Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Ex.: desisti da compra" /></CardContent></Card><Card><CardHeader><CardTitle>Satisfacao</CardTitle><CardDescription>Como foi sua experiencia?</CardDescription></CardHeader><CardContent><div className="flex gap-2">{[1,2,3,4,5].map((value) => <Button key={value} type="button" variant={survey === value ? "default" : "outline"} size="sm" onClick={() => { setSurvey(value); setNotice(`Pesquisa registrada: ${value}/5.`); }}>{value}</Button>)}</div></CardContent></Card></aside></div>{notice && <p role="status" aria-live="polite" className="mt-5 rounded-md border border-primary/30 p-3 text-sm text-primary">{notice}</p>}</ShopShell>;
}

function ShopShell({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="qa-store">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/labs" className="text-sm font-medium text-primary">← QA Lab Playground</Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
        <nav className="mt-5 flex flex-wrap gap-2 text-sm">
          <Button asChild variant="outline" size="sm"><Link href="/shop/products">Catalogo</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/shop/cart">Carrinho</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/shop/checkout">Checkout</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/shop/orders">Pedidos</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/shop/account">Conta</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/shop/operations">Operacao</Link></Button>
        </nav>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function Select({ label, value, values, labels, onChange }: { label: string; value: string; values: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <SelectField
      value={value}
      onChange={onChange}
      options={values.map((item) => ({ value: item, label: labels?.[item] ?? item }))}
      aria-label={label}
    />
  );
}
