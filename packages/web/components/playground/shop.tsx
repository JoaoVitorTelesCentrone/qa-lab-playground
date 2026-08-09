"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { shopProducts, type ShopProduct } from "@/lib/playground/shop-data";

type CartItem = { productId: number; quantity: number };

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("qa-lab-cart") ?? "[]") as CartItem[];
  });
  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("qa-lab-cart", JSON.stringify(next));
  }
  return { items, save };
}

export function ProductsPage() {
  const { items, save } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [sort, setSort] = useState("name");
  const filtered = useMemo(() => {
    let result = [...shopProducts];
    if (search) result = result.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase()));
    if (category !== "todas") result = result.filter((product) => product.category === category);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price") result.sort((a, b) => a.price - b.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, search, sort]);

  function add(product: ShopProduct) {
    const current = items.find((item) => item.productId === product.id);
    save(current ? items.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId: product.id, quantity: 1 }]);
  }

  return (
    <ShopShell title="QA Lab Shop" action={<Link href="/shop/cart" className="inline-flex h-10 items-center gap-2 rounded-lg bg-neon px-4 text-sm font-black text-[#101319]"><ShoppingCart className="size-4" /> Carrinho ({items.reduce((sum, item) => sum + item.quantity, 0)})</Link>}>
      <div className="grid gap-3 rounded-lg border border-white/10 bg-card p-4 md:grid-cols-[1fr_180px_150px]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="field" placeholder="Buscar produto" data-testid="product-search" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="field" aria-label="Categoria">
          {["todas", "Livros", "Ferramentas", "Cursos", "Acessorios"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="field" aria-label="Ordenacao">
          <option value="name">nome</option><option value="price">preco</option><option value="rating">avaliacao</option>
        </select>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <article key={product.id} className="rounded-lg border border-white/10 bg-[#161B22] p-4">
            <div className="flex h-28 items-center justify-center rounded-md bg-mint/10 font-mono text-2xl font-black text-mint" aria-label={`Imagem ${product.name}`}>{product.image}</div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-neon">{product.category}</p>
            <h2 className="mt-1 text-lg font-black text-off-white">{product.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-sm text-off-white">{money(product.price)}</span>
              <span className="text-sm text-[#AAB2BC]">{product.rating} estrelas</span>
            </div>
            <button onClick={() => add(product)} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-mint px-3 text-sm font-black text-[#101319]" data-testid={`add-product-${product.id}`}>
              <Plus className="size-4" /> Adicionar
            </button>
          </article>
        ))}
      </div>
    </ShopShell>
  );
}

