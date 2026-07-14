import { UserStatus } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { env } from '@/config/env';
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

export const auth = betterAuth({
	secret: resolveAuthSecret(),
	baseURL: resolveAuthBaseUrl(),
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
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
