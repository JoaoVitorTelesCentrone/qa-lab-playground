"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function CheckoutButton({ offerId, signedIn }: { offerId: string; signedIn: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    if (!signedIn) { window.location.assign(`/login?next=${encodeURIComponent("/planos")}`); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/billing/mercado-pago/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ offerId }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.checkoutUrl !== "string") throw new Error(payload.error || "Não foi possível abrir o checkout.");
      window.location.assign(payload.checkoutUrl);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Tente novamente."); setLoading(false); }
  }
  return <div><button type="button" onClick={checkout} disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319] disabled:opacity-60">{loading && <Loader2 className="size-4 animate-spin" />}{signedIn ? "Quero acesso Pro" : "Criar conta e continuar"}</button>{error && <p role="alert" className="mt-3 text-xs leading-5 text-coral">{error}</p>}</div>;
}
