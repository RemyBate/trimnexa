interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
	allowed: boolean;
	retryAfterSeconds: number;
}

/**
 * Simple in-memory rate limiter for development and single-instance deployments.
 * Replace with Redis or edge rate limiting before production scale (Phase 18).
 */
export function checkRateLimit(
	key: string,
	limit: number,
	windowMs: number,
	now = Date.now(),
): RateLimitResult {
	const existing = buckets.get(key);

	if (!existing || existing.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, retryAfterSeconds: 0 };
	}

	if (existing.count >= limit) {
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
		};
	}

	existing.count += 1;
	return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
	const forwarded = request.headers.get('x-forwarded-for');

	if (forwarded) {
		return forwarded.split(',')[0]?.trim() ?? 'unknown';
	}

	return request.headers.get('x-real-ip') ?? 'unknown';
}
