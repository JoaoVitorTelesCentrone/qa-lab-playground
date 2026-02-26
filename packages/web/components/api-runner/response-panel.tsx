"use client";

import type { ApiRequestResult } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function statusColor(status: number): string {
  if (status === 0) return "bg-gray-500/20 text-gray-400";
  if (status < 300) return "bg-green-100 text-green-600";
  if (status < 400) return "bg-amber-100 text-amber-600";
  return "bg-red-100 text-red-600";
}

interface ResponsePanelProps {
  response: ApiRequestResult | null;
  history: { method: string; url: string; status: number; duration: number }[];
  onHistorySelect: (index: number) => void;
}

export function ResponsePanel({
  response,
  history,
  onHistorySelect,
}: ResponsePanelProps) {
  if (!response) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          Envie uma request para ver a resposta aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center gap-3">
        <Badge className={statusColor(response.status)}>
          {response.status || "ERR"} {response.statusText}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {response.duration}ms
        </span>
        {response.error && (
          <span className="text-xs text-red-600">{response.error}</span>
        )}
      </div>

      {/* Response Tabs */}
      <Tabs defaultValue="body" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">
            Headers ({Object.keys(response.headers).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="body">
          <pre className="max-h-[400px] overflow-auto rounded-lg border bg-secondary/50 p-4 font-mono text-xs leading-relaxed">
            {response.body || "[Sem corpo]"}
          </pre>
        </TabsContent>

        <TabsContent value="headers">
          <div className="max-h-[400px] overflow-auto rounded-lg border bg-secondary/50 p-4">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 py-1 font-mono text-xs">
                <span className="font-medium text-primary">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* History */}
      {history.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">
            Historico ({history.length})
          </span>
          <div className="max-h-[200px] space-y-1 overflow-y-auto">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => onHistorySelect(i)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-secondary transition-colors"
              >
                <Badge
                  className={`${statusColor(item.status)} px-1.5 py-0 text-[10px] font-mono`}
                >
                  {item.status || "ERR"}
                </Badge>
                <span className="font-mono text-muted-foreground">
                  {item.method}
                </span>
                <span className="flex-1 truncate text-left font-mono">
                  {item.url}
                </span>
                <span className="text-muted-foreground">{item.duration}ms</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
