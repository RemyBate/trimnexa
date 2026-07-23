/**
 * Prisma client singleton for server-side usage only.
 * Do not import from static/prerendered pages without a server context.
 */
import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

import { env } from '@/config/env';
import { parseMysqlDatabaseUrl } from '@/lib/db-url';

const globalForPrisma = globalThis as typeof globalThis & {
	__trimnexaPrisma?: PrismaClient;
};

function resolveDatabaseUrl(): string | undefined {
	return env.DATABASE_URL ?? process.env.DATABASE_URL;
}

function getConnectionString(): string {
	const connectionString = resolveDatabaseUrl();

	if (!connectionString) {
		throw new Error('DATABASE_URL is not set. Copy .env.example to .env and configure MySQL.');
	}

	return connectionString;
}

function createPrismaClient(): PrismaClient {
	const adapter = new PrismaMariaDb(parseMysqlDatabaseUrl(getConnectionString()));
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
	globalForPrisma.__trimnexaPrisma = undefined;
}

export function isDatabaseConfigured(): boolean {
	return Boolean(resolveDatabaseUrl());
}
