"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, ChevronRight, ShoppingCart, User } from "lucide-react";
import { getStoredOrders, getStoredUser, type Order } from "@/lib/ecommerce";

const statusConfig: Record<Order["status"], { label: string; color: string }> = {
  processando: { label: "Processando", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  confirmado:  { label: "Confirmado",  color: "bg-primary/20 text-primary border-primary/30"          },
  enviado:     { label: "Enviado",     color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  entregue:    { label: "Entregue",    color: "bg-neon/20 text-neon border-neon/30"                   },
  cancelado:   { label: "Cancelado",   color: "bg-destructive/20 text-destructive border-destructive/30" },
};

export default function PedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/ecommerce/login?redirect=/ecommerce/pedidos");
      return;
    }
    setUserName(user.nome);
    const all = getStoredOrders();
    setOrders(all.filter(o => o.userId === user.id));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 py-8 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecommerce" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Meus Pedidos</h1>
            {userName && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <User className="size-3" /> {userName}
              </p>
            )}
          </div>
          <span className="ml-auto text-sm text-muted-foreground">{orders.length} pedido(s)</span>
        </div>

        {/* Lista */}
        {orders.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center space-y-3">
            <ShoppingCart className="size-12 mx-auto text-muted-foreground/30" />
            <p className="font-medium text-foreground">Nenhum pedido ainda</p>
            <p className="text-sm text-muted-foreground">
              Seus pedidos aparecem aqui após a finalização da compra.
            </p>
            <Link href="/ecommerce">
              <button className="mt-2 h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Ir para a loja
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const s = statusConfig[order.status];
              const date = new Date(order.criadoEm).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "short", year: "numeric",
              });
              return (
                <Link key={order.id} href={`/ecommerce/pedidos/${order.id}`}>
                  <div className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <Package className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="font-mono text-sm font-semibold text-foreground">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${s.color}`}>
                          {s.label}
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="flex items-end justify-between text-sm">
                      <div className="text-muted-foreground space-y-0.5">
                        <p>{order.items.length} item(ns) · {date}</p>
                        <p className="text-xs">{order.endereco.cidade} — {order.endereco.estado}</p>
                      </div>
                      <p className="font-bold text-foreground">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/ecommerce" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
