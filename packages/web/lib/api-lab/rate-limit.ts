type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const windowMs = 60_000;
const maxRequests = Number(process.env.QALAB_API_RATE_LIMIT_PER_MINUTE ?? 120);

function clientIp(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "local").trim();
}

export function checkApiRateLimit(request: Request) {
  const now = Date.now();
  const key = clientIp(request);
  const current = buckets.get(key);
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  buckets.set(key, bucket);

  for (const [bucketKey, value] of buckets) {
    if (value.resetAt <= now) buckets.delete(bucketKey);
  }

  return {
    allowed: bucket.count <= maxRequests,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function resetApiRateLimitForTests() {
  buckets.clear();
}
