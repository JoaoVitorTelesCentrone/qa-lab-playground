"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ZapOff } from "lucide-react";
import type { ChaosConfig } from "@qa-lab/shared";

export function ChaosPanel() {
  const [config, setConfig] = useState<ChaosConfig | null>(null);
  const [allEnabled, setAllEnabled] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/_chaos/config");
      const data = await res.json();
      setConfig(data);
      setAllEnabled(Object.values(data).some((c: unknown) => (c as { enabled: boolean }).enabled));
    } catch {
      // API not available
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  async function toggleAll() {
    const newState = !allEnabled;
    await fetch("/api/_chaos/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: newState }),
    });
    setAllEnabled(newState);
    fetchConfig();
  }

  async function toggleEndpoint(key: string, enabled: boolean) {
    await fetch("/api/_chaos/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: key,
        config: { enabled: !enabled },
      }),
    });
    fetchConfig();
  }

  if (!config) return null;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {allEnabled ? (
            <Zap className="size-4 text-neon" />
          ) : (
            <ZapOff className="size-4 text-off-white/50" />
          )}
          <span className="text-sm font-medium">Modo Caos</span>
        </div>
        <Button
          variant={allEnabled ? "destructive" : "outline"}
          size="sm"
          onClick={toggleAll}
        >
          {allEnabled ? "Desativar Todos" : "Ativar Todos"}
        </Button>
      </div>

      <div className="space-y-1">
        {Object.entries(config).map(([key, value]) => (
          <button
            key={key}
            onClick={() => toggleEndpoint(key, value.enabled)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-off-white/5 transition-colors"
          >
            <span className="font-mono text-off-white/50">{key}</span>
            <Badge
              variant="secondary"
              className={
                value.enabled
                  ? "bg-[#F4A8A3]/10 text-[#F4A8A3]"
                  : "bg-off-white/10 text-off-white/50"
              }
            >
              {value.enabled ? "ON" : "OFF"}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
