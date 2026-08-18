"use client";

// Estado do portfólio do aluno, fora dos componentes.
//
// A publicação vive em dois cards diferentes do dashboard (o card "Portfólio
// público", com a página e os exports, e a lista de evidências, com o toggle de
// cada entrega) mas é um estado só: se ficasse dentro de um dos cards o outro
// leria dados velhos. Os requests são exatamente os mesmos de antes —
// PATCH/POST em /api/v1/portfolio.

import { useState } from "react";
import type { Submission } from "@/lib/product/journey";

export function usePortfolio({ submissions, username, onUsername, portfolioPublic, portfolioHeadline }: {
  submissions: Submission[];
  username: string;
  /** O username também é editável em "Dados da conta": quem manda é o pai. */
  onUsername: (value: string) => void;
  portfolioPublic: boolean;
  portfolioHeadline: string;
}) {
  const [items, setItems] = useState(submissions);
  const [headline, setHeadline] = useState(portfolioHeadline);
  const [isPublic, setIsPublic] = useState(portfolioPublic);
  // Última versão confirmada pelo servidor: é contra ela que o blur decide se
  // vale a pena mandar request.
  const [synced, setSynced] = useState({ username, headline: portfolioHeadline });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function patch(body: Record<string, unknown>, tag: string) {
    setBusy(tag); setError(""); setSaved(false);
    const response = await fetch("/api/v1/portfolio", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) { setError(payload?.error?.details?.username ?? payload?.error?.message ?? "Não foi possível salvar o portfólio."); return false; }
    onUsername(payload.data.username);
    setIsPublic(payload.data.portfolioPublic);
    setHeadline(payload.data.portfolioHeadline);
    setSynced({ username: payload.data.username, headline: payload.data.portfolioHeadline });
    setSaved(true);
    return true;
  }

  async function togglePublished(submission: Submission) {
    setBusy(submission.id); setError("");
    const response = await fetch("/api/v1/portfolio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ submissionId: submission.id, published: !submission.published }) });
    setBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Não foi possível publicar a evidência.");
      return;
    }
    setItems((current) => current.map((item) => (item.id === submission.id ? { ...item, published: !item.published } : item)));
  }

  /** Blur só dispara request quando o valor mudou de verdade. */
  function commitUsername(value: string) {
    if (value !== synced.username) void patch({ username: value }, "username");
  }

  function commitHeadline(value: string) {
    if (value !== synced.headline) void patch({ portfolioHeadline: value }, "headline");
  }

  return { items, headline, setHeadline, isPublic, busy, error, saved, patch, togglePublished, commitUsername, commitHeadline };
}

export type Portfolio = ReturnType<typeof usePortfolio>;
