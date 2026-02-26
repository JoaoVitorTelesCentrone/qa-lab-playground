"use client";

import { useState, useCallback } from "react";
import { RequestPanel } from "@/components/api-runner/request-panel";
import { ResponsePanel } from "@/components/api-runner/response-panel";
import { ChaosPanel } from "@/components/api-runner/chaos-panel";
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
      <div className="animate-slide-in-up">
        <h1 className="text-2xl font-bold tracking-tight">API Playground</h1>
        <p className="text-sm text-muted-foreground">
          Envie requests para a API e explore os endpoints. Ative o modo caos
          para descobrir bugs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] stagger">
        <div className="space-y-6">
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
        <div>
          <ChaosPanel />
        </div>
      </div>
    </div>
  );
}
