"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShoppingCart, MapPin, CreditCard,
  CheckCircle, AlertCircle, Truck, Package, Tag,
} from "lucide-react";
import {
  getStoredCart, getStoredUser, setStoredCart,
  addStoredOrder, generateOrderId,
  type CartItem, type EcommerceUser,
} from "@/lib/ecommerce";

type Step = "carrinho" | "endereco" | "pagamento" | "confirmado";
type Pagamento = "cartao_credito" | "pix" | "boleto";

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "carrinho",  label: "Carrinho",   icon: ShoppingCart },
  { key: "endereco",  label: "Endereço",   icon: MapPin },
  { key: "pagamento", label: "Pagamento",  icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep]   = useState<Step>("carrinho");
  const [cart, setCart]   = useState<CartItem[]>([]);
  const [user, setUser]   = useState<EcommerceUser | null>(null);
  const [orderId, setOrderId] = useState("");

  // Endereço
  const [cep, setCep]               = useState("");
  const [rua, setRua]               = useState("");
  const [numero, setNumero]         = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade]         = useState("");
  const [estado, setEstado]         = useState("");
  const [frete, setFrete]           = useState<number | null>(null);
  const [freteLoading, setFreteLoading] = useState(false);

  // Pagamento
  const [pagamento, setPagamento]     = useState<Pagamento>("cartao_credito");
  const [cupom, setCupom]             = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [cupomDesconto, setCupomDesconto] = useState(0);
  const [cupomErro, setCupomErro]     = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.replace("/ecommerce/login?redirect=/ecommerce/checkout");
      return;
    }
    setUser(storedUser);
    setCart(getStoredCart());
  }, []);

  const subtotal = cart.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const total    = subtotal - cupomDesconto + (frete ?? 0);
  const totalItens = cart.reduce((acc, i) => acc + i.quantidade, 0);

  async function buscarFrete() {
    if (cep.length < 8) return;
    setFreteLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setFrete(Number((Math.random() * 38 + 8).toFixed(2)));
    setFreteLoading(false);
  }

  function aplicarCupom() {
    const code = cupom.trim().toUpperCase();
    setCupomErro("");
    if (cupomAplicado) {
      setCupomErro("Cupom já aplicado.");
      return;
    }
    if (code === "DESCONTO20") {
      setCupomAplicado(true);
      setCupomDesconto(Number((subtotal * 0.2).toFixed(2)));
    } else if (code === "FRETE10") {
      setCupomAplicado(true);
      setCupomDesconto(10);
    } else {
      setCupomErro("Cupom inválido.");
    }
  }

  function finalizarPedido() {
    if (!user) return;
    const id = generateOrderId();
    addStoredOrder({
      id,
      userId:    user.id,
      userEmail: user.email,
      items: cart,
      subtotal,
      desconto:  cupomDesconto,
      frete:     frete ?? 0,
      total,
      cupom:     cupomAplicado ? cupom.toUpperCase() : null,
      endereco:  { cep, rua, numero, complemento, cidade, estado },
      pagamento,
      status:    "processando",
      criadoEm:  new Date().toISOString(),
    });
    setStoredCart([]);
    setOrderId(id);
    setStep("confirmado");
  }

  // ── Confirmado ────────────────────────────────────────────────────────────
  if (step === "confirmado") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 max-w-md w-full text-center space-y-4">
          <CheckCircle className="size-14 text-neon mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pedido Confirmado!</h1>
            <p className="text-muted-foreground text-sm mt-1">Número do pedido:</p>
            <p className="font-mono text-lg font-bold text-primary mt-1">{orderId}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Atualizações serão enviadas para{" "}
            <span className="font-medium text-foreground">{user?.email}</span>
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/ecommerce/pedidos">
              <button className="h-10 px-5 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-colors">
                Ver Pedidos
              </button>
            </Link>
            <Link href="/ecommerce">
              <button className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Continuar Comprando
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecommerce" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.key === step;
            const isPast   = i < stepIndex;
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : isPast ? "text-neon" : "text-muted-foreground"
                }`}>
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive ? "bg-primary text-primary-foreground" : isPast ? "bg-neon text-background" : "bg-muted text-muted-foreground"
                  }`}>
                    {isPast ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${isPast ? "bg-neon/40" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* ── Conteúdo principal ────────────────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border p-6">

            {/* ETAPA 1 — Revisão do carrinho */}
            {step === "carrinho" && (
              <div className="space-y-4">
                <h2 className="font-semibold text-base text-foreground">Revisar Carrinho</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <ShoppingCart className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Carrinho vazio</p>
                    <Link href="/ecommerce" className="text-primary hover:underline text-sm mt-1 inline-block">
                      Voltar para a loja
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">{item.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            R$ {item.preco.toFixed(2)} × {item.quantidade}
                          </p>
                          {item.quantidade > item.estoque && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="size-3" />
                              Qtd. excede estoque ({item.estoque} disponíveis)
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-foreground">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <button
                      onClick={() => setStep("endereco")}
                      className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors mt-2"
                    >
                      Continuar para Endereço →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 2 — Endereço */}
            {step === "endereco" && (
              <div className="space-y-4">
                <h2 className="font-semibold text-base text-foreground">Endereço de Entrega</h2>

                <div className="space-y-3">
                  {/* CEP */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">CEP *</label>
                    <div className="flex gap-2">
                      <input
                        value={cep}
                        onChange={e => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        placeholder="00000-000"
                        className="flex h-10 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={buscarFrete}
                        disabled={freteLoading || cep.length < 8}
                        className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-accent transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {freteLoading ? "Calculando..." : "Calcular frete"}
                      </button>
                    </div>
                    {frete !== null && (
                      <p className="text-xs text-neon flex items-center gap-1">
                        <Truck className="size-3" />
                        Frete calculado: R$ {frete.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Rua */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Rua / Logradouro *</label>
                    <input
                      value={rua}
                      onChange={e => setRua(e.target.value)}
                      placeholder="Ex: Rua das Flores"
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Número + Complemento */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Número *</label>
                      <input
                        value={numero}
                        onChange={e => setNumero(e.target.value)}
                        placeholder="123"
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Complemento</label>
                      <input
                        value={complemento}
                        onChange={e => setComplemento(e.target.value)}
                        placeholder="Apto 42"
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Cidade + Estado */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Cidade *</label>
                      <input
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                        placeholder="São Paulo"
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Estado *</label>
                      <select
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Selecione</option>
                        {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep("carrinho")}
                    className="h-10 px-4 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-colors"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={() => setStep("pagamento")}
                    disabled={!rua || !numero || !cidade || !estado}
                    className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    Continuar para Pagamento →
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3 — Pagamento */}
            {step === "pagamento" && (
              <div className="space-y-5">
                <h2 className="font-semibold text-base text-foreground">Forma de Pagamento</h2>

                {/* Métodos */}
                <div className="space-y-2">
                  {[
                    { value: "cartao_credito", label: "Cartão de Crédito", desc: "Parcele em até 12× sem juros" },
                    { value: "pix",            label: "PIX",               desc: "5% de desconto — liquidação imediata" },
                    { value: "boleto",          label: "Boleto Bancário",   desc: "Vence em 3 dias úteis" },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        pagamento === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pagamento"
                        value={opt.value}
                        checked={pagamento === opt.value as Pagamento}
                        onChange={() => setPagamento(opt.value as Pagamento)}
                        className="mt-0.5 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Cupom */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Tag className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Cupom de Desconto</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={cupom}
                      onChange={e => { setCupom(e.target.value); setCupomErro(""); }}
                      placeholder="Digite seu cupom"
                      disabled={cupomAplicado}
                      className="flex h-10 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={aplicarCupom}
                      disabled={cupomAplicado}
                      className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-accent disabled:opacity-50 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {cupomAplicado && (
                    <p className="text-xs text-neon">
                      Cupom aplicado! −R$ {cupomDesconto.toFixed(2)}
                    </p>
                  )}
                  {cupomErro && <p className="text-xs text-destructive">{cupomErro}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep("endereco")}
                    className="h-10 px-4 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-colors"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={finalizarPedido}
                    className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Finalizar Pedido — R$ {total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Resumo do pedido ──────────────────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border p-5 h-fit space-y-4">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Resumo — {totalItens} item(ns)</h3>
            </div>

            <div className="space-y-2 text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate max-w-[160px]">{item.nome} ×{item.quantidade}</span>
                  <span className="shrink-0 ml-2">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {cupomAplicado && (
                <div className="flex justify-between text-neon">
                  <span>Desconto</span>
                  <span>−R$ {cupomDesconto.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>{frete !== null ? `R$ ${frete.toFixed(2)}` : "A calcular"}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2 text-foreground">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
