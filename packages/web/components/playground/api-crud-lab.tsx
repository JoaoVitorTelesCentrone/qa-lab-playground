"use client";

import { useState } from "react";
import { LabBrief, LabShell } from "./login-lab";

const sampleBooking = {
  firstname: "Marina",
  lastname: "QA",
  totalprice: 380,
  depositpaid: true,
  bookingdates: { checkin: "2026-11-10", checkout: "2026-11-12" },
  additionalneeds: "Notebook desk",
};

export function ApiCrudLab() {
  const [token, setToken] = useState("");
  const [output, setOutput] = useState("Execute uma chamada para ver o response.");

  async function call(label: string, path: string, init?: RequestInit) {
    const response = await fetch(path, { ...init, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}), ...init?.headers } });
    const text = response.status === 204 ? "" : JSON.stringify(await response.json(), null, 2);
    setOutput(`${label}\nHTTP ${response.status}\n${text}`);
  }

  async function login() {
    const response = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ username: "standard_user", password: "qa_lab_secret" }) });
    const result = await response.json() as { data: { token: string } };
    setToken(result.data.token);
    setOutput(JSON.stringify(result, null, 2));
  }

  return (
    <LabShell title="Lab 21: API CRUD de reservas" description="Pratique contrato REST com reset de dados, auth simples, filtros, paginacao, PUT, PATCH e DELETE.">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex flex-wrap gap-2">
            <button onClick={login} className="rounded-lg bg-neon px-3 py-2 text-sm font-black text-[#101319]">Login API</button>
            <button onClick={() => call("Reset", "/api/test/reset", { method: "POST" })} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">Reset</button>
            <button onClick={() => call("Listar", "/api/bookings?page=1&perPage=5&sort=firstname")} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">GET</button>
            <button onClick={() => call("Criar", "/api/bookings", { method: "POST", body: JSON.stringify(sampleBooking) })} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">POST</button>
            <button onClick={() => call("Patch", "/api/bookings/1", { method: "PATCH", body: JSON.stringify({ additionalneeds: "Early check-in" }) })} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">PATCH</button>
            <button onClick={() => call("Delete", "/api/bookings/1", { method: "DELETE" })} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">DELETE</button>
            <button onClick={() => call("Docs", "/api/docs")} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">Docs</button>
          </div>
          <p className="mt-4 text-xs text-[#8B949E]">Token: <span className="font-mono text-mint">{token || "nao autenticado"}</span></p>
          <pre className="mt-4 max-h-[460px] overflow-auto rounded-lg bg-[#101319] p-4 text-xs leading-5 text-[#DDE6EE]" data-testid="api-output">{output}</pre>
        </section>
        <LabBrief items={["POST /api/bookings retorna 201.", "PUT, PATCH e DELETE exigem Authorization.", "Reset restaura massa de teste.", "Modo ?bug=delete-without-auth demonstra autorizacao quebrada."]} />
      </div>
    </LabShell>
  );
}
