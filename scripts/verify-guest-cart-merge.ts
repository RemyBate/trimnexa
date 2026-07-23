/**
 * MySQL-backed guest-cart merge verification.
 * Uses one consistent origin: http://127.0.0.1:4321
 *
 * Usage (with Astro + MySQL already running):
 *   npx tsx scripts/verify-guest-cart-merge.ts
 */
import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

import { parseMysqlDatabaseUrl } from '../src/lib/db-url';

const BASE = process.env.VERIFY_BASE_URL ?? 'http://127.0.0.1:4321';
const ORIGIN = BASE;

class CookieJar {
	private cookies = new Map<string, string>();

	storeFromResponse(response: Response): void {
		const headers = response.headers as Headers & { getSetCookie?: () => string[] };
		const setCookies =
			typeof headers.getSetCookie === 'function'
				? headers.getSetCookie()
				: [response.headers.get('set-cookie')].filter(Boolean);

		for (const raw of setCookies) {
			if (!raw) continue;
			const pair = raw.split(';', 1)[0];
			const eq = pair.indexOf('=');
			if (eq <= 0) continue;
			this.cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
		}
	}

	header(): string {
		return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
	}

	has(name: string): boolean {
		return this.cookies.has(name);
	}

	get(name: string): string | undefined {
		return this.cookies.get(name);
	}

	delete(name: string): void {
		this.cookies.delete(name);
	}
}

async function request(
	jar: CookieJar,
	path: string,
	init: RequestInit = {},
): Promise<{ response: Response; bodyText: string; json: unknown }> {
	const headers = new Headers(init.headers);
	headers.set('Origin', ORIGIN);
	headers.set('Referer', `${ORIGIN}/en/`);
	const cookieHeader = jar.header();
	if (cookieHeader) {
		headers.set('Cookie', cookieHeader);
	}

	const response = await fetch(`${BASE}${path}`, {
		...init,
		headers,
		redirect: 'manual',
	});
	jar.storeFromResponse(response);
	const bodyText = await response.text();
	let json: unknown = null;
	try {
		json = bodyText ? JSON.parse(bodyText) : null;
	} catch {
		json = null;
	}
	return { response, bodyText, json };
}

function cartCount(json: unknown): number {
	return (json as { cart?: { itemCount?: number } })?.cart?.itemCount ?? 0;
}

function fail(message: string, details?: unknown): never {
	console.error('VERIFY_FAILED:', message);
	if (details !== undefined) {
		console.error(details);
	}
	process.exit(1);
}

