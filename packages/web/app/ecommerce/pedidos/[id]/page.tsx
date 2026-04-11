"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { getStoredOrders, getStoredUser, type Order } from "@/lib/ecommerce";

const statusConfig: Record<Order["status"], { label: string; color: string }> = {
  processando: { label: "Processando", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  confirmado:  { label: "Confirmado",  color: "bg-primary/20 text-primary border-primary/30"          },
  enviado:     { label: "Enviado",     color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  entregue:    { label: "Entregue",    color: "bg-neon/20 text-neon border-neon/30"                   },
  cancelado:   { label: "Cancelado",   color: "bg-destructive/20 text-destructive border-destructive/30" },
};

const pagamentoLabel: Record<Order["pagamento"], string> = {
  cartao_credito: "Cartão de Crédito",
  pix:            "PIX",
  boleto:         "Boleto Bancário",
};

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.replace("/ecommerce/login"); return; }

    const found = getStoredOrders().find(o => o.id === id);
    if (!found) { router.replace("/ecommerce/pedidos"); return; }

    setOrder(found);
    setLoading(false);
  }, [id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Carregando pedido...</p>
      </div>
    );
  }

  const s = statusConfig[order.status];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 py-8 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecommerce/pedidos" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Detalhe do Pedido</h1>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{order.id}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${s.color}`}>
            {s.label}
          </span>
        </div>

        {/* Itens */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm text-foreground">Itens do Pedido</h2>
          </div>
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.nome}</p>
                <p className="text-xs text-muted-foreground">
                  R$ {item.preco.toFixed(2)} × {item.quantidade}
                </p>
              </div>
              <p className="font-semibold text-sm text-foreground">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
          ))}
          <div className="pt-2 space-y-1.5 text-sm border-t border-border">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {order.subtotal.toFixed(2)}</span>
            </div>
            {order.desconto > 0 && (
              <div className="flex justify-between text-neon">
                <span>Desconto {order.cupom && `(${order.cupom})`}</span>
                <span>−R$ {order.desconto.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Frete</span>
              <span>R$ {order.frete.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2 text-foreground">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm text-foreground">Endereço de Entrega</h2>
          </div>
          <p className="text-sm text-foreground">
            {order.endereco.rua}, {order.endereco.numero}
            {order.endereco.complemento && ` — ${order.endereco.complemento}`}
          </p>
          <p className="text-sm text-muted-foreground">{order.endereco.cidade} — {order.endereco.estado}</p>
          <p className="text-sm text-muted-foreground">CEP: {order.endereco.cep}</p>
        </div>

        {/* Pagamento */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm text-foreground">Pagamento</h2>
          </div>
          <p className="text-sm text-foreground">{pagamentoLabel[order.pagamento]}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.criadoEm).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>

        <div className="text-center pt-2">
          <Link href="/ecommerce/pedidos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Ver todos os pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
