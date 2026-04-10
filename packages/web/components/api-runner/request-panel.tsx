"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Plus, X } from "lucide-react";

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-neon/10 text-neon",
  POST: "bg-mint/20 text-mint",
  PUT: "bg-[#F4A8A3]/10 text-[#F4A8A3]",
  DELETE: "bg-coral/10 text-coral",
};

interface RequestPanelProps {
  onSend: (req: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
  }) => void;
  loading: boolean;
}

export function RequestPanel({ onSend, loading }: RequestPanelProps) {
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState("/api/users");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [showBody, setShowBody] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);

  function handleSend() {
    const headerObj: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) headerObj[h.key.trim()] = h.value;
    }
    onSend({ method, url, headers: headerObj, body });
  }

  return (
    <div className="space-y-4">
      {/* Method + URL + Send */}
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setShowBody(e.target.value !== "GET");
            }}
            className="h-9 appearance-none rounded-md border bg-dark-green/40 px-3 pr-8 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/api/users"
          className="flex-1 font-mono text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading} className="gap-2">
          <Send className="size-4" />
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="text-xs text-off-white/50 hover:text-off-white transition-colors"
        >
          Headers {headers.length > 0 && `(${headers.length})`}
        </button>
        <span className="text-off-white/50">|</span>
        <button
          onClick={() => setShowBody(!showBody)}
          className="text-xs text-off-white/50 hover:text-off-white transition-colors"
        >
          Body
        </button>
      </div>

      {/* Headers Editor */}
      {showHeaders && (
        <div className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-off-white/50">
              Headers
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                setHeaders([...headers, { key: "", value: "" }])
              }
            >
              <Plus className="size-3" /> Adicionar
            </Button>
          </div>
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Chave"
                value={h.key}
                onChange={(e) => {
                  const next = [...headers];
                  next[i].key = e.target.value;
                  setHeaders(next);
                }}
                className="flex-1 font-mono text-xs"
              />
              <Input
                placeholder="Valor"
                value={h.value}
                onChange={(e) => {
                  const next = [...headers];
                  next[i].value = e.target.value;
                  setHeaders(next);
                }}
                className="flex-1 font-mono text-xs"
              />
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setHeaders(headers.filter((_, j) => j !== i))}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Body Editor */}
      {showBody && (
        <div className="space-y-2 rounded-lg border p-3">
          <span className="text-xs font-medium text-off-white/50">
            Body (JSON)
          </span>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"nome": "Maria", "email": "maria@qa.com"}'
            className="min-h-[120px] font-mono text-xs"
          />
        </div>
      )}

      {/* Quick Endpoints */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-off-white/50">
          Endpoints disponiveis
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { m: "GET", p: "/api/users" },
            { m: "GET", p: "/api/users/1" },
            { m: "POST", p: "/api/users" },
            { m: "GET", p: "/api/products" },
            { m: "GET", p: "/api/products/1" },
            { m: "POST", p: "/api/orders" },
            { m: "GET", p: "/api/orders/1" },
            { m: "PUT", p: "/api/users/1" },
            { m: "DELETE", p: "/api/products/1" },
            { m: "GET", p: "/api/health" },
          ].map((ep) => (
            <button
              key={`${ep.m}-${ep.p}`}
              onClick={() => {
                setMethod(ep.m);
                setUrl(ep.p);
                setShowBody(ep.m !== "GET");
              }}
              className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs hover:bg-dark-green/40 transition-colors"
            >
              <Badge
                variant="secondary"
                className={`${METHOD_COLORS[ep.m]} px-1.5 py-0 text-[10px] font-mono`}
              >
                {ep.m}
              </Badge>
              <span className="font-mono text-off-white/50">{ep.p}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