async function main(): Promise<void> {
	if (!process.env.DATABASE_URL) {
		fail('DATABASE_URL is required');
	}

	const prisma = new PrismaClient({
		adapter: new PrismaMariaDb(parseMysqlDatabaseUrl(process.env.DATABASE_URL!)),
	});

	try {
		const product = await prisma.product.findUnique({
			where: { slug: 'bamboo-cutting-board' },
			select: { id: true, stockQty: true },
		});
		if (!product) {
			fail('Seed product bamboo-cutting-board missing');
		}

		const seller = await prisma.user.findUnique({
			where: { email: 'seller@trimnexa.local' },
			include: { customerProfile: true },
		});
		if (!seller?.customerProfile) {
			fail('Seller customer profile missing');
		}

		const existingSellerCart = await prisma.cart.findUnique({
			where: { customerProfileId: seller.customerProfile.id },
		});
		if (existingSellerCart) {
			await prisma.cartItem.deleteMany({ where: { cartId: existingSellerCart.id } });
		}

		const admin = await prisma.user.findUnique({
			where: { email: 'admin@trimnexa.local' },
			include: { customerProfile: true },
		});
		if (admin?.customerProfile) {
			const adminCart = await prisma.cart.findUnique({
				where: { customerProfileId: admin.customerProfile.id },
			});
			if (adminCart) {
				await prisma.cartItem.deleteMany({ where: { cartId: adminCart.id } });
			}
		}

		const jar = new CookieJar();
		const home = await request(jar, '/en/');
		if (!home.response.ok) {
			fail('Home page failed', { status: home.response.status, body: home.bodyText.slice(0, 300) });
		}

		const add = await request(jar, '/api/cart/items', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-trimnexa-locale': 'en' },
			body: JSON.stringify({ productId: product.id, quantity: 2 }),
		});
		if (add.response.status !== 201 && add.response.status !== 200) {
			fail('Guest add-to-cart failed', { status: add.response.status, body: add.bodyText });
		}
		if (!jar.has('trimnexa_guest_cart')) {
			fail('Guest cart cookie was not set after add-to-cart', { cookies: jar.header() });
		}

		const guestCart = await request(jar, '/api/cart');
		if (cartCount(guestCart.json) !== 2) {
			fail('Guest cart does not contain expected quantity', guestCart.json);
		}
		console.log('OK guest cart + cookie');

		const login = await request(jar, '/api/auth/sign-in/email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'seller@trimnexa.local', password: 'ChangeMe123!' }),
		});
		if (!login.response.ok) {
			fail('Login failed — merge cannot run without a session', {
				status: login.response.status,
				body: login.bodyText,
				origin: ORIGIN,
			});
		}
		console.log('OK login');

		const mergedEmpty = await request(jar, '/api/cart');
		if (!mergedEmpty.response.ok || cartCount(mergedEmpty.json) !== 2) {
			fail('Empty-customer-cart merge failed', {
				status: mergedEmpty.response.status,
				body: mergedEmpty.bodyText,
				json: mergedEmpty.json,
				guestCookie: jar.has('trimnexa_guest_cart'),
			});
		}
		console.log('OK empty-customer-cart merge itemCount=2');

		// Prepare existing customer qty=1, then merge guest qty=2 => 3
		await prisma.cartItem.updateMany({
			where: {
				cart: { customerProfileId: seller.customerProfile.id },
				productId: product.id,
			},
			data: { quantity: 1 },
		});

		const jar2 = new CookieJar();
		const guestAdd = await request(jar2, '/api/cart/items', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ productId: product.id, quantity: 2 }),
		});
		if (guestAdd.response.status !== 201 && guestAdd.response.status !== 200) {
			fail('Guest add for existing-cart case failed', guestAdd.bodyText);
		}
		const login2 = await request(jar2, '/api/auth/sign-in/email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'seller@trimnexa.local', password: 'ChangeMe123!' }),
		});
		if (!login2.response.ok) {
			fail('Login for existing-cart case failed', login2.bodyText);
		}
		const mergedExisting = await request(jar2, '/api/cart');
		if (!mergedExisting.response.ok || cartCount(mergedExisting.json) !== 3) {
			fail('Existing-customer-cart merge failed (expected 1+2=3)', mergedExisting.json);
		}
		console.log('OK existing-customer-cart merge itemCount=3');

		const again = await request(jar2, '/api/cart');
		if (cartCount(again.json) !== 3) {
			fail('Idempotent merge check failed', { before: 3, after: cartCount(again.json) });
		}
		console.log('OK idempotent merge');

		const enPage = await request(jar2, '/en/cart');
		const frPage = await request(jar2, '/fr/cart');
		if (!enPage.response.ok || !/bamboo/i.test(enPage.bodyText)) {
			fail('English cart page missing merged product', { status: enPage.response.status });
		}
		if (!frPage.response.ok) {
			fail('French cart page failed', { status: frPage.response.status });
		}
		console.log('OK cart pages EN/FR');

		await request(jar2, '/api/auth/sign-out', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: '{}',
		});

		const adminJar = new CookieJar();
		const adminLogin = await request(adminJar, '/api/auth/sign-in/email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'admin@trimnexa.local', password: 'ChangeMe123!' }),
		});
		if (!adminLogin.response.ok) {
			fail('Admin login failed', adminLogin.bodyText);
		}
		const adminCart = await request(adminJar, '/api/cart');
		if (cartCount(adminCart.json) !== 0) {
			fail('Admin unexpectedly received cart items', adminCart.json);
		}
		console.log('OK user isolation');

		console.log('GUEST_CART_MERGE_VERIFY_PASSED');
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	fail(error instanceof Error ? error.message : String(error));
});
