import { createConnection } from 'mariadb';
import { beforeAll, describe, expect, it } from 'vitest';

import { parseMysqlDatabaseUrl } from '@/lib/db-url';
import { prisma } from '@/lib/db';
import {
	ensureGuestCart,
	ensureUserCart,
	getCartById,
	mergeGuestCartIntoUser,
} from '@/lib/cart/service';
import { createGuestCartToken } from '@/lib/cart/guest-cookie';

const hasDatabase = await (async () => {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) return false;

	try {
		const options = parseMysqlDatabaseUrl(databaseUrl);
		const connection = await Promise.race([
			createConnection({
				host: options.host,
				port: options.port,
				user: options.user,
				password: options.password,
				database: options.database,
				connectTimeout: 2000,
			}),
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error('db_probe_timeout')), 2500),
			),
		]);

		try {
			await connection.query('SELECT 1');
			return true;
		} finally {
			await connection.end();
		}
	} catch {
		return false;
	}
})();

describe.skipIf(!hasDatabase)('guest cart merge (MySQL)', () => {
	const sellerEmail = 'seller@trimnexa.local';
	const adminEmail = 'admin@trimnexa.local';

	let productId = '';
	let stockQty = 0;
	let sellerUserId = '';
	let adminUserId = '';

	beforeAll(async () => {
		const product = await prisma.product.findUnique({
			where: { slug: 'bamboo-cutting-board' },
			select: { id: true, stockQty: true },
		});
		if (!product) {
			throw new Error('Seed product bamboo-cutting-board is required');
		}
		productId = product.id;
		stockQty = product.stockQty;

		const seller = await prisma.user.findUnique({ where: { email: sellerEmail } });
		const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
		if (!seller || !admin) {
			throw new Error('Seed users are required');
		}
		sellerUserId = seller.id;
		adminUserId = admin.id;
	});

	async function clearUserCart(userId: string): Promise<void> {
		const cartId = await ensureUserCart(userId);
		await prisma.cartItem.deleteMany({ where: { cartId } });
	}

	it('merges an empty guest cart without creating lines', async () => {
		await clearUserCart(sellerUserId);
		const token = createGuestCartToken();
		await ensureGuestCart(token);

		const result = await mergeGuestCartIntoUser(sellerUserId, token);
		expect(result.guestCartDeleted).toBe(true);
		expect(result.linesMerged).toBe(0);

		const cartId = await ensureUserCart(sellerUserId);
		const view = await getCartById(cartId, 'en');
		expect(view.itemCount).toBe(0);

		const leftover = await prisma.cart.findUnique({ where: { guestToken: token } });
		expect(leftover).toBeNull();
	});

	it('merges guest items into an empty customer cart', async () => {
		await clearUserCart(sellerUserId);
		const token = createGuestCartToken();
		const guestCartId = await ensureGuestCart(token);
		await prisma.cartItem.create({
			data: { cartId: guestCartId, productId, quantity: 2 },
		});

		const result = await mergeGuestCartIntoUser(sellerUserId, token);
		expect(result.linesMerged).toBe(1);
		expect(result.guestCartDeleted).toBe(true);

		const cartId = await ensureUserCart(sellerUserId);
		const view = await getCartById(cartId, 'en');
		expect(view.itemCount).toBe(2);
		expect(view.groups[0]?.items[0]?.productId).toBe(productId);

		const leftover = await prisma.cart.findUnique({ where: { guestToken: token } });
		expect(leftover).toBeNull();
	});

	it('combines quantities into an existing customer cart and caps at stock', async () => {
		await clearUserCart(adminUserId);
		const userCartId = await ensureUserCart(adminUserId);
		await prisma.cartItem.create({
			data: { cartId: userCartId, productId, quantity: Math.max(1, stockQty - 1) },
		});

		const token = createGuestCartToken();
		const guestCartId = await ensureGuestCart(token);
		await prisma.cartItem.create({
			data: { cartId: guestCartId, productId, quantity: 5 },
		});

		const result = await mergeGuestCartIntoUser(adminUserId, token);
		expect(result.linesMerged).toBe(1);
		expect(result.guestCartDeleted).toBe(true);

		const view = await getCartById(userCartId, 'en');
		expect(view.itemCount).toBe(stockQty);
		expect(view.groups[0]?.items[0]?.quantity).toBe(stockQty);
	});

	it('is idempotent when the guest cart was already merged', async () => {
		await clearUserCart(sellerUserId);
		const token = createGuestCartToken();
		const guestCartId = await ensureGuestCart(token);
		await prisma.cartItem.create({
			data: { cartId: guestCartId, productId, quantity: 1 },
		});

		await mergeGuestCartIntoUser(sellerUserId, token);
		const second = await mergeGuestCartIntoUser(sellerUserId, token);
		expect(second.merged).toBe(false);
		expect(second.guestCartDeleted).toBe(false);

		const cartId = await ensureUserCart(sellerUserId);
		const view = await getCartById(cartId, 'en');
		expect(view.itemCount).toBe(1);
	});

	it('preserves the guest cart when the customer profile is missing', async () => {
		const token = createGuestCartToken();
		const guestCartId = await ensureGuestCart(token);
		await prisma.cartItem.create({
			data: { cartId: guestCartId, productId, quantity: 1 },
		});

		await expect(mergeGuestCartIntoUser('missing-user-id', token)).rejects.toThrow(
			'profile_not_found',
		);

		const leftover = await prisma.cart.findUnique({
			where: { guestToken: token },
			include: { items: true },
		});
		expect(leftover?.items).toHaveLength(1);

		await prisma.cart.delete({ where: { id: guestCartId } });
	});

	it('does not allow one user to keep another user’s customer cart after merge', async () => {
		await clearUserCart(sellerUserId);
		await clearUserCart(adminUserId);

		const token = createGuestCartToken();
		const guestCartId = await ensureGuestCart(token);
		await prisma.cartItem.create({
			data: { cartId: guestCartId, productId, quantity: 1 },
		});

		await mergeGuestCartIntoUser(sellerUserId, token);

		const sellerCart = await getCartById(await ensureUserCart(sellerUserId), 'en');
		const adminCart = await getCartById(await ensureUserCart(adminUserId), 'en');
		expect(sellerCart.itemCount).toBe(1);
		expect(adminCart.itemCount).toBe(0);
	});
});
