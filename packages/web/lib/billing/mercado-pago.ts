import { createHmac, timingSafeEqual } from "crypto";

const apiUrl = "https://api.mercadopago.com";

export function mercadoPagoConfigured() {
  return Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN && process.env.MERCADO_PAGO_WEBHOOK_SECRET);
}

export async function createPreference(input: {
  title: string;
  description: string;
  price: number;
  externalReference: string;
  payerEmail: string | undefined;
  siteUrl: string;
}) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Mercado Pago não configurado.");
  const base = input.siteUrl.replace(/\/$/, "");
  const response = await fetch(`${apiUrl}/checkout/preferences`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ id: "qa-lab-pro-lifetime", title: input.title, description: input.description, quantity: 1, currency_id: "BRL", unit_price: input.price }],
      payer: input.payerEmail ? { email: input.payerEmail } : undefined,
      external_reference: input.externalReference,
      notification_url: `${base}/api/billing/mercado-pago/webhook`,
      back_urls: {
        success: `${base}/planos/confirmacao`,
        failure: `${base}/planos/confirmacao`,
        pending: `${base}/planos/confirmacao`,
      },
      auto_return: "approved",
      payment_methods: { installments: 12 },
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body.id !== "string" || typeof body.init_point !== "string") {
    throw new Error(typeof body.message === "string" ? body.message : "Não foi possível iniciar o checkout.");
  }
  return { id: body.id as string, initPoint: body.init_point as string, sandboxInitPoint: typeof body.sandbox_init_point === "string" ? body.sandbox_init_point : null };
}

export function verifyWebhookSignature(input: { signature: string | null; requestId: string | null; dataId: string | null }) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret || !input.signature || !input.dataId) return false;
  const parts = Object.fromEntries(input.signature.split(",").map((part) => part.trim().split("=", 2)).filter(([key, value]) => key && value));
  const timestamp = parts.ts;
  const received = parts.v1;
  if (!timestamp || !received) return false;
  const manifest = `id:${input.dataId};request-id:${input.requestId ?? ""};ts:${timestamp};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function getPayment(paymentId: string) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Mercado Pago não configurado.");
  const response = await fetch(`${apiUrl}/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) throw new Error("Não foi possível consultar o pagamento no Mercado Pago.");
  return response.json() as Promise<{ id: number; status: string; external_reference?: string; transaction_amount?: number }>;
}
