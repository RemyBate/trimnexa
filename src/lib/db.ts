/**
 * Prisma client singleton for server-side usage only.
 * Do not import from static/prerendered pages without a server context.
 */
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

import { env } from '@/config/env';

const globalForPrisma = globalThis as typeof globalThis & {
	__trimnexaPrisma?: PrismaClient;
	__trimnexaPgPool?: pg.Pool;
};

function resolveDatabaseUrl(): string | undefined {
	return env.DATABASE_URL ?? process.env.DATABASE_URL;
}

function getConnectionString(): string {
	const connectionString = resolveDatabaseUrl();

	if (!connectionString) {
		throw new Error('DATABASE_URL is not set. Copy .env.example to .env and configure PostgreSQL.');
	}

	return connectionString;
}

function createPrismaClient(): PrismaClient {
	const pool =
		globalForPrisma.__trimnexaPgPool ??
		new pg.Pool({
			connectionString: getConnectionString(),
		});

	if (!globalForPrisma.__trimnexaPgPool) {
		globalForPrisma.__trimnexaPgPool = pool;
	}

	const adapter = new PrismaPg(pool);
	return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
	if (!globalForPrisma.__trimnexaPrisma) {
		globalForPrisma.__trimnexaPrisma = createPrismaClient();
	}

	return globalForPrisma.__trimnexaPrisma;
}

export const prisma = new Proxy({} as PrismaClient, {
	get(_target, property, receiver) {
		const client = getPrismaClient();
		const value = Reflect.get(client, property, receiver);
		return typeof value === 'function' ? value.bind(client) : value;
	},
});

export async function disconnectDb(): Promise<void> {
	await globalForPrisma.__trimnexaPrisma?.$disconnect();
	await globalForPrisma.__trimnexaPgPool?.end();
	globalForPrisma.__trimnexaPgPool = undefined;
	globalForPrisma.__trimnexaPrisma = undefined;
}

export function isDatabaseConfigured(): boolean {
	return Boolean(resolveDatabaseUrl());
}
