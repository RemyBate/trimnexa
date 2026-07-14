/**
 * Prisma client singleton for server-side usage only.
 * Do not import from static/prerendered pages without a server context.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const globalForPrisma = globalThis as typeof globalThis & {
	__trimnexaPrisma?: PrismaClient;
	__trimnexaPgPool?: pg.Pool;
};

function getConnectionString(): string {
	const connectionString = process.env.DATABASE_URL;

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

export const prisma = globalForPrisma.__trimnexaPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.__trimnexaPrisma = prisma;
}

export async function disconnectDb(): Promise<void> {
	await prisma.$disconnect();
	await globalForPrisma.__trimnexaPgPool?.end();
	globalForPrisma.__trimnexaPgPool = undefined;
	globalForPrisma.__trimnexaPrisma = undefined;
}

export function isDatabaseConfigured(): boolean {
	return Boolean(process.env.DATABASE_URL);
}
