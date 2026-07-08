const claims = new Map<string, number[]>();

export function promotionClaimRateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const recent = (claims.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  claims.set(key, recent);
  return true;
}