export function CartPage() {
  const { items, save } = useCart();
  const rows = items.map((item) => ({ ...item, product: shopProducts.find((product) => product.id === item.productId)! }));
  const subtotal = rows.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  function change(productId: number, delta: number) {
    save(items.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  }
  return (
    <ShopShell title="Carrinho" action={<Link href="/shop/checkout" className="inline-flex h-10 items-center rounded-lg bg-neon px-4 text-sm font-black text-[#101319]">Ir para checkout</Link>}>
      <div className="grid gap-4">
        {rows.map((item) => (
          <div key={item.productId} className="grid gap-3 rounded-lg border border-white/10 bg-card p-4 md:grid-cols-[1fr_160px_130px] md:items-center">
            <div><h2 className="font-black text-off-white">{item.product.name}</h2><p className="text-sm text-[#AAB2BC]">{money(item.product.price)} por unidade</p></div>
            <div className="flex items-center gap-2">
              <button aria-label="Diminuir quantidade" onClick={() => change(item.productId, -1)} className="rounded-md border border-white/10 p-2"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-mono" data-testid={`qty-${item.productId}`}>{item.quantity}</span>
              <button aria-label="Aumentar quantidade" onClick={() => change(item.productId, 1)} className="rounded-md border border-white/10 p-2"><Plus className="size-4" /></button>
              <button aria-label="Remover item" onClick={() => save(items.filter((cart) => cart.productId !== item.productId))} className="rounded-md border border-white/10 p-2 text-coral"><Trash2 className="size-4" /></button>
            </div>
            <p className="font-mono text-sm text-neon">{money(item.product.price * item.quantity)}</p>
          </div>
        ))}
        {!rows.length && <p className="rounded-lg border border-white/10 bg-card p-5 text-sm text-[#AAB2BC]">Carrinho vazio.</p>}
        <p className="text-right font-mono text-lg text-off-white" data-testid="cart-subtotal">Subtotal: {money(subtotal)}</p>
      </div>
    </ShopShell>
  );
}

export function CheckoutPage() {
  const bug = useSearchParams().get("bug");
  const router = useRouter();
  const instanceId = useId().replace(/\W/g, "").slice(0, 6);
  const { items, save } = useCart();
  const rows = items.map((item) => ({ ...item, product: shopProducts.find((product) => product.id === item.productId)! }));
  const subtotal = rows.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = bug === "wrong-total" ? subtotal + tax + 9.99 : subtotal + tax;
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("firstName") || !data.get("lastName") || !data.get("zip")) {
      setMessage("Nome, sobrenome e CEP sao obrigatorios.");
      return;
    }
    const id = `QL-${instanceId}-${String(Math.round(total * 100)).padStart(6, "0")}`;
    localStorage.setItem("qa-lab-last-order", JSON.stringify({ id, subtotal, tax, total, items: rows }));
    save([]);
    router.push(`/shop/orders/${id}`);
  }

  return (
    <ShopShell title="Checkout">
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-white/10 bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-bold text-off-white">Nome<input name="firstName" className="field" data-testid="checkout-first-name" /></label>
            <label className="grid gap-2 text-sm font-bold text-off-white">Sobrenome<input name="lastName" className="field" data-testid="checkout-last-name" /></label>
            <label className="grid gap-2 text-sm font-bold text-off-white">CEP<input name="zip" className="field" inputMode="numeric" data-testid="checkout-zip" /></label>
          </div>
          <p role="status" aria-live="polite" className="mt-4 text-sm text-coral">{message}</p>
          <button className="mt-5 h-11 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]" data-testid="finish-order">Finalizar pedido</button>
        </section>
        <aside className="rounded-lg border border-white/10 bg-[#161B22] p-5">
          <h2 className="font-black text-off-white">Resumo</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Taxa</dt><dd>{money(tax)}</dd></div>
            <div className="flex justify-between border-t border-white/10 pt-3 font-black text-neon"><dt>Total</dt><dd data-testid="checkout-total">{money(total)}</dd></div>
          </dl>
        </aside>
      </form>
    </ShopShell>
  );
}

export function OrderPage({ id }: { id: string }) {
  return (
    <ShopShell title="Pedido finalizado">
      <div className="rounded-lg border border-neon/30 bg-neon/10 p-6">
        <p className="text-sm text-[#AAB2BC]">Pedido gerado com sucesso.</p>
        <p className="mt-2 font-mono text-2xl font-black text-neon" data-testid="order-id">{id}</p>
        <Link href="/shop/products" className="mt-5 inline-flex rounded-lg bg-neon px-4 py-2 text-sm font-black text-[#101319]">Voltar ao catalogo</Link>
      </div>
    </ShopShell>
  );
}

function ShopShell({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="qa-simple">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/labs" className="text-sm font-bold text-mint">QA Lab Playground</Link>
          <h1 className="mt-3 text-4xl font-black leading-tight text-off-white">{title}</h1>
        </div>
        {action}
      </div>
      <nav className="mt-5 flex flex-wrap gap-2 text-sm">
        <Link className="rounded-lg border border-white/10 px-3 py-2 text-[#AAB2BC]" href="/shop/products">Catalogo</Link>
        <Link className="rounded-lg border border-white/10 px-3 py-2 text-[#AAB2BC]" href="/shop/cart">Carrinho</Link>
        <Link className="rounded-lg border border-white/10 px-3 py-2 text-[#AAB2BC]" href="/shop/checkout">Checkout</Link>
      </nav>
      <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
