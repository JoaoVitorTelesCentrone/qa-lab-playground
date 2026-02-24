export interface ApiRequestOptions {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface ApiRequestResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  error?: string;
}

export async function sendRequest(
  options: ApiRequestOptions
): Promise<ApiRequestResult> {
  const start = performance.now();

  try {
    const fetchOptions: RequestInit = {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (options.body && options.method !== "GET" && options.method !== "HEAD") {
      fetchOptions.body = options.body;
    }

    const response = await fetch(options.url, fetchOptions);
    const duration = Math.round(performance.now() - start);

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let body = "";
    try {
      const text = await response.text();
      // Try to pretty-print JSON
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        body = text;
      }
    } catch {
      body = "[Sem corpo na resposta]";
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body,
      duration,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    return {
      status: 0,
      statusText: "Network Error",
      headers: {},
      body: "",
      duration,
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
}
