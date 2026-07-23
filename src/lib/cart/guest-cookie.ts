import { randomBytes } from 'node:crypto';

import type { APIContext } from 'astro';

import { GUEST_CART_COOKIE, GUEST_CART_MAX_AGE_SECONDS } from '@/lib/cart/validation';
import { env } from '@/config/env';

export function createGuestCartToken(): string {
	return randomBytes(24).toString('hex');
}

export function readGuestCartToken(cookies: APIContext['cookies']): string | null {
	const token = cookies.get(GUEST_CART_COOKIE)?.value;
	if (!token || !/^[a-f0-9]{48}$/i.test(token)) {
		return null;
	}
	return token;
}

export function setGuestCartCookie(cookies: APIContext['cookies'], token: string): void {
	cookies.set(GUEST_CART_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: env.APP_ENV === 'production',
		maxAge: GUEST_CART_MAX_AGE_SECONDS,
	});
}

export function clearGuestCartCookie(cookies: APIContext['cookies']): void {
	cookies.delete(GUEST_CART_COOKIE, { path: '/' });
}
