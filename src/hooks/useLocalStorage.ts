import { useCallback, useMemo, useSyncExternalStore } from "react";

// Same-tab subscribers; the "storage" event covers other tabs.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // Storage can be blocked (private mode, disabled cookies).
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Hydration-safe localStorage state. `fallback` must be a stable value
 * (a module-level constant), since it is returned during SSR.
 */
export function useLocalStorage<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => null);
  const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

  const update = useCallback(
    (updater: (previous: T) => T) => {
      const next = updater(parse(readRaw(key), fallback));
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Ignore quota/blocked storage: this is a convenience only.
      }
      listeners.forEach((listener) => listener());
    },
    [key, fallback],
  );

  return [value, update] as const;
}
