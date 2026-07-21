import { hashPassword } from 'better-auth/crypto';
import { describe, expect, it, beforeAll, beforeEach } from 'vitest';

import { auth } from '@/lib/auth';
import {
	getCapturedPasswordResetToken,
	clearCapturedPasswordResetTokens,
} from '@/lib/auth/password-reset-test-capture';
import { validatePasswordFields } from '@/lib/auth/validation';
import { clearCapturedEmails, getCapturedEmails } from '@/lib/email/outbox';
import { prisma } from '@/lib/db';
import pg from 'pg';

// This integration suite depends on a reachable PostgreSQL instance.
// If `DATABASE_URL` is set but the DB is unreachable/hangs, Prisma queries can exceed
// Vitest timeouts and fail the whole test run. We proactively probe the DB with a
// short timeout and skip when unavailable.
const hasDatabase = await (async () => {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) return false;

	const pool = new pg.Pool({
		connectionString: databaseUrl,
		connectionTimeoutMillis: 2000,
	});

	try {
		await Promise.race([
			pool.query('SELECT 1'),
			new Promise((_, reject) => setTimeout(() => reject(new Error('db_probe_timeout')), 2500)),
		]);
		return true;
	} catch {
		return false;
	} finally {
		await pool.end();
	}
})();

describe.skipIf(!hasDatabase)('password reset integration', () => {
	const buyerEmail = 'admin@trimnexa.local';
	const sellerEmail = 'seller@trimnexa.local';
	const originalPassword = 'ChangeMe123!';
	const newPassword = 'ResetPass456!';

	beforeAll(async () => {
		for (const email of [buyerEmail, sellerEmail]) {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				continue;
			}

			const passwordHash = await hashPassword(originalPassword);
			await prisma.account.updateMany({
				where: { userId: user.id, providerId: 'credential' },
				data: { password: passwordHash },
			});
		}
	});

	beforeEach(() => {
		clearCapturedEmails();
		clearCapturedPasswordResetTokens();
	});

	async function requestReset(email: string, locale: 'en' | 'fr' = 'en') {
		return auth.api.requestPasswordReset({
			body: {
				email,
				redirectTo: `http://localhost:4321/${locale}/auth/reset-password`,
			},
		});
	}

	async function signIn(email: string, password: string) {
		return auth.api.signInEmail({
			body: { email, password },
		});
	}

	it('registered buyer can request a reset and receives email', async () => {
		await requestReset(buyerEmail);

		expect(getCapturedEmails().length).toBe(1);
		expect(getCapturedEmails()[0]?.to).toBe(buyerEmail);
		expect(getCapturedPasswordResetToken(buyerEmail)).toBeTruthy();
	});

	it('registered seller can request a reset', async () => {
		await requestReset(sellerEmail);

		expect(getCapturedEmails()[0]?.to).toBe(sellerEmail);
		expect(getCapturedPasswordResetToken(sellerEmail)).toBeTruthy();
	});

	it('registered administrator can request a reset', async () => {
		await requestReset(buyerEmail);

		const roles = await prisma.userRoleAssignment.findMany({
			where: { user: { email: buyerEmail } },
		});

		expect(roles.some((role) => role.role === 'ADMINISTRATOR')).toBe(true);
		expect(getCapturedEmails().length).toBe(1);
	});

	it('unknown email receives the same generic API response without email', async () => {
		const response = await requestReset('unknown-user@trimnexa.local');

		expect(response).toBeTruthy();
		expect(getCapturedEmails().length).toBe(0);
	});

	it('valid token changes the password and old password stops working', async () => {
		await requestReset(buyerEmail);
		const token = getCapturedPasswordResetToken(buyerEmail);
		expect(token).toBeTruthy();

		await auth.api.resetPassword({
			body: {
				newPassword,
				token: token!,
			},
		});

		const newLogin = await signIn(buyerEmail, newPassword);
		expect(newLogin?.user?.email).toBe(buyerEmail);

		await expect(signIn(buyerEmail, originalPassword)).rejects.toThrow();

		const passwordHash = await hashPassword(originalPassword);
		await prisma.account.updateMany({
			where: { user: { email: buyerEmail }, providerId: 'credential' },
			data: { password: passwordHash },
		});
	});

	it('rejects expired tokens', async () => {
		const requestedAt = new Date();
		await requestReset(sellerEmail);
		const token = getCapturedPasswordResetToken(sellerEmail);
		expect(token).toBeTruthy();

		const verification = await prisma.verification.findFirst({
			where: { createdAt: { gte: requestedAt } },
			orderBy: { createdAt: 'desc' },
		});

		expect(verification).toBeTruthy();

		await prisma.verification.update({
			where: { id: verification!.id },
			data: { expiresAt: new Date(Date.now() - 60_000) },
		});

		await expect(
			auth.api.resetPassword({
				body: {
					newPassword: 'AnotherReset789!',
					token: token!,
				},
			}),
		).rejects.toThrow();
	});

	it('rejects reused tokens', async () => {
		await requestReset(sellerEmail);
		const token = getCapturedPasswordResetToken(sellerEmail);
		expect(token).toBeTruthy();

		await auth.api.resetPassword({
			body: {
				newPassword: 'ReuseTest789!',
				token: token!,
			},
		});

		await expect(
			auth.api.resetPassword({
				body: {
					newPassword: 'ReuseTest790!',
					token: token!,
				},
			}),
		).rejects.toThrow();

		const passwordHash = await hashPassword(originalPassword);
		await prisma.account.updateMany({
			where: { user: { email: sellerEmail }, providerId: 'credential' },
			data: { password: passwordHash },
		});
	});

	it('rejects malformed tokens', async () => {
		await expect(
			auth.api.resetPassword({
				body: {
					newPassword: 'BadToken789!',
					token: 'not-a-valid-token',
				},
			}),
		).rejects.toThrow();
	});

	it('preserves locale in reset email link', async () => {
		await prisma.user.update({
			where: { email: sellerEmail },
			data: { locale: 'fr' },
		});

		await requestReset(sellerEmail, 'fr');

		const email = getCapturedEmails()[0];
		expect(email?.text).toContain('/fr/auth/reset-password');

		await prisma.user.update({
			where: { email: sellerEmail },
			data: { locale: 'en' },
		});
	});

	it('rejects password confirmation mismatch in client validation', () => {
		const errors = validatePasswordFields('ValidPass1', 'DifferentPass1');
		expect(errors.confirmPassword).toBe('password_mismatch');
	});
});

describe('manual seller account investigation', () => {
	it.skipIf(!hasDatabase)('confirms remybatem@gmail.com seller linkage', async () => {
		const email = 'remybatem@gmail.com';
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				accounts: true,
				sellerProfile: true,
				roles: true,
			},
		});

		expect(user).toBeTruthy();
		expect(
			user?.accounts.some((account) => account.providerId === 'credential' && account.password),
		).toBe(true);
		expect(user?.sellerProfile?.status).toBe('APPROVED');
		expect(user?.sellerProfile?.shopName).toBe('Solibright Fashion');
		expect(user?.roles.some((role) => role.role === 'SELLER')).toBe(true);
	});
});
