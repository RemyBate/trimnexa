import { UserStatus } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { env } from '@/config/env';
import {
	buildLocalizedPasswordResetUrl,
	deliverPasswordResetEmail,
	PASSWORD_RESET_TOKEN_EXPIRES_SECONDS,
	recordPasswordResetCompleted,
} from '@/lib/auth/password-reset-email';
import { capturePasswordResetTokenForTests } from '@/lib/auth/password-reset-test-capture';
import { provisionMarketplaceUser } from '@/lib/auth/provision-user';
import { prisma } from '@/lib/db';

function resolveAuthSecret(): string {
	const secret = process.env.BETTER_AUTH_SECRET ?? env.AUTH_SECRET;

	if (secret) {
		return secret;
	}

	if (env.APP_ENV === 'production') {
		throw new Error('AUTH_SECRET or BETTER_AUTH_SECRET is required in production.');
	}

	return 'dev-only-insecure-secret-change-before-production';
}

function resolveAuthBaseUrl(): string {
	return process.env.BETTER_AUTH_URL ?? env.AUTH_URL ?? env.APP_URL;
}

/**
 * Better Auth validates Origin strictly. Local development commonly mixes
 * `localhost`, `127.0.0.1`, and `[::1]` for the same Astro server — cookies do
 * not cross those hosts, but API clients may send either Origin after a URL paste.
 * In non-production we trust all three loopback hosts on the configured port.
 */
function resolveTrustedOrigins(): string[] {
	const base = resolveAuthBaseUrl();
	const origins = new Set<string>([base]);

	if (env.APP_ENV !== 'production') {
		try {
			const url = new URL(base);
			const port = url.port || (url.protocol === 'https:' ? '443' : '80');
			const portSuffix = port === '80' || port === '443' ? '' : `:${port}`;
			for (const host of ['localhost', '127.0.0.1', '[::1]']) {
				origins.add(`${url.protocol}//${host}${portSuffix}`);
			}
		} catch {
			origins.add('http://localhost:4321');
			origins.add('http://127.0.0.1:4321');
			origins.add('http://[::1]:4321');
		}
	}

	const fromEnv = process.env.BETTER_AUTH_TRUSTED_ORIGINS;
	if (fromEnv) {
		for (const part of fromEnv.split(',')) {
			const trimmed = part.trim();
			if (trimmed) {
				origins.add(trimmed);
			}
		}
	}

	return [...origins];
}

export const auth = betterAuth({
	secret: resolveAuthSecret(),
	baseURL: resolveAuthBaseUrl(),
	trustedOrigins: resolveTrustedOrigins(),
	database: prismaAdapter(prisma, {
		provider: 'mysql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		resetPasswordTokenExpiresIn: PASSWORD_RESET_TOKEN_EXPIRES_SECONDS,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url: _url, token }, request) => {
			capturePasswordResetTokenForTests(user.email, token);

			const resetUrl = buildLocalizedPasswordResetUrl(
				(user as { locale?: string | null }).locale,
				token,
			);

			// Fire-and-forget to reduce timing side channels (Better Auth recommendation).
			void deliverPasswordResetEmail({
				userId: user.id,
				email: user.email,
				locale: (user as { locale?: string | null }).locale,
				resetUrl,
				request,
			}).catch((error) => {
				console.error('[auth] password reset email delivery failed', error);
			});
		},
		onPasswordReset: async ({ user }, request) => {
			await recordPasswordResetCompleted(user.id, request);
		},
	},
	user: {
		additionalFields: {
			firstName: {
				type: 'string',
				required: false,
				input: true,
			},
			lastName: {
				type: 'string',
				required: false,
				input: true,
			},
			locale: {
				type: 'string',
				required: false,
				defaultValue: 'en',
				input: true,
			},
			phone: {
				type: 'string',
				required: false,
				input: true,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await provisionMarketplaceUser(user.id);
				},
			},
		},
		session: {
			create: {
				before: async (session) => {
					const user = await prisma.user.findUnique({
						where: { id: session.userId },
						select: { status: true },
					});

					if (user?.status === UserStatus.SUSPENDED) {
						throw new Error('ACCOUNT_SUSPENDED');
					}
				},
			},
		},
	},
});

export type AuthSession = typeof auth.$Infer.Session;
