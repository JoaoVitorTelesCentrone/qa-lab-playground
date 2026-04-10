"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, MapPin, CreditCard, RefreshCw, AlertTriangle } from "lucide-react";
import { getStoredOrders, getStoredUser, type Order } from "@/lib/ecommerce";

// ─── BUG #13 — Schema inconsistente ──────────────────────────────────────────
// Espelha o bug do GET /api/orders/:id: formato muda a cada "request"
type SchemaFormat = "camelCase" | "snake_case" | "flat";

function buildResponse(order: Order, format: SchemaFormat) {
  switch (format) {
    case "camelCase":
      return {
        orderId:      order.id,
        userId:       order.userId,
        orderItems:   order.items.map(i => ({ itemId: i.id, itemName: i.nome, unitPrice: i.preco, qty: i.quantidade })),
        orderTotal:   order.total,
        shippingCost: order.frete,
        discountAmt:  order.desconto,
        deliveryAddr: order.endereco,
        paymentMethod: order.pagamento,
        orderStatus:  order.status,
        createdAt:    order.criadoEm,
      };
    case "snake_case":
      return {
        order_id:      order.id,
        user_id:       order.userId,
        order_items:   order.items.map(i => ({ item_id: i.id, item_name: i.nome, unit_price: i.preco, quantity: i.quantidade })),
        order_total:   order.total,
        shipping_cost: order.frete,
        discount_amt:  order.desconto,
        delivery_addr: order.endereco,
        payment_method: order.pagamento,
        order_status:  order.status,
        created_at:    order.criadoEm,
      };
    case "flat":
    default:
      return {
        id:              order.id,
        uid:             order.userId,
        produtos:        order.items.map(i => ({ id: i.id, nome: i.nome, preco: i.preco, qtd: i.quantidade })),
        total:           order.total,
        frete:           order.frete,
        desconto:        order.desconto,
        cep:             order.endereco.cep,
        cidade:          order.endereco.cidade,
        estado:          order.endereco.estado,
        forma_pagamento: order.pagamento,
        situacao:        order.status,
        timestamp:       new Date(order.criadoEm).getTime(),
      };
  }
}

const FORMATS: SchemaFormat[] = ["camelCase", "snake_case", "flat"];

const statusConfig: Record<Order["status"], { label: string; color: string }> = {
  processando: { label: "Processando", color: "bg-yellow-100 text-yellow-800" },
  confirmado:  { label: "Confirmado",  color: "bg-blue-100 text-blue-800"     },
  enviado:     { label: "Enviado",     color: "bg-purple-100 text-purple-800" },
  entregue:    { label: "Entregue",    color: "bg-green-100 text-green-800"   },
  cancelado:   { label: "Cancelado",   color: "bg-red-100 text-red-800"       },
};

const pagamentoLabel: Record<Order["pagamento"], string> = {
  cartao_credito: "Cartão de Crédito",
  pix:            "PIX",
  boleto:         "Boleto Bancário",
};

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [order, setOrder]         = useState<Order | null>(null);
  const [rawResponse, setRaw]     = useState<object>({});
  const [format, setFormat]       = useState<SchemaFormat>("camelCase");
  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.replace("/ecommerce/login"); return; }

    const found = getStoredOrders().find(o => o.id === id);
    if (!found) { router.replace("/ecommerce/pedidos"); return; }

    setOrder(found);
    // BUG #13: formato escolhido aleatoriamente em cada "request"
    const randomFormat = FORMATS[Math.floor(Math.random() * FORMATS.length)];
    setFormat(randomFormat);
    setRaw(buildResponse(found, randomFormat));
    setLoading(false);
  }, [id, refreshCount]);

  function refresh() {
    setLoading(true);
    setTimeout(() => setRefreshCount(c => c + 1), 300);
  }

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500 animate-pulse">Carregando pedido...</p>
      </div>
    );
  }

  const s = statusConfig[order.status];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 py-8 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/ecommerce/pedidos" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Detalhe do Pedido</h1>
            <p className="font-mono text-xs text-gray-500 mt-0.5">{order.id}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>
            {s.label}
          </span>
        </div>

        {/* Itens */}
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-gray-400" />
            <h2 className="font-semibold text-sm">Itens do Pedido</h2>
          </div>
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{item.nome}</p>
                <p className="text-xs text-gray-500">
                  R$ {item.preco.toFixed(2)} × {item.quantidade}
                </p>
              </div>
              <p className="font-semibold text-sm">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
          ))}
          <div className="pt-2 space-y-1.5 text-sm border-t">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>R$ {order.subtotal.toFixed(2)}</span>
            </div>
            {order.desconto > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto ({order.cupom})</span>
                <span>−R$ {order.desconto.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Frete</span>
              <span>R$ {order.frete.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-xl border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-gray-400" />
            <h2 className="font-semibold text-sm">Endereço de Entrega</h2>
          </div>
          <p className="text-sm text-gray-700">
            {order.endereco.rua}, {order.endereco.numero}
            {order.endereco.complemento && ` — ${order.endereco.complemento}`}
          </p>
          <p className="text-sm text-gray-500">{order.endereco.cidade} — {order.endereco.estado}</p>
          <p className="text-sm text-gray-500">CEP: {order.endereco.cep}</p>
        </div>

        {/* Pagamento */}
        <div className="bg-white rounded-xl border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-gray-400" />
            <h2 className="font-semibold text-sm">Pagamento</h2>
          </div>
          <p className="text-sm text-gray-700">{pagamentoLabel[order.pagamento]}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.criadoEm).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>

        {/* Resposta "da API" — bug educacional */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">GET /api/orders/{order.id}</span>
              <span className="text-[10px] bg-green-900 text-green-300 px-1.5 py-0.5 rounded font-mono">200 OK</span>
              <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-mono">{format}</span>
            </div>
            <button
              onClick={refresh}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="size-3" />
              Refetch ({refreshCount + 1})
            </button>
          </div>
          <pre className="text-xs text-green-400 p-4 overflow-auto max-h-52 font-mono leading-relaxed">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
          <div className="flex items-start gap-2 px-4 py-2.5 bg-yellow-900/30 border-t border-yellow-800/40">
            <AlertTriangle className="size-3.5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-400">
              <strong>Bug #13</strong> — O schema muda a cada request: camelCase / snake_case / flat. Clique em "Refetch" para reproduzir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
