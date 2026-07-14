import 'dotenv/config';

import { defineConfig } from 'prisma/config';

/**
 * Fallback URL allows `prisma generate` in CI without a live database.
 * Migrations and seed require a real DATABASE_URL in `.env`.
 */
const databaseUrl =
	process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/trimnexa';

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx prisma/seed.ts',
	},
	datasource: {
		url: databaseUrl,
	},
});
