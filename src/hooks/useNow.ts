import { useEffect, useState } from "react";

/**
 * Current time in ms, updated every `intervalMs` while `active` is true.
 * Returns null until the first client-side tick, so render output never
 * depends on the clock during prerendering.
 */
export function useNow(active: boolean, intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [active, intervalMs]);

  return now;
}
