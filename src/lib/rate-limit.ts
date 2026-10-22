/**
 * Basic per-IP rate limit for quote submissions.
 *
 * Limits: this Map lives in one server instance's memory. On Vercel, requests
 * can land on different instances and instances are recycled, so this slows
 * down casual abuse but is not a guarantee. If spam becomes a problem, move
 * to Vercel Firewall rate-limiting rules or an Upstash Redis counter.
 */
const WINDOW_MS = 10 * 60 * 1000;
/** Generous because phone carriers put many customers behind one IP. */
const MAX_PER_WINDOW = 10;

const hits = new Map<string, number[]>();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** True if this IP has already used its allowance for the current window. */
export function isRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, recent);
  return recent.length >= MAX_PER_WINDOW;
}

/** Count an accepted submission. Rejected (invalid) requests are not counted. */
export function recordHit(ip: string, now = Date.now()) {
  const recent = hits.get(ip) ?? [];
  recent.push(now);
  hits.set(ip, recent);
  // Keep memory bounded on long-lived instances.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
}
