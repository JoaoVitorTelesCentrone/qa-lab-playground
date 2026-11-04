"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const LOCAL_PROGRESS_EVENT = "qa:local-progress-change";

// Fallback em memória para navegadores que bloqueiam o localStorage. Mantém o
// progresso visível durante a sessão, como o comportamento anterior.
const fallback = new Map<string, string>();

function parseIds(raw: string | null) {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return new Set<string>();
    return new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" && /^[a-z0-9-]{1,80}$/.test(item),
      ),
    );
  } catch {
    return new Set<string>();
  }
}

function readSnapshot(storageKey: string) {
  const cached = fallback.get(storageKey);
  if (cached !== undefined) return cached;
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function writeSnapshot(storageKey: string, value: string) {
  fallback.set(storageKey, value);
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // O fallback em memória mantém o progresso nesta sessão.
  }
  window.dispatchEvent(new Event(LOCAL_PROGRESS_EVENT));
}

/**
 * Lê e atualiza o progresso local de uma trilha sem sincronizar estado dentro
 * de um efeito. O snapshot do servidor é vazio; após a hidratação o
 * useSyncExternalStore relê o localStorage sem causar mismatch de SSR.
 */
export function useLocalProgress(storageKey: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key !== storageKey) return;
        fallback.delete(storageKey);
        onStoreChange();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(LOCAL_PROGRESS_EVENT, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(LOCAL_PROGRESS_EVENT, onStoreChange);
      };
    },
    [storageKey],
  );

  const raw = useSyncExternalStore(
    subscribe,
    () => readSnapshot(storageKey),
    () => null,
  );
  const completed = useMemo(() => parseIds(raw), [raw]);

  const update = useCallback(
    (mutate: (next: Set<string>) => void) => {
      const next = new Set(completed);
      mutate(next);
      writeSnapshot(storageKey, JSON.stringify([...next]));
    },
    [completed, storageKey],
  );

  return [completed, update] as const;
}
