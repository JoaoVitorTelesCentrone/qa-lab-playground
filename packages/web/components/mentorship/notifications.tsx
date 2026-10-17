"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";

type Notification = { id: string; kind: string; title: string; body: string; href: string | null; read_at: string | null; created_at: string };

export function MentorshipNotifications({ items }: { items: Notification[] }) {
  const [notifications, setNotifications] = useState(items);
  const unread = notifications.filter((item) => !item.read_at).length;
  async function markRead(id: string) {
    const response = await fetch(`/api/v1/mentorship/notifications/${id}/read`, { method: "POST" });
    if (!response.ok) return;
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
  }
  return <section className="mt-8 rounded-2xl border border-white/10 bg-[#171B21] p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Bell className="size-5 text-mint" /><div><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Atualizacoes</p><h2 className="mt-1 text-xl font-black text-off-white">Acompanhe sua mentoria</h2></div></div>{unread > 0 && <span className="rounded-full bg-neon/15 px-2.5 py-1 text-xs font-bold text-neon">{unread} nova(s)</span>}</div>{notifications.length === 0 ? <p className="mt-5 text-sm text-[#AAB2BC]">Nenhuma novidade por enquanto.</p> : <ul className="mt-5 grid gap-3">{notifications.map((item) => <li key={item.id} className={`rounded-xl border p-4 ${item.read_at ? "border-white/10 bg-[#101319]" : "border-mint/25 bg-mint/[.04]"}`}><div className="flex items-start justify-between gap-4"><div><p className="font-bold text-off-white">{item.title}</p><p className="mt-1 text-sm leading-6 text-[#AAB2BC]">{item.body}</p></div>{!item.read_at && <button type="button" onClick={() => markRead(item.id)} className="shrink-0 text-xs font-bold text-mint hover:text-neon" aria-label="Marcar notificacao como lida"><Check className="size-4" /></button>}</div>{item.href && <Link href={item.href} onClick={() => !item.read_at && markRead(item.id)} className="mt-3 inline-flex text-xs font-bold text-mint hover:text-neon">Abrir acao →</Link>}</li>)}</ul>}</section>;
}
