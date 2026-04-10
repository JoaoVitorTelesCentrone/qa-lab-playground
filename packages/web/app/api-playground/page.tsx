"use client";

import { useState, useCallback } from "react";
import { Send, Terminal } from "lucide-react";
import { RequestPanel } from "@/components/api-runner/request-panel";
import { ResponsePanel } from "@/components/api-runner/response-panel";
import { sendRequest, type ApiRequestResult } from "@/lib/api-client";

interface HistoryEntry {
  method: string;
  url: string;
  status: number;
  duration: number;
  response: ApiRequestResult;
}

export default function ApiPlaygroundPage() {
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] =
    useState<ApiRequestResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleSend = useCallback(
    async (req: {
      method: string;
      url: string;
      headers: Record<string, string>;
      body: string;
    }) => {
      setLoading(true);
      try {
        const result = await sendRequest({
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
        });
        setCurrentResponse(result);
        setHistory((prev) => [
          {
            method: req.method,
            url: req.url,
            status: result.status,
            duration: result.duration,
            response: result,
          },
          ...prev,
        ]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  function handleHistorySelect(index: number) {
    const entry = history[index];
    if (entry) {
      setCurrentResponse(entry.response);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <Terminal className="size-5 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              API PLAYGROUND
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              Teste os endpoints
            </p>
          </div>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Envie requests para a API e explore os endpoints disponíveis. Teste manualmente antes de automatizar.
        </p>
      </div>

      <div className="space-y-6 stagger">
        <RequestPanel onSend={handleSend} loading={loading} />
        <ResponsePanel
          response={currentResponse}
          history={history.map((h) => ({
            method: h.method,
            url: h.url,
            status: h.status,
            duration: h.duration,
          }))}
          onHistorySelect={handleHistorySelect}
        />
      </div>

      {/* Series Badge */}
      <div className="flex justify-end">
        <span className="series-number text-4xl text-off-white/10">
          #04
        </span>
      </div>
    </div>
  );
}
