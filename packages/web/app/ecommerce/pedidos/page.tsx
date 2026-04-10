"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, ChevronRight, ShoppingCart, User } from "lucide-react";
import { getStoredOrders, getStoredUser, type Order } from "@/lib/ecommerce";

const statusConfig: Record<Order["status"], { label: string; color: string }> = {
  processando: { label: "Processando", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmado:  { label: "Confirmado",  color: "bg-blue-100 text-blue-800 border-blue-200"       },
  enviado:     { label: "Enviado",     color: "bg-purple-100 text-purple-800 border-purple-200" },
  entregue:    { label: "Entregue",    color: "bg-green-100 text-green-800 border-green-200"    },
  cancelado:   { label: "Cancelado",   color: "bg-red-100 text-red-800 border-red-200"          },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500 animate-pulse">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 py-8 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecommerce" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Meus Pedidos</h1>
            {userName && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <User className="size-3" /> {userName}
              </p>
            )}
          </div>
          <span className="ml-auto text-sm text-gray-400">{orders.length} pedido(s)</span>
        </div>

        {/* Lista */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center space-y-3">
            <ShoppingCart className="size-12 mx-auto text-gray-200" />
            <p className="font-medium text-gray-700">Nenhum pedido ainda</p>
            <p className="text-sm text-gray-500">
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
                  <div className="bg-white rounded-xl border p-4 hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <Package className="size-4 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="font-mono text-sm font-semibold">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${s.color}`}>
                          {s.label}
                        </span>
                        <ChevronRight className="size-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="flex items-end justify-between text-sm">
                      <div className="text-gray-500 space-y-0.5">
                        <p>{order.items.length} item(ns) · {date}</p>
                        <p className="text-xs">{order.endereco.cidade} — {order.endereco.estado}</p>
                      </div>
                      <p className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/ecommerce" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
